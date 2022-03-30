import React, { Component } from 'react';
import { Button } from 'antd';
import './Index.scss';
import { githublogo, QQ, wechat, weibo, about } from '../../icon';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import 'animate.css';

// app跳转小组件封装
const AppLink = (props) => (
    <a
        href={props.url}
        target="view_window"
        rel="noopener noreferrer"
    >
        <img className='item' src={props.img} />
    </a>
)

// app跳转数据
const appItem = [
    { key: 0, url: 'https://im.qq.com/index', img: QQ },
    { key: 1, url: 'https://weixin.qq.com/', img: wechat },
    { key: 2, url: 'https://weibo.com/u/7075317665/home?wvr=5', img: weibo },
    { key: 3, url: 'https://github.com/Douc1998', img: about }
]

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // App跳转组件
    createItem = (item) => {
        return (
            <AppLink key={item.key} url={item.url} img={item.img} />
        )
    }

    /**
     * @param {学习笔记占位 => 这一部分只是为了学习 “重复播放动画” 的功能} 
     * @param {point1 点击添加 “文字动态消失” 的动画效果}
     * @param {ps: 写完笔记就删}
     * */

    // 点击 实现元素的 退出动画
    buttonAnimate = () => {
        // 设定animation动画属性, 实现又一次动画
        document.querySelector('.text').style.animation = 'zoomOutDown 2.5s';
        // 设定与 animation-duration相同的时间, 实现动画结束, 元素隐藏
        setTimeout(() => {
            // 隐藏元素
            document.querySelector('.text').style.visibility = 'hidden';
        }, 2500)
    }

    // 
    componentDidMount() {
        console.log('index page');
        /**
         * @param {学习笔记占位 => 这一部分只是为了学习 “重复播放动画” 的功能} 
         * @param {point2 在初始动画结束后, 删除动画效果} 
         * */
        // 为了后续点击事件能够再一次触发动画, 在初始动画结束后, 清除动画
        document.querySelector('.text').addEventListener('animationend', () => {
            document.querySelector('.text').style.animation = 'none'
        })
    }

    render() {
        return (
            <div className='container'>
                <div className='app-link'>
                    {appItem.map(item => this.createItem(item))}
                </div>
                <div className='img'>
                    <a
                        href="https://github.com/Douc1998"
                        target="view_window"
                        rel="noopener noreferrer"
                    >
                        <img src={githublogo} />
                    </a>
                </div>
                <div className='text'>
                    <span>{'Welcome to My Wonderland !'}</span>
                </div>
                {/* 按钮用link封装, 添加路由 */}
                <Link to='/home'>
                    <Button
                        className='button'
                        ghost
                        onClick={this.buttonAnimate}
                    >
                        {'Learn More >'}
                    </Button>
                </Link>
            </div>
        )
    }
}

export default Index
