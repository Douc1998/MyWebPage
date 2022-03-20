// 组件
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, } from 'react-router-dom';
import AnimatedRouter from 'react-animated-router'; //我们的AnimatedRouter组件
import Index from './project/components/indexPage/Index';
import Home from './project/components/homePage/Main';
// 样式
import './App.scss';
import 'react-animated-router/animate.css'; //引入默认的动画样式定义

class App extends Component {
  render() {
    return (
      <Router >
          <AnimatedRouter>
            <Route exact path="/" component={Index} />
            <Route path="/home" component={Home} />
          </AnimatedRouter>
      </Router>
    )
  }
}
export default App;

