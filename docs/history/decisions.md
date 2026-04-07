# Folio — 프로젝트 의사결정 히스토리

> 최종 업데이트: 2026-04-07

---

## 1. 서비스 정의 (2026-04-07)

**한 문장 정의:**
회원가입 없이 링크 하나로 입장하여, 무한 캔버스 위에 텍스트·그림·사진을 자유롭게 올리고 실시간으로 함께 보는 즉석 협업 메모장

**핵심 컨셉:**
모든 사람들의 생각이 하나의 캔버스로 무한하게 확장해 나간다

---

## 2. MVP 범위 확정 (2026-04-07)

### Must (7일)
- 링크 생성 → 즉시 공유 가능한 캔버스
- 텍스트 스티커 추가 (위치 드래그 가능)
- 이미지 업로드 후 캔버스에 배치
- 실시간 동기화 (여러 명 동시 편집)
- 핀치/휠 줌 + 무한 패닝

### Later (반응 후)
- 자유 드로잉 (펜 툴)
- 도형/화살표
- 커서 공유
- 캔버스 내보내기 (PNG/PDF)
- 템플릿

---

## 3. 사용자 플로우 확정 (2026-04-07)

**온보딩:**
홈 접속 → "새 캔버스 만들기" 클릭 → 즉시 캔버스 생성 + 고유 URL 발급 → 링크 복사 / 카톡 공유

**핵심 행동:**
링크 접속 → 닉네임(선택) 입력 → 텍스트/이미지 추가 → 드래그로 위치 조정 → 실시간 반영

---

## 4. 네이밍 의사결정 과정 (2026-04-07)

### 라운드 1: 초기 제안 (Gathink)
- 브랜드 매니저가 Gathink(Gather + Think) 제안
- 사용자 피드백: 핵심 컨셉 "무한 확장"이 반영되지 않음

### 라운드 2: 무한 확장 컨셉 반영
- 후보: Spred, Unfold, Boundless, Expando, Canvly
- 사용자 피드백: "조어(만든 단어)"보다 실제 의미 있는 단어 선호

### 라운드 3: 한국어 고유어 탐색
- 후보: 번짐, 넘실, 물결, 틔움, 뻗음, 파다
- 사용자 피드백: 영어권 단어로 변경 요청

### 라운드 4: 영어 실제 단어
- 후보: Expanse, Grove, Bloom, Surge, Drift, Fold, Gather
- 사용자 피드백: Paper 관련 단어로 탐색 요청

### 라운드 5: Paper 관련 단어 (최종)
- 후보: Folio, Papeek, Scroll, Papyrus, Draftle, Blanksheet, Pado
- **최종 확정: Folio**
- 선정 이유: 2음절, 발음 명확, "종이가 펼쳐지는 무한 공간" 메타포, 포트폴리오 어원으로 "생각이 모이는 공간" 뉘앙스

---

## 5. 브랜드 아이덴티티 확정 (2026-04-07)

- 태그라인: "Your thoughts, unfolded together."
- 컬러: Folio Blue `#3B6FFF` (Primary), Soft Indigo `#7C5CFC`, Lemon Pop `#FFD43B`
- 폰트: Pretendard (한국어), Plus Jakarta Sans / Inter (영문)
- 톤: 해요체, 가볍고 솔직하게, 과장 금지
- 상세 내용: `docs/brand/brand-guidelines.md` 참조

---

## 6. 팀 구성 확정 (2026-04-07)

| 역할 | 에이전트 |
|---|---|
| PM (기획 총괄) | `pm` |
| 브랜드 매니저 | `brand-manager` |
| UX/UI 디자이너 | `designer` |
| 풀스택 개발자 | `developer` |
| QA | `qa` |
| 마케터 | `marketer` |
| DevOps | `devops` |
| CS | `cs` |

**핵심 원칙:** 브랜드 매니저가 먼저 브랜드 레이아웃을 잡고, 나머지 팀이 그에 맞춰 진행

---

## 7. 기술 스택 권고안 (2026-04-07, 미확정)

