

TextField = DivView.extend().newSlots({
    type: "TextField",
	isSelected: false,
	selectedColor: "white",
	unselectedColor: "rgba(255, 255, 255, 0.5)",
}).setSlots({
    init: function () {
        DivView.init.apply(this)
		this.setDisplay("inline-block")
        this.turnOffUserSelect()
		//this.setUnfocusOnEnterKey(true)
		//this.setIsRegisteredForKeyboard(true) // gets set by setContentEditable()
        return this
    },

	setIsSelected: function(aBool) {
	    this._isSelected = aBool
	    this.updateColors()
	    return this
	},
	
	updateColors: function() {
	    if (this.isSelected()) {
	        this.setColor(this.selectedColor())
	    } else {
	        this.setColor(this.unselectedColor())
	    }
	    return this
	},
	
	/*
	cleanReturn: function() {
        var s = this.innerHTML()
        var didReturn = false
        var returnStrings = ["<div><br></div>", "<br>"]
        
        returnStrings.forEach((returnString) => {
            if (s.contains(returnString)) {
                s = s.replaceAll(returnString, "")
                didReturn = true
            }
        })
        
        return didReturn	    
	},
	*/

    didEdit: function() {
        DivView.didEdit.apply(this)
                
        var s = this.innerHTML()
        var didReturn = false
        var returnStrings = ["<div><br></div>", "<br>"]
        
        returnStrings.forEach((returnString) => {
            if (s.contains(returnString)) {
                s = s.replaceAll(returnString, "")
                didReturn = true
            }
        })
        
        if (didReturn) { 
            this.blur()
            this.setInnerHTML(s)
            this.tellParentViews("didInput", this)
            //this.setInput(s)
            //this.setInnerHTML("") 
        }
        
        //console.log(this.typeId() + " didEdit ", aView.innerHTML())
        
        return this
    },
    
    
    /*
    setInput: function(s) {
        var n = this.node()
        if (n) {
            var m = n.nodeInputFieldMethod()
            if (m) {
                n[m].apply(n, [s])
            }
        }
        return this
    },
    
    */
    
    
/*

    // this should be moved to a BrowserRow behavior
    
    
    
	// --- support for begin editing when return is hit ------

    beginEditingOnReturnKey: function() {
		this.setIsRegisteredForKeyboard(true)
		
		return this
    },

	// --- remove return characters when editing title -------

	cleanText: function() {
		console.log(this.type() + " cleanText")
		var s = this.innerHTML()
		s = s.replaceAll("<br>", "")
		s = s.replaceAll("<div></div>", "")
		s = s.replaceAll("<div>", "")
		s = s.replaceAll("</div>", "")
		
		this.setInnerHTML(s)
		return this
	},

	onKeyUp: function(event) {
		//console.log(this.type() + " onKeyUp ", event.keyCode)
		
		if (event.keyCode == 13) { // enter key
			//this.setContentEditable(false)
						
			setTimeout(() => {
				this.blur()
				this.cleanText()
				var p = this.element().parentNode.parentNode
				console.log("blurred self and focusing ", p.className)
				p.focus()
			}, 10)
			
			return true
		}
		
        event.preventDefault()
		event.stopPropagation()
        this.tellParentViews("onDidEdit", this)
		return false
		//return DivView.onKeyUp.apply(this, [event])
	},
*/

})
