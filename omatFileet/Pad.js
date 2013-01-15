//Global var
var padCount = 0;
var sessionID = "asdf";
var lastPasteName;


function Pad()
{

	var thisID = null;
	
	var	selectOption;
	
	this.selectMode = null;
	
	var	pasteButton;
	
	var lastFirstLine = ""; 
		
	this.padDiv = null;
		
	this.aceDiv = null;
		
	this.aceEdit = null;
	
	this.urlField = null;
	
	this.initialize = function()
	{
		padCount += 1;
		thisID = padCount - 1;
		//Make an empty div where all parts of the pad are added to for easier managing
		this.addContainerDiv();
		//new aceEditor with sharejs
		this.addAceEditor();
		//Add the mode/syntax-highlighter option menu
		this.addSelectModeOption();
		//Add the paste button
		this.addPasteButton();
		
		this.addURLField();
		
		this.addDownloadButton();
		
		updateExistingDivs();
	}
	
	this.initViewer = function(docName)
	{
		padCount += 1;
		thisID = padCount - 1;
		//Make an empty div where all parts of the pad are added to for easier managing
		this.addContainerDiv();
		//new aceEditor with sharejs
		this.addAceViewer(docName);
		//Add the mode/syntax-highlighter option menu
		this.addSelectModeOption();
		//Add the paste button
		//this.addPasteButton();
		
		this.addRawButton();
		
		this.addDownloadButton();
		
		this.addURLField();
		
		this.urlField.value = "This is a read-only paste.";
		
		updateExistingDivs();
	}
	
	this.addRawButton = function()
	{
		var button = document.createElement('input');
			button.setAttribute("type","button");
			button.setAttribute("value","Raw");
			button.setAttribute("style","position:absolute;");
			button.setAttribute("onclick","window.open(document.location.href.replace('#','raw/'),'rawpaste');");
			button.style.bottom = "96%";
			button.style.right = "5%";
			this.padDiv.appendChild(button);
	}
	
	this.addDownloadButton = function()
	{
		var button = document.createElement('input');
			button.setAttribute("type","button");
			button.setAttribute("value","Download as file");
			button.setAttribute("style","position:absolute;");
			button.setAttribute("onclick","dowloadButtonClicked(" + (thisID) + ")");
			button.style.bottom = "96%";
			button.style.right = "195px";
			this.padDiv.appendChild(button);
	}
	
	this.addContainerDiv = function()
	{
		this.padDiv = document.createElement('div');
		this.padDiv.setAttribute("id","padDiv" + padCount);
		this.padDiv.setAttribute("style",
		"position:absolute;" +
		"overflow:visible;" +
		"top:130px;" +
		"background-color:#FFFAEB;" +
		"border: thick dotted #FFF4D1;" +
		"bottom:25px;" +
		//"height:750px;" +
		//"width:" + ((1/padCount)*window.innerWidth - 50) + "px;" +
		//"left:" + ((1 - 1/padCount) * window.innerWidth) + "px;"
		"width:768px;" +
		"left:" + ((padCount - 1) * 768 + 5) + "px;"
		);
		
		//this.padDiv.style.border="10px #FFEEB8";
		
		document.getElementsByTagName('body')[0].appendChild(this.padDiv);
	}
	
	this.addAceViewer = function(docName)
	{
		this.aceDiv = document.createElement('div');
		this.aceDiv.setAttribute("id", "editor");
		this.aceDiv.setAttribute("style",
			"position:absolute;top:34px;bottom:5px;right:0px;left:0px;");
			//"position:absolute;top:30px;height:700px;right:0px;left:0px;");
		
		this.aceDiv = this.padDiv.appendChild(this.aceDiv);
		var aceEditor = ace.edit(this.aceDiv);
		aceEditor.setReadOnly(true);

		//sharejs.open(docName, 'text', function(error, doc) {
		sharejs.open(docName, 'text', 'http://pasteb.it:8000/channel', function(error, doc) {
			//doc.attach_ace(aceEditor); 
			var text = doc.getText();
			aceEditor.getSession().getDocument().setValue(text);
			aceEditor.setTheme("ace/theme/idle_fingers");
			checkAndSetLang(thisID, doc);
		});
		this.aceEdit = aceEditor;
	}

	this.addAceEditor = function()
	{
		this.aceDiv = document.createElement('div');
		this.aceDiv.setAttribute("id", "editor");
		this.aceDiv.setAttribute("style",
			"position:absolute;top:34px;bottom:5px;right:0px;left:0px;");
			//"position:absolute;top:30px;height:700px;right:0px;left:0px;");
			
		//this.aceDiv.style.width = ((1/padCount)*window.innerWidth - 15) + "px";	
		//this.aceDiv.style.left = "5px";
		this.aceDiv = this.padDiv.appendChild(this.aceDiv);
		var aceEditor = ace.edit(this.aceDiv);
		
		//sharejs.open("" + sessionID + padCount, 'text',  function(error, doc) {
		sharejs.open("" + sessionID + padCount, 'text', 'http://pasteb.it:8000/channel', function(error, doc) {
			doc.attach_ace(aceEditor); 
			aceEditor.setTheme("ace/theme/idle_fingers");
			checkAndSetLang(thisID, doc);
		});
		this.aceEdit = aceEditor;
	}

	this.addSelectModeOption = function()
	{
		var selectRef = document.createElement('select');
			selectRef.setAttribute("style","position:absolute;");
			//selectRef.style.left = styleLeft;
			selectRef.style.bottom = "96%";
			selectRef.setAttribute("id", "dropdown");
			selectRef.setAttribute("onchange","optionChange(this.value, " + thisID + ")"); 
			
		var newSelect = this.padDiv.appendChild(selectRef);
		
		for(var i = 0; i < languages.length; i++)
		{
			var option=document.createElement("option");
			option.text=languages[i];
			
			newSelect.add(option, null);
		}
		
		this.selectMode = newSelect;
		
	}	
	
	this.addURLField = function()
	{
		var textField = document.createElement('input');
		textField.setAttribute("type","text");
		textField.setAttribute("style","position:absolute;");
		textField.setAttribute("onclick","this.focus();this.select();");
		textField.style.bottom = "96%";
		textField.style.left = "160px";
		textField.size="35";
		this.urlField = this.padDiv.appendChild(textField);	
	}

	this.addPasteButton = function()
	{
		var button = document.createElement('input');
			button.setAttribute("type","button");
			button.setAttribute("value","Paste");
			button.setAttribute("style","position:absolute;");
			button.setAttribute("onclick","pasteButtonClicked(" + (thisID) + ")");

			button.style.bottom = "96%";
			button.style.left = "100px";
			this.padDiv.appendChild(button);
	}
	
	this.getPaste = function()
	{
		return this.aceEdit.getSession().getValue();
	}
}

