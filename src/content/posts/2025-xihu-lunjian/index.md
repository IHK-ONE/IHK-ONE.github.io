---
title: '2025 第八届西湖论剑网络安全技能大赛 Writeup'
description: '最开始尝 R-studio ，但是不知道 RAID 的排列顺序和偏移，然后 FTK 挂载 用 VMFS recovery 虽然恢复成功但是要有激活码，网上也没破解版， 然后又试了 R-studio 发现竟然已经能识别到了，逆天'
pubDate: 2025-01-18
author: 'IHK-1'
tags: ['CTF', '西湖论剑', '2025']
---

# MISC
## 糟糕的磁盘
最开始尝 R-studio ，但是不知道 RAID 的排列顺序和偏移，然后 FTK 挂载 用 VMFS recovery 虽然恢复成功但是要有激活码，网上也没破解版， 然后又试了 R-studio 发现竟然已经能识别到了，逆天

提取后使用 VC 进行挂载

挂载后拿到 flag

# IoT
## blink
拖入 010 中发现大量明文的 c 代码，于是尝试了 strings

尝试了解摩斯密码 提交发现不行，后面又尝试了 rtosandmorseisveryeasyhahhaha 发现能够提交成功

## sharkp
对流量进行分析，发现其进行了日志上传、固件更新、以及上传了一个 elf

对 elf 进行分析，由于不会逆向，在沙箱中查看了一下，拿到 C2 IP

于是尝试分析接口，最开始尝试在路由器固件中分析，但是许久解不开，尝试继续分析流量，setSystemAdmin 部分传输的 data 中有传输数据，同时注意到一个反引号，且该命令可以在 linux 上识别出，推测为反引号命令执，尝试了提交，发现能够提交成功

# DS
## easydatalog
分析报错日志

发现有蚁剑 shell，逐行分析，发现有一个流进行了传输数据 /var/www/html/upload/password.jpg

对后面包含 16 进制的数据单独提取到一个文件中，并手动进行过滤

```python
hex = ""
with open("westlake/hex.txt", "r") as input_file:
    for line in input_file:
        hex_data = line.strip().split(":")[-1].replace(" ", "")
        hex += hex_data

with open("out.txt", "w") as output_file:
    output_file.write(hex)
```

16进制解码后拿到 password.jpg

使用盲水印解码 拿到 password

同时对后面数据分析，同时发现还传输了 /var/www/html/upload/data.zip

使用相同方法拿到 zip，使用盲水印解密后的密码解压后拿到 data.csv

拼接张三信息即可

## DSASignatureData
大概知道意思，通过公钥使用 DSA 算法校验值，尝试将题目描述多次喂给 ChatGPT ，修改了半天得到

```python
import base64
import os
from Crypto.PublicKey import DSA
from Crypto.Signature import DSS
from Crypto.Hash import SHA256
import pandas as pd

# 常量定义
PUBLIC_KEY_DIR = 'public/'
DATA_SAVE_DIR = 'http/'
CSV_FILE = 'data-sign.csv'
OUTPUT_CSV = 'output.csv'

def load_public_key(label: int) -> DSS:
    """加载指定label的公钥并返回DSS验证器"""
    public_key_path = os.path.join(PUBLIC_KEY_DIR, f"public-{label:04d}.pem")
    with open(public_key_path, 'r') as f:
        public_key_pem = f.read().encode()
    public_key = DSA.import_key(public_key_pem)
    return DSS.new(public_key, 'fips-186-3')

def read_user_data(label: int) -> dict:
    """读取指定label的用户数据"""
    user_data_path = os.path.join(DATA_SAVE_DIR, f'%3fuserid={label}')
    with open(user_data_path, 'r') as f:
        return eval(f.read())

def verify_signature(verifier: DSS, data: str, signature: str) -> bool:
    """验证签名"""
    try:
        verifier.verify(SHA256.new(data.encode()), base64.b64decode(signature))
        return True
    except ValueError:
        return False

def verify_user(label: int, df: pd.DataFrame) -> tuple:
    """验证指定label的用户数据"""
    user_data = read_user_data(label)
    verifier = load_public_key(label)

    name = user_data['name']
    idcard = user_data['idcard']
    phone = user_data['phone']

    name_signature = df.loc[label, 'name_signature']
    idcard_signature = df.loc[label, 'idcard_signature']
    phone_signature = df.loc[label, 'phone_signature']

    is_name_valid = verify_signature(verifier, name, name_signature)
    is_idcard_valid = verify_signature(verifier, idcard, idcard_signature)
    is_phone_valid = verify_signature(verifier, phone, phone_signature)

    if not all([is_name_valid, is_idcard_valid, is_phone_valid]):
        return False, name, idcard, phone
    return True, name, idcard, phone

def main():
    # 读取CSV文件
    df = pd.read_csv(CSV_FILE, index_col=0)

    # 验证所有用户
    failed_verifications = []
    for label in range(1, 2001):
        verified, name, idcard, phone = verify_user(label, df)
        if not verified:
            failed_verifications.append((label, name, idcard, phone))

    # 保存失败验证结果到CSV
    failed_df = pd.DataFrame(failed_verifications, columns=['userid', 'name', 'idcard', 'phone'])
    failed_df.to_csv(OUTPUT_CSV, encoding='utf-8', index=False)

if __name__ == "__main__":
    main()
```

