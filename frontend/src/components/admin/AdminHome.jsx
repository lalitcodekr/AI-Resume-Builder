import { FileText, Plus, Sparkles, Users } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <Plus className="text-blue-500" size={28} />,
      title: "Create Template",
      desc: "Add a new resume template",
      hover: "hover:border-blue-500",
      onClick: () => navigate("/admin/create-templates"),
    },
    {
      icon: <FileText className="text-green-400" size={28} />,
      title: "Resume Templates",
      desc: "View & manage templates",
      hover: "hover:border-green-400",
      onClick: () => navigate("/admin/templates"),
    },
    {
      icon: <Users className="text-yellow-400" size={28} />,
      title: "Users",
      desc: "Manage platform users",
      hover: "hover:border-yellow-400",
      onClick: () => navigate("/admin/users"), // ✅ WORKS
    },
    {
      icon: <Sparkles className="text-pink-400" size={28} />,
      title: "AI Models",
      desc: "Configure AI features",
      hover: "hover:border-pink-400",
      onClick: () => navigate("/admin/dashboard"),
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-5 sm:p-8 lg:p-10">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          Welcome, Admin 👋
        </h1>
        <p className="text-slate-400 mt-3 max-w-2xl">
          Manage resume templates, users, and AI-powered features from one
          dashboard.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 flex-1">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={card.onClick}
            className={`flex flex-col gap-4 p-6 rounded-2xl bg-gray-800 
              border border-gray-700 ${card.hover}
              hover:bg-gray-700 transition-all duration-200
              hover:-translate-y-1 shadow-lg`}
          >
            {card.icon}
            <div className="text-left">
              <p className="font-semibold text-lg">{card.title}</p>
              <p className="text-slate-400 text-sm mt-1">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <footer className="mt-14 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} AI Resume Builder Admin Panel
      </footer>
    </div>
  );
}
