import React, { useState, useRef } from "react";

// ATS Keywords Database
const ATS_KEYWORDS = {
  technical: [
    "JavaScript", "Python", "Java", "React", "Node.js", "SQL", "AWS", "Docker",
    "Kubernetes", "Git", "CI/CD", "REST API", "TypeScript", "Angular", "Vue",
    "MongoDB", "PostgreSQL", "Redis", "GraphQL", "Microservices", "Agile", "Scrum"
  ],
  soft_skills: [
    "Leadership", "Communication", "Team collaboration", "Problem solving",
    "Project management", "Time management", "Critical thinking", "Adaptability",
    "Creativity", "Analytical", "Strategic planning", "Decision making"
  ],
  action_verbs: [
    "Developed", "Implemented", "Led", "Managed", "Created", "Designed",
    "Improved", "Increased", "Reduced", "Optimized", "Achieved", "Delivered",
    "Collaborated", "Coordinated", "Established", "Built", "Launched"
  ],
  common_required: [
    "Bachelor", "Master", "Degree", "Experience", "Years", "Certification",
    "Skills", "Education", "Professional", "Expert", "Proficient"
  ]
};

// ATS Analysis Function
const analyzeResumeATS = (text) => {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const lowerText = text.toLowerCase();
  
  const contentScore = calculateContentScore(text, lowerText);
  const sectionScore = calculateSectionScore(lowerText);
  const essentialsScore = calculateEssentialsScore(text, lowerText);
  const tailoringScore = calculateTailoringScore(lowerText);
  
  const totalScore = contentScore + sectionScore + essentialsScore + tailoringScore;
  const overallScore = Math.min(10, Math.max(0, (totalScore / 80) * 10));
  
  const { matchedKeywords, missingKeywords } = extractKeywords(lowerText);
  const suggestions = generateSuggestions(contentScore, sectionScore, essentialsScore, tailoringScore, lowerText);
  
  return {
    overallScore: Number(overallScore.toFixed(2)),
    contentScore: Number(((contentScore / 20) * 10).toFixed(1)),
    sectionScore: Number(((sectionScore / 20) * 10).toFixed(1)),
    essentialsScore: Number(((essentialsScore / 20) * 10).toFixed(1)),
    tailoringScore: Number(((tailoringScore / 20) * 10).toFixed(1)),
    matchedKeywords,
    missingKeywords,
    suggestions
  };
};

const calculateContentScore = (text, lowerText) => {
  let score = 0;
  const words = text.split(/\s+/).length;
  
  if (words >= 300 && words <= 600) score += 5;
  else if (words >= 200 && words < 300) score += 3;
  else if (words >= 100 && words < 200) score += 2;
  
  const actionVerbCount = ATS_KEYWORDS.action_verbs.filter(verb => 
    lowerText.includes(verb.toLowerCase())
  ).length;
  score += Math.min(5, Math.floor(actionVerbCount / 2));
  
  const numberMatches = text.match(/\d+%|\$\d+|\d+\+|increased by \d+|reduced \d+/gi);
  const achievementCount = numberMatches ? numberMatches.length : 0;
  score += Math.min(5, achievementCount);
  
  const bulletPoints = (text.match(/[•\-\*]\s/g) || []).length;
  if (bulletPoints >= 10) score += 5;
  else if (bulletPoints >= 6) score += 3;
  else if (bulletPoints >= 3) score += 2;
  
  return Math.min(20, score);
};

const calculateSectionScore = (lowerText) => {
  let score = 0;
  const sections = {
    contact: /(email|phone|linkedin|contact)/,
    summary: /(summary|objective|profile|about)/,
    experience: /(experience|employment|work history|professional experience)/,
    education: /(education|academic|degree|university|college)/,
    skills: /(skills|technical skills|competencies|expertise)/,
  };
  
  Object.values(sections).forEach(regex => {
    if (regex.test(lowerText)) score += 4;
  });
  
  return Math.min(20, score);
};

const calculateEssentialsScore = (text, lowerText) => {
  let score = 0;
  
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) score += 3;
  if (/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) score += 3;
  
  score += 4;
  
  const unprofessionalWords = ['i think', 'maybe', 'stuff', 'things', 'basically'];
  const hasUnprofessional = unprofessionalWords.some(word => lowerText.includes(word));
  if (!hasUnprofessional) score += 5;
  
  const lines = text.split('\n').filter(line => line.trim().length > 0).length;
  if (lines >= 30 && lines <= 100) score += 5;
  else if (lines >= 20 && lines < 30) score += 3;
  
  return Math.min(20, score);
};

