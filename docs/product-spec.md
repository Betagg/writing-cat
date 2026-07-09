# 产品文档 V1：写作猫

## 1. Context and Goals

**产品名称：** 写作猫

**产品定位：**  
一个网页版 AI 公众号写作产品。用户首次使用时输入过往写作内容，写作猫学习其写作风格，并通过“风格试写校准”确认偏好的写作方向。确认后的风格 must 存入“风格库”，后续用户只需要选择风格、输入主题或材料，即可生成一篇“有用户写作影子，但质量更高”的公众号文章。

**一句话定位：**

> 学会你的写作风格，然后帮你写出更像你、也更好的公众号文章。

**品牌气质：**

- 克制
- 聪明
- 亲近
- 有编辑感
- 有一点可爱，但不幼稚

**Logo 方向：**

写作猫 logo should 使用一只手绘简笔画小猫。  
小猫形象 should 简洁、松弛、有一点“陪你写稿”的感觉。  
Logo must not 走卡通幼教风、表情包风、宠物 App 风。

建议形态：

- 黑色线稿小猫
- 圆眼或眯眼
- 可带一支笔、纸张、光标或小尾巴
- 线条保持手绘感
- 适合在 24px、32px、48px 尺寸下识别

## 2. Core User Flow

### Step 1：输入历史文章

用户首次使用某个写作风格时，粘贴或上传 3-10 篇历史文章。

写作猫 must 分析：

- 常写主题
- 开头方式
- 结构习惯
- 观点表达方式
- 语气和情绪浓度
- 常用句式
- 禁忌表达
- 可提升点

但写作猫 should not 立即只展示抽象风格画像。

### Step 2：风格试写校准

这是 V1 的关键体验。

写作猫 must 在分析完历史文章后，自动选择一个与用户历史内容接近、但不重复的主题，并生成 3 个短段落样例。

三个样例 must 分别代表：

1. **原风格贴近版**：更像用户原本的表达方式，保留句式、节奏和判断习惯。
2. **清晰增强版**：保留用户风格，但结构更清楚、表达更顺、公众号阅读感更强。
3. **传播增强版**：保留用户气质，但标题感、开头张力和观点锋利度更强。

用户 must 能选择：

- 我喜欢 A
- 我喜欢 B
- 我喜欢 C
- 混合 A 和 B
- 都不太像，重新生成
- 我想手动描述一下

**设计意图：**  
风格不是靠系统说出来的，而是靠试写样例让用户判断出来的。

示例文案：

> 写作猫试着用你的方式写了三小段。  
> 你不用判断哪段“最好”，只要选哪段更接近你想要的方向。

### Step 3：保存到风格库

用户完成样例选择后，写作猫生成最终风格画像。

风格画像 must 结合：

- 历史文章分析
- 用户选择的试写版本
- 用户手动补充意见

风格画像 should 包括：

- 写作人格总结
- 常用结构
- 观点表达方式
- 语气边界
- 标题偏好
- 不适合的表达
- 质量提升方向

确认后的风格画像 must 保存到风格库。

风格库 must 支持：

- 选择一个已保存风格
- 编辑风格名称、写作人格、结构习惯、质量提升方向
- 保存修改
- 删除不再使用的风格
- 在试写成稿页直接切换当前风格

后续用户打开产品时，系统 should 自动载入上次使用的风格，并优先引导用户直接输入主题或材料。

示例：

> 我会保留你的判断型表达和编号结构，但在正式写作时，会比原文更强调段落收束和读者阅读节奏。  
> 目标不是完全复刻，而是生成“更清晰的你”。

### Step 4：选择风格，输入主题或材料，先试写再成稿

用户输入：

- 一个选题
- 一段资料
- 一篇参考文章
- 一组零散观点

写作猫 must 先生成一段试写片段，而不是直接生成完整文章。

如果用户已经保存过风格，写作猫 must 允许用户跳过历史文章输入与试写校准，直接从当前风格和新主题开始。

试写片段 must：

- 直接写成正文片段，而不是写作方案。
- 让用户能判断“这个味道对不对”。
- 控制在 400-600 字左右。
- 保留用户风格影子，同时展示更好的结构和表达。

用户确认试写片段后，写作猫生成完整公众号文章。

文章生成后，用户 should 能通过快捷指令继续修改。
快捷编辑区 should 默认折叠，只在用户需要微调时展开，避免打断生成和复制正文的主流程。
完整文章生成后，系统 must 自动保存到文章库，方便用户之后找回。

