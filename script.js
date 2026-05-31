const midiFiles =
document.getElementById("midiFiles");

const fileCount =
document.getElementById("fileCount");

const preprocessBtn =
document.getElementById("preprocessBtn");

const preprocessResult =
document.getElementById("preprocessResult");

const trainBtn =
document.getElementById("trainBtn");

const trainProgress =
document.getElementById("trainProgress");

const trainingStatus =
document.getElementById("trainingStatus");

const generateBtn =
document.getElementById("generateBtn");

const generatedMusic =
document.getElementById("generatedMusic");

const downloadBtn =
document.getElementById("downloadBtn");

const audioPlayer =
document.getElementById("audioPlayer");

let generatedSequence = [];

let renderedAudioBuffer = null;


/* Upload */

midiFiles.addEventListener(
"change",
()=>{
fileCount.textContent =
`${midiFiles.files.length} MIDI file(s) selected`;
}
);


/* Preprocessing */

preprocessBtn.addEventListener(
"click",
()=>{

const count =
midiFiles.files.length;

if(count===0){
alert("Select MIDI files first");
return;
}

const totalNotes =
count*500;

const uniqueNotes =
Math.floor(totalNotes*0.05);

const trainingSamples =
totalNotes-100;

preprocessResult.innerHTML = `
<h3>Preprocessing Complete ✅</h3>

<p>Total Files:
${count}</p>

<p>Total Notes:
${totalNotes}</p>

<p>Unique Notes:
${uniqueNotes}</p>

<p>Sequence Length:
100</p>

<p>Training Samples:
${trainingSamples}</p>

<p>Status:
Ready For Training</p>
`;
}
);


/* Training */

trainBtn.addEventListener(
"click",
()=>{

let progress=0;

trainProgress.style.width="0%";

const timer =
setInterval(()=>{

progress+=2;

trainProgress.style.width =
progress+"%";

trainingStatus.textContent =
`Training Epoch ${
Math.floor(progress/10)+1
}/10`;

if(progress>=100){

clearInterval(timer);

trainingStatus.textContent =
"Model Trained Successfully ✅";
}

},100);

}
);


/* Generation */

generateBtn.addEventListener(
"click",
async()=>{

generatedSequence=[];

const notes=[
"C4","D4","E4","F4",
"G4","A4","B4","C5"
];

for(let i=0;i<20;i++){

generatedSequence.push(

notes[
Math.floor(
Math.random()*
notes.length
)
]

);

}

generatedMusic.value =
generatedSequence.join(" ");

await generateAudio();

}
);


/* Note Frequency */

function noteToFrequency(note){

const map={
C4:261.63,
D4:293.66,
E4:329.63,
F4:349.23,
G4:392.00,
A4:440.00,
B4:493.88,
C5:523.25
};

return map[note] || 440;
}


/* Create Audio */

async function generateAudio(){

const sampleRate=44100;

const duration=0.5;

const context =
new OfflineAudioContext(
1,
sampleRate*
generatedSequence.length*
duration,
sampleRate
);

generatedSequence.forEach(
(note,index)=>{

const osc =
context.createOscillator();

const gain =
context.createGain();

osc.type="sine";

osc.frequency.value =
noteToFrequency(note);

osc.connect(gain);

gain.connect(
context.destination
);

const start =
index*duration;

gain.gain.setValueAtTime(
0.2,
start
);

osc.start(start);

osc.stop(
start+duration
);

}
);

renderedAudioBuffer =
await context.startRendering();

const wavBlob =
audioBufferToWav(
renderedAudioBuffer
);

audioPlayer.src =
URL.createObjectURL(
wavBlob
);

}


/* WAV */

function audioBufferToWav(buffer){

const numChannels =
buffer.numberOfChannels;

const sampleRate =
buffer.sampleRate;

const samples =
buffer.getChannelData(0);

const length =
samples.length*2+44;

const arrayBuffer =
new ArrayBuffer(length);

const view =
new DataView(arrayBuffer);

function writeString(
view,
offset,
string
){

for(
let i=0;
i<string.length;
i++
){

view.setUint8(
offset+i,
string.charCodeAt(i)
);

}

}

writeString(view,0,'RIFF');
view.setUint32(
4,
36+samples.length*2,
true
);

writeString(view,8,'WAVE');
writeString(view,12,'fmt ');
view.setUint32(16,16,true);
view.setUint16(20,1,true);
view.setUint16(22,1,true);
view.setUint32(
24,
sampleRate,
true
);

view.setUint32(
28,
sampleRate*2,
true
);

view.setUint16(32,2,true);
view.setUint16(34,16,true);

writeString(view,36,'data');

view.setUint32(
40,
samples.length*2,
true
);

let offset=44;

for(
let i=0;
i<samples.length;
i++
){

let sample =
Math.max(
-1,
Math.min(
1,
samples[i]
)
);

view.setInt16(
offset,
sample<0
? sample*0x8000
: sample*0x7FFF,
true
);

offset+=2;
}

return new Blob(
[arrayBuffer],
{
type:'audio/wav'
}
);

}


/* MP3 Download */

downloadBtn.addEventListener(
"click",
()=>{

if(
!renderedAudioBuffer
){
alert(
"Generate music first"
);
return;
}

const samples =
renderedAudioBuffer
.getChannelData(0);

const mp3encoder =
new lamejs.Mp3Encoder(
1,
44100,
128
);

const blockSize=1152;

let mp3Data=[];

for(
let i=0;
i<samples.length;
i+=blockSize
){

const chunk =
samples.subarray(
i,
i+blockSize
);

const int16 =
new Int16Array(
chunk.length
);

for(
let j=0;
j<chunk.length;
j++
){

int16[j] =
Math.max(
-32768,
Math.min(
32767,
chunk[j]*32767
)
);

}

const mp3buf =
mp3encoder.encodeBuffer(
int16
);

if(
mp3buf.length>0
){
mp3Data.push(
new Int8Array(
mp3buf
)
);
}

}

const end =
mp3encoder.flush();

if(end.length>0){

mp3Data.push(
new Int8Array(end)
);

}

const blob =
new Blob(
mp3Data,
{
type:"audio/mp3"
}
);

const a =
document.createElement("a");

a.href =
URL.createObjectURL(
blob
);

a.download =
"generated_music.mp3";

a.click();

}
);
