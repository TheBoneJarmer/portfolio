import { Sprite } from "aquanore";

export class GameAssets {
    public static scale = 3;
    public static size = 48;

    private static _map: Sprite = null;
    private static _monsters: Sprite = null;

    public static get map(): Sprite {
        return this._map;
    }

    public static get monsters(): Sprite {
        return this._monsters;
    }

    public static init() {
        if (window.innerWidth < 786) {
            this.scale = 2;
            this.size = 32;
        }

        this._map = new Sprite("assets/map.png", 640, 400);
        this._monsters = new Sprite("assets/monsters.png", 16, 16);
    }
}