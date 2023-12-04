
var song = {
  duration: 130,
  sheet: [d, f, j, k],
};

function setNotes(difficulty) {
    switch (difficulty) {
      case "easy":
        song.sheet = [d,f,j,k];
        break;
      case "hyper":
        song.sheet = [d1,f1, j1, k1];
        break;
      case "ext":
        song.sheet = [d2,f2,j2,k2];
        break;
      default:
        console.error("Invalid difficulty");
    }
  
    initializeNotes();
  }
  

  var originalNotes = [...song.sheet]; // 초기 노트 배열을 저장

function Note_Mirror() {
  song.sheet.reverse();
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    
  }
  return array;
}



// "Level" 버튼 이벤트 처리
const levelButtons = document.querySelectorAll('.config__level .btn');
levelButtons.forEach((button) => {
  button.addEventListener('click', function () {
    // 선택된 버튼 해제
    levelButtons.forEach((btn) => {
      btn.classList.remove('btn--selected');
    });

    // 클릭한 버튼 선택
    button.classList.add('btn--selected');

    // 해당하는 난이도로 노트 설정
    const difficulty = button.getAttribute('data-difficulty');
    setNotes(difficulty);

    // 선택된 모드에 따라 색상 설정
    setColorBasedOnMode();
  });
});

// "Option" 버튼 이벤트 처리
const optionButtons = document.querySelectorAll('.config__random .btn');
optionButtons.forEach((button) => {
  button.addEventListener('click', function () {
    // 선택된 버튼 해제
    optionButtons.forEach((btn) => {
      btn.classList.remove('btn--selected');
    });

    // 클릭한 버튼 선택
    button.classList.add('btn--selected');

    // 선택된 모드에 따라 색상 설정
    setColorBasedOnMode();
  });
});

// 예제로 버튼 클릭 이벤트를 받아오는 코드
const mirrorButton = document.getElementById('MirrorMode');
const randomButton = document.getElementById('RandomMode');
const offButton = document.getElementById('OffMode');

mirrorButton.addEventListener('click', () => {
  Note_Mirror();
  console.log("MirrorIsOn");
  setColorBasedOnMode();
});

randomButton.addEventListener('click', () => {
  shuffleArray(song.sheet);
  setRandomColors();
  console.log("RandomIsOn");
  setColorBasedOnMode();
});

offButton.addEventListener('click', () => {
  song.sheet = [...originalNotes]; // 초기 노트 배열로 되돌림
  console.log("ModeOff");
  setColorBasedOnMode();
});

function setRandomColors() {
  song.sheet[0].color = "rgba(254, 45, 87, 1)";
  song.sheet[1].color = "rgba(28, 121, 228, 1)";
  song.sheet[2].color = "rgba(28, 121, 228, 1)";
  song.sheet[3].color = "rgba(254, 45, 87, 1)";
}

function setColorBasedOnMode() {
  const selectedLevelButton = document.querySelector('.config__level .btn--selected');
  const selectedOptionButton = document.querySelector('.config__random .btn--selected');

  const difficulty = selectedLevelButton ? selectedLevelButton.getAttribute('data-difficulty') : null;
  const mode = selectedOptionButton ? selectedOptionButton.id : null;

  if (mode === 'MirrorMode') {
    Note_Mirror();
  } else if (mode === 'RandomMode') {
    shuffleArray(song.sheet);
    setRandomColors();
  }

  
}







// song : 리듬 게임의 음악 데이터 정의
// duration : 게임의 총 시간(초)
// sheet : 각 키 별로 노트 정보를 가지고 있는 객체 배열


var sync = 0;
let syncprop = document.getElementById("sync");

syncprop.addEventListener("mousedown", (e) => {
  var isRightButton;
  e = e || window.event;
  e.preventDefault();

  if ("which" in e) isRightButton = e.which == 3;
  else if ("button" in e) isRightButton = e.button == 2;

  if (isRightButton) {
    sync -= 0.1;
    syncprop.innerHTML = sync.toFixed(1) + "s";
    console.log(sync);
  } 
  else {
    sync += 0.1;
    syncprop.innerHTML = sync.toFixed(1) + "s";
      }

  if (sync === -0.0) {
    sync = 0
  }
  
});

