# 코딩 테스트 과제

이 프로젝트는 **React Router v7 (Vite)** 기반의 CRUD 게시판 및 데이터 시각화 대시보드 구현 과제입니다.

---

## 🚀 프로젝트 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## 🛠️ 사용한 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | React 18 + React Router v7 (Vite) |
| **언어** | TypeScript |
| **스타일링** | Tailwind CSS + Shadcn/UI |
| **테이블 라이브러리** | TanStack Table v8 |
| **차트 라이브러리** | Recharts |
| **HTTP 클라이언트** | Axios |
| **아이콘** | Lucide React |

---

## ✨ 주요 구현 기능 요약

### 1. 인증 (Authentication)
- **로그인 페이지** (`/auth/login`)
- 토큰 기반 인증 및 Protected Route 구현
- Axios 인터셉터를 통한 자동 토큰 주입

### 2. 게시판 (Board Feature)
- **CRUD 기능**: 게시글 목록, 상세, 작성, 수정, 삭제
- **TanStack Table 활용**:
  - 컬럼 리사이즈 (드래그로 너비 조절)
  - 컬럼 보이기/숨기기 토글
  - 정렬 (제목, 날짜 순)
- **검색 및 필터링**: 제목/본문 검색, 카테고리 필터
- **무한 스크롤**: Intersection Observer 기반 페이지네이션
- **금지어 검증**: 특정 단어 입력 시 등록/수정 차단

### 3. 데이터 시각화 (Dashboard)
- **탭 구조**로 Task 1 / Task 2 / Task 3 분리
- **Task 1**: 주간 기분 추세 (Stacked Bar), 간식 브랜드 점유율 (Donut)
- **Task 2**: 기분 및 운동 추세 비교 (Stacked Area)
- **Task 3**: 커피 소비/스낵 영향 분석 (Dual Axis Multi-Line Chart)
  - 팀별 다중 라인
  - 좌측/우측 Y축 분리
  - Circle vs Square 구분 포인트
  - 커스텀 툴팁
- **공통 기능**:
  - 범례 클릭으로 데이터 Show/Hide
  - 도넛 차트는 숨긴 아이템이 회색으로 표시되어 복구 가능

---

## 📁 프로젝트 구조

```
src/
├── components/         # 공통 UI 컴포넌트 (Shadcn/UI 기반)
├── features/
│   ├── auth/           # 로그인 및 인증 관련
│   ├── board/          # 게시판 CRUD
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   └── dashboard/      # 데이터 시각화
│       ├── api/
│       ├── components/
│       └── pages/
├── lib/                # Axios 설정, 유틸리티
└── App.tsx             # 라우팅 설정
```

---

## 📝 참고 사항

- Mock 데이터와 실제 API 호출 간 전환: 각 API 파일 내 `USE_MOCK` 플래그로 조절
- 본 프로젝트는 과제 목적으로 작성되었습니다.
