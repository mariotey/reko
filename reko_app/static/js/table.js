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
        const tableData = XLSX.utils.sheet_to_json(sheet, {header: 1});

        renderTable(tableData);
    };

    reader.readAsArrayBuffer(file);
}

function renderTable(data) {
    const table = document.getElementById('dataTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Clear previous data
    thead.innerHTML = '';
    tbody.innerHTML = '';

    // Generate table headers
    const headers = data[0];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
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
