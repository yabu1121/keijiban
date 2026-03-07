package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/yabu1121/blog-backend/domain/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB はアプリケーション全体で共有するGORMインスタンスです
var DB *gorm.DB

// InitDB はデータベースへの接続を初期化します。
// 接続に失敗した場合は最大10回リトライします。
func InitDB() error {
	// 環境変数からDB接続情報を取得
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Tokyo",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	// 最大10回リトライしてDB接続を確立する
	var err error
	for i := 0; i < 10; i++ {
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			// 一度実行したSQLの構文をDBにキャッシュする（パフォーマンス向上）
			PrepareStmt: true,
			// 本番では logger.Silent にして不要なログを抑制する
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err == nil {
			break
		}
		log.Printf("DB接続失敗 (%d/10回目)。5秒後にリトライします: %v", i+1, err)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		return fmt.Errorf("DB接続の最終試行に失敗しました: %w", err)
	}
	log.Println("✅ DB接続成功")

	// sql.DB を取得してコネクションプールを設定する
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("sql.DBの取得に失敗しました: %w", err)
	}

	// アイドル接続の最大保持数（多すぎるとメモリを圧迫する）
	sqlDB.SetMaxIdleConns(10)
	// 同時オープン接続の上限（DBサーバーの限界を超えないように設定する）
	sqlDB.SetMaxOpenConns(100)
	// 接続の最大生存時間（長時間接続が切れた状態を防ぐ）
	sqlDB.SetConnMaxLifetime(time.Hour)

	// テーブルのスキーマ定義に合わせて自動でカラムを追加・変更する（削除はしない）
	if err := DB.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Comment{},
	); err != nil {
		return fmt.Errorf("マイグレーション失敗: %w", err)
	}
	log.Println("マイグレーション成功")

	return nil
}