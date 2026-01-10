const menuMusic = document.getElementById("menuMusic");
const playBtn = document.getElementById("playBtn");

window.addEventListener(
  "click",
  () => {
    // start music after 15 seconds from now, starting at 15s into the track
    setTimeout(() => {
      menuMusic.currentTime = 15; // start from 15 seconds
      menuMusic.volume = 0.5;
      menuMusic.play();
    }, 15000);
  },
  { once: true } // only need one user interaction
);

// Stop music and go to game page
playBtn.addEventListener("click", () => {
  menuMusic.pause();
  menuMusic.currentTime = 0;
  window.location.href = "game.html";
});
