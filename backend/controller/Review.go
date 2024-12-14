package controller

import (
	"project-se/entity"
    "project-se/config"
	//"SE/entity/review" //Import your entity package
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST /reviews
func CreateReview(c *gin.Context) {
	var review entity.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": review})
}

// GET /reviews/:id
func GetReview(c *gin.Context) {
	var review entity.Review
	id := c.Param("id")

	if err := config.DB().Preload("Booking").Preload("Passenger").Preload("Driver").First(&review, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": review})
}

// GET /reviews
func ListReviews(c *gin.Context) {
	var reviews []entity.Review

	if err := config.DB().Preload("Booking").Preload("Passenger").Preload("Driver").Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reviews})
}

// DELETE /reviews/:id
func DeleteReview(c *gin.Context) {
	id := c.Param("id")

	if tx := config.DB().Delete(&entity.Review{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Review deleted successfully"})
}

// PATCH /reviews/:id
func UpdateReview(c *gin.Context) {
	var review entity.Review
	id := c.Param("id")

	// Find the existing review
	if err := config.DB().First(&review, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	// Bind JSON input to the existing review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated review data
	if err := config.DB().Save(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": review})
}
