let isRecording = false;
let mediaRecorder;
let recordedChunks = [];

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

    const stream = await new Promise((resolve, reject) => {
      chrome.tabCapture.capture(
        {
          audio: true,
          video: false,
        },
        (stream) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(stream);
          }
        }
      );
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleRecording') {
    isRecording = !isRecording;
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    sendResponse({ isRecording });
  }
});

