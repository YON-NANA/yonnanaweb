# Supabase セットアップガイド

このガイドでは、**AnimalBloodConnect** のバックエンド（データベース・認証機能）を Supabase で構築する手順を説明します。

## 1. Supabase プロジェクトの作成

1. [Supabase 公式サイト](https://supabase.com/) にアクセスし、ログイン（またはサインアップ）します。
2. ダッシュボードから **「New Project」** をクリックします。
3. 以下の情報を入力します：
    - **Name**: `AnimalBloodConnect`
    - **Database Password**: 強力なパスワードを設定し、メモしておきます。
    - **Region**: ユーザーに近いリージョン（例: `Tokyo`）を選択します。
4. **「Create new project」** をクリックし、構築完了まで数分待ちます。

## 2. データベースの構築 (SQLの実行)

作成した `supabase_schema.sql` を使って、テーブルを一括作成します。

1. Supabaseダッシュボードの左メニューから **「SQL Editor」** を選択します。
2. **「+ New query」** をクリックします。
3. 以下の手順でファイルの内容を貼り付けます：
    - プロジェクトフォルダ内の `supabase_schema.sql` をメモ帳などで開き、全文をコピーします。
    - SupabaseのSQLエディタに貼り付けます。
4. 右下の **「Run」** ボタンをクリックします。
5. 「Success」と表示されれば、テーブル作成は完了です。
    - 左メニューの **「Table Editor」** で `profiles`, `donors`, `hospitals` などのテーブルができていることを確認してください。

## 3. 認証設定 (Auth)

1. 左メニューの **「Authentication」** -> **「Providers」** を選択します。
2. **Email** が「Enabled」になっていることを確認します。
3. （必要に応じて）**「URL Configuration」** で、サイトのURL（開発中は `http://localhost:3000` など）を Redirect URL に追加します。

## 4. APIキーの確認

Next.js アプリケーションから接続するために必要なキーを確認します。

1. 左メニューの **「Settings」** (歯車アイコン) -> **「API」** を選択します。
2. **Project URL** と **anon public key** をメモします。
    - これらは後ほど、`.env.local` ファイルに設定します。

---

## 補足: Row Level Security (RLS) について

現在作成したテーブルには、セキュリティポリシー（誰がどのデータを読めるか）がまだ詳細に設定されていません。
開発初期段階ではテストしやすくするために初期設定のままですが、本番公開前には必ず **Policies** の設定を行う必要があります。

- **Profiles**: `Enable Read Access for all users`, `Enable Insert/Update for users based on user_id`
- **Donors**: `Enable Read Access for authenticated hospitals only` (プライバシー保護のため)

この設定については、アプリ開発が進んだ段階で改めて詳細なポリシーを適用します。
