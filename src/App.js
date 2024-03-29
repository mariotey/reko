const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json()); // Add this to parse JSON bodies

/////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Trimming spaces from headers
    const headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0].map(header => header.toString().trim());

    // Convert the rest of the data using trimmed headers
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: headers, range: 1 });

    res.json({ headers, rows: jsonData });
});

/////////////////////////////////////////////////////////////////////////////////////////////////
function applyPreference(rows, column, preference) {
    switch (preference) {
        case 'count':
            return countValues(rows, column);
        case 'list':
            return listValues(rows, column);
        // Add other cases as needed
    }
}

function countValues(data, column) {
    return data.reduce((acc, row) => {
        const value = row[column] || 'Undefined';
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
}

function listValues(data, column) {
    return data.map(row => row[column]).filter(value => value != null);
}

function processData(data, preferences, selectedMetrics) {
    let summary = {};

    data.headers.forEach((header, index) => {
        const metric = selectedMetrics[index];
        const preference = preferences[index].toLowerCase();

        if (preference !== 'none') {
            if (metric !== 'none') {
                // Process and aggregate under the specified metric
                summary[metric] = summary[metric] || (preference === 'list' ? [] : {});
                const result = applyPreference(data.rows, header, preference);
                if (preference === 'count') {
                    for (const key in result) {
                        summary[metric][key] = (summary[metric][key] || 0) + result[key];
                    }
                } else if (preference === 'list') {
                    summary[metric] = summary[metric].concat(result);
                }
            } else {
                // Process but do not aggregate under any metric (handle it individually)
                summary[header] = applyPreference(data.rows, header, preference);
            }
        }
    });

    return summary;
}

app.post('/process', (req, res) => {
    const data = req.body.data;
    const preferences = req.body.preferences;
    const selectedMetrics = req.body.selectedMetrics; // Uncomment this line

    const processedData = processData(data, preferences, selectedMetrics); // Pass selectedMetrics to processData
    res.json(processedData);
});

/////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});