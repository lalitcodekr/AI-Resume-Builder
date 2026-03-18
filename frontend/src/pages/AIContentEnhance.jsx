import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Cpu, Zap, ArrowRight, CheckCircle2, 
  Target, TrendingUp, Layers, Wand2 
} from 'lucide-react';
import { motion, useInView } from "framer-motion";

import Footer from "./Footer";
import NavBar from "../components/NavBar";
import AiEnhancement from "../assets/AiEnhancement.png";

// Reusable Scroll Animation Wrapper
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const AIEnhancementPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleCTA = () =>
    navigate(isLoggedIn ? "/user/resume-builder" : "/login");

  const scanItems = [
    { title: "Strong Action Verbs", desc: "Replaces passive language with leadership-focused verbs." },
    { title: "Metric Identification", desc: "Identifies opportunities to add percentages, dollars, or timeframes." },
    { title: "Skill Density", desc: "Ensures your key competencies are naturally woven into every bullet." },
    { title: "Contextual Relevance", desc: "Checks if your achievements align with job requirements." }
  ];

  const refinementFeatures = [
    { icon: Wand2, t: "Auto-Rewrite", d: "Transform duties into achievements." },
    { icon: Target, t: "Industry Targeting", d: "Uses field-specific vocabulary." },
    { icon: TrendingUp, t: "Quantification", d: "Adds metrics to prove impact." },
    { icon: Layers, t: "Hierarchy Logic", d: "Highlights best points first." },
    { icon: Zap, t: "Tone Adjustment", d: "Makes writing confident." },
    { icon: CheckCircle2, t: "Clarity Check", d: "Removes fluff & jargon." }
  ];

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] overflow-x-hidden select-none">
      <NavBar />
      
      {/* HERO */}
      <section className="relative px-6 pt-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-blue-50 rounded-full blur-[140px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-orange-50 rounded-full blur-[140px] opacity-60" />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center min-h-[80vh] gap-8 pb-16 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-50">
                <Cpu size={16} className="text-[#0077cc]" />
                <span className="text-xs font-bold text-[#0077cc] uppercase">
                  Smart Content Optimization
                </span>
              </div>

              <h1 className="mb-5 text-4xl md:text-6xl font-black leading-tight">
                Turn Weak Points into <span className="text-[#0077cc]">Power Phrases</span>
              </h1>

              <p className="mb-8 text-lg text-gray-500">
                AI rewrites boring duties into achievements that get interviews.
              </p>

              <button
                onClick={handleCTA}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold"
              >
                Enhance My Content
                <ArrowRight size={20} />
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              <img src={AiEnhancement} alt="AI Enhancement" className="w-full max-w-xl mx-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT IS AI */}
      <AnimatedSection className="px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">What is AI Enhancement?</h2>

          <ul className="space-y-4">
            {scanItems.map((item, i) => (
              <li key={i} className="flex gap-3 justify-center">
                <CheckCircle2 className="text-blue-500" />
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      {/* FEATURES */}
      <AnimatedSection className="px-8 py-16 bg-gray-50">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {refinementFeatures.map((f, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
              <f.icon className="text-blue-500 mb-4" />
              <h4 className="font-bold">{f.t}</h4>
              <p className="text-gray-500 text-sm">{f.d}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="text-center py-20">
        <h2 className="text-4xl font-bold mb-6">Ready to Upgrade?</h2>

        <button
          onClick={handleCTA}
          className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-xl font-bold"
        >
          <Sparkles size={18} />
          Start Enhancing Now
        </button>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default AIEnhancementPage;