

function submitToserver()
{
    
    var url = baseUrl  + '/adduser';
    var phoneNumber = $('#phone').val();
    var domains = getAllDomains();

    var subsriptions={
        data: {
          addresses: JSON.stringify(locations),
          types: JSON.stringify(domains),
          radius: 500,
          phoneNumber: phoneNumber
     }
    };

pushData(url, subsriptions).then(function(result){
    console.log(result);
});
}

function getAllDomains()
{
    var domains=[];
    $('input[type=checkbox]').each(function () {
        if(this.checked){
            domains.push($(this).val());
        }
    });
    return domains;
}