---
title: 'Agent 五种范式：ReAct / Plan-and-Execute / Reflection / Multi-Agent / Agentic Workflow 及代码实现'
description: '深入解析 AI Agent 五种核心工程范式（ReAct、Plan-and-Execute、Reflection、Multi-Agent、Agentic Workflow）的原理、优缺点、适用场景，并附完整 Python 代码实现。'
pubDate: 2026-07-08
author: 'IHK-1'
tags: ['AI Agent', 'ReAct', 'Plan-and-Execute', 'Reflection', 'Multi-Agent', 'Agentic Workflow', 'LLM', 'Python']
---
# ReAct
**注意：观察是指工具输出的结果**

## 工作流程
ReAct 范式核心循环为 Thought → Action → Observation。思考 → 执行 → 观察。****

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1783325363061-74a0ca1c-45c2-4c32-8e9e-95c0ee2cef7f.png)

简单来说就是：先基于当前信息思考下一步该做什么，调用对应的工具执行这个行动，观察工具返回的结果，再将结果作为新的输入继续思考，如此反复直到任务完成。

## 优缺点
优点：

+ 及其简单灵活，方便上手编写代码以及调整
+ 解释性比较好，思路明显

缺点：

+ 执行长任务时容易迷失方向，没有大局观视野，可能局部最优
+ 成本过高，调用模型次数过多

适用场景：适合场景不确定，探索性质的任务，例如信息搜集、web 打点

## Demo 代码
```python
"""
ReAct (Reasoning + Acting) Demo — 使用 AsyncOpenAI + DeepSeek

核心演示: Thought → Action → Observation 的串行链条。
每一步 LLM 只能看到上一轮的 Observation，再决定下一步 Action。

用法:
    python 01_react.py
"""

import asyncio
import json
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.deepseek.com/",
    api_key="sk-xxx",
)

MODEL = "deepseek-v4-pro"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 工具
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def search_rate(keyword: str) -> dict:
    db = {
        "三年定存": {"product": "三年期定期存款", "rate": 2.35, "risk": "保本保息，存款保险保障"},
        "一年理财": {"product": "一年期银行理财(R2)", "rate": 3.20, "risk": "不保本但概率极低"},
        "股票基金": {"product": "偏股型基金(历史均值)", "rate": 6.20, "risk": "波动大，可能亏损20%+"},
    }
    for k, v in db.items():
        if k in keyword:
            return {"found": True, **v}
    return {"found": False, "hint": "试试: 三年定存、一年理财、股票基金"}


async def calc_final(principal: float, rate: float, years: int) -> dict:
    """终值 = 本金 × (1 + 利率)^年数"""
    fv = principal * (1 + rate / 100) ** years
    return {"本金": principal, "利率%": rate, "年数": years, "到期金额": round(fv, 2)}


async def diff_calc(a: float, b: float) -> dict:
    """算两个数的差值"""
    return {"A": a, "B": b, "差值(A-B)": round(a - b, 2), "B比A多赚": round(b - a, 2)}


TOOLS_MAP = {"search_rate": search_rate, "calc_final": calc_final, "diff_calc": diff_calc}

TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "search_rate",
            "description": "查询金融产品的年化收益率。关键词: 三年定存、一年理财、股票基金",
            "parameters": {
                "type": "object",
                "properties": {"keyword": {"type": "string", "description": "查询关键词"}},
                "required": ["keyword"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calc_final",
            "description": "复利计算到期金额。公式: 本金*(1+利率)^年数",
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {"type": "number", "description": "本金(元)"},
                    "rate": {"type": "number", "description": "年化利率(百分比)，如 2.35 表示 2.35%"},
                    "years": {"type": "integer", "description": "投资年数"},
                },
                "required": ["principal", "rate", "years"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "diff_calc",
            "description": "计算两个金额之间的差值",
            "parameters": {
                "type": "object",
                "properties": {
                    "a": {"type": "number", "description": "第一个金额"},
                    "b": {"type": "number", "description": "第二个金额"},
                },
                "required": ["a", "b"],
            },
        },
    },
]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ReAct Agent
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SYSTEM_PROMPT = """你是 ReAct Agent。必须严格遵循 Thought → Action → Observation 循环。

规则:
- 每次只调用一个工具
- 拿到 Observation 后，真正思考下一个 Action
- 绝不能在没有 Observation 的情况下预判下一步

你有三个工具:
- search_rate(keyword): 查利率
- calc_final(principal, rate, years): 算到期的钱
- diff_calc(a, b): 算两个金额的差值

用中文回答。"""


async def react_agent(question: str, max_steps: int = 6):

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": question},
    ]

    for step in range(1, max_steps + 1):
        # ============ 画当前状态 ============
        print(f"\n{'▓' * 60}")
        print(f"  Round {step}")
        print(f"{'▓' * 60}")

        # 展示本轮 LLM 能看到的消息
        print(f"  📨 LLM 当前看到的上下文 ({len(messages)} 条):")
        for i, m in enumerate(messages):
            role = m["role"] if isinstance(m, dict) else m.role
            icon = {"system": "⚙", "user": "👤", "assistant": "🤖", "tool": "📊"}.get(role, "")
            if isinstance(m, dict) and m.get("tool_calls"):
                name = m["tool_calls"][0]["function"]["name"]
                args = m["tool_calls"][0]["function"]["arguments"]
                print(f"  {icon} [{i}] assistant: 调用 {name}({args})")
            elif isinstance(m, dict) and role == "tool":
                print(f"  {icon} [{i}] tool 返回: {m.get('content','')[:80]}")
            else:
                c = (m.get("content","") if isinstance(m, dict) else m.content or "")[:60]
                print(f"  {icon} [{i}] {role}: {c}")

        # ============ 调用 LLM ============
        response = await client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=TOOLS_SCHEMA,
            tool_choice="auto",
        )

        choice = response.choices[0]
        msg = choice.message

        # ============ LLM 决定 Action ============
        if choice.finish_reason == "tool_calls" and msg.tool_calls:

            tc = msg.tool_calls[0]   # 只取第一个（每轮只调一个工具）
            tool_name = tc.function.name
            tool_args = json.loads(tc.function.arguments)

            # Thought: LLM 为什么选这个工具？
            print(f"\n  💡 Thought: \"我需要调 {tool_name}，因为...\"")
            print(f"     (这个决策是基于上面 {len(messages)} 条历史做出的)")

            # Action
            print(f"  ⚡ Action:  {tool_name}({json.dumps(tool_args, ensure_ascii=False)})")

            fn = TOOLS_MAP[tool_name]
            result = await fn(**tool_args)

            # Observation — 关键！这条会追加到 messages，下一轮 LLM 就能看到
            print(f"  👁️  Observation: {json.dumps(result, ensure_ascii=False)}")
            print(f"     ↑ 这条 Observation 会追加到 messages，"
                  f"下一轮 LLM 就能读到它来决策下一步")

            # 追加到历史
            messages.append({
                "role": "assistant",
                "content": msg.content,
                "tool_calls": [{
                    "id": tc.id, "type": tc.type,
                    "function": {"name": tc.function.name, "arguments": tc.function.arguments},
                }],
            })
            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": json.dumps(result, ensure_ascii=False),
            })

            # 串行链可视化
            print(f"\n  ┌── 串行链 (每轮一条 Action + 一条 Observation) ──────────────┐")
            for i, m in enumerate(messages):
                if isinstance(m, dict) and m.get("tool_calls"):
                    n = m["tool_calls"][0]["function"]["name"]
                    print(f"  │ [{i}] ▶ Action:     {n}")
                elif isinstance(m, dict) and m["role"] == "tool":
                    print(f"  │ [{i}] ◀ Observation: {m['content'][:60]}")
            print(f"  └{'─' * 60}┘")

        # ============ Final Answer ============
        else:
            answer = msg.content or ""
            print(f"\n  🏁 Final Answer (LLM 认为信息够了，不再调工具)")
            return answer

    return "⚠️ 超步数"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def main():
    # 故意设计成必须串行的任务: 先查利率 → 用查到的利率算 → 做对比
    # 每一步的输入都依赖上一步的输出
    question = (
        "我想把 20 万存三年定期。"
        "请先查一下三年期定存的利率是多少，"
        "然后用查到的利率帮我算 20 万存 3 年能拿到多少钱，"
        "再查一下一年期理财的利率，也算一下 20 万存 3 年理财能拿多少，"
        "最后告诉我理财比定存多赚多少。"
        "注意: 你必须一步一步来，每次只做一件事，"
        "必须先查到利率才能计算！"
    )

    print("=" * 60)
    print(f"  ❓ {question}")
    print("=" * 60)

    answer = await react_agent(question, max_steps=8)
    print(f"\n{'=' * 60}")
    print(f"  🎯 结果:\n{answer}")


if __name__ == "__main__":
    asyncio.run(main())

```

## 输出结果
可以看到基本上一直在执行：思考并挑选工具 -> 执行工具 -> 输出结果并加入 messages 历史 的循环

```plain
============================================================
  ❓ 我想把 20 万存三年定期。请先查一下三年期定存的利率是多少，然后用查到的利率帮我算 20 万存 3 年能拿到多少钱，再查一下一年期理财的利率，也算一下 20 万存 3 年理财能拿多少，最后告诉我理财比定存多赚多少。注意: 你必须一步一步来，每次只做一件事，必须先查到利率才能计算！
============================================================

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  Round 1 
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  📨 LLM 当前看到的上下文 (2 条):
  ⚙ [0] system: 你是 ReAct Agent。必须严格遵循 Thought → Action → Observation 循环。

规则
  👤 [1] user: 我想把 20 万存三年定期。请先查一下三年期定存的利率是多少，然后用查到的利率帮我算 20 万存 3 年能拿到多少钱，再

  💡 Thought: "我需要调 search_rate，因为..."
     (这个决策是基于上面 2 条历史做出的)
  ⚡ Action:  search_rate({"keyword": "三年定存"})
  👁️  Observation: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": "保本保息，存款保险保障"}
     ↑ 这条 Observation 会追加到 messages，下一轮 LLM 就能读到它来决策下一步

  ┌── 串行链 (每轮一条 Action + 一条 Observation) ──────────────┐
  │ [2] ▶ Action:     search_rate
  │ [3] ◀ Observation: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": 
  └────────────────────────────────────────────────────────────┘

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  Round 2
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  📨 LLM 当前看到的上下文 (4 条):
  ⚙ [0] system: 你是 ReAct Agent。必须严格遵循 Thought → Action → Observation 循环。

规则
  👤 [1] user: 我想把 20 万存三年定期。请先查一下三年期定存的利率是多少，然后用查到的利率帮我算 20 万存 3 年能拿到多少钱，再
  🤖 [2] assistant: 调用 search_rate({"keyword": "三年定存"})
  📊 [3] tool 返回: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": "保本保息，存款保险保障"}

  💡 Thought: "我需要调 calc_final，因为..."
     (这个决策是基于上面 4 条历史做出的)
  ⚡ Action:  calc_final({"principal": 200000, "rate": 2.35, "years": 3})
  👁️  Observation: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}
     ↑ 这条 Observation 会追加到 messages，下一轮 LLM 就能读到它来决策下一步

  ┌── 串行链 (每轮一条 Action + 一条 Observation) ──────────────┐
  │ [2] ▶ Action:     search_rate
  │ [3] ◀ Observation: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": 
  │ [4] ▶ Action:     calc_final
  │ [5] ◀ Observation: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}
  └────────────────────────────────────────────────────────────┘

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  Round 3
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  📨 LLM 当前看到的上下文 (6 条):
  ⚙ [0] system: 你是 ReAct Agent。必须严格遵循 Thought → Action → Observation 循环。

规则
  👤 [1] user: 我想把 20 万存三年定期。请先查一下三年期定存的利率是多少，然后用查到的利率帮我算 20 万存 3 年能拿到多少钱，再
  🤖 [2] assistant: 调用 search_rate({"keyword": "三年定存"})
  📊 [3] tool 返回: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": "保本保息，存款保险保障"}
  🤖 [4] assistant: 调用 calc_final({"principal": 200000, "rate": 2.35, "years": 3})
  📊 [5] tool 返回: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}

  💡 Thought: "我需要调 search_rate，因为..."
     (这个决策是基于上面 6 条历史做出的)
  ⚡ Action:  search_rate({"keyword": "一年理财"})
  👁️  Observation: {"found": true, "product": "一年期银行理财(R2)", "rate": 3.2, "risk": "不保本但概率极低"}
     ↑ 这条 Observation 会追加到 messages，下一轮 LLM 就能读到它来决策下一步

  ┌── 串行链 (每轮一条 Action + 一条 Observation) ──────────────┐
  │ [2] ▶ Action:     search_rate
  │ [3] ◀ Observation: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": 
  │ [4] ▶ Action:     calc_final
  │ [5] ◀ Observation: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}
  │ [6] ▶ Action:     search_rate
  │ [7] ◀ Observation: {"found": true, "product": "一年期银行理财(R2)", "rate": 3.2, "risk
  └────────────────────────────────────────────────────────────┘

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  Round 4
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  📨 LLM 当前看到的上下文 (8 条):
  ⚙ [0] system: 你是 ReAct Agent。必须严格遵循 Thought → Action → Observation 循环。

规则
  👤 [1] user: 我想把 20 万存三年定期。请先查一下三年期定存的利率是多少，然后用查到的利率帮我算 20 万存 3 年能拿到多少钱，再
  🤖 [2] assistant: 调用 search_rate({"keyword": "三年定存"})
  📊 [3] tool 返回: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": "保本保息，存款保险保障"}
  🤖 [4] assistant: 调用 calc_final({"principal": 200000, "rate": 2.35, "years": 3})
  📊 [5] tool 返回: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}
  🤖 [6] assistant: 调用 search_rate({"keyword": "一年理财"})
  📊 [7] tool 返回: {"found": true, "product": "一年期银行理财(R2)", "rate": 3.2, "risk": "不保本但概率极低"}

  💡 Thought: "我需要调 calc_final，因为..."
     (这个决策是基于上面 8 条历史做出的)
  ⚡ Action:  calc_final({"principal": 200000, "rate": 3.2, "years": 3})
  👁️  Observation: {"本金": 200000, "利率%": 3.2, "年数": 3, "到期金额": 219820.95}
     ↑ 这条 Observation 会追加到 messages，下一轮 LLM 就能读到它来决策下一步

  ┌── 串行链 (每轮一条 Action + 一条 Observation) ──────────────┐
  │ [2] ▶ Action:     search_rate
  │ [3] ◀ Observation: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": 
  │ [4] ▶ Action:     calc_final
  │ [5] ◀ Observation: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}
  │ [6] ▶ Action:     search_rate
  │ [7] ◀ Observation: {"found": true, "product": "一年期银行理财(R2)", "rate": 3.2, "risk
  │ [8] ▶ Action:     calc_final
  │ [9] ◀ Observation: {"本金": 200000, "利率%": 3.2, "年数": 3, "到期金额": 219820.95}
  └────────────────────────────────────────────────────────────┘

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  Round 5
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  📨 LLM 当前看到的上下文 (10 条):
  ⚙ [0] system: 你是 ReAct Agent。必须严格遵循 Thought → Action → Observation 循环。

规则
  👤 [1] user: 我想把 20 万存三年定期。请先查一下三年期定存的利率是多少，然后用查到的利率帮我算 20 万存 3 年能拿到多少钱，再
  🤖 [2] assistant: 调用 search_rate({"keyword": "三年定存"})
  📊 [3] tool 返回: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": "保本保息，存款保险保障"}
  🤖 [4] assistant: 调用 calc_final({"principal": 200000, "rate": 2.35, "years": 3})
  📊 [5] tool 返回: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}
  🤖 [6] assistant: 调用 search_rate({"keyword": "一年理财"})
  📊 [7] tool 返回: {"found": true, "product": "一年期银行理财(R2)", "rate": 3.2, "risk": "不保本但概率极低"}
  🤖 [8] assistant: 调用 calc_final({"principal": 200000, "rate": 3.2, "years": 3})
  📊 [9] tool 返回: {"本金": 200000, "利率%": 3.2, "年数": 3, "到期金额": 219820.95}

  💡 Thought: "我需要调 diff_calc，因为..."
     (这个决策是基于上面 10 条历史做出的)
  ⚡ Action:  diff_calc({"a": 219820.95, "b": 214433.95})
  👁️  Observation: {"A": 219820.95, "B": 214433.95, "差值(A-B)": 5387.0, "B比A多赚": -5387.0}
     ↑ 这条 Observation 会追加到 messages，下一轮 LLM 就能读到它来决策下一步

  ┌── 串行链 (每轮一条 Action + 一条 Observation) ──────────────┐
  │ [2] ▶ Action:     search_rate
  │ [3] ◀ Observation: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": 
  │ [4] ▶ Action:     calc_final
  │ [5] ◀ Observation: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}
  │ [6] ▶ Action:     search_rate
  │ [7] ◀ Observation: {"found": true, "product": "一年期银行理财(R2)", "rate": 3.2, "risk
  │ [8] ▶ Action:     calc_final
  │ [9] ◀ Observation: {"本金": 200000, "利率%": 3.2, "年数": 3, "到期金额": 219820.95}
  │ [10] ▶ Action:     diff_calc
  │ [11] ◀ Observation: {"A": 219820.95, "B": 214433.95, "差值(A-B)": 5387.0, "B比A多赚":
  └────────────────────────────────────────────────────────────┘

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  Round 6
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  📨 LLM 当前看到的上下文 (12 条):
  ⚙ [0] system: 你是 ReAct Agent。必须严格遵循 Thought → Action → Observation 循环。

规则
  👤 [1] user: 我想把 20 万存三年定期。请先查一下三年期定存的利率是多少，然后用查到的利率帮我算 20 万存 3 年能拿到多少钱，再
  🤖 [2] assistant: 调用 search_rate({"keyword": "三年定存"})
  📊 [3] tool 返回: {"found": true, "product": "三年期定期存款", "rate": 2.35, "risk": "保本保息，存款保险保障"}
  🤖 [4] assistant: 调用 calc_final({"principal": 200000, "rate": 2.35, "years": 3})
  📊 [5] tool 返回: {"本金": 200000, "利率%": 2.35, "年数": 3, "到期金额": 214433.95}
  🤖 [6] assistant: 调用 search_rate({"keyword": "一年理财"})
  📊 [7] tool 返回: {"found": true, "product": "一年期银行理财(R2)", "rate": 3.2, "risk": "不保本但概率极低"}
  🤖 [8] assistant: 调用 calc_final({"principal": 200000, "rate": 3.2, "years": 3})
  📊 [9] tool 返回: {"本金": 200000, "利率%": 3.2, "年数": 3, "到期金额": 219820.95}
  🤖 [10] assistant: 调用 diff_calc({"a": 219820.95, "b": 214433.95})
  📊 [11] tool 返回: {"A": 219820.95, "B": 214433.95, "差值(A-B)": 5387.0, "B比A多赚": -5387.0}

  🏁 Final Answer (LLM 认为信息够了，不再调工具)

============================================================
  🎯 结果:
全部算完了！下面给你汇总一下：

---

## 📊 20 万存 3 年：定存 vs 理财 对比

| 项目 | 关键词 | 年化利率 | 到期金额 |
|------|--------|----------|----------|
| 🏦 三年期定存 | 三年定存 | **2.35%** | **214,433.95 元** |
| 📈 一年期理财（滚存3年） | 一年理财 | **3.20%** | **219,820.95 元** |

---

### 💰 结论：理财比定存多赚 **5,387.00 元**

不过要注意：
- **定存**保本保息，有存款保险保障，稳稳当当；
- **理财（R2）**收益更高，但不保本（虽然风险极低）。

三年下来差 5,000 多块，相当于多了 **2.69%** 的总收益，差距还是比较可观的！
```

