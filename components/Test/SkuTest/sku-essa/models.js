/**
 * Created by xcp on 7/4/16.
 */

var MODELS = {
    skuAttributeList: [
        {
            attributeId: 1,
            attributeName: 'A',
            optionList: [
                {optionId: 1, optionName: 'a'},
                {optionId: 2, optionName: 'b'},
                {optionId: 3, optionName: 'c'}
            ]
        },
        {
            attributeId: 2,
            attributeName: 'B',
            optionList: [
                {optionId: 1, optionName: '1'},
                {optionId: 2, optionName: '2'},
                {optionId: 3, optionName: '3'}
            ]
        },
        {
            attributeId: 3,
            attributeName: 'C',
            optionList: [
                {optionId: 1, optionName: '!'},
                {optionId: 2, optionName: '@'},
                {optionId: 3, optionName: '#'}
            ]
        }
    ],

    skuList: [
        {id: 11, moq: 10, price: 50, skuCompose: '1_1|2_1|3_1'},    // a-1-!
        {id: 12, moq: 10, price: 50, skuCompose: '1_1|2_2'},        // a-2
        {id: 13, moq: 10, price: 50, skuCompose: '1_1|2_1'},        // a-1
        {id: 14, moq: 10, price: 50, skuCompose: '1_1|3_2'},        // a-@
        {id: 15, moq: 10, price: 50, skuCompose: '1_1|2_3'}         // a-3
    ]
};