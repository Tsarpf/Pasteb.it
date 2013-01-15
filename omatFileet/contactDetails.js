function createContactDetails()
{
cDetails = document.createElement('div');
cDetails.setAttribute("id", "contact");
cDetails.setAttribute("style",
	"position:fixed;bottom:8px;height:15px;right:0px;width:250px");
cDetails.innerHTML = "Contact: 'admin pasteb it' (add @ and . respectively)";
cDetails = document.body.appendChild(this.cDetails);
}