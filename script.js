const midiFiles = document.getElementById("midiFiles");
const fileCount = document.getElementById("fileCount");

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

let generatedSequence = [];

/* Dataset Upload */

midiFiles.addEventListener("change", () => {

    const count = midiFiles.files.length;

    fileCount.textContent =
        `${count} MIDI file(s) selected`;

});


/* Preprocessing */

preprocessBtn.addEventListener("click", () => {

    const count = midiFiles.files.length;

    if(count === 0){
        alert("Please select MIDI files.");
        return;
    }

    const totalNotes =
        count * 500;

    const uniqueNotes =
        Math.floor(totalNotes * 0.05);

    const trainingSamples =
        totalNotes - 100;

    preprocessResult.innerHTML = `
        <h3>Preprocessing Complete ✅</h3>

        <p><strong>Files:</strong> ${count}</p>

        <p><strong>Total Notes:</strong>
        ${totalNotes}</p>

        <p><strong>Unique Notes:</strong>
        ${uniqueNotes}</p>

        <p><strong>Sequence Length:</strong>
        100</p>

        <p><strong>Training Samples:</strong>
        ${trainingSamples}</p>

        <p><strong>Status:</strong>
        Ready for Training</p>
    `;
});


/* Training Simulation */

trainBtn.addEventListener("click", () => {

    let progress = 0;

    trainProgress.style.width = "0%";

    trainingStatus.textContent =
        "Training Started...";

    const interval = setInterval(() => {

        progress += 2;

        trainProgress.style.width =
            progress + "%";

        trainingStatus.textContent =
            `Training Epoch ${Math.floor(progress/10)+1}/10`;

        if(progress >= 100){

            clearInterval(interval);

            trainingStatus.textContent =
                "Model Trained Successfully ✅";
        }

    },100);

});


/* Music Generation */

generateBtn.addEventListener("click", () => {

    const notes = [
        "C4","D4","E4","F4",
        "G4","A4","B4",
        "C5","D5","E5","F5","G5"
    ];

    generatedSequence = [];

    for(let i=0;i<40;i++){

        const randomNote =
            notes[
                Math.floor(
                    Math.random()*notes.length
                )
            ];

        generatedSequence.push(
            randomNote
        );
    }

    generatedMusic.value =
        generatedSequence.join(" ");
});


/* MIDI Export */

downloadBtn.addEventListener(
    "click",
    downloadMidi
);

function downloadMidi(){

    if(generatedSequence.length === 0){

        alert(
          "Generate music first."
        );

        return;
    }

    const midi = new Midi();

    const track =
        midi.addTrack();

    let currentTime = 0;

    generatedSequence.forEach(note => {

        track.addNote({
            name: note,
            time: currentTime,
            duration: 0.5,
            velocity: 0.8
        });

        currentTime += 0.5;

    });

    const bytes =
        midi.toArray();

    const blob = new Blob(
        [bytes],
        {
            type: "audio/midi"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "generated_music.mid";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
