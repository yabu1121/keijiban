package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/yabu1121/blog-backend/domain/models"
	"gorm.io/gorm"
)

type PostHandler struct {
	DB *gorm.DB
}

// postを作成する関数
func (h *PostHandler) CreatePost(c echo.Context) error {
	// JWTミドルウェアがセットしたuser_idを取得
	userID, ok := c.Get("user_id").(uint)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
	}

	req := models.CreatePostRequest{}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}
	post := models.Post{
		Title:   req.Title,
		Content: req.Content,
		UserID:  userID,
	}
	if err := h.DB.Create(&post).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}

	h.DB.Preload("User").First(&post, post.ID)

	res := models.GetPostResponse{
		ID:      post.ID,
		Title:   post.Title,
		Content: post.Content,
		User: models.GetUserResponse{
			ID:   post.User.ID,
			Name: post.User.Name,
		},
		CreatedAt: post.CreatedAt,
		UpdatedAt: post.UpdatedAt,
	}

	return c.JSON(http.StatusCreated, res)
}

// すべてのpostを取得する関数
func (h *PostHandler) GetAllPost (c echo.Context) error {
	var posts []models.Post
	if err := h.DB.Preload("User").Find(&posts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error":"internal server error"})
	}
	res := make([]models.GetPostResponse, len(posts))
	for i, p := range posts {
		res[i] = models.GetPostResponse{
			ID: p.ID,
			Title: p.Title,
			Content: p.Content,
			User: models.GetUserResponse{
				ID:p.User.ID,
				Name: p.User.Name,
			},
			CreatedAt: p.CreatedAt,
			UpdatedAt: p.UpdatedAt,
		}
	}
	return c.JSON(http.StatusOK, res)
}

// 指定したidとpostのidが一致するものを取得する
func (h *PostHandler) GetPostById (c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error":"id is required"})
	}
	var post models.Post
	if err := h.DB.Preload("User").First(&post, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}

	res := models.GetPostResponse{
		ID: post.ID,
		Title: post.Title,
		Content: post.Content,
		User: models.GetUserResponse{
			ID: post.User.ID,
			Name: post.User.Name,
		},
		CreatedAt: post.CreatedAt,
		UpdatedAt: post.UpdatedAt,
	}
	return c.JSON(http.StatusOK, res)
}

// 指定したidとpostのidが一致するものを削除する
func (h * PostHandler) DeletePost (c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "id is required"})
	}
	if err := h.DB.Where("id = ?", id).Delete(&models.Post{}).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}
	return c.NoContent(http.StatusNoContent)
}

// 指定したidとpostのidが一致した場合postを与えられたcontextに更新する
func (h *PostHandler) UpdatePost (c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "id is required"})
	}
	// JWTミドルウェアがセットしたuser_idを取得
	userID, ok := c.Get("user_id").(uint)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
	}

	var req models.CreatePostRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	var post models.Post
	if err := h.DB.First(&post, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "post not found"})
	}

	if err := h.DB.Model(&post).Updates(models.Post{
		Title:   req.Title,
		Content: req.Content,
		UserID:  userID,
	}).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}

	h.DB.Preload("User").First(&post, post.ID)

	res := models.GetPostResponse{
		ID:      post.ID,
		Title:   post.Title,
		Content: post.Content,
		User: models.GetUserResponse{
			ID:   post.User.ID,
			Name: post.User.Name,
		},
		CreatedAt: post.CreatedAt,
		UpdatedAt: post.UpdatedAt,
	}

	return c.JSON(http.StatusOK, res)
}
