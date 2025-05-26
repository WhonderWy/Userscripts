// ==UserScript==
// @name         qBittorrent WebUI Enhancement
// @namespace    Whonderful
// @version      2025-05-26
// @description  Adds "Copy Save Path" to the context menu for each torrent row
// @author       WhonderWy
// @match        http*://192.168.68.65:8080/*
// @match        http*://qb*.downloader.local/*
// @match        http*://downloader.local/qb*
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL  https://github.com/WhonderWy/scripts_backup/raw/refs/heads/main/userscripts/qBittorrent%20WebUI%20Customisation.user.js
// @updateURL    https://github.com/WhonderWy/scripts_backup/raw/refs/heads/main/userscripts/qBittorrent%20WebUI%20Customisation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function detectOS() {
        const userAgent = navigator.userAgent || navigator.platform;

        if (/Win/i.test(userAgent)) return "Windows";
        if (/Mac/i.test(userAgent)) return "macOS";
        if (/Linux/i.test(userAgent)) return "Linux";
        if (/Android/i.test(userAgent)) return "Android";
        if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
        return "Unknown OS";
    }

    function transformPath(path, format) {
        switch (format) {
            case "Auto":
                return transformPath(path, detectOS());
            case 'TrueNAS':
                return `/mnt/tank${path}`;
            case 'Windows':
                return `\\\\TRUENAS${path.replace(/\//g, '\\')}`;
            default:
                return path;
        }
    }

    function copyPath(format) {
        const element = document.querySelector('#save_path');
        if (element) {
            const savePath = element.innerText.trim();
            const newPath = transformPath(savePath, format);
            GM_setClipboard(newPath);
            alert(`Copied path: ${newPath}`);
        }
    }

    function addCopyOptions(copyMenu) {
        const options = [
            { id: 'copyPathAuto', label: 'Copy path string (OS-dependent)', format: 'Auto' },
            { id: 'copyPathRaw', label: 'Copy path string as is', format: 'Default' },
            { id: 'copyPathTrueNAS', label: 'Copy TrueNAS version of path', format: 'TrueNAS' },
            { id: 'copyPathWindows', label: 'Copy Windows version of path', format: 'Windows' }
        ];

        options.forEach(option => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.id = option.id;
            link.classList.add('copyToClipboard');
            link.innerHTML = `<img src="images/edit-copy.svg" alt="${option.label}"> ${option.label}`;
            link.onclick = () => {copyPath(option.format);};
            item.appendChild(link);
            copyMenu.appendChild(item);
        });
    }

    function enhanceContextMenu() {
        const copyMenuItem = document.querySelector('.contextMenu #copyComment')?.parentElement?.parentElement;
        if (copyMenuItem) {
            addCopyOptions(copyMenuItem);
        }
    }

    function makeSavePathClickable() {
        const savePathElement = document.getElementById('save_path');
        if (savePathElement) {
            savePathElement.style.cursor = 'pointer';
            savePathElement.onclick = () => {copyPath('Default');};
        }
    }

    window.addEventListener("load", function() {
        const img = document.getElementById("connectionStatus");

        if (!img) {
            console.warn("Image element not found!");
            return;
        }

        function runLogic() {
            enhanceContextMenu();
            makeSavePathClickable();
        }

        if (img.complete) {
            runLogic();
        } else {
            img.addEventListener("load", runLogic);
        }
    });
})();

