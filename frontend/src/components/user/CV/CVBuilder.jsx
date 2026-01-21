import React, { useState, useEffect } from "react";
import FormTabs from "./FormTabs";
import UserNavBar from "../UserNavBar/UserNavBar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Save, Upload, FileText } from "lucide-react";

// Import existing Forms
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

const CVBuilder = () => {
    /* -------------------- STATE -------------------- */
    const [activeSection, setActiveSection] = useState("personal");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
        summary: "",
        experience: [{
            id: Date.now(),
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            description: ''
        }],
        education: [{
            id: Date.now() + 1,
            school: '',
            degree: '',
            location: '',
            graduationDate: '',
            gpa: ''
        }],
        skills: { technical: [], soft: [] },
        projects: [{
            id: Date.now() + 2,
            name: '',
            description: '',
            technologies: '',
            link: ''
        }],
        certifications: [{
            id: Date.now() + 3,
            name: '',
            issuer: '',
            date: '',
            link: ''
        }]
    });

    const [resumeId, setResumeId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);

    /* -------------------- LOAD DATA -------------------- */
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/resume", { withCredentials: true });
                if (res.data && res.data.length > 0) {
                    const latestResume = res.data[0];
                    setResumeId(latestResume._id);
                    if (latestResume.data) {
                        setFormData(prev => ({ ...prev, ...latestResume.data }));
                    }
                    toast.success("Resume loaded successfully");
                }
            } catch (error) {
                console.error("Error loading resume:", error);
            }
        };
        fetchResume();
    }, []);

    /* -------------------- SAVE DATA -------------------- */
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                title: formData.fullName ? `${formData.fullName}'s Resume` : "My Resume",
                templateId: "professional",
                data: formData
            };

            let res;
            if (resumeId) {
                await axios.put(`http://localhost:5000/api/resume/${resumeId}`, payload, { withCredentials: true });
            } else {
                res = await axios.post("http://localhost:5000/api/resume", payload, { withCredentials: true });
                setResumeId(res.data._id);
            }
            toast.success("Resume saved successfully!");
        } catch (error) {
            console.error("Error saving resume:", error);
            toast.error("Failed to save resume");
        } finally {
            setIsSaving(false);
        }
    };

    /* -------------------- HELPERS -------------------- */
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
                    <CertificationsForm formData={formData} setFormData={setFormData} />
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-slate-50 overflow-hidden">
            <UserNavBar />

            <div className="cv-builder-container w-full px-4 pb-4 pt-6">
                {/* Main Header - Aligned with Panels */}
                <div className="flex gap-6 mb-6 h-10">
                    <div className="flex-[0.33] flex items-center">
                        <h1 className="text-2xl font-bold text-slate-900 leading-none">Craft Your CV</h1>
                    </div>
                    <div className="flex-[0.67] flex items-center justify-end">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                <Upload size={18} />
                                Upload
                            </button>
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                <FileText size={18} />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
                <div className="cv-builder-content">
                    {/* LEFT PANEL: EDITOR */}
                    {!isPreviewMaximized && (
                        <div className="cv-form-section">
                            {/* Sticky Toolbar */}
                            <div className="cv-form-header flex items-center justify-between">
                                <FormTabs
                                    activeSection={activeSection}
                                    setActiveSection={setActiveSection}
                                />


                            </div>
                            {/* Scrollable Form Area */}
                            <div className="cv-form-container">
                                <div className="max-w-2xl mx-auto">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                                        {
                                            activeSection === 'personal' ? 'Personal Information' :
                                                activeSection === 'work' ? 'Work Experience' :
                                                    activeSection === 'education' ? 'Education' :
                                                        activeSection === 'skills' ? 'Skills & Interests' :
                                                            activeSection === 'projects' ? 'Projects' :
                                                                activeSection === 'certifications' ? 'Certifications' :
                                                                    activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
                                        }
                                    </h2>
                                    <p className="subtitle text-slate-500 mb-6">Customize your details below.</p>

                                    {renderFormContent()}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* RIGHT PANEL: PREVIEW */}
                    <CVPreview
                        formData={formData}
                        isMaximized={isPreviewMaximized}
                        onToggleMaximize={() => setIsPreviewMaximized(!isPreviewMaximized)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CVBuilder;
