const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()
var unirest = require("unirest");
let covid = require('novelcovid');

let specificState

(async () => {
  // Specific Country
 
  
  // Specific State
  //  specificState = await covid.getState({state: 'Arizona'});
  // return console.log(specificState);
})();



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'covidAZ') {

    // (async () => {
    //   let data = await covid.getState({state: 'Arizona'})
    //     msg.reply('Arizona cases: ' + data.deaths + '\n' 
    // + "we will fucking die")
    // })
    callState('Arizona').then((res) => {
           msg.reply('Arizona cases: ' + res.cases + '\n' + " Arizona Deaths: " + res.deaths
    + " Nos va a llevar la verga")
    }).catch(err => {
      console.log(err)
    })
    
    //   msg.reply('Arizona cases: ' + data.deaths + '\n' 
    // + "we will fucking die")
    // console.log(data.deaths)
    
    
  }
});

// let test = await callAPI();
// console.log(test.deaths)

client.login(process.env.SECRET);

function getStateData(state){

}

async function callState(state) {
  
  let data = await covid.getState({state: state})
  return data;
}