---
title: 'Agent 四种工程范式 - 从 Prompt Engineering 到 Loop Engineering'
description: '深入解析 AI Agent 开发的四种工程范式：Prompt Engineering（提示词工程）、Context Engineering（上下文工程 写选压隔）、Harness Engineering（约束治理工程）与 Loop Engineering（循环工程），从基础技巧到自动化闭环的系统性演进路线。'
pubDate: 2026-06-30
author: 'IHK-1'
tags: ['AI', 'Agent', 'Prompt Engineering', 'Context Engineering', 'Harness Engineering', 'Loop Engineering', 'LLM', 'Claude Code']
recommend: true
---

# Agent 四种工程范式 - 从 Prompt Engineering 到Loop Engineering
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782809448575-8ad69813-1de7-4a0a-a68a-1a4fe7074b16.png)

## prompt engineering
<!-- 这是一张图片，ocr 内容为：防幻觉设计 清晰指令 提升可信度 降低歧义 角色设定 少样本示例 激活专业知识 用例子代替描述 提示词工程 PROMPT ENGINEERING 提示词链 XML标签 分步链式传递 隔离数据与指令 思维链 元提示 让AI优化提示词 先推理后作答 本文技巧概览 -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782696779619-1a100f9d-8535-4dd6-995f-a908750a3d10.png)

以下为纯提示词限定，可以使用 XML 标签进行结构化内容

### 直接提问 prompt
+ 描述：简单明了的问题或命令。
+ 适用：最适合获得简洁、真实的信息或直接的答案。
+ 用例：适用于快速查询、事实核查和简单任务。

例子：

```plain
问："法国的首都是哪里？"
回答："法国的首都是巴黎。"
```

### 有上下文的 prompt
+ 描述：提供背景信息或上下文来指导回答。
+ 适用：对于更详细和准确的答案很有用，特别是对于复杂的主题。
+ 用例：非常适合教育内容、解释和详细描述。

例子：

```plain
问："解释光合作用的过程，就像你在教一个高中生一样。"
回答："光合作用是绿色植物利用阳光制造自己食物的过程……"
```

### 角色扮演 prompt
+ 描述：为 AI 分配一个特定的角色或角色，以生成更量身定制的回答。
+ 适用：对创意写作、模拟对话和互动场景有效。
+ 用例：适用于创意任务、客户服务模拟和讲故事。

```plain
问："你是一名导游。描述一下在巴黎的一天。"
回答："欢迎来到巴黎！今天，我们将首先参观埃菲尔铁塔，在那里你可以……"
```

### 逐步提示的 prompt
+ 描述：为了清晰起见，将复杂的任务分解为更小、可管理的步骤。
+ 适用：非常适合教学内容、问题解决和过程解释。
+ 用例：适用于教程、指南和程序内容。

```plain
问："逐步解释如何烘焙巧克力蛋糕。"
回复："第一步：将烤箱预热至350°F。第二步：混合干配料……"
```

### 有条件的 prompt
+ 描述：使用条件语句根据特定标准指导回答。
+ 适用：有助于生成针对不同场景或条件的回答。
+ 用例：非常适合个性化建议、决策过程和场景规划。

```plain
问："如果我想减肥，我可以做些什么饮食改变？"
回答："如果你想减肥，你可以考虑减少含糖食物的摄入……"
```

### 给一个例子 prompt
+ 描述：提供一个例子来教模型如何回答。
+ 适用：适用于模型需要从单个示例中学习的任务。
+ 用例：适用于语言翻译、简单的文本转换和需要最少示例的任务。

```plain
问："将以下句子翻译成法语：'Good morning' 。
    例如提问：'Hello, how are you?'，返回："Bonjour, comment ça va?""
回答："Bonjour."
```

### 给多个例子的 prompt
+ 描述：提供几个例子来指导模型的回答。
+ 适用：对于需要额外背景或示例的复杂任务，比给一个示例的 Prompt 更有效。
+ 用例：适用于细微差别的任务、更复杂的语言翻译以及从多个示例生成模式。

