// components
import Point from '../settings/Point';
import Direction from '../settings/Direction';
import MapGoods from '../settings/MapGoods';
import MoveObject from './MoveObject';

export default class Map{
    constructor(rows = 20, cols = 20){
        this.player = new MoveObject(10, 10);
        this.box = [new MoveObject(2, 2), new MoveObject(2, 18), new MoveObject(18, 2), new MoveObject(18, 18)];
        this.rows = rows;
        this.cols = cols;
        this.world = this.initWorld();
        this.initRewards();
    }

    initWorld = () => {
        const rows = this.rows;
        const cols = this.cols;
        const world = [];
        // 初始化地图
        for (let i = 0; i < rows; i++){
            const line = [];
            for (let j = 0; j < cols; j++){
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
    }

}

