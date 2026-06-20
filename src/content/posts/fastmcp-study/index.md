---
title: 'FastMCP 学习笔记'
description: '一个基础的 MCP 服务器搭建'
pubDate: 2025-05-20
author: 'IHK-1'
tags: ['MCP', 'Python', 'FastMCP', '学习笔记']
---

# MCP 基础
一个基础的 MCP 服务器搭建

```python
from fastmcp import FastMCP

mcp = FastMCP("My MCP Server")

@mcp.tool
def greet(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    mcp.run()
```

# 概述
## 创建服务器
```python
from fastmcp import FastMCP

# Create a basic server instance
mcp = FastMCP(name="MyAssistantServer")

# You can also add instructions for how to interact with the server
mcp_with_instructions = FastMCP(
    name="HelpfulAssistant",
    instructions="""
        This server provides data analysis tools.
        Call get_average() to analyze numerical data.
    """,
)
```

类似注释等 AI 都可以阅读

```plain
name
strdefault:"FastMCP"
服务器的可读名称

tags
提供给 llm 的 tags 标签，工具调用的时候可以看到

instructions  说明
str | None
如何与该服务器交互的说明。这些说明帮助客户端理解服务器的用途和可用功能

auth
OAuthProvider | TokenVerifier | None
用于保护基于 HTTP 的传输的认证提供者。有关配置选项，请参阅认证

lifespan  寿命
AsyncContextManager | None
用于服务器启动和关闭逻辑的异步上下文管理器函数

tools
list[Tool | Callable] | None
一个工具列表（或可转换为工具的函数），用于添加到服务器中。在某些情况下，程序性地提供工具可能比使用 @mcp.tool 装饰器更方便

include_tags
set[str] | None
仅暴露至少有一个匹配标签的组件

exclude_tags
set[str] | None
隐藏任何匹配标签的组件

on_duplicate_tools
Literal["error", "warn", "replace"]default:"error"
如何处理重复的工具注册

on_duplicate_resources
Literal["error", "warn", "replace"]default:"warn"
如何处理重复资源注册

on_duplicate_prompts
Literal["error", "warn", "replace"]default:"replace"
如何处理重复的提示注册

include_fastmcp_meta
booldefault:"True"
是否在组件响应中包含 FastMCP 元数据。当为 True 时，组件标签和其他 FastMCP 特定的元数据包含在每个组件的 meta 字段内的 _fastmcp 命名空间中。当为 False 时，这些元数据将被省略，从而实现与外部系统的更干净集成。可以通过 FASTMCP_INCLUDE_FASTMCP_META 环境变量全局覆盖
```

## 功能组件（如何多个运行 prompt resources）
### tools 工具
AI 可随时调用和执行的函数

```python
@mcp.tool
def multiply(a: float, b: float) -> float:
    """Multiplies two numbers together."""
    return a * b
```

### resources 资源
客户端可以直接读取的数据源

```python
@mcp.resource("data://config")
def get_config() -> dict:
    """Provides the application configuration."""
    return {"theme": "dark", "version": "1.0"}
```

### resources templates 资源模板
模板化定制的资源

```python
@mcp.resource("users://{user_id}/profile")
def get_user_profile(user_id: int) -> dict:
    """Retrieves a user's profile by ID."""
    # The {user_id} in the URI is extracted and passed to this function
    return {"id": user_id, "name": f"User {user_id}", "status": "active"}
```

### prompts 提示
用于指导 LLM 的可重用消息模板

```python
@mcp.prompt
def analyze_data(data_points: list[float]) -> str:
    """Creates a prompt asking for analysis of numerical data."""
    formatted_data = ", ".join(str(point) for point in data_points)
    return f"Please analyze these data points: {formatted_data}"
```

## tag 标签过滤
这些过滤用于列出和访问所有组件类型

```python
@mcp.tool(tags={"public", "utility"})
def public_tool() -> str:
    return "This tool is public"

@mcp.tool(tags={"internal", "admin"})
def admin_tool() -> str:
    return "This tool is for admins only"
```

```plain
Include tags
包含标签：如果指定，则仅暴露至少有一个匹配标签的组件

Exclude tags
排除标签：任何匹配标签的组件都将被过滤掉

Precedence
优先级：始终排除标签优先于包含标签
```

## 运行服务器
在 MCP 中，一般使用 mcp.run() 进行调用 MCP 客户端

```python
# my_server.py
from fastmcp import FastMCP

mcp = FastMCP(name="MyServer")

@mcp.tool
def greet(name: str) -> str:
    """Greet a user by name."""
    return f"Hello, {name}!"

if __name__ == "__main__":
    # This runs the server, defaulting to STDIO transport
    mcp.run()

    # To use a different transport, e.g., HTTP:
    # mcp.run(transport="http", host="127.0.0.1", port=9000)
```

