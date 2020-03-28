const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()
let covid = require('novelcovid');

let countries = require('./population/worldPop.json')
let states = require('./population/USStates.json');

let covid19 = "What is COVID-19? \n\nCoronavirus disease 2019 (COVID-19) is a respiratory illness that can spread from person to person. The virus that causes COVID-19 is a novel coronavirus that was first identified during an investigation into an outbreak in Wuhan, China.";
let covid19_moreinfo = "Find more info here: https://www.cdc.gov/coronavirus/2019-ncov/downloads/2019-ncov-factsheet.pdf";

let ftc = "What does it mean to “flatten the curve? \n\nThe ideal goal in fighting an epidemic or pandemic is to completely halt the spread. But merely slowing it — mitigation — is critical. This reduces the number of cases that are active at any given time, which in turn gives doctors, hospitals, police, schools and vaccine-manufacturers time to prepare and respond, without becoming overwhelmed. Most hospitals can function with 10 percent reduction in staff, but not with half their people out at once. -NYTimes";
let ftc_moreinfo= "Find more info here: https://www.nytimes.com/2020/03/11/science/coronavirus-curve-mitigation-infection.html";

let hth1 = "How to Protect Yourself: \n\n- Wash your hands often with soap and water for at least 20 seconds especially after you have been in a public place, or after blowing your nose, coughing, or sneezing.\n- Avoid close contact with people who are sick.";
let hth2 = "How to Protect Others: \n\n- Stay home if you are sick.\n- Cover your mouth and nose with a tissue when you cough or sneeze or use the inside of your elbow.\n- Clean AND disinfect frequently touched surfaces daily. This includes tables, doorknobs, light switches, countertops, handles, desks, phones, keyboards, toilets, faucets, and sinks.";
let hth_moreinfo= "Find more info here: https://www.cdc.gov/coronavirus/2019-ncov/prepare/prevention.html";

