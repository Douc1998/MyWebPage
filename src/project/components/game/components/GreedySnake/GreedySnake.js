import React, { Component } from 'react';
// components
import Map from "./components/Map";
import Direction from "./settings/Direction";
import MapGoods from "./settings/MapGoods";
import { Button } from 'antd';
// style 
import './GreedySnake.scss';

class GreedySnake extends Component {
    constructor(props) {
        super(props);
        this.game = React.createRef();
        this.timer = null;
        this.state = {
            Map: new Map(20, 20),
            // 移动方向
            moveDirection: Direction.RIGHT,
            // 游戏是否开始
            start: false,
            // 游戏得分
            score: 0,
            // 游戏速度
            speedInterval: 400,
        };
    }

    /**
     * 键盘的键码 w(119) a(97) s(115) d(100) 转换成方向的操作
     * @param event
     * @return {string}
     */
    keyCodeToDirection = (event) => {
        const e = event || window.event; // 捕获事件
        const k = e.keyCode || e.which; // 获取键码
        switch (k) {
            case 97:
                return Direction.LEFT;
            case 119:
                return Direction.UP;
            case 100:
                return Direction.RIGHT;
            case 115:
                return Direction.DOWN;
            case 32:
                return 'Stop';
            default:
                return Direction.INVALID;
        }
    }


    /**
     * 判断是否可以转向 => 主要考虑 “掉头就走” 的情况
     * @param oldDirection
     * @param newDirection
     * @return {Boolean}
     */
    canChangeDirection = (oldDirection, newDirection) => {
        switch (oldDirection) {
            case Direction.UP:
                return !(newDirection === Direction.DOWN);
            case Direction.DOWN:
                return !(newDirection === Direction.UP);
            case Direction.LEFT:
                return !(newDirection === Direction.RIGHT);
            case Direction.RIGHT:
                return !(newDirection === Direction.LEFT);
            default:
                return false;
        }
    }

    /**
     * 定时器, 游戏开始之后 蛇会自动跑
     */
    myTimer = () => {
        // setInterval会在一定间隔内不断执行其中的function
        this.timer = setInterval(() => {
            const { moveDirection, start } = this.state;
            if (start) {
                this.move(moveDirection);
            }
        }, this.state.speedInterval);
    };

    // 键盘监听事件
    keyDown = (event) => {
        const direction = this.keyCodeToDirection(event); // 按下的方向
        const { start, moveDirection, Map } = this.state;

        // 如果按下的是空格键, 则游戏暂停
        if (direction === 'Stop') {
            this.stopGame()
        }

        // 判断蛇的长度, 如果只有头的话, 随便往哪走都可以动
        const snakeBodyLength = Map.snake.body.length;

        // 如果是在游戏过程中
        if (start === true) {
            // 如果按键不是无效按键 或者 空格键
            if (direction !== 'Stop' && direction !== Direction.INVALID) {
                // 如果只有头, 随便走
                if (snakeBodyLength === 0) {
                    this.setState({
                        moveDirection: direction
                    })
                } else { // 如果有身子, 要判断是否反向
                    if (this.canChangeDirection(moveDirection, direction)) {
                        this.setState({
                            moveDirection: direction
                        })
                    }
                }
            }
        } else { // 如果是暂停
            if (direction === 'Stop') {
                this.setState({
                    start: true
                })
            } else {
                if (direction !== Direction.INVALID) {
                    // 如果只有头, 随便走
                    if (snakeBodyLength === 0) {
                        this.setState({
                            start: true,
                            moveDirection: direction
                        })
                    } else { // 如果有身子, 要判断是否反向
                        if (this.canChangeDirection(moveDirection, direction)) {
                            this.setState({
                                start: true,
                                moveDirection: direction
                            })
                        }
                    }
                }
            }
        }

    }

