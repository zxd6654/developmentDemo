/**
 * Created by ASUS on 2017/3/6.
 */
$(function () {
//    返回顶部
    (function () {
        //判断何时出现和隐藏按钮
        $(window).scroll(function () {
            if($(this).scrollTop()>500){
                $("#scrollTop_wrap").fadeIn();
            }else{
                $("#scrollTop_wrap").fadeOut(0);
            }
        });
    //    点击返回顶部
        $("#scrollTop").click(function () {
           $(this).parent().animate({
               "bottom":1000,"opacity":0
           },400, function () {
               $('#scrollTop_wrap').css("opacity",1).css("bottom",160);
           });
            $('body,html').animate({
                scrollTop: 0
            }, 400);
        });
    })();
});