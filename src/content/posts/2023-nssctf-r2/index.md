---
title: '2023 NSSCTF Round#2 MISC Writeup'
description: '代码逻辑错误，打印了 target ，只需要输入 target 即可打印 flag'
pubDate: 2023-11-10
author: 'IHK-1'
tags: ['CTF', 'NSSCTF', 'MISC', '2023']
---

## gift in qrcode

代码逻辑错误，打印了 target ，只需要输入 target 即可打印 flag

## gift_in_qrcode(revenge)

此处随机生成 1~255 的数字，可以直接以固定值去碰撞，概率为 1/255

```plain
from pwn import *

count = 0
while True:
    conn = remote("node6.anna.nssctf.cn", 28229)
    conn.recvline().decode()
    conn.recvline().decode()
    conn.recv().decode()

    conn.sendline(str('110').encode())

    count += 1
    print('count:', count)

    output = conn.recvline().decode()
    if 'No no no!' not in output:
        print(output)
        break
```

## Magic Docker

## New Terminal

