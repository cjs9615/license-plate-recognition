# BackEnd 개발

## 개발환경

- IDE : Spring Tool Suite4
- jdk 17.0.8 / SpringBoot 3.2.0 / SpringSecurity 6.2.0 / MySql 8.0.34

## 백엔드 주요 구현 기능
- 데이터베이스 설계 및 관리
- 회원가입, JWT 기반 로그인 및 사용자 인증 로직 구현
- RESTful API 설계 및 웹 서비스의 CRUD 구현
- 웹 소켓을 활용하여 이미지를 실시간으로 전송하고, 추론 결과를 반환
- AWS S3를 활용하여 이미지를 저장하고, base64로 인코딩된 이미지 파일을 디코딩하여 저장할
수 있도록 변환
- Flask 와 통신하여 추론에 필요한 데이터를 보내주고 결과값을 받을 수 있도록 구현
- OCR 추론 결과에 대응하여 필요한 경우 feature matching 을 수행하도록 요청하고, 번호를
조합하여 DB 내의 관련 차량을 검색한 리스트를 Flask 로 전송

## ERD 및 REST API 설계

### 1. ERD
<img src="https://github.com/cjs9615/Aiproject/assets/87576974/f66b05a6-81d5-45a3-8491-3a18fd46c355">

### 2. REST API

#### 회원 가입, 로그인, 메인페이지

|Method|URI|설명|
|------|---|---|
|POST|/login|로그인|
|GET|/api/techtri/check-id?id={id}|아이디 중복확인|
|POST|/login|회원가입|
|POST|/api/techtri/record/work/{carId}/{predictId}?writer={memberId}|차량 작업 등록|
|PUT|/api/techtri/record/{predictId}|추론 실패의 경우|

#### 차량 작업 기록 보기(Search)

|Method|URI|설명|
|------|---|---|
|POST|/api/techtri/record/{pageNo}|작업 기록검색|
|GET|/api/techtri/record/detail/{recordSeq}|작업 기록 상세보기|
|GET|/api/techtri/record/numbers?predictId={predictId}|작업 기록 수정 시 번호판 like 질의 다시 받아오기|
|PUT|/api/techtri/record/detail/{recordSeq}?carId={carId}|작업 기록 수정|

#### 관리자 페이지

|Method|URI|설명|
|------|---|---|
|POST|/api/techtri/record/{pageNo}|등록 차량 검색|
|POST|/api/techtri/admin/register/carr?plateNumber={carNumber}|차량 등록|
|PUT|/api/techtri/admin/car/status/{carId}|차량 상태 변경|
|GET|/api/techtri/admin/predict/{pageNo}?date=|추론 기록 조회|
|PUT|/api/techtri/admin/dashboard|대시보드 데이터|
|GET|/api/techtri/admin/dashboard/detail/predict|대시보드 상세(추론)|
|PUT|/api/techtri/admin/dashboard/detail/work|대시보드 상세(작업)|

#### Flask 통신

|Method|URI|설명|
|------|---|---|
|POST|/receive_image_url|번호판 OCR 추론|
|POST|/receive_number_list|feature matching|


## 개발과정

### 23-12-13 ~ 23-12-19
- 프로젝트 계획서 작성 
- DB 설계 및 서비스 정의

### 23-12-20 ~ 23-12-26
- 회원가입 중복 확인 기능 구현 
- AWS 관련 설정 추가 및 이미지 업로드 구현 진행
- DB 설계 및 Flask 통신 플로우 설계
- s3을 이용한 이미지 업로드 구현 

### 23-12-27
- DB관련 도메인 및 repository 추가, 수정
- 플라스크 통신 시도 및 결과 DB저장
- 모델 결과 추론된 번호를 사용한 like 질의 및 데이터 전송

### 23-12-28
- DB 설계 피드백 및 모델 정확도 계산 
- 메인 화면에서의 요구사항 추가로 인한 문제 재정의

### 23-12-29
- 차량 작업 테이블 리스트의 전체, 날짜별, 번호판별 검색 시 페이징  형식으로 반환하도록 구현

### 23-12-30
- 차량 작업 상세 조회 및 수정 기능 추가
- 메인페이지에서 추론 후 작업 차량 등록 기능 구현 
- 관리자 페이지 차량 추가, 삭제, 조회 구현

### 24-01-02
- 차량 검색 및 search 페이징 구현
- 메인페이지 이미지 업로드 → 웹 소켓 형식으로 변경하여 구현 진행

### 24-01-03
- 관리자 페이지 추론기록 조회 기능 구현(전체,날짜를 페이징 형식으로 반환)
- 대시보드용 데이터 조회 쿼리 생성 및 반환
- 메인 페이지 소켓 연결 및 기능 테스트

### 24-01-04
- 메인 페이지 소켓 구현 및 코드 정리
- 소켓 관련 서비스, 컨트롤러 구현 및 react, flask로 전송하는 코드 정리
- 데이터베이스 정리 및 ManyToOne 어노테이션 추가

### 24-01-05
- 객체 추출 crop된 이미지를 추론 결과에 추가적으로 받아 aws 저장 
- 프론트에 추론 결과 전송 시 객체 이미지 데이터 포함하도록 수정
- 메인에서 번호판 선택해서 작업 차량 기록 기능 구현

### 24-01-07
- 데이터베이스 정리 및 차량 등록 기능 구현 

### 24-01-08 ~ 24-01-09
- 네이티브 쿼리로 구현된 부분을 쿼리메소드로 변경
- 차량 활성/비활성 상태 변경 및 추론 기록 상세보기 구현
- 이미지 데이터 선별 작업 수행

### 24-01-10
- 숫자없이 글자만 온 경우, 글자가 아무것도 추출되지 않은 경우 추론 결과를 실패로 변경, SQL 질의 등의 기능 대응
- security 구현 및 필터 구현

### 24-01-11
- predictService의 predictLicensePlate 메서드 분리

### 24-01-12
- orc 추론 결과 번호가 자리수가 3자리 이하(1~3자리)인 경우 조합을 생성해서 DB에서 검색하여 리스트 생성 
- 리스트 내의 번호로 feature matching하여 번호판 추론 결과를 다시 반환받을 수 있도록 구현

### 24-01-13
- 대시보드 상세보기 그래프용 데이터 구현
