# Equipment catalogue and enquiry wizard

This document describes the current feature and its proposed development direction. Sections marked **Proposed** describe future work. Product options, configurable builds and selection criteria still need confirmation from Alberto before implementation or publication as COMQ offers.

## Current implementation

The sales catalogue links to individual machine pages with specifications and an image gallery. The wizard collects equipment type, machine, requirements and a review before preparing a WhatsApp enquiry.

All current machines and illustrations are labelled as demonstrations. Every machine shares the same fictional **Standard** and **Compact** variants. Selecting a variant changes the configuration recorded in the review and enquiry; it does not change the machine's specifications or images. An empty variant selection currently means that configuration advice is requested.

The requirements step already collects purchase/rental preference, quantity, country, project location, rental details and free-text notes. Purchase and rental are enquiry preferences; COMQ confirms availability and terms. There is currently no automatic suitability matching or build configuration.

## Proposed: separate facts, options and requirements

These three kinds of information should have distinct roles:

| Information            | Meaning                                                                                                       | Intended behaviour                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Machine specifications | Documented facts about a model or confirmed version, such as width, power or boom count.                      | Display them for comparison and on the product page.             |
| Equipment options      | Choices confirmed as available for that machine, such as a documented accessory or configuration alternative. | Let the visitor request supported choices.                       |
| Project requirements   | What the customer's operation needs, such as access constraints or required capacity.                         | Collect them for COMQ to assess alongside the requested machine. |

For example, a machine could have a published width of **2.4 m**, while the customer reports an access-width requirement of **2.2 m**. Preserve both values in the enquiry for review. Entering a requirement does not alter the machine's specification or establish suitability.

Replace the generic Standard/Compact choices with meaningful, confirmed options. A genuine preset variant remains useful when it represents a documented version with clear differences.

## Proposed: wizard flow

Keep the existing four-step structure:

1. **Equipment category:** choose the relevant equipment group.
2. **Machine:** compare the key published specifications and select a model. Keep its detailed product page accessible.
3. **Options and requirements:** show options supported by that machine and questions relevant to the customer's project. Keep purchase/rental and delivery details here.
4. **Review and enquiry:** distinguish the selected machine, requested options, project requirements and commercial preferences in both the review and WhatsApp message.

Use single-choice controls for mutually exclusive alternatives and multiple-choice controls for independent extras. Hide option groups when no choices are confirmed, including empty sections in the review. Provide an explicit advice choice when the visitor is unsure; distinguish it from deliberately requesting no extras.

When the visitor changes machines, clear choices that belong to the previous machine. Preserve generally applicable enquiry details and recheck any requirements whose meaning depends on the selected equipment.

## Proposed: product pages and images

Product pages should explain the machine's main differences through confirmed specifications, useful images and any real options. Remove the demonstration variant cards when replacing them with real product information.

Keep the shared [Gallery](../../components/gallery/) responsible for displaying images. Equipment data should determine which images it receives. Associate an image with an option only when it depicts that option, and change the displayed specifications only when a documented version or configuration justifies the change.

The current gallery demonstrations exercise image counts and layouts. They do not establish that a machine has multiple build configurations. This direction does not require changes to the gallery implementation.

## Proposed: data model direction

Keep one catalogue source for browsing, comparison, product details and the wizard. Extend it as confirmed information becomes available:

- Store model specifications separately from customer answers.
- Describe supported option groups on the relevant machine, using stable IDs and localized labels.
- Store selected option IDs separately from project requirement values. A single variant string can represent a preset, but cannot represent several independent equipment choices.
- Define requirement questions, units and validation from the information COMQ actually needs to prepare an enquiry.
- Preserve the same distinctions when producing the review and WhatsApp message.

Choose concrete types once the first real options and requirements are known. Add compatibility rules or specification overrides only when documented product relationships require them.

## Proposed: delivery stages

1. **Confirm one real offer.** Gather its specifications, pictures, genuine versions, available options and the information needed for a quote.
2. **Improve the enquiry.** Replace placeholder choices, add the confirmed questions and ensure the review accurately communicates the customer's request. A machine with no selectable options should still support a useful enquiry.
3. **Support configurable builds where applicable.** If COMQ supplies them, model valid combinations and any documented changes to specifications or images.
4. **Add guided recommendations when criteria are validated.** Use confirmed selection rules to explain potential matches and retain an advice path when information is incomplete.

Build configuration and guided recommendations are separate capabilities. Neither is a prerequisite for improving enquiry collection, and each depends on its own confirmed data. The first useful milestone is an enquiry Alberto can assess without having to reinterpret placeholder configuration names.

## Decisions awaiting Alberto's input

- Does COMQ mainly offer existing machines with optional equipment/services, configurable builds, or both?
- Which versions and options are actually available for each model, and which choices can be combined?
- Which selections, if any, change documented specifications or have their own images?
- Which project questions matter for each equipment category, and which answers are required for a quote?
- Which suitability decisions can follow documented rules, and which need individual review?

The wider [content roadmap](../../strategy/content-roadmap.md) covers catalogue growth and the later guided picker. The [Alberto input list](../../strategy/alberto-first-inputs.md) covers the initial product, commercial and selection information to gather. Keep those documents as the business and content plan; use this README for the equipment feature's behaviour and development direction.
