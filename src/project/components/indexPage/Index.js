import React, { useState } from 'react';
import { Button } from 'antd';
import './Index.scss';
import { githublogo, QQ, wechat, weibo, about } from '../../icon';
import { NavLink, BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Main from '../../Main';

const AppLink = (props) => (
    <a
        href={props.url}
        target="view_window"
        rel="noopener noreferrer"
    >
        <img className='item' src={props.img} />
    </a>
)

export default function Index(props) {

    const createItem = (item) => {
        return (
            <AppLink key={item.key} url={item.url} img={item.img} />
        )
    }

    const [show, setShow] = useState(true)

    const appItem = [
        { key: 0, url: 'https://im.qq.com/index', img: QQ },
        { key: 1, url: 'https://weixin.qq.com/', img: wechat },
        { key: 2, url: 'https://weibo.com/u/7075317665/home?wvr=5', img: weibo },
        { key: 3, url: 'https://github.com/Douc1998', img: about }
    ]

    return (
        <Router>
            {show ?
                (<div className='container'>
                    <div className='app-link'>
                        {appItem.map(item => createItem(item))}
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
                    <NavLink to={'/home'}>
                        <Button
                            className='button'
                            ghost
                        >
                            {'Learn More >'}
                        </Button>
                    </NavLink>
                    <Switch>
                        <Route exact path='/home'>
                            <Main setShow={setShow} />
                        </Route>
                        {/* 若均未匹配，重定向至首页 */}
                        <Redirect to='/' />
                    </Switch>
                </div>) :
                null
            }
        </Router>
    )
}
