package handler

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/yabu1121/blog-backend/domain/models"
	"gorm.io/gorm"
)

type CommentHandler struct {
	DB *gorm.DB
}

// GetComments は指定した投稿IDに紐づくコメント一覧を返します。
func (h *CommentHandler) GetComments(c echo.Context) error {
	postID := c.Param("id")
	if postID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "IDは必須です"})
	}

	var comments []models.Comment
	if err := h.DB.Where("post_id = ?", postID).
		Preload("Author").
		Order("created_at DESC").
		Find(&comments).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "コメントの取得に失敗しました"})
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

// CreateComment は指定した投稿IDにコメントを追加します。
// 投稿者はJWTミドルウェアがセットした user_id を使用します。
func (h *CommentHandler) CreateComment(c echo.Context) error {
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "IDの形式が正しくありません"})
	}

	userID, ok := c.Get("user_id").(uint)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "認証が必要です"})
	}

	var req models.CreateCommentRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "リクエストの形式が正しくありません"})
	}

	// バリデーション
	req.Title = strings.TrimSpace(req.Title)
	req.Content = strings.TrimSpace(req.Content)
	if req.Title == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "件名は必須です"})
	}
	if req.Content == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "コメント内容は必須です"})
	}

	comment := models.Comment{
		Title:    req.Title,
		Content:  req.Content,
		PostID:   uint(postID),
		AuthorID: userID,
	}
	if err := h.DB.Create(&comment).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "コメントの作成に失敗しました"})
	}
	if err := h.DB.Preload("Author").First(&comment, comment.ID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "コメントの取得に失敗しました"})
	}

	return c.JSON(http.StatusCreated, models.GetCommentResponse{
		Title:    comment.Title,
		Content:  comment.Content,
		AuthorID: comment.AuthorID,
		Author: models.GetUserResponse{
			ID:   comment.Author.ID,
			Name: comment.Author.Name,
		},
		CreatedAt: comment.CreatedAt.String(),
	})
}
