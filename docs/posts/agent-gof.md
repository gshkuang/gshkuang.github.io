---
title: Agent设计模式 vs 传统软件设计模式
description: GoF管确定性协作，Agent模式管运行时决策 — 12+3对标
---

# Agent设计模式 vs 传统软件设计模式：一次对标

> GoF管确定性协作，Agent模式管运行时决策。

做过后端的都熟：23种GoF + 微服务的熔断、管道、分流，解决的是“对象怎么写才稳”。Agent把调用者换成了大模型——它会自己定下一步、自己调工具、自己改答案。于是多了三种传统代码里没有的失败：幻觉调不存在的工具、无限反思改个没完、token/钱烧穿。

本文用你已经会用的传统模式做锚，把Agent模式讲清：像在哪、不像在哪、怎么写才好。底料来自三处：Anthropic《Building Effective Agents》、Ng 4模式 + ReAct/Reflexion论文、谷歌《Agentic Design Patterns》（xindoo中文版21章）。

## 分层：先分层再对标，不然会乱

GoF 23（创建/结构/行为）是**代码层**：管对象怎么new、怎么包、怎么调。而xindoo那21章横跨了三层：

| 层 | 解决什么 | 含哪些Agent模式 | 对标对象 |
|---|---|---|---|
| L0 代码实现层 | 单个类/函数怎么写 | Tool对象创建、Memory存取、事件分发内部实现 | GoF 23原样用：Factory建Tool、Singleton管Session、Observer推事件 |
| L1-L2 架构/集成层 | 系统怎么连、流程怎么走 | 提示链、路由、并行、Orchestrator、MCP/RAG、A2A、目标监控、异常恢复 | 对标EIP/微服务：Pipes-Filters、Strategy、Fork-Join、Mediator、熔断、Saga，不对标GoF |
| L3 思考认知层 | Agent怎么想 | 推理(ReAct/CoT/ToT)、规划、反思/Evaluator、学习适应、探索发现、优先级排序 | **无传统等价物**，这是Agent增量 |
| L4-L5 协作治理层 | 多智能体+人+运维怎么管 | 多智能体协作、HITL、Guardrails、评估监控、资源优化 | 对标协作治理：Actor、Proxy、Observer、SRE，不对标GoF单个模式 |

所以你说的“思考模式”单独成层是对的。我把它定为L3，含：推理技术 ch17、规划 ch6、反思 ch4、学习适应 ch9、探索发现 ch21、优先级 ch20。多智能体 ch7我建议**不放L3，放协作层**：单个Agent的想是L3，多个Agent怎么商量（debate/vote/handoff）是协作问题。反思是单体自省，多智能体是群体商量，分开写读者更清楚。

## 总表：12+3，先看全景

| Agent模式 | 一句话 | 传统锚 |
|---|---|---|
| 提示链 | 上步输出即下步输入 | Pipes-Filters |
| 路由 | 先分类再进专用流程 | Strategy + Factory |
| 并行化 | 分治或投票再聚合 | Fork-Join / N-Version |
| Orchestrator | 中央LLM动态拆活 | Mediator |
| Evaluator/反思 | 生成 + 批判两角色 | Decorator + Memento |
| 工具使用/MCP | 给模型包外部能力 | Adapter + Facade |
| 规划/ReAct | 模型自己走 Thought-Act-Obs | 无等价 |
| 多智能体 | 多角色协作 | 微服务 + Mediator |
| 记忆/RAG | 跨轮状态 | Repository + Cache |
| 目标监控/异常/HITL/Guardrails/评估 | 生产三件套 | Proxy + 熔断 + Observer |

结论先行：约1/3直接复用，1/3要改造，1/3全新。全新的三块就是本文增量：ReAct、规划、多智能体通信。

## 一、能直接抄的三组

### 1. 工具使用：就是Adapter，但接口写给模型看

传统Adapter把外部API包成内部接口。Agent一样，只是调用者从代码变成了LLM。Anthropic为此造了个词ACI（Agent-Computer Interface），对标HCI：文档不清，模型就传错参、编工具名。

