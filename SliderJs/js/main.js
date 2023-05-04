"use strict";
const BtnBack = document.querySelector(".slider-back");
const BtnNext = document.querySelector(".slider-next");
const SelectCountSlider = document.querySelector(".select-number");
const DotsList = document.querySelector(".dots-check");
const ActiveDots = document.querySelector(".dot-activ");
const Speed = document.querySelector('#speedRange');
const srcSlide = [];
let classNumber = 0;
let newSrc = [];
let offset = 0;
let countSlide = 1;
let speedAnimation = 1;
let stepStop = 5;
let currentSliderCount = [];
let dotNumber = 1;

CopySrc();
CreateSlide();
ReloadSlider();
BtnNext.onclick = SlideNext;
BtnBack.onclick = SlideBack;
SelectCountSlider.onchange = ReloadSlider;
DotsList.onclick = (event) => {
  DotsList.classList.add("dots-event-non");
  DotsSwapSlide(event);
};
Speed.onchange = SpedParams;

function SpedParams() {
  let speedAnim = [25,20,15,10,5,1];
  let speedStep = [10];
  if (Speed.value <=5 ) {
    stepStop = 5;
    speedAnimation = speedAnim[Speed.value];
  }else if(Speed.value > 5){
    speedAnimation = 1;
    stepStop = speedStep[Speed.value - 6];
  }
  console.log(stepStop + 'step');
  console.log(speedAnimation);
  let text = document.querySelector('.speed-current')
  text.textContent = Speed.value + 'x';

}
//Оценивает текущие положение активного слайда и делает активной нужную точку
function RenderDots() {
  // setTimeout(() => {
    let tempSlideHtml = document.querySelectorAll(".slide-single");
    let tempClassName = tempSlideHtml[1].className;
    classNumber = parseInt(tempClassName.match(/\d+/));
    let curDot = document.querySelector(`.dot--${classNumber}`);
    curDot.classList.add("dot-activ");
    let allDots = document.querySelectorAll(".btn-check");
    for (let i = 0; i < allDots.length; i++) {
      if (i == classNumber - 1) {
        continue;
      } else {
        allDots[i].classList.remove("dot-activ");
      }
    }
  // }, 300);
}
//..........................
//Сбрасывает количество слайдеров
function ReloadSlider() {
  document.querySelector(".slide-single").remove();
  CreateSlide();
  classNumber = 0;
  GetCurrentSliderCount();
  AddDots();
}
function GetCurrentSliderCount() {
  countSlide = Number(SelectCountSlider.value);
  GetCountSlide(countSlide);
  newSrc = [];
  for (let i = 0; i < countSlide; i++) {
    newSrc[i] = srcSlide[i];
  }
}
function GetCountSlide(countSlide) {
  currentSliderCount = [];
  for (let i = 0; i < countSlide - 1; i++) {
    currentSliderCount.push(i);
  }
  currentSliderCount.unshift(countSlide - 1);
  currentSliderCount.unshift("");
}
//............................
//Создание и добавление точек под слайдер
function AddDots() {
  let dots = document.querySelectorAll(".btn-check");
  for (let j = 0; j < dots.length; j++) {
    dots[j].remove();
  }
  for (let i = 0; i < countSlide; i++) {
    CreateDots(i + 1);
  }
}
function CreateDots(num) {
  let dot = document.createElement("div");
  dot.classList.add("btn-check");
  dot.classList.add(`dot--${num}`);
  if (num === 1) {
    dot.classList.add("dot-activ");
  }
  DotsList.appendChild(dot);
}
//....................................
//Копирует путь к изображениям
function CopySrc() {
  let allSlidesImg = document.querySelectorAll(".slide-single");
  for (let j = 0; j < allSlidesImg.length; j++) {
    srcSlide[j] = allSlidesImg[j].src;
    allSlidesImg[j].remove();
  }
}
//............................

//Функция создает первый слайд и нумерует - 1, что бы от него отталкиваться
function CreateSlide() {
  let img = document.createElement("img");
  img.src = srcSlide[0];

  img.classList.add("slide-single");
  img.classList.add(`slide--${1}`);
  img.style.left = "0px";
  document.querySelector(".slider-track").appendChild(img);
}
//............................

