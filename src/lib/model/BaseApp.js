/*
    BaseApp is a singleton that represents the application
    For your application, create a subclass called App and implement
    a custom setup method.
*/

// ---

BaseApp = BMNavNode.extend().newSlots({
    type: "BaseApp",
    name: null,
    browser: null,
    isDebugging: true,
    version: "0.0",
}).setSlots({
    init: function () {
        BMNavNode.init.apply(this)
        this.setNodeMinWidth(150)
		NodeStore.shared().asyncOpen( () => { this.didOpenStore() })
        this.clearAppLog()
    },

	didOpenStore: function() {
		//NodeStore.shared().clear()
        this.setup() 
        this.setupWindow()
        //MenuManager.setup()            
        //this.appLog("app didOpenStore\n")	
	},
    
    setup: function() {
        //console.log("baseSetup")
        //this.fixElectronDropBehavior()
        //this.watchAllAppEvents()
        this.setupBrowser()
        return this        
    },
    
    setupBrowser: function() {
        this.setBrowser(BrowserView.clone().setColumnGroupCount(4).selectFirstColumn())
        this.browser().focusEach() // hack
        return this        
    },
    
    setupWindow: function() {        
        this.browser().setNode(this).syncFromNode()

        var windowContent = document.getElementById('body');
        windowContent.appendChild(this.browser().element())     
        return this
    },
    
    shared: function() {        
        if (!this._shared) {
            this._shared = App.clone();
            
        }
        return this._shared;
    },
    
    mainWindow: function () {
        return Window
    },

    setName: function(aString) {
        this._name = aString
        document.title = this.name()
        return this
    },
    
    /// standard folders
    
/*
    appFolderPath: function () {
        var path = require("path")
        var exePath = __dirname
        var contentsPath = exePath.before("/Resources")
        var parts = contentsPath.split(path.sep)
        parts.push("Resources")
        parts.push("app")
        return parts.join(path.sep)
    },
    
    appFolder: function () {
        return Folder.clone().setPath(this.appFolderPath())
    },
    
    storageFolder: function () {
        return this.appFolder().folderNamed("storage")
    },
    
    toolsFolder: function () {
        return this.appFolder().folderNamed("tools")
    },
	*/
    
    // helpers

    fixElectronDropBehavior: function () {        
        // checks if target div has needed methods, otherwise cancel drop
        /*
        window.addEventListener('resize', (e) => {
            this.browser().onResize(e)
        }, false);

        window.addEventListener('onbeforeunload', function(e) {
            console.log("onbeforeunload")
            var fs = require('fs');
            fs.writeFileSync('/tmp/electron_test', "onbeforeunload");
        }, false);
        */
                
        
        window.addEventListener("dragenter", function(e) {
          if (!e.target.ondragenter) {
            e.preventDefault();
            e.dataTransfer.effectAllowed = "none";
            e.dataTransfer.dropEffect = "none";
          } 
        }, false);

        window.addEventListener("dragover", function(e) {
          //console.log("dragover " +  e.target.className + " " + e.target.ondragover)

          if (!e.target.ondragover) {
            e.preventDefault();
            e.dataTransfer.effectAllowed = "none";
            e.dataTransfer.dropEffect = "none";
          }
        });

        window.addEventListener("drop", function(e) {
          if (!e.target.ondrop) {
            e.preventDefault();
            e.dataTransfer.effectAllowed = "none";
            e.dataTransfer.dropEffect = "none";
          }
        });
    },
    
    // electron app events
    
    /*
    methodNameForEventName: function(eventName) {
        var parts = eventName.split("-")
        var first = parts[0]
        var end = parts.slice(1).join("").capitalizeWords()
        return first + end
    },

    watchForAppEvent: function(eventName) {
        var methodName = this.methodNameForEventName(eventName)
        var app = require('remote').require("app")
                    
        //console.log("watch for app event '" + eventName + "' -> '" + methodName + "'")
        //this.appLog("watching for event '" + eventName + "' -> '" + methodName + "'\n")

        app.on(eventName, () => {
            //NotificationCenter.shared().newNotification().setSender(this).setName(methodName).post()
            //this.appLog("got event '" + eventName + "' -> '" + methodName + "'\n")
            if (this[methodName]) {
                this[methodName].apply(this)
            }
            
        });
    },

    appEventNames: function() {
        return [
            "will-finish-launching", 
            //"ready",
            "window-all-closed",
            "before-quit",
            //"will-quit",
            //"quit",
            "open-file",
            "open-url"
        ];
    },
    
    windowAllClosed: function() {
        //var app = require('remote').require("app")
        //app.quit()
    },
    
    willFinishlaunching: function() {
        NotificationCenter.shared().newNotification().setSender(this).setName("willFinishlaunching").post()
        console.log("willFinishlaunching")
    },
    
    beforeQuit: function() {
        // I think we only need this to shut down subtasks, so far
        console.log("BaseApp.beforeQuit")
        NotificationCenter.shared().setUsesTimeouts(false)
        NotificationCenter.shared().newNotification().setSender(this).setName("beforeQuit").post()
        //NotificationCenter.shared().processPostQueue() // since next event loop will never come
    },
    */
    
    /*
    willQuit: function() {
        console.log("BaseApp.willQuit")
    },
    
    quit: function() {
        console.log("BaseApp.quit")
    },
    */

/*
    watchAllAppEvents: function() {
        this.appEventNames().forEach((eventName) => {
            this.watchForAppEvent(eventName)
        })
    },
  */
  
    /*
    appLogFile: function() {
        return this.appFolder().fileNamed("log.txt")
    },
    */
    
	// --- app log ---
	
    clearAppLog: function() {
        //this.appLogFile().setContents("")
    },
    
    appLog: function(aString) {
        console.log("app logging: " + aString)
        //this.appLogFile().appendString(aString)
        return this
    },

    versionsString: function() {
        var parts = [1]
        /*
        var process = require('remote').require("process")
        var parts = [
            this.name() + " v" + this.version() ,
            "Electron v" + process.versions['electron'], 
            "Chrome v" + process.versions['chrome']
        ]
        */
        return parts.join("\n")
    },
        
    showVersions: function() {
        console.log(this.versionsString())
    }
})
