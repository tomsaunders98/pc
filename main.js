async function getData(code = '', data = {}) {
  var url = "https://api.postcodes.io/postcodes/" + code;
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function t_alert(text) {
  document.getElementById("alert").innerHTML = text;
}


function findpc(type, filename, message) {
  postcode = document.getElementById("pc").value;
  error = false;
  //Postcode verification
  //remove spaces:
  pc = postcode.replace(/\s/g, '');

  //Check if contains special characters
  if (/^[A-Za-z0-9]+$/.test(pc) == false) {
    error = true;
  }
  pc = pc.split("");
  //split into inner and outer postcodes
  //Inner postcode is the last 3 characters, so start with that:
  inner_pc = pc.slice(-3)



  //Check if first is number
  if (/^\d+$/.test(inner_pc[0]) == false) {
    error = true;

  }

  //Check outer postcode
  outer_pc = pc.slice(0, -3)


  //Check length  is between 2 and 4
  if (!(outer_pc.length > 1 & outer_pc.length < 5)) {
    error = true;

  }

  //Check if first element is letter
  if (/^\d+$/.test(outer_pc[0]) == true) {
    error = true;

  }

  if (error == true) {
    codetoanswer(1, filename, false);
  } else {
    getData(postcode)
      .then(data => {
        codetoanswer(data["result"]["codes"][type], filename, message);
      })
      .catch((error) => {
        codetoanswer(2, filename, false);
      });
  }


}

async function codetoanswer(answer, filename, message) {
  if (message == false) {
    //Error Handling
    if (answer == 1) {
      t_alert("Please enter a correct postcode.")
    }
    if (answer == 2) {
      t_alert("Our servers are under heavy load, please try again later.")
    }
    if (answer == 3) {
      t_alert("We couldn't find a result for your postcode.")
    }
    return;
  }

  var format = function(d) {
    return {
      code: d.code,
      res: d.res
    }; //Parse data
  }

  //Load prediction data
  d3.csv(filename, format).then(function(data) {
      codes = data.map(x => x.code);
      i = codes.indexOf(answer);

      var result = data[i].res;
      message = message.split("{var}")
      t_alert(message[0] + "<b>" + result + "</b>" + message[1]);

    })
    .catch((error) => {
      codetoanswer(3, filename, false);
    });

}
