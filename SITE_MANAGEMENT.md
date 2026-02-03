---
description: Vercelでの公開と管理画面（里親お申し込み等の閲覧）の手順
---

# サイト運営マニュアル（Vercel対応版）

このサイトは、VercelとGitHubを連携させることで、管理画面から「里親募集」や「お知らせ」の更新、さらには「フォームの回答閲覧」ができるようになっています。

---

## 1. 管理画面の機能

サイトのURLの末尾に `/admin/` を付けてアクセスし、GitHubアカウントでログインします。
（例: `https://your-site.vercel.app/admin/`）

### 更新・管理できる内容

- **里親募集（犬・猫）**: 画像、名前、性格、ステータス（募集中/里親決定など）の編集
- **お知らせ・イベント**: 最新情報の発信
- **【NEW】フォーム回答の閲覧・整理**:
  - **里親希望お申し込み**: 届いたアンケート内容を一覧で確認できます。
  - **サポーター申し込み**: お名前や連絡先、口数を確認できます。
  - **HRR広告掲載依頼**: 会社名や希望サイズを確認できます。
  - ※各回答には「未対応」「対応中」「完了」などのステータスを付けて管理できます。

---

## 2. サイトの公開と設定の手順（Vercel）

Vercelで全ての機能を動作させるために、以下の初期設定が必要です。

### STEP 1: GitHubリポジトリの作成とアップロード

1. 全てのファイルをGitHubリポジトリ（Private推奨）へアップロードします。
2. `admin/config.yml` の `repo: your-github-username/your-repo-name` をご自身のリポジトリ名に書き換えてください。

### STEP 2: GitHub OAuth Appの作成（管理画面ログイン用）

管理画面にログインするために必要です。

1. GitHubの Settings > Developer settings > OAuth Apps > **New OAuth App** を開く。
2. **Homepage URL**: `https://your-site.vercel.app`
3. **Authorization callback URL**: `https://your-site.vercel.app/api/callback`
4. 作成後、**Client ID** と **Client Secret** をメモします。

### STEP 3: Vercelの環境変数（Environment Variables）の設定

Vercelのプロジェクト設定画面（Settings > Environment Variables）で以下を登録します。

- `GITHUB_TOKEN`: GitHubで発行した Personal Access Token (repo権限が必要)
- `GITHUB_REPO`: `ユーザー名/リポジトリ名`
- `OAUTH_CLIENT_ID`: 先ほどメモした Client ID
- `OAUTH_CLIENT_SECRET`: 先ほどメモした Client Secret

---

## 3. 日々の運用フロー

1. **お申し込みが入る**: ユーザーがフォームを送信すると、GitHubに自動でデータ（JSONファイル）が作成されます。
2. **管理画面で確認**: `/admin/` にアクセスし、「里親希望お申し込み」などのメニューを開くと、内容が届いています。
3. **ステータス更新**: 対応が終わったら、管理画面上の「対応状況」を「完了」に変更して保存することで、チーム内で状況を共有できます。
4. **サイト編集**: ワンちゃんが決まったら「犬」の一覧からステータスを「里親決定」に変更します。

---

## 4. メンテナンスとサポート

- **画像**: 管理画面からのアップロードで自動整理されます。
- **不備があった場合**: 送信エラーなどが発生したときは、Vercelのログを確認するか、私（AI）へご相談ください。
