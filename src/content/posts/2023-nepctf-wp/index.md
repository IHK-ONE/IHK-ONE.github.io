---
title: '2023 NepCTF Writeup'
description: 'NepCTF{H4ve_Fun_1N_This_Game}'
pubDate: 2023-09-15
author: 'IHK-1'
tags: ['CTF', 'NepCTF', '2023']
---

# MISC
## CheckIn
NepCTF{H4ve_Fun_1N_This_Game}

## codes
```c
#include <stdio.h>
#include <stdlib.h>


int main(int argc,char **argv,char** enp)
{
    int i=0;
    for(i=0;enp[i]!=NULL;i++)
    printf("enp[%d]=%s\n",i,enp[i]);
    return 0;
}
```

<!-- 这是一张图片，ocr 内容为：C ODE ONLINE TEST PLATFORM ENTER YOUR C CODE: #INCLUDE <STDIO.H> #INCLUDE <STDLIB.H> INT MAIN(INT ARGC,CHAR **ARGV,CHAR** ENP) INTI-0: FOR(I-0:ENP [I]-NULL:I+++++) PRINTF("ENP[$D]%SIN",I,ENP[IL): RETURN     RUN CODE OUTPUT: ENP [0]-KUBERNETES_SERVICE PORT-443 ENP[1]-KUBERNETES PORT-TCP://10.43.0.1:443 ENP[2]-HOSTNAME-PUSH-A869D546BEE140BE ENP[3]SHLVL-0 ENP[4]-HOME-/ROOT ENP[5]-LC CTYPE-C. UTF-8 ENP [6]-WERKZEUG SERVER FD3 ENP[7]---./START.SH ENP[8]-KUBERNETES_PORT_443_TCP_ADDR-10.43.0.1 ENP[9]-PATH-/UST/LOCAL/SBIN://UST/LOCAL/BIN://USR/SBIN://BIN://SBIN://BIN ENP L10]-KUBERNETES PORT 443 TCP PORT-443 ENP[11]-KUBERNETES PORT_443 TCP PROTO-TCP ENP[12]-GZCTF FLAG-NEPETF LEASY_CODES,7BED9525-E2D0-4E55-8046-8D7EFDO93A7A,[TEAI[HASH]! ENP[13]-KUBERNETES_SERVICE PORT HTTPS-443 ENP[14]-KUBERNETES PORT_443 TCP-TCP://10.43.0.1:443 ENP[15]PWD-/HOME/CTF ENP[16]-KUBERNETES_SERVICE_HOST-10.43.0.1 -->


## 与AI共舞的哈夫曼(方法一)
<!-- 这是一张图片，ocr 内容为：起始页 COMPRESSED.BINX 0123456789ABCDEF 0123456789ABCDEF 0000H:12 4E 00 00 00 01 65 00 00 00 01 70 00 00 00 00 02 .N....E.... 10010H:63 00 00 00 01 74 00 00 00 01 66 00 00 00 03 78 80020H:0000000001680000000001750000000000001 6D000 10030H:00 00 01 61 00 00 00 01 6E 00 00 00 01 5F 00 00 00 0040H:00027A0000000016900000000 0013600000 B?Y A 000006DF3F79AAC2 0050H:037D00000010A000 EVQISOUO. 0060H:C97651CD53F8DBF0 000 -->


题目中给出了Nepctf{humanzi6}，可以根据题目huffman compress猜出是Nepctf{huffman_zip_666}

## 与AI共舞的哈夫曼(方法二)
题目给出代码

