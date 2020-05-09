/**
 * 手机端rem布局自适应js
 */

//文档ready事件处理
var whenReady = (function () {
    //避免readystatechange和DOMContentLoaded触发 了两次
    var readyFns = [];
    var ready = false;

    function readyToDeal(e) {
        console.log("1" + typeof readyFns);
        if (ready) {
            return;
        }
        if (e.type === "readystatechange" && document.readyState !== "complete") {
            return;
        }
        for (var i = 0, len = readyFns.length; i < len; i++) {
            readyFns[i]();
        }
        readyFns = null;
        ready = true;
    }

    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", readyToDeal, false);
        document.addEventListener("readystatechange", readyToDeal, false);
        window.addEventListener("load", readyToDeal, false);
    } else if (document.attachEvent) {
        document.addEventListener("DOMContentLoaded", readyToDeal);
        document.addEventListener("readystatechange", readyToDeal);
        window.addEventListener("load", readyToDeal);
    }

    return function (fn) {
        if (typeof fn != "function") {
            return;
        }
        if (ready) {
            fn();
        } else {
            readyFns.push(fn);
        }
    }
})();


/*
 *  文档加载和 width=device-width宽度变化同时进行说不定哪个先完成
 *  所以在文档加载完成后 判断是否已经缩放完毕
 * */
var deviceReady = (function (doc, win) {

    var readyFn = [];
    var docEle = document.documentElement;
    var count = 0;
    var resizeEvent = "orientationchange" in window ? "orientationchange" : "resize";
    var reCalculateFont = function (count) {
        //获取当前虚拟视口的宽度
        var clientWidth = docEle.clientWidth;
        if (!clientWidth) {
            return;
        }
        //计算当前页面rem字体大小 用于页面显示
        if (clientWidth <= 1080) {//750这个值是根据设计师的psd宽度来秀嘎，是多少就写多少
            docEle.style.fontSize = 100 * (clientWidth / 1080) + "px";
        }
        //console.log(docEle.clientWidth > window.screen.width );
        // 反复调整执行reCalculateFont，计算rem大小  同时 避免载入内容时的页面晃动 （虚拟适口大小适配屏幕过程中clientWidth 会有变动，获取最终的clientWidth）
        if (docEle.clientWidth > window.screen.width && count < 10) { // window.screen.width-> <meta content="width=device-width"> 设备屏幕宽度 一个固定的值
            setTimeout(reCalculateFont.call(this, ++count), 100);
        } else {
            //执行设置的事件
            if (readyFn.length != 0) {
                for (var i = 0, len = readyFn.length; i < len; i++) {
                    readyFn[i]();
                }
            }
            document.body.style.opacity = 1;
           // $("body").fadeIn();
            console.log("width=device-width缩小完毕！");
        }
    };

    // win.addEventListener(resizeEvent, reCalculateFont, false);  //横屏显示事件 或resize
    // doc.addEventListener("DOMContentLoaded", reCalculateFont, false); //load事件不可以 网页文档载入成功事件 （区别于 load事件内容包括img全部载入完毕时触发load事件）
    //将在页面所有js执行完毕后执行
    whenReady(function () {
        setTimeout(reCalculateFont, 100);
    });
    return function (fn) {
        if (typeof fn == "function") {
            console.log("push!");
            readyFn.push(fn);
        }
    };

})(document, window);

