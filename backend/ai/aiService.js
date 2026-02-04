const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateResumeAI(data) {
  try {
    console.log("🧠 AI FUNCTION CALLED");
    console.log("🧠 INPUT DATA:", data);

    const prompt = `
Create ONLY a professional resume summary in first person.

Rules:
- 3 to 4 lines only
- Write in FIRST PERSON using "I" (not the candidate's name)
- No headings
- No bullet points
- No explanations
- No notes
- Plain text only
- Focus on key achievements and skills
- Start with "I am" or "I have"

Candidate Details:
Name: ${data.name}
Skills: ${data.skills || "Not provided"}
Education: ${data.education || "Not provided"}
Experience: ${data.experience || "Not provided"}
Projects: ${data.projects || "Not provided"}

Example format: "I am a skilled software developer with expertise in..."
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",   // ✅ WORKING MODEL
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("❌ AI SERVICE ERROR:", error);
    throw error;
  }
}

module.exports = generateResumeAI;
