---
title: '2024 第四届网鼎杯 朱雀组 Writeup'
description: '对 jar 包逆向，'
pubDate: 2024-10-29
author: 'IHK-1'
tags: ['CTF', '网鼎杯', '朱雀', '2024']
---

# MISC2
对 jar 包逆向，

main 函数下有多串 base64 编码，推测需要解密信息，向上查找调用

在 start 函数中找到一个例子

找到源函数

分析该函数为 AES 解密，对 GIiIiLA 列表依次解密，得到 flag

# MISC3
图片末尾有两个 ZIP，使用 foremost 分离，分别包含 flag.txt 以及 verycrypt01.docx

对包含 verycrypt01.docx 进行明文爆破 504b0304 的 header 以及 [Content_Types].xml 明文

```plain
bkcrack' -C 'b.zip' -c "crypt_zipfile/verycrypt01.docx" -p 'docx_header' -x 30 5b436f6e74656e745f54797065735d2e786d6c
```

发现爆不出，结合题目描述以及文件名，推测文件数据应该是 verycrypt 的密文

再次回到压缩包中，其中这三个文件都为 6 字节大小，尝试 进行 CRC 爆破

生成字典后进行爆破得到密码 This_WD_011cryptpW，对解压出来的 .docx 文件使用 verycrypt 再次使用 该密码 进行挂载（直接挂在由于 verycrypt 会判断为 docx 文件，解密逻辑不一样，会报错大小有问题，需要手动去除后缀进行挂载）

获得 secret.key 私钥，使用在线网站进行 RC4 解密即可 [在线RSA加密解密](https://www.lddgo.net/encrypt/rsa)