```plain
问："根据以下示例：
'Hello, how are you?' — 'Bonjour, comment ça va?'
'Good morning' — 'Bonjour' 
将 'Good night'翻译成法语"
回答："Bonne nuit."
```

### 思维链的 prompt
+ 描述：鼓励模型逐步解释其推理过程。
+ 适用：增强模型处理复杂推理和多步骤问题的能力。
+ 用例：适用于解决问题、逻辑推理和教育内容。

```plain
问："序列2、4、8、16中的下一个数字是什么？解释你的推理。"
回复："每次序列都是加倍的。2加倍是4，4加倍是8，8加倍是16。因此，下一个数字应该是16的两倍，即32。"
```

### 自我一致性的 prompt
+ 描述：为同一提示生成多个响应，并选择最一致的答案。
+ 适用：通过平均多个输出来提高响应的可靠性。
+ 用例：非常适合确保高风险情况下的准确答案、一致性检查和验证。

```plain
问: "What is the capital of Japan?"
回答： "Tokyo", "Tokyo", "Kyoto".
最终回答： "Tokyo" （被选为最一致的答案）。
```

### 保存中间步骤的Prompt
+ 描述：在得出最终答案之前，使用"草稿"写下中间步骤或想法。（有点类似COT，但更适合算术等问题）
+ 适用：通过将复杂任务分解为更小、更易于管理的部分来增强处理复杂任务的能力。
+ 用例：适用于复杂的算术、多步骤问题解决和详细解释。

```plain
问："求解345+678。展示你的中间计算步骤"
回答："首先，添加单位：5+8=13。记下3，并将1结转。接下来，将十位数相加：4+7+1=12。记下2，并将1结转。最后，将数百相加：3+6+1=10。记下0，并将1结转。答案是1023。"
```

### 连续Prompt链
```plain
问1："描述全球变暖的原因。"
回答1："全球变暖主要是由温室效应引起的，温室效应是由大气中二氧化碳、甲烷和一氧化二氮等温室气体的积累造成的。"
问2："温室气体的主要来源是什么？"
回答2："主要来源包括化石燃料燃烧、森林砍伐、工业过程和农业活动。"
问3："全球变暖对极地冰盖有什么影响？"
回答3："全球变暖导致极地冰盖融化，导致海平面上升、极地物种栖息地丧失和洋流变化。"
```

### 基于人工智能创建的Prompt
+ 描述：使用人工智能或 ChatGPT 本身来根据预期结果制定有效的 Prompt。
+ 适用：通过利用人工智能为各种场景生成最佳 Prompt，包括图像生成、内容创建和复杂的问题解决，节省了大量时间并提高了准确性。
+ 用例：这种技术对于生成复杂场景、头脑风暴创意和自动化日常 Prompt 创建任务特别有用。例如，它可以在营销中用于创建详细而引人入胜的广告文案，在教育中用于制定全面的学习指南，或者在创意产业中用于概述详细的图像或故事场景。

```plain
问："帮助我创建一个 Prompt，以生成日落时未来城市景观的图像。"
回答："在日落时创建一个未来主义城市景观的图像，高耸的摩天大楼、飞行的汽车和充满活力的霓虹灯在玻璃建筑上反射。天空应该是橙色、粉色和紫色的混合体。"
```

## context engineering
提示词工程缺点：

+ 一问一答
+ 过于依赖模型自律，不同的上下文可能产生不同的结果
+ 上下文利用率超过 40% 导致上下文退化，注意力缺失无法使用高质量的上下文分析回复
+ 上下文焦虑，模型在感知到上下文快满的时候，则会主动进行收尾，假装工作完成
+ 多 Agent 协作可能会进行上下文污染

上下文工程通过精准设计，避免信息过载，提高信息有效利用率



