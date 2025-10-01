// SELECT GAME ELEMENTS
const game_button = document.getElementById("toggle");
const instruction_text = document.getElementById("para");
const level_display = document.getElementById("leveltitle");
const lives_container = document.getElementById("lives");
const heart_icons = lives_container.querySelectorAll("span");
const target_color_display = document.getElementById("target");

// GAME CONSTANTS
const available_colors = ["red", "blue", "yellow", "green", "orange", "purple"];
const level_speeds = [750, 600, 450, 300, 200];
const max_level = 5;

// GAME STATE
let current_color_index = 0;
let is_game_running = false;
let color_change_interval = null;
let current_level = 1;
let remaining_lives = 3;
let target_color_index = Math.floor(Math.random() * available_colors.length);

// SET INITIAL GAME ELEMENT STATES
target_color_display.style.color = available_colors[target_color_index];
target_color_display.textContent = available_colors[target_color_index];
game_button.style.backgroundColor = "#C9E4FF";
lives_container.style.visibility = "hidden";

// CREATE AUDIO
const background_music = new Audio("sound/looper.mp3");
background_music.loop = true;
const round_win_sound = new Audio("sound/opening.mp3");
const round_lose_sound = new Audio("sound/round_loss.mp3");
const game_over_sound = new Audio("sound/game_lose.mp3");
const victory_sound = new Audio("sound/winner.mp3");

const audio_elements = [
  background_music,
  round_win_sound,
  round_lose_sound,
  game_over_sound,
  victory_sound,
];

// VOLUME CONTROLS
const volume_slider = document.getElementById("volume_slider");
const volume_display = document.getElementById("volume_display");

function update_volume() {
  const volume = volume_slider.value / 100;
  audio_elements.forEach((audio) => (audio.volume = volume));
  volume_display.textContent = volume_slider.value + "%";
}

volume_slider.addEventListener("input", update_volume);
update_volume();

// CYCLE COLOR FUNCTION
function cycle_color() {
  game_button.style.backgroundColor = available_colors[current_color_index];
  current_color_index = (current_color_index + 1) % available_colors.length;
}

// MAIN GAME LOGIC
game_button.addEventListener("mousedown", function () {
  if (!is_game_running) {
    start_game();
  } else {
    stop_game();
    if (
      game_button.style.backgroundColor === available_colors[target_color_index]
    ) {
      handle_color_match();
      if (current_level > max_level) handle_game_win();
    } else {
      handle_color_mismatch();
      if (remaining_lives === 0) handle_game_over();
    }
  }
});

function start_game() {
  color_change_interval = setInterval(
    cycle_color,
    level_speeds[current_level - 1]
  );
  is_game_running = true;
  level_display.classList.remove("toggle_display");
  lives_container.classList.remove("toggle_display");
  instruction_text.classList.remove("toggle_display");
  background_music.play();
  game_button.textContent = "STOP";
  level_display.textContent = `LEVEL ${current_level}`;
  lives_container.style.visibility = "visible";
  for (let i = 0; i < remaining_lives; i++) {
    heart_icons[i].style.visibility = "visible";
  }
}

function stop_game() {
  clearInterval(color_change_interval);
  is_game_running = false;
  game_button.textContent = "START";
}

function handle_color_match() {
  stop_game();
  round_win_sound.play();
  current_level++;
  target_color_index = Math.floor(Math.random() * available_colors.length);
  target_color_display.style.color = available_colors[target_color_index];
  target_color_display.textContent = available_colors[target_color_index];
}

function handle_color_mismatch() {
  round_lose_sound.play();
  remaining_lives--;
  heart_icons[remaining_lives].style.visibility = "hidden";
}

function handle_game_win() {
  level_display.classList.add("toggle_display");
  lives_container.classList.add("toggle_display");
  instruction_text.classList.add("toggle_display");
  background_music.pause();
  game_button.textContent = "RESTART";
  setTimeout(() => victory_sound.play(), 100);
  for (let i = 0; i < remaining_lives; i++) {
    heart_icons[i].style.visibility = "hidden";
  }
  reset_game_state();
}

function handle_game_over() {
  instruction_text.classList.add("toggle_display");
  game_button.textContent = "RESTART";
  level_display.classList.add("toggle_display");
  background_music.pause();
  game_over_sound.play();
  reset_game_state();
  lives_container.style.visibility = "hidden";
}

function reset_game_state() {
  current_level = 1;
  remaining_lives = 3;
}