const calculateTailoringScore = (lowerText) => {
  let score = 0;
  
  const techKeywords = ATS_KEYWORDS.technical.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  ).length;
  score += Math.min(7, techKeywords);
  
  const softSkills = ATS_KEYWORDS.soft_skills.filter(skill => 
    lowerText.includes(skill.toLowerCase())
  ).length;
  score += Math.min(6, Math.floor(softSkills / 2));
  
  const commonTerms = ATS_KEYWORDS.common_required.filter(term => 
    lowerText.includes(term.toLowerCase())
  ).length;
  score += Math.min(7, commonTerms);
  
  return Math.min(20, score);
};

const extractKeywords = (lowerText) => {
  const allKeywords = [
    ...ATS_KEYWORDS.technical,
    ...ATS_KEYWORDS.soft_skills,
    ...ATS_KEYWORDS.common_required
  ];
  
  const matched = [];
  const missing = [];
  
  allKeywords.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      matched.push({ keyword });
    } else {
      missing.push({ keyword });
    }
  });
  
  return {
    matchedKeywords: matched.slice(0, 15),
    missingKeywords: missing.slice(0, 12)
  };
};

const generateSuggestions = (content, section, essentials, tailoring, lowerText) => {
  const suggestions = [];
  
  if (content < 15) {
    suggestions.push("Add more quantifiable achievements with specific numbers and percentages");
    suggestions.push("Use more action verbs at the start of your bullet points");
  }
  
  if (section < 15) {
    suggestions.push("Ensure all standard sections are present: Contact, Summary, Experience, Education, Skills");
  }
  
  if (essentials < 15) {
    suggestions.push("Verify that your contact information (email and phone) is clearly visible");
  }
  
  if (tailoring < 15) {
    suggestions.push("Include more industry-specific technical skills and keywords");
  }
  
  if (!lowerText.includes('linkedin')) {
    suggestions.push("Consider adding your LinkedIn profile URL");
  }
  
  return suggestions.slice(0, 5);
};

// ATSUpload Component
function ATSUpload({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="font-semibold text-lg mb-4">Upload Resume</h2>
      
      <button
        onClick={handleClick}
        className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Upload Resume
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mt-4 text-xs text-slate-500">
        <p>Supported formats: PDF, DOCX, TXT</p>
      </div>
    </div>
  );
}

