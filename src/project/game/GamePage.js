// 组件
import React, { Component } from 'react'

// 样式
import './GamePage.scss'

export default class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className='game-page-ctn'>
                <div className='page-title'>
                    <span>欢迎来到我的游戏世界!</span>
                </div>
                <div className='game-container'>
                    <div className='greedy-snake'>this is greedy snake</div>
                    <div className='sokoban'>this is sokoban</div>
                </div>
            </div>
        )
    }
}