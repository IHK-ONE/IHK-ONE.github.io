---
title: '2024 梧杯 CTF Writeup'
description: '使用 flag 解压压缩包后拿到 docx并在 / 目录下拿到 img.zip 在 /media 下发现 image1.png'
pubDate: 2024-07-05
author: 'IHK-1'
tags: ['CTF', '梧杯', '2024']
---

【不值得复现】

# 原神启动
0通道 flag

```plain
WuCup{7c16e21c-31c2-439e-a814-bba2ca54101a}
```

使用 flag 解压压缩包后拿到 docx并在 / 目录下拿到 img.zip 在 /media 下发现 image1.png

```plain
WuCup{6bb9d97d-7169-434b-a7cf-0ee0b6fdfa30}
```

为 img.zip 的密钥，其中还需要进一步解压文件，继续翻找在 document.xml 中拿到 flag

```plain
WuCup{f848566c-3fb6-4bfd-805a-d9e102511784}
```

解压拿到

```plain
旅行者你好，当你来到这里的时候证明本题的路途已经结束了，但你的旅途还在继续，加油 祝你前程似锦，不要忘记旅途的初衷
WuCup{0e49b776-b732-4242-b91c-8c513a1f12ce}
```

# 旋转木马
```python
import base64
import binascii

data = open('flag1').read() + open('flag2').read()

while True:
    try:
        data = base64.b64decode(data)
    except:
        print(binascii.unhexlify(data))
        break

# WuCup{1eb900c0-a786-42fa-942c-f9a7c21dfedf}
```

# AT
在音频末尾拿到一个 压缩包，进行替换且摩斯解密拿到 链接

垃圾题目，略

```python
import zipfile
import re

'''
zipf = zipfile.ZipFile('out.zip')
file_list = {}

for file in zipf.namelist():
    file = file.encode('cp437').decode('gbk')
    if len(file.split('/')[1]):
        num,string = re.search(r'download_url/(\d*)(\w*)\.txt',file).group(1,2)
        file_list[int(num)] = string

out = ""
for item in sorted(file_list.items()):
    out += item[1]

out = out.replace('苏珊', '.').replace('哎哟','-').replace('你干嘛',' ')
'''

data = '&104;&116;&116;&112;&115;&58;&47;&47;&112;&97;&110;&46;&119;&117;&99;&117;&112;&46;&99;&110;&47;&99;&104;&97;&108;&108;&101;&110;&103;&101;&47;&65;&84;&95;&49;&46;&48;&46;&97;&112;&107;&10'
print(''.join(list(map(chr,map(int, re.findall(r'(\d+)', data))))))

# https://pan.wucup.cn/challenge/AT_1.0.apk
```

