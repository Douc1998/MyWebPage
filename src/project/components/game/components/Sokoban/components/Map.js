// components
import Point from '../settings/Point';
import MapGoods from '../settings/MapGoods';
import MoveObject from './MoveObject';
// 库
import _ from 'lodash';

export default class Map {
    constructor(rows = 10, cols = 10) {
        this.player = new MoveObject();
        this.boxes = [new MoveObject(2, 2), new MoveObject(2, 7), new MoveObject(7, 2), new MoveObject(7, 7)];
        this.rows = rows;
        this.cols = cols;
        this.world = this.initWorld();
        this.rewards = this.initRewards();
        this.achieves = [];
    }

    // 初始化游戏世界
    initWorld = () => {
        const rows = this.rows;
        const cols = this.cols;
        const player = this.player;
        const boxes = this.boxes;
        const world = [];
        
        // 初始化地图
        for (let i = 0; i < rows; i++) {
            const line = [];
            for (let j = 0; j < cols; j++) {
                line.push(MapGoods.BLANK)
            }
            world.push(line)
        }

        // 初始化上下边界
        for (let c = 0; c < cols; c++) {
            world[0][c] = MapGoods.BARRIER;
            world[rows - 1][c] = MapGoods.BARRIER;
        }
        // 初始化左右边界
        for (let r = 0; r < rows; r++) {
            world[r][0] = MapGoods.BARRIER;
            world[r][cols - 1] = MapGoods.BARRIER;
        }
        // 初始化人物 、 箱子
        world[player.loc.r][player.loc.c] = MapGoods.PLAYER;
        _.forEach(boxes, (item) => {
            world[item.loc.r][item.loc.c] = MapGoods.BOX;
        })

        return world
    }

    // 初始化奖励
    initRewards = () => {
        const rewards = [];
        // 有几个箱子就有几个奖励
        for(let i = 0; i < this.boxes.length; i++){
            let reward = this.addRewardToWorld();
            rewards.push(reward);
            this.world[reward.r][reward.c] = MapGoods.REWARD;
        }
        return rewards;
    }

    /**
     * 在地图中随机生成一个 奖励 坐标，不会在已被占用的位置生成
     * @return {Point}
     */
    addRewardToWorld() {
        let rewardPoint;
        // 只要生成的随机点正在被使用，就重新生成
        do {
            rewardPoint = this.getRandomPoint();
        } while (!this.isPointBlank(rewardPoint));

        return rewardPoint;
    }

    /**
     * 在地图中随机生成一个点
     * @return {Point}
     */
    getRandomPoint() {
        const r = Math.round(Math.random() * (this.rows - 1));
        const c = Math.round(Math.random() * (this.cols - 1));
        return new Point(r, c);
    }

    /**
     * 判断一个点有没有被使用
     * @param point
     * @return {boolean}
     */
    isPointBlank(point) {
        return this.world[point.r][point.c] === MapGoods.BLANK;
    }

    /**
     * 
     * @param {String} direction 
     * @return {Map}
     */
    nextStep = (direction) => {
        const rows = this.rows;
        const cols = this.cols;
        const player = this.player;
        const boxes = this.boxes;
        const world = this.world;
        const rewards = this.rewards;
        const achieves = this.achieves;

        // player在移动方向的下一格存在box
        if(this.existBox(direction)){
            // 先获取该方向上的box在boxes中的index
            const index = this.getBox(direction);
            // 判断该box是否可以在该方向上移动, 不可以则不动
            if(boxes[index].canMove(direction, world)){
                // 获取该box下一个位置
                const boxNextLoc = boxes[index].getNextLoc(direction);
                // 如果可以, 判断一下是否 achieve
                if(this.getReward(boxNextLoc)){
                    // 如果achieve, 则加入achieve数组
                    achieves.push(new Point(boxNextLoc.r, boxNextLoc.c))
                    // 删除boxes中的该box
                    boxes.splice(index, 1);
                }else{
                    // 反之, box移动一格子
                    boxes[index].moveStep(direction);
                }
                player.moveStep(direction);
            }
        }else{ // 如果不存在, 只需要判断player是否可以移动就行
            if(player.canMove(direction, world)){
                player.moveStep(direction)
            }  
        }

        // 每次变化完之后 重新组织地图 优先级 player > achieve > reward > blank
        // 先加载不变项,
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // barrier不变
                if(world[r][c] !== MapGoods.BARRIER){
                    world[r][c] = MapGoods.BLANK
                }
            }
        }
        // 加载 rewards
        _.forEach(rewards, (item) => {
            world[item.r][item.c] = MapGoods.REWARD;
        })
        // achieves 覆盖 rewards
        _.forEach(achieves, (item) => {
            world[item.r][item.c] = MapGoods.ACHIEVE;
        })

        // 加载变动项 player、 box
         world[player.loc.r][player.loc.c] = MapGoods.PLAYER;
         _.forEach(boxes, (item) => {
             world[item.loc.r][item.loc.c] = MapGoods.BOX;
         })

        return this
    }

    /**
     * 判断 player 推动方向是否有箱子
     * @param {String} direction 
     */
    existBox = (direction) => {
        const world = this.world;
        const nextLoc = this.player.getNextLoc(direction);
        if(world[nextLoc.r][nextLoc.c] === MapGoods.BOX){
            return true
        }else{
            return false
        }
    }
    /**
     * 返回 player 推动方向的箱子序号
     * @param {String} direction
     */
    getBox = (direction) => {
        const boxes = this.boxes;
        const nextLoc = this.player.getNextLoc(direction);
        const nextMoveObject = new MoveObject(nextLoc.r, nextLoc.c)
        for(let i = 0; i < boxes.length; i++){
            if(nextMoveObject.loc.r === boxes[i].loc.r && nextMoveObject.loc.c === boxes[i].loc.c){
                return i
            }
        }
        return     
    }

    /**
     * 判断箱子是否到达 reward
     * @param {MoveObject} box
     * @param {String} direction 
     */
    getReward = (nextLoc) =>{
        const world = this.world;
        if(world[nextLoc.r][nextLoc.c] === MapGoods.REWARD){
            return true;
        }else{
            return false;
        }
    }
}

