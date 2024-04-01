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
    metricListDiv.innerHTML = `<div>${metrics.join(', ')}</div>`;

    renderTable(globalTableData);
    renderMetricHeaders(globalTableData[0], metrics);
    renderActionHeaders(globalTableData[0]);
}
