---
title: '2023 WMCTF Writeup'
description: '文件中有lsass.DMP ，使用 mimikatz 进行提取用户密码'
pubDate: 2023-10-20
author: 'IHK-1'
tags: ['CTF', 'WMCTF', '2023']
---

# MISC
## oversharing

文件中有lsass.DMP ，使用 mimikatz 进行提取用户密码

导出 lsass.DMP 修改文件名为 lsass.dmp 并使用 mimikatz x64 载入

```plain
sekurlsa::minidump lsass.dmp
sekurlsa::logonpasswords full
```

获得 ssh 的用户名与密码 

```plain
* Domain   : ssh@192.168.20.202:22/randark
* Password : 1a05cf83-e450-4fbf-a2a8-b9fd2bd37d4e

cat flag
WMCTF{9f1690f4-7b41-429f-a243-505997079997}
```

## Fantastic terminal
非预期解，在 out.warms 中读取flag

```plain
WMCTF{fanta3t1c_term1nal_1n_the_c0nta1ner_1n_the_br0w3er}
```

## Fantastic terminal Rev
此题修复了之前的可以直接从 out.warms 读取flag

```plain
docker build -t wmctf . 
docker run -it wmctf 
```

启动终端后

```plain
cd challenge
base64 challenge

因为要获取challenge这个文件，但是直接cat字符编码是错误的，最好是将源文件可以完整保存下来

f0VMRgIBAQAAAAAAAAAAAAMAPgABAAAAYBEAAAAAAABAAAAAAAAAAEAxAAAAAAAAAAAAAE
...
...
AAAAAAAAAAAAAAAAAA==
```

base64 解码后将 challenge 在IDA中进行反编译

动态调试获得flag

```plain
WMCTF{r3venge_terminal_after_fuck1ng_paatchhhhhhhhhhhhh}
```

# STEG
## EZ_V1dio
下载得到 avi 音频，尝试分离每一帧

```plain
import cv2
import os

if not os.path.exists('frames'):
    os.makedirs('frames')

video = cv2.VideoCapture('./flag.avi')
frame_count = 0
while True:
    ret, frame = video.read()
    if not ret:
        break
    filename = f'frames/frame_{frame_count}.jpg'
    cv2.imwrite(filename, frame)
    frame_count += 1

video.release()
```

在第一帧的R0通道看到 W 字符

分离每一帧的R0通道

```plain
import cv2
import os

if not os.path.exists('R0'):
    os.makedirs('R0')

video = cv2.VideoCapture('./flag.avi')

frame_count = 0
while True:
    ret, frame = video.read()
    if not ret:
        break
    r_channel = frame[:, :, 2]  # OpenCV默认通道顺序为BGR，索引2为R通道
    r_lowest_bit = r_channel & 1
    r_lowest_bit <<= 7
    filename = f'R0/frame_{frame_count}.jpg'
    cv2.imwrite(filename, r_lowest_bit)
    frame_count += 1

video.release()
```

```plain
去除重复后得到
WMCTF{5b658ab9-946c-3869-fc21-6ad99b3bc714}
```

