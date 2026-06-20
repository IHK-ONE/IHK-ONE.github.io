---
title: '2023 NepCTF Writeup'
description: 'NepCTF{H4ve_Fun_1N_This_Game}'
pubDate: 2023-09-15
author: 'IHK-1'
tags: ['CTF', 'NepCTF', '2023']
---

# MISC
## CheckIn
NepCTF{H4ve_Fun_1N_This_Game}

## codes
```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc,char **argv,char** enp)
{
    int i=0;
    for(i=0;enp[i]!=NULL;i++)
    printf("enp[%d]=%s\n",i,enp[i]);
    return 0;
}
```

## 与AI共舞的哈夫曼(方法一)

题目中给出了Nepctf{humanzi6}，可以根据题目huffman compress猜出是Nepctf{huffman_zip_666}

## 与AI共舞的哈夫曼(方法二)
题目给出代码

  
但是没有给出input.txt，根据题目的意思查询ChatGPT后得到结果

```python
'''询问语句：
compress.py的代码...

这段代码执行后生成了compressed.bin，我没有其余的input.txt，可能已经被写入了compressed.bin，请告诉我如何只通过compressed.bin解压出文件decompressed.txt
# 解压缩文件
decompress(compressed_file, decompressed_file)
'''
# 生成代码

import heapq
import os

class HuffmanNode:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None

    def __lt__(self, other):
        return self.freq < other.freq

def build_huffman_tree(frequencies):
    heap = [HuffmanNode(char, freq) for char, freq in frequencies.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = HuffmanNode(None, left.freq + right.freq)
        merged.left = left
        merged.right = right
        heapq.heappush(heap, merged)

    return heap[0]

def build_huffman_codes(node, current_code, huffman_codes):
    if node is None:
        return

    if node.char is not None:
        huffman_codes[node.char] = current_code
        return

    build_huffman_codes(node.left, current_code + '0', huffman_codes)
    build_huffman_codes(node.right, current_code + '1', huffman_codes)

def decompress(input_file, output_file):
    with open(input_file, 'rb') as f:
        data = f.read()

    num_symbols = data[0]
    frequencies = {}
    index = 1

    for _ in range(num_symbols):
        byte = data[index]
        freq = (data[index + 1] << 24) + (data[index + 2] << 16) + (data[index + 3] << 8) + data[index + 4]
        frequencies[byte] = freq
        index += 5

    root = build_huffman_tree(frequencies)
    huffman_codes = {}
    build_huffman_codes(root, '', huffman_codes)

    compressed_data = ''
    for i in range(index, len(data)):
        byte = data[i]
        compressed_data += format(byte, '08b')

    padding = 8 - len(compressed_data) % 8
    compressed_data = compressed_data[:-padding]

    current_node = root
    decompressed_data = []

    for bit in compressed_data:
        if bit == '0':
            current_node = current_node.left
        else:
            current_node = current_node.right

        if current_node.char is not None:
            decompressed_data.append(current_node.char)
            current_node = root

    with open(output_file, 'wb') as f:
        f.write(bytes(decompressed_data))

if __name__ == "__main__":
    compressed_file = 'compressed.bin'
    decompressed_file = 'decompressed.txt'

    # 解压缩文件
    decompress(compressed_file, decompressed_file)

# 打开 decompressed.txt 得到 Nepctf{huffman_zip_666}
```

## 小叮当弹琴
附件使用Audacity打开，后半部分为16进制

```plain
0x370A05303C290E045005031C2B1858473A5F052117032C39230F005D1E17
```

16进制转码后为一个乱码的文件，猜测是异或，并手动异或Nepctf，发现结果为Yousho，推测前面是莫斯密码

```plain
Yousho 
-.-- --- ..- ... .... ---
```

发现能对应头部的点线

尝试转码莫斯密码

```plain
-.-- --- ..- ... .... --- ..- .-.. -.. ..- ... . - .... .. ... - --- -..- --- .-. ... --- -- . - .... .. -. --.
YOUSHOULDUSETHISTOXORSOMETHING
```

进行异或，会发现莫斯转码出来的大写字符串输出也是乱码，改小写字符串

得到flag

```plain
NepCTF{h4ppy_p14N0}
```

## 陌生的语言

根据hint推测出《小魔女学院》贴吧中查找到相关信息

```plain
https://tieba.baidu.com/p/4960864131?pn=2
https://tieba.baidu.com/p/4960864131?pn=3
```

对应码表解出flag

```plain
NepCTF{NEPNEP_A_BELIEVING_HEART_IS_YOUR_MAGIC}
```

## connted_five
五子棋，虽然加了一些机制但是并不重要，只需要连自己的五子即可

不过要吐槽一下环境不是很稳定，如果发现棋子不是秒加载直接重新尝试，不然下了很久突然卡住会很崩溃

```plain
NepCTF{GomokuPlayingContinousIsFun_310858c17a2c}
```

## 你也喜欢三月七吗
根据题目信息和题目附件信息

```plain
群名：NepCTF 2023
salt:NepCTF2023
算法:SHA256

salt_lenth= 10 
key_lenth= 16 

iv= 88219bdee9c396eca3c637c0ea436058 #原始iv转hex的值
ciphertext= b700ae6d0cc979a4401f3dd440bf9703b292b57b6a16b79ade01af58025707fbc29941105d7f50f2657cf7eac735a800ecccdfd42bf6c6ce3b00c8734bf500c819e99e074f481dbece626ccc2f6e0562a81fe84e5dd9750f5a0bb7c20460577547d3255ba636402d6db8777e0c5a429d07a821bf7f9e0186e591dfcfb3bfed
```

推测是群名字取SHA256取前32位得到

再进行AES解码

得到一个图片链接

对应码表解出flag

```plain
NepCTF{HRP_aIways_likes_march_7th}
```

## 问卷调查
```plain
NepCTF{See_you_in_NepCTF2024}
```

