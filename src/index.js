let tryNum = [4, 5, 6]; // 시도 숫자 테스트 케이스
const answer = [6, 6, 3]; // 실제 정답
const tryNumSize = tryNum.length;

// 시도 횟수 한번 판단 함수
function oneGame() {
  const strike = howManyStrike();
  const ball = howManyBall();
  if (strike === 3) { // 스트라이크가 3이면 즈어어엉답!!
    console.log("즈어어엉답!!");
  } else { // 정답이 아니면 strike 와 ball 횟수 출력
    console.log(strike + " strike");
    console.log(ball + " ball");
  }
  if (strike === 0 && ball === 0) {
    // strike 와 ball 이 모두 0이라면 아우우웃ㅅ@!@
    console.log("아우우웃~!@");
  }
}

// 스트라이크 몇개인지 판별 함수
function howManyStrike() {
  let strike = 0;
  for (let i = 0; i < tryNumSize; i++) {
    if (tryNum[i] === answer[i]) { // 첫번째 자리, 두번째 자리, 세번째 자리 차례차례 비교해서 같을때마다 strike 1씩 증가.
      strike++;
      tryNum[i] = NaN; // ball 판별시 중복을 막기 위해 자리를 NaN으로 바꿔줌.
    }
  }
  return strike;
}

// strike 로 걸러지지 못한 숫자들 중 볼이 몇 개인지 판별한다
function howManyBall() {
  let ball = 0;
  for (let i = 0; i < tryNumSize; i++) {
    for (let j = 0; j < tryNumSize; j++) {
      if (tryNum[i] === answer[j]) { // 시도숫자의 첫번째 자리가 정답 숫자 세자리 중 일치하는게 있는지 확인. 그 다음 시도 숫자 두번째 자리 확인. 세번째 자리 확인.
        ball++;
        break; // 볼이 중복으로 세어지는 것 방지를 위한 break.
      }
    }
  }
  return ball;
}

oneGame();