来源：[https://zhuanlan.zhihu.com/p/1938967453951571269](https://zhuanlan.zhihu.com/p/1938967453951571269)

为应对上述挑战，业界已逐步收敛出一套系统性的应对框架。参考 [Lance's Blog](https://link.zhihu.com/?target=https%3A//rlancemartin.github.io/)，如下图所示将上下文工程分为四个部分：**写入（Write）、选取（Select）、压缩（Compress）和隔离（Isolate）**。每个部分的具体实现策略和细节有太多可以深挖的，这里仅作大致的介绍。

<!-- 这是一张图片，ocr 内容为：ISOLATE CONTEXT SELECT CONTEXT COMPRESS CONTEXT WRITE CONTEXT RETRIEVE RELEVANT TOOLS PARTITION CONTEXT IN STATE LONG-TERM MEMORIES (ACROSS AGENT SESSIONS) SUMMARIZE CONTEXT RETRIEVE FROM SCRATCHPAD TO RETAIN RELEVANT TOKENS HOLD IN ENVIRONMENT/SANDBOX 一 SCRATCHPAD (WITHIN AGENT SESSION) RETRIEVE LONG-TERM MEMORY TRIM CONTEXT TO REMOVE IRRELEVANT TOKENS PARTITION ACROSS MULTI-AGENT STATE 口一一一0 (WITHIN AGENT SESSION) RETRIEVE RELEVANT KNOWLEDGE 知乎@LASTWHISPER LLM CONTEXT -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782781734085-d36a429a-8fa4-4efe-908c-0c188df234a1.png)

### 写入（Write）
写入主要是将 **上下文持续久化，超越上下文窗口的限制**，在未来按需取用。通常情况下分为：

+ **会话内写入 (Session-level Write):** Agent 将中间思考、计划或临时数据写入一个会话内的**草稿纸 (Scratchpads)**。这是一种轻量级的、非持久化的写入，用于管理当前任务的复杂性。
+ **持久化写入 (Persistent Write):** 系统将具有长期价值的信息（如用户偏好总结、关键事实）写入外部的**记忆 (Memory)** 系统，如向量数据库或知识图谱。这实现了跨会话的知识积累。例如，ChatGPT 和 Cursor 等应用通过这种方式，让 Agent 在与用户的持续交互中"学习"和"成长"，用户在解决某些问题时无需手动引入上下文。

Anthropic 也曾在博客中建议，**Subagent output to a filesystem to minimize the 'game of telephone.'** 通过把 subagent 的输出写到文件以避免无意义的上下文传递，上下文窗口占用等。

### 选取（Select）
选取的目的，是在每次 LLM 调用前，从所有可用的信息源中，动态地拉取与当前子任务最相关的信息。这是保证上下文信噪比的关键。

上下文工程的中的选取包括三类：

+ **确定性选取 (Deterministic Select):** 指根据预设规则加载上下文。例如，编码 Agent （Claude Code）在启动时，**固定加载** 项目根目录下的 `CLAUDE.md` 文件，这是一种简单高效的先验知识注入。
+ **模型驱动选取 (Model-driven Select):** 当可用信息源过多时（如海量工具或文档），可以利用模型自身的能力进行筛选。
+ **检索式选取 (Retrieval-based Select):** 这是最主流的方式，其核心范式是通过相似度检索，从记忆、草稿纸或外部知识库中**选取**信息。因此，选取操作的成败，在很大程度上依赖于底层检索系统的质量。

### 压缩（Compress）
压缩的目的，是在信息进入上下文窗口**之前**，对其进行有损或无损的压缩，用更少的 Token 承载最核心的信号。 这是在上下文窗口容量有限的情况下，容纳更多有效信息的直接手段。

<!-- 这是一张图片，ocr 内容为：SUMMARIZE MESSAGE HISTORY SUMMARIZE TOOL FEEDBACK LLM FEEDBACK TOOL CALL TOO1 TASK OVERVIEW, FEEDBACK KEY DECISIONS, TOOL CALL ETC HUMAN SYSTEM MESSAGE 知乎 LASTWHISPER -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782781733660-7c3ea691-5b2f-43c3-bf3f-aa0de22629e7.png)

前文提到，Claude Code 等 Agentic System 需要大量的 token 开销。因此，在上下文窗口接近溢出时，它们通常会采取所谓的"auto-compact"，如上图左边所示，它会自动的总结 Context 保留"它认为最重要的部分"。因此自动压缩的策略及其性能对后续任务处理的影响非常大。根据实际使用情况，Claude Code 的 auto-compact 功能仍不完善，直接以最小上下文重启更稳妥。

