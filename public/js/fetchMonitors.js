import dotenv from 'dotenv'
import { popNotification, requireNodeJSmodule } from "./../src/utilityFunctions.js";
//require("dotenv").config();
let isDev = require("electron-is-dev");
const path = require("path");
let { ipcRenderer } = require("electron");


// let CircularJSON = require("circular-json");
dotenv.config();

let installWebWorker = () => {
    console.log("installWebWorker()");
    if (typeof(Worker) !== "undefined") {
        console.log("Web worker supported");
        let monitorsWorker = new Worker("fetchMonitors.js");
    } else {
        console.log("Sorry! No Web Worker support...");
    }   
}; //end installWebWorker()
// installWebWorker();

let fetchMonitors = () => {
    console.log("fetchMonitors()");
    //console.log(`Process:\t ${JSON.stringify(process) }`);
    console.log(`Process.env.zoho:\t ${process.env.ZOHO_TOKEN}`);
    console.dir(`${process}`);

    const API_URL = "https://www.site24x7.com/api/current_status?apm_required=true&group_required=false&locations_required=false&suspended_required=false";
    
    //Function used from:
    let intervalWithWait = (func, wait, times) => {
        var interv = function(w, t){
            return function(){
                if (typeof t === "undefined" || t-- > 0){
                    setTimeout(interv, w);
                    try{
                        func.call(null);
                    }
                    catch(e){
                        t = 0;
                        throw e.toString();
                    }
                }
            };
        }(wait, times);
    
        setTimeout(interv, wait);
    };
    
    let checkMonitorStatus = (monitors) => {
        console.log("Check monitor status");
        let downMonitors = [];
    
        let getMonitorImage = (monitorName) => {
            // console.log("getMonitorImage");
           
            let basePath =  path.join(__dirname, "./img/buttons/");
            let monitorImage;

            switch (monitorName) {
                case "Destiny":
                    monitorImage = "Destiny.png";
                    break;
    
                case "E2020":
                    monitorImage = "Edgenuity.png";
                    break;
                
                case "Helpdesk":
                    monitorImage = "HelpDesk.png";
                    break;
    
                case "IlluminateEd":
                    monitorImage = "Illuminate.png";
                    break;  
    
                case "Outlook":
                    monitorImage = "Outlook.png";
                    break;
    
                case "PowerSchool":
                    monitorImage = "PS.png";
                    break;
    
                case "Print Center":
                    monitorImage = "print-center.png";
                    break;
    
                case "Read180 Hawthorne":
                    monitorImage = "Read180HW-Teacher.png";
                    break;
    
                case "Read180 Lawndale":
                    monitorImage = "Read180LW-Teacher.png";
                    break;
    
                case "Read180 Leuzinger":
                    monitorImage = "Read180LZ-Teacher.png";
                    break;
    
                case "SmarteTools":
                    monitorImage = "smartetools.png";
                    break;
    
                case "TimeClock Plus":
                    monitorImage = "timeclockpluslogo.jpg";
                    break;
    
                default: 
                    monitorImage = "CV-600x600.png";
            }
    
            let fullPath = basePath + monitorImage;
            return fullPath;
        }; //end getMonitorImage()
    
        console.log(`checkMonitorStatus():\t ${JSON.stringify(monitors)}`);
        console.log(monitors[0]);
        let status = "";
        for (let i = 0; i < monitors.length; i++ ) {
            //console.log("checkMonitorStatus() for-loop");
            // console.dir(monitors[0]);
            
            if ( monitors[i]["name"] == "Destiny" ) {
                status = "down";
                let monitorImage = getMonitorImage(monitors[i].name);
                console.log(`${monitors[i].name} is currently down`);
                //downMonitors.push(monitors[i]);
    
                //check that browser supports HTML5 notifications and that the browser has 
            //   if ( self.registration !== "undefined" &&  self.registration ) { 
                popNotification(`${monitors[i].name}`, `${monitors[i].name} is currently down`, monitorImage );
                ipcRenderer.send("toMainProcess", `${monitors[i].name}`, status, monitorImage);
                
            // } 
            /* if (self.registration === "undefined" && !self.registration ) {
                    console.log("Calling alert()");
                    console.log("Type of self.registration:\t" + typeof(self.registration) + "\t" + self.registration );
                    alert(`${monitors[i].name} is currently down`);
                } *///end inner else-statement (check for SW notifications support)
            } //end outer if-statement
    
            /*Check if monitors that were previously down are now back up. */
            if ( typeof(downMonitors[i]) != "undefined") {
                if (downMonitors[i]["status"] === 1) {
                //  if ( self.registration ) { //check that browser supports HTML5 notifications and that the browser has 
                    // popNotification(`${monitors[i].name}`, `${monitors[i].name} is currently down`, getMonitorImage(monitors[i].name) );
                //  } else {
                //     alert(`${monitors[i].name} is back up`);
                // } //end inner else-statement (check for SW notifications support)
    
                    for (let j = 0; j < downMonitors.length; j++ ) {
                        if (downMonitors[i].name === downMonitors[j].name ) {
                            downMonitors.splice( downMonitors.indexOf(downMonitors[j].name), 1 );
                        } //end inner if-statement
                    } //end for-loop
                } //end inner if-statement
            } // end outer if-statement
        } //end for-loop
    }; //end checkMonitorStatus();
    
    let monitors = [];

    let fetchJSON = () => {
        //Even in development, for some reason here, the proxy url is not needed.
        let isDev = false;
        let port = 4000;
        const proxy_URL = `http://localhost:${port}/`;
        // "https://cors-anywhere.herokuapp.com/";
        //${process.env.ZOHO_TOKEN}
        let initObject = {
            method: "GET", 
            headers : { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Zoho-authtoken ${process.env.ZOHO_TOKEN}`,
                "Cache-Control": "no-cache"
            },
        };
        
        let fetchURL = isDev ? (proxy_URL + API_URL) : API_URL; //If in development, use a proxy to bypass CORS restriction
        
        let request = new Request(fetchURL, initObject);
        
        fetch(request) //or use window.fetch(fetchURL, initObject)
            .then( (response) => {
                console.log(response);
                return response.json();
            })
            .then( (myJson) => {
                console.log("JSON:\t" + JSON.stringify(myJson));
                
                monitors = myJson["data"]["monitors"];
                // console.log(`Monitors: ${JSON.stringify(monitors)}`);
        
                return monitors;
            })
            .then( (monitors) => {
                checkMonitorStatus(monitors);
                //hello
                console.log("monitors (return promise)");
            })
            .catch( (error) => {
                console.log('There has been a problem with your fetch operation: ', error.message);
            }); 
    };

    const MINUTES = 5;
    const CHECK_TIME =  1000*60*MINUTES; //Time to check (convert milliseconds to minutes): milliseconds*seconds*minutes

    let runInterval = () => {
        console.log("runInterval");
        // setInterval(jsonFetch, CHECK_TIME);
        intervalWithWait(fetchJSON, CHECK_TIME);
    };

    fetchJSON();
    runInterval();
}; //end fetchMonitors()

fetchMonitors();