const { desktopCapturer } = require('electron')

desktopCapturer.getSources({ types: ['screen'] })
  .then(sources =>  {
    console.log(sources)
      
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sources[0].id,
          minWidth: 100,
          maxWidth: 2000,
          minHeight: 100,
          maxHeight: 2000
        }
      }
    })
    .then(stream => {
      console.log(stream)

      const video = document.getElementById('video')
      console.log(video)
      video.srcObject = stream
      video.onloadedmetadata  = (e) => video.play()
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))