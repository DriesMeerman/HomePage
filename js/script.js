/*=====================================================================================================*/
/* Giving credit where credit is due, The JS is all built off of my original mod of Twily's homepage. */
/* If there are any similarities left, it's probably because it's based on his code.                 */
/*==================================================================================================*/

var $ = function (id) {
    return document.getElementById(id);
};
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THRUSDAY", "FRIDAY", "SATURDAY"];

/*==============*/
/*== Options ==*/
/*============*/

var CookiePrefix = "taco_stpg_"; //prefix for cookies.
var cmdPrefix = "!"; //prefix for commands.
var ssi = 1; //set default search provider. Use array index of the array below. (Starting with 0)
// Format: [Keyword, Search URL (Search query replaces "{Q}"), "Input placeholder text"]
var searchSources = [
    ["bbt", "http://bakabt.me/browse.php?q={Q}", "BakaBT"],
    ["g", "https://www.google.com/#q={Q}", "google_logo"],
    ["im", "https://www.google.com/search?tbm=isch&q={Q}", "google_logo Images"],
    ["imdb", "http://www.imdb.com/find?q={Q}", "IMDB"],
    ["nya", "https://www.nyaa.se/?page=search&term={Q}", "Nyaa Torrents"],
    ["ud", "http://www.urbandictionary.com/define.php?term={Q}", "Urban Dictionary"],
    ["wp", "http://en.wikipedia.org/w/index.php?search={Q}", "Wikipedia"],
    ["yt", "https://www.youtube.com/results?search_query={Q}", "YouTube"]
];

// Because I care about readability in my JS. kthx.

// var menu = [
//
//     {
//         svgIcon: svgCode,
//         noIconPadding: false,
//         name: "Programming",
//         colorClass: "red",
//         links: [
//             {name: 'Github', url: "https://github.com", color: ""},
//             {name: 'Stack Overflow', url: "https://stackoverflow.com", color: ""}
//         ]
//     },
//     {
//         svgIcon: svgCloud,
//         noIconPadding: true,
//         name: "Cloud",
//         colorClass: "green",
//         links: [
//             {name: 'Demo 4 Home', url: "https://plat4mationdemo4.service-now.com/nav_to.do",},
//             {name: 'Script', url: "https://plat4mationdemo4.service-now.com/nav_to.do?uri=%2Fsys.scripts.do", },
//             {name: '$Studio', url: "https://plat4mationdemo4.service-now.com/$studio", },
//             {name: 'Knowledge', url: "https://knowledge.plat4mation.com", color: "orange"},
//             {name: 'Boards4U', url: "https://plat4mation.service-now.com/boards4u", color: "white"},
//             {name: 'Time writing', url: "https://plat4mation.service-now.com/sp?id=worker_portal", color: "white"},
//         ]
//     },
//
// ];

/* Header Format: ["(Label)", "(Accent Color)", "-HEAD-"],
*   - The labels are setup for 24px SVGs. by default they are separated from the linkMenu for readability.
*   - Accent color can be: black, white, blue, green, cyan, red, magenta, and yellow. by default, the accent color is white.
*   - ALL categories need a header to start them. Headers are signified by the -HEAD- in the 3rd position.
* Link Format: ["Name", "URL",""],
*   - Name and URL are pretty self explanitory. 
*   - 3rd position may be used in the future, but right now it's not used and can be left blank.
*/
// Also yes I could totally use a json object to represent the menus, but I didn't feel like reprogramming the whole script. Probably doing that next site, though.
var linkMenu = [
    [svgTrash, "blue", "-HEAD-"], // Anime
    ["AnimeNewsNetwork", "", ""],
    ["MyAnimeList", "", ""],
    ["Nyaa Tracker", "", ""],
    ["BakaBT", "", ""],

    [svgSocial, "green", "-HEAD-"], // Media
    ["YouTube", "", ""],
    ["Facebook", "", ""],
    ["Reddit", "", ""],
    ["Twitch", "", ""],
    ["DeviantArt", "", ""],

    [svgClover, "cyan", "-HEAD-"], // 4chan
    ["/a/ Anime & Manga", "", ""],
    ["/g/ Technology", "", ""],
    ["/w/ Anime/Wallpapers", "", ""],
    ["/wg/ Wallpaper/General", "", ""],

    [svgCode, "red", "-HEAD-"], // FuelRats
    ["GitHub", "", ""],
    ["Gist", "", ""],
    ["JSFiddle", "", ""],
    ["Stack Overflow", "", ""],

    [svgGamepad, "magenta", "-HEAD-"], // Gaming
    ["Steam", "", ""],
    ["Humble Bundle", "", ""],
    ["GOG.com", "", ""],
    ["/r/gaming", "", ""],

    [svgMore, "yellow", "-HEAD-"], // Other
    ["Gmail", "", ""],
    ["Amazon", "", ""],
    ["Dropbox", "", ""],
    ["Netflix", "", ""],
    ["Weather", "", ""],
];
// DID I FORGET TO MENTION?! THE DEMO LINKS DO NOTHING!

