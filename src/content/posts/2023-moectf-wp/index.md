---
title: '2023 MoeCTF 新生赛 Writeup（MISC/取证/杂项密码）'
description: '下载附件修复头文件（插入FF D8）'
pubDate: 2023-10-14
author: 'IHK-1'
tags: ['CTF', 'MoeCTF', 'MISC', '取证', '2023']
---

# MISC
## Misc入门指北
```plain
文章末尾 : bW9lY3Rme2hAdjNfZnVuX0B0X20xNWNfIX0=
base64 : moectf{h@v3_fun_@t_m15c_!}
```

## 打不开的图片1
下载附件修复头文件（插入FF D8）

文件后缀添加'.jpg'

```plain
文档属性：6d6f656374667b5844555f69355f763372795f3665407532696675317d
from hex : moectf{XDU_i5_v3ry_6e@u2ifu1}
```

## 打不开的图片2

修复头文件从JPG到PNG（89 50 4E 47）

```plain
moectf{D0_yOu_1ik3_Bo7@k_?}
```

## 狗子(1)普通的猫猫

```plain
文件末尾：moectf{eeeez_f1ag_as_A_G1ft!}
```

## building_near_lake

发布会时间：20221227

根据XMU 翔安 图书馆，可以搜到是厦门大学翔安校区的德旺图书馆

在地图上能找到此地，但是不确定拍摄的门是在哪里  

搜索可以发现是靠湖那边

由于范围只精确三位小数，红圈内的经纬度相同

```plain
moectf{P0sT_Y0uR_Ph0T0_wiTh_0Riginal_File_is_n0T_a_g00d_idea_YlJf!M3rux}
```

## 烫烫烫
```plain
+j9k-+Zi8-+T2A-+doQ-flag+/xo-+AAo-+AAo-a9736d8ad21107398b73324694cbcd11f66e3befe67016def21dcaa9ab143bc4405be596245361f98db6a0047b4be78ede40864eb988d8a4999cdcb31592fd42c7b73df3b492403c9a379a9ff5e81262+AAo-+AAo-+T0Y-+Zi8-flag+dSg-AES+UqA-+W8Y-+ToY-+/ww-key+Zi8-+Tgs-+l2I-+j9k-+iEw-+W1c-+doQ-sha256+/wg-hash+UDw-+doQ-+XwA-+WTQ-+Zi8-b34edc782d68fda34dc23329+/wk-+AAo-+AAo-+YkA-+TuU-+i/Q-+/ww-codepage+dx8-+doQ-+X4g-+kc0-+iYE-+VUo-+/wg-+AAo-
```

根据题目的提示（锟斤拷是编码转换的问题）使用cyberchef的编码转换尝试

```plain
UTF8 --> UTF 7
```

再进行AES解密

```plain
key:
所以说，codepage真的很重要啊（ --> SHA256 b34edc782d68fda34dc2332967273b0f0900a0ebd0dcec48467851bc6117bad1
```

```plain
moectf{codep@ge_pl@ys_@n_iMport@nt_role_in_intern@tion@liz@tion_g92WPIB}
```

## 狗子(2)照片

```plain
LSB隐写，使用Zsteg工具
zsteg -a /root/Desktop/bincat_hacked.png   
moectf{D0ggy_H1dd3n_1n_Pho7o_With_LSB!}
```

## Base乐队

```plain
HFUEULC5HEZG42DGHFGDWSCTHRCUIUSVHFGDWS2EGZMCCRDKG5XG2LDEHFUTYYZGHJSUMKKDGVZDELBRHBIW4UCQGZLGOP2SHEYV44ZOHEZFYXCZHEYUIV2VGEXVK4KRHBWFWY2OHVMWSYCKG5XFCZTBHEZC6I2WHJST2ZK4HEXTSMDSHA3CKZRZGRNHI4LL

base32:9hJ,]92nhf9L;HS<EDRU9L;KD6X!Dj7nm,d9i<c&:eF)C5r2,18QnPP6Vg?R91^s.92\\Y91DWU1/UqQ8l[cN=Yi`J7nQfa92/#V:e=e\9/90r86%f94Ztqk

base85:MJMWKTSRLBMVUWDCLBNFCZSXGMYUMR32PJCDA3JQIZEFCOKSKI4DKRSGKFMU2QRZJU6WY3LPGJVXKMJRPIYHK2L2HU======

base32:bYeNQXYZXbXZQfW31FGzzD0m0FHQ9RR85FFQYMB9M=lmo2ku11z0uiz=

W型栅栏密码 key=4:bW9lY3Rme1RoNF82QG5kXzFuYzF1ZDQ1X0YzbmM0X0BuZF9iQHMzfQ==

