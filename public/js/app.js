const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this app
        {
            audio: true,
            video: false
        },
      )
        // Success callback
        .then((stream) => {
            let chunks = [];
            stopButton.disabled = true;
            const mediaRecorder = new MediaRecorder(stream);
            recordButton.onclick = () => {
                mediaRecorder.start();
                stopButton.disabled = false;
                recordButton.disabled = true;
            }
            stopButton.onclick = () => {
                mediaRecorder.stop();
                stopButton.disabled = true;
                recordButton.disabled = false;
            }
            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            }
            mediaRecorder.onstop = () => {
                const li = window.document.createElement("li");
                li.classList.add("flex-center")
                const audio = window.document.createElement("audio");
                const choose = window.document.createElement("button");
                choose.innerHTML = `✔`;
                const trash = window.document.createElement("button");
                trash.innerHTML = `❌`;
                trash.onclick = () => {
                    li.remove();
                }
                const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
                chunks = [];
                const blobURL = window.URL.createObjectURL(blob)
                audio.controls = true;
                audio.src = blobURL;
                li.appendChild(audio);
                li.appendChild(choose);
                li.appendChild(trash);
                document.getElementById("takes").appendChild(li);
            }
      })
  
      // Error callback
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
  
const prompts = new Map();
prompts.set('Greetings', ["Hello!", "Buon giorno!", "Bom dia!"]);
prompts.set('Exclamations', ["Wow!", "HA!", "Oh no!"]);
const refresh = document.getElementById('refresh');
const categories = document.getElementById("categories");
for (category of [...prompts.keys()]) {
    const opt = document.createElement("option");
    opt.value = category;
    opt.innerHTML = category;
    categories.appendChild(opt);
}
refresh.onclick = categories.onchange = (e) => {
    const choices = prompts.get(categories.value);
    const index = Math.floor((choices.length) * Math.random())
    console.log(index);
    document.getElementById("prompt").innerHTML = choices[index]
}