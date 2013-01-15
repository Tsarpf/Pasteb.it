var gLang = "";
var gEditorID = "";

function setAceMode(lang, editorID)
{
  if(supportedAceLang(lang))
  {
  gLang = lang;
  gEditorID = editorID;
	  if(alreadyIncluded(lang))
	  {
		  set(editorID);
	  }
	  else
	  {			
			includeModeFile();
	  }
	  
  }
  else
  {
	  console.log("Tried to use unsupported language in Ace. Resistance is futile.");
  }
}

function set(editorID)
{
		  
		  var mode = require("ace/mode/" + gLang).Mode;
		  //var editor = ace.edit(document.getElementById(gEditorID));
		  //var editor = document.getElementById(gEditorID);
		  //var editor = window.aceEditor.getSession()
		  //window.aceEditor.getSession()
		  
		  //editor.getSession().setMode(new mode());

		  padArray[editorID].aceEdit.getSession().setMode(new mode());
}

function includeModeFile()
{
	var filename = "http://pasteb.it/acesrc/mode-" + gLang + ".js";
	
	
	var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);
		fileref.setAttribute("onreadystatechange", "function () {if (this.readyState == 'complete') set(gEditorID);}");
		fileref.setAttribute("onload","set(gEditorID)");
	
    document.getElementsByTagName("head")[0].appendChild(fileref);
	
	importedLanguages.push(gLang);
}



function alreadyIncluded(lang)
{
	for(var i = 0; i < languages.length; i++)
	{
		if(importedLanguages[i] == lang)
		{
			return true;
		}
	}
	return false;
}

function supportedAceLang(lang)
{
	for(var i = 0; i < languages.length; i++)
	{
		if(languages[i] == lang)
		{
			return true;
		}
	}
	return false;
}

var importedLanguages=new Array();


var languages=new Array
(
"c_cpp",
"clojure",
"coffee",
"coldfusion",
"csharp",
"css",
"groovy",
"html",
"java",
"javascript",
"json",
"latex",
"lua",
"markdown",
"ocaml",
"perl",
"php",
"powershell",
"python",
"ruby",
"scad",
"scala",
"scss",
"sql",
"svg",
"textile",
"xml"
);

//<script src="src/mode-javascript.js" type="text/javascript" charset="utf-8"></script>