---
date: "2026"
title: "Electrolysers Refilling"
tags:
  - "Product design"
  - "Onboarding"
---

![Overview placeholder](overview-placeholder.png)

{h2} Redesigned refilling process reduced upcoming support tickets from 80% to zero.

Process design isn't just screens: it's chemistry, electrolyte preparation, firmware development, and manual operations.

![Overview placeholder](overview-placeholder.png)

---

{eyebrow} Professional Challenges

1. Тechnically complex equipment: different device versions 2.1 and 4.X exist along with different firmware versions; understanding the processes required technical knowledge and reading technical documentation.
2. Multidisciplinary collaboration: clients are located in 55 countries, factory is in Pisa, and R&D and development are in Germany. The process involves a large number of departments: Mobile, WebGUI, R&D, Factory, FAT, Assembly, Support, Technical Writers, Sales.
3. Half-year cycle time: software development depends on R&D, particularly the chemistry team, which introduces a degree of unpredictability into classic Agile sprints.

---

{eyebrow} Context

To produce hydrogen, the electrolyser needs to be filled with electrolyte, which operators prepare and add themselves just after they receive the device.

![Flow diagram placeholder](flow-diagram-placeholder.png)

Refilling isn't a one-time setup: every maintenance visit or moving the device turns it into a recurring task for users with no engineering background.

![Flow diagram placeholder](flow-diagram-placeholder.png)



---


{eyebrow} Discovery

At the initial stage (for version 2.1), refilling was carried out manually without any sofware assistant:

- 80% of customers ask support questions about refilling procedure just they recieved devices.
- Although the electrolyte was supplied pre-prepared, which was convenient for customers, this increased shipping costs. Improper transportation also led to electrolyte degradation.
- The electrolyte was filled using the principle of communicating vessels; in case of overfilling, the excess could be easily drained.

The company was also preparing version 4.1 for release, more compact and higher-performing.

- Due to upcoming construction chsanges, overfilling could cause components damage, fatal errors, and as a result equipment downtime.
- Due to cut shipping cost, customers should prepare the electrolyte themself.
- Customers could prepare a solution for multiple devices from a single bag, which would further increase the risk of overfilling.

![Result screenshot placeholder](result-placeholder.png)


---


{eyebrow} Solution

1. Add refilling routine guidance to mobile app and WebGUI of the electrolyser. Autodetect device and firmware version as a must.
2. Then user recieves devices, he shuld know there to find futher instructiins. The idea is to create IKEA-style A4 foldable Quick Start Guiges and ship with device instead of heavy 100-pages manuals.

---


{eyebrow} Results over the year

1. 96% refilling success rate via the mobile app.
2. Of the remaining 4%, most issues were not user-related (hardware or sensor errors).
3. Support requests related to refilling reduced almost to 0;.