var dowloadButtonClicked = function(padID)
{
	if(document.location.hash)
	{
		window.open(document.location.href.replace('#','download/'),'download');
	}
	else
	{
		pasteButtonClicked(padID);
		//window.open(padArray[padID].urlField.value.replace('#','download/'),'download');
		//setTimeout("window.open(padArray[" + padID + "].urlField.value.replace('#','download/'),'_blank')",1000);
		setTimeout("spudre(" + padID + ")",750);
		//window.open(padArray[padID].urlField.value.replace('#','download/'),'_blank');
	}
}

function spudre(padID)
{
	window.open(padArray[padID].urlField.value.replace('#','download/'),'_self');
}

var pasteButtonClicked = function(padID)
{
	lastPasteName = randomDocName();
	var pos = padArray[padID].selectMode.selectedIndex;
	var pasteLang = languages[pos];
	
	paste(padArray[padID].getPaste(), lastPasteName, pasteLang);
	
	padArray[padID].urlField.value = 'http://' + document.location.host + '/#' + lastPasteName;
}

var randomDocName = function(length) {
  var chars, x;
  if (length == null) {
    length = 10;
  }
  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var name = [];
  for (x = 0; x < length; x++) {
    name.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  return name.join('');
};

function optionChange(lang, editorIdx)
{
	setAceMode(lang, editorIdx);
}

function updateExistingDivs()
{
	var count = padCount;
	for(var i = 0; i < count - 1; i++)
	{
		//padArray[i].padDiv.style.width = "" + (1 / count) * 100 + "%";
		//padArray[i].padDiv.style.width = ((1/padCount)*window.innerWidth - 15) + "px";
		//padArray[i].padDiv.style.left = "" + (i * (1/count) * window.innerWidth) + "px";
		padArray[i].padDiv.style.width = "768px";
		padArray[i].padDiv.style.left = i * 768 + "px";
	}
}
