const hyprland = await Service.import("hyprland");

const dispatch = ws => hyprland.messageAsync(`dispatch workspace ${ws}`);

const Workspaces = () => Widget.EventBox({
  onScrollUp: () => dispatch('+1'),
  onScrollDown: () => dispatch('-1'),
  child: Widget.Box({
      class_name: "workspaces",
      children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Button({
          attribute: i,
          label: `${i !== 9 ? `${i}` : ""}`,
          onClicked: () => dispatch(i),
      })),
      spacing: 5,

      // remove this setup hook if you want fixed number of buttons
      setup: self => self.hook(hyprland, () => self.children.forEach(btn => {
          btn.visible = hyprland.workspaces.some(ws => ws.id === btn.attribute);
          if (hyprland.active.workspace.id === btn.attribute) {
            btn.class_name = "focused";
          }
          else {
            btn.class_name = "unfocused";
          }
      })),
  }),
})

// layout of the bar
export default function Left() {
  return Widget.Box({
    children: [Workspaces()],
  });
}
