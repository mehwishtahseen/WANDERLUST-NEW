// For toggling a navbar effect on desktop
let userNavbtn = document.querySelector(".registerbox");
let userDataBox = document.querySelector(".userdatabox");

userNavbtn.addEventListener("click", (event) => {
  event.stopPropagation();
  userDataBox.classList.toggle("hide");
  if (!userDataBox.classList.contains("hide")) {
    window.addEventListener("click", hideUserdataBoxDesktop);
  }
});

function hideUserdataBoxDesktop() {
  userDataBox.classList.add("hide");
  window.removeEventListener("click", hideUserdataBoxDesktop);
}

// For toggling a navbar effect on mobile
let userNavbtnmob = document.querySelector(".rgstr-mob");
let userDataBoxmob = document.querySelector(".userdatabox-mob");

userNavbtnmob.addEventListener("click", (event) => {
  event.stopPropagation();
  userDataBoxmob.classList.toggle("hide");
  if (!userDataBoxmob.classList.contains("hide")) {
    window.addEventListener("click", hideUserdataBoxMobile);
  }
});

function hideUserdataBoxMobile() {
  userDataBoxmob.classList.add("hide");
  window.removeEventListener("click", hideUserdataBoxMobile);
}

// For adding taxes functionality
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
let taxInfo = Array.from(document.getElementsByClassName("tax-info")); // Convert to a static array
taxSwitch.addEventListener("click", () => {
  taxInfo.forEach((info) => {
    info.classList.toggle("tax-info");
  });
});