同时可以 transport 支持多种传输选项

```python
STDIO（默认，用于本地工具）
HTTP（推荐用于 Web 服务，使用 Streamable HTTP 协议）
SSE（旧版网页传输，已弃用）
```

## http 自定义路由
可以类似 flask 构造，我们可以使用 @custom_route 做到类似 flask 注册路由

```python
from fastmcp import FastMCP
from starlette.requests import Request
from starlette.responses import PlainTextResponse

mcp = FastMCP("MyServer")

@mcp.custom_route("/health", methods=["GET"])
async def health_check(request: Request) -> PlainTextResponse:
    return PlainTextResponse("OK")

if __name__ == "__main__":
    mcp.run(transport="http")  # Health check at http://localhost:8000/health
```

## 服务器编排
我们可以使用 import_server（静态复制） 和 mount（实时链接）进行多服务器编排

```python
# Example: Importing a subserver
from fastmcp import FastMCP
import asyncio

main = FastMCP(name="Main")
sub = FastMCP(name="Sub")

@sub.tool
def hello(): 
    return "hi"

# Mount directly
main.mount(sub, prefix="sub")
```

## 代理服务器
FastMCP 进行代理服务器的代理

```python
from fastmcp import FastMCP, Client

backend = Client("http://example.com/mcp/sse")
proxy = FastMCP.as_proxy(backend, name="ProxyServer")
# Now use the proxy like any FastMCP server
```

## OpenAI 集成
```python
from fastmcp import FastMCP, Client

backend = Client("http://example.com/mcp/sse")
proxy = FastMCP.as_proxy(backend, name="ProxyServer")
# Now use the proxy like any FastMCP server
```

## 服务器配置
### 服务器特定配置
用于设置 FastMCP 服务器

```python
from fastmcp import FastMCP

# Configure server-specific settings
mcp = FastMCP(
    name="ConfiguredServer",
    include_tags={"public", "api"},              # Only expose these tagged components
    exclude_tags={"internal", "deprecated"},     # Hide these tagged components
    on_duplicate_tools="error",                  # Handle duplicate registrations
    on_duplicate_resources="warn",
    on_duplicate_prompts="replace",
    include_fastmcp_meta=False,                  # Disable FastMCP metadata for cleaner integration
)
```

### 查看/设置 全局设置
可以设定一些全局配置，可在 .env 中配置

```python
import fastmcp

# Access global settings
print(fastmcp.settings.log_level)        # Default: "INFO"
print(fastmcp.settings.mask_error_details)  # Default: False
print(fastmcp.settings.resource_prefix_format)  # Default: "path"
print(fastmcp.settings.include_fastmcp_meta)   # Default: True
```

一些常见配置

```plain
log_level : 日志级别（"DEBUG"，"INFO"，"WARNING"，"ERROR"，"CRITICAL"），通过 FASTMCP_LOG_LEVEL 设置

mask_error_details ：是否向客户端隐藏详细错误信息，通过 FASTMCP_MASK_ERROR_DETAILS 设置

resource_prefix_format : 如何格式化资源前缀（“路径”或“协议”），使用 FASTMCP_RESOURCE_PREFIX_FORMAT 设置

include_fastmcp_meta : 是否在组件响应中包含 FastMCP 元数据（默认：True），通过 FASTMCP_INCLUDE_FASTMCP_META 设置
```



查看全局配置，可以通过环境遍历进行配置

```python
# Configure global FastMCP behavior
export FASTMCP_LOG_LEVEL=DEBUG
export FASTMCP_MASK_ERROR_DETAILS=True
export FASTMCP_RESOURCE_PREFIX_FORMAT=protocol
export FASTMCP_INCLUDE_FASTMCP_META=False
```

### 网络参数配置
用于控制网络参数

```python
# Configure transport when running
mcp.run(
    transport="http",
    host="0.0.0.0",           # Bind to all interfaces
    port=9000,                # Custom port
    log_level="DEBUG",        # Override global log level
)

# Or for async usage
await mcp.run_async(
    transport="http", 
    host="127.0.0.1",
    port=8080,
)
```

### 自定义工具序列化
可以通过 tool_serializer 可以进行将 text 转成 json 返回

```python
import yaml
from fastmcp import FastMCP

# Define a custom serializer that formats dictionaries as YAML
def yaml_serializer(data):
    return yaml.dump(data, sort_keys=False)

# Create a server with the custom serializer
mcp = FastMCP(name="MyServer", tool_serializer=yaml_serializer)

@mcp.tool
def get_config():
    """Returns configuration in YAML format."""
    return {"api_key": "abc123", "debug": True, "rate_limit": 100}
```

