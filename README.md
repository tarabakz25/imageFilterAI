# 画像評価・フィルタリングアプリ

OpenAI VisionモデルAPIを使用して、画像がインターネット上での公開に適しているかを評価するアプリケーションです。アップロードされた画像を分析し、不適切なコンテンツが含まれているかどうかを判断します。

![アプリのスクリーンショット](https://placeholder-for-screenshot.png)

## 主な機能

- 画像のアップロードと内容の自動分析
- 不適切なコンテンツ（暴力、ヌード、グロテスクな表現など）の検出
- 分析結果のJSON形式での取得
- 安全性評価のスコアリングと詳細な判断理由の表示

## セットアップと実行方法

### 前提条件

- Node.js 18.x以上
- OpenAI APIキー

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/image-filter-ai.git
cd image-filter-ai

# 依存関係のインストール
npm install
```

### 環境変数の設定

1. `.env.example`ファイルを`.env`にコピーします：
```bash
cp .env.example .env
```

2. `.env`ファイルを編集し、OpenAI APIキーを設定します：
```
REACT_APP_OPENAI_API_KEY=your-openai-api-key
```

### 開発モードでの実行

```bash
npm start
```

アプリは[http://localhost:3000](http://localhost:3000)で実行されます。

### 本番ビルドの作成

```bash
npm run build
```

## セキュリティのベストプラクティス

このアプリケーションを使用・デプロイする際は、以下のセキュリティベストプラクティスに従うことを強く推奨します：

### APIキーの保護

1. **環境変数の使用**: OpenAI APIキーは環境変数を使用して管理してください。

2. **バックエンドプロキシ**: 本番環境では、APIキーを保護するためのバックエンドプロキシを実装してください。以下は簡単なNode.jsプロキシの例です：

```javascript
// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// 静的ファイル配信
app.use(express.static('build'));

// OpenAI APIへのプロキシ
app.use('/api/openai', createProxyMiddleware({
  target: 'https://api.openai.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/openai': '/v1',
  },
  onProxyReq: (proxyReq) => {
    // サーバー側でAPIキーを追加
    proxyReq.setHeader('Authorization', `Bearer ${process.env.OPENAI_API_KEY}`);
  },
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

3. **HTTPS接続**: 常にHTTPS接続を使用してください。

### デプロイ方法

#### Vercelへのデプロイ（推奨）

1. GitHubリポジトリと連携
2. 環境変数に`REACT_APP_OPENAI_API_KEY`を設定
3. プロジェクトをインポートして自動デプロイ

#### Netlifyへのデプロイ

```bash
npm install -g netlify-cli
netlify deploy
```

環境変数はNetlifyダッシュボードで設定してください。

#### バックエンドプロキシを使用したデプロイ (Heroku)

```bash
# Herokuにデプロイ
heroku create
git push heroku main

# 環境変数を設定
heroku config:set OPENAI_API_KEY=your-api-key
```

## 本番環境での考慮事項

1. **レート制限**: OpenAI APIのレート制限に注意してください。
2. **コスト管理**: APIの使用状況とコストを継続的に監視してください。
3. **エラーハンドリング**: ロバストなエラーハンドリングと再試行メカニズムを実装してください。

## ライセンス

MITライセンス

---

## Create React App 標準ドキュメント

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
