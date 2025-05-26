// ==UserScript==
// @name         Shabon: Grab Links
// @namespace    Whonderful
// @version      2024-08-06
// @description  Grab all links and copy it to clipboard
// @author       WhonderWy
// @match        https://rawdl.net/forum.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rawdl.net
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// ==/UserScript==
// THIS DOESN'T WORK.

(function() {
    'use strict';

    // Your code here...
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function navigateToPageB(urlB) {
        const response = await fetch(urlB);
        const pageBContent = await response.text();
        const parser = new DOMParser();
        const pageBDocument = parser.parseFromString(pageBContent, 'text/html');
        const script = pageBDocument.scripts[0].textContent;
        console.log("script", script);
        let cleansedScript = null;
        let _href = /(?<href>((_?)\w+)\s?=\s?['"]?href['"]?)/gm.exec(script);
        if (_href && _href.length > 2) {
            _href = _href[2];
            console.log("new href", _href);
        } else {
            _href = "";
        }
        var superSpecialTemporaryURL = null;
        var _superSpecialTemporaryURL = null;
        const re = new RegExp(`_?\\w*\\[['"]?${_href}['"]?\\]`);
        cleansedScript = script.replace(/;(_?)\w*[\.\[]['"]?href['"]?\]?/gm, ";superSpecialTemporaryURL").replace(re, ";superSpecialTemporaryURL").replace(/([};])\s?(_?\w+)\s?=/gm, "$1 var $2 =").replace("var superSpecialTemporaryURL", "superSpecialTemporaryURL");
        if (!cleansedScript.startsWith("function")) {
            cleansedScript = `var ${cleansedScript}`;
        }
        console.log("cleansed script", cleansedScript);
        delay(5000);
        eval?.(cleansedScript);
        console.log("URL without", superSpecialTemporaryURL, "with", _superSpecialTemporaryURL);
        const newDocument = parser.parseFromString(superSpecialTemporaryURL || _superSpecialTemporaryURL, "text/html");
        let links = Array.from(
            newDocument.getElementsByTagName('a')
        );
        console.log("direct links", links);
        links = links.filter(
            (a) => a.target === "_blank" && !a.href.includes("search.php") && !a.href.includes("misc.php") && !a.href.includes("filecrypt.cc")
        );
        console.log("filtered links", links);
        links.forEach(a => {console.log("what a is", a)});
        links = links.map(
            (a) => a.href
        );
        console.log("returning", links);
        delay(5000);
        return links;
    }
    const menu_command_id_1 = GM_registerMenuCommand("Copy to Shabon Links to Clipboard", (event) => {
        const threads = Array.from(
            document.getElementsByClassName("s xst")
        )
        .filter(
            (a, i) => i > 5 && (a.attributes["thumb_t"] || a.attributes["mid"]) && a.attributes["onclick"]
        )
        .map(
            (a) => a.href
        );

        const links = threads.map((url) => navigateToPageB(url));
        links.join("\n");
        console.log("outside", links);
        GM_setClipboard(
            links,
            "text",
            () => {
                GM_notification(
                    {
                        text: "Clipboard updated with new links!",
                        title: "Shabon: Grabbed Links!",
                        tag: "Shabon",
                        silent: true,
                        timeout: 500
                    }
                )
            }
        );
    }, {
        // accessKey: "a",
        autoClose: true
    });
})();