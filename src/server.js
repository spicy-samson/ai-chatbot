import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = new Hono();
app.use("*", cors());

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";
const systemPrompt = process.env.VITE_SYSTEM_PROMPT;

app.post("/api/chat", async (c) => {
  try {
    const { messages } = await c.req.json(); // Correct way to get JSON body in Hono
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    // Always prepend the system prompt from .env
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.filter((m) => m.role !== "system"),
    ];

    const response = await client.chat.completions.create({
      messages: chatMessages,
      temperature: 1.0,
      top_p: 1.0,
      model: model,
    });

    // const response = await client.chat.completions.create({
    //   messages: [
    //     { role: "system", content: "" },
    //     { role: "user", content: "What is the capital of France?" },
    //   ],
    //   temperature: 1,
    //   top_p: 1,
    //   model: model,
    // });

    console.log(response.choices[0].message.content);

    return c.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return c.json({ reply: "Error: Could not get response." });
  }
});

export default app;

// For local dev with Node.js
if (process.env.NODE_ENV !== "production") {
  const { serve } = await import("@hono/node-server");
  const port = process.env.PORT || 3000;
  serve({ fetch: app.fetch, port });
  console.log(`Hono server running on http://localhost:${port}`);
}
