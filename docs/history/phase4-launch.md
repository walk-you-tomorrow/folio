# Phase 4: 배포 & 론치 준비 — 완료 보고

> 일자: 2026-04-08
> 상태: ✅ 완료

---

## 산출물

### 배포 (DevOps)
| 파일 | 설명 |
|---|---|
| `src/vercel.json` | Vercel 배포 설정 (리전: 서울, Cron 스케줄) |
| `src/src/app/api/cron/cleanup/route.ts` | 만료 캔버스 자동 정리 Cron 작업 |
| `src/supabase-schema.sql` | DB 스키마 + RLS + 정리 함수 |
| `src/.env.local.example` | 환경변수 설정 가이드 |

### 마케팅
| 파일 | 설명 |
|---|---|
| `docs/marketing/launch-plan.md` | 론치 전략 (채널, 카피, 일정) |

### CS
| 파일 | 설명 |
|---|---|
| `docs/cs/faq.md` | FAQ 22개 항목 (해요체, 브랜드 톤) |

---

## 배포 체크리스트

### 외부 서비스 세팅 필요
| 서비스 | 작업 | 상태 |
|---|---|---|
| **Supabase** | 프로젝트 생성, SQL 스키마 실행, Storage 버킷 생성 | ⬜ 사용자 필요 |
| **Liveblocks** | 계정 생성, API 키 발급 | ⬜ 사용자 필요 |
| **Vercel** | 프로젝트 연결, 환경변수 설정 | ⬜ 사용자 필요 |
| **도메인** | folio.app 또는 대안 도메인 | ⬜ 사용자 필요 |

### 환경변수 설정
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LIVEBLOCKS_SECRET_KEY=
CRON_SECRET=
```

---

## Phase 4 크로스 리뷰

### 🟢 Good
- G-1. Vercel Cron으로 만료 캔버스 자동 정리 구현
- G-2. FAQ가 브랜드 톤앤매너 완벽 준수 (해요체, 간결, 해결 중심)
- G-3. 론치 카피가 브랜드 가이드라인 금지 표현 회피
- G-4. 마케팅 채널별 맞춤 카피 준비

### 🟡 Warning
- W-6. 외부 서비스 계정/키 발급은 사용자가 직접 해야 함
- W-7. Sentry, PostHog 연동은 아직 미구현 (MVP 이후)

### 🔴 Critical
- 없음.

### 판정: ✅ 통과

---

## 다음 단계: 프로덕션 배포

사용자가 외부 서비스(Supabase, Liveblocks, Vercel)를 세팅하면 즉시 배포 가능한 상태.
