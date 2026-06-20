---
title: '2023 羊城杯决赛 Writeup'
description: '一堆时间不知道干嘛，0宽提示先去看flag1拿到hint'
pubDate: 2023-11-15
author: 'IHK-1'
tags: ['CTF', '羊城杯', '决赛', '2023']
---

<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693702528739-39f8e247-2b98-46f3-8886-ceba265bd9fa.png)



> misc孤狼~
>



## ai和nia的交响曲


flag2.zip



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693653689476-c3f069b4-2d2b-4f87-99f1-44127da3f79a.png)



伪加密



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693653804768-f58d64dd-b90c-4158-b122-b1d94c8d65b0.png)



一堆时间不知道干嘛，0宽提示先去看flag1拿到hint



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693653831985-1fb9bc49-0782-4430-b5fc-88226dfb408a.png)



flag1.png



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693653865767-c302b904-a677-4403-9703-af484628798d.png)



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693653905534-b6799492-641b-4dd3-bd62-49d75fc2e330.png)



一副鬼样，读一下像素



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693653942552-9ea1cc02-15db-4eb5-8f4e-3654c2f7d37c.png)



转二进制



```python
from PIL import Image

im = Image.open('1.png')
pix = im.load()
width = im.size[0]
height = im.size[1]
for x in range(width):
    for y in range(height):
        r, g, b = pix[x, y]
        if r>200:
            print(1,end='')
        else:
            print(0,end='')
```



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693653970911-7e55f683-6c06-434c-b732-b3ae35b0dbf0.png)



```plain
HINT:BV1wW4y1R7Jv&&FLAG1:@i_n1a_l0v3S_
```



拿到flag1，hint一眼bv号，[https://www.bilibili.com/video/BV1wW4y1R7Jv](https://www.bilibili.com/video/BV1wW4y1R7Jv)



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654110076-3ec41264-8fed-4f47-9f67-51403fea179d.png)



结合之前flag2的时间应该对应帧，但是解出来**BANBANFAHFAM**不对



脑洞一下，往后晚一秒钟解出个**CAOCAOGAIFAN**比较有含义



拼一下flag：



```plain
@i_n1a_l0v3S_CAOCAOGAIFAN
```



## EZ_misc


两文件尾明显特征



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693702977113-239ec17e-f9b8-4de4-894e-8b8eb61d80e9.png)



考过好几次了，CVE-2023-28303



[frankthetank-music/Acropalypse-Multi-Tool: Easily detect and restore Acropalypse vulnerable PNG and GIF files with simple Python GUI. (github.com)](https://github.com/frankthetank-music/Acropalypse-Multi-Tool)



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654385306-683bd0ec-9d78-456f-98df-f331dd4b416c.png)



## Matryoshka


套娃



一张jpg



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654507443-0554f774-9a03-42c3-ae56-d63986bfdd65.png)



一个rar



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654517731-545593b6-888b-4206-89ca-bc5b709c6204.png)



一个encrypt，长度20.0mb一眼vc



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654603231-296e533c-30e0-4799-b629-4748a2dda623.png)



rar文件尾还一个jpg



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654548192-96c3ee28-bc07-4d0e-aa13-7361029050f7.png)



提取出来一样的小猫图，一眼盲水印，py2版本的



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654583579-2799fb25-8356-46a3-b6ec-3196868e5a31.png)



这里有点抽象，读出来是Watermark_is_fun，密码是小写的W，**watermark_is_fun**



挂载拿到



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654730236-0ba06ebe-2ad4-4ba7-b691-a47afd81b869.png)



0宽



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654748657-9793d23b-69c6-427b-aee4-00a0fd2a5a8a.png)



base32后维吉尼亚



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654782295-c126bbaa-7bfd-4c05-848d-11787cb3fe5b.png)



## 程序猿Quby


图片尾一个rar



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693698885088-100c5674-aaa7-42b5-a9ea-763dbf37a593.png)



图片是夏多密码，参考[犯罪大师本周解密 夏多密码解析_游戏攻略 (bilibili.com)](https://www.bilibili.com/video/BV1HR4y1G7Wc/?vd_source=db6b9c113a0b0a0351d22c0b2729de1a)



解得**HAVEANICEDAY**



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693698933228-9d2b44c3-3bdd-4c25-ae9d-4bfcaadcf4ad.png)



