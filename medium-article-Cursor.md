# The Data Center Power Delivery Chain Does Not Fail Over to Bypass

**Subtitle:** A 34-second look at one online double-conversion path, and the picture that usually gets drawn wrong.

**Suggested Medium slug:** `data-center-power-delivery-chain`

**Suggested tags:** Data Centers, Infrastructure, Energy, Engineering, Electrical

**Meta description:** A frame-by-frame look at the data center power delivery chain. Double-conversion, the DC link, and why battery support is not a transfer to bypass.

**Canonical plate:** https://mizcausevic-dev.github.io/data-center-power-delivery-chain-explainer/

**Suggested byline:** Miz Causevic

Ask a room of smart people what a data center UPS does when the utility drops, and someone will say it switches to bypass. The sentence sounds responsible. It is also the wrong sentence for the mode most people mean.

In an online double-conversion UPS, the normal path is already a conversion. Utility AC is rectified onto a DC link. The inverter makes AC again for the load. The battery, if the design uses one, sits on that DC link. When the input disappears, the rectifier stops being the source. The battery holds the link. The inverter keeps going. The static bypass does not close, because the source it would need has just gone away.

That distinction is the whole subject of a 34-second plate: https://mizcausevic-dev.github.io/data-center-power-delivery-chain-explainer/

It is a drawing of one chosen boundary. It is not a product manual, not a startup procedure, and not a claim about a specific cabinet. If you remember one frame, remember the open gap in the bypass while the inverter waveform is still there.

## The chain is a boundary, not a campus

Data center power is an easy phrase to inflate. A real site may have two utilities, a generator plant, paralleled UPS modules, a maintenance wrap, and a bypass fed from somewhere else. Those are real. They are also a different drawing.

This plate keeps one boundary so the energy can be followed with the eye:

- incoming AC
- a distribution step
- one online double-conversion UPS
- one battery cabinet
- one distribution unit, drawn without assuming a transformer inside it
- one rack section, with server power supplies and computing loads

Outside the frame, on purpose: standby generation, a second module, economy mode, and a separate bypass feeder. Naming them matters. If they stay invisible, a viewer will invent them and then treat the invention as redundancy.

The U.S. Department of Energy July 2024 Best Practices Guide for Energy-Efficient Data Center Design is the public starting point: https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design.pdf

The guide talks about utility service, distribution, UPS equipment, PDUs, and the IT load, and it treats double-conversion as the common data center arrangement. This essay does not copy the guide's figures, and it does not apply the guide's example calculations to the plate. Check any real room against the documents for the equipment in that room.

## What double-conversion is doing while nothing is wrong

The interesting part of a UPS is not the outage. It is the ordinary minute.

In the chosen mode, energy does not pass straight through. It is rectified, held for a moment on the DC link, and inverted. The load is on the inverter the whole time. That is what online and double-conversion are pointing at.

The plate shows this as a left-to-right path: rectifier, DC link, inverter, then out through distribution into the rack. Server power supplies convert AC to DC again for the electronics. That last conversion is inside the load boundary. The drawing marks heat at the conversions and refuses to put a number on it.

Markers on the conductors show energy flow. They do not show electron direction. On AC, current reverses every cycle. The waveforms are slowed on purpose and labeled as schematic. They are not a scope capture, and they are not grid frequency.

## The DC link is the hinge

Everything that matters in the outage happens at the DC link.

While the input is present, the rectifier supports that link and the inverter draws from it. The battery is already interfaced. On this plate the interface is a bidirectional converter. That is a choice. Plenty of UPS products tie the battery string directly to the DC bus. Plenty of transformerless designs put a converter in between because the battery voltage and the bus voltage are not the same number. Both exist. This film picks the converter so the interface is visible. It does not pick a chemistry, a string layout, or an autonomy.

If you are reviewing a vendor drawing, ask this before anyone talks about seamless transfer: where does the battery meet the bus, and what has to be true for the inverter to stay in its range?

## Battery support is not a transfer

From frame 510 to frame 749, seventeen to twenty-five seconds of film time, the input device opens. That is a depicted interruption, not a maintenance test. The path from the utility side goes dark. Energy from the battery, through the converter, onto the DC link, comes up. The inverter keeps drawing. The output waveform continues.

Nothing in that sequence moves the bypass switch.