// Main ATSChecker Component
export default function ATSChecker() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder('utf-8');
      let fullText = decoder.decode(bytes);
      
      // Extract text between BT (Begin Text) and ET (End Text) operators
      const textBlocks = [];
      const btPattern = /BT(.*?)ET/gs;
      let match;
      
      while ((match = btPattern.exec(fullText)) !== null) {
        const block = match[1];
        
        // Extract text from within parentheses or angle brackets
        const textPattern = /\((.*?)\)|<(.*?)>/g;
        let textMatch;
        
        while ((textMatch = textPattern.exec(block)) !== null) {
          const text = textMatch[1] || textMatch[2];
          if (text && text.trim()) {
            // Decode common PDF escape sequences
            const decoded = text
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\r')
              .replace(/\\t/g, '\t')
              .replace(/\\\(/g, '(')
              .replace(/\\\)/g, ')')
              .replace(/\\\\/g, '\\');
            
            textBlocks.push(decoded);
          }
        }
      }
      
      if (textBlocks.length === 0) {
        // Fallback: try to extract any printable ASCII text
        let simpleText = '';
        for (let i = 0; i < bytes.length; i++) {
          const char = String.fromCharCode(bytes[i]);
          if (char.match(/[\x20-\x7E\n\r\t]/)) {
            simpleText += char;
          } else if (simpleText.length > 0 && !simpleText.endsWith(' ')) {
            simpleText += ' ';
          }
        }
        
        // Clean up the simple extraction
        simpleText = simpleText
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
          .replace(/\s+/g, ' ')
          .split(/[\/\(\)\[\]<>]/)
          .filter(part => {
            const trimmed = part.trim();
            return trimmed.length > 3 && /[a-zA-Z]/.test(trimmed);
          })
          .join(' ')
          .trim();
        
        if (simpleText.length > 100) {
          return simpleText;
        }
      }
      
      // Join extracted text blocks
      let extractedText = textBlocks.join(' ');
      
      // Clean up spacing and formatting
      extractedText = extractedText
        .replace(/\s+/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1\n$2')
        .replace(/([.!?])\s+/g, '$1\n')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
      
      return extractedText.length > 100 ? extractedText : null;
      
    } catch (error) {
      console.error('PDF extraction error:', error);
      return null;
    }
  };

  const handleFileUpload = async (file) => {
    console.log("File uploaded:", file.name, file.type);
    setUploadedFile(file);
    setLoading(true);
    setAnalysisResult(null);
    
    try {
      let extractedText = "";
      
      if (file.type === "text/plain") {
        extractedText = await file.text();
        console.log("TXT file extracted, length:", extractedText.length);
      } else if (file.type === "application/pdf") {
        const pdfText = await extractTextFromPDF(file);
        if (pdfText && pdfText.length > 100) {
          extractedText = pdfText;
          console.log("PDF extracted successfully, length:", extractedText.length);
        } else {
          extractedText = `⚠️ PDF Text Extraction Issue\n\n` +
            `We couldn't extract readable text from this PDF file.\n\n` +
            `To get accurate ATS analysis, please:\n\n` +
            `1. Open your PDF resume\n` +
            `2. Select all text (Ctrl+A or Cmd+A)\n` +
            `3. Copy the text\n` +
            `4. Paste into a new text file\n` +
            `5. Save as .TXT format\n` +
            `6. Upload the .TXT file here\n\n` +
            `This ensures accurate keyword matching and ATS scoring.`;
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        extractedText = `📄 DOCX File Uploaded\n\n` +
          `File: ${file.name}\n\n` +
          `For accurate ATS analysis, please convert to TXT:\n\n` +
          `1. Open your DOCX file\n` +
          `2. Select all text (Ctrl+A or Cmd+A)\n` +
          `3. Copy and paste into Notepad or TextEdit\n` +
          `4. Save as .TXT file\n` +
          `5. Upload the .TXT file\n\n` +
          `This provides the most accurate keyword analysis.`;
      } else {
        extractedText = `❌ Unsupported File Type\n\n` +
          `File: ${file.name}\n` +
          `Type: ${file.type}\n\n` +
          `Please upload one of these formats:\n` +
          `• .TXT (recommended for best results)\n` +
          `• .PDF\n` +
          `• .DOCX`;
      }
      
      setResumeText(
        extractedText && extractedText.trim().length > 0
          ? extractedText
          : `📄 ${file.name}\n\nWe couldn't extract readable text from this file.\n\nFor best preview and ATS accuracy:\n• Convert resume to .TXT\n• Upload the TXT file`
      );
      
      // Perform ATS analysis with a slight delay
      setTimeout(() => {
        const analysis = analyzeResumeATS(extractedText);
        console.log("Analysis result:", analysis);
        setAnalysisResult(analysis);
        setLoading(false);
      }, 800);
      
    } catch (error) {
      console.error("Error processing file:", error);
      setResumeText("❌ Error processing file. Please try again or use a .TXT file.");
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 7) return "#16a34a";
    if (score >= 5) return "#f59e0b";
    return "#dc2626";
  };

  const getScoreStatus = (score) => {
    if (score >= 7) return { bg: "bg-green-100", text: "text-green-700", label: "Excellent" };
    if (score >= 5) return { bg: "bg-amber-100", text: "text-amber-700", label: "Good" };
    return { bg: "bg-red-100", text: "text-red-700", label: "Needs Work" };
  };

  const getConstraintStatus = (score, maxScore) => {
    const percentage = score * 10; // score is already out of 10
    if (percentage >= 75) return { ok: true };
    if (percentage >= 50) return { warn: true };
    return { error: true };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="w-full p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800">
          ATS Checker
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Optimize your resume for applicant tracking systems.
        </p>
      </div>

      <div className="bg-white min-h-screen">
        <div className="flex flex-col lg:flex-row min-h-full w-full max-w-7xl mx-auto p-4 gap-6">

          {/* LEFT: DOCUMENT PREVIEW */}
          <div className="w-full lg:w-2/3 bg-slate-200 rounded-xl p-4 lg:p-8 overflow-y-auto flex flex-col items-center border border-slate-300">
            <div className="w-full max-w-2xl flex justify-between items-center mb-4 px-2">
              <h3 className="text-sm font-semibold text-slate-600">
                {uploadedFile ? "Your Resume" : "Document Preview"}
              </h3>
              {uploadedFile && (
                <span className="text-xs text-slate-500">{uploadedFile.name}</span>
              )}
            </div>

            {uploadedFile ? (
              <div className="resume-page bg-white w-full max-w-2xl p-8 lg:p-12 text-slate-800 text-sm leading-relaxed relative overflow-auto max-h-[800px] shadow-lg">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-600">Analyzing resume...</p>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-line break-words font-sans" style={{ lineHeight: '1.6' }}>
                    {resumeText || `📄 ${uploadedFile.name}\n\nPreview unavailable`}
                  </div>
                )}
              </div>
            ) : (
              <div className="resume-page bg-white w-full max-w-2xl p-8 lg:p-12 text-slate-800 text-sm leading-relaxed relative">
                <div className="border-b border-slate-200 pb-6 mb-6">
                  <h1 className="text-3xl font-bold mb-2">Alex Morgan</h1>
                  <p className="text-slate-500 flex gap-4 text-xs">
                    <span>San Francisco, CA</span> •
                    <span>alex.morgan@example.com</span> •
                    <span>(555) 123-4567</span>
                  </p>
                </div>

                <Section title="Professional Summary">
                  Senior Product Designer with 6+ years of experience in building
                  user-centric digital products. Improved engagement by 40%.
                </Section>

                <Section title="Experience">
                  <ul className="list-disc ml-4 space-y-1">
                    <li>
                      Led SaaS redesign resulting in 25% increase in retention.
                    </li>
                    <li>Managed 4 junior designers.</li>
                    <li>Built design systems with React & Tailwind.</li>
                  </ul>
                </Section>

                <Section title="Education">
                  Bachelor of Fine Arts, Interaction Design — 2017
                </Section>

                <Section title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {["Figma", "Adobe CC", "HTML/CSS", "User Research", "Agile"].map(
                      (skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-slate-100 rounded text-xs"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </Section>
              </div>
            )}
          </div>

          {/* RIGHT: CONTROLS */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 max-w-7xl mx-auto p-0 lg:p-0">

            {/* UPLOAD */}
            <ATSUpload onFileUpload={handleFileUpload} />

            {/* ANALYSIS */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Analysis Results</h2>
                {analysisResult && (
                  <span className={`px-2 py-1 ${getScoreStatus(analysisResult.overallScore).bg} ${getScoreStatus(analysisResult.overallScore).text} text-xs font-bold rounded uppercase`}>
                    {getScoreStatus(analysisResult.overallScore).label}
                  </span>
                )}
              </div>

              {analysisResult ? (
                <>
                  {/* SCORE */}
                  <div className="flex items-center gap-4 mb-8 bg-slate-50 p-4 rounded-lg border">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                          fill="none"
                          stroke={getScoreColor(analysisResult.overallScore)}
                          strokeWidth="3"
                          strokeDasharray={`${analysisResult.overallScore * 10},100`}
                        />
                      </svg>
                      <span className="absolute text-xl font-bold">{analysisResult.overallScore}</span>
                    </div>

                    <div>
                      <p className="text-sm uppercase text-slate-500 font-semibold">
                        ATS Score
                      </p>
                      <p className="text-2xl font-bold">
                        {analysisResult.overallScore} <span className="text-base text-slate-400">/ 10</span>
                      </p>
                      <p className={`text-xs font-medium ${getScoreStatus(analysisResult.overallScore).text}`}>
                        {analysisResult.overallScore >= 7 ? "Excellent match potential" : 
                         analysisResult.overallScore >= 5 ? "Good, needs minor tweaks" : "Requires improvements"}
                      </p>
                    </div>
                  </div>

                  <Constraint {...getConstraintStatus(analysisResult.contentScore, 10)} title={`Content Quality: ${analysisResult.contentScore}/10`} />
                  <Constraint {...getConstraintStatus(analysisResult.sectionScore, 10)} title={`Section Structure: ${analysisResult.sectionScore}/10`} />
                  <Constraint {...getConstraintStatus(analysisResult.essentialsScore, 10)} title={`ATS Essentials: ${analysisResult.essentialsScore}/10`} />
                  <Constraint {...getConstraintStatus(analysisResult.tailoringScore, 10)} title={`Keyword Optimization: ${analysisResult.tailoringScore}/10`} />

                  {/* Keywords Section */}
                  {analysisResult.matchedKeywords.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-xs font-semibold text-green-800 mb-2">
                        ✓ Matched Keywords ({analysisResult.matchedKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.matchedKeywords.slice(0, 8).map((k, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white rounded border border-green-300 text-green-700">
                            {k.keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.missingKeywords.length > 0 && (
                    <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="text-xs font-semibold text-red-800 mb-2">
                        ✗ Missing Keywords ({analysisResult.missingKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.missingKeywords.slice(0, 8).map((k, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white rounded border border-red-300 text-red-700">
                            {k.keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {analysisResult.suggestions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">💡 Suggestions</h4>
                      <div className="space-y-2">
                        {analysisResult.suggestions.map((suggestion, idx) => (
                          <div key={idx} className="p-2 bg-blue-50 rounded text-xs text-blue-800 border border-blue-200">
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="w-full mt-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                    Download Detailed Report
                  </button>
                </>
              ) : loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-slate-600">Analyzing your resume...</p>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium mb-2">No Resume Uploaded</p>
                  <p className="text-xs">Upload a resume to see ATS analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b mb-2">
        {title}
      </h2>
      <div className="text-slate-600 text-xs">{children}</div>
    </section>
  );
}

function Constraint({ title, ok, warn, error }) {
  const bg = ok
    ? "bg-green-50 border-green-100"
    : warn
    ? "bg-amber-50 border-amber-100"
    : "bg-red-50 border-red-100";

  return (
    <div className={`p-3 rounded-lg border ${bg} mb-2`}>
      <p className="text-sm font-medium text-slate-800">{title}</p>
    </div>
  );
}