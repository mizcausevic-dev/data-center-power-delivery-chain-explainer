# Data-Center Power Delivery Chain

Frame-accurate conceptual anatomy of one online double-conversion data-center power path, from utility AC to the computing load.

**About:** Frame-accurate conceptual anatomy of an online double-conversion data-center power path, from utility AC to the computing load.

**Topics:** `data-center` `power-distribution` `ups` `infrastructure` `explainer` `animation` `energy` `electrical` `anatomy` `visualization`

## What the film is

A 34-second plate. 30 frames per second. 1,020 frames, indexed 0 through 1019. The picture is a pure function of the frame index.

Chosen boundary, and only this boundary:

- one utility feed
- one distribution step
- one online double-conversion UPS module
- one battery cabinet on a bidirectional converter into the DC link
- one PDU drawn as distribution, with no transformer assumed
- one rack section and its server power supplies

Static bypass is drawn as a separate path with a permanent gap. It stays unselected for all 1,020 frames. Opening the input device does not close that gap. On this plate the bypass entrance is the same upstream feed, so an interrupted input is not a suitable bypass source. Maintenance bypass is named as a separate state and is not wired in.

A direct battery-to-DC-link connection is a real design used by other products. It is not this film. Standby generation, parallel modules, economy mode, and a separate bypass feeder are outside the boundary.

## How to run

No build. Open `index.html`. GitHub Pages serves the `pages` branch.

Add `?f=510` to pin a frame. Space plays and pauses. Arrow keys step.

```bash
node test/timeline.test.js
```

The test walks every frame. Bypass flow stays at none. Input share and discharge share sum to 1. Stored energy falls during the interruption and only partly recovers. Frames 940 through 1019 are the same picture.

## Timing

| Frames | Film time | What the plate does |
| --- | --- | --- |
| 0-149 | 0-5 s | Opens on a system already in normal service. Not a startup procedure. |
| 150-299 | 5-10 s | Follows rectifier, DC link, inverter. Bypass stays open. |
| 300-509 | 10-17 s | Reveals the battery interior and the converter. Does not perform a connection. |
| 510-749 | 17-25 s | Depicts an input interruption. The battery supports the DC link. Bypass does not close. |
| 750-939 | 25-31.3 s | Input returns, recharge is shown without a rate, then the view pulls back. |
| 940-1019 | 31.3-34 s | Held overview. |

Scale is enlarged. Electrical motion is slowed. The outage and the recharge are time-compressed. None of those treatments is a measured duration.

## Safeguards

Read `SAFEGUARDS-Cursor.md`. The same limits are on the page.

## Reference

U.S. Department of Energy, Best Practices Guide for Energy-Efficient Data Center Design, July 2024: https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design.pdf

This repository does not copy the guide's figures and is not a DOE publication.

## Pages

Live plate: https://mizcausevic-dev.github.io/data-center-power-delivery-chain-explainer/

Repository: https://github.com/mizcausevic-dev/data-center-power-delivery-chain-explainer

Medium draft: `medium-article-Cursor.md`
