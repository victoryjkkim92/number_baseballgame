const tryButton = document.querySelector(".input-box-try"); // '시도' 버튼 가져오기
const resetButton = document.querySelector(".input-box-reset"); // '한번 더' 버튼 가져오기
const inputBoxDigits = [ // 숫자 입력하는 input box 세 개 가져와서 배열로 저장
  document.querySelector(".input-box-digit-1"),
  document.querySelector(".input-box-digit-2"),
  document.querySelector(".input-box-digit-3")
];
const turnListEl = document.querySelector(".turn-list"); // 시도 내용을 출력하기 위한 필드 가져오기
const inputBoxes = document.querySelector(".input-boxes"); // input box 세 개를 묶은 div 가져오기
const mainTitle = document.querySelector(".main-title"); // 메인 타이틀 가져오기
const description = document.querySelector(".game-description"); // 게임 설명 화면 요소 가져오기
const descriptionButton = document.querySelector(".description-button"); // 게임 설명을 보기 위한 '?' 버튼 가져오기

let roundNum = 1; // 시도 횟수 카운트를 위한 변수
let answer = randomAnswer([]); // 랜덤 정답 설정
console.log(answer); // 콘솔창으로 정답 볼 수 있음

// '?' 클릭하면 게임 설명 화면 보여주기
descriptionButton.addEventListener("click", e => {
  description.style.display = "block";
});
// 게임 설명 화면 아무 곳이나 클릭하면 다시 안보이게 해준다.
description.addEventListener("click", e => {
  description.style.display = "none";
  // 게임 설명 화면이 안보임과 동시에 첫번째 input 상자에 포커스를 줌.
  inputBoxDigits[0].focus();
});

// '시도' 버튼 눌렀을 때
tryButton.addEventListener("click", e => {
  // 유효한 input 값인지 걸러내기 위해 checkValidation() 함수가 true인 경우에만 시행
  // (checkValidation() 함수는 중복 값이 아닌지, 숫자를 입력했는지, 빈칸은 없는지 이 세가지를 확인한다.)
  if (checkValidation()) {
    // 한번 시도 시 그에 대한 정보를 담아주기 위한 div 만듬
    const turnListItemEl = document.createElement("div");
    const round = document.createElement("span"); // 몇번째 시도인지 담을 span 만듬 ex) 1회, 2회
    const resultField = document.createElement("span"); // ball과 strike 횟수를 담을 span 만듬 ex) 1B 2S
    // input box 세개를 묶고 있는 div를 복사한다.
    // 괄호 안에 true 값이 들어간 이유는 cloneNode 사용 시 해당 node의 children 까지 복제하려면 true, 해당 node 만 복제하려면 false기 때문.
    const inputBoxesClone = inputBoxes.cloneNode(true);
    let tryNum = []; // 시도하는 세 숫자를 배열로 담을 변수
    let result = ""; // 1B 2S 이런 결과를 담을 변수

    // 입력한 값 세개를 tryNum에 배열로 담는다.
    for (let item of inputBoxDigits) {
      tryNum.push(item.value);
    }

    // 시도한 값(tryNum)을 인수로 넘겨서 결과(예: 1B 2S, OUT)를 반환한 후, 그 값을 resultField에 써준다.
    resultField.textContent = oneGame(tryNum, result);
    // 시도 내용 필드에 추가되는 input box들의 수정을 막는 코드
    for (let i = 0; i < inputBoxesClone.children.length; i++) {
      inputBoxesClone.children[i].setAttribute("readonly", "");
    }
    
    // 하나의 시도가 끝났기에 시도 내용을 출력해주기 위해
    // 시도 횟수 표시 후 1증가 시켜준다. ex) '1회' 라고 화면 표시 후 변수는 2로 올림. 다음은 2회 이므로.
    round.textContent = roundNum++ + "회";
    // 시도 내용 필드에 시도 회, 시도한 답, 시도에 대한 결과(1B 2S) 요소들을 차례 차례 붙여준다.
    inputBoxesClone.prepend(round); // ex) 1회
    turnListItemEl.appendChild(inputBoxesClone); // ex) 1 2 3
    turnListItemEl.appendChild(resultField); // ex) 1B 2S
    // 붙여준 시도 내용을 필드에 추가시킨다.
    turnListEl.appendChild(turnListItemEl); // ex) 1회 1 2 3  1B2S 이렇게 된 하나의 띠(?)를 필드에 추가

    // 시도 횟수가 9회째이고 그때까지도 정답이 아니면 시도 결과 대신 정답을 알려준다.
    // 즉, '1B 2S' 또는 'OUT' 이런 시도 결과가 아니라 '정답은 1 2 3 입니다.' 라고 출력해줌.
    if (roundNum === 10 && resultField.textContent !== "정답!") {
      resultField.textContent =
        "정답은 " + answer[0] + " " + answer[1] + " " + answer[2] + " 입니다.";
      // 시도 횟수 더 이상 못 누르게 하는 함수. 게임 오버 되었으므로.
      blockScreen();
    }
  }
  e.preventDefault();
});