cloacked-pixel拿到rar密码



```plain
python2 lsb.py extract QUBY.png flag.txt HAVEANICEDAY
```



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693699100777-bd26c343-84bd-41e9-af72-b54e2f940c72.png)



excel有隐藏行



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693699844836-d29a1de7-efd6-43e5-a277-d0764c4d857b.png)



透明文字全加上颜色



6.66全部改为1，3.33都改为0



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693699865058-2a88142d-20c2-4a18-a037-d351f4d33315.png)



另一张表也同样处理，4.66改为0，5.53改为1



拼一起之后加个突出显示



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693700729968-ac71f375-a1fb-4bb5-b811-aa34a11bcadf.png)



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693700717366-cf2728b1-9942-48f0-95d1-b8dc779aff27.png)



缩放一下，翻转即可



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693700760758-5a833bac-4ad2-4735-9153-e752007722e6.png)



得到w0wyoudo4goodj0b



deepsound



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693700828407-c64e79b9-2ae3-4626-af3e-b9c0a3616ea8.png)



得到



```plain
fl4g.txt
:JOJ[=%tJD9gr2Q79*;T:-qZD=]S0c:0'nT7orYd9L_TD=Ys#Z9iY:q;-$Xo:dQs>9ia&M9i3]K5r2G>8Oc'9=%u:f8QIW;;bp(\8Ms%=10QJ$:KBnd<AmK;7p.T97oN8J
flag.txt
SjaoNgS0xgagUTpwe3QwHn4MrbkD/OUwqOQG/bpveg6Mqa4WH0k46
```



fl4g.txt解base85(a)，base32得到



```plain
sQ+3ja02RchXLUFmNSZoYPlr8e/HVqxwfWtd7pnTADK15Evi9kGOMgbuIzyB64CJ
```



长度64，一眼base64表



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202393/1693699379556-30283eed-f155-4221-aa2c-3c7d50be668b.png)



## 两只老虎


> 肝到凌晨两点的二血）
>



后面显然有一大堆不合常理的idat块，正常每个idat块应该保持0x10000，即65536不变



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693697066881-972987c2-b3a3-4ef2-ab2a-829dbb0c3eff.png)



后面数据块都提取出来并且在原图里删掉没有对原图产生任何影响，但是要留第一个0x84E2块，是这张图的原来的正常的IDAT块，这个删了发现原图底部会缺一块



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693697340107-71ed3a76-f707-4148-bd00-ad1177666c88.png)



得到的第一张png的结构：



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693697294075-55868620-9363-4d14-8e86-f860af0991b8.png)



后面提取出来的IDAT数据加上个原图的png头和png尾



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693697513444-244409dc-98db-48e9-a5ae-4aadde25ca20.png)



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693697522922-0ddabe7d-c5a0-4ceb-aaae-36a97c9b5adf.png)



打开可以发现一个整个像素乱掉的图，有过经验就很明显知道是png的宽被篡改了导致整个像素偏移了



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693697452649-c085fc48-be3f-4bef-a084-3eea97b850b4.png)



爆破一下第二张图的宽，小溜一下chatgpt



```python
import struct

# 输入和输出文件名
input_file = 'laohu.png'


def change(new_width,new_height):
    # 打开输入文件并读取二进制数据
    with open(input_file, 'rb') as file:
        png_data = file.read()
    output_file = f"output/{new_width}_{new_height}.png"
    # 找到宽度和高度所在的位置（通常在第16到20字节和20到24字节）
    width_start = 16    
    height_start = 20

    # 使用struct模块将新的宽度和高度转换为4字节的大端整数
    new_width_bytes = struct.pack('>I', new_width)
    new_height_bytes = struct.pack('>I', new_height)

    # 替换PNG文件中的宽度和高度数据
    png_data = png_data[:width_start] + new_width_bytes + png_data[width_start+4:height_start] + new_height_bytes + png_data[height_start+4:]

    # 将修改后的数据写入新文件
    with open(output_file, 'wb') as file:
        file.write(png_data)

    print(f'已保存为{output_file}')

new_height = 720
for new_width in range(0,2000):
    change(new_width,new_height)
```



