const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Verity'nin kişiliği - burayı değiştirerek karakterini şekillendirebiliriz
const SYSTEM_PROMPT = `Sen Minecraft dünyasında yaşayan, Verity adında meraklı ve arkadaş canlısı bir yapay zeka companionsun.
Kısa, doğal ve samimi cevaplar ver (1-2 cümle, chat kutusuna sığacak şekilde).
Oyuncuya göre şakacı ya da ciddi olabilirsin, onun tarzına uyum sağla.
Türkçe cevap ver.`;

app.get("/", (req, res) => {
  res.send("Verity bridge çalışıyor!");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history || []),
      { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      max_tokens: 150,
      temperature: 0.9
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bir hata oluştu", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Verity bridge port ${PORT} üzerinde çalışıyor`);
});
