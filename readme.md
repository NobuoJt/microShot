# microShot : screen shot tool
v1.0.2

## usage
```node src/index.js```

### ```L``` Show window List (info by window Table/ appName List)
### ```Right Ctrl``` One shot capture
- ```targetWindows.secret```の各行とマッチするappNameが対象
- ファイル名は```pix/{appName}_{YYYY}_{M}_{D} {h}_{m}_{s}```

### ```F10``` Start diff notice
- ```targetAutoWindows.secret```の各行とマッチするappNameが対象
- 変化がある場合、Discordに通知(tolerance:5,interval=5000ms)
- diffチャンネル

### ```F9``` Stop diff notice

## index.ts→node実行
```npm start``` init
```rs``` リセット

## exe化(moduleが入ってくれない)
```nexe -i src\index.js -o test.exe -t windows-x64-14.15.3 -r .\node_modules\**```