## easyrawencode
分析镜像，在历史命令中

发现执行了 python hack.py，尝试搜索一下 hack.py

发现在镜像中存在，本来尝试 R-studio 进行提取，但是提取的数据有误，使用 vol 进行提取

提取后分析 hack.py，hack.py如下

```python
import os
import hashlib
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA

hackkey = os.getenv('hackkey')
if not hackkey:
    raise ValueError("Environment variable 'hackkey' is not set")

with open('private.pem', 'r') as f:
    private_key = RSA.import_key(f.read())
public_key = private_key.publickey().export_key()

aes_key = hashlib.sha256(hackkey.encode()).digest()

with open('data.csv', 'rb') as f:
    data = f.read()

cipher_aes = AES.new(aes_key, AES.MODE_EAX)
ciphertext, tag = cipher_aes.encrypt_and_digest(data)
cipher_rsa = PKCS1_OAEP.new(RSA.import_key(public_key))
enc_aes_key = cipher_rsa.encrypt(aes_key)

with open('encrypted_data.bin', 'wb') as f:
    f.write(ciphertext)
    
print(enc_aes_key.hex())
print(cipher_aes.nonce.hex())
print(tag.hex())
```

继续使用 vol 的 console 和 envars 分别提取运行 python hack.py 返回的 key 和 环境变量

从加密逻辑可以看到，data.csv用AES加密过，而AES的密钥是被RSA加密，并且给出RSA的私钥文件private.pem。而enc_aes_key，cipher_aes_nonce，tag这三个数据在控制台的历史命令中可以看到，然后直接读取RSA私钥进行解密得到AES的密钥，再解密拿到 data.csv

```python
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA

enc_aes_key = """20d96098010eb9b326be6c46e1ce1ca679e29f1d65dec055cf8c46c6436c3356af2dc312b2d35466
308b9fff0dd427b44a37e34fca12992e45db2ddd81884bd8eb5bccd3c595e8a9a352bd61322e1d52
329d6c8638bbfce65edffbc4d3a5759e88c0f90e31ce518837552a3a09d8e7e3c374f3857bfe501c
ce2066fb233ff1f5faac18d73c3b665a54e8c55574f16bf4678c5ce835d2a14a65f8c1cec012435a
8c06314cbe727a3a9b6060dfd6cdb850073423841178f6f409bb7ce8d4863c6f58855954d34af3d2
964c488c9057c8c5072a54e43f1f8039d32409eb1ff3abca41c0b302788c4c56c1a4be4506ff5b8a
ff0242e21c0ee7ffee2da20ed9434334"""

cipher_aes_nonce = "d919c229aab6535efa09a52c589c8f47"
tag = "5b204675b1b173c32c04b0b8a100ee29"

with open('private.pem', 'r') as f:
    private_key = RSA.import_key(f.read())
    
cipher_rsa = PKCS1_OAEP.new(private_key)
aes_key = cipher_rsa.decrypt(bytes.fromhex(enc_aes_key))
tag = bytes.fromhex(tag)
cipher_aes_nonce = bytes.fromhex(cipher_aes_nonce)
cipher_aes = AES.new(aes_key, AES.MODE_EAX,nonce=cipher_aes_nonce)
ciphertext = open('encrypted_data.bin','rb').read()

data = (cipher_aes.decrypt_and_verify(ciphertext,tag))
f = open('data.csv','wb')
f.write(data)
f.close()
```

其中提示个性签名被加密了，多次尝试了 AES 方法，发现压根解不开，然后尝试 RC4 等算法，试了半天才试出来 RC4 ，key 是 password ，然后写一个脚本批量解密

```python
import base64
from Crypto.Cipher import ARC4

lines = open('data.csv',encoding='utf-8').readlines()
for i in range(1, len(lines)):
    line = lines[i].strip()
    # 编号,用户名,密码,姓名,性别,出生日期,个性签名(加密版)
    index, username, password, name, sex, birthday, information = line.split(',')

    cipher = ARC4.new(password.encode())
    plaintext = cipher.decrypt(base64.b64decode(information)).decode()

    if "DASCTF" or "flag" in plaintext:
        print(plaintext)
```

