---
date: "2026"
title: "Electrolysers Refilling"
tags:
  - "Design Thinking"
  - "Process Management"

---

{eyebrow} Where we started

1. 80% of customers ask support about refilling procedure just they recieved devices.
2. Maintenance routine task can only be done by using lengthy paper manuals.

![Image description](overview-placeholder.png)

---

{eyebrow} Context

To produce hydrogen, the electrolyser needs to be filled with electrolyte.

It isn't a one-time procedure: every maintenance or device transportation turns it into a recurring task for by users with limited technical expertise.

![Image description](overview-placeholder.png)

---

{eyebrow} Professional Challenges

1. Тechnically complex equipment: different device versions 2.1 and 4.X exist along with different firmware versions; understanding the processes required technical knowledge and reading technical documentation.
2. Multidisciplinary collaboration: clients are located in 55 countries, factory is in Pisa, and R&D and development are in Germany. The process involves a large number of departments: Mobile, WebGUI, R&D, Factory, FAT, Assembly, Support, Technical Writers, Sales.
3. Half-year cycle time: software development depends on R&D, particularly the chemistry team, which introduces a degree of unpredictability into classic Agile sprints.


---


{eyebrow} Research

There was no ready-made documentation. To reconstruct the whole refilling process I needed to piece information together myself. I ran calls with Support, R&D, Factory, FAT, WebGUI and mobile app developers teams.

![I supported each call with online visualizations and drawings to make sure everyone was on the same page.](overview-placeholder.png)

![Related topics from each department](overview-placeholder.png)

Users frequently asked support how to connect the electrolyte bag because the unusual connector
Electrolyte is supplied pre-prepared, this increased shipping costs.
Refilling uses the principle of communicating vessels; in case of overfilling, the excess could be easily drained for EL2.1, but not for EL4.1.
In EL4.1 overfilling could cause components damage, fatal errors, and as a result equipment downtime.
Customers could prepare a solution for multiple devices from a single bag, which would further increase the risk of overfilling.

---

{eyebrow} Solution

1. Add refilling routine guidance to mobile app and WebGUI of the electrolyser. Autodetect device and firmware version as a must.
2. Then user recieves devices, he shuld know there to find futher instructiins. The idea is to create IKEA-style A4 foldable Quick Start Guiges and ship with device instead of heavy 100-pages manuals.

---


{eyebrow} Process

Developed Elegotchi in collaboration with electrical engineer.

![Image description](overview-placeholder.png)
![Our Elegotchi](overview-placeholder.png)


---


{eyebrow} Impact

1. 96% refilling success rate via the mobile app.
2. Of the remaining 4%, most issues were not user-related (hardware or sensor errors).
3. Support requests related to refilling reduced almost to 0;.

