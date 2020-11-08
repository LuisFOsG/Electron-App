const { app, BrowserWindow, Menu, ipcMain} = require("electron");
const url = require("url");
const path = require("path");

if(process.env.NODE_ENV !== "production"){
    require("electron-reload")(__dirname, {
        electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
    });
}

let mainWindow;
let nuevaNota;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/index.html"),
        protocol: "file",
        slashes: true,
    }));

    const menuPrincipal = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menuPrincipal);

    mainWindow.on("closed", () => {
        app.quit();
    })
});

function creandoNuevaVentana() {
    nuevaNota = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        },
        width: 400,
        height: 330,
        title: "Agregando Nuevo Producto",
    })
    /* nuevaNota.setMenu(null); */
    nuevaNota.loadURL(url.format({
        pathname: path.join(__dirname, "views/notas.html"),
        protocol: "file",
        slashes: true,
    }))
    nuevaNota.on("closed", () => {
        nuevaNota = null;
    })
}

ipcMain.on("Nueva Nota", (e, nuevaNot) => {
    mainWindow.webContents.send("Nueva Nota", nuevaNot);
})

const templateMenu = [
    {
        label: "Archivo",
        submenu: [
            {
                label : "Nueva Nota",
                accelerator: process.platform == "darwin" ? "command+N" : "Ctrl+N",
                click() {
                    creandoNuevaVentana();
                }
            },
            {
                label: "Remover Notas",
                accelerator: process.platform == "darwin" ? "command+Z" : "Ctrl+Z",
                click(){
                    mainWindow.webContents.send("Eliminar Notas");
                }
            },
            {
                label: "Salir",
                accelerator: process.platform == "darwin" ? "command+W" : "Alt+F4",
                click(){
                    app.quit();
                }
            }
        ]
    }
]

if(process.platform === "darwin") {
    templateMenu.unshift({
        label: app.getName(),
    })
}

if(process.env.NODE_ENV !== "production"){
    templateMenu.push({
        label: "DevTools",
        submenu: [
            {
                label: "Show/Hide DevTools",
                accelerator: "Ctrl+D",
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: "reload"
            }
        ]
    })
}