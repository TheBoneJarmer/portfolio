import * as THREE from "three";
import { Model, Scene } from "lunanore";

export class SceneMain extends Scene {
    private _modelJelly: Model = null;

    public async init() {
        this.scene.background = new THREE.Color("#0780a5");
    }

    public async update(dt: number) {
        
    }
}