# 核心组件
## tools 工具
### tools 装饰器参数
```python
@mcp.tool(
    name="find_products",           # Custom tool name for the LLM
    description="Search the product catalog with optional category filtering.", # Custom description
    tags={"catalog", "search"},      # Optional tags for organization/filtering
    meta={"version": "1.2", "author": "product-team"}  # Custom metadata
)
def search_products_implementation(query: str, category: str | None = None) -> list[dict]:
    """Internal function description (ignored if description is provided above)."""
    # Implementation...
    print(f"Searching for '{query}' in category '{category}'")
    return [{"id": 2, "name": "Another Product"}]
```

下面是对参数的一些解释

```python
name 用于向 MCP 提供正式的名称
description 用于向 MCP 提供描述
tags 用于对客户进行分组或过滤
enabled 用于启用或禁用工具
exclude_args 向 LLM 展示工具派出的参数名称列表
annotations 注释
```

### 异步和同步工具
在 FastMCP 一般以异步优先，可以直接使用 async 进行异步操作

标准异步操作：hello -> wait 1s -> hello again

```python
import asyncio

async def hello(name):
    print(f"Hello {name}!")
    await asyncio.sleep(1)
    print(f"Hello {name} again!")
    return name

async def main():
    results = await asyncio.gather(hello("Alice"), hello("Bob"))
    print(results)

asyncio.run(main())
```

FastMCP 标准

```python
import anyio
from fastmcp import FastMCP

mcp = FastMCP()

def cpu_intensive_task(data: str) -> str:
    # Some heavy computation that could block the event loop
    return processed_data

@mcp.tool
async def wrapped_cpu_task(data: str) -> str:
    """CPU-intensive task wrapped to prevent blocking."""
    return await anyio.to_thread.run_sync(cpu_intensive_task, data)
```

### 类型注释
类型注释可以让 LLM 理解并输出预期数据类型

```python
@mcp.tool
def analyze_text(
    text: str,
    max_tokens: int = 100,
    language: str | None = None
) -> dict:
    """Analyze the provided text."""
    # Implementation...
```

### 简单字符串描述
对于基本参数描述，您可以使用便捷的简写方式 Annotated，对参数的描述

```python
from typing import Annotated

@mcp.tool
def process_image(
    image_url: Annotated[str, "URL of the image to process"],
    resize: Annotated[bool, "Whether to resize the image"] = False,
    width: Annotated[int, "Target width in pixels"] = 800,
    format: Annotated[str, "Output image format"] = "jpeg"
) -> dict:
    """Process an image with optional resizing."""
    # Implementation...
```

### 带字段的进阶元数据
对于验证约束和高级元数据，可以使用 Annotated 和 Field 进行字段描述

```python
from typing import Annotated
from pydantic import Field

@mcp.tool
def process_image(
    image_url: Annotated[str, Field(description="URL of the image to process")],
    resize: Annotated[bool, Field(description="Whether to resize the image")] = False,
    width: Annotated[int, Field(description="Target width in pixels", ge=1, le=2000)] = 800,
    format: AnnotatedLiteral["jpeg", "png", "webp"], Field(description="Output image format")] = "jpeg"
) -> dict:
    """Process an image with optional resizing."""
    # Implementation...
```

### 开启/禁用 工具
```python
@mcp.tool(enabled=False)
def maintenance_tool():
    """This tool is currently under maintenance."""
    return "This tool is disabled."
```

或者

```python
@mcp.tool
def dynamic_tool():
    return "I am a dynamic tool."

# Disable and re-enable the tool
dynamic_tool.disable()
dynamic_tool.enable()
```

### 排除参数
您可以从向 LLM 展示的工具模式中排除某些参数。这对于在运行时注入的参数（例如 state 、 user_id 或凭证）很有用，这些参数不应暴露给 LLM 或客户端。

```python
@mcp.tool(
    name="get_user_details",
    exclude_args=["user_id"]
)
def get_user_details(user_id: str = None) -> str:
    # user_id will be injected by the server, not provided by the LLM
    ...
```

### 返回值
使用 ToolResult 实现完全控制

```python
from fastmcp.tools.tool import ToolResult

@mcp.tool
def advanced_tool() -> ToolResult:
    """Tool with full control over output."""
    return ToolResult(
        content=[TextContent(text="Human-readable summary")],
        structured_content={"data": "value", "count": 42}
    )
```

### 错误处理
可以使用 FastMCP 去掉显示

```python
mcp = FastMCP(name="SecureServer", mask_error_details=True)
```

使用 ToolError 来显示控制发送客户端的错误信息

