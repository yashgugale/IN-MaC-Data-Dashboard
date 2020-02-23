var lastModifiedTimestamp = document.lastModified;
var date = new Date(lastModifiedTimestamp);

// request a weekday along with a long date
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

document.getElementById("lastModified").innerHTML = "Last Modified: <b>" + 
							Intl.DateTimeFormat('en-US', options).format(date) + "</b>";
