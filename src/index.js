const tryButton = document.querySelector(".input-box-try"); // '시도' 버튼 가져오기
const resetButton = document.querySelector(".input-box-reset"); // '한번 더' 버튼 가져오기
const inputBoxDigits = [
  // 숫자 입력하는 input box 세 개 가져와서 배열로 저장
  document.querySelector(".input-box-digit-1"),
  document.querySelector(".input-box-digit-2"),
  document.querySelector(".input-box-digit-3")
];
const turnListEl = document.querySelector(".turn-list"); // 시도를 출력하기 위한 필드 가져오기
const inputBoxes = document.querySelector(".input-boxes"); // input box 세 개를 묶은 div 가져오기
const mainTitle = document.querySelector(".main-title"); // 타이틀 가져오기
const description = document.querySelector(".game-description"); // 게임 설명 화면 요소 가져오기
const descriptionButton = document.querySelector(".description-button"); // 게임 설명을 보기 위한 '?' 버튼

let roundNum = 1; // 시도 횟수 카운트를 위한 변수 설정
let answer = randomAnswer([]); // 랜덤 정답 설정
console.log(answer);

// 게임 설명 보여주기, 가져오기
descriptionButton.addEventListener("click", e => {
  description.style.display = "block";
});
description.addEventListener("click", e => {
  description.style.display = "none";
  inputBoxDigits[0].focus();
});

// '시도' 버튼 눌렀을 때
tryButton.addEventListener("click", e => {
  if (checkValidation()) {
    // input box 들에 값이 다 들어가고 중복 값이 없을 때에만 실행
    // 한번 시도 시 그에 대한 정보를 담아주기 위한 div 만듬
    const turnListItemEl = document.createElement("div");
    const round = document.createElement("span"); // 몇번째 시도인지 담을 span 만듬
    const resultField = document.createElement("span"); // ball과 strike 횟수를 담을 span 만듬
    // input box들을 묶은 div를 복사해서 담아준다.
    // cloneNode에서 해당 node의 children 까지 복제하려면 true, 해당 node 만 복제하려면 false
    const inputBoxesClone = inputBoxes.cloneNode(true);
    let tryNum = []; // 시도 숫자를 배열로 담을 변수
    let result = ""; // 1B 2S 이런 결과를 담을 변수

    // 입력한 값을 tryNum에 배열로 담는다.
    for (let item of inputBoxDigits) {
      tryNum.push(item.value);
    }

    // 시도한 값(tryNum)을 인수로 넘겨서 결과(예: 1B 2S, OUT)를 반환한 후, 그 값을 resultField에 써준다.
    resultField.textContent = oneGame(tryNum, result);
    // 리스트에 추가되는 input box들의 수정을 막는 코드
    for (let i = 0; i < inputBoxesClone.children.length; i++) {
      inputBoxesClone.children[i].setAttribute("readonly", "");
    }
    // 시도 횟수 증가시켜준 후 써주기
    round.textContent = roundNum++ + "회";
    // 리스트에 시도 회, 시도한 답, 시도에 대한 결과(1B 2S) 요소들을 차례 차례 붙여준다.
    inputBoxesClone.prepend(round);
    turnListItemEl.appendChild(inputBoxesClone);
    turnListItemEl.appendChild(resultField);
    turnListEl.appendChild(turnListItemEl);

    // 시도 횟수 9회 초과 시 더 이상 '시도' 버튼을 누를 수 없게 한다.
    if (roundNum === 10 && result !== "정답") {
      resultField.textContent =
        "정답은 " + answer[0] + " " + answer[1] + " " + answer[2] + " 입니다.";
      blockScreen();
    }
  }
  e.preventDefault();
});

// '한번 더' 버튼 눌렀을 때
resetButton.addEventListener("click", e => {
  roundNum = 1; // 시도 횟수 초기화
  tryButton.removeAttribute("disabled", ""); // 시도 횟수 못누르게 하던 속성 제거
  // 리스트에 요소들 다 지워서 초기화
  while (turnListEl.firstChild) {
    turnListEl.removeChild(turnListEl.firstChild);
    initialize();
    e.preventDefault();
  }
  // 정답 재설정
  answer = randomAnswer([]);
  console.log(answer);
});

// input에 숫자 입력 시 자동 포커스 이동
inputBoxDigits.forEach(el => {
  el.addEventListener("input", e => {
    if (el.nextElementSibling) {
      el.nextElementSibling.focus();
    } else {
      el.parentElement.nextElementSibling.focus();
    }
  });
});