再次引用 Section 2.2 中的图片。Cognition AI 为了压缩 context，从而高效的在 agent 之间传递，使用了 fine-tuning 过的"压缩大语言模型"专门执行压缩步骤。

<!-- 这是一张图片，ocr 内容为：KELIABLE ON LONGER TASKS (BUT HARD TO GET RIGHT) TASK 个 CONVERSATION & ACTIONS SO FAR AGENT BREAKS DOWN TASK CONTEXT COMPRESSION KEY MOMENTS & DECISIONS LLM 00 AGENT SUBTASK 1 WORK DOES SUBTASK 1 I KEY MOMENTS & DECISIONS 00 AGENT L SUBTASK 2 WORK DOES SUBTASK 2 KEY MOMENTS & DECISIONS 0000 AGENT DOES SUBTASK 3 知乎@LASTWHISPER -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782781733889-d8a6ceca-5aea-44ab-b58b-e7905f1b6596.png)

另有修剪策略：如硬截断超限历史，代价是失去部分语境。

### 隔离（Isolate）
相较于前三个在"信息流"内部进行优化的原则，隔离是一种在**系统架构层面**进行的、更根本的上下文管理策略。隔离的目的，在多信息流之间设置边界，由子流程先行消化，仅上交要点。**可视为跨流层面的'压缩'**。

Anthropic 提到过一个很有意思的观点："The essence of search is compression: distilling insights from a vast corpus." 翻译过来便是：**"搜索即压缩，从庞大的语料库中提取洞见"**。这不免让人想到源自 Ilya 的**压缩即智能**。

在多智能体系统中，子智能体扮演了"智能过滤器"的角色。它们在各自的领域内**隔离且并行**工作，消化大量原始信息，然后将最关键的"**压缩后**"的洞见（the most important tokens）提交给主智能体。

<!-- 这是一张图片，ocr 内容为：G CONTEXT WINDOW LEAD AGENT COMPRESSED COMPRESSED CONTEXT CONTEXT 知乎@LASTWHISPER SUB AGENT1 SUB AGENT1 -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782781733732-8ed2c73e-7a9d-42da-bd12-cf7094e0fdd8.png)

这种机制极大地减轻了主智能体（Lead Agent）的认知负担。它无需亲自阅读每一份原始文档，只需处理由各个专家团队提交上来的、经过预处理和提炼的"摘要报告"。因此，**上下文工程中的隔离，最经典的表现就是多智能体架构，由于 Lead Agent 只接收隔离上下文中最有价值的部分，可以很大程度的避免 Long Context 带来的潜在问题，例如 上下文干扰/上下文冲突，隔离也侧面提高了上下文中的信息密度。** Tool call 以及类似的沙盒环境也都体现了同等的隔离思想。

****

**压缩 vs 隔离 的思考**  
- 压缩作用于单一信息流的内容，旨在提升其内在的信息密度。  
- 隔离则作用在多条信息流上，旨在管理系统的复杂性，同时也能起到广义的压缩作用。  
它们的目的，在我看来殊途同归，最终都是为了提升 Context 中的信息密度。一个成熟的系统，往往会同时运用这两种策略。** 一个值得思考的问题：Prompt Engineering 在这个框架中的位置？**  
  
细心的读者可能会发现，我们反复强调"提示工程是上下文工程的子集"，但上述的"写、选、压、隔"四大原则，似乎并未直接包含"如何设计 System Prompt"这类提示工程的核心活动。  
  
我认为这主要是视角的不同。这个四个最佳实践，主要关注的是如何管理**动态、流动的信息**（如 RAG 结果、对话历史）。而由提示工程产出的"指导性上下文"（如 System Prompt），在这个框架中，更多被视为一种**相对静态的核心配置**。会在"选取"的部分被加载到上下文中。

### 实际使用（claude 上下文压缩）
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/webp/35229002/1782783339487-5def97c1-47fe-49c8-bfe9-9989eb1b874e.webp)

使用工程思想处理写入、选取、压缩、隔离。40% 时自动进行触发。

