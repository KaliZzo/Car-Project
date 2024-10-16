const { OpenAI } = require("openai");
require("dotenv").config({ path: "./../config.env" }); // לטעינת משתני הסביבה

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // מפתח ה-API מקובץ .env
});

// פונקציה לשאילת שאלה למודל המאומן
async function askFineTunedModel(question, modelId) {
  try {
    const response = await openai.chat.completions.create({
      model: modelId, // הכנס את מזהה המודל המאומן כאן
      messages: [{ role: "user", content: question }],
    });

    console.log("תשובה:", response.choices[0].message.content);
  } catch (error) {
    console.error("Error asking the fine-tuned model:", error);
  }
}

// הכנס כאן את מזהה המודל המאומן
askFineTunedModel("What does Nisim love to drink?", "fine-tuned-model-id");
