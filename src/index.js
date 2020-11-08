const { app, BrowserWindow, Menu} = require("electron");
const url = require("url");
const path = require("path");

if(process.env.NODE_ENV !== "production"){
    require("electron-reload")(__dirname, {
        electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
    });
}

let mainWindow;
let nuevoProducto;

app.on("ready", () => {
    mainWindow = new BrowserWindow({});
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
    nuevoProducto = new BrowserWindow({
        width: 400,
        height: 330,
        title: "Agregando Nuevo Producto",
    })
    nuevoProducto.setMenu(null);
    nuevoProducto.loadURL(url.format({
        pathname: path.join(__dirname, "views/productos.html"),
        protocol: "file",
        slashes: true,
    }))
}

const templateMenu = [
    {
        label: "Archivo",
        submenu: [
            {
                label : "Nuevo Producto",
                accelerator: "Ctrl+N",
                click() {
                    creandoNuevaVentana();
                }
            }
        ]
    }
]
