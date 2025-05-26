// ==UserScript==
// @name         Kadokomi: Notify if Unread Episode
// @namespace    Whodnerful
// @version      2024-11-17
// @description  Automatically redirects to the first unread episode
// @author       WhonderWy
// @match        https://comic-walker.com/detail/*
// @grant        none
// @downloadURL  https://github.com/WhonderWy/Userscripts/raw/refs/heads/main/Kadokomi_%20Notify%20if%20Unread%20Episode.user.js
// @updateURL    https://github.com/WhonderWy/Userscripts/raw/refs/heads/main/Kadokomi_%20Notify%20if%20Unread%20Episode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to find and navigate to the first unread episode
    function redirectToFirstUnread() {
        // Select all episode links
        let result = 0;
        const eps = Array.from(document.getElementsByClassName("EpisodesTabContents_episodeList__cIDQz")[0].childNodes);
        let border = eps.find((p) => p.innerText.includes("公開終了"));
        let borderEp = eps.indexOf(border) >= 0 ? eps.indexOf(border) - 1 : -1;
        if (borderEp === -1) return;

        var episodes = document.querySelectorAll('.EpisodeThumbnail_episodeThumbnail__0lFSg');
        for (var i = borderEp; i >= 0; i--) {
            // Check if the episode does not have the class indicating it has been read
            console.log("episode lists");
            if (!episodes[i].classList.contains('EpisodeThumbnail_hasRead__J9KpL') && !episodes[i].classList.contains("EpisodeThumbnail_isReading__VGUyy") && window.location.href != episodes[i].href) {
                // Redirect to the first unread episode's href link
                console.log("Found unread");
                alert(`Found unread! Unread is ${episodes[i]}`);
                result = 1;
                break;
            }
        }
        return result;
    }

    // Define the condition to be checked
    function conditionMet() {
        const loadedProof = document.getElementsByClassName("ComicWalkerHeader_linkButton__8f00S");
        const fullyLoadedProof = document.querySelector("[data-following=true]");
        // Example condition: Check if an element with ID 'targetElement' exists
        return loadedProof.length > 0 && fullyLoadedProof?.innerText.includes("フォロー中");
    }

    // Function to run when the condition is met
    function runFunction() {
        console.log('Condition met! Running the function...');
        // Place your function logic here
        redirectToFirstUnread();
    }

    // Function to repeatedly check the condition
    function checkConditionRepeatedly() {
        if (conditionMet()) {
            runFunction();
        } else {
            // Continue checking at intervals if condition is not met
            window.setTimeout(checkConditionRepeatedly, 1000); // Check every 1 second
        }
    }

    window.addEventListener('load', checkConditionRepeatedly); // Initial check

})();
