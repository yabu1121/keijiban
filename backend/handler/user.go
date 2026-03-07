package handler

import (
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/yabu1121/blog-backend/domain/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// UserHandlerとしてserverでインポートするので作成しておく
type UserHandler struct{
	DB *gorm.DB
}

// すべてのuserを取得する
func (h *UserHandler) GetAllUser(c echo.Context) error {
	// usersという変数にuserのモデルの配列の方を宣言する
	var users []models.User
	// h.DBというのはUserhandlerにDBというフィールドを持たせることで、データベースにアクセスできるようになる。DIという。
	// これはほんとうはselectでもうすでに制限したほうが守備範囲がよくなる。
	// usersというポインタにfindしたものを入れ込む。
	// dbのErrorはこの記述で行えるから、err に代入されている場合は、jsonを返す。
	if err := h.DB.Select("id", "name").Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}

	// resという変数に、長さusersの要素数と同じの、getUsersResponseのスライスを作成する。
	res := make([]models.GetUserResponse, len(users))
	for i, u := range users {
		// usersの長さ分繰り返して、resにusersの表示内容を詰め替えている。
		res[i] = models.GetUserResponse{
			ID:   u.ID,
			Name: u.Name,
		}
	}
	// すべてうまくいったらresをjsonで返す
	return c.JSON(http.StatusOK, res)
}

// 指定したidとuserのidが一致するものを取得する
func (h *UserHandler) GetUserById(c echo.Context) error {
	// paramからid=?の部分がc.Paramで取得できる。
	id := c.Param("id")
	// model.Userでuserを型を指定しておく。
	var user models.User
	// handlerのDB部分でuserとidが一致する最初のものを指定する。
	// errがあったらjsonを返す。
	if err := h.DB.Select("id", "name").First(&user, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}
	// 返却するものを上手く返却する。
	res := models.GetUserResponse{
		ID:   user.ID,
		Name: user.Name,
	}
	//　成功したらjsonでresを返却する。
	return c.JSON(http.StatusOK, res)
}

//　userを作成する。
func (h *UserHandler) CreateUser(c echo.Context) error {
	// reqをmodelのcreateUserRequest型で宣言する
	req := models.CreateUserRequest{}
	// contextからreqに指定されたjsonを変数にバインドする。
	if err := c.Bind(&req); err != nil {
		// バインドに失敗したらjsonを返却する。
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "model isn't proper"})
	}

	// userという変数にUserの型として、name, emailで詰め替えた状態で、宣言する。
	user := models.User{
		Name:  req.Name,
		Email: req.Email,
	}
	// さっき作成したcreate()でDBに作成する。失敗したらjsonを返す
	if err := h.DB.Create(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}

	// resとしてresponseに入れ替える。作成したuserのidとnameを返却する
	res := models.GetUserResponse{
		ID:   user.ID,
		Name: user.Name,
	}

	// resを返却する。
	return c.JSON(http.StatusCreated, res)
}

// signupする関数
func (h *UserHandler) SignUp(c echo.Context) error {
	// reqをSignUpUserReqeuest型として宣言しておく。
	var req models.SignUpUserRequest
	// contextをbindしてreqに代入させる。
	if err := c.Bind(&req); err != nil {
		// もしerrの場合jsonを返す。
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	// bcrypt.GenerateFromPasswordは戻り値ひとつめをハッシュ化させたものを、二つ目はerrを返す。
	// 引数には暗号化のもとのstring、第二引数は暗号化複雑さのコストを与える。
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		// もしエラーが発生していたら、jsonを返す。
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to hash password"})
	}

	// ハッシュ化させたpasswordをuserに入れなおす。
	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
	}
	// user を作成する。
	if err := h.DB.Create(&user).Error; err != nil {
		// エラーの場合、jsonを返す。
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "could not create user"})
	}

	// tokenとして方はjwt.MapCalimsとして、jwtのライブラリでNewWithClaims関数をする。
	// jwt.SigningMethodHS256というのはこれはhash256という方法でハッシュ化するということ。
	// user_idとexpを設定してtokenにしておく。
	// jwtのpayloadの中身はだれでもdecodeして中身が見れる、envで書かないといけなくなるのは中身を書き換えれなくするため、
	// tokenはのちの処理で必要になるuserIdを持っていれば問題はない。
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	// tokenをランダムに設定したsecret_keyでまた署名を起こすことでセキュリティを高める。
	t, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		// エラーの場合、jsonを返す。
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to generate token"})
	}
	// signupが成功したいら、Tokenを返せるようにする。
	return c.JSON(http.StatusCreated, models.JwtResponse{Token: t})
}

// loginする関数
func (h *UserHandler) Login (c echo.Context) error {
	var req models.LoginUserRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid email or password"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid email or password"})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	t, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to generate token"})
	}

	return c.JSON(http.StatusOK, models.JwtResponse{Token: t})
}

// userの情報を取得する関数。
func (h *UserHandler) GetMe (c echo.Context) error {
	val := c.Get("user_id")
	userID, ok := val.(uint)
	if !ok || userID == 0 {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
	}
	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "internal server error"})
	}
	res := models.GetUserResponse{
		ID: user.ID,
		Name: user.Name,
	}
	return c.JSON(http.StatusOK, res)
}