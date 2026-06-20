---
title: '第四届网鼎杯 青龙组 Writeup'
description: '根据题目描述分理出 teid'
pubDate: 2024-10-29
author: 'IHK-1'
tags: ['CTF', '网鼎杯', '青龙', '2024']
---

# MISC1
根据题目描述分理出 teid

```plain
tshark -r UPF.cap -T fields -e gtp.teid > flag
```

尝试进行了去重，但是有两个流的 teid 有两个值，尝试对第二个值拼接即可

<!-- 这是一张图片，ocr 内容为：OX011001F7. 0X011006D. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730356192376-1b7411a2-b143-4302-a034-b2771d0e48da.png)

EXP：

```python
out = ""
for line in open('flag').readlines():
    line = line.strip()
    line = line.split(",")
    if len(line) == 2:
        out += str(int(line[1],16))

print(out)
```

# MISC2
对于加密代码，写出解密代码

```python
import binascii

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import struct

def unpad(text):
    return text.rstrip(b' ')

def decrypt(key, ciphertext):
    key_bytes = struct.pack('>I', key)
    key_bytes = key_bytes.ljust(16, b'\0')
    cipher = Cipher(algorithms.AES(key_bytes), modes.ECB(), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
    return unpad(decrypted_padded).decode()

if __name__ == "__main__":
    key = 1
    ciphertext = ""
    ciphertext = binascii.unhexlify(ciphertext)
    decrypted_msg = decrypt(key, ciphertext)
    print("Decrypted message:", decrypted_msg)
```

现在需要确定 AES 的密文与 key，其中 key 为整数，结合 GTP 与 MISC1 的出题，推测 key 依旧为 teid

现在尝试分析密文

<!-- 这是一张图片，ocr 内容为：WIRESHARK分组 1.GTP.CAP FRAME 1: 66 BYTES ON WIRE (528 BITS), 66 BYTES CAPTURED (528 BITS) (02:00:00:A9:D2:D4) ETHERNET II, SRC 02:00:00:F7:0D: INTERNET PROTOCOL VERSION 4, SRC: 13.254.241.150, DST: 13.254.239.201 USER DATAGRAM PROTOCOL, SRC PORT: 41928, DST PORT: 2123 GPRS TUNNELING PROTOCOL FLAGS:0X30 TYPE: ECHO REQUEST(0X01) MESSAGE TEID: 0X7092D32A (1888670506) UNKNOWN EXTENSION HEADER 0000 08004500 F7 D2 D4 00 0A9 00 PO 020000 AA 7F 5C F1 0010 960DFE 003E11 00340001000 OD FE 0020 3001 10 7092 00 EF C9 A3 C8 08 4B 00 20 6P AE  D3 2A 77 74 80 1E E3 13 60 ED E1 D8 22 39 18 75 0030 N6 DB 7A 0040 GPRS TUNNELING PROTOCOL (GTP),24 BYTE(S) SHOW PACKET BYTES 帮助 关闭 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730354454406-5a74374b-4abc-4d18-9f0b-f00a684700dc.png)

在 GTP 协议流中，每一段都有 冗余数据，手动一个一个分析，在 No.14 流中分析出结果

```plain
key: 0xe6xxxx
cipher: 8a20e63710701e48249decf74d3a902eb258c8a2ec1ee9ab5316a7f2306fef0f9d102429e7786182cbe469xxxxxxxxxx
```

带入解密代码得到 flag

# MISC3 ×
参考文章

