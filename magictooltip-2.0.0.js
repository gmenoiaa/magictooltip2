/************************************************************************************************************
Ajax dynamic content
Copyright (C) 2006  DTHMLGoodies.com, Alf Magne Kalleland

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

Dhtmlgoodies.com., hereby disclaims all copyright interest in this script
written by Alf Magne Kalleland.

Alf Magne Kalleland, 2006
Owner of DHTMLgoodies.com


************************************************************************************************************/
function ajax_showContent(t, e, a, o) {
    var n = document.getElementById(t);
    n.innerHTML = dynamicContent_ajaxObjects[e].response, enableCache && (jsCache[a] = dynamicContent_ajaxObjects[e].response), dynamicContent_ajaxObjects[e] = !1, ajax_parseJs(n), o && executeCallback(o)
}

function executeCallback(callbackString) {
    -1 == callbackString.indexOf("(") && (callbackString += "()");
    try {
        eval(callbackString)
    } catch (e) {}
}

function ajax_loadContent(t, e, a) {
    if (enableCache && jsCache[e]) return document.getElementById(t).innerHTML = jsCache[e], ajax_parseJs(document.getElementById(t)), evaluateCss(document.getElementById(t)), void(a && executeCallback(a));
    var o = dynamicContent_ajaxObjects.length;
    if (document.getElementById(t).innerHTML = "Loading content - please wait", dynamicContent_ajaxObjects[o] = new sack, e.indexOf("?") >= 0) {
        dynamicContent_ajaxObjects[o].method = "GET";
        var n = e.substring(e.indexOf("?"));
        e = e.replace(n, ""), n = n.replace("?", "");
        for (var i = n.split(/&/g), s = 0; s < i.length; s++) {
            var r = i[s].split("=");
            2 == r.length && dynamicContent_ajaxObjects[o].setVar(r[0], r[1])
        }
        e = e.replace(n, "")
    }
    dynamicContent_ajaxObjects[o].requestFile = e, dynamicContent_ajaxObjects[o].onCompletion = function() {
        ajax_showContent(t, o, e, a)
    }, dynamicContent_ajaxObjects[o].runAJAX()
}

function ajax_parseJs(t) {
    for (var e = t.getElementsByTagName("SCRIPT"), a = "", o = 0; o < e.length; o++)
        if (e[o].src) {
            var n = (document.getElementsByTagName("head")[0], document.createElement("script"));
            n.setAttribute("type", "text/javascript"), n.setAttribute("src", e[o].src)
        } else navigator.userAgent.toLowerCase().indexOf("opera") >= 0 ? a = a + e[o].text + "\n" : a += e[o].innerHTML;
    a && ajax_installScript(a)
}

function ajax_installScript(t) {
    t && (window.execScript ? window.execScript(t) : window.jQuery && jQuery.browser.safari ? window.setTimeout(t, 0) : window.setTimeout(t, 0))
}

function evaluateCss(t) {
    for (var e = t.getElementsByTagName("STYLE"), a = document.getElementsByTagName("HEAD")[0], o = 0; o < e.length; o++) a.appendChild(e[o])
}