//Перелистывает слайд в лево
function SlideNext() {
  BtnBack.onclick = null;
  BtnNext.onclick = null;
  setTimeout(function () {
    TimerSlideNext();
    RenderDots();
  }, 100);
}
//............................

//Перелистывает слайд в право
function SlideBack() {
  BtnBack.onclick = null;
  BtnNext.onclick = null;

  setTimeout(function () {
    TimerSlideBack();
    RenderDots();
  }, 100);
}
//............................

//Создает следующий слайд на основе предидущего
function TimerSlideNext() {
  CreateSlideGeneric(GetClassNumberGeneric("next"), 530);
  GetOffsetAnimationGeneric(-stepStop, 530, -stepStop, speedAnimation);
  //Если назад то stepPosition = 5, currentPositionIndex1 = -530; stopIntervalPosition = 5;
  //Если вперед то stepPosition = -5, currentPositionIndex1 = 530; stopIntervalPosition = -5;
}

//Создает следующий слайд на основе предидущего в обратном направлении
function TimerSlideBack() {
  CreateSlideGeneric(GetClassNumberGeneric("back"), -530);
  GetOffsetAnimationGeneric(stepStop, -530, stepStop, speedAnimation);
  //Если назад то stepPosition = 5, currentPositionIndex1 = -530; stopIntervalPosition = 5;
  //Если вперед то stepPosition = -5, currentPositionIndex1 = -530; stopIntervalPosition = -5;
}

function GetClassNumberGeneric(direction) {
  let tempSlideHtml = document.querySelectorAll(".slide-single");
  let tempClassName = tempSlideHtml[0].className;
  classNumber = parseInt(tempClassName.match(/\d+/));

  if (direction === "next") {
    if (classNumber === newSrc.length) {
      classNumber = 0;
    }
    return classNumber;
  } else if (direction === "back") {
    classNumber = currentSliderCount[classNumber];
    return classNumber;
  } else {
    console.log("Ошибка тут");
  }
}
function CreateSlideGeneric(classNumber, startPosition) {
  offset = 1;
  let img = document.createElement("img");
  img.src = srcSlide[classNumber];
  img.classList.add("slide-single");
  img.classList.add(`slide--${classNumber + 1}`);
  img.style.left = offset * startPosition + "px";
  document.querySelector(".slider-track").appendChild(img);
  offset = 1;
}
function GetOffsetAnimationGeneric(
  stepPosition,
  currentPosition,
  stopIntervalPosition,
  speedAnimation
) {
  let currentSlideInHtml = document.querySelectorAll(".slide-single");
  let currentPositionIndex1 = currentPosition;
  let currentPositionIndex0 = 0;
  let timer = setInterval(() => {
    currentSlideInHtml[0].style.left = `${currentPositionIndex0}px`;
    currentPositionIndex0 += stepPosition;

    currentSlideInHtml[1].style.left = `${currentPositionIndex1}px`;
    currentPositionIndex1 += stepPosition;

    if (currentPositionIndex1 === stopIntervalPosition) {
      currentSlideInHtml[0].remove();
      clearInterval(timer);

      BtnNext.onclick = SlideNext;

      BtnBack.onclick = SlideBack;
    }
  }, speedAnimation);

  //Если назад то stepPosition = 5, currentPositionIndex1 = -530; stopIntervalPosition = 5;
  //Если вперед то stepPosition = -5, currentPositionIndex1 = -530; stopIntervalPosition = -5;
}

function DotsSwapSlide(event) {
  if (event.target.classList.contains("dot-activ") || !event.target.classList.contains("btn-check")){
    DotsList.classList.remove("dots-event-non");
    return
  };
  let tapDotsClass = event.target.className;
  let tapDotsNum = parseInt(tapDotsClass.match(/\d+/));
  let activ = document.querySelector(".dot-activ").className;
  let activNum = parseInt(activ.match(/\d+/));

  if (tapDotsNum > activNum) {
    CreateSlideGeneric(tapDotsNum - 1, 530);
    GetOffsetAnimationGeneric(-stepStop, 530, -stepStop, speedAnimation);
  } else if (tapDotsNum < activNum) {
    CreateSlideGeneric(tapDotsNum - 1, -530);
    GetOffsetAnimationGeneric(stepStop, -530, stepStop, speedAnimation);
  }
  RenderDots();

  DotsList.classList.remove("dots-event-non");
}
