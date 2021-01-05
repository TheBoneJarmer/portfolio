const GameAssets = {
    map: null,
    monsters: null,

    scale: 3,
    size: 16,

    init: async () => {
        if (window.innerWidth < 768) {
            GameAssets.scale = 2;
        }

        GameAssets.map = await AssetLoader.loadSprite("assets/map.png", 1, 1, 0, 0, GameAssets.scale, GameAssets.scale);
        GameAssets.monsters = await AssetLoader.loadSprite("assets/monsters.png", 16, 11, 0, 0, GameAssets.scale, GameAssets.scale);
    }
}

const GameMap = {
    data: null,
    monsters: [],

    viewX: 0,
    viewY: 0,

    init: async () => {
        const res = await fetch("assets/map-data.json").catch((err) => console.error(err));

        if (res.ok) {
            GameMap.data = await res.json();
        } else {
            console.error("Unable to load map data");
        }

        for (let i=0; i<15; i++) {
            let x = 0;
            let y = 0;
            let frameHor = 0;
            let frameVert = Math.floor(Math.random() * 3);
            let direction = Math.floor(Math.random() * 4);

            // Generate a random location
            do {
                x = Math.floor(Math.random() * GameMap.data.width);
                y = Math.floor(Math.random() * GameMap.data.height);
            }
            while (await GameMap.isblocked(x, y))

            GameMap.monsters[i] = {
                x: x,
                y: y,
                goalx: x,
                goaly: y,
                direction: direction,
                frameHor: frameHor,
                frameVert: frameVert,

                moveTimer: 0,
                frameTimer: 0
            }
        }
    },
    update: async () => {
        for (let i=0; i<GameMap.monsters.length; i++) {
            const monster = GameMap.monsters[i];
            const speed = 0.025;

            if (monster.moveTimer <= 0) {
                 const direction = Math.floor(Math.random() * 4);
                 let goalx = monster.goalx;
                 let goaly = monster.goaly;

                if (direction == 0) goaly++;
                if (direction == 1) goaly--;
                if (direction == 2) goalx++;
                if (direction == 3) goalx--;

                if (!await GameMap.isblocked(goalx, goaly)) {
                    monster.direction = direction;
                    monster.goalx = goalx;
                    monster.goaly = goaly;
                }

                monster.moveTimer = 100 + (Math.random() * 100);
            } else {
                monster.moveTimer--;
            }

            if (monster.x > monster.goalx + speed) {
                monster.x -= speed;
            } else if (monster.x < monster.goalx - speed) {
                monster.x += speed;
            } else {
                monster.x = monster.goalx;
            }

            if (monster.y > monster.goaly + speed) {
                monster.y -= speed;
            } else if (monster.y < monster.goaly - speed) {
                monster.y += speed;
            } else {
                monster.y = monster.goaly;
            }

            if (monster.x != monster.goalx || monster.y != monster.goaly) {
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
    },
    render: async () => {
        GameAssets.map.render(-GameMap.viewX, -GameMap.viewY, 0, 0, 0, 255, 255, 255, 255);

        for (let i=0; i<GameMap.monsters.length; i++) {
            const monster = GameMap.monsters[i];
            const sprite = GameAssets.monsters;

            const monsterX = (monster.x * GameAssets.size * GameAssets.scale) - GameMap.viewX;
            const monsterY = (monster.y * GameAssets.size * GameAssets.scale) - GameMap.viewY;

            sprite.render(monsterX, monsterY, (monster.direction * 4) + monster.frameHor, monster.frameVert, 0, 255, 255, 255, 255);
        }
    },

    isblocked: async (x, y) => {
        const blocked = GameMap.data.blocked;

        for (let i=0; i<blocked.length; i+=2) {
            const blockedX = blocked[i + 0];
            const blockedY = blocked[i + 1];

            if (blockedX == x && blockedY == y) {
                return true;
            }
        }

        for (let i=0; i<GameMap.monsters.length; i++) {
            const monster = GameMap.monsters[i];

            if (monster.goalx == x && monster.goaly == y) {
                return true;
            }
        }

        if (x == GameMap.data.width) return true;
        if (y == GameMap.data.height) return true;
        if (x == -1) return true;
        if ( y == -1) return true;

        return false;
    }
}

const Game = {
    init: async () => {
        await Arqanore.init();
        await GameAssets.init();
        await GameMap.init();
    },
    resize: async () => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        const mapWidth = GameMap.data.width * GameAssets.scale * GameAssets.size;
        const mapHeight = GameMap.data.height * GameAssets.scale * GameAssets.size;
        
        if (height < 300) height = 300;
        if (height > 600) height = 600;

        canvas.width = width;
        canvas.height = height;

        if (mapWidth > width) {
            GameMap.viewX = (mapWidth - width) / 2;
        }
        if (mapHeight > height) {
            GameMap.viewY = (mapHeight - height) / 2;
        }
    },
    sync: async () => {
        await Camera.render();

        await GameMap.update();
        await GameMap.render();

        requestAnimationFrame(Game.sync);
    }
}

window.addEventListener("load", async () => {
    await Game.init();
    await Game.resize();
    await Game.sync();
});
window.addEventListener("resize", async () => {
    await Game.resize();
});