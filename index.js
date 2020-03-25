const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()
let covid = require('novelcovid');

let countries = require('./population/worldPop.json')
let states = require('./population/USStates.json');


let testObj = {
  cases: 239,
  deaths: 3,
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  let input = msg.content.split('-')
  console.log(input)
  
  if (input[0] === 'covidState'){
    callState(input[1])
      .then(res => {
        msg.reply(input[1] +":"+ print(res, states[input[1]]))
      })
      .catch(err => {
        msg.reply(" State could not be found beep bop wash your hands")
      })
  }
  if(input[0] === 'covidCountry') {
    callCountry(input[1])
      .then(res => {
        let countryObj = countries.find(t => t.country === input[1])
        msg.reply(input[1] +":"+ print(res, countryObj.population))
      })
      .catch(err => {
        msg.reply(" Country could not be found beep bop wash your hands")
      })
  }
  if(input[0] === 'covidTop10'){
    msg.reply(" coming soon");
  }
  if(input[0] === 'covidFTC'){
    
    //ADDING
    msg.reply("What does it mean to “flatten the curve? \n\nThe ideal goal in fighting an epidemic or pandemic is to completely halt the spread. But merely slowing it — mitigation — is critical. This reduces the number of cases that are active at any given time, which in turn gives doctors, hospitals, police, schools and vaccine-manufacturers time to prepare and respond, without becoming overwhelmed. Most hospitals can function with 10 percent reduction in staff, but not with half their people out at once. -NYTimes");
    msg.reply("Find more info here: https://www.nytimes.com/2020/03/11/science/coronavirus-curve-mitigation-infection.html")
  }
  if(input[0] === 'covidSelfQuarantine'){
    
    //ADDING
    msg.reply(" coming soon");
  }
  if(input[0] === 'whatIsCovid19'){
    
    //ADDING
    msg.reply(" coming soon");
  }
  if(input[0] === 'covidCommands'){
    console.log("here")
    msg.reply(printCommands());
  } 
});

client.login(process.env.SECRET);

async function callState(state) {
  
  let data = await covid.getState({state: state})
  return data;
}

async function callCountry(country) {
  let data = await covid.getCountry({country: country})
  return data;
}

function print(data, location) {
  let result = `
    Total Cases: ${data.cases}     Total population percentage: ${(data.cases / location).toFixed(5)}% 
    Total deaths: ${data.deaths}    Total population percentage: ${(data.deaths / location).toFixed(6)}% 
    Would you like to be part of these numbers? No? 
    Then DO NOT FORGET TO WASH YOUR HANDS!!!`

  return result;
}

function printCommands() {
  let result = `
    For any US state: covidState-"stateName"
    For any Country: covidCountry-"countryName"`
    return result;
}