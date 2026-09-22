# 같이배움 Vercel + Supabase 배포판

학생용과 선생님용을 서로 다른 Vercel 주소로 배포하면서 하나의 채팅을 공유하는 버전입니다.

## 들어 있는 폴더

- `student`: 학생용 사이트
- `teacher`: 선생님용 사이트
- `supabase-setup.sql`: 공용 채팅 테이블 생성 코드

## 1. Supabase 만들기

1. [Supabase](https://supabase.com/)에 로그인합니다.
2. **New project**를 눌러 무료 프로젝트를 만듭니다.
3. 왼쪽 메뉴에서 **SQL Editor**를 엽니다.
4. 이 ZIP의 `supabase-setup.sql` 내용을 전부 붙여 넣고 **Run**을 누릅니다.
5. **Project Settings → API**에서 다음 두 값을 복사합니다.
   - Project URL
   - Publishable key 또는 anon public key

비밀번호나 service role 키는 프런트엔드 환경변수에 넣지 마세요.

## 2. GitHub에 올리기

1. GitHub에서 새 저장소를 하나 만듭니다.
2. 압축을 푼 폴더의 내용 전체를 저장소에 올립니다.
3. 저장소 최상단에 `student`, `teacher`, `supabase-setup.sql`이 보이면 정상입니다.

## 3. 학생용 Vercel 배포

1. [Vercel](https://vercel.com/)에서 **Add New → Project**를 누릅니다.
2. 방금 만든 GitHub 저장소를 선택합니다.
3. 프로젝트 이름은 예를 들어 `gachi-baeum-student`로 입력합니다.
4. **Root Directory**를 `student`로 선택합니다.
5. **Environment Variables**에 다음을 추가합니다.

| 이름 | 값 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase의 Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase의 Publishable key 또는 anon public key |

6. **Deploy**를 누릅니다.
7. 배포가 끝나면 학생용 주소를 복사합니다.

## 4. 선생님용 Vercel 배포

1. Vercel에서 다시 **Add New → Project**를 누릅니다.
2. 같은 GitHub 저장소를 다시 선택합니다.
3. 프로젝트 이름은 예를 들어 `gachi-baeum-teacher`로 입력합니다.
4. **Root Directory**를 `teacher`로 선택합니다.
5. 다음 환경변수를 추가합니다.

| 이름 | 값 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 학생용과 동일한 Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 학생용과 동일한 Publishable/anon key |
| `NEXT_PUBLIC_STUDENT_SITE_URL` | 3단계에서 복사한 학생용 Vercel 주소 |

6. **Deploy**를 누릅니다.

## 5. 확인하기

1. 학생용 사이트에서 **1:1 채팅하기**를 눌러 메시지를 보냅니다.
2. 선생님용 사이트를 열면 약 1.2초 이내에 같은 메시지가 표시됩니다.
3. 선생님용에서 답장을 보내면 학생용에도 표시됩니다.
4. 학생용의 **교육봉사 → 멘토링 단톡방 목록**에서 방 카드를 누르면 방별 단체채팅을 사용할 수 있습니다.

> Vercel 설정에서 **Output Directory는 비워 두세요.** `dist`를 입력하면 배포 오류가 납니다. Framework Preset은 `Next.js`로 설정합니다.

## 로컬 실행

각 폴더 안에서 다음 명령을 실행합니다.

```bash
pnpm install
pnpm dev
```

각 폴더의 `.env.example`을 `.env.local`로 복사하고 실제 Supabase 값을 넣어야 합니다.

## 보안 참고

이 구성은 발표·과제용 데모에 맞춰 로그인 없이 채팅을 읽고 보낼 수 있게 설정했습니다.
실서비스로 운영하려면 Supabase Auth를 추가하고 RLS 정책을 사용자별로 제한해야 합니다.