People reach for the word transfer because other power systems really do transfer. An open-transition switch moves a load from one source to another, and there is a gap. A closed-transition switch overlaps them. A static switch can move a load onto a bypass source when that source is healthy and the inverter is the thing that failed. The time that takes is a product fact, and this essay does not state one.

Stored-energy support does not move the load off the inverter. The load was already on the inverter. The source behind the inverter changes. If you animate a bypass closing at the moment the utility fails, you have taught the room that the battery and the bypass are substitutes. They are not.

## Bypass needs a source the battery does not have

Static bypass is a path around the rectifier and inverter, from a suitable AC source to the output. On this plate the bypass entrance is tied to the same upstream feed as the rectifier. Some sites bring bypass from another place. This drawing does not.

The input device opens and the feed on the left dies. The bypass stub on the left dies with it. The gap in the middle was already open. Closing it would connect the output to a dead bus. The battery cannot feed the bypass, because the battery is on the DC side of a converter, and the bypass is an AC path that was never connected to it.

Maintenance bypass is a third thing. It is a wrap used so people can work on a UPS that has been taken out of the path, and it comes with a procedure this plate will not show. The film lists it as a state that is not entered.

If a design really does have an alternate bypass source, draw that source. Give it its own feeder, its own device, and its own label.

## The store is finite, and the film stops early on purpose

A battery picture that stays full is a sales picture.

On the plate the store is a qualitative level. No ampere-hours, no minutes, no state-of-charge percentage. It starts ready. During the interruption it falls. When the input returns, discharge ends, and only then does a recharge branch appear, back through the same converter. The trace ends while recharge is still incomplete. Frames 940 through 1019 hold that overview still.

The film never claims the inverter ran to the end of autonomy. It stops while support is still depicted. It does not show a low-battery cutoff, and it does not show what the load does after the store is gone.

Time is compressed and the electrical motion is slowed. The drop you see in a few seconds of film is not a runtime. If a number is not on the plate, it is not a result of the plate.

In every frame, the share drawn from the input and the share drawn from the battery add to one. During the handoff both are briefly present. That is the DC link being fed from two contributors, not a transfer of the load onto another AC source.

## How the 34 seconds are built

The plate is 1,020 frames at 30 frames per second, indexed from 0 through 1019.

| Frames | Film time | What you are seeing |
| --- | --- | --- |
| 0 to 149 | 0 to 5 s | The drawing opens on a system already in service. This is not a startup. |
| 150 to 299 | 5 to 10 s | Normal energy through rectifier, DC link, and inverter. Bypass stays open. |
| 300 to 509 | 10 to 17 s | The battery interior is revealed. The cabinet was already interfaced. |
| 510 to 749 | 17 to 25 s | Input interruption. Battery supports the DC link. Bypass stays open. |
| 750 to 939 | 25 to 31 s | Input returns. Recharge is shown without a rate. The view pulls back. |
| 940 to 1019 | 31 to 34 s | Held overview. |

Cyan is the energy path. Gold is stored energy or the motion of the input device. Violet is state. Steel and copper are the equipment. Nothing on the plate is a measurement.

## What to take into a design review

1. Is the normal mode actually double-conversion, or is an economy mode the mode you will run?
2. Does the battery meet the DC link directly, or through a converter?
3. What source feeds static bypass? If it is the same feeder as the rectifier, an input loss is not a bypass event.
4. Where is maintenance bypass, and what has to be true before it is closed? That procedure belongs in the vendor document, not in an animation.
5. What ends the discharge? Inverter window, battery cutoff, load shed, generator acceptance. Pick the one this site actually has.

None of those questions requires a fabricated efficiency. The DOE guide is a serious place to start the conversation about load factor, right-sizing, and extra conversions. It is a bad place to borrow a single percentage and paste it onto a schematic that never had a meter.

## A note on the form

Power explanations rot when they are only prose. People remember the motion. If the motion closes the wrong switch, the prose underneath never gets a vote.

Watch it once with the scrubber in your hand. Stop on the open input device. Look at the bypass gap. Look at the inverter. If those three can be true in the same frame, you have the data center power delivery chain in the mode this drawing is willing to defend.

The plate: https://mizcausevic-dev.github.io/data-center-power-delivery-chain-explainer/

The repository: https://github.com/mizcausevic-dev/data-center-power-delivery-chain-explainer
