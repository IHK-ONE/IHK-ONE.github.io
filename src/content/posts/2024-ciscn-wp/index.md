---
title: '2024 第十七届 CISCN 全国大学生信安赛 Writeup'
description: '配置 MetaMask 后集齐 7 种食材，兑换NFT即可拿到 flag'
pubDate: 2024-05-19
author: 'IHK-1'
tags: ['CTF', 'CISCN', '2024']
---

# MISC
## 火锅观光链打卡
配置 MetaMask 后集齐 7 种食材，兑换NFT即可拿到 flag

## Power Trajectory Diagram
查看数据

```python
import numpy as np
import matplotlib.pyplot as plt

data = np.load(r"C:\Users\HK\Desktop\attachment.npz")
plt.imshow(data['trace'])

plt.savefig('depthmap.jpg')
plt.show()
```

发现载入 npz 后，发现 input 字符为520个，流也有 520 个，相当于爆破每一个字符

读取每一支流，当一段区间字符读取到时读取下一个区间

```python
import matplotlib.pyplot as plt
import numpy as np

data = np.load(r"C:\Users\HK\Desktop\attachment.npz")
index = data['index']  # 520
input = data['input']  # 520
trace = data['trace'] * 1024

password = '' 
tmp = 0 # 初始区间
for i in range(len(trace)): # 尝试每个流
    data = trace[i]
    for j in range(len(data)):
        if data[j] < -250: # 当正确时会输出 波谷会下降 -170 ~ -512 一段时间，该流的字符为正确字符

            if j > tmp:
                password += input[i]
                tmp = j # 进入下一个区间
            break

print(password)
# a_ciscn_2024a
```

```plain
对照 载入数据的 值进行修改，第一个字符没有完全延时，正确长度为12，即 _ciscn_2024a，最后一个流需要手动尝试尝试的得到 _ciscn_2024a_
```

## 神秘文件
```plain
1./docProps/app.xml
  Bifid cipher
  QFCfpPQ6ZymuM3gq
  lanjing
  > Bifid:UGFydDE6ZmxhZ3tl
  > base64: Part1:flag{e
  
2./ppt/embeddings/Microsoft_Word_Document.docx
  mQPinNS6Xtm1JGJs
  offset:10
  > ROT 10: cGFydDI6Njc1ZWZi
  > base64: part2:675efb

3.olevba
  i13POMdzEAzHfy4dGS+vUA==
  > RC4: PArt3:3-34

4.PPT3
  UGF5dDQ6NmYtNDA==
  > base64: Payt4:6f-40

5./ppt/notesSlides
  Vm1wR1UxRXhXWGhUV0d4WFlrZG9WMWxVUm1GWFJscHlWMjVrVmxKc2NIaFZiVFZQVkd4S2MxSnFVbGRXTTFKUVdWVmtVMDVyTVVWaGVqQTk=
  > base64: pArt5:5f-90d

6./ppt/media
  UGFyVDY6ZC0y
  > base64: ParT6:d-2

7./ppt/slides/slide4.xml
  HRSFIQp9ZwWvZj==
  ROT13
  > ROT13: UEFSVDc9MjJiMw==
  > base64: PART7=22b3
  
8.ppt/slideLayouts/slideLayout2.xml
  c1GFSbd3Dg6BODbdl
  > remove-all: cGFSdDg6ODdl
  > base64: paRt8:87e

9.ppt\media\image57.jpg
  cGFyVDk6ZGVl
  > base64: parT9:dee

10./ppt/comments/comment1.xml
  ZYWJbIYnFhq9
  furry
  > Vigenere: ZYWJbIYnFhq9
  > base64: PARt10:9}

> flag{e675efb3-346f-405f-90dd-222b387edee9}
```

## Tough_DNS
dns.qry.name && frame.len == 145

```plain
tshark.exe -r Tough_DNS.pcapng -T fields -e dns.qry.name -Y 'frame.len == 145' > out.txt
```

```plain
15f9792dba5c
```

dns.txt && dns.id == 0x4500 拿到压缩包，并使用 15f9792dba5c 解压得到 secret.pgp

```plain
tshark.exe -r Tough_DNS.pcapng -T fields -e dns.txt -Y 'dns.id == 0x4500' > out.txt
```

