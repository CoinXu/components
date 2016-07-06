/**
 * Created by xcp on 7/4/16.
 */

module.exports = {
  "message": "返回消息",
  "model": {
    "columnHeader": {
      // 贴纸、唛头的数量
      "stiMarkList": [
        {
          "code": 1,
          "fieldList": [
            {"fieldId": 1, "fieldInterId": 11, "name": "内箱条形码"},
            {"fieldId": 2, "fieldInterId": 12, "name": "外箱条形码"}
          ],
          "name": "贴纸一号",
          "stimarkId": "STICK_1",
          "type": "s"                   // s是贴纸，m是唛头
        },
        {
          "code": 2,
          "fieldList": [
            {"fieldId": 1, "fieldInterId": 21, "name": "客户货号"},
            {"fieldId": 2, "fieldInterId": 22, "name": "商品条形码"},
            {"fieldId": 3, "fieldInterId": 23, "name": "ESSA条形码"},
            {"fieldId": 4, "fieldInterId": 24, "name": "ESSA条形码"}
          ],
          "name": "唛头一号",
          "stimarkId": "MARK_1",
          "type": "m"                   // s是贴纸，m是唛头
        },
        {
          "code": 3,
          "fieldList": [
            {"fieldId": 1, "fieldInterId": 31, "name": "客户货号"},
            {"fieldId": 2, "fieldInterId": 32, "name": "商品条形码"},
            {"fieldId": 3, "fieldInterId": 33, "name": "ESSA条形码"},
            {"fieldId": 4, "fieldInterId": 34, "name": "ESSA条形码"}
          ],
          "name": "唛头二号",
          "stimarkId": "MARK_2",
          "type": "m"                   // s是贴纸，m是唛头
        }
      ]
    },
    "id": 1,
    "rows": [
      {
        "fileUrl": "https://www.baidu.com/img/bd_logo1.png",
        "id": 1,
        "skuBarCode": "SKU条码",
        "skuName": "我都不知道这个应该起啥名儿了",
        "skuNo": "SKU编号",
        "stiMarkList": [
          {
            "fieldList": [
              {"fieldInterId": 11, "fieldValue": 11},
              {"fieldInterId": 12, "fieldValue": 12}
            ],
            "stimarkId": "",
            "type": "s"
          },
          {
            "fieldList": [
              {"fieldInterId": 21, "fieldValue": 21},
              {"fieldInterId": 22, "fieldValue": 22},
              {"fieldInterId": 23, "fieldValue": 23},
              {"fieldInterId": 24, "fieldValue": 24}
            ],
            "stimarkId": "",
            "type": "m"
          },
          {
            "fieldList": [
              {"fieldInterId": 31, "fieldValue": 31},
              {"fieldInterId": 32, "fieldValue": 32},
              {"fieldInterId": 33, "fieldValue": 33},
              {"fieldInterId": 34, "fieldValue": 34}
            ],
            "stimarkId": "",
            "type": "m"
          }
        ]
      }
    ]
  },
  "success": true
};