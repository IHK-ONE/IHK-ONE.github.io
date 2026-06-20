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
<!-- 这是一张图片，ocr 内容为：中奶泡泡 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707792340730-aeccb068-270c-4431-be49-8c416aaa23bf.png)

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

<!-- 这是一张图片，ocr 内容为：上传文件 HGAMEFWELCOMELJ TEIREASIL -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706533029378-036300cc-4dc6-4b3c-a87f-6806ea637241.png)

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

<!-- 这是一张图片，ocr 内容为：CAPTURE.PCAPNG 文件(S), QQU王 应用显示过滤器....CTRL-/> INFO LENGTH DESTINATION NO. TIME PROTOCOL SOURCE 56 44353 + 8000 [SYN] SEQ-O WIN:64240 LEN-O MSS-1460 WS:256 SACK PERM 127.0.0.1 TCP 100000000127.0.1 56 8000 44353 [SYN, ACK] SEQ-O ACK-1 WIN-8192 LEN-0 MSS-65495 WS-256 127.0.0.1 20.000067127.0.0.1 TCP [ACK] SEQ-1 ACK-1 WIN-2097920 LEN-0 4443538000 X                                                                                                     WIRESHARK,导出,HTTP 对象列表 [SYN] SEQ-0 WIN-64240 LEN-0 MSS-1460 WS-256 SACK PERM 5443548000 154 [SYN, ACK] SEQ-0 ACK-1 WIN-8192 LEN-0 MSS-65495 WS-256 8000044354 CONTENT TYPE: ALL CONTENT-TYPES 文本过滤器: 4 44354 + 8000 [ACK] SEQ-1 ACK-1 WIN-2097920 LEN-0 分组 主机名 内容类型 大小 文件名 GET /EKING.JPG HTTP/1.1 4940 127.0.0.1:800 IMAGE/JPEG 2487 KB EKINGJPG 4 44353 [ACK] SEQ-1 ACK-842 WIN-2097152 LEN-0 8000 469 BYTES FAVICON.ICO 4980 127 127.0.0.1:8000 TEXT/HTML  4 353 [PSH, ACK] SEQ-1 ACK-842 WIN-2097152 LEN-191 [TCP S 44353 8000 SEGMEI E.4 @. 0200000004500000034CBCBCC400000800600 -A-@-B9: 7F00000017F000000001 AD411F400862393A 000000008002FA 967FF000020405B4 01030308010402 保存 全部保存 帮助 关闭 PREVIEW 配置:DEFAULT 分组:4985  已显示:4985(100.0%) CAPTURE.PCAPNG -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707310506477-f42d26e1-404a-49ff-9497-d6c90c27db51.png)

<!-- 这是一张图片，ocr 内容为：HGAME{EK1NG_WANT_GIRLFRIEND_QQ_761042182} -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707310760936-29b4dd02-4c8d-4a69-9ee9-f95c48c505c4.png)

```plain
hgame{ek1ng_want_girlfriend_qq_761042182}
```

## ezWord
文件改为.zip打开，media目录下，image1.png与100191209_p0.jpg 进行盲水印解码

<!-- 这是一张图片，ocr 内容为：HANLSSTELESTI LITELESS ANDES 2 3 2 200 2005 20 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707315708877-d411007f-100b-46e9-85b8-3d3daafb9b31.png)

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

<!-- 这是一张图片，ocr 内容为：DEEPSOUND_OF_DRAGON_DANCE 文件的 编辑()选择(S)视固M 提景(O)  生成(G)效果(O) 分析伪) 帮助(H) 车台48421212181260 648-48-42-18-I8-12-66 石 XOO R 耳机(REDMI BUDS 4) 耳机(REDMI BUDS 4) MME 2(位体声)录制声道 1.0 3.0 0-.0 2.0 4.0 X DEEPSOUND.OF_DRAGON_DANCE:频谱图设置 20K DEEPSOUND_EF 使用偏好设置 独爱 静音 15K KEA 颜色 长度 20 增益(DB)(G): 比例(C): 线性 10K 车 省 80 最低须率(HZ)(N):0 范围(DB)(R): 立体声 44100 HE 5K 2位浮 高须提升(DB/DEC)(B): :0 最高频率(HZ)(X):20000 0K 口友阶() 20K 算法 15K 算法(L): 频率 10K 窗口大小(S): 1024-默认 5K 窗口类型(T): HANN OK 零填充因子(Z): 启用频谱选区(B) 预览(P) 取消 确定 远区的起点和终点 项目采样率 吸附到 (HZ) 分00秒 00时00 00时00 分00.000秒 00 分 00.000秒 关闭 44100 单击并拖动远区的右边界.(吸附)(按ESC取消) 已停止. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707310671645-54f064bc-4ee3-42c5-ad9c-d20c07af1bfa.png)

得出的频谱图翻转

<!-- 这是一张图片，ocr 内容为：5H8WLUL CX3HOLG LEY 鑫刚 H8W.LWCX3H0LG R -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707310835733-cd955a3b-3314-4f9a-9c72-0eda69ad7cfb.png)

```plain
KEY: 5H8w1nlWCX3hQLG
```

DeepSound

<!-- 这是一张图片，ocr 内容为：DEEPSOUND 2.0 口 X HELP SETTINGS HIDE DATA INSIDE AUDIO AUDIO CONVERTER EXTRACT SECRET FILES ENCODE SECRET FILES OPEN CARRIER FILES ADD SECRET FILES CARRIER AUDIO FILES: SIZE(MB) FILE 77.3 MB C:\USERS\HK\DESKTOP DEEPSOUND OF DRAGON DANCE.WAV SECRET FILES IN C:/USERS\HK\DESKTOP\DEEPSOUNDOF DRAGON DANCE.WAV: SIZE(MB) SECRET FILE NAME XXX.ZIP 7.5 MB OUTPUT DIRECTORY:C:\USERS\HK\DOCUMENTS] DONATE -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707310910714-7b920731-85ee-44cc-933d-cb8dacf8902b.png)

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

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707313374782-47f3362a-4903-488e-8e8c-7be6f30b7b83.png)

修改掩码

<!-- 这是一张图片，ocr 内容为：FORMAT INFO PATTERN TOP LEFT ERROR CORRECTION LEVEL: H M Q 0 7 2 MASK PATTERN: 3 6 5 4 CANCEL SAVE -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707313444189-93f51ec0-3ff0-4ca9-aa97-b78ab199879b.png)

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

