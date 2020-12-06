var currentLevel = -1;

function clearDivs() {
  var x = document.getElementById("bookInfoContainer");
  while (x.hasChildNodes()) {
    x.removeChild(x.lastChild);
  }
  document.getElementById("videoContainer").innerHTML = "";
  document.getElementById("infoDiv").innerHTML = "";
}

function createMenu(root, level, selectedVal) {
  if (level <= currentLevel) {
    var list = document.getElementById("level_" + level);
    if (list) {
      list.parentNode.removeChild(list);
    }
    currentLevel = level;
  } else {
    ++currentLevel;
  }

  if (root.options) {
    //as long as options are there in the data, do this..

    var div = document.createElement("div");
    div.setAttribute("id", "level_" + level);

    var sel = document.createElement("select");
    sel.setAttribute("class", "form-control");
    var attr = Object();
    attr["value"] = "_blank";
    var op = document.createElement("option");
    var textNode = document.createTextNode(" Please select ");
    op.appendChild(textNode);
    for (key in attr) {
      op.setAttribute(key, attr[key]);
    }
    sel.appendChild(op);

    for (key in root.options) {
      var attr = Object();
      attr["value"] = key;
      if (selectedVal && selectedVal == key) {
        attr["selected"] = "selected";
      }
      sel.appendChild(createOption(key, attr));
    }

    sel.onchange = function () {
      if (this.value != "_blank") {
        clearDivs(); //clear the book details and video in two other divs on change of options

        createMenu(root.options[this.value], level + 1); //recursively call createMenu to create selects

        if (level === 0) {
        }
      } else {
        checkLevel(level + 1);
        currentLevel--;
      }
    };

    div.appendChild(sel); //add select menu to the new div

    if (level == 0) {
      document.getElementById("selectContainer").appendChild(div);
    } else {
      document.getElementById("level_" + (level - 1)).appendChild(div);
    }
  } else {
  }

  if (root.options === null) {
    //if the end of data chain is reached, do this..
    var x = document.getElementsByTagName("select");
    var opVals = "";
    for (var i = 0; i < x.length; i++) {
      //get values from all the selected options to show final selection

      if (
        BrowserDetect.browser === "Mozilla" ||
        BrowserDetect.browser === "Explorer"
      ) {
        //because selectedOptions doesn't work with IE
      } else {
        opVals += x[i].selectedOptions[0].innerHTML + " > ";
      }
    }

    var infoDiv = document.getElementById("infoDiv");
    var displayPath = document.createElement("p");
    displayPath.setAttribute("id", "path");
    displayPath.innerHTML = "You have selected " + opVals;
    infoDiv.appendChild(displayPath);

    doAjaxCall(root.goodread); //use the goodread API URL to fetch the data
    getYouTube(root.youtube); // use the youtube URL to fetch the embed video
    moveForm();
  }
}
/* ---
 Start of AJAX Call to GoodReads API
 */

var http = new XMLHttpRequest();

function doAjaxCall(url) {
  var lambdaUrl = "/.netlify/functions/proxy";
  var isWorking = false;
  if (!isWorking) {
    http.open("GET", lambdaUrl, true);
    http.setRequestHeader("Target-URL", url);
    http.onreadystatechange = handleHttpResponse;
    isWorking = true;
    http.send(null);
  }
}

function handleHttpResponse() {
  if (http.readyState === 4) {
    if (http.status === 200) {
      var xmlDocument = http.responseXML;
      var bookTitle = xmlDocument.getElementsByTagName("original_title")[0]
        .textContent;
      var bookAuthor = xmlDocument.getElementsByTagName("name")[0].textContent;
      var averageRating = xmlDocument.getElementsByTagName("average_rating")[0]
        .textContent;
      var bookImageURL = xmlDocument.getElementsByTagName("image_url")[0]
        .textContent;
      var publicationYear = xmlDocument.getElementsByTagName(
        "original_publication_year"
      )[0].textContent;
      var description = xmlDocument.getElementsByTagName("description")[0]
        .textContent;
      var link = xmlDocument.getElementsByTagName("link")[0].textContent;

      console.log(xmlDocument);

      var bookDiv = document.getElementById("bookInfoContainer");
      var displayTitle = document.createElement("h1");
      displayTitle.setAttribute("id", "bookTitle");
      displayTitle.innerHTML = bookTitle;
      bookDiv.appendChild(displayTitle);

      var displayAuthor = document.createElement("span");
      displayAuthor.setAttribute("id", "bookAuthor");
      displayAuthor.innerHTML = "Author: " + bookAuthor + "<br/>";
      bookDiv.appendChild(displayAuthor);

      var displayYear = document.createElement("span");
      displayYear.setAttribute("id", "bookYear");
      displayYear.innerHTML = "Publication Year: " + publicationYear + "<br/>";
      bookDiv.appendChild(displayYear);

      var displayRating = document.createElement("span");
      displayRating.setAttribute("id", "bookRating");
      displayRating.innerHTML =
        "Average rating on Goodreads: " + averageRating + "<br/>";
      bookDiv.appendChild(displayRating);

      var displayCoverDiv = document.createElement("div");
      displayCoverDiv.setAttribute("id", "bookImage");
      displayCoverDiv.addEventListener("mousedown", zoomImage);
      displayCoverDiv.addEventListener("mouseup", stopZoom);
      var displayCover = document.createElement("img");
      displayCover.setAttribute("src", bookImageURL);
      displayCoverDiv.appendChild(displayCover);
      bookDiv.appendChild(displayCoverDiv);

      var displayDesc = document.createElement("p");
      displayDesc.setAttribute("id", "bookDescription");
      displayDesc.innerHTML = description;
      bookDiv.appendChild(displayDesc);

      var displayLink = document.createElement("a");
      displayLink.setAttribute("id", "bookLink");
      displayLink.setAttribute("href", link);
      displayLink.innerHTML = "Read more on Goodreads ";
      bookDiv.appendChild(displayLink);

      isWorking = false;
    }
  }
}

