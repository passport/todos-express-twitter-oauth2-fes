function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}


window.addEventListener('load', function() {
  console.log('REDIRECT LOAD!')
  console.log(window.location);
  
  var response = parseQuery(window.location.search);
  console.log('post response:');
  console.log(response);
  
  console.log(window.opener);
  
  // because window.opener is not available
  // https://twittercommunity.com/t/oauth2-authorization-via-window-open/167249
  
  const bc = new BroadcastChannel('authorization_response')
  bc.postMessage(response);
  
  /*
  window.opener.postMessage({
    type: 'authorization_response',
    response: response
  }, window.location.origin);
  */
});
