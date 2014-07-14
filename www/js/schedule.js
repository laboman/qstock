/*global console,jQuery,$,isStarred, getParameterByName, qstock_get_bands, alerts_on, alert*/

function getIndicatorWidth(timenow) {
    "use strict";
    var pos;
    if (timenow.getHours() < 2) {
        // After midnight
        pos = 140 * 12 + timenow.getHours() * 153 + timenow.getMinutes() * 2;
    } else if (timenow.getHours() < 12) {
        // morning between 2AM and 12PM, just left.
        pos = 0;
    } else {
        pos = (timenow.getHours() - 12) * 153 + timenow.getMinutes() * 2;
    }
    return pos;
}

function schedule_selectday(selection) {
    "use strict";
    var timenow, fri_start, fri_end, sat_end, pos;
    if (selection === "friday") {
        $("#anchor_now").removeClass('current-menu-item');
        $("#anchor_fri").addClass('current-menu-item');
        $("#anchor_sat").removeClass('current-menu-item');
        $(".friday").show();
        $(".saturday").hide();
        $(".now_indicator").hide();
    } else if (selection === "saturday") {
        $("#anchor_now").removeClass('current-menu-item');
        $("#anchor_fri").removeClass('current-menu-item');
        $("#anchor_sat").addClass('current-menu-item');
        $(".friday").hide();
        $(".saturday").show();
        $(".now_indicator").hide();
    } else {
        $("#anchor_now").addClass('current-menu-item');
        $("#anchor_fri").removeClass('current-menu-item');
        $("#anchor_sat").removeClass('current-menu-item');
        timenow = new Date();
        // 25.7.2014 16:00
        fri_start = new Date(2014, 6, 25, 16, 0, 0, 0);
        // 26.7.2014 02:00
        fri_end = new Date(2014, 6, 26, 2, 0, 0, 0);
        // 27.7.2014 02:00
        sat_end = new Date(2014, 6, 27, 2, 0, 0, 0);
        //
        pos = 0;
        if ((timenow - fri_start) < 0) {
            // Not started yet, just show Friday
            $(".saturday").hide();
            $(".friday").show();
            $(".now_indicator").hide();
        } else if ((timenow - fri_end) < 0) {
            // Friday
            $(".saturday").hide();
            $(".friday").show();
            pos = getIndicatorWidth(timenow);
            $(".now_indicator").width(pos);
            $("#timetable-scrollarea").scrollLeft(pos);
            $(".now_indicator").show();
            window.localStorage.setItem("schedule_scrollleft", pos);
        } else if ((timenow - sat_end) < 0) {
            $(".friday").hide();
            $(".saturday").show();
            pos = getIndicatorWidth(timenow);
            $(".now_indicator").width(pos);
            $("#timetable-scrollarea").scrollLeft(pos);
            $(".now_indicator").show();
            window.localStorage.setItem("schedule_scrollleft", pos);
        } else {
            $(".friday").hide();
            $(".saturday").show();
            $(".now_indicator").hide();
        }
    }
    window.localStorage.setItem("schedule_day", selection);
}

function scrollHandler(a) {
    "use strict";
    window.localStorage.setItem("schedule_scrollleft", $("#timetable-scrollarea").scrollLeft());
}

function starred_click(url) {
    "use strict";
    switchstarred(url);
    $("#img_starred_"+url).hide();
    $("#img_unstarred_"+url).show();
}

function unstarred_click(url) {
    "use strict";
    switchstarred(url);
    $("#img_starred_"+url).show();
    $("#img_unstarred_"+url).hide();
}

function schedule_init() {
    "use strict";
    var class_str, class_str_ref, bandhtml, bandstart, band_float, band_h, band_min, band_e_h, band_e_min, duration, style_str, day, starred_img, unstarred_img;
    $("#artistlist").empty();
    
    day = getParameterByName("day");
    schedule_selectday(day);
        
    $.each(qstock_get_bands(), function (i, band) {
        if (isStarred(band.url)) {
            starred_img = '<img id="img_starred_' + band.url + '" src="img/icon-starred.png" onclick="starred_click(' + "'" + band.url + "'" + ')"</img>';
            unstarred_img = '<img id="img_unstarred_' + band.url + '" src="img/icon-unstarred.png" onclick="unstarred_click(' + "'" + band.url + "'" + ')" style="display:none"</img>';
        } else {
            starred_img = '<img id="img_starred_' + band.url + '" src="img/icon-starred.png" onclick="starred_click(' + "'" + band.url + "'" + ')" style="display:none"</img>';
            unstarred_img = '<img id="img_unstarred_' + band.url + '" src="img/icon-unstarred.png" onclick="unstarred_click(' + "'" + band.url + "'" + ')"</img>';
        }
        // friday has format "t1700" and saturday "t-sat1700";
        if (band.start.length < 6) {
            class_str_ref = "friday";
            style_str = "display:none;";
        } else {
            class_str_ref = "saturday";
            style_str = "";
        }

        if (band.start.length > 4) {
            bandstart = band.start.substr(band.start.length - 4, 4);
        }

        band_h = bandstart.substr(0, 2);
        band_min = bandstart.substr(2, 2);
        band_float = (band_h - 12) + (band_min / 60.0);
        duration = band.duration.substr(4);

        band_e_h = (parseFloat(band_h) + Math.floor((parseFloat(band_min) + parseFloat(duration)) / 60.0));
        if (band_e_h > 23) {
            band_e_h = band_e_h - 24;
        }
        band_e_min = ((parseFloat(band_min) + parseFloat(duration)) % 60);

        if (band_e_min < 10) {
            band_e_min = '0' + band_e_min;
        }

        duration = duration / 60.0;

        bandhtml = '<div class="schedule_w">';
        bandhtml = bandhtml + '<div class="schedule_d">';
        bandhtml = bandhtml + '<a href="band.html?src=schedule&url=' + band.url + '" class="' + class_str_ref + '" style="' + style_str + '">';
        bandhtml = bandhtml + '<div class="artist" style="absolute; left: ' + (band_float * 153) + 'px; width: ' + (duration * 153) + 'px;">';
        bandhtml = bandhtml + '<div id="band_schedule">';
        bandhtml = bandhtml + '<h1 class="' + class_str + '">' + band.title + '</h1>';
        bandhtml = bandhtml + '<p>' + band_h + ':' + band_min + '&rarr;' + band_e_h + ':' + band_e_min + '</p>';
        bandhtml = bandhtml + '</div>';
        bandhtml = bandhtml + '</div>';
        bandhtml = bandhtml + '</div></a>';
        bandhtml = bandhtml + '<div class="schedule_star ' + class_str_ref + '" style="absolute; left: ' + (band_float * 153) + 'px">' + starred_img + unstarred_img + '</div>';
        bandhtml = bandhtml + '</div>';
        $("." + band.venue).append(bandhtml);
    });
    if (window.localStorage.getItem("schedule_day") !== null) {
        schedule_selectday(window.localStorage.getItem("schedule_day"));
    }
        
    $("#timetable-scrollarea").scroll(scrollHandler);
    if (window.localStorage.getItem("schedule_scrollleft") !== null) {
        $("#timetable-scrollarea").scrollLeft(window.localStorage.getItem("schedule_scrollleft"));
    } else {
        $("#timetable-scrollarea").scrollLeft(140 * 4);
    }
    
    if (alerts_on()) {
        $(".alerts_off").hide();
        $(".alerts_on").show();
    } else {
        $(".alerts_off").show();
        $(".alerts_on").hide();
    }

}