base64:moectf{Th4_6@nd_1nc1ud45_F3nc4_@nd_b@s3}
```

## 奇怪的压缩包
### part_1:
字体颜色被改白了

### part2:
备注

### part3:
ppt以zip文件格式打开，在 slide 目录中存储着 ppt 单张幻灯片数据

```plain
moectf{2ip_?_n0_i4_pp4x!}
```

## 机位查询
### 1.jpg

```plain
摩根快捷酒店(南宁火车站店)
广西壮族自治区南宁市兴宁区苏州路8号嘉士摩根大厦11楼
嘉士摩根大厦:jiashi
```

### 2.jpg

```plain
城市便捷酒店
广西壮族自治区南宁市兴宁区朝阳路9号百盛步行街广场办公区8楼
百盛步行街广场办公楼:baisheng
```

### 3.jpg
图片为原图，图片属性中有信息

```plain
汇金苑:huijin
```

拼接得到flag

```plain
moectf{jiashi_baisheng_huijin}
```

## 狗子(3)寝室

下载附件发现是循环压缩包套娃，写出循环解压缩包脚本即可

```python
import tarfile
import zipfile
import py7zr
import os

path = 'C:\\Users\\HK\\Desktop\\ziploop\\'

def extract_tar(filename):
    with tarfile.open(path + filename, 'r:gz') as tar:
        tar.extractall(path)
        return tar.getnames()[0]

def extract_zip(filename):
    with zipfile.ZipFile(path + filename, mode='r') as zipf:
        zipf.extractall(path)
        return zipf.namelist()[0]

def extract_7z(filename):
    with py7zr.SevenZipFile(path + filename, mode='r') as z:
        z.extractall(path)
        return z.getnames()[0]

last_filename = 'shell9999.tar.gz'

while True:
    first_filename = last_filename
    file_type = first_filename.split('.')[-1]

    if file_type == 'gz':
        last_filename = extract_tar(first_filename)
        os.remove(path + first_filename)
        continue

    if file_type == 'zip':
        last_filename = extract_zip(first_filename)
        os.remove(path + first_filename)
        continue

    if file_type == '7z':
        last_filename = extract_7z(first_filename)
        os.remove(path + first_filename)
        continue

```

```plain
moectf{Ca7_s133p1ng_und3r_zip_5hell5}
```

## 你想要flag吗
下载得到一个音频文件，查看频谱得到key

后面解rabbit的时候询问了出题人得知是有两个key的，如果key显示不全则需要提高频率

根据pwd 进行Steghide解密

解出一个兔兔.txt，说明是rabbit加密

```plain
rabbit:U2FsdGVkX18pGLCTMBSjkndoY4gf2lbG96QwOzVZDZeAYOA+TKnfv1mCtQ==
key:Bulbasaur
m:Mu5ic_1s_v3ry_1nt23esting_!
```

## 照片要冲洗

将另一部分提取出来并修补PNG头

会发现两张一样的图

进行python3频域盲水印提取出图片

手动调色 (反色，拉高对比度)

```plain
moectf{W0w_you_6@v3_1earn3d_blind_w@t3rma2k}
```

## 家乡话

将False 改为0，将True改为1会直观很多

将其转为图片

```python
from PIL import Image

im = Image.new('RGB',(60,7),'white')

with open('./attachment.txt','r')as f:
    lines = f.readlines()
    for y in range(len(lines)):
        data = lines[y].split(' ')
        for x in range(len(data)):
            if data[x] == '1':
                im.putpixel((x,y),(0,0,0))

im = im.resize((60*5,7*5))
im.show()
```

进行谷歌识图

发现字体为 minecraft enchantment Regular

根据码表得到 dontanswer

```python
moectf{dontanswer}
```

## weird_package

```python
import base64
import zlib

# list = [9, 4, 5, 2, 1, 3, 6, 8, 7]
list = [1, 2, 3, 4, 5, 6, 7, 8, 9]
data = b''

with open('./3', 'r') as f:
    lines = f.readlines()

    for num in list:
        data += base64.b64decode(lines[num - 1])

with open('out','wb')as f:
    f.write(data)
```

其中有很多base64格式文件，解码后拼接可以得到数据流文件

将数据流文件直接压缩成新文件（一般直接压缩是store压缩方式，其中的数据直接嵌入在zip数据中），

以上为两数据比较

但是压缩流方式不是明显的 flag ，被其它压缩算法压缩，查看原a.zip 发现是COMP_DEFLATE (8) 算法

将压缩出的新文件更改算法，解压（会CRC报错，但是还是能够直接解压的）

```plain
两种数据流排列方式得到的数据

