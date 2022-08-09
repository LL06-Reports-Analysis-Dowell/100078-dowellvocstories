var mFile = "";
var filename = "";
var brandName = "";
var productName = "";
var selected = null;
var username = "";
var userEmail = "";
var friendName = "";
var friendEmail = "";

$(document).ready(function () {
  $(".mImg").click(function (event) {
    event.preventDefault();
    $("#selectFile").click();
  });
});

function fileSelected(fPath) {
  console.log(fPath);
  if (fPath.length == 0) {
    mFile = "";
    $(".mImg").text("No file selected");
  } else {
    const [file] = selectFile.files;
    if (file) {
      var x = URL.createObjectURL(file);
      console.log(x);
      $(".mImg").attr("src", x);
    }
    // $('.mImg').hide();
  }
}

$(document).ready(function () {
  console.log(document.title);
  console.log(document.URL);

  if (document.getElementById("qrBoxId")) {
    new QRCode(document.getElementById("qrBoxId"), {
      text: "http://localhost:8080/qrcode/qrcode.png?user:ahmed&name:Ali&code:123",
      width: 256,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
});

function PrintToPDF(divSelector) {
  // divSelector = "#divId"
  var divContents = $(divSelector).html();
  var printWindow = window.open("", "", "height=400,width=800");
  printWindow.document.write("<html><head><title>DIV Contents</title>");
  printWindow.document.write("</head><body >");
  printWindow.document.write(divContents);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
}

function exportTableToExcel(tableID, filename = "") {
  // to use the function
  // <button onclick="exportTableToExcel('tableID', 'excelFileName')">Export Table Data To Excel File</button>
  var downloadLink;
  var dataType = "application/vnd.ms-excel";
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

  // Specify file name
  filename = filename ? filename + ".xls" : "excel_data.xls";

  // Create download link element
  downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(["\ufeff", tableHTML], {
      type: dataType,
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = "data:" + dataType + ", " + tableHTML;

    downloadLink.download = filename;

    downloadLink.click();
  }
}

function exportDataToCSV(data, fileName = "dataFile") {
  let csvContent = "data:text/csv;charset=utf-8,";

  data.forEach(function (rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  var encodedUri = encodeURI(csvContent);

  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName + ".csv");
  document.body.appendChild(link);

  link.click();

  /*
        // Usage of exportDataToCSV function
        const rows = [
            ["name1", "city1", "some other info"],
            ["name2", "city2", "more info"]
        ];

        exportDataToCSV(rows, "DataFileName");
    */
}

// function to save html as pdf file
// import the jspdf library inside the html file
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js"></script>
// call the function from a button click
// <button class='btb' onclick="saveHTMLAsPDF('root', 'myFile')" >Create PDF</button>

function saveHTMLAsPDF(elementId, fileName) {
  console.log("started");
  let source = $("#" + elementId);
  let doc = new jsPDF();
  doc.addHTML(source, 10, 10, () => doc.save(fileName + ".pdf"));
}

//#region Record Video HTML section
var video,
  reqBtn,
  reqAudiBtn,
  startBtn,
  stopBtn,
  audioStartBtn,
  audioStopBtn,
  ul,
  stream,
  recorder,
  audioRecorder,
  audioPlayer;
let data1 = [];
function recordVideoInit() {
  video = document.getElementById("video");
  reqBtn = document.getElementById("request");
  if (reqBtn) {
    reqBtn.innerHTML = `<i class="material-icons">camera</i>
            Enable`;
  }

  reqAudiBtn = document.getElementById("requestAudio");
  if (reqAudiBtn) {
    reqAudiBtn.innerHTML = `<i class="material-icons">mic</i>
            Enable`;
  }
  startBtn = document.getElementById("start");
  stopBtn = document.getElementById("stop");
  audioStartBtn = document.getElementById("audioStart");
  audioStopBtn = document.getElementById("audioStop");
  audioPlayer = document.getElementById("audioPlayer");
  saveBtn = document.getElementById("save");

  saveBtn.onclick = saveVideoOrAudio;

  ul = document.getElementById("ul");

  if (reqBtn) {
    reqBtn.onclick = requestVideo;
  }

  if (reqAudiBtn) {
    reqAudiBtn.onclick = requestAudio;
  }
  if (startBtn) {
    startBtn.onclick = startRecording;
  }
  if (stopBtn) {
    stopBtn.onclick = stopRecording;
  }
  if (audioStartBtn) {
    audioStartBtn.onclick = startAudioRecording;
  }
  if (audioStopBtn) {
    audioStopBtn.onclick = stopAudioRecording;
  }
  if (ul) {
    ul.style.display = "none";
  }
  if (stopBtn) {
    stopBtn.disabled = true;
  }
  if (audioStopBtn) {
    audioStopBtn.disabled = true;
  }
}

function requestVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stm) => {
      if (reqBtn) {
        reqBtn.innerHTML = `<i class="material-icons" style="color: red;">camera</i>
                    Disable`;
        reqBtn.onclick = releaseVideo;
      }
      $("#videoDiv").removeAttr("hidden");
      stream = stm;
      startBtn.removeAttribute("disabled");
      audioStartBtn.removeAttribute("disabled");
      video.muted = true;
      video.srcObject = stm;
    })
    .catch((e) => console.error(e));
}
function requestAudio() {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stm) => {
      reqAudiBtn.innerHTML = `<i class="material-icons" style="color: red;">mic</i>
                    Disable`;
      reqAudiBtn.onclick = releaseVideo;
      $("#audioDiv").show();
      stream = stm;
    })
    .catch((e) => console.error(e));
}

