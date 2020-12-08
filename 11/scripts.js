'use strict'

/* Get Elements */
const player = document.querySelector('.player')
const video = player.querySelector('.viewer')
const progress = player.querySelector('.progress')
const progressBar = player.querySelector('.progress__filled')
const toggle = player.querySelector('.toggle')
const skipButtons = player.querySelectorAll('[data-skip]')
const ranges = player.querySelectorAll('.player__slider')
const fullscreen = player.querySelector('.fullscreen')


/* Build Functions*/
// 1. toggle play:
const togglePlay = () => {
  // paused is a property that lives on the video obj
  // video.paused ? video.play() : video.pause ()
  const method = video.paused ? 'play' : 'pause'
  video[method]()
}

// 2. function to update the play button:
function updateButton () {
  const icon = this.paused ? '►' : '❚ ❚';
  console.log(icon);
  toggle.textContent = icon;
}

// 3. function for the skip button
function skip () {
  // add the dataset to the currentTime on the video object
  console.log(this.dataset.skip)
  // by adding this.dataset.set skip to the currentTime, we will update the point of the video that we are viewing by 25s (forward) or 10s (backward)
  video.currentTime += parseFloat(this.dataset.skip)
}

// 4. Change to range sliders
function handleRangeUpdate() {
  // property we need to update in this function
  video[this.name] = this.value
  console.log(this.name)
  console.log(this.value)
}

// 5. function to handle the progress bar using a percentage
// updating flex-bases value of the progress bar to correspond to how long the video has been playing
function handleProgress () {
  const percent = (video.currentTime / video.duration) * 100
  progressBar.style.flexBasis = `${percent}%`
}

// 6. scrub function
const scrub = (e) => {
  // e.offsetX is the point in the progress bar you've clicked on
  // divide by width of progress bar (offsetWidth)...which gives us a percentage. Multiply that value by video's duration
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
  // set currentTime equal to the value of scrubTime
  video.currentTime = scrubTime
}

// 7. Make video play fullscreen
let isFullScreen = false
// check to see if the exitFullscreen method is available on the document
function toggleFullScreen(event) {
  if(isFullScreen) {
    if(document.exitFullscreen) {
      document.exitFullscreen()
      // otherwise, check for browser-specific exit fullscreen functions
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullScreen) {
        document.webkitExitFullScreen()
      } else if (document.msExitFullscreen){
        document.msExitFullscreen()
      } else {
      console.error('Unable to exit fullscreen mode')
    }
  } else {
    // if the user clicks on the full screen button, trigger requestFullscreen function
    if (player.requestFullscreen) {
      player.requestFullscreen()
    } else if(player.webkitRequestFullScreen) {
      player.webkitRequestFullScreen()
    } else if(player.mozRequestFullScreen) {
      player.mozRequestFullScreen()
    } else if (player.msRequestFullscreen) {
      player.msRequestFullScreen()
    } else {
      console.error('Unable to find a fullscreen request method')
    }
  }
}
// toggle the fullscreen classes depending upon the browser
const toggleFullScreenClasses = () => {
  player.classList.toggle('fullscreen')
  // if the isFullScreen variable is true, set it to false and vice-versa
  isFullScreen = !isFullScreen
}


/* Hook Up Event Listeners */
// click screen to start video
video.addEventListener('click', togglePlay)

//listen for when the play button has been clicked, to update the toggle button
video.addEventListener('play', updateButton)

// listen for when the video is paused:
video.addEventListener('pause', updateButton)

// start and stop video when you click the play button
toggle.addEventListener('click', togglePlay)

// listen for a click on any element that has a data-skip attribute
skipButtons.forEach(button => {
  button.addEventListener('click', skip)
})

// listen for changes to sliders (range)
ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate)
})

// listen for mousemove event
ranges.forEach(range => {
  range.addEventListener('mousemove', handleRangeUpdate)
})

// listen for video to emit event timeUpdate
video.addEventListener('timeupdate', handleProgress)

// listen for scrub Event
progress.addEventListener('click', scrub)

// listen for drag to trigger the scrub function.

// Create a flag variable set to false that will toggle to true when clicked
let mousedown = false

// Scrub event handlers:
progress.addEventListener('click', scrub)
// this first checks if mousedown is true and if it is, it will move on to call the scrub function
progress.addEventListener('mousemove', (e) => mousedown && scrub(e))
// set mousedown to true
progress.addEventListener('mousedown', () => mousedown = true)
// when no longer clicked, set mousedown to false
progress.addEventListener('mouseup', () => mousedown = false)

// make screen fullscreen
fullscreen.addEventListener('click', toggleFullScreen)

// toggle fullscreen fullscreen classes
document.addEventListener('fullscreenchange', toggleFullScreenClasses);
document.addEventListener('mozfullscreenchange', toggleFullScreenClasses);
document.addEventListener('webkitfullscreenchange', toggleFullScreenClasses);
document.addEventListener('msfullscreenchange', toggleFullScreenClasses);
