import { Material, World } from "cannon-es";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const cm1 = {
  scene: new THREE.Scene(),
  gltfLoader: new GLTFLoader(),
  mixer: undefined,

  // cannon-es
  world: new World(),
  defaultMaterial: new Material("default"),
  glassMaterial: new Material("glass"),
  playertMaterial: new Material("player"),
};

export const cm2 = {
  step: 0,
  backgroundColor: "#30336b",
  lightColor: "white",
  lightOffColor: "#222",
  pillarColor: "#071d28",
  floorColor: "#111",
  barColor: "#441c1d",
  glassColor: "#9fdfff",
};

export const geo = {
  pillar: new THREE.BoxGeometry(5, 10, 5),
  floor: new THREE.BoxGeometry(200, 1, 200),
  bar: new THREE.BoxGeometry(0.1, 0.3, 1.2 * 21),
  sideLight: new THREE.SphereGeometry(0.1, 6, 6),
  glass: new THREE.BoxGeometry(1.2, 0.05, 1.2),
};

export const mat = {
  pillar: new THREE.MeshPhongMaterial({
    color: cm2.pillarColor,
  }),
  floor: new THREE.MeshPhongMaterial({
    color: cm2.floorColor,
  }),
  bar: new THREE.MeshPhongMaterial({
    color: cm2.barColor,
  }),
  sideLight: new THREE.MeshPhongMaterial({
    color: cm2.lightColor,
  }),
  glass1: new THREE.MeshPhongMaterial({
    color: cm2.glassColor,
    transparent: true,
    opacity: 0.1,
  }),
  glass2: new THREE.MeshPhongMaterial({
    color: cm2.glassColor,
    transparent: true,
    opacity: 0.1,
  }),
};

const normalSound = new Audio();
normalSound.src = "/sounds/Crash .mp3";
normalSound.volume = 0.1;

const strongSound = new Audio();
strongSound.src = "/sounds/Wood Hit Metal Crash.mp3";

export const sounds = {
  normal: normalSound,
  strong: strongSound,
};
