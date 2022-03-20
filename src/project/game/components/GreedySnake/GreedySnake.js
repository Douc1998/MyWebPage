import React, {Component} from 'react';
import Map from "./components/Map";
import Direction from "./settings/Direction";
import MapGoods from "./settings/MapGoods";

/**
 * 这个组件负责调用{@link Map}类型接口去运行游戏，并且将结果反馈到canvas画布
 */

class GreedySnake extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        const {mapWidth, mapHeight, mapSpeedInterval} = this.props;
        this.state = {
            Map: new Map(mapWidth ? mapWidth : 20, mapHeight ? mapHeight : 20),
            // 移动方向
            moveDirection: Direction.RIGHT,
            // 游戏是否开始
            start: false,
            // 游戏速度
            speedInterval: mapSpeedInterval ? mapSpeedInterval : 200
        };
    }

    /**
     * 组件初始化时候为窗口添加键盘事件监听，并且先画出来一个默认的地图
     */
    componentDidMount() {
        const that_ = this;
        window.addEventListener('keypress', function (e) {
            const direction = that_.numberToDirection(e.which);
            if (!that_.reverseDirection(direction, that_.state.moveDirection) && direction !== Direction.INVALID) {
                that_.setState({
                    start: true,
                    moveDirection: direction
                });
            }
        });
        this.refreshUI();
        setTimeout(this.iTimer, 0);
    }

    /**
     * 判断两个操作是不是反向
     * @param directionA
     * @param directionB
     */
    reverseDirection(directionA, directionB) {
        switch (directionA) {
            case Direction.UP:
                return directionB === Direction.DOWN;
            case Direction.DOWN:
                return directionB === Direction.UP;
            case Direction.LEFT:
                return directionB === Direction.RIGHT;
            case Direction.RIGHT:
                return directionB === Direction.LEFT;
            default:
                return false;
        }
    }

    /**
     * 组件清除时清除定时器
     */
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    /**
     * 定时器
     */
    iTimer = () => {
        const that_ = this;
        this.timer = setInterval(() => {
            const {moveDirection, start} = that_.state;
            if (start) {
                that_.move(moveDirection);
            }
        }, that_.state.speedInterval);
    };

    /**
     * 在修改完地图以后不会更改UI，必须调用本方法才会刷新UI
     */
    refreshUI() {
        const {Map} = this.state;
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        const {canvasWidth, canvasHeight} = this.props;
        [canvas.width, canvas.height] = [canvasWidth, canvasHeight];
        [ctx.width, ctx.height] = [canvas.width, canvas.height];
        this.drawMapToCanvas(Map, ctx);

        // 画完图判断一下蛇是不是死了是
        if (Map.snakeDead()) {
            this.doDead();
        }
    }

    /**
     * 执行移动操作，键盘事件调用的就是这个地方
     * @param direction
     */
    move(direction) {
        const newMap = this.state.Map.runStep(direction);
        const snakeDead = newMap.snakeDead();

        this.setState({
            Map: newMap,
            start: !snakeDead
        }, () => {
            this.refreshUI();
        });
    }// 119 115 97 100

    /**
     * 键盘的key转换成方向的操作
     * @param num
     * @return {string}
     */
    numberToDirection(num) {
        switch (num) {
            case 119:
                return Direction.UP;
            case 115:
                return Direction.DOWN;
            case 97:
                return Direction.LEFT;
            case 100:
                return Direction.RIGHT;
            default:
                return Direction.INVALID;
        }
    }

    /**
     * 将贪吃蛇游戏地图画到画布上面
     * @param Map
     * @param ctx
     */
    drawMapToCanvas(Map, ctx) {
        if (Map == null || ctx == null) {
            return;
        }
        this.clearCtx(ctx, 'white');
        this.drawWorld(Map, Map.world, ctx);
        this.drawSnake(Map, Map.snake, ctx);
    }

    /**
     * 清空画板
     */
    clearCtx(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, ctx.width, ctx.height);
    }

    /**
     * 画出来背景世界
     * @param Map
     * @param world
     * @param ctx
     */
    drawWorld(Map, world, ctx) {
        // 计算出来单元格大小
        const girdWidth = ctx.width / Map.width;
        const girdHeight = ctx.height / Map.height;

        for (let y = 0; y < world.length; y++) {
            for (let x = 0; x < world[y].length; x++) {
                const goodsEnum = world[x][y];
                switch (goodsEnum) {
                    case MapGoods.BLANK:
                        ctx.fillStyle = "white";
                        break;
                    case MapGoods.BARRIER:
                        ctx.fillStyle = "#99FFFF";
                        break;
                    case MapGoods.FOOD:
                        ctx.fillStyle = "red";
                        break;
                    default:
                        ctx.fillStyle = "white";
                }
                ctx.fillRect(x * girdWidth, y * girdHeight, girdWidth, girdHeight);
            }
        }
    }

    /**
     * 画出来蛇
     * @param Map
     * @param snake
     * @param ctx
     */
    drawSnake(Map, snake, ctx) {
        // 计算出来单元格大小
        const girdWidth = ctx.width / Map.width;
        const girdHeight = ctx.height / Map.height;

        // 画出来蛇头
        const head = snake.head;
        ctx.fillStyle = "#99FF66";
        ctx.fillRect(head.x * girdWidth, head.y * girdHeight, girdWidth, girdHeight);

        // 画出来蛇身子
        ctx.fillStyle = "#CCFF99";
        const body = snake.body;
        for (let i = 0; i < body.length; i++) {
            const bodyGird = body[i];
            ctx.fillRect(bodyGird.x * girdWidth, bodyGird.y * girdHeight, girdWidth, girdHeight);
        }
    }

    /**
     * 蛇死了之后做的事情
     */
    doDead() {
        alert("oh，天呐，我的小笨蛋，你的蛇死了，你要重新开始吗？其实你没得选，在你点完确定以后我就要刷新地图了~");
        const {mapWidth, mapHeight, mapSpeedInterval} = this.props;
        this.setState({
            Map: new Map(mapWidth ? mapWidth : 20, mapHeight ? mapHeight : 20),
            moveDirection: Direction.RIGHT,
            speedInterval: mapSpeedInterval ? mapSpeedInterval : 200
        }, this.refreshUI);
    }

    render() {
        return (
            <div>
                <canvas className=''
                    ref={this.canvas}
                    style={{border: '2px solid black'}}
                />
            </div>
        );
    }
}

export default GreedySnake;

