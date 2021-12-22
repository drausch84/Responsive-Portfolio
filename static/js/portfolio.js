//JS for toggling the nav menu between desktop, tablet, and mobil

const toggle = document.querySelector(".toggle");
const menu = document.querySelector(".menu");
const items = document.querySelectorAll(".item");

/* Toggle mobile menu */
function toggleMenu() {
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    toggle.querySelector("a").innerHTML = "<i class='bi bi-list'></i>";
  } else {
    menu.classList.add("active");
    toggle.querySelector("a").innerHTML = "<i class='bi bi-x'></i>";
  }
}

/* Event Listeners */
toggle.addEventListener("click", toggleMenu, false);
for (let item of items) {
  item.addEventListener("keypress", toggleItem, false);
}

/* Card Flip Animation Portfolio Page */
const cards = document.querySelectorAll(".card");

function transition() {
  if (this.classList.contains("active")) {
    this.classList.remove("active");
  } else {
    this.classList.add("active");
  }
}

cards.forEach((card) => card.addEventListener("click", transition));
