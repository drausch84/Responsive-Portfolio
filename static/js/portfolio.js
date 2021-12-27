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

/* Page Transitions */
$(document).ready(function() {
  $(".center").animate({opacity: 1}, 500);
  $('a.portfolio-link').click(function(event) {
    event.preventDefault();
    var url = $(this).attr("href");
    console.log(url);
    $(".center").animate({opacity: 0}, 500);
    
    setTimeout(function() {
      window.location.href = url;
    }, 500);
  }); 
});

/* Scroll To Top Button Behavior */
let scroll = document.querySelector('.topScroll');
let options = {top: 0, left: 0, behavior: 'smooth'};
scroll.addEventListener('click', () => {window.scroll(options) });