<!-- 这是一张图片，ocr 内容为：HUFFMANPY[C:USERS(HK]DESKTOP/MISC]-C;USERS\HKIDESKTOP/HUFFMAN PY 导航(N) 工具( 帮助(H) 视图(V) 代码(C) 编辑(日) 窗口W) 重构(R) 文件() 运行U VCS(S) Q HK HUFFMAN.PY DESKTOP USERS 当前文件 三 SCIVIOWE 项目 - DECOMPRESSED.TXT X 图 项目 数据 CA..HUFFMANPY PCAPSQLANALYSEPPY MISC.PY HUFFMAN.PY 团数据库 MISC \USERS\HK\DESKTOP\MISC IMPORT HEAPG -2COMPRESSED.BIN 2 IMPORT OS DECOMPRESSED.BDT 3 MI SCIVIEW HUFFMAN.PY CLASS HUIFMANNODE: E INPUT.TT __INIT_(SELF, CHAR, FREQ): PMISC.PY SELF.CHAR CHAR PCAPSQLANALYSE P.PY SELF.FREG - FREG URLSQPY SELF.LEFT NONE ?无标题1 山外部库 SELF.RIGHT NONE 10 临时文件和控制台 11 DEF . . (SELF. OTHER): PETURN SELF.FREG < OTHER.FREG EDEF BUILD HUFFMAN TREE(FREQUENCIES): HENBINATTBAD HEAP : [HUFFMANNODE(CHAR, FREQ) FOR CHAR, FREQ IN FREQUENCIES.ITENSO] HEAPQ.HEAPIFY CHEAP) WHILE LEN(HEAP)>1: 运行PYTHON控制台或调试器以查看可用数据 LEFT HEAPQ.HEAPPOP(HEAP) RIGHT HEAPQ.HEAPPOP(HEAP) MERGED - HUFFMANNODE(NONE, TEFT.FREQ + RIGHT.FREQ) MERGED.LEFT : LEFT MERGED.RIGHT RIGHT HEAPQ.HEAPPUSH(HEAP, MERGED) RETURN HEAP[O] DEF BUILD HUFFMAN_CODES(NODE, CURRENT_CODE, HUFFMAN-CODES): NODE IS NONE: 30 RETURN 31 32 NODE.CHAR IS NOT NONE: HUFFMAN_CODES[NODE.CHAR] - CURRENT_CODE 33 RETURN 34 35 BUILD HUFFMAN TREED 服务 TODO 问题 PYTHON控制台 PYTHON软件包 1624 LF UTF8 4个空格 PYTHON 3.9 -->
  
但是没有给出input.txt，根据题目的意思查询ChatGPT后得到结果

<!-- 这是一张图片，ocr 内容为：DEFAULT(GPT-3.5) 这段代码执行后生成了COMPRESSED.BIN,我没有其余的INPUT.TXT,可能已经被写入了 COMPRESSED.BIN,请告诉我如何只通过COMPRESSED.BIN解压出文件DECOMPRESSED.TXT #解压缩文件 DECOMPRESS(COMPRESSED.FILE,DECOMPRESSED.FILE) 你可以使用下面的代码来解压缩 'COMPRESSED.BIN'并生成'DECOMPRESSED.TXT'文件: COPY CODE PYTHON IMPORT HEAPQ IMPORT OS CLASS HUFFMANNODE: DEF ..INIT._(SELF, CHAR, FREQ): SELF.CHAR - CHAR SELF.FREQ - FREQ SELF.LEFT E NONE SELF.RIGHT - NONE IT (SELF,OTHER): DEF Q<OTHER.FREQ RETURN SELF.FREQ< REGENERATE DEF BUILD HUFFMAN.TREE(FREQUENCIES): SEND A MESSAGE FREE RESEARCH PREVIEWE CHATOPT MAY PRODUCE INACCURATEINFORMATION BBOUT PLACES, ORFACTS CHATAPT AUGUST SET YOUR CUSTOM INSTRUCTIONS NEW X -->


```python
'''询问语句：
compress.py的代码...

这段代码执行后生成了compressed.bin，我没有其余的input.txt，可能已经被写入了compressed.bin，请告诉我如何只通过compressed.bin解压出文件decompressed.txt
# 解压缩文件
decompress(compressed_file, decompressed_file)
'''
# 生成代码

import heapq
import os

class HuffmanNode:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None

    def __lt__(self, other):
        return self.freq < other.freq

def build_huffman_tree(frequencies):
    heap = [HuffmanNode(char, freq) for char, freq in frequencies.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = HuffmanNode(None, left.freq + right.freq)
        merged.left = left
        merged.right = right
        heapq.heappush(heap, merged)

    return heap[0]

def build_huffman_codes(node, current_code, huffman_codes):
    if node is None:
        return

    if node.char is not None:
        huffman_codes[node.char] = current_code
        return

    build_huffman_codes(node.left, current_code + '0', huffman_codes)
    build_huffman_codes(node.right, current_code + '1', huffman_codes)

def decompress(input_file, output_file):
    with open(input_file, 'rb') as f:
        data = f.read()

    num_symbols = data[0]
    frequencies = {}
    index = 1

    for _ in range(num_symbols):
        byte = data[index]
        freq = (data[index + 1] << 24) + (data[index + 2] << 16) + (data[index + 3] << 8) + data[index + 4]
        frequencies[byte] = freq
        index += 5

    root = build_huffman_tree(frequencies)
    huffman_codes = {}
    build_huffman_codes(root, '', huffman_codes)

    compressed_data = ''
    for i in range(index, len(data)):
        byte = data[i]
        compressed_data += format(byte, '08b')

    padding = 8 - len(compressed_data) % 8
    compressed_data = compressed_data[:-padding]

    current_node = root
    decompressed_data = []

    for bit in compressed_data:
        if bit == '0':
            current_node = current_node.left
        else:
            current_node = current_node.right

        if current_node.char is not None:
            decompressed_data.append(current_node.char)
            current_node = root

    with open(output_file, 'wb') as f:
        f.write(bytes(decompressed_data))

if __name__ == "__main__":
    compressed_file = 'compressed.bin'
    decompressed_file = 'decompressed.txt'

    # 解压缩文件
    decompress(compressed_file, decompressed_file)


# 打开 decompressed.txt 得到 Nepctf{huffman_zip_666}
```

