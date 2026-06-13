const {app,BrowserWindow}=require('electron');
function createWindow(){
 new BrowserWindow({width:255,height:355});
}
app.whenReady().then(createWindow);