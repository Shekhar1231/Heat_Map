$(document).ready(function () {
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

});
        
            

 