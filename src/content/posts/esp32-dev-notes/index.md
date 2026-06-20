---
title: 'ESP32 开发笔记'
description: '学习链接：https://www.bilibili.com/video/BV1G34yhttps://www.bilibili.com/video/BV1G34y'
pubDate: 2024-06-15
author: 'IHK-1'
tags: ['ESP32', 'IoT', '嵌入式', '学习笔记']
---

学习链接：[https://www.bilibili.com/video/BV1G34y](https://www.bilibili.com/video/BV1G34y)

# ESP32 电路
---

<!-- 这是一张图片，ocr 内容为：3U3 GNDD15 D2 D4 RX2 TX2 05 D18D19 D21RXOTXOD22 D23 杭州市市保证有限公司 PIN15 PIN1 EN GPI023 RESET VPSTMOST UINGND D13 012014 D27 D26D26D25D33D32 D35 D34 UN UP E GPI022 GPL036 PIN14 PIN1 ADCO TXO GPI01 PIN13 PIN1 GPI039 ADC3 I)ESP-WROOM-32 PIN12 GPI034 GPL03 PIN1 ADC6 RXO GPI035 GPI021 PIN11 PIN1 ADC7 211-161007 PIN1 PIN10 TOUCH9 GPI032 GPI019 FCC ID:2AC7Z-ESPWR00M32 VSPIMISO ADC4 GPI018 PIN9 PIN9 VSPI SCK GPIO33 ADC5 TOUCH8 国际国际家家常学校 GPL025 VSPI SS GP105 PIN8 PIN8 ADC18 GPI017 GPI026 PIN7 PIN7 ADC19 PIN6 GPI027 GPI016 PIN6 ADC17 TOUCH7 GPI014 PIN5 PIN5 TOUCHO ADC10 ADC16 GPI04 TOUCH6 GPI012 GPI02 PIN4 PIN4 ADC12 TOUCH2 ADC15 TOUCH5 GPI013 GPI015 ADC13 PIN3 TOUCH3 PIN3 TOUCH4 ADC14 PIN2 GND GND PIN2 VDD 3V3 VIN PIN1 PIN1 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1705824061150-f87bd3ea-38be-40b8-9f2e-cc3debe086f4.png)

[esp32_Schematic Prints.pdf](https://www.yuque.com/attachments/yuque/0/2024/pdf/35229002/1705824065721-d958d6d0-20f8-433a-a1a0-75ecba428b1e.pdf)

# ESP32 开发
---

## machine模块 | 引脚与GPIO
```python
from machine import Pin

# 引脚 = machine.Pin(引脚编号,machine.Pin.OUT)
# 引脚编号为电路板GPIO值(标准输入输出)
pin12 = Pin(12, Pin.OUT)
# 引脚.value(通电状态)
pin12.value(1)

'''
from machine import Pin

p0 = Pin(0, Pin.OUT)    # 在 GPIO0 上创建一个输出引脚
p0.on()                 # 设置引脚为高电频
p0.off()                # 设置引脚为低电频
p0.value(1)             # 设置引脚为高低电频

p2 = Pin(2, Pin.IN)     # 在 GPIO0 上创建一个输入引脚
print(p2.value())       # 获取该引脚的值

p4 = Pin(4, Pin.IN, Pin.PULL_UP) # enable internal pull-up resistor
p5 = Pin(5, Pin.OUT, value=1) # set pin high on creation
p6 = Pin(6, Pin.OUT, drive=Pin.DRIVE_3) # set maximum drive strength
'''
```

## PWM模块 time模块 | 脉宽调制与延时
```python
from machine import Pin , PWM
import time

pwm2 = PWM(Pin(2))
freq = pwm2.freq(1000) # 设置当前的频率(电流通电频率，频率决定了led的闪烁频率)
count = 0

while True:
    for i in range(0,1024):
        pwm2.duty(i) # 设置占空比(周期内高电频的占比次数，占空比决定了led的亮度)
        time.sleep_ms(1) # 设置亮的时长，因为led不会因为程序改变而停止,需要手动命令停止
    for i in range(1023,-1,-1):
        pwm2.duty(i)
        time.sleep_ms(1)

'''
from machine import Pin, PWM

pwm0 = PWM(Pin(0))         # 在引脚上创建一个PWM对象
freq = pwm0.freq()         # 获取当前的频率 (default 5kHz)
pwm0.freq(1000)            # 设置当前的频率从 1Hz~40MHz
pwm2 = PWM(Pin(2), freq=20000, duty=512)  # 一次性设置属性
pwm0.deinit()              # 关闭当前引脚的PWM
print(pwm2)                # 查看PWM的属性

duty = pwm0.duty()         # 获取当前的占空比, range 0-1023 (default 512, 50%)
pwm0.duty(256)             # 设置占空比, range0-1023 as a ratio duty/1023, (now 25%)

# 不同单位的占空比
duty_u16 = pwm0.duty_u16() # get current duty cycle, range 0-65535
pwm0.duty_u16(2**16*3//4)  # set duty cycle from 0 to 65535 as a ratio duty_u16/65535, (now 75%)

duty_ns = pwm0.duty_ns()   # get current pulse width in ns
pwm0.duty_ns(250_000)      # set pulse width in nanoseconds from 0 to 1_000_000_000/freq, (now 25%)
'''

'''
import time

time.sleep(1)           # 休眠1秒
time.sleep_ms(500)      # 休眠500毫秒
time.sleep_us(10)       # 休眠10微秒
start = time.ticks_ms() # get millisecond counter
delta = time.ticks_diff(time.ticks_ms(), start) # compute time difference
'''
```

## 舵机 （PWM）
<!-- 这是一张图片，ocr 内容为：20MS 0 最小脉冲 脉冲宽度1MS 90 中间位置 脉冲宽度 1.5MS 180 最大脉冲 :脉冲宽度 2MS -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707373183032-94426b38-fd15-4275-b4b5-0ce4192f25f1.png)

