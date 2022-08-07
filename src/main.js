import * as THREE from "three";
import * as CANNON from "cannon-es";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Bar } from "./bar";
import { cm1, cm2 } from "./common";
import { Floor } from "./Floor";
import { Glass } from "./Glass";
import { Pillar } from "./Pillar";
import { Player } from "./Player";
import { SideLight } from "./sideLight";
import { PreventDragClick } from "./PreventDragClick";

// ----- 주제: The Bridge 게임 만들기

//canvas
const canvas = document.querySelector("#three-canvas");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const checkIntersects = () => {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(cm1.scene.children);
  //cm1의 모든 자식부분을 모두 할당하도록

  for (const item of intersects) {
    checkClickedObj(item.object);
    break;
  }
};

// Scene
const scene = cm1.scene;

//background
scene.background = new THREE.Color(cm2.backgroundColor);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = -4;
camera.position.y = 19;
camera.position.z = 14;

const cameraFail = camera.clone();
cameraFail.position.y = 0;
cameraFail.position.z = -4;
cameraFail.rotation.set(90, 0, 0);

cm1.scene.add(camera, cameraFail);

// Light
const ambientLight = new THREE.AmbientLight(cm2.lightColor, 0.8);
cm1.scene.add(ambientLight);

const spotLightDistance = 50;

const spotLight1 = new THREE.SpotLight(cm2.lightColor, 0.7);
spotLight1.castShadow = true;
spotLight1.shadow.mapSize.width = 2048;
spotLight1.shadow.mapSize.height = 2048;

const spotLight2 = spotLight1.clone();
const spotLight3 = spotLight1.clone();
const spotLight4 = spotLight1.clone();

spotLight1.position.set(
  -spotLightDistance,
  spotLightDistance,
  spotLightDistance
);
spotLight2.position.set(
  -spotLightDistance,
  spotLightDistance,
  -spotLightDistance
);
spotLight3.position.set(
  spotLightDistance,
  spotLightDistance,
  -spotLightDistance
);
spotLight4.position.set(
  spotLightDistance,
  spotLightDistance,
  spotLightDistance
);

scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Cannon-es(물리엔진)
cm1.world.gravity.set(0, -10, 0);

const defaultContactMtl = new CANNON.ContactMaterial(
  cm1.defaultMaterial,
  cm1.defaultMaterial,
  {
    friction: 0.3,
    restitution: 0.2,
  }
);

const glassDefaultContactMtl = new CANNON.ContactMaterial(
  cm1.glassMaterial,
  cm1.defaultMaterial,
  {
    friction: 1,
    restitution: 0,
  }
);

const playerGlassContactMtl = new CANNON.ContactMaterial(
  cm1.playertMaterial,
  cm1.glassMaterial,
  {
    friction: 1,
    restitution: 0,
  }
);

cm1.world.defaultContactMaterial = defaultContactMtl;
//디폴트 먼저 설정
cm1.world.addContactMaterial(glassDefaultContactMtl);
cm1.world.addContactMaterial(playerGlassContactMtl);

// Mesh
//물체만들기
const glassSize = 1.2;
const movingObjs = [];

//바닥 배치
const floor = new Floor({
  name: "floor",
});

//기둥 배치
const pillar1 = new Pillar({
  name: "pillar",
  x: 0,
  y: 5.5,
  z: -glassSize * 12 - glassSize / 2,
});

const pillar2 = new Pillar({
  name: "pillar",
  x: 0,
  y: 5.5,
  z: glassSize * 12 + glassSize / 2,
});

movingObjs.push(pillar1, pillar2);

//다리 프레임 배치

const bar1 = new Bar({
  name: "bar",
  x: -1.6,
  y: 10.3,
  z: 0,
});
const bar2 = new Bar({
  name: "bar",
  x: -0.4,
  y: 10.3,
  z: 0,
});
const bar3 = new Bar({
  name: "bar",
  x: 0.4,
  y: 10.3,
  z: 0,
});
const bar4 = new Bar({
  name: "bar",
  x: 1.6,
  y: 10.3,
  z: 0,
});

// glass 배치

const numberOfGlass = 10;

let glassTypeNumber = 0;
let glassTypes = [];

const glassZ = [];
// 플레이어를 움직이도록 위치값 배열 지정
for (let i = 0; i < numberOfGlass; i++) {
  glassZ.push(-(i * glassSize * 2 - glassSize * 9));
  //기존 값에서 양수로 바꿈
}

for (let i = 0; i < numberOfGlass; i++) {
  glassTypeNumber = Math.round(Math.random());
  switch (glassTypeNumber) {
    case 0:
      glassTypes = ["normal", "strong"];
      break;
    case 1:
      glassTypes = ["strong", "normal"];
      break;
  }

  const glass1 = new Glass({
    step: i + 1,
    name: `glass-${glassTypes[0]}`,
    x: -1,
    y: 10.5,
    z: -(i * glassSize * 2 - glassSize * 9),
    //z값 위치 계산한 식
    type: glassTypes[0],
    cannonMaterial: cm1.glassMaterial,
    //캐논삽입
  });

  const glass2 = new Glass({
    step: i + 1,
    name: `glass-${glassTypes[1]}`,
    x: 1,
    y: 10.5,
    z: -(i * glassSize * 2 - glassSize * 9),
    type: glassTypes[1],
    cannonMaterial: cm1.glassMaterial,
    //캐논삽입
  });

  movingObjs.push(glass1, glass2);
}

