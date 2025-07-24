import { Lunanore, Scene, Scenes } from "lunanore";

class SceneMain extends Scene {
    public async init() {

    }

    public async update(dt: number) {
        
    }
}

const cnv = document.querySelector("canvas") as HTMLCanvasElement;

Lunanore.init(cnv);

Scenes.add("main", new SceneMain());
Scenes.navigate("main");

Lunanore.run();