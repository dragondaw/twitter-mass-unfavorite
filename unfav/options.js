(function()
{
	"use strict";

	var
		started = document.querySelector("#started")
	;

	/**
	 * 	Saves options to localStorage and notify the background page of the changes.
	 */
	function save()
	{
		//Will be stored as string
		localStorage.started = started.checked;

		//Run a CSS animation to let the user know changes had been taken into account.
		document.body.classList.add("saved");
		setTimeout(function(){document.body.classList.remove("saved");},500);

		//Send a message to the background page to inform it options changed.
		chrome.extension.sendMessage("optionsChanged");
	}

	/**
	 * Restores select box state to saved value from localStorage.
 	 */
	function restore()
	{
		started.removeAttribute("checked");

		if( localStorage.started === "true" )
			started.checked = true;
	}

	started.addEventListener('change', save);

	document.addEventListener('DOMContentLoaded', restore);
})();