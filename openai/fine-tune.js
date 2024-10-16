const { OpenAI } = require("openai");
require("dotenv").config({ path: "./../config.env" }); // לטעינת משתני הסביבה
const fs = require("fs");

// יצירת מופע חדש של OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // מפתח ה-API מקובץ .env
});

// פונקציה לביצוע Fine-Tuning
async function fineTune() {
  try {
    // העלאת קובץ ה-JSONL ל-OpenAI
    const fileResponse = await openai.files.create({
      file: fs.createReadStream("./newdata.jsonl"),
      purpose: "fine-tune",
    });

    console.log("File uploaded:", fileResponse.id);

    // התחלת תהליך ה-Fine-Tuning עם הקובץ שהועלה
    const fineTuneResponse = await openai.fineTuning.jobs.create({
      training_file: fileResponse.id,
      model: "gpt-4o-2024-08-06",
    });

    console.log("Fine-Tuning started:", fineTuneResponse.id);

    // מעקב אחרי מצב ה-Fine-Tuning כל כמה שניות
    checkFineTuneStatus(fineTuneResponse.id);
  } catch (error) {
    console.error("Error during Fine-Tuning:", error);
  }
}

// פונקציה לבדיקת סטטוס Fine-Tuning
async function checkFineTuneStatus(fineTuneJobId) {
  try {
    console.log(`Checking status of Fine-Tuning job: ${fineTuneJobId}`);

    // שליפת המידע על ה-Fine-Tuning לפי מזהה התהליך
    const fineTuneStatus = await openai.fineTuning.jobs.retrieve(fineTuneJobId);

    if (fineTuneStatus.status === "succeeded") {
      console.log("Fine-Tuned Model ID:", fineTuneStatus.fine_tuned_model);
    } else if (fineTuneStatus.status === "failed") {
      console.log("Fine-Tuning failed with error:", fineTuneStatus.error);
    } else {
      console.log(
        "Fine-Tuning still in progress. Current status:",
        fineTuneStatus.status
      );
      // אם התהליך עוד לא הסתיים, נבדוק שוב בעוד 30 שניות
      setTimeout(() => checkFineTuneStatus(fineTuneJobId), 30000);
    }
  } catch (error) {
    console.error("Error fetching Fine-Tuning status:", error);
  }
}

// התחלת תהליך ה-Fine-Tuning
fineTune();
