---
title: '2024 石油内部赛 Writeup'
description: 'LSB 后有一个 short ook'
pubDate: 2024-07-15
author: 'IHK-1'
tags: ['CTF', '石油内部赛', '2024']
---

# 黑神话悟空-CS
```plain
zsteg -e b1,rgb,lsb,xy 'WuKong-CS.png'
```

LSB 后有一个 short ook

# 蚂蚁上树
根据 HTTP 流特征发现为蚁剑流量

在 tcp.stream eq 6 流中发现其 echo 一段字符串

```plain
DJ?ELfc`BA`Bc\aD_c\caha\@hdA\DB`@CAeAACAcN

rot47:
synt{741qp1q4-2s04-4292-o95p-sq1orp6pprp4}

rot13:
flag{741dc1d4-2f04-4292-b95c-fd1bec6ccec4}
```

# 祝福你
根据 SQL 注入分析为 布尔盲注，其在每次成功注入时 会使用 != ，此时回显长度依旧不变即判断结果为 False，即等效 == 判断结果为 True，将 value 结果匹配出来

```python
import re
flag = ''
for line in open('access.log').readlines():
    line = line.strip()
    if '!=' in line:
        try:
            # 0 CAST(`value` AS NCHAR),0x20) FROM `security`.secret ORDER BY id LIMIT 0,1),2,1))!=104,0,1
            # 1 CAST(`value` AS NCHAR),0x20) FROM `security`.secret ORDER BY id LIMIT 1,1),3,1))!=101,0,1
            # 2 CAST(`value` AS NCHAR),0x20) FROM `security`.secret ORDER BY id LIMIT 2,1),50,1))!=97,0,1
            num = re.search(r"`value` AS NCHAR\),0x20\) FROM `security`\.secret ORDER BY id LIMIT 2,1\),(.*),1\)\)!=(.*),0,1",line).group(2)
            flag += chr(int(num))
        except:
            pass

print(flag)

# table_schema  security
# table_name    secret
# column_name   name

# id     name       value
# 0      secret-1   ChaiTin_2024!!!!ChaiTin_2024!!!!
# 1      secret-2   See_You_Again!!!See_You_Again!!!
# 2      secret     sB1RrLsz1/5rce0Td1s/HGqx0CX+N3hcDbah52rhMVV8a6DW3awN7dLCOLVosSMM
```

进行 AES 解密

# 天注定
根据 SQL 注入分析为 二分法盲注

根据二分法盲注特征，后面有回显长度，当最后一个判断时，长度 705 为正确，所以只需要取最后一个正确值，再将值 +1 即可

```python
import re

lines = open(r"access.log").readlines()
pos_dict = {}

for line in lines:
    line = line.strip()
    try:
        data= re.search(r"CAST\(password AS NCHAR\),0x20\) FROM `security`\.users ORDER BY id LIMIT 0,1\),(.*),1\)\)>(.*) AND 'cQlu'='cQlu HTTP/1\.1\" 200 705",line).group(1,2)
        pos,num = data[0],data[1]
        pos_dict[int(pos)] = int(num)
    except:
        pass

flag = ''
for i in range(1,17):
    flag += chr(pos_dict[i]+1)

print(flag)
```

# anter
根据流量分析其为目录爆破，进行导出 http 流，再根据长度进行判断

其中大部分都为 273 即回显 404 ，其中 secret 回显长度 58，对其回显进行分析

```plain
2MmwQqsBe1NMEj0MZl46trLz5v4aUEMuaEXalJrFnkwsT6t8TEsncGIGL

base62:
flag{9081a884-174d-47a7-acd3-675c77955021}
```

# 古典

维吉尼亚自动解密即可

# ezdata
发现其存在 UDF 进行命令执行

在日志中发现一段报错

进行解密后是一个远程连接的 elf 文件，使用云沙箱进行在线运行即可