## 小叮当弹琴
附件使用Audacity打开，后半部分为16进制

<!-- 这是一张图片，ocr 内容为：PIANO 视图() 工具(O)专用(10) )效果(C)分析(A) 揭录(N) 轨道()  生成(G) 选择(S) 文件(月)编银(口) XI QUIS-14-44-12-12-6 * 5:15 4:15 5:00 5:45 4:45 4:00 3:30 3:45 5:30 4:30 三三 项目采科室 OND 朝刚佳 00时00分00秒 00时00分00.000秒 00时00分00.000秒 44100 关闭 已停止 -->


```plain
0x370A05303C290E045005031C2B1858473A5F052117032C39230F005D1E17
```

16进制转码后为一个乱码的文件，猜测是异或，并手动异或Nepctf，发现结果为Yousho，推测前面是莫斯密码

```plain
Yousho 
-.-- --- ..- ... .... ---
```

发现能对应头部的点线

<!-- 这是一张图片，ocr 内容为：PIANO 视图() 工月(O)$100 文件门 滨园内 生成(G) 效果(C)分析(A) 选择(S) 揭录(N) 轨道M 1:15 2:15 45 15 2:00 30 1:30 1:45 1:00 项目采样室 (16) 邮到 00时00分00秒 00时00分00.000秒 00时00分00.000秒 关闭 已汽止 -->


尝试转码莫斯密码

```plain
-.-- --- ..- ... .... --- ..- .-.. -.. ..- ... . - .... .. ... - --- -..- --- .-. ... --- -- . - .... .. -. --.
YOUSHOULDUSETHISTOXORSOMETHING
```

进行异或，会发现莫斯转码出来的大写字符串输出也是乱码，改小写字符串

<!-- 这是一张图片，ocr 内容为：LAST BUND:A YEAR AGO LENG RECIPE INPUT LIN 0X370A05303C290E045005031C281858473A5F052117032C39230F005D1E17 O. FROM HEX DELIMITER AUTO XOR KEY UTF8 YOUSHOULDUSETHISTOXORSOMETHING SCHEME NULL PRESERVING STANDARD TIME OUTPUT LENGTH LINES NEPCTF{H4PPY_P14NO}NEPCTFFH4PP -->


得到flag

```plain
NepCTF{h4ppy_p14N0}
```

## 陌生的语言
<!-- 这是一张图片，ocr 内容为：南京市农家村 株5染 1858181 33 883888 -->


根据hint推测出《小魔女学院》贴吧中查找到相关信息

```plain
https://tieba.baidu.com/p/4960864131?pn=2
https://tieba.baidu.com/p/4960864131?pn=3
```

<!-- 这是一张图片，ocr 内容为：季香 东一家 京 PQ 宋衣兰 WXYZ 水务 23456759 01 -->


<!-- 这是一张图片，ocr 内容为：MOON RUNE ALPHABET 张名资源送货管提 HIJ DEF AB D 落港发送劳我能易引引导 R S L K MN T A U LOOPING SEQUENCE HOW IT LOOPS 12 THIS IS THE BASIC LAYOUT FOR A MOON RUNE. EVERY TIME YOU ADVANCE A LETTER IN THE ALPHABET, 43 THE GLYPH IN SLOT 1 IS DUMPED AND A NEW ONE IS ADDED TO SLOT 6 FROM THE SEQUENCE,EVERYTHING IN BETWEEN IS 56 MOVED UP A SLOT.THIS SEQUENCE LOOPS FROM Z BACK TO A. ABCDEFGHIJKLMNOPQRSTUVWXYZ SAY YOU WANT TO MAKE AN A. START FROM SLOT 1 AND FILL IN THE REST OF THE SLOTS IN ORDER BY GOING DOWN THE SEQUENCE.END RESULT SHOULD LOOK LIKE THAT-> TO MAKE A B,YOU DUMP THE GLYPH FROM SLOT 1 AND MOVE THE REST OF THE GLYPHS IN BETWEEN UP IN ORDER OF THE SLOTS. HEOE THEN YOU ADD THE NEXT GLYPH FROM THE SEQUENCE TO SLOT 6. OR JUST START FILLING UP THE SLOTS STARTING WITH THE GLYPH WITH THE DESIRED LETTER. -->


