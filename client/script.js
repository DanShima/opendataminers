
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 59.34, lng: 18.06},
      zoom: 7
    });
    map.data.loadGeoJson('vagarbate.geojson');
    map.data.addListener('click', function(e) {
      console.log(e.feature.f);
    });
  }
  // const array = [];
  // axios.get('https://brottsplatskartan.se/api/events/?limit=50')
  //   .then(res => {
  //     res.data.data.forEach(event => {
  //       array.push(event);
  //     });
  // }).then(() => {
  //   axios.get('https://brottsplatskartan.se/api/events/?limit=50&page=2')
  //   .then(res => {
  //     res.data.data.forEach(event => {
  //       array.push(event);
  //     });
  //   }).then(() => {
  //     axios.get('https://brottsplatskartan.se/api/events/?limit=50&page=3')
  //     .then(res => {
  //       res.data.data.forEach(event => {
  //         array.push(event);
  //       });
  //     }).then(() => {
  //       // document.getElementById('list') += `<li>${array.}`
  //       array.forEach(element => {
  //         const marker = new google.maps.Marker({
  //           position: {lat: element.lat, lng: element.lng},
  //           map: map,
  //           title: element.location_string
  //         });
  //         marker.addListener('click', function(event) {
  //           console.log(event);
  //         });

  //         document.getElementById('list').innerHTML += `<li>
  //         ${element.description}
  //         <ul>
  //           <li>${element.content}</li>
  //         </ul>
  //         </li>`;
  //       });
  //     })
  //   })
  // });

  