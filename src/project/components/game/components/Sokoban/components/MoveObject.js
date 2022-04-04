// components
import Point from "../settings/Point";
import Direction from "../settings/Direction";
import MapGoods from "../settings/MapGoods";

export default class MoveObject{
    constructor(r = 5, c = 5){
        this.loc = new Point(r, c)
    }
    /**
     * 获取下一位置, 但没有移动
     * @param direction
     * @return {boolean|{x: number, y: number}}
     */
     getNextLoc(direction) {
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

    /**
     * 判断是否可以移动
     * @param {string} direction 
     */
    canMove = (direction, world) => {
        const nextLoc = this.getNextLoc(direction);
       if(
           world[nextLoc.r][nextLoc.c] !== MapGoods.BARRIER && 
           world[nextLoc.r][nextLoc.c] !== MapGoods.BOX &&
           world[nextLoc.r][nextLoc.c] !== MapGoods.ACHIEVE){
           return true
       }else{
           return false
       }

    }

    /**
     * 移动一步
     * @param {string} direction 
     */
    moveStep = (direction) => {
        const nextLoc = this.getNextLoc(direction)
        this.loc = nextLoc
    }

}