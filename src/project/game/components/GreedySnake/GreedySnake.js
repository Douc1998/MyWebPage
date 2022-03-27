import React, { Component } from 'react';
import Map from "./components/Map";
import Direction from "./settings/Direction";
import MapGoods from "./settings/MapGoods";
import './GreedySnake.scss';
import { Button } from 'antd';

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
            // 游戏速度
            speedInterval: 360
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
        const { start, moveDirection } = this.state;
        if (start === false) { // 游戏没开始, 只要按上下左右就可以动
            this.setState({
                start: true,
                moveDirection: direction
            })
        } else { // 游戏过程中, 要判断是否可以改变方向
            if (this.canChangeDirection(moveDirection, direction) && direction !== Direction.INVALID) {
                this.setState({
                    moveDirection: direction
                });
            }
        }
    }

    // 刷新 重新渲染 => 动态添加div子元素
    reRender = () => {
        const divDom = this.game.current;
    }

    /**
     * 执行移动操作，键盘事件调用的就是这个地方
     * @param direction
     */
    move(direction) {
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
            this.setState({
                Map: newMap
            }, this.reRender)
        }
    }

    // 蛇死了之后 重新初始化
    gameOver() {
        alert('Game Over !!!');
        const { mapWidth, mapHeight, mapSpeedInterval } = this.props;
        this.setState({
            Map: new Map(mapWidth ? mapWidth : 20, mapHeight ? mapHeight : 20),
            start: false,
            moveDirection: Direction.RIGHT,
            speedInterval: mapSpeedInterval ? mapSpeedInterval : 200
        }, this.reRender);
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
            <div className="Snake">
                <div className='game-title'>
                    <span>贪吃蛇</span>
                </div>
                <div className="box" ref={this.game}>
                    {
                        this.state.Map.world.map((item, index) => {
                            return <div className="cols" key={index} >
                                {
                                    item.map((itm, idx) => {
                                        return <div className={this.getClass(itm)} key={index + '-' + idx} ></div>
                                    })
                                }</div>
                        })
                    }
                </div>
                <div className='score-text'>
                    <span>当前得分：{this.state.count}</span>
                </div>
                <div className='button-group' >
                    <Button onClick={this.mainTimer}>开始游戏</Button>
                    <Button >暂停游戏</Button>
                    <Button >重新开始</Button>
                </div>
            </div>
        );
    }
}

export default GreedySnake;

