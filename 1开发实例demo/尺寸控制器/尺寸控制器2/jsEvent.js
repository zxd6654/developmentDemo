var EventUtil = {
    addHandler: function (a, c, b) {
        if (typeof a == "string") {
            a = document.getElementById(a)
        }
        if (a.addEventListener) {
            a.addEventListener(c, b, false)
        } else {
            if (a.attachEvent) {
                a.attachEvent("on" + c, b)
            } else {
                a["on" + c] = b
            }
        }
    }, removeHandler: function (a, c, b) {
        if (typeof a == "string") {
            a = document.getElementById(a)
        }
        if (a.removeEventListener) {
            a.removeEventListener(c, b, false)
        } else {
            if (a.detachEvent) {
                a.detachEvent(c, b, false)
            } else {
                a["on" + c] = null
            }
        }
    }, getEvent: function (a) {
        return a ? a : window.event
    }, getTarget: function (a) {
        a = EventUtil.getEvent(a);
        return a.target || a.srcElement
    }, preventDefault: function (a) {
        a = EventUtil.getEvent(a);
        if (a.preventDefault) {
            a.preventDefault()
        } else {
            a.returnValue = false
        }
    }, stopPropagation: function (a) {
        a = EventUtil.getEvent(a);
        if (a.stopPropagation) {
            a.stopPropagation()
        } else {
            a.cancelBubble = true
        }
    }, getModifyKeys: function (b) {
        b = EventUtil.getEvent(b);
        var a = new Array();
        if (b.shiftKey) {
            a.push("shift")
        }
        if (b.ctrlKey) {
            a.push("ctrl")
        }
        if (b.altKey) {
            a.push("alt")
        }
        if (b.metaKey) {
            a.push("meta")
        }
        return a.join(",")
    }, getRelatedTarget: function (a) {
        a = EventUtil.getEvent(a);
        if (a.relatedTarget) {
            return a.relatedTarget
        } else {
            if (a.toElement) {
                return a.toElement
            } else {
                if (a.fromElement) {
                    return a.fromElement
                } else {
                    return null
                }
            }
        }
    }, getButton: function (a) {
        a = EventUtil.getEvent(a);
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
            return a.button
        } else {
            switch (a.button) {
                case 0:
                    break;
                case 1:
                    return 0;
                    break;
                case 2:
                    return 2;
                    break;
                case 3:
                    return 0;
                case 4:
                    return 1;
                    break;
                case 5:
                    return 0;
                    break;
                case 6:
                    return 2;
                    break;
                case 7:
                    return 0;
                    break
            }
        }
    }, getWheelDelta: function (a) {
        if (a.wheelDelta) {
            return (client.engine.opera && client.engine.opera < 9.5 ? -a.wheelDelta : a.wheelDelta)
        } else {
            return -a.detail * 40
        }
    }, getCharCode: function (a) {
        a = EventUtil.getEvent(a);
        if (typeof a.charCode == "number" && a.charCode != 0) {
            return a.charCode
        } else {
            return a.keyCode
        }
    }, getClipboardText: function (a) {
        a = a || window.event;
        var b = (a.clipboardData || window.clipbordData);
        return b.getData("text")
    }, setClipboardText: function (a, b) {
        if (a.clipboardData) {
            return a.clipboardData.setData("text/plain", b)
        } else {
            if (window.clipboardData) {
                return window.clipboardData.setData("text", b)
            }
        }
    }, bind: function (a) {
        var b = {};
        b.Ele = (function () {
            var c;
            if (typeof a == "string") {
                c = document.getElementById(a)
            } else {
                if (typeof a == "object") {
                    c = a
                }
            }
            return c
        }());
        b.timenter = 0;
        b.timout = 0;
        b.msenter = false;
        b.msleave = true;
        b.dealmover = function (c) {
            clearTimeout(b.timout);
            b.timenter = setTimeout(function () {
                if (!b.msenter) {
                    b.msleave = false;
                    b.msenter = true;
                    if (b.dealmsenter) {
                        b.dealmsenter(c)
                    }
                }
            }, 100)
        };
        b.dealmout = function (c) {
            clearTimeout(b.timenter);
            b.timout = setTimeout(function () {
                if (!b.msleave) {
                    b.msleave = true;
                    b.msenter = false;
                    if (b.onmouseleave) {
                        b.dealmsleave.call(window, c)
                    }
                }
            }, 100)
        };
        b.onmouseenter = function (c) {
            this.dealmsenter = c
        };
        b.onmouseleave = function (c) {
            this.dealmsleave = c
        };
        EventUtil.addHandler(b.Ele, "mouseover", b.dealmover);
        EventUtil.addHandler(b.Ele, "mouseout", b.dealmout);
        return b
    }
};