// components
import React, { Component } from 'react'
import GreedySnake from './components/GreedySnake/GreedySnake';
import Sokoban from './components/Sokoban/Sokoban';
import { Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
// 样式
import './GamePage.scss'
import _ from 'lodash';

export default class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snake: false,
            sokoban: false,
        };
    }

    /**
     * 游戏控制器, 两个游戏可以同时关闭, 但是不可以同时开启
     * @param {String} name 
     */
    setStatus = (name) => {
        const anotherGame = (name === 'snake' ? 'sokoban' : 'snake');
         /**
          * 注意这种 object对象的key如何动态变化的修改 ===> 用于记笔记
          */
        if(this.state[name] === false && this.state[anotherGame] === true){
            this.setState({
                [name]: true,
                [anotherGame]: false,
            })
        }else{
            this.setState((prevState) => ({
                [name]: !prevState[name]
            }))
        }
    }

    componentDidMount() {
        // 弹出效果
        setTimeout(() => {
            document.querySelector('.greedy-snake').style.display = 'inline-block';
            document.querySelector('.greedy-snake').style.animation = 'bounceInLeft 2s ease 0s';
            document.querySelector('.sokoban').style.display = 'inline-block';
            document.querySelector('.sokoban').style.animation = 'bounceInRight 2s ease 0s';
        }, 1000)
    }

    render() {
        return (
            <div className='game-page-ctn'>
                <div className='page-title'>
                    <span>欢迎来到我的游戏世界!</span>
                </div>
                <div className='game-container'>
                    <div className='greedy-snake'>
                        {this.state.snake ? // 游戏状态判断
                            <GreedySnake setStatus={this.setStatus}/>
                            :
                            <div className='snake-mask'>
                                <Button
                                    className='snake-stop-button'
                                    ghost
                                    shape="square"
                                    icon={
                                        <PlayCircleOutlined
                                            style={{
                                                fontSize: '25px',
                                                color: 'white'
                                            }}
                                        />
                                    }
                                    onClick={() => {
                                        this.setStatus('snake')
                                    }}
                                />
                            </div>
                        }
                    </div>
                    <div className='sokoban'>
                    {this.state.sokoban ?
                            <Sokoban setStatus={this.setStatus}/>
                            :
                            <div className='sokoban-mask'>
                                <Button
                                    className='sokoban-stop-button'
                                    ghost
                                    shape="square"
                                    icon={
                                        <PlayCircleOutlined
                                            style={{
                                                fontSize: '25px',
                                                color: 'white'
                                            }}
                                        />
                                    }
                                    onClick={() => {
                                        this.setStatus('sokoban')
                                    }}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
