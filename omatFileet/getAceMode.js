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
	  changeUrlSh(lang);
	  selectLangOption(lang, editorID);
	  
  }
  else
  {
	  console.log("Tried to use unsupported language in Ace. Resistance is futile.");
  }
}

function selectLangOption(lang, editorID) //Shitty and slow. But I'm not aware of any other way.
{
	var selectIdx = padArray[editorID].selectMode.options.selectedIndex;
	var selectTMOptions = padArray[editorID].selectMode.options;
	if(selectTMOptions[selectIdx].text == lang)
	{
		return;
	}
	for(var i = 0; i < selectTMOptions.length; i++)
	{
		//if(selectTMOptions[i].text == lang && selectTMOptions[i].selected == "0")
		if(selectTMOptions[i].text == lang && selectTMOptions.selectedIndex != i)
		{
			//selectTMOptions[i].selected = "1";
			selectTMOptions.selectedIndex = i;
		}
	}
}

function set(editorID)
{
		  var mode = require("ace/mode/" + gLang).Mode;
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

function changeUrlSh(lang) //move to setAceMode
{
	if(document.URL.indexOf("&sh=") >= 0)
	{		
		var theme = "";
		if(document.URL.indexOf("&theme=") >= 0)
		{
			theme = document.location.toString().split("&theme=")[1]
		}
		if(theme.indexOf("&") >= 0)
		{
			theme = theme.split("&")[0];
		}
		
		theme = "&theme=" + theme;
		
		var curLang = document.URL.toString().split("&sh=")[1];
		if(curLang.indexOf("&") >= 0)
		{
			curLang = curLang.split("&")[0];
		}
		if(curLang == lang)
		{
			return;
		}
		
		var newURL = document.URL.toString().substring(0,document.URL.indexOf("&"));
		//var newURL = document.URL.toString().split("&sh=")[0];
		newURL += "&sh=" + lang + theme;
		document.location = newURL;
		
	}
	else
	{
		var theme = "";
		if(document.URL.indexOf("&theme=") >= 0)
		{
			theme = "&" +  document.location.toString().split("&")[2];
		}
		
		var newURL = document.URL + "&sh=" + lang + theme;
		document.location = newURL;
	}
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