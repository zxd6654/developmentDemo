var app = getApp();
import globalAppointment from '../global-appointment.js'
import HttpRouter from '../../../utils/HttpRouter.js'
Page({
  data: {
    selectedUserIDNo: '',
    selectedBookID: '',
    listData: [],
    cancelicon: "/resources/cancel.png",
    default_icon: '/resources/default_icon.png',
    big_default_icon: '/resources/bigImg/default_icon.png',
    isNoneRecords: false,
    isModalHidden: true,
    failMessage: '',
    isCancelModalHidden: true,
    confirmMessage: '确定要取消该预约吗？',
    bookTypeList: { //预约记录类型
      "1": '预约排队',
      "3": '大额取现',
      "2": '外币取现',
      "5": '外币取现'
    },
    recordStatusList: {//大额取现，外币取现状态
      "0": "未受理",
      "1": "待受理",
      "2": "预约成功",
      "3": "受理失败",
      "4": "已取消",
      "5": "超时拒绝",
      "6": "已取号",
    },
    cardStatus: {//开卡状态
      "1": "待办理",
      "2": "已完成",
      "3": "已取消",
      "4": "已失效",
    },
    cancelType: '',//取消類型
    isBigFlag: app.globalData.isBigFlag
  },

  onLoad(options) {
    my.setNavigationBar({
      title: '预约记录',
      color: '#000000',
      backgroundColor: '#ffffff',
    });
    this.getRecordList();
  },
  //拨打电话
  tapPhone(event) {
    my.makePhoneCall({
      number: event.target.dataset.phone,
      success() {
      },
      fail() {
      }
    });
  },
  getBack(e) {
    my.navigateBack();
  },

  confirmHandle() {
    this.setData({
      isModalHidden: true,
      failMessage: ''
    });
  },
  cancelHandle() {
    this.setData({
      isModalHidden: true
    });
  },

  showMessageBox(msg) {
    this.setData({
      isModalHidden: false,
      failMessage: msg
    });
  },

  cancelConfirm() {
    this.setData({
      isCancelModalHidden: true
    });
    let that = this;

    let para = {}, operation;
    if (this.data.cancelType == 'card') {
      para = {
        seqNo: this.data.selectedUserIDNo,
        idNo: this.data.selectedBookID
      };
      operation = HttpRouter.cancelCardRecord;
    } else {
      para = {
        userIDNo: this.data.selectedUserIDNo,
        bookID: this.data.selectedBookID
      };
      operation = HttpRouter.cancelRecord;
    }

    my.showLoading({
      content: '取消中...',
    })

    app.requestApi(operation, para, 'POST', function (res) {
      my.hideLoading();
      let retMsg = res.data.retMsg || '';
      if (res.data.retCode == '0000') {
        my.showToast({
          type: 'none',
          content: '取消成功',
          duration: 3000,
        });
        my.setStorageSync({ key: 'submitSuccessFlag', data: 'yes' });
        that.getRecordList();
        return;
      }
      if (retMsg.indexOf("无此预约") > 0) {
        my.showToast({
          type: 'none',
          content: '无此预约',
          duration: 3000,
        });
      } else if (retMsg.indexOf("已过取消时间") > 0) {
        my.showToast({
          type: 'none',
          content: '该预约已过取消时间!',
          duration: 3000,
        });
      } else {
        my.showToast({
          type: 'none',
          content: '取消失败，请重试！',
          duration: 3000,
        });
      }
    }, function () {
      my.hideLoading();
    }, function () {
      my.hideLoading();
    })
  },

  cancelCancel() {
    this.setData({
      isCancelModalHidden: true
    });
  },

  getRecordList() {
    let that = this;
    let paraArr = [];
    let recordArray = my.getStorageSync({ key: 'recordArray' }).data || [];

    if (recordArray.length == 0) {
      paraArr.push({ userIDNo: app.globalData.userInfo.certNo, userPhoneNo: app.globalData.userInfo.mobileNo, pageIndex: 0, pageSize: 100 });
    } else {

      // for (let i = 0; i < recordArray.length; i++) {
      //   paraArr.push({ userIDNo: recordArray[i].id, userPhoneNo: recordArray[i].mobile, pageIndex: 0, pageSize: 100 });
      // }

      let flag = recordArray.some(item => item.id == app.globalData.userInfo.certNo);//判断缓存中是否有登录本人的信息

      if (!flag) {
        paraArr.push({ userIDNo: app.globalData.userInfo.certNo, userPhoneNo: app.globalData.userInfo.mobileNo, pageIndex: 0, pageSize: 100 });
      } else {
        for (let i = 0; i < recordArray.length; i++) {
          if (recordArray[i].id == app.globalData.userInfo.certNo) {
            paraArr.push({ userIDNo: recordArray[i].id, userPhoneNo: recordArray[i].mobile, pageIndex: 0, pageSize: 100 });
          }
        }
      }
    }

    that.getRecordListCallback(paraArr);
  },

  getRecordListCallback(paraArr) {
    let that = this;
    my.showLoading({
      content: '加载中...',
    })
    let operation = HttpRouter.recordsList;
    let para = { getRecordsRequestList: paraArr };
    app.requestApi(operation, para, 'POST', function (res) {
      my.hideLoading();

      if (res.resCode == '0') {
        if (res.data.retCode == '0000') {

          let ashArr = [];//置灰數組；
          let noAshArr = [];//非置灰數組；

          //开卡
          let tmpList = res.data.list;
          for (let i = 0; i < tmpList.length; i++) {
            tmpList[i].bookTypeTemp = '开卡';
            tmpList[i].recordStatusTemp = that.data.cardStatus[tmpList[i].status];
            if (tmpList[i].status == '1') {
              noAshArr.push(tmpList[i]);
            } else {
              ashArr.push(tmpList[i]);
            }
          }
          console.log('开卡', noAshArr, ashArr);

          //大额取现和外币取现
          let tmpRec = res.data.records || [];
          for (let i = 0; i < tmpRec.length; i++) {
            tmpRec[i].bookHourEnd = Number(tmpRec[i].bookHour) + 1;
            tmpRec[i].bookTypeTemp = that.data.bookTypeList[tmpRec[i].bookType];
            tmpRec[i].recordStatusTemp = that.data.recordStatusList[tmpRec[i].recordStatus];
            //增加币种转译
            tmpRec[i].currency = that.translateCurrency(tmpRec[i].currency);

            //增加特殊的时间格式 3月26日
            tmpRec[i].specDate = (tmpRec[i].bookDate).substring(0, 4) + "年" + (tmpRec[i].bookDate).substring(5, 7) + "月" + (tmpRec[i].bookDate).substring(8) + "日"

            tmpRec[i].expireTime = tmpRec[i].bookDate + ' ' + tmpRec[i].bookHour + ':00';
            if (tmpRec[i].recordStatus == '3' || tmpRec[i].recordStatus == '4' || tmpRec[i].recordStatus == '5' || tmpRec[i].recordStatus == '6') {
              ashArr.push(tmpRec[i]);
            } else {
              noAshArr.push(tmpRec[i]);
            }
          }
          console.log('大额取现和外币取现', noAshArr, ashArr);

          //排序
          let newNoAshArr = noAshArr.sort(function (a, b) {
            return new Date(b.expireTime).getTime() - new Date(a.expireTime).getTime()
          })
          let newAshArr = ashArr.sort(function (a, b) {
            return new Date(b.expireTime).getTime() - new Date(a.expireTime).getTime()
          })

          that.setData({
            isNoneRecords: (tmpList.length == 0 && tmpRec.length == 0) ? true : false,
            listData: newNoAshArr.concat(newAshArr)
          });
        } else {
          that.setData({ isNoneRecords: true });
          // my.redirectTo({
          //   url: '../submitFail/submitFail?submitResult=' + res.data.retMsg
          // });
        }
      } else {
        that.setData({ isNoneRecords: true });
        // my.redirectTo({
        //   url: '../submitFail/submitFail?submitResult=' + res.data.msg
        // });
        console.log('数据请求失败');
      }
    }, function (res) {
      my.hideLoading();
    }, function (res) {
      my.hideLoading();
    })
  },

  translateCurrency(appointCurrency) {
    let currencyName = globalAppointment.getCurrencyName();
    let name = '';
    currencyName.map((item, index) => {
      if (item.code == appointCurrency) {
        name = item.name;
        return;
      }
    });
    return name;
  },

  viewDetail(event) {
    let data = event.currentTarget.dataset.obj;
    console.log(data);
    my.navigateTo({
      url: '../pecordDetail/pecordDetail?seqNo=' + data.seqNo + '&custId=' + data.custId + '&idType=' + data.idType + '&custName=' + data.custName + '&custNation=' + data.custNation + '&mobileNo=' + data.mobileNo + '&professionCode=' + data.professionCode + '&districtCode=' + data.districtCode + '&custAddres=' + data.custAddres + '&regisTime=' + data.regisTime + '&expireTime=' + data.expireTime + '&status=' + data.status
    });
  },

  cancel(event) {
    console.log(event);
    switch (event.currentTarget.dataset.type) {
      case 'card':
        this.setData({
          confirmMessage: '确定取消已预约时间段内的开卡业务吗？'
        });
        break;
      case 'largeCash':
        this.setData({
          confirmMessage: '确定取消已预约的大额取现业务吗？'
        });
        break;
      case 'currency':
        this.setData({
          confirmMessage: '确定取消已预约的外币取现业务吗？'
        });
        break;
    }

    this.setData({
      isCancelModalHidden: false,
      selectedUserIDNo: event.currentTarget.dataset.useridno,
      selectedBookID: event.currentTarget.dataset.bookid,
      cancelType: event.currentTarget.dataset.type
    });
  }
})
