// 定义Point类, 具有行号r、列号c
export default class Point {
    /**
     * params
     * @param {number} r - 点在二维数组中的行号
     * @param {number} c - 点在二维数组中的列号
     */
    constructor(r = 0, c = 0) {
        this.r = r;
        this.c = c;
    }
}