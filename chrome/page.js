(function()
{
	"use strict";

	var
		timeout,
		lastUrl,
		started = true,
		unfavByPage = 15,
		unfavDelay = 1000,
		unfaved = 0
	;

	/**
	 * Refresh the state of the application depending on interaction with the page (options or page
	 * loaded).
	 */
	function refresh()
	{
		clearTimeout(timeout);
		if( started === true )
			timeout = setTimeout( unfavNext, unfavDelay );
	}

	function removeElement(element)
	{
    	element && element.parentNode && element.parentNode.removeChild(element);
	}

	/**
	 * Unfavorite the next favorite of the web page.
	 */
	function unfavNext()
	{
		if( started !== true )
			return;

		if( unfaved >= unfavByPage )
			return document.location.reload();

		var favorites = document.querySelectorAll("button.ProfileTweet-actionButtonUndo.js-actionFavorite");
		for( var i=0; i<favorites.length; i++ )
		{
			var favorite = favorites[0];
			if( favorite && !favorite.hidden )
			{
				favorite.click();
				removeElement(favorite);
				unfaved++;
				break;
			}
		}

		clearTimeout(timeout);
		timeout = setTimeout( unfavNext, unfavDelay );
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

	/**
	 * We have to force the icon to display even when the URL changes in the address bar.
	 */
	function displayIcon()
	{
		if( lastUrl != document.location.href )
			chrome.extension.sendMessage("displayIcon");

		lastUrl = document.location.href;

		setTimeout( displayIcon, 1000 );
	}

	chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
		if( request === "refresh" )
			getOptions();
	});

	displayIcon();
	getOptions();
	refresh();
})();