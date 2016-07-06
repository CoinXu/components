/**
 * Created by xcp on 7/4/16.
 */

// attributesId:attributesName
var maps = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f',
    7: 'g'
};
var names = {
    // categories:attributes
    1: ['a', 'b', 'c'],
    2: ['d', 'e', 'f'],
    3: ['g']
};

var MODELS = {
    // pvs:[categoryId:attributeId]
    skuList: [
        {names: 'a d g', pvs: '1:1;2:4;3:7'},
        {names: 'b e', pvs: '1:2;2:5'},
        {names: 'c f', pvs: '1:3;2:6'}
    ],
    skuName: {
        names: 'A B C',
        pvs: '1;2;3'
    }
};