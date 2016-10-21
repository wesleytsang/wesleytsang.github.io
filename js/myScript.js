/**
 * Created by Wesley on 15/10/2016.
 */

// JS for NavBar drop down
function dropDown() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

//smooth jump
$(document).ready(function(){
        // Add smooth scrolling to all links
        $("a").on('click', function(event) {

          // Make sure this.hash has a value before overriding default behavior
          if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
              scrollTop: $(hash).offset().top
            }, 800, function(){

              // Add hash (#) to URL when done scrolling (default click behavior)
              window.location.hash = hash;
            });
          } // End if
        });
      });

const ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Programing", "Web Design", "Unique Idea", "Team Player", "Quick Learner"],
        datasets: [
            {
                type: 'bar',
                label: 'Bar Component',
                data: [10, 6, 9, 7, 8],
            },
        ]
    },
    options: {
        scales: {
            yAxes: [{
                stacked: true,
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    fontSize: 0
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    fontSize: 18
                }
            }]
        },
        legend: {
          display: false
        },
        tooltips: {
        callbacks: {
           label: function(tooltipItem) {
                  return tooltipItem.yLabel;
           }
        }
    }
    }
});