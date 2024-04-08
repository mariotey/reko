function renderChart() {
    var container = document.getElementById("metricsContainer");
    var divElems = container.getElementsByTagName('div');

    var selectElm = document.getElementById("chartTypeDropdown");
    var selectedValue = selectElm.options[selectElm.selectedIndex].value;

    var chartContainer = document.getElementById("chartContainer");
    chartContainer.innerHTML = "";

    // Iterate over the HTMLCollection and get IDs
    for (var i = 0; i < divElems.length; i++) {
        var divId = divElems[i].id;
        var numericPart = divId.split('_')[1]; // Split the ID by underscore and get the second part

        checkboxElem = document.getElementById(`checkbox_${numericPart}`);

        if (checkboxElem.checked) {
            var h5InnerHtml = divElems[i].querySelector('h5').innerHTML;
            var pInnerHtml = divElems[i].querySelector('p').innerHTML;

            if (selectedValue == "bar") {
                barChart(h5InnerHtml, pInnerHtml, i);
            }
            else if (selectedValue == "line") {
                lineChart(h5InnerHtml, pInnerHtml, i);
            }
            else {
                pieChart(h5InnerHtml, pInnerHtml, i);
            }
        }
    }
}

function barChart(title, data, num){
    var jsonData = JSON.parse(data);
    var labels = [], chartData = [];

    // Check if the keys are numerical or string
    var isNumerical = !isNaN(Object.keys(jsonData)[0]);

    // Process data based on key type
    if (isNumerical) {
        labels = Object.keys(jsonData)
        chartData = Object.values(jsonData)
    } else {
        labels = Object.keys(jsonData);
        chartData = labels.map(key => jsonData[key]);
    }

    var canvasElm = document.createElement("canvas");
    canvasElm.id = `canvas_${num}`;
    canvasElm.style.margin = "20px";

    chartContainer.append(canvasElm);

    var myChart = new Chart(canvasElm, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: chartData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

function lineChart(title, data, num){
    var jsonData = JSON.parse(data);
    var labels = [], chartData = [];

    // Check if the keys are numerical or string
    var isNumerical = !isNaN(Object.keys(jsonData)[0]);

    // Process data based on key type
    if (isNumerical) {
        labels = Object.keys(jsonData)
        chartData = Object.values(jsonData)
    } else {
        labels = Object.keys(jsonData);
        chartData = labels.map(key => jsonData[key]);
    }
    console.log(num);
    console.log(labels);
    console.log(data);
    console.log(chartData);

    var canvasElm = document.createElement("canvas");
    canvasElm.id = `canvas_${num}`;
    canvasElm.style.margin = "20px";

    chartContainer.append(canvasElm);

    var myChart = new Chart(canvasElm, {
        type: 'line', // Changed type to line
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: chartData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

function pieChart(title, data, num){
    var jsonData = JSON.parse(data);
    var labels = [], chartData = [];

    // Process data based on key type
    if (Array.isArray(jsonData)) {
        // If data is already an array, assume it's in the format [value1, value2, ...]
        chartData = jsonData;
        labels = Array.from(Array(jsonData.length).keys()).map(String);
    } else {
        // If data is an object, assume it's in the format {"label1": value1, "label2": value2, ...}
        labels = Object.keys(jsonData);
        chartData = labels.map(key => jsonData[key]);
    }

    var canvasElm = document.createElement("canvas");
    canvasElm.id = `canvas_${num}`;
    canvasElm.style.margin = "20px";

    chartContainer.append(canvasElm);

    var myChart = new Chart(canvasElm, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: chartData,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
};