function getYouTube(url) {
  if (url) {
    var videoTitle = document.createElement("h4");
    videoTitle.setAttribute("id", "videoTitle");
    videoTitle.innerHTML =
      "There is a movie based on this novel you might be interested in";
    document.getElementById("videoContainer").appendChild(videoTitle);
    var frame = document.createElement("iframe");
    frame.width = 500;
    frame.height = 300;
    frame.setAttribute("src", url);
    document.getElementById("videoContainer").appendChild(frame);
  } else {
    var videoTitle = document.createElement("h4");
    videoTitle.setAttribute("id", "videoTitle");
    videoTitle.innerHTML = "There is no video associated with this title";
    document.getElementById("videoContainer").appendChild(videoTitle);
  }
}

function moveForm() {
  var x = document.getElementById("contactForm");
  var left = x.style.left;
  var z = parseInt(x);
  console.log(left);
  //while(z !== 0){
  //    moveForm();
  //    z++;
  //}
  //document.getElementById("contact-form").style.left = z+'px';
}

function createOption(text, attr) {
  var op = document.createElement("option");
  var textNode = document.createTextNode(text);
  op.appendChild(textNode);
  for (key in attr) {
    op.setAttribute(key, attr[key]);
  }
  return op;
}

function checkLevel(level) {
  if (level <= currentLevel) {
    var list = document.getElementById("level_" + level);
    if (list) {
      list.parentNode.removeChild(list);
    }
    currentLevel = level;
  } else {
    ++currentLevel;
  }
}

function validateForm() {
  clearStuff();
  var errorMsg = "";

  var name = document.getElementById("name").value;

  document.getElementById("name").style.backgroundColor = "";
  document.getElementById("email").style.backgroundColor = "";

  if (!name || name == "") {
    errorMsg += "Please enter your name<br/>";
    document.getElementById("name").style.backgroundColor = "#FFBABA";
  } else {
    if (name.match(/^[a-zA-Z ]{2,30}$/)) {
      setStorage("name", document.getElementById("name").value);
      console.log("First Name Valid");
    } else {
      errorMsg += "Please enter the name correctly.<br/>";
    }
  }

  var email = document.getElementById("email").value;
  if (!email || email == "") {
    errorMsg += "Please enter your email<br/>";
    document.getElementById("email").style.backgroundColor = "#FFBABA";
  } else {
    if (email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      setStorage("email", document.getElementById("email").value);
      console.log("email valid");
    } else {
      errorMsg += "Please enter your email in a valid format.<br/>";
    }
  }

  var message = document.getElementById("message").value;
  if (!message || message == "") {
    errorMsg += "Please enter your comments<br/>";
    document.getElementById("message").style.backgroundColor = "#FFBABA";
  } else {
    setStorage("comment", document.getElementById("message").value);
  }

  if (errorMsg.length) {
    var items = document.getElementsByClassName("error-msg");
    var i, len;

    for (i = 0, len = items.length; i < len; i++) {
      items[i].style.display = "";
      items[i].innerHTML = errorMsg;
    }

    return false;
  }
  return true;
}

function clearStuff() {
  var items = document.getElementsByClassName("error-msg");
  var i, len;

  for (i = 0, len = items.length; i < len; i++) {
    items[i].style.display = "none";
    items[i].innerHTML = "";
  }
}

function updateForm() {
  if (getStorage("name")) {
    document.getElementById("name").value = getStorage("name");
  }
  if (getStorage("email")) {
    document.getElementById("email").value = getStorage("email");
  }
}

function setStorage(key, value) {
  if (window.localStorage) {
    localStorage.setItem(key, value);
  } else {
    SetCookie(key, value.toString(), ExpDate(100));
  }
}

function getStorage(key) {
  if (window.localStorage) {
    return localStorage.getItem(key);
  } else {
    return GetCookie(key);
  }
}

function SetCookie(key, val, exDate) {
  document.cookie = key + "=" + val + ";" + exDate;
}

function GetCookie(key) {
  var x = document.cookie.split(";");
  for (var i = 0; i < x.length; i++) {
    var c = x[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(key) == 0) {
      return c.substring(key.length + 1, c.length + 1);
    }
  }
}

function ExpDate(days) {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}

var growId = null;

function zoomImage() {
  var w = document.getElementById("bookImage").style.width;
  var h = document.getElementById("bookImage").style.height;
  var wi = parseInt(w);
  var he = parseInt(h);
  wi += 5;
  he += 5;
  document.getElementById("square").style.width = wi + "px";
  document.getElementById("square").style.height = he + "px";
  growId = setTimeout(zoomImage, 40);
}

function stopZoom() {
  clearTimeout(growId);
}
