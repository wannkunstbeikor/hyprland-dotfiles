const hyprland = await Service.import("hyprland");
const { query } = await Service.import("applications")

function ClientTitle() {
    return Widget.Box({
        class_name: "client-title",
        children: [
          Widget.Icon({icon: hyprland.active.client.bind("class").as((c) =>{
            let q = query(c);
            if (q.length == 1) {
              return q[0].icon_name || "";
            }
            return "";
          }), size: 22}),
          Widget.Label({label: hyprland.active.client.bind("title")})
        ],
        spacing: 10,
    })
}

export default function Center() {
    return Widget.Box({
      children: [ClientTitle()],
    });
  }