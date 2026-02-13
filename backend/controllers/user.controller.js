import Notification from "../Models/notification.js";
import AtsScans from "../Models/atsScan.js";
import ResumeProfile from "../Models/resumeProfile.js";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import Payment from "../Models/payment.js";
import Resume from "../Models/resume.js";
import Subscription from "../Models/subscription.js";

/* ================== HELPERS ================== */
const getLastMonthDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
};

/* ================== USER DASHBOARD ================== */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("username email");

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const totalResumes = await ResumeProfile.countDocuments({ userId });
    const resumesThisWeek = await ResumeProfile.countDocuments({
      userId,
      createdAt: { $gte: oneWeekAgo },
    });

    const atsScans = await AtsScans.find({ userId })
      .sort({ createdAt: -1 })
      .limit(2);

    const latestAts = atsScans[0]?.overallScore || 0;
    const previousAts = atsScans[1]?.overallScore || latestAts;

    const recentResumes = await ResumeProfile.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      user: {
        name: user?.username || "User",
        email: user?.email,
      },
      stats: {
        resumesCreated: totalResumes,
        resumesThisWeek,
        avgAtsScore: latestAts,
        atsDelta: latestAts - previousAts,
        profileViews: 0,
      },
      recentResumes: recentResumes.map((r) => ({
        id: r._id,
        name: r.title,
        date: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

/* ================== ADMIN: USERS ================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* ================== USER PROFILE (SELF) ================== */
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, username, email, phone, location, bio, github, linkedin } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already exists" });
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;

    await user.save();
    res.status(200).json({ message: "Profile updated", user: await User.findById(userId).select("-password") });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both passwords are required" });
    if (newPassword.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, isAdmin, isActive, plan } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email already exists" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (typeof isAdmin === "boolean") user.isAdmin = isAdmin;
    if (typeof isActive === "boolean") user.isActive = isActive;
    if (plan) user.plan = plan;

    await user.save();

    /* 🔔 ADMIN NOTIFICATION (USER ACTION) */
    if (typeof isActive === "boolean") {
      // 🔔 USER
      await Notification.create({
        type: "ACCOUNT_STATUS",
        message: `Your account was ${
          isActive ? "activated" : "deactivated"
        } by admin`,
        userId: user._id,
        actor: "system",
      });

      // 🔔 ADMIN
      await Notification.create({
        type: "USER_STATUS",
        message: `${user.username} was ${
          isActive ? "activated" : "deactivated"
        }`,
        userId: req.userId,
        actor: "user",
        fromAdmin: true,
      });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔔 ADMIN NOTIFICATION
    await Notification.create({
      type: "USER_DELETED",
      message: `${user.username} account was deleted`,
      userId: req.userId, // admin id
      actor: "user",
      fromAdmin: true
    });

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================== ADMIN: ANALYTICS ================== */
export const getAnalyticsStats = async (req, res) => {
  try {
    res.status(200).json({
      userGrowth: {
        count: 25,
        note: "New users in last 30 days",
      },
      conversions: {
        count: 12,
        note: "Active paid subscriptions",
      },
      activeUsers: {
        count: 18,
        note: "Active users in last 7 days",
      },
      churnRate: {
        count: 2,
        note: "Churned users this quarter",
      },

      // ✅ GRAPH DATA (IMPORTANT)
      revenueTrend: [
        { month: "Aug", revenue: 1200 },
        { month: "Sep", revenue: 1850 },
        { month: "Oct", revenue: 2300 },
        { month: "Nov", revenue: 2800 },
        { month: "Dec", revenue: 3500 },
        { month: "Jan", revenue: 4200 },
      ],

      subscriptionTrend: [
        { month: "Aug", subscriptions: 15 },
        { month: "Sep", subscriptions: 28 },
        { month: "Oct", subscriptions: 42 },
        { month: "Nov", subscriptions: 58 },
        { month: "Dec", subscriptions: 75 },
        { month: "Jan", subscriptions: 92 },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Analytics fetch failed" });
  }
};

/* ================== ADMIN DASHBOARD ================== */
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Calculate monthly user growth for last 6 months
    const getMonthlUserGrowth = async () => {
      const months = [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      for (let i = 5; i >= 0; i--) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - i);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() - i + 1);
        endDate.setDate(1);
        endDate.setHours(0, 0, 0, 0);

        const monthIndex = startDate.getMonth();
        const count = await User.countDocuments({
          createdAt: { $gte: startDate, $lt: endDate },
        });

        months.push({
          month: monthNames[monthIndex],
          users: count,
        });
      }

      return months;
    };

    // Calculate subscription distribution
    const getSubscriptionSplit = async () => {
      const subscriptions = await User.aggregate([
        {
          $group: {
            _id: "$plan",
            count: { $sum: 1 },
          },
        },
      ]);

      const total = subscriptions.reduce((sum, sub) => sum + sub.count, 0);
      return subscriptions.map((sub) => ({
        name: sub._id || "Free",
        value: Math.round((sub.count / total) * 100),
      }));
    };

    // Calculate daily active users for last 7 days
    const getDailyActiveUsers = async () => {
      const days = [];
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayIndex = date.getDay();
        const count = await User.countDocuments({
          lastLogin: { $gte: date, $lt: nextDate },
        });

        days.push({
          day: dayNames[dayIndex === 0 ? 6 : dayIndex - 1],
          users: count,
        });
      }

      return days;
    };

    // Get all stats in parallel
    const [userGrowth, subscriptionSplit, dailyActiveUsers] = await Promise.all([
      getMonthlUserGrowth(),
      getSubscriptionSplit(),
      getDailyActiveUsers(),
    ]);

    // Calculate total users and changes
    const totalUsers = await User.countDocuments();
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    const prevMonthUsers = await User.countDocuments({
      createdAt: { $lt: lastMonthStart },
    });
    const userChange = prevMonthUsers > 0
      ? Math.round(((totalUsers - prevMonthUsers) / prevMonthUsers) * 100)
      : 0;

    // Calculate revenue stats
    const totalRevenueAgg = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Calculate active subscriptions and change
    const activeSubscriptions = await Subscription.countDocuments({
      status: "active",
    });
    const lastMonthSubscriptions = await Subscription.countDocuments({
      status: "active",
      createdAt: { $lt: lastMonthStart },
    });
    const subscriptionChange = lastMonthSubscriptions > 0
      ? Math.round(((activeSubscriptions - lastMonthSubscriptions) / lastMonthSubscriptions) * 100)
      : 0;

    // Calculate revenue change
    const lastMonthRevenueAgg = await Payment.aggregate([
      {
        $match: {
          status: "success",
          createdAt: { $gte: lastMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;
    const revenueChange = lastMonthRevenue > 0
      ? Math.round(((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    // Calculate resume generation stats and change
    const totalResumes = await Resume.countDocuments();
    const lastMonthResumes = await Resume.countDocuments({
      createdAt: { $gte: lastMonthStart },
    });
    const previousMonthResumes = await Resume.countDocuments({
      createdAt: { $gte: new Date(lastMonthStart.getTime() - 30 * 24 * 60 * 60 * 1000), $lt: lastMonthStart },
    });
    const resumeChange = previousMonthResumes > 0
      ? Math.round(((lastMonthResumes - previousMonthResumes) / previousMonthResumes) * 100)
      : 0;

    const resumeChart = await Resume.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 3 },
    ]);

    const monthNames = ["jan", "feb", "march", "april", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"];
    const formattedResumeChart = resumeChart.map((item) => ({
      month: monthNames[item._id.month - 1],
      resumes: item.count,
    }));

    res.status(200).json({
      users: { total: totalUsers, change: userChange },
      subscriptions: { total: activeSubscriptions, change: subscriptionChange },
      revenue: { total: Math.round(totalRevenue), change: revenueChange },
      resumes: { total: totalResumes, change: resumeChange },
      resumeChart: formattedResumeChart.length > 0 ? formattedResumeChart : [
        { month: "jan", resumes: 50 },
        { month: "feb", resumes: 120 },
        { month: "march", resumes: 2 },
      ],
      userGrowth,
      subscriptionSplit,
      dailyActiveUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard stats fetch failed" });
  }
};
