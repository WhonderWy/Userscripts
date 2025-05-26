// ==UserScript==
// @name         HDD Filter and Sort with Highlight and Scroll
// @namespace    Whonderful
// @version      2024-11-24
// @description  Filter and sort HDDs by value, price, or capacity, and highlight the best match, with capacity filtering
// @author       WhonderWy
// @match        https://diskprices.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and insert dropdown menu
    function createDropdown() {
        const dropdown = document.createElement('select');
        dropdown.id = 'hdd-sort-dropdown';
        dropdown.style.margin = '10px';

        const options = [
            { value: 'value', text: 'Best Value ( $/TB )' },
            { value: 'price', text: 'Lowest Price' },
            { value: 'capacity', text: 'Highest Capacity' },
        ];

        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.text = option.text;
            dropdown.appendChild(opt);
        });

        // Add event listener for sorting when selection changes
        dropdown.addEventListener('change', () => {
            sortHDDs(dropdown.value);
        });

        // Insert dropdown into the DOM
        document.body.insertBefore(dropdown, document.body.firstChild);

        // Create and insert results container
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'hdd-results';
        resultsContainer.style.margin = '10px';
        document.body.insertBefore(resultsContainer, dropdown.nextSibling);
    }

    // Function to get capacity range from URL or input elements
    function getCapacityRange() {
        const urlParams = new URLSearchParams(window.location.search);
        const capacityMin = parseFloat(urlParams.get('capacity_min')) || parseFloat(document.getElementById('capacity_min')?.value) || 0;
        const capacityMax = parseFloat(urlParams.get('capacity_max')) || parseFloat(document.getElementById('capacity_max')?.value) || Infinity;
        return { capacityMin, capacityMax };
    }

    // Function to sort and display HDDs based on selected criteria
    function sortHDDs(criteria) {
        const { capacityMin, capacityMax } = getCapacityRange();

        const hdds = Array.from(
            document.getElementsByClassName('disk')
        ).filter(
            e => e.attributes['data-product-type'].value.includes('hdd') &&
                e.attributes['data-condition'].value != 'used' &&
                Number(e.attributes['data-capacity'].value) / 1000 >= capacityMin &&
                Number(e.attributes['data-capacity'].value) / 1000 <= capacityMax
        ).map(
            e => {
                const capacity = Number(e.attributes['data-capacity'].value) / 1000;
                const price = parseFloat(e.children[2].innerText.replace(/[^\d.]/g, ''));
                const value = price / capacity;

                return {
                    capacity,
                    value,
                    price,
                    element: e
                };
            }
        );

        hdds.sort((a, b) => {
            switch (criteria) {
                case 'value':
                    return a.value - b.value;
                case 'price':
                    return a.price - b.price;
                case 'capacity':
                    return b.capacity - a.capacity;
            }
        });

        displayResults(hdds, criteria);
    }

    // Function to display results on the page
    function displayResults(hdds, criteria) {
        const resultsContainer = document.getElementById('hdd-results');
        resultsContainer.innerHTML = ''; // Clear previous results

        const heading = document.createElement('h2');
        heading.textContent = `Sorted HDDs by ${criteria.charAt(0).toUpperCase() + criteria.slice(1)}`;
        resultsContainer.appendChild(heading);

        const bestHDD = hdds[0];

        const hddInfo = document.createElement('div');
        hddInfo.textContent = `Capacity: ${bestHDD.capacity} TB, Price: $${bestHDD.price}, $/TB: $${bestHDD.value.toFixed(2)}`;
        resultsContainer.appendChild(hddInfo);

        // Unset previously highlighted rows
        document.querySelectorAll('.disk').forEach(e => {
            e.style.backgroundColor = '';
        });

        // Highlight and scroll to the best HDD
        bestHDD.element.style.backgroundColor = 'yellow';
        bestHDD.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Create dropdown and initial display
    createDropdown();
})();
