import { Check, EditIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const ProjectsForm = ({ formData, setFormData }) => {
  const [editingId, setEditingId] = useState(
    formData?.projects?.[0]?.id || null,
  );

  const addProject = () => {
    const id = crypto.randomUUID();
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...(prev?.projects ?? []),
        {
          id,
          name: "",
          description: "",
          technologies: "",
          link: {},
        },
      ],
    }));
    setEditingId(id);
  };

  const removeProject = (id) => {
    setFormData((prev) => ({
      ...prev,
      projects: (prev?.projects ?? []).filter((p) => p.id !== id),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl text-[#1a1a2e] mb-3 leading-[1.2]">
        Projects
      </span>

      {(formData?.projects ?? []).map((project, index) => (
        <div
          key={project.id}
          className="shadow-sm border border-gray-300 rounded-lg p-2"
        >
          {/* ===== COLLAPSED CARD ===== */}
          {editingId !== project.id && (
            <div className="rounded-lg p-3 flex flex-col justify-between items-center">
              {/* Header */}
              <div className="w-full flex gap-4 justify-between items-center">
                <span className="font-medium">Project {index + 1}</span>

                <div className="flex gap-4 items-center">
                  <button
                    className="hover:text-blue-600 transition-colors"
                    onClick={() => setEditingId(project.id)}
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    className="hover:text-red-600 transition-colors"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="w-full mt-2 text-left">
                <div className="text-md font-semibold break-all">
                  {project.name || "—"}
                </div>

                {project.technologies && (
                  <div className="text-sm text-slate-600">
                    {project.technologies}
                  </div>
                )}

                {project.description && (
                  <div className="text-xs text-slate-500 mt-1">
                    {project.description}
                  </div>
                )}

                {project?.link?.github && (
                  <a
                    href={project.link.github}
                    target="_blank"
                    className="text-xs text-blue-600 mt-1 inline-block"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ===== EDIT MODE ===== */}
          {editingId === project.id && (
            <>
              <div className="px-3 py-4">
                <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                    value={project.name || ""}
                    placeholder="E-commerce Platform"
                    onChange={(e) => {
                      const updated = formData.projects.map((item) =>
                        item.id === project.id
                          ? { ...item, name: e.target.value }
                          : item,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        projects: updated,
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-[6px] mb-[10px]">
                  <label>Technologies Used</label>
                  <input
                    type="text"
                    className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                    value={project.technologies || ""}
                    placeholder="React, Node.js, MongoDB"
                    onChange={(e) => {
                      const updated = formData.projects.map((item) =>
                        item.id === project.id
                          ? { ...item, technologies: e.target.value }
                          : item,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        projects: updated,
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-[6px] mb-[10px]">
                  <label>Description</label>
                  <textarea
                    className="h-28 px-2.5 py-2 border text-sm rounded border-1.5 resize-none focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                    value={project.description || ""}
                    maxLength={500}
                    onChange={(e) => {
                      const updated = formData.projects.map((item) =>
                        item.id === project.id
                          ? { ...item, description: e.target.value }
                          : item,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        projects: updated,
                      }));
                    }}
                  />
                  <span className="ml-2 text-xs text-slate-500">
                    {project.description?.length || 0}/500 Characters
                  </span>
                </div>

                <div className="flex flex-col gap-[6px] mb-[10px]">
                  <label>GitHub Link</label>
                  <input
                    type="text"
                    className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                    value={project?.link?.github || ""}
                    onChange={(e) => {
                      const updated = formData.projects.map((item) =>
                        item.id === project.id
                          ? {
                              ...item,
                              link: {
                                ...item.link,
                                github: e.target.value,
                              },
                            }
                          : item,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        projects: updated,
                      }));
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-2 px-2 pb-4">
                <button
                  className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-800"
                  onClick={() => removeProject(project.id)}
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

      <button className="flex items-center text-left" onClick={addProject}>
        <Plus size={14} className="mr-1 inline" /> Add Project
      </button>
    </div>
  );
};

export default ProjectsForm;
