---
title: '2024 第四届网鼎杯 青龙组 Writeup'
description: '根据题目描述分理出 teid'
pubDate: 2024-10-29
author: 'IHK-1'
tags: ['CTF', '网鼎杯', '青龙', '2024']
---

# MISC1
根据题目描述分理出 teid

```plain
tshark -r UPF.cap -T fields -e gtp.teid > flag
```

尝试进行了去重，但是有两个流的 teid 有两个值，尝试对第二个值拼接即可

EXP：

```python
out = ""
for line in open('flag').readlines():
    line = line.strip()
    line = line.split(",")
    if len(line) == 2:
        out += str(int(line[1],16))

print(out)
```

# MISC2
对于加密代码，写出解密代码

```python
import binascii

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import struct

def unpad(text):
    return text.rstrip(b' ')

def decrypt(key, ciphertext):
    key_bytes = struct.pack('>I', key)
    key_bytes = key_bytes.ljust(16, b'\0')
    cipher = Cipher(algorithms.AES(key_bytes), modes.ECB(), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
    return unpad(decrypted_padded).decode()

if __name__ == "__main__":
    key = 1
    ciphertext = ""
    ciphertext = binascii.unhexlify(ciphertext)
    decrypted_msg = decrypt(key, ciphertext)
    print("Decrypted message:", decrypted_msg)
```

现在需要确定 AES 的密文与 key，其中 key 为整数，结合 GTP 与 MISC1 的出题，推测 key 依旧为 teid

现在尝试分析密文

在 GTP 协议流中，每一段都有 冗余数据，手动一个一个分析，在 No.14 流中分析出结果

```plain
key: 0xe6xxxx
cipher: 8a20e63710701e48249decf74d3a902eb258c8a2ec1ee9ab5316a7f2306fef0f9d102429e7786182cbe469xxxxxxxxxx
```

带入解密代码得到 flag

# MISC3 ×
参考文章

1. [https://www.synacktiv.com/en/publications/php-filter-chains-file-read-from-error-based-oracle?ref=assetnote.io](https://www.synacktiv.com/en/publications/php-filter-chains-file-read-from-error-based-oracle?ref=assetnote.io)
2. [PHP Filter链——基于oracle的文件读取攻击 - “我不是二次元!”](https://m1racle-7.github.io/2024/10/07/PHP%20Filter%E9%93%BE%E2%80%94%E2%80%94%E5%9F%BA%E4%BA%8Eoracle%E7%9A%84%E6%96%87%E4%BB%B6%E8%AF%BB%E5%8F%96%E6%94%BB%E5%87%BB/)

# MISC4
all 文件中有三个二进制文件

对 1 的文件头进行补齐zip header 504b ，此时再将文件后缀修改为 zip 打开，可以得到 11.zip

进行掩码爆破

再次使用 010 打开 11.png ，发现其实是 jpg 图片，修改文件后缀后，发现文件尾多了 PNG

再次进行分离后，得到的图片是一张错误的图片，其中 CRC 错误，进行爆破宽高，计算出正确宽高为 620*92 ，修复宽高后拿到 flag第一部分

返回 1.zip 其还有 2.zip

多次修复后未果，尝试直接手动分离出整个 2.zip

解压后拿到 尾部flag

