/**
 * Created by ASUS on 2017/3/7.
 */
/*
 要求：返回顶部按钮开始是隐藏的，当页面向上滚动超出600px时，显示返回顶部按钮，。
 */
var GLOBLE = GLOBLE || {}; //定义一个全局变量，用来存值
window.onload = function () {
//            调整页面高度的方法
    function resizeBlocks() {
        var screenh = document.documentElement.clientHeight - 50 || document.body.clientHeight - 50;
        aBlock = document.getElementsByClassName("gaiShu");
        for (var i = 0; i < aBlock.length; i++) {
            aBlock[i].style.height = screenh + "px";
        }
        document.getElementById("weLook").style.height = screenh + "px";
    }

    resizeBlocks();
    window.onresize = function () {
//                调整页面大小的时候让整屏居中。
        resizeBlocks();
        mainSlideGo();
        if (mainSlideIndex) {
            if (GLOBLE.resizeTimer) {
                clearInterval(GLOBLE.resizeTimer);
            }
            GLOBLE.resizeTimer = setTimeout(function () {
                mainSlideGoing = true;
                mainSlideGo();
            }, 200)
        }
    };

    //鼠标点击时切换
    var aAtags = document.getElementsByClassName("nav_in")[0].getElementsByTagName("li");
    for (var i = 0; i < aAtags.length-1; i++) {
        aAtags[i].onclick = function () {
            mainSlideIndex = this.getAttribute("index");
            mainSlideGo();
        }
    }
    /*单页滚动开始*/
    //鼠标滚动实践绑定及检测
    var mainSlideIndex = 0;
    /*当前页，刚开始是第一页*/
    var mainSlideGoing = false;
    /*用于判断是否有动画正在执行，有为true，无为false*/
    var mainSlideDelay = 0;
    /*防止滚轮滚动一次重复执行两次滚轮事件*/
    var mainSlideTimer = null;
    /*定义一个定时器*/
    if(window.location.hash){
        mainSlideIndex = location.hash.substring(1);
        $(".wrap_block").slideUp(0, function () {
            GLOBLE.welcomeOver=true;
        });
    }
    mainSlideGo();

    var scrollFunc = function (e) {
        e = e || window.event;
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
//                        alert("滑轮向上滚动");
                mainSlideUp();
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
//                        alert("滑轮向下滚动 ie chrome");
//                mainSlideDown();
                !!GLOBLE.welcomeOver?mainSlideDown():"";
            }
        } else if (e.detail) {  //Firefox滑轮事件
            if (e.detail > 0) { //当滑轮向下滚动时
                //alert("滑轮向下滚动")
                //mainSlideDown();
                !!GLOBLE.welcomeOver?mainSlideDown():"";
            }
            if (e.detail < 0) { //当滑轮向上滚动时
                //alert("滑轮向上滚动ff");
                mainSlideUp();
            }
        }
    };
    //给页面绑定滑轮滚动事件
    if (document.addEventListener) {//firefox
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
    //滚动滑轮触发scrollFunc方法  //ie 谷歌
    window.onmousewheel = document.onmousewheel = scrollFunc;
    //向下滚动
    function mainSlideDown() {
        if (mainSlideDelay < 1) {//这个判断用于检测第一次鼠标滚动，
            // 让第二次鼠标滚动的时候，再执行页面动效
            clearInterval(mainSlideTimer);
            mainSlideTimer = setTimeout(function () {
                mainSlideDelay++;
            }, 100)
        } else if (!mainSlideGoing) {
            mainSlideGoing = true;
            mainSlideIndex++;
            if (mainSlideIndex > aBlock.length - 1) {
                mainSlideIndex = aBlock.length - 1;
            }
            mainSlideGo();
        }
    }

    var oDoNext = document.getElementsByClassName("donext")[0];
    oDoNext.onclick = function () {
            mainSlideIndex=1;
            mainSlideGo();
    };
    //向上滚动
    function mainSlideUp() {
        if (mainSlideDelay < 1) {
            clearInterval(mainSlideTimer);
            mainSlideTimer = setTimeout(function () {
                mainSlideDelay++;
            }, 100)
        } else if (!mainSlideGoing) {
            mainSlideGoing = true;
            mainSlideIndex--;
            if (mainSlideIndex < 0) {
                mainSlideIndex = 0;
            }
            mainSlideGo();
        }
    }

    //滚动方法
    function mainSlideGo() {
        //用于设置滚动方向
        var direction = 1;
        /*判断走的方向*/
        var oDiv = document.getElementById("content");
        var target = document.getElementById("weLook").offsetHeight * mainSlideIndex;
        /*offsetHeight盒子的高*/
//                屏      target   oDiv.offsettop
//                第一屏     0          0
//                第二屏     h         -h
//                第三屏     2h        -2h
//                第四屏     3h        -3h
        var distance = Math.abs(target + oDiv.offsetTop);
        /*abs取绝对值*/
        //判断滚动方法，并设置相应的滚动方向是+还是-
        if (target + oDiv.offsetTop < 0) {
            direction = -1;
        }
        //设置滚动速度
        var spead = distance / 40;
        var remainDis = distance;
        //运动定时器
        var goTimer = setInterval(function () {
            oDiv.style.top = oDiv.offsetTop - spead * direction + "px";
            remainDis -= spead;
            if (remainDis <= 40) {
                clearInterval(goTimer);
                oDiv.style.top = -target + "px";
                mainSlideGoing = false;
                mainSlideDelay = 0;
//tu  0           0     -1
//    1           1      0
//    2           2      1
//    3           3      2
//    4           4      3
//                5      4
                var oNow=document.getElementsByClassName("now")[0];
                var oLi= document.getElementsByClassName("nav_in")[0].getElementsByTagName("li");
               oNow.className = "";
                if (mainSlideIndex - 1 < 0) {
                    mainSlideIndex = 0;
                   oLi[0].className = "now";
                } else if (mainSlideIndex-1 >= 0) {
                    oLi[mainSlideIndex - 1].className = "now";
                }
                if (mainSlideIndex - 1 == 3) {
                   oLi[4].className = "now";
                } else {
                   oLi[4].className = "";
                }

            }
        }, 8)
    }

    /*单页滚动结束*/
};