// 매 게임마다 랜덤 정답 설정을 위한 함수
// 0~9 사이 랜덤한 정수 세 개를 반환한다.
function randomAnswer(arr) {
  let tmpNum;
  do {
    // 중복 숫자가 아닐 때 까지
    tmpNum = getRandom();
  } while (arr.includes(tmpNum));
  arr.push(tmpNum);
  if (arr.length < 3) {
    randomAnswer(arr);
  }
  return arr;
}

function getRandom() {
  return Math.floor(Math.random() * 10).toString();
}

// 정답 시, 혹은 시도횟수 9회 초과 시 더 이상 '시도'버튼 못 누르게 block 해주는 함수
function blockScreen() {
  tryButton.setAttribute("disabled", "");
  // 대신 '한번 더' 버튼에 포커스를 준다.
  resetButton.focus();
}

// input에 값을 다 채웠는지 체크해주는 함수
function checkValidation() {
  let msg = "";
  let valid = true;
  // 값을 다 채우지 않았을 때
  for (let i = 0; i < answer.length; i++) {
    // 그냥 answer.length 는 3
    // 입력값이 빈칸일 때
    if (inputBoxDigits[i].value === "") {
      msg = "빈칸 앙대요!";
      valid = false;
      break;
    } // 입력 값이 숫자가 아닐 때
    else if (
      !Number.parseInt(inputBoxDigits[i].value) &&
      inputBoxDigits[i].value !== "0"
    ) {
      msg = "숫자만 입력해주세용";
      valid = false;
      break;
    }
    for (let j = i + 1; j < answer.length; j++) {
      // 입력 값 중 중복이 있을 때
      if (inputBoxDigits[i].value === inputBoxDigits[j].value) {
        msg = "중복 앙대요!";
        valid = false;
        break;
      }
    }
  }

  if (valid) {
    // 잘 입력했으면 return true
    return true;
  } else {
    // 중복이 있거나 빈칸이면 처리
    mainTitle.innerHTML = msg; // 타이틀에 경고 메세지 나타내기
    initialize(); // 박스에 채워진 값 초기화
    // 1초 후 타이틀 다시 원상복구
    setTimeout(function() {
      mainTitle.innerHTML = "숫자야구 with 츄츄트레인";
    }, 1000);
    return false;
  }
}

// input 박스들에 쓰여진 숫자를 지움으로써 초기화시켜주는 함수
function initialize() {
  for (let item of inputBoxDigits) {
    item.value = "";
  }
  // 포커스는 다시 첫번째 input 상자로 이동시킨다.
  inputBoxDigits[0].focus();
}

// 야구 게임 로직
// 시도 횟수 한번에 대한 결과 판단 함수
function oneGame(tryNum, result) {
  const strike = howManyStrike(tryNum); // 스트라이크 개수
  const ball = howManyBall(tryNum); // 볼 개수
  // 스트라이크가 3이면 정답!!
  if (strike === 3) {
    result = "정답!";
    blockScreen(); // 정답이면 '시도' 횟수 더 이상 못 누르게
  } else {
    // 정답이 아니면 strike 와 ball 횟수 출력
    result = ball + "B " + strike + "S"; // 1B 0S 이런식으로 결과 써주기
    initialize(); // input 상자 초기화
  }
  if (strike === 0 && ball === 0) {
    // strike 와 ball 이 모두 0이라면 아웃!
    result = "OUT";
  }
  // 결과 값 반환
  return result;
}

// 스트라이크 몇개인지 판별 함수
function howManyStrike(tryNum) {
  let strike = 0;
  tryNum.forEach((item, index) => {
    // 첫번째 자리, 두번째 자리, 세번째 자리 차례차례 비교해서 같을때마다 strike 1씩 증가.
    if (item === answer[index]) {
      strike++;
      tryNum[index] = NaN; // ball 판별시 중복을 막기 위해 자리를 NaN으로 바꿔줌.
    }
  });
  return strike;
}

// strike로 걸러지지 못한 숫자들 중 볼이 몇 개인지 판별하는 함수
function howManyBall(tryNum) {
  let ball = 0;
  for (let i = 0; i < tryNum.length; i++) {
    for (let j = 0; j < tryNum.length; j++) {
      if (tryNum[i] === answer[j]) {
        // 시도숫자의 첫번째 자리가 정답 숫자 세자리 중 일치하는게 있는지 확인. 그 다음 시도 숫자 두번째 자리 확인. 세번째 자리 확인.
        ball++;
        break; // 볼이 중복으로 세어지는 것 방지를 위한 break.
      }
    }
  }
  return ball;
}
