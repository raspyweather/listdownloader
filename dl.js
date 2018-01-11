const fs = require('fs');
const download = require('download');
const process = require('process');
const jsonfile = require('jsonfile');
const path = require('path');
const promisify = require('util').promisify;
const jsonRead = promisify(jsonfile.readFile);
const fsaccess = promisify(fs.access);
const readline = require('readline');
let files = [];
let dirName;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.write("hi");
rl.prompt();
rl.question("enter the json file to download:", (line) => {
    fsaccess(line, fs.constants.F_OK).then(obj => {
        process.stdout.write("Starting download");
        jsonRead(line)
            .then(obj => {
                console.log("file read");
                dirname = path.basename(line, path.extname(line));
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname);
                }
                files = obj;
                idx = 0;
                for (let i = 0; i < 6; i++)
                    downloadFile();
            })
            .catch(err => console.log("err", err));
    }).catch(err => { process.stdout.write(`File ${line} does not exist`, err); process.exit(1); });
});

let tasks = [];
function downloadFile() {
    if (idx < files.length) {
        let file = files[idx++];
        console.log("dl", file);
        tasks.push(file);
        download(file, dirname)
            .then(x => console.log(`${idx} downloaded: ${file}`))
            .then(x=>tasks=tasks.filter(y=>y!=file))
            .then(x => downloadFile())
            .catch(err => console.error(file,err));
    }
    else {
        console.write("index fail");
    }
}



