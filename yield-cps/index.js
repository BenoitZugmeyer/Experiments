/*jshint esnext: true*/

/* Simple XHR requests */
function request(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    if (xhr.status === 200) {
      callback(null, xhr.response);
    } else {
      callback(new Error(xhr.status));
    }
  };
  xhr.send();
}

var ROOT = 'https://www.healthcare.gov';

/* Error handler */
function handleError(error) {
  console.error(error);
}

/* Current code in ES5: full callbacks */
request(ROOT + '/api/index.json', function (error, index) {
  if (error) {
    return handleError(error);
  }
  request(ROOT + index[0].url + '.json', function (error, article) {
    if (error) {
      return handleError(error);
    }
    console.log(article);
  });
});




/* Generators black magic */
function run(code) {
  var generator = code();

  function callback(error, argument) {
    var res = error ? generator.throw(error) : generator.next(argument);
    if (!res.done) {
      var fn = res.value.shift();
      var args = res.value.slice();
      args.push(callback);
      fn.apply(null, args);
    }
  }

  callback();
}

/* Code using the runner above: no callbacks! */
run(function *() {
  try {
    var index = yield [request, ROOT + '/api/index.json'];
    var article = yield [request, ROOT + index[0].url + '.json'];
    console.log(article);
  }
  catch (e) {
    handleError(e);
  }
});
