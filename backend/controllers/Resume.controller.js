import mongoose from "mongoose";
import AtsScans from "../Models/atsScan.js";
import Resume from "../Models/resume.js";
import Notification from "../Models/notification.js";

// services
import {
  parseResume,
  extractResumeData,
} from "../service/ResumeParser.service.js";

// ATS Analyzer Services
import {
  analyzeATSCompatibility,
  generateRecommendations,
  passesATSThreshold,
} from "../service/AtsAnalyzer.service.js";

// File Storage Services
import {
  saveFileMetadata, // (kept for future use)
  deleteFile,
  getFile,
} from "../service/FileStorage.service.js";

/* =====================================================
   SAVE NORMAL RESUME (Manual Save)
===================================================== */
export const saveResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();

    res.json({
      success: true,
      message: "Resume saved to database",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/* =====================================================
   GENERATE AI RESUME + OPTIONAL SAVE TO DB
===================================================== */
export const generateAIResume = async (req, res) => {
  try {
    console.log("📥 AI Resume request received");

    // 1. Generate AI summary
    const aiText = await generateResumeAI(req.body);

    console.log("✅ AI Summary generated");

    // 2. Save to MongoDB (optional)
    try {
      const resume = new Resume({
        ...req.body,
        summary: aiText,
      });
      await resume.save();
      console.log("💾 AI Resume saved to DB");
    } catch (dbError) {
      console.log("⚠️ DB save skipped (MongoDB not connected)");
    }

    // 3. Send response
    res.json({
      success: true,
      message: "AI Resume generated successfully",
      aiResume: aiText,
    });
  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({
      success: false,
      error: "AI generation failed: " + error.message,
    });
  }
};

/* =====================================================
   UPLOAD & ANALYZE RESUME (ATS SCAN)
===================================================== */
export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.userId;
    const file = req.file;

    const parseResult = await parseResume(file);

    if (!parseResult?.success || !parseResult?.text) {
      deleteFile(file.path);
      return res.status(400).json({
        success: false,
        message: "Failed to parse resume",
      });
    }

    const resumeText = parseResult.text;
    const extractedData = extractResumeData(resumeText);

    const analysis = analyzeATSCompatibility(resumeText, extractedData);
    const passes = passesATSThreshold(analysis.overallScore);
    const recommendations = generateRecommendations(analysis);

    const atsScan = new AtsScans({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      fileType: file.mimetype,
      overallScore: analysis.overallScore,
      sectionScores: analysis.sectionScores,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
      extractedText: resumeText,
      extractedData,
      passThreshold: passes,
    });

    await atsScan.save();

    // 🔔 USER NOTIFICATION
    await Notification.create({
      actor: "system",
      type: "ATS_SCAN",
      message: `You uploaded a resume. Your ATS score is ${analysis.overallScore}`,
      userId,
    });

    // 🔔 ADMIN NOTIFICATION
    await Notification.create({
      actor: "user",
      type: "ATS_SCAN",
      message: `User uploaded a resume (ATS Score: ${analysis.overallScore})`,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      data: {
        scanId: atsScan._id,
        overallScore: analysis.overallScore,
        sectionScores: analysis.sectionScores,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        suggestions: analysis.suggestions,
        recommendations,
        passThreshold: passes,
        extractedData,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload and analyze resume",
      error: error.message,
    });
  }
};

/* ================= DELETE SCAN ================= */
export const deleteScan = async (req, res) => {
  try {
    const scan = await AtsScans.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }

    deleteFile(scan.filePath);
    await AtsScans.findByIdAndDelete(scan._id);

    // USER
    await Notification.create({
      actor: "system",
      type: "ATS_DELETED",
      message: "You deleted an ATS scan",
      userId: req.userId,
    });

    // ADMIN
    await Notification.create({
      actor: "user",
      type: "ATS_DELETED",
      message: "User deleted an ATS scan",
      userId: req.userId,
    });

    res.status(200).json({
      success: true,
      message: "Scan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete scan",
      error: error.message,
    });
  }
};

/* =====================================================
   DOWNLOAD RESUME FILE
===================================================== */
export const downloadResume = async (req, res) => {
  try {
    const scan = await AtsScans.findOne({
      filename: req.params.filename,
      userId: req.userId,
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const fileResult = getFile(scan.filePath);

    if (!fileResult?.buffer) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // USER
    await Notification.create({
      actor: "system",
      type: "RESUME_DOWNLOADED",
      message: "You downloaded your resume",
      userId: req.userId,
    });

    // ADMIN
    await Notification.create({
      actor: "user",
      type: "RESUME_DOWNLOADED",
      message: "User downloaded a resume",
      userId: req.userId,
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${scan.originalName}"`
    );
    res.setHeader("Content-Type", scan.fileType);
    res.send(fileResult.buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to download resume",
      error: error.message,
    });
  }
};
