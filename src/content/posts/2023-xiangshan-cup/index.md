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

```plain
base32解码
base64解码 码表 sUvcu5rgSeAmJQCfdXtEMKIB91Lj3niOo4hyV0b/2azpx8HqZP6wk7GNlTFYDR+W
base64解码
```

得到图片

```plain
# npiet 运行图片即可
npiet.exe "C:\Users\HK\Desktop\download.png"
flag{4b6c1737-27e5-41c4-95e3-f70ad196063e}
```