```python
from fastmcp import FastMCP
from fastmcp.exceptions import ToolError

@mcp.tool
def divide(a: float, b: float) -> float:
    """Divide a by b."""

    if b == 0:
        # Error messages from ToolError are always sent to clients,
        # regardless of mask_error_details setting
        raise ToolError("Division by zero is not allowed.")
    
    # If mask_error_details=True, this message would be masked
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("Both arguments must be numbers.")
        
    return a / b
```

### 注释
使用 annotations 参数为工具添加注释

```python
@mcp.tool(
    annotations={
        "title": "Calculate Sum",
        "readOnlyHint": True,
        "openWorldHint": False
    }
)
def calculate_sum(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b
```

以下有几个信息说明

```python
title	string
用户界面的显示名称

readOnlyHint	boolean
表示该工具是否只读取而不进行修改

destructiveHint	boolean	true
对于非只读工具，如果更改是破坏性的则发出信号

idempotentHint	boolean	false
指示重复的相同调用是否与单次调用具有相同的效果

openWorldHint	boolean	true
指定工具是否与外部系统交互
```

### 上下文
工具可以通过 Context 对象访问 MCP 功能，如日志记录、读取资源或报告进度。要使用它，请将类型提示 Context 作为参数添加到您的工具函数中。

```python
from fastmcp import FastMCP, Context

mcp = FastMCP(name="ContextDemo")

@mcp.tool
async def process_data(data_uri: str, ctx: Context) -> dict:
    """Process data from a resource with progress reporting."""
    await ctx.info(f"Processing data from {data_uri}")
    
    # Read a resource
    resource = await ctx.read_resource(data_uri)
    data = resource[0].content if resource else ""
    
    # Report progress
    await ctx.report_progress(progress=50, total=100)
    
    # Example request to the client's LLM for help
    summary = await ctx.sample(f"Summarize this in 10 words: {data[:200]}")
    
    await ctx.report_progress(progress=100, total=100)
    return {
        "length": len(data),
        "summary": summary.text
    }
```

```plain
Logging: ctx.debug(), ctx.info(), ctx.warning(), ctx.error()
日志记录： ctx.debug() , ctx.info() , ctx.warning() , ctx.error()

Progress Reporting: ctx.report_progress(progress, total)  进度报告： ctx.report_progress(progress, total)
Resource Access: ctx.read_resource(uri)  资源访问： ctx.read_resource(uri)

LLM Sampling: ctx.sample(...)  
LLM 采样： ctx.sample(...)

Request Information: ctx.request_id, ctx.client_id
请求信息： ctx.request_id , ctx.client_id
```

### 参数类型
一些特殊的参数类型

```python
from datetime import datetime, date, timedelta

@mcp.tool
def process_date_time(
    event_date: date,             # ISO format date string or date object
    event_time: datetime,         # ISO format datetime string or datetime object
    duration: timedelta = timedelta(hours=1)  # Integer seconds or timedelta
) -> str:
    """Process date and time information."""
    # Types are automatically converted from strings
    assert isinstance(event_date, date)  
    assert isinstance(event_time, datetime)
    assert isinstance(duration, timedelta)

    return f"Event on {event_date} at {event_time} for {duration}"
```

### 类型 多类型可选
```python
@mcp.tool
def flexible_search(
    query: str | int,              # Can be either string or integer
    filters: dict[str, str] | None = None,  # Optional dictionary
    sort_field: str | None = None  # Optional string
):
    """Search with flexible parameter types."""
    # Implementation...
```

### 类型 约束类型
Literals 自变量和 Enums 枚举

Literals 可以使用自变量将参数约定为特殊的一组值

```python
from typing import Literal

@mcp.tool
def sort_data(
    data: list[float],
    order: Literal["ascending", "descending"] = "ascending",
    algorithm: Literal["quicksort", "mergesort", "heapsort"] = "quicksort"
):
    """Sort data using specific options."""
    # Implementation...
```



也可以使用 Enum 更受限制一些，更结构化一些

```python
from enum import Enum

class Color(Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"

@mcp.tool
def process_image(
    image_path: str, 
    color_filter: Color = Color.RED
):
    """Process an image with a color filter."""
    # Implementation...
    # color_filter will be a Color enum member
```

### 类型 二进制数据
```python
@mcp.tool
def process_binary(data: bytes):
    """Process binary data directly.
    
    The client can send a binary string, which will be 
    converted directly to bytes.
    """
    # Implementation using binary data
    data_length = len(data)
    # ...
```

### 类型 Path
FastMCP 可以实现自动转化

```python
from pathlib import Path

@mcp.tool
def process_file(path: Path) -> str:
    """Process a file at the given path."""
    assert isinstance(path, Path)  # Path is properly converted
    return f"Processing file at {path}"
```