```plain
计算公式：

占空比 = (0.5ms(最少的角度 0度的脉冲) + 角度*0.5/90(角度 * 每度所需毫秒)[目前所需的毫秒]/20[一周期的毫秒]) * 1023 [PWM范围]


```

```python
# 0度 PWM对象.duty_u16(1638)
# 90度 PWM对象.duty_u16(4915)
# 180度 PWM对象.duty_u16(8192)

from machine import Pin, PWM
import time

p2 = PWM(Pin(2))
p2.freq(50)

# 0度   p2.duty_u16(1638)
# 90度  p2.duty_u16(4915)
# 180度 p2.duty_u16(8192)

for i in range(2):
    p2.duty_u16(1638)
    time.sleep(1)
    p2.duty_u16(4915)
    time.sleep(1)
    p2.duty_u16(8192)
    time.sleep(1)

for i in range(1638, 8192, 10):
    p2.duty_u16(i)
    time.sleep_ms(10)
```

## network模块 socket模块 | 网络
```python
import machine
import network
import socket


class APP:
    def __init__(self):
        self.check_wlan()
        self.connect_control()
        self.switch = 0

    def check_wlan(self):
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)

        if not wlan.isconnected():
            wlan.connect('1003-2.4G', '********')

        print(wlan.isconnected(), wlan.isconnected(), wlan.ifconfig())

    def led(self):
        pin2 = machine.Pin(2, machine.Pin.OUT)
        if self.switch:
            pin2.value(1)
        else:
            pin2.value(0)

    def connect_control(self):
        conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        conn.connect(('192.168.2.178', 12345))
        while True:
            self.switch = int(conn.recv(1024).decode().strip())
            self.led()


APP()


'''
import network

wlan = network.WLAN(network.STA_IF) # 创建一个接口对象 STA_IF station_ifconfig 终端模式
wlan.active(True)       # 激活接口
wlan.scan()             # 扫描热点
wlan.isconnected()      # 判断该设备是否连接 WIFI
wlan.connect('ssid', 'key') # 连接一个 WIFI 默认连接后永久连接
wlan.config('mac')      # 返回接口的 MAC 地址
wlan.ifconfig()         # 返回接口的 IP 掩码 网关 DNS地址

ap = network.WLAN(network.AP_IF) # create access-point interface AP_IF AP_config 热点模式
ap.config(ssid='ESP-AP') # set the SSID of the access point
ap.config(max_clients=10) # set how many clients can connect to the network
ap.active(True)         # activate the interface
'''

'''
import socket

# 服务端
socket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
socket.bind(('127.0.0.1',5555))
socket.listen(3) # 最大待连接数为3
a,b = socket.accept() # a 为连接信息 b 为客户端ip和端口号
a.recv(1024) # 1024 为接收数据的量
a.send('test'.encode())

# 客户端
socket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
socket.connect(('127.0.0.1',5555))
socket.recv(1024)
a.send('test'.encode())

# socket两参数说明
socket.AF_INET 表示的是IPv4（这也是socket里默认的）
socket.AF_INET6 表示的是IPv6
socket.AF_UNIX 这个主要用于单一的UNIX进程间的通信

socket.SOCK_STREAM //流式socketTCP协议（默认的），用来保证数据顺序以及可靠性
socket.SOCK_DGRAM //这是报式socket UDP协议，保证数据接受的顺序，不可靠的连接
socket.SOCK_RAW //这是原始套接字，允许对底层协议（TCP/IP）直接访问
```

