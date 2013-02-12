var UserOptionChange = false;
function checkAndSetLang(thisID, doc)
{
	var text = padArray[thisID].aceEdit.getSession().getDocument().getValue();
	var firstLine = text.split('\n')[0];
	
	if(firstLine != padArray[thisID].lastFirstLine)
	{
		padArray[thisID].lastFirstLine = firstLine;
		if(firstLine.charAt(0) == '/' && firstLine.charAt(1) == '/')
		{
			var lang = firstLine.substring(2); //removes the two leading //'s
			if(supportedAceLang(lang))
			{
				var pos = languages.indexOf(lang);
				padArray[thisID].selectMode.selectedIndex = pos;
				
				 padArray[thisID].aceEdit.getSession().getDocument().setValue(text.substring(firstLine.length + 1));

				setAceMode(lang, thisID);
			}
		}
	}
	setTimeout(function(){checkAndSetLang(thisID, doc)},1000);
}