function sack(file) {
    this.xmlhttp = null, this.resetData = function() {
        this.method = "POST", this.queryStringSeparator = "?", this.argumentSeparator = "&", this.URLString = "", this.encodeURIString = !0, this.execute = !1, this.element = null, this.elementObj = null, this.requestFile = file, this.vars = new Object, this.responseStatus = new Array(2)
    }, this.resetFunctions = function() {
        this.onLoading = function() {}, this.onLoaded = function() {}, this.onInteractive = function() {}, this.onCompletion = function() {}, this.onError = function() {}, this.onFail = function() {}
    }, this.reset = function() {
        this.resetFunctions(), this.resetData()
    }, this.createAJAX = function() {
        try {
            this.xmlhttp = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (t) {
            try {
                this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {
                this.xmlhttp = null
            }
        }
        this.xmlhttp || ("undefined" != typeof XMLHttpRequest ? this.xmlhttp = new XMLHttpRequest : this.failed = !0)
    }, this.setVar = function(t, e) {
        this.vars[t] = Array(e, !1)
    }, this.encVar = function(t, e, a) {
        return 1 == a ? Array(encodeURIComponent(t), encodeURIComponent(e)) : void(this.vars[encodeURIComponent(t)] = Array(encodeURIComponent(e), !0))
    }, this.processURLString = function(t, e) {
        for (encoded = encodeURIComponent(this.argumentSeparator), regexp = new RegExp(this.argumentSeparator + "|" + encoded), varArray = t.split(regexp), i = 0; i < varArray.length; i++) urlVars = varArray[i].split("="), 1 == e ? this.encVar(urlVars[0], urlVars[1]) : this.setVar(urlVars[0], urlVars[1])
    }, this.createURLString = function(t) {
        this.encodeURIString && this.URLString.length && this.processURLString(this.URLString, !0), t && (this.URLString.length ? this.URLString += this.argumentSeparator + t : this.URLString = t), this.setVar("rndval", (new Date).getTime()), urlstringtemp = new Array;
        for (key in this.vars) 0 == this.vars[key][1] && 1 == this.encodeURIString && (encoded = this.encVar(key, this.vars[key][0], !0), delete this.vars[key], this.vars[encoded[0]] = Array(encoded[1], !0), key = encoded[0]), urlstringtemp[urlstringtemp.length] = key + "=" + this.vars[key][0];
        this.URLString += t ? this.argumentSeparator + urlstringtemp.join(this.argumentSeparator) : urlstringtemp.join(this.argumentSeparator)
    }, this.runResponse = function() {
        eval(this.response)
    }, this.runAJAX = function(t) {
        if (this.failed) this.onFail();
        else if (this.createURLString(t), this.element && (this.elementObj = document.getElementById(this.element)), this.xmlhttp) {
            var e = this;
            if ("GET" == this.method) totalurlstring = this.requestFile + this.queryStringSeparator + this.URLString, this.xmlhttp.open(this.method, totalurlstring, !0);
            else {
                this.xmlhttp.open(this.method, this.requestFile, !0);
                try {
                    this.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
                } catch (a) {}
            }
            this.xmlhttp.onreadystatechange = function() {
                switch (e.xmlhttp.readyState) {
                    case 1:
                        e.onLoading();
                        break;
                    case 2:
                        e.onLoaded();
                        break;
                    case 3:
                        e.onInteractive();
                        break;
                    case 4:
                        e.response = e.xmlhttp.responseText, e.responseXML = e.xmlhttp.responseXML, e.responseStatus[0] = e.xmlhttp.status, e.responseStatus[1] = e.xmlhttp.statusText, e.execute && e.runResponse(), e.elementObj && (elemNodeName = e.elementObj.nodeName, elemNodeName = elemNodeName.toLowerCase(), "input" == elemNodeName || "select" == elemNodeName || "option" == elemNodeName || "textarea" == elemNodeName ? e.elementObj.value = e.response : e.elementObj.innerHTML = e.response), "200" == e.responseStatus[0] ? e.onCompletion() : e.onError(), e.URLString = "", delete e.xmlhttp.onreadystatechange, e.xmlhttp = null, e.responseStatus = null, e.response = null, e.responseXML = null
                }
            }, this.xmlhttp.send(this.URLString)
        }
    }, this.reset(), this.createAJAX()
}

function ajax_showTooltip(t, e, a) {
    if (currentTooltipObject = a, document.all && (t = event), !ajax_tooltipObj) {
        ajax_tooltipObj = document.createElement("DIV"), ajax_tooltipObj.style.position = "absolute", ajax_tooltipObj.id = "ajax_tooltipObj", document.body.appendChild(ajax_tooltipObj);
        var o = document.createElement("DIV");
        o.className = "ajax_tooltip_arrow", o.id = "ajax_tooltip_arrow", ajax_tooltipObj.appendChild(o);
        var n = document.createElement("DIV");
        n.className = "ajax_tooltip_content", ajax_tooltipObj.appendChild(n), n.id = "ajax_tooltip_content", n.style.marginBottom = "15px", ajax_tooltip_MSIE && (ajax_tooltipObj.style.cursor = "move", ajax_tooltipObj_iframe = document.createElement('<IFRAME frameborder="0">'), ajax_tooltipObj_iframe.style.position = "absolute", ajax_tooltipObj_iframe.border = "0", ajax_tooltipObj_iframe.frameborder = 0, ajax_tooltipObj_iframe.style.backgroundColor = "#FFF", ajax_tooltipObj_iframe.src = "about:blank", n.appendChild(ajax_tooltipObj_iframe), ajax_tooltipObj_iframe.style.left = "0px", ajax_tooltipObj_iframe.style.top = "0px")
    }
    ajax_tooltipObj.style.display = "block", ajax_loadContent("ajax_tooltip_content", e), ajax_tooltip_MSIE && (ajax_tooltipObj_iframe.style.width = ajax_tooltipObj.clientWidth + "px", ajax_tooltipObj_iframe.style.height = ajax_tooltipObj.clientHeight + "px"), ajax_positionTooltip(t, a)
}

function ajax_positionTooltip(t, e) {
    if (e || (e = currentTooltipObject), e) var a = ajaxTooltip_getLeftPos(e) + e.offsetWidth,
        o = ajaxTooltip_getTopPos(e);
    else var a = t.clientX,
        o = t.clientY;
    document.getElementById("ajax_tooltip_content").offsetWidth + document.getElementById("ajax_tooltip_arrow").offsetWidth;
    ajax_tooltipObj.style.left = a + "px", ajax_tooltipObj.style.top = o + "px"
}

function ajax_hideTooltip() {
    ajax_tooltipObj.style.display = "none"
}

function ajaxTooltip_getTopPos(t) {
    for (var e = t.offsetTop; null != (t = t.offsetParent);) "HTML" != t.tagName && (e += t.offsetTop);
    return e
}

function ajaxTooltip_getLeftPos(t) {
    for (var e = t.offsetLeft; null != (t = t.offsetParent);) "HTML" != t.tagName && (e += t.offsetLeft);
    return e
}

function ajax_preloadData(x) {
    var l = [];
    for (var e = 0, a = x.length; a > e; e++ ) {
        if (l.indexOf(x[e].href) < 0) l.push(x[e].href);
    }
    var u = 'http://swtordata.com/widgetload.json', b = '';
    for (var e = 0, a = l.length; a > e; e++ ) {
        if(e > 0) b += '&';
        b += 'url[]=' + l[e];
    }    
    ajax_preloadContent(x, u, b);
}

function ajax_preloadContent(x, e, b) {
    var o = dynamicContent_ajaxObjects.length;
    if (dynamicContent_ajaxObjects[o] = new sack, e.indexOf("?") >= 0) {
        dynamicContent_ajaxObjects[o].method = "POST";
        for (var i = b.split(/&/g), s = 0; s < i.length; s++) {
            var r = i[s].split("=");
            2 == r.length && dynamicContent_ajaxObjects[o].setVar(r[0], r[1])
        }
        b = b.replace(n, "")
    }
    dynamicContent_ajaxObjects[o].requestFile = e, dynamicContent_ajaxObjects[o].onCompletion = function() {
        var json = JSON.parse( dynamicContent_ajaxObjects[o].response );
        for (var e = 0, a = x.length; a > e; e++ ) {
            var d = json[x[e].href];
            if(d !== undefined) {
                if(d.color) x[e].style.color = '#'+d.color;
                if(d.image) {
                    x[e].style.background = "url('"+d.image.src+"') no-repeat left center";
                    x[e].style.backgroundSize = "auto 100%";
                    x[e].style.paddingLeft = '25px';
                }
            }
        }
    }, dynamicContent_ajaxObjects[o].runAJAX(b)
}

function changeswtordata() {
    if ("function" == typeof convert_changeswtordata) convert_changeswtordata();
    else {
        var x = [];
        for (var t = document.getElementsByTagName("a"), e = 0, a = t.length; a > e; e++) {
            var o = t[e].href,
                n = !1;
            o.indexOf("swtordata.com/items/") > -1 && (n = !0), o.indexOf("swtordata.com/craftings/") > -1 && (n = !0), o.indexOf("swtordata.com/abilities/") > -1 && (n = !0), o.indexOf("swtordata.com/missions/") > -1 && (n = !0), o.indexOf("swtordata.com/npcs/") > -1 && (n = !0), o.indexOf("swtordata.com/codexes/") > -1 && (n = !0), o.indexOf("swtordata.com/decorations/") > -1 && (n = !0), o.indexOf("swtordata.com/reputations/") > -1 && (n = !0), o.indexOf("swtordata.com/strongholds/") > -1 && (n = !0), o.indexOf("swtordata.com/gsf_ships/") > -1 && (n = !0), o.indexOf("swtordata.com/achievements/") > -1 && (n = !0), o.indexOf("swtordata.com/collections/") > -1 && (n = !0), o.indexOf("swtordata.com/legacytitles/") > -1 && (n = !0), o.indexOf("swtordata.com/titles/") > -1 && (n = !0), (o.indexOf("swtordata.com/autoitemfind.html?url=") > -1 || n) && (t[e].onmouseout = function() {
                ajax_hideTooltip()
            }, t[e].onmouseover = function() {
                var t = this.href,
                    e = "http://swtordata.com/widgettext.html?url=" + encodeURIComponent(t);
                return ajax_showTooltip(window.event, e, this), !1
            }, x.push(t[e]))
        }
        ajax_preloadData(x);
        try {
            "function" == typeof changeswtorcartel() && changeswtorcartel()
        } catch (i) {}
    }
}
var enableCache = !0,
    jsCache = new Array,
    dynamicContent_ajaxObjects = new Array,
    x_offset_tooltip = 5,
    y_offset_tooltip = 0,
    ajax_tooltipObj = !1,
    ajax_tooltipObj_iframe = !1,
    ajax_tooltip_MSIE = !1;
navigator.userAgent.indexOf("MSIE") >= 0 && (ajax_tooltip_MSIE = !0);
var currentTooltipObject = !1;
window.onload = changeswtordata;