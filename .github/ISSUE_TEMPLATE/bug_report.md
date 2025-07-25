---
name: Bug report
about: Create a report to help us improve
title: ''
labels: ''
assignees: eouia

---

Before you report the issue, you'd better test/check these first.

1. Remove the module and reinstall again.
https://github.com/MMRIZE/MMM-CalendarExt3#install-or-update

2. Try minimal configuration.
Back up your config, then use the test configuration in the example folder. (rename it to `config.js`, then copy it to the main MM directory)
If it works, the issue would lay on other modules or just your misconfiguration. You can start your trial from it.

3. Activate the front-dev console.
<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>i</kbd> will open the front-dev console (Developer Tools) on your MM Screen.
(Or in some environments, it will be the different key combination like `F12` or `Shift + Command + j`)
In the `console` tab, you can see many helpful logs, including suspicious errors also. 
> `[CX3] Module is not prepared yet, wait a while.` is not an error, just a warning. you can ignore it.)
If you find a suspicious error message that you think is related to the cause, Report me with a screen capture or a snap with your Handy.

When you are using a dumb terminal so you cannot open the front-dev console with a keyboard, you can manually execute the MM on dev mode. (You should STOP `PM2` before this.)
```sh
node --run start:dev
```

4. Report exact information to represent.
To represent your issue, I need these pieces of information.
- Your device :  (e.g. RPI 4B 4GB, MBP M1Max)
- OS & Version : (e.g. RPOS Bullseye, MacOS Sonoma)
- Node, NPM version : (e.g. node 16.4.1, npm 8.5.1)
> you can check with `npm -v` and `node -v`
- MM version : (e.g. 2.25.0)
- How you are running MM. (e.g. Dedicated Electron client, Chrome Browser with Serveronly mode)
- Browser(Electron/Chromium) Version. : (e.g. Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.190 Electron/26.2.4 Safari/537.36)
> You can check this info by typing `navigator.userAgent` in the last line of the console tab of developer tools.

If you think the issue is related to the specific calendar,  Send me your full config file (you may need to rename it as `config.txt` with real ics URL to eouia0819@gmail.com . I understand that calendars are sensitive personal information. However, to determine the exact cause, I need it.
