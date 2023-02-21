    import { initViewer, loadModel } from './viewer.js';
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

    const upload = document.getElementById("UploadModel");
    const input = document.getElementById("RevitFile");
    upload.onclick = () => input.click();
    input.onchange = async () => {
        const file = input.files[0];
        let data = new FormData();
        data.append('fileToUpload', file);
        upload.setAttribute('disabled', true);
        try {
            const resp = await fetch('api/forge/oss/objects', { method: 'POST', body: data });
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
        } catch (e) {
            upload.removeAttribute('disabled');
        }
    }

    const transalteModel = document.getElementById("translateModel");

    transalteModel.onclick = async () => {
       
        initViewer(document.getElementById('preview')).then(viewer => {
            const urn = window.location.hash?.substring(1);

        });
        onModelSelected(viewer, urn);
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


        
            

 