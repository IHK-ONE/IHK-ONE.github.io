---
title: '2025 能源行业赛 Writeup'
description: '提取所有的 recv 字节'
pubDate: 2025-03-15
author: 'IHK-1'
tags: ['CTF', '能源行业赛', '2025']
---

# MISC
## upload
文件上传，直接导出

## ds1
```python
import pandas as pd
from io import StringIO

data = open(r"accounts.csv").read()

df = pd.read_csv(StringIO(data))
df['CreatedAt'] = pd.to_datetime(df['CreatedAt'])
df['LastUsedAt'] = pd.to_datetime(df['LastUsedAt'], errors='coerce')  # 最后登入时间
df['ExpiryDate'] = pd.to_datetime(df['ExpiryDate'])  # 超期时间
active_accounts = df[df['Status'] == 'Active']  # 状态

expired_active_accounts = active_accounts[active_accounts['ExpiryDate'] < active_accounts['LastUsedAt']]

print("flag{" + str(len(expired_active_accounts)) + "}")
```

## ds2
```python
import pandas as pd
import hashlib

df = pd.read_excel('data.xlsx', engine='openpyxl')

mismatch_a = 0
mismatch_b = 0

for _, row in df.iterrows():
    a_val = str(row['A列'])
    b_val = str(row['B列'])
    a_expected = row['A列校验和']
    b_expected = row['B列校验和']

    a_calc = hashlib.sha256(a_val.encode('utf-8')).hexdigest()
    b_calc = hashlib.md5(b_val.encode('utf-8')).hexdigest()

    if a_calc != a_expected:
        mismatch_a += 1
    if b_calc != b_expected:
        mismatch_b += 1

output = f"A列-{mismatch_a};B列-{mismatch_b};"
print(hashlib.md5(answer.encode('utf-8')).hexdigest())
```

## 蓝牙

提取所有的 recv 字节

```bash
tshark -r 'Bluetooth.pcapng' -T fields -e btl2cap.payload -Y btl2cap.payload > out.txt
```

其中变化字节为 [-4:-2]，结合 wireshark 报错，分析流量尾部，提示 quaternary

对数据进行提取，清晰，并四进制解码

```python
out = ""
for line in open(r"out.txt").readlines():
    line = line.strip()

    if len(line) == 34:
        data = line[-3]
        if data == "0":
            out += " "
        else:
            if data == "1":
                out += "0"
            elif data == "2":
                out += "1"
            elif data == "4":
                out += "2"
            elif data == "8":
                out += "3"
flag = ''
for _ in out.split(' '):
    if _:
        flag += _[0]

for i in range(0,len(flag),4):
    print(chr(int(flag[i:i+4],4)),end="")
```

## cloack

有个删除文件，进行文件恢复，拿到音频，使用 SSTV 画图，拿到压缩包密码 z@Wa1uDu0

得到 data.txt 很明显 UUID 的特征

推测 3,3 为何为 _ 

推测为类似 TFT-LCD 晶体管显示屏

完整代码如下，也可以使用小海龟画图，可自行尝试：

```python
dict = {
    "0":"3,3,6,6,6,6,9,9,0,0,0,0",
    "1":"7,1,6,6,6,6,9,3,3",
    "2":"3,3,6,6,9,9,6,6,3,3",
    "3":"3,3,6,6,9,9,3,3,6,6,9,9",
    "4":"7,7,7,3,3,3,9,0,0,0,6,6,6,6,6",
    "5":"6,3,3,9,9,6,3,3,6,6,9,9",
    "6":"3,3,9,9,6,6,6,6,3,3,0,0,9,9",
    "7":"3,3,6,6,6,6",
    "8":"3,3,6,6,6,6,9,9,0,0,0,0,6,6,3,3",
    "9":"3,3,6,6,6,6,0,0,9,9,0,0",
    "a":"1,2,3,4,5,6,6,6,6,6,6,3,9,9,9,10,11,0,1,2,3,3",
    "b":"6,6,6,6,6,0,0,1,2,3,4,5,6,7,8,9,10,11,0",
    "c":"10,9,8,7,6,5,4,3,2",
    "e":"3,3,3,3,11,10,9,8,7,6,5,4,3,2,1",
    "f":"3,3,3,3,9,9,6,6,6,0,0,0,0,1,1,5,5",
    "g":"3,3,6,6,6,6,7,9,11,5,3,1,0,0,9,9,0,0",
    "l":"6,6,6,6,4,3,2",
    "{":"8,7,6,8,4,6,5,4",
    "}":"4,5,6,4,8,6,7,8",
    "-":"3,3"
}

reverse_dict = {v: k for k, v in dict.items()}

flag = ""
for line in open('data.txt').readlines():
    line = line.strip()
    if line in reverse_dict:
        flag += reverse_dict[line]

print(flag)
```

