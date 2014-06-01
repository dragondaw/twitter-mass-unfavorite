(function()
{
	"use strict";

	var
		timeout,
		reloadTimeout,
		lastUrl,
		started = true,
		reloadDelay = 20000,
		unfavDelay = 1500
	;

	/**
	 * Refresh the state of the application depending on interaction with the page (options or page
	 * loaded).
	 */
	function refresh()
	{
		clearTimeout(timeout);
		clearTimeout(reloadTimeout);

		if( started === true )
		{
			timeout = setTimeout(unfavNext, unfavDelay);
			reloadTimeout = setTimeout(reload, reloadDelay);
		}
	}

	function removeElement(element)
	{
    	element && element.parentNode && element.parentNode.removeChild(element);
	}

	/**
	 * Reload the whole page.
	 */
	function reload()
	{
		if( document.location.href === "https://twitter.com/favorites" )
			document.location.reload();
	}

	/**
	 * Unfavorite the next favorite of the web page.
	 */
	function unfavNext()
	{
		if( document.location.href != "https://twitter.com/favorites" )
			return;

		if( started !== true )
			return;

		window.scrollBy(0,50);

		var favorites = document.querySelectorAll("button.ProfileTweet-actionButtonUndo.js-actionFavorite");
		for( var i=0; i<favorites.length; i++ )
		{
			var favorite = favorites[i];
			if( favorite && !favorite.hidden && getComputedStyle(favorite).display === "inline-block" )
			{
				favorite.click();
				removeElement(favorite);
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