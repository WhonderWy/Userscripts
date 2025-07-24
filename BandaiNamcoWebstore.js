// ==UserScript==
// @name         Dokkan Bandai Namco Webstore Stone Cost Breakdown (Auto-Currency)
// @namespace    http://chatgpt.com/
// @version      0.5
// @description  Ranks stone deals by best value and shows per-currency breakdown. 
// @match        https://*.bandainamcoentwebstore.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Helper: Format numbers
    const format = (n, digits = 4) => parseFloat(n).toFixed(digits);

    function parseCard(card) {
        const title = card.querySelector('.item-title')?.innerText ?? '';
        const priceEl = card.querySelector('.item-price');
        if (!priceEl) return null;

        const priceText = priceEl.innerText.replace(/,/g, '').trim();
        const currencyMatch = priceText.match(/^([A-Z]{3})\s*(\d+(\.\d+)?)/i);
        const stoneMatch = title.match(/Dragon Stone\s*x?(\d+)/i);

        if (!currencyMatch || !stoneMatch) return null;

        const currency = currencyMatch[1];
        const amount = parseFloat(currencyMatch[2]);
        const stones = parseInt(stoneMatch[1], 10);
        const costPerStone = amount / stones;
        const stonesPerCurrency = stones / amount;

        return {
            card,
            currency,
            amount,
            stones,
            costPerStone,
            stonesPerCurrency
        };
    }

    // Create the table element
    function createCostTable(info) {
        const table = document.createElement('table');
        table.style = `
            margin-top: 6px;
            font-size: 12px;
            border-collapse: collapse;
            color: #333;
        `;
        table.innerHTML = `
            <tr><td><strong>${info.currency}/Stone:</strong></td><td>${format(info.costPerStone)}</td></tr>
            <tr><td><strong>Stone/${info.currency}:</strong></td><td>${format(info.stonesPerCurrency)}</td></tr>
        `;
        return table;
    }

    function createRankBadge(rank) {
        const badge = document.createElement('div');
        badge.textContent = `#${rank}`;
        badge.style = `
            position: absolute;
            top: 4px;
            left: 4px;
            background: gold;
            color: black;
            font-weight: bold;
            padding: 2px 6px;
            font-size: 13px;
            border-radius: 6px;
            z-index: 10;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        `;
        return badge;
    }

    function processCards() {
        const cards = Array.from(document.querySelectorAll('.pickup-wrap li, .item-wrap li'));
        const parsed = cards.map(parseCard).filter(Boolean);

        if (parsed.length === 0) return;

        // Sort by best value (lowest cost per stone)
        parsed.sort((a, b) => a.costPerStone - b.costPerStone);

        // Add breakdown + ranking to each
        parsed.forEach((info, index) => {
            const priceArea = info.card.querySelector('.price-area');
            if (priceArea) priceArea.appendChild(createCostTable(info));

            // Mark rank
            const badge = createRankBadge(index + 1);
            info.card.style.position = 'relative';
            info.card.appendChild(badge);
        });
    }

    // Run once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processCards);
    } else {
        processCards();
    }
})();
