import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage } from "node:http";
import type { ViteDevServer } from "vite";
import {
  aiCoachJsonSchema,
  type AiCoachRequest,
  type AiCoachResponse,
} from "./src/lib/ai/coach";
import {
  aiDailyPlanJsonSchema,
  type AiDailyPlanRequest,
  type AiDailyPlanResponse,
} from "./src/lib/ai/dailyPlan";
import {
  normalizeRecognizedCandidates,
  recognitionJsonSchema,
  type RecognizeImageRequest,
  type RecognizeImageResponse,
} from "./src/lib/recognition/aiRecognition";

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    plugins: [react(), aiApiPlugin()],
  };
});

function aiApiPlugin() {
  return {
    name: "pet-ai-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/recognize", async (request, response) => {
        if (request.method !== "POST") {
          response.writeHead(405, { "content-type": "application/json" });
          response.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        if (!process.env.GOOGLE_AI_API_KEY && !process.env.OPENAI_API_KEY) {
          response.writeHead(400, { "content-type": "application/json" });
          response.end(
            JSON.stringify({
              error: "GOOGLE_AI_API_KEY or OPENAI_API_KEY is not configured.",
              missingApiKey: true,
            }),
          );
          return;
        }

        try {
          const body = await readJsonBody<RecognizeImageRequest>(request);
          validateRecognitionRequest(body);
          const result = process.env.GOOGLE_AI_API_KEY
            ? await callGoogleRecognition(body)
            : await callOpenAiRecognition(body);
          response.writeHead(200, { "content-type": "application/json" });
          response.end(JSON.stringify(result));
        } catch (error) {
          response.writeHead(400, { "content-type": "application/json" });
          response.end(
            JSON.stringify({
              error: "Image recognition failed.",
              detail: error instanceof Error ? error.message : "Unknown error",
            }),
          );
        }
      });
      server.middlewares.use("/api/coach", async (request, response) => {
        if (request.method !== "POST") {
          response.writeHead(405, { "content-type": "application/json" });
          response.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        if (!process.env.GOOGLE_AI_API_KEY && !process.env.OPENAI_API_KEY) {
          response.writeHead(400, { "content-type": "application/json" });
          response.end(
            JSON.stringify({
              error: "GOOGLE_AI_API_KEY or OPENAI_API_KEY is not configured.",
              missingApiKey: true,
            }),
          );
          return;
        }

        try {
          const body = await readJsonBody<AiCoachRequest>(request);
          const result = process.env.GOOGLE_AI_API_KEY
            ? await callGoogleCoach(body)
            : await callOpenAiCoach(body);
          response.writeHead(200, { "content-type": "application/json" });
          response.end(JSON.stringify(result));
        } catch (error) {
          response.writeHead(400, { "content-type": "application/json" });
          response.end(
            JSON.stringify({
              error: "AI coach failed.",
              detail: error instanceof Error ? error.message : "Unknown error",
            }),
          );
        }
      });
      server.middlewares.use("/api/daily-plan", async (request, response) => {
        if (request.method !== "POST") {
          response.writeHead(405, { "content-type": "application/json" });
          response.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        if (!process.env.GOOGLE_AI_API_KEY && !process.env.OPENAI_API_KEY) {
          response.writeHead(400, { "content-type": "application/json" });
          response.end(
            JSON.stringify({
              error: "GOOGLE_AI_API_KEY or OPENAI_API_KEY is not configured.",
              missingApiKey: true,
            }),
          );
          return;
        }

        try {
          const body = await readJsonBody<AiDailyPlanRequest>(request);
          const result = process.env.GOOGLE_AI_API_KEY
            ? await callGoogleDailyPlan(body)
            : await callOpenAiDailyPlan(body);
          response.writeHead(200, { "content-type": "application/json" });
          response.end(JSON.stringify(result));
        } catch (error) {
          response.writeHead(400, { "content-type": "application/json" });
          response.end(
            JSON.stringify({
              error: "AI daily plan failed.",
              detail: error instanceof Error ? error.message : "Unknown error",
            }),
          );
        }
      });
    },
  };
}

async function readJsonBody<T>(request: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    request.on("data", (chunk: Buffer) => chunks.push(chunk));
    request.on("end", resolve);
    request.on("error", reject);
  });
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
}

function validateRecognitionRequest(body: RecognizeImageRequest) {
  if (body.mode !== "receipt" && body.mode !== "photo") {
    throw new Error("Invalid recognition mode.");
  }
  if (!body.imageDataUrl.startsWith("data:image/")) {
    throw new Error("Expected an image data URL.");
  }
}

