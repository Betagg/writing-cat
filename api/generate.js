const DEFAULT_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";

const taskPrompts = {
  "generate-trials": `你是“写作猫”的风格校准模块。
用户会提供过去写过的公众号文章样本。请先提取用户写作风格，再找一个与历史材料气质相近的主题，写出 A/B/C 三段试写样例。
必须返回 JSON，不要返回 Markdown。
JSON 格式：
{
  "trials": {
    "A": {"title": "A｜更像原来的写法", "tag": "保留原有节奏", "body": "两到三段中文试写"},
    "B": {"title": "B｜更清晰的公众号版", "tag": "像你，但更顺", "body": "两到三段中文试写"},
    "C": {"title": "C｜更有传播感的版本", "tag": "观点更锋利", "body": "两到三段中文试写"}
  },
  "profile": {
    "persona": "写作人格，不超过 120 字",
    "structure": "结构习惯，不超过 120 字",
    "upgrade": "质量提升方向，不超过 120 字"
  }
}`,
  "generate-plan": `你是“写作猫”的公众号写作策划模块。
请根据用户主题/材料、历史文章样本和风格画像，生成一份写作方案。
要求：中文；直接输出方案正文；包含核心判断、标题方向、结构大纲、语气策略、预估篇幅；不要写客套话。`,
  "generate-article": `你是“写作猫”的公众号文章写作模块。
请根据用户主题/材料、写作方案、历史文章样本和风格画像，生成一篇公众号文章。
要求：中文；保留作者风格影子，同时提升结构、表达和可读性；不要使用营销号语气；直接输出文章正文。`,
};

function send(response, status, payload) {
  response.status(status).json(payload);
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function normalizeApiKey(value) {
  const text = String(value || "").trim();
  const fromAssignment = text.includes("=") ? text.split("=").slice(1).join("=").trim() : text;
  const unquoted = fromAssignment.replace(/^['"]|['"]$/g, "").trim();
  const token = unquoted.match(/[A-Za-z0-9._-]{24,}/)?.[0] || "";
  return token;
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return send(response, 405, { ok: false, error: "Method not allowed" });
  }

  const apiKey = normalizeApiKey(process.env.ARK_API_KEY || process.env.WRITING_API_KEY);
  const model = process.env.ARK_MODEL || process.env.WRITING_API_MODEL;
  const baseUrl = process.env.ARK_BASE_URL || process.env.WRITING_API_BASE_URL || DEFAULT_BASE_URL;

  if (!apiKey || !model) {
    return send(response, 503, {
      ok: false,
      error: "API is not configured",
      missing: {
        apiKey: !apiKey,
        model: !model,
      },
    });
  }

  if (!/^[\x20-\x7E]+$/.test(apiKey)) {
    return send(response, 503, {
      ok: false,
      error: "ARK_API_KEY must contain the raw API key, not explanatory text",
    });
  }

  const body = request.body || {};
  const task = body.task;
  const prompt = taskPrompts[task];

  if (!prompt) {
    return send(response, 400, { ok: false, error: "Unknown task" });
  }

  const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: task === "generate-article" ? 0.72 : 0.55,
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              samples: body.samples || "",
              sampleCount: body.sampleCount || 0,
              mode: body.mode || "",
              styleProfile: body.styleProfile || {},
              topic: body.topic || "",
              plan: body.plan || "",
            },
            null,
            2
          ),
        },
      ],
    }),
  });

  const result = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return send(response, upstream.status, {
      ok: false,
      error: result?.error?.message || result?.message || "Upstream API error",
    });
  }

  const text = result?.choices?.[0]?.message?.content || "";
  const parsed = task === "generate-trials" ? safeJson(text) : null;

  return send(response, 200, {
    ok: true,
    data: parsed || { text },
  });
};
