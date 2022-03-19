import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, } from 'react-router-dom';
import Index from './project/components/indexPage/Index';
import Main from './project/Main';
import AnimatedRouter from 'react-animated-router'; //我们的AnimatedRouter组件
import 'react-animated-router/animate.css'; //引入默认的动画样式定义

class App extends Component {
  render() {
    return (
      <Router >
          <AnimatedRouter>
            <Route exact path="/" component={Index} />
            <Route path="/home" component={Main} />
          </AnimatedRouter>
      </Router>
    )
  }
}
export default App;