async function callOpenAiRecognition(
  body: RecognizeImageRequest,
): Promise<RecognizeImageResponse> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildRecognitionPrompt(body.mode, body.today),
            },
            {
              type: "input_image",
              image_url: body.imageDataUrl,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "food_recognition_candidates",
          strict: true,
          schema: recognitionJsonSchema,
        },
      },
    }),
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    output_text?: string;
    output?: Array<{
      content?: Array<{
        text?: string;
      }>;
    }>;
  };
  if (!response.ok) {
    throw new Error(payload.error?.message ?? "OpenAI request failed.");
  }

  const outputText = extractResponseText(payload);
  const parsed = JSON.parse(outputText) as { candidates: unknown[] };
  return {
    candidates: normalizeRecognizedCandidates(
      parsed.candidates as RecognizeImageResponse["candidates"],
      body.mode,
    ),
    provider: "openai",
    model: getOpenAiModel(),
  };
}

async function callOpenAiCoach(body: AiCoachRequest): Promise<AiCoachResponse> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildCoachPrompt(body),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "food_waste_pet_coach",
          strict: true,
          schema: aiCoachJsonSchema,
        },
      },
    }),
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    output_text?: string;
    output?: Array<{
      content?: Array<{
        text?: string;
      }>;
    }>;
  };
  if (!response.ok) {
    throw new Error(payload.error?.message ?? "OpenAI coach request failed.");
  }

  return {
    ...(JSON.parse(extractResponseText(payload)) as Omit<
      AiCoachResponse,
      "provider" | "model"
    >),
    provider: "openai",
    model: getOpenAiModel(),
  };
}

async function callOpenAiDailyPlan(
  body: AiDailyPlanRequest,
): Promise<AiDailyPlanResponse> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildDailyPlanPrompt(body),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "food_waste_daily_plan",
          strict: true,
          schema: aiDailyPlanJsonSchema,
        },
      },
    }),
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    output_text?: string;
    output?: Array<{
      content?: Array<{
        text?: string;
      }>;
    }>;
  };
  if (!response.ok) {
    throw new Error(payload.error?.message ?? "OpenAI daily plan request failed.");
  }

  return {
    ...(JSON.parse(extractResponseText(payload)) as Omit<
      AiDailyPlanResponse,
      "provider" | "model"
    >),
    provider: "openai",
    model: getOpenAiModel(),
  };
}

async function callGoogleRecognition(
  body: RecognizeImageRequest,
): Promise<RecognizeImageResponse> {
  const image = parseDataUrl(body.imageDataUrl);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${getGoogleModel()}:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: buildRecognitionPrompt(body.mode, body.today) },
              {
                inline_data: {
                  mime_type: image.mimeType,
                  data: image.base64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: toGoogleResponseSchema(recognitionJsonSchema),
        },
      }),
    },
  );

  const payload = (await response.json()) as GoogleTextResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Google AI request failed.");
  }

  const outputText = extractGoogleText(payload);
  const parsed = JSON.parse(outputText) as { candidates: unknown[] };
  return {
    candidates: normalizeRecognizedCandidates(
      parsed.candidates as RecognizeImageResponse["candidates"],
      body.mode,
    ),
    provider: "google",
    model: getGoogleModel(),
  };
}

async function callGoogleCoach(body: AiCoachRequest): Promise<AiCoachResponse> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${getGoogleModel()}:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildCoachPrompt(body) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: toGoogleResponseSchema(aiCoachJsonSchema),
        },
      }),
    },
  );

  const payload = (await response.json()) as GoogleTextResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Google AI coach request failed.");
  }

  return {
    ...(JSON.parse(extractGoogleText(payload)) as Omit<
      AiCoachResponse,
      "provider" | "model"
    >),
    provider: "google",
    model: getGoogleModel(),
  };
}

async function callGoogleDailyPlan(
  body: AiDailyPlanRequest,
): Promise<AiDailyPlanResponse> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${getGoogleModel()}:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildDailyPlanPrompt(body) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: toGoogleResponseSchema(aiDailyPlanJsonSchema),
        },
      }),
    },
  );

  const payload = (await response.json()) as GoogleTextResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Google AI daily plan request failed.");
  }

  return {
    ...(JSON.parse(extractGoogleText(payload)) as Omit<
      AiDailyPlanResponse,
      "provider" | "model"
    >),
    provider: "google",
    model: getGoogleModel(),
  };
}