编辑指令分为两组：

**更像我：**

- 少一点 AI 味
- 更像我的语气
- 去掉营销感
- 结尾更克制
- 多一点个人判断

**写得更好：**

- 标题更有吸引力
- 开头更抓人
- 结构更清楚
- 案例更有说服力
- 压缩篇幅
- 更适合公众号阅读

### Step 5：文章库

文章库 must 集中展示用户历史生成的完整文章。

文章库 should 支持：

- 自动保存每次生成完成的完整文章
- 展示文章标题、生成时间、使用风格和主题摘要
- 打开历史文章并回到编辑器继续编辑
- 删除不再需要的历史文章

V1 文章库 can 使用浏览器本地存储，不需要账号系统。

## 3. Design Tokens and Foundations

### Visual Intent

界面 must 克制、清爽、阅读优先。  
产品 should 参考 Medium，让内容成为视觉中心。  
写作猫的可爱感 should 主要来自 logo 和少量微文案，而不是大面积插画或装饰。

### Typography Tokens

```text
font.family.primary = sohne
font.family.stack = sohne, Helvetica Neue, Helvetica, Arial, sans-serif

font.size.xs = 11px
font.size.sm = 13px
font.size.base = 13px
font.size.md = 13.33px
font.size.lg = 14px
font.size.xl = 16px
font.size.2xl = 24px

font.weight.base = 400
font.weight.medium = 500
font.weight.semibold = 600

font.lineHeight.base = 20px
font.lineHeight.article = 1.72
```

### Color Tokens

```text
color.surface.base = #ffffff
color.surface.subtle = #f7f7f7
color.surface.inverse = #000000

color.text.primary = #242424
color.text.secondary = #6b6b6b
color.text.muted = #8a8a8a
color.text.inverse = #ffffff

color.border.default = #e6e6e6
color.border.strong = #242424

color.action.primary = #000000
color.action.primaryText = #ffffff
color.action.secondary = #f2f2f2
color.action.secondaryText = #242424

color.state.error = #b42318
color.state.focus = #242424
```

### Spacing and Radius

```text
space.1 = 2px
space.2 = 6px
space.3 = 10px
space.4 = 12px
space.5 = 20px
space.6 = 24px
space.7 = 28px
space.8 = 40px

radius.xs = 6px
radius.sm = 10px
radius.pill = 1320px

motion.duration.instant = 300ms
```

## 4. Brand and Logo Rules

### Logo

**Primary logo：**  
一只手绘简笔画小猫 + “写作猫”文字。

**Logo must：**

- 使用单色线条为主。
- 在小尺寸下仍可识别。
- 与 Medium 风格的极简界面兼容。
- 看起来像“写作陪伴者”，不是儿童品牌。

**Logo should：**

- 带一点手写感。
- 可以有轻微不完美线条。
- 可以把猫尾巴处理成笔画、光标或句号。
- 适合用于 favicon、顶部导航、空状态。

**Logo must not：**

- 使用复杂渐变。
- 使用拟物猫咪插画。
- 使用过度可爱的表情包风格。
- 使用高饱和色块作为主要识别。

### Logo Prompt Reference

用于生成或交付设计时可参考：

> A minimal hand-drawn line logo of a small cat for a writing assistant product, black ink, simple strokes, slightly imperfect hand sketch, calm and clever expression, subtle pen or cursor detail, white background, editorial and minimal, not childish, not cartoon mascot.

## 5. Component-Level Rules

### Sample Option Card

用于展示 Step 2 的三个试写样例。

**Anatomy：**

- 版本标签：A / B / C
- 风格说明
- 试写正文
- 选择按钮
- 反馈入口

**States must include：**

- Default
- Hover
- Focus-visible
- Active
- Selected
- Disabled
- Loading
- Error

**Rules：**

- Card must show clear difference between three versions.
- Selected card must have visible border and state label.
- Long sample text must wrap naturally.
- Card should not use heavy shadows.
- User must be able to select via keyboard.

### Style Profile Card

展示最终风格画像。

**Rules：**

- Style Profile must be editable.
- Every insight should include具体观察。
- It must avoid空泛评价，比如“你的文章很高级”。
- It should explain why 写作猫 made a style judgment.

### Preview Draft Card

正式写作前的风格确认。

**Rules：**

- 写作猫 must generate a preview draft before the full article.
- Preview draft must be正文片段, not outline or plan.
- User must be able to regenerate preview draft.
- Full article generation should happen in the same step after preview confirmation.

### Article Editor

