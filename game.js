
    // start / stop button
    const toggleGame = document.getElementById('toggle');
    const p = document.getElementById('p');
    // color array
    const colors = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];
    //counter for changing colors
    var color = 0;
    
    //random int function
    function randomColor(min, max){
        let rColor = Math.floor(Math.random() * (max - min + 1) + min) ; 
        return rColor;
    }
    
    //function to change colors using colors[color] and resetting to 0 in [counter] greater that array length
    function changeColor(){
        toggleGame.style.backgroundColor = colors[color];
        color++;
        if(color >= colors.length){
            color = 0;
        }
    }
    
    // set game running boolean  
    var game_running = false;
    //set main so its defined in block code below
    var main = null;
    //select span changeable text
    var target = document.getElementById('target');
    //generate a random number within the colors array lenglth limit
    var newColor = randomColor(0, colors.length - 1);
    //set starter elements to main color
    target.style.color = colors[newColor];
    target.innerText = colors[newColor];
    toggleGame.style.backgroundColor = colors[newColor];
    //define audio files
    const winSound = new Audio('sound/win.mp3');
    const loseSound = new Audio('sound/lose.mp3');
    const gameover = new Audio('sound/gameover.mp3');
    const gamewin = new Audio('sound/gamewin.flac')
    
    const title = document.getElementById('title');
    const level_title = document.getElementById('leveltitle')
    const hearts_container = document.getElementById('lives');
    var hearts = hearts_container.querySelectorAll('span');

    var levels = [750, 500, 350, 250, 150];
    var level = 1;
    var lives = 3;
    hearts_container.style.display = "none";
    //main program    
    toggleGame.addEventListener('mousedown', function(){
        //if game not running
        if(!game_running){
            //start color flicker with setInterval
            main = setInterval(changeColor, levels[level - 1]);
        //new game condition is now true. game is runnung
        game_running = true;
        //change text to STOP
        toggleGame.innerText = "STOP";
        title.innerText = `HOW FAST ARE YOUR REFLEXES?`;
        level_title.innerText = `LEVEL ${level}`;
        hearts_container.style.display = "block";
        p.style.display = "block";
       for(let i = 0 ; i < lives; i++){
            hearts[i].style.display = "inline";
       }
        
        
    }
    else{
        //IF GAME IS RUNNING AND BUTTON IS CLICKED. STOP AT COLOR.
        clearInterval(main);
        // set new game condition to false as game is not running
        game_running = false;
        //change inner text
        toggleGame.innerText = "START";
        //win condition if colors match
        if(toggleGame.style.backgroundColor === colors[newColor]){
            winSound.play();
            level++;
            newColor = randomColor(0, colors.length - 1);
            // set elements to new color
            target.style.color = colors[newColor];
            target.innerText = colors[newColor]
            
            if(level > 5){
                title.innerText = "YOU BEAT ALL THE LEVELS!"
                level_title.innerText = "🎉";
                p.style.display = "none";
                toggleGame.innerText = "CLICK HERE TO PLAY AGAIN!"
                setTimeout(function(){gamewin.play()}, 1000);
                for(let i = 0 ; i < lives; i++){
                    hearts[i].style.display = "none";
                }
                level = 1;
                lives = 3;
            }
                    }else if(toggleGame.style.backgroundColor !== colors[newColor]){
                        loseSound.play();
                        title.innerText = "TOO SLOW!"
                        lives--;
                        
                        console.log(lives)
                        hearts[lives].style.display = "none";

                        if(lives == 0){
                            p.style.display = "none";
                            title.innerText = "GAME OVER";
                            level_title.innerText = "Click the button to try again!";
                            setTimeout(function(){gameover.play()}, 1000);
                        
                            level = 1;
                            lives = 3;
                            hearts_container.style.display = "none";
                        }
                    }}
                })
