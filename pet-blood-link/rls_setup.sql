-- =============================================================================
-- AnimalBloodConnect: RLS設定 + スキーマ修正SQL
-- 使い方: Supabase Dashboard > SQL Editor にこのファイルを貼り付けて「Run」
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────
-- 【Part 1】スキーマ修正（審査なし登録のため NOT NULL 制約を解除）
-- ─────────────────────────────────────────────────────────────────

-- hospitals.address_city を NULL 許容に変更（登録直後は空でOK）
ALTER TABLE public.hospitals
    ALTER COLUMN address_city DROP NOT NULL;

-- hospitals.address_prefecture を NULL 許容に変更
ALTER TABLE public.hospitals
    ALTER COLUMN address_prefecture DROP NOT NULL;

-- donors テーブルに移動可能距離カラムを追加（まだ無ければ）
ALTER TABLE public.donors
    ADD COLUMN IF NOT EXISTS travel_distance_km INTEGER DEFAULT 20;

-- donors テーブルに連絡先カラムを追加（まだ無ければ）
ALTER TABLE public.donors
    ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.donors
    ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.donors
    ADD COLUMN IF NOT EXISTS heartworm_prevention BOOLEAN DEFAULT FALSE;
ALTER TABLE public.donors
    ADD COLUMN IF NOT EXISTS no_previous_transfusion BOOLEAN DEFAULT FALSE;


-- ─────────────────────────────────────────────────────────────────
-- 【Part 2】RLS を有効化（まだの場合）
-- ─────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages    ENABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────────────────────────────
-- 【Part 3】profiles テーブルのポリシー
-- ─────────────────────────────────────────────────────────────────

-- 既存ポリシーを削除してから再作成（冪等に実行できるように）
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

-- 全員が閲覧可能
CREATE POLICY "profiles_select" ON public.profiles
    FOR SELECT USING (true);

-- 自分のレコードのみ作成可能
CREATE POLICY "profiles_insert" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 自分のレコードのみ更新可能
CREATE POLICY "profiles_update" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────────
-- 【Part 4】hospitals テーブルのポリシー ★ 今回の修正の核心部分
-- ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "hospitals_select" ON public.hospitals;
DROP POLICY IF EXISTS "hospitals_insert" ON public.hospitals;
DROP POLICY IF EXISTS "hospitals_update" ON public.hospitals;

-- 全員が閲覧可能（診察できる病院の一覧表示など）
CREATE POLICY "hospitals_select" ON public.hospitals
    FOR SELECT USING (true);

-- ★ 認証済みユーザーが自分のIDで INSERT 可能（審査なし登録の要）
CREATE POLICY "hospitals_insert" ON public.hospitals
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 自分の病院情報のみ更新可能
CREATE POLICY "hospitals_update" ON public.hospitals
    FOR UPDATE USING (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────────
-- 【Part 5】donors テーブルのポリシー
-- ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "donors_select" ON public.donors;
DROP POLICY IF EXISTS "donors_insert" ON public.donors;
DROP POLICY IF EXISTS "donors_update" ON public.donors;
DROP POLICY IF EXISTS "donors_delete" ON public.donors;

-- 認証済みユーザーは全ドナーを閲覧可能（病院がドナーを探せるように）
CREATE POLICY "donors_select" ON public.donors
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- 自分のペットのみ登録可能
CREATE POLICY "donors_insert" ON public.donors
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 自分のペットのみ更新可能
CREATE POLICY "donors_update" ON public.donors
    FOR UPDATE USING (auth.uid() = owner_id);

-- 自分のペットのみ削除可能
CREATE POLICY "donors_delete" ON public.donors
    FOR DELETE USING (auth.uid() = owner_id);


-- ─────────────────────────────────────────────────────────────────
-- 【Part 6】blood_requests テーブルのポリシー
-- ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "blood_requests_select" ON public.blood_requests;
DROP POLICY IF EXISTS "blood_requests_insert" ON public.blood_requests;
DROP POLICY IF EXISTS "blood_requests_update" ON public.blood_requests;

-- 全員（未認証含む）が閲覧可能 ← トップページの緊急バナー表示に必要
CREATE POLICY "blood_requests_select" ON public.blood_requests
    FOR SELECT USING (true);

-- 病院ユーザーのみ要請を発令できる
CREATE POLICY "blood_requests_insert" ON public.blood_requests
    FOR INSERT WITH CHECK (
        auth.uid() = hospital_id
    );

-- 発令した病院のみ更新（キャンセルなど）
CREATE POLICY "blood_requests_update" ON public.blood_requests
    FOR UPDATE USING (auth.uid() = hospital_id);


-- ─────────────────────────────────────────────────────────────────
-- 【Part 7】matches テーブルのポリシー
-- ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "matches_select" ON public.matches;
DROP POLICY IF EXISTS "matches_insert" ON public.matches;
DROP POLICY IF EXISTS "matches_update" ON public.matches;

-- 関係者（病院またはドナーの飼い主）のみ閲覧
CREATE POLICY "matches_select" ON public.matches
    FOR SELECT USING (
        auth.uid() = hospital_id
        OR auth.uid() IN (
            SELECT owner_id FROM public.donors WHERE id = donor_id
        )
    );

-- 認証済みユーザーがマッチングを作成可能
CREATE POLICY "matches_insert" ON public.matches
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 関係者のみ更新可能
CREATE POLICY "matches_update" ON public.matches
    FOR UPDATE USING (
        auth.uid() = hospital_id
        OR auth.uid() IN (
            SELECT owner_id FROM public.donors WHERE id = donor_id
        )
    );


-- ─────────────────────────────────────────────────────────────────
-- 【Part 8】messages テーブルのポリシー
-- ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;

-- そのマッチングの当事者のみメッセージを閲覧可能
CREATE POLICY "messages_select" ON public.messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT hospital_id FROM public.matches WHERE id = match_id
            UNION
            SELECT d.owner_id FROM public.matches m
            JOIN public.donors d ON d.id = m.donor_id
            WHERE m.id = match_id
        )
    );

-- 当事者のみ送信可能
CREATE POLICY "messages_insert" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
        AND auth.uid() IN (
            SELECT hospital_id FROM public.matches WHERE id = match_id
            UNION
            SELECT d.owner_id FROM public.matches m
            JOIN public.donors d ON d.id = m.donor_id
            WHERE m.id = match_id
        )
    );


-- ─────────────────────────────────────────────────────────────────
-- 完了メッセージ
-- ─────────────────────────────────────────────────────────────────
SELECT 'RLS設定が完了しました ✅' AS status;
