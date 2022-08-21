const fs = require('fs');

main();

async function main() {
    // first load the log file and get pure string
    const string = await loadStringFromFile();

    // convert the string into lines array
    const lines = convertStringToLines(string);

    // filter those lines with only 'ERROR:' keyword
    const linesWithError = filterLinesWithError(lines);

    // extract a list of error IDs from the lines
    const errorIds = extractErrorId(linesWithError);

    // generate a report according to the error ID list from the logs.
    generateReport(errorIds, lines);
}

// a promise that return a string after it loaded the log file.
function loadStringFromFile() {
    return new Promise((resolve) => {
        fs.readFile(__dirname + '/example.log', function (err, data) {
            if (err) {
                throw err;
            }
            return resolve(data.toString());
        });
    })
}

// convert string into array by new line delimiter
// take note logs file from linux/mac it should be '\n', while log file from windows can be '\r'
function convertStringToLines(string) {
    return string.split("\n");
}

// filter only those lines with "ERROR:" keyword
function filterLinesWithError(linesArray) {
    return linesArray.filter((line) => {
        return line.includes('ERROR:');
    });
}

// extract error ID from every single line by using regex
function extractErrorId(lines) {
    return lines.map((line) => {
        const rx = /.*\[(.*)\]\sERROR/g;
        const arr = rx.exec(line);
        return arr[1];
    });
}

// scan through lines, generate a required report by a errorIds.
function generateReport(errorIds, lines) {
    // handle each errorId 1 by 1
    errorIds.forEach((errorId) => {

        // search all lines and see which line is from the same errorId
        let linesUnderErrorId = lines.filter((line) => {
            return line.includes(errorId);
        });

        // only takes the last 3 lines + the ERROR detected line
        linesUnderErrorId = linesUnderErrorId.slice(-4);

        // prepare the last line, to append string to it later.
        const lastLine = linesUnderErrorId[linesUnderErrorId.length - 1];

        // base on the total error lines, to append different string
        if (linesUnderErrorId.length <= 3) {
            linesUnderErrorId[linesUnderErrorId.length - 1] = lastLine + ' // There are only 2 messages before this error';
        } else {
            linesUnderErrorId[linesUnderErrorId.length - 1] = lastLine + ' -----';
        }

        // print all lines
        linesUnderErrorId.forEach((line) => {
            console.log(line);
        })
    });
}
