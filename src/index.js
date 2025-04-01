"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const node_screenshots_1 = require("node-screenshots");
const node_global_key_listener_1 = require("node-global-key-listener");
const looksSame = require('looks-same');
const version = "1.0.2";
let prevImage = new Map();
const URL = "https://discord.com/api/webhooks/1356111408231747745/w7jY4QqkdUNHprEdaHen_-aC_xg5XkJzSrVdfRxe3TP3DoPmbiu0eOIzjax37qssHoSC";
let windows = node_screenshots_1.Window.all();
const keyboard = new node_global_key_listener_1.GlobalKeyboardListener();
let auto_diff_flag = false;
console.log(`microShot v${version}`);
console.log("'L' key to print window List.\n'R Ctrl' to Capture.\n'F10' to start auto diff notice. 'F9' to stop.\n'Esc' to exit.");
//説明
keyboard.addListener((event) => {
    //console.log(event); //キーイベント表示
    if (event.name === 'ESCAPE' && event.state === 'DOWN') {
        console.log('Esc key pressed, exiting...');
        process.exit();
    }
    if (event.name === 'L' && event.state === 'DOWN') { //L ウィンドウリストの表示
        windows.forEach((item) => {
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
        windows.forEach((item) => {
            console.log({
                appName: item.appName,
            });
        });
    }
    let date = new Date();
    if (event.name === 'RIGHT CTRL' && event.state === 'DOWN') { //右コントロール　スクショ
        (0, fs_1.readFileSync)("targetWindows.secret", { encoding: "utf-8" }).split("\r\n").forEach((tg_window, i, a) => {
            windows.forEach((item) => {
                if (item.appName == tg_window) {
                    let image = item.captureImageSync();
                    let filename = `pix/${item.appName}_${date.toLocaleString().replace(/\//g, "_").replace(/:/g, "_")}.png`;
                    fs.writeFileSync(filename, image.toPngSync()); //pix以下に保存
                    console.log("saved " + filename);
                }
            });
        });
    }
    if (event.name === 'F10' && event.state === 'DOWN') { //F10
        auto_diff_flag = true;
        console.log("auto_diff_flag=true");
    }
    if (event.name === 'F9' && event.state === 'DOWN') { //F9
        auto_diff_flag = false;
        console.log("auto_diff_flag=false");
    }
});
setInterval(() => {
    if (!auto_diff_flag) {
        return;
    }
    (0, fs_1.readFileSync)("targetAutoWindows.secret", { encoding: "utf-8" }).split("\r\n").forEach((tg_window, i, a) => {
        windows.forEach((item, i) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.appName == tg_window) {
                let image = item.captureImageSync();
                //let filename = `pix/${item.appName}_${date.toLocaleString().replace(/\//g,"_").replace(/:/g,"_")}.png`
                let result;
                if (prevImage.get(i) !== undefined) {
                    result = yield looksSame(prevImage.get(i), image.toPngSync()), { tolerance: 5 };
                    //console.log(result?.equal)
                    if (!(result === null || result === void 0 ? void 0 : result.equal)) {
                        try {
                            const formData = new FormData();
                            formData.append('file', new Blob([image.toPngSync()], { type: 'image/png' }), 'file.png');
                            const response = yield fetch(URL, {
                                method: 'POST',
                                body: formData
                            });
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                prevImage.set(i, image.toPngSync());
            }
        }));
    });
}, 5000);
