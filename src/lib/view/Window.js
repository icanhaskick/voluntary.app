
WebBrowserWindow = ideal.Proto.extend().newSlots({
    type: "WebBrowserWindow",
    //win: null,
    documentBody: DocumentBody.clone(),
}).setSlots({
    init: function () {
        throw new Error("this class is meant to be used as singleton, for now")
        return this
    },
    
 /*  
    win: function() {
        if (!this._win) {
            const remote = require('electron').remote;
            this._win = remote.getCurrentWindow()
        }
        return this._win
    },
*/
    
    width: function () {
        return window.innerWidth
    },

    height: function () {
        return window.innerHeight
    },
    
    setWidth: function (w) {
        console.warn("warning: Window.setWidth() unavailable in browser")
		return this
    },
    
    setHeight: function (h) {
        console.warn("warning: Window.setHeight() unavailable in browser")
		return this
    },
    
    show: function() {
        console.log("Window size " + this.width() + "x" + this.height())
    },

    /*
    isOnPhone: function()
    {
       var userAgent = navigator.userAgent.toLowerCase();
       console.log("userAgent: '" + userAgent + "'")
    },
    */
    
})


Window = WebBrowserWindow
//Window.show()