### 类型 UUID
FastMCP 可以实现自动转化

```python
import uuid

@mcp.tool
def process_item(
    item_id: uuid.UUID  # String UUID or UUID object
) -> str:
    """Process an item with the given UUID."""
    assert isinstance(item_id, uuid.UUID)  # Properly converted to UUID
    return f"Processing item {item_id}"
```

### 类型 Pydantic 模型
对于具有嵌套字段和验证的复杂数据结构，请使用 Pydantic 模型

```python
from pydantic import BaseModel, Field
from typing import Optional

class User(BaseModel):
    username: str
    email: str = Field(description="User's email address")
    age: int | None = None
    is_active: bool = True

@mcp.tool
def create_user(user: User):
    """Create a new user in the system."""
    # The input is automatically validated against the User model
    # Even if provided as a JSON string or dict
    # Implementation...
```



一些 field 的补充，一般用于设置默认信息

```python
from pydantic import BaseModel, Field
from typing import Optional

class User(BaseModel):
    username: str
    email: str = Field(description="User's email address")
    age: int | None = None
    is_active: bool = True

@mcp.tool
def create_user(user: User):
    """Create a new user in the system."""
    # The input is automatically validated against the User model
    # Even if provided as a JSON string or dict
    # Implementation...
```

如果是 Field 相当于对这个类定义时就会生成，所有类创建的都是相同的

```python
e1 = Event("A")
e2 = Event("B")
print(e1.timestamp, e2.timestamp)
# 2025-08-21 16:15:00  2025-08-21 16:15:00   <- 一样的
```



Field_factory 设置动态的默认信息，相当于 return，返回时间是不一样的

```python
from dataclasses import field
from datetime import datetime

@dataclass
class Event:
    name: str
    timestamp: datetime = field(default_factory=datetime.now)

# 创建一个Event对象
event = Event(name="Meeting")
print(event.timestamp)  # 输出当前时间的时间戳
```

### Pydantic 字段
请注意，字段可以在 Pydantic 模型之外使用，以提供元数据和验证约束。推荐的方法是使用 Annotated 与 Field 

```python
from typing import Annotated
from pydantic import Field

@mcp.tool
def analyze_metrics(
    # Numbers with range constraints
    count: Annotated[int, Field(ge=0, le=100)],         # 0 <= count <= 100
    ratio: Annotated[float, Field(gt=0, lt=1.0)],       # 0 < ratio < 1.0
    
    # String with pattern and length constraints
    user_id: Annotated[str, Field(
        pattern=r"^[A-Z]{2}\d{4}$",                     # Must match regex pattern
        description="User ID in format XX0000"
    )],
    
    # String with length constraints
    comment: Annotated[str, Field(min_length=3, max_length=500)] = "",
    
    # Numeric constraints
    factor: Annotated[int, Field(multiple_of=5)] = 10,  # Must be multiple of 5
):
    """Analyze metrics with validated parameters."""
    # Implementation...
```

### 重复行为
如果需要注册相同的工具名，则可以用重复行为控制

```python
warn 警告并记录，新的提示词替换旧的提示
error 抛出异常，防止重复注册
replace 使用新的提示替换现有提示
ignore 保留原始提示并忽略尝试新的注册
```

```python
from fastmcp import FastMCP

mcp = FastMCP(
    name="StrictServer",
    # Configure behavior for duplicate tool names
    on_duplicate_tools="error"
)

@mcp.tool
def my_tool(): return "Version 1"

# This will now raise a ValueError because 'my_tool' already exists
# and on_duplicate_tools is set to "error".
# @mcp.tool
# def my_tool(): return "Version 2"
```

### 移除工具
可以使用 remove_tool 再动态容器中移除工具

```python
from fastmcp import FastMCP

mcp = FastMCP(name="DynamicToolServer")

@mcp.tool
def calculate_sum(a: int, b: int) -> int:
    """Add two numbers together."""
    return a + b

mcp.remove_tool("calculate_sum")
```

## resources 资源
resources 和 tools 的区别，resources 一般返回静态内容，而 tools 一般返回动态类容，且找 MCP 不是问 get_greeting，而是问 resource://greeting

```python
import json
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# Basic dynamic resource returning a string
@mcp.resource("resource://greeting")
def get_greeting() -> str:
    """Provides a simple greeting message."""
    return "Hello from FastMCP Resources!"

# Resource returning JSON data (dict is auto-serialized)
@mcp.resource("data://config")
def get_config() -> dict:
    """Provides application configuration as JSON."""
    return {
        "theme": "dark",
        "version": "1.2.0",
        "features": ["tools", "resources"],
    }
```

