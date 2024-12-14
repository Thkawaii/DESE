import React, { useState } from 'react';
import "./History.css";
import { Outlet, useNavigate } from 'react-router-dom';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([
    {
      driver: '01',
      passenger: '12',
      reviewId: 'REV001',
      comment: 'Great ride, very punctual!',
      features: ['Good', 'Travel', 'Comfortable'],
      rating: 5,
    },
    {
      driver: '08',
      passenger: '77',
      reviewId: 'REV002',
      comment: 'Amazing',
      features: ['Safety'],
      rating: 3,
    },
  ]);

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

  const handleDelete = (reviewId: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete review with ID: ${reviewId}?`
    );
    if (confirmDelete) {
      setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
      alert(`Review with ID: ${reviewId} deleted successfully.`);
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
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="menu-item"
            onClick={() => handleMenuClick(item)}
          >
            <img src={item.icon} alt={item.name} className="menu-icon" />
            <p className="menu-text">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="review-header">
        <h1>REVIEW</h1>
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
      <div className="review-history-content">
        <h2 className="review-history-title">Review History</h2>
        <table className="review-table">
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Passenger ID</th>
              <th>Review ID</th>
              <th>Comment</th>
              <th>Features</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.reviewId}>
                <td>{review.driver}</td>
                <td>{review.passenger}</td>
                <td>{review.reviewId}</td>
                <td>{review.comment}</td>
                <td>
                  {review.features.map((feature, idx) => (
                    <span key={idx} className="feature-badge">
                      {feature}
                    </span>
                  ))}
                </td>
                <td>
                  {'★'.repeat(review.rating)}{' '}
                  {'☆'.repeat(5 - review.rating)}
                </td>
                <td>
                  {/* Edit Button */}
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(review.reviewId)}
                  >
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(review.reviewId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
