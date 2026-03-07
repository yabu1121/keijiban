package handler

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/yabu1121/blog-backend/domain/models"
	"gorm.io/gorm"
)

type PostHandler struct {
	DB *gorm.DB
}

// CreatePost は新しい投稿を作成します。
// JWTミドルウェアがセットした user_id を投稿者として使用します。
func (h *PostHandler) CreatePost(c echo.Context) error {
	userID, ok := c.Get("user_id").(uint)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "認証が必要です"})
	}

	req := models.CreatePostRequest{}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "リクエストの形式が正しくありません"})
	}

	// バリデーション
	req.Title = strings.TrimSpace(req.Title)
	req.Content = strings.TrimSpace(req.Content)
	if req.Title == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "タイトルは必須です"})
	}
	if req.Content == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "本文は必須です"})
	}

	post := models.Post{
		Title:   req.Title,
		Content: req.Content,
		UserID:  userID,
	}
	if err := h.DB.Create(&post).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "投稿の作成に失敗しました"})
	}

	h.DB.Preload("User").First(&post, post.ID)

	return c.JSON(http.StatusCreated, toPostResponse(post))
}

// GetAllPost はすべての投稿を取得します。
func (h *PostHandler) GetAllPost(c echo.Context) error {
	var posts []models.Post
	if err := h.DB.Preload("User").Order("created_at DESC").Find(&posts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "投稿の取得に失敗しました"})
	}
	res := make([]models.GetPostResponse, len(posts))
	for i, p := range posts {
		res[i] = toPostResponse(p)
	}
	return c.JSON(http.StatusOK, res)
}

// GetPostById は指定したIDの投稿を取得します。
func (h *PostHandler) GetPostById(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "IDは必須です"})
	}
	var post models.Post
	if err := h.DB.Preload("User").First(&post, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "投稿が見つかりません"})
	}
	return c.JSON(http.StatusOK, toPostResponse(post))
}

// DeletePost は指定したIDの投稿を削除します。
func (h *PostHandler) DeletePost(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "IDは必須です"})
	}
	if err := h.DB.Where("id = ?", id).Delete(&models.Post{}).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "削除に失敗しました"})
	}
	return c.NoContent(http.StatusNoContent)
}

// UpdatePost は指定したIDの投稿を更新します。
func (h *PostHandler) UpdatePost(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "IDは必須です"})
	}
	userID, ok := c.Get("user_id").(uint)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "認証が必要です"})
	}

	var req models.CreatePostRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "リクエストの形式が正しくありません"})
	}

	// バリデーション
	req.Title = strings.TrimSpace(req.Title)
	req.Content = strings.TrimSpace(req.Content)
	if req.Title == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "タイトルは必須です"})
	}

	var post models.Post
	if err := h.DB.First(&post, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "投稿が見つかりません"})
	}

	if err := h.DB.Model(&post).Updates(models.Post{
		Title:   req.Title,
		Content: req.Content,
		UserID:  userID,
	}).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "更新に失敗しました"})
	}

	h.DB.Preload("User").First(&post, post.ID)
	return c.JSON(http.StatusOK, toPostResponse(post))
}

// toPostResponse は Post モデルを GetPostResponse に変換するヘルパー関数です。
// 同じ変換ロジックを複数の関数で書き直さなくて済むように共通化しています。
func toPostResponse(p models.Post) models.GetPostResponse {
	return models.GetPostResponse{
		ID:      p.ID,
		Title:   p.Title,
		Content: p.Content,
		User: models.GetUserResponse{
			ID:   p.User.ID,
			Name: p.User.Name,
		},
		CreatedAt: p.CreatedAt,
		UpdatedAt: p.UpdatedAt,
	}
}
