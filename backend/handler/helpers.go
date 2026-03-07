package handler

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// generateJWT は userID を含む JWTトークンを生成します。
// トークンは SECRET_KEY 環境変数で署名されます（72時間有効）。
func generateJWT(userID uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	return token.SignedString([]byte(os.Getenv("SECRET_KEY")))
}

// hashPassword はパスワードを bcrypt でハッシュ化します。
// bcrypt.DefaultCost = 10 で、コストを上げると安全性が上がるが処理が遅くなります。
func hashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

// verifyPassword はハッシュ化されたパスワードと平文パスワードを比較します。
func verifyPassword(hashedPassword, plainPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
}
