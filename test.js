import _ from 'lodash';

class point{
    constructor(r = 0, c = 0){
        this.r = r;
        this.c = c;
    }
}

const a = [new point(1, 1), new point(2, 2), new point(3, 3)]

const b = a[a.length - 1]

const b_cloneDeep = _.cloneDeep(a[a.length - 1])

for(let i = a.length - 1; i > 0; i--){
    a[i].r = a[i - 1].r;
    a[i].c = a[i - 1].c;
}

console.log(a)
console.log(b === a[a.length - 1])
console.log(b_cloneDeep === a[a.length - 1])