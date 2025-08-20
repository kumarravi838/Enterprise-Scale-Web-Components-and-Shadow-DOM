<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise-Scale Vanilla JS App New</title>
    <!-- Tailwind CSS CDN for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Apply Inter font globally if available, fallback to sans-serif */
        body {
            font-family: "Inter", sans-serif;
        }
    </style>
</head>
<body class="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center">

    <div class="bg-white p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row gap-8">
        <!-- Left Panel: Vanilla JavaScript Application -->
        <div class="flex-1 space-y-6">
            <h1 class="text-3xl font-bold text-blue-800 mb-4">Vanilla JavaScript Application 🍦</h1>
            <p class="text-gray-700">
                This section demonstrates a modern web application built with pure JavaScript, integrating with external Web Components and simulating API interactions.
            </p>

            <div class="bg-blue-50 p-4 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold text-blue-700 mb-2">Simulated API Data</h2>
                <div id="api-data-container" class="text-sm text-gray-800">
                    <p class="text-blue-600">Loading API data...</p>
                </div>
            </div>

            <div class="bg-green-50 p-4 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold text-green-700 mb-2">Interact with Web Component</h2>
                <p class="text-gray-700 mb-4">
                    Below are controls to interact with the custom `&lt;shadow-dom-display&gt;` Web Component rendered on the right.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button
                        id="interact-shadow-dom-btn"
                        class="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:from-red-600 hover:to-red-700 transition duration-300 transform hover:scale-105"
                    >
                        Access & Change Shadow DOM Directly
                    </button>
                    <button
                        id="update-web-component-method-btn"
                        class="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:from-teal-600 hover:to-teal-700 transition duration-300 transform hover:scale-105"
                    >
                        Call Web Component Public Method
                    </button>
                </div>
            </div>
        </div>

        <!-- Right Panel: Web Component Integration -->
        <div class="flex-1 space-y-6">
            <h1 class="text-3xl font-bold text-purple-800 mb-4">Web Component Integration 🧩</h1>
            <p class="text-gray-700">
                This area showcases a custom Web Component (`&lt;shadow-dom-display&gt;`) built with vanilla JavaScript. Its internal structure is encapsulated within a Shadow DOM.
            </p>
            <div class="bg-purple-50 p-4 rounded-lg shadow-md min-h-[180px] flex items-center justify-center">
                <!-- Render the custom web component -->
                <shadow-dom-display id="my-shadow-component"></shadow-dom-display>
            </div>
            <p class="text-sm text-gray-600 mt-4">
                Notice how the "Web Component Internal Display" and "Click Me (Internal)" button are styled and behave independently due to the Shadow DOM encapsulation. The Vanilla JS app can still interact with its internals or public methods.
            </p>
        </div>
    </div>

    <script>
        // -----------------------------------------------------------
        // Custom Web Component Definition (Vanilla JS)
        // This simulates a third-party or legacy component using Shadow DOM
        // -----------------------------------------------------------
        class ShadowDOMDisplay extends HTMLElement {
            constructor() {
                super();
                // Attach a shadow DOM to the custom element.
                const shadowRoot = this.attachShadow({ mode: 'open' }); // 'open' allows JS access from outside

                // Create a container for the component's content
                const container = document.createElement('div');
                container.className = 'p-4 bg-purple-100 rounded-lg shadow-inner';

                // Add some styling for the shadow DOM content
                const style = document.createElement('style');
                style.textContent = `
                    :host {
                        display: block;
                        border: 1px dashed #a78bfa; /* Border around the custom element itself */
                        border-radius: 0.5rem;
                        padding: 0.5rem;
                        margin-bottom: 1rem;
                    }
                    .title {
                        font-weight: bold;
                        color: #6d28d9;
                        margin-bottom: 0.5rem;
                    }
                    .content {
                        color: #4c1d95;
                    }
                    .internal-button {
                        background-color: #8b5cf6;
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 9999px; /* rounded-full */
                        margin-top: 1rem;
                        cursor: pointer;
                        border: none;
                        transition: background-color 0.2s ease-in-out;
                    }
                    .internal-button:hover {
                        background-color: #7c3aed;
                    }
                `;

                // Add content to the shadow DOM
                container.innerHTML = `
                    <div class="title">Web Component Internal Display ⚙️</div>
                    <p class="content" id="display-text">Initial content from Shadow DOM.</p>
                    <button class="internal-button" id="shadow-button">Click Me (Internal)</button>
                `;

                // Append elements to the shadow root
                shadowRoot.appendChild(style);
                shadowRoot.appendChild(container);

                // Event listener for the internal button
                const internalButton = shadowRoot.getElementById('shadow-button');
                internalButton.addEventListener('click', () => {
                    const displayText = shadowRoot.getElementById('display-text');
                    displayText.textContent = 'Button inside Shadow DOM clicked!';
                    console.log('Internal button clicked within Shadow DOM!');
                });
            }

            // Method to update content from outside (e.g., from main JS)
            updateContent(newText) {
                const shadowRoot = this.shadowRoot;
                if (shadowRoot) {
                    const displayText = shadowRoot.getElementById('display-text');
                    if (displayText) {
                        displayText.textContent = newText;
                    }
                }
            }
        }

        // Define the custom element so it can be used in HTML/JSX
        if (!customElements.get('shadow-dom-display')) {
            customElements.define('shadow-dom-display', ShadowDOMDisplay);
        }

        // -----------------------------------------------------------
        // Main Application Logic (Vanilla JS)
        // -----------------------------------------------------------

        // A simple utility for simulating API calls with exponential backoff
        const fetchDataWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                if (retries > 0) {
                    console.warn(`Fetch failed, retrying in ${delay / 1000}s... (${retries} retries left)`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return fetchDataWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
                }
                throw error;
            }
        };

        // DOMContentLoaded ensures the HTML is fully parsed before script runs
        document.addEventListener('DOMContentLoaded', () => {
            const apiDataContainer = document.getElementById('api-data-container');
            const customElement = document.getElementById('my-shadow-component');
            const interactShadowDomBtn = document.getElementById('interact-shadow-dom-btn');
            const updateWebComponentMethodBtn = document.getElementById('update-web-component-method-btn');

            // Simulate an API call on page load
            const fetchSimulatedData = async () => {
                try {
                    apiDataContainer.innerHTML = '<p class="text-blue-600">Loading API data...</p>';
                    const data = await fetchDataWithRetry('https://jsonplaceholder.typicode.com/posts/1', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    apiDataContainer.innerHTML = `
                        <p><strong class="text-blue-900">Title:</strong> ${data.title}</p>
                        <p><strong class="text-blue-900">Body:</strong> ${data.body}</p>
                    `;
                } catch (err) {
                    apiDataContainer.innerHTML = `<p class="text-red-600">Error: ${err.message}</p>`;
                }
            };

            // Function to interact with the Shadow DOM of the custom element
            const interactWithShadowDOM = () => {
                if (customElement) {
                    const shadowRoot = customElement.shadowRoot; // Get the shadowRoot
                    if (shadowRoot) {
                        // Access an element inside the Shadow DOM
                        const internalTextElement = shadowRoot.getElementById('display-text');
                        const internalButton = shadowRoot.getElementById('shadow-button');

                        if (internalTextElement) {
                            internalTextElement.textContent = 'Content updated directly via Vanilla JS and Shadow DOM API!';
                            internalTextElement.style.color = '#dc2626'; // Red color for emphasis
                            console.log('Successfully updated content inside Shadow DOM from Vanilla JS.');
                        } else {
                            console.error('Could not find display-text element in Shadow DOM.');
                        }

                        if (internalButton) {
                            internalButton.style.backgroundColor = '#16a34a'; // Green button
                            console.log('Successfully styled internal button via Vanilla JS and Shadow DOM API.');
                        }
                    } else {
                        console.error('Shadow Root not found for custom element.');
                    }
                } else {
                    console.warn('Custom element is not yet available.');
                }
            };

            // Function to trigger the custom element's public method
            const updateWebComponentViaMethod = () => {
                if (customElement && typeof customElement.updateContent === 'function') {
                    customElement.updateContent('Updated via Web Component public method from Vanilla JS!');
                    console.log('Content updated via Web Component public method.');
                } else {
                    console.warn('Web Component public method not available or element not ready.');
                }
            };

            // Attach event listeners to buttons
            if (interactShadowDomBtn) {
                interactShadowDomBtn.addEventListener('click', interactWithShadowDOM);
            }
            if (updateWebComponentMethodBtn) {
                updateWebComponentMethodBtn.addEventListener('click', updateWebComponentViaMethod);
            }

            // Initial data fetch
            fetchSimulatedData();
        });
    </script>
</body>
</html>

