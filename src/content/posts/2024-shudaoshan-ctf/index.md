---
title: '2024 蜀道山 CTF Writeup'
description: '文件末尾隐藏 ZIP'
pubDate: 2024-11-20
author: 'IHK-1'
tags: ['CTF', '蜀道山', '2024']
---

# MISC
## 元素战争
```python
from pwn import *

conn = remote("gz.imxbt.cn",20968)
print(conn.recv().decode())
print(conn.recv().decode())

while True:
    conn.sendline(str(randint(1,5)).encode())
    print(conn.recv().decode())
```

## Summit 马铃薯（×）
文件末尾隐藏 ZIP

xlsx 中 media 中有一个 Zenith.png

对 key.bin 分析 为蔚蓝的 地图

实在没有蔚蓝，故卡住

## javaPcap

分析流量以及 jar 包，发现仅仅为简单的加解密，且 key 明文 密文 都是明文传输

其中 blowfish 部分的 使用 cyberchef 解密不开，需要写脚本

```python
from Crypto.Cipher import Blowfish
from base64 import b64decode
import struct

def decrypt_blowfish(key, encrypted_content):
    key_size = 16
    key_bytes = key.encode('utf-8')[:key_size]
    key_bytes = key_bytes.ljust(key_size, b'\0')

    cipher = Blowfish.new(key_bytes, Blowfish.MODE_ECB)

    encrypted_bytes = b64decode(encrypted_content)
    decrypted_bytes = cipher.decrypt(encrypted_bytes)

    pad_len = decrypted_bytes[-1]
    decrypted_bytes = decrypted_bytes[:-pad_len]

    return decrypted_bytes.decode('utf-8')

key = "596d467a5a54593049475a73595763765a6d78685a793536615841"
encrypted_content = "bCvVthlhq6kihQdSBv2WzUZfeSGvRMigmsAMsdEtYOKW577HPZqinI5hlkRNE33xwgwWyWseoI8oERTQEnfoRXc5dJAWtwF+CTkmcoeeu5ccy7Qjp/cJA2Slj/UJDC6UWgvagkU3OYuFIELSc1x6etggbESl2Ug0dwUk3hO/xpYGxgQPCXnzciXSTCmlCq5Wr2EPXNG3wE/+NCpeHDe2WTbyPylOunr7/NWFy+flv0plvq29HzGo7lx4clpnEBKhWV91U7S+Fm5PUy69Aer4mC64NUcNf7m9jKcKeMvQQv5OPU5L6OayrJuh8eBPRjenb1A+JKZGYQK3j7xyNJ30r1F20E+EyZNM/JWcPImyXdh/aebRvlqWH99FoIJZhRhh2lbA6ZXXNwKxx0tZI5IFyH6m5DaUGKe/NN0rZbLCNFZoW93VEPiYwoM94R9uEolHvKjIQlP8qDStic5oXH/UoA=="

try:
    decrypted_content = decrypt_blowfish(key, encrypted_content)
    print("Decrypted content:", decrypted_content)
except Exception as e:
    print("Decryption error:", str(e))

```

```plain
>> whoami
root

>> ls -al
total 5492
drwx------ 18 root root    4096 Nov  6 15:26 ..
drwxr-xr-x  3 root root    4096 Nov  4 17:22 .
drwxr-xr-x  2 root root    4096 Nov  4 17:22 flag
-rw-r--r--  1 root root 5610013 Nov  4 16:28 SimpleHttpServer.jar

>> ls flag/
flag.zip
hint.txt

>> base64 flag/flag.zip
UEsDBBQACQAIABSGZFkAAAAAAAAAACsAAAAIACkAZmxhZy50eHRVVAkABWiKKGeQGitndXgLAAEE
AAAAAAQAAAAAeGwJAAcUAwAAAADtgXBFs0Lb8F43+KxCxq77A+Zya0CyhPRERubzgNwf5fF5GVjt
ntPQZe8hy0s4qLAhBXW42FAs5Xhw4lBLBwiHHE6JOQAAACsAAABQSwECFAMUAAkACAAUhmRZhxxO
iTkAAAArAAAACAAcAAAAAAAAAAAA7YEAAAAAZmxhZy50eHRVVAkABWiKKGeQGitndXgLAAEEAAAA
AAQAAAAAUEsFBgAAAAABAAEAUgAAAJgAAAAAAA==

>> cat flag/hint.txt
密码为执行命令（按照时间排序）的首字母的组合重复三次，比如执行了（id,whoami），那么密码就为iwiwiw

wllbcwllbcwllbc
```

