# microShot : screen shot tool

## usage

### ```L``` Show window List (info by window Table/ appName List)
### ```Right Ctrl``` One shot capture
- ```.secret_targetWindows```の各行とマッチするappNameが対象
- ファイル名は```pix/{appName}_{YYYY}_{M}_{D} {h}_{m}_{s}```

### ```F10``` Start diff notice
- ```.secret_targetAutoWindows```の各行とマッチするappNameが対象
- 変化がある場合、Discordに通知(tolerance:5,interval=5000ms)
- diffチャンネル

### ```F9``` Stop diff notice

## build for test
```npm start```