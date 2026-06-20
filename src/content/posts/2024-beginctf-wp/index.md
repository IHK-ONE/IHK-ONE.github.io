---
title: '2024 BeginCTF Writeup'
description: '对照 a 的加密流程进行解密'
pubDate: 2024-04-10
author: 'IHK-1'
tags: ['CTF', 'BeginCTF', '2024']
---

# MISC
---

## Tupper
```python
import base64
import os

path = r'C:\Users\HK\Desktop\BeginCTF\tupper'
dirlist = os.listdir(path)
filelist = {}

for file in dirlist:
    tmp = path + f'\{file}'
    filelist[int(file.split('.')[0])] = tmp

base = ''
for num in sorted(filelist.keys()):
    base += open(filelist[num]).read()

print(base64.b64decode(base).decode())

# 14278193432728026049298574575557534321062349352543562656766469704092874688354679371212444382298821342093450398907096976002458807598535735172126657504131171684907173086659505143920300085808809647256790384378553780282894239751898620041143383317064727136903634770936398518547900512548419486364915399253941245911205262493591158497708219126453587456637302888701303382210748629800081821684283187368543601559778431735006794761542413006621219207322808449232050578852431361678745355776921132352419931907838205001184
```

Tupper绘图

<!-- 这是一张图片，ocr 内容为：GRAPH K+17 106 UNCTIONS TIONS AND NUMBER TO GRAPH GRAPH TO NUMBER NUMBER 17843173500879478164241300863133352073288084492320505050505331361078745355778821133524199319078305001 -->


## devil's word
```python
import binascii

strings = open(r"C:\Users\HK\Desktop\BeginCTF\devil's word\devil's word.txt").read().split(' ')
dict = {
    'leng': '0',
    'lia': '2',
    'sa': '3',
    'sii': '4',
    'ng': '5',
    'leu': '6',
    'cai': '7',
    'bo': '8',
    'jau': '9'
}
data = ''
for word in strings:
    data += dict[word] if (word in dict) else word

print(binascii.unhexlify(data).decode())

# begin{y0u_kn0w_w3nzhou_di4lect}
```

## 下一站上岸
<!-- 这是一张图片，ocr 内容为：SDY 5 10 13 17 16 14 20 22 19 25 26 27 28 30 2 32 35 36 31 14C -->


```plain
# 一个交点 = '.'
# 两个交点 = '-'
# 无交点 = ' '

# --. --- ..--.- .- ... .... --- .-. . > go_ashore

# begin{go_ashore}
```

## 你知道中国文化嘛1.0
```plain
# 替换字符
# 得到替换字符的具体思路是将社会主义核心价值观进行八卦加密，然后进行base32，再与原文对比得到替换字符
'$': 'S',
'&': '7',
'@': '2'

# base32解码
4KMLHYUYWTRJRNP...FGFQ4KMLFYUYWDRJRN > ☳☴☵☲...☵☲☱☱

# 八卦解码（随波逐流）
☳☴☵☲...☵☲☱☱ > 公正文明公正和谐公正平等文明友善法治和谐法治公正文明公正平等公正平等和谐爱国公正平等和谐和谐公正自由和谐爱国和谐富强和谐爱国公正公正公正和谐公正法治公正平等公正自由文明诚信和谐和谐文明公正平等公正公正和谐敬业和谐自由公正公正法治友善法治公正敬业法治友善平等公正民主和谐法治文明诚信和谐和谐民主和谐爱国文明诚信和谐和谐民主和谐文明公正友善爱国和谐爱国和谐民主公正和谐公正平等

# 社会主义核心价值观解码
公正文明公正和谐公正平等文明友善法治和谐法治公正文明公正平等公正平等和谐爱国公正平等和谐和谐公正自由和谐爱国和谐富强和谐爱国公正公正公正和谐公正法治公正平等公正自由文明诚信和谐和谐文明公正平等公正公正和谐敬业和谐自由公正公正法治友善法治公正敬业法治友善平等公正民主和谐法治文明诚信和谐和谐民主和谐爱国文明诚信和谐和谐民主和谐文明公正友善爱国和谐爱国和谐民主公正和谐公正平等 > bce-7bee8e3d808fcged-2ef94f}i{a7-18-12n81ce

# 栅栏密码
bce-7bee8e3d808fcged-2ef94f}i{a7-18-12n81ce > begin{eec8da87-ee32-11ed-8f8c-907841e2ffbc}

# begin{eec8da87-ee32-11ed-8f8c-907841e2ffbc}
```

