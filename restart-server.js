const { exec } = require('child_process');
const ps = require('ps-node');

const PORT = 5001;

// Find and kill the process listening on PORT
ps.lookup({ command: 'node', arguments: `server.js` }, (err, resultList) => {
    if (err) {
        throw new Error(err);
    }

    resultList.forEach((process) => {
        if (process) {
            console.log('Killing process:', process);
            exec(`kill -9 ${process.pid}`, (err) => {
                if (err) {
                    console.error(`Error killing process ${process.pid}:`, err);
                } else {
                    console.log(`Successfully killed process ${process.pid}`);
                }
            });
        }
    });

    // Start the server
    console.log('Starting server...');
    exec('node server.js', (err, stdout, stderr) => {
        if (err) {
            console.error('Error starting server:', err);
        } else {
            console.log(stdout);
            console.error(stderr);
        }
    });
});