**Rules：**

- Editor must support paragraph-level rewrite.
- Generated article must preserve chosen style direction.
- User must be able to copy Markdown and plain text.
- Empty state must clearly tell user下一步做什么。
- Loading state must prevent duplicate generation.

### Article History

**Rules：**

- Full article generation must create a history entry automatically.
- History item must preserve article body, topic, style name, preview snippet, and created time.
- User must be able to reopen a historical article into the editor.
- User must be able to delete a historical article.
- Empty state must explain that generated articles will appear here.

### Completion Feedback

任务完成后，写作猫 should 给出轻量提示，降低用户等待后的不确定感。

**Rules：**

- AI 任务完成 must 更新文字状态。
- AI 任务完成 should 播放一次短提示音。
- 提示音 must 只在用户发生过点击或键盘交互后播放，避免违反浏览器自动播放策略。
- 提示音 must 不阻塞文章生成、复制或编辑流程；如果浏览器拦截播放，功能 should 安静失败。

## 6. Accessibility Requirements

- Product must meet WCAG 2.2 AA.
- All controls must be keyboard accessible.
- Focus-visible state must be visible.
- Text contrast must pass AA.
- Error messages must be specific and associated with inputs.
- Loading state must be announced to screen readers.
- Touch targets should be at least 44px height on mobile.
- Logo must not be the only way to identify the product name; text label “写作猫” must be present in primary navigation.

**Pass / Fail examples：**

- Pass：用户可用 Tab 选择 A/B/C 试写样例。
- Fail：选中卡片只靠颜色区分。
- Pass：错误提示为“至少需要 3 篇样本文章”。
- Fail：错误提示只写“失败”。

## 7. Content and Tone Standards

### Product Tone

- Calm
- Editorial
- Clear
- Slightly human
- Not salesy
- Not motivational

### Brand Voice

写作猫 should 像一个聪明、安静、有判断力的编辑。  
它可以有一点温度，但不能过度卖萌。

### Good Copy

> 写作猫试着用你的方式写了三小段，你选一个更接近你想要的方向。

> 这版更像你的原始表达，但我保留了一点结构增强。

> 这段有点资料汇总，我可以帮你改得更像判断型表达。

> 我会保留你的声音，但帮你把结构收得更稳一点。

### Bad Copy

> 喵！主人，我已经帮你生成爆款啦！

> 一键生成爆款神文。

> AI 已深度赋能你的超级写作生产力。

> 你的文风非常高级，非常有思想。

## 8. Anti-Patterns

- Do not skip style trial writing.
- Do not only output abstract style labels.
- Do not overfit口癖 while ignoring judgment and structure.
- Do not generate final article before user confirms preview draft style.
- Do not make UI look like a complex CMS.
- Do not use vague buttons like “优化一下”。
- Do not hide why the product made a style judgment.
- Do not sacrifice readability for feature density.
- Do not overuse cat-themed copy.
- Do not make the brand feel like a toy.

## 9. V1 Success Metrics

- 用户是否选择了一个试写样例。
- 用户是否认为试写样例“像我”。
- 用户是否保存风格画像。
- 用户是否生成第二篇文章。
- 用户是否使用“更像我”编辑按钮。
- 用户是否复制最终稿。
- 用户是否认为最终稿“像我但更好”。

## 10. QA Checklist

- [ ] 用户能输入 3-10 篇历史文章。
- [ ] 系统能识别历史文章主题。
- [ ] 系统能生成 3 个风格试写样例。
- [ ] 用户能选择或重新生成样例。
- [ ] 系统能基于选择更新风格画像。
- [ ] 用户能输入新主题或材料。
- [ ] 系统先生成一段试写片段。
- [ ] 用户确认试写风格后生成完整文章。
- [ ] 完整文章会自动保存到文章库。
- [ ] 用户能从文章库打开历史文章。
- [ ] 用户能删除历史文章。
- [ ] 文章保留用户风格影子。
- [ ] 文章比原始材料更清楚、更完整。
- [ ] Logo 在 24px、32px、48px 下可识别。
- [ ] 顶部导航同时显示 logo 和“写作猫”文字。
- [ ] 所有交互组件有 default、hover、focus-visible、active、disabled、loading、error 状态。
- [ ] 页面可完整键盘操作。
- [ ] 文本对比度通过 WCAG AA。
- [ ] 最终稿支持 Markdown 和纯文本复制。

## 11. Product Principle

> 不替代作者，而是把作者最好的一面稳定发挥出来。
