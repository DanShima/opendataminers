const https = require('https');
const querystring = require('querystring');
const express = require('express');
const app = express();
const haversine = require('haversine');
const fs = require('fs');


 

const username = 'u479f7a38ac85b8df93b44a266dea8b22';
const password = '68B948E908B479EBCBB01272A272A261';


const key = new Buffer(username + ':' + password).toString('base64');
const options = {
  hostname: 'api.46elks.com',
  path:     '/a1/SMS',
  method:   'POST',
  headers:  {
    'Authorization': 'Basic ' + key
    }
};




// const callback = function(response) {
//   let str = '';
//   response.on('data', function (chunk) {
//     str += chunk;
//   });

//   response.on('end', function () {
//     console.log(str);
//   });
// }

// // Start the web request.
// const request = https.request(options, callback);

// // Send the real data away to the server.
// request.write(postData);

// // Finish sending the request.
// request.end();

const users = [
  {
    id: 1, 
    subscribedAddresses: [
      { 
        lat: 58.408471, 
        long: 15.625365, 
        attribute: 'Home', 
        types: [
          'Crimes', 'Roadworks', 'Asteroids',
        ],
        radius: 1000,
      }
    ],
    phoneNumber: '+46722003579',
    new: {
      Roadworks: ["2457"],
      Police: []
    }
  },
  {
    id: 2,
    subscribedAddresses: [
      { 
        lat: 58.408471, 
        long: 15.625365, 
        attribute: 'Home', 
        types: [
          'Crimes', 'Roadworks', 'Asteroids', "Police"
        ],
        radius: 400,
      }
    ],
    phoneNumber: '+46725534687',
    new: {
      Roadworks: ["2457"],
      Police: ["40710"]
    }
  }
];
//Loop through users - If event is within your radius, send text based on your type.
app.get('/scenarioett', (req,res) => {
  //Scenario 1 innebär ett larm från polisen - ett mord har hänt.
  var objs = {}
  objs['Roadworks'] = JSON.parse(fs.readFileSync('../client/vagarbate.geojson', 'utf8'));
  const result = superduperfunction(objs, 'IDNR', 'BESKRIVNING');
  res.send('' +result);
});

app.get('/scenariotva', (req,res) => {
  var objs = {}
  objs['Police'] = JSON.parse(fs.readFileSync('../client/policedata2.geojson', 'utf8'));
  const result = superduperfunction(objs, 'id', 'summary');
  res.send('' +result);
});

phoneOptions = (number, message) => {
  const postFields = {
    from:    "OpenMiners",
    to:      number,
    message
  };
  const postData = querystring.stringify(postFields);
  const request = https.request(options, response => {
    console.log("Meddelande skickat");
  });
  request.write(postData);
  request.end();
}

app.listen('3000', () => console.log('Server is stared on port 3000'));

superduperfunction = (objs, id, title) => {
  let result;
  users.forEach(user => {
    user.subscribedAddresses.forEach(specificAddress => {
      for (var key in objs) {

        if (specificAddress.types.indexOf(key) == -1) {continue;}

        objs[key].features.forEach(f => {
          const reversed = {
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0]
          };
          const regular = {
            latitude: specificAddress.lat,
            longitude: specificAddress.long
          }
          // console.log(haversine([specificAddress.lat, specificAddress.long], reversed));
          result = haversine(regular, reversed, {unit: 'meter'});
          if (result <= specificAddress.radius) {
            if(user.new[key].indexOf(f.properties[id].toString()) > -1) {
              let message = `En händelse har hänt! Från ${result} meter från din sparade adress. Händelsen är: ${f.properties[title]}`;
              console.log(message);
              console.log(f.properties[id]);
              phoneOptions(user.phoneNumber, message);
            }
            console.log(f.properties[id]);
          }
        });
      }
    });
  });
  return result;
}