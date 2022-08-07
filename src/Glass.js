import * as THREE from "three";
import { cm1, geo, mat, sounds } from "./common";
import { Stuff } from "./Stuff";

export class Glass extends Stuff {
  constructor(info = {}) {
    super(info); //부모 클래스의 constructor 를 호출

    this.type = info.type;
    this.step = info.step;

    this.geometry = geo.glass;
    switch (this.type) {
      case "normal":
        this.material = mat.glass1;
        this.mass = 1;
        break;
      case "strong":
        this.material = mat.glass2;
        this.mass = 0;
        //캐릭터의 mass는 30으로 지정했다. 0이면 고정값
        break;
    }

    this.width = this.geometry.parameters.width;
    this.height = this.geometry.parameters.height;
    this.depth = this.geometry.parameters.depth;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = this.name;
    this.mesh.step = this.step;
    this.mesh.type = this.type;

    cm1.scene.add(this.mesh);

    this.setCannonBody();

    this.cannonBody.addEventListener("collide", playSound);

    const sound = sounds[this.type];

    function playSound(e) {
      const strength = e.contact.getImpactVelocityAlongNormal();
      if (strength > 1) {
        sound.currentTime = 0;
        sound.play();
      }
    }
  }
}
