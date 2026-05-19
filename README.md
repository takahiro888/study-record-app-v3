# 学習記録アプリ (study-record-app-v3)

学習内容と学習時間を記録・管理するWebアプリです。

## 機能

- 学習記録の一覧表示
- 学習記録の新規登録・編集・削除
- 合計学習時間の表示
- フォームバリデーション

## 技術スタック

| カテゴリ       | 技術                     |
| -------------- | ------------------------ |
| フロントエンド | React 19 / TypeScript    |
| ビルドツール   | Vite                     |
| UI             | Chakra UI v3             |
| フォーム       | react-hook-form          |
| バックエンド   | Supabase                 |
| テスト         | Vitest / Testing Library |
| デプロイ       | Firebase Hosting         |
| CI/CD          | GitHub Actions           |

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルをルートに作成し、以下を設定してください。

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase テーブルの作成

`study-record` テーブルを以下のカラムで作成してください。

| カラム名   | 型                 |
| ---------- | ------------------ |
| id         | int8 (Primary Key) |
| title      | text               |
| time       | int8               |
| created_at | timestamptz        |

## コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm run test

# プレビュー
npm run preview
```

## プロジェクト構成

```
src/
  components/
    molecules/
      RecordItem.tsx     # レコード一覧の各行
    ui/                  # Chakra UI カスタムコンポーネント
  domain/
    record.ts            # Record ドメインモデル
  tests/
    App.test.tsx         # Vitestテスト
  utils/
    supabaseClient.ts    # Supabaseクライアント
    supabaseFunctions.ts # CRUD操作
  App.tsx
  main.tsx
```
