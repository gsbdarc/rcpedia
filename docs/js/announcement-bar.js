document.addEventListener("DOMContentLoaded", function () { 
    
    // --- VARS FOR TESTING --
    // var shortMessage = "These are the details of the alert message. "
    // var linkedText = '<a href="https://example.com" target="_blank">This is a link within an alert.</a> '
    // var longMessage = 'This a <b> very </b> long sentence to test the line wrap behavior of long alert messages!'
    
    // ⬇️        CHANGE THIS CODE TO EDIT THE ANNOUNCMENT BAR        ⬇️ 
    // 👇      👇      👇      👇      👇      👇       👇      👇       👇       👇
    // setAnnouncmentBar(type="ALERT", message=shortMessage+linkedText+longMessage); // FOR TESTING
    
    // TEMPORARY –– MSG TO BE REMOVED: Announcing the new site
    //    setAnnouncmentBar(type="INFORMATION", 'Hey There! 👋 Welcome to the new GSB Research Computing Site! This site is the new and improved version of RCpedia. If you are a member of the Stanford community, please <a href="https://app.slack.com/client/E7SAV7LAD/C01JXJ6U4E5" target="_blank">join our Slack channel</a> and tell us what you think!');

    // 👆      👆      👆      👆      👆      👆       👆      👆       👆        👆 
   //   setAnnouncmentBar(type="ALERT", message='The Yen servers are scheduled for a routine reboot next <b>Thursday, March 27, 2025</b>.');    

    
    // ======================== E X A M P L E S ========================
    // setAnnouncmentBar(type="ERROR", message='There’s a campus-wide network issue affecting connectivity. As a result the Yens are down until further notice. Please <a href="https://app.slack.com/client/E7SAV7LAD/C01JXJ6U4E5" target="_blank">join our Slack Channel</a> or the <a href="https://mailman.stanford.edu/mailman/listinfo/yen-server-announce" target="_blank">Yens Announmcement email list</a> for further updates.');
    // setAnnouncmentBar(type="INFORMATION", 'The Data, Analytics, and Research Computing (DARC) team will be observing the Thanksgiving holiday from the afternoon of <b>Wednesday, November 27</b> through <b>Friday, November 29</b>, returning <b>Monday, December 2nd</b>.');
    // setAnnouncmentBar(type="WARNING",'☃️ <b>Winter Closure</b> ☃️ Dec. 21 2024 – Jan. 5, 2025. DARC support unavailable during this period. The Yens remain accessible. For major outages, contact <a href="mail-to:srcc-support@stanford.edu" target="_blank">srcc-support@stanford.edu.</a>');
    // setAnnouncmentBar(type="ALERT", message='The Yen servers are scheduled for a routine reboot next <b>Thursday, January 23, 2025</b>.');
    // setAnnouncmentBar(type="SUCCESS", 'The issues with JupyterHub have been resolved. Please visit the <a href="/status">Status page</a> or <a href="https://app.slack.com/client/E7SAV7LAD/C01JXJ6U4E5" target="_blank">join our Slack channel </a>to be informed of any server status changes.');

    console.log(localStorage.getItem("announcementDismissed"));
    // ======================== F U N C T I O N ========================
    function setAnnouncmentBar(type, message) { 
        `
        Args:
        - type (string): The type of announcement.
        - type options: WARNING, ALERT, INFORMATION, SUCCESS, or ERROR.
        - message (string): The announcement content. Use <a> tags for links.
        `
        if (localStorage.getItem("announcementDismissed") === "false") {
        
            console.log("Setting announcement bar");

            const banner = document.querySelector(".md-banner");
            if (!banner) {
                console.warn("⚠️ .md-banner element not found!");
                return;
            }

            const bannerContent = banner.querySelector(".md-banner__inner");
            bannerContent.style.display = "flex";
            bannerContent.style.alignItems = "flex-start"; // Align everything to the top
            bannerContent.style.justifyContent = "space-between"; 
            bannerContent.style.flexWrap = "wrap"; // Allows wrapping
            bannerContent.style.gap = "10px";

            const closeButton = document.querySelector(".md-banner__button.md-icon");
            closeButton.id = "dismissButton";
            const alertIcon = document.createElement("img");
            const closeIcon = document.createElement("img");

            switch (type.toUpperCase()) {  
                case "WARNING":
                    banner.style.backgroundColor = "#FEC51D";
                    bannerContent.style.color = "black";
                    alertIcon.src = "/assets/svg/warn-triangle-icon-solid.svg";
                    break;
                case "ALERT":
                    banner.style.backgroundColor = "#EAEAEA";
                    bannerContent.style.color = "black";
                    alertIcon.src = "/assets/svg/bell-icon-solid.svg";
                    break;
                case "INFORMATION":
                    banner.style.backgroundColor = "#006CB8";
                    alertIcon.src = "/assets/svg/check-circle-icon-solid.svg";
                    alertIcon.style.filter = "invert(100%)";
                    closeIcon.style.filter = "invert(100%)";
                    break;
                case "SUCCESS":
                    banner.style.backgroundColor = "#008566";
                    alertIcon.src = "/assets/svg/check-circle-icon-solid.svg";
                    alertIcon.style.filter = "invert(100%)";
                    closeIcon.style.filter = "invert(100%)";
                    break;
                case "ERROR":
                    banner.style.backgroundColor = "#B1040E";
                    alertIcon.src = "/assets/svg/error-circle-icon-solid.svg";
                    alertIcon.style.filter = "invert(100%)";
                    closeIcon.style.filter = "invert(100%)";
                    break;
                default:
                    console.error("ERROR: Invalid announcement type – Use WARNING, ALERT, INFORMATION, SUCCESS, or ERROR");
                    return;
            }

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
            dismissText.style.fontWeight = "bold";
            dismissText.style.marginRight = "8px";

            // Create a container for the dismiss button and text
            const dismissContainer = document.createElement("div");
            dismissContainer.style.display = "flex";
            dismissContainer.style.alignItems = "center";
            dismissContainer.appendChild(dismissText);
            dismissContainer.appendChild(closeIcon);

            // const innerTextContent = document.querySelector(".md-banner__inner");
            // innerTextContent.innerHTML += "hi"

            closeButton.innerHTML = "";
            closeButton.appendChild(dismissContainer);

            // Create the type text
            const typeText = document.createElement("b");
            typeText.style.letterSpacing = "2px";
            typeText.style.marginRight = "10px";
            typeText.style.verticalAlign = "top";
            typeText.textContent = `${type}:`;

            // Create a container for message text
            const tempContainer = document.createElement("div");
            tempContainer.innerHTML = message;
            tempContainer.style.flex = "1";
            tempContainer.style.minWidth = "200px";
            tempContainer.style.verticalAlign = "top";

            // Style the <a> tag within the message
            const links = tempContainer.querySelectorAll("a");
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
            messageContainer.appendChild(tempContainer);

            bannerContent.prepend(messageContainer);        // bannerContent.appendChild(closeButton);

            // **Responsive Behavior - Move the dismiss button to a new line on mobile**
            function adjustLayout() {
                if (window.innerWidth <= 768) {
                    // On small screens, wrap dismiss button to a new line
                    closeButton.style.width = "100%"; // Make it take full width
                    closeButton.style.display = "flex"; // Enable flexbox
                    closeButton.style.justifyContent = "flex-end"; // Align to the right
                    closeButton.style.textAlign = "right"; // Ensure text is aligned correctly
                    bannerContent.style.flexDirection = "column"; // Stack elements vertically
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
        }
    }

    function removeBanner(){
        const banner = document.querySelector(".md-banner");
        if (banner) {
            console.log("Removing banner because the content has not been set above.")
            banner.remove();
        }
    }

    // const bannerContent = document.querySelector(".md-banner__inner");
    // // If the banner content is unset, remove it
    // if (bannerContent.textContent.trim() == "‎") { // 
    //     removeBanner()
    // }

});

document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("dismissButton"); // Change this to match your button's ID

    localStorage.setItem("announcementDismissed", "false"); // Store the button initial state

    // Event listener for button click
    if (button) {
        button.addEventListener("click", function () {
            localStorage.setItem("announcementDismissed", "true"); // Store the button click
            console.log("Button clicked and stored in cache!");
        });
    }
});
