import Point from '../settings/Point'
import MapGoods from '../settings/MapGoods';
import Snake from './Snake';

export default class Map {
    constructor(width = 10, height = 10) {
        this.snake = new Snake();
        this.width = width;
        this.height = height;
        this.world = this.initWorld();
        // 生成一个食物
        this.generateFoodToWorld();
    }

    /**
     * 根据宽高度初始化一个地图的世界
     * @return {[[]]}
     */
    initWorld() {
        const width = this.width;
        const height = this.height;
        const world = [];
        // 全部初始化为 空
        for (let y = 0; y < height; y++) {
            const line = [];
            for (let x = 0; x < width; x++) {
                line.push(MapGoods.BLANK);
            }
            world.push(line);
        }
        // 初始化上下边界
        for (let y = 0; y < height; y++) {
            world[y][0] = MapGoods.BARRIER;
            world[y][width - 1] = MapGoods.BARRIER;
        }
        // 初始化左右边界
        for (let x = 0; x < width; x++) {
            world[0][x] = MapGoods.BARRIER;
            world[height - 1][x] = MapGoods.BARRIER;
        }
        return world;
    }

    /**
     * 像某个方向移动一下蛇
     * @param direction {Direction}
     */
    runStep(direction) {
        if (!this.snake.canMove(direction)) {
            return this;
        }
        // 如果移动后的head的位置吃到了东西
        const headAfterPoint = this.snake.getHeadMovePoint(direction);
        const eatFood = this.snakeEatFood(headAfterPoint);

        // 移动一下蛇的身体
        this.snake.runStep(direction, eatFood);

        // 要是吃了东西，清空原本食物位置，再随机给他新成一个
        if (eatFood) {
            this.world[headAfterPoint.x][headAfterPoint.y] = MapGoods.BLANK;
            this.generateFoodToWorld();
        }
        return this;
    }

    /**
     * 判断蛇是不是死了
     * @param snakeHead {Point} 移动后的蛇头位置，因为每次移动，都是蛇头在最前面，所以只判断蛇头位置就可以
     */
    snakeDead(snakeHead = this.snake.head) {
        // 先判断有没有咬到自己
        for (let i = 0; i < this.snake.body.length; i++) {
            const bodyElement = this.snake.body[i];
            if (bodyElement.x === snakeHead.x && bodyElement.y === snakeHead.y) {
                return true;
            }
        }
        // 再判断撞墙
        return this.world[snakeHead.x][snakeHead.y] === MapGoods.BARRIER;
    }


    /**
     * 判断蛇是不是吃到了东西
     * @param snakeHead {Point} 移动后的蛇头位置，因为每次移动，都是蛇头在最前面，所以只判断蛇头位置就可以
     */
    snakeEatFood(snakeHead) {
        return this.world[snakeHead.x][snakeHead.y] === MapGoods.FOOD;
    }

    /**
     * 将一个随机生成的食物写到地图
     */
    generateFoodToWorld() {
        const foodPoint = this.generateFoodPoint();
        this.world[foodPoint.x][foodPoint.y] = MapGoods.FOOD;
    }

    /**
     * 在地图中随机生成一个食物坐标，不会再墙壁或者snake的位置生成
     * @return {Point}
     */
    generateFoodPoint() {
        let foodPoint;
        // 只要生成的随机点正在被world或者snake使用，就重新生成
        do {
            foodPoint = this.generateRandomPointFromMap();
        } while (this.pointInUsedFromWorld(foodPoint) || this.pointInUsedFromSnake(foodPoint));
        return foodPoint;
    }

    /**
     * 在地图中随机生成一个点
     * @return {Point}
     */
    generateRandomPointFromMap() {
        const randomWidth = Math.round(Math.random() * (this.width - 1));
        const randomHeight = Math.round(Math.random() * (this.height - 1));
        return new Point(randomWidth, randomHeight);
    }

    /**
     * 判断一个点是不是在地图中正在被使用
     * @param point
     * @return {boolean}
     */
    pointInUsedFromWorld(point) {
        return this.world[point.x][point.y] !== MapGoods.BLANK;
    }

    /**
     * 判断一个点是不是在蛇的坐标中正在被使用
     * @param point
     * @return {boolean}
     */
    pointInUsedFromSnake(point) {
        const head = this.snake.head;
        const body = this.snake.body;
        if (point.x === head.x && point.y === head.y) {
            return true;
        }
        for (let i = 0; i < body.length; i++) {
            const bodyElement = body[i];
            if (point.x === bodyElement.x && point.y === bodyElement.y) {
                return true;
            }
        }
        return false;
    }
}