1. [https://www.synacktiv.com/en/publications/php-filter-chains-file-read-from-error-based-oracle?ref=assetnote.io](https://www.synacktiv.com/en/publications/php-filter-chains-file-read-from-error-based-oracle?ref=assetnote.io)
2. [PHP Filter链——基于oracle的文件读取攻击 - “我不是二次元!”](https://m1racle-7.github.io/2024/10/07/PHP%20Filter%E9%93%BE%E2%80%94%E2%80%94%E5%9F%BA%E4%BA%8Eoracle%E7%9A%84%E6%96%87%E4%BB%B6%E8%AF%BB%E5%8F%96%E6%94%BB%E5%87%BB/)

# MISC4
all 文件中有三个二进制文件

<!-- 这是一张图片，ocr 内容为：010 EDITOR-C:\USERS\HK\DESKTOPLALL\1 ) 脚本U模板L)调试(D)项目(P) 工具O 文件() 编辑() 搜索(S) 视图W) 格式(O)  搜索(S) 视图W) 视图W)  视图W)  编辑(O)  编辑(@)  脚本 窗口W 帮助(H) LIGIURIS 一 MOV HEX 工作区 起始页 1 X 0123456789ABCDEF 0123456789ABCDEF 路径 文件 03040A0000000000000000B466EC58000000000 ........"FIX... 打开的文件 200000000000000000000000700000000616C 6C 6C 7A ....ALLZ 86970 2F 50 0304040A0A0A000000000000B466EC C.....八 'FI IP/PK.... X..ZSE`￥.. 458855A 6588A5 0088A501000000 8A ZIP.BT 31 31 2E 7A 69 70 4B .ALLZIP/11.ZIPPK 500616C 2F 70 7A69 项目 C.-FIXLJ60 603041400 00 9666EC584C4AF4D3 090063 收藏的文件 7 BE A4 00 1D OA 02 0600 0B 00312E70 00 竖+ 5800088M LDAUM83 004145030800EE6075 86E670199 最近的文件 G.TM....AE... NG. 9 7C EE 2E 63 BF LI.C*'Z￥.MO:1.0 98 13 99 F8 3B691FF5 工作区 曲项目 29 10 F1 47 F6 9D NGO."-C)8 2%OD 38995 32 BE D2 64 51 AF 31 C88A79 L,OAU-?!EIYI1ESY 11 4C 2C F5 65 CD DD CE CO 检查器 38   3F B9 15 F9 55 A5 E4 12 6A 65 JE￥A,(  TMA-1.UU F8 2A 63 5033969C 13 49 00 2C 2F I.,/TIIA>0*CP3-02 类型 8F7 1B E2 F3 21 69 0+JE?A.CE#-.EA6!I 14 D4 87 E9 4F HGG 90  E2 23 1682 05 20 1F 03  01111001 二进制 151101F85D :.0]-.AO .F#.. 4880 6D 60 DB OA 44 9UA.1.MU.SDSB.F 1639DBC114 9A DF 0F 46 有符号字节 121 5F 1125 5C 92  0F Z'EOXA,.E ,EW CA3DE957 17  5A 9 F4 39 D2 2B 3A 2B 7D 无符号字节 9368DAEO 1871 B0 E6 23 121 QA#9.0+:+X}"HUA MBEE 5C ED 78 EE 9B DD 86 AF 8A 1979 D0 34 7A D2845 YD4Z.SO./IXI,YT E1 58 F3 87 3 87 44 03 54 C6 6F 53 2F LE..AAX6+D.TEOS/ 1C9D 204CB 1 圈可 检查器 变量 460969CB 21 OA 6E 16 FE DCB72C5BC120FDO3E.DO3E.N.BAF.IERALA.D> 输出 模板执行成功. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730344465331-a77dbb8a-3f8c-462c-881c-0a5eba4f5f2c.png)

对 1 的文件头进行补齐zip header 504b ，此时再将文件后缀修改为 zip 打开，可以得到 11.zip

<!-- 这是一张图片，ocr 内容为：1.ZIP-BANDIZIP(STANDARD) 文件(F)编辑(E)查找(1)选项(O) 工具(T) 帮助(H) 视图(V) X 您想用BANDIZIP打开7Z文件吗? 三 测试 删除 添加 解压 查看 打开 代码页 新建 扫描 1.ZIP 压缩后大小 名称 ALLZIP 107.912 11.ZIP 文件:1,文件夹:0,压缩文件大小:143KB -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730344553050-3f88f9df-f449-4e57-8cf3-54d0af9bc75d.png)

进行掩码爆破

<!-- 这是一张图片，ocr 内容为：11.ZIP-BANDIZIP(STANDARD) 工具(T) 帮助(H) 选项(O) 视图(V) 文件(F)编辑(E)查找(0) X您想用BANDIZIP打开7Z文件吗? 三 添加 查看 删除 测试 打开 新建 解压 代码页 扫描 11.ZIP 压缩后大小 名称 107.710 11.PNG* @#QQQ0010FLAG 宋宋字 文件:1,文件夹:0,压缩文件大小:105 KB -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730344579296-7f551f39-62aa-4198-b747-8371d45af1c0.png)

