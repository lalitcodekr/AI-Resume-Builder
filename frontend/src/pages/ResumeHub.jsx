import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers, Download, History, Copy, CheckCircle2, BarChart3,
  Clock, LayoutDashboard, Eye, MoreHorizontal, FileText, Zap,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

import NavBar from "../components/NavBar";
import Footer from "./Footer";
import hub from "../assets/resume-hub1.png";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// Animated Wrapper
const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const ResumeHubPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleFeatureClick = (path) => {
    if (isLoggedIn) navigate(path);
    else {
      localStorage.setItem("redirectPath", path);
      navigate("/login");
    }
  };

  const tableData = [
    { title: "Product Manager - Tech", score: 94, dl: 18, date: "14 hours ago", color: "text-green-500" },
    { title: "Senior Software Engineer", score: 88, dl: 12, date: "2 days ago", color: "text-[#0077cc]" },
    { title: "Marketing Specialist", score: 76, dl: 5, date: "Jan 12, 2026", color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] overflow-x-hidden">
      <NavBar />

      {/* HERO */}
      <section className="px-8 py-20 text-center">
        <h1 className="text-5xl font-black">
          Your Career <span className="text-[#0077cc]">Organized</span>
        </h1>
        <p className="mt-4 text-gray-500">
          Manage resumes and track performance in one place.
        </p>

        <button
          onClick={() => handleFeatureClick("/user/my-resumes")}
          className="mt-6 px-8 py-4 bg-orange-500 text-white rounded-xl font-bold"
        >
          Access My Hub
        </button>
      </section>

      {/* TABLE */}
      <AnimatedSection className="px-8 py-16">
        <table className="w-full">
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} className="border-b">
                <td className="py-4">{row.title}</td>
                <td>{row.score}</td>
                <td>{row.dl}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="text-center py-20">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Manage Your Resumes?
        </h2>

        <button
          onClick={() => handleFeatureClick("/user/my-resumes")}
          className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold"
        >
          Access Hub Now
        </button>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default ResumeHubPage;