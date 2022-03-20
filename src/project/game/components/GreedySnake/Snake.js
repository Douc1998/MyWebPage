import React, { Component } from 'react';
import "./Snake.scss";
 
 
const TYP = {
    normal:1,
    head:2,
    body:3,
    food:4
};
const DIRCTION = {
    top:1,
    bottom:2,
    left:3,
    right:4
}
 
export default class Snake extends Component{
    constructor(props){
        super(props);
        this.state = {
            count: 0
        }
    }
    componentWillMount(){
        var n = 20;
        var arr = [];
        for(var i = 0; i < n; i++ ){
            var temp = [];
            for(var j = 0; j < n; j++){
                temp[j] = TYP.normal;   
            }
            arr.push(temp);
        }
        var body = [
            {r:6,c:10},
            {r:7,c:10},
            {r:8,c:10},
            {r:9,c:10}
        ];
        var food = {r:14,c:14};   
        this.conf = {
            run:true,
            n:n,
            dirction:DIRCTION.top,
            arr:arr,
            body:body,
            food:food
        };
         
        this.renderSake();
         
 
        window.addEventListener("keydown",this.keydown.bind(this));
 
    }
    componentWillUnmount(){
        window.removeEventListener("keydown",this.keydown);
    }
    keydown=(event)=>{
        var key = event.key;
        if(!this.conf.run && this.conf.timer){
            return ;
        }
        if(key === "w" && this.conf.dirction !== DIRCTION.top){
             //上
             this.conf.dirction = DIRCTION.top;
        }else if(key === "s" && this.conf.dirction !== DIRCTION.bottom){
            //下
            this.conf.dirction = DIRCTION.bottom;
        }else if(key === "a" && this.conf.dirction !== DIRCTION.left){
            //左    
            this.conf.dirction = DIRCTION.left;
        }else if(key === "d" && this.conf.dirction !== DIRCTION.right){
            //右
            this.conf.dirction = DIRCTION.right;
        }
    }
 
    mainTimer =()=>{
        var me = this;
        if(me.conf.timer){
            return ;
        }
         
 
        me.conf.timer = setInterval(function(){
            if(me.conf.dirction === DIRCTION.top){
                //上
                me.move(-1,0);
            }else if(me.conf.dirction === DIRCTION.bottom){
                //下
                me.move(1,0);
            }else if(me.conf.dirction === DIRCTION.left ){
                //左    
                me.move(0,-1);
            }else if(me.conf.dirction === DIRCTION.right ){
                //右
                me.move(0,1);
            }
        },360);
    }
    moveCheck(r,c){
        //校验
        var body = this.conf.body;
        var head = body[0];
        var food = this.conf.food;
        var n = this.conf.n;
         
        var nextHead = {
            r:head.r + r,
            c:head.c + c
        }
 
        //检查出界
        if((nextHead.r  >= n) || (nextHead.r < 0 ) || (nextHead.c >= n) || (nextHead.c < 0) ){
            return false;
        }
 
        //检查咬自己,没有咬到就运动
        for(var i = body.length-1; i  >= 1; i--){
            var item = body[i];
            if(item.r === nextHead.r && item.c === nextHead.c ){
                return false;
            }
            item.r = body[i-1].r;
            item.c = body[i-1].c;
        }
 
        //检查吃食物
        if(food.r === nextHead.r && food.c === nextHead.c){
            //吃东西
            body.push({
                r:food.r,
                c:food.c
            });
 
            //记录分数
            this.setState({
                count:this.state.count + 1   
            });
 
            //重新创建食物
            this.conf.food = this.createFood();
        }
         
        body[0] = nextHead;
        return true;
         
    }
    move(r,c){
        //上下
        if(this.moveCheck(r,c)){
            //可以下一步
            this.renderSake();
        }else{
            //游戏结束
            this.conf.run = false;
            clearInterval(this.conf.timer);
            this.conf.timer = null;
            alert("游戏结束");
        }
    }
    renderSake(){
        //渲染蛇的身体
        var config = JSON.parse(JSON.stringify(this.conf.arr));
        var body = this.conf.body;
        var food = this.conf.food;
        this.setFood(config,food);
        this.setBody(config,body);
        this.setState({
            config:config
        });
    }
    createFood(){
        //创建食物
        var food = this.validFood();
        var max = 30;
        while(!food && max > 0){  //防止死循环和获取的食物坐标在蛇的身体上
            food = this.validFood();
            max--;
        }
        return food;
    }
    validFood(){
        //校验食物坐标是否可用
        var body = this.conf.body;
        var n = this.conf.n;
        var r = Math.floor(Math.random()* n);
        var c = Math.floor(Math.random()* n);
        for(var i = 0,len = body.length; i < len; i++){
            var item = body[i];
            if(item.r === r && item.c === c){
                return false;
            }
        }
        return {r,c};
    }
    setBody(config,body){
        //设置蛇身体
        for(var i = 1,len = body.length; i < len; i++){
            var item = body[i];
           config[item.r][item.c] = TYP.body; 
        }
        config[body[0].r][body[0].c] = TYP.head;
    }
    setFood(config,food){
        //设置食物
        config[food.r][food.c] = TYP.food;
    }
    getClass=(item)=>{
        if(item === TYP.head){
            return "head";   
        }else if(item === TYP.body){
            return "body";
        }else if(item === TYP.food){
            return "food";
        }
    }
 
    render(){
        return (
            <div className="Snake">
                <button className="start" onClick={this.mainTimer}> 点击开始</button>
                <p className='title'>分数：{this.state.count}</p>
                <div className="box">
                {
                    this.state.config.map((item,index)=>{
                        return <div className="cols" key={index} >
                        {
                            item.map((itm,idx)=>{
                                return <div className={ this.getClass(itm) }  key={index + '-'+ idx} ></div>
                            })   
                        }</div>
                    })
                }
                </div>
            </div>
        );
    }
 
}