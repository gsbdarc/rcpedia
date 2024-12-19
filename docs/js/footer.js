class MyComponent extends HTMLElement {
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
        div.id = 'custom-su-footer';
        div.className = 'custom-su-footer';
        this.shadowRoot.appendChild(div);

        // Fetch and set HTML content
        const htmlURL = '/footer-inner-html.html';
        fetch(htmlURL)
            .then(response => response.text())
            .then(html => {
                div.innerHTML = html;
            })
            .catch(error => console.error('Failed to load HTML:', error));
    }
}

console.log('Setting up Footer Shadow DOM');
customElements.define('custom-su-global-footer', MyComponent);