同理也要爆破一下高，这里不再演示



最后爆破出来宽是1144，高是720的时候得到第二张图



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693697791018-7d69438c-ae40-42e9-a3a0-68f54cece7b0.png)



很明显宽1144比原图1134多了10像素，就是右边部分，直接裁剪掉



两张图对比像素有差异，很明显的盲水印特征



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693698670424-4a9c7e49-9371-410d-b481-119652c76efb.png)



但是盲水印、异或都试过了都没出



各种fuzz后读取每行的不同像素点数量是flag



```python
from PIL import Image
image1_path = "1.png"
image2_path = "new_image.png" 


img1 = Image.open(image1_path)
img2 = Image.open(image2_path)

# 获取图像的宽度和高度
width, height = img1.size


# 逐行比较像素
for y in range(height):
    row1_pixels = list(img1.crop((0, y, width, y + 1)).getdata())
    row2_pixels = list(img2.crop((0, y, width, y + 1)).getdata())

    # 比较两行像素是否相同
    if row1_pixels != row2_pixels:
        count = 0
        for p1, p2 in zip(row1_pixels, row2_pixels):
            if p1 != p2:
                count += 1
        print(chr(count),end='')

#DASCTF{tWo_t1gers_rUn_f@st}
```



一些个骚且帅的姿势



```python
from PIL import Image
import numpy as np

img1 = np.array(Image.open('1.png'))
img2 = np.array(Image.open('1144_720.png').crop((0, 0, 1134, 720)))
print(bytes([sum(i) for i in img1[:, :, 0] != img2[:, :, 0] if sum(i) != 0]).decode())
```



## Easy_VMDK


> ["小明这次使用了32Bytes的随机密码，这次总不会被爆破出来了吧！！。小明压缩了好了题目后，他发现压缩后大小比压缩前还大啊，这不就没有压缩啊，这是为什么啊！","小明这次使用了32Bytes的随机密码，这次总不会被爆破出来了吧！！"]
>



压缩后更大，在提示store



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654902406-acb3ade8-de42-4a6b-a932-b2298b47a724.png)



电脑里随便翻几个vmdk的文件头，直接明文打



flag.zip



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654953909-c1d154d4-b0ae-4961-af77-8f800ec7347a.png)



key.txt



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654962541-bea70975-9ce1-4c9f-b910-9b11daf7fdc6.png)



flag.zip后面还有个zip



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693654999887-ed0b9538-b50b-410d-82db-2079e2c4280b.png)



解得key.txt的加密脚本，读像素，uu编码再base64



```python
import cv2
import base64
import binascii


img = cv2.imread("key.png")
r, c = img.shape[:2]
print(r, c)
# 137 2494

with open("key.txt", "w") as f:
    for y in range(r):
        for x in range(c):
            uu_byte = binascii.a2b_uu(', '.join(map(lambda x: str(x), img[y, x])) + "\n")
            f.write(base64.b64encode(uu_byte).decode() + "\n")
```



逆一下



```python
import base64
import binascii
from PIL import Image


height = 137
width = 2494
im = Image.new("RGB", (width, height), 'white')
imglists=[]
with open("key.txt", "r") as f:
    lists=f.readlines()
    for i in lists:
        data = (binascii.b2a_uu(base64.b64decode(i))).decode().strip()
        imglists.append(data)

for y in range(height):
    for x in range(width):
        pixel = tuple(map(int, imglists[y * width + x].split(', ')))
        im.putpixel((x, y), pixel)

im.show()
```



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693655470485-53b0496b-0a2b-43bc-8708-ba7b5822ae46.png)



**HELLO_DASCTF2023_WORLD** 解开拿到flag



## GIFuck


拆帧



```python
from PIL import Image
import os
# 打开GIF文件
gif_path = "flag.gif"
gif_image = Image.open(gif_path)

# 获取GIF中的帧数
num_frames = gif_image.n_frames

# 创建一个目录来保存PNG图像
output_directory = "output_png_frames/"
os.makedirs(output_directory, exist_ok=True)

# 循环遍历每一帧并保存为PNG图像
for frame_number in range(num_frames):
    gif_image.seek(frame_number)
    frame_image = gif_image.copy()
    frame_image.save(f"{output_directory}{frame_number}.png")
```



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693655779744-eff44752-6648-4a53-aade-ea6f671dbbfc.png)