对应码表解出flag

```plain
NepCTF{NEPNEP_A_BELIEVING_HEART_IS_YOUR_MAGIC}
```

## connted_five
五子棋，虽然加了一些机制但是并不重要，只需要连自己的五子即可

不过要吐槽一下环境不是很稳定，如果发现棋子不是秒加载直接重新尝试，不然下了很久突然卡住会很崩溃

<!-- 这是一张图片，ocr 内容为：ACTIONS VIEW HELP FILE EDIT OXX X+X+X OXOXX X XXOXO TRAM USBWACOM.. 0 00X X[X]X U OXXOXO O BN WU LEI ZHENG! TURN:52 MIMIKATZ.PY MESSAGE COMPUTER: #ED WU LEI ZHENG! 40:29 ABCDEFGHIJKLMNO AX,0,XXO,XOOXX, HO  B OX . .. . [X]XX ,0 00X.......X. 1 0.X+0..X.X.0.0 .0 XX E0XOX 0 FXO O X X G XO 0  VOLATILIT H X . 0 . X O 0 I 0 X J O. 0 X X OXX 0'XT+X' 0,XX. XOXOX X . M 0.00 X  X N XXXO O NK SI FANG ZHENG! NIM NEPCTF{GOMOKUPLAYINGCONTINOUSISFUN_310858C17A2C} MESSAGE (ROOTSKALI)-[~] -->


```plain
NepCTF{GomokuPlayingContinousIsFun_310858c17a2c}
```

## 你也喜欢三月七吗
根据题目信息和题目附件信息

```plain
群名：NepCTF 2023
salt:NepCTF2023
算法:SHA256

salt_lenth= 10 
key_lenth= 16 

iv= 88219bdee9c396eca3c637c0ea436058 #原始iv转hex的值
ciphertext= b700ae6d0cc979a4401f3dd440bf9703b292b57b6a16b79ade01af58025707fbc29941105d7f50f2657cf7eac735a800ecccdfd42bf6c6ce3b00c8734bf500c819e99e074f481dbece626ccc2f6e0562a81fe84e5dd9750f5a0bb7c20460577547d3255ba636402d6db8777e0c5a429d07a821bf7f9e0186e591dfcfb3bfed
```

推测是群名字取SHA256取前32位得到

<!-- 这是一张图片，ocr 内容为：NEPCTF2023 字母大小写 小写 心复制结果 血清空 SHA256加密 -DD8E671DF3882C5BE6423CD030BD7CB69671EF27DFE7A541903EDC4E23168009 -->


再进行AES解码

<!-- 这是一张图片，ocr 内容为：START: 257 LENGTH: 257 RECIPE 257 INPUT END: 2 LINES: 0 LENGTH: 1B708AE6D0CC97984401F3DD448BF9783629265766A16679ADEE01AF58025707FBC29941105D7F50F2657CF7EAC73 AES DECRYPT 15380BECCDFDA26F6C6C6360AC8734BF509C819E99E97AF481DBECE62E626CC2F6E8562581FE84E5DD9750F5A8667 ]C20460577547D3255BA636402D6DB8777E8C5A429DE738216F7F9E0186E591DFCF63BFEDFC KEY HEX DD8E671DF3882C5BE6423CD030BD7CB6 IV HEX 88219BDEE9C396ECA3C637C0EA436058 MODE INPUT CBC/NOPADDING HEX OUTPUT RAW FROM HEX DELIMITER AUTO TIME: L4410.0 团 OUTPUT LENGTH: LINES: FROM BASE64 HTTPS://IMG1.IMGTP.COM/2023/07/24/YOKXWS3T.PNG ALPHABET A-ZA-ZO-9+/ REMOVE NON-ALPHABET CHARS STRICT MODE -->


得到一个图片链接

<!-- 这是一张图片，ocr 内容为：2BBYFSYYWJJFYN HYD L C -->


<!-- 这是一张图片，ocr 内容为：10 星穹铁道文(贝洛伯格) STAR RAIL SCRIPT (BELOBOG) JL 55 S AYY B LKGS L了JU5 L D55MH IH IN J Y J E N R H H H H H H T S T OA X X F X H A D Y B H2TQ6222 2 Z JIR B D 左侧的为大写字母,右侧的为小写字母. LETTERS TO THE LEFT ARE IN UPPERCASE,THOSE TO THE RIGHT ARE IN LOWERCASEIL 米游社@革凡普王I -->


对应码表解出flag

```plain
NepCTF{HRP_aIways_likes_march_7th}
```

## 问卷调查
```plain
NepCTF{See_you_in_NepCTF2024}
```

