var AjaxObj = {
    createAjax: function (b) {
        var a;
        if (window.XMLHttpRequest) {
            a = new XMLHttpRequest()
        } else {
            a = new ActiveXObject("Microsoft.XMLHTTP")
        }
        if (a) {
            a.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status >= 200 && this.status < 300) {
                        if (this.responseText != null) {
                            b.call(this, this.responseText)
                        }
                    }
                }
            }
        }
        return a
    }, get: function (b, a, e) {
        var c = "&nocache=" + Math.random() * 1000000;
        var d = this.createAjax(e);
        if (!d) {
            return false
        }
        d.open("GET", b + "?" + a + c, false);
        d.send(null)
    }, post: function (b, a, d) {
        var c = this.createAjax(d);
        if (!c) {
            return false
        }
        c.open("POST", b, false);
        c.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        c.send(a)
    }
};