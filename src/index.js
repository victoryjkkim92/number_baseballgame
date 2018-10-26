// 시도 버튼에 클릭 이벤트가 일어났을 때
const tryButton = document.querySelector(".input-box-try");
const resetButton = document.querySelector(".input-box-reset");
const inputBoxes = document.querySelector(".input-boxes");
const inputBoxDigit1 = document.querySelector(".input-box-digit-1");
const inputBoxDigit2 = document.querySelector(".input-box-digit-2");
const inputBoxDigit3 = document.querySelector(".input-box-digit-3");
const turnListEl = document.querySelector(".turn-list");
const mainTitle = document.querySelector(".main-title");
let roundNum = 1;
let tryNum = []; // 시도 숫자 테스트 케이스
let answer = randomAnswer(); // 랜덤 정답 설정
console.log(answer);
const tryNumSize = answer.length;
let result = "";

// 시도 버튼 눌렀을 때
tryButton.addEventListener("click", e => {
  if (nullCheck()) {
    tryNum = [];
    const round = document.createElement("span");
    const turnListItemEl = document.createElement("div");
    // cloneNode에서 해당 node의 children 까지 복제하려면 true, 해당 node 만 복제하려면 false
    const inputBoxesClone = inputBoxes.cloneNode(true);
    tryNum.push(inputBoxDigit1.value);
    tryNum.push(inputBoxDigit2.value);
    tryNum.push(inputBoxDigit3.value);

    oneGame();
    const resultField = document.createElement("span");
    resultField.textContent = result;
    // 리스트에 복제되서 추가되는 input box들 수정 막는 코드
    for (let i = 0; i < inputBoxesClone.children.length; i++) {
      inputBoxesClone.children[i].setAttribute("readonly", "");
    }
    round.textContent = roundNum++ + "회";
    inputBoxesClone.prepend(round);
    turnListItemEl.appendChild(inputBoxesClone);
    turnListItemEl.appendChild(resultField);
    turnListEl.appendChild(turnListItemEl);

    if (roundNum === 10 && result !== "정답") {
      blockScreen();
    }
  }
  e.preventDefault();
});

resetButton.addEventListener("click", e => {
  roundNum = 1;
  tryButton.removeAttribute("disabled", "");
  while (turnListEl.firstChild) {
    turnListEl.removeChild(turnListEl.firstChild);
    initialize();
    e.preventDefault();
  }
  answer = randomAnswer();
  console.log(answer);
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

// 야구 게임 로직
// 시도 횟수 한번 판단 함수
function oneGame() {
  const strike = howManyStrike();
  const ball = howManyBall();
  if (strike === 3) {
    // 스트라이크가 3이면 즈어어엉답!!
    result = "정답!";
    blockScreen();
  } else {
    // 정답이 아니면 strike 와 ball 횟수 출력
    result = ball + "B " + strike + "S"; // 1B 0S

    initialize();
  }
  if (strike === 0 && ball === 0) {
    // strike 와 ball 이 모두 0이라면 아우우웃ㅅ@!@
    result = "OUT";
  }
}
// 스트라이크 몇개인지 판별 함수
function howManyStrike() {
  let strike = 0;
  for (let i = 0; i < tryNumSize; i++) {
    if (tryNum[i] === answer[i]) {
      // 첫번째 자리, 두번째 자리, 세번째 자리 차례차례 비교해서 같을때마다 strike 1씩 증가.
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
      if (tryNum[i] === answer[j]) {
        // 시도숫자의 첫번째 자리가 정답 숫자 세자리 중 일치하는게 있는지 확인. 그 다음 시도 숫자 두번째 자리 확인. 세번째 자리 확인.
        ball++;
        break; // 볼이 중복으로 세어지는 것 방지를 위한 break.
      }
    }
  }
  return ball;
}
// 정답 랜덤 생성
function randomAnswer() {
  const a = Math.floor(Math.random() * 9);
  const b = Math.floor(Math.random() * 9);
  const c = Math.floor(Math.random() * 9);
  return [a.toString(), b.toString(), c.toString()];
}

function blockScreen() {
  tryButton.setAttribute("disabled", "");
  resetButton.focus();
}

function nullCheck() {
  if (
    inputBoxDigit1.value === "" ||
    inputBoxDigit2.value === "" ||
    inputBoxDigit3.value === ""
  ) {
    mainTitle.innerHTML = "답 똑디 채워라";
    initialize();
    setTimeout(function() {
      mainTitle.innerHTML = "친구야, 한턱 쏠끼가";
    }, 1000);
    return false;
  }
  return true;
}

function initialize() {
  inputBoxDigit1.value = "";
  inputBoxDigit2.value = "";
  inputBoxDigit3.value = "";
  inputBoxDigit1.focus();
}
<<<<<<< HEAD

console.log (randomAnswer())

oneGame();
=======
>>>>>>> 0402030703cb7ca9e1000012f2fdf58672becc56