    // 刷新 重新渲染 => 动态添加div子元素
    reRender = () => {
        const divDom = this.game.current;
        divDom.innerHTML = ''; // 清除当前dom节点内容 
        // 重新渲染
        this.state.Map.world.forEach((item, index) => {
            let cols = document.createElement('div');
            cols.className = 'cols';
            cols.key = index;
            item.forEach((itm, idx) => {
                let grid = document.createElement('div');
                grid.className = this.getClass(itm);
                grid.key = index + '-' + idx;
                cols.appendChild(grid)
            })
            divDom.appendChild(cols)
        })
    }

    /**
     * 执行移动操作，键盘事件调用的就是这个地方
     * @param direction
     */
    move = (direction) => {
        const { Map } = this.state;
        const isDead = Map.isDead(direction);
        /**
         * 判断蛇是否dead, 
         * true => 不重新渲染, 直接弹出 gameover !
         * false => 重新渲染下一step的Map
         * */
        if (isDead) {
            console.log('dead!');
            this.gameOver();
        } else {
            let newMap = Map.nextStep(direction);
            // 因为body长度从0开始, 所以body的长度就是得分
            let snakeBodyLength = Map.snake.body.length;
            // 判断是否吃到食物, 确定速度
            let flag = (this.state.score === snakeBodyLength);
            let speedInterval = flag ? this.state.speedInterval :
                (this.state.speedInterval === 50) ? 50 : (this.state.speedInterval - 10)
            
            this.setState({
                score: snakeBodyLength,
                Map: newMap,
                speedInterval: speedInterval
            }, () => {
                this.reRender();
                // 如果得分变了, 即吃到了食物, 则要修改定时器
                if (flag === false) {
                    clearInterval(this.timer); // 清除interval
                    setTimeout(this.myTimer, 0); // 重新启用新的speed的interval
                }
                console.log(this.state.speedInterval)
            })
        }
    }

    // 暂停游戏
    stopGame = () => {
        this.setState({
            start: false,
        })
    }

    // 重新开始
    restart = () => {
        const { mapWidth, mapHeight, mapSpeedInterval } = this.props;
        this.setState({
            Map: new Map(mapWidth ? mapWidth : 20, mapHeight ? mapHeight : 20),
            start: false,
            moveDirection: Direction.RIGHT,
            speedInterval: mapSpeedInterval ? mapSpeedInterval : 400
        }, this.reRender);
    }

    // 蛇死了之后 重新初始化
    gameOver() {
        alert('Game Over !!!');
        this.restart()
    }

    // 根据属性不同绘制不同样式
    getClass = (item) => {
        switch (item) {
            case MapGoods.SNAKE_HEAD:
                return 'head';
            case MapGoods.SNAKE_BODY:
                return 'body';
            case MapGoods.FOOD:
                return 'food';
            case MapGoods.BARRIER:
                return 'barrier';
            case MapGoods.BLANK:
                return 'blank'
        }
    }

    /**
     * 组件初始化时候为窗口添加键盘事件监听，并且先画出来一个默认的地图
     */
    componentDidMount() {
        // 键盘监听事件
        window.addEventListener('keypress', this.keyDown);
        // 初始化地图
        this.reRender();
        // 同步代码转异步代码, 调配优先级不高的代码靠后执行
        setTimeout(this.myTimer, 0);
    }

    /**
     * 组件清除时 清除 定时器 和 监听函数
     */
    componentWillUnmount() {
        clearInterval(this.timer);
        window.removeEventListener('keydown', this.keyDown)
    }

    render() {
        return (
            <div className="snake-container">
                <div className='game-title'>
                    <span>贪吃蛇</span>
                </div>
                <div className="map" ref={this.game} />
                <div className='score-text'>
                    <span>当前得分：{this.state.score}</span>
                </div>
                <div className='button-group' >
                    <Button onClick={() => {
                        this.setState({
                            start: true
                        })
                    }}>开始游戏</Button>
                    <Button onClick={this.stopGame}>暂停游戏</Button>
                    <Button onClick={this.restart}>重新开始</Button>
                </div>
            </div>
        );
    }
}

export default GreedySnake;

