/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = document.querySelectorAll.bind(document),
    $ID = document.getElementById.bind(document),
    $newEle = document.createElement.bind(document);
var cardId = 1;
var b64 = __webpack_require__(1);

function app() {
    // Variables

    // Listeners
    $ID("add-text").addEventListener("click", () => {
        newCard($ID("inputArea").value, "listContainer", cardId++)
    });
    $ID("close-button").addEventListener("click", () => {
        //clearInterval(app.action);
        app.action = null;
        $ID("close-button").parentNode.setAttribute("style", "display:none");
        $("pretext")[0].innerText = "";
        $("current")[0].innerText = "";
        $("postext")[0].innerText = "";
    });

    // Functions
    function play(id, speed) {
        $(".read-container")[0].setAttribute("style", "display:block");
        var textFlow = $ID("textcard-" + id).getAttribute("text").split("|");
        //console.log(textFlow);
        var textLoc = 0;
        app.action = action(textFlow, 0);
    }

    function action(textFlow, a) {
        $("current")[0].innerText = textFlow[a];
        if (!textFlow[a + 1]) return;
        setTimeout(function() {
            action(textFlow, a + 1);
        }, textFlow[a].length * 40 + 120)
    }

    function textCardControl(id) {
        var ctrl = document.createElement("div");
        ctrl.setAttribute("class", "controlbox");
        ctrl.setAttribute("id", "ctrl" + id);
        var btn1 = newButton("roundbutton",
            function() {
                if ($ID("textcard-" + id).getAttribute("text")) { play(id); }
            },
            "play",
            "play_arrow");
        var btn2 = newButton("controlbutton",
            function() {
                setTimeout(function() {
                    var _x = $ID("textcard-" + id);
                    if (_x != null) {
                        _x.parentNode.removeChild(_x.nextSibling);
                        _x.parentNode.removeChild(_x)
                    }
                }, 200)
            },
            "delete",
            "delete");
        ctrl.appendChild(btn1);
        ctrl.appendChild(btn2);
        return ctrl;
    }

    function newButton(DOMclass, listener, control, icon) {
        var Button = $newEle("button");
        Button.setAttribute("class", DOMclass);
        var icn = $newEle("i");
        icn.setAttribute("class", "material-icons " + control);
        icn.innerText = icon;
        Button.appendChild(icn);
        Button.addEventListener('click', listener)
        return Button;
    }

    function newCard(content, parent, cardId) {
        if (content == "") return null;
        var card = document.createElement("div");
        card.setAttribute("class", "textcard");
        card.setAttribute("id", "textcard-" + cardId);
        card.appendChild(document.createTextNode(content));
        $ID(parent).appendChild(card);
        $ID(parent).appendChild(textCardControl(cardId));
        window["segment" + cardId] = segment;
        if (content.hasCHN()) { wordSegment(content, "segment" + cardId) } else { $ID("textcard-" + (cardId)).setAttribute("text", content.replace(/\s+/g, "|")) };
    }

    function wordSegment(text, callback) {
        text = fixedURI(text.replace(/[\u201c\u201d\u3002\uff0c\u3001\u2026\u2026\uff1b\uff1a]/g, " "));
        console.log(text);
        var base = "http://api.ltp-cloud.com/analysis/?",
            key = "k1O3z0v1d9Fo8ZeDurXxAubuKTJAStqVBgDXrW0H",
            pattern = "ws",
            format = "json",
            callback = callback ? new String(callback) : "segment";
        var args = "api_key=" + key + "&text=" + text + "&pattern=" + pattern + "&format=" + format + "&callback=" + callback;
        var url = base + args;
        var req = document.createElement('script');
        req.setAttribute('src', url);
        req.setAttribute('class', 'get-word-list')
        document.getElementsByTagName('body')[0].appendChild(req);
    }
}

function localStore(data) {
    console.log(Array.isArray(data));
    if (typeof(Storage) !== "undefined") {
        // 针对 localStorage/sessionStorage 的代码
        localStorage.setItem(cardId, data);
    } else {
        // 不支持 Web Storage ..
    }
}

function segment(data) {
    var wordlist = [];
    for (var i = 0; i < data.length; ++i) {
        for (var j = 0; j < data[i].length; ++j) {
            for (var k = 0; k < data[i][j].length; ++k) {
                if (data[i][j][k]["cont"].length > 0) wordlist.push(data[i][j][k]["cont"]);
            }
        }
    }
    console.log(wordlist);
    $ID("textcard-" + (cardId - 1)).setAttribute("text", wordlist.join("|"));
    localStore(wordlist.join("|"));
}

function fixedURI(str) {
    str = str.replace(" for ", " %66%6fr ").replace(" or ", " %6fr ").replace(" in ", " %69%6e "); // Server returns error  when includes "for"/"or"/"in"
    //return encodeURIComponent(str).replace(/《》[!'()*]/g, function(c) {
    //    return '%' + c.charCodeAt(0).toString(16);
    //});
    return str.replace(/《》[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });;
}

document.onreadystatechange = function() {
    if (document.readyState == "complete") app();
};


/*** Disabled functions ***
    function removeEle(id) {
        if ($ID(id)) $ID(id).parentNode.removeChild($ID(id));
    }

    var _togglePlayer = function() {
        var ele = $(".read-container")[0];
        if (ele.getAttribute("style") == "display:none") ele.setAttribute("style", "display:block")
    }
*/

String.prototype.hasCHN = function(data) {
    if (!data) data = this;
    var part1 = [];
    for (var i = 0; i < data.length; ++i) {
        if (data.charCodeAt(i) > 0x2E80 && data.charCodeAt(i) < 0xFE4F) {
            return true;
        }
    }
    return false;
}

function charCodeMax(text) {
    var max = 0;
    for (var i = 0; i < text.length; ++i) {
        if (text.charCodeAt(i) > max) max = text.charCodeAt(i)
    }
    return max;
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function b64(str) {
    var bin = "",
        out = "",
        fill = "00000000",
        posfix = "===",
        idx = "ABCDEFGHIJKLMNOPQRXTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var i = 0; i < str.length; i++) {
        var t = str.charCodeAt(i).toString(2);
        if (t.length < 8) t = fill.slice(0, 8 - t.length).concat(t);
        bin += t;
    }
    console.log(bin);
    bin.length % 24 ? posfix = posfix.slice(0, Math.floor((24 - bin.length % 24) / 6)) : posfix = "";
    if (bin.length % 6) bin += fill.slice(0, 6 - bin.length % 6);
    while (bin.length >= 6) {
        out += idx[parseInt(bin.slice(0, 6), 2)];
        bin = bin.slice(6);
    }
    return out + posfix;
};

function b64dec(str) {
    var idx = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    var bin = "",
        out = "";
    for (var i = 0; i < str.length; ++i) {
        var tmp = idx[str.charCodeAt(i)];
        if (~tmp) {
            tmp = "000000".slice(tmp.toString(2).length) + tmp.toString(2)
            bin += tmp.toString(2);
        }
    }
    while (bin.length > 0) {
        out += String.fromCharCode(parseInt(bin.slice(0, 8), 2));
        bin = bin.slice(8);
    }
    return out;
}

module.exports = {
    encode: b64,
    decode: b64dec
}

/***/ })
/******/ ]);