# Plan-and-Excute
ReAct 范式虽然灵活，但是任务过长时容易偏离目标重复调用工具陷入死循环，为了解决长问题可以使用 Plan-and-Excute 进行执行，一般的系统还会加上重规划的过程，类似一个大型的 ReAct，局部可执行小 ReAct

## 工作流程
规划阶段 -> 执行

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1783413916721-1e540222-25d9-4d4e-b781-492cf3f14f86.png)

## 优缺点
优点：

+ 目标感强，能够有规划的执行任务，不容易偏离目标
+ 效率更高、成本更低，只需要规划打的方向，执行阶段可以给小目标执行
+ 可预测性号，大致直到 Agent 会做什么，需要多长时间，便于进度管理

缺点：

+ 计划不灵活：环境可能是动态的，更新一下可能就不适用了
+ 灵活性较差：遇到计划外的事情时，就容易出意外
+ 规划难度大：很难从一开始就写好一个非常好的完整任务

适用场景：写报告、生成常温、迁移代码等目标明确、步骤较多的结构化长任务

## Demo 代码
代码核心思路：

1. 开始使用 generate_plan agent 生成整体的 plan 
2. 开始循环执行 execute_step 输出每次结果，并添加到 message 中
3. 执行 synthesize agent 综合答案

```python
"""
Plan-and-Execute Demo — 使用 AsyncOpenAI + DeepSeek

四阶段流程，每阶段可视化:
    Planner(规划) → Executor(执行,含依赖解析) → Replanner(修复) → Synthesizer(综合)

核心理念 vs ReAct:
    ReAct: 每步调 LLM → 灵活但慢 (N次LLM)
    P&E: 先规划后执行 → 快但 Planner 不知道执行时的情况
    所以 Replanner 负责补救 Planner 的错误判断

用法:
    python 02_plan_execute.py
"""

import asyncio, json, re
from openai import AsyncOpenAI

client = AsyncOpenAI(base_url="https://api.deepseek.com/",
                     api_key="sk-xxx")
MODEL = "deepseek-v4-pro"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 工具
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def search_rate(product: str) -> dict:
    db = {"定期存款3年": {"产品":"三年定期存款","年利率%":2.35,"风险":"保本保息"},
          "银行理财R2": {"产品":"银行理财(R2)","年利率%":3.20,"风险":"极低"},
          "偏股基金":   {"产品":"偏股型基金","年利率%":6.20,"风险":"高,可能亏20%+"}}
    for k,v in db.items():
        if k in product: return {"found":True, **v}
    return {"found":False, "product":product, "hint":"试试: 定期存款3年, 银行理财R2, 偏股基金"}

async def calc_compound(principal: float, rate_pct: float, years: int) -> dict:
    fv = principal * (1 + rate_pct/100)**years
    return {"本金":principal,"年化%":rate_pct,"年数":years,
            "到期本息":round(fv,2),"纯收益":round(fv-principal,2)}

async def data_store(action: str, key: str = "", value: str = "") -> dict:
    store = data_store.cache
    if action=="set": store[key]=value; return {"status":"ok","key":key}
    elif action=="get": return {"found":key in store,"key":key,"value":store.get(key)}
    elif action=="list": return {"keys":list(store.keys()),"values":{k:store[k] for k in store},"count":len(store)}
    return {"error":f"未知操作:{action}"}
data_store.cache = {}

TOOLS_MAP = {"search_rate":search_rate, "calc_compound":calc_compound, "data_store":data_store}
TOOLS_SCHEMA = [
    {"type":"function","function":{"name":"search_rate","description":"查理财利率。关键词: 定期存款3年,银行理财R2,偏股基金","parameters":{"type":"object","properties":{"product":{"type":"string"}},"required":["product"]}}},
    {"type":"function","function":{"name":"calc_compound","description":"复利: 终值=本金*(1+利率%/100)^年数","parameters":{"type":"object","properties":{"principal":{"type":"number"},"rate_pct":{"type":"number"},"years":{"type":"integer"}},"required":["principal","rate_pct","years"]}}},
    {"type":"function","function":{"name":"data_store","description":"键值存储. action=set/get/list","parameters":{"type":"object","properties":{"action":{"type":"string","enum":["set","get","list"]},"key":{"type":"string"},"value":{"type":"string"}},"required":["action"]}}},
]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Phase 1: Planner
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PLANNER_PROMPT = """你是任务规划器(Planner)。把用户问题拆成执行计划。

工具:
- search_rate(product): 查利率。product 用如 "定期存款3年"。返回 {"年利率%": 2.35, ...}
- calc_compound(principal, rate_pct, years): 算复利。principal/rate_pct/years 都必须是具体数字
- data_store(action, key, value): action=set/get/list

在 args 中, 如果某参数依赖前面步骤的结果, 用 $STEP_N.字段名 引用。
例如: Step 4 的 rate_pct 依赖 Step 1 的 "年利率%" 字段 → "rate_pct": "$S1.年利率%"

输出纯 JSON:
{"analysis":"分析","steps":[{"step":1,"desc":"...","tool":"...","args":{...},"deps":[],"why":"..."}]}"""

async def generate_plan(q: str) -> dict:
    print(f"\n{'█'*65}\n  PHASE 1: PLANNER — 一次性制定全部计划\n{'█'*65}")
    r = await client.chat.completions.create(model=MODEL,
        messages=[{"role":"system","content":PLANNER_PROMPT},
                  {"role":"user","content":f"问题: {q}\n输出执行计划,只输出 JSON。"}],
        temperature=0.1)
    raw = (r.choices[0].message.content or "{}").strip()
    if raw.startswith("```"): raw = "\n".join(raw.split("\n")[1:-1])
    plan = json.loads(raw)
    steps = plan.get("steps",[])
    print(f"  📝 {plan.get('analysis','')}")
    print(f"  ┌─ {len(steps)} 步计划 ──────────────────────────────────┐")
    for s in steps:
        deps = f" ← {s.get('deps',[])}" if s.get("deps") else ""
        args = json.dumps(s.get("args",{}), ensure_ascii=False)
        print(f"  │ S{s['step']} [{s['tool']}] {s.get('desc','')[:45]}")
        print(f"  │    args: {args}{deps}")
    print(f"  └──────────────────────────────────────────────────┘")
    print(f"  (Planner 只调 1 次 LLM, 就定好了全部 {len(steps)} 步)")
    return plan

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 依赖解析引擎
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def resolve_args(args: dict, deps: list, results: dict) -> dict:
    """把 $S1.年利率% 这种占位符替换为 Step 1 结果里的实际值 2.35"""
    resolved = {}
    for k, v in args.items():
        if isinstance(v, str) and v.startswith("$S"):
            # 解析 $S3.年利率% → step=3, field=年利率%
            m = re.match(r'\$S(\d+)\.(.+)', v)
            if m:
                step_id, field = m.group(1), m.group(2)
                dep_json = results.get(step_id, "{}")
                try:
                    dep_obj = json.loads(dep_json) if isinstance(dep_json, str) else dep_json
                except Exception:
                    dep_obj = {}
                if isinstance(dep_obj, dict) and field in dep_obj:
                    resolved[k] = dep_obj[field]
                    print(f"       🔗 $S{step_id}.{field} → {dep_obj[field]}")
                else:
                    resolved[k] = v  # 解析失败, 保留原值
                    print(f"       ⚠️ $S{step_id}.{field} 找不到, 保留原值")
            else:
                resolved[k] = v
        else:
            resolved[k] = v
    return resolved

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Phase 2: Executor
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def execute_step(s: dict, results: dict) -> str:
    sn, tool, desc = s["step"], s["tool"], s.get("desc","")[:55]
    deps = s.get("deps", [])

    print(f"\n  ┌─ Step {sn}: [{tool}] ──────────────────────────────┐")
    print(f"  │ 任务: {desc}")

    args = resolve_args(s.get("args",{}), deps, results)

    fn = TOOLS_MAP.get(tool)
    if not fn:
        print(f"  │ ❌ 工具 '{tool}' 不存在"); return json.dumps({"error":f"no tool:{tool}"})

    try:
        result = await fn(**args)
    except Exception as e:
        result = {"error": str(e), "args_used": args}

    ok = not (isinstance(result, dict) and "error" in str(result))
    icon = "✅" if ok else "❌"
    print(f"  │ 输出: {json.dumps(result,ensure_ascii=False)[:110]}")
    print(f"  └────────────────────────────────────────── {icon} ───┘")
    return json.dumps(result, ensure_ascii=False)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Phase 3 & 4: Replanner + Synthesizer
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def replan_if_needed(executed: list) -> dict:
    has_fail = any(isinstance(r.get("result"),dict) and "error" in str(r.get("result",{})) for r in executed)
    if not has_fail:
        print(f"\n  ✅ REPLANNER: 无需重规划, 所有步骤成功")
        return {"need_more": False}
    print(f"\n{'█'*65}\n  PHASE 3: REPLANNER — 发现失败, 重新规划\n{'█'*65}")
    r = await client.chat.completions.create(model=MODEL,
        messages=[{"role":"system","content":"你是 Replanner。有步骤失败。判断需要什么额外步骤补救。输出JSON: {\"need_more\":bool,\"reason\":\"...\",\"extra_steps\":[{\"step\":N,\"desc\":\"...\",\"tool\":\"...\",\"args\":{},\"deps\":[]}]}"},
                  {"role":"user","content":f"执行日志:\n{json.dumps(executed,ensure_ascii=False,indent=2)}\n\n需要额外步骤吗？只输出JSON。"}],
        temperature=0.1)
    raw = (r.choices[0].message.content or "{}").strip()
    if raw.startswith("```"): raw = "\n".join(raw.split("\n")[1:-1])
    result = json.loads(raw)
    print(f"  need_more={result.get('need_more')} | {result.get('reason','')[:100]}")
    return result

async def synthesize(q: str, results: dict) -> str:
    print(f"\n{'█'*65}\n  PHASE 4: SYNTHESIZER — 综合答案\n{'█'*65}")
    r = await client.chat.completions.create(model=MODEL,
        messages=[{"role":"system","content":"你是 Synthesizer。根据执行结果给最终答案。结构化、有表格、用中文。"},
                  {"role":"user","content":f"问题: {q}\n\n所有步骤执行结果:\n{json.dumps(results,ensure_ascii=False,indent=2)}\n\n给出完整、美观的最终答案。"}],
        temperature=0.3)
    return r.choices[0].message.content or ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 主循环
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def plan_and_execute(question: str) -> str:
    print(f"\n{'═'*65}\n  ❓ {question}\n{'═'*65}")
    data_store.cache = {}

    plan = await generate_plan(question)
    steps = plan.get("steps", [])

    print(f"\n{'█'*65}\n  PHASE 2: EXECUTOR — 逐步执行, 自动解析 $S_N.字段 依赖\n{'█'*65}")
    print(f"  (Planner 规划时不知道利率具体是多少, 所以写 $S1.年利率%)")
    print(f"  (Executor 执行时从 Step 1 的结果里取出 2.35, 填入 Step 4 的参数)")

    step_results, executed = {}, []
    for s in steps:
        r = await execute_step(s, step_results)
        step_results[str(s["step"])] = r
        try: parsed = json.loads(r)
        except Exception: parsed = r
        executed.append({"step":s["step"],"tool":s.get("tool"),"result":parsed})

    rp = await replan_if_needed(executed)
    if rp.get("need_more"):
        for es in rp.get("extra_steps", []):
            if isinstance(es, dict):
                if "step" not in es: es["step"] = max(int(k) for k in step_results)+1
                r = await execute_step(es, step_results)
                step_results[str(es["step"])] = r

    answer = await synthesize(question, step_results)
    llm_calls = f"Planner×1 + Executor×{len(steps)} + {'Replanner×1 + ' if rp.get('need_more') else ''}Synthesizer×1"
    print(f"\n{'═'*65}\n  🏁 完成 | LLM 调用: {llm_calls}\n{'═'*65}")
    return answer

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def main():
    q = ("我有 15 万元想投资 5 年。请帮我查\"定期存款3年\"、\"银行理财R2\"、"
         "\"偏股基金\"的年化利率, 然后分别算 15 万存 5 年能拿多少钱, "
         "存起来, 最后按收益从高到低排序推荐。")
    answer = await plan_and_execute(q)
    print(f"\n{'─'*65}\n📦 最终答案:\n{'─'*65}\n{answer}\n")

if __name__ == "__main__":
    asyncio.run(main())

```

## 输出结果
输出结果：

```plain
═════════════════════════════════════════════════════════════════
  ❓ 我有 15 万元想投资 5 年。请帮我查"定期存款3年"、"银行理财R2"、"偏股基金"的年化利率, 然后分别算 15 万存 5 年能拿多少钱, 存起来, 最后按收益从高到低排序推荐。
═════════════════════════════════════════════════════════════════

█████████████████████████████████████████████████████████████████
  PHASE 1: PLANNER — 一次性制定全部计划
█████████████████████████████████████████████████████████████████
  📝 先查询三种产品的年化利率，然后分别计算15万元投资5年的复利本息合计，将结果存储，最后列出所有收益并比较，推荐收益最高的产品。
  ┌─ 10 步计划 ──────────────────────────────────┐
  │ S1 [search_rate] 查询定期存款3年的年化利率
  │    args: {"product": "定期存款3年"}
  │ S2 [search_rate] 查询银行理财R2的年化利率
  │    args: {"product": "银行理财R2"}
  │ S3 [search_rate] 查询偏股基金的年化利率
  │    args: {"product": "偏股基金"}
  │ S4 [calc_compound] 计算定期存款3年复利本息
  │    args: {"principal": 150000, "rate_pct": "$S1.年利率%", "years": 5} ← [1]
  │ S5 [calc_compound] 计算银行理财R2复利本息
  │    args: {"principal": 150000, "rate_pct": "$S2.年利率%", "years": 5} ← [2]
  │ S6 [calc_compound] 计算偏股基金复利本息
  │    args: {"principal": 150000, "rate_pct": "$S3.年利率%", "years": 5} ← [3]
  │ S7 [data_store] 存储定期存款收益
  │    args: {"action": "set", "key": "定期存款3年", "value": "$S4.本息合计"} ← [4]
  │ S8 [data_store] 存储银行理财R2收益
  │    args: {"action": "set", "key": "银行理财R2", "value": "$S5.本息合计"} ← [5]
  │ S9 [data_store] 存储偏股基金收益
  │    args: {"action": "set", "key": "偏股基金", "value": "$S6.本息合计"} ← [6]
  │ S10 [data_store] 列出所有投资产品的收益数据
  │    args: {"action": "list"} ← [7, 8, 9]
  └──────────────────────────────────────────────────┘
  (Planner 只调 1 次 LLM, 就定好了全部 10 步)

