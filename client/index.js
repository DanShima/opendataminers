

function submitToserver()
{

    var url = baseUrl  + '/adduser';
    var phoneNumber = $('#phone').val();
    var domains = getAllDomains();

    var subscriptions={
        data: {
          addresses: JSON.stringify(locations),
          types: JSON.stringify(domains),
          radius: 500,
          phoneNumber: phoneNumber
     }
    };

pushData(url, subscriptions).then(function(result){
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