### resources 装饰器参数
使用 mcp 的 resource 装饰器参数

```python
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# Example specifying metadata
@mcp.resource(
    uri="data://app-status",      # Explicit URI (required)
    name="ApplicationStatus",     # Custom name
    description="Provides the current status of the application.", # Custom description
    mime_type="application/json", # Explicit MIME type
    tags={"monitoring", "status"}, # Categorization tags
    meta={"version": "2.1", "team": "infrastructure"}  # Custom metadata
)
def get_application_status() -> dict:
    """Internal function description (ignored if description is provided above)."""
    return {"status": "ok", "uptime": 12345, "version": mcp.settings.version} # Example usage
```

显示

```plain
uri
资源的唯一标识符，供 AI 识别
​
name
一个人类可读的名称。如果未提供，则默认为函数名称
​
description
资源的说明。如果未提供，则默认为文档字符串
​
mime_type
指定内容类型。FastMCP 通常会推断默认值，如 text/plain 或 application/json ，但对于非文本类型，显式指定更好。

tags  标签
一组用于对资源进行分类的字符串。这些字符串可以被服务器使用，在某些情况下也可以被客户端使用，以过滤或分组可用的资源。

enabled  启用
一个布尔值，用于启用或禁用资源。有关禁用资源的更多信息，请参阅“禁用资源”

annotations  注解
一个可选的 Annotations 对象或字典，用于添加有关资源的附加元数据。
​
meta
关于资源的可选元信息。这些数据会作为客户端资源对象的 _meta 字段传递给 MCP 客户端，可用于自定义元数据、版本控制或其他特定于应用程序的目的。
```

### 返回值
```plain
str : 默认以 TextResourceContents 发送（使用 mime_type="text/plain" ）。

dict , list , pydantic.BaseModel : 自动序列化为 JSON 字符串并以 TextResourceContents 发送（默认使用 mime_type="application/json" ）。

bytes : Base64 编码后以 BlobResourceContents 发送。您应该指定一个合适的 mime_type （例如 "image/png" , "application/octet-stream" ）。

None : 导致返回一个空的资源内容列表。
```

### 调用资源
```python
@mcp.resource("data://secret", enabled=False)
def get_secret_data():
    """This resource is currently disabled."""
    return "Secret data"
```

### 上下文
资源和资源模板可以通过 Context 对象额外访问的 MCP，那么可以添加一个 context 进行调用

```python
from fastmcp import FastMCP, Context

mcp = FastMCP(name="DataServer")

@mcp.resource("resource://system-status")
async def get_system_status(ctx: Context) -> dict:
    """Provides system status information."""
    return {
        "status": "operational",
        "request_id": ctx.request_id
    }

@mcp.resource("resource://{name}/details")
async def get_details(name: str, ctx: Context) -> dict:
    """Get details for a specific name."""
    return {
        "name": name,
        "accessed_at": ctx.request_id
    }
```

### 异步资源
资源也可以通过 async 进行异步调用

```python
import aiofiles
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

@mcp.resource("file:///app/data/important_log.txt", mime_type="text/plain")
async def read_important_log() -> str:
    """Reads content from a specific log file asynchronously."""
    try:
        async with aiofiles.open("/app/data/important_log.txt", mode="r") as f:
            content = await f.read()
        return content
    except FileNotFoundError:
        return "Log file not found."
```

### 资源类
可以通过函数将资源类全部导入，并加入到 mcp.add_resource

```python
from pathlib import Path
from fastmcp import FastMCP
from fastmcp.resources import FileResource, TextResource, DirectoryResource

mcp = FastMCP(name="DataServer")

# 1. Exposing a static file directly
readme_path = Path("./README.md").resolve()
if readme_path.exists():
    # Use a file:// URI scheme
    readme_resource = FileResource(
        uri=f"file://{readme_path.as_posix()}",
        path=readme_path, # Path to the actual file
        name="README File",
        description="The project's README.",
        mime_type="text/markdown",
        tags={"documentation"}
    )
    mcp.add_resource(readme_resource)

# 2. Exposing simple, predefined text
notice_resource = TextResource(
    uri="resource://notice",
    name="Important Notice",
    text="System maintenance scheduled for Sunday.",
    tags={"notification"}
)
mcp.add_resource(notice_resource)

# 3. Using a custom key different from the URI
special_resource = TextResource(
    uri="resource://common-notice",
    name="Special Notice",
    text="This is a special notice with a custom storage key.",
)
mcp.add_resource(special_resource, key="resource://custom-key")

# 4. Exposing a directory listing
data_dir_path = Path("./app_data").resolve()
if data_dir_path.is_dir():
    data_listing_resource = DirectoryResource(
        uri="resource://data-files",
        path=data_dir_path, # Path to the directory
        name="Data Directory Listing",
        description="Lists files available in the data directory.",
        recursive=False # Set to True to list subdirectories
    )
    mcp.add_resource(data_listing_resource) # Returns JSON list of files
```

