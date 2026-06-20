---
title: '2024 HGAME MISC Writeup'
description: '直接导出图片查看即可'
pubDate: 2024-02-10
author: 'IHK-1'
tags: ['CTF', 'HGAME', 'MISC', '2024']
---

```plain
title: 2024 HGAME MISC WP
date: 2024-02-5 10:00:00
categories: 
- WP
tags:
- MISC
- WP
```

# WEEK1
---

## SignIn

```plain
hgame{WOW_GREAT_YOU_SEE_IT_WONDERFUL}
```

## 来自星尘的问候
```shell
# hint1:6位弱口令
steghide extract -sf '/root/Desktop/secret.jpg'  -p '123456'

# hint2:《来自星尘》 font字体
# https://github.com/MY1L/Ctrl/releases/tag/v1-alpha
# CtrlAstr.3.11VF.ttf

# hgame{welc0me!}
```

## simple_attack
```shell
bkcrack -C 'attachment.zip' -c '103223779_p0.jpg' -P 'src.zip' -p '103223779_p0.jpg' 
>> keys:e423add9 375dcd1c 1bce583e

bkcrack -C 'attachment.zip' -c '103223779_p0.jpg' -k e423add9 375dcd1c 1bce583e -U 'out.zip' 123456

# out.zip 中的 photo.txt base64解码图片
# hgame{s1mple_attack_for_zip}
```

## 希尔希尔希尔
```shell
# photo crc 爆破
# [Width]:1394
# [Heught]:1999

# 分离出zip
binwalk -e secret.png ---run-as=root

# zseteg获得key
zsteg secret.png
# >>KEY:[[8 7][3 8]];A=0

# 希尔解密
# DISAPPEARINTHESEAOFBUTTERFLY
# hgame{DISAPPEARINTHESEAOFBUTTERFLY}
```

# WEEK2
---

## ek1ng_want_girlfriend
直接导出图片查看即可

```plain
hgame{ek1ng_want_girlfriend_qq_761042182}
```

## ezWord
文件改为.zip打开，media目录下，image1.png与100191209_p0.jpg 进行盲水印解码

解压secret.zip

```plain
Dear E-Commerce professional ; This letter was specially
selected to be sent to you . We will comply with all
removal requests ! This mail is being sent in compliance
with Senate bill 1620 ; Title 3 ; Section 308 ! This
is not a get rich scheme ! Why work for somebody else
when you can become rich in 27 MONTHS . Have you ever
...
...
love convenience ! Well, now is your chance to capitalize
on this . WE will help YOU turn your business into
an E-BUSINESS & SELL MORE . You can begin at absolutely
no cost to you ! But don't believe us . Mr Ames of
Louisiana tried us and says "Now I'm rich, Rich, RICH"
. We are licensed to operate in all states . We BESEECH
you - act now . Sign up a friend and you'll get a discount
of 50% ! Thank-you for your serious consideration of
our offer .

# spammimic
籱籰籪籶籮粄簹籴籨粂籸籾籨籼簹籵籿籮籨籪籵簺籨籽籱簼籨籼籮籬类簼籽粆

# ROT8000
hgame{0k_you_s0lve_al1_th3_secr3t}
```

## 龙之舞
频谱图 -> 频谱图设置频率调高至20000 

得出的频谱图翻转

```plain
KEY: 5H8w1nlWCX3hQLG
```

DeepSound

```python
from PIL import Image

gif = Image.open('龙之舞.gif')
qrcode_size = 162
out = Image.new('RGB', (qrcode_size * 2, qrcode_size * 2))

for i in range(gif.n_frames):
    gif.seek(i)
    if i != 0 and (gif.getpixel((gif.size[0] - qrcode_size, gif.size[1] - qrcode_size)) != (0, 180, 0)):
        crop = gif.crop((gif.size[0] - qrcode_size, gif.size[1] - qrcode_size, gif.size[0], gif.size[1]))

        if i == 54:
            out.paste(crop, (0, 0, qrcode_size, qrcode_size))
        elif i == 120:
            out.paste(crop, (0, qrcode_size, qrcode_size, qrcode_size * 2))
        elif i == 152:
            out.paste(crop, (qrcode_size, 0, qrcode_size * 2, qrcode_size))
        elif i == 231:
            out.paste(crop, (qrcode_size, qrcode_size, qrcode_size * 2, qrcode_size * 2))

out.save('qrcode.png')
```

修改掩码

```plain
hgame{drag0n_1s_d4nc1ng}
```

## 我要成为华容道高手
```javascript
// 找到原版链接：https://github.com/conwnet/huarongdao/blob/master/src/core.js
// 原版代码中有 getSlove 函数
// 但是需要修改如下：

let getSolve = function (state) {
    let que = [state], vst = {[state]: {prev: null, move: null}}, result = [];

    while(que.length) {
        let cur = que.shift(), res = false;

        if (cur[13] === '5') {
            // 当找到目标状态时，反向追踪回初始状态
            let traceState = cur;
            while(vst[traceState].prev !== null) {
                let moveInfo = vst[traceState].move; // 获取移动信息，包括位置和方向
                result.unshift(moveInfo); // 将移动信息添加到结果数组的开头
                traceState = vst[traceState].prev; // 追踪到前一个状态
            }
            break;
        }

        for(let i = 0; i < cur.length; i++) {
            (res = moveUp(cur, i)) && !vst[res] && que.push(res) && (vst[res] = {prev: cur, move: {position: i, direction: 1}});
            (res = moveDown(cur, i)) && !vst[res] && que.push(res) && (vst[res] = {prev: cur, move: {position: i, direction: 3}});
            (res = moveLeft(cur, i)) && !vst[res] && que.push(res) && (vst[res] = {prev: cur, move: {position: i, direction: 4}});
            (res = moveRight(cur, i)) && !vst[res] && que.push(res) && (vst[res] = {prev: cur, move: {position: i, direction: 2}});
        }
    }
    return result;
}

// 注释export
//export default { 
//    moveUp, moveDown, moveLeft, moveRight, getSolve
//}
```

```python
import requests
import execjs

url = 'http://106.14.57.14:31169'

js_code = open("core.js", encoding='utf-8').read()
ctx = execjs.compile(js_code)
state = '05132111241230411412'

def getSolve(state):
    return ctx.call("getSolve", state)

response = requests.get(url + '/api/newgame').json()
gameId = str(response['gameId'])
result = getSolve(response['layout'])

while True:
    try:
        response = requests.post(url + '/api/submit/' + gameId, json=result).json()
        print(response)
        layout = str(response['game_stage']['layout'])
        result = getSolve(layout)
    except:
        print(response['flag'])
        break

```

