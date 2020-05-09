/**
 *
 * Created by Administrator on 2017/2/28.
 */
//banner轮播
//为了避免和其他代码之间变量的影响，这里将轮播的js写成函数自执行的形式
//变量的作用域：
// 局部和全局
// 全局可以作用与局部，局部不会影响全局
$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");
    (function () {
        var oDiv = $('.wrap_two');
        var oPrev = oDiv.find(".prev");
        var oNext = oDiv.find(".next");
        var aSpan = oDiv.find(".middle span");
        var next;
        var animateFater = null;
        var nowIndex = 0;
        //进来的时候先运动一下第一页(这里只需要将banner内部的image运动，所以把image运动单独提出来放一个函数)
        animateFater = $(".divImg").eq(0);
        animateImage();
        function animateImage() {
            animateFater.find(".imgTop").show().addClass("animated  fadeInLeft");
            setTimeout(function () {
                animateFater.find(".imgMiddle").show().addClass("animated  bounceInRight");
                animateFater.find(".imgBottom").show().addClass("animated  fadeIn");
            }, 300);
        }
        function bannerAnimate() {
            $(".change_banner .middle span").eq(nowIndex).addClass("now").siblings().removeClass("now");
            animateFater = $(".divImg").eq(nowIndex);
            animateFater.fadeIn(200).siblings().fadeOut(200);
            animateImage()
        }
        next=function () {
            nowIndex++;
            if (nowIndex >($(".change_banner .middle span").length - 1)) {
                nowIndex = 0;
            }
            bannerAnimate();
        };
        var timer=setInterval(next,2000);
        oNext.click(next);
        oPrev.click(function () {
            nowIndex--;
            if (nowIndex < 0) {
                nowIndex = ($(".change_banner .middle span").length - 1)
            }
            bannerAnimate();
        });
        aSpan.click(function () {
            nowIndex = $(this).index();
            bannerAnimate();
        });
        oDiv.mouseenter(function () {
             clearInterval(timer);
        });
        oDiv.mouseleave(function () {
            timer=setInterval(next,2000)
        })
    })();
    //主要产品
    (function () {
        var oDiv = $('.chanpin_change');
        var oBanner=oDiv.find(".banner1");
        var oPrev = oDiv.find(".zuo");
        var oNext = oDiv.find(".you");
        var aLi = oDiv.find(".chanpin_qiehuan ul li");
        var nowIndex = 0;
        function doFade(action){
            aLi.eq(nowIndex).addClass("chanpin_now").siblings().removeClass("chanpin_now");
            oBanner.eq(nowIndex).fadeIn(200).siblings().fadeOut(0);
            //oBanner.eq(nowIndex).attr("class","banner1 clearFix").addClass("animated "+action);
            oBanner.eq(nowIndex).find("p,img").attr("class","").addClass("animated "+action);
        }
        oNext.click(function () {
            nowIndex++;
            if(nowIndex>aLi.length-1){
                nowIndex=0;
            }
            doFade("fadeInRight");
        });
        oPrev.click(function () {
            nowIndex--;
            if(nowIndex<0){
                nowIndex=aLi.length-1;
            }
            doFade("fadeInLeft");
        });
        aLi.click(function () {
            var index = $(this).index();
            var action= (nowIndex>index)?"fadeInLeft":"fadeInRight";
            nowIndex=index;
            doFade(action);
        })
    })();
    //业务范围
    (function () {
        var oSpan=$(".cimg");
        var oKaiguan=$(".zhangkai");
        function animateSlide(action1,action2){
            action1.parent().next().slideToggle().parent().siblings().find(".platform_second").slideUp();
            action2.toggleClass("bihe").parent().parent().siblings().find(".zhangkai").toggleClass("bihe",false);
        }
        oSpan.click(function () {
            animateSlide($(this),$(this).prev());
        });
        oKaiguan.click(function () {
            animateSlide($(this),$(this));
        });
        oSpan.add(oKaiguan).hover(function () {
                $(this).addClass("animated tada");
            },function () {
               $(this).removeClass("animated tada");
            });
    })();
    //团队介绍
    (function () {
        var oDiv = $('.team');
        var oLook=oDiv.find(".team_look");
        var oChange=oDiv.find(".change_bannerTwo");
        var oBanner=oDiv.find(".team_all");
        //var teamIn=oDiv.find(".team_in");
        var oPrev = oDiv.find(".prevTwo");
        var oNext = oDiv.find(".nextTwo");
        var aSpan = oDiv.find(".middleTwo span");
        var nowIndex = 0;
        var timer;
        var timeNext;
        var timePrev;
        function doNext(){
            var teamIn=oDiv.find(".team_in");
            oBanner.animate({
                left:-1102+"px"
            },1000,"backIn", function () {
                oBanner.css({
                    left:"0"
                });
                oBanner.append(teamIn.eq(0));
            });
            nowIndex++;
            if(nowIndex>aSpan.length-1){
                nowIndex=0;
            }
            aSpan.eq(nowIndex).addClass("nowTwo").siblings().removeClass("nowTwo");
        }
        function doPrev(){
            var teamIn=oDiv.find(".team_in");
                oBanner.prepend(teamIn.eq(-1));
               oBanner.css({
                   left:-1102+"px"
               });
               oBanner.animate({
                   left:"0"
               },1000,"backOut");
            nowIndex--;
            if(nowIndex<0){
                nowIndex=aSpan.length-1;
            }
            aSpan.eq(nowIndex).addClass("nowTwo").siblings().removeClass("nowTwo");
        }
        oNext.click(function () {
            clearTimeout(timeNext);
            timeNext=setTimeout(function () {
                doNext();
            },200)
        });
        oPrev.click(function () {
           clearTimeout(timePrev);
            timePrev=setTimeout(function () {
                doPrev();
            },200)
        });
        timer=setInterval(doNext,4000);
        oLook.hover(function () {
            clearInterval(timer)
        }, function () {
            timer=setInterval(doNext,4000)
        });
        oChange.hover(function () {
            clearInterval(timer)
        }, function () {
            timer=setInterval(doNext,4000)
        });

    })();
    //联系我们
    (function () {
        oDiv=$(".information");
        oInput1=oDiv.find(".mingzi");
        oInput2=oDiv.find(".youxiang");
        oInput3=oDiv.find(".phone");
        oText=oDiv.find(".lang");
        oInput1.add(oText).add(oInput2).add(oInput3).focusin(function () {
           $(this).css({
               border:"1px solid #666"
           })
        }).focusout(function () {
            $(this).css({
                border:"1px solid #e7e8ec"
            })
        })
    })();
});
