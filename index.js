const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()
var unirest = require("unirest");
let covid = require('novelcovid');



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  let input = msg.content.split('-')
  console.log(input)
  
  if (input[0] === 'covidState'){
    callState(input[1])
      .then(res => {
        printState(input[1])
      })
  }
  if(input[0] === 'covidCountry') {
    callCountry(input[1])
      .then(res => {
        printCountry(input[1]);
      })
      .catch(err => {
        console.log(err);
      })
  }

    
    // callState('Arizona').then((res) => {
    //        msg.reply('Arizona cases: ' + res.cases + '\n' + " Arizona Deaths: " + res.deaths
    // + " Nos va a llevar la verga")
    // }).catch(err => {
    //   console.log(err)
    // })
    
    
    
  // }
});


client.login(process.env.SECRET);

function getStateData(state){

}

async function callState(state) {
  
  let data = await covid.getState({state: state})
  return data;
}

async function callCountry(country) {
  let data = await covid.getCountry({country: country})
}

function printState(data) {
  console.log("I'm print state " + data )
}

function printCountry(data) {
  console.log("I'm print country " + data )
}