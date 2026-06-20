---
title: '2024 某内部赛 出题 Writeup'
description: '根据题目的gif图片，发现每一帧向右移动一列并显示'
pubDate: 2024-09-10
author: 'IHK-1'
tags: ['CTF', '内部赛', '出题', '2024']
---

# split
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/gif/35229002/1711443826863-91a9ddb5-3b4e-4b70-b41e-52cc216ba88b.gif)

根据题目的gif图片，发现每一帧向右移动一列并显示

尝试将每帧每一列的像素提取

```python
from PIL import Image  # pillow图片处理库

gif = Image.open('split.gif')  # 加载gif图片
n_frames = gif.n_frames  # 获取gif帧数

for i in range(n_frames):  # 遍历每一帧
    gif.seek(i)
    for y in range(gif.height):  # 遍历每一帧的列的所有像素
        pixel = gif.getpixel((i, y))
```

尝试添加到一张图像上显示，具体代码如下：

```python
from PIL import Image

gif = Image.open('split.gif')
n_frames = gif.n_frames
out = Image.new('RGB', (gif.width, gif.height))  # 新建一张图像

for i in range(n_frames):
    gif.seek(i)
    for y in range(gif.height):
        pixel = gif.getpixel((i, y))
        out.putpixel((i, y), pixel)  # 将遍历位置的像素添加到新建图像上
    gif.save(f'{i}.png')

out.show()  # 显示图像
```

# rgb
根据 r g b三个文本的内容，推断出卫 stegsolve（一种常见的lsb隐写工具） 的hexdump输出数据

<!-- 这是一张图片，ocr 内容为：37C9194ACBE2B784 4873DFA638C636A6 7............8.6. 92AE62A31D7B9787 4F2F61BAFC47675D ..B...0/A...6G 068D829BF49BF090 26B4926FC2AF7267 003EEF6989027B7E F10B9AF366C136AE .>.I.............. 2AEB 0....B.FF..Y."*. 30A1F020D0428446 469B9A59CD22AEB 0 860BD2BEF6B71700 8B70A0E6D144DB64 .............D...D 21BDFD02AD8BE9D5 DFFBC1D4F524F8BF !..... 7 5949EC35F6603235 A16BE2D164CFEF3C YI.5.'25.K... 8 25A330925E19688F EDD56E06B9DE5BB7 %.0.V.H.....N. 1 FBFF285D9B815B42 .}.J...1..(].(].[B C77DBBAD3DEBA31 LO 24473E6A6A572D6B 3E134E2B4B7547AD $G>JJW-K>.N+KUG. 25F76C432EF40438 03EB7F22BE856E96 %.1C..... 2 C6197534EC4686CD 56471B7FA295A03C ..U4.F...VG. 13 4C74B18B46082A02 E5235F0D7F589D45 LT..F.*..#_..X.E 14 P}.GAHE... 34B99F510E15707D A8475E483D9EBBFA Q 15 4. 6279466BA41D2DF4 6697916339B9F7EF BYFK. 16 ,U.U......... 3CE2DC96F555DD75 DEDDA7E0C842EBFB 17 C8210C002A106EA2 B48219C985B06928 .!..*.N............I( -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1711444176433-e02fd5a6-8b7b-4c57-bf3a-6e2f85996c7a.png)

示例：