### 注释
可以通过 annotations 添加注释

```python
@mcp.resource(
    "data://config",
    annotations={
        "readOnlyHint": True,
        "idempotentHint": True
    }
)
def get_config() -> dict:
    """Get application configuration."""
    return {"version": "1.0", "debug": False}
```

```python
readOnlyHint	boolean	true
表示资源是否仅提供数据而不产生副作用
idempotentHint	boolean	true
指示重复读取是否与单次读取效果相同
```

### 资源模板
建造一个可模板化返回资源数据

```python
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# Template URI includes {city} placeholder
@mcp.resource("weather://{city}/current")
def get_weather(city: str) -> dict:
    """Provides weather information for a specific city."""
    # In a real implementation, this would call a weather API
    # Here we're using simplified logic for example purposes
    return {
        "city": city.capitalize(),
        "temperature": 22,
        "condition": "Sunny",
        "unit": "celsius"
    }

# Template with multiple parameters and annotations
@mcp.resource(
    "repos://{owner}/{repo}/info",
    annotations={
        "readOnlyHint": True,
        "idempotentHint": True
    }
)
def get_repo_info(owner: str, repo: str) -> dict:
    """Retrieves information about a GitHub repository."""
    # In a real implementation, this would call the GitHub API
    return {
        "owner": owner,
        "name": repo,
        "full_name": f"{owner}/{repo}",
        "stars": 120,
        "forks": 48
    }
```

当资源模板构建完毕后

```plain
weather://london/current → 返回伦敦的天气
weather://paris/current → 返回巴黎的天气
repos://jlowin/fastmcp/info → 返回 jlowin/fastmcp 仓库的信息
repos://prefecthq/prefect/info → 返回关于 prefecthq/prefect 仓库的信息
```

### 参数通配符
资源模板支配通配符参数，可以进行跨越匹配，但是不会跨越 "/" 边界

```python
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")


# Standard parameter only matches one segment
@mcp.resource("files://{filename}")
def get_file(filename: str) -> str:
    """Retrieves a file by name."""
    # Will only match files://<single-segment>
    return f"File content for: {filename}"


# Wildcard parameter can match multiple segments
@mcp.resource("path://{filepath*}")
def get_path_content(filepath: str) -> str:
    """Retrieves content at a specific path."""
    # Can match path://docs/server/resources.mdx
    return f"Content at path: {filepath}"


# Mixing standard and wildcard parameters
@mcp.resource("repo://{owner}/{path*}/template.py")
def get_template_file(owner: str, path: str) -> dict:
    """Retrieves a file from a specific repository and path, but 
    only if the resource ends with `template.py`"""
    # Can match repo://jlowin/fastmcp/src/resources/template.py
    return {
        "owner": owner,
        "path": path + "/template.py",
        "content": f"File at {path}/template.py in {owner}'s repository"
    }
```

### 错误处理
如果遇到资源错误，会抛出标准 Python 异常或者 FastMCP ResourceError 异常

如果需要屏蔽错误则使用 mask_error_details 隐藏内部错误

```python
mcp = FastMCP(name="SecureServer", mask_error_details=True)
```

或者可以直接显示控制错误

```python
from fastmcp import FastMCP
from fastmcp.exceptions import ResourceError

mcp = FastMCP(name="DataServer")

@mcp.resource("resource://safe-error")
def fail_with_details() -> str:
    """This resource provides detailed error information."""
    # ResourceError contents are always sent back to clients,
    # regardless of mask_error_details setting
    raise ResourceError("Unable to retrieve data: file not found")

@mcp.resource("resource://masked-error")
def fail_with_masked_details() -> str:
    """This resource masks internal error details when mask_error_details=True."""
    # This message would be masked if mask_error_details=True
    raise ValueError("Sensitive internal file path: /etc/secrets.conf")

@mcp.resource("data://{id}")
def get_data_by_id(id: str) -> dict:
    """Template resources also support the same error handling pattern."""
    if id == "secure":
        raise ValueError("Cannot access secure data")
    elif id == "missing":
        raise ResourceError("Data ID 'missing' not found in database")
    return {"id": id, "value": "data"}
```

### 重复行为
FastMCP 初始化期间可以使用 on_duplicate_resources

```python
warn 警告并记录，新的提示词替换旧的提示
error 抛出异常，防止重复注册
replace 使用新的提示替换现有提示
ignore 保留原始提示并忽略尝试新的注册
```

