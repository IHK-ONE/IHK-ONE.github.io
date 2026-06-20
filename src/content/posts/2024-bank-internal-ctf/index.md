---
title: '2024 某银行内部赛 Writeup'
description: 'sql 注入，直接拿工具梭哈'
pubDate: 2024-08-10
author: 'IHK-1'
tags: ['CTF', '银行内部赛', '2024']
---

# misc1
sql 注入，直接拿工具梭哈

当然也可以拿过滤去匹配

```plain
from flag limit 0,1\),\W?(\d+)\W?,1\)\)\)\W?\W?\W?(\d+)
```

flag

```plain
flag{skysql_is_very_cool!233}
```

# misc2

头部 IDAT 块异常，推测为两张 png 的 IDAT 块拼成，删除修复后：

使用 outguess 进行恢复

```plain
outguess -r flag.jpg output -k 89504E
```

恢复出来推测需要进行 补全zip，当我们尝试直接进行压缩一个 flag{xxxx} 文档的时候，使用 08 正常压缩，内容头也为

直接尝试写入一个 flag.txt 并以 COMP_DEFLATE (8) 进行压缩，然后替换内容部分保存

解压后成功解压出 flag，虽然压缩包校验出错，但是 bandzip 仍然能以该格式解压出内容，另一种方法可以通过 COMP_DEFLATE (8) 对内容进行恢复

flag2

```plain
flag{0815e4c9f56148e78be60db56ce44d59}
```

# misc3
根据文件头确定文件格式为 vmdk

随便找一个工具能打开该镜像即可，比如 disk genius 或者 r-studio 之类的工具，并恢复出一张 c.jpg

图片属性中有 AAencode 加密，解密即可拿到 flag

flag3

```plain
flag{71a55b5c2c247bbb1b54c0f6918c32}
```

