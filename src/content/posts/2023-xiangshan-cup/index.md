---
title: '2023 香山杯 PINTU Writeup'
description: '2023 香山杯 PINTU 赛题 Writeup。'
pubDate: 2023-10-10
author: 'IHK-1'
tags: ['CTF', '香山杯', '2023']
---

# MISC PINTU
```python
from Crypto.Util.number import *
from PIL import Image
import os


path = r".\pintu"
file_list = os.listdir(path)
size_list = []

bin_data = "" # 获取二进制
for i in range(1, 4704):
    im_path = path + f"\{i}.png"
    im = Image.open(im_path)

    size = im.size
    size_list.append(size[1])

    pixel = im.getpixel((0, 0))
    if pixel == (0, 0, 0):
        bin_data += "0"
    else:
        bin_data += "1"

print("BIN_DATA:", bin_data) # 打印二进制
int_data = int(bin_data,2) # 解码二进制
print("INT_DATA:",int_data)
print("DATA_OUT:",long_to_bytes(int_data).decode())
print("\n")

size_data = "" 
for i in range(len(size_list)):
    size_data += chr(int(str(size_list[i]), 8)) # 将高度size由10进制转为8进制
print("SIZE_DATA:", size_data)

data = size_data.split(" ")
data_out = ""
for i in range(len(data)):
    data_out += chr(int(data[i])) # 打印高度隐写信息
print("DATA_OUT:", data_out)

```

<!-- 这是一张图片，ocr 内容为：D:/ENVIRONNENT/PYTHON)PYENANSB\PYTHON.EXE C:\USERSIHK(PESKTOP\HISC-PYTHON\PINTU-REEG-PY 小型轿车车辆 111818111811181118111811181118181818181818181811 -对了.1 "没想呈吧,我是反射疼."好笑,有没有感觉一哆唯,大后更清咪了.".". 进程已结束,退出代码0 -->


<!-- 这是一张图片，ocr 内容为：TT ? DOWNLOAD CYBERCHEF OPTIONS A ABOUT/ LAST BUILD:AYEAR AGO /SUPPORT 生活动务热线 RECIPE OPERATIONS INPUT FROM BASE64 FROM BASE64 A-Z-7- FORK REMOVE NON-ALPHABET CHARS TS2ER3TNFZENTSIANGSIANZSCXERSZUMEZTRRBOUNBRZRRNAZCLURBKEANCTDRZINCTDRZINRZINRZIMRAUMFMEIDNDLFONMJFGN7 XHERRENBIUZZPDDDXUCSSROIZLUSDIMBUSNZOFOSNZZOFDRERNDUBRERERBRERBXERBXERBXERBRUZTROMIUZTRNZZUESNZIUESNI FROM BASE64 ALPHABET UBR3325RSCRNSNBRBRABRISURZEBMLLNNTSANDESTAOERISURRISURRISURRISURTROU3URRZNIF SUVCU5RGSEAMJQCFDXTEMKIB91LJ3NI0O4HYV0B... DATA FORMAT FU2TCGNMTSYRV04YUKOLL STRICT MODE REMOVE NON-ALPHABET CHARS ENCRYPTION/ENCODING PUBLIE KEY ARITHMETIC/LOGIC A-ZA-20-9+/ TINC: LENGTH: OUTPUT NETWORKING .PING STRICT MODE REMOVE NON-ALPHABET CHARS HATE................  99,99,9月,99999999 DATE/TIME A..LCTI#JHOXS.N/J*A..20,.....QUS.1AA0,. -->


```plain
base32解码
base64解码 码表 sUvcu5rgSeAmJQCfdXtEMKIB91Lj3niOo4hyV0b/2azpx8HqZP6wk7GNlTFYDR+W
base64解码
```

得到图片

<!-- 这是一张图片，ocr 内容为： -->


```plain
# npiet 运行图片即可
npiet.exe "C:\Users\HK\Desktop\download.png"
flag{4b6c1737-27e5-41c4-95e3-f70ad196063e}
```

<!-- 这是一张图片，ocr 内容为：X WINDOWS POWERSHELL WINDOWS POWERSHELL 版权所有(C) MICROSOFT CORATION.保留所有权利. 安装最新的 POWERSHELL,了解新功能和改进!HTTPS://AKA.MS/PSWINDOWS PS F:MSSC)系统(NPIET-I,33-WIN3Z- F;/MISZ)积塑(NPLET-7,33-1,33-33-NIN3Z\NPIET-8XE ":3NG CYGWIN WARNING: MS-DOS STYLE PATH DETECTED: C:\USERS\HK\DESKTOP\DOWNLOAD.PNG PREFERRED POSIX EQUIVALENT IS: /CYGDRIVE/C/USERS/HK/DESKTOP/DOWNLOAD.PNG CYGWIN ENVIRONMENT VARIABLE OPTION "NODOSFILEWARNING" TURNS OFF THIS WARNING- CONSULT THE USER'S GUIDE FOR MORE DETAILS ABOUT POSIX PATHS; HTTP://CYGWIN.COM/CYGWIN-UG-NET/USING.HTML#USING-PATHNAMES FLAG{4B6C1737-27E5-41C4-95E3-F70AD196063E} PS F:\MISC\杂类\NPIET-1.3A-WIN32> -->


