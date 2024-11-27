document.addEventListener("DOMContentLoaded", function () { // Wait for content to load

    var sidebar = document.querySelector('.md-sidebar__inner');

    function checkWidth() {
        // Check if window width is less than 1220px
        if (window.innerWidth < 1220) {
            sidebar.classList.remove('hidden');
        } else {
            sidebar.classList.add('hidden');
        }
    }
    checkWidth();     // Call checkWidth initially in case the page loads under 1220px
    window.addEventListener('resize', checkWidth);     // Add event listener for resizing the window


    // ------------------------------------------------------
    // ------------------- MOVING THE SEARCH ----------------
    // ------------------------------------------------------
    /* Find Search bar on page an move it to the main content div
     * Put search bar and results into a parent div and stack them
     * Make sure the results list is in a scroll wrapper
     */
    var searchForm = document.querySelector('.md-search__form');
    var searchResult = document.querySelector('.md-search-result');
    var mainContainer = document.querySelector('.md-main');

    if (searchForm && searchResult && mainContainer) {
        console.log("Search form and result found, and main container is available.");

        // Create a new div to serve as the parent for both the search form and the search results
        var parentDiv = document.createElement('div');
        parentDiv.style.position = 'relative'; // Position relative so children can be positioned absolutely within
        parentDiv.style.width = '100%'; // Take full width of its container

        // Create a scroll wrapper for the search results
        var scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'md-search__scrollwrap';
        scrollWrapper.style.overflowY = 'auto'; // Enable vertical scrolling
        scrollWrapper.style.maxHeight = '400px';

        // Move the search form and search results into the new div
        parentDiv.appendChild(searchForm);
        scrollWrapper.appendChild(searchResult); // Wrap the search results in the scrollable div
        parentDiv.appendChild(scrollWrapper); // Add the scroll wrapper to the parent div
        scrollWrapper.style.width = '100%';

        // Adjust the style of the search form to stack it
        searchForm.style.position = 'relative'; // Position relative ensures it's part of normal document flow
        searchForm.style.width = '100%';
        searchForm.style.zIndex = '1'; // Ensure form is above results if they overlap
        scrollWrapper.id = 'results-scroll-wrapper'

        // Adjust the search result's style within the scroll wrapper
        searchResult.style.width = '100%';

        // Add the new div to the md-main container
        mainContainer.insertBefore(parentDiv, mainContainer.firstChild);
    } else {
        console.log("Required elements not found.");
    }


    // ------------------------------------------------------
    // ----------------- IMPROVING SEARCH UI ----------------
    // ------------------------------------------------------
    /*  Move navigation sidebar to main content div
     * Remove overlay that appears when starting a search
     * Move the header element above the search bar
     * Give the header an ID so that CSS can be specifically applied
     * Add padding to the left and right of search bar
     */

    var mainContainer = document.querySelector('.md-main');
    function updatePadding() {
        // Check if the window width is 1200px or wider
        if (window.innerWidth >= 1200) {
            mainContainer.style.paddingLeft = '15%';
            mainContainer.style.paddingRight = '15%';
            mainContainer.style.paddingTop = '2%';

        } else {
            mainContainer.style.paddingLeft = '0';
            mainContainer.style.paddingRight = '0';
            mainContainer.style.paddingTop = '0'; 
        }
    }
    updatePadding();  // Apply the appropriate padding based on the current window width
    window.addEventListener('resize', updatePadding); // Add event listener for resizing the window

    // remove transparent/black overlay
    var searchOverlay = document.querySelector('.md-search__overlay');
    if (searchOverlay) {
        searchOverlay.remove();
        console.log("Search overlay has been disabled.");
    }

    var header = document.querySelector('h1');
    var searchForm = document.querySelector('.md-search__form');

    if (header && searchForm) {
        console.log("H1 header and search form found.");
        if (searchForm.parentNode) { // Check if the searchForm has a parent node and move the h1 header
            header.id = 'titleHeader'; // Assign an ID to the h1 header
            header.textContent = "Power Your Research with GSB’s Advanced Research Computing Solutions"

            // Use the parent node of searchForm to insert the h1 before the searchForm
            searchForm.parentNode.insertBefore(header, searchForm);
            console.log("H1 header has been moved above the search form and assigned an ID.");
        } else {
            console.log("searchForm has no parent node accessible.");
        }
    } else {
        console.log("Required elements not found. Please check the selectors.");
    }
       // Apply the appropriate padding based on the current window width
    updatePadding();

    // Add event listener for resizing the window
    window.addEventListener('resize', updatePadding);


    // // -------------------------------------------------------
    // // -------------- FIXING SEARCH ON MOBILE ----------------
    // // -------------------------------------------------------
    /* When search input is clicked, resize scroll wrapper to better size for mobile view
     * Remove animated overlays that appear in mobile view and restrict clicking
     */
    var mdSearchInput = document.querySelector('input.md-search__input');

    if (mdSearchInput) {
        mdSearchInput.addEventListener('focus', function () {
            // Use a slight delay to allow the scroll wrapper to become visible if it's triggered by focus
            setTimeout(function () {
                var scrollWrapper = document.querySelector('.md-search__scrollwrap');
                if (scrollWrapper) {
                    console.log(`Scroll Wrapper Dimensions: ${scrollWrapper.offsetWidth}px wide by ${scrollWrapper.offsetHeight}px tall`);
                } else {
                    console.log("Scroll wrapper not found after search input focus.");
                }
            }, 100); // Adjust timeout as necessary based on when the scroll wrapper appears

            var mdSearchInput = document.querySelector('input.md-search__input');
            var scrollWrapper = document.querySelector('.md-search__scrollwrap');

            if (mdSearchInput && scrollWrapper) {
                // Check if the search input has a next sibling element and if it's not the scroll wrapper
                if (mdSearchInput.nextElementSibling !== scrollWrapper) {
                    // Insert the scroll wrapper after the search input
                    mdSearchInput.parentNode.insertBefore(scrollWrapper, mdSearchInput.nextSibling);
                    console.log("Scroll wrapper moved below the search input.");
                }
            } else {
                console.log('Search input or scroll wrapper not found');
            }

            var defaultSearchOutputDiv = document.querySelector('.md-search__output');
            var defaultSearchInnerDiv = document.querySelector('.md-search__inner');

            // Check if elements exist and remove them
            if (defaultSearchOutputDiv) {
                defaultSearchOutputDiv.remove();
            }
            if (defaultSearchInnerDiv) {
                defaultSearchInnerDiv.remove();
            }

        });
    } else {
        console.log('Search input not found');
    }

});