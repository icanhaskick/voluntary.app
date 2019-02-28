"use strict"

/*
    LongPressGestureRecognizer

    Recognize a long press and hold in (roughly) one location.

    Notes:

        Should gesture cancel if press moves?:
        
            1. outside of a distance from start point or
            2. outside of the view


    Delegate messages:

        onLongPressBegin
        onLongPressGestureComplete
        onLongPressGestureCancelled

*/


window.LongPressGestureRecognizer = GestureRecognizer.extend().newSlots({
    type: "LongPressGestureRecognizer",
    timePeriod: 1000, // miliseconds
    timeoutId: null, // private
    downEvent: null,
    upEvent: null,
}).setSlots({
    
    init: function () {
        GestureRecognizer.init.apply(this)
        this.setListenerClasses(["MouseListener", "TouchListener"])
        //this.setIsDebugging(true) 
        return this
    },

    // --- timer ---

    startTimer: function() {
        if (this.timeoutId()) {
            this.stopTimer()
        }
        let tid = setTimeout(() => { this.onLongPress() }, this.timePeriod());
        this.setTimeoutId(tid)
        //console.log("startTimer id",   this.timeoutId())
        return this
    },

    stopTimer: function() {
        if (this.hasTimer()) {
            clearTimeout(this.timeoutId());
            this.setTimeoutId(null)
        }
        return this
    },

    hasTimer: function() {
        return this.timeoutId() != null
    },

    // -- the completed gesture ---

    onLongPress: function() {
        this.setTimeoutId(null)
        let r = this.viewTarget().requestActiveGesture(this)
        if (r) {
            this.sendDelegateMessage("onLongPressGestureComplete")
        }
    },

    // -- single action for mouse and touch up/down ---

    onPressDown: function (event) {
        this.setDownEvent(event)
        this.startTimer()
        this.sendDelegateMessage("onLongPressGestureBegin")
        return true
    },

    onPressUp: function (event) {
        this.setUpEvent(event)
        this.cancel()
        return true
    },

    cancel: function() {
        if (this.hasTimer()) {
            this.stopTimer()
            this.sendDelegateMessage("onLongPressGestureCancelled")
        }
        return this
    },

    // --- events --------------------------------------------------------------------

    // mouse events

    onMouseDown: function (event) {
        return this.onPressDown(event)
    },

    onMouseUp: function (event) {
        return this.onPressUp(event)
    },

    /*
    onMouseUpCapture: function (event) {
        return this.onPressUp(event)
    },
    */

    // touch events

    onTouchStart: function(event) {
        return this.onPressDown(event)
    },

    onTouchEnd: function(event) {
        return this.onPressUp(event)
    },	

    // touch capture

    /*
    onTouchMoveCapture: function(event) {
        //return this.onPressUp(event)
    },

    onTouchCancelCapture: function(event) {
        //return this.onPressUp(event)
    },
	
    onTouchEndCapture: function(event) {
        //return this.onPressUp(event)
    },	
    */

    // helpers

    position: function() {
        let p = Point.clone().setToMouseEventWinPos(this.downEvent())

    },
})
