/*global console,jQuery,$,isStarred, qstock_get_bands, alert*/

function bands_selectday(selection) {
    "use strict";
    if (selection === "friday") {
        $("#anchor_all").removeClass('current-menu-item');
        $("#anchor_fri").addClass('current-menu-item');
        $("#anchor_sat").removeClass('current-menu-item');
        $(".friday").show();
        $(".saturday").hide();
    } else if (selection === "saturday") {
        $("#anchor_all").removeClass('current-menu-item');
        $("#anchor_fri").removeClass('current-menu-item');
        $("#anchor_sat").addClass('current-menu-item');
        $(".friday").hide();
        $(".saturday").show();
    } else {
        $("#anchor_all").addClass('current-menu-item');
        $("#anchor_fri").removeClass('current-menu-item');
        $("#anchor_sat").removeClass('current-menu-item');
        $(".friday").show();
        $(".saturday").show();
    }
    window.localStorage.setItem("bands_day", selection);
}

function scrollHandler(a) {
    "use strict";
    window.localStorage.setItem("bands_scrolltop", $("#maincontent-scroll").scrollTop());
}

function unstarredclick(url) {
    "use strict";
    switchstarred(url);
    $("#img_starred_"+url).show();
    $("#img_unstarred_"+url).hide();
}
          
function starredclick(url) {
    "use strict";
    switchstarred(url);
    $("#img_starred_"+url).hide();
    $("#img_unstarred_"+url).show();
}

function bands_init() {
    "use strict";
    var class_str, bands_inserted, starred_img, unstarred_img, bands, title_tocomp;
    
    $("#artistlist").empty();
    bands_inserted = [];

    bands = qstock_get_bands();

    bands.sort(function (a, b) {
        return a.title.localeCompare(b.title);
    });
    
    var count = 0;
    
    $.each(bands, function (i, band) {
        if (bands_inserted.indexOf(band.url) === -1) {
            if (isStarred(band.url)) {
                starred_img = '<img id="img_starred_' + band.url + '" src="img/icon-starred.png" onclick="starredclick(' + "'" + band.url + "'" + ')"</img>';
                unstarred_img = '<img id="img_unstarred_' + band.url + '" src="img/icon-unstarred.png" onclick="unstarredclick(' + "'" + band.url + "'" + ')" style="display:none"</img>';
            } else {
                starred_img = '<img id="img_starred_' + band.url + '" src="img/icon-starred.png" onclick="starredclick(' + "'" + band.url + "'" + ')" style="display:none"</img>';
                unstarred_img = '<img id="img_unstarred_' + band.url + '" src="img/icon-unstarred.png" onclick="unstarredclick(' + "'" + band.url + "'" + ')"</img>';
            }
            if (band.date === "fri") {
                class_str = "friday";
            } else {
                class_str = "saturday";
            }
            $("#artistlist").append('<li class="' + class_str + '" id="bands_li">' + unstarred_img + starred_img + '<a class="band_item" href="band.html?src=bands&url=' + band.url + '">' + band.title + '</a></li>');
            bands_inserted.push(band.url);
            if (count === 0) {
                alert('<li class="' + class_str + '" id="bands_li">' + unstarred_img + starred_img + '<a class="band_item" href="band.html?src=bands&url=' + band.url + '">' + band.title + '</a></li>');   
            }
            count = count + 1;
            
        }
    });
    if (window.localStorage.getItem("bands_day") !== null) {
        bands_selectday(window.localStorage.getItem("bands_day"));
    }
    if (window.localStorage.getItem("bands_scrolltop") !== null) {
        $("#maincontent-scroll").scrollTop(window.localStorage.getItem("bands_scrolltop"));
    }

    $("#maincontent-scroll").scroll(scrollHandler);
}