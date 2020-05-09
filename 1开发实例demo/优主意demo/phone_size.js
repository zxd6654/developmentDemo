/**
 * 手机端rem布局自适应js
 * 页面<head>内部
 */



// rem相对布局 动态更改html fontSize  时更改之后对应的DOM 尺寸数据立即更新为最终结果 独立于页面显示
//载入页面->自动缩小->缩小完毕设置htmlFontSize->可以进行dom的所有操作(此时可以初始化 页面的组件)
//判断缩小完毕的函数

//keyPoint及时判断页面是否缩小初始化完毕的关键在于 js在其他较大的同步js文件载入时可以继续执行


var deviceReady = (function (doc, win) {
    //var resizeEvent = "orientationchange" in window ? "orientationchange" : "resize";
   // win.addEventListener(resizeEvent, initDoc, false); //横屏显示或resize   //不会重新初始化页面js组件

    var pageReady = false;
    var docEle = doc.documentElement;
    var clientW;

    function initDoc() {
        var deviceW = window.screen.width; //width="device-width"
        var interV = setInterval(function () {
            clientW = docEle.clientWidth;
            if (clientW <= deviceW) { //缩小完毕
                setDocFontSize();
                fireFns();
                pageReady = true;
                clearInterval(interV);
            }
        }, 200);
    }
    initDoc();

    function setDocFontSize() {
        docEle.style.fontSize = 100 * (clientW / 1080) + "px"; //100为最初html元素字体大小 1080最初页面大小
        document.body.style.opacity = 1;//显示页面
    }

    var readyFns = [];
    //在队列内部增加一个函数
    function addFns(fn) {
        if (!pageReady) {
            readyFns.push(fn);
        } else {//如果页面已经初始化缩小完毕则直接执行
            fn();
        }
    }

    function fireFns() {
        for (var i = 0, len = readyFns.length; i < len; i++) {
            readyFns.pop()();
        }
    }


    return addFns;


})(document, window);