function getGoogleModel(): string {
  return process.env.GOOGLE_AI_MODEL ?? "gemini-1.5-flash";
}

function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
}

type GoogleTextResponse = {
  error?: { message?: string };
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function extractGoogleText(payload: GoogleTextResponse): string {
  const outputText = payload.candidates?.[0]?.content?.parts?.find(
    (part) => typeof part.text === "string",
  )?.text;
  if (!outputText) {
    throw new Error("Google AI response did not contain structured text.");
  }
  return outputText;
}

function parseDataUrl(dataUrl: string): { mimeType: string; base64: string } {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid image data URL.");
  }
  return {
    mimeType: match[1],
    base64: match[2],
  };
}

function toGoogleResponseSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) {
    return schema.map(toGoogleResponseSchema);
  }
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  const unsupported = new Set([
    "additionalProperties",
    "description",
    "minimum",
    "maximum",
    "minItems",
    "maxItems",
    "pattern",
  ]);
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) {
    if (unsupported.has(key)) continue;
    if (key === "type" && Array.isArray(value)) {
      result.type = value.find((candidate) => candidate !== "null") ?? "string";
      continue;
    }
    result[key] = toGoogleResponseSchema(value);
  }
  return result;
}

function buildRecognitionPrompt(mode: RecognizeImageRequest["mode"], today: string): string {
  return [
    `Today is ${today}.`,
    mode === "receipt"
      ? "Extract only food or beverage items from this receipt image."
      : "Identify visible food or beverage items in this photo.",
    "Return candidate inventory items for a food-waste planning app.",
    "Extract quantity and unit carefully. If text says 3L, return proposedQuantity 3 and proposedUnit l, not 3 items.",
    "If text says 500g, return proposedQuantity 500 and proposedUnit g.",
    "If text says 2 at $7.50 each, return proposedQuantity 2 and proposedUnit item, and put package size such as 500g each in notes.",
    "If a product name includes both a count and a size, prefer purchased count as item quantity and preserve package size in notes.",
    "Use suggested dates as planning hints only, not food safety guarantees.",
    "If a field is uncertain, keep a lower confidence score instead of inventing certainty.",
    "Ignore non-food items, taxes, payment lines, store membership lines, and totals.",
  ].join(" ");
}

function buildCoachPrompt(input: AiCoachRequest): string {
  return [
    `Today is ${input.today}.`,
    "You are the friendly virtual pet in a household food-waste planning app.",
    "Create a short flexible coaching response from the current inventory and rule-generated missions.",
    "Do not override the existing mission priority. Add practical wording and small meal/action ideas.",
    "Do not shame the user. Do not claim any food is definitely safe.",
    "If food may be past a suggested date, say to check quality using smell, appearance, packaging, storage, and local guidance.",
    "Keep suggestions realistic for a quick household task.",
    `Pet state: ${JSON.stringify(input.pet)}.`,
    `Active inventory: ${JSON.stringify(input.activeItems.slice(0, 20))}.`,
    `Rule-generated missions: ${JSON.stringify(input.missions.slice(0, 5))}.`,
  ].join(" ");
}

function buildDailyPlanPrompt(input: AiDailyPlanRequest): string {
  return [
    `Today is ${input.today}.`,
    "You are the planning agent for a food-waste virtual pet app.",
    "Create today's concrete recipe plan and usage tasks from the active inventory.",
    "Use the rule-generated missions as priority signals, but you may combine items into practical recipes.",
    "Every usage task must reference an exact itemId from active inventory.",
    "Do not invent ingredients that are not in inventory except optional pantry basics such as salt, oil, water, pepper, rice, pasta, or eggs.",
    "Keep quantities realistic and never request more than the listed quantity.",
    "If an item is measured in l, ml, g, or kg, use the same unit in the task.",
    "Do not claim uncertain food is safe; include checking smell, appearance, packaging, and storage when relevant.",
    "Return recipes and tasks that the app can submit today.",
    `Pet state: ${JSON.stringify(input.pet)}.`,
    `Active inventory: ${JSON.stringify(input.activeItems.slice(0, 25))}.`,
    `Priority missions: ${JSON.stringify(input.missions.slice(0, 8))}.`,
  ].join(" ");
}

function extractResponseText(payload: {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
}): string {
  if (payload.output_text) return payload.output_text;
  const text = payload.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .find((value): value is string => Boolean(value));
  if (!text) {
    throw new Error("OpenAI response did not contain structured text.");
  }
  return text;
}
