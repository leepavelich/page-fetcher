const request = require('request');
const fs = require('fs');
const readline = require('readline');

const args = process.argv.slice(2);

if (args.length > 2) {
  console.log('Too many arguments');
  return;
}

if (args.length < 2) {
  console.log('Too few arguments');
  return;
}

const url = args[0];
const localPath = args[1];

fs.access(localPath, fs.F_OK, (err) => {
  if (err) {
    pullRequest(url)
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('File already exists. Do you wish to overwrite? (Y/N) ', answer => {
    if (answer !== 'Y' && answer !== 'y') {
      console.log(answer, typeof answer, answer !== 'Y', answer !== 'y')
      console.log('File not overwritten. Exiting...')
      rl.close()
      return;
    }
    pullRequest(url)
    rl.close()
  })
});
 
const pullRequest = url => {
  request(url, (error, response, body) => {
    if (error) {
      console.log('Error: URL is invalid');
      // console.log(error);
      return;
    }
    if (response.statusCode !== 200) {
      console.log('Error: non-200 status code returned: ', response.statusCode);
      // console.log('statusCode:', response && response.statusCode);
      return;
    }
    const bytes = body.length;
    
    fs.writeFile(localPath, body, err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Downloaded and saved ${bytes} bytes to ${localPath}`);
    });
  })
}