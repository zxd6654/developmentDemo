var oWarp=document.getElementsByClassName("activity_pop")[0];
var aBn = document.getElementsByClassName("activity_pop_banner")[0];
var arrDiv = document.getElementsByClassName("activity_pop_in");
var oLi=document.getElementsByClassName("dash")[0].getElementsByTagName("li");
var page = 0;
var aBnW=aBn.offsetWidth;
for(var i=0;i<oLi.length;i++){
    oLi[i].index=i;
    oLi[i].onclick=function(){
        page=this.index;
        for(var j=0;j<arrDiv.length;j++){
            oLi[j].classList.remove("dash_now");
        }
        oLi[this.index].classList.add("dash_now");
        aBn.style.left=page*-aBnW/2+"px";
    }
}
var next=function(){
    page++;
    if(page>=arrDiv.length){
        page=0;
    }
    aBn.style.left=page*-aBnW/2+"px";
    for(var j=0;j<arrDiv.length;j++){
        oLi[j].classList.remove("dash_now");
    }
    oLi[page].classList.add("dash_now");
};
var timer;
timer=setInterval(next, 5000);
