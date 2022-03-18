// 组件导入
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BreadCrumb from './components/bread-crumb/BreadCrumb';
import Layout from './components/layout/Layout';
// 自定义 Hook 导入
import { useResize } from './common/hooks/useResize';
// 图片
import { bot } from './icon';

const windowResize = React.createContext(false);

function Main(props) {
  // 窗口 resize 监听
  const isResize = useResize(200);

  const { setShow } = props;

  const [routes, setRoutes] = useState([
    { breadCrumbName: '首页', targetURL: '/home', status: true },
    { breadCrumbName: '休闲小游戏', targetURL: '/home/games', status: true },
    { breadCrumbName: '我的博客', targetURL: '/home/blogs', status: true },
  ])

  useEffect(() => {
    setShow(prev => (!prev))
  }, [])
  
  function Home() {
    return <h2>这是首页</h2>
  }
  
  function Games() {
    return <h2>这是小游戏</h2>
  }
  
  function Blogs() {
    return <h2>这是我的博客</h2>
  }

  return (
    <windowResize.Provider value={isResize}>
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
            <Switch>
              <Route exact path='/home' component={Home} />
              <Route path='/home/games' component={Games} />
              <Route path='/home/blogs' component={Blogs} />
            </Switch>
          }
        </Layout>
      </Router>
    </windowResize.Provider>
  );
}

export {
  windowResize,
}

export default Main;