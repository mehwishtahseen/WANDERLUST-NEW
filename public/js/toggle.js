// For toggling a navbar effect
// to add the navbar login or signup button if clicked on userNavbtn and to remove that if user click anywhere on screen
let userNavbtn = document.querySelector(".registerbox");
let userDataBox = document.querySelector(".userdatabox");
userNavbtn.addEventListener("click", (event) => {
  event.stopPropagation();
  userDataBox.classList.toggle("hide");
  if (!userDataBox.classList.contains("hide")) {
    window.addEventListener("click", hideUserdataBox);
  }
});

function hideUserdataBox() {
  userDataBox.classList.add("hide");
  window.removeEventListener("click", hideUserdataBox);
}

// For adding taxes functionality
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
let taxInfo = Array.from(document.getElementsByClassName("tax-info")); // Convert to a static array
taxSwitch.addEventListener("click", () => {
  taxInfo.forEach((info) => {
    info.classList.toggle("tax-info");
  });
});
