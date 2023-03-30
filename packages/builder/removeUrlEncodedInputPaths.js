// this is a workaround for https://github.com/slinkity/slinkity/issues/240
// greets ChatGPT v4


const fs = require('fs');
const path = require('path');

console.log(`[removeUrlEncodedInputPaths.js] -- workaround for https://github.com/slinkity/slinkity/issues/240`)


function replaceAllInstances(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stat.isDirectory()) {
          replaceAllInstances(filePath);
        } else {
          const extension = path.extname(filePath).toLowerCase();
          if (extension === '.html' || extension === '.js') {
            let newName = file.replace(/%2F/g, '_');
            if (newName !== file) {
              const newFilePath = path.join(dirPath, newName);
              fs.rename(filePath, newFilePath, (err) => {
                if (err) {
                  console.error(err);
                  return;
                }
                processFile(newFilePath);
              });
            } else {
              processFile(filePath);
            }
          }
        }
      });
    });
  });
}

function processFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const newData = data.replace(/%2F/g, '_');
    fs.writeFile(filePath, newData, 'utf8', (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
}

// Usage: node app.js directory_path
const dirPath = process.argv[2];
if (!dirPath) {
  console.error('Please provide a directory path.');
  process.exit(1);
}

replaceAllInstances(dirPath);
