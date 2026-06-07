import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const {
      skill,
      provider,
      rating,
      review,
    } = req.body;

    const newReview = await Review.create({
      skill,
      provider,
      reviewer: req.user.id,
      rating,
      review,
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create review",
      error: error.message,
    });
  }
};

export const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      provider: req.params.providerId,
    })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce(
              (sum, r) => sum + r.rating,
              0
            ) / reviews.length
          ).toFixed(1)
        : 0;

    res.json({
      avgRating,
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};