##  # Bluetooth模块
```plain

```

## MQTT通信模块
```python
from umqtt.simple import MQTTClient
# MQTTClient(client_id, server, port=0, user=None, password=None, keepalive=0, ssl=False, ssl_params={})
# topic msg 为字节型
# MQTTClient.set_callback(f) f(topic, msg) 为回调函数,第1参数为 topic 接收到的主题,第2参数为 msg 为该主题消息
# MQTTClient.set_last_will(topic, msg, retain=False, qos=0) topic 和 msg 为字节类型 设置MQTT“last will”消息。应该在 connect()之前调用。
# MQTTClient.connect(clean_session=True) 连接到服务器。如果此连接使用存储在服务器上的持久会话，则返回True（如果使用clean_session = True参数，则返回False（默认值））
# MQTTClient.disconnect() 释放资源
# MQTTClient.ping() ping服务器
# MQTTClient.publish(topic, msg, retain=False, qos=0) 发布消息
# MQTTClient.subscribe(topic, qos=0) 订阅主题
# MQTTClient.wait_msg() 等待服务器消息。订阅消息将通过set_callback（）传递给回调集，任何其他消息都将在内部处理。
# MQTTClient.check_msg() 检查服务器是否有待处理的消息。如果是，则以与wait_msg（）相同的方式处理，如果不是，则立即返回。

def sub_cb(topic, msg): # 回调函数，收到服务器消息后会调用这个函数，topic为接收到的主题，msg为接收到的消息
    print(topic, msg) # 标题，内容

conn = MQTTClient("local_windows","192.168.2.178",port) # MQTT连接 ID，服务器
conn.set_callback(sub_cb) # 设置回执函数 
conn.connect()
conn.subscribe(b"test") # 监控ledctl这个通道，接收控制命令 # 订阅主题
while True:
    conn.check_msg()
    time.sleep(1)
```

## ssd1306模块 | oled 图像（I2C学习）
I2C协议：集成电路总线，只通过两根线控制总线，而且可以多设备链接

I2C原理：

1.SDA从高电频到低电频，之后SCL从高电频到低电频率，向从机发动启动条件

<!-- 这是一张图片，ocr 内容为：起始信号 SCL(时钟) SDA(数据) 也就是下降沿 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706890130006-bdc66d54-f36f-4f7d-99d3-ee05586a9397.png)

2.发送从设备地址

<!-- 这是一张图片，ocr 内容为：O 0 0 SCL(时钟) SDA(数据) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706890155259-6b929b51-438e-42c3-843d-6270a9aca7ed.png)

3.接收应答，如果地址匹配，SDA拉低一个表示返回一个ACK（0），如果不匹配拉高返回一个NACK（1）

<!-- 这是一张图片，ocr 内容为：A6 B5B4 B7 A4 A3 A1 B6 A2 AO 0 S A5 读/写位 起始位 应答信号 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706890182757-2db70a55-60fb-478a-91d2-ff2459b2a3d6.png)

