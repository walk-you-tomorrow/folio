# Phase 1: 기획/설계 — 완료 보고

> 일자: 2026-04-07
> 상태: ✅ 완료

---

## 산출물

| 문서 | 경로 | 상태 |
|---|---|---|
| PRD v1.0 | `docs/planning/prd.md` | ✅ 확정 |
| 화면 정의서 v1.0 | `docs/design/screen-definitions.md` | ✅ 확정 |
| API 명세서 v1.0 | `docs/api/api-spec.md` | ✅ 확정 |
| 브랜드 가이드라인 v1.0 | `docs/brand/brand-guidelines.md` | ✅ 확정 (기존) |

---

## 주요 결정 사항

### 1. MVP 기능 범위
- 캔버스 생성 & 링크 공유
- 텍스트 스티커 (CRUD, 드래그, 6색 배경)
- 이미지 업로드 (버튼/드래그앤드롭/붙여넣기, 5MB 제한)
- 실시간 동기화 (Liveblocks, Last-Write-Wins)
- 무한 캔버스 (줌 10-400%, 패닝)

### 2. 기술 스택 확정
| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js 14 (App Router) | SSR + API Route 통합, Vercel 최적화 |
| 캔버스 렌더링 | Konva.js + react-konva | Canvas 2D 성능, React 통합 |
| 실시간 | Liveblocks | CRDT 기반, React hooks 지원, 빠른 세팅 |
| DB/Storage | Supabase | Postgres + Storage + Auth 통합, 무료 티어 |
| 배포 | Vercel | Next.js 최적화, 자동 프리뷰 |
| 모니터링 | Sentry | 에러 트래킹, 성능 모니터링 |

### 3. 데이터 모델
- Canvas, Element, Session 3개 테이블
- Element는 `sticky`/`image` 타입으로 구분, `content` 필드에 JSONB 저장
- 캔버스 수명 7일 (자동 만료)

### 4. 화면 구성
- 5개 화면: 홈, 캔버스, 공유 모달, 닉네임 모달, 404
- 하단 플로팅 툴바 방식 채택 (Miro/FigJam 유사)
- 스티커 6색 배경색 프리셋

---

## 이슈 & 리스크

| # | 이슈 | 영향 | 상태 | 대응 |
|---|---|---|---|---|
| I-1 | 에이전트 서브 모델 접근 불가 | 병렬 작업 불가 | 해결 | 단일 에이전트로 순차 진행 |
| I-2 | Liveblocks 무료 티어 제한 확인 필요 | 동시 접속 제한 가능 | 모니터링 | 개발 단계에서 확인, 필요 시 PartyKit 대안 |
| I-3 | 모바일 캔버스 터치 인터랙션 | UX 복잡도 | 수용 | MVP에서는 기본 터치만 지원 |

---

## 다음 단계

→ **Phase 2: 프로젝트 세팅 & 개발** 착수
- Next.js 프로젝트 초기화
- Supabase DB 스키마 생성
- 컴포넌트 개발
- API 구현
- Liveblocks 실시간 연동
