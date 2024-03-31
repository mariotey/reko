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
}
