import React, { useState, useEffect } from "react";
import "./edit.css";
import { useNavigate } from "react-router-dom";
import { UpdateReview } from "../../../services/https/ReviewAPl"; // Corrected function name and path
import { ReviewInterface } from "../../../interfaces/lReview";
interface Review {
  driverId: string;
  passengerId: string;
  reviewId: string;
  comment: string;
  features: string;
  rating: number;
}

const Edit: React.FC = () => {
  const navigate = useNavigate();

  // Mock review data (can be fetched from API)
  const initialReview: Review = {
    driverId: "12345",
    passengerId: "54321",
    reviewId: "001",
    comment: "Great service!",
    features: "Cleanliness, Timeliness",
    rating: 5,
  };

  // Form State
  const [review, setReview] = useState<Review>(initialReview);

  // Error State
  const [errors, setErrors] = useState({
    driverId: "",
    passengerId: "",
    comment: "",
    features: "",
    rating: "",
  });

  // Handle Input Changes
  const handleChange = (field: keyof Review, value: string | number) => {
    setReview((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Validation Logic
  const validateField = (field: keyof Review, value: string | number) => {
    let errorMessage = "";

    if (field === "driverId" || field === "passengerId") {
      if (!/^\d+$/.test(value as string)) {
        errorMessage = "Must be numeric only.";
      }
    }

    if (field === "rating") {
      if (value < 1 || value > 5) {
        errorMessage = "Rating must be between 1 and 5.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

 
const handleSave = async () => {
  // Perform validation
  const validationErrors = {
    driverId: review.driverId ? "" : "Driver ID is required.",
    passengerId: review.passengerId ? "" : "Passenger ID is required.",
    comment: "", // Optional
    features: "", // Optional
    rating: review.rating >= 1 && review.rating <= 5 ? "" : "Rating must be between 1 and 5.",
  };

  setErrors(validationErrors);

  if (Object.values(validationErrors).some((error) => error)) {
    alert("Please fix the errors before saving.");
    return;
  }

  try {
    const response = await UpdateReview(review);
    if (response) {
      alert("Review updated successfully!");
      navigate("/review/history"); // Redirect to review history
    } else {
      alert("Failed to update review. Please try again later.");
    }
  } catch (error) {
    console.error("Error updating review:", error);
    alert("An error occurred while updating the review.");
  }
};

  // Handle Back
  const handleBack = () => {
    navigate("/review/history");
  };

  return (
    <div className="edit-container">
      <div className="edit-card">
        <header className="edit-header">
          <h1>Edit Review</h1>
        </header>
        <div className="edit-form">
          <div className="form-row">
            <label>Driver ID</label>
            <input
              type="text"
              value={review.driverId}
              onChange={(e) => handleChange("driverId", e.target.value)}
            />
            {errors.driverId && <div className="error-message">{errors.driverId}</div>}
          </div>
          <div className="form-row">
            <label>Passenger ID</label>
            <input
              type="text"
              value={review.passengerId}
              onChange={(e) => handleChange("passengerId", e.target.value)}
            />
            {errors.passengerId && <div className="error-message">{errors.passengerId}</div>}
          </div>
          <div className="form-row">
            <label>Review ID</label>
            <input type="text" value={review.reviewId} readOnly />
          </div>
          <div className="form-row">
            <label>Comment</label>
            <textarea
              value={review.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
            />
            {errors.comment && <div className="error-message">{errors.comment}</div>}
          </div>
          <div className="form-row">
            <label>Features</label>
            <input
              type="text"
              placeholder="Comma-separated features"
              value={review.features}
              onChange={(e) => handleChange("features", e.target.value)}
            />
            {errors.features && <div className="error-message">{errors.features}</div>}
          </div>
          <div className="form-row">
            <label>Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              value={review.rating}
              onChange={(e) => handleChange("rating", parseInt(e.target.value))}
            />
            {errors.rating && <div className="error-message">{errors.rating}</div>}
          </div>
        </div>
        <div className="edit-actions">
          <button className="secondary-btn back-btn" onClick={handleBack}>
            Go Back
          </button>
          <button className="primary-btn save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
