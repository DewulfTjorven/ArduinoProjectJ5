require('../renderer/style.css');
require('../renderer/alarm.mp3');

const { Board, Led, Motion, Button} = require("johnny-five");
const board = new Board({
  repl: false
});

board.on("ready", () => {

  const text = document.querySelector('.text');
  const startButton = document.querySelector('.startButton');
  const activity1Wrapper = document.querySelector('.activity1');
  const activity2Wrapper = document.querySelector('.activity2');
  const activity3Wrapper = document.querySelector('.activity3');
  activity1Wrapper.style.display = 'none';
  activity2Wrapper.style.display = 'none';
  activity3Wrapper.style.display = 'none';



  startButton.addEventListener("click", function(){

    startButton.style.display = 'none';
    // ENTER WAKE UP TIME HERE


    const countDownDate = new Date("Jan 26, 2020 16:10:00").getTime();


    const audio = document.querySelector('#audio');

    // Update the count down every 1 second
    const x = setInterval(function() {

      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.querySelector(".demo").innerHTML = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        
        document.querySelector(".demo").innerHTML = "Tijd om op te staan! Je kunt je wekker af zetten na deze 3 opdrachten";
        activity1Wrapper.style.display = 'block';        

        startButton.style.display ='none';
        text.style.display ='none';

        if(audio){
          setTimeout(() => {
            audio.play();
            audio.loop = true;
          }, 500)
        }

        var led = new Led(13);
        var led1 = new Led(12);
        var led2 = new Led(11);
        const motion = new Motion(7);

        function activity1(){
         
          led.blink();
          const activity1title = document.querySelector('.activity1__title');
          const inputField1 = document.querySelector('.input__field__1');
          const inputField2 = document.querySelector('.input__field__2');
          const submit = document.querySelector('.submit');
          const answer = document.querySelector('.userSumInput');
          const checkBtn = document.querySelector('.check');
          if(activity1Wrapper){
              activity1title.innerHTML = "Geef de som van deze 2 getallen in";
              inputField1.innerHTML = Math.floor(Math.random() * 100);
              inputField2.innerHTML = Math.floor(Math.random() * 100);
            
              submit.addEventListener('click', storeValue);

              function storeValue(){
                localStorage.setItem('answer', answer.value);
              }
              storeValue();
              
              checkBtn.addEventListener('click', checkAnswer);

              function checkAnswer(){
                if(parseInt(localStorage.getItem('answer')) === parseInt(inputField1.innerHTML) + parseInt(inputField2.innerHTML)){
                  led.stop().on();
                  console.log('Answer is correct op naar stap 2');
                  activity2Wrapper.style.display = 'block';
                  activity1Wrapper.style.display = 'none';
                  led1.blink();


                  function activity2(){
                    var button = new Button(2);
                    const buttonPress = document.querySelector('.activity2__number');
                    const randomButtonAmount = Math.floor(Math.random() * 35);
                    const pressTime = document.querySelector('.pressedtime');
                    const reset = document.querySelector('.reset');
                    const checkPressed = document.querySelector('.checkPressed');
                    pressTime.innerHTML = 0;
                    buttonPress.innerHTML = "Druk " + randomButtonAmount + " keer op de knop";

                    button.on("hold", function() {
                      console.log( "Button held" );

                    });
                  
                    button.on("press", function() {
                      console.log( "Button pressed" );
                      pressTime.innerHTML++;
                    });
                  
                    button.on("release", function() {
                      console.log( "Button released" );
                    });
                 
                    reset.addEventListener('click', resetPressedTimes);

                    function resetPressedTimes(){
                      pressTime.innerHTML = 0;
                    }

                    checkPressed.addEventListener('click', checkPressedTimes);

                    function checkPressedTimes(){
                      if(randomButtonAmount == pressTime.innerHTML){
                        console.log("Your pressed the right amount of times, op naar stap 3");
                        led1.stop().on();
                        activity2Wrapper.style.display = 'none';
                        led2.blink();
                        activity3Wrapper.style.display = 'block';

                        function activity3(){
                          // "calibrated" occurs once, at the beginning of a session,
                          motion.on("calibrated", function() {
                            console.log("calibrated");
                          });

                          // "motionstart" events are fired when the "calibrated"
                          // proximal area is disrupted, generally by some form of movement
                          motion.on("motionstart", function() {
                            console.log("motionstart");
                            audio.pause()
                            led2.stop().on();
                            activity3Wrapper.style.display = "none";
                            document.querySelector(".demo").innerHTML = "Je hebt alle proeven doorstaan, Geniet van je dag!" + '<br>' + '<br>' + '<br>' + 'Met dank aan http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3 voor het gebruiken van een annoying alarmsound';
                          });

                          // "motionend" events are fired following a "motionstart" event
                          // when no movement has occurred in X ms
                          motion.on("motionend", function() {
                            console.log("motionend");
                          });
                        }
                        activity3();
                      }
                    }
                  }
                  activity2();
                }
              }
            checkAnswer();
          }
        }
        activity1();
      }
    }, 1000);
  });
});











