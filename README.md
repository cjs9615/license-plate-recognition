# 차량 객체 추출 기반 차량번호 인식 프로젝트

> 고철장 내 차량의 고정 주차 위치가 정해져있지 않고 기존 서비스의 빈번한 인식 오류 이슈가 발생하였다. 차량 객체 인식 및 번호판 추출 AI 모델을 설계하여 높은 정확도로 차량을 인식하고 차량 번호 기록을 자동화하여 기존의 불편함을 해결하고자 하였다. ([시연영상](https://www.youtube.com/watch?v=0vLeCDIigoE))

## 개발환경

### 개발 기간
2023.12.13 ~ 2023.01.19 (1개월)

### 프로젝트 팀 구성 및 역할

|데이터분석|프론트엔드|프론트엔드|백엔드|
|:---:|:---:|:---:|:---:|
|천동혁|박민호|김혜정|김혜진|
|[<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">](https://github.com/cjs9615)|[<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">](https://github.com/777Mino777)|[<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">](https://github.com/maejyomi)|[<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">](https://github.com/ynnij)|

### 시스템 구성


## 주요기능

1. 사용자 로그인 및 회원가입

2. 고철장에 진입한 트럭 이미지 업로드 및 객체 추출, 추출한 차량 객체의 번호판 이미지 추출

3. 번호 추출 결과를 등록된 차량번호 테이블에서 SQL like 검색결과를 통해 해당하는 내용을 웹 페이지에 테이블 형식으로 출력

4. 트럭번호, 고철장 트럭 이미지, 출입 일시 등의 데이터를 계근 시스템에 등록

5. 검색 페이지에서 차량 번호 수정

6. 관리자 페이지에서 대시보드 확인, 차량 정보, 추론 기록 확인

## 구현 결과

### 로그인, 회원가입


### 메인페이지

- 이벤트 대기


- 이벤트 감지


- 차량추출, 번호판 추출 성공


- 추출 실패


### 검색 페이지

- 차량번호 / 날짜로 검색

- 상세보기

- 수정