// '한번 더' 버튼 눌렀을 때
resetButton.addEventListener("click", e => {
  roundNum = 1; // 시도 횟수 초기화. '1회' 부터 다시 출력해줄 수 있게.
  tryButton.removeAttribute("disabled", ""); // (게임 오버, 또는 정답으로 인해) '시도' 버튼 못 누르게 하던 속성 제거
  // 시도 필드에 써있던 내용들 다 지워주기
  while (turnListEl.firstChild) { // 필드에 첫번째 요소가 있으면 제거한다. 즉, 첫번째 요소가 없어질 때 까지 계속 제거하는 원리.
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
    if (el.nextElementSibling) { // nextElementSibling 이 null 일 수 있으므로, 있으면 포커스 이동.
      el.nextElementSibling.focus();
    } else { // 이 else문을 쓴 이유는 세번째 input 상자까지 입력했을 시, '시도' 버튼으로 자동 포커스 이동을 해주고 싶어서.
      // '시도' 버튼이 세번째 input 상자의 부모 요소의 다음 형제 요소에 위치하고 있기 때문에 이렇게 구현함.
      el.parentElement.nextElementSibling.focus();
    }
  });
});

// 매 게임마다 랜덤 정답 설정을 위한 함수
function randomAnswer(arr) {
  let tmpNum; // 랜덤 숫자 하나를 받기 위한 임시 변수
  do {
    // 첫번째 랜덤 숫자 하나를 받고 arr배열에 저장.
    // 두번째 숫자 부터는 전에 받은 숫자와 중복이면(즉, arr배열에 include 되어 있으면) 랜덤 숫자를 다시 부여 받는다.
    // 정답이 1 1 2 이렇게 중복된 숫자가 나오면 안되기 때문. (게임 룰이 그렇다.)
    tmpNum = getRandom();
  } while (arr.includes(tmpNum));
  arr.push(tmpNum);
  // 랜덤 숫자가 3개가 설정될 때까지 이 randomAnswer 함수 사이클을 돌린다. 재귀 함수 이용.
  if (arr.length < 3) {
    randomAnswer(arr);
  }
  return arr; // 이렇게 설정된 랜덤 숫자 3개로 이뤄진 정답 반환.
}

// 0~9 사이 랜덤한 정수를 반환한다.
function getRandom() {
  return Math.floor(Math.random() * 10).toString();
}

// 정답 시, 혹은 시도횟수 9회 초과 시 더 이상 '시도'버튼 못 누르게 block 해주는 함수
function blockScreen() {
  tryButton.setAttribute("disabled", "");
  // 대신 '한번 더' 버튼에 포커스를 준다.
  resetButton.focus();
}

