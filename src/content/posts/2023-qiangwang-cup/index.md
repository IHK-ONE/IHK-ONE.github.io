---
title: '第七届强网杯 Writeup'
description: '第七届强网杯全国网络安全挑战赛 Writeup。'
pubDate: 2023-12-17
author: 'IHK-1'
tags: ['CTF', '强网杯', '2023']
---

# MISC
## ez_fuzz
```python
from pwn import *

import string

conn = remote("101.200.122.251", 12177)
key = "?????????"
word_list = string.printable

for i in range(len(key)):
    for word in word_list:
        key = key[:i] + word + key[i + 1:]

        recv = conn.recv().decode()
        conn.sendline(key.encode())
        recv = conn.recv().decode()

        try:
            result = re.search(r'Here is your code coverage: (\d*)', recv).group(1)
        except:
            print(recv)
            exit()

        if result[i] == '1':
            print('key:', key)
            break

# key:00qwbGood
# flag:qwb{YouKnowHowToFuzz!}
```

## 谍影重重
```python
import hashlib
import pyModeS as pms
import pyshark

pcap = pyshark.FileCapture(r"C:\Users\HK\Desktop\attach.pcapng", tshark_path=r"F:\WEB\Wireshark\tshark.exe")
info_list = {}

for cap in pcap:
    if int(cap.length) == 67:
        data = ''.join(cap.tcp.segment_data.split(':'))[18:]

        check = pms.typecode(data)
        if check >= 19 and check <= 22:
            icao = pms.adsb.icao(data)
            data = pms.adsb.velocity(data)
            info_list[icao] = data[0]

print(info_list)
print(hashlib.md5('79a05e'.upper().encode()).hexdigest())
```

# 强网先锋
## 你能找到PNG吗
```plain
# 搜索key
strings 找到PNG了吗.png | grep 'key'

# do_not_care
RC4 加密 PNG 头 > 0e 3c b4 2f

# dump出镜像中该部分区块，进行RC4 解密
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1702806112037-36fd58db-8796-4449-82fc-2d8ab14e1ac8.png)

```plain
flag{It's_So_Hard_To_Find_A_Picture}
```

