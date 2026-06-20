---
title: '2023 CNSS Writeup'
description: '2023 CNSS CTF Writeup。'
pubDate: 2023-08-15
author: 'IHK-1'
tags: ['CTF', 'CNSS', '2023']
---

## SignIn
<!-- 这是一张图片，ocr 内容为：CNSS凝聚网络安全工作室招新,大黑客快来丸 Y25ZC3TXMOXIMGOZXZDVXONUNTVFUJNJCNUXDCF9 -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1696181725612-fb801e3d-cf5e-4bc2-9e50-3307c402256a.png)

```plain
cnss{W3Lc0m3_7o_Cn55_R3cru1t!}
```

## 招新平台彩蛋
左上角小旋风

<!-- 这是一张图片，ocr 内容为：CNSS RECRUIT 2023 R 目 山 原神 抵制不良游戏,拒绝盗版游戏,注意自我保护,谨防受骗上当.适度游戏益脑,沉迷游戏伤身,合理安排时间,享受健康生活. 审批文号:国新出审(2020]1407号CNSS(G3NSHIN~1NLT143)出版单位:华东师范大学电子音像出版社有限公司 著作权人:上海米哈游天命科技有限公司 本公司积极履行网络游戏行业防沉迷自律公约 -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1696177658842-3959eb07-112b-4697-9b96-e43f56f97610.png)

```plain
CNSS{G3nsh1n~1n1t14t3}
```

## 星光下的梦想
AU 频谱图

<!-- 这是一张图片，ocr 内容为：STARLIGHT-WITH-FLAG 文件(日 编辑(E) 选择(S) 视图(V) 提景(N)  生成(G) 生成(G) 分析( (C)分析(A)工具(O)帮助(H)帮助(H) 左右 -42 -36-24-18-18-36 O -48-42-:点击开始监视+-18-12 IQ 54 -54 XO口 * 扬声器(REALTEK(R)AUDIO) MME 阵列麦克风(AMD AUDIO DEVICE) 2(立体声)录制声道 45 15 30 1:00 STERLISHT-VIV 8K SISSDRENGRENGERINGERL 如果 机犯羽邪羽翼 阿体皮 45000 HE 2位 浮点 8K 比龙奶奶 0K 炮押 项目采样率(HZ) 选区的起点和终点 吸附到 00时00分00秒 00时00分00.000秒 48000 00时00分00.000秒 关闭 已停止. -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1696172909058-cb84be1c-4420-4100-98f6-b98504e9fe8d.png)

```plain
CNSS{DR34M~UND3RN347H~5T4R11GH7}
```

## 杂鱼~ 杂鱼~ 找不到 flag 的杂鱼
零宽隐写

<!-- 这是一张图片，ocr 内容为：EXTRACT PREVIEW 636E73737B5A616B 307E7E7A346B6F7E CNSS{ZAK 0~Z4KO~ 4F76307DEEFEEFEE FEEEFEEEFEEEFEEE OVO]. FFFFFFFEFFFFFF00 71FFFEC7E00E3FFC7 0001F81C7038E3F1 C0E071C01F8E3FF ..P8.. .Q. F03FE07FFF0071FE FE8FFFLE81FFLC71 .?.0.G. F8EC7E3FFCOFCOFF FFFF00000000000 FFFFFFFFFFFFFE81 COLFFEFFE0001C00 E000FF8FC0E0003F FFF007E00FFFFFF FFFFFFFFFFFFFFFFF FFFFFFFFFFFFFFFFF FFE0703FFC7FFE3 FFFFFFFFFFFFFEFFL ".....P?.0.. ORDER SETTINGS BIT PLANES 165 10 COLUMN EXTRACT BY O ROW ALPHA 6 7 12 5 RED BIT ORDER LSB FIRST MSB FIRST 5 9口 1 VO GREEN BIT PLANE ORDER 7 5 口3 70 RGB 4 GRB 9 BLUE RBG BRG GBR BGR PREVIEW SETTINGS INCLUDE HEX DUMP IN PREVIEW CANCEL PREVIEW SAVE TEXT SAVE BIN HC:C7 LCLOLE707 -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1696173176570-8a7d19f2-eb07-4898-8637-26eecc63035e.png)

```plain
cnss{Zak0~~z4ko~Ov0}
```

##  # 三体人的低吟
## 扫码领取 flag
<!-- 这是一张图片，ocr 内容为：FORMAT INFO PATTERN TOP LEFT H ERROR CORRECTION LEVEL: O M 7 3 9 5 2 4 MASK PATTERN: CANCEL SAVE -->
![](https://cdn.nlark.com/yuque/0/2023/png/35229002/1696181123404-1d960df5-054c-424b-b39b-ac053a08acfc.png)



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