// input box 세개에 빈칸은 없는지, 문자가 아닌 숫자가 들어왔는지, 중복된 값은 없는지 확인해주는 함수.
function checkValidation() {
  let msg = ""; // 경고 메세지를 담기 위한 변수
  let valid = true; // 유효성 검사 판별 결과를 담는 변수
  // for문을 이용해서 iput box 3개 다 검사
  for (let i = 0; i < answer.length; i++) { // 그냥 answer.length 는 3이라고 생각해주세요.
    // 입력값이 빈칸일 때
    if (inputBoxDigits[i].value === "") {
      msg = "빈칸 앙대요!";
      valid = false; // 유효성 검사 fail
      break; // 어차피 이미 부적절한 input인게 판별되었으므로 더 볼 것도 없이 break 해줌.
    } // 입력 값이 숫자가 아닐 때
    else if ( // 숫자가 아닌 값을 입력했을 때.
      // 코드 원리
      // !Number.parseInt(inputBoxDigits[i].value) -> 숫자가 아닌 값을 Number.parseInt를 이용해 정수로 바꾸려고 하면 NaN이 나온다.
      // 그래서 input 상자에 입력값을 정수로 바꾼 값(입력값 타입이 string이므로 ex. "1", "2")이 truthy가 아니면 (즉, falsy이면) 문자라고 판단.
      // && inputBoxDigits[i].value !== "0" -> 하지만 다른 숫자들은 truthy 이지만 0 은 falsy다.
      // 즉, 0 혼자 반대의 결과를 나타내기 때문에 '입력 값이 0이 아니고' 조건을 추가.
      !Number.parseInt(inputBoxDigits[i].value) &&
      inputBoxDigits[i].value !== "0"
    ) {
      msg = "숫자만 입력해주세용";
      valid = false;
      break;
    }
    // 입력 값 중 중복이 있을 때
    for (let j = i + 1; j < answer.length; j++) {
      if (inputBoxDigits[i].value === inputBoxDigits[j].value) {
        msg = "중복 앙대요!";
        valid = false;
        break;
      }
    }
  }

  // 위 세 조건 모두 걸리지 않았으면 처음 설정 값 그대로 true 일 것.
  // 하나라도 유효성 검사에 어긋나서 걸렸으면 false 로 바뀌었을 것.
  if (valid) {
    // 잘 입력했으면 return true
    return true;
  } else {
    // 중복이 있거나 빈칸이거나 숫자가 아니면 다음과 같이 처리해주기.
    mainTitle.innerHTML = msg; // 타이틀에 경고 메세지 나타내기
    initialize();
    setTimeout(function() { // 1초 후 타이틀 다시 원상복구
      mainTitle.innerHTML = "숫자야구 with 츄츄트레인"; // 원래 타이틀로 변경.
    }, 1000);
    return false;
  }
}

// input 박스들에 쓰여진 숫자를 지워주는 함수.
// 지워주지 않으면 1 2 3 입력 후 '시도' 버튼 눌렀을 때, 1 2 3 숫자가 input 상자에 그대로 남아있다.
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
  // 스트라이크가 3개면 정답!!
  if (strike === 3) {
    result = "정답!"; // 시도 결과 써주기
    blockScreen(); // 정답이면 '시도' 버튼 더 이상 못 누르게 한다.
  } else {
    // 정답이 아니면 strike 와 ball 횟수 출력
    result = ball + "B " + strike + "S"; // 1B 0S 이런식으로 결과 써주기
    initialize(); // input 상자 초기화
  }
   // strike 와 ball 이 모두 0이라면 아웃!
  if (strike === 0 && ball === 0) {
    result = "OUT";
  }
  // 결과 값 반환
  return result;
}

// 스트라이크 몇개인지 판별 함수
function howManyStrike(tryNum) {
  let strike = 0;
  tryNum.forEach((item, index) => {
    // 첫번째 자리, 두번째 자리, 세번째 자리 차례차례 정답과 비교해서 같을때마다 strike 1씩 증가.
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
