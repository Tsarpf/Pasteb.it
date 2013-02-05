var gEditorIDTheme = "";
var gTheme = "";

function setAceTheme(theme, editorID)
{
   if(supportedAceTheme(theme))
   {
       if(alreadyIncluded(theme))
       {
           setTheme(editorID, theme); 
       }
       else
       {
            includeThemeFile(theme, editorID);
       }
   }
   else
   {
        console.log("Tried to use unsupported theme in Ace. Resistance is futile.");
   }
}

function setTheme(editorID, theme)
{
    //var mode = require("ace/theme/" + theme).Mode;
    //console.log("editorID: " + editorID + " theme: " + theme);
    padArray[editorID].aceEdit.setTheme("ace/theme/" + theme);
}

function includeThemeFile(theme, editorID)
{
    var filename = "http://pasteb.it/acesrc/theme-" + theme + ".js";

    gEditorIDTheme = editorID; 
    gTheme = theme;

    var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
        fileref.setAttribute("onreadystatechange", "function() {if (this.readyState == 'complete') setTheme (gEditorIDTheme, gTheme);}");
        fileref.setAttribute("onload","setTheme(gEditorIDTheme, gTheme)");

    document.getElementsByTagName("head")[0].appendChild(fileref);

    importedThemes.push(theme);
}

function alreadyIncludedTheme(theme)
{
    for(var i = 0; i < themes.length; i++)
    {
        if(importedThemes[i] == theme)
        {
            return true;
        }
    }
    return false;
}

function supportedAceTheme(theme)
{
    for(var i = 0; i < themes.length; i++)
    {
        if (themes[i] == theme)
        {
            return true;
        }
    }
    return false;
}

var importedThemes = new Array();

var themes=new Array
(
"chrome",
"clouds",
"clouds_midnight",
"cobalt",
"crimson_editor",
"dawn",
"dreamweaver",
"eclipse",
"idle_fingers",
"kr_theme",
"merbivore",
"merbivore_soft",
"mono_industrial",
"monokai",
"pastel_on_dark",
"solarized_dark",
"solarized_light",
"textmate",
"tomorrow",
"tomorrow_night_blue",
"tomorrow_night_bright",
"tomorrow_night_eighties",
"tomorrow_night",
"twilight",
"vibrant_ink"
);
