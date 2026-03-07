package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/yabu1121/blog-backend/domain/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// 変数DBに実際のDBのポインタを代入する。
var DB *gorm.DB

// server.goで使うInitDBかんすうをさくせいする。
// 戻り値記述忘れずに
func InitDB() error {
	// envファイルからdbの場所を作り出す。 (19 ~ 28)
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Tokyo",
		host, user, password, dbname, port,
	)

	// error型errとして宣言しておく、db起動して接続できるまで最大十回繰り返す。
	var err error
	for i := 0; i < 10; i++ {
		// 成功したら、DBに、失敗したらerrが返ってくるpostgres.Open(dsn)でurlを指定したらそのdbを開くことができる。dockerで起動したdbに接続ができる。
		// gorm インスタンスの設定を書き換える
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			// プリペアード？ステートメント？をtrueにしておくことで？？？
			// 一度投げたSQLの構造尾をDBにキャッシュする => 早くなる。
			PrepareStmt: true,
		})
		// もしerr が発生している場合は次のループに突入する。
		if err == nil {
			break
		}
		log.Printf("DB接続に失敗しました。5秒後にリトライします... (%d/10): %v", i+1, err)
		// 5秒間待つ。
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		return fmt.Errorf("DB接続の最終試行に失敗しました: %w", err)
	}

	log.Println("DB接続に成功しました。")

	sqlDB, err := DB.DB()
	if err != nil {
			return fmt.Errorf("sql.DBの取得に失敗しました: %w", err)
	}

	// 最大接続数を100 (アイドル状態の接続をプールに最大何本保持するかを制限する。)
	sqlDB.SetMaxIdleConns(100)
	// dbの最大開く人を100 (データベースへの同時オープン接続（使用中＋アイドル）の最大数を制限する)
	sqlDB.SetMaxOpenConns(100)
	// アイドル状態が長い接続をクローズして接続をリフレッシュする
	sqlDB.SetConnMaxLifetime(time.Hour)
	// dbを自動でマイグレーションする。
	// ポインタを渡すことで実際に渡している。
	// 失敗したらerrが返ってくるので、帰ってきたらlog.fatal?にする
	if err := DB.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Comment{},
	); err != nil {
		return fmt.Errorf("Migration Failed: %w", err)
	}
	// 施工したらターミナルに出力する。
	log.Println("Migration Successful")

}