/*global console,jQuery,$,alert*/

function qstock_update_data() {
    "use strict";
    jQuery.get("http://www.pepron.com/dev/qstock/bands.json", function (data) {
    	if (typeof data === 'object') {
        	window.localStorage.setItem("bands", JSON.stringify(data));    	
    	} else {
        	window.localStorage.setItem("bands", (data));
        }
    });
}

function qstock_data_init() {
    "use strict";

    // IN BROWSER LOAD PAGE ONES TO FORCE UPLOAD BY UNCOMMENTING FOLLOWING LINE, AFTER THAT PLACE BACK TO COMMENTS
    // window.localStorage.removeItem("bands");
    
    if (window.localStorage.getItem("bands") === null) {
        jQuery.get("data/bands.json", function (data) {
            if (typeof data === 'object') {
        	   window.localStorage.setItem("bands", JSON.stringify(data));    
    	    } else {
        	   window.localStorage.setItem("bands", (data));
            }
            qstock_update_data();
        });
    } else {
        qstock_update_data();
    }
}

function qstock_get_bands() {
    "use strict";
    var bands;
    bands = [];
    if (window.localStorage.getItem("bands") === null) {
        qstock_data_init();
    } else {
        bands = JSON.parse(window.localStorage.getItem("bands"));
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

