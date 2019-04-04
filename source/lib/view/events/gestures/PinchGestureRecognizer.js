"use strict"

/*

    PinchGestureRecognizer

    Subclass of OrientGestureRecognizer that overrides hasMovedEnough() to 
    check for minDistToBegin.

    Delegate messages:

        onPinchBegin
        onPinchMove
        onPinchComplete
        onPinchCancelled

    Helper methods:

        scale:
            scale // current distance between 1st to fingers down divided by their intitial distance  

*/


window.PinchGestureRecognizer = OrientGestureRecognizer.extend().newSlots({
    type: "PinchGestureRecognizer",
}).setSlots({
    init: function () {
        OrientGestureRecognizer.init.apply(this)
        this.setListenerClasses(["MouseListener", "TouchListener"]) 
        this.setIsDebugging(false)
        return this
    },

    hasMovedEnough: function() {
        const m = this.minDistToBegin()
        const d = this.currentPosition().distanceFrom(this.downPosition())
        //console.log(this.shortTypeId() + ".hasMovedEnough() " + d + ">= min " + m)
        return d >= m
    },
})