```markdown
你的任务是创建一份详细的对话总结，重点关注用户的明确请求和你之前的操作。

这份总结应全面记录技术细节、代码模式和架构决策，这些对于后续的开发工作至关重要，同时又不丢失上下文。

在提交最终总结之前，请使用 `<analysis>` 标签将你的分析内容包裹起来，以整理思路并确保涵盖所有要点。分析过程如下：

1. 按时间顺序分析对话中的每条消息和每个部分。针对每个部分，详细识别以下内容：

- 用户的明确请求和意图

- 你处理用户请求的方式

- 关键决策、技术概念和代码模式

- 具体细节，例如：

- 文件名

- 完整的代码片段

- 函数签名

- 文件编辑

- 你遇到的错误以及你的修复方法

- 特别注意你收到的具体用户反馈，尤其是当用户要求你采取不同的做法时。

2. 仔细检查技术上的准确性和完整性，确保每个必要元素都得到充分的阐述。

你的总结应包含以下内容：章节：

1. 主要请求和意图：详细记录用户的所有明确请求和意图。

2. 关键技术概念：列出所有讨论过的重要技术概念、技术和框架。

3. 文件和代码段：列举检查、修改或创建的具体文件和代码段。特别关注最近的消息，并在适用情况下提供完整的代码片段，并简要说明读取或编辑此文件的重要性。

4. 错误和修复：列出遇到的所有错误以及修复方法。特别关注收到的具体用户反馈，尤其是用户要求您采取不同做法的情况。

5. 问题解决：记录已解决的问题以及任何正在进行的故障排除工作。

6. 所有用户消息：列出所有非工具结果的用户消息。这些消息对于理解用户的反馈和意图变化至关重要。

7. 待办任务：概述您被明确要求处理的任何待办任务。

8. 当前工作：详细描述在此总结请求之前正在进行的工作，并特别注意以下几点：包含用户和助手最近的消息。如适用，请包含文件名和代码片段。

8. 可选的下一步：列出您将采取的与您最近工作相关的下一步。重要提示：确保此步骤与用户最近的明确请求以及您在提交此总结请求之前正在处理的任务直接相关。如果您的上一项任务已完成，则仅当后续步骤与用户的请求明确相关时才列出。未经用户确认，请勿处理无关的请求或已完成的旧请求。

如果有下一步，请包含最近对话中的直接引用，准确说明您正在处理的任务以及您完成的位置。请务必逐字逐句地引用，以确保任务理解无误。

以下是输出结构的示例：

<示例>

<分析>

[您的思考过程，确保所有要点都得到全面准确的阐述]

</分析>

<总结>

1. 主要请求和意图：

[详细描述]

2. 关键技术概念：

- [概念 1]

- [概念 2]

- [...]

3. 文件和代码段：

- [文件名 1]

- [文件重要性概述]

- [文件更改概述（如有）]

- [重要代码片段]

- [文件名 2]

- [重要代码片段]

- [...]

4. 错误及修复：

- [错误 1 的详细描述]

- [错误修复方法]

- [用户对该错误的反馈（如有）]

- [...]

5. 问题解决：

[已解决问题的描述及正在进行的故障排除]

6. 所有用户消息：

- [非工具使用相关的用户消息详情]

- [...]

7. 待办任务：

- [任务 1]

- [任务 2]

- [...]

8. 当前工作：

[当前工作的详细描述]

9. 可选的下一步：

[可选的下一步操作]

</summary>

</example>

请根据目前的对话内容，按照此结构提供您的总结，并确保您的回答准确且全面。

上下文中可能包含其他总结说明。如果包含，请记住在创建上述总结时遵循这些说明。说明示例包括：

<example>

## 精简说明

总结对话时，请重点关注 TypeScript 代码的更改，并记住您犯的错误以及您是如何修复它们的。

</example>

<example>

# 总结说明

使用精简格式时，请重点关注测试输出和代码更改。包含文件
```

## harness engineering
上下文工程每次生成再注入，且 Agent 常有以下几种失败模式

