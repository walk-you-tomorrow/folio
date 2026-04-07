# Phase 2: 프로젝트 세팅 & 개발 — 완료 보고

> 일자: 2026-04-08
> 상태: ✅ 완료

---

## 산출물

### 프로젝트 구조
```
src/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← 루트 레이아웃 (메타데이터, OG)
│   │   ├── page.tsx            ← 홈 랜딩페이지
│   │   ├── not-found.tsx       ← 404 페이지
│   │   ├── globals.css         ← 브랜드 CSS 변수
│   │   ├── providers.tsx       ← LiveblocksProvider
│   │   ├── [canvasId]/
│   │   │   └── page.tsx        ← 캔버스 메인 화면
│   │   └── api/
│   │       ├── canvas/
│   │       │   └── route.ts    ← POST: 캔버스 생성
│   │       ├── canvas/[id]/
│   │       │   └── route.ts    ← GET/PATCH: 캔버스 조회/수정
│   │       ├── upload/
│   │       │   └── route.ts    ← POST: 이미지 업로드
│   │       └── liveblocks-auth/
│   │           └── route.ts    ← POST: Liveblocks 인증
│   ├── components/
│   │   ├── Canvas.tsx          ← Konva 무한 캔버스 (스티커, 이미지, 줌/패닝)
│   │   ├── TopBar.tsx          ← 상단 바 (로고, 제목, 접속자, 공유)
│   │   ├── Toolbar.tsx         ← 하단 플로팅 툴바
│   │   ├── ZoomControl.tsx     ← 줌 컨트롤
│   │   ├── ShareModal.tsx      ← 공유 모달
│   │   ├── NicknameModal.tsx   ← 닉네임 입력 모달
│   │   ├── Toast.tsx           ← 토스트 알림
│   │   └── useImage.ts         ← 이미지 로딩 훅
│   └── lib/
│       ├── types.ts            ← 타입 정의
│       ├── supabase.ts         ← Supabase 클라이언트
│       └── liveblocks.ts       ← Liveblocks re-exports
├── liveblocks.config.ts        ← Liveblocks 글로벌 타입
├── supabase-schema.sql         ← DB 스키마
├── .env.local.example          ← 환경변수 예시
└── package.json
```

### 구현된 기능
| 기능 | 상태 | 비고 |
|---|---|---|
| 홈 랜딩페이지 | ✅ | 브랜드 가이드라인 준수, CTA |
| 캔버스 생성 API | ✅ | nanoid 8자리, 충돌 재시도 |
| 캔버스 조회/수정 API | ✅ | 만료 체크 포함 |
| 이미지 업로드 API | ✅ | 타입/크기 검증, Supabase Storage |
| Liveblocks 인증 | ✅ | 랜덤 아바타 컬러 할당 |
| 무한 캔버스 (줌/패닝) | ✅ | Konva.js, 휠줌, 드래그 패닝 |
| 텍스트 스티커 CRUD | ✅ | 6색 배경, 드래그, 삭제 |
| 이미지 엘리먼트 | ✅ | 드래그, 리사이즈(Transformer) |
| 실시간 동기화 | ✅ | Liveblocks LiveMap |
| 접속자 표시 | ✅ | TopBar 아바타 그룹 |
| 공유 모달 | ✅ | 링크 복사, 클립보드 |
| 닉네임 모달 | ✅ | 선택 입력, 건너뛰기 |
| 404 페이지 | ✅ | 브랜드 톤 |
| 키보드 단축키 | ✅ | T, V, H, Delete |
| 빈 캔버스 상태 | ✅ | 안내 메시지 |
| DB 스키마 | ✅ | SQL 파일 제공 |

### 기술 스택 확정
- Next.js 16.2.2 (App Router, Turbopack)
- TypeScript (strict mode)
- Tailwind CSS v4
- Konva.js + react-konva
- Liveblocks v3 (실시간 동기화)
- Supabase (DB + Storage)
- nanoid (캔버스 ID 생성)

---

## Phase 2 크로스 리뷰

### 🟢 Good
- G-1. TypeScript strict mode, 0 에러 빌드 성공
- G-2. 모든 API route에서 환경변수 lazy init (빌드 안전)
- G-3. 브랜드 CSS 변수 완전 적용 (컬러 9종, 스티커 6색)
- G-4. 에러 메시지 전부 브랜드 톤(해요체) 준수
- G-5. 접근성: aria-label, role 적용
- G-6. 파일 업로드 서버 사이드 검증 (타입, 크기)

### 🟡 Warning
- W-1. 스티커 인라인 텍스트 편집 미구현 (더블클릭 시 HTML 오버레이 필요)
  → MVP에서는 Konva Text로 표시만. 편집은 Phase 3에서 추가 예정.
- W-2. 드래그앤드롭 이미지 업로드 시 캔버스 위치 계산 미반영 (항상 200,200에 배치)
  → 드롭 위치 기반으로 보정 필요.
- W-3. `providers.tsx` 생성했으나 layout.tsx에 미연결
  → Liveblocks는 캔버스 페이지 내에서 RoomProvider로 감싸므로 문제 없음.

### 🔴 Critical
- 없음.

### 판정: ✅ 통과
Phase 3 진행 가능.

---

## 이슈 로그

| # | 이슈 | 해결 |
|---|---|---|
| I-4 | Liveblocks v3 타입 시스템 변경 (`LiveMap`, `Lson` 제약) | `CanvasElement`에 index signature 추가, `useStorage` 콜백으로 plain array 변환 |
| I-5 | Supabase/Liveblocks 빌드 시 env 없이 초기화 에러 | 모든 외부 서비스 lazy init 패턴 적용 |
| I-6 | Next.js 16 route params가 `Promise` 타입으로 변경 | `await params` 패턴 적용 |

---

## 다음 단계

→ **Phase 3: QA 테스트** 착수
- 스티커 텍스트 편집 보완
- E2E 테스트 작성
- 크로스브라우저 검증
- 성능 측정
