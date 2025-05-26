// ==UserScript==
// @name         Copy links from Shabon
// @namespace    Whonderful
// @version      2025-02-20
// @description  Grab all links and copy it to clipboard
// @author       WhonderWy
// @match        https://shobon.so/*thread*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shobon.so
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL  https://github.com/WhonderWy/Userscripts/raw/refs/heads/main/Copy%20links%20from%20Shabon.user.js
// @updateURL    https://github.com/WhonderWy/Userscripts/raw/refs/heads/main/Copy%20links%20from%20Shabon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const exclusions = [
        "filecrypt.cc",
    ];
    const menu_command_id_1 = GM_registerMenuCommand("Copy to Shabon Links to Clipboard", (event) => {
        const linkElements = document.querySelectorAll("table a");
        const links = Array.from(linkElements).filter(a => !exclusions.some(exclusion => a.href.includes(exclusion))).map(a => a.href).join("\n");
        console.log(links.length > 0 ? links : "Found none");
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
        accessKey: "S",
        autoClose: true
    });
})();