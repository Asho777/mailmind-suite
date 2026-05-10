import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'settings.json');

const DEFAULT_SETTINGS = {
  name: "Greg Nash",
  email: "navcocctv@bigpond.com",
  role: "Operations Manager",
  company: "Navco CCTV",
  plan: "Professional",
  styleProfile: {
    tone: "Semi-Formal",
    lengthPreference: "Balanced",
    signOff: "Best regards, Greg"
  },
  learnedPreferences: [
    { pref: "Prefers 'Hi' over 'Dear'", confidence: "92%" },
    { pref: "Avoids exclamation marks in formal replies", confidence: "78%" },
    { pref: "Always mentions 'Next steps' at the end", confidence: "85%" },
    { pref: "Uses Australian spelling (e.g. 'categorise')", confidence: "99%" }
  ],
  automation: {
    autoDrafting: true,
    smartCategorisation: true,
    confidenceBarrier: true,
    weeklyInsights: false
  },
  notifications: {
    urgentAlerts: true,
    dailyDigest: true,
    draftReady: false
  },
  privacy: {
    aiTraining: true,
    dataRetention: "90 days",
    analyticsEnabled: true
  }
};

export async function getSettings() {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      // Just return defaults if file doesn't exist, don't trigger save recursion
      return DEFAULT_SETTINGS;
    }
    const data = fs.readFileSync(SETTINGS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read settings file:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(data: any) {
  try {
    let currentSettings = DEFAULT_SETTINGS;
    if (fs.existsSync(SETTINGS_PATH)) {
      const existingData = fs.readFileSync(SETTINGS_PATH, 'utf8');
      currentSettings = JSON.parse(existingData);
    }
    
    const updatedSettings = { ...currentSettings, ...data };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updatedSettings, null, 2));
    console.log("✅ Settings saved successfully to:", SETTINGS_PATH);
    console.log("📄 New Settings:", updatedSettings);
    return updatedSettings;
  } catch (error) {
    console.error("Failed to save settings file:", error);
    throw error;
  }
}

export async function resetSettings() {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      fs.unlinkSync(SETTINGS_PATH);
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Failed to reset settings file:", error);
    throw error;
  }
}
