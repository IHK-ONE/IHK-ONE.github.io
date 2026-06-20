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
<!-- 这是一张图片，ocr 内容为：文性( 统计(S) 挪家旧)视图 QQ文明晶 口 R 区分大小马 OPTIONG 25 LENGTH 789 53.293669 2 REVD EGNNECTION GRIENTED GHANNE RENOTE O 791 53.801161 52 RCVD CONNECTION ORIENTED CHANREI L2CAP 795 53.966594 L2CAP 797 54 871233      538 L2CAP  RENOTE () L2CAP 80154.828669 706 2CAP 7  RENOTE FENGTS 15 55.301170 819 55.436171 RENOTE 52 RCVD CONNECTION ORIENTED CHANNEL RENOTE 52.BEVD COOBOOCELON  OOT COR  CAAND 52 RCVD CONNECTION ORLENTED CHANNEL L2CAP S REVD CONTACTION ORTOG CHANNEE L2CAP L2CAP 845 56.583143 52 RCVD CONNECTION ORIENTED CHANNEL L2CAP RENOTE 845 56:885394 52 REVD CONNECTION ORIENTED CHENNEL REMOTE 5,RCVD CANNECTION ORIENTED CHANNEL SAO SH AO1104 二品品 USBURB BLUETOOTH . BIUETOATH TATAP PROTACOI BLUETOOTH.PEAPNG 分组:2100 -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1744863195988-437e78ec-4ef8-41bd-8806-37c7cffd0688.png)

提取所有的 recv 字节

```bash
tshark -r 'Bluetooth.pcapng' -T fields -e btl2cap.payload -Y btl2cap.payload > out.txt
```

<!-- 这是一张图片，ocr 内容为：A101828ECC81947086870000000000000 A2030F0000000FF00EB A2030F00000000FF00EB A101828ECC81947D868700000000000200 A101828ECC81947D86870000000000200 A101828ECC81947D868700000000000200 A101828ECC81947D86870000000000000 A101828ECC81947D86870000000000000 81947D86870000000000000 A101828ECC819 A101828ECC81947D868700000000000400 A101828ECC81947D868700000000000400 A101828ECC81947D86870000000000400 A101828ECC81947D868700000000000000 A101828ECC81947D868700000000000000 A101828ECC81947D86870000000000000 A101828ECC81947D868700000000000200 A101828ECC81947D868700000000000200 A101828ECC81947D868700000000000200 A101828ECC819470868700000000000000 A101828ECC81947D86870000000000000 A101828ECC81947D86870000000000000 A101828ECC81947D868700000000000400 A101828ECC81947D868700000000000400 A101828ECC81947D868700000000000400 A101828ECC81947D86870000000000000 -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1744863268010-286a33da-a6fd-4255-a195-5c50c90c381e.png)

其中变化字节为 [-4:-2]，结合 wireshark 报错，分析流量尾部，提示 quaternary

