---
title: '2025 某内部赛 湖北移动 Writeup'
description: '百度识图找到一篇文章'
pubDate: 2025-03-20
author: 'IHK-1'
tags: ['CTF', '湖北移动', '内部赛', '2025']
---

# 马路

百度识图找到一篇文章

这里有关键信息，对鄂温克旗子的大桥多次排查

最终确定为安达大桥

# 哪吒

对 length 大小进行倒序有个 SQL.php 的 PUT 上传最大

```plain
<?php
header('Content-Type: text/plain; charset=utf-8');
define('AES_KEY', 'your_32_byte_aes_key_here_1234567890!');
$iv = isset($_GET['iv']) ? urldecode($_GET['iv']) : '';
$ciphertext=file_get_contents("php://input");

if (empty($iv) || empty($ciphertext)) {
    die("error");
}

function generateFlagWithMD5() {
    $randomString = bin2hex(random_bytes(16));
    $md5Value = md5($randomString);
    return "flag{" . $md5Value . "}";
}

try {

    $iv = base64_decode($iv);
    $ciphertext = base64_decode($ciphertext);
    $plaintext = openssl_decrypt(
        $ciphertext,
        'aes-256-cbc',
        AES_KEY,
        OPENSSL_RAW_DATA,
        $iv
    );
    
    if ($plaintext === false) {
        throw new Exception('error');
    }

    
    $host = 'localhost';
    $username = 'sql_aaa_test_com';
    $password = '48e35f6c829788';
    $dbname = 'sql_aaa_test_com';
    
    $conn = new mysqli($host, $username, $password, $dbname);
    

    if ($conn->connect_error) {
        die("error ");
    }

    $sql = $plaintext;
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo generateFlagWithMD5();
        }
    }
    $conn->close();

} catch (Exception $e) {
    die("error");
}

?>
```

分析代码其输入 iv 以及 cipherdata ，如果执行成功则输出 md5 ，进行 tshark 过滤，提取 http 请求以及 post data 数据

```plain
tshark -r "!NETA.pcap" -T fields -Y 'http.request.method == "POST" && http.file_data' -e 'http.request.uri' -e 'http.file_data' > out.txt
```

写出对应的解密

```plain
import binascii
import base64
from urllib.parse import unquote
from Crypto.Cipher import AES

out_list = []
for line in open(r"out.txt",encoding='utf-8',errors='ignore').readlines():
    iv,cipher = line.strip().split()
    iv = iv.split('/')[-1]
    cipher = binascii.unhexlify(cipher.encode()).decode()
    AES_KEY = b'your_32_byte_aes_key_here_123456'

    iv = base64.b64decode(unquote(iv))
    ciphertext = base64.b64decode(cipher)
    cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
    plaintext_padded = cipher.decrypt(ciphertext)

    plaintext = plaintext_padded.rstrip(b'\x00')

    print(plaintext.decode('utf-8').strip())
```

发现解密出来的结果如果是正确的则会进行 sleep1，再次对回显进行过滤，将回显时间阈值超过 0.5 的进行过滤

```plain
tshark -r "!NETA.pcap" -T fields -Y 'http.response.code == 200 && http.time >= 0.5' -e 'http.request.uri' > true.txt
```

同时flag的第一个字符和上面的数做“&”操作返回的值是这些数本身，就说明flag第一个字符的二进制形式中对应的bit是1假设flag第一个字符的二进制形式是 m1,m2,m3,m4,m5,m6,m7,m8比如和2做“&”返回的值是2，这就说明 m7的值是1以此类推，m2 = 1,m3 = 1,m6 = 1,m7 = 1，写出过滤以及解密

```plain
import binascii
import base64
from urllib.parse import unquote
from Crypto.Cipher import AES
import re

true_iv = []
for line in open(r"true.txt").readlines():
    true_iv.append(line.strip().split('/')[-1])

out_list = {}
for line in open(r"out.txt", encoding='utf-8', errors='ignore').readlines():
    iv, cipher = line.strip().split()
    iv = iv.split('/')[-1]
    if iv in true_iv:
        cipher = binascii.unhexlify(cipher.encode()).decode()
        AES_KEY = b'your_32_byte_aes_key_here_123456'

        iv = base64.b64decode(unquote(iv))
        ciphertext = base64.b64decode(cipher)
        cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
        plaintext_padded = cipher.decrypt(ciphertext)
        plaintext = plaintext_padded.rstrip(b'\x00').strip().decode()

        data = re.search(r'select if\(ascii\(mid\(\(select flag from flag\),(\d+),1\)\) & (\d+) = (\d+),',plaintext).groups()
        if data[0] not in out_list:
            out_list[data[0]] = str(data[1])
        else:
            out_list[data[0]] = out_list[data[0]] + ',' + str(data[1])

flag = ""
for i in out_list:
    tmp = out_list[i]
    m = sum(map(int, tmp.split(',')))
    flag += chr(m)
print(flag)
```

# 信息泄露
JPG 部分: 

```plain
from pyzbar import pyzbar
from PIL import Image
import os
import re

# JPG
for filename in os.listdir(r"C:\Users\HK\Desktop\信息泄露\JPG"):
    try:
        image = Image.open(rf"C:\Users\HK\Desktop\信息泄露\JPG\{filename}")
        decoded = pyzbar.decode(image)
        data = decoded[0].data.decode('utf-8')
        if len(re.findall(r'[a-zA-Z0-9]|码|址',data)):
            print(f"{filename}")
        image.close()
    except:
        pass

135.jpg
154.jpg
168.jpg
379.jpg
46.jpg
7.jpg
```

TXT 部分: 

```plain
import os
import re

folder = r"C:\Users\HK\Desktop\信息泄露\TXT"
for filename in os.listdir(folder):
    filepath = os.path.join(folder, filename)
    with open(filepath, encoding='utf-8') as f:
        data = f.read()

    if re.search(r'[a-zA-Z0-9]|址|码', data):
        print(filename)

7.txt
```

MP3 部分手动过滤

项目：[https://github.com/jianchang512/stt](https://github.com/jianchang512/stt)

根据文档调整模型，批量识别后手动搜索 地址 号码 的字符串

