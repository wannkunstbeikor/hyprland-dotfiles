import Left from "./js/left.js";
import Center from "./js/center.js";
import Right from "./js/right.js";
import { applauncher } from "./js/applauncher.js";
import { media } from "./js/media.js";
import { NotificationPopups } from "./js/notifications.js"

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, make it a function
// then you can simply instantiate one by calling it

// target css file
const css = `${App.configDir}/styles/main.css`;

function reloadCSS() {
  const scss = `${App.configDir}/styles/main.scss`;
  //Utils.exec(`sass --no-source-map ${scss} ${css}`);
  App.resetCss();
  App.applyCss(css);
}

Utils.monitorFile(
  // directory that contains the scss files
  `${App.configDir}/styles`,
  reloadCSS,
);

let theme = Variable("dark");
globalThis.theme = theme;

function Bar(monitor = 0) {
  return Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    // layer: "top",
    child: Widget.CenterBox({
      // add 'slim' to make status bar 'slim'
      className: "container_main",
      start_widget: Left(),
      center_widget: Center(),
      end_widget: Right(),
    }),
    css: "background-color: transparent;",
  });
}

App.config({
  style: css,
  windows: [
    Bar(), // you can call it, for each monitor: Bar(0), Bar(1)
    applauncher,
    media,
    NotificationPopups(),
  ]
});

export {};