+ **试图一步到位：**Agent 倾向于在一个会话里把所有功能都做完。结果是上下文窗口耗尽，留下一堆没有文档的半成品代码，下一个会话启动时只能花大量时间猜测之前发生了什么。
+ **过早宣布胜利：**在项目后期，当部分功能已经完成后，Agent 会环顾四周，看到已有进展就直接宣布任务完成——即使还有大量功能未实现。
+ **过早标记功能完成：**a在没有明确提示的情况下，Agent 写完代码就标记为完成，却没有做端到端测试。单元测试或 curl 命令通过了不代表功能真正可用。

### harness engineering 四大支柱
<!-- 这是一张图片，ocr 内容为：上下文工程 架构约束 ARCHITECTURE CONSTRAINTS CONTEXT ENGINEERING 分层依赖模型自动LINTER 动态知识注入.AGENTS.MD CI强制阻断?类型系统 按需检察?活文档机制 AI AGENT 智能体 熵管理 反馈循环 ENTROPY MANAGEMENT FEEDBACK LOOP 定期垃圾回收文档园丁 智能体审智能体?自动测试 CI验证?错误信号回传 持续小额偿还技术债 -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782784396029-dfc5bd60-0893-45ca-9fb9-ec988f49677f.png)

****

**上下文工程：**

harness 的上下文工程不是指 写选压隔 的上下文工程，而是指动态知识注入，给 Agent 一张地图，让 Agent  知道每个 docs 是什么、什么时候该读，按需检索

****

**架构约束：**

Types → Config → Repo → Service → Runtime → UI

+ Types 核心数据类型接口定义、Config 配置结构 环境变量定义、Repo 数据访问层 存储逻辑、Service 业务逻辑实现、Runtime 运行时适配 中间件、UI 用户界面呈现。
+ 只能按照箭头进行依赖，UI 层可以依赖 Service 层，Service 层无法依赖 UI 层。
+ 规则写在文档里或者直接进行规则编码系统级阻断。

****

**反馈循环：**

在数百行测试输出里，真正有价值的信息可能只有几条，但 Agent 会全部读完导致注意力分散。

+ 直接让 Agent 自动进行测试，如果通过就 0 输出，失败则给出结构化错误信息
+ Agent 标记任务完成前，系统强制拦截，要求它对照需求逐项确认边界条件、错误处理、测试更新。
+ 同一文件被修改超过 3 次且测试仍失败，触发干预："检测到重复编辑，建议回滚后重新审视需求。"



**熵管理：**

AI 已经进入快发展时代，纯让 AI 干活容易产生技术债（为了短期开发，后期需要承担额外开发负担），那么需要让 AI 及时进行处理技术债。

+ 频率与节奏：不是每周一次，而是每天一次。在每个工作日的下午（例如4点到5点），团队会固定进入"清理模式"。
+ 工作内容：在这一个小时里，工程师不再开发新功能，而是专门用来审视当天AI Agent生成的所有代码、合并请求（PR）、以及CI/CD流水线的反馈。
+ 核心任务：快速识别出当天新引入的"坏模式"或临时代码妥协，并立即将它们"编译"成可供AI自动执行的规则，比如：

### harness engineering 思想与实践
感觉可以看 superpowers 的 SKILL 源文件，感觉很类似

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782786386703-70c70e3b-d0b7-43c5-a9a4-e355e3d53240.png)

#### Phase 1：信息层 (1-2天) —— 从"百科全书"到"地图"
这个阶段的核心目标是解决**"信息过载与定位困难"**。

**核心问题**：一个巨大的AGENTS.md文件如同百科全书，AI智能体阅读耗时、推理负担重，且在需要更新时容易产生冲突。信息获取的信噪比极低。

**解决方案**：**文档索引化与结构化**。

#### Phase 2：约束层 (3-5天) —— 从"软规范"到"硬检查"
这个阶段的核心目标是将最重要的**架构规则自动化、可执行化**。

**核心问题**：仅靠文档中的"严禁……"类规范是**软约束**，AI Agent可能会忽略或"忘记"。必须将它们转化为**硬性检查**，在代码生成或提交时自动执行，失败则阻断流程。

**解决方案**：**规则自动化与CI/CD集成**。

