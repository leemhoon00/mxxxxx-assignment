## 과제 설명

1. 환자 데이터가 저장된 xlsx 파일을 업로드 하여 데이터베이스에 저장하는 POST /patients API
2. 저장된 환자 데이터들을 페이지네이션 기반으로 조회하는 GET /patients API

- 실행시간: 2.5초
- 엑셀파일의 row 수: 50900
- 실제 저장된 데이터 수: 49584

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

<br />

## 데이터베이스 스키마 설명

![image](https://github.com/user-attachments/assets/b269a34b-df99-4a7d-84ae-74d68853d5b1)

- `chartNumber`를 nullable로 설정할 시 Unique 제약조건 검사에 차질이 생기기때문에 어플리케이션 레벨에서 default: 0을 설정하여 저장하고 있습니다.
- 데이터 성격에 따라 다르게 설정해야 하지만 샘플 엑셀파일만으로 판단했을 때 카디널리티가 높은 순서(전화번호, 차트번호, 이름)대로 Unique 컬럼을 설정했습니다.


## 성능최적화

#### 1. 데이터 전처리
- 엑셀파일의 모든 row에 대해서 특수처리 과정이 필요하기때문에 최소 한 번의 반복문은 필수사항입니다. 시간복잡도로는 O(n) 입니다.
- 전처리 작업이 완료된 데이터들 중 chartNumber가 없는 데이터들은 [이름_전화번호] 를 key로 가지는 딕셔너리 자료구조에 저장합니다.
- 전처리 작업이 완료된 데이터들 중 chartNumber가 있는 데이터들은 [이름_전화번호_차트번호] 를 key로 가지는 딕셔너리 자료구조에 저장합니다.
- 딕셔너리 자료구조로 javascript의 객체 타입을 사용하였으며 시간복잡도 O(1)의 성능을 가지고 있습니다.
- [이름_전화번호] 데이터가 먼저 있는 상태에서 [이름_전화번호_차트번호] 데이터가 들어온다면 기존 데이터를 지우는 작업과 덮어쓰기 작업을 메모리레벨에서 사전 수행하여 데이터베이스로 가게 되는 데이터의 양을 최대한 줄이고 있습니다.

  ![image](https://github.com/user-attachments/assets/1daa331e-ffd6-4d65-bc5c-aebc0180215f)

  ![image](https://github.com/user-attachments/assets/2846b0ba-dd85-479b-ac81-41bf490a0501)

#### 2. 데이터 저장
- 데이터 저장은 총 3번의 쿼리로 진행이 됩니다.
  - [이름_전화번호_차트번호] 데이터의 `upsertMany`
  - 위 데이터들에 대해서 [이름_전화번호] 데이터의 `deleteMany`
  - [이름_전화번호] 데이터의 `upsertMany`
 
- [이름_전화번호_차트번호] 데이터를 upsert 한 후에, 해당 [이름_전화번호]와 동일하면서 차트번호가 없는 데이터를 찾아 하나하나 삭제하기엔 N+1문제가 발생합니다.
- 이를 해결하기 위해 [이름_전화번호_차트번호] 형식의 데이터를 저장할땐 현재 저장되어 있는 데이터의 유무엔 관계없이 [이름_전화번호]를 가지며 차트번호가 없는 데이터들을 전부 삭제처리합니다.

#### 3. 페이지네이션
- 페이지네이션 api는 구조적으로 성능최적화가 불가능합니다.
- UI 상으로 페이지네이션이 아니라 무한스크롤 방식의 구현이 가능하다면, 그리고 정렬기준 또한 주어져 있다면 cursor 기반 무한스크롤 api를 통해 성능최적화를 할 수 있습니다.
