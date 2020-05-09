/**
 * 第三方登陆消息传递控件 （由子窗口向父窗口传递登陆后子窗口返回的消息）
 */
//var GoodStyleModel = {};
function LoginPop() {
    this.width = 500;
    this.height = 500;
    this.left = 400;
    this.top = 200;
    this.loginUrl = "";
    this.receiveDealer = null;
}
LoginPop.prototype.popWindow = function () {
    var w = window.open(this.loginUrl, "第三方登录", "width=" + this.width + ",height=" + this.height + ",left=" + this.left + ",top=" + this.top + ",resizable=yes");
};
LoginPop.prototype.receiveMessage = function () {
    var _self = this;
    window.addEventListener('message', function (e) {
        // alert(e.origin); //传递消息的源
        _self.receiveDealer.call(window, e.data);
        // alert(e.source); //来源窗口
    }, false);
};
LoginPop.prototype.init = function (obj) {
    this.receiveMessage();//监听事件
    if (obj.popBtnId) {
        var _self = this;
        document.getElementById(obj.popBtnId).addEventListener("click", function () {
            _self.popWindow();
        }, false);
    } else {
        console.error("未指定弹出第三方窗口的点击按钮");
    }

    if (obj.width) {
        this.width = obj.width;
    }
    if (obj.height) {
        this.height = obj.height;
    }
    if (obj.top) {
        this.top = obj.top;
    }
    if (obj.left) {
        this.left = obj.left;
    }
    if (typeof obj.receiveDealer == "function") {
        this.receiveDealer = obj.receiveDealer;
    }
    if (obj.loginUrl) {
        this.loginUrl = obj.loginUrl;
    }
};

/**
 * use example
 * @ popBtnId 弹出窗口触发按钮id
 * @ loginUrl 弹出窗口的地址
 * @ width 弹出窗口宽度
 * @ left 弹出窗口left位置
 * @ receiveDealer 确认登录后 主窗体接受消息处理函数
 *
 * */
var login1 = new LoginPop();
login1.init({
    popBtnId: "div1",
    loginUrl: "/auth/weixinweb",
    width: 500,
    height: 400,
    left: 200,
    top: 100,
    receiveDealer: function (data) {
        var dataObj = JSON.parse(data);
    }
});
var login2 = new LoginPop();
login2.init({
    popBtnId: "div2",
    loginUrl: "/auth/weixinweb",
    width: 500,
    height: 400,
    left: 200,
    top: 100,
    receiveDealer: function (data) {
        var dataObj = JSON.parse(data);
    }
});
var login3= new LoginPop();
login3.init({
    popBtnId: "div3",
    loginUrl: "/auth/weixinweb",
    width: 500,
    height: 400,
    left: 200,
    top: 100,
    receiveDealer: function (data) {
        var dataObj = JSON.parse(data);
    }
});