## 神奇的硬币纺纱机
```python
from pwn import *

conn = remote("gz.imxbt.cn",20973)
print(conn.recv().decode())
print(conn.recv().decode())

while True:
    conn.sendline(str(randint(0,1)).encode())
    print(conn.recv().decode())
```

# WEB
## my_site
文件说明是使用 Python 开发的 web 网站，首先对网站进行扫描，发现开启了 console

其中它的 host 使用 127.0.0.1 进入

返回原来页面查看是否存在 SSTI 或者任意文件读取

写不出来，后面搜了 WP 比赛的时候给了源码

```python
from flask import Flask, abort, render_template_string, request, render_template, redirect, url_for, session, flash, g
from utils import rot13, key
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['DATABASE'] = 'database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(app.config['DATABASE'])
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/rot13', methods=['GET', 'POST'])
def rot13_route():
    if request.method == 'POST':
        action = request.form['action']
        text = request.form['text']
        
        if action == 'encrypt':
            encrypted_text = rot13(text)
            return redirect(url_for('rot13_result', result=encrypted_text, action='encrypt'))
    
        
        elif action == 'decrypt':
            text = request.form['text']
            decrypted_text = rot13(text)
            if key(decrypted_text):
                template = '<h1>Your decrypted text is: {{%s}}</h1>' % decrypted_text
                try:
                    render_template_string(template)
                except Exception as e:
                    abort(404)
                # return "既然你是黑阔，那我凭什么给你回显"
                return redirect(url_for('rot13_result', result="既然你是黑阔，那我凭什么给你回显", action='decrypt'))

            else:
                return redirect(url_for('rot13_result', result=decrypted_text, action='decrypt'))
                template = '<h1>Your decrypted text is: %s</h1>' % decrypted_text
                return render_template_string(template)
    
    return render_template('index.html')

@app.route('/rot13_result/<action>/<result>')
def rot13_result(action, result):
    return render_template('rot13_result.html', action=action, result=result)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        if user:
            session['username'] = username
            return redirect(url_for('message_board'))
        else:
            flash('Invalid username or password')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            db.commit()
            flash('Registration successful! Please log in.')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('Username already exists!')
    return render_template('register.html')

@app.route('/message_board', methods=['GET', 'POST'])
def message_board():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    db = get_db()
    cursor = db.cursor()
    
    if request.method == 'POST':
        message = request.form['message']
        cursor.execute("INSERT INTO messages (username, message) VALUES (?, ?)", (session['username'], message))
        db.commit()
    
    cursor.execute("SELECT username, message FROM messages")
    messages = cursor.fetchall()
    
    return render_template('message_board.html', messages=messages)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

存在 SSTI

那个 key 平台没给，大致是触发 key 触发渲染，然后 SSTI 内存马

## 奶龙牌WAF
phpinfo 可以使用 /. 进行绕过

对于内容部分

他的写入文件逻辑并不是将 file_contents 的内容写入本地，所以可以使用超过 5000 个字符绕过  file_contents 截取的内容即可，或者使用 100万次溯回进行绕过

写入成功，一句话连接即可

## 恶意代码检测器（复现）

服务器为 apache，对服务器进行扫描

发现源码泄露，对代码进行审计

发现只是单纯 replace 了一些字符，然后进行了 require_once 日志

无论是否被检测，都会执行 require_once 执行代码

thinkphp ${   } 模板 可以执行命令

使用 

```plain
${system}
>> 检测到危险代码: ${system}！！！

${1}
>> <title>系统发生错误</title>
```

说明需要绕过 WAF 就可以进行命令执行，那么需要绕过进行命令执行，uasort() 可以命令执行，那么构造

```plain
${uasort(array,myfunction)}
array = getallheaders
myfunction = system
```

##  海关检测
无法复现

当代码无法找出漏洞的时候，应该怀疑是否是中间件问题

