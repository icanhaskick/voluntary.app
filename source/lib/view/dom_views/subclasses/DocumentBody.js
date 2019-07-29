"use strict"

/*

    DocumentBody

*/

DomView.newSubclassNamed("DocumentBody").newSlots({
}).setSlots({
    init: function () {
        DomView.init.apply(this)

        window.SyncScheduler.shared().scheduleTargetAndMethod(this, "autoAdjustZoomForMobile")

        // using event intercept phase to grab all events and record them
        // in Mouse.shared() and Keyboard.shared() objects
        
        //this.setIsRegisteredForKeyboard(true, true)
        //this.setIsRegisteredForMouse(true, true)

        setTimeout(() => {
            this.setIsRegisteredForDocumentResize(true)
        })

        Mouse.shared()
        Keyboard.shared()
        TouchScreen.shared()

        return this
    },

    shared: function() {   
        return this.sharedInstanceForClass(DocumentBody)
    },
    
    setupElement: function() {
        document.body._domView = this
        //this._element = document.body
        // get this from element override
    },
    
    element: function() {
        //console.log("returning document.body = ", document.body)
        return document.body
    },
    
    onDocumentResize: function() {
	     window.SyncScheduler.shared().scheduleTargetAndMethod(this, "autoAdjustZoomForMobile")
        //this.autoAdjustZoomForMobile()
    },
    
    autoAdjustZoomForMobile: function() {
        /*
        let w = WebBrowserScreen.shared().width();
        let h = WebBrowserScreen.shared().height();
        
        console.log("screen " + w + "x" + h)

        let z = "100%"
        
        if (w < 800) {
            z = "300%"
        }

        
        this.setZoom(z)
        
        //console.log("DocumentBody windowWidth: " + WebBrowserWindow.shared().width() + " zoom: " + this.zoom() )
        */
        return this
    },
    
    zoomAdjustedWidth: function() {
        return WebBrowserWindow.shared().width() * this.zoomRatio()
    },
    
    zoomAdjustedHeight: function() {
        return WebBrowserWindow.shared().width() * this.zoomRatio()
    },
    
    zoomAdjustedSize: function() {
        return { width: this.zoomAdjustedWidth(), height: this.zoomAdjustedHeight() }
    },

    allDomElements: function() {
        const domElements = this.element().getElementsByTagName("*");
        return domElements
    },
})