/*==================*/
/*== Main Script ==*/
/*================*/

//core element vars
var searchInput = $('searchBar');
var rootMenuUL = $('categoryMenu');
var dateDiv = $('dateContainer');
var notesTextarea = $('notesInput');

function init() {
    initSearchBar();
    buildDate();
    //buildMenu();

    createMenu(menu);

    $('body').style.opacity = 1;
    $('mainContainer').style.opacity = 1;
    $('dateContainer').style.opacity = 1;
    $('notesWidget').style.opacity = 1;
}

function initSearchBar() {
    if (searchSources[ssi] !== undefined)
        searchInput.placeholder = searchSources[ssi][2];
    else {
        ssi = 0;
        searchInput.placeholder = "Do you know what you're doing?";
        alert("Error: default search engine setting is invalid!");
    }

    document.addEventListener('keydown', function (event) {
        handleKeydown(event);
    });

    searchInput.value = "";
}

function buildDate() {
    var today = new Date();
    dateDiv.innerHTML = "<font class=\"font-3em\">" +
        monthNames[today.getMonth()] +
        " " +
        today.getDate() +
        "</font><br><font>" +
        dayNames[today.getDay()] +
        ", " +
        today.getFullYear() +
        "</font>";
}

function createMenu(menu){
    var newMenu = "";

    menu.forEach(function(menuItem){
        var html = "<li class=\"button-container expanding-down\">" +
                        "<div class=\"button accent-" + menuItem.colorClass + "\">" +
                            "<label class=\"button-content " + (menuItem.noIconPadding ? 'no-pad' : '') + "\">" + menuItem.svgIcon + "</label>" +
                            "<div class=\"button-expanded-content\">" +
                                "<ul class=\"menu-link container\">" +
                                    generateLinkContainer(menuItem.links) +
                                "</ul>" +
                            "</div>" +
                        "</div>" +
                    "</li>";
        newMenu += html + "\n";
    });

    rootMenuUL.innerHTML = newMenu;


    // if (linkMenu[0][1] !== "") accent = linkMenu[0][1].toLowerCase();
    // else accent = "white";
    //
    // newMenu += "<li class=\"button-container expanding-down\"><div class=\"button accent-" + accent + "\"><label class=\"button-content\">" + linkMenu[0][0] + "</label><div class=\"button-expanded-content\"><ul class=\"menu-link container\">";
    //
    // for (var i = 1; i < linkMenu.length; i++) {
    //     if (linkMenu[i][2] === "-HEAD-") {
    //
    //         if (linkMenu[i][1] !== "") accent = linkMenu[i][1].toLowerCase();
    //         else accent = "white";
    //
    //         newMenu += "</ul></div></div></li><li class=\"button-container expanding-down\"><div class=\"button accent-" + accent + "\"><label class=\"button-content\">" + linkMenu[i][0] + "</label><div class=\"button-expanded-content\"><ul class=\"menu-link container\">";
    //     } else {
    //         newMenu += "<li class='menu-link-item'><a href=\"" + linkMenu[i][1] + "\" target=\"_self\"><label>" + linkMenu[i][0] + "</label></a></li>";
    //     }
    // }
    // newMenu += "</ul></div></div></li>";
    //
    // rootMenuUL.innerHTML = newMenu;
}

function generateLinkContainer(links) {
    var html = "";
    links.forEach(function(link){
        var linkHtml = "<li class='menu-link-item' style='padding: 2px; text-align: center'>" +
            "<a href='" + link.url + "'>" +
                "<label style='color:"+link.color+"'>" + link.name + "</label>" +
            "</a></li>";
        html+= linkHtml + "\n";
    })
    return html;
}

