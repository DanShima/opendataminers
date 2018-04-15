const https = require('https');
const querystring = require('querystring');
const express = require('express');
const app = express();
const haversine = require('haversine');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const inside = require('point-in-polygon');

var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];

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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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

// const users = [
//   {
//     id: 1, 
//     subscribedAddresses: [
//       { 
//         lat: 58.408471, 
//         long: 15.625365, 
//         attribute: 'Home', 
//         types: [
//           'Crimes', 'Roadworks', 'Asteroids', "Trafik", "Police"
//         ],
//         radius: 4000,
//       }
//     ],
//     phoneNumber: '+46722003579',
//     new: {
//       Roadworks: ["2457"],
//       Police: ["37891"],
//       Trafik: ['SE_STA_TRISSID_1_13329739']
//     }
//   },
//   {
//     id: 2,
//     subscribedAddresses: [
//       { 
//         lat: 58.408471, 
//         long: 15.625365, 
//         attribute: 'Home', 
//         types: [
//           'Crimes', 'Roadworks', 'Asteroids', "Police", "Trafik"
//         ],
//         radius: 400,
//       }
//     ],
//     phoneNumber: '+46725534687',
//     new: {
//       Roadworks: [],
//       Police: [],
//       Trafik: []
//     }
//   }
// ];
app.get('/json', (req,res) => {
  fs.writeFile('user.json', JSON.stringify(users, null, 4), err => {
    if(err) {
      return console.log(err);
    } else {
      console.log("it worked");
    }
  });
});
//Loop through users - If event is within your radius, send text based on your type.
app.get('/scenarioett', (req,res) => {
  //Scenario 1 innebär ett larm från polisen - ett mord har hänt.
  var objs = {}
  const users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
  objs['Roadworks'] = JSON.parse(fs.readFileSync('../client/vagarbate.geojson', 'utf8'));
  const result = superduperfunction(objs, 'IDNR', 'BESKRIVNING', users);
  res.send('' +result);
});

app.get('/scenariotva', (req,res) => {
  var objs = {}
  const users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
  objs['Police'] = JSON.parse(fs.readFileSync('../client/policedata2.geojson', 'utf8'));
  const result = superduperfunction(objs, 'id', 'summary', users);
  res.send('' +result);
});

app.get('/scenariotre', (req,res) => {
  var objs = {}
  const users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
  objs['Traffic'] = JSON.parse(fs.readFileSync('../client/trafikverket.geojson', 'utf8'));
  const result = superduperfunction(objs, 'Id', 'Message', users);
  res.send('' +result);
});

app.get('/scenariofyra', (req,res) => {
  let objs;
  let msgs = [];
  const users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
  objs = JSON.parse(fs.readFileSync('../client/SMHIwarnings.json', 'utf8'));
  users.forEach(user => {
    user.subscribedAddresses.forEach(specificAddress => {
      objs.some(healthEvent => {
        // Use some and return to only send 1 SMS
        if(specificAddress.smhiID === healthEvent.area) {
          // Store messages sent to not send duplicates
          let msg = healthEvent.description;
          // check for duplicates
          if (msgs.indexOf(msg) > -1) {
            return true;
          } else {
            msgs.push(msg)
            console.log(healthEvent.description);
            return true;
          }

        }
      });
    });
  });
});
app.get('/scenariofem', (req,res) => {
  var objs = {}
  const users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
  objs['Infrastructure'] = JSON.parse(fs.readFileSync('../client/infrastruktur.geojson', 'utf8'));
  const result = superduperfunction(objs, 'IDNR', 'BESKRIVNING', users);
  res.send('' +result);
});
app.get('/removeusers', (req,res) => {
  fs.writeFile('user.json', JSON.stringify([], null, 4), err => {
    if(err) {
      console.log(err);
    } else {
      res.send('Users removed')
    }
  });
});

app.post('/adduser', (req, res) => {
  const addresses = JSON.parse(req.body.data.addresses);
  console.log(req.body.data);
  const users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
  const newArray = [];
  const SMHIAreas = JSON.parse(fs.readFileSync('../client/SMHIareas.json', 'utf8'));
  
  for(let i = 0; i < addresses.length; i++) {
    let smhiID = ''

    for(let key in SMHIAreas) {
      const polygon = SMHIAreas[key][0];
      if (inside([addresses[i].lat, addresses[i].long], polygon)) {
        smhiID = key;
        break;
      }
    }
    newArray.push(
      {
        lat: addresses[i].lat, 
        lng: addresses[i].long, 
        types: JSON.parse(req.body.data.types), 
        radius: req.body.data.radius,
        smhiID,
      }
    );
  }
  const obj = {
    id: users.length+1,
    subscribedAddresses: newArray,
    phoneNumber: req.body.data.phoneNumber,
    new: {
      Roadworks: [
          "2457"
      ],
      Police: [
          "37891"
      ],
      Trafik: [
          "SE_STA_TRISSID_1_13329739"
      ]
    }
  };
  users.push(obj);
  fs.writeFile('user.json', JSON.stringify(users, null, 4), err => {
    if(err) {
      console.log(err);
    } else {
      console.log("New user added");
    }
  });
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

superduperfunction = (objs, id, title, users) => {
  let result;
  users.forEach(user => {
    // console.log(user);
    user.subscribedAddresses.forEach(specificAddress => {
      for (var key in objs) {
        let count = 0;
        let radius = key === 'Traffic' ? 500 : specificAddress.radius;
        
        if (specificAddress.types.indexOf(key) == -1) {continue;}

        objs[key].features.forEach(f => {
          const reversed = {
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0]
          };
          const regular = {
            latitude: specificAddress.lat,
            longitude: specificAddress.lng
          }
          // console.log(haversine([specificAddress.lat, specificAddress.long], reversed));
          result = haversine(regular, reversed, {unit: 'meter'});
          if (result <= radius) {
              let message = `En händelse har hänt! Från ${Math.round(result)} meter från din sparade adress. Händelsen är: ${f.properties[title]}`;
              console.log(message);
              // console.log(f.properties[id]);
              if (count === 0) {
                // phoneOptions(user.phoneNumber, message);
              }
              count++;
            // console.log(f.properties[id]);
          }
        });
      }
    });
  });
  return result;
}