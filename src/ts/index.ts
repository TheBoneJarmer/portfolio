import { Aquanore } from "aquanore"
import { Shading } from "aquanore/enums";
import { Model, Renderer } from "aquanore/graphics"
import { StandardMaterial } from "aquanore/graphics/materials"
import { Vector3 } from "aquanore/math";

/* ASSETS */
let model: Model;

/* SCENE */
let pos: Vector3;
let rot: Vector3;
let scale: Vector3;

/* AQUANORE */
Aquanore.onLoad = onLoad;
Aquanore.onUpdate = onUpdate;
Aquanore.onRender2D = onRender2D;
Aquanore.onRender3D = onRender3D;

Aquanore.init().then(() => {
    Aquanore.run();
});

/* CALLBACKS */
async function onLoad() {
    model = Model.torusknot(1, 0.4, 32, 4, 2, 3);
    model.meshes.forEach((mesh) => {
        mesh.primitives.forEach((pri) => {
            const mat = pri.material as StandardMaterial;
            mat.color.r = 16;
            mat.color.g = 130;
            mat.color.b = 175;
            mat.shading = Shading.Flat;

            pri.castShadow = false;
            pri.receiveShadow = false;
        });
    })

    pos = new Vector3(0, 0.5, -5);
    rot = new Vector3(0, 0, 0);
    scale = new Vector3(1, 1, 1);
}

async function onUpdate(dt: number) {
    rot.y += dt;
}

async function onRender2D() {

}

async function onRender3D() {
    Renderer.drawModel(model, pos, rot, scale);
}