<!-- 这是一张图片，ocr 内容为：ARCHPR 4.54-84% 文件(F)恢复(R)帮助(H) 打开 退出 升级 帮助 停止基准测试 关于 开始! 加密的ZIP/RAR/ACE/ARJ文件 攻击类型 掩码 C:\USERS HK DESKTOP 11.ZIP 口令已成功恢复! ADVANCED ARCHIVE PASSWORD RECOVERY 统计信息: 总计口令 8,457 总计时间 375MS 平均速度(口令/秒) 22,552 这个文件的口令 @#QQQ00010FIAG8456 十六进制口令 2140235151513030313066666610 确定 保存... 2024/10/31 11:17-开始揭询均项击 2024/10/3111:18-口令已成功恢复! 2024/10/311:16:18-!@#QQQ0010FLAG8456'是这个文件的一个有效口令 当前口令: 平均速度: 22,733P/S @#QQQ00010FLAG845 剩余时间: 已用时间: 口令长度18,总计:10,000,已处理:8,460 84% ARCHPR VERSION 4.54(C) 1997-2012 ELCOMSOFT CO.LTD. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730344594948-2354e30f-abdb-456e-ac48-876579cccc05.png)

再次使用 010 打开 11.png ，发现其实是 jpg 图片，修改文件后缀后，发现文件尾多了 PNG

<!-- 这是一张图片，ocr 内容为：010 EDITOR-C:/USERS\HKIDESKTOPLALI/11.JPG 调试(D) 项目(P) 工具() 窗口(W) 脚本(1) 文件(F) 编辑(E) 搜索(S) 视图(V) 格式(O) 模板(L) 帮助(H) 国中心之 MOY HEX <>叉工作区 起始页 1.ZIP 11.JPGX 0123456789ABCDEF 0123456789ABCDEF 路径 文件 8148 40 09 40 09 48 02 98 09 40 05 20 12 85 02 02 0A @.@.H.".@. 打开的文件 .(.(.P.@. 8149 00 28 01 28 18 50 01 40 05 00 14 00 01 48 02 8150 80 00 5A 00 4A 00 28 00 A0 02 80 12 90 09 40 C.....八 1.ZIP 8151 05 00 25 20 12 80 10 DO 30 AO 04 AO 02 80 0280 00 %.毛.D0 11JPG C:...八 8152 4A 00 28 00 A4 01 40 05 00 25 00 14 00 50 30 AO J.(.N.@......P0 C....Y ZIP.BT 8153 41 40 C2 81 05 00 7F D9 B9 50 4E 47 OD OD OA 1A YU&PNG. A@A, 项目 8154 OA 00 00 00 0D 49 48 44 52 00 00 03 20 00 00 00 01 IHDR. 8155 2C 08 06 00 00 00 D3 70 E9 A1 00 00 0C 5B 49 44 .OPEI 收藏的文件 [ID 8156 41 54 78 5E ED DD 41 6E 14 39 14 06 E 5 E0 CE 4D 10 ATXIYAN.9..AIM. 工作区 B1 85 35 82 OB 项目 8157 70 0C D8 07 60 11 58 B1 8 BO01 B1 P.0..'.X..... 01 5C 25 83 8158 26 5B 56 CO 11 80 25 20 4E 01 5 23 3D E4 &[VA.E% N.\%F#A 检查器 模板结果-JPG.BTC 值 类型 名称 二进制 10001001 CHAR SCANDATA[129807] 有符号字节 -119 M EOI(FFD9) 无符号字节 ENUM MID EOIMARKER 137 CHAR UNKNOWNPADDING[3220] 圈可 检查器 变量 输出 X START OF LMAGE MARKER COMMENT: GENERATED BY SNIPASTE START OF SCAN MARKER END OF FILE LMAGE 垂输出 多文件中查找 校验和 直方图 进程 查找结果 比较 WOY 反汇编器 见夏盖 十六进制(H)ANSI小端 选定:3220[C94H]个字节(范围:130441[1FD89H]到13 [1FD89H] 选定:3220[C94H]大小:133.661 133 开始:130441 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730344726426-1e044230-c6f3-42a2-a665-866ef824d3d1.png)

再次进行分离后，得到的图片是一张错误的图片，其中 CRC 错误，进行爆破宽高，计算出正确宽高为 620*92 ，修复宽高后拿到 flag第一部分

