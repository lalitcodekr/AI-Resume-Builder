import React, { useState, useMemo } from "react";
import Mammoth from "mammoth";

const defaultTemplate = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  experience: [
    {
      role: "",
      company: "",
      period: "",
      achievements: [""],
    },
  ],
  education: [
    {
      degree: "",
      school: "",
      period: "",
    },
  ],
  skills: {
    frontend: "",
    backend: "",
  },
};

const TemplateDocs = () => {
  const [formData, setFormData] = useState(defaultTemplate);
  const [previewHTML, setPreviewHTML] = useState("");

  /** Generate HTML preview */
  const htmlPreview = useMemo(() => {
    const html = `
      <div style="font-family:sans-serif;width:210mm;min-height:297mm;margin:0 auto;padding:15mm;background:#fff;">
        <header style="text-align:center;border-bottom:3px solid #2563eb;padding-bottom:20px;margin-bottom:25px;">
          <h1 style="font-size:36px;color:#1e40af;">${formData.name}</h1>
          <p style="color:#64748b;margin-bottom:10px;">${formData.title}</p>
          <div style="font-size:13px;color:#64748b;">${formData.email} • ${
      formData.phone
    } • ${formData.location}</div>
        </header>

        <section style="margin-bottom:24px;">
          <h2 style="font-size:18px;color:#1e40af;border-bottom:2px solid #e5e7eb;">Professional Summary</h2>
          <p>${formData.summary}</p>
        </section>

        <section style="margin-bottom:24px;">
          <h2 style="font-size:18px;color:#1e40af;border-bottom:2px solid #e5e7eb;">Experience</h2>
          ${formData.experience
            .map(
              (exp) => `
            <div style="margin-bottom:18px;">
              <div style="display:flex;justify-content:space-between;">
                <h3>${exp.role}</h3>
                <span>${exp.period}</span>
              </div>
              <p>${exp.company}</p>
              <ul>${exp.achievements.map((a) => `<li>${a}</li>`).join("")}</ul>
            </div>
          `
            )
            .join("")}
        </section>

        <section style="margin-bottom:24px;">
          <h2 style="font-size:18px;color:#1e40af;border-bottom:2px solid #e5e7eb;">Education</h2>
          ${formData.education
            .map(
              (edu) => `
            <div>
              <div style="display:flex;justify-content:space-between;">
                <h3>${edu.degree}</h3>
                <span>${edu.period}</span>
              </div>
              <p>${edu.school}</p>
            </div>
          `
            )
            .join("")}
        </section>

        <section>
          <h2 style="font-size:18px;color:#1e40af;border-bottom:2px solid #e5e7eb;">Skills</h2>
          <p><strong>Frontend:</strong> ${formData.skills.frontend}</p>
          <p><strong>Backend:</strong> ${formData.skills.backend}</p>
        </section>
      </div>
    `;
    setPreviewHTML(html);
    return html;
  }, [formData]);

  /** Handle form changes */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /** Handle DOCX upload */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const { value: text } = await Mammoth.extractRawText({ arrayBuffer });

    // Simple parsing logic (adjust per your DOCX structure)
    const lines = text.split("\n").filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      name: lines[0] || prev.name,
      title: lines[1] || prev.title,
      summary: lines.slice(2, 5).join(" ") || prev.summary,
      email: lines.find((l) => l.includes("@")) || prev.email,
      phone: lines.find((l) => /\+?\d[\d\s-]{7,}/.test(l)) || prev.phone,
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Form */}
      <div className="w-1/3 p-4 overflow-auto border-r border-gray-300">
        <h2 className="font-bold mb-2">Edit Resume</h2>

        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full mb-2 p-1 border"
        />

        <label>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full mb-2 p-1 border"
        />

        <label>Email:</label>
        <input
          type="text"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full mb-2 p-1 border"
        />

        <label>Phone:</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full mb-2 p-1 border"
        />

        <label>Location:</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full mb-2 p-1 border"
        />

        <label>Summary:</label>
        <textarea
          value={formData.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          className="w-full mb-2 p-1 border"
        />

        <label>Upload DOCX:</label>
        <input
          type="file"
          accept=".docx"
          onChange={handleFileUpload}
          className="w-full mb-2"
        />
      </div>

      {/* Preview */}
      <div className="w-2/3 p-4 overflow-auto bg-gray-100">
        <iframe
          title="Resume Preview"
          srcDoc={previewHTML}
          className="w-full h-full border"
          style={{ minHeight: "100%" }}
        />
      </div>
    </div>
  );
};

export default TemplateDocs;
