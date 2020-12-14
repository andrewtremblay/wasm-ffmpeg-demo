import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';

function App() {
  const [fileURL, setFileURL] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const onChangeFile = (e) => {
    let files = e.target.files;
    if (files.length === 1) {
      let file = files[0];
      setFileURL(URL.createObjectURL(file));
      setFileObj(file);
    }
  }

  const [imgSrc, setImgSrc] = useState('');
  const [message, setMessage] = useState('Click Start to transcode');
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const doTranscode = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Starting transcoding');
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(fileObj));
    await ffmpeg.run('-i', 'test.mp4', 'test.gif');
    setMessage('Completing transcoding');
    const data = ffmpeg.FS('readFile', 'test.gif');
    setImgSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' })));
  };

  return (
    <div className="App">
      <input id="myInput"
        type="file"
        accept="video/mp4" 
        multiple={false}
        onChange={onChangeFile}
      />
      <p/>
      <p>input video:</p>
      {fileURL && <video src={fileURL} controls></video>}<br/><br/>
      <button onClick={doTranscode}>Gif-ify</button>
      <p>{message}</p>
      <p>output gif:</p>
      <img src={imgSrc} /><br/>
    </div>
  );
}

export default App;