dns.txt && dns.id == 0x6421 

```plain
tshark.exe -r Tough_DNS.pcapng -T fields -e dns.txt -Y 'dns.id == 0x6421' > out.txt
```

题目描述：

```plain
56 16 26 93 66 53 16 56 d2 03 26 93 56
> reverse: 65 39 62 30 2d 65 61 35 66 39 62 61 65
> from hex: e9b0-ea5f9bae
> reverse: eab9f5ae-0b9e
```

--import 导入 secret.gpg，输入密码后 --decrypt 6421 流的密文，即可拿到 flag

## 通风机
搜索得知为 西门子 PLC 文件，安装 STEP7-Micro 即可

创建一个 mwp 文件

对比 吹风机文件 需要修补 GJK 入文件头，修复后运行

在用户自定义中存在 flag

```plain
ZmxhZ3syNDY3Y2UyNi1mZmY5LTQwMDgtOGQ1NS0xN2RmODNlY2JmYzJ9
> base64: flag{2467ce26-fff9-4008-8d55-17df83ecbfc2}
```

## 盗版软件
3842.dmp 文件：

用户在 /ctf/download  目录中下载了 prcocexe.exe 文件对比可知为 hacexe.exe 文件

```plain
AXIOM 中分析历史记录，用户在 winhack.com 下载盗版文件: 
http://winhack.com/ProcessKO 6.31 中文绿色版免费下载(进程管理工具)-哇哦菌
```

```plain
获得域名: winhack.com
```

hackexe.exe:

运行文件文件释放 output.png 与 loader.exe

output 存在 LSB 隐写，将 R 通道勾选后生成 ，发现 zip 头文件，但是相隔一个字符

```python
import struct

data = open(r"C:\Users\HK\Desktop\out",'rb').read()
out1 = b''
out2 = b''

for i in range(0, len(data), 2):
    out1 += struct.pack('B', data[i])
    out2 += struct.pack('B', data[i + 1])

with open(r"C:\Users\HK\Desktop\out1", 'wb') as f:
    f.write(out1)

with open(r"C:\Users\HK\Desktop\out2", 'wb') as f:
    f.write(out2)
```

分离出压缩包后包含 .b 文件

```plain
r()J$nEA'r!!#;^5u:HM1"'W(Mc*q[<_/-H(eBQ_+@m$P8kMf4a[h>1:e3=VX?9p=!\>H[_9!-P!Q!d_;F+/NMc([U69Id>ct7iR(^gBUKlR.n!/lA`!!!!iKtqeC8-.(6Mb"[QMa/CV!RTk-8H6e+1!)_>1l+['ejqO2X?j\E%7($238erL9ERs6#Xpc$FkBeaMa/OZ!RPFEM[W-EMa/7R!RO,j"Gf?G6!.Ga!ROtQ6!-EU6!?g3ll\Sls57!F=^"@S''W'hs8Q@r^3=WR?SaG;!'sXWM<7?[m%=@Z!(i%/8\>*)+T!Ns8F&Q@8VuM%M=EmC9Qqfgs4'f"l=^2!!!$.f\g`/F!<:Sa$:.up:e`[d9ejFSs1h0^_FX^B8;Y/K]'9g`i;_=uM8s?B6!-g;i^eq%6+WJ\FCG4"Ktqd;8cR(Yjlhm.!!#QBlju^Ei_;/LC'6h)8;[..\cUR+?iSZ/p],bC8;"i'?A\Aj5XAOd!"],16!-[7njkLW6+U0o;s"&08;Y5UM8r=Fa[q?Y8;Z%kM>9HK!nkY%s4)bs!.?7t6!%3&!'gMa6!.k%>!]_-0+Tc:eQ5m>\ohmb@K4kLs3Bjks8W*i!Q.GW`^kgWFgOI7k?)I!=hET4.LJIugAf\
```

进行 base85 解码，发现在传输时会被判定 为病毒

放入安恒云沙箱运行，判定病毒

```plain
获得C2地址: 39.100.72.235
```

```plain
得到flag: 
> flag{md5(winhack.com39.100.72.235)}
> flag{096e8b0f9daf10869f013c1b7efda3fd}
```

