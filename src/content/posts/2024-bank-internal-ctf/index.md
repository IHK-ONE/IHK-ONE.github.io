---
title: '2024 某银行内部赛 Writeup'
description: 'sql 注入，直接拿工具梭哈'
pubDate: 2024-08-10
author: 'IHK-1'
tags: ['CTF', '银行内部赛', '2024']
---

# misc1
sql 注入，直接拿工具梭哈

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729582817430-bb3526f3-bc45-4ade-88d3-eab0f43275e1.png)

当然也可以拿过滤去匹配

```plain
from flag limit 0,1\),\W?(\d+)\W?,1\)\)\)\W?\W?\W?(\d+)
```

flag

```plain
flag{skysql_is_very_cool!233}
```

# misc2
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729582947346-f7e7cdd1-b139-4976-b7c6-d4778592c293.png)

头部 IDAT 块异常，推测为两张 png 的 IDAT 块拼成，删除修复后：

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729582991295-6b549661-5038-4abb-bb9a-71107fd46086.png)

使用 outguess 进行恢复

```plain
outguess -r flag.jpg output -k 89504E
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729583058984-10a186a5-2afa-4134-b49e-2878c6c9b5be.png)

恢复出来推测需要进行 补全zip，当我们尝试直接进行压缩一个 flag{xxxx} 文档的时候，使用 08 正常压缩，内容头也为

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729583142554-86c9bd4c-00a0-4de8-a892-ed7a89a8ac4d.png)

直接尝试写入一个 flag.txt 并以 COMP_DEFLATE (8) 进行压缩，然后替换内容部分保存

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729583219967-bb9890de-8fcd-44cf-8585-a57e80df7c4b.png)

解压后成功解压出 flag，虽然压缩包校验出错，但是 bandzip 仍然能以该格式解压出内容，另一种方法可以通过 COMP_DEFLATE (8) 对内容进行恢复

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729583261306-50bea35d-d757-455d-b67a-693431ced3c0.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729583245126-a0797b39-fa2c-4969-8869-1b060dbd8eba.png)

flag2

```plain
flag{0815e4c9f56148e78be60db56ce44d59}
```

# misc3
根据文件头确定文件格式为 vmdk

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729583380297-f3204b0d-26f1-49a6-bfd3-2b7a7546628b.png)

随便找一个工具能打开该镜像即可，比如 disk genius 或者 r-studio 之类的工具，并恢复出一张 c.jpg

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/35229002/1729583437755-4cea6be0-99d7-424e-b26f-9cafba27f464.jpeg)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729583462464-e14202ec-febd-4fa5-9332-f0600c683879.png)

图片属性中有 AAencode 加密，解密即可拿到 flag

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1729583504649-3993bef4-b7db-41b8-8492-9a8c4aa3727e.png)

flag3

```plain
flag{71a55b5c2c247bbb1b54c0f6918c32}
```

