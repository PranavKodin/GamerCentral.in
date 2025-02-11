// This file is used to add any additional dynamic functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log("GamerCentral website loaded!");
    // Add more interactivity like animations or dynamic content loading here
});

let lastScrollTop = 0;
const navbar = document.querySelector(".nav-links");

window.addEventListener("scroll", function () {
  let scrollTop = window.scrollY || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scrolling Down → Hide Navbar
    navbar.style.top = "-100px"; // Move navbar up (hide)
  } else {
    // Scrolling Up → Show Navbar
    navbar.style.top = "20px"; // Restore navbar position
  }

  lastScrollTop = scrollTop;
});

let currentIndex = 0;
const images = document.querySelectorAll('.slider-image');

function changeImage() {
  images[currentIndex].style.opacity = '0';  // Hide current image
  currentIndex = (currentIndex + 1) % images.length;  // Move to the next image
  images[currentIndex].style.opacity = '1';  // Show next image
}

setInterval(changeImage, 4000);  // Change image every 4 seconds

document.addEventListener("DOMContentLoaded", function () {
    let slides = document.querySelectorAll(".slide");
    let dotsContainer = document.querySelector(".dots");
    let totalSlides = slides.length;
    let currentIndex = 0;
    const slideInterval = 5000; // 5 seconds

    // Create dots dynamically based on slides
    slides.forEach((_, i) => {
      let dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active"); // First dot active
      dot.setAttribute("data-index", i);
      dotsContainer.appendChild(dot);
    });

    let dots = document.querySelectorAll(".dot");

    function showSlide(index) {
      if (index >= totalSlides) {
        index = 0;
      } else if (index < 0) {
        index = totalSlides - 1;
      }

      // Remove 'active' from all slides & dots
      slides.forEach(slide => slide.classList.remove("active"));
      dots.forEach(dot => dot.classList.remove("active"));

      // Add 'active' to the current slide & dot
      slides[index].classList.add("active");
      dots[index].classList.add("active");

      // Update currentIndex
      currentIndex = index;
    }

    // Auto-slide
    setInterval(() => {
      showSlide(currentIndex + 1);
    }, slideInterval);

    // Navigation Buttons
    document.querySelector(".arrow-left").addEventListener("click", () => {
      showSlide(currentIndex - 1);
    });

    document.querySelector(".arrow-right").addEventListener("click", () => {
      showSlide(currentIndex + 1);
    });

    // Click on dots to switch slides
    dots.forEach(dot => {
      dot.addEventListener("click", function () {
        let index = parseInt(this.getAttribute("data-index"));
        showSlide(index);
      });
    });
  });   


// Open Sidebar
function toggleSidebar() {
    document.getElementById("sidebar").style.width = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)"; // Darken background when sidebar is open
}

// Close Sidebar
function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
    document.body.style.backgroundColor = "white"; // Reset background when sidebar is closed
}

document.addEventListener('DOMContentLoaded', function () {
    // Fetch the JSON data
    fetch('slides.json')
        .then(response => response.json())
        .then(data => {
            // Make sure we have data to work with
            if (data.length >= 3) {
                // Target each slide with the class show1, show2, show3
                const slides = [
                    { className: 'show1', title: data[0].title, description: data[0].description },
                    { className: 'show2', title: data[1].title, description: data[1].description },
                    { className: 'show3', title: data[2].title, description: data[2].description }
                ];

                slides.forEach(slide => {
                    const slideElement = document.querySelector(`.${slide.className}`);
                    if (slideElement) {
                        const titleElement = slideElement.querySelector('h1, h2');
                        const descriptionElement = slideElement.querySelector('p');

                        // Update title and description
                        if (titleElement && descriptionElement) {
                            titleElement.textContent = slide.title;
                            descriptionElement.textContent = slide.description;
                        }
                    }
                });
            } else {
                console.error('Insufficient data in JSON file');
            }
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });
});
