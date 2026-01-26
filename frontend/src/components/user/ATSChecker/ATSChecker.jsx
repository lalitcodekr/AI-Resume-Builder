// File: frontend/src/components/user/ATSChecker/ATSChecker.jsx

import React, { useState, useRef, useEffect } from "react";
import UserNavbar from "../UserNavBar/UserNavBar";

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

// PDF Viewer Component using PDF.js
function PDFViewer({ file }) {
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
        
        renderPage(pdf, 1);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setLoading(false);
      }
    };

    loadPDF();
  }, [file]);

  const renderPage = async (pdf, pageNum) => {
    const page = await pdf.getPage(pageNum);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const containerWidth = canvas.parentElement.clientWidth;
    const viewport = page.getViewport({ scale: 1 });
    const scale = (containerWidth - 40) / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    // Clear the canvas and reset transformations to fix inversion issue
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0);

    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport
    };

    await page.render(renderContext).promise;
  };

  const goToPage = async (pageNum) => {
    if (pageNum >= 1 && pageNum <= numPages && pdfDoc) {
      setCurrentPage(pageNum);
      await renderPage(pdfDoc, pageNum);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full shadow-lg rounded-lg" />
      
      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 text-sm"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === numPages}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// DOCX Viewer Component
function DOCXViewer({ file }) {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDOCX = async () => {
      try {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
        setLoading(false);
      } catch (error) {
        console.error('Error loading DOCX:', error);
        setLoading(false);
      }
    };

    loadDOCX();
  }, [file]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading DOCX...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.6'
      }}
    />
  );
}

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
  <p >
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
  </p>
);

}

// Main ATSChecker Component
export default function ATSChecker() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!document.querySelector('script[src*="pdf.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleFileUpload = async (file) => {
    console.log("File uploaded:", file.name, file.type);
    setUploadedFile(file);
    setLoading(true);
    setAnalysisResult(null);
    setError(null);
    
    try {
      let extractedText = "";
      
      if (file.type === "text/plain") {
        extractedText = await file.text();
        console.log("TXT file extracted, length:", extractedText.length);
        setResumeText(extractedText);
        
        setTimeout(() => {
          const analysis = analyzeResumeATS(extractedText);
          console.log("Analysis result:", analysis);
          setAnalysisResult(analysis);
          setLoading(false);
        }, 500);
        return;
      }
      
      if (file.type === "application/pdf" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        
        const formData = new FormData();
        formData.append('resume', file);
        
        try {
          const response = await fetch('http://localhost:5000/api/resumes/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
          
          console.log('Backend response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Backend data:', data);
            
            if (data.success && data.data) {
              extractedText = data.data.extractedText || '';
              
              console.log("Extracted text length:", extractedText.length);
              
              setAnalysisResult({
                overallScore: data.data.overallScore,
                contentScore: 0,
                sectionScore: 0,
                essentialsScore: 0,
                tailoringScore: 0,
                matchedKeywords: data.data.matchedKeywords || [],
                missingKeywords: data.data.missingKeywords || [],
                suggestions: data.data.suggestions || []
              });
              
              setLoading(false);
              return;
            }
          } else if (response.status === 401) {
            throw new Error("AUTHENTICATION_REQUIRED");
          }
        } catch (apiError) {
          console.error("Backend API error:", apiError);
          
          if (apiError.message === "AUTHENTICATION_REQUIRED") {
            setError("Please log in to analyze PDF/DOCX files");
            setLoading(false);
            return;
          }
        }
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error("Error processing file:", error);
      setError(error.message || "Error processing file");
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

  return (
    <div className="min-h-screen bg-white">
      {/* Add Navbar */}
      <UserNavbar />
      
      <div className="w-full p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800">ATS Checker</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Optimize your resume for applicant tracking systems.
        </p>
      </div>

      <div className="bg-white min-h-screen">
        <div className="flex flex-col lg:flex-row min-h-full w-full max-w-7xl mx-auto p-4 gap-6">

          <div className="w-full lg:w-2/3 bg-slate-50 rounded-xl p-4 lg:p-8 overflow-y-auto flex flex-col items-center border border-slate-200">
            <div className="w-full max-w-3xl flex justify-between items-center mb-4 px-2">
              <h3 className="text-sm font-semibold text-slate-600">
                {uploadedFile ? "Resume Preview" : "Document Preview"}
              </h3>
              {uploadedFile && (
                <span className="text-xs text-slate-500">{uploadedFile.name}</span>
              )}
            </div>

            {uploadedFile ? (
              <div className="w-full max-w-3xl p-2 rounded-lg min-h-[600px]">
                {uploadedFile.type === "application/pdf" ? (
                  <PDFViewer file={uploadedFile} />
                ) : uploadedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                  <DOCXViewer file={uploadedFile} />
                ) : uploadedFile.type === "text/plain" ? (
                  <div className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed p-4 bg-white rounded-lg">
                    {resumeText}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    Unsupported file type
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-2xl flex items-center justify-center">
                <img 
                  src="https://cdn.prod.website-files.com/62f3a8c764f6eb23f4252b13/67b8236ee93071ba897c079c_Basic%20professional%20resume-1.png" 
                  alt="Sample Resume Preview" 
                  className="w-full h-auto shadow-lg rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <ATSUpload onFileUpload={handleFileUpload} />

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
                      <p className="text-sm uppercase text-slate-500 font-semibold">ATS Score</p>
                      <p className="text-2xl font-bold">
                        {analysisResult.overallScore} <span className="text-base text-slate-400">/ 10</span>
                      </p>
                      <p className={`text-xs font-medium ${getScoreStatus(analysisResult.overallScore).text}`}>
                        {analysisResult.overallScore >= 7 ? "Excellent match potential" : 
                         analysisResult.overallScore >= 5 ? "Good, needs minor tweaks" : "Requires improvements"}
                      </p>
                    </div>
                  </div>

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