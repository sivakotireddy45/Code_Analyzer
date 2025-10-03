import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const GROQ_API_URL = process.env.GROQ_API_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Helper to call Groq API
async function askGroq(prompt) {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    return "❌ Failed to process the request.";
  }
}

app.get("/", (req, res) => {
  res.send("Api Working");
});
// POST API for Analyze
app.post("/api/get-data", async (req, res) => {
  const { code, type,level,language} = req.body;

  if (!code || !type) {
    return res.status(400).json({ error: "Code and type are required." });
  }

  let prompt = "";
if (type === "analyze") {
  prompt = `I have the following ${language} code. Please analyze its time and space complexities with detailed reasoning suitable for a ${level.toLowerCase()} level developer. Only provide the complexity analysis, no explanation of the code itself. Format your response in Markdown with appropriate headings, bullet points, and bold where necessary.\n\nCode:\n\n${code}`;
} 
else if (type === "optimize") {
  prompt = `I have the following ${language} code. Please check if it is already optimized. If it is, simply confirm that no further optimizations are necessary. If not, suggest specific optimization techniques with detailed reasoning. Then, provide an optimized version of the code inside a proper Markdown code block (\`\`\`${language.toLowerCase()}\ncode\n\`\`\`). Also, explain the optimizations made and why they improve the code, suitable for a ${level.toLowerCase()} level developer. Format the entire response using Markdown including headings, bullet points, and code blocks.\n\nCode:\n\n${code}`;
}
else if (type === "explain") {
  prompt = `Please provide a clear and detailed explanation of the following ${language} code. Explain the purpose of the code, how it works step by step, and describe the function of each important part or line in simple terms suitable for a ${level.toLowerCase()} level developer. Format the explanation in Markdown with appropriate headings, bullet points, and bold for key terms.\n\nCode:\n\n${code}`;
}
else {
  return res.status(400).json({ error: "Invalid analysis type." });
}


  const groqResponse = await askGroq(prompt);
  res.json({ data: groqResponse });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