| 영역 | 권고 | 대안 |
|---|---|---|
| 프레임워크 | Next.js 14 (App Router) | Vite + React |
| 캔버스 | Konva.js + react-konva | Fabric.js |
| 실시간 | Liveblocks | PartyKit, Firebase RTDB |
| DB/Storage | Supabase | Firebase |
| 배포 | Vercel | Netlify |
| 에러 모니터링 | Sentry | - |
| 분석 | PostHog | Mixpanel |

> 기술 스택은 Day 1 검증 후 최종 확정 예정

---

## 8. 7일 타임라인 (2026-04-07, 초안)

| Day | 단계 | 핵심 |
|---|---|---|
| Day 1 | 기획/설계 | 요구사항 확정, 기술 스택 결정, 와이어프레임 |
| Day 2 | 설계/개발 | UI 디자인, 개발 환경 세팅, DB/API 설계 |
| Day 3 | 개발 | 캔버스 코어 + 실시간 동기화 |
| Day 4 | 개발 | 이미지 업로드 + 드래그 + API 연동 |
| Day 5 | 개발/QA | 기능 통합 + 1차 테스트 |
| Day 6 | QA/배포준비 | 크로스 브라우저, 성능, 배포 파이프라인 |
| Day 7 | 배포/론치 | 프로덕션 배포 + 모니터링 |

---

## 9. Phase 1 기획/설계 완료 (2026-04-07)

- PRD v1.0 확정 → `docs/planning/prd.md`
- 화면 정의서 v1.0 확정 → `docs/design/screen-definitions.md`
- API 명세서 v1.0 확정 → `docs/api/api-spec.md`
- 기술 스택 최종 확정: Next.js 14, Konva.js, Liveblocks, Supabase, Vercel
- 데이터 모델 확정: Canvas, Element(JSONB), Session
- 스킬 17개 설치 완료 (기획 5, 디자인 7, 개발 3, 배포 1, 탐색 1)
- 상세 보고: `docs/history/phase1-planning.md`

---

## 10. Phase 1 크로스 리뷰 결과 (2026-04-07)

- QA / Developer / Designer 3-way 크로스 리뷰 실시
- 🔴 Critical 3건 발견 → 전부 수정 완료
  - 엘리먼트 CRUD를 Liveblocks 단일 소스로 통합 (REST 엔드포인트 제거)
  - GET canvas 응답에서 elements 제거 (Liveblocks Room에서 로드)
  - 캔버스 만료 정리 Cron 메커니즘 추가
- 🟡 Warning 6건: 개발 중 반영 예정
- Phase 2 진행 승인
- 리뷰 프로세스 확립: 매 Phase 종료 시 3-way 크로스 리뷰 필수
- 상세 보고: `docs/history/phase1-review.md`

---

## 11. Phase 2 프로젝트 세팅 & 개발 완료 (2026-04-08)

- Next.js 16.2.2 프로젝트 초기화 (TypeScript, Tailwind CSS v4)
- 전체 15개 파일 구현 (4 API routes, 7 컴포넌트, 3 lib, 1 DB 스키마)
- Liveblocks v3 + Konva.js + Supabase 통합 완료
- TypeScript strict 0 에러, 프로덕션 빌드 성공
- 크로스 리뷰: Critical 0건, Warning 3건 (스티커 편집, 드롭 위치, providers)
- 상세 보고: `docs/history/phase2-development.md`

---

## 12. Phase 3 QA 테스트 완료 (2026-04-08)

- Playwright E2E 테스트 11건 작성 (홈, 캔버스, API)
- 테스트 계획 총 35건 수립 (자동 11 + 수동 24)
- 크로스브라우저 설정: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- 상세 보고: `docs/history/phase3-qa.md`

---

## 13. Phase 4 배포 & 론치 준비 완료 (2026-04-08)

- Vercel 배포 설정 완료 (vercel.json, 서울 리전)
- Cron 자동 정리 작업 구현 (만료 캔버스 + 이미지 일괄 삭제)
- 론치 전략 수립: Product Hunt, 트위터, 디스콰이엇 → 커뮤니티 확산
- FAQ 22개 항목 작성 (브랜드 톤 준수)
- 프로덕션 배포 대기 상태: 외부 서비스 키 발급 후 즉시 배포 가능
- 상세 보고: `docs/history/phase4-launch.md`
- 배포 가이드: `docs/history/deployment-guide.md`
