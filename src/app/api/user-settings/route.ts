import { NextResponse } from "next/server";
import { getSettings, saveSettings, resetSettings } from "@/lib/settings-store";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    let updated;
    if (type === "profile") {
      updated = await saveSettings({
        name: data.name,
        role: data.role,
        company: data.company
      });
    } else if (type === "style") {
      updated = await saveSettings({
        styleProfile: {
          tone: data.tone,
          lengthPreference: data.lengthPreference,
          signOff: data.signOff
        }
      });
    } else if (type === "learnedPreferences") {
      updated = await saveSettings({
        learnedPreferences: data
      });
    } else if (type === "automation") {
      updated = await saveSettings({
        automation: data
      });
    } else if (type === "notifications") {
      updated = await saveSettings({
        notifications: data
      });
    } else if (type === "privacy") {
      updated = await saveSettings({
        privacy: data
      });
    } else {
      return NextResponse.json({ error: "Invalid setting type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await resetSettings();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings delete error:", error);
    return NextResponse.json({ error: "Failed to delete settings" }, { status: 500 });
  }
}
