package controller


import (

   "net/http"
   "project-se/entity"
	"project-se/config"
	"github.com/gin-gonic/gin"
   

)


func GetAllD(c *gin.Context) {


   db := config.DB()


   var discounttype []entity.DiscountType

   db.Find(&discounttype)


   c.JSON(http.StatusOK, &discounttype)


}