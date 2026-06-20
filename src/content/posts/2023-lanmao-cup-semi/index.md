---
title: '2023 第七届蓝帽杯半决赛 Writeup'
description: '发送【蓝帽杯签到】到公众号【网络空间安全与法治协同创新中心】'
pubDate: 2023-09-16
author: 'IHK-1'
tags: ['CTF', '蓝帽杯', '半决赛', '2023']
---

# MISC
### 签到
发送【蓝帽杯签到】到公众号【网络空间安全与法治协同创新中心】

### 排队吃果果
将文件改为全黑之后按照每列升序可以得到一个类似二维码的排列

```shell
from openpyxl import load_workbook
from PIL import Image

workbook = load_workbook('./data.xlsx')
sheet_names = workbook.sheetnames

for sheet_name in sheet_names:
    worksheet = workbook[sheet_name]
    rows = worksheet.iter_rows()

    data = []
    all_data = []
    for row in rows:
        for cell in row:
            value = cell.value

            font = cell.font
            font_bold = font.b

            data.append([int(value), font_bold])
            all_data.append([int(value), font_bold])

    twod_data = []
    chunk_size = 39
    for i in range(chunk_size):
        twod_data.append(data[i * chunk_size:(i + 1) * chunk_size])

    print(twod_data)

    all_list = []
    for y in range(chunk_size):
        list_data = []
        for x in range(chunk_size):
            list_data.append(twod_data[x][y])
        list_data = sorted(list_data, key=lambda x: x[0])
        all_list.append(list_data)
    print(all_list)

    out =""
    for y in range(chunk_size):
        for x in range(chunk_size):
            if all_list[y][x][1] == False:
                out += "0"
            else:
                out += "1"

    print(out)

  # 000000000000000000000000000000000000000011111110011101100010101110101011111110010000010011011011001111101000010000010010111010110110000011110011111010111010010111010100110110001010101111010111010010111010011100010111100010001010111010010000010000110010111111011000010000010011111110101010101010101010101011111110000000000010010110000001111101000000000000011011000000100011011010110000011000000010001101010101110010110011100111100010110110010001011110000101110011000110001001001000010100010011100011000011100001101010110011111011100110111010010110001000001110001101010100100010101110000001001110110100111000110111111000010110010100100010000110010110100000111111100011000110010100001111010011111011011110011011101001101011011011010111100011100011111110011011110001110100111110101010011101001110011011001001001010110010000011010110000101000110001000010011110000011100100100110111010011011011101100000011110110010101111110111110011011110010010101000001000111001010100111000001110011001010010110110010111001111110010100011011001100001110101010011111101100000011100110000011110111001000111000100110010011000100001000110110010110100101100010000011110000100011101101011111101110000000000101000010101110011011000110000011111110110111001000011111101010111110010000010001000001000110101001000110000010111010111100111010101010011111110110010111010100101111001011001000010011000010111010011001100011101010110001110110010000010010100111011101000110011001110011111110000001010001000010011110010010000000000000000000000000000000000000000
```

得到二维码

扫码得到flag

```plain
flag{35b6f3ed-9d28-93b8-e124-39f8ec3376b2}
```

# 取证
### 检材开始提取的时间是什么时候

```plain
09-11 17:21
```

### 嫌疑人手机SD卡存储空间一共多少GB

```plain
24.3
```

### 嫌疑人手机的设备名称是？

### 嫌疑人手机的IMEI是？

```plain
352531082716257
```

### 通讯录存放的目录是？  
```plain
contacts.db
```

### 测试的apk的包名是

```plain
com.example.myapplication
```

### 嫌疑人一共使用了多少个应用
一共100个，然后小黄鸟重复了一个

```plain
99
```

### 程序的主入口为

```plain
com.example.myapplication.MainActivity
```

### 测试apk的签名算法

```plain
SHA256
```

### apk一共申请了几个权限

```plain
2
```

### 测试apk对Calllog.txt进行了什么加密

```plain
BASE64
```

### 10086对嫌疑人打过几次电话

```plain
2
```

###  测试apk对短信进行了几次加密
```plain
2 base64和AES
```

### 测试apk的机密密钥为
```plain
Java.perform(function() {
    var MainActivity = Java.use('com.example.myapplication.MainActivity');
    var mainActivityInstance = MainActivity.$new();
    var result = mainActivityInstance.Getkey();
    console.log('Getkey 返回值:', result);
});

```

```plain
使用frida注入到apk
bGlqdWJkeWhmdXJp 
base64解码得到key
lijubdyhfuri
```

### 嫌疑人在2021年支付宝验证码为？

```plain
9250
```

