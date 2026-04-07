# Folio — 프로덕션 배포 가이드

> 작성일: 2026-04-08
> 예상 소요 시간: 20~30분

---

## 1. Supabase 세팅

### Step 1-1. 프로젝트 생성

1. https://supabase.com 접속 → **Start your project** 클릭
2. GitHub 계정으로 로그인
3. **New Project** 클릭
4. 아래 정보 입력:
   - **Name**: `folio`
   - **Database Password**: 강력한 비밀번호 입력 (기록해두기)
   - **Region**: `Northeast Asia (Seoul)` 선택
5. **Create new project** 클릭 → 2~3분 대기

### Step 1-2. DB 스키마 실행

1. 좌측 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. 아래 SQL을 복사하여 붙여넣기:

```sql
-- 캔버스 테이블
CREATE TABLE IF NOT EXISTS canvases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '제목 없는 캔버스',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_canvases_expires_at ON canvases (expires_at);

-- RLS 활성화
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;

-- 공개 정책 (MVP: 인증 없음)
CREATE POLICY "Public read" ON canvases FOR SELECT USING (true);
CREATE POLICY "Public insert" ON canvases FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON canvases FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON canvases FOR DELETE USING (true);

-- 만료 캔버스 정리 함수
CREATE OR REPLACE FUNCTION cleanup_expired_canvases()
RETURNS void AS $$
BEGIN
  DELETE FROM canvases WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

4. **Run** 클릭 → "Success" 확인

### Step 1-3. Storage 버킷 생성

1. 좌측 메뉴에서 **Storage** 클릭
2. **New bucket** 클릭
3. 아래 설정:
   - **Name**: `uploads`
   - **Public bucket**: ✅ 체크 (ON)
   - **File size limit**: `5MB` (5242880 bytes)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
4. **Create bucket** 클릭

5. 생성된 `uploads` 버킷 클릭 → 상단 **Policies** 탭 → **New Policy**
6. **For full customization** 선택 → 아래 정책 추가:

**정책 1 — 누구나 업로드 허용:**
- Policy name: `Public upload`
- Allowed operation: `INSERT`
- Target roles: (비워두기 = 모두 허용)
- Policy definition: `true`

**정책 2 — 누구나 조회 허용:**
- Policy name: `Public read`
- Allowed operation: `SELECT`
- Target roles: (비워두기)
- Policy definition: `true`

**정책 3 — 누구나 삭제 허용:**
- Policy name: `Public delete`
- Allowed operation: `DELETE`
- Target roles: (비워두기)
- Policy definition: `true`

### Step 1-4. API 키 복사

1. 좌측 메뉴에서 **Project Settings** (톱니바퀴) 클릭
2. **API** 탭 클릭
3. 아래 3개 값을 메모장에 복사해두기:

| 항목 | 위치 | 환경변수 이름 |
|---|---|---|
| **Project URL** | `https://xxxxx.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon (public) key** | `eyJ...` 긴 문자열 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role key** | `eyJ...` 긴 문자열 (⚠️ 비밀) | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ `service_role` 키는 절대 클라이언트에 노출하면 안 돼요. 서버에서만 사용합니다.

---

## 2. Liveblocks 세팅

### Step 2-1. 계정 생성

1. https://liveblocks.io 접속
2. **Get started free** 클릭
3. GitHub 계정으로 로그인

### Step 2-2. API 키 발급

1. 로그인 후 **Dashboard** 진입
2. 기본 프로젝트가 이미 있음 (또는 **Create project** 클릭)
3. 좌측 메뉴에서 **API keys** 클릭
4. **Secret key** 복사 (`sk_` 로 시작하는 문자열)

| 항목 | 값 예시 | 환경변수 이름 |
|---|---|---|
| **Secret key** | `sk_prod_xxxxxxxx...` | `LIVEBLOCKS_SECRET_KEY` |

> 무료 플랜: 월 동시접속 300명, Room 무제한. MVP에 충분합니다.

---

## 3. Vercel 배포

### Step 3-1. Git 저장소 준비

먼저 GitHub에 레포지토리를 만들고 코드를 push합니다.

