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

## 幸运饼干
```plain
# Bkcrack 明文爆破
'/root/Desktop/bkcrack-1.5.0-Linux/bkcrack' -C '/root/Desktop/flag.zip' -c hint.jpg -P '/root/Desktop/93efed7690954db78b5ce6e466d99420.zip'  -p hint.jpg

# afb9fee3 f8795353 f6de1d4e 
```

```plain
# 修改密码
'/root/Desktop/bkcrack-1.5.0-Linux/bkcrack' -C '/root/Desktop/flag.zip' -c hint.jpg -k afb9fee3 f8795353 f6de1d4e -U '/root/Desktop/out.zip' 123456
```

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

修复字节，使用 key 解开压缩包得到flag

```plain
jpek{39i0jf49229fie5j33f02403hj953012}
rot22: flag{39e0fb49229bea5f33b02403df953012}
```

## 数独
```plain
gaps run '/root/Desktop/image.png' '/root/Desktop/out.png' --size=70
```

将最后一列区块移动至最前，按顺序读取flag即可