#### Phase 3：自动化层 (1-2周) —— 从"人工治理"到"系统自愈"
这个阶段的核心目标是建立**自动化的管理和持续优化机制**。

**核心问题**：前两个阶段主要依赖人工定义规则。当任务规模和复杂度提升时，需要系统具备更强的自动管理和优化能力。

**解决方案**：**引入多Agent协作与自动化治理Agent**。

#### 路线图总结
| 阶段 | 核心目标 | 主要手段 | 验证标准 |
| :--- | :--- | :--- | :--- |
| 1. 信息层 | 解决信息混乱与定位难 | 文档拆解、建立索引（地图） | Agent能根据索引找到正确文档 |
| 2. 约束层 | 强制执行关键架构规则 | Linter规则、CI集成、Hook脚本 | 违规代码会被CI流程阻断 |
| 3. 自动化层 | 建立自动化管理与持续优化 | 父-子Agent架构、清理Agent | 系统能自动扫描债务，并持续从错误中"学习"和加固 |


#### 总结
这个三阶段路线图的精妙之处在于它的**渐进性和闭环性**：

**渐进性**：从成本最低、最容易开始的"信息整理"入手；逐步升级到"自动化检查"；最终实现"系统化治理"。每一步都为下一步提供了必要的输入（信息层输出清晰的约束目标，约束层输出可被自动化的规则）。

**闭环性**：核心落在**"Agent每翻一次车，就往Harness里加一个检查点"**这个习惯上。这使得Harness本身成为一个"活的"、持续进化的系统，而不是一次性的配置。团队的认知和经验被持续地、低成本地编码进系统，形成组织知识的有序沉淀。

Harness Engineering 正是一个将原本琐碎的、依赖于个人经验的"AI编程技巧"，系统化、工程化、自动化的实践框架。