out_name
bW9lY3Rme3dvd190SGlzX2lzX2FfZmFLZV9mTGFHX0hhSGFIYV9TNjZpbERNVjNEY2lZZiFsUDBpWWxKZiFNM3J1eDlHOVZ9Cg==
base64:moectf{wow_tHis_is_a_faKe_fLaG_HaHaHa_S66ilDMV3DciYf!lP0iYlJf!M3rux9G9V}

out_time
bW9lY3Rme1dIYVRfRGlEX1lvdV9Eb19Ub19USGVfYXJjSGl2ZT9fIWxQMGlZbEpmIU0zcnV4OUc5VmYhSm94aU1sOTAzbGx9
moectf{WHaT_DiD_You_Do_To_THe_arcHive?_!lP0iYlJf!M3rux9G9Vf!JoxiMl903ll}

name排列为fake flag，time排列为真flag
moectf{WHaT_DiD_You_Do_To_THe_arcHive?_!lP0iYlJf!M3rux9G9Vf!JoxiMl903ll}
```

## 狗子5(毛线球)
题目原理是创建了一个python脚本并建立了一个临时变量

在linux下，临时变量被存储在 /proc/PID/environ 中，由于不知道PID的值，直接遍历过去

```python
from pwn import *

command = 'cat ../proc/PID/environ'
conn = remote('localhost', 56161)
PID = 0

while True:
    PID += 1
    data = conn.recv().decode()
    conn.sendline(command.replace('PID',str(PID)).encode())

    if 'flag' in data or 'CATSFLAG' in data or 'moectf' in data:
        print(data)
        break
```

# 古典密码
## ezrot
```plain
>@64E7LC@Ecf0:D0;FDE020D:>!=60=6EE6C0DF3DE:EFE:@?04:!96C0tsAJdEA6d;F}%0N

根据题目名称可知是Rot位移

