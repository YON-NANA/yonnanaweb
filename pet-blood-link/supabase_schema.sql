-- -----------------------------------------------------------------------------
-- AnimalBloodConnect Database Schema (Supabase / PostgreSQL)
-- 専用データベース設計書
-- -----------------------------------------------------------------------------

-- 1. ENUM定義 (カテゴリー分け用)
-- ユーザータイプ: ドナー(飼い主)か、病院か、管理者か
CREATE TYPE user_role_type AS ENUM ('donor', 'hospital', 'admin');
-- 動物の種類: 犬、猫
CREATE TYPE species_type AS ENUM ('dog', 'cat');
-- マッチングステータス (ドナー都合のcancelledと病院都合のhospital_cancelledを分ける)
CREATE TYPE match_status_type AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled', 'hospital_cancelled');
-- 供血要請の緊急度
CREATE TYPE request_urgency_type AS ENUM ('normal', 'urgent', 'emergency');
-- 供血要請のステータス
CREATE TYPE request_status_type AS ENUM ('active', 'fulfilled', 'cancelled');

-- 2. テーブル定義

-- 【Profiles】: ユーザー基本情報 (Supabase Authと連携)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY, -- AuthのIDと紐づけ
    role user_role_type NOT NULL DEFAULT 'donor',
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 【Hospitals】: 動物病院の詳細情報 (認証用)
CREATE TABLE public.hospitals (
    id UUID REFERENCES public.profiles(id) PRIMARY KEY, -- ProfilesのIDと１対１
    hospital_name TEXT NOT NULL,
    license_number TEXT, -- 獣医療法に基づく届出番号など（審査用）
    address_prefecture TEXT NOT NULL, -- 都道府県
    address_city TEXT NOT NULL, -- 市区町村
    address_detail TEXT, 
    phone_number TEXT,
    website_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- 運営による承認フラグ
    description TEXT, -- 病院紹介文
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 【Donors】: ドナー(ペット)の詳細情報
CREATE TABLE public.donors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL, -- 飼い主ID
    pet_name TEXT NOT NULL,
    species species_type NOT NULL, -- 犬 or 猫
    breed TEXT, -- 品種 (例: ゴールデンレトリバー)
    birth_date DATE, -- 年齢計算用
    weight_kg NUMERIC(4, 1), -- 体重 (0.1kg単位)
    blood_type TEXT, -- 血液型 (不明な場合はNULL)
    vaccination_status TEXT, -- ワクチン接種状況
    medical_history TEXT, -- 既往歴など
    prefecture TEXT NOT NULL, -- 活動可能エリア(都道府県)
    city TEXT, -- 活動可能エリア(市区町村)
    is_active BOOLEAN DEFAULT TRUE, -- ドナー登録中かどうか
    last_donation_date DATE, -- 最終供血日 (休養期間計算用)
    
    -- JARAシステム仕様
    trust_score NUMERIC(5, 2) DEFAULT 100.00, -- 信頼スコア(初期値100%)
    cancel_count INTEGER DEFAULT 0, -- 自己都合キャンセル回数
    account_status TEXT DEFAULT 'active', -- 'active' or 'suspended'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 【BloodRequests】: 病院からの広域供血要請（発令）
CREATE TABLE public.blood_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
    species species_type NOT NULL, -- 対象種別 (dog/cat)
    blood_type TEXT, -- 希望血液型
    urgency request_urgency_type DEFAULT 'normal',
    message TEXT, -- 状況詳細
    status request_status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 【Matches】: マッチング・依頼管理
CREATE TABLE public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
    donor_id UUID REFERENCES public.donors(id) NOT NULL,
    status match_status_type DEFAULT 'pending',
    request_message TEXT, -- 病院からの最初の依頼文
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 【Messages】: チャットメッセージ
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL, -- 送信者
    content TEXT NOT NULL, -- メッセージ本文
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. セキュリティ (RLS: Row Level Security) の概念設計
-- 実際の適用にはALTER TABLE ... ENABLE ROW LEVEL SECURITYが必要

-- Profiles: 自分のデータのみ編集可能、他人は閲覧のみ
-- Hospitals: 承認済み病院は誰でも閲覧可能
-- Donors: 詳細は「マッチング成立後」のみ病院が見れるように制限（プライバシー保護）
-- Messages: そのマッチングの当事者(病院とドナー)のみ閲覧・送信可能

-- 4. 関数とトリガー (更新日時の自動更新など)
-- (実装フェーズで追加)