let sd1 = "What is Social Distancing? \n\nSocial distancing is deliberately increasing the physical space between people to avoid spreading illness. Staying at least six feet away from other people lessens your chances of catching COVID-19.";
let sdex = "Some examples of Social Distancing: \n\n- Working from home instead of at the office\n- Closing schools or switching to online classes\n- Visiting loved ones by electronic devices instead of in person\n- Cancelling or postponing conferences and large meetings";
let sd_moreinfo = "Find more info here: https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/coronavirus-social-distancing-and-self-quarantine";

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
    callState(toTitleCase(input[1]))
      .then(res => {
        msg.reply(toTitleCase(input[1]) +":"+ print(res, states[toTitleCase(input[1])]))
      })
      .catch(err => {
        msg.reply(" State not found. Beep bop - wash your hands")
      })
  }
  if(input[0] === 'covidCountry') {
    callCountry(toTitleCase(input[1]))
      .then(res => {
        let countryObj = countries.find(t => t.country === toTitleCase(input[1]))
        msg.reply(toTitleCase(input[1]) +":"+ print(res, countryObj.population))
      })
      .catch(err => {
        msg.reply(" Country not found. Beep bop - wash your hands")
      })
  }
  //top 10 stuff starts right here
  if (input[0] === 'covidTop10Deaths') {
    if (input[1].toLowerCase() === 'countries') {
      callSortedCountry('deaths')
        .then(res => {
          let counter = 1;
          let output = "\n";
          res.slice(0, 10).forEach(item => {
            output += `${counter}. ${item.country}: ${item.deaths}\n`;
            counter++;
          });
          msg.reply(output);
        })
        .catch(err => {
          msg.reply("beep bop we have an error, but please wash your hands")
          console.log(err)
        });
    }
    else if (input[1].toLowerCase() === 'states') {
      callAllStates()
        .then(res => {
          let counter = 1;
          let output = "\n";
          res.sort((a, b) => b.deaths - a.deaths);
          res.slice(0, 10).forEach(item => {
            output += `${counter}. ${item.state}: ${item.deaths}\n`;
            counter++;
          });
          msg.reply(output);
        })
        .catch(err => {
          msg.reply("beep bop we have an error, but please wash your hands")
          console.log(err)
        });
    }
    else {
      msg.reply("Error -states, or -countries. But please wash your hands")
    }
  }
  if (input[0] === 'covidTop10Cases') {
    if (input[1].toLowerCase() === 'countries') {
      callSortedCountry('cases')
        .then(res => {
          let counter = 1;
          let output = "\n";
          res.slice(0, 10).forEach(item => {
            output += `${counter}. ${item.country}: ${item.cases}\n`;
            counter++;
          });
          msg.reply(output);
        })
        .catch(err => {
          msg.reply("beep bop we have an error, but please wash your hands")
          console.log(err)
        });
    }
    else if (input[1].toLowerCase() === 'states') {
      callAllStates()
        .then(res => {
          let counter = 1;
          let output = "\n";
          res.sort((a, b) => b.cases - a.cases);
          res.slice(0, 10).forEach(item => {
            output += `${counter}. ${item.state}: ${item.cases}\n`;
            counter++;
          });
          msg.reply(output);
        })
        .catch(err => {
          msg.reply("beep bop we have an error, but please wash your hands")
          console.log(err)
        });
    }
    else {
      msg.reply("Error -states, or -countries. But please wash your hands")
    }
  }
  if(input[0] === 'covidFTC'){
    msg.reply(ftc + "\n\n" + ftc_moreinfo);
  }
  if(input[0] === 'covidSD'){
    msg.reply(sd1 + "\n\n" + sdex + "\n\n" + sd_moreinfo);
  }
  if(input[0] === 'covidHowToHelp'){
    msg.reply(hth1 + "\n\n" + hth2 + "\n\n" + hth_moreinfo);
  }
  if(input[0] === 'whatIsCovid19'){
    msg.reply(covid19 + "\n\n" + covid19_moreinfo);
  }
  if(input[0] === '!help'){
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

async function callSortedCountry(sort) {
  let data = await covid.getCountry({ sort: sort });
  return data;
}

async function callAllStates() {
  let data = await covid.getState();
  return data;
}

/*function print(data, location) {
  let result = `
    Total Cases: ${data.cases}     Total population percentage: ${(data.cases / location).toFixed(5)}% 
    Total deaths: ${data.deaths}    Total population percentage: ${(data.deaths / location).toFixed(6)}% 
    Would you like to be included in this data? No? 
    Then DON'T FORGET TO WASH YOUR HANDS!!!`

  return result;
}*/


/*function print(data, location){
  let result = `
  Population: ${location}   
  Total Cases: ${data.cases}    Total Deaths: ${data.deaths}
  Infections (%): ${(data.cases / location).toFixed(6)}%    Deaths (%): ${(data.deaths / data.cases).toFixed(3)}%  
  Beep bop - Please remember to wash your hands!
  `
  return result;
}*/

function print(data, location){
  var khara = digits_count(numberWithCommas(data.cases));
  var pad = 0;
  if(khara == 3){
    pad = 50;
  }
  else if(khara == 5){
    pad = 50-(1*(khara-3));
  }
  else if(khara == 4){
    pad = 50-(3*(khara-3));
  }
  else if(khara == 6){
    pad = 50-(1*(khara-3));
  }
  else if(khara == 7){
    pad = 50-(1*(khara-3));
  }

  let totalCases = ("Total Cases: ".concat(numberWithCommas(data.cases))).padEnd(pad, ' ');
  let infectionPercent = ("Infections (%): ".concat((data.cases /location).toFixed(7), "%")).padEnd(37,' ');
  let result = `
  Population: ${numberWithCommas(location)}
  ${totalCases} Total Deaths: ${numberWithCommas(data.deaths)}
  ${infectionPercent} Deaths (%): ${(data.deaths / data.cases).toFixed(3)}%  
  Please remember to wash your hands! :microbe: :soap:
  `
  return result;
}

//Helper function - returns total digits within the cases count. Used to calculate padding.
function digits_count(n){
  var count = n.toString().length;
  return count;
}

//Helper function - returns a comma seperated string for the population and total cases.
function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
}


function printCommands() {
  let result = `
    List of COVID-19 Bot Commands:

    Unfamiliar with COVID-19? Type "whatIsCovid19"
    To display top-10 cases per state or country covidTop10Cases-states or -countries
    To display top-10 deaths per state or country covidTop10Deaths-states or -countries
    To display up-to-date numbers for any US state: covidState-"stateName"
    To display up-to-date numbers for any Country: covidCountry-"countryName"
    Want to know how you can help fight COVID-19? Type "covidHowToHelp"
    What is Social Distancing? Type "covidSD"
    What is Flattening the Curve? Type "covidFTC"`
    return result;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}