//syncprop : "sync"요소를 나타냄
//mousedown : snyc값의 증가와 감소

// script

let isHolding = {
  d: false,
  f: false,
  j: false,
  k: false,
};

// isHolding : 현재 키가 눌려있는지 판단
// d, f, j, k 상태를 저장(false)

let hits = { perfect: 0, good: 0, bad: 0, poor : 0, miss: 0 };
let multiplier = {
  perfect: 1,
  good: 0.8,
  bad: 0.5,
  poor : 0,
  miss: 0,
  combo40: 1.05,
  combo80: 1.1,
};

//multiplier : 각 판정에 대한 점수 배율 정의

let isPlaying = false; // 게임 진행상태, 게임이 시작되면 true로 설정
let speed = 1; //현재 게임의 속도
let combo = 0; //현재 콤보 횟수
let maxCombo = 0; //최대 콤보 횟수
let score = 0; //점수 저장
let animation = "moveDown"; //노트가 화면에서 이동하는 애니메이션 스타일
let startTime; //게임 시작 시간 저장
let trackContainer  // 노트가 표시될 컨테이너 요소
let tracks; // 각 키에 해당하는 요소들의 배열
let keypress; // 키를 누를 때 화면에 누른 키 효과를 나타냄
let comboText; //화면에 콤보 횟수를 나타낸다

var scroll = 0.48 //판정측정


var initializeNotes = function () {
  let noteElement;
  let trackElement;


  

  while (trackContainer.hasChildNodes()) {
    trackContainer.removeChild(trackContainer.lastChild);
  }

  song.sheet.forEach(function (key, index) {
    trackElement = document.createElement("div");
    trackElement.classList.add("track");
    
    key.notes.forEach(function (note) {
      noteElement = document.createElement("div");
      noteElement.classList.add("note");
      noteElement.classList.add("note--" + index);
      noteElement.style.backgroundColor = key.color;
      noteElement.style.animationName = animation;
      noteElement.style.animationTimingFunction = "linear";
      noteElement.style.animationDuration = note.duration - (speed)  + "s"; // speed 적용
      noteElement.style.animationDelay = note.delay + (speed) + "s"; // speed 적용
      noteElement.style.animationPlayState = "paused";
      trackElement.appendChild(noteElement);
    });

    trackContainer.appendChild(trackElement);
    tracks = document.querySelectorAll(".track");
  });
};

var setupSpeed = function () {
  var speedButtons = document.querySelectorAll(".btn--small");
  
  
  // 속도 초기화 함수
  var initializeSpeed = function () {
    speedButtons.forEach(function (button) {
      button.classList.remove("btn--selected");
    });
  };
  // 버튼 클릭 이벤트 처리
  speedButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      initializeSpeed(); // 속도 초기화
      

      if (button.id === "speed-decrease") {
        speed -= 0.1;
        scroll += 0.013
        scroll = Math.max(0.22, Math.min(0.48, scroll));
        console.log(scroll.toFixed(2))
        
      } else if (button.id === "speed-increase") {
        speed += 0.1;
        scroll -= 0.013
        scroll = Math.max(0.22, Math.min(0.48, scroll));
        console.log(scroll.toFixed(2))
      }
      
      speed = Math.max(1, Math.min(3.0, speed)); 
      
      document.getElementById("speed-default").innerText = speed.toFixed(1) + "x";
      this.classList.add("btn--selected");

      initializeNotes();
    });
  });
};
document.getElementById("speed-default").classList.add("btn--selected");



var setupChallenge = function () {
  var enabled = false;
  var challengeButtons = document.querySelectorAll(".config__challenge .btn");

  challengeButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      if (enabled) {
        // 버튼 해제
        button.className = "btn btn--small";
        enabled = false;
        updateAnimation("MoveDown")
      } else {
        // 버튼 선택
        button.className = "btn btn--small btn--selected";
        enabled = true;
        updateAnimation(event.target.id); // 클릭한 버튼의 id를 전달하여 해당 애니메이션 업데이트
      }
    });
  });
};

