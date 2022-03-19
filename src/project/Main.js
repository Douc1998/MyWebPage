// 组件导入
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import BreadCrumb from './components/bread-crumb/BreadCrumb';
import Layout from './components/layout/Layout';

// 图片
import { bot } from './icon';
import Index from './components/indexPage/Index';
import AnimatedRouter from 'react-animated-router'; //我们的AnimatedRouter组件
import 'react-animated-router/animate.css'; //引入默认的动画样式定义


const routes = [
  { id: 0, breadCrumbName: '首页', targetURL: '/home', status: true },
  { id: 1, breadCrumbName: '休闲小游戏', targetURL: '/home/games', status: true },
  { id: 2, breadCrumbName: '我的博客', targetURL: '/home/blogs', status: true },
  { id: 3, breadCrumbName: '初始页面', targetURL: '/', status: true }
]

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  Home = () => {
    return <h2>这是首页</h2>
  }

  Games = () => {
    return <h2>这是小游戏</h2>
  }

  Blogs = () => {
    return <h2>这是我的博客</h2>
  }

  componentDidMount(){
    console.log('home page');
  }

  render() {
    return (
      <Router>
        <Layout
          src={bot}
          title='DouChen的React小站'
          imgHeight='70%'
        >
          {
            <BreadCrumb
              routes={routes}
            ></BreadCrumb>
          }
          {
            <AnimatedRouter timeout={300} appear={true} enter={true} exit={true} >
              <Route exact path='/home' component={this.Home} />
              <Route exact path='/home/games' component={this.Games} />
              <Route exact path='/home/blogs' component={this.Blogs} />
              <Route exact path='/' component={Index} />
            </AnimatedRouter>
          }
        </Layout>
      </Router>
    );
  }
}


export default Main;