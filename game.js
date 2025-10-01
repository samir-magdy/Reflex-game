// SELECT GAME ELEMENTS
const game_button = document.getElementById("toggle");
const instruction_text = document.getElementById("para");
const game_title = document.getElementById("title");
const level_display = document.getElementById("leveltitle");
const lives_container = document.getElementById("lives");
const heart_icons = lives_container.querySelectorAll("span");
const target_color_display = document.getElementById("target");

// DECLARE COLOR ARRAY TO BE USED WITH SET-INTERVAL
const available_colors = ["red", "blue", "yellow", "green", "orange", "purple"];
// DECLARE COUNTER COLOR TO BE USED WITH SET-INTERVAL
let current_color_index = 0;

// DECLARE FUNCTION TO PICK A RANDOM COLOR
function get_random_color_index(min, max) {
  let random_color_index = Math.floor(Math.random() * (max - min + 1) + min);
  return random_color_index;
}

// DECLARE FUNCTION TO CHANGE COLORS USING THE COLORS ARRAY AND THE COLOR COUNTER VARIABLES
function cycle_color() {
  game_button.style.backgroundColor = available_colors[current_color_index];
  current_color_index++;
  if (current_color_index >= available_colors.length) {
    current_color_index = 0;
  }
}

// DECLARE GAME RUNNING BOOLEAN
let is_game_running = false;
let color_change_interval = null;

// GENERATE A NEW COLOR ON PAGE RELOAD OR COLOR MATCH (USED BELOW)
let target_color_index = get_random_color_index(0, available_colors.length - 1);

// SET INITIAL GAME ELEMENT STATES
target_color_display.style.color = available_colors[target_color_index];
target_color_display.textContent = available_colors[target_color_index];
game_button.style.backgroundColor = available_colors[target_color_index];
lives_container.style.display = "none";

// CREATE AUDIO FILES
const background_music = new Audio("sound/looper.mp3");
// SET LOOP PROPERTY TO TRUE
background_music.loop = true;
const round_win_sound = new Audio("sound/opening.mp3");
const round_lose_sound = new Audio("sound/round_loss.mp3");
const game_over_sound = new Audio("sound/game_lose.mp3");
const victory_sound = new Audio("sound/winner.mp3");

// CREATE AUDIO OBJECTS ARRAY FOR VOLUME CONTROL
const audio_elements = [background_music, round_win_sound, round_lose_sound, game_over_sound, victory_sound];

// TARGET VOLUME CONTROLS
const volume_slider = document.getElementById("volume_slider");
const volume_display = document.getElementById("volume_display");

// VOLUME LOGIC USING THE VOLUME PROPERTY OF THE AUDIO OBJECT
function update_volume() {
  const volume = volume_slider.value / 100;
  audio_elements.forEach((obj) => {
    obj.volume = volume;
  });
  volume_display.textContent = volume_slider.value + "%";
}

// VOLUME SLIDER EVENT LISTENER
volume_slider.addEventListener("input", update_volume);

// CALL FUNCTION AT ON PAGE LOAD FOR SYNC
update_volume();

// DECLARE LEVEL SPEEDS
const level_speeds = [750, 500, 500, 500, 500];

// INITIALIZE START LEVEL AND MAX LEVEL
let current_level = 1;
const max_level = 5;

// INITIALIZE GAME LIVES AND MIN LIVES
let remaining_lives = 3;
const MIN_LIVES = 0;

// MAIN PROGRAM
game_button.addEventListener("mousedown", function () {
  if (!is_game_running) {
    start_game();
  } else {
    stop_game();
    if (game_button.style.backgroundColor === available_colors[target_color_index]) {
      handle_color_match();
      if (current_level > max_level) {
        handle_game_win();
      }
    } else if (game_button.style.backgroundColor !== available_colors[target_color_index]) {
      handle_color_mismatch();
      if (remaining_lives == MIN_LIVES) {
        handle_game_over();
      }
    }
  }
});

// MAIN FUNCTIONS:

function start_game() {
  color_change_interval = setInterval(cycle_color, level_speeds[current_level - 1]);
  is_game_running = true;
  level_display.classList.remove("toggle_display");
  lives_container.classList.remove("toggle_display");
  background_music.play();
  game_button.textContent = "STOP";
  game_title.textContent = `HOW FAST ARE YOUR REFLEXES?`;
  level_display.textContent = `LEVEL ${current_level}`;
  lives_container.style.display = "block";
  instruction_text.style.display = "block";
  for (let i = 0; i < remaining_lives; i++) {
    heart_icons[i].style.display = "inline";
  }
}

function stop_game() {
  clearInterval(color_change_interval);
  is_game_running = false;
  game_button.textContent = "START";
}

function handle_color_match() {
  clearInterval(color_change_interval);
  is_game_running = false;
  game_button.textContent = "START";
  round_win_sound.play();
  current_level++;
  target_color_index = get_random_color_index(0, available_colors.length - 1);
  target_color_display.style.color = available_colors[target_color_index];
  target_color_display.textContent = available_colors[target_color_index];
}

function handle_color_mismatch() {
  round_lose_sound.play();
  game_title.textContent = "TOO SLOW!";
  remaining_lives--;
  heart_icons[remaining_lives].style.display = "none";
}

function handle_game_win() {
  game_title.textContent = "YOU BEAT ALL THE LEVELS!";
  level_display.classList.add("toggle_display");
  lives_container.classList.add("toggle_display");
  instruction_text.style.display = "none";
  background_music.pause();
  game_button.textContent = "RESTART";
  setTimeout(function () {
    victory_sound.play();
  }, 100);
  for (let i = 0; i < remaining_lives; i++) {
    heart_icons[i].style.display = "none";
  }
  reset_game_state();
}

function handle_game_over() {
  instruction_text.style.display = "none";
  game_title.textContent = "GAME OVER";
  game_button.textContent = "RESTART";
  level_display.textContent = "Click the button to try again!";
  background_music.pause();
  game_over_sound.play();
  reset_game_state();
  lives_container.style.display = "none";
}

function reset_game_state() {
  current_level = 1;
  remaining_lives = 3;
}