## where is crazyman1.0
<!-- 这是一张图片，ocr 内容为：高额 GUPOKAN 秋菜原店 5F.6F 超巡 洋肥 CV:谷隆孕聚 WUR更连锁 HOVONERST CV:颜颜康心高 良精度 AMIAMI, 原制:25 25 21NDOWS 155 双仆力多! LOT HOME LTAXFREE 理王 大黑屋 &翼取 40 千勺夕卜 COMIC ZIN -->


```plain
看着就像秋叶原
begin{秋叶原}
```

## where is crazyman2.0
<!-- 这是一张图片，ocr 内容为： -->


<!-- 这是一张图片，ocr 内容为：GOOGLE 查找图片来源 FACEBOOK VISIT SAUDI #PIRATES #LIVE #SHOW INSTAGRAM MEGAN YEE ON INSTAGRAM:THE DAY I... JAMPER JAMPER LL 新浪 AMAZING RIDES... 借过的11个酒店SHOW.. ACEBOOK GARDA TRAVEL CLUB PINTEREST YOUTUBE PIN BY VONNIE MADDOX ON PLACES T VE BEEN | ... RLYADH BOULEVARD WORLE INSTAGRAM TUJ STUDENT ENGAGEMENT... 知乎 迪士尼攻暗--娱乐项目 篇~知乎 搜索 文字 翻评 国际报觉得这些搜索结果有用吗? 没用 有用 -->


```plain
# https://arabsstock.com/en/videos/clip-162878-spending-enjoyable-time-getting-know-civilizations-entertainment

begin{Boulevard World}
```

## where is crazyman3.0
<!-- 这是一张图片，ocr 内容为：爽 BOUDLU STARBUCKS STARBUCKS -->


```plain
# google关键词 "BOUDL" "STARBUCKS" "5 min walk"
# Boudl Al Munsiyah Hotel
# Starbucks 
# 最新评论 YmVnaW57R29vZ2xlX21hcF9pc191c2VmdWxfYW5kX25vdF9mb3JnZXRfY29tbWVudH0=

begin{Google_map_is_useful_and_not_forget_comment}
```

# Forensics
## beginner_Forensics!!!!
```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# Batch Decryption 202009 (BatchEncryption Build 201610)
#

import os


def decryption(data):
    if not (data[0] == 0xFF and data[1] == 0xFE):
        print('Batch decryption bom error!')
        return
    if str(data[2:9], encoding="utf-8") != ' &cls\r\n':
        print('Batch decryption cls error!')
        return
    if str(data[9:60], encoding="utf-8") != '::BatchEncryption Build 201610 By gwsbhqt@163.com\r\n':
        print('Batch decryption build error!')
        return

    vars = {}

    # decryption line
    i = 60
    l = len(data)
    while i < l:
        i = run(vars, data, i)


def run(vars, data, i):
    buf = ''
    f = 0
    t = 0
    x = False
    l = len(data)
    while(True):
        if data[i] == 0x0d and data[i+1] == 0x0a:
            i += 2
            break
        # get %var:~x,y% %0
        if data[i] == 0x25:
            if not x:
                x = True
                f = i
            else:
                x = False
                t = i
                rst = var_percent(data[f:t+1], vars)
                buf += rst
        else:
            if not x:
                buf += str(data[i:i+1], encoding="utf-8")
            else:
                if (f + 1 == i) and ((data[i] >= 0x30 and data[i] <= 0x39) or data[i] == 0x2a):
                    x = False
                    t = i
                    rst = str(data[f:t+1], encoding="utf-8")
                    buf += rst
        i += 1
        if i >= l:
            break
    #
    print(buf)
    bufs = buf.split('&@')
    for var in bufs:
        if var[0:4] == 'set ':
            var = var[4:]
            b = var.find('=')
            vars[var[0:b]] = var[b+1:].replace('^^^', '^')

    return i


def var_percent(data, vars):
    full = str(data, encoding="utf-8")
    buf = full[1:len(full)-1]
    buf = buf.split(':~')
    var = buf[0]
    if not var in vars:
        vars[var] = os.getenv(var)
    ent = vars[var]
    if (len(buf) > 1):
        l = len(ent)
        buf = buf[1].split(',')
        f = int(buf[0])
        t = int(buf[1])
        if f < 0:
            f, t = l + f, t
        rst = ent[f: f+t]
    else:
        rst = full
    return rst


encrypt_file = r"C:\Users\HK\Desktop\BeginCTF\beginner_Forensics!!!\forensics"

if __name__ == '__main__':

    try:
        file = open(encrypt_file, "rb")
        data = file.read()
    except Exception as err:
        print('Batch decryption read error:', err)
        exit
    else:
        file.close()

    decryption(data)


# set find_me_pls = b@TcH_O8FU$c@T1on_15_e@SY_70_SO1vE
# begin{b@TcH_O8FU$c@T1on_15_e@SY_70_SO1vE}
```

