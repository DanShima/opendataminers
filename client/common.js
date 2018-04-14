function pushData(url, data) {
    data = JSON.stringify(data);
    
   var result = $.ajax({
       type: "POST",
       url: url,
       data:data,
       contentType: "application/json; charset=utf-8",
       dataType: "json"
     });

 return result;
}

function pullData(url, data) {
    
   var result = $.ajax({
       type: "Get",
       url: url,
       data: data,
       contentType: "application/json; charset=utf-8",
       dataType: "json"
     });

 return result;
}