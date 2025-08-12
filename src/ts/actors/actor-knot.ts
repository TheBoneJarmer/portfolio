import { Actor, Assets } from "lunanore";

export class ActorKnot extends Actor {
    constructor() {
        super("knot", Assets.getModel("knot"));
    }

    public async update(dt: number) {
        this.rotation.y += dt;
    }
}