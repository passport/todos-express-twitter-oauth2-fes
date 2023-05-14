function randomString(length) {
  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  var result = '';
  for (var i = length; i > 0; --i) { result += CHARS[Math.floor(Math.random() * CHARS.length)]; }
  return result;
}

function stringifyURIQuery(obj) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
}

function encodeBase64URL(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}


window.addEventListener('load', function() {
  
  var authorizationRequests = {};
  
  document.getElementById('siw-twitter').addEventListener('click', function(event) {
    event.preventDefault();
    
    var clientID = document.querySelector('meta[name="twitter-client-id"]').getAttribute('content');
    var redirectURI = 'http://localhost:3000/oauth2/redirect/twitter';
    var scope = [ 'users.read', 'tweet.read' ];
    var state = randomString(8);
    var verifier = randomString(43);
    
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    window.crypto.subtle.digest("SHA-256", data)
      .then(function(digest) {
        authorizationRequests[state] = {
          verifier: verifier
        }
        
        var url = 'https://twitter.com/i/oauth2/authorize?'
          + stringifyURIQuery({
            response_type: 'code',
            client_id: clientID,
            redirect_uri: redirectURI,
            scope: scope.join(' '),
            state: state,
            code_challenge: encodeBase64URL(digest),
            code_challenge_method: 'S256'
          });
        
        window.open(url, '_login', 'top=' + (screen.height / 2 - 275) + ',left=' + (screen.width / 2 - 250) + ',width=500,height=550');
      });
  });
  
  const bc = new BroadcastChannel('authorization_response')
  bc.onmessage = (event) => {
    console.log('got broadcast event');
    console.log(event.data);
    console.log(event.source);
    console.log(event);
    
    console.log(authorizationRequests);
    
    var req = authorizationRequests[event.data.state];
    
    if (!req) {
      // TODO: throw error
    }
    
    
    var data = event.data;
    data.code_verifier = req.verifier;
    
    // TODO: put scope here
    // TODO: put redirect URI here
    
    var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login/oauth2-code/twitter', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('CSRF-Token', csrfToken);
    xhr.onload = function() {
      console.log(xhr.responseText);
      var json = JSON.parse(xhr.responseText);
      window.location.href = json.location;
    };
    xhr.send(JSON.stringify(data));
  }
  
});