4.收发数据

<!-- 这是一张图片，ocr 内容为：O:收到 0 0 0 0 S 1 读/写位 起始位 应答信号 它会回复0 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706890201257-4bff5a94-f14e-4141-834c-1d0c5ad98a64.png)<!-- 这是一张图片，ocr 内容为：寄存器地址(8位) 0 0 0 0 O 读/写位应答信号 应答信 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706890250812-6dde9a89-c861-44e8-9716-fadb161a367c.png)

5.接收应答，返回一个ACK（0），表示接收到信号<!-- 这是一张图片，ocr 内容为：器地址(8位) 0 P 停止位 应答信号 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706890269094-f7e6801c-1972-4089-9d00-d7fb8ec9c70c.png)

6.停止通信，SCL和SDA切换高电频，停止接收信号<!-- 这是一张图片，ocr 内容为：(8位) 字器地址 0 0 停止位 接下来的8位是给这个存储器的寄存器要写入的数据 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706890280390-f4761028-c5e6-496d-a982-9d1c8f3deeea.png)

总结

<!-- 这是一张图片，ocr 内容为：起始位 逻辑1 +关注 SCL(时钟) SCL(时钟) 读写数据 SDA(数据) (数据) SDA 读/写数据 0:代表写数据 当时钟线为高时,数据始终为高 当时钟线为高时,数据线由高变低 1:代表读数据 停止位 逻辑0 应答信号 SCL(时钟) SCL(时钟) 应答信号 0:数据被正确接收 SDA(数据) $字幕样式测试 1:从机忙; 当时钟线为高时,数据线由低变高 当时钟线为高时,数据始终为低 接收错误; 主机读取完成 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706890022309-f96d383d-a9a4-4cf0-b16b-1f2b9014f283.png)



