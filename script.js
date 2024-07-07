async function showUploader() {
    const uploaderSection = document.getElementById('uploader-section');
    const apiKeySection = document.getElementById('api-key-section');
    
    uploaderSection.style.display = 'block';
    apiKeySection.style.display = 'none';

    await loadPastes();
}

function toggleApiKeySection() {
    const apiKeySection = document.getElementById('api-key-section');
    const uploaderSection = document.getElementById('uploader-section');

    if (apiKeySection.style.display === 'block') {
        apiKeySection.style.display = 'none';
        uploaderSection.style.display = 'block';
    } else {
        apiKeySection.style.display = 'block';
        uploaderSection.style.display = 'none';
    }
}

document.getElementById('pasteForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const content = document.getElementById('pasteContent').value;
    const customUrl = document.getElementById('customUrl').value.toLowerCase();

    const response = await fetch('/paste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, customUrl })
    });

    if (response.ok) {
        const result = await response.json();
        window.location.href = result.redirectUrl;
    } else {
        const errorMessage = await response.text();
        if (errorMessage.includes('Custom URL already exists')) {
            alert('This custom URL already exists. Please choose a different one.');
        } else {
            alert('An error occurred while creating the paste.');
        }
    }
});

async function generateApiKey() {
    try {
        const response = await fetch('/api/admin/apikeys/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('api-key-message').innerText = 'Generated API Key: ' + data.apiKey;
        } else {
            const errorMessage = await response.text();
            if (errorMessage.includes('API Key already generated')) {
                alert('An API Key has already been generated for this IP.');
            } else {
                alert('Error generating API Key');
            }
        }
    } catch (error) {
        console.error('Error generating API Key:', error);
        alert('Failed to generate API Key. Please try again later.');
    }
}

function applyMarkdown(type) {
    const textarea = document.getElementById('pasteContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newText = '';

    switch (type) {
        case 'bold':
            newText = `**${selectedText}**`;
            break;
        case 'italic':
            newText = `*${selectedText}*`;
            break;
        case 'strike':
            newText = `~~${selectedText}~~`;
            break;
        case 'code':
            newText = `\`${selectedText}\``;
            break;
        default:
            break;
    }

    textarea.setRangeText(newText, start, end, 'end');
    updatePreview();
}

function createLink() {
    const textarea = document.getElementById('pasteContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const url = prompt('Enter URL:');

    if (url) {
        const linkText = `[${selectedText}](${url})`;
        textarea.setRangeText(linkText, start, end, 'end');
        updatePreview();
    }
}

function insertImage() {
    const textarea = document.getElementById('pasteContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const imageUrl = prompt('Enter Image URL:');

    if (imageUrl) {
        const imageText = `![Image Alt Text](${imageUrl})`;
        textarea.setRangeText(imageText, start, end, 'end');
        updatePreview();
    }
}

function updatePreview() {
    const content = document.getElementById('pasteContent').value;
    const preview = document.getElementById('preview');
    preview.innerHTML = content
        .replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gm, '<em>$1</em>')
        .replace(/~~(.*?)~~/gm, '<del>$1</del>')
        .replace(/`(.*?)`/gm, '<code>$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2" target="_blank">$1</a>')
        .replace(/!\[(.*?)\]\((.*?)\)/gm, '<img src="$2" alt="$1">');
}

document.addEventListener("DOMContentLoaded", function() {
    updatePreview();
});
