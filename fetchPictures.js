const rp = require('request-promise')

async function fetchRawImgStr() {
    const rawData = await rp({
        url: 'http://bouvet.guru/rekrytering_flera.php',
        method: 'GET'
    })
    return rawData.split('Data: <URL kommentar>\n')[1].trim().split('\n')
}

function splitUrlAndComment (imgStr) {
    const url = imgStr.trim().split(" ")[0]
    const comment = imgStr.trim().replace(`${url}`, "").trim()
    return {url, comment}
}

function combineHtmlString({url, comment}) {
    if (url ==='') return ''
    else if (comment === 'Ingen bild' || comment === 'Ogiltig adress') 
        return `<div class="card">
                    <div class="card-body"><div aria-live="polite" role="alert" class="alert alert-danger">${comment}</div> 
                    </div>                   
                </div>` 
    else 
        return `<div class="card">
                    <div class="card-body"><img src="${url}" alt="${comment}"></div>
                    <div class="card-body"><h4 class="card-title">${comment}</h4></div>                   
                </div>`

}

async function displayPictures(req, res) {
    const rawData = await fetchRawImgStr()
    const imgUrlCommentObjs = await rawData.map(splitUrlAndComment)
    const htmlString = await imgUrlCommentObjs.map(combineHtmlString).join('')
    let alert=['alert-success', 'Data is loaded']    
    if (htmlString==='') {alert=['alert-info', 'No data found on original page']}

    return res.send(`
    <html>
    <head>
      <meta charset=utf-8>
      <title>Pictures monitor</title>
      <meta http-equiv="refresh" content="30">
      <link rel="stylesheet" href="/app/kth-style/css/kth-bootstrap.css">
      <link rel="stylesheet" href="/app/local-style/style.css">
      <body>
        <div class="col-6">
            <div class="col">
                <h1>Look at pictures </h1>
                <div class="card">
                    <div class="card-body" id="status">
                        <p>Shortly about me: Elena Rakhimova </p>
                        <div aria-live="polite" role="alert" class="alert " id="alert">
                        </div>
                    </div>
                    <div class="text-right card-footer">
                        <a class="btn btn-secondary custom" href="/app/pictures">Refresh</a>
                        <a class="btn btn-danger custom" href="/app/avbryt">Avbryt</a>
                    </div>
                </div>
            </div>

            <div class="col">
                ${htmlString}
            </div>
        </div>

        <script>
            document.addEventListener('readystatechange', () => {
                switch (document.readyState) {
                    case "loading":
                        var div = document.createElement("div");
                        div.id = "progress"
                        div.className = "progress" 
                        div.innerHTML = '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>'
                        document.getElementById("status").appendChild(div);
                        break;
                    case "interactive":
                        var div = document.createElement("div");
                        div.id = "progress"
                        div.className = "progress" 
                        div.innerHTML = '<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>'                    
                        document.getElementById("status").appendChild(div);
                        break;
                    case "complete":
                        document.getElementById("progress").innerHTML = '<div class="progress-bar" role="progressbar bg-success" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>' 
                        var alert = document.getElementById("alert")
                        alert.className = "${alert[0]}"
                        alert.innerHTML="${alert[1]}"
                        break;
              }
            });
        </script>
`)
}

module.exports = { displayPictures }