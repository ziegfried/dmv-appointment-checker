var Browser = require('zombie');
var request = require('request');
var moment = require('moment');
var _ = require('underscore');

var data = {
    first: 'JOHN',
    last: 'DOE',
    birthday: '01/21/1979',
    phone: '415-815-4711',
    licenceNumber: 'Y1231234'
};

var limitDaysOut = 9;

function getNextAppointmentDate(data, callback) {
    var browser = new Browser({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18',
        silent: true
    });
    browser.visit('https://www.dmv.ca.gov/foa/clear.do?goTo=driveTest').then(function() {

        console.log('Filling form with data', _.pick(data, 'first', 'last', 'licenseNumber', 'birthday', 'phone'));

        browser.query('#officeId').value = data.office;
        // Select type of test: Automobile
        browser.query('#DT').checked = true;

        // Fill data
        browser.fill('#first_name', data.first);
        browser.fill('#last_name', data.last);
        browser.fill('#dl_number', data.licenceNumber);

        var bday = data.birthday.split('/');
        browser.fill('[name=birthMonth]', bday[0]);
        browser.fill('[name=birthDay]', bday[1]);
        browser.fill('[name=birthYear]', bday[2]);

        var phone = data.phone.split('-');
        browser.fill('[name=telArea]', phone[0]);
        browser.fill('[name=telPrefix]', phone[1]);
        browser.fill('[name=telSuffix]', phone[2]);

        browser.pressButton('input[type=submit]', function() {
            var alerts = browser.document.querySelectorAll('p.alert');
            console.log('Alerts: \n\t' + _(alerts).pluck('textContent').join('\n\t'));
            var value = alerts[1].textContent;
            browser.close();
            callback(value);
        });
    });
}


function checkNextOffice(data, offices) {
    var office = offices.shift();
    if (!office) return;
    console.log('Checking appointment for ' + getOfficeName(office));
    getNextAppointmentDate(_.extend({office: office}, data), function(value) {
        console.log('Next appointment value: ' + ': ' + value);

        var appointmentDate = moment(value, 'dddd, MMMM DD, YYYY, h:mm a');
        if (appointmentDate.diff(moment(), 'days') < limitDaysOut) {
            console.log('NOTIFYING');
            notify('DMV appointment in ' + getOfficeName(office) + ' ' + appointmentDate.fromNow() + ' - <https://www.dmv.ca.gov/foa/clear.do?goTo=driveTest|GOTO DMV>!', data.slackUrl);
        }
        checkNextOffice(data, offices);
    });
}
require('fs').readFile('data.json', function(err, data) {
    if (err) {
        console.log("Can't read data.json");
        return;
    }

    data = JSON.parse(data.toString());
    checkNextOffice(data, data.offices);
});

