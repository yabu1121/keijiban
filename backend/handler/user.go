package handler

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/yabu1121/blog-backend/domain/models"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB *gorm.DB
}

// GetAllUser はすべてのユーザーを取得します（id と name のみ公開）。
func (h *UserHandler) GetAllUser(c echo.Context) error {
	var users []models.User
	if err := h.DB.Select("id", "name").Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "ユーザーの取得に失敗しました"})
	}
	res := make([]models.GetUserResponse, len(users))
	for i, u := range users {
		res[i] = models.GetUserResponse{ID: u.ID, Name: u.Name}
	}
	return c.JSON(http.StatusOK, res)
}

// GetUserById は指定したIDのユーザーを取得します。
func (h *UserHandler) GetUserById(c echo.Context) error {
	id := c.Param("id")
	var user models.User
	if err := h.DB.Select("id", "name").First(&user, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "ユーザーが見つかりません"})
	}
	return c.JSON(http.StatusOK, models.GetUserResponse{ID: user.ID, Name: user.Name})
}

// CreateUser はユーザーを作成します（管理用APIです）。
func (h *UserHandler) CreateUser(c echo.Context) error {
	req := models.CreateUserRequest{}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "リクエストの形式が正しくありません"})
	}
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	if req.Name == "" || req.Email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "名前とメールアドレスは必須です"})
	}
	user := models.User{Name: req.Name, Email: req.Email}
	if err := h.DB.Create(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "ユーザーの作成に失敗しました"})
	}
	return c.JSON(http.StatusCreated, models.GetUserResponse{ID: user.ID, Name: user.Name})
}

// SignUp は新規ユーザーを登録して JWTトークンを返します。
// JWTのpayloadは誰でもデコードできますが、SECRET_KEYがないと改ざんができないため安全です。
func (h *UserHandler) SignUp(c echo.Context) error {
	var req models.SignUpUserRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "リクエストの形式が正しくありません"})
	}
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	if req.Name == "" || req.Email == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "名前・メールアドレス・パスワードは必須です"})
	}

	// パスワードをbcryptでハッシュ化する（平文保存は絶対NG）
	hashedPassword, err := hashPassword(req.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "パスワードの処理に失敗しました"})
	}

	user := models.User{Name: req.Name, Email: req.Email, Password: hashedPassword}
	if err := h.DB.Create(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "ユーザーの作成に失敗しました（メールアドレスが既に使用されている可能性があります）"})
	}

	token, err := generateJWT(user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "トークンの生成に失敗しました"})
	}
	return c.JSON(http.StatusCreated, models.JwtResponse{Token: token})
}

// Login はメールアドレスとパスワードで認証してJWTトークンを返します。
func (h *UserHandler) Login(c echo.Context) error {
	var req models.LoginUserRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "リクエストの形式が正しくありません"})
	}

	var user models.User
	if err := h.DB.Where("email = ?", strings.TrimSpace(req.Email)).First(&user).Error; err != nil {
		// メールか？パスワードか？ を教えると攻撃の手がかりになるため、メッセージは統一する
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "メールアドレスまたはパスワードが正しくありません"})
	}

	if err := verifyPassword(user.Password, req.Password); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "メールアドレスまたはパスワードが正しくありません"})
	}

	token, err := generateJWT(user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "トークンの生成に失敗しました"})
	}
	return c.JSON(http.StatusOK, models.JwtResponse{Token: token})
}

// GetMe は現在ログイン中のユーザー情報を返します。
func (h *UserHandler) GetMe(c echo.Context) error {
	userID, ok := c.Get("user_id").(uint)
	if !ok || userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "認証が必要です"})
	}
	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "ユーザー情報の取得に失敗しました"})
	}
	return c.JSON(http.StatusOK, models.GetUserResponse{ID: user.ID, Name: user.Name})
}