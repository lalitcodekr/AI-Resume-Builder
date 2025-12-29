import React, { useState, useRef, useMemo } from "react";
import {
  Upload,
  Download,
  Eye,
  Code,
  FileText,
  Moon,
  Sun,
  Copy,
  Check,
  RefreshCw,
  X,
} from "lucide-react";

/**
 * ResumeEditor
 * - Cleaned imports
 * - Stable preview generation with memoization
 * - Safer tab closing logic
 * - Small UX + correctness fixes
 */
const Templates = () => {
  const [viewMode, setViewMode] = useState("split"); // split | code | preview
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState("index.html");
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState({
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resume - John Doe</title>
</head>
<body>
  <div class="resume">
    <header class="header">
      <h1 class="name">John Doe</h1>
      <p class="title">Full Stack Developer</p>
      <div class="contact">
        <span>john.doe@email.com</span>
        <span>•</span>
        <span>+1 234 567 8900</span>
        <span>•</span>
        <span>San Francisco, CA</span>
      </div>
    </header>

    <section class="section">
      <h2>Professional Summary</h2>
      <p>
        Experienced developer with 5+ years in building scalable web
        applications. Specialized in React, Node.js, and cloud architecture.
      </p>
    </section>

    <section class="section">
      <h2>Experience</h2>

      <div class="experience-item">
        <div class="exp-header">
          <h3>Senior Full Stack Developer</h3>
          <span class="period">2020 - Present</span>
        </div>
        <p class="company">Tech Corp • San Francisco, CA</p>
        <ul class="achievements">
          <li>Led microservices architecture serving 1M+ users</li>
          <li>Reduced API response time by 40%</li>
          <li>Mentored 5 junior developers</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <h2>Education</h2>
      <div class="education-item">
        <div class="edu-header">
          <h3>BSc in Computer Science</h3>
          <span class="period">2014 - 2018</span>
        </div>
        <p class="school">University of Technology</p>
      </div>
    </section>

    <section class="section">
      <h2>Skills</h2>
      <div class="skills-grid">
        <div class="skill-category">
          <h4>Frontend</h4>
          <p>React, TypeScript, Tailwind</p>
        </div>
        <div class="skill-category">
          <h4>Backend</h4>
          <p>Node.js, Python</p>
        </div>
      </div>
    </section>
  </div>
</body>
</html>`,

    "styles.css": `@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f5;
  color: #1a1a1a;
}

.resume {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 15mm 20mm;
  background: #fff;
}

.header {
  text-align: center;
  border-bottom: 3px solid #2563eb;
  padding-bottom: 20px;
  margin-bottom: 25px;
}

.name { font-size: 36px; color: #1e40af; }
.title { color: #64748b; margin-bottom: 10px; }
.contact { font-size: 13px; color: #64748b; display: flex; gap: 8px; justify-content: center; }

.section { margin-bottom: 24px; }
.section h2 {
  font-size: 18px;
  text-transform: uppercase;
  color: #1e40af;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 12px;
}

.experience-item { margin-bottom: 18px; }
.exp-header { display: flex; justify-content: space-between; }
.company { color: #475569; margin-bottom: 6px; }
.achievements li { font-size: 14px; margin-left: 16px; }

.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

@media print {
  body { background: #fff; }
}`,
  });

  const [openTabs, setOpenTabs] = useState(["index.html", "styles.css"]);

  /** Build iframe HTML safely */
  const previewHTML = useMemo(() => {
    const html = files["index.html"] || "";
    const css = files["styles.css"] || "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>${css}</style>
</head>
<body>
${html
  .replace(/<!DOCTYPE html[\s\S]*?>/i, "")
  .replace(/<html[\s\S]*?>/i, "")
  .replace(/<head[\s\S]*?<\/head>/i, "")
  .replace(/<\/html>/i, "")}
</body>
</html>`;
  }, [files]);

  const updateFile = (name, value) =>
    setFiles((p) => ({ ...p, [name]: value }));

  const closeTab = (name, e) => {
    e.stopPropagation();
    if (openTabs.length === 1) return;

    const next = openTabs.filter((t) => t !== name);
    setOpenTabs(next);

    if (activeFile === name) setActiveFile(next[0]);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) =>
      setFiles((p) => ({ ...p, "index.html": ev.target.result }));
    reader.readAsText(file);
  };

  const downloadHTML = () => {
    const blob = new Blob([previewHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHTML = async () => {
    await navigator.clipboard.writeText(previewHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`h-screen flex flex-col ${
        darkMode ? "bg-gray-950" : "bg-gray-100"
      }`}
    >
      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <FileText className="text-blue-500" size={18} />
          <span
            className={`text-sm font-semibold ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Resume Editor
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={copyHTML} className="px-2 py-1 text-xs">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button onClick={downloadHTML} className="px-2 py-1 text-xs">
            <Download size={14} />
          </button>
          <input
            type="file"
            accept=".html"
            hidden
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 text-xs"
          >
            <Upload size={14} />
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {(viewMode === "split" || viewMode === "code") && (
          <div className="w-1/2 flex flex-col border-r border-gray-800">
            <div className="flex border-b border-gray-800">
              {openTabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveFile(t)}
                  className={`px-3 py-2 text-xs flex items-center gap-2 ${
                    activeFile === t
                      ? "bg-gray-800 text-white"
                      : "text-gray-400"
                  }`}
                >
                  {t}
                  <X size={12} onClick={(e) => closeTab(t, e)} />
                </button>
              ))}
            </div>
            <textarea
              value={files[activeFile]}
              onChange={(e) => updateFile(activeFile, e.target.value)}
              className="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm outline-none"
            />
          </div>
        )}

        {(viewMode === "split" || viewMode === "preview") && (
          <div className="w-1/2 flex items-center justify-center bg-gray-800">
            <iframe
              title="preview"
              srcDoc={previewHTML}
              className="bg-white"
              style={{
                width: "210mm",
                height: "297mm",
                border: "none",
                transform: "scale(0.85)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
