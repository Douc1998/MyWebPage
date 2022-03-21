import React, { Component } from 'react';
import "./Sokoban.scss";
import { Button } from 'antd';

const TYP = {
    normal: 1,
    head: 2,
    body: 3,
    food: 4
};
const DIRCTION = {
    top: 1,
    bottom: 2,
    left: 3,
    right: 4
}

export default class Sokoban extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    render() {
        return (
            <div className="Sokoban">
                <div className='game-title'>
                    <span>推箱子</span>
                </div>
                <div className="box">
                    占位
                </div>
                <div className='score-text'>
                    <span>当前得分：{this.state.count}</span>
                </div>
                <div className='button-group' >
                    <Button >开始游戏</Button>
                    <Button >暂停游戏</Button>
                    <Button >重新开始</Button>
                </div>
            </div>
        );
    }

}