```python
#MicroPython SSD1306 OLED driver, I2C and SPI interfaces created by Adafruit

import time
import framebuf

# register definitions
SET_CONTRAST        = const(0x81)
SET_ENTIRE_ON       = const(0xa4)
SET_NORM_INV        = const(0xa6)
SET_DISP            = const(0xae)
SET_MEM_ADDR        = const(0x20)
SET_COL_ADDR        = const(0x21)
SET_PAGE_ADDR       = const(0x22)
SET_DISP_START_LINE = const(0x40)
SET_SEG_REMAP       = const(0xa0)
SET_MUX_RATIO       = const(0xa8)
SET_COM_OUT_DIR     = const(0xc0)
SET_DISP_OFFSET     = const(0xd3)
SET_COM_PIN_CFG     = const(0xda)
SET_DISP_CLK_DIV    = const(0xd5)
SET_PRECHARGE       = const(0xd9)
SET_VCOM_DESEL      = const(0xdb)
SET_CHARGE_PUMP     = const(0x8d)


class SSD1306:
    def __init__(self, width, height, external_vcc):
        self.width = width
        self.height = height
        self.external_vcc = external_vcc
        self.pages = self.height // 8
        # Note the subclass must initialize self.framebuf to a framebuffer.
        # This is necessary because the underlying data buffer is different
        # between I2C and SPI implementations (I2C needs an extra byte).
        self.poweron()
        self.init_display()

    def init_display(self):
        for cmd in (
            SET_DISP | 0x00, # off
            # address setting
            SET_MEM_ADDR, 0x00, # horizontal
            # resolution and layout
            SET_DISP_START_LINE | 0x00,
            SET_SEG_REMAP | 0x01, # column addr 127 mapped to SEG0
            SET_MUX_RATIO, self.height - 1,
            SET_COM_OUT_DIR | 0x08, # scan from COM[N] to COM0
            SET_DISP_OFFSET, 0x00,
            SET_COM_PIN_CFG, 0x02 if self.height == 32 else 0x12,
            # timing and driving scheme
            SET_DISP_CLK_DIV, 0x80,
            SET_PRECHARGE, 0x22 if self.external_vcc else 0xf1,
            SET_VCOM_DESEL, 0x30, # 0.83*Vcc
            # display
            SET_CONTRAST, 0xff, # maximum
            SET_ENTIRE_ON, # output follows RAM contents
            SET_NORM_INV, # not inverted
            # charge pump
            SET_CHARGE_PUMP, 0x10 if self.external_vcc else 0x14,
            SET_DISP | 0x01): # on
            self.write_cmd(cmd)
        self.fill(0)
        self.show()

    def poweroff(self):
        self.write_cmd(SET_DISP | 0x00)

    def contrast(self, contrast):
        self.write_cmd(SET_CONTRAST)
        self.write_cmd(contrast)

    def invert(self, invert):
        self.write_cmd(SET_NORM_INV | (invert & 1))

    def show(self):
        x0 = 0
        x1 = self.width - 1
        if self.width == 64:
            # displays with width of 64 pixels are shifted by 32
            x0 += 32
            x1 += 32
        self.write_cmd(SET_COL_ADDR)
        self.write_cmd(x0)
        self.write_cmd(x1)
        self.write_cmd(SET_PAGE_ADDR)
        self.write_cmd(0)
        self.write_cmd(self.pages - 1)
        self.write_framebuf()

    def fill(self, col):
        self.framebuf.fill(col)

    def pixel(self, x, y, col):
        self.framebuf.pixel(x, y, col)

    def scroll(self, dx, dy):
        self.framebuf.scroll(dx, dy)

    def text(self, string, x, y, col=1):
        self.framebuf.text(string, x, y, col)


class SSD1306_I2C(SSD1306):
    def __init__(self, width, height, i2c, addr=0x3c, external_vcc=False):
        self.i2c = i2c
        self.addr = addr
        self.temp = bytearray(2)
        # Add an extra byte to the data buffer to hold an I2C data/command byte
        # to use hardware-compatible I2C transactions.  A memoryview of the
        # buffer is used to mask this byte from the framebuffer operations
        # (without a major memory hit as memoryview doesn't copy to a separate
        # buffer).
        self.buffer = bytearray(((height // 8) * width) + 1)
        self.buffer[0] = 0x40  # Set first byte of data buffer to Co=0, D/C=1
        self.framebuf = framebuf.FrameBuffer1(memoryview(self.buffer)[1:], width, height)
        super().__init__(width, height, external_vcc)

    def write_cmd(self, cmd):
        self.temp[0] = 0x80 # Co=1, D/C#=0
        self.temp[1] = cmd
        self.i2c.writeto(self.addr, self.temp)

    def write_framebuf(self):
        # Blast out the frame buffer using a single I2C transaction to support
        # hardware I2C interfaces.
        self.i2c.writeto(self.addr, self.buffer)

    def poweron(self):
        pass


class SSD1306_SPI(SSD1306):
    def __init__(self, width, height, spi, dc, res, cs, external_vcc=False):
        self.rate = 10 * 1024 * 1024
        dc.init(dc.OUT, value=0)
        res.init(res.OUT, value=0)
        cs.init(cs.OUT, value=1)
        self.spi = spi
        self.dc = dc
        self.res = res
        self.cs = cs
        self.buffer = bytearray((height // 8) * width)
        self.framebuf = framebuf.FrameBuffer1(self.buffer, width, height)
        super().__init__(width, height, external_vcc)

    def write_cmd(self, cmd):
        self.spi.init(baudrate=self.rate, polarity=0, phase=0)
        self.cs.high()
        self.dc.low()
        self.cs.low()
        self.spi.write(bytearray([cmd]))
        self.cs.high()

    def write_framebuf(self):
        self.spi.init(baudrate=self.rate, polarity=0, phase=0)
        self.cs.high()
        self.dc.high()
        self.cs.low()
        self.spi.write(self.buffer)
        self.cs.high()

    def poweron(self):
        self.res.high()
        time.sleep_ms(1)
        self.res.low()
        time.sleep_ms(10)
        self.res.high()

```

