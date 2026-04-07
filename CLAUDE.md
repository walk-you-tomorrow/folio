# Folio — 프로젝트 규칙

## 프로젝트 개요
Folio는 회원가입 없이 링크 하나로 입장하여, 무한 캔버스 위에 텍스트·그림·사진을 자유롭게 올리고 실시간으로 함께 보는 즉석 협업 메모장이다.

**핵심 컨셉:** 모든 사람들의 생각이 하나의 캔버스로 무한하게 확장해 나간다.

## 브랜드 규칙 (필수 준수)
- 브랜드 가이드라인: `docs/brand/brand-guidelines.md` 참조
- 모든 산출물은 브랜드 가이드라인에 맞춰 작성한다
- UI 텍스트는 해요체, 가볍고 솔직하게. 과장 수식어 금지
- 에러 메시지에 개발자 코드 노출 금지. 브랜드 마이크로카피로 대체
- 컬러는 팔레트 내 색상만 사용 (Primary: `#3B6FFF`)

## 프로젝트 구조
```
folio/
├── CLAUDE.md              ← 이 파일 (프로젝트 규칙)
├── docs/
│   ├── brand/             ← 브랜드 가이드라인
│   ├── planning/          ← 기획 문서 (PRD, 플로우)
│   ├── design/            ← 디자인 명세, 화면 정의서
│   ├── api/               ← API 명세서
│   └── history/           ← 의사결정 히스토리
├── src/
│   ├── frontend/          ← 프론트엔드 소스코드
│   └── backend/           ← 백엔드 소스코드
└── tests/                 ← 테스트 코드
```

## 에이전트 팀 구성
| 역할 | 에이전트 | 우선순위 |
|---|---|---|
| PM | `pm` | 전체 총괄, 태스크 분배 |
| 브랜드 매니저 | `brand-manager` | 브랜드 선행, 모든 팀에 가이드 제공 |
| 디자이너 | `designer` | 브랜드 기반 UX/UI 설계 |
| 개발자 | `developer` | 아키텍처 + 프론트/백엔드 구현 |
| QA | `qa` | 테스트 설계, 품질 검증 |
| 마케터 | `marketer` | 론치 전략, 카피 |
| DevOps | `devops` | 배포, 인프라, 모니터링 |
| CS | `cs` | 온보딩, FAQ, 피드백 수집 |

**작업 순서 원칙:** 브랜드 매니저 → 디자이너/기획 → 개발 → QA → 배포

## 기술 스택 (권고, 확정 전)
- Framework: Next.js 14 (App Router)
- Canvas: Konva.js + react-konva
- Realtime: Liveblocks
- DB/Storage: Supabase
- Deploy: Vercel
- Monitoring: Sentry
- Analytics: PostHog

## 코드 컨벤션
- 폰트: Pretendard (한국어), Inter (영문)
- 컬러: CSS Custom Properties로 관리
- 성능 목표: 캔버스 첫 렌더 3초 이내, 실시간 동기화 500ms 이내
- 접근성: aria-label, 키보드 네비게이션 필수
- font-display: swap 적용

## 문서 관리
- 의사결정 히스토리: `docs/history/decisions.md`에 기록
- 새로운 결정 사항은 날짜와 함께 히스토리에 추가
- 브랜드 관련 변경은 반드시 `brand-guidelines.md` 동기화
