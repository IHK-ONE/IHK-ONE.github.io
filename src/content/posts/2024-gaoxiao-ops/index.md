---
title: '2024 高校运维赛 Writeup'
description: 'GIF 拆分 字符拼接'
pubDate: 2024-06-15
author: 'IHK-1'
tags: ['CTF', '高校运维赛', '2024']
---

# MISC
## 签到
GIF 拆分 字符拼接

```plain
synt{guvf-vf-gur-fvtava-dhvm}

ROT13:
flag{this-is-the-signin-quiz}
```

## 钓鱼邮件

```plain
ZmxhZ3tXZUxDb21lVG99
> base64:
flag{WeLComeTo}
```

```plain
flag{PhishHuntiNG}
```

邮件内容中不含有其他信息了，只有 DKIM 还包含信息

搜索 DKIM eml ，github中有手动验证教程：[https://github.com/kmille/dkim-verify](https://github.com/kmille/dkim-verify)

根据教程中获取 PublicKey 方法，构造 

```plain
{}._domainkey.{}.".format(selector, domain)
即：
default._domainkey.foobar-edu-cn.com

dig txt +short default._domainkey.foobar-edu-cn.com dig访问获得 flag_part2=_Kn0wH0wt0_
```

访问 DNS 服务器

```plain
dig txt +short foobar-edu-cn.com
hint: Find and concatenate all three parts to obtain the complete flag3.
```

其中 eml信息中包含 dmarc ，搜索得知也是一个 DNS 服务 
```plain
dig txt +short _dmarc.foobar-edu-cn.com
flag_part3=ANAlys1sDNS}
```

结合 hint 推测 三个flag都在DNS上，且都与 eml 验证有关，查询得知还有一种 spf 机制

```plain
dig txt +short spf.foobar-edu-cn.com
flag_part1={N0wY0u
```

```plain
拼接得到flag
{N0wY0u_Kn0wH0wt0_ANAlys1sDNS}
```

## easyshell

不能直接使用 base64 解码解出，流量经过了 AES 加密，需要爆破密钥

对 shell 流量依次排查 

多此解码得到 压缩包

得到的明文 Hello, but what you're looking for isn't me. 压缩后与secret中 secret2.txt的 crc32 相同，多次尝试压缩软件，使用7z构造的压缩包可以进行明文攻击

```plain
bkcrack -C flag.zip -c secret2.txt -P secret2.zip  -p secret2.txt
> key: e0c271a4 cbd76d08 8d707128

bkcrack -C flag.zip -k e0c271a4 cbd76d08 8d707128 -U out.zip 123456
> 修改压缩包密码后，secret1.txt 得到 flag
```

## gateway
根据题目信息需要获取密码

```plain
目录 "html_src/cgi-bin/baseinfoSet.json" 中包含 "baseinfoSet_USERPASSWORD"

"106&112&101&107&127&101&104&49&57&56&53&56&54&56&49&51&51&105&56&103&106&49&56&50&56&103&102&56&52&101&104&102&105&53&101&53&102&129&",

> replace
106 112 101 107 127 101 104 49 57 56 53 56 54 56 49 51 51 105 56 103 106 49 56 50 56 103 102 56 52 101 104 102 105 53 101 53 102 129 

> from decimal
jpek.eh1985868133i8gj1828gf84ehfi5e5f.

> rot22
flag.ad1985868133e8cf1828cb84adbe5a5b.
```

## f or r
```plain
SJTUCTF WP: https://github.com/BeaCox/myBlog/tree/ebb8b6694ca7d9d998dcfdd703137240a5da25f9/posts/sjtuctf-2024-wp
```

## secret DB

数据库中内容起始位置为 42 且在 16进制下，该表区块包含其他信息，其中每隔多位取值构成的表长42，且只含 flag{} + hex字符，符合uuid结构，尝试以 0x01 0x0f 作为分割，发现 hex 字符总在 分割内容第二位，且第一位数值总不相等，脚本：

```python
data = open('secret.db', 'rb').read().split(b'\x01\x0f')
dict = {}

for tmp in data:
    dict[tmp[0]] = tmp[1]

out = ''
for i in range(42): # 1
    try:
        out += chr(dict[i])
    except:
        out += '?'

print(out)
#  ?ag{f62 1bf0-923c-4ba6-?2d7-ffabba4e8f0b}
```

输出结果缺失几位，进行手动排查，将 '9' 补入

```plain
flag{f6291bf0-923c-4ba6-?2d7-ffabba4e8f0b}
```

爆破缺失位置，输入9时，提交成功

```plain
flag{f6291bf0-923c-4ba6-92d7-ffabba4e8f0b}
```

