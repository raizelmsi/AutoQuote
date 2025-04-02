import { extension_settings} from "../../../extensions.js";

const extensionName = "ST-AutoQuote";  // Change this to match your extension's folder name
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

// Load settings
async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }
}

// Modify user input before saving
function modifyUserInput() {
    let userInput = String($('#send_textarea').val());

    //modification
    userInput = userInput.replaceAll("\"", "");
    let arr = userInput.split("*");
    let output = "";
    let inside = false;
    for (let chunk of arr) {
        if (!inside) {
            let trimmed = chunk.trim();
            if (trimmed) {
                trimmed = '\"' + trimmed + '\"';
            }
            let leadingSpaces = chunk.slice(0, chunk.length - chunk.trimStart().length);
            output += (leadingSpaces + trimmed);

            let remainingSpaces = chunk.slice(chunk.trimEnd().length, chunk.length);
            output += remainingSpaces;

            inside = true;
        }
        else {
            chunk = '*' + chunk + '*';
            output += chunk;
            inside = false;
        }
    }

    userInput = output; 
    output = "";

    $('#send_textarea').val(userInput); // Update input field with modified text

    console.debug("Modified User Input: ", userInput);
}

// Hook into the send button
jQuery(async () => {
    const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
    $("#extensions_settings").append(settingsHtml);

    // Hook into the send button click
    $("#send_button").on("click", modifyUserInput);  // Runs when sending message

    // Hook into Enter key press
    $("#send_textarea").on("keydown", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            modifyUserInput();
        }
    });

    loadSettings();
});
