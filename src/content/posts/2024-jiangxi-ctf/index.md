---
title: '2024 江西省赛 Writeup'
description: '1.根据system信息的admin邮箱爆破密码，得到login lxb@jxsz.com c3lzYWRtaW4='
pubDate: 2024-07-10
author: 'IHK-1'
tags: ['CTF', '江西省赛', '2024']
---

## web1
1.根据system信息的admin邮箱爆破密码，得到`login lxb@jxsz.com c3lzYWRtaW4=`

2.登录后open信息需要让它自动打开，system信息得知打开还需要422年，进入maintenance模式修改时间即，可。

```plain
MAINTENANCE
SET_DATE 3000-11-11
SET_MANUAL
OPEN
```

## web2
爆破得到弱密码，administer登录。

## web3
[https://www.cnblogs.com/Article-kelp/p/16046948.html](https://www.cnblogs.com/Article-kelp/p/16046948.html)

原题改编，脚本改改位置就行。

得到R9WLuE5hGVcwcVPdeBDV。

## crypto1
参考文章：

[https://blog.csdn.net/MikeCoke/article/details/113873809](https://blog.csdn.net/MikeCoke/article/details/113873809)

直接略微修改文章中的脚本即可

```plain
import os,sys
os.chdir(sys.path[0])
from random import Random

# right shift inverse
def inverse_right(res, shift, bits=32):
    tmp = res
    for i in range(bits // shift):
        tmp = res ^ tmp >> shift
    return tmp

# right shift with mask inverse
def inverse_right_mask(res, shift, mask, bits=32):
    tmp = res
    for i in range(bits // shift):
        tmp = res ^ tmp >> shift & mask
    return tmp

# left shift inverse
def inverse_left(res, shift, bits=32):
    tmp = res
    for i in range(bits // shift):
        tmp = res ^ tmp << shift
    return tmp

# left shift with mask inverse
def inverse_left_mask(res, shift, mask, bits=32):
    tmp = res
    for i in range(bits // shift):
        tmp = res ^ tmp << shift & mask
    return tmp

def extract_number(y):
    y = y ^ y >> 11
    y = y ^ y << 7 & 2636928640
    y = y ^ y << 15 & 4022730752
    y = y ^ y >> 18
    return y&0xffffffff

def recover_state(out):
    state = []
    for y in out:
        y = inverse_right(y,18)
        y = inverse_left_mask(y,15,4022730752)
        y = inverse_left_mask(y,7,2636928640)
        y = inverse_right(y,11)
        state.append(y)
    return state

def backtrace(cur):
    high = 0x80000000
    low = 0x7fffffff
    mask = 0x9908b0df
    state = cur
    for i in range(3,-1,-1):
        tmp = state[i+624]^state[(i+397)]
        # recover Y,tmp = Y
        if tmp & high == high:
            tmp ^= mask
            tmp <<= 1
            tmp |= 1
        else:
            tmp <<=1
        # recover highest bit
        res = tmp&high
        # recover other 31 bits,when i =0,it just use the method again it so beautiful!!!!
        tmp = state[i-1+624]^state[(i+396)]
        # recover Y,tmp = Y
        if tmp & high == high:
            tmp ^= mask
            tmp <<= 1
            tmp |= 1
        else:
            tmp <<=1
        res |= (tmp)&low
        state[i] = res
    return state

f = open('output','r').readlines()
c = []
for i in range(1000):
    c.append(int(f[i].strip()))

part = recover_state(c)
state = backtrace([0]*4 + part)[:624]
# print(state)

prng = Random()
prng.setstate((3,tuple(state+[0]),None))
flag = "flag{" + ''.join(str(prng.getrandbits(32)) for _ in range(4)) + "}"
print(flag)
```

## misc1
图片尾部有个 rar

解压出来的 flag 进行 reverse 拿到一个 zip，密钥为图片属性的 16进制解码，

最后直接 赛博厨子 magic 梭哈了

## re1
异或

## re2
esp定律脱壳

  
有smc，直接动调，发现一个异或

  
第二段也是异或

  

```plain
enc=[0x00000066, 0x0000006B, 0x00000063, 0x00000064, 0x0000007F, 0x0000006B, 0x00000067, 0x0000006B, 0x0000007C, 0x00000056, 0x0000007A, 0x00000056, 0x0000007E, 0x00000067, 0x0000003C, 0x00000050, 0x00000064, 0x00000057, 0x0000004D, 0x00000053, 0x0000007B, 0x00000060, 0x00000064, 0x00000066]
for i in range(len(enc)):
    if i&1!=0:
        enc[i]+=i
    else:
        enc[i]^=i
print("".join(map(chr,enc)))

enc=[0x0000000E, 0x00000009, 0x0000000D, 0x0000000B, 0x00000014, 0x0000002E, 0x00000057, 0x00000031, 0x00000025, 0x00000045, 0x00000055, 0x00000041, 0x0000002C, 0x0000004C, 0x0000005B, 0x00000052, 0x00000055, 0x00000057, 0x0000005E]
key="hellohowareyouiamfinethi"
for i  in range(len(enc)):
    enc[i]^=ord(key[i])
print("".join(map(chr,enc)),end="")

data=[ord(i)^71 for i in "wpq~:"]
print("".join(map(chr,data)))
#flag{F8FD708C9238170769}
```

