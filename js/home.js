document.addEventListener("DOMContentLoaded", function () { // Wait for content to load

    // --------------------------------------------------------------
    // ---------------- LOAD THE CountUp JS LIBRARY  ----------------
    // --------------------------------------------------------------
    (function loadCountUp() {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/countup.js/1.9.3/countUp.min.js"; // Use non-module version
        script.onload = () => {
            console.log("CountUp.js Loaded!");
        };
        document.head.appendChild(script);
    })();

    // ------------------------------------------------------
    // ------------------- HIDE THE SIDE BAR  ----------------
    // -------------------------------------------------------
    /* Find Search bar on page an move it to the main content div
     * Put search bar and results into a parent div and stack them
     * Make sure the results list is in a scroll wrapper
     */
    var sidebar = document.querySelector('.md-sidebar__inner');
    function checkWidth() {
        // Check if window width is less than 1220px
        if (window.innerWidth < 1220) {
            sidebar.classList.remove('hidden');
        } else {
            sidebar.classList.add('hidden');
        }
    }
    checkWidth(); // Call checkWidth initially in case the page loads under 1220px
    window.addEventListener('resize', checkWidth); // Add event listener for resizing the window


    // ------------------------------------------------------
    // ------------------- MOVING THE SEARCH ----------------
    // ------------------------------------------------------
    /* Find Search bar on page an move it to the main content div
     * Put search bar and results into a parent div and stack them
     * Make sure the results list is in a scroll wrapper
     */
    var searchForm = document.querySelector('.md-search__form');
    var searchResult = document.querySelector('.md-search-result');
    var mdMain = document.querySelector('.md-main');

    if (searchForm && searchResult && mdMain) {
        console.log("Search form and result found, and main container is available.");

        // Create a new div to serve as the parent for both the search form and the search results
        var parentDiv = document.createElement('div');
        parentDiv.id = "searchBarParentDiv"
        parentDiv.style.position = 'relative'; // Position relative so children can be positioned absolutely within

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
        scrollWrapper.id = 'search-results-scroll-wrapper'

        // Adjust the search result's style within the scroll wrapper
        searchResult.style.width = '100%';

        // Add the new div to the md-main container
        mdMain.insertBefore(parentDiv, mdMain.firstChild);
    } else {
        console.log("Required elements not found.");
    }

    // ------------------------------------------------------------------
    // ------------------ OPTIMIZING SEARCH BAR BEHAVIOR ----------------
    // ------------------------------------------------------------------
    /* Fixing the behavior of the Search bar now that its moved
     */

    // Make the search end when user clicks out of search
    document.addEventListener("click", function (event) {
        var searchBarParent = document.querySelector("#searchBarParentDiv");
        var body = document.body; // Get body element
    
        if (searchBarParent && !searchBarParent.contains(event.target)) {
            console.log("Clicked outside search bar, closing search results.");
            var searchResult = document.querySelector(".md-search-result");
    
            if (searchResult) {
                searchResult.style.display = "none"; // Hide search results
            }
    
            // ✅ Remove scroll lock when search closes
            body.removeAttribute("data-md-scrolllock");
            body.style.overflow = ""; // Restore scrolling
            body.style.position = "";
        }
    });
    
    // Show search results when the input is focused or typed into
    var searchInput = document.querySelector(".md-search__form input");
    if (searchInput) {
        searchInput.addEventListener("focus", function () {
            var searchResult = document.querySelector(".md-search-result");
            if (searchResult) {
                searchResult.style.display = "block"; // Show search results
            }
        });
    
        // Also show results when the user starts typing
        searchInput.addEventListener("input", function () {
            var searchResult = document.querySelector(".md-search-result");
            if (searchResult) {
                searchResult.style.display = "block"; // Show search results
            }
        });
    }

    // ------------------------------------------------------
    // ----------------- IMPROVING SEARCH UI ----------------
    // ------------------------------------------------------
    /* Move navigation sidebar to main content div
     * Remove overlay that appears when starting a search
     * Move the header element above the search bar
     * Give the header an ID so that CSS can be specifically applied
     * Add padding to the left and right of search bar
     */

    var mdMain = document.querySelector('.md-main');

    function updatePadding() {
        // Check if the window width is 1200px or wider
        if (window.innerWidth >= 1200) {
            mdMain.style.paddingLeft = '15%';
            mdMain.style.paddingRight = '15%';
            // mdMain.style.paddingTop = '2%';
        } else {
            mdMain.style.paddingLeft = '0';
            mdMain.style.paddingRight = '0';
            mdMain.style.paddingTop = '0';
        }
    }
    updatePadding(); // Apply the appropriate padding based on the current window width
    window.addEventListener('resize', updatePadding); // Add event listener for resizing the window

    // remove transparent/black overlay
    var searchOverlay = document.querySelector('.md-search__overlay');
    if (searchOverlay) {
        searchOverlay.remove();
        console.log("Search overlay has been disabled.");
    }

    // Apply the appropriate padding based on the current window width
    updatePadding();
    // Add event listener for resizing the window
    window.addEventListener('resize', updatePadding);


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
        console.log("Elements not found:", {
            searchDiv: searchDiv,
            tabsList: tabsList
        });
    }
    var tabItems = document.querySelectorAll('.md-tabs__item');

    if (tabItems.length > 0) {
        tabItems.forEach(function (item) {
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
        searchDiv.style.alignSelf = 'flex-end'; // Aligns this item to the end of the cross axis
    } else {
        console.log('The .md-search element was not found.');
    }


    // --------------------------------------------------------------------------
    // ----------------- ADDING CUSTOM BUTTONS TO HOME PAGE HEADER --------------
    // --------------------------------------------------------------------------
    /*  Adding Github and Project Request form buttons
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
        githubButton.id = 'github-button';
        var span = document.createElement('span');
        span.className = 'button-text';
        span.textContent = 'GSB DARC GitHub';
        githubButton.appendChild(span);
        githubButton.addEventListener('click', function () {
            window.open('https://github.com/gsbdarc', '_blank');
        });
        githubButtonLi.appendChild(githubButton);

        // Create Request Services button as list item
        var servicesButtonLi = document.createElement('li');
        servicesButtonLi.style.marginLeft = '10px';
        var servicesButton = document.createElement('button');
        servicesButton.id = 'request-services-button';
        var span = document.createElement('span');
        span.className = 'button-text';
        span.textContent = 'Request Services';
        servicesButton.appendChild(span);
        servicesButton.addEventListener('click', function () {
            window.open('https://darcrequest.stanford.edu/', '_blank');
        });
        servicesButtonLi.appendChild(servicesButton);

        // Create Research Hub button as list item
        var rhButtonLi = document.createElement('li');
        var rhButton = document.createElement('button');
        rhButton.id = 'researchhub-button';
        var span = document.createElement('span');
        span.className = 'button-text';
        span.textContent = 'Research Hub';
        rhButton.appendChild(span);
        rhButton.addEventListener('click', function () {
            window.open('https://gsbresearchhub.stanford.edu/', '_blank');
        });
        rhButtonLi.appendChild(rhButton);


        // Append buttons to the list container
        buttonContainer.appendChild(githubButtonLi);
        buttonContainer.appendChild(servicesButtonLi);
        buttonContainer.appendChild(rhButtonLi);


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


    // -------------------------------------------------------
    // ------ ADDING/UPDATING DESIGN ELEMENTS ----------------
    // -------------------------------------------------------
    /*  Creating 2 new divs for the team color bar, link cards, etc.
     *  Setting the Page title text
     *  Make the Search Bar a child element of the Team Color Bar
     *  Removing unused elements
     */

    // Creating 2 new divs for the team color bar, link cards, etc.
    const mdContainer = document.querySelector('.md-container');
    const colorBarDiv = document.createElement('div');
    const contentDiv = document.createElement('div');

    if (mdMain && colorBarDiv) {
        colorBarDiv.id = 'colorBarDiv';
        colorBarDiv.style.height = '40px'; 
        colorBarDiv.style.width = '100%';
        colorBarDiv.style.backgroundColor = '#7E2F49'; 

        contentDiv.id = 'contentDiv';
        contentDiv.style.backgroundColor = 'white'; 
    
        // Insert the 2 new divs into the main container
        if (mdContainer && mdMain) {
            mdContainer.insertBefore(colorBarDiv, mdMain.nextSibling);
            mdContainer.insertBefore(contentDiv, colorBarDiv.nextSibling);
        } else {
            console.error('mdContainer or .md-main not found in the DOM.');
        }
    }

    // Set the Page title text
    var titleText = document.querySelector('h1');
    titleText.id = 'titleText'; 
    if (titleText && mdMain) {
        console.log("H1 header found.");
        titleText.textContent = "Power Your Research with GSB’s Research Computing Solutions"
    }

    // Make the Search Bar a child element of the Team Color Bar
    const searchBarParentDiv = document.getElementById("searchBarParentDiv");
    if (searchBarParentDiv && colorBarDiv) {
        colorBarDiv.appendChild(searchBarParentDiv);
    }

    // Remove the 'Results Metadata Div' that says 'Type to Start searching'
    const elements = document.querySelectorAll('.md-search-result__meta');
    elements.forEach(element => {
        element.remove();
    });

    // Change the placeholder text in Search
    // const searchInput = document.querySelector('.md-search__input');
    if (searchInput) {
        searchInput.setAttribute('placeholder', 'Search the docs...');
    }

    // Add buttons below the search form
    if (searchBarParentDiv) {
        // Create a wrapper div for the text and buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("popular-container"); // Add a class for styling
    
        // Create a text span for "Popular:"
        const popularText = document.createElement("span");
        popularText.textContent = "Popular:";
        popularText.classList.add("popular-text"); // Add a class for styling
        buttonContainer.appendChild(popularText); // Append "Popular:" text
    
        // Buttons
        const buttonLabels = ["Jupyter", "Jobs", "Collaborators", "Slurm", "GPUs"];
    
        // Loop through labels and create buttons
        buttonLabels.forEach(label => {
            const button = document.createElement("button");
            button.textContent = label; // Set button text
            button.classList.add("search-fill-button"); // Add a class for styling
            buttonContainer.appendChild(button); // Append button to container
        });
    
        // Append the container to the parent div
        searchBarParentDiv.appendChild(buttonContainer);
    }

    // Make the buttons work
    const buttons = document.querySelectorAll('.search-fill-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = button.textContent; 
                searchInput.focus(); 
            }
        });
    });

    // Remove the back-to-top button
    const backToTopButton = document.querySelector('button.md-top');
    if (backToTopButton) {
        backToTopButton.remove(); 
    }

    // -------------------------------------------------------
    // --------- ADDING LINK CARDS & CLUSTER STATS -----------
    // -------------------------------------------------------

    contentDiv.textContent = "CURRENT CLUSTER CONFIGURATION"

    // Creating Stats Grid
    // Create the container for the grid
    const statContainer = document.createElement('div');
    statContainer.id = 'stat-container';
    contentDiv.appendChild(statContainer);

    // Read from json file
    // Function to load JSON data from a file
    function loadJSON(url) {
        return fetch(url).then(response => response.json());
    }
    
    // First, attempt to load vars.json
    loadJSON('/assets/vars.json')
    .then(data => {
        // Check if any value contains "PLACEHOLDER"
        const hasPlaceholder = data.some(item =>
            Object.values(item).some(value => typeof value === "string" && value.includes("PLACEHOLDER"))
        );

        // If placeholder is detected, load default_vars.json instead
        if (hasPlaceholder) {
            console.log("PLACEHOLDER detected in vars.json. Falling back to default_vars.json");
            return loadJSON('/assets/default_vars.json');
        }
        return data; // Otherwise, use vars.json data
    })
    .then(data => {
        data.forEach((item, index) => {
            const cell = document.createElement('div');
            cell.classList.add('metric-grid-item');
        
            // Create a container for number and unit
            const numberUnitContainer = document.createElement('div');
            numberUnitContainer.classList.add('grid-number-unit');
        
            // Create a div for the number with a unique ID
            const numberElement = document.createElement('div');
            numberElement.classList.add('grid-number');
            numberElement.id = `countup-${index}`; // Unique ID for each counter
        
            // Create a div for the unit
            const unitElement = document.createElement('div');
            unitElement.classList.add('grid-unit');
            unitElement.textContent = item.unit;
        
            // Append number and unit to the container
            numberUnitContainer.appendChild(numberElement);
            numberUnitContainer.appendChild(unitElement);
        
            // Add the subtitle
            const subtitleElement = document.createElement('div');
            subtitleElement.classList.add('grid-subtitle');
            subtitleElement.textContent = item.subtitle;
        
            // Append everything to the cell
            cell.appendChild(numberUnitContainer);
            cell.appendChild(subtitleElement);
        
            // Append the cell to the grid container
            statContainer.appendChild(cell);
        
            // Check if not mobile before using CountUp.js
            if (window.innerWidth > 768 && window.CountUp) { // 768px is a common breakpoint for mobile
                numberElement.textContent = "0"; // Start from 0 before animation
                const countUp = new CountUp(numberElement.id, 0, item.number, (item.number % 1 !== 0 ? item.number.toString().split('.')[1].length : 0), 2.5);        
                // Observer for triggering animation when visible
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            countUp.start(); // Start animation when element is in view
                            observer.unobserve(entry.target); // Stop observing after animation
                        }
                    });
                }, { threshold: 0.5 });
        
                observer.observe(numberElement);
            } else {
                // On mobile, display the number statically
                numberElement.textContent = item.number;
            }
        });
    })
    .catch(error => console.error('Failed to load or parse JSON file:', error));


    // Move the horizontal rule to the custom content div
    const hrElement = document.querySelector('hr');
    if (contentDiv && hrElement) {
        contentDiv.appendChild(hrElement);
    }

    // Resource Cards
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('grid-container');
    cardContainer.id = 'card-container';
    contentDiv.appendChild(cardContainer); // Append the container to the contentDiv
    
    // Define card details
    const cardData = [ 

        // PLEASE NOTE THAT SUBTITLE TEXT SHOULD REMAIN RELATIVELY SHORT SO THAT IT LOOKS GOOD
        { 
            title: "Technical Expertise for Research Projects", 
            subtitle: "Request technical support from dedicated staff", 
            imageSrc: "/assets/images/mason_alex_DARC.jpeg",
            link: "/_policies/darc/",
            buttonText: "Services"
        },
        { 
            title: "Modern Data Storage Solutions", 
            subtitle: "Explore available data storage options", 
            imageSrc: "/assets/images/nodes.png",
            link: "/_user_guide/storage/",
            buttonText: "Storage"
        },
        { 
            title: "Research Computing Guide", 
            subtitle: "Stay informed with our latest guide for using the Yens", 
            imageSrc: "/assets/images/word_wall.jpg",
            link: "/_getting_started/yen-servers/",
            buttonText: "Getting Started"
        },
        { 
            title: "GSB Research Hub", 
            subtitle: "", 
            imageSrc: "",
            link: "https://gsbresearchhub.stanford.edu/services",
            isExternal: true,
            buttonText: null
        }
    ];
    
    // Create 4 div elements with the class "su-card"
    cardData.forEach((data, i) => {
        const card = document.createElement('div');
        card.classList.add('su-card');
    
        // Create image
        if (data.imageSrc) {
            const image = document.createElement('img');
            image.classList.add('su-card-image');
            image.src = data.imageSrc;
            image.alt = `Card ${i + 1} image`;
            card.appendChild(image);
        }
    
        // Create title
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('card-title');
        titleDiv.textContent = data.title;
        card.appendChild(titleDiv);
        if (i == 3) { // If it's the 4th card
            titleDiv.id = "rhCardTitle"
        }
    
        // Create subtitle
        const subtitleDiv = document.createElement('div');
        subtitleDiv.classList.add('card-subtitle');
        subtitleDiv.textContent = data.subtitle;
        card.appendChild(subtitleDiv);
    
        if (data.isExternal) {
            // Create external link
            const link = document.createElement('a');
            link.classList.add('su-card-link', 'su-link--external');
            link.textContent = "Explore other services available to researchers";
            link.href = data.link;
            card.id = "rhCard"
            card.appendChild(link);
        } else {
            // Create button
            const button = document.createElement('button');
            button.classList.add('card-btn');
            button.onclick = () => { window.location.href = data.link; };
    
            // Create text span
            const buttonText = document.createElement('span');
            buttonText.textContent = data.buttonText;
    
            // Create icon span
            const buttonIcon = document.createElement('span');
            buttonIcon.classList.add('inline-icon');
            buttonIcon.style.mask = "url('/assets/svg/right-chevron.svg') no-repeat center";
            buttonIcon.style.backgroundColor = "currentColor";
    
            // Append text and icon to button
            button.appendChild(buttonText);
            button.appendChild(buttonIcon);
            card.appendChild(button);
        }
    
        cardContainer.appendChild(card);
    });

    // Section Title
    const exploreDiv = document.createElement('div');
    exploreDiv.textContent = 'Explore Resources'; 
    exploreDiv.id = 'resourceSectionTitle';
    contentDiv.insertBefore(exploreDiv, cardContainer);
    
});