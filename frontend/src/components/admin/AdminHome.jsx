import React from "react";
import {
  FileText,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Design Resume Templates",
      desc: "Create clean, ATS-optimized HTML resume templates that users can instantly apply.",
      icon: FileText,
    },
    {
      title: "Manage Platform Users",
      desc: "Monitor registered users, activity, and access control from a central place.",
      icon: Users,
    },
    {
      title: "Configure AI Capabilities",
      desc: "Enable AI-powered resume writing, optimization, and skill suggestions.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6 sm:px-12 py-12">
      {/* HERO */}
      <div className="max-w-5xl mx-auto mb-20">
        <p className="uppercase tracking-widest text-indigo-400 text-xs mb-3">
          Admin Panel
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
          Welcome Back, Admin
        </h1>
        <p className="text-slate-400 mt-5 max-w-3xl text-sm sm:text-lg">
          This control center lets you manage resume templates, users, and
          AI-driven features. Everything is designed to stay fast, scalable, and
          ATS-friendly.
        </p>
      </div>

      {/* STEPS */}
      <div className="max-w-6xl mx-auto mb-24">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-12">
          How the Platform Works
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative bg-slate-900/80 backdrop-blur
                border border-slate-800 rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-slate-800 rounded-xl text-indigo-400">
                    <Icon size={24} />
                  </div>
                  <span className="text-sm text-slate-500">
                    Step {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SYSTEM READINESS */}
      <div className="max-w-5xl mx-auto mb-24 bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          System Readiness
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Admin authentication enabled",
            "Resume template engine active",
            "AI services connected",
            "User database synchronized",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 text-sm text-slate-300"
            >
              <CheckCircle2 className="text-green-400" size={18} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="max-w-5xl mx-auto flex justify-between items-center
      bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl px-8 py-6"
      >
        <div>
          <h3 className="text-lg sm:text-xl font-semibold">
            Ready to manage your platform?
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            Jump into analytics and advanced controls.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 bg-white text-indigo-600
          px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
        >
          Open Dashboard <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