类型不多，不ocr了，直接根据哈希打印一下字符



```python
import os
import hashlib

# 获取当前工作目录
current_directory = os.getcwd()

# 遍历当前路径下的所有文件和子文件夹
for root, dirs, files in os.walk(current_directory):
    for i in range(1,1100):
        file_name = str(i)+".png"
        file_path = os.path.join(root, file_name)
        if os.path.isfile(file_path):
            with open(file_path, 'rb') as file:
                md5_hash = hashlib.md5()
                while True:
                    data = file.read(4096)  # 每次读取4KB
                    if not data:
                        break
                    md5_hash.update(data)
                if md5_hash.hexdigest() == "73b98b0ce63e17f9686d8f1c7c2c1ea4":
                    print("+",end='')
                elif md5_hash.hexdigest() == "0603d47d8bbd5824d76d487a3f313b11":
                    print("[",end='')
                elif md5_hash.hexdigest() == "abd01d8e57bd41d62a7444aadbb932a5":
                    print("-",end='')
                elif md5_hash.hexdigest() == "59fe976c8572cdd59996b4e3c088809e":
                    print(">",end='')
                elif md5_hash.hexdigest() == "af08104d55fae5787b073e974aa8f303":
                    print("<",end='')
                elif md5_hash.hexdigest() == "e20180170280aeb074384bcbae840cf0":
                    print("]",end='')
                elif md5_hash.hexdigest() == "fd439e1a7e9058ae4d635755dedf4191":
                    print(".",end='')
                else:
                # 打印文件路径和MD5哈希值
                    print(f"File: {file_path} MD5: {md5_hash.hexdigest()}")
```



```plain
+[->+<]>[->+<]>-[->+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+<]+<+<+[->+<]>[->+<]>[->-<]>[-<+>]+<+<+[->+<]>[->+<]>[->-<]>[-<+>]<+[->+<]>[->-<]>[-<+>]<+<+[->+<]>[->+<]>[->-<]>[-<+>]+<+[->+<]>[->-<]>[-<+>]+<+<+[->+<]>[->+<]>[->-<]>[-<+>]<+<+[->+<]>[->+<]>[->+<]>[-<+>]+<+[->+<]>[->-<]>[-<+>]+<+[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[-<+>][->+<]>[-<+>]+<+[->+<]>[->-<]>[-<+>]+<+[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[-<+>]+[->+<]>[-<+>]+<+[->+<]>[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[-<+>][->+<]>[-<+>]+<+<+[->+<]>[->+<]>[->-<]>[-<+>]+<+[->+<]>[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[-<+>][->+<]>[-<+>]+<+[->+<]>[->-<]>[-<+>]+<+[->+<]>[->+<]>[-<+>]+<+[->+<]>[->+<]>[-<+>]+<+<+[->+<]>[->+<]>[->+<]>[-<+>]<+[->+<]>+.<+[->+<]>+.+.+.<+[->-<]>-.<+[->+<]>+.<+[->+<]>+.-.<+[->-<]>-.<+[->+<]>+.<+[->-<]>-.+.-.<+[->-<]>-.<+[->+<]>+.+.<+[->-<]>-.+.<+[->-<]>-.<+[->+<]>+.<+[->+<]>+.<+[->-<]>-.<+[->+<]>+.+.+.<+[->-<]>-.<+[->+<]>+.-.<+[->+<]>+.<+[->-<]>-.<+[->-<]>-.[-]<
```



很明显brainfuck，但解出来不对



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693657023110-56d4e9f0-c872-4d43-8546-ba54e35e5678.png)



脑洞一下，读一下帧长度，小溜一下chatgpt



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693657144866-d5c4951b-1231-4d2c-83ba-59b68712b615.png)



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693657167024-a86145f0-b0c4-48b1-a2e1-904a96dda946.png)



很明显全60的倍数，按倍数次去导，稍微改改文件名格式方便后面按顺序读



