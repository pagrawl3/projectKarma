var apiKey = "35089512";
var sessionId = "1_MX4zNTA4OTUxMn4xMjcuMC4wLjF-U2F0IEp1bCAxMyAxNjoyOTo0NSBQRFQgMjAxM34wLjU0NzQ2Mzd-";
var token = "T1==cGFydG5lcl9pZD0zNTA4OTUxMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1hYjJkYzE2YzE1N2M1OTQ4MmNhYmRmM2JmMTVlYjgzODNiNmFiMTZlOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDR6TlRBNE9UVXhNbjR4TWpjdU1DNHdMakYtVTJGMElFcDFiQ0F4TXlBeE5qb3lPVG8wTlNCUVJGUWdNakF4TTM0d0xqVTBOelEyTXpkLSZjcmVhdGVfdGltZT0xMzczNzU4MTk5Jm5vbmNlPTAuMDI0MjYyMTkxNjU1MzYwMDMzJmV4cGlyZV90aW1lPTEzNzM4NDQ1OTkmY29ubmVjdGlvbl9kYXRhPQ==";

// Enable console logs for debugging
TB.setLogLevel(TB.DEBUG);

// Initialize session, set up event listeners, and connect
var session = TB.initSession(sessionId);
session.addEventListener('sessionConnected', sessionConnectedHandler);
session.addEventListener('streamCreated', streamCreatedHandler);
session.connect(apiKey, token);
function sessionConnectedHandler(event) {
  var publisher = TB.initPublisher(apiKey, 'me');
  session.publish(publisher);

  // Subscribe to streams that were in the session when we connected
  subscribeToStreams(event.streams);
}

function streamCreatedHandler(event) {
  // Subscribe to any new streams that are created
  subscribeToStreams(event.streams);
}

function subscribeToStreams(streams) {
  for (var i = 0; i < streams.length; i++) {
    // Make sure we don't subscribe to ourself
    if (streams[i].connection.connectionId == session.connection.connectionId) {
      return;
    }

    // Create the div to put the subscriber element in to
    var div = document.createElement('div');
    div.setAttribute('id', 'stream' + streams[i].streamId);
    $(document).ready(function(){
      console.log('hello')
      $('section.chat').prepend(div);
    });
    // Subscribe to the stream
    session.subscribe(streams[i], div.id);
  }
}