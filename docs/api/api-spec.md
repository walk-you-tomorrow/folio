# Folio — API 명세서 v1.0

> 작성일: 2026-04-07
> Base URL: `https://folio.app/api`

---

## 인증

MVP에서는 인증 없음. 모든 API는 공개 접근 가능.
Rate Limiting으로 악용 방지.

| 제한 | 값 |
|---|---|
| 캔버스 생성 | IP당 10개/시간 |
| 이미지 업로드 | IP당 50개/시간 |
| API 전체 | IP당 100req/분 |

---

## 1. 캔버스

### POST /api/canvas
캔버스 생성

**Request:**
```json
// body 없음 (서버에서 자동 생성)
```

**Response: 201 Created**
```json
{
  "id": "a8k3m2x1",
  "title": "제목 없는 캔버스",
  "created_at": "2026-04-07T09:00:00Z",
  "expires_at": "2026-04-14T09:00:00Z",
  "share_url": "https://folio.app/a8k3m2x1"
}
```

**에러:**
| 상태 | 메시지 |
|---|---|
| 429 | "잠깐 쉬어가요. 조금 뒤에 다시 만들어보세요." |

---

### GET /api/canvas/:id
캔버스 정보 + 전체 엘리먼트 조회

**Response: 200 OK**
```json
{
  "id": "a8k3m2x1",
  "title": "제목 없는 캔버스",
  "created_at": "2026-04-07T09:00:00Z",
  "expires_at": "2026-04-14T09:00:00Z"
}
```

**에러:**
| 상태 | 메시지 |
|---|---|
| 404 | "이 캔버스를 찾을 수 없어요. 링크가 맞는지 확인해보세요." |
| 410 | "이 캔버스는 기간이 만료되어 사라졌어요." |

---

### PATCH /api/canvas/:id
캔버스 제목 수정

**Request:**
```json
{
  "title": "팀 브레인스토밍"
}
```

**Response: 200 OK**
```json
{
  "id": "a8k3m2x1",
  "title": "팀 브레인스토밍",
  "updated_at": "2026-04-07T09:05:00Z"
}
```

---

## 2. 엘리먼트 (Liveblocks 전용)

> **⚠️ 엘리먼트 CRUD는 REST API가 아닌 Liveblocks Storage를 통해 처리합니다.**
> Liveblocks가 실시간 엘리먼트의 Single Source of Truth입니다.
> 아래는 Liveblocks Storage를 통한 조작 명세입니다.

### 엘리먼트 생성
- Liveblocks `LiveMap.set(id, LiveObject)` 호출
- 다른 참가자에게 자동 브로드캐스트

### 엘리먼트 수정
- Liveblocks `LiveObject.update({...})` 호출
- 위치 이동, 텍스트 수정, 리사이즈, 색상 변경 모두 동일 방식
- Optimistic update: 로컬 즉시 반영 → 서버 확인

### 엘리먼트 삭제
- Liveblocks `LiveMap.delete(id)` 호출

### 검증 (클라이언트 사이드)
| 필드 | 규칙 |
|---|---|
| type | `sticky` 또는 `image` |
| content.text | 최대 500자 |
| content.color | 허용된 6가지 HEX 값 |
| position_x, position_y | 숫자 |

---

## 3. 이미지 업로드

### POST /api/upload
이미지 업로드 (→ Supabase Storage)

**Request:** `multipart/form-data`
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| file | File | O | 이미지 파일 |
| canvas_id | string | O | 캔버스 ID |

**Response: 201 Created**
```json
{
  "url": "https://storage.folio.app/uploads/abc123.jpg",
  "original_name": "photo.jpg",
  "size": 1024000,
  "width": 1200,
  "height": 800
}
```

**검증:**
| 항목 | 규칙 |
|---|---|
| 파일 크기 | 최대 5MB |
| 파일 타입 | image/jpeg, image/png, image/gif, image/webp |
| 파일 내용 | magic bytes 검증 (서버) |

**에러:**
| 상태 | 메시지 |
|---|---|
| 400 | "이 파일은 올릴 수 없어요. JPG, PNG, GIF, WebP만 가능해요." |
| 413 | "파일이 너무 커요. 5MB 이하로 올려주세요." |
| 429 | "잠깐 쉬어가요. 조금 뒤에 다시 올려보세요." |

---

## 4. 실시간 동기화 (Liveblocks)

Liveblocks를 통한 실시간 동기화. REST API가 아닌 WebSocket 기반.

### Room 구조
```typescript
// Liveblocks Storage 타입
type Storage = {
  elements: LiveMap<string, LiveObject<Element>>
}

type Element = {
  id: string
  type: 'sticky' | 'image'
  position_x: number
  position_y: number
  width: number
  height: number
  content: {
    text?: string
    color?: string
    url?: string
    original_name?: string
  }
  z_index: number
  created_by: string
}

// Presence 타입
type Presence = {
  cursor: { x: number, y: number } | null
  nickname: string
  color: string
}
```

### 이벤트 흐름
```
사용자 A: 스티커 이동
  → Liveblocks Storage 업데이트
  → 서버에서 다른 참가자에게 브로드캐스트
  → 사용자 B: UI 자동 반영 (optimistic update)
```

### POST /api/liveblocks-auth
Liveblocks 인증 토큰 발급

**Request:**
```json
{
  "room": "canvas-a8k3m2x1"
}
```

**Response: 200 OK**
```json
{
  "token": "eyJ..."
}
```

---

## 5. 캔버스 만료 정리 (Cron)

### 정리 대상
- `expires_at`이 지난 Canvas 레코드
- 해당 캔버스의 Supabase Storage 이미지 파일
- 해당 캔버스의 Liveblocks Room

### 실행 주기
- 매일 00:00 UTC (Vercel Cron 또는 Supabase pg_cron)

### 정리 프로세스
```
1. DB에서 expires_at < now() 인 캔버스 목록 조회
2. 각 캔버스에 대해:
   a. Supabase Storage: /uploads/{canvas_id}/* 삭제
   b. Liveblocks API: DELETE room (canvas-{id})
   c. DB: Canvas 레코드 삭제 (CASCADE로 Session도 삭제)
3. 정리 결과 로그 기록
```

---

## 6. 공통 에러 응답 형식

```json
{
  "error": {
    "code": "CANVAS_NOT_FOUND",
    "message": "이 캔버스를 찾을 수 없어요. 링크가 맞는지 확인해보세요."
  }
}
```

에러 메시지는 브랜드 톤앤매너(해요체, 솔직, 담담)를 따른다.
개발자 코드(stack trace, 내부 에러 코드)는 사용자에게 절대 노출하지 않는다.
