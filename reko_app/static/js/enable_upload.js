document.getElementById('file_input').addEventListener('change', function() {
    var fileInput = document.getElementById('file_input');
    var uploadButton = document.getElementById('uploadButton');

    if (fileInput.files.length > 0) {
        uploadButton.disabled = false;
    } else {
        uploadButton.disabled = true;
    }
});