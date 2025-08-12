import * as THREE from "three";
import { ActorKnot } from "./actors/actor-knot";
import { Assets, Model, Scene } from "lunanore";

export class SceneMain extends Scene {
    public async init() {
        const mat = new THREE.MeshPhongMaterial();
        mat.color = new THREE.Color("#1082af");
        mat.flatShading = true;

        const model = Model.torusKnot(1, 0.4, 32, 4, 2, 3, mat);
        Assets.addModel("knot", model);

        const knot = new ActorKnot();
        this.add(knot);

        this.camera.position.z = 8;
        this.camera.position.y = -0.5;
    }

    public async update(dt: number) {
        
    }
}