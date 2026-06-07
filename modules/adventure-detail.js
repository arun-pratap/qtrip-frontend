import config from "../config/index.js";

const adventureId = new URLSearchParams(window.location.search).get(
  "adventure",
);
// console.log("Adventure Id: ", adventureId);

async function fetchAdventureDetail(adventureId) {
  try {
    const res = await fetch(
      `${config.apiURL}/adventures/detail?adventure=${adventureId}`,
    );

    return res.json();
  } catch (error) {
    console.log(error);
  }
}
let adventureDetail = await fetchAdventureDetail(adventureId);
// console.log("Adventure Detail: ", adventureDetail);

function addAdventureDetailToDOM(adventureDetail) {
  // append can also be used instead of textContent
  // Add name and subtitle
  document.getElementById("mytrip-adventure-detail-name").textContent =
    adventureDetail.name;
  document.getElementById("mytrip-adventure-detail-subtitle").textContent =
    adventureDetail.subtitle;
  document.getElementById("mytrip-adventure-detail-content").textContent =
    adventureDetail.content;

  document.getElementById("mytrip-reservation-cost").textContent =
    `₹ ${adventureDetail.costPerHead} per head`;
}

function addBootstrapImageCarousel(images) {
  const imageContainer = document.getElementById(
    "mytrip-adventure-detail-images",
  );
  const carouselIndictors = document.querySelector(
    "#mytrip-adventure-detail-carousel .carousel-indicators",
  );
  images.forEach((image, index) => {
    // add carousel item (images)
    let item = document.createElement("div");
    item.className = `carousel-item h-100 ${index === 0 ? "active" : ""}`;

    item.innerHTML = `
          <img
              src=${image}
              class="d-block w-100 mytrip-adventure-detail-carousel-img"
              alt="..."
            />
          `;
    imageContainer.appendChild(item);

    // add carousel indicators
    let button = document.createElement("button");
    button.type = "button";
    button.className = index === 0 ? "active" : "";
    button.dataset.bsTarget = "#mytrip-adventure-detail-carousel";
    button.dataset.bsSlideTo = index;
    button.setAttribute("aria-label", `Slide ${index}`);
    if (index === 0) {
      button.setAttribute("aria-current", true);
    }
    carouselIndictors.appendChild(button);
  });
  
}

// addAdventureDetailToDOM(adventureDetail);
// addBootstrapImageCarousel(adventureDetail.images);

function calculateTotalCostAndAddToDOM(pricePerPerson, person) {
  let total = document.getElementById("mytrip-reservation-total-cost");
  total.innerHTML = "";
  total.append(`₹ ${parseInt(person) * parseInt(pricePerPerson)}`);
  // console.log(total);
}

// calculateTotalCostAndAddToDOM(adventureDetail.costPerHead, 4);

function checkAvailabilityAndAddFormToDOMConditionally(adventureAvailable) {
  if (!adventureAvailable) {
    document.getElementById("mytrip-reservation-form-container").style.display =
      "none";
    document.getElementById("mytrip-reservation-sold").className = "d-lg-block";
  }
}
// checkAvailabilityAndAddFormToDOMConditionally(true);

function OnSubmitReservationForm(adventureId) {
  const form = document.querySelector(
    "#mytrip-reservation-form-container form",
  );
  const formId = document.getElementById("mytrip-reservation-form-container");
  //   console.log(form.elements);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await fetch(`${config.apiURL}/reservations/new`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          // can access input value either by using name or id
          // form.elements["name"].value or form.elements.name.value
          name: form.elements["name"].value,
          date: form.elements["date"].value,
          person: form.elements["person"].value,
          adventure: adventureId,
        }),
      });
      alert("Reservation Successful");
      window.location.reload()
    } catch (error) {
      console.log(error);
      alert("failed");
    }


  });
}
// OnSubmitReservationForm(8549673097);

export {
  fetchAdventureDetail,
  addAdventureDetailToDOM,
  addBootstrapImageCarousel,
  calculateTotalCostAndAddToDOM,
  checkAvailabilityAndAddFormToDOMConditionally,
  OnSubmitReservationForm,
};
