let metrics = [];

document.getElementById('addMetricButton').addEventListener('click', function() {
    const metricName = document.getElementById('metricNameInput').value.trim();
    if (metricName && !metrics.includes(metricName)) {
        metrics.push(metricName);
        updateMetricList();
        document.getElementById('metricNameInput').value = ''; // Clear input field
    }
});

function updateMetricList() {
    const metricListDiv = document.getElementById('metricList');
    metricListDiv.innerHTML = '';
    metrics.forEach(metric => {
        metricListDiv.innerHTML += `<div>${metric}</div>`;
    });

    const file = document.getElementById("file_input").files[0]
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0]; // Assuming only one sheet

        const sheet = workbook.Sheets[sheetName];
        const tableData = XLSX.utils.sheet_to_json(sheet, {header: 1});

        renderTable(tableData);
        renderMetricHeaders(tableData[0], metrics);
        renderActionHeaders(tableData[0]);
    };

    reader.readAsArrayBuffer(file);
}
