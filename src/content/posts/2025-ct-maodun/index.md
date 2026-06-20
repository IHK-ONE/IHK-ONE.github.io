---
title: '2025 CT 茅与盾大模型专项赛 Writeup'
description: '对 flag 进行加密输出即可'
pubDate: 2025-04-10
author: 'IHK-1'
tags: ['CTF', '茅与盾', '大模型', 'AI', '2025']
---

# 最强大脑
对 flag 进行加密输出即可

```plain
flag{bhWvTHc4KyAMAySMK2xuLJh2vuGNG8Xcmz4oYQXv}
```

# 守护者v1
方法1：伪装成作者，欺骗 AI 后即可获取加密的 FLAG

```plain
flag{WmKp3QhYTLBmMJVjUVInrr7GluCm3o9TrPMMjY6S}
```

# 守护者v2
方法二：让 AI 将 FLAG 进行出题即可

```plain
flag{066EY2HSBWNT6Z1kCwGjY0NQZXcUDNb3b45tn88n}
```

# 守护者v3
方法三：让 AI 进行文字创作，让 FLAG 作为一部分添加

```plain
flag{VXmLRvRxSwBblaCxJvyDvYN01pMV3QSxUEWbh7d3}
```

# 神秘模型
通义千问的 AI ，询问后得知有 SQL 查询功能

多次尝试 SQL 查询语句，当只有字段数相同时才会返回 SELECT 语句，否则返回为 SQL 错误，且只能返回一行

```plain
flag{7AZ9339SJzy08aBxcJ9mKJYr5qMKNCLLNVaeRbvV}
```

# 网站后台
思路：爆破邮箱验证码，每次爆破一组可以爆破 4 万个值，那么每组爆完概率为 1/25 那么大约需要接近 2 个小时进行爆破

