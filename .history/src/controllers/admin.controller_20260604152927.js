import User from "../models/User.js";
import Skill from "../models/Skill.js";
import SkillRequest from "../models/SkillRequest.js";
import Transaction from "../models/Transaction.js";
import Payment from "../models/Payment.js";
import Review from "../models/Review.js";

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSkills,
      totalRequests,
      totalTransactions,
      totalReviews,
      totalPayments,
      completedRequests,
      revenueData,
      reviews,
    ] = await Promise.all([
      User.countDocuments(),
      Skill.countDocuments(),
      SkillRequest.countDocuments(),
      Transaction.countDocuments(),
      Review.countDocuments(),
      Payment.countDocuments({ status: "success" }),
      SkillRequest.countDocuments({ status: "Completed" }),
      Payment.find({ status: "success" }),
      Review.find(),
    ]);

    const totalRevenue = revenueData.reduce(
      (sum, payment) => sum + payment.amountPaid,
      0
    );

    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) /
            reviews.length
          ).toFixed(1)
        : 0;

    res.json({
      totalUsers,
      totalSkills,
      totalRequests,
      totalTransactions,
      totalReviews,
      totalPayments,
      certificatesIssued: completedRequests,
      totalRevenue,
      averageRating,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch admin stats",
    });
  }
};