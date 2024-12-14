package controller

import (
	"net/http"
	"project-se/entity"
    "project-se/config"
	"github.com/gin-gonic/gin"
)

// POST /payments
func CreatePayment(c *gin.Context) {
	var payment entity.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": payment})
}

// GET /payments/:id
func GetPayment(c *gin.Context) {
	var payment entity.Payment
	id := c.Param("id")

	if err := config.DB().Preload("Booking").Preload("Promotion").First(&payment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment})
}

// GET /payments
func ListPayments(c *gin.Context) {
	var payments []entity.Payment

	if err := config.DB().Preload("Booking").Preload("Promotion").Find(&payments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payments})
}

// DELETE /payments/:id
func DeletePayment(c *gin.Context) {
	id := c.Param("id")

	if tx := config.DB().Delete(&entity.Payment{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Payment deleted successfully"})
}

// PATCH /payments/:id
func UpdatePayment(c *gin.Context) {
	var payment entity.Payment
	id := c.Param("id")

	// Find the existing payment
	if err := config.DB().First(&payment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	// Bind JSON input to the existing payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated payment data
	if err := config.DB().Save(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment})
}
