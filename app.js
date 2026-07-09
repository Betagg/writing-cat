const state = {
  samples: "",
  sampleCount: 0,
  chosenMode: "",
  profileSaved: false,
  styleProfile: null,
  styleLibrary: [],
  activeStyleId: "",
  articleHistory: [],
  trials: null,
  preview: "",
  article: "",
};

const STYLE_LIBRARY_KEY = "writing-cat-style-library";
const ACTIVE_STYLE_KEY = "writing-cat-active-style";
const ARTICLE_HISTORY_KEY = "writing-cat-article-history";
let soundPrimed = false;

const demoSamples = `Coding 的本质不是写代码，而是人在数字世界中的创造活动。Coding agent 这个词可能迷惑了很多人，它让人觉得这只是帮人类写代码的工具，但实际上，它更像是一个通用创造工具。

---

浅谈 Agent 设计。产品即人格，人格即产品。真正定义一个人的，不是能力，而是选择。对于一个智能系统，亦然。

---

把水放在手边。最近我发现，把瓶装水分散放在家里高频出现的位置之后，我的饮水量明显提高。这个操作让我意识到，人性可以被非常小的环境变化影响。

---

张忠谋自传读书笔记。商业模式层的创新是很大的创新，商业模式如何定义取决于你的客户是谁，不取决于你的产品。`;

