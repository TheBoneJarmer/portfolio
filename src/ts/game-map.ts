import {Monster} from "./monster";
import {SIZE,SCALE} from './globals';
import {Color, Renderer, Vector2 } from "aquanore";
import {GameAssets} from "./game-assets";

export class GameMap {
    private static _data: any = null;
    private static _monsters: Monster[] = [];
    private static _viewX: number = 0;
    private static _viewY: number = 0;

    static get data(): any {
        return this._data;
    }

    static get viewX(): number {
        return this._viewX;
    }

    static set viewX(value: number) {
        this._viewX = value;
    }

    static get viewY(): number {
        return this._viewY;
    }

    static set viewY(value: number) {
        this._viewY = value;
    }

    public static async init() {
        const indices = [0, 4, 5, 6, 7, 9, 13, 22];
        const res = await fetch("assets/map-data.json");

        if (res.ok) {
            this._data = await res.json();

            for (let i = 0; i < 20; i++) {
                let x = 0;
                let y = 0;
                let frameHor = 0;
                let frameVert = indices[Math.floor(Math.random() * indices.length)];
                let direction = Math.floor(Math.random() * 4);

                // Generate a random location
                do {
                    x = Math.floor(Math.random() * this._data.width);
                    y = Math.floor(Math.random() * this._data.height);
                }
                while (this.isBlocked(x, y))

                const monster = new Monster();
                monster.x = x * SIZE;
                monster.y = y * SIZE;
                monster.goalX = monster.x;
                monster.goalY = monster.y;
                monster.direction = direction;
                monster.frameHor = frameHor;
                monster.frameVert = frameVert;

                this._monsters[i] = monster;
            }
        } else {
            throw new Error("Map could not be loaded");
        }
    }

    public static update(dt: number) {
        for (let i = 0; i < this._monsters.length; i++) {
            const monster = this._monsters[i];
            const speed = dt / 10.0;

            if (monster.moveTimer <= 0) {
                const direction = Math.floor(Math.random() * 4);
                let goalX = monster.goalX;
                let goalY = monster.goalY;

                if (direction === 0) goalY += SIZE;
                if (direction === 1) goalY -= SIZE;
                if (direction === 2) goalX += SIZE;
                if (direction === 3) goalX -= SIZE;

                let tileGoalX = Math.floor(goalX / SIZE);
                let tileGoalY = Math.floor(goalY / SIZE);

                if (!this.isBlocked(tileGoalX, tileGoalY)) {
                    monster.direction = direction;
                    monster.goalX = goalX;
                    monster.goalY = goalY;
                }

                monster.moveTimer = 100 + (Math.random() * 100);
            } else {
                monster.moveTimer--;
            }

            if (monster.x > monster.goalX + speed) {
                monster.x -= speed;
            } else if (monster.x < monster.goalX - speed) {
                monster.x += speed;
            } else {
                monster.x = monster.goalX;
            }

            if (monster.y > monster.goalY + speed) {
                monster.y -= speed;
            } else if (monster.y < monster.goalY - speed) {
                monster.y += speed;
            } else {
                monster.y = monster.goalY;
            }

            if (monster.x !== monster.goalX || monster.y !== monster.goalY) {
                monster.frameTimer++;

                if (monster.frameTimer > 10) {
                    monster.frameHor++;
                    monster.frameTimer = 0;
                }
            }

            if (monster.frameHor > 3) {
                monster.frameHor = 0;
            }
        }
    }

    public static render() {
        const origin = new Vector2(0, 0);
        const color = new Color(255, 255, 255, 255);
        const scale = new Vector2(SCALE, SCALE);

        Renderer.drawSprite(GameAssets.map, new Vector2(-this.viewX, -this.viewY), scale, origin, 0, 0, 0, false, false, color)

        for (let i = 0; i < this._monsters.length; i++) {
            const monster = this._monsters[i];
            const monsterX = monster.x - GameMap.viewX;
            const monsterY = monster.y - GameMap.viewY;
            const monsterPos = new Vector2(monsterX, monsterY);

            Renderer.drawSprite(GameAssets.monsters, monsterPos, scale, origin, monster.direction * 4 + monster.frameHor, monster.frameVert, 0, false, false, color);
        }
    }

    private static isBlocked(x: number, y: number) {
        const blocked = this._data.blocked;

        for (let i = 0; i < blocked.length; i += 2) {
            const blockedX = blocked[i];
            const blockedY = blocked[i + 1];

            if (blockedX === x && blockedY === y) {
                return true;
            }
        }

        for (let i = 0; i < this._monsters.length; i++) {
            const monster = this._monsters[i];

            if (monster.goalX === x && monster.goalY === y) {
                return true;
            }
        }

        if (x === this._data.width) return true;
        if (y === this._data.height) return true;
        if (x === -1) return true;
        if (y === -1) return true;

        return false;
    }
}