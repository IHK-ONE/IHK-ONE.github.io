---
title: '2025 第十八届 CISCN 全国大学生信安赛 Writeup'
description: '流量分析其系统命令执行部分'
pubDate: 2025-05-15
author: 'IHK-1'
tags: ['CTF', 'CISCN', '2025']
---

# zeroshell
## zeroshell_1
流量分析其系统命令执行部分

其中 Session 带有 Zmxh 头

```plain
ZmxhZ3s2QzJFMzhEQS1EOEU0LThEODQtNEE0Ri1FMkFCRDA3QTFGM0F9
flag{6C2E38DA-D8E4-8D84-4A4F-E2ABD07A1F3A}
```

## zeroshell_2
其路由 F !command 可以命令执行

## zeroshell_3
find 搜索 bash ，发现 Database 有个 nginx 配置文件有bash，继续分析 Database ，其中 .nginx 是个 ELF 文件，dump 下来分析，发现对 202.115.89.103 通信

```plain
202.115.89.103
```

## zeroshell_4
根据上题可知是 .nginx 

## zeroshell_5
向下继续分析发现有个函数传参 off_81130C0

分析其值 11223344qweasdzxc

```plain
11223344qweasdzxc
```

## zeroshell_6
find 搜索包含 .nginx 字符串的文件

```plain
/var/register/system/startup/scripts/nat/File
```

# WinFT
## WinFT_1
流量中用户运行了 flvupdate.exe

运行后 使用火绒剑分析 Net_connect 

该 IP 在 wireshark 中对应 miscsecure.com.com

```plain
miscsecure.com:192.168.116.130:443
```

## WinFT_2
PC hunter 查找注册表

cyberchef 解码后

## WinFT_5
流量中 有 flag.txt 的 zip，该流上面有大量数据

且发现 zip 被截断，导出流后进行拼接，发现是嵌套压缩包

对下一级压缩包使用相同 文件名 进行明文爆破

```plain
echo Everything.zip > plaintext
bkcrack -C Everything.zip -c Everything.zip -p plaintext -o 30 -x 0 504b0304
```

拿到 key af74fc89 4c0bf55a 00e8e49a，重置密码后拿到 flag

```plain
bkcrack -C Everything.zip -k af74fc89 4c0bf55a 00e8e49a -U out.zip 123456
```

# sc05
## sc05_1

```plain
2024/11/09_16:22:42
```

# kiwi
分析流量，过滤出成功回显的流量 http.response.code == 200，逆向分析 kiwi.exe 发现其用 mimikatz 并发包 

用 AI 问了下加密逻辑

尝试了解密后解密不出，发现其码表被打乱

```plain
d+F3DwWj8tUckVGZb57S1XsLqfm0vnpeMEzQ2Bg/PTrohxluiJCRIYAyH6N4aKO9
```

进行 base64 解密

结合逻辑

```plain
random_data[i] = ((input_string[i] - random.randint(0, 127)) ^ random_multiplier)
```

写出 C 语言将随机数列表生成，方便之后异或还原

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
using namespace std;

int main() {
    srand(0x69);
    for (int i = 0; i < 1024; ++i) {
        cout << rand() % 128 << ",";
    }
    return 0;
}
```

得到随机数序列进行解密

```python
cip=[185,72,28,88,129,79,81,125 ~ 14,111,83,150,73,97,93]
rd=[125,46,16,61,45,39,68,121,39,105,51,85 ~ 49,74,99,96,62]
out = ""
for i in range(len(cip)):
    out += chr((cip[i]-rd[i]) ^ 0x69)
```

