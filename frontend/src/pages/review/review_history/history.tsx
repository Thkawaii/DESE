import React, { useEffect, useState } from 'react';
import "./History.css";
import { Outlet, useNavigate } from 'react-router-dom';
import { ReviewInterface } from "../../../interfaces/lReview"; // Corrected path
import { GetReviews } from "../../../services/https/ReviewAPl"; // Corrected function name and path
import { DeleteReviewByID } from "../../../services/https/ReviewAPl"; // Corrected function name and path

const History: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewInterface[]>([]); // Initialize reviews state as an empty array

  // Fetch reviews when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await GetReviews(); // Assuming GetReviews returns a promise
        setReviews(fetchedReviews); // Update the state with fetched reviews
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        // Handle error (e.g., set an error state or show a message to the user)
      }
    };

    fetchReviews(); // Call the fetch function
  }, []); // Empty dependency array to run this effect only once on mount

  const menuItems = [
    { name: 'Home', icon: 'https://cdn-icons-png.flaticon.com/128/18390/18390765.png', route: '/paid' },
    { name: 'Payment', icon: 'https://cdn-icons-png.flaticon.com/128/18209/18209461.png', route: '/payment' },
    { name: 'Review', icon: 'https://cdn-icons-png.flaticon.com/128/7656/7656139.png', route: '/review' },
    { name: 'History', icon: 'https://cdn-icons-png.flaticon.com/128/9485/9485945.png', route: '/review/history' },
  ];

  const handleMenuClick = (item: { name: string; icon: string; route: string }) => {
    navigate(item.route);
  };

  const handleEdit = (reviewId?: string) => {
    alert(`Edit Information:`);
    navigate(`/edit`); // Navigate to the edit page for the specific review
  };

  const handleDelete = async (reviewId: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete review with ID: ${reviewId}?`
    );
    
    if (confirmDelete) {
      try {
        const success = await DeleteReviewByID(parseInt(reviewId, 10));
        if (success) {
          setReviews((prevReviews) =>
            prevReviews.filter((review) => review.reviewId !== reviewId)
          );
          alert(`Review with ID: ${reviewId} deleted successfully.`);
        } else {
          alert(`Failed to delete review with ID: ${reviewId}. Please try again.`);
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        alert(`An error occurred while deleting the review with ID: ${reviewId}.`);
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

   return (
    <div className="ee">
      <div className="review-history-container">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Add menu items or logic */}
        </div>

        {/* Header */}
        <header className="review-header">
          <h1>REVIEW HISTORY</h1>
          <div className="tyu">
            <div className="yh"></div>
            <div className="yh"></div>
            <div className="yh"></div>
            <div className="yh"></div>
          </div>
          <div className="step-indicatorss">
            <div className="step completed"></div>
            <div className="step completed"></div>
            <div className="step active"></div>
          </div>
        </header>

        {/* Content */}
        <table className="review-table">
          <thead>
            <tr>
              <th>Review ID</th>
              <th>Driver ID</th>
              <th>Passenger ID</th>
              <th>Booking ID</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.ID}>
                <td>{review.ID}</td>
                <td>{review.DriverID}</td>
                <td>{review.PassengerID}</td>
                <td>{review.BookingID}</td>
                <td>{review.Comment}</td>
                <td>
                  {'★'.repeat(review.Rating)}{' '}
                  {'☆'.repeat(5 - review.Rating)}
                </td>
                <td>
                 {/* Edit Button */}
<button
  className="edit-btn"
  onClick={() => handleEdit(review.ID?.toString() || '')} // Convert to string or fallback to empty string
>
  Edit
</button>
{/* Delete Button */}
<button
  className="delete-btn"
  onClick={() => handleDelete(review.ID?.toString() || '')} // Convert to string or fallback to empty string
>
  Delete
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Back Button */}
        <div className="button-container">
          <button className="secondary-btn back-btn" onClick={handleBackClick}>
            Back
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default History;
