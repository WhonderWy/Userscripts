// ==UserScript==
// @name         Kadokomi: Grab Links
// @namespace    Whonderful
// @version      2024-03-22
// @description  Grab all links and copy it to clipboard
// @author       WhonderWy
// @match        https://comic-walker.com/my-comic/follow/contents
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comic-walker.com
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';
    const menu_command_id_1 = GM_registerMenuCommand("Copy to Kadokomi Links to Clipboard", (event) => {
        const links = Array.from(
            document.getElementsByTagName("a")
        )
        .filter(
            (a) => a.className.includes("WorkTableItem") && (a.href.includes("detail") || a.href.includes("episodeType"))
        )
        .map(
            (a) => a.href
        )
        .join("\n");
        GM_setClipboard(
            links,
            "text",
            () => {
                GM_notification(
                    {
                        text: "Clipboard updated with new links!",
                        title: "WebManga: Grabbed Links!",
                        tag: "WebManga",
                        silent: true,
                        timeout: 500
                    }
                )
            }
        );
    }, {
        accessKey: "K",
        autoClose: true
    });
    //await GM.setClipboard(links, "text", () => console.log("Clipboard updated with new links!"));
    // Your code here...
})();