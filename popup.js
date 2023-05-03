document.addEventListener('DOMContentLoaded', () => {
  const startRecordingButton = document.getElementById('startRecording');
  const stopRecordingButton = document.getElementById('stopRecording');

  if (startRecordingButton && stopRecordingButton) {
    startRecordingButton.addEventListener('click', () => {
      console.log('Start button clicked');
      chrome.runtime.sendMessage({ action: 'toggleRecording' }, (response) => {
        if (response.isRecording) {
          startRecordingButton.disabled = true;
          stopRecordingButton.disabled = false;
        }
      });
    });

    stopRecordingButton.addEventListener('click', () => {
      console.log('Stop button clicked');
      chrome.runtime.sendMessage({ action: 'toggleRecording' }, (response) => {
        if (!response.isRecording) {
          startRecordingButton.disabled = false;
          stopRecordingButton.disabled = true;
        }
      });
    });
  } else {
    console.error('Error: startRecording and/or stopRecording buttons not found');
  }
});