// Function to get the URL parameter (e.g., ?id=1)
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Fetch product data based on the ID in the URL
document.addEventListener("DOMContentLoaded", function () {
    const productId = getUrlParameter('id'); // Get product ID from URL

    if (!productId) {
        console.error("No product ID found in the URL");
        return;
    }

    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            let product = data.products.find(item => item.id === parseInt(productId)); // Find product by ID

            if (!product) {
                console.error("Product not found");
                return;
            }

            // Update product details
            document.querySelector(".product-title h1").textContent = product.title;
            document.querySelector(".product-rating").textContent = `★★★★☆ (${product.reviews} Reviews)`;
            document.querySelector(".product-price").textContent = `₹ ${product.price}`;
            document.querySelector(".product-discount").textContent = product.discount;

            // Update product description list
            let descriptionList = document.getElementById("product-description");
            descriptionList.innerHTML = ""; // Clear old list
            product.features.forEach(feature => {
                let li = document.createElement("li");
                li.textContent = feature;
                descriptionList.appendChild(li);
            });

            // Update images
            let mainImg = document.getElementById("main-img");
            let thumbnails = document.querySelectorAll(".thumb-img");

            mainImg.src = product.main_image;
            mainImg.alt = product.title; // Improves accessibility

            product.thumbnail_images.forEach((imgSrc, index) => {
                if (thumbnails[index]) {
                    thumbnails[index].src = imgSrc;
                    thumbnails[index].alt = `Thumbnail ${index + 1}`;
                }
            });

            // Set the event listener for the CTA button (Buy Now)
            document.getElementById('buy-now').addEventListener('click', function () {
                window.open(product.affiliate_link, '_blank'); // Redirect to affiliate link
            });

            // Inject YouTube review section
            if (product.youtube_review) {
                const youtubeSection = document.querySelector("#youtube-review");
                youtubeSection.innerHTML = `
                    <h2>Watch Product Reviews on YouTube</h2>
                    <div class="youtube-card">
                        <iframe width="100%" height="250" src="https://www.youtube.com/embed/${extractVideoId(product.youtube_review)}" frameborder="0" allowfullscreen></iframe>
                        <button class="watch-youtube" onclick="window.open('${product.youtube_review}', '_blank')">Watch on YouTube</button>
                    </div>
                `;
            }
        })
        .catch(error => console.error("Error fetching product data:", error));
});

// Helper function to extract YouTube Video ID
function extractVideoId(url) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
}


// Google Chart for displaying product prices based on selected product
google.charts.load('current', { packages: ['corechart', 'bar'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  const productId = getUrlParameter('id'); // Get the product ID from the URL
  if (!productId) {
      console.error("No product ID found for chart");
      return;
  }

  fetch('products.json')
      .then(response => response.json())
      .then(data => {
          let product = data.products.find(item => item.id === parseInt(productId)); // Find product by ID
          if (!product) {
              console.error("Product not found for chart");
              return;
          }

          // Prepare the data for Google Charts
          var chartData = new google.visualization.arrayToDataTable([
              ['Website', 'Price (INR)'],
              // Map over each product's 'prices' array
              ...product.prices.map(item => [item.website, item.price])
          ]);

          // Set options for the chart with transparent background and customized bar color
          var options = {
              title: `${product.title} Prices in INR`,
              titleTextStyle: {
                  color: 'white',
                  fontSize: 20,
                  fontName: 'Rajdhani'
              },
              chartArea: {
                  width: '50%',
                  backgroundColor: 'transparent'
              },
              hAxis: {
                  title: 'Price (INR)',
                  minValue: 0,
                  textStyle: { color: 'white' },
                  titleTextStyle: { color: 'white' }
              },
              vAxis: {
                  title: 'E-Commerce Website',
                  textStyle: { color: 'white' },
                  titleTextStyle: { color: 'white' }
              },
              legend: {
                  textStyle: { color: 'white' }
              },
              colors: ['#FFEB3B'],
              bar: { groupWidth: '75%' },
              backgroundColor: 'transparent'
          };

          // Draw the chart
          var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
          chart.draw(chartData, options);
      })
      .catch(error => console.error("Error fetching data for chart:", error));
}

// Image Thumbnail Switcher (for main image)
document.addEventListener("DOMContentLoaded", function () {
  const mainImg = document.getElementById("main-img");
  const thumbnails = document.querySelectorAll(".thumb-img");

  thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
          const currentMainImageSrc = mainImg.src;
          mainImg.src = thumbnail.src;
          thumbnail.src = currentMainImageSrc;
      });
  });
});

const mainImage = document.getElementById("main-img");
const zoomBox = document.getElementById("zoomBox");
const thumbnailImages = document.querySelectorAll(".thumb-img");

// Function to update zoom effect
mainImage.addEventListener("mousemove", function(event) {
    let bounds = mainImage.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;

    let percentX = (x / bounds.width) * 100;
    let percentY = (y / bounds.height) * 100;

    zoomBox.style.display = "block";
    zoomBox.style.backgroundImage = `url('${mainImage.src}')`;
    zoomBox.style.backgroundSize = "600px auto"; /* Adjust zoom level */
    zoomBox.style.backgroundPosition = `${percentX}% ${percentY}%`;
});

// Hide zoom box when not hovering
mainImage.addEventListener("mouseleave", function() {
    zoomBox.style.display = "none";
});

// Update main image when a thumbnail is clicked
thumbnailImages.forEach(thumbnail => {
    thumbnail.addEventListener("click", function() {
        mainImage.src = this.src;
    });
});
