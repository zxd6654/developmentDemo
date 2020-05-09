/**
 * Created by zxd on 2019/2/27
 */
let LayerBox = function ($obj, $callback1, $callback2) {
    let index = layer.open({
        type: 2,
        title: $obj.title,
        shade: 0.1,
        anim:-1,
        offset: 'lt',
        maxmin: true,
        area: ['50%', '60%'],
        resize: true,
        moveOut: false,
        content: $obj.content,
        parameter: $obj.parameter,
        full:function(){//最大化回调方法
            $('.layui-layer-min').attr('style','display:inline- block;')
        },
        btn: [1, 2],
        yes: function (callback, index, layero) {

            if ($callback1) {
                $callback1(callback)
            }
            layer.close(index);
        },
        cancel: function (callback, index, layero) {

            if ($callback2) {
                $callback2(callback)
            }
        }
    });
    layer.full(index);

    // layerui自适应屏幕弹框
    window.onresize = function () {
        let layerWrap = $('.layui-layer');
        let layerContent = $('.layui-layer-content');
        let layerIframe = $(".layui-layer-iframe iframe");
        let layerMin = $('.layui-layer-min');

        if (layerWrap.length === 0) return false;

        if (layerMin.is(':hidden')) {
            layerWrap.css({width: '100%', height: '100%'});
            layerContent.css('height', '100%');
            layerIframe.css('height', '100%');
        }
    };
};
