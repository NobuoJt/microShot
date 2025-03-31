const fs = require("fs");
import { existsSync, mkdir, mkdirSync, readFileSync } from "fs";
import { readFile } from "fs/promises";
import { Window } from "node-screenshots";
const { GlobalKeyboardListener } = require('node-global-key-listener');

let windows = Window.all();
const keyboard = new GlobalKeyboardListener();

console.log("'L' key to print window List.\n'R Ctrl' to Capture.\n'Esc' to exit.")

keyboard.addListener((event:any) => {//キーボードイベント割り込み(フォーカス無視)
    //console.log(event); //キーイベント表示
    if (event.name === 'ESCAPE' && event.state === 'DOWN') {
        console.log('Esc key pressed, exiting...');
        process.exit();
    }
    if (event.name === 'L' && event.state === 'DOWN') {
        windows.forEach((item:any) => {
            console.table({
                id: item.id,
                appName: item.appName,
                title: item.title,
                currentMonitor: item.currentMonitor.id,
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
                //rotation: item.rotation,
                //scaleFactor: item.scaleFactor,
                //isPrimary: item.isPrimary,
                isMinimized: item.isMinimized,
                isMaximized: item.isMaximized,
            });
        });
        
        windows.forEach((item:any) => {
            console.log({
                appName: item.appName,
            });
        });
    }
    let date=new Date()
    if (event.name === 'RIGHT CTRL' && event.state === 'DOWN') {

        readFileSync(".secret_targetWindows",{encoding:"utf-8"}).split("\r\n").forEach((tg_window,i,a)=>{
            windows.forEach((item:any) => {
                if(item.appName==tg_window){
                    let image=item.captureImageSync()
                    let filename = `pix/${item.appName}_${date.toLocaleString().replace(/\//g,"_").replace(/:/g,"_")}.png`
                    fs.writeFileSync(filename, image.toPngSync());
                    console.log("saved "+filename)
                }
            });
        })
    }
});



