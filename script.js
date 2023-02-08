const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
// nasa api
const apiKey = "DEMO_KEY";
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
let resultsArray = [];
let favorites = {};

function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // add favs to local Storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

function showContent(page) {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

// create dom nodes
function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  console.log("current array", page, currentArray);
  currentArray.forEach((result) => {
    // card container
    const card = document.createElement("div");
    card.classList.add("card");
    // link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View full image";
    link.target = "_blank";
    // image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA picture of the day";
    image.loading = "lazy";
    image.classList.add("card-image-top");
    // card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // cardTitle
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // save text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "remove from favorites";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }
    // card text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    // footer container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    //date
    const date = document.createElement("strong");
    date.textContent = result.date;
    //copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;

    // append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// update DOM
function updateDOM(page) {
  //get fav from local storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}
//get 10 images from the api
async function getNasaPictures() {
  //show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    console.log(error);
    document.querySelector(".loader p").classList.remove("hidden");
  }
}

// add result to favs
function saveFavorite(itemUrl) {
  //loop throught results arr to select fav
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // show conf. msg
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2500);
      // add favs to local Storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

//on load
getNasaPictures();