█████████████████████████████████████████████████████████████████
  PHASE 2: EXECUTOR — 逐步执行, 自动解析 $S_N.字段 依赖
█████████████████████████████████████████████████████████████████
  (Planner 规划时不知道利率具体是多少, 所以写 $S1.年利率%)
  (Executor 执行时从 Step 1 的结果里取出 2.35, 填入 Step 4 的参数)

  ┌─ Step 1: [search_rate] ──────────────────────────────┐
  │ 任务: 查询定期存款3年的年化利率
  │ 输出: {"found": true, "产品": "三年定期存款", "年利率%": 2.35, "风险": "保本保息"}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 2: [search_rate] ──────────────────────────────┐
  │ 任务: 查询银行理财R2的年化利率
  │ 输出: {"found": true, "产品": "银行理财(R2)", "年利率%": 3.2, "风险": "极低"}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 3: [search_rate] ──────────────────────────────┐
  │ 任务: 查询偏股基金的年化利率
  │ 输出: {"found": true, "产品": "偏股型基金", "年利率%": 6.2, "风险": "高,可能亏20%+"}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 4: [calc_compound] ──────────────────────────────┐
  │ 任务: 计算定期存款3年复利本息
       🔗 $S1.年利率% → 2.35
  │ 输出: {"本金": 150000, "年化%": 2.35, "年数": 5, "到期本息": 168473.07, "纯收益": 18473.07}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 5: [calc_compound] ──────────────────────────────┐
  │ 任务: 计算银行理财R2复利本息
       🔗 $S2.年利率% → 3.2
  │ 输出: {"本金": 150000, "年化%": 3.2, "年数": 5, "到期本息": 175585.94, "纯收益": 25585.94}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 6: [calc_compound] ──────────────────────────────┐
  │ 任务: 计算偏股基金复利本息
       🔗 $S3.年利率% → 6.2
  │ 输出: {"本金": 150000, "年化%": 6.2, "年数": 5, "到期本息": 202634.71, "纯收益": 52634.71}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 7: [data_store] ──────────────────────────────┐
  │ 任务: 存储定期存款收益
       ⚠️ $S4.本息合计 找不到, 保留原值
  │ 输出: {"status": "ok", "key": "定期存款3年"}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 8: [data_store] ──────────────────────────────┐
  │ 任务: 存储银行理财R2收益
       ⚠️ $S5.本息合计 找不到, 保留原值
  │ 输出: {"status": "ok", "key": "银行理财R2"}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 9: [data_store] ──────────────────────────────┐
  │ 任务: 存储偏股基金收益
       ⚠️ $S6.本息合计 找不到, 保留原值
  │ 输出: {"status": "ok", "key": "偏股基金"}
  └────────────────────────────────────────── ✅ ───┘

  ┌─ Step 10: [data_store] ──────────────────────────────┐
  │ 任务: 列出所有投资产品的收益数据
  │ 输出: {"keys": ["定期存款3年", "银行理财R2", "偏股基金"], "values": {"定期存款3年": "$S4.本息合计", "银行理财R2": "$S5.本息合计", "偏股基金": "$S6.本息合
  └────────────────────────────────────────── ✅ ───┘

  ✅ REPLANNER: 无需重规划, 所有步骤成功

█████████████████████████████████████████████████████████████████
  PHASE 4: SYNTHESIZER — 综合答案
█████████████████████████████████████████████████████████████████

═════════════════════════════════════════════════════════════════
  🏁 完成 | LLM 调用: Planner×1 + Executor×10 + Synthesizer×1
═════════════════════════════════════════════════════════════════

─────────────────────────────────────────────────────────────────
📦 最终答案:
─────────────────────────────────────────────────────────────────
好的，我是 Synthesizer。这是根据所有执行结果为您整理出的 15 万元投资 5 年的方案对比与推荐。

### 📊 投资方案详情对比

| 排序 | 产品名称 | 年化利率 | 风险等级 | 5 年后本息合计 | 纯收益 | 
| :--- | :--- | :--- | :--- | :--- | :--- |
| 🥇 | **偏股型基金** | 6.20% | ⚠️ 高风险（可能亏损20%以上） | ¥202,634.71 | **¥52,634.71** |
| 🥈 | **银行理财（R2）** | 3.20% | ✅ 极低风险 | ¥175,585.94 | **¥25,585.94** |
| 🥉 | **定期存款（3年）** | 2.35% | 🛡️ 保本保息 | ¥168,473.07 | **¥18,473.07** |

---

### 💎 最终推荐与建议

按**纯收益**从高到低排序如上。但收益背后藏着不同的风险，您需要根据自身情况权衡：

*   **想追求最高收益，并能承受波动**：选择 **偏股型基金**。预期收益可达 5.2 万，但必须明白这并非保证，实际可能亏损 20% 以上，适合有长期投资经验且 5 年内不急用此钱的投资者。
*   **求稳且希望收益稍高**：选择 **银行理财（R2）**。风险极低，收益比存款高出 7000 多元，是平衡型选择，适合大多数稳健型投资者。
*   **完全不能接受任何亏损**：选择 **定期存款**。收益确定，本金绝对安全，适合保守型投资者，但需注意 3 年期到期后需重新规划剩余 2 年的投资。

> 投资有风险，决策需谨慎，您可以根据自己的风险承受能力进行组合投资。
```

# Reflection
ReAct 解决了 Agent 怎么动起来，Plan-and-Execute 解决了怎么让 Agent 不迷路，还有最后一个问题是：怎么确保 Agent 做的是对的？ReAct 和 Plan-and-Excute 只会通过一个链子向前，不会遇到问题主动进行修正，所以人们提出了一个新的范式：reflection 反思式

Relection 与 ReAct 类似，但是最后从原来的观察（直接将生成结果导入上下文进行下一轮）更换为思考反思，对结果进行完善

## 工作流程
Reflection 的核心是一个 生成-反思-修正 的循环

+ 生成：根据已有的信息生成初步结果
+ 反思：站在第三视角进行初步评估标准，分析可能存在的问题进行修改
+ 循环：针对反思发现的问题对结果进行修改和完善

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1783418175244-3f1fe5be-7d42-409c-8e88-c7d49c6cf9d9.png)

## 优缺点
优点：

+ 生成质量号：通过多次自我修正，显著提升输出的效果和质量
+ 错误率第：能够主动发现并纠正自己的错误
+ 学习能力强：能够不断改进

缺点：

+ 速度慢：每一次修正和反思都要额外大模型
+ 成本高：大模型每次调用的次数是其他范式的 2~3 倍
+ 可能陷入无限循环：如果反思不够准确，可能会反复修改同一个问题

适用场景：代码生成、文档协作、复杂推理等对质量要求高的任务

## Demo 代码
代码核心思想：

+ 开始生成整体思路
+ 执行并评分
+ 反思并改进

```python
"""
Reflection Demo — 使用 AsyncOpenAI + DeepSeek

流程:
    Gen(初版) → Critic(评分+挑刺) → Refine(改进) → Critic → ... → Pass

核心思想:
    不是一次生成就完了, 而是自我审视→发现不足→迭代改进。
    像一个严格的导师反复批改学生的作业, 每次都有具体反馈。

保证多轮的技巧:
    1. 任务够难 — 第一版不可能完美
    2. Critic 够严 — 至少挑 3 个问题
    3. 可视化每轮的差异

用法:
    python 03_reflection.py
"""

import asyncio, json
from openai import AsyncOpenAI

client = AsyncOpenAI(base_url="https://api.deepseek.com/",
                     api_key="sk-xxx")
MODEL = "deepseek-v4-pro"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Actor: 生成 + 改进 (每次都是独立上下文, 只看到自己的 system prompt)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GENERATOR_SYS = """你是内容生成器(Actor)。根据任务写初版内容。
写完后你会发现你的输出会被严厉地评审, 然后你会根据反馈改进。
用中文。"""

REFINER_SYS = """你是内容改进器(Actor - Refine)。

你之前提交了一个版本, 但被评审(Critic)指出了多个问题。
现在你需要逐条修复这些问题, 输出改进后的完整版本。

重要:
- 逐一处理每条评审意见
- 改进后的版本必须明显优于上一版
- 不要敷衍——每个问题都要真正解决
- 用中文"""


async def generate(task: str) -> str:
    r = await client.chat.completions.create(model=MODEL,
        messages=[{"role": "system", "content": GENERATOR_SYS},
                  {"role": "user", "content": f"## 任务\n{task}\n\n请输出完整内容。"}],
        temperature=0.8)  # 高温度让初版不够完美
    return r.choices[0].message.content or ""


async def refine(task: str, current: str, issues: list[str]) -> str:
    r = await client.chat.completions.create(model=MODEL,
        messages=[{"role": "system", "content": REFINER_SYS},
                  {"role": "user", "content": f"""## 原始任务
{task}

## 你的上一版 (有缺陷)
{current}

## Critic 指出的问题
{chr(10).join(f"{i+1}. {issue}" for i, issue in enumerate(issues))}

请输出修复后的完整版本。必须真正解决每个问题。"""}],
        temperature=0.5)
    return r.choices[0].message.content or ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Critic: 严格评审 (强制找够问题)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITIC_SYS = """你是极其严格的代码评审员(Critic)。

你的评审哲学: 没有完美的代码, 总有可以改进的地方。你必须找到至少 3 个问题。
即使是好的代码, 你也会从命名、注释、边界条件、性能、安全性等角度找到改进空间。

评分时:
- 7 分以上已经是高质量代码, 但你仍要挑问题
- 不要给 9 分或 10 分, 除非它真的无可挑剔(极少见)
- 严格审视: 有没有遗漏的边界条件? 注释是否准确? 命名是否最佳?
- 有没有更优雅的写法? 有没有潜在的性能隐患?

输出 JSON (严格格式):
{
  "scores": {"正确性":1-10, "完整性":1-10, "可读性":1-10, "边界处理":1-10, "性能":1-10},
  "overall": 1-10,
  "issues": ["具体问题1", "具体问题2", "具体问题3"],
  "strengths": ["优点1"],
  "pass": true/false
}

pass 条件: overall >= 8 且 issues <= 1
如果 issues >= 3, pass 必须为 false
前两轮不要给 pass——给作者改进的机会"""


async def critique(task: str, content: str) -> dict:
    r = await client.chat.completions.create(model=MODEL,
        messages=[{"role": "system", "content": CRITIC_SYS},
                  {"role": "user", "content": f"""## 任务
{task}

## 待评审内容
{content}

请严格评审。至少找 3 个问题。只输出 JSON。"""}],
        temperature=0.3)  # 稍高温度让每次评审角度略有不同
    raw = (r.choices[0].message.content or "{}").strip()
    if raw.startswith("```"): raw = "\n".join(raw.split("\n")[1:-1])
    return json.loads(raw)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Reflection 循环 — 完整可视化
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def reflection(task: str, max_iter: int = 3, pass_threshold: int = 8):
    print(f"\n{'═'*65}")
    print(f"  🎯 任务: {task[:90]}...")
    print(f"  🔁 最多 {max_iter} 轮迭代 | 通过线: {pass_threshold}/10")
    print(f"  📐 Critic 策略: 严格模式, 每轮至少挑 3 个问题")
    print(f"{'═'*65}")

    history = []

    # ══════════════════════════════════════════════════════
    # Phase 1: Generate — 初次生成
    # ══════════════════════════════════════════════════════
    print(f"\n{'█'*65}")
    print(f"  PHASE 1: GENERATE — 生成初版")
    print(f"  (Actor 独立上下文, 只看任务描述)")
    print(f"{'█'*65}")

    content = await generate(task)
    print(f"  📄 初版 ({len(content)} 字符)")

    # ══════════════════════════════════════════════════════
    # Phase 2: Reflection 循环 (Critic + Refine)
    # ══════════════════════════════════════════════════════
    for rnd in range(1, max_iter + 1):
        print(f"\n{'█'*65}")
        print(f"  PHASE 2.{rnd}a: CRITIC — 第 {rnd} 次评审")
        print(f"  (Critic 独立上下文, 只看到: 任务 + 当前版本)")
        print(f"{'█'*65}")

        review = await critique(task, content)
        scores = review.get("scores", {})
        overall = review.get("overall", 0)
        issues = review.get("issues", [])
        strengths = review.get("strengths", [])

        # ── 可视化评分 ──
        print(f"\n  ┌── 评分卡 ──────────────────────────────┐")
        for k, v in scores.items():
            bar = "█" * min(v, 10) + "░" * (10 - min(v, 10))
            emoji = "🟢" if v >= 8 else ("🟡" if v >= 6 else "🔴")
            print(f"  │ {emoji} {k:10s} │ {bar} │ {v}/10 │")
        print(f"  ├─────────────────────────────────────────┤")
        star = "⭐" * min(overall, 10)
        print(f"  │ {'综合评分':10s} │ {star} │ {overall}/10 │")
        print(f"  └─────────────────────────────────────────┘")

        # ── 问题清单 ──
        if issues:
            print(f"\n  🔴 Critic 发现了 {len(issues)} 个问题:")
            for i, iss in enumerate(issues):
                print(f"     {i+1}. {iss[:100]}")
        if strengths:
            print(f"\n  🟢 优点: {strengths[0][:100]}")

        # ── 通过检查 ──
        is_pass = review.get("pass", False) or (overall >= pass_threshold and len(issues) <= 1)

        # 前两轮即使分数够了也强制不过——让学生看到改进过程
        if rnd <= 2 and is_pass:
            is_pass = False
            print(f"\n  🔄 (第{rnd}轮即使分数够也不通过——强制进入 Refine 让你看改进过程)")

        history.append({"round": rnd, "content": content, "review": review})

        if is_pass:
            print(f"\n  ✅ 评审通过! (第 {rnd} 轮, overall={overall}/10, issues={len(issues)})")
            break

        if rnd >= max_iter:
            print(f"\n  ⚠️ 达到最大迭代次数 ({max_iter})")
            break

        # ══════════════════════════════════════════════════════
        # Phase 2.b: Refine — 改进
        # ══════════════════════════════════════════════════════
        print(f"\n{'█'*65}")
        print(f"  PHASE 2.{rnd}b: REFINE — 根据 Critic 反馈改进")
        print(f"  (Actor-Refine 独立上下文, 只看到: 任务 + 旧版本 + Critic 问题)")
        print(f"{'█'*65}")

        new_content = await refine(task, content, issues)

        # ── 展示改进差异 ──
        print(f"\n  📊 改进统计:")
        print(f"     旧版: {len(content)} 字符")
        print(f"     新版: {len(new_content)} 字符")
        change = len(new_content) - len(content)
        pct = abs(change) / max(len(content), 1) * 100
        direction = "增加" if change > 0 else "减少"
        print(f"     变化: {direction} {abs(change)} 字符 ({pct:.0f}%)")

        # 显示改动的地方
        old_lines = content.split("\n")
        new_lines = new_content.split("\n")
        changed = sum(1 for o, n in zip(old_lines, new_lines) if o != n)
        total = min(len(old_lines), len(new_lines))
        if total > 0:
            print(f"     变动行: {changed}/{total} ({changed/max(total,1)*100:.0f}%)")

        content = new_content
        print(f"  📄 改进版 ({len(content)} 字符): {content[:200]}...")

    return {
        "task": task,
        "final_content": content,
        "iterations": len(history),
        "history": history,
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def main():
    # 难一点的任务——第一版不可能完美
    task = (
        "用 Python 写一个 LRU Cache (最近最少使用缓存), "
        "支持 get(key) 和 put(key, value) 两个操作, 都是 O(1) 时间复杂度。"
        "要求: 设置 capacity 容量上限, 超过上限时淘汰最久未使用的条目。"
        "要求: 线程安全 (使用 threading.Lock)。"
        "要求: 包含类型注解、docstring、边界处理、"
        "以及 if __name__=='__main__' 的测试代码。"
    )

    result = await reflection(task, max_iter=3)

    print(f"\n{'═'*65}")
    print(f"  🏁 Reflection 流程完成 ({result['iterations']} 轮迭代)")
    print(f"{'═'*65}")

    # 展示演进过程
    for h in result["history"]:
        r = h["review"]
        print(f"\n  第 {h['round']} 轮: overall={r.get('overall')}/10, "
              f"issues={len(r.get('issues',[]))}, pass={r.get('pass')}")

    print(f"\n{'─'*65}")
    print(f"  📦 最终交付:")
    print(f"{'─'*65}")
    print(result["final_content"])


if __name__ == "__main__":
    asyncio.run(main())

```

## 输出结果
```plain
═════════════════════════════════════════════════════════════════
  🎯 任务: 用 Python 写一个 LRU Cache (最近最少使用缓存), 支持 get(key) 和 put(key, value) 两个操作, 都是 O(1) 时间复杂度。要求: 设...
  🔁 最多 3 轮迭代 | 通过线: 8/10
  📐 Critic 策略: 严格模式, 每轮至少挑 3 个问题
═════════════════════════════════════════════════════════════════

█████████████████████████████████████████████████████████████████
  PHASE 1: GENERATE — 生成初版
  (Actor 独立上下文, 只看任务描述)
█████████████████████████████████████████████████████████████████
  📄 初版 (4344 字符)

█████████████████████████████████████████████████████████████████
  PHASE 2.1a: CRITIC — 第 1 次评审
  (Critic 独立上下文, 只看到: 任务 + 当前版本)
█████████████████████████████████████████████████████████████████

  ┌── 评分卡 ──────────────────────────────┐
  │ 🟢 正确性        │ █████████░ │ 9/10 │
  │ 🟡 完整性        │ ███████░░░ │ 7/10 │
  │ 🟢 可读性        │ █████████░ │ 9/10 │
  │ 🟢 边界处理       │ █████████░ │ 9/10 │
  │ 🟢 性能         │ █████████░ │ 9/10 │
  ├─────────────────────────────────────────┤
  │ 综合评分       │ ⭐⭐⭐⭐⭐⭐⭐⭐ │ 8/10 │
  └─────────────────────────────────────────┘

  🔴 Critic 发现了 3 个问题:
     1. 虚拟头尾节点使用 `cast(K, None)` 和 `cast(V, None)` 强制绕过类型检查，哨兵节点的 key/value 实际为 None，这与泛型 K、V 可能为不可为 None 的类
     2. `_add_node` 和 `_remove_node` 方法中通过 `# type: ignore[union-attr]` 屏蔽了 `prev` 和 `next` 可能为 `None` 的警告，虽
     3. 代码声明为线程安全，但未提供任何并发测试用例（如多线程下的竞争条件验证），无法证明其在真实并发场景下的正确性，完整性不足。

  🟢 优点: 结构清晰，使用 `__slots__` 减少内存开销，双向链表 + 哈希表实现保证 O(1) 操作，带有完整的类型注解与 docstring，基本功能测试覆盖较好。

█████████████████████████████████████████████████████████████████
  PHASE 2.1b: REFINE — 根据 Critic 反馈改进
  (Actor-Refine 独立上下文, 只看到: 任务 + 旧版本 + Critic 问题)
█████████████████████████████████████████████████████████████████

  📊 改进统计:
     旧版: 4344 字符
     新版: 7001 字符
     变化: 增加 2657 字符 (61%)
     变动行: 152/158 (96%)
  📄 改进版 (7001 字符): ```python
from threading import Lock, Thread
from typing import TypeVar, Generic, Optional, Dict, Any
import time
import random

K = TypeVar('K')
V = TypeVar('V')


class _LinkedListNode:
    """双向链表的...

█████████████████████████████████████████████████████████████████
  PHASE 2.2a: CRITIC — 第 2 次评审
  (Critic 独立上下文, 只看到: 任务 + 当前版本)
█████████████████████████████████████████████████████████████████

  ┌── 评分卡 ──────────────────────────────┐
  │ 🟢 正确性        │ █████████░ │ 9/10 │
  │ 🟢 完整性        │ ████████░░ │ 8/10 │
  │ 🟢 可读性        │ █████████░ │ 9/10 │
  │ 🟢 边界处理       │ ████████░░ │ 8/10 │
  │ 🟢 性能         │ █████████░ │ 9/10 │
  ├─────────────────────────────────────────┤
  │ 综合评分       │ ⭐⭐⭐⭐⭐⭐⭐⭐ │ 8/10 │
  └─────────────────────────────────────────┘

  🔴 Critic 发现了 3 个问题:
     1. 并发测试的验证逻辑存在缺陷：`latest_values` 的更新与缓存写入未原子化，可能因写入顺序导致预期值不一致的误报，无法可靠证明线程安全性。
     2. 内部方法（如 _pop_tail、_add_node）使用 `assert` 进行关键状态检查，但在生产环境（`-O` 优化模式）下可能被禁用，一旦异常调用会隐藏错误并导致不可预期的行为，建议改用显式
     3. `_pop_tail` 返回并移除节点后，未清理其 `prev` 和 `next` 引用，可能保留不必要的对象引用链，略微影响垃圾回收效率。

  🟢 优点: 架构清晰：利用哑头尾节点简化双向链表操作，锁的实现正确且紧凑，类型注解与文档完整，基本功能测试覆盖良好。

█████████████████████████████████████████████████████████████████
  PHASE 2.2b: REFINE — 根据 Critic 反馈改进
  (Actor-Refine 独立上下文, 只看到: 任务 + 旧版本 + Critic 问题)
█████████████████████████████████████████████████████████████████

  📊 改进统计:
     旧版: 7001 字符
     新版: 7319 字符
     变化: 增加 318 字符 (5%)
     变动行: 186/245 (76%)
  📄 改进版 (7319 字符): ```python
from threading import Lock, Thread
from typing import TypeVar, Generic, Optional, Dict
import time
import random

K = TypeVar('K')
V = TypeVar('V')


class _LinkedListNode:
    """双向链表的基类节点，...

█████████████████████████████████████████████████████████████████
  PHASE 2.3a: CRITIC — 第 3 次评审
  (Critic 独立上下文, 只看到: 任务 + 当前版本)
█████████████████████████████████████████████████████████████████

  ┌── 评分卡 ──────────────────────────────┐
  │ 🟡 正确性        │ ███████░░░ │ 7/10 │
  │ 🟢 完整性        │ ████████░░ │ 8/10 │
  │ 🟢 可读性        │ ████████░░ │ 8/10 │
  │ 🟡 边界处理       │ ███████░░░ │ 7/10 │
  │ 🟢 性能         │ █████████░ │ 9/10 │
  ├─────────────────────────────────────────┤
  │ 综合评分       │ ⭐⭐⭐⭐⭐⭐⭐ │ 7/10 │
  └─────────────────────────────────────────┘

  🔴 Critic 发现了 3 个问题:
     1. get 方法在键不存在时返回 None，当缓存中合法存储 None 值时无法区分'不存在'与'值为 None'，构成边界设计缺陷。建议抛出 KeyError 或使用特殊哨兵对象。
     2. 并发测试中的一致性检查存在竞态条件：latest_values 的递增与 put 操作未原子化，导致 expected 值可能并非最后实际写入的值，测试可能产生假阳性或假阴性。需要重新设计验证逻辑。
     3. 测试代码直接访问 cache_concurrent._lock 和 ._cache，暴露了私有实现细节，破坏封装性并增加维护风险。应通过公开接口（如 __len__）或提供专门的调试方法进行状态检查。

  🟢 优点: 双向链表 + 哈希表实现标准 O(1) 操作，__slots__ 优化内存，线程安全锁粒度合理，类型注解与 docstring 完善。

  ⚠️ 达到最大迭代次数 (3)

═════════════════════════════════════════════════════════════════
  🏁 Reflection 流程完成 (3 轮迭代)
═════════════════════════════════════════════════════════════════

  第 1 轮: overall=8/10, issues=3, pass=False

  第 2 轮: overall=8/10, issues=3, pass=False

  第 3 轮: overall=7/10, issues=3, pass=False

─────────────────────────────────────────────────────────────────
  📦 最终交付:
─────────────────────────────────────────────────────────────────
```python
from threading import Lock, Thread
from typing import TypeVar, Generic, Optional, Dict
import time
import random

K = TypeVar('K')
V = TypeVar('V')


class _LinkedListNode:
    """双向链表的基类节点，只包含前后指针，不存储键值对。"""
    __slots__ = ('prev', 'next')

    def __init__(self) -> None:
        self.prev: Optional['_LinkedListNode'] = None
        self.next: Optional['_LinkedListNode'] = None


class _Node(Generic[K, V], _LinkedListNode):
    """继承自 _LinkedListNode，额外存储键值对，用于实际缓存条目。"""
    __slots__ = ('key', 'value')

    def __init__(self, key: K, value: V) -> None:
        super().__init__()
        self.key: K = key
        self.value: V = value


class LRUCache(Generic[K, V]):
    """线程安全的 LRU (最近最少使用) 缓存。

    使用哈希表 + 双向链表实现 get 和 put 的时间复杂度均为 O(1)。
    当缓存达到容量上限时，自动淘汰最久未使用的条目。

    Args:
        capacity: 缓存容量，必须为正整数。
    """

    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be a positive integer")
        self._capacity: int = capacity
        self._cache: Dict[K, _Node[K, V]] = {}
        self._lock: Lock = Lock()

        # 虚拟头尾节点简化边界操作，它们不存储任何键值对
        self._head: _LinkedListNode = _LinkedListNode()
        self._tail: _LinkedListNode = _LinkedListNode()
        self._head.next = self._tail
        self._tail.prev = self._head

    # ------------------------------------------------------------------
    # 内部方法：调用前必须已持有 self._lock
    # ------------------------------------------------------------------

    def _add_node(self, node: _Node[K, V]) -> None:
        """将节点添加到链表头部（最近使用的位置）。"""
        if self._head.next is None:
            raise RuntimeError("corrupted list: head.next is None")
        next_node = self._head.next
        node.prev = self._head
        node.next = next_node
        next_node.prev = node
        self._head.next = node

    def _remove_node(self, node: _Node[K, V]) -> None:
        """从链表中移除节点。"""
        prev_node = node.prev
        next_node = node.next
        if prev_node is None or next_node is None:
            raise RuntimeError("corrupted list: node has None neighbor")
        prev_node.next = next_node
        next_node.prev = prev_node

    def _move_to_head(self, node: _Node[K, V]) -> None:
        """将已存在的节点移动到链表头部。"""
        self._remove_node(node)
        self._add_node(node)

    def _pop_tail(self) -> _Node[K, V]:
        """弹出链表尾部节点（最久未使用），并返回。"""
        tail = self._tail.prev
        if not isinstance(tail, _Node):
            raise RuntimeError("trying to pop from empty list")
        self._remove_node(tail)
        # 清理对外引用，便于垃圾回收
        tail.prev = None
        tail.next = None
        return tail

    # ------------------------------------------------------------------
    # 公开接口
    # ------------------------------------------------------------------

    def get(self, key: K) -> Optional[V]:
        """获取键对应的值。

        如果键存在，将其标记为最近使用并返回值；否则返回 None。

        Args:
            key: 查询的键。

        Returns:
            键对应的值，不存在时返回 None。
        """
        with self._lock:
            node = self._cache.get(key)
            if node is None:
                return None
            self._move_to_head(node)
            return node.value

    def put(self, key: K, value: V) -> None:
        """插入或更新键值对。

        若键已存在，更新其值并标记为最近使用；否则创建新条目。
        当超过容量上限时，淘汰最久未使用的条目。

        Args:
            key: 键。
            value: 值。
        """
        with self._lock:
            node = self._cache.get(key)
            if node is not None:
                # 更新已有节点
                node.value = value
                self._move_to_head(node)
                return

            # 创建新节点并添加到头部
            new_node = _Node(key, value)
            self._cache[key] = new_node
            self._add_node(new_node)

            if len(self._cache) > self._capacity:
                # 淘汰最久未使用的节点
                tail = self._pop_tail()
                del self._cache[tail.key]


if __name__ == '__main__':
    # ------------------------------------------------------------------
    # 基本功能测试
    # ------------------------------------------------------------------
    print("Running basic tests...")
    cache: LRUCache[int, str] = LRUCache(2)

    cache.put(1, "one")
    cache.put(2, "two")
    assert cache.get(1) == "one"   # 命中，1 变为最近使用

    cache.put(3, "three")          # 容量超限，淘汰最久未使用的键 2
    assert cache.get(2) is None
    assert cache.get(3) == "three"
    assert cache.get(1) == "one"

    cache.put(4, "four")           # 淘汰键 3
    assert cache.get(3) is None
    assert cache.get(1) == "one"
    assert cache.get(4) == "four"

    # 更新测试
    cache.put(1, "ONE")            # 更新键 1
    assert cache.get(1) == "ONE"

    # 边界测试：容量为 1
    single: LRUCache[str, int] = LRUCache(1)
    single.put("a", 100)
    assert single.get("a") == 100
    single.put("b", 200)           # 淘汰 "a"
    assert single.get("a") is None
    assert single.get("b") == 200

    # 边界测试：非法容量
    try:
        LRUCache(0)
    except ValueError:
        pass
    else:
        assert False, "Should raise ValueError for capacity <= 0"

    print("Basic tests passed.")

    # ------------------------------------------------------------------
    # 并发正确性测试
    # ------------------------------------------------------------------
    print("Running concurrency tests...")
    capacity = 5
    cache_concurrent = LRUCache[int, int](capacity)

    # 记录每个键被最后写入的值（线程安全）
    latest_values: Dict[int, int] = {}
    latest_lock = Lock()

    def writer_thread(thread_id: int, num_ops: int) -> None:
        """随机选择某个键写入递增的序列值。"""
        rng = random.Random(thread_id)
        for _ in range(num_ops):
            key = rng.randint(0, 9)
            with latest_lock:
                new_value = latest_values.get(key, 0) + 1
                latest_values[key] = new_value
            cache_concurrent.put(key, new_value)
            time.sleep(0.0001)

    def reader_thread(thread_id: int, num_ops: int) -> None:
        """随机读取键，仅检查是否抛出异常（不校验具体值）。"""
        rng = random.Random(thread_id)
        for _ in range(num_ops):
            key = rng.randint(0, 9)
            # 只读取，不做额外断言，依靠最终一致性检查
            _ = cache_concurrent.get(key)
            time.sleep(0.0001)

    # 启动多个 writer 和 reader 线程
    threads = []
    num_writers = 4
    num_readers = 4
    ops_per_thread = 500

    for i in range(num_writers):
        t = Thread(target=writer_thread, args=(i, ops_per_thread))
        threads.append(t)
    for i in range(num_readers):
        t = Thread(target=reader_thread, args=(i + num_writers, ops_per_thread))
        threads.append(t)

    for t in threads:
        t.start()
    for t in threads:
        t.join()

    # 验证最终一致性：缓存中的所有条目必须与 latest_values 一致
    with cache_concurrent._lock:
        for key, node in cache_concurrent._cache.items():
            expected = latest_values.get(key)
            if expected is not None and node.value != expected:
                raise AssertionError(
                    f"Inconsistency: key={key}, cache value={node.value}, expected={expected}"
                )
        # 验证容量没有超出
        assert len(cache_concurrent._cache) <= capacity, \
            f"Cache size {len(cache_concurrent._cache)} exceeds capacity {capacity}"

    print("Concurrency tests passed.")
    print("All tests passed.")
```
```

# Multi-Agent
多 Agent 进行协作，当一个任务过于复杂，超过了单个大模型，即使有了规划反思依然力不从心，而且执行很多任务容易上下文爆炸，那么为了解决上下文爆炸的问题提出了 Multi-Agent 范式，使用多智能体协作，把不同的任务分给不同的专家 Agent 分工完成任务

## Multi-Agent 三种协作形态流程
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1783441503436-6126921b-86bf-491e-aa3c-4a825145c0e5.png)

### 指挥官-工人模式
+ 核心特点：有一个总指挥官拥有最高决策全，负责理解任务拆分给工人，每个工人进行自己擅长的具体子任务，不参与全局决策
+ 典型案例：一个软件开发团队，指挥官是产品经理，工人分别是前端工程师、后端工程师、测试工程师等。

### 流水线模式
+ 核心特点：任务被完全拆分为多个连续的 Agent 专门负责，单向流动
+ 典型案例：一个内容生产流水线：选题 Agent → 写作 Agent → 编辑 Agent → 排版 Agent → 发布 Agent。

### 圆桌讨论
+ <font style="color:rgb(0, 0, 0);">核心特点：所有 Agent 地位平等，没有中央决策者。它们通过轮流发言、交换信息、提出观点、互相辩论的方式，共同探索问题的解决方案，最终通过投票或共识来做出决策。</font>
+ <font style="color:rgb(0, 0, 0);">典型案例：一个战略决策团队，包括市场分析师 Agent、技术专家 Agent、财务专家 Agent、风险评估 Agent。</font>

## 优缺点
优点：

+ 能力边界扩展及其强大：弱化了单个 Agent 心智负担，能搞定大型项目
+ 专业化程度高：每个 Agent 都有自己擅长的领域
+ 上下文隔离：每个 Agent 维护自己的上下文
+ 可扩展性好：可以通过增加 Agent 的数量提升系统的能力
+ 支持并执行：多个独立的子任务可以独立进行，大大提升效率

缺点：

+ 复杂度提升：系统设计和调试难度大大增加
+ 通信成本高：Agent 之间的通信需要消耗大量资源
+ 可能存在冲突：不同的 Agent 之间可能存在不同的意见或者冲突，同时修改一个文件出矛盾

适用场景：软件开发、企业级项目管理、复杂市场调研等需要分工协作的超复杂任务。

## Demo & 输出
### 流水线模式
```python
"""
Multi-Agent Demo 1: 流水线 (Pipeline)
Agent 各自独立上下文，输出单向传递，形成装配线。

流程:
    [PO:独立ctx] → 📋需求规格 → [Arch:独立ctx] → 🏗️设计方案 → [Dev:独立ctx] → 💻代码 → [QA:独立ctx] → 🧪测试报告

特点:
    - 每个 Agent 有自己独立的 messages 列表
    - 前一个 Agent 的输出作为后一个 Agent 的 user 输入
    - Agent 之间互不知道对方的存在
    - 适合: 需求明确、流程固定的项目

用法:
    python 04a_pipeline.py
"""

import asyncio, json
from openai import AsyncOpenAI

client = AsyncOpenAI(base_url="https://api.deepseek.com/",
                     api_key="sk-xxx")
MODEL = "deepseek-v4-pro"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Agent: 每个实例有独立上下文
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Agent:
    """独立的 Agent——每次调用都新建 messages，不共享历史"""

    def __init__(self, name: str, emoji: str, system_prompt: str, temp: float = 0.3):
        self.name = name
        self.emoji = emoji
        self.system_prompt = system_prompt
        self.temp = temp

    async def execute(self, task: str, input_from_prev: str = "") -> str:
        """每次执行都是全新上下文：只看到自己的 system + 本次任务"""
        messages = [{"role": "system", "content": self.system_prompt}]
        if input_from_prev:
            messages.append({"role": "user", "content": f"## 任务\n{task}\n\n## 上游交付物\n{input_from_prev}"})
        else:
            messages.append({"role": "user", "content": f"## 任务\n{task}"})

        print(f"\n  ┌─ {self.emoji} {self.name}: 独立上下文 (只看 system + 上游输出) ──┐")
        print(f"  │ 上下文大小: {len(messages)} 条 (system ×1 + 上游输出 ×{1 if input_from_prev else 0})")

        r = await client.chat.completions.create(model=MODEL, messages=messages, temperature=self.temp)
        result = r.choices[0].message.content or ""

        print(f"  │ 输出: {result[:200].replace(chr(10),' ')}...")
        print(f"  └──────────────────────────────────────────────────────────┘")
        return result


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 四位 Agent 角色
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PO = Agent("产品经理", "📋",
           """你是产品经理。把用户模糊需求转为精确的需求规格。
输出: 功能描述 / 输入输出规范 / 验收标准(含测试用例) / 边界条件。
用中文。""", 0.5)

ARCH = Agent("架构师", "🏗️",
             """你是架构师。根据需求规格做技术设计。
输出: 数据结构选择 / 算法步骤 / 复杂度分析 / 模块接口定义。
用中文。""", 0.3)

DEV = Agent("开发工程师", "💻",
            """你是 Python 开发。根据需求和架构设计写代码。
输出: 完整 Python 代码，含类型注解、docstring、中文注释、边界处理、if __name__=="__main__" 测试。
命名用英文，注释用中文。""", 0.2)

QA = Agent("测试工程师", "🧪",
           """你是 QA。根据需求审查代码。
输出: 测试报告表格(TC-ID | 输入 | 预期 | 实际 | ✅/❌)、代码质量评分(1-10)、发现的 bug。
用中文。""", 0.2)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 流水线
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def pipeline(requirement: str):
    print(f"\n{'═'*60}")
    print(f"  🏭 流水线模式: PO → Arch → Dev → QA")
    print(f"  📋 需求: {requirement}")
    print(f"{'═'*60}")
    print(f"  每个 Agent 有独立上下文, 只能看到上游交付物\n")

    # Stage 1: PO — 独立上下文, 只有 system + 用户需求
    print(f"  ╔══ Stage 1: PO 分析需求 ═══════════════════════════════╗")
    po_out = await PO.execute(requirement)
    print(f"  ╚═══════════════════════════════════════════════════════╝")

    # Stage 2: Architect — 独立上下文, 只有 system + 需求 + PO输出
    print(f"\n  ╔══ Stage 2: Architect 技术设计 ════════════════════════╗")
    arch_out = await ARCH.execute(requirement, po_out)
    print(f"  ╚═══════════════════════════════════════════════════════╝")

    # Stage 3: Dev — 独立上下文, 只有 system + 需求 + PO+Arch输出
    print(f"\n  ╔══ Stage 3: Dev 编写代码 ══════════════════════════════╗")
    dev_in = f"## 需求规格\n{po_out}\n\n## 技术方案\n{arch_out}"
    dev_out = await DEV.execute(requirement, dev_in)
    print(f"  ╚═══════════════════════════════════════════════════════╝")

    # Stage 4: QA — 独立上下文, 只有 system + 需求规格 + 代码
    print(f"\n  ╔══ Stage 4: QA 测试审查 ═══════════════════════════════╗")
    qa_in = f"## 需求规格\n{po_out}\n\n## 代码\n{dev_out}"
    qa_out = await QA.execute(requirement, qa_in)
    print(f"  ╚═══════════════════════════════════════════════════════╝")

    return {"PO需求": po_out, "架构设计": arch_out, "代码": dev_out, "测试报告": qa_out}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def main():
    result = await pipeline(
        "实现一个函数 merge_intervals(intervals: list[list[int]]) -> list[list[int]], "
        "合并所有重叠的区间。例如 [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]。"
        "输入区间不一定排序。边界: 空列表、单个区间、完全包含关系。"
    )

    print(f"\n{'═'*60}")
    print(f"  📦 交付物")
    print(f"{'═'*60}")
    for k, v in result.items():
        print(f"\n{'─'*60}\n  [{k}]\n{'─'*60}\n{v}")

if __name__ == "__main__":
    asyncio.run(main())

```

输出

```plain
════════════════════════════════════════════════════════════
  🏭 流水线模式: PO → Arch → Dev → QA
  📋 需求: 实现一个函数 merge_intervals(intervals: list[list[int]]) -> list[list[int]], 合并所有重叠的区间。例如 [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]。输入区间不一定排序。边界: 空列表、单个区间、完全包含关系。
════════════════════════════════════════════════════════════
  每个 Agent 有独立上下文, 只能看到上游交付物

  ╔══ Stage 1: PO 分析需求 ═══════════════════════════════╗

  ┌─ 📋 产品经理: 独立上下文 (只看 system + 上游输出) ──┐
  │ 上下文大小: 2 条 (system ×1 + 上游输出 ×0)
  │ 输出: ## 功能描述 `merge_intervals` 函数用于合并一组给定闭区间中的所有重叠区间。区间采用闭区间表示，即每个区间包含其起始点和结束点。当两个区间存在重叠（包括端点接触）时，将它们合并为一个更大的区间。最终返回不重叠的区间列表，按起始点升序排列。  ## 输入规范 - **参数名**：`intervals` - **类型**：`List[List[int]]`，即整数列表的列表。 - ...
  └──────────────────────────────────────────────────────────┘
  ╚═══════════════════════════════════════════════════════╝

  ╔══ Stage 2: Architect 技术设计 ════════════════════════╗

  ┌─ 🏗️ 架构师: 独立上下文 (只看 system + 上游输出) ──┐
  │ 上下文大小: 2 条 (system ×1 + 上游输出 ×1)
  │ 输出: 以下是 `merge_intervals` 函数的技术设计方案，从数据结构、算法步骤、复杂度到接口定义进行了完整规划，可直接作为编码前的技术依据。  ---  ## 1. 数据结构选择  - **输入表示**     输入参数 `intervals` 为 `List[List[int]]`，其中每个内层列表是一个闭区间 `[start, end]`。我们直接使用该类型，不引入自定义类，降低耦合。 ...
  └──────────────────────────────────────────────────────────┘
  ╚═══════════════════════════════════════════════════════╝

  ╔══ Stage 3: Dev 编写代码 ══════════════════════════════╗

  ┌─ 💻 开发工程师: 独立上下文 (只看 system + 上游输出) ──┐
  │ 上下文大小: 2 条 (system ×1 + 上游输出 ×1)
  │ 输出: ```python from typing import List  def merge_intervals(intervals: List[List[int]]) -> List[List[int]]:     """     合并所有重叠的闭区间，返回按起点升序的不重叠区间列表。      区间包含端点，相邻且端点接触的两个区间（如 [1,2] 和 [2,4]）将被合并。     输入区间未排...
  └──────────────────────────────────────────────────────────┘
  ╚═══════════════════════════════════════════════════════╝

  ╔══ Stage 4: QA 测试审查 ═══════════════════════════════╗

  ┌─ 🧪 测试工程师: 独立上下文 (只看 system + 上游输出) ──┐
  │ 上下文大小: 2 条 (system ×1 + 上游输出 ×1)
  │ 输出: 测试报告表格：  | TC-ID | 输入 | 预期 | 实际（基于代码逻辑） | ✅/❌ | |--------|------|------|----------------------|-------| | TC01 | `[[1,3],[2,6],[8,10],[15,18]]` | `[[1,6],[8,10],[15,18]]` | `[[1,6],[8,10],[15,18]]` | ...
  └──────────────────────────────────────────────────────────┘
  ╚═══════════════════════════════════════════════════════╝

════════════════════════════════════════════════════════════
  📦 交付物
════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────
  [PO需求]
────────────────────────────────────────────────────────────
## 功能描述
`merge_intervals` 函数用于合并一组给定闭区间中的所有重叠区间。区间采用闭区间表示，即每个区间包含其起始点和结束点。当两个区间存在重叠（包括端点接触）时，将它们合并为一个更大的区间。最终返回不重叠的区间列表，按起始点升序排列。

## 输入规范
- **参数名**：`intervals`
- **类型**：`List[List[int]]`，即整数列表的列表。
- **内层列表约束**：每个内层列表必须恰好包含两个整数 `[start, end]`，且满足 `start <= end`。
- **输入合法性假设**：假定调用方传入的 `intervals` 始终符合上述格式，不包含非整数、长度异常或 `start > end` 的情况。若传入非法参数，行为未定义（实现可不做校验，或自由选择抛出异常，此规格不作要求）。
- **排序要求**：输入的区间 **不一定按起始位置排序**，函数需在内部处理排序逻辑。

## 输出规范
- **类型**：`List[List[int]]`
- **内容**：合并后的、互不重叠的区间列表。
- **顺序**：所有区间按起始点 `start` 严格升序排列。
- **区间定义**：每个输出区间 `[start, end]` 同样满足 `start <= end`。
- **重叠判定标准**：两个区间 `[a, b]` 和 `[c, d]` 视为重叠（可合并）的充分必要条件是 `max(a, c) <= min(b, d)`。该条件包含端点恰好相接的情况（例如 `[1,2]` 与 `[2,4]` 将被合并为 `[1,4]`）。

## 验收标准（含测试用例）
以下测试用例均须通过：

| 用例编号 | 场景描述 | 输入 `intervals` | 期望输出 |
|----------|----------|------------------|----------|
| TC01 | 常规部分重叠 | `[[1,3],[2,6],[8,10],[15,18]]` | `[[1,6],[8,10],[15,18]]` |
| TC02 | 空列表 | `[]` | `[]` |
| TC03 | 单个区间 | `[[1,4]]` | `[[1,4]]` |
| TC04 | 完全包含（一个区间完全在另一个内部） | `[[1,4],[2,3]]` | `[[1,4]]` |
| TC05 | 多层嵌套包含 | `[[1,10],[2,6],[3,4],[8,10]]` | `[[1,10]]` |
| TC06 | 无重叠区间 | `[[1,2],[3,4]]` | `[[1,2],[3,4]]` |
| TC07 | 端点接触（应合并） | `[[1,2],[2,4]]` | `[[1,4]]` |
| TC08 | 输入未排序 | `[[5,6],[1,3],[2,4]]` | `[[1,4],[5,6]]` |
| TC09 | 所有区间相同（退化为点） | `[[1,1],[1,1]]` | `[[1,1]]` |
| TC10 | 大区间延伸覆盖多个小区间 | `[[1,5],[6,8],[2,7]]` | `[[1,8]]` |
| TC11 | 端点接触且未排序 | `[[2,4],[1,2]]` | `[[1,4]]` |
| TC12 | 多段不连续合并 | `[[1,3],[4,6],[5,8],[10,12]]` | `[[1,3],[4,8],[10,12]]` |

## 边界条件
1. **空输入**：`intervals` 为空列表时，返回空列表 `[]`。
2. **单元素列表**：只有一个区间时，直接返回该区间（包装在列表中）。
3. **极端包含**：存在一个区间完全覆盖其他所有区间，输出仅包含该最大区间。
4. **完全不相交**：所有区间互不接触、无重叠，输出保持原区间集合（但需排序）。
5. **端点边界**：区间的起始值等于另一区间的结束值（如 `[1,2]` 与 `[2,5]`）必须合并为 `[1,5]`。
6. **大整数与小整数**：区间范围可以是任意整数（包括负数），函数应正确处理。
7. **输入可能已经有序**：实现不能依赖于输入无序的前提，但若输入已排序，也不应出错。
8. **性能边界**：不强制要求特定时间复杂度，但通常期望 O(n log n) 时间（因需要排序）与 O(n) 额外空间（存储结果）。对于非常大的 n（如 10^6），内存与时间应可接受。

────────────────────────────────────────────────────────────
  [架构设计]
────────────────────────────────────────────────────────────
以下是 `merge_intervals` 函数的技术设计方案，从数据结构、算法步骤、复杂度到接口定义进行了完整规划，可直接作为编码前的技术依据。

---

## 1. 数据结构选择

- **输入表示**  
  输入参数 `intervals` 为 `List[List[int]]`，其中每个内层列表是一个闭区间 `[start, end]`。我们直接使用该类型，不引入自定义类，降低耦合。

- **排序数据**  
  函数不修改外部传入的列表，因此使用内置 `sorted()` 生成一个按区间起点排序的新列表 `sorted_intervals`，类型仍为 `List[List[int]]`。排序依据是每个区间的第一个元素（起点），若起点相同，默认按第二个元素（终点）升序排列。

- **结果集**  
  使用 `merged: List[List[int]]` 存储合并后的不重叠区间。每个元素仍然是 `[start, end]` 的列表。

- **遍历时指针**  
  仅需维护当前正在合并的最后一个区间（通过 `merged[-1]` 访问），无需额外的数据结构。

---

## 2. 算法步骤

1. **边界处理**  
   - 若 `intervals` 为空列表，直接返回 `[]`。  
   - 输入本身符合规范（所有区间 `start <= end`），函数不做额外校验。

2. **排序**  
   - 调用 `sorted(intervals, key=lambda x: x[0])` 生成按起点升序排列的新列表。  
   - 由于 Python 列表默认键比较在首元素相同时会继续比较第二个元素，等价于按 `(start, end)` 升序排序。这一顺序足以覆盖包含关系场景（如 `[1,4]` 会排在 `[2,3]` 之前，合并时取 `max` 即可保留大区间）。

3. **初始化结果集**  
   - 创建空列表 `merged = []`。

4. **遍历合并**  
   对排序后的每个区间 `[start, end]` 执行：
   - **无重叠**：如果 `merged` 为空，或者 `merged[-1][1] < start`（当前区间的起点严格大于前一个区间终点），则视为与已有区间不重叠或不相连，直接将该区间追加到 `merged`。
   - **有重叠或接触**：否则（`start <= merged[-1][1]`，包括端点贴合），合并区间。  
     将 `merged[-1][1]` 更新为 `max(merged[-1][1], end)`，从而实现扩大区间，并自动处理完全包含关系（如 `[1,4]` 和 `[2,3]` 合并后终点保持 `4`）。

5. **返回**  
   - 返回 `merged`，此时列表已按起点升序且互不重叠。

**伪代码**：
```python
def merge_intervals(intervals):
    if not intervals:
        return []
    sorted_intervals = sorted(intervals, key=lambda x: x[0])
    merged = []
    for start, end in sorted_intervals:
        if not merged or merged[-1][1] < start:
            merged.append([start, end])
        else:
            merged[-1][1] = max(merged[-1][1], end)
    return merged
```

---

## 3. 复杂度分析

- **时间复杂度**  
  - 排序：`O(n log n)`，n 为区间数量。  
  - 遍历合并：`O(n)`，每个区间仅被访问一次。  
  - 总体：**`O(n log n)`**，瓶颈在于排序。

- **空间复杂度**  
  - `sorted_intervals`：需要 `O(n)` 额外空间存储排序后的区间列表（不修改原输入）。  
  - `merged`：最坏情况下所有区间都不重叠，需要 `O(n)` 空间存储结果。  
  - 排序算法内部（Timsort）需要 `O(log n)` 的栈空间。  
  - 总体额外空间：**`O(n)`**。

若允许修改原始输入，可以原地排序（`intervals.sort(...)`），省去 `sorted_intervals` 的分配，但会改变外部列表。本设计选择不可变式，保障函数无副作用。

---

## 4. 模块接口定义

### 函数签名
```python
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    """合并所有重叠的闭区间，返回按起点升序的不重叠区间列表。

    区间包含端点，相邻且端点接触的两个区间（如 [1,2] 和 [2,4]）将被合并。
    输入区间未排序，输出保证排序。

    Args:
        intervals: 二维整数列表，每个元素为 [start, end]，满足 start <= end。
                   列表可为空。假定输入始终合法，未提供校验。

    Returns:
        List[List[int]]: 合并后的不重叠区间列表，按起点严格升序排列。
                         若输入为空，返回空列表。

    Raises:
        None: 基于约定，不对非法输入进行验证。

    Examples:
        >>> merge_intervals([[1,3],[2,6],[8,10],[15,18]])
        [[1,6],[8,10],[15,18]]

        >>> merge_intervals([[1,2],[2,4]])
        [[1,4]]

        >>> merge_intervals([])
        []
    """
```

### 参数与返回值约束
- **输入**：  
  `intervals` 类型为 `List[List[int]]`，每个子列表长度固定为 2，且 `start <= end`。  
- **输出**：  
  类型同输入，所有区间互不重叠，按 `start` 升序。若输入非空，结果列表非空。

### 模块依赖性
该函数为纯函数，无外部依赖，可独立放在工具模块（如 `interval_utils.py`）中。

### 测试兼容性
设计完全满足验收标准中提供的 12 条用例，覆盖空输入、单区间、包含、端点贴合、未排序、多段合并等所有场景。

---

本设计在保证正确性和可读性的前提下，达到了 `O(n log n)` 的时间下界，并采用防御式拷贝避免修改输入，符合通用函数的健壮性要求。

────────────────────────────────────────────────────────────
  [代码]
────────────────────────────────────────────────────────────
```python
from typing import List

def merge_intervals(intervals: List[List[int]]) -> List[List[int]]:
    """
    合并所有重叠的闭区间，返回按起点升序的不重叠区间列表。

    区间包含端点，相邻且端点接触的两个区间（如 [1,2] 和 [2,4]）将被合并。
    输入区间未排序，输出保证排序。

    Args:
        intervals: 二维整数列表，每个元素为 [start, end]，满足 start <= end。
                   列表可为空。假定输入始终合法，未提供校验。

    Returns:
        List[List[int]]: 合并后的不重叠区间列表，按起点严格升序排列。
                         若输入为空，返回空列表。

    Examples:
        >>> merge_intervals([[1,3],[2,6],[8,10],[15,18]])
        [[1,6],[8,10],[15,18]]

        >>> merge_intervals([[1,2],[2,4]])
        [[1,4]]

        >>> merge_intervals([])
        []
    """
    # 边界处理：空输入直接返回空列表
    if not intervals:
        return []

    # 按区间起点升序排序，若起点相同则按终点升序（Python默认行为）
    # 不修改原输入，使用sorted生成新列表
    sorted_intervals = sorted(intervals, key=lambda x: x[0])

    # 初始化合并结果列表
    merged: List[List[int]] = []

    # 遍历排序后的区间
    for start, end in sorted_intervals:
        # 如果结果为空，或当前区间起点严格大于前一个合并区间的终点（无重叠、不接触）
        if not merged or merged[-1][1] < start:
            # 直接添加新区间
            merged.append([start, end])
        else:
            # 有重叠或接触（start <= merged[-1][1]），扩展前一个区间的终点
            merged[-1][1] = max(merged[-1][1], end)

    return merged


if __name__ == "__main__":
    # 验收用例测试（基于需求规格中提供的12条测试用例）
    test_cases = [
        ("TC01 常规部分重叠", [[1,3],[2,6],[8,10],[15,18]], [[1,6],[8,10],[15,18]]),
        ("TC02 空列表", [], []),
        ("TC03 单个区间", [[1,4]], [[1,4]]),
        ("TC04 完全包含", [[1,4],[2,3]], [[1,4]]),
        ("TC05 多层嵌套包含", [[1,10],[2,6],[3,4],[8,10]], [[1,10]]),
        ("TC06 无重叠区间", [[1,2],[3,4]], [[1,2],[3,4]]),
        ("TC07 端点接触（应合并）", [[1,2],[2,4]], [[1,4]]),
        ("TC08 输入未排序", [[5,6],[1,3],[2,4]], [[1,4],[5,6]]),
        ("TC09 所有区间相同（退化为点）", [[1,1],[1,1]], [[1,1]]),
        ("TC10 大区间延伸覆盖多个小区间", [[1,5],[6,8],[2,7]], [[1,8]]),
        ("TC11 端点接触且未排序", [[2,4],[1,2]], [[1,4]]),
        ("TC12 多段不连续合并", [[1,3],[4,6],[5,8],[10,12]], [[1,3],[4,8],[10,12]]),
    ]

    print("开始测试 merge_intervals 函数...\n")
    all_passed = True
    for desc, inp, expected in test_cases:
        result = merge_intervals(inp)
        passed = result == expected
        status = "通过" if passed else "失败"
        if not passed:
            all_passed = False
        print(f"{desc}:")
        print(f"  输入: {inp}")
        print(f"  期望: {expected}")
        print(f"  实际: {result}  -> {status}\n")

    if all_passed:
        print("全部测试用例通过！")
    else:
        print("存在未通过的测试用例。")
```

────────────────────────────────────────────────────────────
  [测试报告]
────────────────────────────────────────────────────────────
测试报告表格：

| TC-ID | 输入 | 预期 | 实际（基于代码逻辑） | ✅/❌ |
|--------|------|------|----------------------|-------|
| TC01 | `[[1,3],[2,6],[8,10],[15,18]]` | `[[1,6],[8,10],[15,18]]` | `[[1,6],[8,10],[15,18]]` | ✅ |
| TC02 | `[]` | `[]` | `[]` | ✅ |
| TC03 | `[[1,4]]` | `[[1,4]]` | `[[1,4]]` | ✅ |
| TC04 | `[[1,4],[2,3]]` | `[[1,4]]` | `[[1,4]]` | ✅ |
| TC05 | `[[1,10],[2,6],[3,4],[8,10]]` | `[[1,10]]` | `[[1,10]]` | ✅ |
| TC06 | `[[1,2],[3,4]]` | `[[1,2],[3,4]]` | `[[1,2],[3,4]]` | ✅ |
| TC07 | `[[1,2],[2,4]]` | `[[1,4]]` | `[[1,4]]` | ✅ |
| TC08 | `[[5,6],[1,3],[2,4]]` | `[[1,4],[5,6]]` | `[[1,4],[5,6]]` | ✅ |
| TC09 | `[[1,1],[1,1]]` | `[[1,1]]` | `[[1,1]]` | ✅ |
| TC10 | `[[1,5],[6,8],[2,7]]` | `[[1,8]]` | `[[1,8]]` | ✅ |
| TC11 | `[[2,4],[1,2]]` | `[[1,4]]` | `[[1,4]]` | ✅ |
| TC12 | `[[1,3],[4,6],[5,8],[10,12]]` | `[[1,3],[4,8],[10,12]]` | `[[1,3],[4,8],[10,12]]` | ✅ |

**代码质量评分：9 / 10**  
- 优点：算法正确（O(n log n) 时间，O(n) 空间），代码简洁、命名清晰，包含完整的文档字符串与类型标注，覆盖了所有需求验收用例。  
- 扣分项：未对 `intervals` 的合法性做任何防御性检查（如 `None`、非列表、内层长度不为 2、`start > end` 等），尽管需求规格声明“可不做校验”，但在实际工程中仍然是一种健壮性缺失。

**发现的 bug**  
- 无明显逻辑错误，代码严格符合需求规格，所有验收用例均可通过。  
- 若需进一步增强，可考虑对 `intervals` 为 `None` 或非法输入提供明确的异常或返回值，但这不是需求强制。
```

### 指挥官模式
```python
"""
Multi-Agent Demo 2: 指挥官模式 (Commander)
一个 Commander 拆解任务 → 分发给多个 Worker 并行执行 → Commander 综合结果。

架构:
                      ┌─ [Worker A: 实现方案1] ─┐
    [Commander: 分析] ─┼─ [Worker B: 实现方案2] ─┼─ [Commander: 裁决综合]
                      └─ [Worker C: 实现方案3] ─┘

特点:
    - Commander 有独立的决策上下文
    - 每个 Worker 有完全独立的上下文, 互相不知道对方存在
    - Worker 之间并行执行
    - 适合: 多方案对比、需要不同角度思考的任务

用法:
    python 04b_commander.py
"""

import asyncio, json
from openai import AsyncOpenAI

client = AsyncOpenAI(base_url="https://api.deepseek.com/",
                     api_key="sk-xxx")
MODEL = "deepseek-v4-pro"


class Agent:
    """独立上下文的 Agent"""
    def __init__(self, name: str, emoji: str, system_prompt: str, temp: float = 0.3):
        self.name = name; self.emoji = emoji; self.system_prompt = system_prompt; self.temp = temp

    async def execute(self, task: str, input_text: str = "") -> str:
        messages = [{"role": "system", "content": self.system_prompt}]
        if input_text:
            messages.append({"role": "user", "content": f"## 任务\n{task}\n\n## 输入\n{input_text}"})
        else:
            messages.append({"role": "user", "content": f"## 任务\n{task}"})

        r = await client.chat.completions.create(model=MODEL, messages=messages, temperature=self.temp)
        result = r.choices[0].message.content or ""
        print(f"  [{self.emoji} {self.name}] 完成 ({len(result)} 字符)")
        return result


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 角色定义
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMMANDER = Agent("指挥官", "🎖️",
"""你是技术指挥官。分析用户需求, 把它拆成 3 个子任务, 分发给 3 个程序员各自独立实现,
然后比较他们的方案, 综合出最优答案。

输出格式:
## 任务拆解
- 子任务1: [描述] → 程序员A
- 子任务2: [描述] → 程序员B
- 子任务3: [描述] → 程序员C

然后逐份评审, 最后综合。用中文。""", 0.5)

WORKER_A = Agent("程序员A (性能优先)", "⚡",
"""你是程序员A。你的风格是性能优先——用最快的数据结构和算法,
即使代码稍长也可以。每次写完整可运行 Python 代码, 含类型注解和测试。用中文注释。""", 0.4)

WORKER_B = Agent("程序员B (简洁优先)", "🎯",
"""你是程序员B。你的风格是简洁优先——用最少的代码行数实现功能,
善用 Python 特性(推导式、内置函数、itertools 等), 但保证可读性。
每次写完整可运行 Python 代码, 含类型注解和测试。用中文注释。""", 0.4)

WORKER_C = Agent("程序员C (安全优先)", "🛡️",
"""你是程序员C。你的风格是安全优先——防御式编程, 充分的输入校验和异常处理,
详细的边界条件覆盖。每次写完整可运行 Python 代码, 含类型注解和测试。用中文注释。""", 0.4)

JUDGE = Agent("评审官", "⚖️",
"""你是评审官。对比 3 个方案, 从正确性、性能、可读性、安全性四个维度打分,
推荐最合适的方案, 并说明为什么。用中文。""", 0.2)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 指挥官模式
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def commander_mode(requirement: str):
    print(f"\n{'═'*60}")
    print(f"  🎖️ 指挥官模式: 1 拆 N → N 并行 → 1 裁决")
    print(f"  📋 需求: {requirement}")
    print(f"{'═'*60}")
    print(f"  每个 Worker 有独立上下文, 互不知晓, 并行执行\n")

    # ── Phase 1: Commander 分析 + 拆解 ──
    print(f"  ╔══ Phase 1: 指挥官拆解任务 ═══════════════════════════╗")
    commander_plan = await COMMANDER.execute(requirement)
    print(f"  ╚═══════════════════════════════════════════════════════╝")

    # ── Phase 2: 3 个 Worker 并行执行 ──
    print(f"\n  ╔══ Phase 2: 3 个程序员并行编码 ═══════════════════════╗")
    print(f"  ║  各自独立上下文, 同时启动                             ║")

    # 每个 Worker 有自己的专属任务描述
    task_a = f"原始需求: {requirement}\n\n指挥官指令: {commander_plan}\n\n你是程序员A, 请用性能优先的风格实现。"
    task_b = f"原始需求: {requirement}\n\n指挥官指令: {commander_plan}\n\n你是程序员B, 请用简洁优先的风格实现。"
    task_c = f"原始需求: {requirement}\n\n指挥官指令: {commander_plan}\n\n你是程序员C, 请用安全优先的风格实现。"

    results = await asyncio.gather(
        WORKER_A.execute(task_a),
        WORKER_B.execute(task_b),
        WORKER_C.execute(task_c),
    )
    code_a, code_b, code_c = results
    print(f"  ╚═══════════════════════════════════════════════════════╝")

    # ── Phase 3: Judge 评审 ──
    print(f"\n  ╔══ Phase 3: 评审官综合评判 ═══════════════════════════╗")
    judge_input = f"""## 原始需求
{requirement}

## 方案 A (性能优先)
{code_a}

## 方案 B (简洁优先)
{code_b}

## 方案 C (安全优先)
{code_c}

请从正确性、性能、可读性、安全性四个维度打分并推荐。"""
    verdict = await JUDGE.execute(requirement, judge_input)
    print(f"  ╚═══════════════════════════════════════════════════════╝")

    return {
        "指挥官计划": commander_plan,
        "方案A(性能)": code_a,
        "方案B(简洁)": code_b,
        "方案C(安全)": code_c,
        "评审结论": verdict,
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def main():
    result = await commander_mode(
        "实现一个函数 find_missing_number(nums: list[int]) -> int, "
        "给定一个包含 n 个不重复整数的数组, 数字范围是 [0, n], "
        "恰好缺失一个数字, 找出缺失的数字。要求 O(n) 时间 O(1) 空间。"
    )

    print(f"\n{'═'*60}")
    print(f"  📦 交付物")
    print(f"{'═'*60}")
    for k, v in result.items():
        print(f"\n{'─'*60}\n  [{k}]\n{'─'*60}\n{v[:600]}")

if __name__ == "__main__":
    asyncio.run(main())

```

输出

```plain
════════════════════════════════════════════════════════════
  🎖️ 指挥官模式: 1 拆 N → N 并行 → 1 裁决
  📋 需求: 实现一个函数 find_missing_number(nums: list[int]) -> int, 给定一个包含 n 个不重复整数的数组, 数字范围是 [0, n], 恰好缺失一个数字, 找出缺失的数字。要求 O(n) 时间 O(1) 空间。
════════════════════════════════════════════════════════════
  每个 Worker 有独立上下文, 互不知晓, 并行执行

  ╔══ Phase 1: 指挥官拆解任务 ═══════════════════════════╗
  [🎖️ 指挥官] 完成 (1814 字符)
  ╚═══════════════════════════════════════════════════════╝

  ╔══ Phase 2: 3 个程序员并行编码 ═══════════════════════╗
  ║  各自独立上下文, 同时启动                             ║
  [🎯 程序员B (简洁优先)] 完成 (556 字符)
  [⚡ 程序员A (性能优先)] 完成 (1076 字符)
  [🛡️ 程序员C (安全优先)] 完成 (3156 字符)
  ╚═══════════════════════════════════════════════════════╝

  ╔══ Phase 3: 评审官综合评判 ═══════════════════════════╗
  [⚖️ 评审官] 完成 (1998 字符)
  ╚═══════════════════════════════════════════════════════╝

════════════════════════════════════════════════════════════
  📦 交付物
════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────
  [指挥官计划]
────────────────────────────────────────────────────────────
## 任务拆解
- 子任务1: 使用数学总和公式 `n*(n+1)//2 - sum(nums)` 直接计算缺失数字，保证 O(n) 时间与 O(1) 空间。 → 程序员A  
- 子任务2: 使用异或运算，将索引和数组元素全部异或，最后得到缺失数字，满足 O(n) 时间与 O(1) 空间。 → 程序员B  
- 子任务3: 使用原地哈希（交换元素到对应索引），扫描找到索引与元素不符的位置，即缺失数字，满足 O(n) 时间与 O(1) 额外空间（会修改输入数组）。 → 程序员C  

---

### 程序员A 方案评审
**提交代码**
```python
def find_missing_number(nums: list[int]) -> int:
    n = len(nums)
    total = n * (n + 1) // 2
    return total - sum(nums)
```
**分析**  
- 时间复杂度：O(n)（sum 遍历一次）。  
- 空间复杂度：O(1)，只用了常数变量。  
- 优点：代码极简，无任何副作用，不修改输入。  
- 潜在风险：当 n 较大时求和可能溢出，但 Python 支持大整数，实际无溢出问题；sum 需要遍历整个数组，但一次遍历已是最优。  
- 缺点：无。

### 程序员B 方案评审
**提交代码**
`

────────────────────────────────────────────────────────────
  [方案A(性能)]
────────────────────────────────────────────────────────────
```python
"""
性能优先方案：使用数学总和公式计算缺失数字。
时间复杂度 O(n)，空间复杂度 O(1)，不修改输入数组。
利用 Python 内置 sum 的 C 实现加速，无溢出风险。
"""

from typing import List


def find_missing_number(nums: List[int]) -> int:
    """
    给定长度为 n 的数组，包含 [0, n] 范围内不重复的整数，恰好缺失一个，
    返回缺失的那个数字。
    """
    n = len(nums)
    # 理论总和：0+1+...+n = n*(n+1)//2
    expected_total = n * (n + 1) // 2
    # 实际总和：对数组求和，C 级别循环，性能极佳
    actual_total = sum(nums)
    # 差值即为缺失数字
    return expected_total - actual_total


# 性能测试与正确性验证
if __name__ == "__main__":
    test_cases = [
        ([3, 0, 1], 2),
        ([0, 1], 2),
        ([9, 6, 4, 2, 3, 5, 7, 0, 

────────────────────────────────────────────────────────────
  [方案B(简洁)]
────────────────────────────────────────────────────────────
```python
import functools
import operator

def find_missing_number(nums: list[int]) -> int:
    """返回缺失的数字，使用异或运算，O(n) O(1)"""
    # 异或索引、元素、n 得到缺失值
    return functools.reduce(operator.xor, nums, 0) ^ functools.reduce(operator.xor, range(len(nums) + 1))


# 测试
if __name__ == "__main__":
    tests = [
        ([3, 0, 1], 2),
        ([0, 1], 2),
        ([9,6,4,2,3,5,7,0,1], 8),
        ([0], 1),
        ([1], 0),
    ]
    for nums, expected in tests:
        assert find_missing_number(nums) == expected, f"Failed for {nums}"
    print("所有测试通过")
```

────────────────────────────────────────────────────────────
  [方案C(安全)]
────────────────────────────────────────────────────────────
```python
"""
安全优先风格实现：使用原地哈希（交换元素到对应索引）查找缺失数字。

防御式编程特性：
- 严格的输入类型与值范围检查
- 重复元素检测（通过原地哈希过程中的比对）
- 详细的错误提示与文档说明
- 保持单次遍历、O(1) 额外空间（不引入额外线性结构）

注意：为满足 O(1) 额外空间的要求，本实现会修改输入数组。
若调用方不希望修改输入，请在传入前自行拷贝。
"""

from typing import List


def find_missing_number(nums: List[int]) -> int:
    """
    在包含 n 个不重复整数的数组中找到缺失的那个数字。
    数字范围严格为 [0, n]，恰好缺失一个数字。

    算法：原地哈希，通过交换将每个数放到索引等于其值的位置上
    （数值 n 无法放置，会留在原处或由其它元素交换覆盖）。
    然后扫描索引，第一个索引 i 满足 nums[i] != i 即为缺失数字；
    若全部匹配，则缺失的数字为 n。

    时间复杂度：O(n)  （每个元素至多交换两次，while 循环总执行次数为 O(n)）
    额外空间复杂度：O(1) （仅使用常数个临时变量）

    参数：
        nums: 整数列表，要求长度 n >= 0，元素为

────────────────────────────────────────────────────────────
  [评审结论]
────────────────────────────────────────────────────────────
我会从正确性、性能、可读性、安全性四个维度对三个方案打分（每项1-10分），并给出推荐结论。

---

## 维度评分与简评

### 1. 正确性 (功能是否完全满足需求，边界情况、异常处理)

| 方案 | 得分 | 简评 |
|------|------|------|
| A    | 9    | 数学公式完全正确，能处理 n=0（空列表返回0）、缺失 n 等边界；未检查输入类型/范围，但不影响功能。 |
| B    | 8    | 异或逻辑正确，但 `range(len(nums)+1)` 可能在大 n 下生成列表（Python 3 中 range 是对象，没问题），能处理边界；缺少对重复或非法值的防御，且写法对 Python 新手易出错。 |
| C    | 10   | 原地哈希算法正确，并显式处理 n=0、缺失 n 等边界；额外增加了重复检测、值范围检查，会主动报错。满足甚至超出需求。 |

### 2. 性能 (时间、空间复杂度，实际运行效率)

| 方案 | 得分 | 简评 |
|------|------|------|
| A    | 10   | `sum(nums)` 是 C 实现，极快；只做一次遍历和常数运算，严格 O(n) 时间 O(1) 空间，不修改输入。 |
| B    | 6    | 也是 O(n) 但使用两次 `reduce`
```

### 圆桌讨论模式
```python
"""
Multi-Agent Demo 3: 圆桌讨论 (Roundtable)
多个专家同时拿到问题 → 各自思考发言 → 看到他人发言后修正 → 多轮迭代 → 收敛。

架构:
    Round 1: [法学专家] [伦理专家] [技术专家] 同时发言
    Round 2: 各自读到 Round 1 的所有发言 → 修正观点
    Round 3: 继续辩论 → 收敛
    Moderator: 总结共识与分歧

特点:
    - 每个专家有独立的 system prompt (角色) 和独立的上下文
    - 每轮结束后, 把自己的发言追加到其他人的 context 中
    - 不是投票, 而是互相说服、修正观点
    - 适合: 需要多视角权衡的决策问题

用法:
    python 04c_roundtable.py
"""

import asyncio, json
from openai import AsyncOpenAI

client = AsyncOpenAI(base_url="https://api.deepseek.com/",
                     api_key="sk-xxx")
MODEL = "deepseek-v4-pro"


class Expert:
    """圆桌专家——有独立角色, 每轮可以看到前面所有轮次的发言"""
    def __init__(self, name: str, emoji: str, system_prompt: str, temp: float = 0.6):
        self.name = name; self.emoji = emoji; self.system_prompt = system_prompt; self.temp = temp
        self.context = []  # 独立上下文 (不包含其他专家的 system prompt)

    def init_context(self, topic: str):
        """每轮开始前重置上下文, 只保留自己的 system prompt + 议题"""
        self.context = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"## 讨论议题\n{topic}\n\n请发表你的观点。用中文, 控制在 200 字以内。"},
        ]

    def see_others_speak(self, round_num: int, all_speeches: dict):
        """把其他专家上一轮的发言追加到自己的上下文中"""
        others = {k: v for k, v in all_speeches.items() if k != self.name}
        summary = f"## 第 {round_num} 轮其他专家的发言\n"
        for name, text in others.items():
            summary += f"\n### {name}:\n{text}\n"
        summary += f"\n请回应其他专家的观点: 你同意什么? 反对什么? 你的观点有变化吗?"
        self.context.append({"role": "user", "content": summary})

    async def speak(self, round_num: int) -> str:
        print(f"  [{self.emoji} {self.name}] 第{round_num}轮思考中... (上下文: {len(self.context)} 条消息)")
        r = await client.chat.completions.create(model=MODEL, messages=self.context, temperature=self.temp)
        speech = r.choices[0].message.content or ""
        # 把自己的发言也记入上下文
        self.context.append({"role": "assistant", "content": speech})
        print(f"  [{self.emoji} {self.name}] → {speech[:120].replace(chr(10),' ')}...")
        return speech


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 三位专家
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAWYER_SYS = """你是法学专家。从法律法规、合规风险角度分析问题。
关注: 是否合法、可能的法律后果、监管趋势。用中文, 观点鲜明。"""

ETHICIST_SYS = """你是伦理学专家。从道德伦理、社会影响角度分析问题。
关注: 是否公平、对弱势群体的影响、长期社会后果。用中文, 观点鲜明。"""

TECH_SYS = """你是技术专家。从技术可行性、实施方案角度分析问题。
关注: 技术是否成熟、实现成本、安全性、替代方案。用中文, 观点鲜明。"""

MODERATOR_SYS = """你是讨论主持人。总结三轮讨论中各位专家的核心观点,
找出共识和分歧, 给出平衡的综合建议。用中文, 结构化输出。"""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 圆桌讨论
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def roundtable(topic: str, num_rounds: int = 3):
    print(f"\n{'═'*60}")
    print(f"  🏛️ 圆桌讨论模式: 多专家 × {num_rounds} 轮")
    print(f"  📋 议题: {topic}")
    print(f"{'═'*60}")
    print(f"  每个专家有独立上下文 + 独立角色视角")
    print(f"  每轮结束后互相看到对方发言, 逐步修正观点\n")

    lawyer = Expert("法学专家", "⚖️", LAWYER_SYS, 0.7)
    ethicist = Expert("伦理专家", "🎭", ETHICIST_SYS, 0.7)
    techie = Expert("技术专家", "🔬", TECH_SYS, 0.7)
    moderator = Agent("主持人", "🎤", MODERATOR_SYS, 0.3)
    experts = [lawyer, ethicist, techie]

    # 初始化各自的独立上下文
    for e in experts:
        e.init_context(topic)

    all_speeches = {}  # {专家名: 最新发言}

    for rnd in range(1, num_rounds + 1):
        print(f"\n  ╔══ 第 {rnd} 轮讨论 ═══════════════════════════════════╗")

        # 每个专家独立发言 (上下文独立, 不共享 system prompt)
        speeches = {}
        for e in experts:
            speech = await e.speak(rnd)
            speeches[e.name] = speech

        all_speeches = speeches
        print(f"  ╚═══════════════════════════════════════════════════════╝")

        # 让其他专家看到这一轮的发言 (追加到各自的独立上下文)
        if rnd < num_rounds:
            for e in experts:
                e.see_others_speak(rnd, all_speeches)

    # ── Moderator 总结 ──
    print(f"\n  ╔══ 主持人总结 ═══════════════════════════════════════╗")
    history_text = ""
    for name, speech in all_speeches.items():
        history_text += f"\n### {name}:\n{speech}\n"
    summary = await moderator.execute(topic, f"## 议题\n{topic}\n## 最终观点\n{history_text}")
    print(f"  ╚═══════════════════════════════════════════════════════╝")

    return {"议题": topic, "最终发言": all_speeches, "主持人总结": summary}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 复用 04a 的 Agent 类用于 Moderator (它只有单次 execute, 不需要多轮上下文)
class Agent:
    def __init__(self, name: str, emoji: str, system_prompt: str, temp: float = 0.3):
        self.name = name; self.emoji = emoji; self.system_prompt = system_prompt; self.temp = temp

    async def execute(self, task: str, input_text: str = "") -> str:
        messages = [{"role":"system","content": self.system_prompt}]
        if input_text: messages.append({"role":"user","content": input_text})
        r = await client.chat.completions.create(model=MODEL, messages=messages, temperature=self.temp)
        return r.choices[0].message.content or ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def main():
    result = await roundtable(
        "各大互联网公司正在研发'AI 面试官'系统——用 AI 代替人类 HR 进行招聘初筛, "
        "分析候选人的简历、语音语调、微表情来判断是否进入下一轮。"
        "请从法律、伦理、技术三个角度讨论: 这种系统是否应该被推广使用?",
        num_rounds=2,
    )

    print(f"\n{'═'*60}")
    print(f"  📦 讨论结果")
    print(f"{'═'*60}")
    print(f"\n{'─'*60}\n  [各专家最终发言]\n{'─'*60}")
    for name, speech in result["最终发言"].items():
        print(f"\n  [{name}]\n  {speech}")
    print(f"\n{'─'*60}\n  [主持人总结]\n{'─'*60}\n{result['主持人总结']}")

if __name__ == "__main__":
    asyncio.run(main())

```

输出

```plain
════════════════════════════════════════════════════════════
  🏛️ 圆桌讨论模式: 多专家 × 2 轮
  📋 议题: 各大互联网公司正在研发'AI 面试官'系统——用 AI 代替人类 HR 进行招聘初筛, 分析候选人的简历、语音语调、微表情来判断是否进入下一轮。请从法律、伦理、技术三个角度讨论:这种系统是否应该被推广使用?
════════════════════════════════════════════════════════════
  每个专家有独立上下文 + 独立角色视角
  每轮结束后互相看到对方发言, 逐步修正观点


  ╔══ 第 1 轮讨论 ═══════════════════════════════════╗
  [⚖️ 法学专家] 第1轮思考中... (上下文: 2 条消息)
  [⚖️ 法学专家] → 作为法学专家，我明确反对当前推广此类系统，因其法律地基严重不稳。    **合法性存疑**：分析“微表情”涉嫌采集敏感个人信息，违反《个人信息保护法》“最小必要”原则。将算法黑箱用于就业资格判断，直接冲击《就业促进法》的平等就业权，极易引发...
  [🎭 伦理专家] 第1轮思考中... (上下文: 2 条消息)
  [🎭 伦理专家] → 作为伦理学专家，我坚决反对推广AI面试官。   这种系统会放大算法偏见，无声淘汰那些语音语调不“主流”、微表情不“标准”的弱势群体，加剧结构性不公。更危险的是，它把人的命运交给不透明的机器评判，侵蚀求职者的尊严，长期将导致社会信任瓦解，让职...
  [🔬 技术专家] 第1轮思考中... (上下文: 2 条消息)
  [🔬 技术专家] → 作为技术专家，我认为不应推广。技术上，语音语调、微表情分析远未成熟，学术上对微表情与能力关联无定论，模型极易受光照、噪音、口音干扰，误判率高且可被对抗样本欺骗。实现成本巨大，偏见数据会导致系统性歧视，且黑盒决策难以审计。安全性堪忧，易泄露敏...
  ╚═══════════════════════════════════════════════════════╝

  ╔══ 第 2 轮讨论 ═══════════════════════════════════╗
  [⚖️ 法学专家] 第2轮思考中... (上下文: 4 条消息)
  [⚖️ 法学专家] → 我的法学立场非但未变，反而因二位专家的洞见而更坚定。**完全同意**伦理学家关于“不透明机器侵蚀尊严”的判断，这直接对应法律上的**知情权与救济权真空**——求职者无从知晓被拒原因，更无法辩解，这正是反歧视法规制的核心。**完全同意**技术...
  [🎭 伦理专家] 第2轮思考中... (上下文: 4 条消息)
  [🎭 伦理专家] → 我完全同意两位专家的反对立场，并认为他们揭示的风险更印证了深层伦理危机。法学专家指出的歧视与不透明，正是算法专制对平等尊严的践踏；技术专家确认的不可靠性，则暴露了用瑕疵工具裁决命运的傲慢。我的观点不变且更坚定：这种系统不仅是技术、法律问题，...
  [🔬 技术专家] 第2轮思考中... (上下文: 4 条消息)
  [🔬 技术专家] → 作为技术专家，我对法学与伦理专家的观点表示强烈共鸣，尤其是关于偏见与不透明的警告，这印证了技术方案的致命缺陷。  **我同意的部分**：他们指出的“算法偏见放大”与“黑箱不可解释”，在技术上就是模型过拟合于有偏数据，且深度学习天然缺乏审计性...
  ╚═══════════════════════════════════════════════════════╝

  ╔══ 主持人总结 ═══════════════════════════════════════╗
  ╚═══════════════════════════════════════════════════════╝

════════════════════════════════════════════════════════════
  📦 讨论结果
════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────
  [各专家最终发言]
────────────────────────────────────────────────────────────

  [法学专家]
  我的法学立场非但未变，反而因二位专家的洞见而更坚定。**完全同意**伦理学家关于“不透明机器侵蚀尊严”的判断，这直接对应法律上的**知情权与救济权真空**——求职者无从知晓被拒原因，更无法辩解，这正是反歧视法规制的核心。**完全同意**技术专家关于“技术尚不可靠”的论断，这构成法律上“不可辩解”的证据瑕疵，基于不确定推论做出的自动化决策，**违反了算法的公平性与透明度要求**。综合来看，三方观点已形成闭环：**不可靠的技术，形成不透明的黑箱，做出不可辩解的决策，最终导致法律反感的系统化歧视**——此系统绝不可推广。

  [伦理专家]
  我完全同意两位专家的反对立场，并认为他们揭示的风险更印证了深层伦理危机。法学专家指出的歧视与不透明，正是算法专制对平等尊严的践踏；技术专家确认的不可靠性，则暴露了用瑕疵工具裁决命运的傲慢。我的观点不变且更坚定：这种系统不仅是技术、法律问题，更是将人异化为数据标签的道德败笔。即使未来技术改进，也不应允许机器剥夺人际判断中应有的共情与责任。

  [技术专家]
  作为技术专家，我对法学与伦理专家的观点表示强烈共鸣，尤其是关于偏见与不透明的警告，这印证了技术方案的致命缺陷。

**我同意的部分**：他们指出的“算法偏见放大”与“黑箱不可解释”，在技术上就是模型过拟合于有偏数据，且深度学习天然缺乏审计性。这与我之前提到的“系统性歧视”和“决策难审计”完全一致。

**我补充或部分不同意的部分**：法学专家强调的法律风险，技术上就源于模型的不鲁棒。伦理学家担心的“侵蚀尊严”，技术上正是当前AI缺乏常识推理，把相关性误当因果性的结果，它根本读不懂人。

**我的观点没有变化，反而更坚定了**：他们的论述证实了，在基础技术（可解释性、去偏、鲁棒性）取得根本性突破前，强行推广不仅是不道德的，更是用不成熟的自动化制造大规模不公平。技术可行性是“零”，其他都无从谈起。

────────────────────────────────────────────────────────────
  [主持人总结]
────────────────────────────────────────────────────────────
好的，作为本次讨论的主持人，我已仔细梳理了三轮讨论中各位专家的核心观点。现在，我将总结共识与分歧，并给出平衡的综合建议。

### 核心观点总结

*   **法学专家**：坚持**绝对禁止推广**。核心逻辑是“不可靠的技术形成不透明黑箱，做出不可辩解的决策，导致系统化歧视”。焦点在于这直接侵犯了求职者法律层面的**知情权、救济权**，并实质性地构成**算法歧视**。
*   **伦理专家**：坚持**绝对禁止推广**。认为这不仅是技术或法律问题，更是深层的**道德败笔**。系统将人**异化为数据标签**，用不透明的算法专制侵蚀人的**平等尊严**，并剥夺了招聘中应有的**人类共情与责任**。
*   **技术专家**：坚持**暂缓推广**。完全认同法律与伦理层面的风险，并指出这些风险在技术上对应着**过拟合、缺乏可解释性、欠缺常识推理**等致命缺陷。强调在核心技术瓶颈（偏见消除、鲁棒性）未获根本性突破前，推广是用不成熟自动化制造大规模不公。

---

### 共识与分歧分析

#### 三方形成的坚实共识

1.  **目标一致，绝对反对现状推广**：三方均以最强烈的措辞反对在当下推广AI面试官系统。这不是有条件的反对，而是基于其当前状态的全面否定。
2.  **风险链条完全互证**：三方共同锚定了一条完整的灾难链条：**技术缺陷（不可靠、黑箱） → 伦理侵害（失尊严、缺共情） → 法律违规（损知情权、救济权，成系统歧视）**。每一环都被下一环印证，形成了逻辑闭环。
3.  **核心病灶判断一致**：“不透明”和“偏见”是共同认定的致命根源。技术上的黑箱，在法律上剥夺了知情权与辩白机会，在伦理上则构成了算法对个人命运的专断。

#### 存在的微妙分歧

尽管总立场一致，但在反对的**终极理由与未来可能性**上存在侧重点差异：

*   **反对的根本性不同**：
    *   **伦理学家的反对最为彻底**，触及人类价值的本质。其观点暗示，即使技术完美无瑕，用机器裁决他人命运这一行为本身就存在道德瑕疵，可能永远不应被接受。
    *   **法学与技术专家的反对更具条件性**。他们的论述隐含着一种可能性：如果技术实现了“完全可解释”、“绝对公平无偏”并确保了“充分的救济程序”，那么法律和技术层面的障碍可能被移除。

*   **对未来解除禁令的想象不同**：
    *   **技术专家**设定了明确的准入条件（基础技术的根本性突破）。
    *   **法学专家**设定了法律合规的前提（权利保障机制的完备化）。
    *   **伦理学家**的立场则不接受任何技术或法律的修补，从根本上质疑此类应用的正当性。

---

### 平衡的综合建议

基于三方形成的压倒性共识和清晰的“技术-伦理-法律”风险互证，在目前的状况下，推广此类系统将铸成严重的错误。因此，我提出以下综合建议：

**核心建议：采取“基于根本性风险的绝对禁止”策略，拒绝一切“带病探索”**

不应以“渐进式改良”或“先行试点”的方式推广，因为风险不是操作层面上的，而是机制性的，会以工业化的速度和规模制造不公。具体行动方案为“严令禁止、设定准入、探索替代”的三步走：

1.  **立即实施最高级别的监管禁令**
    *   **内容**：由人力资源和社会保障部门联合市场监管总局，发布专项禁令。严禁任何企业将AI在面试初筛环节的决策分析（对语音语调、微表情的评估）作为对应聘者进行任何形式（加分、减分、直接标籤、优先级排序）处理的依据。
    *   **理由**：这直接回应了法律与伦理上的歧视和无尊严风险，明确划出红线。技术上无法审计，法律上就无法给与救济，因此必须从源头切断。

2.  **为未来设定“不可能”的安全门槛**
    *   若未来技术要重启讨论，必须在受严格监管的“沙盒”中，依次通过以下三道关口，而非由厂商自说自话：
        *   **第一关·技术审计**：系统算法必须实现100%透明，其决策路径能被外行理解。必须向监管方证明，模型已彻底消除针对任何受保护特征群体（性别、种族、年龄等）的偏见，并能在各类异常测试中保持绝对稳定。
        *   **第二关·权利保障**：必须设计出比人类面试更优越的知情权制度——在做出不利决定时，必须用自然语言清晰说明哪段具体音视频的哪个非语言特征导致了该决策，并将其打上“技术分析，仅供参考”的标签。同时，必须设立独立的“人工+技术”专家合议庭，提供便捷高效的申诉和推翻通道。
        *   **第三关·伦理审查**：提交由技术、法学、伦理、社会学等多元背景专家组成的委员会进行公共审查，评估其对社会公义的潜在影响。伦理学家所提出的“异化”担忧，必须在此得到正面回应与化解。

3.  **引导技术向善，用于赋能而非取代**
    *   **转向辅助工具**：将AI技术力量从“审判”转向“辅助”。例如，开发帮助人类HR识别自身偏见、辅助筛选简历关键词、优化职位描述以吸引更多元群体的AI工具。
    *   **投资于人**：将AI替代HR省下的预算，用于升级人类招聘官的能力，培训他们进行结构化面试、识别非结构化信息、克服自身认知偏见。这是对伦理学家呼吁“保留人际判断共情与责任”的切实回应。

**结论**：当前，对AI面试官系统说“不”，不是因为对技术进步的抗拒，而是出于对法律秩序的维护、对人格尊严的捍卫，以及对技术发展客观规律的尊重。在所谓“完美AI”的许诺照进现实之前，我们绝不能允许一个充满漏洞的系统，去批量地裁决人类的机遇与未来。
```

# Agentic Workflow
前面的 Agent 都或多或少追求自主性，但是生产环境中，这是完全不可接受的，生产环境需要的是可控、稳定、合规的，为了解决这类问题，提出了范式 Agentic Workflow（工作流式），这类模型思想是通过规则和流程，控制大模型处理每个节点任务，这类并**不是完全自主的智能体**，而是**带 LLM 的自动化流程**。这是最务实的做法。

## 工作流程
+ 预先设定标准化的业务流程和规则
+ 在需要智能处理的地方嵌入大模型
+ 规则引擎控制完整的流程和分支判断
+ 关键节点有人工审核和兜底机制

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1783442903979-346fbe43-675b-456d-9471-2d2ee2e9574a.png)

## 优缺点
优点：

+ 流程可控：每个节点可审计，符合企业合规要求
+ 容易接入：可以无缝集成到企业已有的业务中
+ 成本低，改造容易：只需要在需要的地方使用大模型，而且从原业务修改更加容易
+ 稳定性高：规则和模型结合，比纯模型更加可靠

缺点：

+ 自由度下降：Agent 不能完全自主决策
+ 灵活性较差：流程变更需要修改 WorkFlow 定义

适用场景：客服工单处理、审批流程、数据处理流水线等具有规定流程的企业级生产场景。

## Demo 代码
代码核心思想：规定的完整的流程（相较于 Plan and Excute 省去了 Plan 的部分），且在可控的流程上让 Agent 自主决策调用工具 `tool_choice="auto"`

```python
"""
Agentic Workflow Demo — 使用 AsyncOpenAI + DeepSeek

与纯 ReAct 的区别:
    Agentic Workflow 允许 Agent 自主选择策略——简单的直接回答,
    复杂的多步调用——不是固定每轮只调一个工具。

特点:
    - 自主决定每轮调几个工具(可并行)
    - 失败后自动调整策略
    - 不需要预设"每轮一步"的规则

场景:
    帮用户买机票——查航班、比价、查天气,能并行就并行。

用法:
    python 05_agentic_workflow.py
"""

import asyncio, json
from datetime import datetime
from openai import AsyncOpenAI

client = AsyncOpenAI(base_url="https://api.deepseek.com/",
                     api_key="sk-xxx")
MODEL = "deepseek-v4-pro"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 工具
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def search_flight(route: str, date: str) -> dict:
    """模拟航班搜索"""
    flights = {
        ("北京","上海"): [{"航空公司":"国航","航班号":"CA1234","起飞":"08:00","到达":"10:30","价格":1280},
                         {"航空公司":"东航","航班号":"MU5678","起飞":"14:00","到达":"16:30","价格":1050}],
        ("北京","深圳"): [{"航空公司":"南航","航班号":"CZ9012","起飞":"09:30","到达":"13:00","价格":1680},
                         {"航空公司":"深航","航班号":"ZH3456","起飞":"17:00","到达":"20:30","价格":1420}],
        ("上海","深圳"): [{"航空公司":"东航","航班号":"MU7890","起飞":"11:00","到达":"13:30","价格":980}],
    }
    for (frm, to), fs in flights.items():
        if frm in route and to in route:
            return {"route": f"{frm}→{to}", "date": date, "flights": fs}
    return {"route": route, "date": date, "flights": [], "hint": "试试: 北京→上海, 北京→深圳, 上海→深圳"}


async def get_weather(city: str) -> dict:
    """模拟天气查询"""
    db = {"北京": "晴 22°C 微风", "上海": "多云 26°C 东南风3级", "深圳": "阵雨 30°C 西南风4级"}
    return {"city": city, "weather": db.get(city, "多云 20°C")}


async def comparator(a: float, b: float) -> dict:
    """对比两个数值"""
    d = b - a
    return {"A": a, "B": b, "B比A贵": round(d, 2), "B贵了%": round(d/a*100, 1) if a else 0}


TOOLS_MAP = {"search_flight": search_flight, "get_weather": get_weather, "comparator": comparator}
TOOLS_SCHEMA = [
    {"type":"function","function":{"name":"search_flight","description":"搜索航班。route如'北京→上海'","parameters":{"type":"object","properties":{"route":{"type":"string"},"date":{"type":"string"}},"required":["route","date"]}}},
    {"type":"function","function":{"name":"get_weather","description":"查城市天气","parameters":{"type":"object","properties":{"city":{"type":"string"}},"required":["city"]}}},
    {"type":"function","function":{"name":"comparator","description":"对比两个数字,算差值和百分比","parameters":{"type":"object","properties":{"a":{"type":"number"},"b":{"type":"number"}},"required":["a","b"]}}},
]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Agentic Workflow
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SYSTEM_PROMPT = """你是自主工作流 Agent。你有工具可用:

- search_flight(route, date): 查航班
- get_weather(city): 查天气
- comparator(a, b): 对比两个数字

工作原则:
- 互不依赖的任务可以并行调用多个工具(一次调多个)
- 依赖前面结果的要等拿到结果再调
- 两个独立城市的航班可以同时查
- 信息够了就输出最终答案

用中文。"""


async def agentic_workflow(question: str, max_steps: int = 8):
    print(f"\n{'═'*60}\n  🤖 Agentic Workflow\n  ❓ {question}\n{'═'*60}")

    messages = [{"role":"system","content":SYSTEM_PROMPT}, {"role":"user","content":question}]

    for step in range(1, max_steps + 1):
        print(f"\n{'█'*60}\n  Round {step} | 上下文中 {len(messages)} 条消息\n{'█'*60}")

        r = await client.chat.completions.create(model=MODEL, messages=messages,
                                                  tools=TOOLS_SCHEMA, tool_choice="auto")
        choice = r.choices[0]; msg = choice.message

        if choice.finish_reason == "tool_calls" and msg.tool_calls:
            print(f"  🤔 本轮决策: 调 {len(msg.tool_calls)} 个工具")
            # assistant 消息只加一次
            messages.append({"role":"assistant","content":msg.content,
                             "tool_calls":[{"id":t.id,"type":t.type,
                                            "function":{"name":t.function.name,"arguments":t.function.arguments}}
                                           for t in msg.tool_calls]})
            for tc in msg.tool_calls:
                name = tc.function.name; args = json.loads(tc.function.arguments)
                fn = TOOLS_MAP[name]
                result = await fn(**args)
                print(f"  🔧 {name}({json.dumps(args,ensure_ascii=False)})")
                print(f"  📊 → {json.dumps(result,ensure_ascii=False)[:130]}")
                messages.append({"role":"tool","tool_call_id":tc.id,
                                 "content":json.dumps(result,ensure_ascii=False)})
            print(f"  (此轮 append {len(msg.tool_calls)*2} 条消息,目前共 {len(messages)} 条)")
        else:
            answer = msg.content or ""
            print(f"  ✅ 信息已足,输出答案")
            return answer

    return "⚠️ 超步数"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async def main():
    q = ("我要从北京去深圳出差,再从深圳去上海,最后从上海回北京。"
         "帮我查这三段航班的票价(2026-07-10),"
         "同时查这三个城市明天的天气。最后帮我算一下北京→深圳这段,国航比深航贵多少百分比。")

    answer = await agentic_workflow(q, max_steps=6)
    print(f"\n{'─'*60}\n🎯\n{answer}")

if __name__ == "__main__":
    asyncio.run(main())

```

## 输出结果
```plain
════════════════════════════════════════════════════════════
  🤖 Agentic Workflow
  ❓ 我要从北京去深圳出差,再从深圳去上海,最后从上海回北京。帮我查这三段航班的票价(2026-07-10),同时查这三个城市明天的天气。最后帮我算一下北京→深圳这段,国航比深航贵多少百分比。
════════════════════════════════════════════════════════════

████████████████████████████████████████████████████████████
  Round 1 | 上下文中 2 条消息
████████████████████████████████████████████████████████████
  🤔 本轮决策: 调 6 个工具
  🔧 search_flight({"route": "北京→深圳", "date": "2026-07-10"})
  📊 → {"route": "北京→深圳", "date": "2026-07-10", "flights": [{"航空公司": "南航", "航班号": "CZ9012", "起飞": "09:30", "到达": "13:00", "价格": 1680}, {"
  🔧 search_flight({"route": "深圳→上海", "date": "2026-07-10"})
  📊 → {"route": "上海→深圳", "date": "2026-07-10", "flights": [{"航空公司": "东航", "航班号": "MU7890", "起飞": "11:00", "到达": "13:30", "价格": 980}]}
  🔧 search_flight({"route": "上海→北京", "date": "2026-07-10"})
  📊 → {"route": "北京→上海", "date": "2026-07-10", "flights": [{"航空公司": "国航", "航班号": "CA1234", "起飞": "08:00", "到达": "10:30", "价格": 1280}, {"
  🔧 get_weather({"city": "北京"})
  📊 → {"city": "北京", "weather": "晴 22°C 微风"}
  🔧 get_weather({"city": "深圳"})
  📊 → {"city": "深圳", "weather": "阵雨 30°C 西南风4级"}
  🔧 get_weather({"city": "上海"})
  📊 → {"city": "上海", "weather": "多云 26°C 东南风3级"}
  (此轮 append 12 条消息,目前共 9 条)

████████████████████████████████████████████████████████████
  Round 2 | 上下文中 9 条消息
████████████████████████████████████████████████████████████
  🤔 本轮决策: 调 2 个工具
  🔧 search_flight({"date": "2026-07-10", "route": "深圳→上海"})
  📊 → {"route": "上海→深圳", "date": "2026-07-10", "flights": [{"航空公司": "东航", "航班号": "MU7890", "起飞": "11:00", "到达": "13:30", "价格": 980}]}
  🔧 search_flight({"date": "2026-07-10", "route": "上海→北京"})
  📊 → {"route": "北京→上海", "date": "2026-07-10", "flights": [{"航空公司": "国航", "航班号": "CA1234", "起飞": "08:00", "到达": "10:30", "价格": 1280}, {"
  (此轮 append 4 条消息,目前共 12 条)

████████████████████████████████████████████████████████████
  Round 3 | 上下文中 12 条消息
████████████████████████████████████████████████████████████
  ✅ 信息已足,输出答案

────────────────────────────────────────────────────────────
🎯
好的，以下是查询结果汇总：

---

## 🛫 三段航班（2026年7月10日）

| 航段 | 航班 | 航空公司 | 起飞 | 到达 | 价格 |
|------|------|----------|------|------|------|
| **北京→深圳** | CZ9012 | 南航 | 09:30 | 13:00 | ¥1,680 |
|  | ZH3456 | 深航 | 17:00 | 20:30 | ¥1,420 |
| **深圳→上海** | MU7890 | 东航 | 11:00 | 13:30 | ¥980 |
| **上海→北京** | CA1234 | 国航 | 08:00 | 10:30 | ¥1,280 |
|  | MU5678 | 东航 | 14:00 | 16:30 | ¥1,050 |

---

## 🌤️ 三城市明天天气

| 城市 | 天气 | 温度 | 风力 |
|------|------|------|------|
| **北京** | ☀️ 晴 | 22°C | 微风 |
| **深圳** | 🌧️ 阵雨 | 30°C | 西南风4级 |
| **上海** | ⛅ 多云 | 26°C | 东南风3级 |

---

## ⚠️ 关于"国航比深航贵多少"

北京→深圳航段查询结果中**没有国航航班**，仅有 **南航（¥1,680）** 和 **深航（¥1,420）**。因此无法计算"国航比深航贵多少"。

如果您想比较 **南航 vs 深航**（同航段南航比深航贵多少），我可以马上帮您算——要我算吗？
```

# 五种工程范式如何选择
这些范式之间不是互斥的，而是互补和组合的关系。每一种范式都有自己最擅长解决的问题，也有自己的局限性，没有一种范式是万能的。

在实际应用中，我们一般也不会单独使用某一种范式，而是会根据任务的特点，把多种范式组合起来使用。这就像构建一个软件系统：

+ ReAct 是函数调用：处理单个具体的操作，灵活但缺乏全局结构。
+ Plan-and-Execute 是模块划分：先把系统拆分成多个功能模块，再逐一实现。
+ Reflection 是单元测试：对每个模块的输出进行质量检查，确保符合要求。
+ Multi-Agent 是微服务架构：把复杂系统拆分成多个独立的服务，各司其职，互相协作。
+ Agentic Workflow 是CI/CD 流水线：定义整个系统的执行流程和规则，确保稳定、可控、可审计。

常见的范式组合：

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/35229002/1783441175961-fecd5925-c3d9-4ea3-9a05-6d6bba646ff0.png)

在真实的线上项目中，我们通常基于**最小必要复杂度原则**：能用简单的就不用复杂的，切忌过度设计。**很多人一开始就想做一个无所不能的 Multi-Agent 系统**，结果发现调试困难、成本高昂、稳定性差，最后还不如一个简单的 ReAct Agent 好用。

选型时可以问四个问题：

1. 步骤能否事先列全？能 → 偏 Plan 或 Workflow；不能 → 偏 ReAct。
2. 错了代价多大？高 → 必须 Reflection + 自动化测试/规则，最好加人工节点。
3. 是否需要多专业角色？是 → 再考虑 Multi-Agent；否 → 单 Agent 往往够用。
4. 合规与审计要求？强 → Workflow 为主，Agent 能力收进边界内。

  
 


