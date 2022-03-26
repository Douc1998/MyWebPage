import Point from '../settings/Point'
import MapGoods from '../settings/MapGoods';
import Snake from './Snake';
import _ from 'lodash';

export default class Map {
    constructor(rows = 20, cols = 20) {
        this.snake = new Snake();
        this.rows = rows;
        this.cols = cols;
        this.world = this.initWorld();
        this.initFood();
    }

    /**
     * 根据宽高度初始化一个地图的世界
     * @return {[[]]}
     */
    initWorld() {
        const rows = this.rows;
        const cols = this.cols;
        const snake = this.snake;
        const world = [];
        // 全部初始化为 空
        for (let r = 0; r < rows; r++) {
            const line = [];
            for (let c = 0; c < cols; c++) {
                line.push(MapGoods.BLANK);
            }
            world.push(line);
        }
        // 初始化上下边界
        for (let c = 0; c < cols; c++) {
            world[0][c] = MapGoods.BARRIER;
            world[rows - 1][c] = MapGoods.BARRIER;
        }
        // 初始化左右边界
        for (let r = 0; r < rows; r++) {
            world[r][0] = MapGoods.BARRIER;
            world[r][cols - 1] = MapGoods.BARRIER;
        }

        // 初始化蛇 头 / 身
        world[snake.head.r][snake.head.c] = MapGoods.SNAKE_HEAD;
        _.forEach(snake.body, (item) => {
            world[item.r][item.c] = MapGoods.SNAKE_BODY;
        })

        return world;
    }

    /**
     * 像某个方向移动一下蛇
     * @param direction {Direction}
     */
    nextStep(direction) {
        const rows = this.rows;
        const cols = this.cols;
        const snake = this.snake;
        const world = this.world;

        // 如果移动后的head的位置吃到了东西
        const nextHead = snake.getNextHead(direction);
        const eatFood = this.snakeEatFood(nextHead);

        // 移动蛇的身体 并 记录
        snake.moveStep(direction, eatFood);

        // 要是吃了东西，清空原本食物位置，再随机给他新成一个
        if (eatFood) {
            // 重新构建地图
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    // 如果不是边界, 则全部设置为BLANK
                    if (world[r][c] !== MapGoods.BARRIER) {
                        world[r][c] = MapGoods.BLANK
                    }
                }
            }
            let foodPoint = this.addFoodToWorld();
            world[foodPoint.r][foodPoint.c] = MapGoods.FOOD
        }
        // 如果没吃食物, 把其他的地方重新绘制, 边界和食物不修改
        else{
            // 重新构建地图
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    // 如果不是边界, 则全部设置为BLANK
                    if (world[r][c] !== MapGoods.BARRIER && world[r][c] !== MapGoods.FOOD) {
                        world[r][c] = MapGoods.BLANK
                    }
                }
            }
        }

        // 在新地图上设置蛇的位置, 头 and 身体
        world[snake.head.r][snake.head.c] = MapGoods.SNAKE_HEAD;
        console.log(snake.head, snake.body)
        _.forEach(snake.body, (item) => {
            world[item.r][item.c] = MapGoods.SNAKE_BODY;
        })
        return this;
    }

    /**
     * 判断蛇是不是死了
     * @param isHead {direction} 移动后的蛇头位置，因为每次移动，都是蛇头在最前面，所以只判断蛇头位置就可以
     */
    isDead(direction) {
        const { head, body } = this.snake; // 获取当前蛇的位置
        const nextHead = this.snake.getNextHead(direction); // 获取蛇头的下一位置(当时还没移动)
        // 先判断有没有咬到自己
        _.forEach(body, (item) => {
            if (nextHead.r === item.r && nextHead.c === item.c) {
                return true;
            }
        })
        // 判断有没有撞墙
        return this.world[nextHead.r][nextHead.c] === MapGoods.BARRIER;
    }


    /**
     * 判断蛇是不是吃到了东西
     * @param snakeHead {Point} 移动后的蛇头位置，因为每次移动，都是蛇头在最前面，所以只判断蛇头位置就可以
     */
    snakeEatFood(snakeHead) {
        return this.world[snakeHead.r][snakeHead.c] === MapGoods.FOOD;
    }

    // 初始化食物
    initFood() {
        // 初始化食物
        let foodPoint = this.addFoodToWorld()
        this.world[foodPoint.r][foodPoint.c] = MapGoods.FOOD
    }

    /**
     * 在地图中随机生成一个食物坐标，不会再墙壁或者snake的位置生成
     * @return {Point}
     */
    addFoodToWorld() {
        let foodPoint;
        // 只要生成的随机点正在被world或者snake使用，就重新生成
        do {
            foodPoint = this.getRandomPoint();
        } while (!this.isPointBlank(foodPoint));
        return foodPoint;
    }

    /**
     * 在地图中随机生成一个点
     * @return {Point}
     */
    getRandomPoint() {
        const r = Math.round(Math.random() * (this.rows - 1));
        const c = Math.round(Math.random() * (this.cols - 1));
        console.log(r, c)
        return new Point(r, c);
    }

    /**
     * 判断一个点有没有被使用
     * @param point
     * @return {boolean}
     */
    isPointBlank(point) {
        return this.world[point.r][point.c] === MapGoods.BLANK;
    }
}