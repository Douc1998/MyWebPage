import React, { Component } from 'react'
import Map from './components/Map';
import MapGoods from './settings/MapGoods';
import Direction from './settings/Direction';
import './Sokoban.scss';
import { Button } from 'antd';

export default class Sokoban extends Component {
    constructor(props) {
        super(props)
        this.game = React.createRef();
        this.state = {
            Map: new Map(10, 10),
            score: 0,
        }
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

    // 根据属性不同绘制不同样式
    getClass = (item) => {
        switch (item) {
            case MapGoods.PLAYER:
                return 'player';
            case MapGoods.BOX:
                return 'box';
            case MapGoods.REWARD:
                return 'reward';
            case MapGoods.ACHIEVE:
                return 'achieve';
            case MapGoods.BARRIER:
                return 'barrier';
            case MapGoods.BLANK:
                return 'blank'
        }
    }

    /**
     * 键盘监听事件
     * @param event 
     */
    keyDown = (event) => {
        const direction = this.keyCodeToDirection(event);
        const newMap = this.state.Map.nextStep(direction);
        const score = newMap.achieves.length;
        this.setState({
            Map: newMap,
            score: score
        }, this.reRender)
    }

    // 重新开始
    restart = () => {
        this.setState({
            Map: new Map(10, 10),
            score: 0
        }, this.reRender);
    }

    // 箱子全部推进去 进入下一关
    nextGame = () => {
        alert('你通关了 !!!');
        this.restart();
    }

    // 初始化
    componentDidMount() {
        // 键盘监听事件
        window.addEventListener('keypress', this.keyDown);
        // 初始化地图
        this.reRender();
    }

    // 渲染完成后判断
    componentDidUpdate(){
        if(this.state.score === 4){
            setTimeout(() => {
                this.nextGame()
            }, 800)
        }
    }
    // 组件销毁前
    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyDown);
    }

    render() {
        return (
            <div className="sokoban-container">
                <div className='game-title'>
                    <span>推箱子</span>
                </div>
                <div className="map" ref={this.game} />
                <div className='score-text'>
                    <span>当前得分：{this.state.score}</span>
                </div>
                <div className='button-group' >
                    <Button onClick={this.restart}>重新开始</Button>
                    <Button>下一关</Button>
                </div>
            </div>
        )
    }
}
