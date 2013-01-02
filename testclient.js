var client = require('share').client;

console.log("trying to open sharejs client");
// Open the 'hello' document, which should have type 'text':
//var sharejsopen = client.open('hello', 'text', 'http://pasteb.it:8000/sjs', function(error, doc) {
//var sharejsopen = client.open('hello', 'text', 'http://127.0.0.1:8000/sjs', function(error, doc) {
var sharejsopen = client.open('hello', 'text', {host: 'http://pasteb.it', port: 8000, channel: 'sjs'}, function(error, doc) {
    // Insert some text at the start of the document (position 0):
	console.log(error);
	console.log("logging the whole doc.snapshot:");
    console.log(doc.snapshot);

    doc.on('change', function(op) {
        console.log('Version: ' + doc.version);
    });
});

var i = 0;
function checkState()
{
	console.log(sharejsopen.state + ": " + i);
	i++;
	setTimeout(checkState, 1000);
}


setTimeout(checkState, 1000);

//console.log(sharejsopen);

//var i = 0;
//while(sharejsopen.state == "connecting")
//{
//	console.log(sharejsopen.state + ": " + i );
//	i++;
//}

console.log("reached EOF");