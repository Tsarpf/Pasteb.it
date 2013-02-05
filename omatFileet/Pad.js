//Global var
var padCount = 0;
var sessionID = "asdf";
var lastPasteName;
var defaultTheme = "0" //aka chrome

function Pad()
{

	var thisID = null;
	
	var	selectOption;
	
	this.selectMode = null;
    this.selectThemeMode = null;
	
	var	pasteButton;
	
	var lastFirstLine = ""; 
		
	this.aceDiv = null;
		
	this.aceEdit = null;
	
	this.urlField = null;
	
	this.initialize = function()
	{
		padCount += 1;
		thisID = padCount - 1;
		//Make an empty div where all parts of the pad are added to for easier managing
//		this.addContainerDiv();
		//new aceEditor with sharejs
		this.addAceEditor();
		//Add the mode/syntax-highlighter option menu
		this.addSelectModeOption();
        //Add the theme option menu
        this.addSelectThemeOption();
		//Add the paste button
		this.addPasteButton();
		
		this.addURLField();
		
		this.addDownloadButton();
        
        this.setDefaultTheme();
		
//		updateExistingDivs();
	}
	
	this.initViewer = function(docName)
	{
		padCount += 1;
		thisID = padCount - 1;
		//Make an empty div where all parts of the pad are added to for easier managing
//		this.addContainerDiv();
		//new aceEditor with sharejs
		this.addAceViewer(docName);
		//Add the mode/syntax-highlighter option menu
		this.addSelectModeOption();
        //Add the theme select option menu
        this.addSelectThemeOption();
		//Add the paste button
		//this.addPasteButton();
		
		this.addRawButton();
		
		this.addDownloadButton();
		
		this.addURLField();
		
		this.urlField.value = "This is a read-only paste.";

        this.setDefaultTheme();
		
//		updateExistingDivs();
	}

		
	this.addAceViewer = function(docName)
	{
		this.aceDiv = document.createElement('div');
		this.aceDiv.setAttribute("id", "editor");
		this.aceDiv.setAttribute("style",
			"position:absolute;top:90px;bottom:0px;right:0px;left:0px;");
		
		this.aceDiv = document.getElementById("main").appendChild(this.aceDiv);
		var aceEditor = ace.edit(this.aceDiv);
		aceEditor.setReadOnly(true);

		sharejs.open(docName, 'text', 'http://pasteb.it:8000/channel', function(error, doc) {
			var text = doc.getText();
			aceEditor.getSession().getDocument().setValue(text);
			checkAndSetLang(thisID, doc);
		});
		this.aceEdit = aceEditor;
	}

	this.addAceEditor = function()
	{
		this.aceDiv = document.createElement('div');
		this.aceDiv.setAttribute("id", "editor");
        this.aceDiv.setAttribute("style",
			"position:absolute;top:90px;bottom:0px;right:0px;left:0px;");
			
        document.getElementById("main").appendChild(this.aceDiv);
		var aceEditor = ace.edit(this.aceDiv);
		
		sharejs.open("" + sessionID + padCount, 'text', 'http://pasteb.it:8000/channel', function(error, doc) {
			doc.attach_ace(aceEditor); 
			console.log("Text: '" + doc.getText() + "'");
			if(doc.getText() == "")
			{
				aceEditor.getSession().getDocument().setValue(helpString); // from helpstring.js
			}
			checkAndSetLang(thisID, doc);
		});
		this.aceEdit = aceEditor;
	}
	
	this.addSelectModeOption = function()
	{
		var selectRef = document.createElement('select');
			selectRef.setAttribute("style","position:absolute;");
			selectRef.style.left = "250px";
			selectRef.style.bottom = "60%";
			selectRef.setAttribute("id", "dropdown");
			selectRef.setAttribute("onchange","optionChange(this.value, " + thisID + ")"); 
			
		var newSelect = document.getElementById("footer").appendChild(selectRef);
		
		for(var i = 0; i < languages.length; i++)
		{
			var option=document.createElement("option");
			option.text=languages[i];
			
			newSelect.add(option, null);
		}
		
		this.selectMode = newSelect;
		
	}	

    this.addSelectThemeOption = function()
    {
        var selectThemeRef = document.createElement('select');
            selectThemeRef.setAttribute("style","position:absolute;");
            selectThemeRef.style.left = "350px";
            selectThemeRef.style.bottom = "60%";
            selectThemeRef.setAttribute("id", "dropdown");
            selectThemeRef.setAttribute("onchange","themeOptionChange(this.value, " + thisID + ")");

        var newSelect = document.getElementById("footer").appendChild(selectThemeRef);

        for(var i = 0; i < themes.length; i++)
        {
            var option = document.createElement("option");
            option.text = themes[i];

            newSelect.add(option, null);
        }

        this.selectThemeMode = newSelect;
    }
	
	this.addDownloadButton = function()
	{
		var button = document.createElement('input');
			button.setAttribute("type","button");
			button.setAttribute("value","Download as file");
			button.setAttribute("style","position:absolute;");
			button.setAttribute("onclick","dowloadButtonClicked(" + (thisID) + ")");
			button.style.bottom = "60%";
			button.style.left = "550px";
			document.getElementById("footer").appendChild(button);
	}
	
	this.addRawButton = function()
	{
		var button = document.createElement('input');
			button.setAttribute("type","button");
			button.setAttribute("value","Raw");
			button.setAttribute("style","position:absolute;");
			button.setAttribute("onclick","window.open(document.location.href.replace('#','raw/'),'rawpaste');");
			button.style.bottom = "15%";
			button.style.left = "600px";
			document.getElementById("footer").appendChild(button);
	}
	
	this.addURLField = function()
	{
		var textField = document.createElement('input');
		textField.setAttribute("type","text");
		textField.setAttribute("style","position:absolute;");
		textField.setAttribute("onclick","this.focus();this.select();");
		textField.style.bottom = "15%";
		textField.style.left = "330px";
		textField.size="35";
		this.urlField = document.getElementById("footer").appendChild(textField);	
	}

	this.addPasteButton = function()
	{
		var button = document.createElement('input');
			button.setAttribute("type","button");
			button.setAttribute("value","Paste");
			button.setAttribute("style","position:absolute;");
			button.setAttribute("onclick","pasteButtonClicked(" + (thisID) + ")");

			button.style.bottom = "15%";
			button.style.left = "250px";
			document.getElementById("footer").appendChild(button);
	}
	
	this.getPaste = function()
	{
		return this.aceEdit.getSession().getValue();
	}

    this.setDefaultTheme = function()
    {
        this.selectThemeMode.options[defaultTheme].selected = "1";
        setAceTheme(themes[defaultTheme], thisID); 
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
		setTimeout("spudre(" + padID + ")",750);
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

    padArray[padID].urlField.select();

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

function themeOptionChange(theme, editorIdx)
{
    setAceTheme(theme, editorIdx);
}


function updateExistingDivs()
{
	var count = padCount;
	for(var i = 0; i < count - 1; i++)
	{
		//padArray[i].padDiv.style.width = "" + (1 / count) * 100 + "%";
		padArray[i].padDiv.style.width = ((1/padCount)*window.innerWidth - 15) + "px";
		padArray[i].padDiv.style.left = "" + (i * (1/padCount) * window.innerWidth) + "px";
		//padArray[i].padDiv.style.width = "768px";
		//padArray[i].padDiv.style.left = i * 768 + "px";
	}
}