## loop engineering
来源：[https://blog.csdn.net/qq_32799165/article/details/161901342](https://blog.csdn.net/qq_32799165/article/details/161901342)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782808320140-33117a77-729e-4a3b-b581-cfd20ac41ac9.png)

### Loop Engineering 六个阶段
**Input Capture 输入捕获**

Loop 的触发点。可以是定时任务（cron 触发发现新 issue）、事件监听（CI 失败通知）、或上一轮 Loop 的输出（"还有 3 个文件未处理"）。核心是让 Loop 自己找到"下一件要做的事"，而不是等人来告诉它。这一步属于 Outer Harness 的 Trigger Logic。

**Context Assembly 上下文组装**

根据当前任务从磁盘文件（CLAUDE.md、VISION.md、项目代码）、向量索引、或上一轮的 summary 中提取相关上下文。关键设计决策：记忆存磁盘不存 context window——因为模型每次 run 之间会完全遗忘。这一步属于 Inner Harness。

**Model Inference 模型推理**

将组装好的 context 连同 task description 发给 LLM，获取结构化输出（tool call、code patch、decision）。区别于传统 Prompt Engineering——prompt 是 Harness 自动生成的，不是人写的。

**Action Execution 动作执行**

Agent 根据模型输出执行实际动作——写文件、跑测试、调 API、开 PR。这里需要 Harness 的 tool definitions 和 sandbox 隔离来确保安全。

**Observation & Logging 观测记录**

捕获 action 的结果——测试通过了吗？CI 绿了吗？API 返回了什么？将结果结构化记录。这一步对应 Harness 中的 Sensors。

**Memory Update 记忆更新**

将本轮学到的信息写回持久存储——更新 todo list、标记 issue 为 resolved、在 MEMORY.md 中追加经验。属于 Outer Harness 的 Persistent Memory。

### Loop Engineering 五大模块
模块流程：一个典型的生产 Loop 把五大模块串联——Automation 定时触发 → 在隔离的 Worktree 中启动 Sub-agent → Sub-agent 加载 Skills 理解项目约定 → 通过 Connector 从 Linear 拉取 issue → 实现代码 → 另一个 Sub-agent（verifier）review → 通过 Connector 开 PR 并通知 Slack。

**Automations（自动化触发器）：**定义 Loop 何时启动、以什么频率运行、达到什么条件停止。典型实现是 /goal 命令——设定一个"run-until-done"的目标条件（如"所有 CI 测试通过"），系统自动循环直到满足或超时。这是 Loop 区别于 Harness 的关键组件——Harness 可以没有 automation（手动触发），但 Loop 必须有。

**Worktrees（工作隔离）：**使用 git worktree 或内置文件隔离机制，确保多个并行 Agent 不会在同一文件上冲突。每个 Agent 在自己的 worktree 中执行修改，完成后通过 PR 合入主分支。这属于 Harness 中的基础设施组件。

**Skills（技能文件）：**即 SKILL.md 类的项目约定文档。存储团队的编码规范、架构规则、部署流程等隐性知识。Agent 启动时加载这些文件，确保生成的代码符合团队约定。这属于 Harness 的 Guides（前馈控制）——在 Agent 执行前提供方向。

**Plugins/Connectors（外部连接器）：**通过 MCP（Model Context Protocol）等协议让 Agent 能与外部系统交互——Linear 看任务、Slack 发通知、GitHub 开 PR。这属于 Harness 的 Tool Definitions。

**Sub-agents（子代理）：**将大任务拆分给不同角色的专用 Agent。典型模式是在 .codex/agents/ 或 .claude/agents/ 目录下定义多个 agent 配置（TOML/JSON），分别指定 explorer、implementer、verifier 等角色。

### 风险剖析
**Intent Debt（意图负债）：**当 Agent 缺乏明确的项目上下文时，它不会停下来问你——它会猜测。每次猜测都累积一笔"负债"。对策是 Harness 层面的：用 VISION.md 编码项目长期目标，用 CLAUDE.md 编码规范和架构边界，用 skill 文件编码特定流程。这本质上是"Harness 不够完善导致 Loop 产出偏差"——好的 Harness 是防止 Intent Debt 的根本手段。

**Cognitive Surrender（认知投降）：**当 Loop 稳定运行了几周，你开始"不再有自己的技术观点"。Addy Osmani 的原话是："The danger is stopping having an opinion when loops run autonomously." 对策：定期强制自己做 design review，对每个 PR 回答"如果这是一个人写的我会不会同意"。这个风险是 Loop 特有的——Harness 不会导致 Cognitive Surrender，因为 Harness 需要你手动触发，你还在 loop 里。

**Comprehension Debt（理解负债）：**Loop 可以一天帮你 ship 20 个 PR，但你真正理解其中几个？代码库里有 30% 的代码你从未仔细看过。对策：设定"理解率门槛"——每天至少花 1 小时读 Agent 产出的代码；对关键路径坚持 manual review。同样是 Loop 特有风险——只有自动化运行的系统才会产出你来不及理解的大量代码。

### Boris Cherny 实战模式
Boris Cherny 在演讲中展示了他的日常工作方式：同时运行 5 个终端实例，每个终端里跑一个 Claude Code 的 agent loop，各自处理不同的任务。它们共享一个 CLAUDE.md 文件作为全局语义记忆（这是 Harness 的 Persistent Memory 组件），避免 context window 溢出。人的角色从"写 prompt"变成了"运维 5 条 pipeline"。下图展示了这种并行 Loop 的架构：



<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1782810179895-a0bc22f6-ae18-419f-b4e8-2774c9d1c650.png)

并行模式的关键设计要素：

**CLAUDE.md 作为共享记忆层：**Addy Osmani 明确指出"The model forgets everything between runs so the memory has to be on disk and not in the context"。这个文件是 Harness 的 Persistent Memory 组件被所有 Loop 共享的实例。

**Worktree 物理隔离：**5 个 Agent 分别在 5 个 git worktree 中工作，互不干扰。这是 Harness 的基础设施隔离在 Loop 并行化场景下的具体应用。

**Goal-driven 终止条件：**每个 Agent 被赋予一个明确的 /goal。达到 goal 后自动停止。如果 30 分钟内没有进展，超时退出并报告现状。终止条件是 Loop 的核心——没有它，Harness 再完善也只能人工停止。

**人作为交通管制员：**人不参与具体的代码编写，而是负责分配任务、监控异常、做最终 merge 决策。