function releaseVideo() {
  if (stream) {
    stream.getTracks().forEach(function (track) {
      if (track.readyState == "live") {
        track.stop();
      }
    });
  }

  reqBtn.innerHTML = `<i class="material-icons">camera</i>
    <div>Enable</div>`;
  reqAudiBtn.innerHTML = `<i class="material-icons">mic</i>
    <div>Enable</div>`;
  $("#videoDiv").attr("hidden", "true");
  $("#audioDiv").hide();
  reqBtn.onclick = requestVideo;
  reqAudiBtn.onclick = requestAudio;
}

function startRecording() {
  data1 = [];
  recorder = new MediaRecorder(stream);
  recorder.start();
  stopBtn.removeAttribute("disabled");
  startBtn.disabled = true;
}
function startAudioRecording() {
  data1 = [];
  recorder = new MediaRecorder(stream);
  recorder.start();
  audioStopBtn.removeAttribute("disabled");
  audioStopBtn.disabled = false;
  audioStartBtn.disabled = true;
}
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function saveVideoOrAudio() {
  let fd = new FormData();
  const blob = new Blob(data1, { type: "video/webm; codecs=webm" });
  const myFile = new File([blob], "video.mp4", { type: "video/mp4" });
  fd.append("file", myFile);
  const requestOptions = {
    method: "POST",
    dataType: "json",
    processData: false,
    contentType: false,
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    body: fd,
  };
  if (data1.length !== 0) {
    data1 = [];
    fetch("http://127.0.0.1:8000/sample", requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error("Something Went Wrong");
        // showStories.classList.remove("hidden");
        // showMessage.classList.add("hidden");
        // showSaveBtn.classList.add("hidden");
        return response.json();
      })
      .then((data) => {
        //window.location.assign(data["success"]);
        console.log(data["success"]);
      })
      .catch((err) => console.log(err.message));
  }
}

function stopRecording() {
  let x;
  recorder.ondataavailable = (e) => {
    data1.push(e.data);
    x = URL.createObjectURL(e.data);
    video.srcObject = null;
    video.src = x;
    video.muted = false;
  };
  recorder.stop();
  startBtn.removeAttribute("disabled");
  stopBtn.disabled = true;
}
function stopAudioRecording() {
  let x;
  recorder.ondataavailable = (e) => {
    data1.push(e.data);
    x = URL.createObjectURL(e.data);
    audioPlayer.src = x;
    audioPlayer.play();
    ul.style.display = "block";
  };
  recorder.stop();
  audioStartBtn.removeAttribute("disabled");
  audioStopBtn.disabled = true;
}

//#endregion
