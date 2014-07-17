/*global console,jQuery,$,isStarred, openFB, alert, qstock_get_bands, enable_alerts, disable_alerts, alerts_on, qstock_update_stars*/


//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//    openFB.init('739780062745072', 'http://localhost/openfb/oauthcallback.html', window.localStorage);

var FB_ID = "facebook_id";

function errorHandler(error) {
    "use strict";
    $(".fb_out").show();
    $(".fb_in").hide();
    if (error.error_code === "200") {
        alert("Sisäänkirjautuminen epäonnistui!");
    }
}

function getInfo() {
    "use strict";
    openFB.api({
        path: '/me',
        success: function (data) {
            localStorage.setItem(FB_ID, data.id);
        },
        error: errorHandler
    });
}

function fb_login() {
    "use strict";
    openFB.login('email',
            function () {
            $(".fb_out").hide();
            $(".fb_in").show();
            getInfo();
        },
        errorHandler
        );
}


function fb_logout() {
    "use strict";
    localStorage.removeItem(FB_ID);
    $(".fb_out").show();
    $(".fb_in").hide();
    openFB.revokePermissions(
        function () {
            $(".fb_out").show();
            $(".fb_in").hide();
        },
        errorHandler
    );
}

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
}

function setalerts_on() {
    "use strict";
    $(".alerts_off").hide();
    $(".alerts_on").show();
    enable_alerts();
}

function setalerts_off() {
    "use strict";
    $(".alerts_off").show();
    $(".alerts_on").hide();
    disable_alerts();
}

function insertbands() {
    "use strict";
    var class_str, bands_inserted, start, a_start, b_start, bands, venue;
    bands_inserted = [];
    bands = qstock_get_bands();
    bands.sort(function (a, b) {
        if (a.date !== b.date) {
            if (a.date === "fri") {
                return -1;
            } else {
                return 1;
            }
        } else {
            a_start = a.start.substr(a.start.length - 4, 4);
            b_start = b.start.substr(b.start.length - 4, 4);
            return a_start.localeCompare(b_start);
        }
    });
    $.each(bands, function (i, band) {
        if (isStarred(band.url)) {
            start = band.start.substr(band.start.length - 4, 4);
            start = start.substr(0, 2) + ":" + start.substr(2, 2);
            venue=band.venue;
            if(venue==='paalava'){
                venue='Päälava';
            }
            if (band.date === "fri") {
                $("#artistlist_fri").append('<li><a class="starred" href="band.html?src=owncalendar&url=' + band.url + '">' + start + " " + venue + " " + band.title + '</a></li>');
            } else {
                $("#artistlist_sat").append('<li><a class="starred" href="band.html?src=owncalendar&url=' + band.url + '">' + start + " " + venue + " " + band.title + '</a></li>');
            }
            bands_inserted.push(band.url);
        }
    });
    if (bands_inserted.length > 0) {
        $("#normalmode").show();
        $("#no_starred").hide();
    } else {
        $("#normalmode").hide();
        $("#no_starred").show();
    }
}

function owncalendar_init() {
    "use strict";
    //openFB.init('739780062745072'); // Defaults to sessionStorage for storing the Facebook token
    insertbands();
    if (alerts_on()) {
        $(".alerts_off").hide();
        $(".alerts_on").show();
    } else {
        $(".alerts_off").show();
        $(".alerts_on").hide();
    }
/*    if (localStorage.getItem(FB_ID) === null) {
        $(".fb_out").show();
        $(".fb_in").hide();
    } else {
        $(".fb_out").hide();
        $(".fb_in").show();
    }*/
}

function stars_updated() {
    "use strict";
    $("#artistlist_fri").empty();
    $("#artistlist_sat").empty();
    insertbands();
    alert("Suosikit synkattu!");
}

function sync_stars() {
    "use strict";
    if (localStorage.getItem(FB_ID) === null) {
        alert("LOGGAA ENSIN");
    } else {
        qstock_update_stars(localStorage.getItem(FB_ID), stars_updated);
    }
}


