// ==UserScript==
// @name         Divide Prices on Load with Alert
// @namespace    http://your.namespace/here
// @version      2024-11-19
// @description  Divides price by capacity, logs the result, and alerts the best value item on page load
// @author       Your Name
// @match        https://east-digital.myshopify.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function dividePrices() {
        // Get all items with the sale price and card link classes
        const items = Array.from(document.querySelectorAll('.price-item--sale'));

        const ratios = items.map(item => {
            // Extract the price text and convert it to a number
            const priceText = item.textContent.replace(/[^0-9.]+/g,"");
            const price = parseFloat(priceText);

            // Find the corresponding card link text element
            const cardLink = item.closest('.card__information');
            if (cardLink) {
                let cardLinkNumber;
                const cardLinkText = cardLink.textContent.match(/[0-9.]+\s?(GB|TB)/g)[0];
                if (cardLinkText.includes("GB")) {
                    cardLinkNumber = parseFloat(cardLinkText) / 1000;
                } else {
                    cardLinkNumber = parseFloat(cardLinkText);
                }

                // Check if both values are numbers
                if (!isNaN(price) && !isNaN(cardLinkNumber)) {
                    // Perform the division
                    const result = price / cardLinkNumber;

                    // Log the result to the console or do something with it
                    return {price, capacity: cardLinkNumber, ratio: result};
                }
            }
        }).filter(item => item !== undefined); // Filter out undefined values

        console.log("Ratios: ", ratios);
        if (ratios.length > 0) {
            const bestValue = ratios.reduce((lowest, curr) => curr.ratio < lowest.ratio ? curr : lowest);
            console.log("Best Value: ", bestValue);
            alert(`Best Value Item Found!\nPrice: ${bestValue.price}\nCapacity: ${bestValue.capacity} TB\n$/TB: ${bestValue.ratio}`);
        } else {
            console.log("No valid ratios found.");
        }
    }

    // Run the function after the page loads
    window.addEventListener('load', dividePrices);
})();
