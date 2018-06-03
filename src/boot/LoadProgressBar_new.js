"use strict"

/*
    A full page panel that shows load progress.
    While running, displays app name, progress bar, and current loading file name.
    On error, displays an error description.
    Used with JSImporter.

    Automatically sets up in the document when loading this file via:

        window.LoadProgressBar.startWhenReady()

    When all loading is finished, external code should call:

    		window.LoadProgressBar.stop()  

*/

class LoadProgressBar {

    static shared() {
        if (!this.constructor.shared) {
            this.constructor.shared = this.clone()
        }
        return this.constructor.shared
    }

    type() {
        return this.constructor.name
    }

    static clone() {
        var obj = new this()
        obj.init()
        return obj
    }
    
    init() {
        this._error = null;
        // subclasses should override to initialize
    }
    
    // --- elements ------------------------------------------------

    mainElement () {
        return document.getElementById("SpinnerMain")
    }

    iconElement () {
        return document.getElementById("SpinnerIcon")
    }

    middleElement () {
        return document.getElementById("SpinnerMiddle")
    }


    titleElement () {
        return document.getElementById("SpinnerTitle")
    }

    subtitleElement () {
        return document.getElementById("SpinnerSubtitle")
    }

    itemElement () {
        return document.getElementById("SpinnerItem")
    }

    errorElement () {
        return document.getElementById("SpinnerError")
    }

    // --- start ------------------------------------------------

    canStart () {
        return window["JSImporter"] != null
    }

    startWhenReady () {
        if (this.canStart()) {
            this.start()
        } else {
            setTimeout(() => { this.startWhenReady() }, 100)
        }
    }

    start () {
        if (!JSImporter.shared().isDone()) {
            this.setupHtml()
            this.initTitle()
            this.registerForWindowError()
            this.registerForImports()
        }

        if (JSImporter.shared().isDone()) {
            this.stop()
        }
        return this
    }

    setupHtml () {
        document.body.innerHTML = "<div id='SpinnerMain' style='position: absolute; width:100%; height: 100%; background-color: black; z-index: 100000; font-family: AppRegular; letter-spacing: 3px; font-size:13px;'> \
<div id='SpinnerMiddle' \
style='position: relative; top: 50%; transform: translateY(-50%); height: auto; width: 100%; text-align: center;'> \
<div>\
<div id='SpinnerIcon' style='opacity: 0.7; border: 0px dashed yellow; transition: all .6s ease-out; background-image:url(\"icons/appicon.svg\"); background-position: center; background-repeat: no-repeat; height: 60px; width: 100%; background-size: contain;'></div><br> \
</div>\
<div id='SpinnerTitle' style='transition: all .6s ease-out;'></div><br> \
<div id='SpinnerSubtitle' style='transition: all .3s ease-out; letter-spacing: -2.5px;'></div><br> \
<div id='SpinnerItem' style='color: transparent; transition: all 0.3s ease-out;'></div><br> \
<div id='SpinnerError' style='color: red; transition: all .6s ease-out; text-align: center; width: 100%;'></div> \
</div> \
</div>"

	    /*
	    var style = this.middleElement().style
	    style.position = "relative"
        style.top = "50%"
        style.transform = "translateY(-50%)"
        style.height = "auto"
        style.width = "100%"
        style.fontFamily = "AppRegular"
        style.letterSpacing = "3px"
        style.color = "transparent"
        style.textAlign = "center"
        */

        return this
    }

    initTitle () {
        var title = this.titleElement()
        title.style.color = "#aaa"
        title.innerHTML = "PEER LOADING"
        return this
    }

    // --- callabcks ------------------------------------------------

    registerForImports () {
        this._importerUrlCallback = (url) => { this.didImportUrl(url) }
        JSImporter.shared().pushUrlLoadingCallback(this._importerUrlCallback)

        this._importerErrorCallback = (error) => { this.setError(error) }
        JSImporter.shared().pushErrorCallback(this._importerErrorCallback)

        return this
    }

    unregisterForImports () {
        JSImporter.shared().removeUrlCallback(this._importerUrlCallback)
        JSImporter.shared().removeErrorCallback(this._importerErrorCallback)
        return this
    }

    didImportUrl (url) {
        this.incrementItemCount()
        this.setCurrentItem(url.split("/").pop())
        return this
    }

    handleError (errorMsg, url, lineNumber, column, errorObj) {
        if (!this.titleElement()) {
            console.warn("should be unregistered?")
            return false
        }

        this.titleElement().innerHTML = "ERROR"
        var s = "" + errorMsg

        if (url) {
            s += " in " + url.split("/").pop() + " Line: " + lineNumber;  //+ " Column: "" + column;
        }

        /*
		if (errorObj) {
			s += '<br><br>' +  this.stringForError(errorObj).split("\n").join("<br>")
		}
		*/

        this.setError(s)
        return false;
    }

    registerForWindowError () {
        this._windowErrorCallback = (errorMsg, url, lineNumber, column, errorObj) => {
            return this.handleError(errorMsg, url, lineNumber, column, errorObj)
        }
        window.onerror = this._windowErrorCallback
    }

    unregisterForWindowError () {
        var isRegistered = window.onerror === this._windowErrorCallback
        if (isRegistered) {
            window.onerror = null
        }
    }

    /*
    isPresent: function() {
        return this.mainElement() != null
    },
    */

    incrementItemCount () {
        var subtitle = this.subtitleElement()
        if (subtitle) {
            subtitle.style.color = "#666"
            subtitle.innerHTML += "."
        }
        return this
    }

    setCurrentItem (itemName) {
        var item = this.itemElement()
        //item.style.opacity = 0
        item.style.color = "#444"
        //item.currentValue = itemName	
        item.innerHTML = itemName
        /*
    	//setTimeout(() => { 
    	    if (item.currentValue == item.innerHTML) {
    	        item.style.opacity = 1
	        }
    	//}, 0)
*/
        return this
    }

    setError (error) {
        this._error = error
        console.log("LoadProgressBar setError " + error)
        this.errorElement().innerHTML = error
        return this
    }

    error () {
        return this._error
    }

    removeMainElement () {
        var e = this.mainElement()
        if (e) {
            e.parentNode.removeChild(e)
        }
    }

    stop () {
        this.unregisterForWindowError()

        if (!this.error()) {
            this.removeMainElement()
            this.unregisterForImports()
            delete window[this.type()]
        }
        return this
    }
}

LoadProgressBar.shared().startWhenReady()