---
date: "2026"
title: "Electrolysers refilling in-app instructions reduced supports requests from 80% to zero"
tags:
  - "2020-2025"
  - "Process Management"

---

{eyebrow} Where we started

1. 80% of customers ask support about refilling procedure just they recieved devices.
2. Maintenance routines can only be done by using lengthy paper manuals.

---

{eyebrow} Suggested solution

1. Add refilling step-by-step guides to mobile apps and WebGUI of electrolysers.


---

{no-bg}
{wide}

![](img/refilling-instruction-2.jpg)

---

{eyebrow} Why it's important

1. First-time user experience: refilling is a first procedure after installing devices on-site.

2. Refilling is a repetitive action: every maintenance or device transportation requires device draining and refilling.

3. Limited operators technical expertise: most clients staff are first-time users of hydrogen equipment.

---

{eyebrow} Research

There was no ready-made documentation or simple given task. Only the problem.

1. Find information and define the problem across 1500+ support tikets.
2. Align ideas with RnD and Factory team. Get insights about upcoming EL4.1 model.
3. A lot of calls with engineers and firmware developers before first prototypes.

---

{no-bg}
{wide}

![Design coordination across multiple teams.](img/refilling-instruction-5.jpg)

---

{eyebrow} Usability testing

Electrolysers require piping connectors and extensive supporting equipment. Finding avaliable real device was the main bottleneck in usability & QA testing.

![Onsite usabillity testing process.](refilling-instruction-7c.jpg)

 That's why we developed Elegotchi.

![Our Elegotchi completely simulates the operation of real device.](refilling-instruction-6a.jpg)

Using Elegotchi we made the first remote usabillity testing with integrators.

1. We used powered off devices for usabillity testing.
2. First participants were Enapter employees, before it was allowed to proceed tests on external integrator's sites.

![Usability testing guide](refilling-instruction-8.png)

Download Guide Button

{eyebrow} Usabillity Testing Insights

Updates based on usabillity testing.

Users frequently asked support how to connect the electrolyte bag because the unusual connector.

![Connector detailed addded to illustration.](img/refilling-instruction-2.jpg)

Users couldn't indicate then actually they can start maintenance or transportation (refilling wizard was started just after sucsess draining).

![Added obvious screed indicates "maintenane allowed" ](img/refilling-instruction-2.jpg)

And many more...

---

{eyebrow} Scale the design

Design should be easy to scale and reusable. Some features were requested inhouse.

![Previously, electrolyte was supplied pre-prepared, this increased shipping costs. Now customers must prepare KOH solution by themself with new KOH kit (pipes and bag) while old ones still have the outdated pipes kit.](img/refilling-instruction-2.jpg)

![Refilling uses the principle of communicating vessels; in case of overfilling, the excess could be easily drained for EL2.1, but not for EL4.1.](img/refilling-instruction-2.jpg)

![Chemistry team asked to add "Flushing" for EL4.1 as a required step to avoid AEM membrane degradation.](img/refilling-instruction-2.jpg)

![FAT team requested "Skip Flushing" feature to speed up factory acceptance testing, available only in "Expert mode".](img/refilling-instruction-2.jpg)

![Using Customers could prepare a solution for multiple devices from a single bag, which would further increase the risk of overfilling.](img/refilling-instruction-2.jpg)

---

![Refilling Feature Current Flow](embed/refilling-process-flow)

{eyebrow} Core impact

1. 96% refilling success rate via the mobile app.
2. Of the remaining 4%, most issues were not user-related (hardware or sensor errors).
3. Support requests related to refilling reduced almost to 0.

