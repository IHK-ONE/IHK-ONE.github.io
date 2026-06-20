---
title: 'Nullcon HackIM CTF Goa 2025 Writeup'
description: '直接分析这里发现可以进行 sql 注入'
pubDate: 2025-02-01
author: 'IHK-1'
tags: ['CTF', 'Nullcon', 'HackIM', '国际赛', '2025']
---

# WEB
## Paginator
```php
<?php
ini_set("error_reporting", 0);
ini_set("display_errors",0);

if(isset($_GET['source'])) {
    highlight_file(__FILE__);
}

include "flag.php";

$db = new SQLite3('/tmp/db.db');
try {
  $db->exec("CREATE TABLE pages (id INTEGER PRIMARY KEY, title TEXT UNIQUE, content TEXT)");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Flag', '" . base64_encode($FLAG) . "')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 1', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 2', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 3', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 4', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 5', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 6', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 7', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 8', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 9', 'This is not a flag, but just a boring page.')");
  $db->exec("INSERT INTO pages (title, content) VALUES ('Page 10', 'This is not a flag, but just a boring page.')");
} catch(Exception $e) {
  //var_dump($e);
}

if(isset($_GET['p']) && str_contains($_GET['p'], ",")) {
  [$min, $max] = explode(",",$_GET['p']);
  if(intval($min) <= 1 ) {
    die("This post is not accessible...");
  }
  try {
    $q = "SELECT * FROM pages WHERE id >= $min AND id <= $max";
    $result = $db->query($q);
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
      echo $row['title'] . " (ID=". $row['id'] . ") has content: \"" . $row['content'] . "\"<br>";
    }
  }catch(Exception $e) {
    echo "Try harder!";
  }
} else {
    echo "Try harder!";
}
?>

<html>
    <head>
        <title>Paginator</title>
    </head>
    <body>
        <h1>Paginator</h1>
        <a href="/?p=2,10">Show me pages 2-10</a>
        <p>To view the source code, <a href="/?source">click here.</a>
    </body>
</html>
```

直接分析这里发现可以进行 sql 注入

```php
$q = "SELECT * FROM pages WHERE id >= $min AND id <= $max";
```

整数型注入，直接 or 1=1 --+ 拿到 flag

## Paginator v2
相比 v1 推测为 load_file ，但是多次查询都没办法，但是访问 flag.php ，看到有建 flag 表

直接进行联立查询，拿到 flag

## Numberizer
```php
<?php
ini_set("error_reporting", 0);

if(isset($_GET['source'])) {
    highlight_file(__FILE__);
}

include "flag.php";

$MAX_NUMS = 5;

if(isset($_POST['numbers']) && is_array($_POST['numbers'])) {

    $numbers = array();
    $sum = 0;
    for($i = 0; $i < $MAX_NUMS; $i++) {
        if(!isset($_POST['numbers'][$i]) || strlen($_POST['numbers'][$i])>4 || !is_numeric($_POST['numbers'][$i])) {
            continue;
        }
        $the_number = intval($_POST['numbers'][$i]);
        if($the_number < 0) {
            continue;
        }
        $numbers[] = $the_number;
    }
    $sum = intval(array_sum($numbers));

    if($sum < 0) {
        echo "You win a flag: $FLAG";
    } else {
        echo "You win nothing with number $sum ! :-(";
    }
}
?>

<html>
    <head>
        <title>Numberizer</title>
    </head>
    <body>
        <h1>Numberizer</h1>
        <form action="/" method="post">
            <label for="numbers">Give me at most 10 numbers to sum!</label><br>
            <?php
            for($i = 0; $i < $MAX_NUMS; $i++) {
                echo '<input type="text" name="numbers[]"><br>';
            }
            ?>
            <button type="submit">Submit</button>
        </form>
        <p>To view the source code, <a href="/?source">click here.</a>
    </body>
</html>
```

发现必须每个数都大于0，且总和不大于0，尝试溢出，那么四位数能被 intval 解析，且能足够大，那么使用科学计数法， 9e99 直接构造溢出

## Bfail
F12 看到有个提示，访问 /source 访问源代码

