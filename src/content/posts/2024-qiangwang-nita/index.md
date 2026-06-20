---
title: '2024 强网拟态 Writeup'
description: '导出 TCP 流得到一个压缩包'
pubDate: 2024-12-10
author: 'IHK-1'
tags: ['CTF', '强网拟态', '2024']
---

# MISC
## ezflag
导出 TCP 流得到一个压缩包

确定为 png 修改后缀拿到 flag

## pvz
需要算金币在计算 md5，直接生成一个字典进行爆破

```python
import hashlib

with open('passwordlist.txt', 'a') as f:
    for i in range(10000):
        md5 = str(hashlib.md5(str(i).encode()).hexdigest())
        f.write(md5 + '\n')
```

修复以及补全二维码，使用支付宝或微信扫码（部分工具可能扫不出）

对于 M41b0lg3 推断为 malbolge ，对 malbolge code 进行运行得到 flag

## Streaming
参考文章 [https://blog.csdn.net/water1209/article/details/127927245](https://blog.csdn.net/water1209/article/details/127927245)

对 ？？ 流进行 xor ff 以及 aes 解密 拿到 压缩包

下载得到两个文件，对于 badapple ，是 idot png，github 搜索项目目前有三个项目，但是前两个运行不成功 ，只有第三个 [https://github.com/GGN-2015/macos_shadow_tank](https://github.com/GGN-2015/macos_shadow_tank) 成功分离出了 flag2

对于s4cret，特征 fty 推测为 mp4，进行 00 补充字节，文件后缀名修改 mp4

```python
import cv2
from PIL import Image

video = cv2.VideoCapture('s4cret.mp4')
output = ''

while True:
    ret, img_src = video.read()
    if not ret: break
    img_src = Image.fromarray(img_src)
    pixel = img_src.getpixel((0,0))
    if pixel == (255,255,255):
        output += "0"
    else:
        output += "1"

print(output)
```

二进制解码拿到 flag3

