#include <FastLED.h>

//Define to save memory (just in case)
#define DATA_PIN      3
#define CLOCK_PIN     13
#define NUM_LEDS      21
#define LED_TYPE      WS2812
#define COLOR_ORDER   GRB

#define BRIGHTNESS

//Define the array of leds
CRGB leds[NUM_LEDS];

//other HSV values defined 
uint8_t hue = 0;
int huespeed = 0;
uint8_t saturation = 0;
uint8_t value = 0;

int emotion = 0;
int typingSpeed = 0;
// int numLEDs = 0;

// #define typeSpeed

//here we go!!!


void setup() {
  Serial.begin(9600);
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS);     //GRB ordering! using defined values above for easy switching
  FastLED.setBrightness(100);                                            // set this lower not to hurt my eyes hahaha

  //---------------- handshaking serial communication goes here ----------//

  // Serial.begin(9600);
  // while (Serial.available() <= 0) {   // when serial just opened
  // Serial.println("hello");   // send a starting message
  // delay(300);          	// wait 300 millisecond

}

void loop() {

  if (Serial.available() > 0) {
    // speed = Serial.parseInt();
    emotion = Serial.parseInt();
    // emotion = 0;
    typingSpeed = Serial.parseInt(); // 0 to 12
    // Serial.print(typingSpeed);

  }
  // typingSpeed = 21;
  // emotion = 0;

// if typeSpeed <= (number)

    //beatsin16 generates sinwave, (bpm, beginning value, end value)
    //according to documentation: beatsin16 generates a 16-bit sine wave at a given BPM, that oscillates within a given range.
        //there is also beatsin8 (i tried this at first!)
        //the value range creates the breathing/pulsing effect 

    int bpm = 10;//10;                                         // "bpm" controls the speed of breathing!
    // int huespeed = 0;                                        
    huespeed = bpm * 3;                                   
    
    // range for BLUE:
    //uint8_t hue = beatsin8(huespeed, 140, 150);           
    //uint8_t saturation = 209;

    if (emotion > 0) {
      // range for RED
      hue = beatsin8(huespeed, 0, 10); 
      saturation = 180;   
      value = beatsin8(bpm, 5, 255);                // generating the sinwave for VALUE

      fill_solid(leds, typingSpeed, CHSV(hue, saturation, value));    // CHSV (hue, saturation, value);
      fadeToBlackBy(leds, NUM_LEDS, 10);
      
      FastLED.show();
    }

    else if (emotion == 0) {
      //idle state
      // Serial.write("hello");
      hue = beatsin8(huespeed, 260, 270); 
      saturation = 60; 
      value = beatsin8(bpm, 5, 255);                // generating the sinwave for VALUE

      fill_solid(leds, typingSpeed, CHSV(hue, saturation, value));    // CHSV (hue, saturation, value);
      fadeToBlackBy(leds, NUM_LEDS, 10);
      
      FastLED.show();

    } 
    
    else if (emotion < 0) {
      hue = beatsin8(huespeed, 140, 150);
      saturation = 255;
      value = beatsin8(bpm, 5, 255);                // generating the sinwave for VALUE

      fill_solid(leds, typingSpeed, CHSV(hue, saturation, value));    // CHSV (hue, saturation, value);
      fadeToBlackBy(leds, NUM_LEDS, 10);
      
      FastLED.show();
    }



// FastLED.show();

}
