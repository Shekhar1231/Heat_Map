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

    $('#UploadModel').click(function () {


        document.getElementById("RevitFile").click();
        
        const file = document.getElementById("RevitFile").files[0];
        let data = new FormData();
        data.append('model-file', file);
        let res = await fetch("oss/api/forge/oss/objects", { method: 'POST', body: data });
       


    });

});
        
            

 