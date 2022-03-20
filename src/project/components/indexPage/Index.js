import React, { Component } from 'react';
import { Button } from 'antd';
import './Index.scss';
import { githublogo, QQ, wechat, weibo, about } from '../../icon';
import { Link, BrowserRouter as Router } from 'react-router-dom';

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

    componentDidMount() {
        console.log('index page');
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
                    >
                        {'Learn More >'}
                    </Button>
                </Link>
            </div>
        )
    }
}

export default Index
