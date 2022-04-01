// components
import Point from "../settings/Point";
import Direction from '../settings/Direction';
// 库
import _ from 'lodash';

export default class Snake {
    /**
     * snake params (可以自定义生生成)
     * @param {Point} head - 蛇的头
     * @param {Array} body - 蛇的身体
     */
    constructor(head = new Point(2, 2), body = []) {
        this.head = head;
        this.body = body;
    }

    /**
     * 像某个方向移动一下蛇。
     * @param direction {Direction}
     * @param eatFood {boolean} 是否吃到了食物
     */
    moveStep(direction, eatFood) {
        const head = this.head;
        const body = this.body;
        const neck = this.body[0];
        // 记录蛇身的尾巴, 用于后续插入到body数组中

        /**
         * 敲重点!!! 必须是 深拷贝 才行, 不然oldTail记录的只是body[-1]的地址, 在后面倒序前移的时候, oldTail也会跟着改变!!!
         */

        const oldTail = body.length === 0 ? head : _.cloneDeep(body[body.length - 1]);

        // 首先将蛇身倒序依次向前移动
        for (let i = body.length - 1; i > 0; i--) {
            body[i].r = body[i - 1].r;
            body[i].c = body[i - 1].c;
        }
        // 如果蛇长度不为1, 即有body => 脖子位置移动到蛇头
        if (neck != null) {
            neck.r = head.r;
            neck.c = head.c;
        }
 
        // 如果吃到了东西，新增长度就是原来尾巴的位置
        if (eatFood) {
            body.push(oldTail);
        }
        
        // 蛇头根据方向移动
        this.head = this.getNextHead(direction)
    }

    /**
     * 获取下一步 蛇头 运动的位置
     * @param direction
     * @return {boolean|{x: number, y: number}}
     */
    getNextHead(direction) {
        const realHead = this.head;
        const nextHead = new Point(realHead.r, realHead.c);

        switch (direction) {
            case Direction.UP:
                nextHead.r -= 1;
                break;
            case Direction.DOWN:
                nextHead.r += 1;
                break;
            case Direction.LEFT:
                nextHead.c -= 1;
                break;
            case Direction.RIGHT:
                nextHead.c += 1;
                break;
        }

        return nextHead;
    }

}