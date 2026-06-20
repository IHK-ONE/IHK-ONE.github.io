---
title: '2024 能源赛 油气组 Writeup'
description: '修改宽高以及分离flag.zip，得到key：flag@abc'
pubDate: 2024-08-15
author: 'IHK-1'
tags: ['CTF', '能源赛', '2024']
---

# seeyouagain-A

修改宽高以及分离flag.zip，得到key：flag@abc

base64 隐写解密

# modbus-A

发现 modbus.regval_uint16 值不同，直接导出

```plain
tshark.exe -r modbus.pcapng -T fields -e modbus.regval_uint16 -Y 'modbus'  > out.txt
```

将ascii 拼接 flag

```python
lines = open(r'out.txt').readlines()
flag = ''

for line in lines:
    line = line.strip().split(',')
    for item in line:
        if item != '65535':
            flag += chr(int(item))

print(flag)
```

# IP找不到了-A

直接导出HTTP静态页，因为是静态页可以相互之间访问，也可以直接访问domain.htm

# gooooose-A
```plain
tshark.exe -r data.pcapng -e goose.integer -Y 'goose' -T fields > out.txt
```

有的goose长度为2，有的为3

取长度不为2的最后一位

```plain
lines = open(r'out.txt').readlines()
flag = ''

for line in lines:
    line = line.strip().split(',')
    if len(line) != 2:
        flag += chr(int(line[-1]))

print(flag)

> TVpXR0NaMzNNTlJHS05KVEc0NERNTUpWTU1ZREdOWlRHSjZRPT09PQ==
base64
MZWGCZ33MNRGKNJTG44DMMJVMMYDGNZTGJ6Q====

base32
flag{cbe5378615c03732}
```

# ezsys-A
直接拖入IDA中逆向

发现固定种子，伪随机

```plain
#include<stdio.h>
#include<stdlib.h>
int main(){
	int v3;
	srand(0x1BF52u);
	char flag[36];
	for ( int i = 0; i < 36; ++i )
	{
		if ( i == 8 || i == 13 || i == 18 || i == 23 )
		{
			flag[i] = 45;
		}
		else
		{
			v3 = rand() % 16;
			flag[i]= "0123456789abcdef"[v3];
		}
	}
	puts(flag);
}
```

# 结构化数据分类分级识别-A
导出文件上传HTTP

修改为 zip 发现为xlsx结构，修改为xlsx

[1,2,3,5,7]

# Fins协议分析-A

# brower-A