```python
from machine import Pin, SoftI2C
import ssd1306


# 创建i2c对象
i2c = SoftI2C(scl=Pin(22), sda=Pin(21))

# 宽度高度
oled_width = 128
oled_height = 64

# 创建oled屏幕对象
oled = ssd1306.SSD1306_I2C(oled_width, oled_height, i2c) # 传参 屏幕宽度高度以及i2c对象

# 在指定位置处显示文字
oled.text('Hello!', 0, 0)
oled.text('Hello, World 2!', 0, 10)
oled.text('Hello, World 3!', 0, 20)

oled.fill() # 填充颜色（灰度）
oled.pixel() # 在像素位置填充颜色
        
oled.show()
```

## ST7789模块 | 240*240 IPS 图像（SPI学习）
协议原理类似I2C，但是SPI通讯选择从机不是通过I2C的方法在sda发送信息时候的选择，而是通过ss通电选择从机

<!-- 这是一张图片，ocr 内容为：从机 主机 SCK SCK MOSI MOSI MI SO MISO NSS NSS 主机发送倒从机 空闲 空闲 从机发送倒主机 SCK MOSI 主机输出 从机输入 110010100253 MISO 主机输入 从机输出 0 0X46 0110001010 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1707984929392-4c41baba-8a0c-465a-888a-3d47c9c86e2a.png)

```plain
MISO：Master input slave output 主机输入，从机输出（数据来自从机）；
MOSI：Master output slave input 主机输出，从机输入（数据来自主机）；
SCLK ：Serial Clock 串行时钟信号，由主机产生发送给从机；
SS：Slave Select 片选信号，由主机发送，以控制与哪个从机通信，通常是低电平有效信号。
其他制造商可能会遵循其他命名规则，但是最终他们指的相同的含义。以下是一些常用术语；

MISO也可以是SIMO，DOUT，DO，SDO或SO（在主机端）;
MOSI也可以是SOMI，DIN，DI，SDI或SI（在主机端）;
NSS也可以是CE，CS或SSEL;
SCLK也可以是SCK;
```

[st7789py.py](https://www.yuque.com/attachments/yuque/0/2024/txt/35229002/1707985296096-ea1b7f8b-1513-4d94-8011-c214a6fc05b1.txt)

## sht3x模块 | 温度湿度传感器
```python
import sys
import utime
from machine import Pin
from machine import SoftI2C


class SHT3x_Sensor:

    def __init__(self, freq, sdapin, sclpin):
        self.i2c = SoftI2C(sda=sdapin, scl=sclpin)
        addrs = self.i2c.scan()
        if not addrs:
            raise Exception('no SHT3X found at bus on SDA pin %d SCL pin %d' % (sdapin, sclpin))
        self.addr = addrs.pop()

    def read_temp_humd(self):
        status = self.i2c.writeto(self.addr, b'\x24\x00')
        # delay (20 slow)
        utime.sleep(1)
        # read 6 bytes
        databytes = self.i2c.readfrom(self.addr, 6)
        dataset = [databytes[0], databytes[1]]
        dataset = [databytes[3], databytes[4]]
        temperature_raw = databytes[0] << 8 | databytes[1]
        temperature = (175.0 * float(temperature_raw) / 65535.0) - 45
        # fahreheit
        # temperature = (315.0 * float(temperature_raw) / 65535.0) - 49
        humidity_raw = databytes[3] << 8 | databytes[4]
        humidity = (100.0 * float(humidity_raw) / 65535.0)
        sensor_data = [temperature, humidity]
        return sensor_data
```

```python
sht3x = sht3x.SHT3x_Sensor(freq=1000,sdapin=Pin(21),sclpin=Pin(22))
temp,humd = sht3x.read_tmp_humd()
```

## 步进电机
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706871206040-71a9e68e-7bf8-463e-9eae-f1831eb0341e.png)

步进电机原理

```plain
ABCD为定子，上面绕有线圈，为四相，与之相对应的对面四个定子上面也有线圈，相对应的两个定子之间线圈是相互连接形成一个绕组。

单四拍模式：

如当前为初始状态，B相导通，对0的吸引力最大。

接下来B断开，C导通，1和C相之间夹角最小被吸引过去，被吸引过去之前2和D相之间夹角为1和C相之间夹角的2倍，1被吸引到C以后，2和D之间最近，此时0和A之间的夹角为2和D之间的2倍，

接下来C断开，D导通，2被吸引到D，此时0距离A最近

D断开A导通，0被吸引到A相，至此一个周期完成

双拍工作模式：

每次给两个线圈通电，通过改变通电的线圈从而使步进电机转动 五线四相步进电机：在双拍工作方式下，线圈的通电方式依次是：AB、BC、CD、DA 即单拍工作方式下，线圈的通电方式依次是：A、B、C、D

单双拍（八拍工作方式）

单双拍工作方式就是单拍工作方式和双拍工作方式交替进行。 五线四相步进电机：A、AB、B、BC、C、CD、D、DA；
```