```python
from flask import Flask, request, redirect, render_template_string
import sys
import os
import bcrypt
import urllib.parse

app = Flask(__name__)
app.secret_key = os.urandom(16);
# This is super strong! The password was generated quite securely. Here are the first 70 bytes, since you won't be able to brute-force the rest anyway...
# >>> strongpw = bcrypt.hashpw(os.urandom(128),bcrypt.gensalt())
# >>> strongpw[:71]
# b'\xec\x9f\xe0a\x978\xfc\xb6:T\xe2\xa0\xc9<\x9e\x1a\xa5\xfao\xb2\x15\x86\xe5$\x86Z\x1a\xd4\xca#\x15\xd2x\xa0\x0e0\xca\xbc\x89T\xc5V6\xf1\xa4\xa8S\x8a%I\xd8gI\x15\xe9\xe7$M\x15\xdc@\xa9\xa1@\x9c\xeee\xe0\xe0\xf76'
app.ADMIN_PW_HASH = b'$2b$12$8bMrI6D9TMYXeMv8pq8RjemsZg.HekhkQUqLymBic/cRhiKRa3YPK'
FLAG = open("flag.txt").read();

@app.route('/source')
def source():
    return open(__file__).read()

@app.route('/', methods=["GET"])
def index():

    username = request.form.get("username", None)
    password = request.form.get("password", None)

    if username and password:

        username = urllib.parse.unquote_to_bytes(username)
        password = urllib.parse.unquote_to_bytes(password)

        if username != b"admin":
            return "Wrong user!"

        if len(password) > 128:
            return "Password too long!"

        if not bcrypt.checkpw(password, app.ADMIN_PW_HASH):
            return "Wrong password!"

        return f"""Congrats! It appears you have successfully bf'ed the password. Here is your {FLAG}"""
    
    # Use f-string formatting within the template string
    template_string = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bfail</title>
    </head>
    <body>
        <h1>Login to get my secret, but 'B'-ware of the strong password!</h1>
        <form action="/" method="post">
            <label for="username">Username:</label>
            <input type="text" name="username"  placeholder="admin">
            <br>
            <label for="password">Password:</label>
            <input type="password" name="password">
            <br>
            <button type="submit">Login</button>
        </form>
    <!-- See my <a href="/source">Source</a> -->
    </body>
    </html>
    """

    return render_template_string(template_string)

if __name__ == '__main__':
   app.run(debug=False, host="0.0.0.0", port="8080", threaded=True)

```

修改表头可以进行传参

使用 hash 扩展攻击

## Graphp（逆向过程较为麻烦）
## Temptation（无法查看源代码）
## Sess.io
```php
<?php
  define("ALPHA", str_split("abcdefghijklmnopqrstuvwxyz0123456789_-"));
ini_set("error_reporting", 0);

if(isset($_GET['source'])) {
  highlight_file(__FILE__);
}

include "flag.php"; // $FLAG
$SEEDS = str_split($FLAG, 4);

function session_id_secure($id) {
  global $SEEDS;
  mt_srand(intval(bin2hex($SEEDS[md5($id)[0] % (count($SEEDS))]),16));
  $id = "";
  for($i=0;$i<1000;$i++) {
    $id .= ALPHA[mt_rand(0,count(ALPHA)-1)];
  }
  return $id;
}

if(isset($_POST['username']) && isset($_POST['password'])) {
  session_id(session_id_secure($_POST['username'] . $_POST['password']));
  session_start();
  echo "Thank you for signing up!";
}else {
  echo "Please provide the necessary data!";
}
?>

<html>
  <head>
    <title>Sess.io</title>
  </head>
  <body>
    <h1>Sess.io</h1>
    <h2>Sign up</h2>
    <form action="/" method="post">
      <label for="username">Username:</label><br>
      <input type="text" name="username"><br>

      <label for="password">Password:</label><br>
      <input type="text" name="password"><br>

      <button type="submit">Submit</button>
    </form>
    <p>To view the source code, <a href="/?source">click here.</a>
  </body>
</html>
```

伪随机数，需要逆向

```php
<?php

define("ALPHA", str_split("abcdefghijklmnopqrstuvwxyz0123456789_-"));
$md5_dict = array();

$wordlist = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}!@_";
foreach ($wordlist as $char1) {
    foreach ($wordlist as $char2) {
        foreach ($wordlist as $char3) {
            foreach ($wordlist as $char4) {
                mt_srand(intval(bin2hex($char1 . $char2 . $char3 . $char4 . "\n"),16));
                $id = "";
                for($i=0;$i<1000;$i++) {
                    $id .= ALPHA[mt_rand(0,count(ALPHA)-1)];
                }
                $md5_dict[$char1 . $char2 . $char3 . $char4 . $id] = md5($id);
            }
        }
    }
}
```

生成所有的四字符可能性，然后根据输入字符串的md5值进行确定多段 flag 的顺序