```python
from fastmcp import FastMCP

mcp = FastMCP(
    name="ResourceServer",
    on_duplicate_resources="error" # Raise error on duplicates
)

@mcp.resource("data://config")
def get_config_v1(): return {"version": 1}

# This registration attempt will raise a ValueError because
# "data://config" is already registered and the behavior is "error".
# @mcp.resource("data://config")
# def get_config_v2(): return {"version": 2}
```

## prompts 提示词
### prompts 装饰器参数
```python
@mcp.prompt(
    name="analyze_data_request",          # Custom prompt name
    description="Creates a request to analyze data with specific parameters",  # Custom description
    tags={"analysis", "data"},            # Optional categorization tags
    meta={"version": "1.1", "author": "data-team"}  # Custom metadata
)
def data_analysis_prompt(
    data_uri: str = Field(description="The URI of the resource containing the data."),
    analysis_type: str = Field(default="summary", description="Type of analysis.")
) -> str:
    """This docstring is ignored when description is provided."""
    return f"Please perform a '{analysis_type}' analysis on the data found at {data_uri}."
```

具体和 tools 与 正常 python 无异，都为 name、tags、enabled、meta

### 参数类型
AI 对参数要求并不严格，可以为字符串参数，也可以使用准确的参数

```python
{
  "numbers": "[1, 2, 3, 4, 5]",
  "metadata": "{\"source\": \"api\", \"version\": \"1.0\"}",
  "threshold": "2.5"
}
```

和正确形式

```python
# This also works for direct calls
result = await prompt.render({
    "numbers": [1, 2, 3, 4, 5],
    "metadata": {"source": "api", "version": "1.0"}, 
    "threshold": 2.5
})
```

都能够进行正确调用

### 返回值
```python
from fastmcp.prompts.prompt import Message, PromptResult

@mcp.prompt
def roleplay_scenario(character: str, situation: str) -> PromptResult:
    """Sets up a roleplaying scenario with initial messages."""
    return [
        Message(f"Let's roleplay. You are {character}. The situation is: {situation}"),
        Message("Okay, I understand. I am ready. What happens next?", role="assistant")
    ]
```

参考

```plain
str 如过返回字符串会被自动转化成 PromptMessage 
PromptMessage  直接使用提供的值。（注意，有一个更用户友好的 Message 构造函数，可以接受原始字符串而不是 TextContent 对象。）
list[PromptMessage | str] 作为消息序列（对话）使用。
Any 当输入任何消息，他都会转化成 str 再转成 PromptMessage
```

### 禁用提示词
与 tools 的 enable 相同

```python
@mcp.prompt(enabled=False)
def experimental_prompt():
    """This prompt is not ready for use."""
    return "This is an experimental prompt."

@mcp.prompt
def seasonal_prompt(): return "Happy Holidays!"

# Disable and re-enable the prompt
seasonal_prompt.disable()
seasonal_prompt.enable()
```

### 异步提示词
FastMCP 也支持异步 MCP 功能，使用 async 和 await 实现

```python
# Synchronous prompt
@mcp.prompt
def simple_question(question: str) -> str:
    """Generates a simple question to ask the LLM."""
    return f"Question: {question}"

# Asynchronous prompt
@mcp.prompt
async def data_based_prompt(data_id: str) -> str:
    """Generates a prompt based on data that needs to be fetched."""
    # In a real scenario, you might fetch data from a database or API
    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://api.example.com/data/{data_id}") as response:
            data = await response.json()
            return f"Analyze this data: {data['content']}"
```

### 访问 MCP 上下文
可以通过 MCP 进行上下文访问

```python
from fastmcp import FastMCP, Context

mcp = FastMCP(name="PromptServer")

@mcp.prompt
async def generate_report_request(report_type: str, ctx: Context) -> str:
    """Generates a request for a report."""
    return f"Please create a {report_type} report. Request ID: {ctx.request_id}"
```

### 提示词重复行为
当发现重复注册提示词时候，可以使用 on_duplicate_prompts 进行控制，其中有多个选项

```python
warn 警告并记录，新的提示词替换旧的提示
error 抛出异常，防止重复注册
replace 使用新的提示替换现有提示
ignore 保留原始提示并忽略尝试新的注册
```

```python
from fastmcp import FastMCP

mcp = FastMCP(
    name="PromptServer",
    on_duplicate_prompts="error"  # Raise an error if a prompt name is duplicated
)

@mcp.prompt
def greeting(): return "Hello, how can I help you today?"

# This registration attempt will raise a ValueError because
# "greeting" is already registered and the behavior is "error".
# @mcp.prompt
# def greeting(): return "Hi there! What can I do for you?"
```



