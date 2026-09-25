class CustomGlobalFooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Attach a shadow root to the element.
    }

    connectedCallback() {
        // Fetch and apply CSS to the Shadow DOM
        const cssURL = '/stylesheets/decanter.css';
        fetch(cssURL)
            .then(response => response.text())
            .then(css => {
                const style = document.createElement('style');
                style.textContent = css
                this.shadowRoot.appendChild(style);
            })
            .catch(error => console.error('Failed to load CSS:', error));

        // Create and append a div for HTML content
        const div = document.createElement('div');
        div.id = 'custom-global-su-footer';
        div.className = 'custom-global-su-footer';
        this.shadowRoot.appendChild(div);

        // Fetch and set HTML content
        const htmlURL = '/html/global-footer-inner-html.html';
        fetch(htmlURL)
            .then(response => response.text())
            .then(html => {
                div.innerHTML = html;
            })
            .catch(error => console.error('Failed to load HTML:', error));
    }
}

class CustomLocalFooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Attach a shadow root to the element.
    }

    async connectedCallback() {
        try {
            // List of CSS files to include from the "css" folder
            const cssFiles = [
                '/stylesheets/decanter.css',
            ];

            // Dynamically load each CSS file
            for (const cssURL of cssFiles) {
                const response = await fetch(cssURL);
                if (!response.ok) {
                    console.error(`Failed to load CSS: ${cssURL}`);
                    continue;
                }

                const css = await response.text();
                const style = document.createElement('style');
                style.textContent = css;
                this.shadowRoot.appendChild(style);
            }

            // Create and append a div for HTML content
            const div = document.createElement('div');
            div.id = 'custom-local-su-footer';
            div.className = 'custom-local-su-footer';
            this.shadowRoot.appendChild(div);

            // Fetch and set HTML content
            const htmlURL = '/html/local-footer-inner-html.html';
            const htmlResponse = await fetch(htmlURL);
            if (htmlResponse.ok) {
                const html = await htmlResponse.text();
                div.innerHTML = html;
            } else {
                console.error(`Failed to load HTML: ${htmlURL}`);
            }
        } catch (error) {
            console.error('Error in CustomLocalFooterComponent:', error);
        }
    }
}

console.log('Setting up Footer Shadow DOM');
customElements.define('custom-su-global-footer', CustomGlobalFooterComponent);
customElements.define('custom-su-local-footer', CustomLocalFooterComponent);