const midiFiles = document.getElementById("midiFiles");
const fileCount = document.getElementById("fileCount");

const preprocessBtn = document.getElementById("preprocessBtn");
const preprocessResult = document.getElementById("preprocessResult");

const trainBtn = document.getElementById("trainBtn");
const trainProgress = document.getElementById("trainProgress");
const trainingStatus = document.getElementById("trainingStatus");

const generateBtn = document.getElementById("generateBtn");
const generatedMusic = document.getElementById("generatedMusic");

const downloadBtn = document.getElementById("downloadBtn");

let generatedSequence = "";

// File Upload
midiFiles.addEventListener("change", () => {
    fileCount.textContent =
        `${midiFiles.files.length} MIDI files selected`;
});

// Preprocessing Simulation
preprocessBtn.addEventListener("click", () => {
    preprocessResult.innerHTML =
        "Extracting note sequences...<br>Encoding notes...<br>Done!";
});

// Training Simulation
trainBtn.addEventListener("click", () => {

    let progress = 0;
    trainingStatus.textContent = "Training started...";

    const interval = setInterval(() => {
        progress += 5;
        trainProgress.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);
            trainingStatus.textContent =
                "Model trained successfully!";
        }
    }, 200);
});

// Music Generation Simulation
generateBtn.addEventListener("click", () => {

    const notes = [
        "C4","D4","E4","F4","G4",
        "A4","B4","C5"
    ];

    generatedSequence = "";

    for(let i=0;i<30;i++){
        const random =
            notes[Math.floor(Math.random()*notes.length)];

        generatedSequence += random + " ";
    }

    generatedMusic.value = generatedSequence;
});

// MIDI Download Simulation
downloadBtn.addEventListener("click", () => {

    if(!generatedSequence){
        alert("Generate music first!");
        return;
    }

    const blob = new Blob(
        [generatedSequence],
        { type: "text/plain" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_music.txt";
    link.click();
});
