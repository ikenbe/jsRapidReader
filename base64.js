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
    //console.log(bin);
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