<!-- 这是一张图片，ocr 内容为：NALYSE.PY-A C:\USERS\HK\DESKTOP\ALL\11.PNG /PS C:\USERS\HK\PESKTOP\MISC> PYTHON C:\USERS\HK\DESKTOP\MISC\PICTURESIZEANALYSE.PY [FILEPATH]:C:\USERS\HK\DESKTOP\ALL\11.PNG [WIDTH]:620 [HEUGHT]:92 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730344838038-b7e40c5d-0877-42c8-974c-025c9acc74ed.png)

<!-- 这是一张图片，ocr 内容为：WDFLAG17898576 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730356080093-2391908d-1253-447b-b636-d9c752af92eb.png)

返回 1.zip 其还有 2.zip

<!-- 这是一张图片，ocr 内容为：010 EDITOR-C:/USERS (HKIDESKTOPLALI/1.ZIP 模板L)调 调试(D)工具(P)工具O 文件()  搜索(S) 视图W) 视图W 格式(@)  搜索(S) 视图W 窗口W) 帮助(H) 026004 010 十八美食心圈 MOV HEX <>`工作区 起始页 1.ZIP 0123456789ABCDEF 0123456789ABCDEF 文件 路径 16745 67 0A 00 20 00 00 00 00 00 01 00 18 00 1F 63 B4 B.OU 打开的文件 .C'U.OU.E; 16746 55 17 D4 DA 01 1F 63 B4 55 17 D4 DA 01 EA 3B B4 U.OU. C.....八 16747 55 17 D4 DA 01 01 99 07 00 01 00 41 45 03 08 00 1.ZIP 167485048050600000000000000010001006300630000000 PK.. ZIP.BT C....Y\ @#QQQ00010 6749 FD A4 01 00 12 00 21 40 23 51 51 51 3 5130303130 项目 大大大大 FLAG 16750 66 6C 61 67 2A 2A 2A 2A 50 4B 03 0A 0A 00 00 00 收藏的文件 PX 16751 00 00 03 A6 DE 58898 00 00 00 88 98 00 00 0C 00 16752 00 00 61 6C 6C 7A 69 70 2F 32 2E 7A 69 70 50 4B ALLZIP/ 最近的文件 0/2.ZIPPK 6753 03 04 14 00 00 00 08 00 A5 A5 DE 58 DE 58 E1 F1 D7 FC ￥天PXANXU 工作区 项目 6754 F8 97 00 FA 97 00 00 00 00 32 2E 70 6E -0 .2.PN DB 4E 3A 4E + MUN:N G.CESTDY 6755 67 1C 9C 53 74 64 DD 16 85 2B 检查器 模板结果-ZIP.BT. 值 类型 名称 二进制 01010000 STRUCT ZIPFILERECORD RECORD[O] ALLZIP/ 有符号字节 80 ALLZIP/11.ZIP STRUCT ZIPFILERECORD RECORD[1] 无符号字节 80 IP/2.ZIPPKOO STRUCT ZIPFILERECORD RECORD[2] 进驾车辆 4000A 圈可 检查器 变量 输出 X 执行模板 CJUSERSHKDOCUMENTSISWEETSCAPEL010 TEMPLATESIREPOSITORAZITORAZIP.BR 于'CLUSERSHKINDESKTOPLAIN1 *ERROR LINE 56:模板已通过变量'FREXTRAFIELD'的文件结尾. 模板执行成功. 垂输出 多文件中查找 查找结果 比较 直方图 进程 校验和 GOV 反汇编器 唱夏盖 位置:107992[1A5D8H] 值:80 50H大小:147,262 十六进制(H)ANSI小端 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730344933461-bc28a143-cf92-4b9d-b024-fbb88ccfcae0.png)

多次修复后未果，尝试直接手动分离出整个 2.zip

<!-- 这是一张图片，ocr 内容为：1.ZIP-BANDIZIP(STANDARD) 工具(T) 帮助(H) 视图(V) 文件(F)编辑(E)查找(1)选项(O) X 您想用BANDIZIP打开7Z文件吗? 三 添加 测试 打开 查看 删除 解压 新建 扫描 代码页 1.ZIP 压缩后大小 名称 粤2PNG 38.904 文件:1,文件夹:0.压缩文件大小:38.3 KB -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730344988821-babe07c2-e0ae-4f3c-bdc9-43712ace250b.png)

解压后拿到 尾部flag

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730356049992-124ac403-45af-43f2-a972-c58574fe63b8.png)