```python
from machine import Pin
import time


a = Pin(15, Pin.OUT)
b = Pin(2, Pin.OUT)
c = Pin(4, Pin.OUT)
d = Pin(16, Pin.OUT)

a.value(0)
b.value(0)
c.value(0)
d.value(0)

delay_time_ms = 2


while True:
    a.value(1)
    b.value(0)
    c.value(0)
    d.value(0)
    time.sleep_ms(delay_time_ms)
    
    a.value(0)
    b.value(1)
    c.value(0)
    d.value(0)
    time.sleep_ms(delay_time_ms)
    
    a.value(0)
    b.value(0)
    c.value(1)
    d.value(0)
    time.sleep_ms(delay_time_ms)
    
    a.value(0)
    b.value(0)
    c.value(0)
    d.value(1)
    time.sleep_ms(delay_time_ms)
```

## 4*4 矩阵键盘
电路图

<!-- 这是一张图片，ocr 内容为：1 2 3 5 6 B 41 7 8 6 C D # 商行 行 列 列 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1706869204218-90b1f47a-777f-4f43-8d4f-87598664d47b.png)

```python
from machine import Pin
import time


row1 = Pin(19, Pin.OUT)
row2 = Pin(18, Pin.OUT)
row3 = Pin(5, Pin.OUT)
row4 = Pin(17, Pin.OUT)
row_list = [row1, row2, row3, row4]

col1 = Pin(16, Pin.IN, Pin.PULL_DOWN)
col2 = Pin(4, Pin.IN, Pin.PULL_DOWN)
col3 = Pin(2, Pin.IN, Pin.PULL_DOWN)
col4 = Pin(15, Pin.IN, Pin.PULL_DOWN)
col_list = [col1, col2, col3, col4]

names = [
    ["1", "2", "3", "A"],
    ["4", "5", "6", "B"],
    ["7", "8", "9", "C"],
    ["*", "0", "#", "D"]
]

while True:
    for i, row in enumerate(row_list):
        for temp in row_list:
            temp.value(0)
        row.value(1)
        time.sleep_ms(10)
        for j, col in enumerate(col_list):
            if col.value() == 1:
                print("按键: {} 被按下".format(names[i][j]))
        # print(row1.value(), row2.value(), row3.value(), row4.value())
        # print(col1.value(), col2.value(), col3.value(), col4.value())
        # print("-" * 30)
                
    time.sleep(0.1)
```

## PS2遥感（ADC学习）
ADC协议：模拟数字电路，电压（模数转换）  
ADC真脚：0，2，4，12，13，15，25，26，27，32，33，34，35，36，39

```python
from machine import Pin,ADC

data = ADC(Pin(data))
data.atten(ADC.ATTN_11DB) # 设置流程
# ADC.ATTN_0DB 1.2V
# ADC.ATTN_2_5DB 1.5V
# ADC.ATTN_6DB 2.0V
# ADC.ATTN_11DB 3.3V

data.read() # 读取
```

```python
from machine import Pin, ADC
import time


ps2_y = ADC(Pin(33)) # VR_X
ps2_y.atten(ADC.ATTN_11DB)  # 这里配置测量量程为3.3V
ps2_x = ADC(Pin(32)) # VR_Y
ps2_x.atten(ADC.ATTN_11DB)  # 这里配置测量量程为3.3V


btn = Pin(15, Pin.IN) # MS

while True:
    val_y = ps2_y.read()  # 0-4095
    val_x = ps2_x.read()  # 0-4095
    print("x:{} y:{} btn:{}".format(val_x, val_y, btn.value()))
    time.sleep(0.1)
```

