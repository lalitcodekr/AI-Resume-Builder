import { Check, Edit, Trash2 } from "lucide-react";

import { useState } from "react";

const ExperienceForm = ({ formData, setFormData }) => {
   const [editingId, setEditingId] = useState(
    formData?.experience?.[0]?.id || null
      );

  const addExperience = () => {
    console.log(formData);
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...(prev?.experience ?? []),
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
    }));
  };

  const removeExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: (prev?.experience ?? []).filter((e) => e.id !== id),
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[15px] font-semibold text-[#1a1a2e] mb-3 leading-[1.2]">Work Experience</h3>
      {(formData?.experience ?? []).map((exp, index) => (
  <div
    key={exp.id}
    className="shadow-sm border border-gray-300 rounded-lg p-2"
  >
    {/* VIEW MODE */}
    {editingId !== exp.id && (
      <div className="rounded-lg p-3 flex flex-col justify-between items-center">
        <div className="w-full flex justify-between items-center">
          <span className="font-medium">
            Experience {index + 1}
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => setEditingId(exp.id)}
              className="hover:text-blue-600"
            >
              <Edit size={18} />
            </button>

            <button
              onClick={() => removeExperience(exp.id)}
              className="hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="w-full mt-2 text-left">
          <span className="font-semibold">{exp.company}</span>
          <div className="text-sm">{exp.title}</div>
          <div className="text-xs text-gray-500">
            {exp.startDate} - {exp.endDate}
          </div>
          <div className="text-sm mt-1 text-gray-600">
            {exp.description}
          </div>
        </div>
      </div>
    )}

    {/* EDIT MODE */}
    {editingId === exp.id && (
      <>
        <div className="px-3 py-4">
          <div className="flex flex-col gap-2 mb-3">
            <label>Job Title *</label>
            <input
              type="text"
              value={exp.title || ""}
              onChange={(e) =>
                updateExperience(exp.id, "title", e.target.value)
              }
              className="px-2 py-2 border rounded"
            />
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <label>Company *</label>
            <input
              type="text"
              value={exp.company || ""}
              onChange={(e) =>
                updateExperience(exp.id, "company", e.target.value)
              }
              className="px-2 py-2 border rounded"
            />
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <label>Start Date</label>
            <input
              type="month"
              value={exp.startDate || ""}
              onChange={(e) =>
                updateExperience(exp.id, "startDate", e.target.value)
              }
              className="px-2 py-2 border rounded"
            />
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <label>End Date</label>
            <input
              type="text"
              value={exp.endDate || ""}
              onChange={(e) =>
                updateExperience(exp.id, "endDate", e.target.value)
              }
              className="px-2 py-2 border rounded"
            />
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <label>Description</label>
            <textarea
              rows={3}
              value={exp.description || ""}
              onChange={(e) =>
                updateExperience(exp.id, "description", e.target.value)
              }
              className="px-2 py-2 border rounded"
            />
          </div>
        </div>

        {/* Done Button */}
                <div className="flex justify-end items-center gap-2 px-2 py-4">
                  <button
                    className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-800"
                    onClick={() => removeExperience(exp.id)}
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                  <button
                    className="text-sm font-medium bg-black py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-black/70"
                    onClick={() => setEditingId(null)}
                  >
                    <Check size={18} />
                    Done
                  </button>
                </div>
      </>
    )}
  </div>
))}

      <button className="text-left" onClick={addExperience}>
        + Add Experience
      </button>
    </div>
  );
};

export default ExperienceForm;