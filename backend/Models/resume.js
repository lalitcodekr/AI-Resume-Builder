import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    /* ================= USER (optional for manual resumes) ================= */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // important: manual resumes may not have user
    },

    /* ================= BASIC RESUME INFO ================= */
    name: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,

    /* ================= AI / MANUAL CONTENT ================= */
    summary: String,
    skills: String,
    education: String,
    projects: String,
    certificates: String,
    languages: String,

    /* ================= BUILDER / TEMPLATE BASED ================= */
    title: {
      type: String,
      required: false,
    },

    templateId: {
      type: String,
      required: false,
    },

    // For advanced resume builder JSON structure
    data: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
