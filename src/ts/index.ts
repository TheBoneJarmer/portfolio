import { Lunanore, Scenes } from "lunanore";
import { SceneMain } from "./scene-main";

window.addEventListener("load", () => {
    const cnv = document.querySelector("canvas") as HTMLCanvasElement;

    Lunanore.init(cnv);

    Scenes.add("main", new SceneMain());
    Scenes.navigate("main");

    Lunanore.run();
});

window.addEventListener("resize", () => {
    Lunanore.resize(innerWidth, innerHeight);
});