import config from "../config/index.js";

function getQueryParamFromURL(query) {
  const params = new URLSearchParams(window.location.search);
  console.log(params.get(query));
  return params.get(query);
}
// const city = getQueryParamFromURL("city");
// console.log("City: ", city);

// Store fetched list of Adventures
async function fetchAdventures(city) {
  try { 
    const res = await fetch(`${config.apiURL}/adventures/?city=${city}`);
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

// const adventures = await fetchAdventures("city");
// console.log("Adventures: ", adventures);

function filterByDuration(duration, itemList) {
  // duration = 0-2 or 2-4
  const splitDuration = duration.split("-");
  const st = parseInt(splitDuration[0]);
  const et = parseInt(splitDuration[1]);
  const items = itemList;

  const filteredItems = items.filter((item) => {
    let duration = item.duration;
    // 0, null,undefined, "" are falsy value
    // Note: ("") and EmptyString" " are not same
    // !0 === true

    if (duration >= st && !et) {
      return true;
    } else if (duration >= st && duration < et) {
      return true;
    } else {
      return null;
    }
  });

  return filteredItems;
}
// console.log("Filter By Duration: ", filterByDuration("12-0", adventures));

function filterByCategory(categoryList, itemList) {
  const items = itemList;
  const filteredList = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < categoryList.length; j++) {
      if (categoryList[j].toLowerCase() === items[i].category.toLowerCase()) {
        filteredList.push(items[i]);
      }
    }
  }

  return filteredList;
}
// console.log(
//   "Filter By Category: ",
//   filterByCategory(["beaches", "party"], adventures),
// );

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together
function applyFilters(filtersFromLocalStorage, itemList) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  let filteredList = [];
  // it is important to place both condition on top
  if (
    filtersFromLocalStorage.category.length &&
    filtersFromLocalStorage.duration.length
  ) {
    filteredList = filterByDuration(filtersFromLocalStorage.duration, itemList);
    filteredList = filterByCategory(
      filtersFromLocalStorage.category,
      filteredList,
    );
  } else if (filtersFromLocalStorage.duration.length) {
    filteredList = filterByDuration(filtersFromLocalStorage.duration, itemList);
  } else if (filtersFromLocalStorage.category.length) {
    filteredList = filterByCategory(filtersFromLocalStorage.category, itemList);
  } else {
    filteredList = itemList;
  }
  return filteredList;
}

// console.log(
//   "Filters Applied: ",
//   applyFilters({ duration: "12", category: [] }, adventures),
// );

// HTML Template for adventure Card
function adventuresCardTemplate(item) {
  let adventuresColumn = document.createElement("div");
  adventuresColumn.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
  adventuresColumn.id = item.id;
  adventuresColumn.innerHTML = `
                  <div class="card bg-light text-bg-light" style="cursor: pointer">
                  <a 
                  href= "detail/?adventure=${item.id}" style="position:absolute;inset:0;z-index:1"> <a/>
                  <div
                    style="
                      background-color: #f19537;
                      right: -8px;
                      box-shadow: 4px 4px 16px 8px rgb(0 0 0 / 31%) !important;
                      z-index: 1;
                    "
                    class="position-absolute top-0 rounded-start-2 mt-3 px-4 py-1 text-light fw-bold"
                  >
                  ${item.category}
                  </div>

                  <img
                    src=${item.image}
                    height="320"
                    class="card-img-top object-fit-cover"
                    alt="..."
                  />
                  <div
                    class="card-body d-flex flex-column gap-2"
                  >
                    <div
                      class="d-inline-flex justify-content-between align-items-center gap-5"
                    >
                      <h5 class="card-title fs-6 fw-semibold mb-0">${item.name}</h5>
                      <p class="card-text">₹${item.costPerHead}</p>
                    </div>
                    <div
                      class="d-inline-flex justify-content-between align-items-center gap-5"
                    >
                      <h5 class="card-title fs-6 mb-0">Duration</h5>
                      <p class="card-text">${item.duration} Hours</p>
                    </div>
                  </div>
                </div>
                  `;
  return adventuresColumn;
}

// Add Adventures List To DOM
function addAdventuresToDOM(adventures) {
  console.log(adventures);
  const adventuresContainer = document.getElementById("mytrip-adventures");
  adventuresContainer.innerHTML = "";
  if (!adventures.length) {
    adventuresContainer.innerHTML = `
    <div class="my-5 py-5 text-center">
     <h5 class="">No Places available for selected durations or category.
   
    </h5>
     <p class="fs-5 mb-5">
    Try again with other durations or category or use <strong><em>clear</em></strong> to reset filters.
    </p>
    </div>
    
    `;
  }
  adventures.forEach((adventure) => {
    let col = adventuresCardTemplate(adventure);
    adventuresContainer.appendChild(col);
  });
}

function addCategoryToFiltersAndDOM(filtersFromLocalStorage) {
  const categoryPillContainer = document.getElementById(
    "mytrip-category-pills",
  );
  categoryPillContainer.textContent = "";

  filtersFromLocalStorage.category.forEach((item) => {
    const categoryPill = document.createElement("p");
    categoryPill.id = `mytrip-category-${item.toLowerCase()}`;
    categoryPill.className =
      "d-inline-flex align-items-center gap-2 position-relative border border-warning rounded-pill fs-6 fw-normal text-bg-light ps-3 my-1";
    categoryPill.innerHTML = `<span> ${item} </span>
          <span
            style="
              width: 30px;
              height: 30px;
              cursor: pointer;
              background-color: #ececec;
              color: #4c4c4c;
            "
            class="rounded-circle text-center align-middle fs-6"
            >x</span
          >
          `;

    categoryPillContainer.appendChild(categoryPill);
  });
}

export {
  getQueryParamFromURL,
  fetchAdventures,
  //   filterByDuration,
  //   filterByCategory,
  applyFilters,
  addAdventuresToDOM,
  addCategoryToFiltersAndDOM,
};
