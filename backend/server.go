package main

// 必要なライブラリを導入
import (
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/yabu1121/blog-backend/database"
	"github.com/yabu1121/blog-backend/handler"
	authmiddleware "github.com/yabu1121/blog-backend/middleware"
)


func main() {

	// echoを.New()で
	// *echo Echo型のポインタを返すのでその変数、eで保存する
	e := echo.New()

	// eはpackage middleware内で宣言したRequestLoggerとCORSWithConfig(middleware.CORSConfig)で
	// CORSConfigで
	// rootのurlをlocalhost:3000
	// headerを,,,,
	//Credentialsは認証機能を使うようにしている。
	e.Use(middleware.RequestLogger())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: true,
	}))

	// package databaseにあるInitDB関数を利用する。
	if err := database.InitDB(); err != nil {
    e.Logger.Fatal("サーバーを起動できませんでした: ", err)
}

	// それぞれのhandlerとしてそれぞれのファイルのhandlerを呼べるようにする。また、これはdbをcontextに持つのでdbを渡す
	// (ポインタ参照の理由は同一のデータを共有するため、(h *UserHandlerなどにしているから))
	userHandler := &handler.UserHandler{DB: database.DB}
	postHandler := &handler.PostHandler{DB: database.DB}
	commentHandler := &handler.CommentHandler{DB: database.DB}

	// 認証不要なルート（閲覧・ログイン系）
	e.GET("/", handler.Hello)
	e.POST("/signup", userHandler.SignUp)
	e.POST("/login", userHandler.Login)
	e.GET("/user", userHandler.GetAllUser)
	e.GET("/user/:id", userHandler.GetUserById)
	e.GET("/post", postHandler.GetAllPost)
	e.GET("/post/:id", postHandler.GetPostById)
	e.GET("/post/:id/comments", commentHandler.GetComments)

	// 認証が必要なルート（書き込み系）
	// e.groupによってrouterの共通部分を記述したりミドルウェアをとういつさせることができる。
	authGroup := e.Group("")
	authGroup.Use(authmiddleware.JWTAuth)
	authGroup.POST("/user", userHandler.CreateUser)
	authGroup.POST("/post", postHandler.CreatePost)
	authGroup.PUT("/post/:id", postHandler.UpdatePost)
	authGroup.DELETE("/post/:id", postHandler.DeletePost)
	authGroup.POST("/post/:id/comment", commentHandler.CreateComment)
	authGroup.GET("/me", userHandler.GetMe)

	if err := e.Start(os.Getenv("BACKEND_PORT")); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}

