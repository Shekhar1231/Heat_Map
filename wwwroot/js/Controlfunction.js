
import { initViewer, loadModel } from './viewer.js';

initViewer(document.getElementById('preview')).then(viewer => {
    const urn = window.location.hash?.substring(1);
    setupModelSelection(viewer, urn);
    setupModelUpload(viewer);
});

$(document).ready(function ()
{
    const Menuelement = document.getElementById("MenuPanel");
    $('#Menubarbutton').click(function () {
        if (Menuelement.style.display !== "none") {
            Menuelement.style.transition = "1s"
            Menuelement.style.display = "none";

        }
        else {
            Menuelement.style.transition = "1s"
            Menuelement.style.display = "block";
        }
    });
    

    const input = document.getElementById("input");
    const models = document.getElementById("RevitFile");
    const upload = document.getElementById("UploadRevitFile")

    upload.onclick = () => input.click();

    input.onchange = async () => {
        const file = input.files[0];
        let data = new FormData();
        data.append('model-file', file);
        upload.setAttribute('disabled', 'true');
        models.setAttribute('disabled', 'true');
        try {

            const resp = await fetch('/api/models', { method: 'POST', body: data });
            if (!resp.ok)
            {
                throw new Error(await resp.text());
            }
        }
        catch (e) {
            upload.removeAttribute('disabled');
        }
    }
});

    async function setupModelSelection(viewer, selectedUrn)
{
    const dropdown = document.getElementById("RevitFile");
    dropdown.innerHTML = '';
    try
    {
        const resp = await fetch('/api/models');
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const models = await resp.json();
        dropdown.innerHTML = models.map(model => `<option value=${model.urn} ${model.urn === selectedUrn ? 'selected' : ''}>${model.name}</option>`).join('\n');
        dropdown.onchange = () => onModelSelected(viewer, dropdown.value);
        if (dropdown.value) {
            onModelSelected(viewer, dropdown.value);
        }
    }

    catch (err)
    {
        alert('Could not list models. See the console for more details.');
        console.error(err);
    }
}

    async function onModelSelected(viewer, urn) {
        if (window.onModelSelectedTimeout) {
            clearTimeout(window.onModelSelectedTimeout);
            delete window.onModelSelectedTimeout;
        }
        window.location.hash = urn;
        try {
            const resp = await fetch(`/api/models/${urn}/status`);
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            const status = await resp.json();
            switch (status.status) {
                case 'n/a':
                    showNotification(`Model has not been translated.`);
                    break;
                case 'inprogress':
                    showNotification(`Model is being translated (${status.progress})...`);
                    window.onModelSelectedTimeout = setTimeout(onModelSelected, 5000, viewer, urn);
                    break;
                case 'failed':
                    showNotification(`Translation failed. <ul>${status.messages.map(msg => `<li>${JSON.stringify(msg)}</li>`).join('')}</ul>`);
                    break;
                default:
                    clearNotification();
                    loadModel(viewer, urn);
                    break;
            }
        } catch (err) {
            alert('Could not load model. See the console for more details.');
            console.error(err);
        }
    }

   


        
            

 