## dump dump dump
```plain
# strings dumpv1.DMP | grep 'a = '
>
a = beginctfisnice.func_readfile("my_first_beginctf_flag.txt")
aaa = beginctfisnice.func_aes(aa,1)
aaaa = beginctfisnice.func_special_base64(aaa,"ZzYyXxAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWw0123456789+/")
aa = beginctfisnice.func_xor(a.decode(),"PYThoN_For3N5IC$_i5_r3aL1Y_w0nDERfu1")

# strings dumpv1.DMP | grep "b'"
>
b'CsQ5vL6LTwtgKyW0bdZKhpN1S/OqiLwI++G1cPD5SfhA0EkXej7RIBk1z9/8mm7fjzE5+THCsGJPOJXRp7JQa18juUtswBQguYi4e2TAHIT='

# aeskeyfind dumpv1.DMP
>
0eeac3e32b31444ab244a415b275b7f7
```

对照 a 的加密流程进行解密

<!-- 这是一张图片，ocr 内容为：LENGTH:108 RECIPE LINES: CSC5ULSLTNEGSYN86DZSHPLI5/OGILUL++6ICPOSSFHABEXEJ7RIBKIRKIRS FROM BASE64 IF THE CURRENT BYTE IS ALPHABET ZZYYXAABBCCDDEEFFGGHHIIJJKKL1MMNNOOPPOQRRSSTTUUVVVWW01234567.. STRICT MODE REMOVE NON-ALPHABET CHARS INPUT DIFFERENTIAL - KEY IS SET TO THE AES DECRYPT KEY HEX 0EEAC3E32B31444AB244A415B275B7F7 IV HEX+ OUTPUT INPUT MODE ECB/NOPADDING RAW RAW XOR UTF8* PYTHON_FOR3N5IC$_I5_R3AL1Y_WONDERFU1 OUTPUT SCHEME BEGIN(DID YBU LIK3 THIS PYTHON FER3NSICS AND USING FIND4ES TO GOT THE KEY!YHON F NULL PRESERVING STANDARD -->


```plain
begin{DId_y0U_L1k3_thIs_PyThON_F0R3n$1cs_aND_U5IN6_FInD4eS_T0_got_ThE_Key!}
```

## dump dump dump 2.0
```plain
# strings dumpv2.DMP | grep 'a = '
>
a = beginctfisnice.func_readfile("my_second_beginctf_flag.txt")
aaa = beginctfisnice.func_aes(aa)
aa = beginctfisnice.func_xor(a.decode(),"How_@8OuT_53CONd_PARt_0F_FoR3n5ICS!")
aaaa = beginctfisnice.func_special_base64(aaa,"ZYXABCDEFGHIJKLMNOPQRSTUVWzyxabcdefghijklmnopqrstuvw0123456789+/")
aaaa = beginctfisnice.func_special_base64(aaa,"ZYXABCDEFGHIJKLMNOPQRSTUVWzyxabcdefghijklmnopqrstuvw0123456789+/")

# strings dumpv2.DMP | grep "b'"
>
b'NhCMHiPvC2WWk3/OxNU10e8yrNm/mR8t3+9PsE9ALnT2xsGFg/dKVUwoU3Egv0lR'

# aeskeyfind dumpv2.DMP
>
c4daabe0a20a9e26ef2ba0833b2cc2e7
```

先以 00 填充 iv ，结合 a 的加密流程进行解密

<!-- 这是一张图片，ocr 内容为：RECIPE INPUT NHCMHIPVC2WWK3/OXNU10E8YRNN/MR8T3+9PSE9ALNT2XSGFG/DKVUWOU3EGVE1 OI FROM BASE64 ALPHABET ZYXABCDEFGHIJKLMNOPORSTUVWZVXABCDEFGHIJKIMNODARSTUVW01234567... STRICT MODE REMOVE NON-ALPHABET CHARS AES DECRYPT KEY HEX C4DAABE0A20A9E26EF2BA0833B2CC2E7 HEX 0000000000000000000000000000000 MODE INPUT OUTOUT CBC RAW RAW 01 XOR KEY UTF8 HOW_@80UT 53COND PART OF FOR3N5ICS! OUTPUT AOA.O!QO;O..IAI'UMPV2_AND USING_CBCJOW_@80UT_53C SCHEME NULL PRESERVING STANDARD -->


手动修改 iv 

<!-- 这是一张图片，ocr 内容为：NHCMHIPVC2MUK3/OXNU10E8YRNM/MR8T3+9PSE9ALNT2XSGFG/DKVUWOU3EGVELR FROM BASE64 ALPHABET ZYXABCDEFGHIJKLMNOPORSTUVWZVXABCDEFGHIJK1MNOPGRSTUVV01234567.. STRICT MODE REMOVE NON-ALPHABET CHARS AES DECRYPT KEY HEX C4DAABE0A20A9E26EF2BA0833B2CC2E7 IV HEX A2B38779980000000000000000000000000000000 MODE OUTOUT INPUT CBC RAW RAW O. XOR KEY UTF8 HOW @80UT 53COND PART OF FOR3N5ICS! OUTPUT SCHEME BEGIN!QO;0..IAI'UMPV2 AND US1NG_CBCJOW_@80UT_53C NULL PRESERVING STANDARD -->


当凑齐 begin 头时 iv 为 a2b3877998 ，在010中以16进制搜索该字节

<!-- 这是一张图片，ocr 内容为：天下沙8下汗X8878888开开下提 KHAGK汗850KG088%9% 比比8龙比比比800比808比比比比比 PAGMANG 126:CB10H: .PAB.  00斤比 000000 :02 00 00 00 S斤080斤8 888888比28888888888882 HAG80年080 953888斤M588088899 126:CB20H:00 00 00 B387 7998 YYYYYYYYCATY 6100 126:CB30H: 5A 25 BF Z%I.ZGCC.I.A.C_ 53 5F 00 8 2E 6C979B 5 73 126:CB40H:61 65 AES.0 M.....OL 0  50 00000000 126:CB50H:02 00 5 000 FF DA AB EO A2 126:CB60H:00 00 @+F:AC.BUI 5F62 E 26 EF 126:CB70H:OA 9E 69 75 73 00 000000 4696E 00 126:CB80H:6C 74 ITINS 126:CB90H:00 00 00 00 00 00 0000 0000 00  02 126:CBAOH: 00 00 00 BO DB 00000000 88888888 EO CB9C992E 126:CBBOH:00 00 25 9C FO 6B 97 9B 2E 126:CBCOH:0000000 00 000000000 0000000 00 126:CBDOH:02 00 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 0000070 DO 126:CBEOH:00 00 00000000 000 0 D6 126:CBFOH:00000400 08 000000B7 01 126:CC00H:00 00 00 CO 00000000 126:CC10H:00 00 00 60 AC 96 AC 00000 00 126 CE20H AA AA AA 64 75 00 AE VV 模板结果-MINIDUMP.BT 名称 开始 大小 注释 颜色 OH 20H HEADER FG: BG: DIRECTORY[15] B4H 20H FG: BG: THREAD LIST C4H 660H FG: BG: 724H 10CH THREAD INFO LIST FG: BG: 830H 1294H MODULE LIST FG: BG: C26DH OH MEMORY64 LIST FG: BG: 查找结果 信 地址 已找到1个'A2B3877998. 126CB2BH A2B3877998 -->


得到 iv 为 a2b38779985a25bfec905a67809790ec

补全 iv 进行解密

<!-- 这是一张图片，ocr 内容为：INPUT RECIPE NHCMHIPVC2WNK3/OXNU10E8YRNM/MR8T3+9PSE9ALNT2XSGFG/DKVUWOU3EGVELR FROM BASE64 ALPHABET ZYXABCDEFGHIJKLMNOPORSTUVWZYXABCDEFGHIJKIMNOPQRSTUVW01234567... REMOVE NON-ALPHABET CHARS STRICT MODE AES DECRYPT KEY HEX C4DAABE0A20A9E26EF2BA0833B2CC2E7 IV HEX A2B38779985A25BFEC905A67809790EC MODE OUTPUT INPUT CBC RAW RAW I XOR KEY UTF8 HOW @80UT 53COND PART OF FOR3N5ICS! OUTPUT SCHEME BEGINFTIME_FOR DUMPV2_AND US1NG_CBCJOW_@80UT_53C NULL PRESERVING STANDARD -->


```plain
begin{tiME_fOr_DUMpV2_AND_Us1ng_Cbc}
```

## dump dump dump 2.5
还是上题的思路，但是iv被出题人以00填充了，需要进行 CBC 字节翻转攻击

```python
# uBLJX+/zmxZn6oKVymM7t4HbVEiBvv7+kFKf/DZNHkQxF1wC0L1f4DmP5O5GO/H2HfrI+W3SdtSGJKSjVM+qO50SSxpVIJ4YTrE2r/V7bj0=
# key：0e805c9b86ff8c94ca68a3a5ad8f2836
# iv：3c473e98356000000000000000000000
# XOR：T1me_For_5ecOnD_P4R7_of_thE$E_FOREN$ICs_hoPe_no_fOr3NSC15
```

## <font style="color:rgb(0, 0, 0);">饥渴C猫 is hacker!</font>
```plain
# https://github.com/JPaulMora/Duck-Decoder
python2 DuckDecoder.py decode payload.bin

begin{this_file_is_called_inject_bin_hope_you_like_it!}
```

## 学取证咯 - cmd
```plain
volatility.exe -f 学取证咯.raw imageinfo
volatility.exe -f 学取证咯.raw --profile=Win7SP1x64 cmdscan

flag{Cmd_1in3_109_i5_imp0rt@nt}
```

## 学取证咯 - 还记得ie吗？
```plain
volatility.exe -f 学取证咯.raw --profile=Win7SP1x64 iehistory

flag%7BY0v_c@n_g3t_th3_i3hi5t0ry%7D
flag{Y0v_c@n_g3t_th3_i3hi5t0ry}
```

## 学取证咯 - 计算机的姓名？
```plain
vol.py -f 学取证咯.raw --profile=Win7SP1x64 mimikatz

VVHATI5Y0VRNAM3
```

## 学取证咯 - 想登入我的计算机吗
```plain
vol.py -f 学取证咯.raw --profile=Win7SP1x64 mimikatz

flag{Mimikatz_0r_j0hn}
```

## 学取证咯 - 机密文件
```plain
vol.py -f 学取证咯.raw --profile=Win7SP1x64 filescan | grep '机密'
0x000000001e742dd0 3 1 R--rw- \Device\HarddiskVolume1\Users\yuren\Desktop\机密文件.docx

vol.py -f 学取证咯.raw --profile=Win7SP1x64 dumpfiles -Q 0x000000001e742dd0 -D ./

flag{Y0v_c@n_d0vvn_th3_fi13}
```

## 学取证咯 - 真的是取证吗？
```plain
vol.py -f 学取证咯.raw --profile=Win7SP1x64 filescan | grep 'flag'
0x000000001e9d8070 4 0 R--r-d \Device\HarddiskVolume1\Users\yuren\Desktop\flag_is_here.exe

vol.py -f 学取证咯.raw --profile=Win7SP1x64 dumpfiles -Q 0x000000001e9d8070 -D ./
```

脱入 IDA 32 ，选择字串 'FLAG' ，Ctrl + X 定位，F5反编译

<!-- 这是一张图片，ocr 内容为：IDA-FILE.EXE CAUSERSTHK.DESKTOP\FILE.EXE 文件编辑 肯假 制转 搜索 视国 调过等 LUMINA 查口 帮助BINDIF 日 动物馆 南风胜 需钢烫故 外部符号 国 西 园 区 区 字串 HEX  VI EN-L 出口 地方 光明 所 招款名称 1IBGE_A_OX2-1.012 00000013 / SUB_401000 00000016 GUB_4011B0 00000018 DEREGIATOR_FRANO_INTO RDATA.0 LIBGAJ-16.D21 RDAT.0 GTAZT RDAT.A-0 7 SUT-201320 -RDATA:0 000000008 &UB_401430 ,RDATE:0000000018 WING&RUNTINE FAILERE SGGSSSGSSSSSSGGGTSSGTSSTTRTTTTTTTTTTRTTARSSSSS &UB_401320 ,RDATA:0- 00000026 THICNCOM PAEADE RELOCATION BIT AISE SD.IN AUB_401BA0 GLOB-1.0-MINGX32 TLACAL1BACK.1 -RDATA:0000000007 1 GUB-4018181 UNFINITY GUB_601F30 -RDATA:0- 000000 7 EUB EOZAFI -RDATE:00000000006 (GNG) 6.3.0 -RDATA:0000000011 GCO COC  O PHINGING COC-6.3.0-1)6.3.0 SUB-4023010 GCC (GM() 6.3.0 6.3.0 0238-4023&0 -RDATA:0000000011 C 8UB_403350 &UB_403590 888888888888 NUN) 6.3.0 20B-409430 8UB_40948 RDATA:Q-A DOOL  GOE GOE:CEXEDE:CEXE 6.3.0 6.3.0 6.3. RDATA:0-00000011 CCC  CCC:(CMD) 6.3.0 (GND) 6.3.0 6.3.0 2UB_409480 3.3.0 (GKI) 8UB-409488 AUB_409490 行6/51 能量:40GB -->


