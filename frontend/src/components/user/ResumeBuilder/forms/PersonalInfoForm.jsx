import AISuggestions from "../AISuggestions";

const PersonalInfoForm = ({ formData, onInputChange, onUseSummary }) => {
  return (
    <div className="p-1">
      <h3 className="mb-3 text-sm font-semibold">Personal Information</h3>
      <div className="pl-0.5">
        <div className="flex flex-col gap-[6px] mb-[10px]">
          <label className="block text-[12px] font-medium text-[#374151] mb-1">
            Full Name *
          </label>
          <input
            type="text"
            className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
            value={formData?.fullName || ""}
            placeholder="John Doe"
            onChange={(e) => onInputChange("fullName", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[6px] mb-[10px]">
          <label className="block text-[12px] font-medium text-[#374151] mb-1">
            Email *
          </label>
          <input
            type="email"
            className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
            value={formData?.email || ""}
            placeholder="john.doe@example.com"
            onChange={(e) => onInputChange("email", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[6px] mb-[10px]">
          <label className="block text-[12px] font-medium text-[#374151] mb-1">
            Phone
          </label>
          <input
            type="tel"
            className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
            value={formData?.phone || ""}
            maxLength={10}
            placeholder="1234567890"
            onChange={(e) => onInputChange("phone", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[6px] mb-[10px]">
          <label className="block text-[12px] font-medium text-[#374151] mb-1">
            Location
          </label>
          <input
            type="text"
            className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
            value={formData?.location || ""}
            placeholder="San Francisco, CA"
            onChange={(e) => onInputChange("location", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[6px] mb-[10px]">
          <label className="block text-[12px] font-medium text-[#374151] mb-1">
            LinkedIn
          </label>
          <input
            type="text"
            className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
            value={formData?.linkedin || ""}
            placeholder="linkedin.com/in/johndoe"
            onChange={(e) => onInputChange("linkedin", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[6px] mb-[10px]">
          <label className="block text-[12px] font-medium text-[#374151] mb-1">
            Website/Portfolio
          </label>
          <input
            type="text"
            className="px-2.5 py-2 border text-sm rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
            value={formData?.website || ""}
            placeholder="johndoe.com"
            onChange={(e) => onInputChange("website", e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-[6px] mb-[10px] full-width">
        <label className="block text-[12px] font-medium text-[#374151] mb-1">
          Professional Summary
        </label>
        <textarea
          className="w-full h-28 px-2.5 py-2 border text-sm rounded resize-none border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
          value={formData?.summary || ""}
          maxLength={500}
          placeholder="Brief professional summary highlighting your key skills and experience..."
          onChange={(e) => onInputChange("summary", e.target.value)}
        />
        <span className="ml-2 text-xs text-slate-500">
          {formData?.summary?.length || 0}/500 Characters
        </span>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