const trialCopies = {
  A: {
    title: "A｜更像原来的写法",
    tag: "保留原有节奏",
    body:
      "AI 写作这个词可能也迷惑了很多人。它会让人觉得，这不过是一个把文字写快一点的工具。\n\n但我现在越来越觉得，真正重要的不是“写得更快”，而是它能不能理解一个人的表达方式。因为对一个长期写作者而言，文字不是内容容器，而是一种人格的外显。",
  },
  B: {
    title: "B｜更清晰的公众号版",
    tag: "像你，但更顺",
    body:
      "AI 写作的核心问题，不是能不能生成文章，而是生成出来的东西像不像作者自己。\n\n如果一篇文章结构完整、表达流畅，但读起来完全没有作者的影子，那它只是一个合格的内容产品，不是一篇真正属于这个人的文章。所以好的 AI 写作工具，应该先学会保留作者的声音，再帮他把结构和表达往上抬一层。",
  },
  C: {
    title: "C｜更有传播感的版本",
    tag: "观点更锋利",
    body:
      "未来最稀缺的写作能力，可能不是会不会写，而是还能不能写得像自己。\n\nAI 会让大量文章变得更正确、更完整，也更相似。对公众号作者来说，真正有价值的工具，不是替你写一篇“标准好文”，而是把你原本最有辨识度的那部分，稳定放大。",
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function setStatus(text) {
  $("#statusText").textContent = text;
}

function setWriterProgress(isActive, label = "写作猫正在写") {
  const progress = $("#writerProgress");
  const progressLabel = $("#writerProgressLabel");
  if (!progress || !progressLabel) return;
  progressLabel.textContent = label;
  progress.classList.toggle("is-active", isActive);
  progress.setAttribute("aria-hidden", isActive ? "false" : "true");
}

function setButtonPending(button, isPending, pendingText) {
  if (!button) return;
  if (!button.dataset.idleText) button.dataset.idleText = button.textContent;
  button.disabled = isPending;
  button.textContent = isPending ? pendingText : button.dataset.idleText;
  button.setAttribute("aria-busy", isPending ? "true" : "false");
}

function getTaskCompleteSound() {
  return $("#taskCompleteSound");
}

function primeTaskCompleteSound() {
  const sound = getTaskCompleteSound();
  if (!sound || soundPrimed) return;
  sound.volume = 0.82;
  soundPrimed = true;
  sound.muted = true;
  sound
    .play()
    .then(() => {
      sound.pause();
      sound.currentTime = 0;
      sound.muted = false;
    })
    .catch(() => {
      sound.muted = false;
      sound.load();
    });
}

function playTaskCompleteSound() {
  const sound = getTaskCompleteSound();
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function createStyleId() {
  return `style-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createArticleId() {
  return `article-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readStyleFields() {
  return {
    name: $("#profileNameInput").value.trim(),
    persona: $("#personaText").value.trim(),
    structure: $("#structureText").value.trim(),
    upgrade: $("#upgradeText").value.trim(),
  };
}

function getActiveStyle() {
  return state.styleLibrary.find((style) => style.id === state.activeStyleId) || null;
}

function writeStyleFields(style = {}) {
  $("#profileNameInput").value = style.name || "";
  $("#personaText").value = style.persona || "";
  $("#structureText").value = style.structure || "";
  $("#upgradeText").value = style.upgrade || "";
}

function loadStyleLibrary() {
  try {
    const saved = JSON.parse(localStorage.getItem(STYLE_LIBRARY_KEY) || "[]");
    state.styleLibrary = Array.isArray(saved)
      ? saved.filter((style) => style && style.id && style.persona && style.structure && style.upgrade)
      : [];
    const savedActiveId = localStorage.getItem(ACTIVE_STYLE_KEY) || "";
    state.activeStyleId = state.styleLibrary.some((style) => style.id === savedActiveId)
      ? savedActiveId
      : state.styleLibrary[0]?.id || "";
  } catch {
    state.styleLibrary = [];
    state.activeStyleId = "";
  }
}

function loadArticleHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(ARTICLE_HISTORY_KEY) || "[]");
    state.articleHistory = Array.isArray(saved)
      ? saved.filter((article) => article && article.id && article.body).slice(0, 80)
      : [];
  } catch {
    state.articleHistory = [];
  }
}

function persistArticleHistory() {
  localStorage.setItem(ARTICLE_HISTORY_KEY, JSON.stringify(state.articleHistory));
}

function persistStyleLibrary() {
  localStorage.setItem(STYLE_LIBRARY_KEY, JSON.stringify(state.styleLibrary));
  if (state.activeStyleId) {
    localStorage.setItem(ACTIVE_STYLE_KEY, state.activeStyleId);
  } else {
    localStorage.removeItem(ACTIVE_STYLE_KEY);
  }
}

function renderStyleOptions(select, includeEmpty = true) {
  if (!select) return;
  select.innerHTML = includeEmpty ? '<option value="">未选择风格</option>' : "";
  state.styleLibrary.forEach((style) => {
    const option = document.createElement("option");
    option.value = style.id;
    option.textContent = style.name || "未命名风格";
    select.appendChild(option);
  });
  select.value = state.activeStyleId || "";
  select.disabled = state.styleLibrary.length === 0;
}

function updateStyleHint() {
  const activeStyle = getActiveStyle();
  $("#styleHint").textContent = activeStyle
    ? `正在使用「${activeStyle.name || "未命名风格"}」。之后可以直接给主题，不必重新校准。`
    : "首次使用需要先校准并保存一个风格。";
}

function renderStyleLibrary() {
  $("#styleCount").textContent = `${state.styleLibrary.length} 个风格`;
  renderStyleOptions($("#styleSelect"));
  renderStyleOptions($("#planStyleSelect"));
  $("#deleteStyleBtn").disabled = !state.activeStyleId;
  $("#useStyleBtn").disabled = !state.activeStyleId;
  updateStyleHint();
}

function resetDraftForNewTopic() {
  state.preview = "";
  state.article = "";
  $("#previewCard").textContent = "";
  $("#articleOutput").value = "";
  $("#articleBtn").disabled = true;
}

function getArticleTitle(text, topic) {
  const firstLine = text
    .split("\n")
    .map((line) => line.replace(/^#+\s*/, "").trim())
    .find(Boolean);
  if (firstLine) return firstLine.slice(0, 44);
  return (topic || "未命名文章").slice(0, 44);
}

function formatDateTime(value) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderArticleHistory() {
  const list = $("#historyList");
  if (!list) return;
  $("#historyCount").textContent = `${state.articleHistory.length} 篇文章`;
  if (state.articleHistory.length === 0) {
    list.innerHTML = '<p class="empty-state">还没有历史文章。生成完整文章后，会自动出现在这里。</p>';
    return;
  }
  list.innerHTML = "";
  state.articleHistory.forEach((article) => {
    const item = document.createElement("article");
    item.className = "history-item";
    const articleId = escapeHtml(article.id);
    const createdAt = escapeHtml(formatDateTime(article.createdAt));
    const styleName = escapeHtml(article.styleName || "未命名风格");
    const title = escapeHtml(article.title || "未命名文章");
    const excerpt = escapeHtml((article.topic || article.body || "").slice(0, 120));
    item.innerHTML = `
      <div class="history-item-main">
        <div class="history-meta">
          <span>${createdAt}</span>
          <span>${styleName}</span>
        </div>
        <h4>${title}</h4>
        <p>${excerpt}</p>
      </div>
      <div class="history-actions">
        <button class="button button-secondary" data-open-article="${articleId}">打开</button>
        <button class="button button-secondary" data-delete-article="${articleId}">删除</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function saveArticleToHistory() {
  const body = state.article.trim();
  if (!body) return;
  const activeStyle = getActiveStyle();
  const topic = $("#topicInput").value.trim();
  const article = {
    id: createArticleId(),
    title: getArticleTitle(body, topic),
    topic,
    preview: state.preview,
    body,
    styleId: activeStyle?.id || "",
    styleName: activeStyle?.name || readStyleFields().name || "当前风格",
    createdAt: new Date().toISOString(),
  };
  state.articleHistory = [article, ...state.articleHistory].slice(0, 80);
  persistArticleHistory();
  renderArticleHistory();
}

function openHistoryArticle(id) {
  const article = state.articleHistory.find((item) => item.id === id);
  if (!article) return;
  $("#topicInput").value = article.topic || "";
  state.preview = article.preview || "";
  state.article = article.body || "";
  $("#previewCard").textContent = state.preview;
  $("#articleOutput").value = state.article;
  $("#articleBtn").disabled = !state.preview;
  setStatus("已打开历史文章");
  switchPanel("panel-plan");
}

function deleteHistoryArticle(id) {
  state.articleHistory = state.articleHistory.filter((article) => article.id !== id);
  persistArticleHistory();
  renderArticleHistory();
  setStatus("已删除历史文章");
}

function selectStyle(styleId) {
  if (!styleId) {
    state.activeStyleId = "";
    state.styleProfile = null;
    writeStyleFields({});
    renderStyleLibrary();
    return;
  }
  const style = state.styleLibrary.find((item) => item.id === styleId);
  if (!style) return;
  state.activeStyleId = style.id;
  state.styleProfile = {
    persona: style.persona,
    structure: style.structure,
    upgrade: style.upgrade,
  };
  writeStyleFields(style);
  persistStyleLibrary();
  renderStyleLibrary();
  setStatus(`已选择「${style.name || "未命名风格"}」`);
}

function saveCurrentStyle() {
  const fields = readStyleFields();
  if (!fields.persona || !fields.structure || !fields.upgrade) {
    setStatus("请先补全风格画像");
    return;
  }
  const now = new Date().toISOString();
  const existing = getActiveStyle();
  const style = {
    id: existing?.id || createStyleId(),
    name: fields.name || existing?.name || `我的写作风格 ${state.styleLibrary.length + 1}`,
    persona: fields.persona,
    structure: fields.structure,
    upgrade: fields.upgrade,
    mode: state.chosenMode || existing?.mode || "B",
    updatedAt: now,
    createdAt: existing?.createdAt || now,
  };
  if (existing) {
    state.styleLibrary = state.styleLibrary.map((item) => (item.id === existing.id ? style : item));
  } else {
    state.styleLibrary = [style, ...state.styleLibrary];
  }
  state.activeStyleId = style.id;
  state.styleProfile = {
    persona: style.persona,
    structure: style.structure,
    upgrade: style.upgrade,
  };
  writeStyleFields(style);
  persistStyleLibrary();
  renderStyleLibrary();
  setStatus(`已保存「${style.name}」，以后可以直接给主题`);
  playTaskCompleteSound();
  switchPanel("panel-plan");
}

function createBlankStyle() {
  state.activeStyleId = "";
  state.styleProfile = null;
  state.chosenMode = "";
  writeStyleFields({ name: `新的写作风格 ${state.styleLibrary.length + 1}` });
  renderStyleLibrary();
  setStatus("正在新建风格，可编辑后保存");
}

function deleteActiveStyle() {
  const style = getActiveStyle();
  if (!style) return;
  state.styleLibrary = state.styleLibrary.filter((item) => item.id !== style.id);
  state.activeStyleId = state.styleLibrary[0]?.id || "";
  persistStyleLibrary();
  const nextStyle = getActiveStyle();
  writeStyleFields(nextStyle || {});
  renderStyleLibrary();
  setStatus("已删除当前风格");
}

async function callWritingApi(payload) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.error || "API request failed");
  }
  return result.data;
}

function switchPanel(id) {
  $$(".panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === id));
  $$(".rail-item").forEach((item) => item.classList.toggle("is-active", item.dataset.target === id));
  const panel = document.getElementById(id);
  if (panel) panel.focus({ preventScroll: true });
}

function estimateSampleCount(text) {
  const chunks = text
    .split(/\n-{3,}\n|\n\n(?=.{8,}。)|\n(?=标题[:：])/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 40);
  return chunks.length;
}

function updateSampleCounter() {
  const text = $("#sampleInput").value.trim();
  state.samples = text;
  state.sampleCount = estimateSampleCount(text);
  $("#sampleCounter").textContent = `${state.sampleCount} 篇样本`;
}

function renderTrials() {
  const grid = $("#trialGrid");
  const trials = state.trials || trialCopies;
  grid.innerHTML = "";
  Object.entries(trials).forEach(([key, trial]) => {
    const card = document.createElement("article");
    card.className = "trial-card";
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <div class="trial-label">
        <strong>${trial.title}</strong>
        <span>${trial.tag}</span>
      </div>
      <p class="trial-body">${trial.body}</p>
      <button class="button button-secondary" data-mode="${key}">选这个方向</button>
    `;
    grid.appendChild(card);
  });
}

function selectMode(mode) {
  state.chosenMode = mode;
  state.activeStyleId = "";
  $$(".trial-card").forEach((card) => {
    const button = card.querySelector("[data-mode]");
    const selected = button.dataset.mode === mode;
    card.classList.toggle("is-selected", selected);
    button.textContent = selected ? "已选择" : "选这个方向";
  });

  const modeText = {
    A: "原风格贴近版",
    B: "清晰增强版",
    C: "传播增强版",
  }[mode];

  $("#profileNameInput").value = modeText;
  $("#personaText").value =
    state.styleProfile?.persona ||
    "你的文章更像判断型随笔：先提出一个看似普通的问题，再往后拆出一个更底层的判断。语气克制，不追求高密度金句，喜欢用“本质上”“这里有个误区”推进论证。";
  $("#structureText").value =
    state.styleProfile?.structure ||
    "适合使用编号结构：先给出核心判断，再拆成 3-5 个层次，每节都用一个具体例子或现实成本支撑，结尾轻收束，不喊口号。";
  $("#upgradeText").value = state.styleProfile?.upgrade || (
    mode === "A"
      ? "保留原表达的自然感，少做外显包装，只在段落收束和案例支撑上增强。"
      : mode === "B"
      ? "保留原风格影子，同时强化结构、段落节奏和公众号阅读体验。"
      : "保留克制气质，但标题、开头和核心判断可以更有张力。"
  );
  renderStyleLibrary();
  setStatus(`已选择 ${modeText}`);
  switchPanel("panel-profile");
}

async function analyzeSamples() {
  const actionButton = $("#analyzeBtn");
  if (actionButton.disabled) return;
  updateSampleCounter();
  if (state.sampleCount < 3) {
    $("#sampleHelp").textContent = "至少需要 3 篇样本文章。可以先点“填入示例”体验完整流程。";
    $("#sampleHelp").style.color = "var(--color-state-error)";
    return;
  }
  setStatus("正在分析风格并生成试写样例");
  setWriterProgress(true, "写作猫正在拆你的风格");
  setButtonPending(actionButton, true, "分析中");
  try {
    const data = await callWritingApi({
      task: "generate-trials",
      samples: state.samples,
      sampleCount: state.sampleCount,
    });
    if (data.trials) state.trials = data.trials;
    if (data.profile) state.styleProfile = data.profile;
    $("#sampleHelp").textContent = "已完成风格分析。写作猫先试写三段，你选一个方向。";
  } catch {
    state.trials = trialCopies;
    state.styleProfile = null;
    $("#sampleHelp").textContent = "API 暂未配置，已使用本地示例继续体验完整流程。";
  } finally {
    setWriterProgress(false);
    setButtonPending(actionButton, false);
  }
  $("#sampleHelp").style.color = "var(--color-text-secondary)";
  renderTrials();
  setStatus("已生成三段风格试写样例");
  playTaskCompleteSound();
  switchPanel("panel-trials");
}

async function generatePreview() {
  const actionButton = $("#previewBtn");
  if (actionButton.disabled) return;
  const topic = $("#topicInput").value.trim();
  if (!topic) {
    setStatus("请先输入主题或材料");
    $("#topicInput").focus();
    return;
  }
  const activeStyle = getActiveStyle();
  const mode = state.chosenMode || activeStyle?.mode || "B";
  const styleProfile = activeStyle || readStyleFields();
  state.preview = "";
  state.article = "";
  $("#previewCard").textContent = "";
  $("#articleOutput").value = "";
  $("#articleBtn").disabled = true;
  setStatus("正在生成试写片段");
  setWriterProgress(true, "写作猫正在试写一段");
  setButtonPending(actionButton, true, "试写中");
  try {
    const data = await callWritingApi({
      task: "generate-preview",
      samples: state.samples,
      sampleCount: state.sampleCount,
      mode,
      styleProfile: {
        persona: styleProfile.persona,
        structure: styleProfile.structure,
        upgrade: styleProfile.upgrade,
      },
      topic,
    });
    if (data.text) {
      state.preview = data.text;
      $("#previewCard").textContent = state.preview;
      $("#articleBtn").disabled = false;
      setStatus("试写片段已生成，确认风格后可以写完整文章");
      setWriterProgress(false);
      playTaskCompleteSound();
      switchPanel("panel-plan");
      return;
    }
  } catch {
    setStatus("API 暂未配置，已使用本地示例生成试写片段");
  } finally {
    setWriterProgress(false);
    setButtonPending(actionButton, false);
  }
  state.preview = `出海做视频还有机会吗？

当然还有。

但这个机会，已经不是“随便搬几条视频，换个语言，发到 YouTube 或 TikTok 就能赚钱”的机会了。那种粗糙红利，基本已经过去。

真正还在的机会，是更底层的：视频正在成为当代人获取信息、娱乐、学习和消费决策的核心形式。以前人读文章、看图文、逛论坛，现在越来越多时间被视频吃掉。短视频解决即时刺激，长视频解决深度理解，直播解决互动和交易。

这么大的媒介迁移里，不可能只有头部玩家有机会。只要人还需要学习、娱乐、购买、陪伴、认同和信任，视频内容就会不断出现新位置。`;
  $("#previewCard").textContent = state.preview;
  $("#articleBtn").disabled = false;
  setStatus("试写片段已生成，确认风格后可以写完整文章");
  playTaskCompleteSound();
  switchPanel("panel-plan");
}

async function generateArticle() {
  const actionButton = $("#articleBtn");
  if (actionButton.disabled) return;
  if (!state.preview) {
    await generatePreview();
    return;
  }
  const activeStyle = getActiveStyle();
  const styleProfile = activeStyle || readStyleFields();
  const persona = styleProfile.persona || "判断型随笔";
  setStatus("正在生成文章");
  setWriterProgress(true, "写作猫正在写正文");
  setButtonPending(actionButton, true, "生成中");
  try {
    const data = await callWritingApi({
      task: "generate-article",
      samples: state.samples,
      sampleCount: state.sampleCount,
      mode: state.chosenMode || activeStyle?.mode || "B",
      styleProfile: {
        persona: styleProfile.persona,
        structure: styleProfile.structure,
        upgrade: styleProfile.upgrade,
      },
      topic: $("#topicInput").value.trim(),
      preview: state.preview,
    });
    if (data.text) {
      state.article = data.text;
      $("#articleOutput").value = state.article;
      saveArticleToHistory();
      setStatus("文章已生成，可以继续微调");
      setWriterProgress(false);
      playTaskCompleteSound();
      switchPanel("panel-plan");
      return;
    }
  } catch {
    setStatus("API 暂未配置，已使用本地示例生成文章");
  } finally {
    setWriterProgress(false);
    setButtonPending(actionButton, false);
  }
  state.article = `# 出海做视频还有机会吗？

当然还有。

但这个机会，已经不是“随便搬几条视频，换个语言，发到 YouTube 或 TikTok 就能赚钱”的机会了。那种粗糙红利，基本已经过去。

真正还在的机会，是更底层的：视频正在成为当代人获取信息、娱乐、学习和消费决策的核心形式。以前人读文章、看图文、逛论坛，现在越来越多时间被视频吃掉。短视频解决即时刺激，长视频解决深度理解，直播解决互动和交易。

这么大的媒介迁移里，不可能只有头部玩家有机会。只要人还需要学习、娱乐、购买、陪伴、认同和信任，视频内容就会不断出现新位置。

1、先选赛道，不要先追热点。

出海做视频，第一个误区，就是盲目选择“看起来最火”的泛娱乐赛道。热闹是热闹，但流量做了不少，最后变现可能很薄。

这里有一笔很现实的经济账：不同内容品类的单播放价值，可能相差 20 倍以上。

金融、法律、SaaS、房地产、创业副业这类高客单价服务内容，YouTube 长视频 RPM 可以到 20-40 美元。核心收入也不只是广告，而是联盟营销、企业商单、课程、咨询和社群。

但这类内容真正值钱的地方，不是信息差，而是信任。你不能胡说，不能装懂，更不能靠 AI 拼一堆看似专业的废话。

2、出海不等于一上来就做英文内容。

这里有一个经常被低估的市场：海外华人。

海外华人分布在北美、东南亚、欧洲、澳洲等地，他们既保留中文内容消费习惯，又处在更高客单价的商业环境里。移民、留学、房产、税务、保险、育儿、职业发展、投资消费，这些内容未必全网爆红，但用户价值很高。

所以，出海不是一开始就要和美国本土大号硬碰硬。先服务一群你更理解的人，反而可能是更现实的路径。

3、华人创作者有几类天然优势。

第一类是文化和技艺优势，比如传统手艺、饮食、工厂制造、东方审美、中文世界里的故事。这类内容有时不需要太多语言，画面就能说明问题。

第二类是专业和职业优势。一个人的本职工作，往往就是最好的内容素材。做跨境电商的，可以讲真实运营经验；做程序员的，可以讲工具和职业路径；做房产、保险、税务、留学的，可以讲海外生活里的真实决策。

第三类是供应链和产业优势。中国拥有全球最完整的制造业供应链，很多产品本身就适合视频化。生产过程、使用场景、对比测试、改造前后，都可以变成内容。

4、AI 是效率放大器，不是内容替代品。

AI 工具的普及，是当下出海创作者最大的时代红利之一。从脚本创作、多语言配音，到字幕翻译、视频生成、自动发布，全链路都有工具可以提效。单人团队做多语言、多平台分发，放在几年前很难，今天确实可行。

但工具的边界也很清晰：它能提升效率，不能替代判断。

YouTube 和 TikTok 的规则都在收紧。纯 AI 生成、缺少人工创意介入的低质批量内容，可能被认定为重复内容，不计入有效播放，甚至影响变现资格。

换句话说，AI 负责体力活，创作者负责方向、判断、审美和信任。

5、所以，出海做视频还有机会吗？

有。

但它不是“随便发几条视频就能赚钱”的风口。它更像一门小型创业，需要选对赛道的判断力、长期深耕的定力，以及善用工具的学习力。

比较现实的路径是：先从自己熟悉的领域切入，用 AI 工具提升生产效率，靠优质内容积累信任，再逐步拓展广告分成、商单、联盟、带货、课程、咨询、自有产品和品牌。

流量红利会消退，工具会普及，但创作者本身的专业积累和内容洞察，才是穿越周期的真正底气。

出海做视频，不是把视频发到海外平台这么简单。

它更像是把自己的能力，放到一个更大的市场里重新定价。

<!-- 风格依据：${persona} -->`;
  $("#articleOutput").value = state.article;
  saveArticleToHistory();
  setStatus("文章已生成，可以继续微调");
  playTaskCompleteSound();
  switchPanel("panel-plan");
}

function rewriteArticle(type) {
  const editor = $("#articleOutput");
  if (!editor.value.trim()) {
    setStatus("请先生成文章");
    return;
  }
  const notes = {
    "less-ai": "\n\n[写作猫调整] 已降低资料汇总感：建议把连续定义改成判断 + 例子。",
    calmer: "\n\n[写作猫调整] 结尾建议更克制：先写这么多，具体赛道可以之后再拆。",
    judgment: "\n\n[写作猫调整] 可补一句个人判断：真正稀缺的不是流量技巧，而是持续服务一群人的能力。",
    title: "\n\n[标题备选]《出海做视频还有机会吗？机会还在，但玩法变了》",
    structure: "\n\n[结构建议] 可以把案例单独拆成一节，放在赛道判断之后，增强说服力。",
    shorten: "\n\n[压缩建议] 删掉重复解释，把每节控制在 3-5 段，保留判断和案例即可。",
  };
  editor.value += notes[type] || "";
  setStatus("已追加修改建议");
}

async function copyText(markdown = true) {
  const text = $("#articleOutput").value.trim();
  if (!text) {
    setStatus("没有可复制的文章");
    return;
  }
  const output = markdown ? text : text.replace(/^#+\s*/gm, "").replace(/<!--.*?-->/gs, "").trim();
  try {
    await navigator.clipboard.writeText(output);
    setStatus(markdown ? "已复制 Markdown" : "已复制纯文本");
  } catch {
    setStatus("复制失败，可以手动选择文本复制");
  }
}

document.addEventListener("pointerdown", primeTaskCompleteSound, { once: true });
document.addEventListener("keydown", primeTaskCompleteSound, { once: true });
$("#sampleInput").addEventListener("input", updateSampleCounter);
$("#topicInput").addEventListener("input", resetDraftForNewTopic);
$("#analyzeBtn").addEventListener("click", analyzeSamples);
$("#loadDemoBtn").addEventListener("click", () => {
  $("#sampleInput").value = demoSamples;
  updateSampleCounter();
  setStatus("已填入示例样本");
});
$("#regenTrialsBtn").addEventListener("click", () => {
  renderTrials();
  setStatus("已重新生成试写样例");
});
$("#trialGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (button) selectMode(button.dataset.mode);
});
$("#styleSelect").addEventListener("change", (event) => selectStyle(event.target.value));
$("#planStyleSelect").addEventListener("change", (event) => selectStyle(event.target.value));
$("#newStyleBtn").addEventListener("click", createBlankStyle);
$("#deleteStyleBtn").addEventListener("click", deleteActiveStyle);
$("#saveProfileBtn").addEventListener("click", () => {
  state.profileSaved = true;
  saveCurrentStyle();
});
$("#useStyleBtn").addEventListener("click", () => {
  if (!state.activeStyleId) {
    setStatus("请先选择或保存一个风格");
    return;
  }
  switchPanel("panel-plan");
});
$("#previewBtn").addEventListener("click", generatePreview);
$("#articleBtn").addEventListener("click", generateArticle);
$("#copyMdBtn").addEventListener("click", () => copyText(true));
$("#copyTextBtn").addEventListener("click", () => copyText(false));
$("#historyList").addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-article]");
  const deleteButton = event.target.closest("[data-delete-article]");
  if (openButton) openHistoryArticle(openButton.dataset.openArticle);
  if (deleteButton) deleteHistoryArticle(deleteButton.dataset.deleteArticle);
});
$$(".chip").forEach((chip) => chip.addEventListener("click", () => rewriteArticle(chip.dataset.rewrite)));
$$(".rail-item").forEach((item) => item.addEventListener("click", () => switchPanel(item.dataset.target)));

loadStyleLibrary();
loadArticleHistory();
if (state.activeStyleId) {
  selectStyle(state.activeStyleId);
  setStatus("已载入风格，可以直接给主题");
  switchPanel("panel-plan");
} else {
  renderStyleLibrary();
}
renderArticleHistory();
$("#articleBtn").disabled = true;
renderTrials();
