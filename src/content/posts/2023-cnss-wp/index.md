---
title: '2023 CNSS Writeup'
description: '2023 CNSS CTF Writeup。'
pubDate: 2023-08-15
author: 'IHK-1'
tags: ['CTF', 'CNSS', '2023']
---

## SignIn

```plain
cnss{W3Lc0m3_7o_Cn55_R3cru1t!}
```

## 招新平台彩蛋
左上角小旋风

```plain
CNSS{G3nsh1n~1n1t14t3}
```

## 星光下的梦想
AU 频谱图

```plain
CNSS{DR34M~UND3RN347H~5T4R11GH7}
```

## 杂鱼~ 杂鱼~ 找不到 flag 的杂鱼
零宽隐写

```plain
cnss{Zak0~~z4ko~Ov0}
```

##  # 三体人的低吟
## 扫码领取 flag

```plain
cnss{Ur_Qr_K1NnG!}
```

## Hello World -1
```plain
#include <stdio.h>

int main()
{
    printf("Hi, CNSS!");
    return 0;
}

>>>
成功了！
Accepted!
Flag: cnss{hello_cnss}
```

## Hello World -2  
```plain
#include <stdio.h>

int main() 
{
    char hello[] = {0x48,0x69,0x2c,0x20,0x43,0x4e,0x53,0x53,0x21};
    puts(hello);
    return 0;
}

>>>
成功了！
Accepted!
Flag: cnss{hello_cn33_n0_quotes}
```

## Hello World -3
```plain
#include <stdio.h>

#define HELLO puts((char[]){0x48,0x69,0x2c,0x20,0x43,0x4e,0x53,0x53,0x21})

int main() {
    if (1)
        if(HELLO){}
}

>>>
成功了！
Accepted!
Flag: cnss{i_d0nt_l1ke_semic0lon}
```

##  # Hello World -4
```plain
extern "C" int putchar(int c);  
  
int main() {  
    const char* str = "Hi, CNSS!";  
    while (*str) {  
        putchar(*str++);  
    }  
    return 0;  
}

>>>
成功了！
Accepted!
Flag: cnss{headless_hello_world}
```

## # Hello World -5
```plain

```

