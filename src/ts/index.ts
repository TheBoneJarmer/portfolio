import {Aquanore, AquanoreOptions} from 'aquanore';
import {GameAssets} from "./game-assets";
import {GameMap} from "./game-map";
import {SIZE} from "./globals";

const options = new AquanoreOptions();
options.autoResize = false;

Aquanore.init(options);
Aquanore.onLoad = async () => {
    GameAssets.init();
    await GameMap.init();
};

Aquanore.onUpdate = (dt: number) => {
    GameMap.update(dt);
}

Aquanore.onRender = () => {
    GameMap.render();
}

Aquanore.onResize = (width: number, height: number) => {
    const map = GameMap.data;
    const canvas = Aquanore.canvas;

    if (!map) {
        return;
    }

    const mapWidth = map.width * SIZE;
    const mapHeight = map.height * SIZE;

    if (width > mapWidth) {
        GameMap.viewX = (mapWidth - width) / 2.0;
    }

    if (height > mapHeight) {
        GameMap.viewY = (mapHeight - height) / 2.0;
    }

    canvas.width = width;
    canvas.height = height;
}

Aquanore.run();