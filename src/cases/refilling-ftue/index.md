---
date: "2026"
title: "In-app self-service guides for electrolysers brought refilling-related support requests down from over 80% to zero."
description: "B2B SaaS companies allocate about [~9% of ARR](https://www.saas-capital.com/blog-posts/spending-benchmarks-for-private-b2b-saas-companies/) <sup>2026</sup> to support costs. Reducing ticket volume directly impacts profitability while improving customer experience and [time-to-resolution](# \"Time required for support to resolve a customer's issue\")."
client: "Enapter"
clientLogo: "img/logo-enapter.svg"
clientDescription: "Makes AEM electrolysers and energy management tools for renewable energy projects."

---

{wide}
![](img/refilling-instruction-1.jpg)

{h2} Where we started

1. 80% of customers ask support about refilling procedure just after they received devices.
2. Maintenance routines can only be done by using lengthy paper manuals.

{h2} Suggested solution

1. Add refilling step-by-step guides to Enapter mobile apps and [electrolyser's WebGUI.](# "A web interface embedded in the firmware, designed to monitor and control devices locally.")

{wide}
![Added obvious screen indicates "maintenance allowed" ](img/refilling-instruction-2.jpg)

{h2} Why it's important

1. First-time user experience: refilling is a first procedure after installing devices on-site.

2. Refilling is a repetitive action: every maintenance or device transportation requires device draining and refilling.

3. Limited operators' technical expertise: most onsite staff are newbies in hydrogen setups.

{h2} Research

<div class="case-study__row">
  <div class="case-study__row-label">Step Artifacts</div>
  <div class="case-study__row-value"><a href="img/usability-testing-guide.docx" title="button">  PRD (soon) ↗</a></div>
</div>

There was no ready-made documentation or simple given task. Only the problem.

1. Find information and define the problem across 1500+ support tickets.
2. Align ideas with RnD and Factory team. Get insights about upcoming EL4.1 model.
3. A lot of calls with engineers and firmware developers before first prototypes.

{wide}
![](img/refilling-instruction-research.jpg)

{h2} Design and Development

<div class="case-study__row">
  <div class="case-study__row-label">Step Artifacts</div>
  <div class="case-study__row-value"><a href="img/usability-testing-guide.docx" title="button"> FigJam Userflow (soon) ↗</a></div>
  <div class="case-study__row-value"><a href="img/usability-testing-guide.docx" title="button"> Figma Screens (soon) ↗</a></div>
</div>

I’ve brought all the data together and developed a clear MVP plan, complete with a roadmap for the wizard’s future evolution.

1. I didn’t just create the mockups in Figma. I also designed a method for storing and versioning instructions on a static server. Based on the electrolyzer version, the app automatically shows the relevant instructions.
2. I designed all the error scenarios – human-friendly headers and clear resolution steps defined for each error code and listed at GitLab.

{carousel}
![](img/refilling-instruction-diff-el21-el-41.jpg)
![](img/refilling-instruction-skip.jpg)
![](img/refilling-instruction-errors.jpg)
{/carousel}

{h2} Usability testing challenge

<div class="case-study__row">
  <div class="case-study__row-label">Step Artifacts</div>
  <div class="case-study__row-value"><a href="img/usability-testing-guide.docx" title="button"> testing-guide.docx ↓</a></div>
</div>

Electrolyzers require piping connectors and extensive supporting equipment. Finding an available real device was the main bottleneck in usability & QA testing.

That's why we developed Elegotchi – a printed board that completely simulates the operation of the real electrolyzer.

{wide}
![](refilling-instruction-4.jpg)

Testing process:

1. In the early beta, we tested with Enapter employees before we were allowed to run tests on external integrators' sites.
2. The participant is asked to simulate refilling of the electrolyzer, using only instructions from the mobile app.
3. For physical actions we used a turned-off electrolyzer and a [refilling kit.](# "Includes canister, refilling and draining pipes.")
4. Moderator observes the participant's actions and, based on timing, triggers the relevant sensors on the Elegotchi board to simulate the refilling process.

{wide}
![](img/refilling-instruction-u-testing-guide.jpg)

{h2} Usability Testing Insights

<div class="case-study__row">
  <div class="case-study__row-label">Step Artifacts</div>
  <div class="case-study__row-value"><a href="img/usability-testing-guide.docx" title="button"> testing-insights.docx (soon) </a></div>
</div>

Example updates based on usability testing.

{carousel}
![Users failed connecting the electrolyte bag because of the unusual connector.](img/refilling-instruction-connector.jpg)
![Users couldn't indicate when they could actually start maintenance or transportation.](img/refilling-instruction-connector.jpg)
{/carousel}


{h2} Core impact

1. Initial support requests related to refilling reduced almost to zero.
2. 96% refilling [success rate.](# "6 months later after release, based on google analytics reports (Firebase).") via the mobile app.
3. Of the remaining 4%, most issues were not user-related (hardware or sensor errors).