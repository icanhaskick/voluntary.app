"use strict"

/*

    BMViewStyles

    Represents the set of styles for a NodeView, e.g. selected, unselected.

    TODO: can we make view styles nodes? recursion?

*/


window.BMViewStyles = ideal.Proto.extend().newSlots({
    type: "BMViewStyles",
    name: "",
    unselected: null,
    selected: null,
    //hover: null, 
    //enabled: null,
    //disabled: null,
}).setSlots({
    init: function () {
        this.setSelected(BMViewStyle.clone())
        this.setUnselected(BMViewStyle.clone())
        //this.setHover(BMViewStyle.clone())
        return this
    },

    states: function() {
        return [this.unselected(), this.selected()]
    },

    isEmpty: function() {
        return this.states().detect(state => !state.isEmpty()) === null
    },

    setToBlackOnWhite: function() {
        this.unselected().setColor("black")
        this.unselected().setBackgroundColor("white")
        this.unselected().setBorderBottom("1px solid #ddd") 

        this.selected().setColor("black")
        this.selected().setBackgroundColor("#eee")
        this.selected().setBorderBottom("1px solid #ddd") // "1px solid #ddd"
        return this
    },

    setToWhiteOnBlack: function() {
        this.unselected().setColor("white")
        this.unselected().setBackgroundColor("black")
        this.unselected().setBorderBottom("none") 

        this.selected().setColor("white")
        this.selected().setBackgroundColor("#444") // change for column?
        this.selected().setBorderBottom("none") 
        return this
    },
    
    setToGrayOnTransparent: function() {        
        this.unselected().setColor("#aaa")
        this.unselected().setBackgroundColor("transparent")
        
        this.selected().setColor("white")
        this.selected().setBackgroundColor("transparent")        
        return this
    },
    
    copyFrom: function(styles) {
        this.selected().copyFrom(styles.selected())
        this.unselected().copyFrom(styles.unselected())
        return this
    },
    
    setBackgroundColor: function(c) {
        this.selected().setBackgroundColor(c)
        this.unselected().setBackgroundColor(c)
        return this        
    },
    
    setColor: function(c) {
        this.selected().setColor(c)
        this.unselected().setColor(c)
        return this        
    },
})
