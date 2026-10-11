import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: '学习笔记',
    description: '学习笔记 — 智能体与递归自我改进',
    themeConfig: {
      nav: [
        { text: '首页', link: '/' },
        {
          text: '智能体',
          items: [
            { text: '智能体笔记', link: '/posts/agent-harness' },
            { text: 'RSI 笔记', link: '/posts/rsi' },
            { text: 'Agent手册', link: '/posts/agent-manual' },
            { text: '从GoF到Agent模式', link: '/posts/gof-agent' },
            { text: 'Agent评估笔记', link: '/posts/agent-eval' },
          ],
        },
        {
          text: '后端',
          items: [
            { text: 'Go笔记', link: '/posts/go' },
            { text: '存储笔记', link: '/posts/storage' },
            { text: '系统设计笔记', link: '/posts/sysdesign' },
            { text: 'Java/Python笔记', link: '/posts/java-python' },
            { text: '基础笔记', link: '/posts/basics' },
            { text: '算法笔记', link: '/posts/algo' },
          ],
        },
        {
          text: '经济',
          items: [
            { text: '股市笔记', link: '/posts/econ-principles' },
            { text: '交易流派', link: '/posts/econ-logics' },
            { text: '半导体', link: '/posts/econ-semicon' },
            { text: '铜与贵金属', link: '/posts/econ-metals' },
            { text: '固态电池与储能', link: '/posts/econ-battery' },
            { text: 'AI债务周期', link: '/posts/econ-aidebt' },
            { text: '思维工具', link: '/posts/econ-tools' },
          ],
        },
      ],
      sidebar: [
        {
          text: '智能体',
          collapsed: true,
          items: [
            { text: '智能体笔记', link: '/posts/agent-harness' },
            { text: 'RSI 笔记', link: '/posts/rsi' },
            { text: 'Agent手册', link: '/posts/agent-manual' },
            { text: '从GoF到Agent模式', link: '/posts/gof-agent' },
            { text: 'Agent评估笔记', link: '/posts/agent-eval' },
          ],
        },
        {
          text: '后端',
          collapsed: true,
          items: [
            { text: 'Go笔记', link: '/posts/go' },
            { text: '存储笔记', link: '/posts/storage' },
            { text: '系统设计笔记', link: '/posts/sysdesign' },
            { text: 'Java/Python笔记', link: '/posts/java-python' },
            { text: '基础笔记', link: '/posts/basics' },
            { text: '算法笔记', link: '/posts/algo' },
          ],
        },
        {
          text: '经济',
          collapsed: true,
          items: [
            { text: '股市笔记', link: '/posts/econ-principles' },
            { text: '交易流派', link: '/posts/econ-logics' },
            { text: '半导体', link: '/posts/econ-semicon' },
            { text: '铜与贵金属', link: '/posts/econ-metals' },
            { text: '固态电池与储能', link: '/posts/econ-battery' },
            { text: 'AI债务周期', link: '/posts/econ-aidebt' },
            { text: '思维工具', link: '/posts/econ-tools' },
          ],
        },
      ],
      socialLinks: [{ icon: 'github', link: 'https://github.com/gshkuang' }],
      search: { provider: 'local' },
      lastUpdated: {
        text: '最后更新于',
        formatOptions: { dateStyle: 'short', timeStyle: 'short' },
      },
      footer: {
        message: '笔记持续更新中',
        copyright: 'Copyright © 2026 gshkuang',
      },
      outline: { level: [2, 3], label: '本页目录' },
    },
  })
)
