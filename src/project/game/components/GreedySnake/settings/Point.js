// 定义Point类, 具有x, y坐标
export default class Point {
    /**
     * params
     * @param {number} x - 点在地图中的x坐标
     * @param {number} y - 点在地图中的y坐标
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}