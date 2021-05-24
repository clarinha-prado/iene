// colar este código na aba console do browser
document.onmousemove = function (e) {
    var x = e.pageX;
    var y = e.pageY;
    e.target.title = "X is " + x + " and Y is " + y;
};