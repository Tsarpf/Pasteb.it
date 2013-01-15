
function paste(text, pasteName, pasteLang)
{
	//var pasteName = "pad:" + randomDocName()
	//ToDo evil things with the text
	pasteLang = "//" + pasteLang + '\n';
	sharejs.open("paste:" + pasteName, 'text',  function(error, doc) {
		doc.insert(0, pasteLang);
		doc.insert(pasteLang.length, text);
	});
}