//player 매시 배치
const player = new Player({
  name: "player",
  x: 0,
  y: 10.9,
  z: 13,
  rotationY: THREE.MathUtils.degToRad(180),
  cannonMaterial: cm1.playertMaterial,
  //캐논삽입
  mass: 30,
});

movingObjs.push(player);

//sideLight 매시 배치
const sideLights = [];

for (let i = 0; i < 49; i++) {
  sideLights.push(
    new SideLight({
      name: "sideLight",
      container: bar1.mesh,
      z: i * 0.5 - glassSize * 10,
    })
  );
  sideLights.push(
    new SideLight({
      name: "sideLight",
      container: bar4.mesh,
      z: i * 0.5 - glassSize * 10,
    })
  );
}

//클릭 조건 변수
let fail = false;
//떨어질시에 true
let jumping = false;
//점프시에 true
let onReplay = false;
// 리플레이 실행타이밍

const checkClickedObj = (obj) => {
  if (obj.name.indexOf("glass") >= 0) {
    //유리판을 선택했을 때

    if (jumping || fail) return;
    //점핑, 실패중에는 return 할 수 있도록

    if (obj.step - 1 === cm2.step) {
      player.actions[2].stop();
      player.actions[2].play();
      //점프 동작 실행, 정지 연속으로 해줘야지 다음 칸으로갈때도 따라와줌

      jumping = true;
      cm2.step++;
      console.log(cm2.step);

      switch (obj.type) {
        case "normal":
          console.log("normal");
          const timerId = setTimeout(() => {
            fail = true;

            player.actions[0].stop();
            player.actions[1].play();
            //떨어진 애니메이션 이후에는 까딱거리는 애니메이션 정지

            sideLights.forEach((item) => {
              item.turnOff();
            });

            const timerId2 = setTimeout(() => {
              onReplay = true;
              player.cannonBody.position.y = 9;

              const timerId3 = setTimeout(() => {
                onReplay = false;
                clearTimeout(timerId3);
                s;
              }, 3000);

              clearTimeout(timerId2);
            }, 1000);

            clearTimeout(timerId);
          }, 700);
          //setTimeout 은 첫번째 인자에 실행할 fn,두번째 인자에는 1초 뒤에 실행해 달라고 요청
          break;
        case "strong":
          console.log("strong");
          break;
      }

      const timerId = setTimeout(() => {
        jumping = false;

        clearTimeout(timerId);
      }, 1000);

      gsap.to(player.cannonBody.position, {
        duration: 1,
        x: obj.position.x,
        z: glassZ[cm2.step - 1],
      });
      gsap.to(player.cannonBody.position, {
        duration: 0.4,
        y: 12,
      });

      //클리어!
      if (cm2.step === numberOfGlass && obj.type === "strong") {
        const timerId = setTimeout(() => {
          player.actions[2].stop();
          player.actions[2].play();

          gsap.to(player.cannonBody.position, {
            duration: 1,
            x: 0,
            z: -14,
          });
          gsap.to(player.cannonBody.position, {
            duration: 0.4,
            y: 12,
          });

          clearTimeout(timerId);
        }, 1500);
      }
    }
  }
};

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  controls.update();

  if (cm1.mixer) cm1.mixer.update(delta);
  movingObjs.forEach((item) => {
    if (item.cannonBody) {
      if (item.name === "player") {
        item.mesh.position.copy(item.cannonBody.position);
        if (fail) item.mesh.quaternion.copy(item.cannonBody.quaternion);

        if (item.modelMesh) {
          item.modelMesh.position.copy(item.cannonBody.position);
          if (fail) item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
        }
        item.modelMesh.position.y += 0.15;
      } else {
        item.mesh.position.copy(item.cannonBody.position);
        item.mesh.quaternion.copy(item.cannonBody.quaternion);

        if (item.modelMesh) {
          item.modelMesh.position.copy(item.cannonBody.position);
          item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
        }
      }
    }
  });

  cm1.world.step(1 / 60, delta, 3);

  if (!onReplay) {
    renderer.render(cm1.scene, camera);
  } else {
    renderer.render(cm1.scene, cameraFail);
    cameraFail.position.z = player.cannonBody.position.z;
    cameraFail.position.x = player.cannonBody.position.x;
  }
  renderer.setAnimationLoop(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(cm1.scene, camera);
}

// 이벤트
const prevnetDragClick = new PreventDragClick(canvas);
window.addEventListener("resize", setSize);
canvas.addEventListener("click", (e) => {
  if (prevnetDragClick.mouseMoved) return;
  mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
  checkIntersects();
});

draw();
