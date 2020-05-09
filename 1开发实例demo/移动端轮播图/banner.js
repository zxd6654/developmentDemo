$(function () {
    banner()
});
//定义一个对象 承载我们封装的事件
window.yy = {};
yy.transitionEnd = function (dom, callback) {
    /* 需要绑定事件的dom  绑定之后  当触发了 事件的时候  执行 callback */
    if (dom && typeof dom == 'object') {
        dom.addEventListener('webkitTransitionEnd', function () {
            /*if(callback){
             callback();
             }*/
            callback && callback();
        });

        dom.addEventListener('transitionEnd', function () {
            callback && callback();
        });
    }
};

function banner() {
    // 1.自动轮播
    var index = 1;//当前图片索引
    var timer = setInterval(function () {
        index++;
        // 增加过渡
        addTransition();
        //位移
        translateX(-index * width);
    }, 5000);
    points[index - 1].className = 'now_page';

    //无缝滚动
    yy.transitionEnd(imageBox, function () {
        if (index >= points.length+1) {
            index = 1;
            removeTransition();
            translateX(-index * width);
        } else if (index <= 0) {
            index = points.length;
            removeTransition();
            translateX(-index * width);
        }
        setPoint();
    });
// 2点对应图片
    var setPoint = function () {
        for (var i = 0; i < points.length; i++) {
            points[i].className = "";
        }
        //判断索引 动画结束后设置点
        points[index - 1].className = 'now_page';
    };
//3图片滑动
    var startX = 0;//开始坐标
    var moveX = 0;//移动时x的坐标
    var distancex = 0;//移动距离
    var isMove = false;//是否滑动过
    imageBox.addEventListener('touchstart', function (e) {
        // e.stopPropagation();
        startX = e.touches[0].clientX;
    });
    imageBox.addEventListener('touchmove', function (e) {
        // e.stopPropagation();
        isMove = true;
        moveX = e.touches[0].clientX;
        // console.log(moveX);
        distancex = moveX - startX;
        //console.log(distancex);
        removeTransition();
        translateX(-index * width + distancex);
    });
    //谷歌浏览器toucuend可能会丢失事件 换为window
    window.addEventListener('touchend', function (e) {
        // e.stopPropagation();
        if (Math.abs(distancex) > (width / 3) && isMove) {
            if (distancex > 0) {
                index--;
            } else {
                index++;
            }
            addTransition();
            translateX(-index * width);
        } else {
            addTransition();
            translateX(-index * width);
        }
        // 为了严谨，保证只加一次定时器
        clearInterval(timer);
        // 手指离开的时候要加上定时器
        timer = setInterval(function () {
            index++;
            // 增加过渡
            addTransition();
            //位移
            translateX(-index * width);
        }, 5000);

        isMove = false;
        startX = 0;
        moveX = 0;
        distancex = 0;

    });
    /*公用方法*/
//添加过渡
    var addTransition = function () {
        imageBox.style.webkitTransition = 'all .2s ';
        imageBox.style.transition = "all .2s";
    };
//删除过渡
    var removeTransition = function () {
        imageBox.style.webkitTransition = 'none';
        imageBox.style.transition = "none";
    };
// 设置定位
    var translateX = function (x) {
        imageBox.style.webkitTransform = 'translateX(' + x + 'px)';
        imageBox.style.transform = 'translateX(' + x + 'px)';

    }

}