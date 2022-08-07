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

var video, reqBtn, startBtn, stopBtn, ul, stream, recorder;
const showMessage = document.querySelector(".stories-message");
const showSaveBtn = document.querySelector("#save");
const showStories = document.querySelector(".stories-success");

let data1 = [];
function recordVideoInit() {
  video = document.getElementById("video");
  reqBtn = document.getElementById("request");
  reqBtn.innerHTML = `<i class="material-icons">camera</i>
    Request Camera`;
  startBtn = document.getElementById("start");
  stopBtn = document.getElementById("stop");
  ul = document.getElementById("ul");
  saveBtn = document.getElementById("save");
  console.log("hi");

  reqBtn.onclick = requestVideo;
  startBtn.onclick = startRecording;
  stopBtn.onclick = stopRecording;
  startBtn.disabled = true;
  ul.style.display = "none";
  stopBtn.disabled = true;
  saveBtn.onclick = saveVideo;
}
function requestVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stm) => {
      reqBtn.innerHTML = `<i class="material-icons" style="color: red;">camera</i>
            Release Camera`;
      reqBtn.onclick = releaseVideo;
      stream = stm;
      startBtn.removeAttribute("disabled");
      video.srcObject = stm;

      //   video.src = URL.createObjectURL(stream);

      //   var binaryData = [];
      //     binaryData.push(stream);
      //     // window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
      //     video.src = URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
    })
    .catch((e) => console.error(e));
}

function releaseVideo() {
  console.log("release");
  location.reload();

  // stream.getTracks().forEach(function(track) {
  //     if (track.readyState == 'live') {
  //         track.stop();
  //     }
  // });
}

function startRecording() {
  //   recorder = new MediaRecorder(stream, {
  //     mimeType: 'video/mp4'
  //   });
  showMessage.classList.add("hidden");
  showSaveBtn.classList.add("hidden");
  data1 = [];
  recorder = new MediaRecorder(stream);
  recorder.start();
  stopBtn.removeAttribute("disabled");
  startBtn.disabled = true;
  showStories.classList.add("hidden");
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

function saveVideo() {
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
    fetch("http://127.0.0.1:8000/brandurl", requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error("Something Went Wrong");
        showStories.classList.remove("hidden");
        showMessage.classList.add("hidden");
        showSaveBtn.classList.add("hidden");
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
  showMessage.classList.remove("hidden");
  showSaveBtn.classList.remove("hidden");
  recorder.ondataavailable = (e) => {
    data1.push(e.data);
    ul.style.display = "block";
    var a = document.createElement("a"),
      li = document.createElement("li");
    a.download = ["video_", (new Date() + "").slice(4, 28), ".webm"].join("");
    a.href = URL.createObjectURL(e.data);
    a.textContent = a.download;
    li.appendChild(a);
    ul.appendChild(li);
    console.log("finish recording");
  };

  recorder.stop();
  startBtn.removeAttribute("disabled");
  stopBtn.disabled = true;
}
