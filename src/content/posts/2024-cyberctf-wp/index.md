---
title: '2024 CyberCTF Writeup'
description: '分析 APK 发现加密逻辑'
pubDate: 2024-09-20
author: 'IHK-1'
tags: ['CTF', 'CyberCTF', '2024']
---

# beginer
## encryptor
分析 APK 发现加密逻辑

并发现密文

根据加密逻辑进行 Blowfish 解密即可

## Baby Pybash
根据 WAF 得到以下可用字符串

```plain
 $ ~ - _ = { } [ ] | : . < > 0-9
```

尝试直接输入 $0  即执行的第一个参数，可以拿到 shell

## ZipZone
 审计代码后发现可控变量只有 文件内容 ，尝试文件内容软连接

其解压后文件指向 flag.txt  即可，zip 中有 -y 参数，其可以保留软连接属性

上传拿到 flag

# forensics
## Social Distancing
对于该文件，进行了 google 搜索，并在一篇文章中发现了线索

[如何从 Windows Defender 中提取隔离文件 |Nikola 的博客 (reversingfun.com)](https://reversingfun.com/posts/how-to-extract-quarantine-files-from-windows-defender/)

其对文件进行 RC4 加密，而 RC4 的密钥是固定且静态的，所以使用该密钥进行解密即可

base64 解码得到 zip，zip 解压得到 flag

## 3Dobj
这是一个 3D 文件，使用在线查看 [Online 3D Viewer](https://3dviewer.net/)

侧面的图片，在晃动的时候，可以看到其中隐藏的文字，多次摇晃可以模糊的看到文字

```plain
CSCTF{H1d1ng_in_T3x7ur3}
```

# web
## Feature Unlocked
分析代码后知道逻辑：需要在 /release 将时间改到发布之后，获取cookie，然后访问 /feature 可以使用 RCE 进行命令执行

/release 时间修改逻辑：

```plain
debug=true --> get_preferences() [json.loads(cookie 里传参 preferences)] --> json中传参 validation_server --> validate_server(validation_server) --> validate_access(validation_server)
```

所以传参一个自己构造好的 服务器即可，将 pubkey 的 data 时间进行修改，然后运行穿透出外网：

```plain
{"theme": "light", "language": "en", "validation_server":"https://86s2d65770.zicp.fun/"}
```

编码后成功

使用 && 符号进行命令执行，并注释掉后面的内容

```plain
echo && cat flag.txt # | wc -w
```

