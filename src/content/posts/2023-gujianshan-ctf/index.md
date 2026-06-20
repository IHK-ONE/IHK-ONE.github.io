---
title: '2023 古剑山 CTF Writeup'
description: '执行之前修复好的代码，本地生成了excellent.jpg，分离末尾的zip文件'
pubDate: 2023-08-20
author: 'IHK-1'
tags: ['CTF', '古剑山', '2023']
---

# MISC
## i have the flag
```javascript
function ck(s) {
    try {
        ic
    } catch (e) {
        return;
    }
    var a = [118, 108, 112, 115, 111, 104, 104, 103, 120, 52, 53, 54];
    if (s.length == a.length) {
        for (i = 0; i < s.length; i++) {
            if (a[i] - s.charCodeAt(i) != 3)
                return ic = false;
        }
        return ic = true;
    }
    return ic = false;
}

# 题目js代码，只要条件为真即可
```

```python
def add(num):
    return num-3
a = [118, 108, 112, 115, 111, 104, 104, 103, 120, 52, 53, 54]
print(''.join(list(map(chr,list(map(add,a))))))

# simpleedu123
```

<!-- 这是一张图片，ocr 内容为：I HAVE THE FLAG TYPE IN SOMETHING TO GET THE FLAG. TIPS:MAYBE YOU HAVE THE FLAG. SOMETHING:SIMPLEEDU123 GET FLAG! CONGRATULATIONS!! WN9NUOH6ERBN/W+C7HVG MUW -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1702009855203-ca30cedc-d6cd-4159-ad48-6daf017e3300.png)

## 幸运饼干
```plain
# Bkcrack 明文爆破
'/root/Desktop/bkcrack-1.5.0-Linux/bkcrack' -C '/root/Desktop/flag.zip' -c hint.jpg -P '/root/Desktop/93efed7690954db78b5ce6e466d99420.zip'  -p hint.jpg

# afb9fee3 f8795353 f6de1d4e 
```

<!-- 这是一张图片，ocr 内容为：(ROOTSKALI)-[~] ' -C '/ROOT/DESKTOP/FLAG.ZIP' -# '/ROOT/DESKTOP/BKCRACK-1.5.0-LINUX/BKCRACK' - : HINT.JPG -P '/ROOT/DESKTOP/93EFED7690954DB78B5CE6E466D99420.ZIP' HINT.J -P PG BKCRACK 1.5.0 - 2022-07-07 [23:32:42] Z REDUCTION USING 25761 BYTES OF BE KNOWN PLAINTEXT 82.4 % (21238 / 25761) [23:32:43] ATTACK ON 161 Z VALUES AT INDEX 5 X  5172 KEYS: AFB9FEE3 F8795353 F6DELD4E 73.3 % (118 / 161) [23:32:43]KEYS AFB9FEE3 F8795353 F6DELD4E -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1702009979292-b7c5f475-50e4-486c-af94-e82c8c273a26.png)

```plain
# 修改密码
'/root/Desktop/bkcrack-1.5.0-Linux/bkcrack' -C '/root/Desktop/flag.zip' -c hint.jpg -k afb9fee3 f8795353 f6de1d4e -U '/root/Desktop/out.zip' 123456
```

<!-- 这是一张图片，ocr 内容为：-(ROOTSKALI)-[~] '/ROOT/DESKTOP/FLAG.ZIP' '/ROOT/DESKTOP/BKCRACK-1.5.0-LINUX/BKCRACK' C HINT. JPG -K AFB9FEE3 F8795353 F6DELD4E -U '/ROOT/DESKTOP/OUT.ZIP 123456 BKCRACK 1.5.0 - 2022-07-07 [23:33:50] WRITING UNLOCKED ARCHIVE /ROOT/DESKEOP/OUT.ZIP WITH PASSWORD "1234 56 100.0%(4 / 4) WROTE UNLOCKED ARCHIVE. -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1702010044498-c1ade7f1-2075-4ec1-b97a-a7f3cdcb1b59.png)

```plain
# 获取password
* NTLM : 786515ed10d6b79e74c1739f72a158cc > 54231

# 获取masterkey
mimikatz # dpapi::masterkey /in:C:\Users\HK\Desktop\out\S-1-5-21-726299542-2485387390-1117163988-1001\e5f8e386-7041-4f16-b02d-304c71040126 /password:54231
> key : 7a4d2ffbb42d0a1ab46f0351260aef16cae699e03e9d6514b3bf10e2977c5d228fda4a48e39b7b8a06a443c39653c2a3c3656596e7edc84e1c9682511c8343ac

# 解密cookie
mimikatz # dpapi::chrome /in:C:\Users\HK\Desktop\out\Cookies /masterkey:7a4d2ffbb42d0a1ab46f0351260aef16cae699e03e9d6514b3bf10e2977c5d228fda4a48e39b7b8a06a443c39653c2a3c3656596e7edc84e1c9682511c8343ac
> Cookie: flag{mimikatz_is_bravo_xz12ss}
```

## jpginside
```python
# 修改后缀为pyc，进行pyc反编译，结果：
'''
store = [
    111,
    217,
    97,
    ...
    ...
    116,
    101,
    49,
    50]
key = raw_input('Please input the key:')
with open('excellent.jpg', 'wb') as jpg:
    for i in range(len(store)):
        jpg.write(chr(store[i] ^ ord(key[i % len(key)])))
'''
# 修复为可执行代码
'''
store = [
    111,
    217,
    97,
    ...
    ...
    116,
    101,
    49,
    50]
key = b'rotate1234!'

with open('excellent.jpg', 'wb') as jpg:
    for i in range(len(store)):
        jpg.write(bytes([store[i] ^ key[i % len(key)]]))
'''
# 逆向出key
import binascii

data = [141,
        183,
        139,
        129,
        116,
        117,
        123,
        116,
        122,
        114,
        33,
        115,
        110,
        117,
        97,
        ]

jpg = binascii.unhexlify('FFD8FFE000104A4649460001010101')
data = bytes(data)
print(len(jpg),len(data))
out = ''
for i in range(len(data)):
    out += chr(data[i] ^ jpg[i])
print(out)

# key = rotate1234!
```

