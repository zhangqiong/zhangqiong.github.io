/**
 * Created by ZQ on 2015/11/25.
 */
function showBorderShadow(item){
    item.classList.add("shadow");
}
function hideBorderSHadow(item){
    item.classList.remove("shadow");
}
var pics=document.getElementsByClassName("carousel_pic");
var points=document.getElementsByClassName("car_pt_icon");
var curr_pic=0;
function go_left(next_pic){
    pics[curr_pic].style.animation="left-out 1s forwards";
    pics[curr_pic].style.oAnimation="left-out 1s forwards";
    pics[curr_pic].style.mozAnimation="left-out 1s forwards";
    pics[curr_pic].style.webkitAnimation="left-out 1s forwards";
    pics[curr_pic].classList.remove("curr");
    pics[next_pic].style.oAnimation="right-in 1s forwards";
    pics[next_pic].style.mozAnimation="right-in 1s forwards";
    pics[next_pic].style.webkitAnimation="right-in 1s forwards";
    pics[next_pic].style.animation="right-in 1s forwards";
    pics[next_pic].classList.add("curr");
    points[curr_pic].classList.remove("car_pt_icon_chosen");
    curr_pic=next_pic;
    points[curr_pic].classList.add("car_pt_icon_chosen");

}
function go_right(last_pic){
    pics[curr_pic].style.animation="right-out 1s forwards";
    pics[curr_pic].style.oAnimation="right-out 1s forwards";
    pics[curr_pic].style.mozAnimation="right-out 1s forwards";
    pics[curr_pic].style.webkitAnimation="right-out 1s forwards";
    pics[curr_pic].classList.remove("curr");
    pics[last_pic].style.animation="left-in 1s forwards";
    pics[last_pic].style.mozAnimation="left-in 1s forwards";
    pics[last_pic].style.webkitAnimation="left-in 1s forwards";
    pics[last_pic].style.animation="left-in 1s forwards";
    pics[last_pic].classList.add("curr");
    points[curr_pic].classList.remove("car_pt_icon_chosen");
    curr_pic=last_pic;
    points[curr_pic].classList.add("car_pt_icon_chosen");
}
function next_pic(){
    var next_pic=(1+curr_pic)%3;
    go_left(next_pic);
}
function last_pic(){
    var last_pic=(2+curr_pic)%3;
    go_right(last_pic);
}
function set_pic(next){
    if(next>curr_pic){
        go_left(next);
    }else if(next<curr_pic){
        go_right(next);
    }
}