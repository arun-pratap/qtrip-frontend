import config from "../config/index.js";
async function fetchReservations() {
  try {
    const reservations = await fetch(`${config.apiURL}/reservations`);
    return await reservations.json();
  } catch (error) {
    console.log(error);
  }
}
// const reservations = await fetchReservations();
// console.log(reservations);

function addReservationsToDOM(reservationsDetail) {
  const reservationTableBody = document.getElementById(
    "mytrip-reservation-table-body",
  );

  if (reservationsDetail.length > 0) {
    document
      .getElementById("mytrip-reservation-detail")
      .classList.remove("d-none"); 

    reservationsDetail.forEach((reservation) => {
      const tableRow = document.createElement("tr");
      tableRow.className = "align-middle";
      let bookingTime = new Date(reservation.time);
      let reservationDate = new Date(reservation.date);
      tableRow.innerHTML = `
          <th scope="row">${reservation.id}</th>
            <td>${reservation.name}</td>
            <td>${reservation.adventureName}</td>
            <td>${reservation.person}</td>
            <td>${reservationDate.toLocaleString()}</td>
            <td>${reservation.price}</td>
            <td>${bookingTime.toLocaleString()}</td>
            <td><a class="btn btn-sm bg-orange text-white border rounded-pill border-0 px-3 py-2 fw-semibold" href="/frontend/pages/adventures/detail/?adventure=${reservation.adventure}">Visit Adventure</a>
            </td>
          `;
      reservationTableBody.appendChild(tableRow);
    });
  } else {
    document
      .getElementById("mytrip-no-reservation-message")
      .classList.remove("d-none");
    // document.getElementById("mytrip-reservation-detail").style.display = "none";
  }
}
// addReservationsToDOM(reservations);

export { fetchReservations, addReservationsToDOM };
