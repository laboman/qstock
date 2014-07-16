/*global console,jQuery,$,alert, qstock_get_bands*/
function getParameterByName(name) {
    "use strict";
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function isStarred(url) {
    "use strict";
    return window.localStorage.getItem(url) === "starred";
}

function switchstarred(url) {
    "use strict";
    var now, nowstr;
    now = new Date();
    if (window.localStorage.getItem(url) === "starred") {
        window.localStorage.setItem(url, "unstarred");
        window.localStorage.setItem(url + "_modified", now.toJSON());
        $("#band_starred").hide();
        $("#band_unstarred").show();
    } else {
        window.localStorage.setItem(url, "starred");
        window.localStorage.setItem(url + "_modified", now.toJSON());
        $("#band_starred").show();
        $("#band_unstarred").hide();
    }
}

function band_init() {
    "use strict";
    var src, url, band_date, image_url, bandstart, count;
    $("#artistlist").empty();
    src = getParameterByName("src");
    
    $("#badge-backlink").attr("href", src + ".html");
    
    url = getParameterByName("url");
    count = 0;
    
    $.each(qstock_get_bands(), function (i, band) {
        if ((band.url === url) && (count === 0)) {
            $("#header-content").append("<h1 class='band-title'>" + band.title + "</h1>");
            band_date = "Perjantai";
            if (band.date === "sat") {
                bandstart = band.start.substr(5);
                band_date = "Lauantai";
            } else {
                bandstart = band.start.substr(1);
            }

            //console.log(bandstart);
            if (bandstart.length === 3) {
                bandstart = bandstart.substr(0, 1) + ":" + bandstart.substr(1, 2);
            } else if (bandstart.length === 4) {
                bandstart = bandstart.substr(0, 2) + ":" + bandstart.substr(2, 2);
            }

            if (isStarred(band.url)) {
                $("#contentmeta").append('<p class="starred" id="band_starred" style="visibility:visible" onclick="switchstarred(' + "'" + url + "'" + ')">' + band_date + ' ' + bandstart + '</p>');
                $("#contentmeta").append('<p class="unstarred" id="band_unstarred" style="display:none" onclick="switchstarred(' + "'" + url + "'" + ')">' + band_date + ' ' + bandstart + '</p>');
            } else {
                $("#contentmeta").append('<p class="starred" id="band_starred" style="display:none" onclick="switchstarred(' + "'" + url + "'" + ')">' + band_date + ' ' + bandstart + '</p>');
                $("#contentmeta").append('<p class="unstarred" id="band_unstarred" style="visibility:visible" onclick="switchstarred(' + "'" + url + "'" + ')">' + band_date + ' ' + bandstart + '</p>');
            }

            image_url = "data/images/" + band.image;

            $("#contentmeta").append('<p><img src="' + image_url + '" width="265" height="216" alt=""></p>');
            $("#contentmeta").append('<div id="band-content"></div>');
            $("#band-content").append(band.content);
            count = count + 1;
        }
    });
}