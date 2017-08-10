"use strict";
var $ = document.querySelectorAll.bind(document),
    $ID = document.getElementById.bind(document),
    $newEle = document.createElement.bind(document);
var cardId = 1;

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
        var btn1 = $newEle("button"),
            btn2 = $newEle("button");
        btn1.setAttribute("class", "roundbutton");
        btn2.setAttribute("class", "controlbutton");
        var icn1 = $newEle("i"),
            icn2 = $newEle("i");
        icn1.setAttribute("class", "material-icons play");
        icn1.innerText = "play_arrow";
        icn2.setAttribute("class", "material-icons delete");
        icn2.innerText = "delete";
        btn1.appendChild(icn1);
        btn1.addEventListener('click', function() {
            if ($ID("textcard-" + id).getAttribute("text")) { play(id); }
        });
        btn2.appendChild(icn2);
        btn2.addEventListener('click', function() {
            setTimeout(function() {
                var _x = $ID("textcard-" + id);
                if (_x != null) {
                    _x.parentNode.removeChild(_x.nextSibling);
                    _x.parentNode.removeChild(_x)
                }
            }, 200);
        })
        ctrl.appendChild(btn1);
        ctrl.appendChild(btn2);
        return ctrl;
    }

    function newCard(content, parent, cardId) {
        if (content == "") return null;
        var card = document.createElement("div");
        card.appendChild(document.createTextNode(content));
        card.setAttribute("class", "textcard");
        card.setAttribute("id", "textcard-" + cardId);
        $ID(parent).appendChild(card);
        $ID(parent).appendChild(textCardControl(cardId));
        requestWords(content);
    }

    function removeEle(id) {
        if ($ID(id)) $ID(id).parentNode.removeChild($ID(id));
    }

    var _togglePlayer = function() {
        var ele = $(".read-container")[0];
        if (ele.getAttribute("style") == "display:none") ele.setAttribute("style", "display:block")
    }



    function requestWords(text) {
        text = fixedURI(text.replace(/[\u201c\u201d\u3002\uff0c\u3001\u2026\u2026\uff1b\uff1a]/g, " "));
        console.log(text);
        var base = "http://api.ltp-cloud.com/analysis/?",
            key = "k1O3z0v1d9Fo8ZeDurXxAubuKTJAStqVBgDXrW0H",
            pattern = "ws",
            format = "json",
            callback = "segment",
            args = "api_key=" + key + "&text=" + text + "&pattern=" + pattern + "&format=" + format + "&callback=" + callback;
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