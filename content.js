let mediaRecorder;
let recordedChunks = [];

const contentScriptAvailable = true;


const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
};

const startRecording = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
      console.error('No active tab found');
      return;
    }

    const desktopStreamId = await new Promise((resolve) => {
      chrome.desktopCapture.chooseDesktopMedia(
        ['audio'],
        (streamId) => resolve(streamId)
      );
    });

    if (!desktopStreamId) {
      console.error('User canceleddesktop capture');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: desktopStreamId,
        },
      },
    });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log('Recording started');
  } catch (error) {
    console.error('Error starting recording:', error.message);
  }
};

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log('Recording stopped');
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      chrome.runtime.sendMessage({ action: 'saveAudio', audioUrl: url });
  
      // Clear recordedChunks for future recordings
      recordedChunks = [];
    }
  };
  
  const port = chrome.runtime.connect({ name: 'content-script' });
  port.postMessage({ action: 'contentScriptAvailable' });

  port.onMessage.addListener((request) => {
    if (request.action === 'startRecording') {
      startRecording(request.audioSource);
    } else if (request.action === 'stopRecording') {
      stopRecording();
    }
  });
  
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'content-script') {
      port.onMessage.addListener((request) => {
        if (request.action === 'contentScriptAvailable') {
          isContentScriptAvailable = true;
        }
      });
    }
  });