/*global console,jQuery,$,alert*/

function qstock_update_data() {
    "use strict";
//    jQuery.get("http://www.uleaborg.com/qmobi/bands.json", function (data) {
    jQuery.get("http://www.pepron.com/dev/qstock/bands.json", function (data) {
        console.log("update from pepron");
        if (typeof data === 'object') {
            window.localStorage.setItem("bands", JSON.stringify(data));
            console.log("tuli objektina");
        } else {
            window.localStorage.setItem("bands", (data));
            console.log("tuli stringinä");
        }
    });
}

function qstock_data_init() {
    "use strict";

    if (window.localStorage.getItem("bands") === null) {
        jQuery.get("data/bands.json", function (data) {
            console.log("update from file");
            if (typeof data === 'object') {
                window.localStorage.setItem("bands", JSON.stringify(data));
                console.log("tuli objektina");
            } else {
                window.localStorage.setItem("bands", (data));
                console.log("tuli stringinä");
            }
        });
    }
    qstock_update_data();
}

function qstock_get_bands() {
    "use strict";
    var bands, band_source;
    bands = [];
    if (window.localStorage.getItem("bands") === null) {
        qstock_data_init();
    } else {
        band_source = window.localStorage.getItem("bands");
        if (typeof band_source === 'object') {
            return band_source;
        } else {
            bands = JSON.parse(band_source);
        }
        return bands;
    }
    return bands;
}

function qstock_update_stars(fb_id, callback) {
    "use strict";
    var star_status, starred, unstarred, bands, callparams, safecallparams, callurl, modified, first, now;
    starred = [];
    unstarred = [];
    bands = qstock_get_bands();
    $.each(bands, function (i, band) {
        star_status = window.localStorage.getItem(band.url);
        if (star_status === "unstarred") {
            unstarred.push(band.url);
        } else if (star_status === "starred") {
            starred.push(band.url);
        }
    });

    first = true;
    safecallparams = "";
    $.each(starred, function (i, url) {
        modified = window.localStorage.getItem(url + "_modified");
        if (modified !== null) {
            if (first) {
                safecallparams = safecallparams + url + "#" + modified;
                first = false;
            } else {
                safecallparams = safecallparams + "," + url + "#" + modified;
            }
        }
    });
    
    callparams = "starred=" + encodeURIComponent(safecallparams);
    
    first = true;
    safecallparams = "";
    $.each(unstarred, function (i, url) {
        modified = window.localStorage.getItem(url + "_modified");
        if (modified !== null) {
            if (first) {
                safecallparams = safecallparams + url + "#" + modified;
                first = false;
            } else {
                safecallparams = safecallparams + "," + url + "#" + modified;
            }
        }
    });

    callparams = callparams + "&unstarred=" + encodeURIComponent(safecallparams);
    
    callurl = "http://www.pepron.com/dev/qstock/stars.php?fb_id=" + fb_id + "&" + callparams;
//    callurl = "http://localhost/~janne/pepron/public_html/dev/qstock/stars.php?fb_id=" + fb_id + "&" + callparams;
    jQuery.get(callurl, function (data) {
        now = new Date();
        data = JSON.parse(data);
        $.each(data.starred, function (i, item) {
            window.localStorage.setItem(item[0], "starred");
            window.localStorage.setItem(item[0] + "_modified", now.toJSON());
        });
        $.each(data.unstarred, function (i, item) {
            window.localStorage.setItem(item[0], "unstarred");
            window.localStorage.setItem(item[0] + "_modified", now.toJSON());
        });
        callback();
    });
}

