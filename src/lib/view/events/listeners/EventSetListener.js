"use strict"

/*
    EventSetListener

    Manages registering a DOM element for a set of events which will be sent to a delegate
    using a (potentially different) method name. Subclasses override init to define the
    event set by calling this.addEventNameAndMethodName(...) for each event.

*/

window.EventSetListener = ideal.Proto.extend().newSlots({
    type: "EventSetListener",
    element: null,
    delegate: null,
    isListening: false,
    eventsDict: null, // should only write from within class & subclasses
    useCapture: false,
    isDebugging: false,
    methodSuffix: "",
}).setSlots({
    init: function () {
        ideal.Proto.init.apply(this)
        this.setEventsDict({})
        this.setupEventsDict()
        return this
    },

    setupEventsDict: function() {
        // subclasses override to call addEventNameAndMethodName() for their events
        return this
    },

    view: function() {
        return this.element()._divView
    },

    setElement: function(e) {
        assert(e)
        this._element = e
        return this
    },

    setUseCapture: function(v) {
        this._useCapture = v ? true : false;
        //this.setupEventsDict()

        if (this.isListening()) {
            this.stop()
            this.start()
        }

        return this
    },

    // ---

    addEventNameAndMethodName: function(eventName, methodName) {
        let suffix = ""

        if (this.useCapture()) {
            suffix = "Capture"
        }

        suffix += this.methodSuffix()

        this.eventsDict()[eventName] = { 
            methodName: methodName + suffix, 
            handlerFunc: null,
            useCapture: this.useCapture(),
        }

        /*
        if (this.useCapture()) {
            console.log("this.eventsDict()[eventName].methodName = ", this.eventsDict()[eventName].methodName)
        }
        */

        return this
    },

    // ---

    setIsListening: function(aBool) {
        if (aBool) {
            this.start()
        } else {
            this.stop()
        }

        return this
    },

    forEachEventDict: function(func) {
        let eventsDict = this.eventsDict()
        for (let k in eventsDict) {
            if (eventsDict.hasOwnProperty(k)) {
                let eventName = k;
                let eventDict = eventsDict[eventName]
                func(eventName, eventDict);
            }
        }
        return this
    },

    start: function() {
        if (this.isListening()) {
            return this
        }
        this._isListening = true;

        let element = this.element()
        assert(element != null)
        assert(typeof(element) != "undefined")

        this.forEachEventDict((eventName, dict) => {
            dict.handlerFunc = (event) => { 
                let delegate = this.delegate()
                let method = delegate[dict.methodName]
                if (method) {
                    let result = method.apply(delegate, [event]); 

                    if (this.isDebugging()) {
                        console.log("sent: " + delegate.type() + "." + dict.methodName, "(" + event.type + ") and returned ", result)
                    }

                    if (result == false) {
                        event.stopPropagation()
                    }

                    return result
                } else {
                    if (this.isDebugging()) {
                        console.log("MISSING method: " + delegate.type() + "." + dict.methodName, "(" + event.type + ")" )
                    }
                }

                return true
            }
            dict.useCapture = this.useCapture()

            if (this.isDebugging()) {
                console.log("'" +  DomElement_description(element) + ".addEventListener('" + eventName + "', handler, " + dict.useCapture + ")") 
            }

            element.addEventListener(eventName, dict.handlerFunc, dict.useCapture);
        })

        return this
    },

    stop: function() {
        if (!this.isListening()) {
            return this
        }

        this._isListening = false;

        let element = this.element()
        assert(element)

        this.forEachEventDict((eventName, dict) => {
            element.removeEventListener(eventName, dict.handlerFunc, dict.useCapture);
        })

        return this
    },   

})

/*

    // globally track whether we are inside an event 

    setIsHandlingEvent: function() {
        DivView._isHandlingEvent = true
        return this
    },
	
    isHandlingEvent: function() {
        return DivView._isHandlingEvent
    },

    handleEventFunction: function(event, eventFunc) {
        //  a try gaurd to make sure isHandlingEvent has correct value
        //  isHandlingEvent is used to determine if view should inform node of changes
        //  - it should only while handling an event
		
        let error = null
		
        this.setIsHandlingEvent(true)
		
        try {
            eventFunc(event)
        } catch (e) {
            //console.log(e)
            StackTrace.shared().showError(e)
            //error = e
        }
		
        this.setIsHandlingEvent(false)
		
        if (error) {
            throw error
        }
    },
*/