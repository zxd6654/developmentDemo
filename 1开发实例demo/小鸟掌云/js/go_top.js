/**
 * Created by ASUS on 2017/3/6.
 */
$(function () {
//    ���ض���
    (function () {
        //�жϺ�ʱ���ֺ����ذ�ť
        $(window).scroll(function () {
            if($(this).scrollTop()>500){
                $("#scrollTop_wrap").fadeIn();
            }else{
                $("#scrollTop_wrap").fadeOut(0);
            }
        });
    //    ������ض���
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