$(function () {
    //启动动画
    (function () {
        function doWelcomeAnimate(){
            GLOBLE.welcomeAnimateTimer=setTimeout(function () {
                $(".welcome_content").animate({
                    "top":"40%"
                },600);
                $(".welcome_content .welcome_animate").each(function (aaa) {
                    var $this=$(this);
                    setTimeout(function () {
                        $this.show().addClass("animated fadeInUp");
                    },200*(aaa+1))
                });
                setTimeout(function () {
                    $(".welcome_wrap").slideUp(600,"easeOutStrong", function () {
                        GLOBLE.welcomeOver=true;
                    //    用于鼠标上下滑动整屏滚动发出的判断条件
                    })
                },2500)
            },4000)
        }
        doWelcomeAnimate();
          $(".welcome_wrap").dblclick(function () {
              $(this).slideUp(600,"easeOutStrong", function () {
                  GLOBLE.welcomeOver=true;
                  //    用于鼠标上下滑动整屏滚动发出的判断条件
              })
          })
    })();
    //概述
    (function () {
        var oDiv = $(".gaiShu");
        var oGoLeft = oDiv.find(".goLeft");
        var oGoRight = oDiv.find(".goRight");
        var oBanner = oDiv.find(".banner");
        var page = 0;
        oGoRight.click(function () {
            oGoLeft.css({
                opacity: 1
            });
            page++;
            if (page >= 2) {
                page = 2;
                oGoRight.css({
                    opacity: .3
                })
            }
            oBanner.css({
                left: page * -1042 + "px"
            });
        });
        oGoLeft.click(function () {
            oGoRight.css({
                opacity: 1
            });
            page--;
            if (page <= 0) {
                page = 0;
                oGoLeft.css({
                    opacity: .3
                })
            }
            oBanner.css({
                left: page * -1042 + "px"
            });
        });
    })();
    //对企业的价值
    (function () {
        var oDiv = $(".jiazhi");
        var oSan = oDiv.find(".san").find("img");
        setInterval(function () {
            oSan.fadeIn(500).delay(300).fadeOut(500);
        },500)
    })();
//小鸟掌云
    (function () {
        var oDiv = $(".zhangyun_wrap");
        var oGoLeft = oDiv.find(".zuo");
        var oGoRight = oDiv.find(".you");
        var oBanner = oDiv.find(".zhangyunContent");
        var oSlideLeft=oDiv.find(".zuo").find(".slide");
        var oSlideRight=oDiv.find(".you").find(".slide");
        var page = 0;
        oGoRight.click(function () {
            page++;
            if (page >= 1) {
                page = 1
            }
            oBanner.css({
                left: page * -912 + "px"
            });
            oSlideLeft.animate({
                left:"0"
            },500);
             setTimeout(function () {
                 oSlideRight.animate({
                     left:"0"
                 },500);
             },500)
        });
        oGoLeft.click(function () {
            page--;
            if (page <= 0) {
                page = 0
            }
            oBanner.css({
                left: page * -912 + "px"
            });
            oSlideRight.animate({
                left:"-78px"
            },500);
            setTimeout(function () {
                oSlideLeft.animate({
                    left:"-78px"
                },500);
            },500)
        });
    })();
});
