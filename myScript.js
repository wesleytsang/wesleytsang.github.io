/**
 * Created by Wesley on 15/10/2016.
 */

function project() {
    var popup = document.getElementById('myPopup');
    popup.classList.toggle('show');
}

function dropDown() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}