import * as THREE from "three";
import { Model, Scene } from "lunanore";

export class SceneMain extends Scene {
    private _modelJelly: Model = null;

    public async init() {
        // this.scene.background = new THREE.Color("#163617");
        // this.scene.background = new THREE.Color("#060c1a");
    }

    public async update(dt: number) {
        
    }
}