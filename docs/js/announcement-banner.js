document.addEventListener("DOMContentLoaded", function () { 
    
    // ======================== M A I N  F U N C T I O N ========================
    function setAnnouncmentBar(type, message) { 
        `
        Args:
        - type (string): The type of announcement.
        - type options: WARNING, ALERT, INFORMATION, SUCCESS, or ERROR.
        - message (string): The announcement content. Use <a> tags for links.
        `
        
        console.log("Setting announcement banner");

        const bannerContainer = document.querySelector(".announcement-banner-container")
        const banner = document.querySelector("#announcement-banner");

        const bannerContent = document.createElement("div");
        bannerContent.style.display = "flex";
        bannerContent.style.alignItems = "flex-start";
        bannerContent.style.justifyContent = "space-between"; 
        bannerContent.style.flexWrap = "wrap";
        bannerContent.style.gap = "10px";
        bannerContent.style.paddingTop = "0.7rem";
        bannerContent.style.paddingBottom = "0.7rem";
        bannerContent.style.lineHeight = "1rem";
        bannerContent.style.fontSize = "0.7rem";

        const closeButton = document.createElement("button");
        closeButton.id = "dismissButton";
        closeButton.addEventListener("click", removeBanner);
        closeButton.style.cursor = "pointer";

        const alertIcon = document.createElement("img");
        const closeIcon = document.createElement("img");

        banner.style.padding = "10px";
        alertIcon.alt = "Alert Icon";
        alertIcon.style.width = "20px";
        alertIcon.style.height = "20px";
        alertIcon.style.marginRight = "10px";
        alertIcon.style.verticalAlign = "top"; 
        alertIcon.style.position = "relative";
        alertIcon.style.top = "2px"; 

        closeIcon.src = "/assets/svg/x-close-circle-solid.svg";
        closeIcon.alt = "Close Button";
        closeIcon.style.width = "20px";
        closeIcon.style.height = "20px";

        // Create a new span for the text "DISMISS"
        const dismissText = document.createElement("span");
        dismissText.textContent = "DISMISS";
        dismissText.style.letterSpacing = "2px";
        dismissText.style.color = "bold";
        dismissText.style.fontWeight = "bold";
        dismissText.style.marginRight = "8px";

        // Create a container for the dismiss button and text
        const dismissContainer = document.createElement("div");
        dismissContainer.style.display = "flex";
        dismissContainer.style.alignItems = "center";
        dismissContainer.appendChild(dismissText);
        dismissContainer.appendChild(closeIcon);

        closeButton.innerHTML = "";
        closeButton.appendChild(dismissContainer);

        // Create the type text
        const typeText = document.createElement("b");
        typeText.style.letterSpacing = "2px";
        typeText.style.marginRight = "10px";
        typeText.style.verticalAlign = "top";
        typeText.textContent = `${type}:`;

        // Create a container for message text
        const textContainer = document.createElement("div");
        textContainer.innerHTML = message;
        textContainer.style.flex = "1";
        textContainer.style.minWidth = "200px";
        textContainer.style.verticalAlign = "top";

        // Style the <a> tag within the message
        const links = textContainer.querySelectorAll("a");
        links.forEach(link => {
            link.style.textDecoration = "underline"; // Apply underline to each link
        });

        // Create a flex container to align the message properly
        const messageContainer = document.createElement("div");
        messageContainer.style.display = "flex";
        messageContainer.style.alignItems = "flex-start"; // Ensures everything is aligned at the top
        messageContainer.style.gap = "10px";
        messageContainer.style.flexWrap = "wrap";
        messageContainer.style.flex = "1";

        messageContainer.appendChild(alertIcon);
        messageContainer.appendChild(typeText);
        messageContainer.appendChild(textContainer);

        bannerContent.prepend(messageContainer);        
        bannerContent.appendChild(closeButton);

        banner.appendChild(bannerContent)

        //  Move the dismiss button to a new line on mobile 
        function adjustLayout() {
            if (window.innerWidth <= 768) {
                // On small screens, wrap dismiss button to a new line
                closeButton.style.width = "100%"; 
                closeButton.style.display = "flex"; 
                closeButton.style.justifyContent = "flex-end";
                closeButton.style.textAlign = "right";
                bannerContent.style.flexDirection = "column";
            } else {
                // On larger screens, keep everything inline
                closeButton.style.width = "auto";
                closeButton.style.textAlign = "left";
                bannerContent.style.flexDirection = "row";
            }
        }

        // Run once on page load
        adjustLayout();

        // Update on window resize
        window.addEventListener("resize", adjustLayout);

        switch (type.toUpperCase()) {  
            case "WARNING":
                banner.style.backgroundColor = "#FEC51D";
                bannerContainer.style.backgroundColor = "#FEC51D";
                bannerContent.style.color = "black";
                dismissText.style.color = "black";
                alertIcon.src = "/assets/svg/warn-triangle-icon-solid.svg";
                break;
            case "ALERT":
                banner.style.backgroundColor = "#EAEAEA";
                bannerContainer.style.backgroundColor = "#EAEAEA";
                bannerContent.style.color = "black";
                dismissText.style.color = "black";
                alertIcon.src = "/assets/svg/bell-icon-solid.svg";
                break;
            case "INFORMATION":
                banner.style.backgroundColor = "#006CB8";
                bannerContainer.style.backgroundColor = "#006CB8";
                bannerContent.style.color = "white";
                dismissText.style.color = "white";
                alertIcon.src = "/assets/svg/check-circle-icon-solid.svg";
                alertIcon.style.filter = "invert(100%)";
                closeIcon.style.filter = "invert(100%)";
                break;
            case "SUCCESS":
                banner.style.backgroundColor = "#008566";
                bannerContainer.style.backgroundColor = "#008566";
                bannerContent.style.color = "white";
                dismissText.style.color = "white";
                alertIcon.src = "/assets/svg/check-circle-icon-solid.svg";
                alertIcon.style.filter = "invert(100%)";
                closeIcon.style.filter = "invert(100%)";
                break;
            case "ERROR":
                banner.style.backgroundColor = "#B1040E";
                bannerContainer.style.backgroundColor = "#B1040E";
                bannerContent.style.color = "white";
                dismissText.style.color = "white";
                alertIcon.src = "/assets/svg/error-circle-icon-solid.svg";
                alertIcon.style.filter = "invert(100%)";
                closeIcon.style.filter = "invert(100%)";
                break;
            default:
                console.error("ERROR: Invalid announcement type – Use WARNING, ALERT, INFORMATION, SUCCESS, or ERROR");
                return;
        }
    }

    let currentMessageHash; // GLOBAL DECLARATION

    // ======================== REMOVE BANNER ========================
    function removeBanner() {
        console.log("Removing banner and saving hash");
        const banner = document.querySelector("#announcement-banner");
        if (banner) {
            localStorage.setItem("announcement_hash", currentMessageHash);
            banner.remove();
        }
    }
    
    // ============== READ JSON AND DECIDE WHETHER TO SHOW BANNER ====================
    fetch('/assets/announcement.json')
        .then(response => response.json())
        .then(data => {
            const { message, type } = data;
    
            if (!message || !type) {
                console.warn("⚠️ Announcement JSON is missing 'message' or 'type'.");
                return;
            }
    
            // Function to hash the message string
            function hashMessage(msg) {
                let hash = 0;
                for (let i = 0; i < msg.length; i++) {
                    const char = msg.charCodeAt(i);
                    hash = (hash << 5) - hash + char;
                    hash |= 0; // Convert to 32-bit integer
                }
                return hash.toString();
            }
    
            currentMessageHash = hashMessage(message); 
            const storedHash = localStorage.getItem("announcement_hash");
    
            // If no hash is stored or it has changed, set the announcement bar
            if (!storedHash || storedHash !== currentMessageHash) {
                setAnnouncmentBar(type, message);
            } else {
                console.log("Announcement is unchanged or dismissed");
            }
        })
        .catch(error => console.error("Failed to load announcement.json:", error)); 

});



