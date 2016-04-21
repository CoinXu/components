/**
 * Created by xcp on 2016/4/20.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var Cascader = require('../index');
var Parse = require('../Parse');

var models = {
    "models": [{
        "id": 1,
        "name": "玩具",
        "childNodeList": [{
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 11,
            "childNodeList": [{
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 111,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 112,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 113,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 114,
                "childNodeList": []
            }]
        }, {
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 12,
            "childNodeList": [{
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 12111,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 12112,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 12113,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 12114,
                "childNodeList": []
            }]
        }, {
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 13,
            "childNodeList": [{
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 13111,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 13112,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 13113,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 13114,
                "childNodeList": []
            }]
        }, {
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 14,
            "childNodeList": [{
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 14111,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 14112,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 14113,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 14114,
                "childNodeList": []
            }]
        }],
        "level": 1
    }, {
        "id": 2,
        "name": "玩具",
        "childNodeList": [{
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 21,
            "childNodeList": []
        }, {
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 22,
            "childNodeList": []
        }, {
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 23,
            "childNodeList": []
        }, {
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 24,
            "childNodeList": []
        }, {
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 25,
            "childNodeList": []
        }, {
            "parentVersion": 0,
            "name": "儿童玩具",
            "level": 2,
            "id": 26,
            "childNodeList": [{
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 26111,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 26112,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 26113,
                "childNodeList": []
            }, {
                "parentVersion": 0,
                "name": "儿童玩具",
                "level": 2,
                "id": 26114,
                "childNodeList": []
            }]
        }],
        "level": 1
    }]
};

var m = new Parse(models.models, 'childNodeList').init();

var topLevel = m.firstCascadeIdList.map(function (id) {
    return m.flattenMap[id]
});


ReactDOM.render(<Cascader
        defaultValue={[1]}
        maps={m.flattenMap}
        topLevelItems={models.models}
        children="childNodeList"/>,
    document.getElementById('demo')
);