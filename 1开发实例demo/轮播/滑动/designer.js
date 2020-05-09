// console.log(commodityArray[currentImg].imgPath)
$(document).ready(function () {
    var currentImg = 0;//当前图片指针
    var totalNumber = commodityArray.length;
    var minNumber = 5;
    var playSpeed = 400;
    var timeInterval = 3000;
    //将图片添加到轮播列表中
    AddCommodity(commodityArray);

    // 多余3张开始轮播
    if (totalNumber > 3) {
        var imgScroll = setInterval(function () {
            ScrollLeft(commodityArray);
        }, timeInterval);
    } else {

        $(".arrow").remove();
    }

    $(".show-imgs").mouseenter(function () {
        clearInterval(imgScroll);
    })

    $(".show-imgs").mouseleave(function () {
        if (totalNumber > 3) {
            imgScroll = setInterval(function () {
                ScrollLeft(commodityArray);
            }, timeInterval);
        } else {
            $(".arrow").remove();
        }
    })


    $(".show-imgs .right").click(function () {
        ScrollLeft(commodityArray)
    })
    $(".show-imgs .left").click(function () {
        ScrollRight(commodityArray)
    })


// currentImg修改指针
    function ChangeCurrentImg(change) {
        currentImg = (currentImg + totalNumber + (change)) % totalNumber;
        // $(".show-all-img .used-img-list:eq("+currentImg+")").css("border-color","#c30b18").siblings().css("border-color","#ccc");
        // console.log(currentImg);
    }

// 左划
    function ScrollLeft(commodityArray) {
        $(".imgs").animate({"left": "-800px"}, playSpeed, function () {
            var lastImgPointer = (currentImg + minNumber - 1) % totalNumber;
            var commodityStr = ReturnCommodityStr(commodityArray[lastImgPointer]);
            $(this).css("left", "-400px").children().first().remove().end().end().append(commodityStr);
            ChangeCurrentImg(1);
        });
        // console.log(currentImg);
    }

// 右划
    function ScrollRight(commodityArray) {
        $(".imgs").animate({"left": "0px"}, playSpeed, function () {
            var firstImgPointer = (currentImg + totalNumber - 2) % totalNumber;
            var commodityStr = ReturnCommodityStr(commodityArray[firstImgPointer]);
            $(this).css("left", "-400px").children().last().remove().end().end().prepend(commodityStr);
            ChangeCurrentImg(-1);
        });
    }

    function AddCommodity(commodityArray) {
        var commodityStr;
        commodityStr = ReturnCommodityStr(commodityArray[totalNumber - 1]);
        console.log(commodityStr);
        $('.show-imgs .imgs').append(commodityStr);
        if (totalNumber > (minNumber - 2)) {
            for (var i = 0; i < (minNumber - 1); i++) {
                var nextImg = (currentImg + i) % totalNumber;
                commodityStr = ReturnCommodityStr(commodityArray[nextImg]);
                $('.show-imgs .imgs').append(commodityStr);
            }
        } else {
            // console.log('不轮播');
            for (var i = 0; i < (totalNumber); i++) {
                var commodityStr = ReturnCommodityStr(commodityArray[i]);
                $('.show-imgs .imgs').append(commodityStr);
            }
        }

    };

    function ReturnCommodityStr(commodity) {
        var CommodityStr =
            '<div class="img-list ">' +
            '<div class="commodity-img">' + commodity.content + '</div>';
        CommodityStr += '</div>';
        return CommodityStr;
    }
});