标准六步：定义工具 → 模型决策 → 生成JSON → 框架执行 → 回 observation → 再推理。写好三条：描述写给实习生看（含边界 + 示例）；参数显式、幂等、超时、沙盒；别什么都包，模型内能算的别调。

### 2. 提示链：就是管道，但每段都会幻觉

大prompt三病：context drift、指令忽略、错误传播。拆成大纲 → 正文 → 校对三步，每步只做一件事，就是管道过滤器 + 模板方法。

多的一层是gate：每步后用代码判格式/长度/关键词，不过就停或重试，不让错往下流。全链打trace-id。这是xindoo第1章的核心。

### 3. 路由 + Guardrails：策略 + 代理，直接复用

路由即Strategy：先分诊（客服/退款/技术），再进专用prompt/工具/模型，难的走大模型、易的走小模型。留default兜底，因为分类器本身会分错。

Guardrails即保护代理 + 熔断：input / tool-call / tool-response / output四点拦截，只检输出是典型反模式。生产三板斧一个不能少：最大步数/钱上限、HITL低置信转人工、trajectory回放做eval。

## 二、要改造的两组

### 4. 反思：装饰器 + 备忘录，但终止条件是自然语言

生成者写一版，批判者照标准改一版，HumanEval 80% → 91%就靠这多看一眼。像装饰器包增强，像备忘录存中间稿。

不像的是：改到什么时候停，代码说不清。必须硬cap 2-3轮，且标准可验证（单测过、名单命中、格式器过）。先跑外部校验再让LLM改，只存diff省token。无标准答案的创意写作别用。

### 5. 并行 + Orchestrator：分治 + 中介，但任务运行时才定

Sectioning分治、Voting多路取优再聚合，就是Fork-Join和N-Version投票，差异最小。Orchestrator是动态版：中央LLM看输入现拆活、分给worker、再聚合，像Mediator + Supervisor。

写好：worker输入输出定schema，Supervisor只分发不干活，并发加聚合超时，全轨迹logging否则挂了查不清。

## 三、无对标的三者：Agent真正的增量

### 6. ReAct + 规划：运行时解释执行

ReAct循环：想一步 → 调工具 → 看结果 → 再想（Yao 2022）。规划是粗版ReAct：先列多步再走。长计划随步数退化，生产配方都是大计划粗分 + 每步内小ReAct + 步步grounding。

这是唯一无GoF祖先的。状态机转移是写死的，ReAct下一步是模型定的。所以必须Bounded：最大步/次/时三限，计划先打印给人看，失败回退上一步。流程固定的老实用提示链，别为智能而规划。

### 7. 多智能体：像微服务，但通信是自然语言

单context装不下多角色才拆：研究员 / coder / 评审各一agent。拓扑三选一：Chain顺序、Star集中、Mesh对等；Microsoft叫Sequential / Concurrent / GroupChat / Handoff / Magentic。

像微服务分工，不像的是线上传的是自然语言，会drift、会互甩锅。先单agent顶，顶不住再拆，是头号反模式Over-Agentification的解药。Handoff协议写死，A2A/MCP互通，Supervisor别下场干活。

## 收尾：写好Agent检查单

按失败加模式，别按想象加：

单调用 + 工具 → 验证挂了加反思 → 步骤不定加规划 → 角色装不下才上多智能体 → 全程挂Bounded + Guardrail + Logging。

上线前五问：ACI文档实习生能看懂吗？最大步数钱上限有吗？四点拦截做了吗？低置信转人工了吗？20条黄金用例能回放吗？全是yes，即可发。

参考文献：Anthropic Building Effective Agents；DeepLearning.AI The Batch；ReAct `arXiv:2210.03629`；Reflexion `arXiv:2303.11366`；Augment 2026 Catalog；Microsoft AI Agent Orchestration Patterns；xindoo/agentic-design-patterns 第1/5/7/12/18/19章。