<!-- 这是一张图片，ocr 内容为：销保副转按宋视回调过路 文件 帮助 BINDIH LUMINA 选项 进口 日期 中叶一个的名 无调试器 AO A 南极做 外部符号 字晶 INT V6J F/[ESP478H] [EBP-1EH] 899 回款名称 SESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSESSSSSSSSSSSSSSSSSESTA / SUB_401000 AUB_4011B0 4 * (((V1 - V2 + 41) & OXFFFFFFC) >) 2)); 牛肉 7 SUT-201320 &UB_,401430 &UB_401320 AUB_401BA0 TLACALLBACK.1 TLACALLBACK_0 1 GUB-4018181 GUB_601F30 7 EUB EOZAFI SUB-4023010 0238-4023&0 8UB_403350 &UB_403590 20B-409430 8UB_40948 09430(*FLAG KEY") ( V6) V5*CBYTE)(V6+2)3 2UB_409480 SUB_4094A8(V3); 8UB_409-688 V4 SUB 409450(V3); 8UB_409490 FOR (I - 03 +4 ) 0000093A   401060:460:46 (40153A) -->


根据数据 逆向出key

<!-- 这是一张图片，ocr 内容为：RECIPE OPERATIONS INPUT 31  21 O TO HEX URL DECODE TO HEX FROM DECIMAL PEM TO HEX DELIMITER SUPPORT SIGNED VALUES SPACE TO HEXDUMP TO HEX CONTENT XOR KEY OBJECT IDENTIFIER TO HEX UTF8 F1AG FAVOURITES SCHEME NULL PRESERVING STANDARD DATA FORMAT ENCRYPTION/ENCODING TO HEX PUBLIC KEY DELIMITER BYTES PER LINE R SPACE ARITHMETIC/LOGIC NETWORKING OUTPUT 79 79 LANGUAGE -->


```python
data = [31, 21, 24, 30, 2, 32, 73, 15, 38, 17, 57, 15, 74, 38, 21, 74, 57, 11, 23, 74, 29, 38, 17, 73, 15, 15, 38, 13, 73, 38, 31, 73, 11, 74, 23, 76, 16, 26, 76, 4, ]

def xor(num):
    return chr(num ^ 0x79)

print(''.join(map(xor, data)))

# flag{Y0v_h@v3_l3@rn3d_h0vv_t0_f0r3n5ic5}
```



