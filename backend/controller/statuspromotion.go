package controller

import (
	"net/http"
	"project-se/entity"
	"project-se/config"
	"github.com/gin-gonic/gin"
	
)

func GetAllStatus(c *gin.Context) {

	db := config.DB()


	var status []entity.Status
 
	db.Find(&status)
 
 
	c.JSON(http.StatusOK, &status)

}
