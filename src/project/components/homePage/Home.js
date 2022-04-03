// 组件导入
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AnimatedRouter from 'react-animated-router'; // AnimatedRouter组件
import BreadCrumb from '../bread-crumb/BreadCrumb';
import Layout from '../layout/Layout';
import GamePage from '../game/GamePage';
// 样式
import 'react-animated-router/animate.css'; // 引入默认的动画样式定义
// 图片
import { astronaut } from '../../icon';


// 面包屑中的路由数据
const routes = [
  { id: 0, breadCrumbName: '首页', targetURL: '/home', status: true },
  { id: 1, breadCrumbName: '休闲小游戏', targetURL: '/home/games', status: true },
  { id: 2, breadCrumbName: '我的博客', targetURL: '/home/blogs', status: true },
]

class Home extends Component {
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

  componentDidMount() {
    console.log('home page');
  }

  render() {
    return (
      <Router>
        <Layout
          src={astronaut}
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
              <Route exact path='/home/games' render={() => <GamePage />} />
              <Route exact path='/home/blogs' component={this.Blogs} />
            </AnimatedRouter>
          }
        </Layout>
      </Router>
    );
  }
}


export default Home;