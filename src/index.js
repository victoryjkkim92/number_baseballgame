// 시도 버튼에 클릭 이벤트가 일어났을 때
const tryButton = document.querySelector(".input-box-try");
const inputBox1 = document.querySelector('.input-box-digit-1');
const inputBox2 = document.querySelector('.input-box-digit-2');
const inputBox3 = document.querySelector('.input-box-digit-3');
const inputBoxes = document.querySelector(".input-boxes");
const inputBoxDigit1 = document.querySelector(".input-box-digit-1");
const inputBoxDigit2 = document.querySelector(".input-box-digit-2");
const inputBoxDigit3 = document.querySelector(".input-box-digit-3");
let roundNum = 1;
let tryNum = []; // 시도 숫자 테스트 케이스
const answer = ["1", "2", "3"]; // 실제 정답
const tryNumSize = answer.length;
let result = "";
// 시도 버튼 눌렀을 때
tryButton.addEventListener("click", e => {
  // div 생성 후 'turn-list'에 붙여준다
  const TurnListEl = document.querySelector(".turn-list");
  const TurnListItemEl = document.createElement("li");
  TurnListEl.appendChild(TurnListItemEl);
  TurnListItemEl.textContent = inputBox1.value + inputBox2.value + inputBox3.value;
  tryNum = [];
  const round = document.createElement("span");
  const turnListEl = document.querySelector(".turn-list");
  // cloneNode에서 해당 node의 children 까지 복제하려면 true, 해당 node 만 복제하려면 false
  const turnListItemEl = inputBoxes.cloneNode(true);
  tryNum.push(inputBoxDigit1.value);
  tryNum.push(inputBoxDigit2.value);
  tryNum.push(inputBoxDigit3.value);
  oneGame();
  const resultField = document.createElement("span");
  resultField.textContent = result;
  // 리스트에 복제되서 추가되는 input box들 수정 막는 코드
  for (let i = 0; i < turnListItemEl.children.length; i++) {
    turnListItemEl.children[i].setAttribute("readonly", "");
  }
  round.textContent = roundNum++ + "회";
  turnListItemEl.prepend(round);
  turnListItemEl.appendChild(resultField)
  turnListEl.appendChild(turnListItemEl);
  inputBoxDigit1.value = "";
  inputBoxDigit2.value = "";
  inputBoxDigit3.value = "";
  inputBoxDigit1.focus();
  console.log('result' + result);
  e.preventDefault();
});
// 자동 포커스 이동
inputBoxes.childNodes.forEach(el => {
  el.addEventListener("input", e => {
    if (el.nextElementSibling) {
      el.nextElementSibling.focus();
    } else {
      el.parentElement.nextElementSibling.focus();
    }
  });
});
// 한번 더 버튼에 클릭 이벤트가 일어났을 때
// const resetButton = document.querySelector(".input-box-reset");
// resetButton.addEventListener("click", e => {});
let tryNum = [4, 3, 1]; // 시도 숫자 테스트 케이스
const answer = [1, 2, 3]; // 실제 정답
const tryNumSize = tryNum.length;
/*
야구 게임 로직
*/
// 시도 횟수 한번 판단 함수
function oneGame() {
  const strike = howManyStrike();
  const ball = howManyBall();
  if (strike === 3) { // 스트라이크가 3이면 즈어어엉답!!
    if (strike === 3) {
      // 스트라이크가 3이면 즈어어엉답!!
      console.log("즈어어엉답!!");
      result = "즈어엉답!";
    } else {
      // 정답이 아니면 strike 와 ball 횟수 출력
      console.log(strike + " strike");
      console.log(ball + " ball");
      result = ball + 'B ' + strike + 'S'; // 1B 0S
    }
    if (strike === 0 && ball === 0) {
      // strike 와 ball 이 모두 0이라면 아우우웃ㅅ@!@
      console.log("아우우웃~!@");
      result = "OUT";
    }
  }
  // 스트라이크 몇개인지 판별 함수
  function howManyStrike() {
    let strike = 0;
    console.log(tryNum);
    console.log(answer);
    for (let i = 0; i < tryNumSize; i++) {
      if (tryNum[i] === answer[i]) {
        // 첫번째 자리, 두번째 자리, 세번째 자리 차례차례 비교해서 같을때마다 strike 1씩 증가.
        function howManyBall() {
        }
        return ball;
      }
      oneGame();
