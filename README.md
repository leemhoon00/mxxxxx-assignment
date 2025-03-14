## 과제 설명

1. 환자 데이터가 저장된 xlsx 파일을 업로드 하여 데이터베이스에 저장하는 POST /patients API
2. 저장된 환자 데이터들을 페이지네이션 기반으로 조회하는 GET /patients API

<br />

## 설치 및 실행 방법

#### 1. 해당 레포지토리를 Clone 합니다.
```bash
git clone https://github.com/leemhoon00/mxxxxx-assignment.git

cd mxxxxx-assignment
```

#### 2. docker-compose를 실행합니다. (샘플 `.env`가 레포에 포함되어 있어 문제없이 바로 실행가능합니다)

```bash
docker compose up --build -d
```

http://localhost:3000/api 로 이동하여 Swagger UI에서 api를 실행시킵니다.

docker-compose를 종료하려면 다음 명령어를 입력합니다.
```bash
docker compose down
```

#### 3. 데이터베이스 스키마 설명

![image](https://github.com/user-attachments/assets/2f2ae2d1-a7ba-4681-9de4-8ca1b1053cb4)

- `chartNumber`를 nullable로 설정할 시 Unique 제약조건 검사에 차질이 생기기때문에 어플리케이션 레벨에서 default: 0을 설정하여 저장하고 있습니다.
