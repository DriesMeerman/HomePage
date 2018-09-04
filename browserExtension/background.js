chrome.tabs.onCreated.addListener(function(tab) {
    if (tab.url == 'chrome://newtab/'){

        var url = "";//put the url of where you are hosting the newtab page;
        //Your code below...
        var tabUrl   = encodeURIComponent(tab.url);
        var tabTitle = encodeURIComponent(tab.title);

        //Update the url here.
        chrome.tabs.update(tab.id, {url: url});

        // chrome.tabs.create({ url: url });
    }

});