<!-- 这是一张图片，ocr 内容为：EXTRACTPREVIEW  FEEFFEEFFEEFFEFE FEFFEEFFEEFFEEF EFEEFEEFEEEEEEEF FEEEEEFEEEEEEEE EFEEEEEEEFEEEEEFE FEEFFEFFEFFEEFF EEEEEEEEEEEEEEEE EEEEEEEEEEEEEEE EFEEEEEEEEEEEEFEE EEEEEEEEEEEEEE EFEEEFFEEFFEEFEEE FEEEEEEEEEEEEE EEFEEEEEEEEEEEEF FEEEEEEEEEEEEEE  FFFFFFFFFFFFFFFF FFEFFFFFFFFFFFF EFFEFFEFFEFFEFEFE FEFEEEEEEEEEFE EEEEEEEEEEEEEEEEE EEEEEEEEEEEEEE ORDER SETTINGS BIT PLANES 2 3 5 6 EXTRACT BY O ROW O COLUMN 1 4 ALPHA 070605040302口 12 10 RED LSB FIRST BIT ORDER MSB FIRST 0706 04 口3 01 01 01 GREEN BIT PLANE ORDER 5 2 6 3 4 BLUE GRB RGB BRG RBG PREVIEW SETTINGS GBR BGR INCLUDE HEX DUMP IN PREVIEW PREVIEW CANCEL SAVE TEXT SAVE BIN -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1711444232574-a9b64ce4-2987-4039-80c9-18e865af860d.png)

通过了解 stegsolve工具 原理，得知hexdump的数据是根据像素 rgb 值的二进制数据[i]通道按照自定义序列显示

比如下列有(0,0) (1,0) (2,0) 位置上的三个像素值 (111,111,111) (123,123,123) (222,222,222)



bin值为 

（0，0）：（01101111，01101111，01101111)

（1，0）：（01111011，01111011，01111011）

（2，0）：（11011110，11011110，11011110）

如果通道选择为0，1，则数据为每个像素值的 rgb 值的二进制最后两位拼接一起

（0，0）的 rgb 值二进制最后一位 1，1，1 和 第二位 1，1，1

（1，0）的 rgb 值二进制最后一位 1，1，1 和 第二位 1，1，1

（2，0）的 rgb 值二进制最后一位 0，0，0 和 第二位 1，1，1

按照通道和最后按自定义顺序（默认为RGB）拼接一起：1，1，1，1，1，1，0，0，0，1，1，1，1，1，1，1，1 .....

stegsolve显示出来：通过每8位的二进制数值解码成字节，并以16进制显示出来



根据此题的r,g,b.txt 为三个通道的数据值，尝试通过r，g，b三个通道的数据恢复图像数据，即根据上面的原理还原即可：

例如：

abcdef 对应的二进制为：10101011 11001101 11101111

又因为这题目是8个通道，即r的二进制[0:8] 10101011，g的二进制[0:8] 11001101，b的二进制[0:8] 11101111，还原出rgb值为：r 171,g 205, b 239，其实就是ab cd ef 的10进制

```python
from PIL import Image  # python的图像处理库

r_lines = open('r.txt', 'r').readlines()
g_lines = open('g.txt', 'r').readlines()
b_lines = open('b.txt', 'r').readlines()

r = []
g = []
b = []

for i in range(len(r_lines)):  # 从 r,g,b 的文本中提取像素值
    r_tmp = r_lines[i][0:16] + r_lines[i][17:17 + 16] # 读取16进制
    g_tmp = g_lines[i][0:16] + g_lines[i][17:17 + 16]
    b_tmp = b_lines[i][0:16] + b_lines[i][17:17 + 16]

    for j in range(0, 32, 2):  # 转换为整数
        r.append(int(r_tmp[j:j + 2], 16)) # 还原出10进制 rgb 值
        g.append(int(g_tmp[j:j + 2], 16))
        b.append(int(b_tmp[j:j + 2], 16))

# 现在提取了所有的 r,g,b 值，直接还原即可图像
size = (1200, 70)  # 新建图像尺寸，长宽得到的原因：质因数分解 len(r)//2 = 2 * 2 * 2 * 2 * 2 * 3 * 5 * 5 * 5 * 7
out = Image.new('RGB', size, 'white')

size = (1200, 70)
for y in range(size[1]): # 将得到的r，g，b值放入图中还原像素
    for x in range(size[0]):
        # print(x,y)
        out.putpixel((x, y), (r[y * size[0] + x], g[y * size[0] + x], b[y * size[0] + x]))

out.show()

```

