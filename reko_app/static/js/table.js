document.getElementById('file_input').addEventListener('change', handleFile);

function handleFile(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0]; // Assuming only one sheet

        const sheet = workbook.Sheets[sheetName];
        globalTableData = XLSX.utils.sheet_to_json(sheet, {header: 1});

        renderTable(globalTableData);
        renderMetricHeaders(globalTableData[0], metrics);
        renderActionHeaders(globalTableData[0]);
    };

    reader.readAsArrayBuffer(file);
}

function renderTable(data) {
    const table = document.getElementById('dataTable');
    const thead = document.getElementById('dataHeaders');
    const tbody = table.querySelector('tbody');

    // Clear previous data
    thead.innerHTML = '';
    tbody.innerHTML = '';

    // Generate table headers
    const headers = data[0];
    const headerRow = document.createElement('tr');
    headers.forEach((headerText, index) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.id = `data_${index}`;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Generate table body
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
}

function renderMetricHeaders(headers, metrics) {
    const metricHeaders = document.getElementById('metricHeaders');
    metricHeaders.innerHTML = '';

    const actionRow = document.createElement('tr');
    headers.forEach((headerText, index) => {
        const th = document.createElement('th');
        const select = document.createElement('select');
        select.name = `metricSelect_${index}`; // Set name for select element
        select.id = `metricSelect_${index}`; // Set unique id for select element

        // Create the none options
        const option = document.createElement('option');
        option.value = "None";
        option.textContent = "None";
        option.selected = true;
        select.append(option);

        // Create options for each metric
        metrics.forEach(metric => {
            const option = document.createElement('option');
            option.value = metric;
            option.textContent = metric;
            select.appendChild(option);
        });

        th.appendChild(select);
        actionRow.appendChild(th);
    });
    metricHeaders.appendChild(actionRow);
}

function renderActionHeaders(headers) {
    const actionHeaders = document.getElementById('actionHeaders');
    actionHeaders.innerHTML = '';

    const actionRow = document.createElement('tr');
    headers.forEach((headerText,index) => {
        const th = document.createElement('th');
        const select = document.createElement('select');
        select.innerHTML = '<option value="None" selected>None</option><option value="List">List</option><option value="Count">Count</option>';
        select.name = `actionSelect_${index}`; // Set name for select element
        select.id = `actionSelect_${index}`; // Set unique id for select element

        select.addEventListener("change", function() {
            selectedValues = [];

            let metricsDiv = document.getElementById("metricsContainer");
            metricsDiv.innerHTML = "";

            let metricCheckBox = document.getElementById("metricsCheckboxList");
            metricCheckBox.innerHTML = "";

            for (let i = 0; i < headers.length; i++){
                const actionSelect = document.getElementById(`actionSelect_${i}`);
                const columnValues = globalTableData.slice(1).map(row => row[i]);

                if (actionSelect.value != "None") {
                    metricSelect = document.getElementById(`metricSelect_${i}`);

                    let divElm = document.createElement("div");
                    divElm.id = `dataEntry_${i}`;

                    let checkBox = document.createElement("input");
                    checkBox.type = 'checkbox';
                    checkBox.id = `checkbox_${i}`;

                    let dataHeader = "";
                    let dataContent = "";

                    if (metricSelect.value == "None"){
                        dataSelect = document.getElementById(`data_${i}`);
                        dataHeader = dataSelect.innerHTML;
                    }
                    else {
                        dataHeader = metricSelect.value;
                    }

                    if (actionSelect.value == "Count") {
                        let dict = {}
                        const uniqueValuesArray = Array.from(new Set(columnValues));

                        uniqueValuesArray.forEach(value => {
                            dict[value] = 0;
                        });

                        columnValues.forEach(value=> {
                            dict[value] += 1;
                        });

                        dataContent = JSON.stringify(dict);
                    }
                    else {
                        dataContent = columnValues
                    }

                    divElm.innerHTML = `<h5>${dataHeader}</h5> <p>${dataContent}</p>`;
                    metricsDiv.append(divElm);

                    let label = document.createElement('label');
                    let labelText = document.createTextNode(dataHeader);
                    checkBox.value = actionSelect.value;
                    label.appendChild(checkBox);
                    label.appendChild(labelText);
                    metricCheckBox.append(label);
                }
            }
        });

        th.appendChild(select);
        actionRow.appendChild(th);
    });
    actionHeaders.appendChild(actionRow);
}
