const sanitize = require('sanitize-filename');
const inquirer = require('inquirer');
const fs = require('fs');
const yt = require('ytdl-core');
const readline = require('readline');

const onProgress = (chunkLength, downloaded, total) => {
  const percent = downloaded / total;
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
  process.stdout.write(
    `(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(
      total /
      1024 /
      1024
    ).toFixed(2)}MB)`
  );
};

const questions = [
  {
    type: 'input',
    name: 'video_link',
    message: 'Input Youtube link to download video: ',
  },
];

inquirer.prompt(questions).then(async (response) => {
  const URL = response.video_link;
  await yt.getInfo(URL, async (err, info) => {
    let title = sanitize(info.videoDetails.title);
    console.log(title);
    const file = await yt(URL, { format: 'mp3', filter: 'audioonly' })
      .on('progress', onProgress)
      .pipe(fs.createWriteStream(`${__dirname}/downloads/${title}.mp3`));
  });
});
