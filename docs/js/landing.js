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

    // ------------------------------------------------------
    // ----------------- MOVING NAV BAR UP ------------------
    // ------------------------------------------------------
    /*  Move navigation tab items up vertically by moving it to where the search used to be
     *  Align the Nav items to the bottom of the cell in the grid
     *  Also Right justify the tabs
     */ 
    var tabsList = document.querySelector('.md-tabs');
    var searchDiv = document.querySelector('.md-search[data-md-component="search"]');

    if (tabsList && searchDiv) {
        searchDiv.appendChild(tabsList); // Append the tabsList inside the searchDiv
        console.log("Tabs have been moved inside the search div.");
    } else {
        console.log("Elements not found:", {searchDiv: searchDiv, tabsList: tabsList});
    }
    var tabItems = document.querySelectorAll('.md-tabs__item');

    if (tabItems.length > 0) {
        tabItems.forEach(function(item) {
            // Set the display to flex and direction to column
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.height = '100%'; // Ensure the item fills its parent's height
            var link = item.querySelector('.md-tabs__link');
            if (link) {
                // Align the link to the bottom
                link.style.marginTop = 'auto'; // This pushes the link to the bottom
            }
        });
    } else {
        console.log('No .md-tabs__item elements found.');
    }

    var searchDiv = document.querySelector('.md-search');
    if (searchDiv) { // Ensure the search div aligns its contents to the bottom
        searchDiv.style.alignSelf = 'flex-end';  // Aligns this item to the end of the cross axis
    } else {
        console.log('The .md-search element was not found.');
    }


    // --------------------------------------------------------------------------
    // ----------------- ADDING CUSTOM BUTTONS TO HOME PAGE HEADER --------------
    // --------------------------------------------------------------------------
    /*  Adding github and project request form buttons
     *  Uses the div/grid cell formerly occupied by the search bar
     */ 
    var tabsList = document.querySelector('.md-tabs__list');
    if (tabsList) {
        // Create a container for the buttons
        var buttonContainer = document.createElement('ul');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'row'; // Align buttons horizontally
        buttonContainer.style.justifyContent = 'flex-end'; // Right-justify the buttons
        buttonContainer.style.padding = '0'; // Removes padding for the list
        buttonContainer.style.listStyleType = 'none'; // Removes bullet points
        buttonContainer.style.width = '100%'; // Ensure the container takes full width to allow right justification
        buttonContainer.style.margin = '0';

        // Create GSB DARC Github button as list item
        var githubButtonLi = document.createElement('li');
        var githubButton = document.createElement('button');
        githubButton.textContent = 'GSB DARC Github';
        githubButtonLi.appendChild(githubButton);
        githubButton.id = 'github-button'
        githubButton.addEventListener('click', function() {
            window.open('https://github.com/gsbdarc', '_blank'); // Set the URL here
        });

        // Create Request Services button as list item
        var servicesButtonLi = document.createElement('li');
        var servicesButton = document.createElement('button');
        servicesButton.textContent = 'Request Services';
        servicesButtonLi.style.marginLeft = '10px'; // Space between the buttons
        servicesButtonLi.appendChild(servicesButton);
        servicesButton.id = 'request-services-button'
        servicesButton.addEventListener('click', function() {
            window.open('https://darcrequest.stanford.edu/', '_blank'); // Set the URL here
        });
        // Append buttons to the list container
        buttonContainer.appendChild(githubButtonLi);
        buttonContainer.appendChild(servicesButtonLi);

        // Insert the button list in the DOM just before the tabs list
        tabsList.parentNode.insertBefore(buttonContainer, tabsList);

        // Create a spacer div to push the button list upwards
        var spacerDiv = document.createElement('div');
        spacerDiv.style.flexGrow = '1'; // This will make the spacer expand to fill the space
        spacerDiv.style.height = '30px'; // Minimal height to avoid taking space itself

        // Insert the spacer div just before the tabs list, after the button list
        tabsList.parentNode.insertBefore(spacerDiv, tabsList);
    } else {
        console.log('The .md-tabs__list element was not found.');
    }

});