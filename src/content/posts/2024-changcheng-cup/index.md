---
title: '2024 长城杯 Writeup'
description: '其成功后调用 sendGameDataToServer'
pubDate: 2024-11-15
author: 'IHK-1'
tags: ['CTF', '长城杯', '2024']
---

# MISC
## BrickGame
分析前端代码

其成功后调用 sendGameDataToServer

sendGameDataToServer 函数则是 POST validate_game.php 发送 json

```plain
{
  "level":currentLevel, # 关数
  "timeLeft":timeLeft, # 倒计时
  "matchedPairs":totalMatchedPairs # 不知道干啥用的
} 
```

根据条件推测发送

```plain
{
  "level":3,
  "timeLeft":60,
  "matchedPairs":totalMatchedPairs
}
```

尝试对 matchedPairs 进行整数爆破 ，发现当 matchedPairs 成功

## 漏洞探踪，流量解密
第一阶段：

发现进行了目录爆破，同时传了一个 webshell 搜索 eval 即可

传递 f 做为参数进行命令执行，对于该文件上传路径在日志中搜索，确定了真实IP

192.168.30.234

非预期：攻击IP 和 被攻击 IP 都在一个 C 段，可以尝试爆破 192.168.30.0 ~ 192.168.30.256

第二阶段：

继续分析其webshell

发现路径 /ispirit/interface/gateway.php 使用了 f 参数，并命令执行，将其过滤

其中有几个可疑的流

追踪 src 192.168.1.5 ，查看其三个回显

找到了 key 与 raw，结合 RC4，尝试进行解密

```plain
key: bdb8e21eace81d5fd21ca445ccb35071
raw: bdb8e21eace81d5fd21ca445ccb350715a76f6751576dbe1af49328aa1d2d2bea16ef62afa3a7c616dbdb8e21eace81d5fd21ca445ccb35071

发现 raw 前后被 key 包裹，去除后进行解密即可
key: bdb8e21eace81d5fd21ca445ccb35071
raw: 5a76f6751576dbe1af49328aa1d2d2bea16ef62afa3a7c616d

RC4: 
flag:{welcome to beijing}
```

## 最安全的加密方式
分析流量，其中有三个特殊的流 分别传送了 qqq.php、test.png、Secret-document .rar

其中 Secret-document .rar 包含 flag.txt ，其密码在 webshell 中

解压出来的 flag 发现都为 md5 ，且在 somd5 解密了几个发现都为 一个字符

写一个脚本即可

```python
import hashlib

data = ''.join(open('flag.txt').readlines()).replace('\n','')
for i in range(128):
    data = data.replace(str(hashlib.md5(chr(i).encode()).hexdigest()),chr(i))
print(data)
```

# WEB
## SQLUP
弱口令 admin/a 进入后台

头像部分有文件上传，尝试传 png 发现失败了 

规则应该是过滤含 p 字符，尝试使用 .htaccess ，传 不含p 文件后缀即可

成功进行 getshell

根目录下有 flag，尝试 SUID 进行提权

tac 命令拿 flag