```python
from PIL import Image
import os
# 打开GIF文件
gif_path = "flag.gif"
gif_image = Image.open(gif_path)

# 获取GIF中的帧数
num_frames = gif_image.n_frames

# 创建一个目录来保存PNG图像
output_directory = "output_png_frames_repeat/"
os.makedirs(output_directory, exist_ok=True)

# 读取并根据时间帧长度导出帧
for frame_number in range(num_frames):
    gif_image.seek(frame_number)
    frame_image = gif_image.copy()
    duration = gif_image.info['duration']  # 获取当前帧的时间帧长度（以毫秒为单位）
    
    export_count = duration // 60

    for i in range(export_count):
        frame_image.save(f"{output_directory}{frame_number:d}{(i+1):02d}.png")
```



再打印一波字符 这次形式就很对



```plain
++++[->++++<]>[->++++++<]>-[->+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<]+++<++<+[->++++<]>[->++++<]>[->-<]>[-<<<+>>>]++<+++<+[->++++<]>[->++++<]>[->-<]>[-<<<+>>>]<+++[->++++<]>[->-<]>[-<<<+>>>]<+++<+[->++++<]>[->++++<]>[->-<]>[-<<<+>>>]+++<++[->++++<]>[->-<]>[-<<<+>>>]+<++<+[->++++<]>[->++++<]>[->-<]>[-<<<+>>>]<+++<+[->++++<]>[->++++<]>[->+<]>[-<<<+>>>]+++<+++[->++++<]>[->-<]>[-<<<+>>>]++<+[->++++<]>[->+<]>[-<<<+>>>]+++<+++[->++++<]>[->+<]>[-<<<+>>>][->+<]>[-<<<+>>>]+++<+++[->++++<]>[->-<]>[-<<<+>>>]++<++[->++++<]>[->+<]>[-<<<+>>>]+++<+++[->++++<]>[->+<]>[-<<<+>>>]++<+[->++++<]>[->+<]>[-<<<+>>>]++[->+<]>[-<<<+>>>]+<<+[->++++<]>[->++++<]>[->+<]>[-<<<+>>>]+<<+[->++++<]>[->++++<]>[->+<]>[-<<<+>>>]+<+++[->++++<]>[->+<]>[-<<<+>>>]++<+[->++++<]>[->+<]>[-<<<+>>>][->+<]>[-<<<+>>>]++<+++<+[->++++<]>[->++++<]>[->-<]>[-<<<+>>>]+<<+[->++++<]>[->++++<]>[->+<]>[-<<<+>>>]+<<+[->++++<]>[->++++<]>[->+<]>[-<<<+>>>]+<+++[->++++<]>[->+<]>[-<<<+>>>]++<+[->++++<]>[->+<]>[-<<<+>>>][->+<]>[-<<<+>>>]+++<+++[->++++<]>[->-<]>[-<<<+>>>]++<+[->++++<]>[->+<]>[-<<<+>>>]+++<+++[->++++<]>[->+<]>[-<<<+>>>]++<+++<+[->++++<]>[->++++<]>[->+<]>[-<<<+>>>]<<+++++++++[->+++++++++<]>++.<+++++[->+++++<]>+++.+++..+++++++.<+++++++++[->---------<]>--------.<++++++++[->++++++++<]>++.<++++[->++++<]>+++.-.<+++++++++[->---------<]>---.<+++++++++[->+++++++++<]>++++++++.<+++[->---<]>-.++++++.---.<+++++++++[->---------<]>-.<++++++++[->++++++++<]>++++++.++++++.<+++[->---<]>--.++++++.<++++++++[->--------<]>-------.<++++++++[->++++++++<]>+++++++++.<+++[->+++<]>+.<+++++++++[->---------<]>--.<++++++++[->++++++++<]>++++++++++++++.+.+++++.<+++++++++[->---------<]>---.<++++++++[->++++++++<]>++++++++.---.<+++[->+++<]>++++.<+++[->---<]>----.<+++++++[->-------<]>------.[-]
```



flag在memory



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693657292936-2a21ff84-c66a-4ae8-a991-1faaea9781ef.png)



<!-- 这是一张图片，ocr 内容为： -->
![](https://c.img.dasctf.com/images/202392/1693657305390-f54c1ce1-6a47-4985-b3f0-291ae26d9700.png)