```bash
# folio 프로젝트 루트에서
cd /Users/sung-a.generouspark/1Billion/folio

# git 초기화 (이미 되어있으면 스킵)
git init
git add .
git commit -m "Initial commit: Folio MVP"

# GitHub에 레포 생성 후
git remote add origin https://github.com/YOUR_USERNAME/folio.git
git branch -M main
git push -u origin main
```

### Step 3-2. Vercel 프로젝트 연결

1. https://vercel.com 접속 → GitHub 로그인
2. **Add New Project** 클릭
3. GitHub 레포 목록에서 `folio` 선택 → **Import**
4. 프로젝트 설정:
   - **Framework Preset**: `Next.js` (자동 감지)
   - **Root Directory**: `src` ← ⚠️ 반드시 `src`로 설정!
   - **Build Command**: (기본값 유지: `next build`)
   - **Output Directory**: (기본값 유지)

### Step 3-3. 환경변수 설정

같은 설정 화면에서 **Environment Variables** 섹션에 아래 5개를 추가:

| Name | Value | 출처 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Step 1-4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Step 1-4 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase Step 1-4 |
| `LIVEBLOCKS_SECRET_KEY` | `sk_prod_...` | Liveblocks Step 2-2 |
| `CRON_SECRET` | (아무 랜덤 문자열) | 직접 생성 |

> `CRON_SECRET`은 터미널에서 아래 명령으로 생성할 수 있어요:
> ```bash
> openssl rand -hex 32
> ```

### Step 3-4. 배포

1. **Deploy** 클릭
2. 빌드 로그를 확인하며 2~3분 대기
3. 빌드 성공 시 `https://folio-xxxxx.vercel.app` 형태의 URL이 발급됨
4. 해당 URL로 접속하여 동작 확인

### Step 3-5. 커스텀 도메인 연결 (선택)

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 입력 (예: `folio.app`)
3. DNS 설정 안내에 따라 도메인 제공업체에서 레코드 추가:
   - **A 레코드**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. SSL 인증서가 자동으로 발급됨 (1~2분)

---

## 4. 배포 후 확인 체크리스트

| # | 확인 항목 | 방법 | 상태 |
|---|---|---|---|
| 1 | 홈페이지 접속 | `https://your-domain.com` 접속 | ⬜ |
| 2 | 캔버스 생성 | "새 캔버스 만들기" 클릭 | ⬜ |
| 3 | 공유 모달 표시 | 캔버스 생성 후 자동 표시 | ⬜ |
| 4 | 링크 복사 | "복사" 버튼 클릭 → 토스트 확인 | ⬜ |
| 5 | 텍스트 스티커 | 캔버스 클릭 → 스티커 생성 | ⬜ |
| 6 | 이미지 업로드 | 이미지 파일 선택 또는 드래그 | ⬜ |
| 7 | 실시간 동기화 | 다른 브라우저에서 같은 링크 접속 → 변경 반영 확인 | ⬜ |
| 8 | 줌/패닝 | 마우스 휠 줌, 손바닥 도구 패닝 | ⬜ |
| 9 | 모바일 접속 | 핸드폰에서 링크 접속 | ⬜ |
| 10 | 에러 페이지 | 존재하지 않는 URL 접속 → 에러 메시지 확인 | ⬜ |

---

## 트러블슈팅

### "캔버스를 만들지 못했어요" 에러
→ Supabase 환경변수 확인. `SUPABASE_SERVICE_ROLE_KEY`가 올바른지 확인하세요.

### "실시간 동기화가 안 돼요"
→ `LIVEBLOCKS_SECRET_KEY`가 `sk_`로 시작하는지 확인하세요. Dashboard에서 키가 활성 상태인지 확인하세요.

### "이미지가 안 올라가요"
→ Supabase Storage에 `uploads` 버킷이 Public으로 설정되어 있는지, RLS 정책이 있는지 확인하세요.

### Vercel 빌드 실패
→ **Root Directory**가 `src`로 설정되어 있는지 확인하세요. 환경변수가 빠진 건 없는지 확인하세요.

### Cron이 실행되지 않음
→ Vercel Pro 플랜이 필요합니다. 무료 플랜에서는 Cron이 제한될 수 있어요. 수동으로 `/api/cron/cleanup`을 호출하여 테스트할 수 있습니다.
