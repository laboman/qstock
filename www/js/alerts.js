/*global console,jQuery,$,alert, qstock_get_bands, isStarred*/

function add_alert(band) {
    "use strict";
    var alertdate, datenow, banddate, bandstart, msgstr;
        
    if (window.localStorage.getItem("alertson") === "true") {
        datenow = new Date();
        
        banddate = new Date(2014, 6);
        
        if (band.date === "sat") {
            banddate.setDate(26);
        } else {
            banddate.setDate(25);
        }

        bandstart = band.start.substr(1);

        banddate.setHours(bandstart.substr(0, 2));
        banddate.setMinutes(bandstart.substr(2, 2));
        banddate.setSeconds(0);
        banddate.setMilliseconds(0);
                
        // Set alert 10 minutes before start
        alertdate = new Date(banddate.getTime() - 10 * 60 * 1000);

        //alertdate = new Date(datenow.getTime() + 30 * 1000); // Add alert after 30s
        
        if (band.venue === "paalava") {
            msgstr = "Kohta Päälavalla";
        } else if (band.venue === "kaleva-lava") {
            msgstr = "Kohta Kaleva-lavalla";
        } else if (band.venue === "koomalava") {
            msgstr = "Kohta Kooma-lavalla";
        } else if (band.venue === "rytmiranta") {
            msgstr = "Kohta Rytmi-rannassa";
        } else if (band.venue === "sirkusteltta") {
            msgstr = "Kohta Sirkus-teltassa";
        } else if (band.venue === "oulu-lava") {
            msgstr = "Kohta Oulu-lavalla";
        } else {
            msgstr = "Aloittaa kohta";
        }

        window.plugin.notification.local.add({
            id:         band.url,
            date:       alertdate,
            message:    msgstr,
            title:      band.title,
            repeat:     "",
            badge:      1,  // Displays number badge to notification
            sound:      "",  // A sound to be played
            json:       "",  // Data to be passed through the notification
            autoCancel: true, // Setting this flag and the notification is automatically canceled when the user clicks it
            ongoing:    true // Prevent clearing of notification (Android only)
        });
    }
}

function alert_callback() {
    "use strict";
    // DO nothing
}

function delete_alert(band) {
    "use strict";
    window.plugin.notification.local.cancel(band.url, alert_callback);
}

function enable_alerts() {
    "use strict";
    var count;
    window.localStorage.setItem("alertson", "true");
    count = 0;
    $.each(qstock_get_bands(), function (i, band) {
        if (isStarred(band.url)) {
            add_alert(band);
            count = count + 1;
        }
    });
    if (count === 0) {
        alert('Valitse ensin suosikkeja, joille voit laittaa muistutuksen!!');
    } else {
        alert(count + ' muistutusta asetettu');
    }
}

function disable_alerts() {
    "use strict";
    window.plugin.notification.local.cancelAll();
    window.localStorage.setItem("alertson", "false");
    alert('Kaikki muistutukset poistettu!');
}

function alerts_on() {
    "use strict";
    if (window.localStorage.getItem("alertson") === "true") {
        return true;
    } else {
        return false;
    }
}


