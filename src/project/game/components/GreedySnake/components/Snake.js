// 需要用到的静态类
import Point from "../settings/Point";
import Direction from '../settings/Direction'

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

    // 判断是否可以移动 => 主要考虑 “掉头就走” 的情况
    canMove = (direction) => {
        const [head, neck] = [this.head, this.body[0]];
        // 游戏开始 => 只有头没有身体时, 无论向哪个方向都可以走
        if (neck === null) {
            return true;
        }

        // 游戏过程中 => 有头 有身体
        switch (direction) {
            case Direction.UP: // 头在身体下边时, 不能向上移动
                return !(head.y - 1 === neck.y)
            case Direction.DOWN: // 头在身体上边时, 不能向下移动
                return !(head.y + 1 === neck.y)
            case Direction.LEFT: // 头在身体右边时, 不能向左移动
                return !(head.x - 1 === neck.x)
            case Direction.RIGHT: // 头在身体左边时, 不能想右移动
                return !(head.x + 1 === neck.x)
            default:
                return true
        }
    }

    /**
       * 像某个方向移动一下蛇。
       * @param direction {Direction}
       * @param eatFood {boolean} 是否插吃到了食物
       */
    runStep(direction, eatFood) {
        const head = this.head;
        const body = this.body;
        const neck = this.body[0];
        if (!this.canMove(direction)) {
            return;
        }

        // 如果它吃了东西，这个是原来尾巴的位置。(没有body，那就是头的位置)
        const oldTail = body.length === 0 ? head : [body.length - 1];
        // 首先将蛇身倒序依次向前移动
        for (let i = body.length - 1; i >= 1; i--) {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y;
        }
        // 如果有脖子，脖子位置移动到蛇头
        if (neck != null) {
            neck.x = head.x;
            neck.y = head.y;
        }

        // 如果吃到了东西，新增长度就是原来尾巴的位置
        if (eatFood) {
            body.push(oldTail);
        }

        // 蛇头根据方向移动
        this.moveHead(direction);
    }

    /**
     * 移动蛇头，并且返回蛇头的位置
     * @param direction {Direction}
     */
    moveHead(direction) {
        this.head = this.getHeadMovePoint(direction);
    }

    /**
     * 获取移动后的head的坐标(并没有真的移动，只是看一下到了哪里)
     * @param direction
     * @return {boolean|{x: number, y: number}}
     */
    getHeadMovePoint(direction) {
        const realHead = this.head;
        const head = new Point(realHead.x, realHead.y);

        if (!this.canMove(direction)) {
            return head;
        }

        switch (direction) {
            case Direction.UP:
                head.y -= 1;
                break;
            case Direction.DOWN:
                head.y += 1;
                break;
            case Direction.LEFT:
                head.x -= 1;
                break;
            case Direction.RIGHT:
                head.x += 1;
                break;
            default:
                return true;
        }

        return head;
    }

}