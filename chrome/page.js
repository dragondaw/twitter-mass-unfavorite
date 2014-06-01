(function()
{
	"use strict";

	var
		started = true,
		unfavByPage = 10,
		unfavDelay = 1000,
		unfaved = 0
	;

	/**
	 * Refresh the state of the application depending on interaction with the page (options or page
	 * loaded).
	 */
	function refresh()
	{
		if( started === true )
			unfavNext();
	}

	/**
	 * Unfavorite the next favorite of the web page.
	 */
	function unfavNext()
	{
		if( started !== true )
			return;

		if( unfaved >= unfavByPage )
			return document.location.refresh();

		var next = document.querySelector("button.ProfileTweet-actionButtonUndo.js-actionFavorite");
		if( !next[0] )
			return;

		next.style.width = "50px";
		next.style.height = "50px";

		unfaved++;
		setTimeout( unfavNext, unfavDelay );
	}

	/**
	 * Make a request to the background page for the options chosen by the user if any.
	 */
	function getOptions()
	{
		chrome.extension.sendMessage("optionsRequest", function(response)
		{
			started = response.started;

			refresh();
		});
	}

	chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
		if( request === "refresh" )
			getOptions();
	});

	displayIcon();
	getOptions();
	refresh();
})();