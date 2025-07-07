function updateHeaderText() {
  const title = document.getElementById("title1");
  if (window.innerWidth < 1080) {
    title.textContent = "buy.clothes";
  } else {
    title.textContent = "made.dev / buy.clothes";
  }
}

window.addEventListener("load", updateHeaderText);
window.addEventListener("resize", updateHeaderText);
