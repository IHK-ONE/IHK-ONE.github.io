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

<!-- 这是一张图片，ocr 内容为：010 EDITOR-C\USERS\HK\DESKTOP\THECUTESTPEOPLE.JPG 脚本() 模板(L) 调试(D) 项目(P) 工具(T) 窗口(W) 帮助(H) 文件(F) 编辑(日) 搜索(S) 视图(V) 格式(O) 帮助(H) LL MOV HEX <>\ 工作区 THECUTESTPEOPLEJPGXOUT.RAR FLAGTXT 起始页 0 1 2 3 4 5 6 7 8 9 A B C D E F 0123456789ABCDEF . 路径 文件 EADA>%+D.>V.EOS E9 C4 FO EO 3E 88 BC 2B DO 15 3E 76 07 C8 D5 A7 1:7D10H 打开的文件 DALO...>.>...OA DO C4 7C F4 0B A8 FA 08 1F 3E 00 8F AO 81 F3 EO 1:7D20H C....P\ 1:7D30H .E#>Z.L.GI..C.0 03 E8 23 3E 7A 00 7D 08 67 CF 00 0F A2 01 F3 BO FLAG.TXT .YURAR!...3'UA 1:7D40H 1A 8F FF D9 52 61 72 21 1A 01 01 00 33 92 B5 E5 C....P\ OUT.RAR 0A 01 05 06 00 05 01 01 80 80 00 82 76 E1 24 1:7D50H EE.D,VAS THECUTE...PLE.JPG C....P\ 02 03 0B FF 01 04 91 02 20 B6 DE 96 7F 80 03 00 1:7D60H ..Y..'. FP-.E.. 项目 08 66 66 61 67 2E 74 78 74 0A 03 02 02 BG 9A F7 51 .FLAG.TXT...45-Q 1:7D70H 资< 工作区 项目 模板结果-JPG.BT 检查器 名称 类型 STRUCT JPGFILE JPGFILE 01010010 二进制 M_SOI(FFD8) ENUM M_ID SOIMARKER 有符号字节 82 STRUCT APP14 APP14 无信号字节 82 STRUCT APP1 APP1[0] 图可> 变量 检查器 输出 START OF LMAGE MARKER THUMBNAIL OFFSET 0X3B0 START OF LMAGE MARKER START OF SCAN MARKER END OF FILE LMAGE START OF SCAN MARKER END OF FILE LMAGE 执行搜扳'CRUSERSHKIDOCUMENTSISWEETSCAPERO1O TEMPLATESIREPOSTTORYRARBRYRARBR 于CJUSERSIHKIDESKTOPLOUTRAR... *ERROR LINE 328:自定义属性"FORMAT"的值不被支持. 套输出 多文件中查找 查找结果 直方图 校验和 WOV 反汇编器 比较 进程 见插入 位置:97604[17D44H] 值:82 52H 大小:97,931 十六进制(H)ANSI小端 文件'C:USERS\HK\DESKTOP\THECUTESTPEOPLEJPG' 已打开. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1726927714419-cc31cfa6-18e0-4329-a6c9-13196e785464.png)

解压出来的 flag 进行 reverse 拿到一个 zip，密钥为图片属性的 16进制解码，

最后直接 赛博厨子 magic 梭哈了

## re1
异或

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35534235/1726919211727-d921117b-5f0b-4374-a6c2-9bcd8f37277b.png?x-oss-process=image%2Fformat%2Cwebp)

## re2
esp定律脱壳

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35534235/1726919297062-20002ff4-4982-410d-ac79-24ca8b13ef36.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_750%2Climit_0)  
有smc，直接动调，发现一个异或

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35534235/1726919412664-a111e7f2-bad6-4a70-adaf-d8fc26beca15.png?x-oss-process=image%2Fformat%2Cwebp)  
第二段也是异或

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35534235/1726919442776-25bee7e6-877d-4d66-8bfc-f1689f0f1351.png?x-oss-process=image%2Fformat%2Cwebp)  


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

