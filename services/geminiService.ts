
import { GoogleGenAI } from "@google/genai";

export const getSafetyAdvice = async (query: string) => {
  if (!navigator.onLine) {
    return "Вибачте, ШІ-помічник потребує підключення до мережі інтернет. Будь ласка, перевірте зв'язок.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `Ви — ШІ-консультант фракції ДСНС у грі UKRAINE GTA. 
Відповідайте суворо в межах ігрового всесвіту. 
Використовуйте терміни: ГУ ДСНС, СЦЗ, 03 Сервер, тен-коди. 
Якщо питання стосується реального світу, ввічливо повертайте гравця до RP-процесу.
Мова: Українська.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Зв'язок з головним сервером ШІ перервано. Зверніться до технічного відділу ГУ.";
  }
};
