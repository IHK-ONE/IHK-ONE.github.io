---
title: 'Python Flask 框架学习笔记'
description: '通过 app.route 进行装饰'
pubDate: 2024-03-01
author: 'IHK-1'
tags: ['Python', 'Flask', 'Web', '学习笔记']
---

[https://blog.csdn.net/sinat_38682860/article/details/82354342](https://blog.csdn.net/sinat_38682860/article/details/82354342)

# flask 配置
## flask 配置
```python
app = Flask(__name__) # 实例化当前文件为 flask 对象
app = Flask("my-app", static_folder="path1", template_folder="path2")
# 设置 静态目录 以及 模板目录

print(Flask.__doc__) # 查看开发文档
```

## 调试模式
```python
app.run(debug=True)
```

## 绑定 IP 与端口
```python
app.run(host='0.0.0.0', port=80)
```

# 参数传递以及路由设置
## route 路由
```python
from flask import Flask

# 使用当前文件实例化 flask 对象，方便读取内容以及操作
app = Flask(__name__)

@app.route("/")
# url 映射路由，映射路由方便程序知道改路由对应的代码 通过 @app.route 装饰器表示
def index():
    return "hello world!"

if __name__ == "__main__":
    app.run
```

通过 app.route 进行装饰

```python
from flask import Flask

app = Flask(__name__)
# 使用当前文件实例化 flask 对象，方便读取内容以及操作

@app.route("/a")
# url 映射路由，映射路由方便程序知道改路由对应的代码 通过 @app.route 装饰器表示
def a():
    return "hello world!a"

@app.route("/b")
def b():
    return "hello world!b"

if __name__ == "__main__":
    app.run()
```

## methods 访问方法
```python
from flask import Flask
app = Flask(__name__)

@app.route("/a", mehods=["GET", "POST"])
# 设置路由只能 GET 与 POST 访问
def a():
    return "hello world!a"

@app.route("/b", mehods="POST")
# 设置路由 POST 访问
def b():
    return "hello world!b"

if __name__ == "__main__":
    app.run()
```

## URL 传参
url 传递参数

```python
from flask import Flask, request # 引入了 request
app = Flask(__name__)

@app.route("/")
def index():
    print(request.args.get("input")) # 字典操作
    return request.args # 实际返回字典

if __name__ == '__main__':
    app.run() 
```



当传参不存在时候会报错

那么可以设置一个处理判断函数

```python
from flask import Flask, request

app = Flask(__name__)


@app.route('/')
def hello_world():
    response =  request.args.get('info')
    if response == None: # 需要进行简单的处理一下
        return "error"
    else:
        return response

if __name__ == '__main__':
    app.run(port=5000)
```

另一种方法是设置默认值

```python
from flask import Flask, request

app = Flask(__name__)


@app.route('/')
def hello_world():
    response =  request.args.get('info','默认值')
    return response

if __name__ == '__main__':
    app.run(port=5000)
```

处理多个传参

```python
from flask import Flask, request
app = Flask(__name__)

@app.route('/')
def hello_world():
    response = request.args.getlist('input') # 使用 getlist 方法，否则则会处理第一个值
    return response

if __name__ == '__main__':
    app.run(port=5000)
```

## POST 传参
直接进行 stream 读取 body 值

```python
from flask import Flask, request
app = Flask(__name__)

@app.route('/')
def hello_world():
    response = request.stream.read()
    return response

if __name__ == '__main__':
    app.run(port=5000)
```

使用 request.form 处理 post 传参值

```python
from flask import Flask, request
app = Flask(__name__)

@app.route('/',methods=['POST'])
def hello_world():
    print(request.form)
    print(request.form.get('input'))
    return 'POST test'

if __name__ == '__main__':
    app.run(port=5000)
```

## json 传参
```python
from flask import Flask, request
app = Flask(__name__)

@app.route('/',methods=['POST'])
def hello_world():
    print(request.json)

if __name__ == '__main__':
    app.run(port=5000)
```

# 文件上传处理
```python
from flask import Flask, request
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config["ALLOWED_EXTENSIONS"] = {'png', 'jpg', 'jpeg', 'gif'}

# 文件上传 WAF 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file'] # 获取 file 字典
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(filename)
        
        return "uploaed"
    else:
        return "faild"


if __name__ == '__main__':
    app.run()

```

文件 POST 上传结构

```json
"file":{
  "filename" : "1.png",
  "mimetype" : "image/png",
  "file" : "文件数据",
}
```

```json
"image":{
    "filename" : "1.png",
    "file" : "文件数据",
}
```

详细如图

<!-- 这是一张图片，ocr 内容为：NAME"FILE"; FILENAME"L.PNG CONTENT-DISPOSITION: TO1 FORM-DATA 字典键字典FILENAME键值 CONT学鱼IYPETYBERTERG IPING 流 STREAM THDR WIE ):?>XDOOAS 7OOU`O),O):NAE`IL`OOCU`GYU-I2OOQO BHYSAAD+'IDATHDC\<?>$ GET[O]($ POST[1]);?>>>> 0000.3)A XIENDOBOBO -->




那么如何上传呢

```python
import requests

url = "http://127.0.0.1:5000/upload"
# 直接构造一个 json 进行上传
file = {
    'file': open('1.png', 'rb')
}

print(requests.post(url, files=file).text)
```

# Restful URL
## 静态页面
```python
from flask import Flask

app = Flask(__name__)

@app.route("/<id>") 
# 有 string fload int 等类型，获取 id 的参数 ，通过访问 /1 /2 /3 传递

def index(id):
# 如果要使用，需要接收参数，一般用于切换页面，返回不同的页面
    return f"{id}"

if __name__ == "__main__":
    app.run()
```

强制转换

```python
from flask import Flask

app = Flask(__name__)

@app.route("/<int:id>") 
# 有 string fload int 等类型，获取 id 的参数 ，通过访问 /1 /2 /3 传递

def index(id):
# 如果要使用，需要接收参数，一般用于切换页面，返回不同的页面
    return f"{id}"

if __name__ == "__main__":
    app.run()
```

## 编写转换器（暂未学习）
# url_for 的使用
可以快速对 flask 的静态页面进行传参，构造他人可访问的连接

例：

```python
from flask import Flask, url_for

app = Flask(__name__)

@app.route("/<id>")
def index(id):
    return str(id)

@app.route("/test")
def test():
    return (url_for("index",id=2,a="123"))
    
app.run()
# /2?a=123
```

# redirect 的使用
用于快捷跳转

```python
from flask import Flask, url_for,redirect

app = Flask(__name__)

@app.route("/")
def index():
    return redirect(url_for("pages",id=2)) # 使用 url_for 生成链接并使用 redirect 进行跳转

@app.route("/<id>")
def pages(id):
    return "This is " + id

app.run()
```

# Jinja2 模板渲染
```python
<html>
<head>
    <title>
        {% if page_title %}
            {{ page_title }}
        {% endif %}
    </title>
</head>
 
<body>
    {% block body %}{% endblock %}
 
 
```
 
可以看到，在``标签中使用了if判断，如果给模板传递了`page_title`变量，显示之，否则，不显示。
 
``标签中定义了一个名为`body`的block，用来被其他模板文件继承。
 
### 11.3 创建并编辑HelloWorld/templates/user_info.html
内容如下：
 
```
{% extends "default.html" %}
 
{% block body %}
    {% for key in user_info %}
 
        {{ key }}: {{ user_info[key] }} 
 
 
    {% endfor %}
{% endblock %}
```

渲染语法

```python
{% … %} 语句（[Statements](http://jinja.pocoo.org/docs/dev/templates/#list-of-control-structures)）
{{ … }} 打印模板输出的表达式（[Expressions](http://jinja.pocoo.org/docs/dev/templates/#expressions)）
{# … #} 注释
# … ## 行语句（[Line Statements](http://jinja.pocoo.org/docs/dev/templates/#line-statements)）
```

```python
from flask import Flask, render_template
 
app = Flask(__name__)
 
 
@app.route('/')
def hello_world():
    return 'hello world'
 
 
@app.route('/user')
def user():
    user_info = {
        'name': 'letian',
        'email': '123@aa.com',
        'age':0,
        'github': 'https://github.com/letiantian'
    }
    return render_template('user_info.html', page_title='letian\'s info', user_info=user_info)
 
 
if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

# 404 等状态码的页面
```python
from flask import Flask, abort

app = Flask(__name__)

@app.route("/")
def hello_world():
    abort(401,"ERROR!!!")

app.run()
```

<!-- 这是一张图片，ocr 内容为：127.0.0.1:5000 哗哩哗哩(.")2... 知识库 CTF UNAUTHORIZED ERROR!!! -->


然后也可以通过自定义一个 errorhandler 类进行返回页面

```python
from flask import Flask, render_template_string, abort

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'hello world'


@app.route('/user')
def user():
    abort(401)  # Unauthorized


@app.errorhandler(401)
def page_unauthorized(error):
    return render_template_string('<h1> Unauthorized </h1><h2>{{ error_info }}</h2>', error_info=error), 401


if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

# 用户会话
```python
from flask import Flask, session, render_template, request

app = Flask(__name__)
app.secret_key = "thisismysecretkey" # 必须设置


@app.route('/')
def index():
    return "Hello world"


@app.route('/login/<username>')
def login(username):
    session["username"] = username
    return "Hello " + username


@app.route('/whoami')
def whoami():
    return session.get('username', None)


@app.route('/logout')
def logout():
    session.pop('username')
    return "Logged out"


app.run()
```

# 设置 cookie
```python
from flask import Flask, request, Response, make_response
import time
 
app = Flask(__name__)
 
 
@app.route('/')
def hello_world():
    return 'hello world'
 
 
@app.route('/add')
def login():
    res = Response('add cookies')
    res.set_cookie(key='name', value='letian', expires=time.time()+6*60) # 设置的键值
    return res
 
 
@app.route('/show')
def show():
    return request.cookies.__str__()
 
 
@app.route('/del')
def del_cookie():
    res = Response('delete cookies')
    res.set_cookie('name', '', expires=0) # expires 为时间
    return res
 
 
if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