var updateAnimation = function (animationType) {
  switch (animationType) {
    case "Fade":
      animation = "moveDownFade";
      break;
    case "Sudden":
      animation = "moveDownSudden";
      break;
    case "Blink":
      animation = "moveDownBlink";
      break;
    default:
      animation = "moveDown"; // 기본적으로 아무것도 적용되지 않도록 설정
  }
  initializeNotes();
  console.log(animation)
};



var startvideo = document.querySelector('.video')

var setupStartButton = function () { // 게임 시작 버튼을 누를 때 게임이 시작됨
  var startButton = document.querySelector(".btn--start");
  
  startvideo.style.display = 'none';
  startButton.addEventListener("click", function () {
  
    var stopFunc = function(e) { e.preventDefault(); e.stopPropagation(); return false; }; //클릭방지
    var all = document.querySelectorAll('*');
      for (var idx in all) {
	      var el = all[idx];
	    if (el.addEventListener) {
		      el.addEventListener('click', stopFunc, true); // have to true
	      }
      }

    menu.style.pointerEvents = "none" // start 버튼을 누르면 모든 버튼 비활성화
    
    

    setTimeout(function () {
      document.querySelector(".song").play();
      startvideo.style.display = 'block';
      startvideo.play();
    }, 5000+(sync*1000));
    
    
    
    isPlaying = true;
    startTime = Date.now();

    
    
    startTimer(song.duration);
    document.querySelector(".menu").style.opacity = 0;
    
    document.querySelectorAll(".note").forEach(function (note) {
      note.style.animationPlayState = "running";
    
    
    
    });
  });
};

var startTimer = function (duration) { //남은 시간의 표시와 게임시간을 카운트 다운
  var display = document.querySelector(".summary__timer");
  var timer = duration;
  var minutes;
  var seconds;

  display.style.display = "block";
  display.style.opacity = 1;

  var songDurationInterval = setInterval(function () {
    minutes = Math.floor(timer / 60);
    seconds = timer % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.innerHTML = minutes + ":" + seconds;

    if (--timer < 0) {
      startvideo.style.display= 'none'
      clearInterval(songDurationInterval);
      showResult();
      comboText.style.transition = "all 1s";
      comboText.style.opacity = 0;
      
    }
  }, 1000);
};

var showResult = function () { // 결과 화면 표시
  
  document.querySelector(".perfect__count").innerHTML = hits.perfect;
  document.querySelector(".good__count").innerHTML = hits.good;
  document.querySelector(".bad__count").innerHTML = hits.bad;
  document.querySelector(".poor__count").innerHTML = hits.poor;
  document.querySelector(".miss__count").innerHTML = hits.miss;
  document.querySelector(".combo__count").innerHTML = maxCombo;
  document.querySelector(".score__count").innerHTML = score;
  document.querySelector(".summary__timer").style.opacity = 0;
  document.querySelector(".summary__result").style.opacity = 1;

};

var setupNoteMiss = function () { //노트를 놓쳤을 때 miss 처리
  trackContainer.addEventListener("animationend", function (event) {
    var index = event.target.classList.item(1)[6];
    
    displayAccuracy("miss");
    updateHits("miss");
    updateCombo("miss");
    updateMaxCombo();
    removeNoteFromTrack(event.target.parentNode, event.target);
    updateNext(index);
    
    
  });
};

/**
 * 키 한번에 한번 눌리게
 */
var setupKeys = function () { //키보드 이벤트를 설정하여 각 키 누름에 따른 동작 정의
  document.addEventListener("keydown", function (event) {
    var keyIndex = getKeyIndex(event.key);

    if (
      Object.keys(isHolding).indexOf(event.key) !== -1 &&
      !isHolding[event.key]
    ) {
      isHolding[event.key] = true;
      keypress[keyIndex].style.display = "block";

      if (isPlaying && tracks[keyIndex].firstChild) {
        judge(keyIndex);
      }
    }
  });

  document.addEventListener("keyup", function (event) {
    if (Object.keys(isHolding).indexOf(event.key) !== -1) {
      var keyIndex = getKeyIndex(event.key);
      isHolding[event.key] = false;
      keypress[keyIndex].style.display = "none";
    }
  });
};

