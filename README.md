![header](https://capsule-render.vercel.app/api?type=wave&color=auto&height=300&section=header&text=GWI_HomeSchool&fontSize=90)

<img width="1536" height="1024" alt="22bc1f1e-431e-484d-b303-f8a4718eb1de" src="https://github.com/user-attachments/assets/8aaebe53-f550-4dd5-9023-681bd5f161f7" />


홈스쿨 프로그램 1.0

## 1. 프로젝트 소개

1. 프로젝트 소개

홈스쿨 프로그램은 실시간 채팅과 1:1 화상 수업 기능을 제공하는 웹 서비스입니다.
누구나 지식을 공유하고 배울 수 있는 환경을 목표로 하여,
Spring Boot 기반의 REST API와 React + TypeScript 기반 SPA 구조로 개발되었습니다.

사용자는 회원 가입 후 로그인하여
1:1 화상 통신과 실시간 채팅 기능을 통해
선생님 또는 학생의 역할로 자유롭게 소통할 수 있습니다.

## 2. 기획 배경 & 목표

최근에는 나이, 성별, 직업과 상관없이
누구나 지식을 가르칠 수 있고, 또 배울 수 있는 환경이 중요해지고 있다고 생각했습니다.

하지만 여전히 배움의 기회에 접근하지 못하는 사람들이 존재하며,
이를 조금이나마 해소할 수 있는 지식 공유 플랫폼을 만들고자 본 프로젝트를 기획하게 되었습니다.

기획 목표

- 누구나 선생님이 될 수 있고, 누구나 학생이 될 수 있는 환경 제공
- 실시간 소통(화상·채팅)을 통한 몰입도 높은 학습 경험
- 사용자 의견을 반영하여 함께 성장하는 서비스 구조 설계

본 프로젝트는 이러한 목표를 바탕으로
지식을 나구고 배우는 선순환 구조를 만드는 것을 지향합니다.

## 3. 주요 기능

홈스쿨 프로그램은 1.0 버전으로,
핵심 기능 위주의 컴팩트한 구조로 설계되었습니다.

주요 기능 목록

- 회원가입 / 로그인
  : 서비스 이용을 위한 사용자 인증 기능
- 1:1 화상 통신
  : 선생님과 학생 간 실시간 화상 수업 지원
- 실시간 채팅
  : 수업 중 또는 별도의 소통을 위한 채팅 기능
- 건의 및 버그 신고 게시판
  : 사용자들이 원하는 기능이나 개선 사항을 자유롭게 제안
  : 서비스 개선을 위한 소통 창구 역할

사용자는 상황에 따라
선생님 또는 학생의 역할을 자유롭게 선택할 수 있으며,
서비스 개선에 직접 참여할 수 있는 구조를 갖추고 있습니다.

## 4. 기술 스택

본 프로젝트는 프론트엔드와 백엔드를 분리한 구조로 개발되었으며,
각 기술의 장점을 최대한 활용할 수 있도록 설계하였습니다.

Frontend

[![My Skills](https://skillicons.dev/icons?i=react,ts,redux,vite&theme=light)](https://skillicons.dev)

- React
  : 컴포넌트 기반 UI 설계

- TypeScript
  : 정적 타입을 통한 안정적인 코드 작성

- Redux Toolkit
  : 전역 상태 관리
  : 로그인 상태, 사용자 정보, 화상/채팅 관련 상태 관리

- Vite
  : 빠른 개발 환경 및 빌드 속도

- CSS Module
  : 컴포넌트 단위 스타일 관리

Backend (Main API Server)

[![My Skills](https://skillicons.dev/icons?i=java,spring&theme=light)](https://skillicons.dev)

- Java 17
  : LTS 기반 안정적인 개발 환경

- Spring Boot
  : REST API 서버

- Spring Security
  : JWT 기반 인증 및 인가 처리

- JPA (Hibernate)
  : ORM 기반 데이터 관리

Realtime Server

[![My Skills](https://skillicons.dev/icons?i=nodejs&theme=light)](https://skillicons.dev)

- Node.js
  : WebSocket 전용 서버

- WebSocket (Socket.IO)
  : 실시간 채팅 기능 처리

Communication

- WebRTC
  : 1:1 화상 통신 기능 구현 (클라이언트 간 P2P)

Database

- PostgreSQL
  : 관계형 데이터베이스, 사용자, 채팅, 게시판 데이터 관리

Infra / Deployment

- Heroku
  : Spring Boot API 서버 배포

- Vercel
  : React 프론트엔드 배포 , Node.js WebSocket Server 배포 (별도 서버로 운영)

## 5. 시스템 아키텍처

홈스쿨 프로그램은 API 서버와 실시간 통신 서버를 분리한 구조를 기반으로 하여,
확장성과 역할 분리를 고려한 아키텍처로 설계되었습니다.

아키텍처 설명

- Spring Boot API 서버
  : 회원가입, 로그인, 게시판 등 주요 비즈니스 로직 처리
  : JWT 기반 인증 및 인가 담당

- Node.js WebSocket 서버
  : 실시간 채팅 전용 서버
  : API 서버와 역할 분리로 성능 및 확장성 고려

- Redux Toolkit
  : 로그인 상태 및 사용자 정보 전역 관리
  : 화상 및 채팅 관련 상태 공유

- WebRTC
  : 클라이언트간 1:1 화상 통신 (P2P)

- PostgreSQL
  : 서비스 전반의 데이터 영속화

## 6. ERD / DB 구조

홈스쿨 프로그램은 사용자 중심의 서비스 구조를 기반으로
회원(Member)과 문의/건의(Contact) 간의 관계를 중심으로 데이터베이스를 설계하였습니다.

주요 엔티티

Contact (문의 / 건의 게시글)
사용자가 서비스에 대해

- 기능 건의

- 버그 신고

- 문의 사항

등을 등록할 수 있는 게시글 엔티티입니다.

| 컬럼명     | 타입        | 설명           |
| ---------- | ----------- | -------------- |
| CONTACT_ID | BIGINT (PK) | 게시글 고유 ID |
| TITLE      | VARCHAR     | 게시글 제목    |
| CONTENT    | TEXT        | 게시글 내용    |
| READ_COUNT | INTEGER     | 조회 수        |
| CREATED_AT | TIMESTAMP   | 생성 일시      |
| UPDATED_AT | TIMESTAMP   | 수정 일시      |
| MEMBER_ID  | BIGINT (FK) | 작성자 회원 ID |

Member (회원 게시글)

- LOCAL / 소셜 로그인 확장을 고려한 구조입니다.
- PROVIDER 필드를 통해 로그인 방식을 구분했습니다.
- TEMP_PASSWORD, 최초 로그인 또는 비밀번호 재설정 시 강제 변경 처리에 활용됩니다.

| 컬럼명        | 타입        | 설명                                       |
| ------------- | ----------- | ------------------------------------------ |
| MEMBER_ID     | BIGINT (PK) | 회원 고유 ID                               |
| NAME          | VARCHAR     | 사용자 이름                                |
| NICK_NAME     | VARCHAR     | 닉네임                                     |
| USER_ID       | VARCHAR     | 로그인 아이디                              |
| PASSWORD      | VARCHAR     | 비밀번호                                   |
| ADDRESS       | VARCHAR     | 주소                                       |
| EMAIL         | VARCHAR     | 이메일                                     |
| TEMP_PASSWORD | BOOLEAN     | 임시 비밀번호 여부                         |
| PROVIDER_ID   | BIGINT      | 소셜 로그인 제공자 ID                      |
| PROVIDER      | ENUM        | 로그인 타입 (LOCAL, KAKAO, GIT, GOOGLE 등) |

엔티티 관계

- Member:Contact = 1:N
- 한 명의 회원은 여러 개의 문의글을 작성 할 수 있습니다.
- Contact는 반드시 하나의 Member에 소속됩니다.

## 7. 핵심 구현 내용

홈스쿨 프로그램은 단순 기능 구현이 아닌,
인증, 실시간 통신·확장성을 고려한 구조로 핵심 기능들을 구현하였습니다.

JWT 기반 인증 / 인가

구현 배경

- 프론트엔드와 백엔드를 분리한 SPA 구조에서
  세션 방식보다 확장성과 유연성이 높은 JWT 방식을 채택했습니다.

구현 내용

- 로그인 성공 시 JWT 토큰 발급

- 이후 모든 API 요청은 Authorization Header를 통해 인증을 합니다.

- Spring Security Filter에서 토큰을 검증합니다.

특징

- 서버 상태를 저장하지 않는 Stateless 인증

- 토큰 만료 기반 보안 강화

- Redux를 통해 로그인 상태 전역 관리

소셜 로그인 구조 (확장 고려)

구현 배경

- 일반 로그인뿐만 아니라
  소셜 로그인 확장을 고려한 사용자 구조 설계

구현 내용

- Provider Enum을 통한 로그인 방싱을 구분합니다. (LOCAL, KAKAO, NAVER 등)

- 소셜 로그인 사용자 식별을 위한 providerId 필드 분리

- 기존 회원 테이블 구조 변경 없이 로그인 방식 확장이 가능합니다.

WebSocket 기반 실시간 채팅 (Node.js 서버)

구현 배경

- 실시간 채팅은 잦은 연결과 메시지 송수신이 발생

- 비동기 처리에 강한 Node.js를 사용해 Spring Boot API 서버와 역할 분리

구현 내용

- Node.js 기반 WebSocket 전용 서버 구축

- 채팅 메시지는 WebSocket을 통해 실시간 송수신

- 인증은 API 서버에서 발급된 JWT 기반으로 처리

WebRTC 기반 1:1 화상 통신

구현 배경

- 지연 시간이 낮은 실시간 화상 수업 환경 제공 필요

- 서버 부하를 최소화하기 위해 P2P 통신 방식 채택

구현 내용

- WebRTC를 이용한 클라이언트 간 1:1 화상 연결

- 시그널링 과정은 별도 통신을 통해 처리

- 미디어 스트림은 클라이언트 간 직접 송수신

Redux를 활용한 전역 상태 관리

관리 대상 상태

- 로그인 여부

- 사용자 정보

- 화상 수업 및 채팅 관련 상태

도입 이유

- 여러 컴포넌트에서 공통으로 사용하는 상태 증가

- 인증 상태와 실시간 기능 상태의 일관성 유지

## 8. 트러블 슈팅 (프로젝트 과정에서 비슷했던 오류 압축)

문제 상황

WebRTC 화상 통신 연결 불안정 문제

- 특정 네트워크 환경에서 화상 통화 연결 실패

- 로컬 환경에서는 정상이나 외부 네트워크에서 연결 지연 또는 실패

원인 분석

- NAT 환경에서 P2P 연결이 원활하지 않음

- ICE Candidate 교환 과정이 완전하지 않음

- 시그널링 과정에서 연결 정보 전달 누락
  (비디오 신호 주고받는 통신 타이밍이 자꾸 엇나감)

해결 방법

- ICE Candidate 교환 로직 보안

- 시그널링 단계에서 연결 정보 전달 순서 개선

(

1.  방 입장

2.  Host 결정

3.  Host 준비 완료

4.  Offer 생성 & 전송

5.  Answer 생성 & 전송

6.  ICE Candidate 교환

7.  P2P 연결 완료

)

결과 / 베운 점

- WebRTC는 단순한 API 사용이 아니라, 네트워크 환경을 고려한 설계가 필요함을 체감했습니다.

- P2P 통신 구조에 대한 이해도가 향상되었습니다.

## 8. 트러블 슈팅 (2)

문제 상황

- 로그인 기능 및 JWT 인증을 추가한 이후 첫 연결은 성공하지만 페이지 이동 후 돌아왔을때
  닉네임은 정상적으로 전달되지만 화상 채팅 영상이 출력되지 않는 문제 발생

- 이전까지 정상 작동하는 WebRTC 기반 화상 채팅이 로그인 / 비밀번호 변경 페이지 추가 이후 갑자기
  동작하지 않음

- 브라우저 콘솔에는 명확한 WebRTC 에러 없이 연결이 이루어지지 않는 상태

원인 분석

- Socket.io 객체가 렌더링마다 새로 생성됨

- 불필요한 시점에 WebRTC 초기화 로직이 실행되며 내부 상태가 꼬이는 현상 발생

- 특히 로그인 -> 비밀번호 변경 -> 채팅 이동 흐름에서 문제 심화

- SPA 이동 시 WebRTC 연결 재개 로직 불안정

- 방 입장 이벤트는 정상적으로 처리됨, 닉네임 방 정보 등은 전달되지만, 실제 startConnection()
  호출이 누락되거나 타이밍이 어긋남

- 결과적으로 스트림 연결이 시작되지 않음

해결 방법

- webSocket 객체를 로그인 이후에 단 한번만 생성

- 로그인 상태(isLoggedIn)을 기준으로 socket 생성 여부를 제어

- 이미 socket이 존재할 경우 재생성하지 않도록 제한

- App 가장 최상단에 WebRTCProvider 객체를 두어 SPA 구조에서 컴포넌트가 초기화 되더라도
  WebRTCProvider가 초기화 되지 않도록 리펙토링

- 방 입장 성공 시 startConnection() 이 항상 호출되도록 구조 정리

- SPA 재접속 시에도 기존 방 정보 기반으로 재연결 가능하도록 설계

결과 / 배운 점

- 이번 문제를 통해 Socket은 SPA에서 생명주기를 명확히 관리해야 한다고 생각했습니다.
- 인증 흐름과 실시간 통신 로직은 분리해야 한다는 것을 알았습니다.

## 8. 트러블 슈팅 (3)

문제 상황

- WebRTC DataChannel을 이용해 호스트- 방문객 간 채팅 기능이 안되는 문제

(방문객이 보낸 메시지가 호스트 화면에 표시가 X)
(DataChannel이 연결되었는데도 메시지 전송이 X)
(역할에 따라 메시지 발신,수신 로직이 헷갈림)

원인 분석

- 처음에는 호스트만 DataChannel을 저장하면 충분하다고 생각했음

- 하지만 WebRTC에는 DataChannel을 생성한 쪽과 수신한 쪽이 서로 다름

- 방문객도 DataChannel을 받아 저장해야 스택이 쌓여 통신이 된다는 사실을 깨닳음

- onmessage에서 메시지를 받을 때 누가 보낸 메시지인지 기준이 불명확하다. (Host, Guest, You)
  가 뒤섞임

해결 방법

- DataChannel을 양쪽 모두에서 저장

- 호스트가 DataChnnel 생성 시 저장, 방문객은 ondatachannel 이벤트로 받은 채널을 반드시 저장

- 메시지를 보내는 주체는 항상 자기 DataChannel을 사용해야 함

- 메시지 처리 기준을 수신자 기준으로 통일
  (onmessage : 상대방이 보낸 메시지, sendMessage는 항상 내가 보낸 메시지)

- useEffect 의존성 명확히 관리

- peerConnection을 참조하는 socket 이벤트는 useEffect 의존성 배열에 peerConnection 포함
  이를 통해 Answer 처리 시점에 하상 최신 PeerConnection 사용하도록 보장

## 8. 트러블 슈팅 (4)

문제 상황

CORS 오류 (배포 환경)

- 로컬 환경에서는 정상 동작

- 배포 후 프론트엔드(Vercel)에서 API 호출 시 CORS 에러 발생

원인 분석

- 프론트엔드와 백엔드의 도메인이 서로 다름
- Spring Security CORS 설정이 배포 환경에 맞게 구성되지 않음

해결 방법

- Spring Security에 CORS 설정 추가

- 허용 Origin을 명시적으로 설정

- 인증 헤더(Authorization) 허용 처리

결과 / 베운 점

- 배포 환경에서는 로컬과 다른 보안 설정이 필요함을 인식했습니다.

- CORS와 인증 설정의 연관성 이해할 수 있었습니다.

## 8. 트러블 슈팅 (보안 정리) (5)

문제상황

- JWT 인증 과정에서 비밀번호가 없는 문제

- Authentication 객체 생성 시
  password가 빈 문자열인데도 인증이 되는 것처럼 보여 혼란 발생

원인 분석

- JWT 인증은 로그인 이후 인증 방식
  비밀번호 검증은 로그인 시 이미 끝났고 JWT 인증 단계에서는 토큰만 신뢰함

해결방법

로그인 시에만 ID/PW 검증
이후 요청에서는 JWT 유효성만 검사

결과

서버 부하 감소
세션 없이도 인증 상태 유지 가능

문제상황

- 토큰이 어디서 발급되는지 헷갈린 문제

- JwtFilter나 TokenProvider가 토큰을 발급하는 것으로 오해함

원인 분석

- JWT 발급과 검증의 역할이 분리되어 있음

  발급: 로그인 성공 시

  검증: 요청마다 필터에서 수행

해결방법

로그인 컨트롤러에서만 토큰 발급

JwtFilter는 검증 전용으로 사용

결과

역할 분리가 명확해지고
보안 구조 이해도가 향상됨