function buildMenu() {
    var newMenu = "";
    var accent = "";

    if (linkMenu[0][2] === "-HEAD-") {

        if (linkMenu[0][1] !== "") accent = linkMenu[0][1].toLowerCase();
        else accent = "white";

        newMenu += "<li class=\"button-container expanding-down\"><div class=\"button accent-" + accent + "\"><label class=\"button-content\">" + linkMenu[0][0] + "</label><div class=\"button-expanded-content\"><ul class=\"menu-link container\">";
    } else {
        alert("linkMenu is invalid. Ensure to start the list with a -HEAD- entry.");
    }
    for (var i = 1; i < linkMenu.length; i++) {
        if (linkMenu[i][2] === "-HEAD-") {

            if (linkMenu[i][1] !== "") accent = linkMenu[i][1].toLowerCase();
            else accent = "white";

            newMenu += "</ul></div></div></li><li class=\"button-container expanding-down\"><div class=\"button accent-" + accent + "\"><label class=\"button-content\">" + linkMenu[i][0] + "</label><div class=\"button-expanded-content\"><ul class=\"menu-link container\">";
        } else {
            newMenu += "<li class='menu-link-item'><a href=\"" + linkMenu[i][1] + "\" target=\"_self\"><label>" + linkMenu[i][0] + "</label></a></li>";
        }
    }
    newMenu += "</ul></div></div></li>";

    rootMenuUL.innerHTML = newMenu;
}

function handleQuery(event, query) {
    var key = event.keyCode || event.which;
    if (query !== "") {
        var qlist;
        if (key === 32) {
            qList = query.split(" ");
            if (qList[0].charAt(0) === cmdPrefix) {
                var keyword = "";
                for (var i = 0; i < searchSources.length; i++) {
                    keyword = cmdPrefix + searchSources[i][0];
                    if (keyword === qList[0]) {
                        ssi = i;
                        searchInput.placeholder = searchSources[ssi][2];
                        searchInput.value = query.replace(keyword, "").trim();
                        event.preventDefault();
                        break;
                    }
                }
            }
        } else if (key === 13) {
            qList = query.split(" ");
            if (qList[0].charAt(0) === cmdPrefix) {
                var keyword = "";
                for (var i = 0; i < searchSources.length; i++) {
                    keyword = cmdPrefix + searchSources[i][0];
                    if (keyword === qList[0]) {
                        ssi = i;
                        break;
                    }
                }
                if (qList.length > 1) {
                    window.location = searchSources[ssi][1].replace("{Q}", encodeURIComponent(query.replace(keyword, ""))).trim();
                } else {
                    searchInput.placeholder = searchSources[ssi][2];
                    searchInput.value = "";
                }
            } else {
                window.location = searchSources[ssi][1].replace("{Q}", encodeURIComponent(query));
            }
        }
    }
    if (key === 27) {
        searchInput.blur();
    }
}

function handleNoteInput(event) {
    var key = event.keyCode || event.which;
    if (key === 27) {
        notesTextarea.blur();
    }
}

var noteText = null;

function handleNotes(event, focus) {
    if (focus) {
        if (!noteText) {
            noteText = GetCookie("notes") || "";
        }
        notesTextarea.value = noteText;
        addClass('notesContainer', "active");
    } else {
        removeClass('notesContainer', "active");
        if (noteText !== notesTextarea.value) {
            noteText = notesTextarea.value;
            SetCookie("notes", noteText, 365 * 24 * 60 * 60 * 1000);
        }
    }
}

var ignoredKeys = [9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145];

function handleKeydown(event) {
    if (notesInput === document.activeElement) return;
    if (searchInput === document.activeElement) return;
    if (ignoredKeys.includes(event.keyCode)) return;
    searchInput.focus();
}

function addClass(elementID, className) {
    $(elementID).classList.add(className);
}

function removeClass(elementID, className) {
    $(elementID).classList.remove(className);
}

function GetCookie(name) {
    try {
        var cookie = document.cookie;
        name = CookiePrefix + name;
        var valueStart = cookie.indexOf(name + "=") + 1;
        if (valueStart === 0) {
            return null;
        }
        valueStart += name.length;
        var valueEnd = cookie.indexOf(";", valueStart);
        if (valueEnd == -1)
            valueEnd = cookie.length;
        return decodeURIComponent(cookie.substring(valueStart, valueEnd));
    } catch (e) {
        console.log(e);
    }
    return null;
}

function SetCookie(name, value, expire) {
    var temp = CookiePrefix + name + "=" + escape(value) + ";" + (expire !== 0 ? "expires=" + ((new Date((new Date()).getTime() + expire)).toUTCString()) + ";" : " path=/;");
    console.log(temp);
    document.cookie = temp;
}

function CanSetCookies() {
    SetCookie('CookieTest', 'true', 0);
    var can = GetCookie('CookieTest') !== null;
    DelCookie('CookieTest');
    return can;
}

function DelCookie(name) {
    document.cookie = fr.client.CookieBase + name + '=0; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}