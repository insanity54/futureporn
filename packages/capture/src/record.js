import { join } from 'path';
import { spawn } from 'child_process';
import fs from 'node:fs';

export const getFilename = (appContext, roomName) => {
  const name = `${roomName}_${new Date().toISOString()}.ts`
  return join(appContext.env.FUTUREPORN_WORKDIR, 'recordings', name);
}


export const assertDependencyDirectory = (appContext) => {
  // Extract the directory path from the filename
  const directoryPath = join(appContext.env.FUTUREPORN_WORKDIR, 'recordings');
  console.log(`asserting ${directoryPath} exists`)

  // Check if the directory exists, and create it if it doesn't
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
}

export const record = async (appContext, playlistUrl, roomName) => {
  if (appContext === undefined) throw new Error('appContext undef');
  if (playlistUrl === undefined) throw new Error('playlistUrl undef');
  if (roomName === undefined) throw new Error('roomName undef');

  const filename = getFilename(appContext, roomName);
  console.log(`downloading to ${filename}`)

  // example: `ffmpeg -headers "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0" 
  //                  -i ${chunkPlaylist} 
  //                  -c:v copy 
  //                  -c:a copy 
  //                  -movflags faststart 
  //                  -y 
  //                  -f mpegts 
  //                  ./my-recording.ts`
  const ffmpegProcess = spawn('ffmpeg', [
    '-headers', `"User-Agent: ${appContext.env.DOWNLOADER_UA}"`, 
    '-i', playlistUrl, 
    '-c:v', 'copy',
    '-c:a', 'copy',
    '-movflags', 'faststart',
    '-y',
    '-f', 'mpegts', 
    filename
  ], {
    stdio: 'inherit'
  });



  return new Promise((resolve, reject) => {
    ffmpegProcess.once('exit', (code) => {
      resolve(code)
    })
  })

  // ffmpegProcess.on('data', (data) => {
  //   console.log(data.toString());
  // });


  // Optional: Handle other events such as 'error', 'close', etc.
  // @todo this needs to be handled outside this function
  //       otherwise this function is not testable
  // ffmpegProcess.on('exit', (code, signal) => {
  //   // Retry the download using exponential backoff if the process exits for any reason
  //   console.log(`ffmpeg exited with code ${code} and signal ${signal}`)
  //   retryDownload(appContext, playlistUrl, roomName);
  // });

  // return ffmpegProcess;
}


const calculateExponentialBackoffDelay = (attemptNumber) => {
  return Math.pow(2, attemptNumber) * 1000;
};

const retryDownload = (appContext, playlistUrl, roomName, attemptNumber = 1, maxAttempts = 3) => {
  const delay = calculateExponentialBackoffDelay(attemptNumber);

  appContext.logger.log({ level: 'debug', message: `Retrying download in ${delay / 1000} seconds...` });

  setTimeout(() => {
    console.log('Retrying download...');
    record(appContext, playlistUrl, roomName, attemptNumber + 1);
  }, delay);
};