执行之前修复好的代码，本地生成了excellent.jpg，分离末尾的zip文件

<!-- 这是一张图片，ocr 内容为：起始页 OUT.ZIPX 1 2 3 4 5 6 7 8 9 A B C D E F 0123456789ABCDEF 00000H:50 4B 03 04 0A 00 00 00 00 00 CB 6D 55 4F 00 00 PK.........EMUO. 0010H:00 00 000000000050000006A70 0000 6688 0020H:65 6B 2F 6 1304140009006300AE6D55 EK/F .C.RMU OET'MD...&.... 0030H:4FEB549240 00260000000000B 00000 B2F 0040H:00 6A 70 6B 2 A 70 6B2E 74 78 74 01 99 JPEK/JPEK.TXT. 00 41 45 03 08 00 18 81 8189A9C76B 0050H:07 00 00 4 ..AE...".#.#....AE......AE. *.$W EE)0>0A&4. E626341900 7 B9 8C B 0060H:2A162477 063E SAER4I Y.YE..,DBS 0070H:8A C2  6 9C  7F 82 44 8A OC34 ED B3 79 01 FF 89 FA 8C 7F 0080H:53 EA OC 93 5D 2E 40 5D 0 0F21 SE."].@].!A.&UF. OC 74504B07 0090H:AB52FF4387CA23551810 18 &RYC+E#U..E.TPK. 00 50 4B 01 44 00 00 2 00AOH:08  54 92 4D 0260000 .ET'MD...&....PK. 554F 00 00 00 00BOH:02 1F 00  00 CB6D 00 00 00 ....EMUO. 00 00COH:0000000 2400000000 000 00 00 05 0000 00DOH:000000100( 6A70656B2F 00 000 00 JPEK/ 00000 18 00EOH:OA 00 20 00 00  00BFB7 54 DF 0100 STB 0000 010.B8￥SO10.T:11 53 D3 87 D5 01 54 3A EE 6C 00FOH:D2 87 D5 01 DF 38 A5  010.PK. 14009006300 1F 00 0100H:D287D501504B0102 44 00 0110H:AE 6D 55 4F EB 54 92 4D RMUOET' 000 26000000 0120H:OD 00 2F 00 00 00 00 00 00 20( 0000002300 0130H:0006A706568 55 6B 2F 6A 70 65 0656B2E7478740A JPEK/JPEK.TXT. 0140H:00 20 00 00 00 00 00 01 00 18 00 3A AF 22 BF D2 ........."/0 100 10..$OAO+0.1 AN 9 F2                                                                                                  87 D5 01 60 5F E2                                                                                     0150H:87 D5 01 18 F 0160H:87 D5 01 01 99 07 00 01 00 41 45 03 08 00 50 48 10...M....AE...PK 0170H:05 06 00 00 00 00 02 00 02 00 C1 00 00 00 AD 00 0180H:0000000 模板结果-ZIP.BT 注释 值 开始 颜色 大小 名称 0H FG: BG: 23H JPEK/  STRUCT ZIPFILERECORD RECORD -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1702011011796-73f3e149-896c-4b23-92a3-cda7c7f9f0f8.png)

修复字节，使用 key 解开压缩包得到flag

```plain
jpek{39i0jf49229fie5j33f02403hj953012}
rot22: flag{39e0fb49229bea5f33b02403df953012}
```

## 数独
```plain
gaps run '/root/Desktop/image.png' '/root/Desktop/out.png' --size=70
```

<!-- 这是一张图片，ocr 内容为：ROOT@KALI:~ FILE EDIT VIEWHELP ACTIONS 88.6% ANALYZING IMAGE: 89.9% ANALYZING IMAGE: CS DE TRASH 91.1% IMAGE: ANALYZING 92.4% IMAGE: ANALYZING 93.7% ANALYZING IMAGE: 94.9% IMAGE ANALYZING 96.2% IMAGE: ANALYZING 97.5% ANALYZING IMAGE: FILE SYSTEM CS-SCI 98.7% ALYZING IMAGE: ANAL 100.0 IMAGE: ANALYZING SOLVING PUZZLE: 10.5% SOLVING PUZZLE: 15.8% SOLVING PUZZLE: 21.1% SOLVING PUZZLE: 26.3% HOME USBKE SOLVING PUZZLE: 31.6% SOLVING PUZZLE: 36.8% SOLVING PUZZLE: 42.1% SOLVING PUZZLE: 47.4% 52.6% SOLVING PUZZLE: SOLVING PUZZLE: 57.9% SOLVING PUZZLE: 63.2% IMAGE.PNG SOLVING PUZZLE: 68.4% 73.7% SOLVING PUZZLE: GA TERMINATED THERE WAS NO IMPROVEMENT FOR 10 GENERATIONS OUT.PNG PUZZLE SOLVED (ROOT@KALI)-[~] QUIETER YOU BECOME,THE MOR THE -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1702011237365-4c74f369-25cf-4128-a55f-8e7cbdf30676.png)

<!-- 这是一张图片，ocr 内容为：4 3 9 B 1 7 1 -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1702011256656-e2310c55-97dc-4eac-a467-371b5f33544c.png)

将最后一列区块移动至最前，按顺序读取flag即可