rot47:moectf{rot47_is_just_a_simPle_letter_substitution_ciPher_EDpy5tpe5juNT_}
```

## 可可的新围墙
```plain
mt3_hsTal3yGnM_p3jocfFn3cp3_hFs3c_3TrB__i3_uBro_lcsOp}e{ciri_hT_avn3Fa_j

根据题目名称可知是栅栏密码

moectf{F3nc3_ciph3r_shiFTs_3ach_l3TT3r_By_a_Giv3n_nuMB3r_oF_plac3s_Ojpj}
```

## 皇帝的新密码
```plain
tvljam{JhLzhL_JPwoLy_Pz_h_cLyF_zPtwPL_JPwoLy!_ZmUVUA40q5KbEQZAK5Ehag4Av}

维吉尼亚密码 key=h:
moectf{CaEsaE_CIphEr_Is_a_vErY_sImpIE_CIphEr!_SfNONT40j5DuXJSTD5Xatz4To}
```

## 不是皇帝的新密码
```plain
scsfct{wOuSQNfF_IWdkNf_Jy_o_zLchmK_voumSs_zvoQ_loFyof_FRdiKf_4i4x4NLgDn}

根据 scsfct 对应 moectf ,维吉尼亚密码刚好可以对应出key=goodjob

moectf{vIgENErE_CIphEr_Is_a_lIttlE_hardEr_thaN_caEsar_CIphEr_4u4u4EXfXz}
```

## 喵言喵语
根据hint可知是摩斯密码，以空格位分隔，替换成'/'更直观

```plain
由于第一个分隔前只有' 喵喵？' 将其暂定为' . ' 全部替换

喵喵？/喵喵喵喵喵喵喵喵喵喵喵喵/喵喵喵/喵喵喵喵喵喵喵喵？喵喵？喵喵喵喵喵？/喵喵？喵喵喵喵喵？/喵喵喵喵喵？/喵喵喵喵喵？喵喵？/喵喵喵喵喵？/喵喵喵喵喵喵/喵喵喵喵喵喵/喵喵喵喵喵喵喵喵？喵喵？喵喵喵喵喵？/喵喵？喵喵喵喵喵？喵喵喵/喵喵喵喵喵？/喵喵？/喵喵喵喵喵喵喵喵？喵喵？喵喵喵喵喵？/喵喵？喵喵喵喵喵喵喵喵喵/喵喵喵喵喵喵喵喵？/喵喵？/喵喵喵喵喵喵喵喵？喵喵？喵喵喵喵喵？/喵喵？喵喵喵喵喵喵喵喵喵/喵喵喵/喵喵喵喵喵喵喵喵？喵喵？喵喵喵喵喵？/喵喵？喵喵喵喵喵？喵喵喵/喵喵喵喵喵？/喵喵喵喵喵？喵喵喵喵喵喵/喵喵喵喵喵？喵喵喵喵喵喵/喵喵喵/喵喵？喵喵喵喵喵喵/喵喵喵喵喵喵喵喵？喵喵？喵喵喵喵喵？/喵喵？喵喵？喵喵喵/喵喵？喵喵？喵喵？/喵喵喵喵喵喵喵喵？/喵喵？喵喵？喵喵喵喵喵喵/喵喵喵喵喵喵/喵喵喵喵喵喵喵喵？喵喵？喵喵喵喵喵？/喵喵？喵喵喵喵喵喵喵喵喵/喵喵？喵喵喵喵喵？喵喵？/喵喵喵喵喵喵喵喵？喵喵？喵喵喵喵喵？/喵喵喵喵喵？喵喵喵/喵喵？喵喵喵喵喵喵喵喵？

replace('喵喵？','.')

./喵喵喵喵喵喵喵喵喵喵喵喵/喵喵喵/喵喵喵喵喵喵..喵喵喵./.喵喵喵./喵喵喵./喵喵喵../喵喵喵./喵喵喵喵喵喵/喵喵喵喵喵喵/喵喵喵喵喵喵..喵喵喵./.喵喵喵.喵喵喵/喵喵喵././喵喵喵喵喵喵..喵喵喵./.喵喵喵喵喵喵喵喵喵/喵喵喵喵喵喵././喵喵喵喵喵喵..喵喵喵./.喵喵喵喵喵喵喵喵喵/喵喵喵/喵喵喵喵喵喵..喵喵喵./.喵喵喵.喵喵喵/喵喵喵./喵喵喵.喵喵喵喵喵喵/喵喵喵.喵喵喵喵喵喵/喵喵喵/.喵喵喵喵喵喵/喵喵喵喵喵喵..喵喵喵./..喵喵喵/.../喵喵喵喵喵喵./..喵喵喵喵喵喵/喵喵喵喵喵喵/喵喵喵喵喵喵..喵喵喵./.喵喵喵喵喵喵喵喵喵/.喵喵喵../喵喵喵喵喵喵..喵喵喵./喵喵喵.喵喵喵/.喵喵喵喵喵喵.

莫斯密码肯定有 '-' 又因为不可能是一个'喵'对应一个'-'，后面最短的为'喵喵喵'，将其替换成'-'

replace('喵喵喵','-')

./----/-/--..-./.-./-./-../-./--/--/--..-./.-.-/-././--..-./.---/--././--..-./.---/-/--..-./.-.-/-./-.--/-.--/-/.--/--..-./..-/.../--./..--/--/--..-./.---/.-../--..-./-.-/.--.

Mose Decode: ETRNDNMMNEJGEJTNYYTWUSGMJLKP

发现解出不对，尝试替换'.'为'-'，'-'为'.'

Mose Decode: THE_KAWAII_CAT_BUT_BE_CALLED_GOUZI_BY_RX

moectf{THE_KAWAII_CAT_BUT_BE_CALLED_GOUZI_BY_RX}
```

# 取证
## 随身携带的虚拟机
挂载入 vm 虚拟机，回收站有密钥文件

使用 Recovery Key 解开BitLock 即可得到 flag.txt

```plain
bW9lY3Rme0JhczFjX0QxNWtfRjByM25zMWNzIX0=

base64:moectf{Bas1c_D15k_F0r3ns1cs!}
```

## 坚持访问的浏览器
附件打开是 koito 用户文件夹

根据题目的浏览器可知是需要获取浏览器记录，搜索得知 firefox 的浏览记录都存储在 places.sqlite 中，在 Github 上查找相关项目，有个 firefox_history-master 的项目，可以从 places.sqlite 恢复历史记录[https://github.com/vickz84259/firefox_history](https://github.com/vickz84259/firefox_history)

```plain
执行脚本

 python \firefox_history-master\firefox_history\main.py C:\Users\HK\Desktop\MoeCTF_Forensics_2\Forensics_2\koito\.mozilla\firefox\1xp3jsq0.default-esr\places.sqlite
```

会在目录下生成 final_result

```plain
moectf{Th15_iS_d3f1ni7e1y_1Ast_0NE_30a13cfb8426e919ecd4c5627cde4fa4}
```

## 锁定起来的同人文
R-studio载入镜像，桌面有一个图片和一个 hc 加密文件

根据图片名 key_pixiv_id105614615.png 下载pixiv id为105614615的原图

加载 hc 文件 ，以图片为文件密钥挂载在磁盘上

挂载成功后，打开 temp 文件夹有 siyuan.log 搜索的地址是 思源笔记 ，存储笔记在 data 目录下，在 data 目录下翻找

Z:\data\20230707221115-ibr7vs7\20230707221136-xyfn5al\20230707221147-1rzo2wp

将sy文件打开可以看到

```plain
NVXWKY3UMZ5VGMC7MQZTG4DMPFPUQMLEMRSW4IL5

Base32:moectf{S0_d33ply_H1dden!}
```

