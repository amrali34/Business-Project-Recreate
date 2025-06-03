"use strict";

const menu = document.querySelector(".menu");
const menuOverlay = document.querySelector(".menu-overlay");
/** @type {HTMLVideoElement} */
const video = document.querySelector(".video");
const videoWrapper = document.querySelector(".video-wrapper");
const videoBtn = document.querySelector(".video-btn");
const progress = document.querySelector(".progress");
const progressFull = document.querySelector(".progress-full");
let videoID;
// VIDEO

const updateProgress = function () {
  if (!video.paused) {
    videoBtn.firstElementChild.className = `far fa-pause-circle`;
    const portion = (video.currentTime / video.duration) * 100;
    progress.style.width = `${portion}%`;
  }
  videoID = requestAnimationFrame(updateProgress);
};

videoBtn.addEventListener("click", function (e) {
  if (video.paused) {
    video.play();
  } else {
    cancelAnimationFrame(videoID);
    video.pause();
    videoBtn.firstElementChild.className = `far fa-play-circle`;
  }
  videoID = requestAnimationFrame(updateProgress);
});

progressFull.addEventListener("click", function (e) {
  const fullRect = progressFull.getBoundingClientRect();
  const clickedPercent = (e.clientX - fullRect.left) / fullRect.width;
  video.currentTime = clickedPercent * video.duration;
  progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
});

video.addEventListener("ended", function (e) {
  progress.style.width = `0%`;
  videoBtn.firstElementChild.className = `far fa-play-circle`;
  cancelAnimationFrame(videoID);
});
// NAVIGATION
menu.addEventListener("click", function (e) {
  menu.classList.toggle("change");
  menuOverlay.classList.toggle("change");
});

// CARD DRAGGING EFFECT

const cardsContainer = document.querySelector(".cards-wrapper");
const cards = [...document.querySelectorAll(".card")];
let dragEnabled = false;
let startX = 0;
let firstTranslate = 0;
let lastTranslate = 0;
let nextTranslate = 0;
let dragId;
let mouseDownF;
const initialRotation = [120, 30, 80, 160];

const enableDrag = function () {
  console.log("before if");
  if (dragEnabled) return;
  console.log("amrrrrr");
  dragEnabled = true;
  const updateDragging = function () {
    cards.forEach((card, i) => {
      const rotation = nextTranslate / 3 + initialRotation[i];
      card.style.transform = `translateX(${nextTranslate}px) rotateY(${rotation}deg) translateZ(0)`;
    });
    dragId = requestAnimationFrame(updateDragging);
  };
  const handleMouseDown = function (e) {
    const clickedCard = e.target.closest(".card");
    if (!clickedCard) return;
    clickedCard.style.cursor = "grabbing";
    const cardsRect = cardsContainer.getBoundingClientRect();
    startX = e.clientX;
    const maxMov =
      (cardsRect.width -
        cards.reduce(
          (acc, card) => acc + card.getBoundingClientRect().width,
          0
        )) /
        cards.length +
      380;
    console.log(maxMov);
    const handleMouseMove = function (e) {
      firstTranslate = e.clientX - startX + lastTranslate;
      nextTranslate = Math.max(-maxMov, Math.min(firstTranslate, maxMov));
      if (firstTranslate > maxMov) firstTranslate = maxMov;
      if (firstTranslate < -maxMov) firstTranslate = -maxMov;
    };
    const handleMouseUp = function (e) {
      clickedCard.style.cursor = "grab";
      lastTranslate = firstTranslate;
      cancelAnimationFrame(dragId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    dragId = requestAnimationFrame(updateDragging);
  };
  cardsContainer.addEventListener("mousedown", handleMouseDown);
  mouseDownF = handleMouseDown;
};
const disableDrag = function () {
  if (!dragEnabled) return;
  cardsContainer.removeEventListener("mousedown", mouseDownF);
  cards.forEach((card) => {
    card.style.transform = `translateX(0) rotateY(0) translateZ(0)`;
    card.style.cursor = "auto";
  });
  mouseDownF = null;
};

if (window.matchMedia("(min-width: 800px)").matches) {
  enableDrag();
}
window.addEventListener("resize", function (e) {
  if (window.matchMedia("(min-width:800px)").matches) {
    enableDrag();
  } else disableDrag();
});

/////////////////////
