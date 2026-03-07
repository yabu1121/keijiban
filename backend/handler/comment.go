package handler

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yabu1121/blog-backend/domain/models"
	"gorm.io/gorm"
)

type CommentHandler struct {
	DB *gorm.DB
}

// commentを取得する関数
func (h *CommentHandler) GetComments(c echo.Context) error {
	post_id := c.Param("id")
	if post_id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "id is required"})
	}

	var comments []models.Comment
	if err := h.DB.Where("post_id = ?", post_id).Preload("Author").Find(&comments).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}

	res := make([]models.GetCommentResponse, len(comments))
	for i, item := range comments {
		res[i] = models.GetCommentResponse{
			Title:    item.Title,
			Content:  item.Content,
			AuthorID: item.AuthorID,
			Author: models.GetUserResponse{
				ID:   item.Author.ID,
				Name: item.Author.Name,
			},
			CreatedAt: item.CreatedAt.String(),
		}
	}
	return c.JSON(http.StatusOK, res)
}

// commentを作成する関数
func (h *CommentHandler) CreateComment(c echo.Context) error {
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, "id is required")
	}
	// JWTミドルウェアがセットしたuser_idをauthor_idとして使用
	userID, ok := c.Get("user_id").(uint)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
	}

	var req models.CreateCommentRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}
	comment := models.Comment{
		Title:    req.Title,
		Content:  req.Content,
		PostID:   uint(postID),
		AuthorID: userID,
	}

	if err := h.DB.Create(&comment).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}
	if err := h.DB.Preload("Author").First(&comment, comment.ID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}

	res := models.GetCommentResponse{
		Title:    comment.Title,
		Content:  comment.Content,
		AuthorID: comment.AuthorID,
		Author: models.GetUserResponse{
			ID:   comment.Author.ID,
			Name: comment.Author.Name,
		},
		CreatedAt: comment.CreatedAt.String(),
	}

	return c.JSON(http.StatusCreated, res)
}
