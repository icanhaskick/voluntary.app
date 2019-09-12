"use strict"

/*

    BMBooleanFieldRowView

*/

BMFieldRowView.newSubclassNamed("BMBooleanFieldRowView").newSlots({
}).setSlots({
    init: function () {
        BMFieldRowView.init.apply(this)

        this.turnOffUserSelect()
        this.keyView().setTransition("all 0.3s")

        this.keyView().setDisplay("inline-block")
        this.valueView().setDisplay("inline-block")
        this.keyView().setMarginLeft(6)

        //this.keyView().setMarginTop(-1)
        this.keyView().setPaddingBottom(1)
        this.valueView().setMarginTop(15)

        this.keyView().parentView().swapSubviews(this.keyView(), this.valueView())
        return this
    },

    createValueView: function() {
        return BooleanView.clone()
    },
	
    booleanView: function() {
        return this.valueView()
    },
    
})
