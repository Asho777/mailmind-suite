import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENV_PATH = path.resolve(process.cwd(), ".env");

function readEnv(): Record<string, string> {
  const content = fs.readFileSync(ENV_PATH, "utf-8");
  const result: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^"(.*)"$/, "$1");
    result[key] = val;
  }
  return result;
}

function writeEnv(values: Record<string, string>) {
  const content = fs.readFileSync(ENV_PATH, "utf-8");
  let updated = content;

  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`^(${key}=).*$`, "m");
    const line = `${key}="${value}"`;
    if (regex.test(updated)) {
      updated = updated.replace(regex, line);
    } else {
      updated += `\n${line}\n`;
    }
  }

  fs.writeFileSync(ENV_PATH, updated, "utf-8");
}

// GET: return masked current values
export async function GET() {
  try {
    const env = readEnv();
    const apiKey = env["OPENAI_API_KEY"] || "";
    const encKey = env["ENCRYPTION_KEY"] || "";
    return NextResponse.json({
      apiKeySet: apiKey.length > 10 && !apiKey.includes("sk-..."),
      apiKeyPreview: apiKey.length > 8 ? `${apiKey.slice(0, 8)}••••••••` : "",
      encKeySet: encKey.length > 10 && !encKey.includes("your-encryption"),
      encKeyPreview: encKey.length > 6 ? `${encKey.slice(0, 6)}••••••••` : "",
    });
  } catch {
    return NextResponse.json({ error: "Could not read .env" }, { status: 500 });
  }
}

// POST: test or save
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, apiKey, encryptionKey } = body;

    if (action === "test") {
      // Use the provided key, or fall back to the already-saved .env key
      const env = readEnv();
      const keyToTest = (apiKey && apiKey.trim().length > 10) ? apiKey.trim() : env["OPENAI_API_KEY"];

      if (!keyToTest || keyToTest.length < 20 || keyToTest.includes("sk-...")) {
        return NextResponse.json({ ok: false, error: "No valid API key found. Please enter your OpenAI API key in the field above and try again." });
      }
      try {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${keyToTest}` },
        });
        if (res.ok) {
          const source = (apiKey && apiKey.trim().length > 10) ? "newly entered key" : "saved key";
          return NextResponse.json({ ok: true, message: `✅ OpenAI connection successful! Your ${source} is valid and working.` });
        } else {
          const err = await res.json();
          return NextResponse.json({ ok: false, error: `OpenAI rejected the key: ${err?.error?.message || "Invalid API key"}` });
        }
      } catch {
        return NextResponse.json({ ok: false, error: "Could not reach OpenAI. Check your internet connection." });
      }
    }

    if (action === "save") {
      const toWrite: Record<string, string> = {};
      if (apiKey && apiKey.trim()) toWrite["OPENAI_API_KEY"] = apiKey.trim();
      if (encryptionKey && encryptionKey.trim()) toWrite["ENCRYPTION_KEY"] = encryptionKey.trim();
      writeEnv(toWrite);
      return NextResponse.json({ ok: true, message: "Keys saved to .env successfully." });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
