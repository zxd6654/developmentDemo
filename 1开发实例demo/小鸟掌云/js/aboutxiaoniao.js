/**
 * Created by ASUS on 2017/3/7.
 */
/*
 Ҫ�󣺷��ض�����ť��ʼ�����صģ���ҳ�����Ϲ�������600pxʱ����ʾ���ض�����ť����
 */
var GLOBLE = GLOBLE || {}; //����һ��ȫ�ֱ�����������ֵ
window.onload = function () {
//            ����ҳ��߶ȵķ���
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
//                ����ҳ���С��ʱ�����������С�
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

    //�����ʱ�л�
    var aAtags = document.getElementsByClassName("nav_in")[0].getElementsByTagName("li");
    for (var i = 0; i < aAtags.length-1; i++) {
        aAtags[i].onclick = function () {
            mainSlideIndex = this.getAttribute("index");
            mainSlideGo();
        }
    }
    /*��ҳ������ʼ*/
    //������ʵ���󶨼����
    var mainSlideIndex = 0;
    /*��ǰҳ���տ�ʼ�ǵ�һҳ*/
    var mainSlideGoing = false;
    /*�����ж��Ƿ��ж�������ִ�У���Ϊtrue����Ϊfalse*/
    var mainSlideDelay = 0;
    /*��ֹ���ֹ���һ���ظ�ִ�����ι����¼�*/
    var mainSlideTimer = null;
    /*����һ����ʱ��*/
    if(window.location.hash){
        mainSlideIndex = location.hash.substring(1);
        $(".wrap_block").slideUp(0, function () {
            GLOBLE.welcomeOver=true;
        });
    }
    mainSlideGo();

    var scrollFunc = function (e) {
        e = e || window.event;
        if (e.wheelDelta) {  //�ж������IE���ȸ軬���¼�
            if (e.wheelDelta > 0) { //���������Ϲ���ʱ
//                        alert("�������Ϲ���");
                mainSlideUp();
            }
            if (e.wheelDelta < 0) { //���������¹���ʱ
//                        alert("�������¹��� ie chrome");
//                mainSlideDown();
                !!GLOBLE.welcomeOver?mainSlideDown():"";
            }
        } else if (e.detail) {  //Firefox�����¼�
            if (e.detail > 0) { //���������¹���ʱ
                //alert("�������¹���")
                //mainSlideDown();
                !!GLOBLE.welcomeOver?mainSlideDown():"";
            }
            if (e.detail < 0) { //���������Ϲ���ʱ
                //alert("�������Ϲ���ff");
                mainSlideUp();
            }
        }
    };
    //��ҳ��󶨻��ֹ����¼�
    if (document.addEventListener) {//firefox
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
    //�������ִ���scrollFunc����  //ie �ȸ�
    window.onmousewheel = document.onmousewheel = scrollFunc;
    //���¹���
    function mainSlideDown() {
        if (mainSlideDelay < 1) {//����ж����ڼ���һ����������
            // �õڶ�����������ʱ����ִ��ҳ�涯Ч
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
    //���Ϲ���
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

    //��������
    function mainSlideGo() {
        //�������ù�������
        var direction = 1;
        /*�ж��ߵķ���*/
        var oDiv = document.getElementById("content");
        var target = document.getElementById("weLook").offsetHeight * mainSlideIndex;
        /*offsetHeight���ӵĸ�*/
//                ��      target   oDiv.offsettop
//                ��һ��     0          0
//                �ڶ���     h         -h
//                ������     2h        -2h
//                ������     3h        -3h
        var distance = Math.abs(target + oDiv.offsetTop);
        /*absȡ����ֵ*/
        //�жϹ�����������������Ӧ�Ĺ���������+����-
        if (target + oDiv.offsetTop < 0) {
            direction = -1;
        }
        //���ù����ٶ�
        var spead = distance / 40;
        var remainDis = distance;
        //�˶���ʱ��
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

    /*��ҳ��������*/
};

$(function () {
    //��������
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
                    //    ����������»������������������ж�����
                    })
                },2500)
            },4000)
        }
        doWelcomeAnimate();
          $(".welcome_wrap").dblclick(function () {
              $(this).slideUp(600,"easeOutStrong", function () {
                  GLOBLE.welcomeOver=true;
                  //    ����������»������������������ж�����
              })
          })
    })();
    //����
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
    //����ҵ�ļ�ֵ
    (function () {
        var oDiv = $(".jiazhi");
        var oSan = oDiv.find(".san").find("img");
        setInterval(function () {
            oSan.fadeIn(500).delay(300).fadeOut(500);
        },500)
    })();
//С������
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