<!-- 这是一张图片，ocr 内容为：010 EDITOR -C\USERS\HK\DESKTOP\BLUETOOTH.PCAPNG 文件()   搜索(S) 视图W)       搜索(S)视图W 脚本() 调试(D)项目(D)工具D 窗口W)帮助 帮助(H) MOY HEX 工作区 起始页 BLUETOOTH.PCAPNG X ALARM CLOCK. 0 1 2 3 4 5 6 7 8 9 A B C D E F 0123456789ABCDEF 文件 路径 9381 00 82 03 00 00 00 00 00 3C 00 00 00 06 00 00 00 打开的文件 .2... ECE)0 9382 3C 00 00 00 00 00 00 18 32 06 06 00 45 9C 29 D6 9383 18 00 00 00 18 00 00 18 00 A0 75 75 72 EF 03 E5 ALARM CLOCK.VMDK C:\USER...ESKTOP\ URI.A 9384 FF FF 00 00 01 CO 09 00 01 02 00 01 00 82 03 004 BLUETOOTH.PCAPNG C:\USER...ESKTOP\ 9385 00 00 00 00 3C 00 00 00 71 75 61 74 65 72 6E 61 QUATERNA 项目 9386 72 79 RY 收藏的文件 最近的文件 脚工作区 曲项目 资源管理器 X 模板结果-PCAPNG.BT 检查器 名称 类型 值 SHB[O] SEC IDB[1] INTE 二进制 01110001 EPB[2] 有符号字节 ENP 113 EPB[3] 113 ENT 无符号字节 EPB[41 ENI 检查器 可视化 变量 输出 模板执行成功. 模板执行成功. 进程 FOV反汇编器 垂输出 直方图 比较 多文件中查找 校验和 查找结果 呢插入 位置:150152[24A88H] 值:11371H 大小:150,162 十六进制(H)ANSI小端 -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1744863372853-28b62109-cc25-4f75-87a5-634e7d1a5430.png)

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
<!-- 这是一张图片，ocr 内容为：R-STUDIO TECHNICIAN 9.3.191230-文件视图 驱动器(D) 文件(E)  文件(D) 文件(E) 文件(E) 文件(E) 工具( )帮助(H) 查看(V) STOP 停止(S) 置找/标记(F) 查找上一个(P) 查找下一个(N) 恢复标记的(M) 重新打开所有文件(R) 预览(P) 选项(0) 上(U) 文件掩码(M) 恢复(R) VMDK 设备视图 PARTITIONL PARTITION1-C/USERS/HK/DESKTOP/ALARM CLOCK.VMDK 名称 ROOT $RECYCLE.BIN $RECYCLE.BIN < SLARM DOCK.WAV PARRITIONI/ROORSRECYCLE-BINIS-138165276527652765-743860169:3-1003-1003/SRXIFYMWVAYL 元文件 M ALARM.CLOCK.ZIP -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1744865945588-82fcbbeb-3fca-4243-9f2f-f87a88ed5f71.png)

有个删除文件，进行文件恢复，拿到音频，使用 SSTV 画图，拿到压缩包密码 z@Wa1uDu0

<!-- 这是一张图片，ocr 内容为：RECEIVE TRANSMIT GALLERY SSTV DRM AUTO SLANT AUTOSAVE SENSITIVITY NORMAL MODE AUTO DEFAULT LMAGE FORMAT PNG SAVE IF COMPLETE(%)25 LOG QSO CALL: RECEIVING ROBOT 36 8 PWD:Z@WALUDUO MAX DB AVG RANGE -25 0.90 35 PTT CWID SAVED://ROOT/QSSTV/R NO RIG WF ID WF TEXT BSR -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1744865972850-a29207ac-311e-4034-b7ab-4e6e1c9a9e78.png)

得到 data.txt 很明显 UUID 的特征

<!-- 这是一张图片，ocr 内容为：8,3,3,3,9,9,6,6,6,0,0,0,1,1,5,5 5,6,6,6,4,3,2 1,2,3,4,5,6,6,6,6,6,6,3,9,9,9,10,11,0,1,2,3,3,3 8,3,6,6,6,6,7,9,11,5,3,1,0,0,9,9,0,0 8,7,6,8,4,6,5,4 5,3,3,9,9,6,3,3,6,6,9,9,9 3,3,6,6,6,6,9,9,0,0,0,0,6,6,3,3 3,3,6,6,6,6 3,3,6,6,6,6,0,0,9,9,0,0 3,3,6,6,6,6,9,9,0,0,0,0 7,1,6,6,6,6,9,3,3 3,3,9,9,6,6,6,6,3,3,0,0,9,9,9 10.9,8,7,6,5,4,3,2 3.3 3,3,6,6,9,9,9,3,6,6,9,9,9 3,3,6,6,6,6,9,9,0,0,0,0 7,1,6,6,6,6,9,3,3 6,6,6,6,6,0,0,1,2,3,4,5,6,7,8,9,11,0 3,3 7,7,7,3,3,3,9,0,0,0,6,6,6,6,6 3,3,6,6,6,6,9,9,0,0,0,0,6,6,3,3,3 7,7,7,3,3,3,9,0,0,0,6,6,6,6,6 3,3,6,6,6,6,9,9,0,0,0,0 3.3 3.3.6.6.6.09.0.0 -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1744866104552-0725cd25-a157-403a-bfb9-80a597898d15.png)

推测 3,3 为何为 _ 

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1744866177840-cefa4b69-8d89-419b-a77b-992eb94d3ba4.png)

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

