import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Zap, Target, ArrowRight, TrendingUp, Shield,
  CheckCircle2, BarChart3, Lightbulb, SearchCheck, Layers,
  FileEdit, Rocket,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

import NavBar from "../components/NavBar";
import Footer from "./Footer";
import AiBuilder from "../assets/AiBuilder.png";

// Reusable Scroll Animation Wrapper
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const AIBuilderFeature = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleCTA = () =>
    navigate(isLoggedIn ? "/user/resume-builder" : "/login");

  const features = [
    { icon: <Zap size={32} />, title: "Save hours of work", desc: "Create a professional resume in 15 minutes instead of hours" },
    { icon: <Target size={32} />, title: "Tailored content", desc: "AI customizes your resume for each job application automatically" },
    { icon: <TrendingUp size={32} />, title: "Better results", desc: "AI-optimized resumes get 3x more interviews than traditional ones" },
    { icon: <Shield size={32} />, title: "ATS-optimized", desc: "Ensure your resume passes applicant tracking systems every time" },
  ];

  const aiCapabilities = [
    { icon: <Sparkles size={32} />, title: "Content Enhancement", desc: "Transforms basic descriptions into achievement-focused bullet points" },
    { icon: <Target size={32} />, title: "Keyword Optimization", desc: "Identifies and adds relevant keywords to pass ATS filters" },
    { icon: <BarChart3 size={32} />, title: "Achievement Quantification", desc: "Helps you add metrics and numbers to demonstrate impact" },
    { icon: <Lightbulb size={32} />, title: "Smart Suggestions", desc: "Provides real-time suggestions based on your industry" },
    { icon: <SearchCheck size={32} />, title: "Grammar & Clarity", desc: "Ensures your resume is error-free and easy to read" },
    { icon: <Layers size={32} />, title: "Format Optimization", desc: "Applies professional formatting for AI readability" },
    { icon: <FileEdit size={32} />, title: "Section Guidance", desc: "Recommends which sections to include based on experience" },
    { icon: <Zap size={32} />, title: "Action Verb Selection", desc: "Suggests powerful verbs to make experience stand out" },
    { icon: <Rocket size={32} />, title: "Impact Maximization", desc: "Helps you highlight impressive achievements first" },
  ];

  return (
    <div className="min-h-screen bg-white font-['Outfit'] select-none overflow-x-hidden">
      <NavBar />

      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-24 pb-10 overflow-hidden bg-white">
        <div className="absolute rounded-full -top-24 -left-24 w-72 h-72 bg-blue-50 blur-3xl opacity-60" />
        <div className="absolute rounded-full -bottom-24 -right-24 w-72 h-72 bg-orange-50 blur-3xl opacity-60" />

        <div className="grid items-center gap-12 mx-auto max-w-7xl lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-block px-4 py-2 bg-blue-50 text-[#0077cc] rounded-full text-sm font-bold mb-6">
              AI-Powered Resume Builder
            </div>

            <h1 className="mb-6 text-4xl sm:text-6xl font-black leading-tight text-[#1a2e52] font-jakarta tracking-tight">
              Build Your Resume with <span className="text-[#0077cc]">AI Assistance</span>
            </h1>

            <p className="mb-8 text-lg sm:text-xl leading-relaxed text-gray-600 max-w-2xl">
              Let our advanced AI guide you through every step of resume creation.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <CheckCircle2 size={20} className="text-green-500 shrink-0" />
              <span className="text-sm font-bold text-gray-400">
                100% free • AI-powered • Professional results
              </span>
            </div>

            <button onClick={handleCTA} className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-1">
              <Zap size={20} />
              Start Building Now
              <ArrowRight size={20} />
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <img src={AiBuilder} alt="AI Resume UI" className="w-full max-w-xl mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <AnimatedSection className="px-4 py-14 bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-[#1a2e52] mb-10">
            How Our AI Builder Works
          </h2>

          {[1, 2, 3].map((step, i) => (
            <div key={i} className="flex gap-6 mb-6">
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                {step}
              </div>
              <div>
                <h4 className="font-bold text-lg">
                  {step === 1 && "Enter your information"}
                  {step === 2 && "AI enhances your content"}
                  {step === 3 && "Download and apply"}
                </h4>
                <p className="text-gray-500 text-sm">
                  {step === 1 && "Add your details"}
                  {step === 2 && "AI optimizes your resume"}
                  {step === 3 && "Download final resume"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default AIBuilderFeature;