var getKeyIndex = function (key) {
  if (key === "d") {
    return 0;
  } else if (key === "f") {
    return 1;
  } else if (key === "j") {
    return 2;
  } else if (key === "k") {
    return 3;
  }
};

var judge = function (index) {//각 키 입력에 대한 판정과 결과 처리
  var timeInSecond = (Date.now() - startTime) / 1000;
  var nextNoteIndex = song.sheet[index].next;
  var nextNote = song.sheet[index].notes[nextNoteIndex];
  var perfectTime = (nextNote.duration + nextNote.delay+0.01);
  var accuracy = Math.abs(timeInSecond - perfectTime)-0.05;
  
  
  var hitJudgement;
 
  accuracy -= 0.01; //accuracy margin
  
  if (accuracy-(speed*0.002) <=  scroll) {
    // 판정 마진 내에서만 판정을 수행
    var hitJudgement = getHitJudgement(accuracy);
    displayAccuracy(hitJudgement);
    showHitEffect(index);
    updateHits(hitJudgement);
    updateCombo(hitJudgement);
    updateMaxCombo();
    calculateScore(hitJudgement);
    if (hitJudgement !== "bad") {
      removeNoteFromTrack(tracks[index], tracks[index].firstChild);
      updateNext(index);
    }
    
  

    
  }
};

var updateNext = function (index) {
  song.sheet[index].next++;
};


var getHitJudgement = function (accuracy) { //입력한 노트의 판정을 결정
    
  var std = 0.15 
    if (accuracy <= (std/2) && accuracy >= -(std/2)) {
    return "perfect";
  } else if ((accuracy <= std*0.8) &&(accuracy >= -std)) {
    return "good";
  } else if (accuracy <= std*1.2) {
    return "bad";
  } else {
    return "poor"
  }

};




var displayAccuracy = function (accuracy) { //현재 판정 결과를 화면에 표시
  var accuracyText = document.createElement("div");
  document.querySelector(".hit__accuracy").remove();
  accuracyText.classList.add("hit__accuracy");
  accuracyText.classList.add("hit__accuracy--" + accuracy);
  accuracyText.innerHTML = accuracy;
  document.querySelector(".hit").appendChild(accuracyText);
};

var showHitEffect = function (index) { //판정 결과에 따라 노트를 효과적으로 나타냄
  var key = document.querySelectorAll(".key")[index];
  var hitEffect = document.createElement("div");
  hitEffect.classList.add("key__hit");
  key.appendChild(hitEffect);
};

var updateHits = function (judgement) { // 판정 결과에 따라 히트 횟수를 업데이트
  hits[judgement]++;
};

var updateCombo = function (judgement) { // 콤보횟수를 업데이트 하고 화면에 표시
  if (judgement === "poor" || judgement === "miss") {
    combo = 0;
    comboText.innerHTML = "";
  } else {
    comboText.innerHTML = ++combo;
  }
};


var updateMaxCombo = function () { //최대 콤보횟수 업데이트
  maxCombo = maxCombo > combo ? maxCombo : combo;
};

var calculateScore = function (judgement) { //점수 계산
  if (combo >= 80) {
    score += 1000 * multiplier[judgement] * multiplier.combo80;
  } else if (combo >= 40) {
    score += 1000 * multiplier[judgement] * multiplier.combo40;
  } else {
    score += 1000 * multiplier[judgement];
  }
};

var removeNoteFromTrack = function (parent, child) { // 노트를 트랙에서 제거
  parent.removeChild(child);
};

var updateNext = function (index) { //다음 노트의 인덱스 업데이트
  song.sheet[index].next++;
};



window.onload = function () {
  trackContainer = document.querySelector(".track-container");
  keypress = document.querySelectorAll(".keypress");
  comboText = document.querySelector(".hit__combo");
  
  
  
  initializeNotes();
  setupSpeed();
  setupChallenge();
  setupStartButton();
  setupKeys();
  setupNoteMiss();

  
  
}
