const audio = await Service.import("audio")
const systemtray = await Service.import("systemtray")

import {WINDOW_NAME} from "./media.js"

const date = Variable("", {
  poll: [1000, 'date "+%H:%M "'],
})

function MediaButton() {
    return Widget.Button({
        on_clicked: () => App.toggleWindow(WINDOW_NAME),
        child: Widget.Icon("audio-x-generic-symbolic"),
    })
}

function Volume() {
  const icons = {
      101: "overamplified",
      67: "high",
      34: "medium",
      1: "low",
      0: "muted",
  }

  function getIcon() {
      const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
          threshold => threshold <= audio.speaker.volume * 100)

      return `audio-volume-${icons[icon]}-symbolic`
  }

  return Widget.Button({
      child: Widget.Icon({icon: Utils.watch(getIcon(), audio.speaker, getIcon)}),
      on_primary_click: () => Utils.execAsync("pamixer -t"),
      on_secondary_click: () => Utils.execAsync("pavucontrol -t 3"),
      on_scroll_up: () => Utils.execAsync("pamixer -i 5"),
      on_scroll_down: () => Utils.execAsync("pamixer -d 5"),
  })
}

function VolumeMic() {
  const icons = {
      101: "high",
      67: "high",
      34: "medium",
      1: "low",
      0: "muted",
  }

  function getIcon() {
      const icon = audio.microphone.is_muted ? 0 : [101, 67, 34, 1, 0].find(
          threshold => threshold <= audio.microphone.volume * 100)

      return `microphone-sensitivity-${icons[icon]}-symbolic`
  }

  return Widget.Button({
      child: Widget.Icon({icon: Utils.watch(getIcon(), audio.microphone, getIcon)}),
      on_primary_click: () => Utils.execAsync("pamixer --default-source -t"),
      on_secondary_click: () => Utils.execAsync("pavucontrol -t 4"),
      on_scroll_up: () => Utils.execAsync("pamixer --default-source -i 5"),
      on_scroll_down: () => Utils.execAsync("pamixer --default-source -d 5"),
  })
}

function Audio() {
  return Widget.Box({
    class_name: "audio",
    children: [VolumeMic(), Volume(), MediaButton()],
    spacing: 5,
  })
}

function SysTray() {
  const items = systemtray.bind("items")
      .as(items => items.map(item => Widget.Button({
          child: Widget.Icon({ icon: item.bind("icon") }),
          on_primary_click: (_, event) => item.activate(event),
          on_secondary_click: (_, event) => item.openMenu(event),
          tooltip_markup: item.bind("tooltip_markup"),
      })))

  return Widget.Box({
      class_name: "systray",
      children: items,
      spacing: 5,
  })
}

function Clock() {
  return Widget.Label({
      class_name: "clock",
      label: date.bind(),
  })
}

export default function Right() {
    return Widget.Box({
      hpack: "end",
      children: [SysTray(), Audio(), Clock()],
      spacing: 10,
    });
  }