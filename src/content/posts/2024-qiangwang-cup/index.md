---
title: '2024 第八届强网杯 Writeup'
description: '百度识图推荐关键词得到'
pubDate: 2024-11-03
author: 'IHK-1'
tags: ['CTF', '强网杯', '2024']
---

# givemesecret - solved

# Master of OSINT - solved
(1.10)

百度识图推荐关键词得到

对青海公路进行沿路搜索，筛选路旁只有一座红顶小房子的地段

青海湖公路 99.974883,36.667511

(2/10)

对右侧市场的三个招牌搜索 百安居 迪卡侬 金海马

最开始不知道 金海马是什么，然后换百度找到了这个金海马家具城

直接按照推荐的 金海马家具城 搜索，结合百安居 

结合高架得到

百安居(龙阳店) 121.566122,31.211341

(3/10)

对塔台与航站楼裁切 google 识图 得到

[https://www.jetphotos.com/photo/9217879](https://www.jetphotos.com/photo/9217879)

对航站楼与塔台角度，推测出拍摄地点走向，对比周围多个十字路口，最终在第一个十字路口确定位置

成都双流国际机场 103.964804,30.571964

（4/10）

浙通物流、高铁与高速交汇、IKEA，对浙江宜家多次搜索得到

[https://www.ikea.cn/cn/zh/stores/](https://www.ikea.cn/cn/zh/stores/) 其中浙江只有两个宜家，结合高架路，最终确定为杭州宜家

宜家家居(杭州商场店) 120.293495,30.346228

（5/10）

地理环境推测为+ 黄色出租车 + 绿色公交车 推测为 重庆 

且有新建商场

对重庆新建商场搜索

结合轻轨与高架平行，确定

重庆万象城二期 106.524302,29.526687

（6/10）

高速侧旁有琉璃塔，对塔裁切搜索得到 大报恩寺

结合高速分析，旁边为隔音墙尽头

大报恩寺遗址 118.783731,32.01332

（7/10）

对桥头建筑裁切搜索得到

结合旁边为下桥路段

橘子洲 112.969032,28.201596

（8/10）

跨海大桥 风电场

搜索得到一个类似的 东海大桥 没写出来

（9/10）

百度识图桥建筑得到

结合在两桥建筑中央，得到

武汉天兴洲长江 114.41167,30.662237

# Master of DFIR - Phishing -solved
(1/13) 攻击者的邮箱是什么? (注意:MD5(攻击者邮箱),以cyberchef的为准) 示例:9b04d152845ec0a378394003c96da594

a8cd5b4ba47e185d4a69a583fde84da5

(2/13) 攻击者所投放的文件md5是什么? (注意:以md5sum的结果为准) 示例:33ec9f546665aec46947dca16646d48e

f436b02020fa59f3f71e0b6dcac6c7d3

(3/13) 攻击者所使用的攻击载荷文件windows默认的打开方式的全称是什么? 示例:Microsoft Windows Based Scripting Host

Microsoft Management Console

(4/13) 攻击者所投放样本的初始执行语句在该攻击载荷文件的第几行? 示例:20

97

(5/13) 经过初始执行后,攻击者所加载的第二部分载荷所使用的语言是什么? 示例:javascript

VBScript

(6/13) 攻击者所进行的第二部分载荷其将白EXE存在了什么地方? (注意:需要提供完成的解混淆后的第二部分载荷s*******s函数的参数) 提交需要MD5(参数内容) 以Cyberchef结果为准 示例:9b04d152845ec0a378394003c96da594

selectNodes 函数，对应三次调用以及解混淆

```plain
/MMC_ConsoleFile/BinaryStorage/Binary[@Name='CONSOLE_TREE']
/MMC_ConsoleFile/BinaryStorage/Binary[@Name='CONSOLE_MENU']
/MMC_ConsoleFile/BinaryStorage/Binary[@Name='CONSOLE_PANE']
```

/MMC_ConsoleFile/BinaryStorage/Binary[@Name='CONSOLE_MENU']

69b23cfd967d07c39d1517e2a3c37e34

(7/13) 攻击者使用的这个白EXE加载黑DLL的手法所对应的MITRE ATT&CK ID是什么? (注意:请注意示例的提示提交大类即可不需要细化到分项) 示例: T1000

分析 CONSOLE_MENU 的 GUP.exe 文件

依次从 T1000~T10000 进行爆破，在 T1574 提交成功

T1574

(8/13) 攻击者所使用的黑DLL劫持了原始DLL的哪个函数? 示例: main

IDA 中导出所有 函数，进行爆破依次进行提交，curl_easy_init 提交成功

(9/13) 攻击者所使用的黑DLL解密下一阶段载荷所使用的Key是什么? (注意:请提交一段小写的十六进制字符串) 示例:1122334455

逆向手对 dll 进行逆向分析，在 sub1240 发现 RC4，其中 v41 为 RC4 的 key

f21a9d8b1e5d

(10/13) 攻击者所使用的下一阶段载荷的回连C2是什么? (注意:需要提供ip地址:端口的形式) 示例:127.0.0.1:5100

在微步云沙箱中分析，其中有网络行为对 192.168.57.119:6000 链接

192.168.57.119:6000

(11/13) 攻击者所使用最终阶段载荷所使用的加密算法是什么? 示例:DES

猜测为 AES，使用 dount-decryptor 对对流量中 ip.src == 192.168.57.119 进行分析 ，shellcode 解密在后续分析中也可印证

AES

(12/13) 攻击者所使用最终阶段载荷所使用的密钥的MD5是什么? (注意:MD5(密钥内容),以cyberchef的为准) 示例:9b04d152845ec0a378394003c96da594

对长度为 16 的字符串进行爆破

```python
import hashlib

for line in open("all_strings.txt").readlines():
    line = line.strip()
    try:
        key = line.split("\t")[3]
        if len(key) == 16:
            print("[+] key:",key)
            print("[+] md5:",hashlib.md5(key.encode()).hexdigest())
    except:
        pass
```

依次尝试提交后获得 key

```plain
pJB`-v)t^ZAsP$|r
a524c43df3063c33cfd72e2bf1fd32f6
```

(13/13) 攻击者使用了什么家族的C2? 示例:PoshC2

对 Github C2 Most STAR 项目进行排序，依次尝试提交

# 谍影重重 5.0 - solved
分析 SMB 协议，构造 hashcat

```plain
username::domain:ServerChallenge:NTproofstring:modifiedntlmv2response

Domainname: .
Username: tom
ServerChallenge: c1dec53240124487
NTproofstring: ca32f9b5b48c04ccfa96f35213d63d75
modifiedntlmv2response: 010100000000000040d0731fb92adb01221434d6e24970170000000002001e004400450053004b0054004f0050002d004a0030004500450039004d00520001001e004400450053004b0054004f0050002d004a0030004500450039004d00520004001e004400450053004b0054004f0050002d004a0030004500450039004d00520003001e004400450053004b0054004f0050002d004a0030004500450039004d0052000700080040d0731fb92adb0106000400020000000800300030000000000000000100000000200000bd69d88e01f6425e6c1d7f796d55f11bd4bdcb27c845c6ebfac35b8a3acc42c20a001000000000000000000000000000000000000900260063006900660073002f003100370032002e00310036002e003100300035002e003100320039000000000000000000

tom::.:c1dec53240124487:ca32f9b5b48c04ccfa96f35213d63d75:010100000000000040d0731fb92adb01221434d6e24970170000000002001e004400450053004b0054004f0050002d004a0030004500450039004d00520001001e004400450053004b0054004f0050002d004a0030004500450039004d00520004001e004400450053004b0054004f0050002d004a0030004500450039004d00520003001e004400450053004b0054004f0050002d004a0030004500450039004d0052000700080040d0731fb92adb0106000400020000000800300030000000000000000100000000200000bd69d88e01f6425e6c1d7f796d55f11bd4bdcb27c845c6ebfac35b8a3acc42c20a001000000000000000000000000000000000000900260063006900660073002f003100370032002e00310036002e003100300035002e003100320039000000000000000000
```

使用 hashcat 5600 进行爆破 babygirl233

```plain
hashcat -m 5600 hash rockyou.txt --> babygirl233
```

对 SMB2 解密 [https://github.com/jozwikaleksander/smb-sessionkey-gen](https://github.com/jozwikaleksander/smb-sessionkey-gen) 生成 SMB的 Session key

```plain
SessionId: 0900000000100000
SessionKey: a3abe4d64394909a641062342ffe291b
```

导入 session key 后解密 SMB

其中有 flag.7z、Desktop_0_DESKTOP-J0EE9MR.der、Desktop_0_DESKTOP-J0EE9MR.pfx 三个文件可读

将文件dump下来后，分析 der 与 fpx 证书的作用，需要将其转换为 PEM 解开 RDP 流，参考文章 [https://res260.medium.com/ihack-2020-monster-inc-the-middle-rdp-network-forensics-writeup-91e2fb0f4287](https://res260.medium.com/ihack-2020-monster-inc-the-middle-rdp-network-forensics-writeup-91e2fb0f4287)

同时尝试使用 openssl 转换为 key 的时候需要key

其中 key 需要进行爆破，使用 p12tool 项目进行爆破 [https://github.com/Ridter/p12tool](https://github.com/Ridter/p12tool) ，获得 key 为 mimikatz，参考文章导入 key 后，将 tls 流量转为 UDP ，有键盘扫描码 scancode，tshark 导出

```plain
tshark -r 'out.pcapng' -T fields -e "rdp.fastpath.scancode.keycode" > 'scancode.txt'
```

对  scancode 参照码表替换 [https://github.com/Lamer87/Keyboard_ScanCodes_for_remapping](https://github.com/Lamer87/Keyboard_ScanCodes_for_remapping)

```python
scancode_dict = {'02': '1', '03': '2', '04': '3', '05': '4', '08': '7', '09': '8', '0a': '9', '0b': '0', '0c': '-','11': 'w','12': 'e', '13': 'r', '14': 't', '17': 'i', '18': 'o', '19': 'p', '1a': '[', '1b': ']', '1c': '\n','1d': 'ctrl','1e': 'a', '1f': 's', '20': 'd', '21': 'f', '23': 'h', '28': "'", '2a': 'shift', '2c': 'z', '31': 'n','39': ' '}

scancode_list = []
output = ""

for line in open("out.txt").readlines():
    line = line.strip()

    if len(line) != 0:
        if "," in line:
            print(line)
        else:
            scancode_list.append(scancode_dict[line[2:]])

for i in range (0,len(scancode_list),2):
    output += scancode_list[i]
print(output)

# theshift 7z password is f'shift[windowsshift-passwordshift]9347013182'ctrls
# the 7z password is f'{windowsshift-password}9347013182'ctrls
```

将 Windows_Password 进行替换后得到 flag.7z 的密码

```plain
f'{windowsshift-password}9347013182
babygirl2339347013182
```

