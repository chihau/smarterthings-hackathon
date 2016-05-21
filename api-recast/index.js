var recast = require('recastai')

const CLIENT = new recast.Client("6e2279f76259410654ada452d8c2404e");

function request(text, callback) {
  if (text != "") {
    CLIENT.textRequest(text, callback);
  } else {
    error(text);
  }
}

request("Are my windows opened?", (res, err) => {
  if (err == null) {
    console.log(res);
  } else {
    console.log("Error: " + err);

  }
});

request("Did I close the windows?", (res, err) => {
  if (err == null) {
    console.log(res);
  } else {
    console.log("Error: " + err);
  }
});
