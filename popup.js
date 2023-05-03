let recordButton = document.getElementById('record');
let stopButton = document.getElementById('stop');
let playButton = document.getElementById('play');
let saveButton = document.getElementById('save');
let transcriptionDiv = document.getElementById('transcription');
let summaryDiv = document.getElementById('summary');

let mediaRecorder;
let chunks = [];

recordButton.addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            console.log(mediaRecorder.state);
        });
});

stopButton.addEventListener('click', function() {
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
});

playButton.addEventListener('click', function() {
    let audio = new Audio();
    let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
    chunks = [];
    let audioURL = URL.createObjectURL(blob);
    audio.src = audioURL;
    audio.controls = true;
    document.body.appendChild(audio);
});

mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
};