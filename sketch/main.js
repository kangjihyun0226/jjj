// 기본설정
const canvasContainer = document.querySelector(".canvas-container");

// const INITIAL_W = 400;
// const INITIAL_H = 400;
// const INITIAL_RATIO = INITIAL_W / INITIAL_H;

const {
  Engine,
  Runner,
  Composites,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
} = Matter;

let stack;
let walls;
let engine;
let world;
let secondBalls = [];
let secondR = 42;
let minuteBalls = [];
let minuteR = 42;
let hourBalls = [];
let hourR = 68;

function setup() {
  const { width: containerWidth, height: containerHeight } =
    canvasContainer.getBoundingClientRect();

  const renderer = createCanvas(containerWidth, containerHeight);
  renderer.parent(canvasContainer);
  // renderer.elt.style.aspectRatio = '${width}';
  // renderer.elt.style.width = `${containerWidth}px`;
  // renderer.elt.style.height = `${containerWidth / INITIAL_RATIO}px`;

  engine = Engine.create();
  world = engine.world;

  walls = [
    // 밑 벽
    Bodies.rectangle(0.5 * width, height, width, 100, { isStatic: true }),
    // 왼 벽
    Bodies.rectangle(0, 0.5 * height, 100, height, { isStatic: true }),
    // 오른 벽
    Bodies.rectangle(width, 0.5 * height, 100, height, { isStatic: true }),
    // 중앙오른
    Bodies.rectangle(width * 0.33, 0.5 * height, 100, height * 2, {
      isStatic: true,
    }),
    // 중앙 왼쪽
    Bodies.rectangle(width * 0.66, 0.5 * height, 100, height * 2, {
      isStatic: true,
    }),
  ];

  // 생성된 벽들 추가
  Composite.add(world, walls);

  const mouse = Mouse.create(renderer.elt);
  mouse.pixelRatio = pixelDensity();

  // 마우스로 드래그
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.1,
    },
  });

  // 마우스 추가
  Composite.add(world, mouseConstraint);

  // 엔진 실행
  const runner = Runner.create();
  Runner.run(runner, engine);

  // help..
  // 현재 시각에 맞춰 초기 공 생성
  const currentSecond = second();
  const currentMinute = minute();
  const currentHour = hour();

  // 초 공 생성
  for (let i = 0; i < currentSecond; i++) {
    dropSBall();
  }
  // 분 공 생성
  for (let i = 0; i < currentMinute; i++) {
    dropMBall();
  }
  // 시 공 생성
  for (let i = 0; i < currentHour; i++) {
    dropHBall();
  }
}

// 초 공을 떨어뜨리는 함수
function dropSBall() {
  const sBall = Bodies.circle(width * 0.8, 0, secondR);
  secondBalls.push(sBall);
  Composite.add(world, sBall);
}

// 분 공을 떨어뜨리는 함수
function dropMBall() {
  const mBall = Bodies.circle(width * 0.5, 0, minuteR);
  minuteBalls.push(mBall);
  Composite.add(world, mBall);
}

// 시 공을 떨어뜨리는 함수
function dropHBall() {
  const hBall = Bodies.circle(width * 0.15, 0, hourR);
  hourBalls.push(hBall);
  Composite.add(world, hBall);
}
function draw() {
  let bgColor;
  let sColor;
  let mColor;
  let hColor;
  const sr = minute();

  if (sr % 2 === 0) {
    bgColor = "#000000";
    sColor = "#ffffff";
    mColor = "#ffffff";
    hColor = "#ffffff";
  } else {
    bgColor = "#ffffff";
    sColor = "#000000";
    mColor = "#000000";
    hColor = "#000000";
  }

  background(bgColor);

  const h = hour();
  const m = minute();
  const s = second();
  push();
  // const displayTimeH = nf(h, 2);
  // const displayTime1 = " : ";
  // const displayTimeM = nf(m, 2);
  // const displayTime2 = " : ";
  // const displayTimeS = nf(s, 2);
  textAlign(CENTER, CENTER);
  textFont("Barlow Condensed");
  textStyle(BOLD);
  textSize(width * 0.26); // 화면 너비에 비례한 크기

  if (sr % 2 === 0) {
    fill(255, );
  } else {
    fill(0, );
  }
  noStroke();

  // 화면 정중앙에 출력
  text(nf(s, 2), (width * 5) / 6, height / 2);
  text(nf(h, 2), width / 6, height / 2);
  text(" : ", width * 0.33, height / 2);
  text(nf(m, 2), width / 2, height / 2);
  text(" : ", width * 0.66, height / 2);

  pop();

  function drawDistortedBall(ball, r, color) {
    let x = ball.position.x;
    let y = ball.position.y;

    let imgX = constrain(x - r, 0, width - r * 2);
    let imgY = constrain(y - r, 0, height - r * 2);

    //(공 크기만큼)
    // get(x, y, w, h)이미지
    let img = get(imgX, imgY, r * 2, r * 2);

    push();
    // 마스킹 효과
    // 이미지 확대
    beginClip();
    circle(x, y, r * 2);
    endClip();

    if (img) {
      imageMode(CENTER);
      //왜곡 효과
      image(img, x, y, r * 3.6, r * 3.6);
    }
    pop();
    //
    push();
    noFill();
    drawingContext.shadowBlur = 15; // 번짐의 정도
    drawingContext.shadowColor = color; // 번짐의 색상
    stroke(color);
    strokeWeight(2);
    circle(x, y, r * 2);

    pop();
  }

  // 공 렌더링

  secondBalls.forEach((ball) => drawDistortedBall(ball, secondR, sColor));
  stroke(mColor);
  minuteBalls.forEach((ball) => drawDistortedBall(ball, minuteR, mColor));
  stroke(hColor);
  hourBalls.forEach((ball) => drawDistortedBall(ball, hourR, hColor));

  // 현재 시각 가져오기
  const currentSecond = second();
  const currentMinute = minute();
  const currentHour = hour();

  // 초 공
  if (secondBalls.length < currentSecond) {
    dropSBall();
  } else if (secondBalls.length > currentSecond) {
    // 0초로 넘어갈 때 모든 초 공 제거
    const ballToRemove = secondBalls.shift();
    Composite.remove(world, ballToRemove);
  }

  // 분 공
  if (minuteBalls.length < currentMinute) {
    dropMBall();
  } else if (minuteBalls.length > currentMinute) {
    //0분으로 넘어갈 때 모든 분 공 제거
    const ballToRemove = minuteBalls.shift();
    Composite.remove(world, ballToRemove);
  }

  // 시 공
  if (hourBalls.length < currentHour) {
    dropHBall();
  } else if (hourBalls.length > currentHour) {
    // 12시 -> 1시로 넘어갈 때 시 공 제거
    const ballToRemove = hourBalls.shift();
    Composite.remove(world, ballToRemove);
  }

  noStroke();
  noFill(); // 채우기 없음

  // 벽 렌더링
  walls.forEach((aBody) => {
    beginShape();
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    });
    endShape(CLOSE);
  });
}
