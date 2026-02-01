import { Check, EditIcon, Trash2 } from "lucide-react";
import { useState } from "react";

const ExperienceForm = ({ formData, setFormData }) => {
  const [editingId, setEditingId] = useState(
    formData?.experience?.[0]?.id || null,
  );
  const addExperience = () => {
    const id = Date.now();
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...(prev?.experience ?? []),
        {
          id,
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
    setEditingId(id);
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

  function formatMonthYear(value) {
    if (!value) return "";
    const [year, month] = value.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[Number(month) - 1]}${year}`;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="text-[15px] font-semibold text-[#1a1a2e] mb-3 leading-[1.2]">
          Work Experience
        </h3>
        {(formData?.experience ?? []).map((exp, index) => (
          <div
            key={exp.id}
            className="shadow-sm border border-gray-300 rounded-lg p-2"
          >
            {editingId !== exp.id && (
              <div className="rounded-lg p-3 flex flex-col justify-between items-center">
                {/* Option Header */}
                <div className="w-full flex gap-4 justify-between items-center">
                  <div className=" text-md">
                    <span className="font-medium">Experience {index + 1}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      className="hover:text-blue-600 transition-colors"
                      onClick={() => setEditingId(exp.id)}
                    >
                      <EditIcon size={18} />
                    </button>
                    <button
                      className="hover:text-red-600 transition-colors"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {/* Card Content */}
                <div className="w-full mt-2 text-left">
                  <div className="flex justify-start items-center break-all md:flex-row flex-col md:gap-4">
                    <div className="flex gap-4 justify-start items-center text-left md:w-[68%] w-full">
                      <span className="text-left text-md font-semibold">
                        {exp.company}
                      </span>
                    </div>
                    <div className="text-right md:w-[32%] w-full">
                      {exp?.startDate && exp?.endDate && (
                        <span className="text-xs text-slate-500">
                          {formatMonthYear(exp?.startDate)} -{" "}
                          {!/[a-zA-Z]/.test(exp?.endDate)
                            ? formatMonthYear(exp?.endDate)
                            : exp?.endDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium">{exp.title}</span>
                  <div className="w-full py-1 flex gap-2 justify-between items-center">
                    <div className="">
                      {exp?.description && (
                        <div className="text-sm text-slate-500 text-justify break-words">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* <div className="flex items-center gap-2 mb-2">
              <span>Experience {index + 1}</span>
              {formData.experience.length > 1 && (
                <button onClick={() => removeExperience(exp.id)}>
                  <Trash2 size={14} />
                </button>
              )}
            </div> */}
            {editingId === exp.id && (
              <div className="p-2">
                <div className="pr-0.5">
                  <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      placeholder="Software Engineer"
                      value={exp.title || ""}
                      className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                      onChange={(e) =>
                        updateExperience(exp.id, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                    <label>Company *</label>
                    <input
                      type="text"
                      placeholder="Tech Company Inc."
                      value={exp.company || ""}
                      className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                    <label>Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate || ""}
                      className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                    <label>End Date</label>
                    <input
                      type="text"
                      placeholder="Present or YYYY-MM"
                      value={exp.endDate || ""}
                      className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] mb-[10px] mt-2 full-width">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                    value={exp.description || ""}
                    className="h-40 px-2.5 py-2 border text-sm resize-none rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                  />
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
              </div>
            )}
          </div>
        ))}
        <button className="text-left" onClick={addExperience}>
          + Add Experience
        </button>
      </div>
    </>
  );
};

export default ExperienceForm;