function getOfficeName(id) {
    return {
        537: "ALTURAS",
        587: "ARLETA",
        661: "ARVIN",
        570: "AUBURN",
        529: "BAKERSFIELD",
        679: "BAKERSFIELD SW",
        641: "BANNING",
        582: "BARSTOW",
        576: "BELL GARDENS",
        606: "BELLFLOWER",
        585: "BISHOP",
        528: "BLYTHE",
        597: "BRAWLEY",
        550: "CAPITOLA",
        625: "CARMICHAEL",
        520: "CHICO",
        613: "CHULA VISTA",
        580: "CLOVIS",
        603: "COALINGA",
        564: "COLUSA",
        581: "COMPTON",
        523: "CONCORD",
        534: "CORTE MADERA",
        628: "COSTA MESA",
        524: "CRESCENT CITY",
        514: "CULVER CITY",
        599: "DALY CITY",
        598: "DAVIS",
        615: "DELANO",
        669: "EL CAJON",
        527: "EL CENTRO",
        556: "EL CERRITO",
        685: "EL MONTE",
        526: "EUREKA",
        621: "FAIRFIELD",
        643: "FALL RIVER MILLS",
        655: "FOLSOM",
        657: "FONTANA",
        590: "FORT BRAGG",
        644: "FREMONT",
        505: "FRESNO",
        646: "FRESNO NORTH",
        607: "FULLERTON",
        627: "GARBERVILLE",
        623: "GILROY",
        510: "GLENDALE",
        670: "GOLETA",
        541: "GRASS VALLEY",
        565: "HANFORD",
        609: "HAWTHORNE",
        579: "HAYWARD",
        635: "HEMET",
        546: "HOLLISTER",
        508: "HOLLYWOOD",
        652: "HOLLYWOOD WEST",
        578: "INDIO",
        610: "INGLEWOOD",
        521: "JACKSON",
        647: "KING CITY",
        605: "LAGUNA HILLS",
        687: "LAKE ISABELLA",
        530: "LAKEPORT",
        595: "LANCASTER",
        617: "LINCOLN PARK",
        622: "LODI",
        589: "LOMPOC",
        692: "LOMPOC DLPC",
        507: "LONG BEACH",
        502: "LOS ANGELES",
        693: "LOS ANGELES DLPC",
        650: "LOS BANOS",
        640: "LOS GATOS",
        533: "MADERA",
        658: "MANTECA",
        566: "MARIPOSA",
        536: "MERCED",
        557: "MODESTO",
        511: "MONTEBELLO",
        639: "MOUNT SHASTA",
        540: "NAPA",
        584: "NEEDLES",
        662: "NEWHALL",
        586: "NORCO",
        686: "NOVATO",
        504: "OAKLAND CLAREMONT",
        604: "OAKLAND COLISEUM",
        596: "OCEANSIDE",
        522: "OROVILLE",
        636: "OXNARD",
        683: "PALM DESERT",
        659: "PALM SPRINGS",
        690: "PALMDALE",
        601: "PARADISE",
        509: "PASADENA",
        574: "PASO ROBLES",
        634: "PETALUMA",
        592: "PITTSBURG",
        525: "PLACERVILLE",
        631: "PLEASANTON",
        532: "POMONA",
        573: "PORTERVILLE",
        676: "POWAY",
        544: "QUINCY",
        612: "RANCHO CUCAMONGA",
        558: "RED BLUFF",
        551: "REDDING",
        626: "REDLANDS",
        548: "REDWOOD CITY",
        633: "REEDLEY",
        577: "RIDGECREST",
        545: "RIVERSIDE",
        656: "RIVERSIDE EAST",
        673: "ROCKLIN",
        543: "ROSEVILLE",
        501: "SACRAMENTO",
        602: "SACRAMENTO SOUTH",
        539: "SALINAS",
        568: "SAN ANDREAS",
        512: "SAN BERNARDINO",
        648: "SAN CLEMENTE",
        506: "SAN DIEGO",
        519: "SAN DIEGO CLAIREMONT",
        503: "SAN FRANCISCO",
        516: "SAN JOSE",
        645: "SAN JOSE DLPC",
        547: "SAN LUIS OBISPO",
        620: "SAN MARCOS",
        593: "SAN MATEO",
        619: "SAN PEDRO",
        677: "SAN YSIDRO",
        542: "SANTA ANA",
        549: "SANTA BARBARA",
        632: "SANTA CLARA",
        563: "SANTA MARIA",
        616: "SANTA MONICA",
        630: "SANTA PAULA",
        555: "SANTA ROSA",
        668: "SANTA TERESA",
        567: "SEASIDE",
        660: "SHAFTER",
        680: "SIMI VALLEY",
        569: "SONORA",
        538: "SOUTH LAKE TAHOE",
        698: "STANTON DLPC",
        517: "STOCKTON",
        531: "SUSANVILLE",
        575: "TAFT",
        672: "TEMECULA",
        663: "THOUSAND OAKS",
        608: "TORRANCE",
        642: "TRACY",
        513: "TRUCKEE",
        594: "TULARE",
        553: "TULELAKE",
        649: "TURLOCK",
        638: "TWENTYNINE PALMS",
        535: "UKIAH",
        588: "VACAVILLE",
        554: "VALLEJO",
        515: "VAN NUYS",
        560: "VENTURA",
        629: "VICTORVILLE",
        559: "VISALIA",
        624: "WALNUT CREEK",
        583: "WATSONVILLE",
        572: "WEAVERVILLE",
        618: "WEST COVINA",
        611: "WESTMINSTER",
        591: "WHITTIER",
        571: "WILLOWS",
        637: "WINNETKA",
        561: "WOODLAND",
        552: "YREKA",
        562: "YUBA CITY"
    }[id];
}

function notify(msg, slackUrl) {
    if (!slackUrl) {
        return;
    }
    var payload = {
        text: msg,
        username: 'DMV Check'
    };
    request.post(slackUrl, {form: {payload: JSON.stringify(payload)}});
}