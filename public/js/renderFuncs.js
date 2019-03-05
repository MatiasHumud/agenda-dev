var currentTab = 0;
showTab(currentTab);

function showTab(n) {
	var x = document.getElementsByClassName("tab");
	x[n].style.display = "block";
	if(n == x.length-1) {
		$('#calendar').fullCalendar('render');
	}
	fixStepIndicator(n);
}

function nextPrev(n) {
	var x = document.getElementsByClassName("tab");
	if (n == 1 && !validateForm()) 
		return false;
	if ((currentTab == 0) && (n == -1)) {
		window.history.back();
		return false;
	}
	x[currentTab].style.display = "none";

	currentTab = currentTab + n;

	if (currentTab >= x.length) {
		document.getElementById("sendDoc").submit();
		return false;
	}

	var y = x[currentTab - n].getElementsByTagName("select");
	for(i = 0;i < y.length; i++)
	{
		$("#"+y[i].name).change();
	}

	showTab(currentTab);
}

function validateForm() {
	// This function deals with validation of the form fields
	var x, y, z, i, valid = true;
	x = document.getElementsByClassName("tab");
	y = x[currentTab].getElementsByTagName("select");
	z = x[currentTab].getElementsByTagName("input");
	// A loop that checks every select field in the current tab:
	for (i = 0; i < y.length; i++) {
		if (y[i].value == "undefined") {
			y[i].className += " invalid";
			valid = false;
			console.log(y[i] + " está indefinido");
		}
		else {
			y[i].className = "form-control";
		}
	}
	// A loop that checks every input field in the current tab:
	for (i = 0; i < z.length; i++) {
		if (z[i].value == "") {
			z[i].className += " invalid";
			valid = false;
			console.log("input " + z[i].name + " está indefinido");
		}
		else {
			z[i].className = "form-control";
		}
	}

	if (valid) {
		document.getElementsByClassName("step")[currentTab].className += " finish";
	}
	return valid;
}

function fixStepIndicator(n) {
	// This function removes the "active" class of all steps...
	var i, x = document.getElementsByClassName("step");
	for (i = 0; i < x.length; i++) {
		x[i].className = x[i].className.replace(" active", "");
	}
	//... and adds the "active" class on the current step:
	x[n].className += " active";
}