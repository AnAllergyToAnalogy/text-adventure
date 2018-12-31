# Text Adventure Game

 A fully editable text-adventure game, for people who don't know how to code.
 
 ### Background
 
  My brother, who doesn't know how to code, said he wanted to make a choose-your-own-adventure text game.
  I know he is familiar with Excel, so I coded this thing up in an afternoon, which just reads the different choices from a 
  .csv file and makes the game based off that. I wanted to keep it simple, so that _creating_ the game with the .csv remained easy for non-coders, so 
  each situation will only have one or two choices, and the user selects a choice by re-typing it. 
  
 ### How to install
 
 Requires __nodejs__, navigate to the folder and type `npm install` You should be good after that.
  
 ### How to play
 
 Just navigate to the folder and type `node play`
 
 At each point you'll be given one or two options of what to do. Type the one you want to do (answers are not case sensitive).
 
 So for example, with the following:
 
                         --------------------------------------------------------------------------------
     
                                                  You see a coin on the ground
     
                         --------------------------------------------------------------------------------
     
     
                                                            Take the coin
     
                                                           Leave the coin
                                                           

You would either type `take the coin` or `leave the coin` and press `< enter >`.

### How to create

The logic for the adventure comes from `choices.csv`. This csv has 6 columns,

`Situation ID`,`Situation Text`,`Choice 1 Text`,`to ID`,`Choice Text 2`,`to ID`.

`Situation ID` can be any string, but must be unique. They're used to define the flow from one situation to the next.

In the above example, `Situation Text` would be `You see a coin on the ground`,
`Choice 1 Text` would be `Take a coin` and `Choice 2 Text` would be `Leave the coin`. 

A user chooses to `Take a coin`, the game will look at the `to ID` column next to that, and find the situation which has a matching `Situation ID`.

`Take a coin` may have a `to ID` of `take_coin`, leading to a situation defined as follows:

`take_coin`,`You take the coin, it's very shiny.`,`Put in pocket`,`pocket_coin`,`Throw away`,`throw_coin`.

You can provide only one choice for a given situation, and the game is cool with that. The user still has to type it in to proceed to the next situation though.

#### Unique Situations
If you want the game to end at a certain point, either by winning or losing, just create a situation without any choices. 
Give it a `situation ID`, and `Situation Text`, but leave the rest blank. 

For example
`pocket_coin`,`You pocket the coin but it was actually a grenade, it explodes and you die.`.


Every game must have a situation with ID `start`, this will be the first one that it loads.

Every game must also have one with ID `end`, this will be shown after any situation that doesn't have choices listed. You can type anything you want but remember it will be shown after both good and bad endings. So should probably just say something like 
`Thanks for playing, game made by me` or something. But it's your game so go nuts. The `end` Situation shouldn't have choices.

#### Debugging
If you run the game and there are problems with your spreadsheet (situation IDs that don't exist, etc) it will tell you and close. So use this to debug.