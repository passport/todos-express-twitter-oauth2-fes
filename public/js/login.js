function randomString(length) {
   var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

   var result = '';
   for (var i = length; i > 0; --i) { result += CHARS[Math.floor(Math.random() * CHARS.length)]; }
   return result;
 }


window.addEventListener('load', function() {
  
  document.getElementById('siw-twitter').addEventListener('click', function(event) {
    event.preventDefault();
    
    var clientID = document.querySelector('meta[name="twitter-client-id"]').getAttribute('content');
    var redirectURI = 'http://localhost:3000/oauth2/redirect/twitter';
    var scope = 'users.read tweet.read users.read';
    
    console.log(event.target.href)
    console.log(clientID)
    
    var state = randomString(8);
    console.log(state);
    
    var codeChallenge = 'CDADwL30MGrmZ3JyCoihqImCAB_qMg3k'
    var codeChallengeMethod = 'S256'
    
    var url = 'https://twitter.com/i/oauth2/authorize?'
          + 'response_type=code&'
          + 'client_id=' + encodeURIComponent(clientID) + '&'
          + 'redirect_uri=' + encodeURIComponent(redirectURI) + '&'
          + 'scope=' + encodeURIComponent(scope) + '&'
          + 'state=' + encodeURIComponent(state) + '&'
          + 'code_challenge=' + encodeURIComponent(codeChallenge) + '&'
          + 'code_challenge_method=' + encodeURIComponent(codeChallengeMethod)
    
    console.log(url);
    
    window.open(url, '_login', 'top=' + (screen.height / 2 - 275) + ',left=' + (screen.width / 2 - 250) + ',width=500,height=550');
  });
  
  const bc = new BroadcastChannel('authorization_response')
  bc.onmessage = (event) => {
    console.log('got broadcast event');
    console.log(event.data);
    
    
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
    xhr.send(JSON.stringify(event.data));
  }
  
});
