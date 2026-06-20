---
title: '2023 DASCTF & 0x401 MISC Writeup'
description: '<font style="color:rgb33, 37, 41;">DASCTF{DASCTF7_0x401_Happy}</font>'
pubDate: 2023-09-10
author: 'IHK-1'
tags: ['CTF', 'DASCTF', 'MISC', '2023']
---

## MISC
### 签到
<font style="color:rgb(33, 37, 41);">DASCTF{DASCTF7_0x401_Happy}</font>

### <font style="color:rgb(33, 37, 41);">ezFAT32</font>
<!-- 这是一张图片，ocr 内容为： -->


```plain
foremost -i misc2.zip -T 分离出flag.zip压缩包
```

<!-- 这是一张图片，ocr 内容为： -->


R-studio 扫描得到一个hint和一张bitmap，导出bmp进行sha256得到sha值

1bec3826d44f706d33e8cc4bc230d3113d0198261ff1cd251294dbdebabb0af5

解压flag.zip得到flag

dasctf{Yep_Y0u_F1nd_The_F1ag!Suff3r_t0_rec0ver}

### <font style="color:rgb(33, 37, 41);">Coffee desu!</font>
参考链接 [https://blog.csdn.net/weixin_42319408/article/details/103084128](https://blog.csdn.net/weixin_42319408/article/details/103084128)

```plain
使用BREW 制作咖啡，并将Accept-Additions 加入物改成milktea，Accept: application/coffee-pot-command
BREW / HTTP/1.1
Host: 8853ec2d-03d9-4af0-b6d2-1424b50e0962.node4.buuoj.cn:81
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0
Accept: application/coffee-pot-command
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Content-Length: 0
Accept-Additions: milktea



```



<!-- 这是一张图片，ocr 内容为： -->


```plain
在使用GET 获取咖啡

GET / HTTP/1.1
Host: 8853ec2d-03d9-4af0-b6d2-1424b50e0962.node4.buuoj.cn:81
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0
Accept: application/coffee-pot-command
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Content-Length: 0
Accept-Additions: milktea
```

<!-- 这是一张图片，ocr 内容为： -->


