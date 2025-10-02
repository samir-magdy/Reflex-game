// SELECT GAME ELEMENTS
const game_button = document.getElementById("toggle");
const button_text = document.getElementById("button_text");
const instruction_text = document.getElementById("para");
const level_display = document.getElementById("leveltitle");
const lives_container = document.getElementById("lives");
const heart_icons = lives_container.querySelectorAll("span");
const target_color_display = document.getElementById("target");

// GAME CONSTANTS
const available_colors = [
  "rgb(255, 0, 0)", // red
  "rgb(0, 0, 255)", // blue
  "rgb(160, 100, 45)", // brown (sienna)
  "rgb(0, 128, 0)", // green
  "rgb(255, 165, 0)", // orange
  "rgb(128, 0, 128)", // purple
];
const color_names = ["red", "blue", "brown", "green", "orange", "purple"];
const level_speeds = [750, 600, 500, 400, 280];
const max_level = 5;

// GAME STATE
let current_color_index = 0;
let is_game_running = false;
let color_change_interval = null;
let current_level = 1;
let remaining_lives = 3;
let target_color_index = Math.floor(Math.random() * available_colors.length);
let active_message = null;

// SET INITIAL GAME ELEMENT STATES
target_color_display.style.backgroundColor =
  available_colors[target_color_index];
target_color_display.textContent = color_names[target_color_index];
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

function update_volume() {
  const volume = volume_slider.value / 100;
  audio_elements.forEach((audio) => (audio.volume = volume));
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
    stop_game(game_button.style.backgroundColor);
    console.log(game_button.style.backgroundColor);
    console.log(available_colors[target_color_index]);
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
  // Remove any active game message
  if (active_message) {
    active_message.remove();
    active_message = null;
  }

  color_change_interval = setInterval(
    cycle_color,
    level_speeds[current_level - 1]
  );
  is_game_running = true;
  level_display.classList.remove("toggle_display");
  lives_container.classList.remove("toggle_display");
  instruction_text.classList.remove("toggle_display");
  background_music.play();
  button_text.textContent = "STOP";
  level_display.textContent = `ROUND ${current_level}`;
  lives_container.style.visibility = "visible";
  for (let i = 0; i < remaining_lives; i++) {
    heart_icons[i].style.visibility = "visible";
  }
}

function stop_game() {
  clearInterval(color_change_interval);
  is_game_running = false;
  button_text.textContent = "START";
}

function handle_color_match() {
  stop_game();
  round_win_sound.play();
  current_level++;
  target_color_index = Math.floor(Math.random() * available_colors.length);
  target_color_display.style.backgroundColor =
    available_colors[target_color_index];
  target_color_display.textContent = color_names[target_color_index];
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
  button_text.textContent = "RESTART";
  setTimeout(() => victory_sound.play(), 100);
  for (let i = 0; i < remaining_lives; i++) {
    heart_icons[i].style.visibility = "hidden";
  }

  // Display win message
  const win_message = document.createElement("div");
  win_message.className = "game-message";
  win_message.textContent = "You Win";
  win_message.style.color = "#4ecdc4";
  document.body.appendChild(win_message);
  active_message = win_message;

  reset_game_state();
}

function handle_game_over() {
  instruction_text.classList.add("toggle_display");
  button_text.textContent = "RESTART";
  level_display.classList.add("toggle_display");
  background_music.pause();
  game_over_sound.play();

  // Display game over message
  const game_over_message = document.createElement("div");
  game_over_message.className = "game-message";
  game_over_message.textContent = "Game Over";
  game_over_message.style.color = "#ff4757";
  document.body.appendChild(game_over_message);
  active_message = game_over_message;

  reset_game_state();
  lives_container.style.visibility = "hidden";
}

function reset_game_state() {
  current_level = 1;
  remaining_lives = 3;
}
