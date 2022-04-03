import Point from "../settings/Point";
import Direction from "../settings/Direction";

export default class MoveObject{
    constructor(r = 10, c = 10){
        this.loc = new Point(r, c)
    }
    /**
     * 获取下一位置
     * @param direction
     * @return {boolean|{x: number, y: number}}
     */
     getNextHead(direction) {
        // 获取当前位置
        const realLoc = this.loc
        const nextLoc = new Point(realLoc.r, realLoc.c);
        switch (direction) {
            case Direction.UP:
                nextLoc.r -= 1;
                break;
            case Direction.DOWN:
                nextLoc.r += 1;
                break;
            case Direction.LEFT:
                nextLoc.c -= 1;
                break;
            case Direction.RIGHT:
                nextLoc.c += 1;
                break;
        }

        return nextLoc;
    }
}