import * as fs from "fs";
import { existsSync, mkdir, mkdirSync, readFileSync } from "fs";
import { readFile } from "fs/promises";
import { Window } from "node-screenshots";
import { GlobalKeyboardListener } from 'node-global-key-listener';
const looksSame =require('looks-same');

const version="1.0.1"

let prevImage=new Map();
const URL="https://discord.com/api/webhooks/1356111408231747745/w7jY4QqkdUNHprEdaHen_-aC_xg5XkJzSrVdfRxe3TP3DoPmbiu0eOIzjax37qssHoSC"

let windows = Window.all();
const keyboard = new GlobalKeyboardListener();
let auto_diff_flag=false

console.log(`microShot v${version}`)
console.log("'L' key to print window List.\n'R Ctrl' to Capture.\n'F10' to start auto diff notice. 'F9' to stop.\n'Esc' to exit.")
//説明


keyboard.addListener((event:any) => {//キーボードイベント割り込み(フォーカス無視)
    //console.log(event); //キーイベント表示
    if (event.name === 'ESCAPE' && event.state === 'DOWN') {
        console.log('Esc key pressed, exiting...');
        process.exit();
    }
    if (event.name === 'L' && event.state === 'DOWN') {//L ウィンドウリストの表示
        windows.forEach((item:Window) => {
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
        
        windows.forEach((item:Window) => {//アプリ名のみ
            console.log({
                appName: item.appName,
            });
        });
    }
    let date=new Date()
    if (event.name === 'RIGHT CTRL' && event.state === 'DOWN') {//右コントロール　スクショ

        readFileSync(".secret_targetWindows",{encoding:"utf-8"}).split("\r\n").forEach((tg_window,i,a)=>{
            windows.forEach((item:Window) => {
                if(item.appName==tg_window){
                    let image=item.captureImageSync()
                    let filename = `pix/${item.appName}_${date.toLocaleString().replace(/\//g,"_").replace(/:/g,"_")}.png`
                    fs.writeFileSync(filename, image.toPngSync());//pix以下に保存
                    console.log("saved "+filename)
                }
            });
        })
    }

    if (event.name === 'F10' && event.state === 'DOWN') {//F10
        auto_diff_flag=true
        console.log("auto_diff_flag=true")
    }
    if (event.name === 'F9' && event.state === 'DOWN') {//F9
        auto_diff_flag=false
        console.log("auto_diff_flag=false")
    }
});


setInterval(() => {
    if(!auto_diff_flag){return}
    
    readFileSync(".secret_targetAutoWindows",{encoding:"utf-8"}).split("\r\n").forEach((tg_window,i,a)=>{
        windows.forEach(async (item:Window,i) => {
            
            if(item.appName==tg_window){
                let image=item.captureImageSync()
                //let filename = `pix/${item.appName}_${date.toLocaleString().replace(/\//g,"_").replace(/:/g,"_")}.png`
                let result
                if(prevImage.get(i)!==undefined){
                    result = await looksSame(prevImage.get(i),image.toPngSync()),{tolerance:5}
                    //console.log(result?.equal)
                    if(!result?.equal){
                        try{
                            const formData = new FormData()
                            formData.append('file', new Blob([image.toPngSync()], { type: 'image/png' }), 'file.png')
                            const response = await fetch(URL, {
                                method: 'POST',
                                body: formData
                            });
                        } catch (error) {console.error(error)}
                    }
                }
                prevImage.set(i,image.toPngSync())
                
            }
        });
    })
}, 5000);