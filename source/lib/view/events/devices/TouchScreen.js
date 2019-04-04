"use strict"

/*
    TouchScreen

    Global shared instance that tracks current mouse state in window coordinates.
    Registers for capture events on document.body.

*/


window.TouchScreen = ideal.Proto.extend().newSlots({
    type: "TouchScreen",
    currentEvent: null,
    lastEvent: null,
    touchListener: null,
}).setSlots({
    init: function () {
        ideal.Proto.init.apply(this)
        this.startListening()
        return this
    },

    setCurrentEvent: function(event) {
        if (this._currentEvent !== event) {
            this.setLastEvent(this._currentEvent)
            this._currentEvent = event
        }
        return this
    },

    shared: function() { 
        return this.sharedInstanceForClass(TouchScreen)
    },

    startListening: function() {
        this.setTouchListener(TouchListener.clone().setUseCapture(true).setElement(document.body).setDelegate(this))
        this.touchListener().setIsListening(true)
        return this
    },

    // events

    onTouchBeginCapture: function(event) {
        this.setCurrentEvent(event)
        //this.handleLeave(event)
        return true
    },

    /*
    elementsForEvent: function(event) {
        let elements = [];
        let points = this.pointsForEvent(event)
        points.forEach((point) => {
            let e = document.elementFromPoint(p.x(), p.y());
            if (e) {
                elements.push(e)
            }
        })
        return elements
    },
    */

    lastPointForId: function(id) {
        let lastPoints  = this.pointsForEvent(this.lastEvent())
        return lastPoints.detect(p => p.id() === id)
    },

    currentPointForId: function(id) {
        let currentPoints = this.pointsForEvent(this.currentEvent())
        return currentPoints.detect(p => p.id() === id)
    },

    onTouchMoveCapture: function (event) {
        this.setCurrentEvent(event)
        //this.handleLeave(event)
        return true
    },

    onTouchEndCapture: function(event) {
        this.setCurrentEvent(event)
        //this.handleLeave(event)
        return true
    },

    pointForTouch: function(touch) {
        assert(event.__proto__.constructor === TouchEvent)
        let p = EventPoint.clone()
        p.setId(touch.identifier)
        p.setTarget(touch.target)
        p.set(touch.pageX, touch.pageY)
        p.setTimeToNow()
        p.setToTouchEventWinPos(touch)
        p.setIsDown(true)
        //p.findOverview()
        return p
    },

    justPointsForEvent: function(event) {
        let points = []
        // event.touches isn't a proper array, so we can't enumerate it normally
        let touches = event.touches // all current touches
        for (let i = 0; i < touches.length; i++) {
            let touch = touches[i]
            let p = this.pointForTouch(touch)
            points.append(p)
        }

        return points
    },


    pointsForEvent: function(event) {
        if (!Event_hasCachedPoints(event)) {
            const points = this.justPointsForEvent(event)
            Event_setCachedPoints(event, points)
        }

        return Event_cachedPoints(event)
    },

    currentPoints: function() {
        if (this.currentEvent()) {
            return this.pointsForEvent(this.currentEvent())
        }
        return []
    },

    // There are no standard onTouchLeave & onTouchOver events,
    // so this is an attempt to add them. Only really need them
    // for visual gesture debugging at the moment though.
    
    /*
    sendEventToView: function(eventName, event, aView) {
        // send to listeners instead?
        aView.gestureRecognizers().forEach((gr) => {
            gr[eventName].apply(gr, [event])
        })
        return this
    },

    handleLeave: function(event) {
        // an attempt to add onTouchLeave and onTouchOver events
        let currentPoints = this.pointsForEvent(this.currentEvent())

        currentPoints.forEach((cp) => {
            let lp = this.lastPointForId(cp.id())
            if (lp) {
                let lastView    = lp.overview()
                let currentView = cp.overview()

                // check if overView is the same
                if (lastView !== currentView) {
                    this.sendEventToView("onTouchLeave", event, lastView)
                    this.sendEventToView("onTouchOver", event, currentView)
                }
            } else {
                // this is a new finger
            }
        })

        return this
    },
    */
})