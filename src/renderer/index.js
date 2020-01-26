const { Board, Led, Motion, Sensor, Button} = require("johnny-five");
const board = new Board({
  repl: false
});

board.on("ready", () => {

  const text = document.querySelector('.text');
  const startButton = document.querySelector('.startButton');
  const activity1Wrapper = document.querySelector('.activity1');
  const activity2Wrapper = document.querySelector('.activity2');
  activity1Wrapper.style.display = 'none';
  activity2Wrapper.style.display = 'none';



  startButton.addEventListener("click", function(){

    // ENTER WAKE UP TIME HERE
    const countDownDate = new Date("Jan 26, 2020 02:08:20").getTime();
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
              inputField1.innerHTML = Math.floor(Math.random() * 50);
              inputField2.innerHTML = Math.floor(Math.random() * 50);
            
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
                    const randomButtonAmount = Math.floor(Math.random() * 10);
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

  
  /*
  // declare new led
  const led = new Led(13);
  
  //declare DOM of button
  const ledButton = document.querySelector('#btn');

  // add an eventlistener to the button and led
  ledButton.addEventListener("click", handleClick);

  // toggle led when clicking the button
  function handleClick() {
    led.toggle();
  }
  */


  /* MOTION SENSOR WHEN USER HAS COMPLETED TESTS
  // Create a new `motion` hardware instance.
  const motion = new Motion(7);

  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    console.log("calibrated");
  });

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function() {
    console.log("motionstart");

  });

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on("motionend", function() {
    console.log("motionend");
  });
  */

});











