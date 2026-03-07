package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// heeloを返す関数
func Hello (c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message":"heelo"});
}