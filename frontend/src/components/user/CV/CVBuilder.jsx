import React, { useState, useEffect ,useRef} from "react";
import UserNavBar from "../UserNavBar/UserNavBar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Upload, FileText } from "lucide-react";

import {
  User,
  Briefcase,
  GraduationCap,
  Zap,
  FolderKanban,
  Award,
} from "lucide-react";

// Forms
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ProjectsForm from "./forms/ProjectsForm";
import CertificationsForm from "./forms/CertificationsForm";
import CVPreview from "./CVPreview";
import "./CVBuilder.css";

const sections = [
  "personal",
  "work",
  "education",
  "skills",
  "projects",
  "certifications",
];

const sectionIcon = {
  personal: <User size={16} />,
  work: <Briefcase size={16} />,
  education: <GraduationCap size={16} />,
  skills: <Zap size={16} />,
  projects: <FolderKanban size={16} />,
  certifications: <Award size={16} />,
};

const CVBuilder = () => {
  /* -------------------- STATE -------------------- */
  const [activeSection, setActiveSection] = useState("personal");
  const formTopRef=useRef(null);
  useEffect(()=>{
    if(formTopRef.current){
      formTopRef.current.scrollIntoView({behaviour:"smooth",
        block:"start"
      })
    }
  },[activeSection])
    const [resumeId, setResumeId] = useState(null);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    experience: [
      {
        id: Date.now(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        id: Date.now() + 1,
        school: "",
        degree: "",
        location: "",
        graduationDate: "",
        gpa: "",
      },
    ],
    skills: { technical: [], soft: [] },
    projects: [
      {
        id: Date.now() + 2,
        name: "",
        description: "",
        technologies: "",
        link: "",
      },
    ],
    certifications: [
      {
        id: Date.now() + 3,
        name: "",
        issuer: "",
        date: "",
        link: "",
      },
    ],
  });

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/resume",
          { withCredentials: true }
        );
        if (res.data?.length) {
          setResumeId(res.data[0]._id);
          setFormData((prev) => ({ ...prev, ...res.data[0].data }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchResume();
  }, []);

  /* -------------------- HELPERS -------------------- */
  const currentIndex = sections.indexOf(activeSection);

  const goNext = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* -------------------- RENDER FORM -------------------- */
  const renderFormContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalInfoForm
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case "work":
        return <ExperienceForm formData={formData} setFormData={setFormData} />;
      case "education":
        return <EducationForm formData={formData} setFormData={setFormData} />;
      case "skills":
        return <SkillsForm formData={formData} setFormData={setFormData} />;
      case "projects":
        return <ProjectsForm formData={formData} setFormData={setFormData} />;
      case "certifications":
        return (
          <CertificationsForm
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  const sectionLabel = {
    personal: "Personal",
    work: "Work",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
  };

  return (
    <div className="h-screen bg-slate-50 overflow-hidden">
      <UserNavBar />

      <div className="cv-builder-container w-full px-4 pb-4 pt-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Craft Your CV
          </h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg">
              <Upload size={16} /> Upload
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg">
              <FileText size={16} /> Export
            </button>
          </div>
        </div>

        <div className="cv-builder-content">
          {/* LEFT PANEL */}
          {!isPreviewMaximized && (
            <div className="cv-form-section">
              <div className="cv-form-container">
                <div className="max-w-2xl mx-auto" ref={formTopRef}>

                  {/* 🔥 SECTION TITLE + PROGRESS (EXACT IMAGE STYLE) */}
                   <div className="flex items-center justify-between mb-6">
                    {/* <div className="font-medium text-slate-700">
                      {sectionLabel[activeSection]}
                    </div>  */}
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
  {sectionIcon[activeSection]}
  {sectionLabel[activeSection]}
</div>

                    <div className="flex flex-col items-center gap-1">
                      <p className="text-xs text-slate-500 font-medium">
                        Step {currentIndex + 1} of {sections.length}
                      </p>
                      <div className="h-2.5 w-28 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{
                            width: `${
                              ((currentIndex + 1) / sections.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM */}
                  {renderFormContent()}

                  {/* NAV BUTTONS */}
                  <div className="flex justify-between mt-10">
                    <button
                      onClick={goPrevious}
                      disabled={currentIndex === 0}
                      className="px-5 py-2 rounded-lg bg-slate-200 text-slate-700 disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={goNext}
                      disabled={currentIndex === sections.length - 1}
                      className="px-5 py-2 rounded-lg bg-black text-white disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* RIGHT PANEL */}
          <CVPreview
            formData={formData}
            isMaximized={isPreviewMaximized}
            onToggleMaximize={() =>
              setIsPreviewMaximized(!isPreviewMaximized)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
