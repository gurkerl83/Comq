# Equipment catalogue and enquiry wizard

This document describes the equipment feature and its development direction. Items marked **Proposed** describe future work. Real product data, configurable builds and selection criteria need confirmation from Alberto before publication as COMQ offers. The demo data is fictional and exercises the interaction.

## Current implementation

The sales catalogue links to individual machine pages with specifications and an image gallery. The wizard collects equipment type, machine, requirements and a review before preparing a WhatsApp enquiry.

All machines and illustrations are labelled as demonstrations. Jumbo J1 has a default power of 105 kW, a 120 kW alternative and two independent extras: a rear camera and central lubrication. Jumbo J2 has a default width of 2.4 m and a 2.2 m alternative. Scooptram S1 and Drilling Rig D1 have no configurable choices or extras. These examples are fictional product configurations.

Customization lives in **Machine**, inside the selected card. **Customize** is available when the machine defines configurable choices or extras. Configurable aspects use native dropdowns; other specifications are read-only. A separate default hint appears only when the selected answer differs from the default, including when advice is requested. Selecting the default hides that hint. Apply saves the temporary configuration; Cancel, changing machines or leaving the step discards unfinished edits. Escape keeps its native control behavior. Continue and Enter cannot advance while editing. Applied choices survive navigation within the wizard. Selecting a different machine initializes its own defaults while retaining commercial and project answers.

Each configurable aspect starts at its explicit default; choosing advice stores a distinct answer for that aspect. Extras use independent native checkboxes and start with none requested. Any combination is valid, including none; questions can be written in the requirements notes. The review and WhatsApp enquiry include the applied option values, default references and extras. Editing an option from Review returns to Machine. Machines without configurable choices or extras omit customization controls and configuration summary rows. Product-page links preselect the model and open Machine so visitors can inspect its options.

Product pages display the model's baseline specifications and assigned gallery images. The selected wizard card and enquiry show the visitor's requested alternatives.

The requirements step collects purchase/rental preference, quantity, country, project location, rental details and free-text notes. Purchase and rental are enquiry preferences; COMQ confirms availability and terms. There is currently no automatic suitability matching or compatibility engine for configurable builds.

## Facts, options and requirements

Machine specifications, equipment options and project requirements have distinct roles. The wizard captures project requirements in free-text notes; structured questions are proposed future work.

| Information            | Meaning                                                                                                       | Intended behaviour                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Machine specifications | Documented facts about a model or confirmed version, such as width, power or boom count.                      | Display them for comparison and on the product page.             |
| Equipment options      | Choices confirmed as available for that machine, such as a documented accessory or configuration alternative. | Let the visitor request supported choices.                       |
| Project requirements   | What the customer's operation needs, such as access constraints or required capacity.                         | Collect them for COMQ to assess alongside the requested machine. |

For example, a machine could have a published width of **2.4 m**, while the customer reports an access-width requirement of **2.2 m**. Preserve both values in the enquiry for review. Entering a requirement does not alter the machine's specification or establish suitability.

**Proposed:** publish confirmed machine specifications and supported options. Represent a preset build only when it corresponds to a documented product version with clear differences.

## Wizard flow

The wizard has four steps:

1. **Equipment category:** choose the relevant equipment group.
2. **Machine:** compare specifications, select a model and customize its supported options inline. Its detailed product page remains accessible.
3. **Requirements:** collect purchase/rental preference, quantity, location, rental details and project requirements. Future structured project questions also belong here.
4. **Review and enquiry:** distinguish the selected machine, requested options, project requirements and commercial preferences in both the review and WhatsApp message.

Mutually exclusive alternatives use single-choice controls; independent extras use native checkboxes. Controls and review sections appear only for options and extras defined by the machine. Configurable aspects include an explicit advice choice. Questions about optional extras belong in the requirements notes.

Changing machines initializes the new machine's configuration from its defaults with no extras selected. Purchase/rental preference, quantity, location, rental details and notes are preserved.

**Proposed:** when structured project questions are introduced, revalidate answers whose meaning depends on the selected equipment.

## Product pages and images

Product pages list the machine's baseline specifications, configurable choices, defaults and independent extras. The shared [Gallery](../../components/gallery/) displays the images assigned by the equipment data.

The [gallery demonstration](../gallery-demo/GalleryDemoPage.tsx) uses its own fixtures to exercise image counts and layouts independently of the equipment catalogue.

**Proposed:** use confirmed product photographs and associate an image with an option only when it depicts that option. Any changes to displayed product specifications must correspond to a documented version or configuration.

## Data model and future extension

Server entrypoints load the selected [dictionary](../../lib/i18n/dictionaries.ts) and pass its `equipment` text to `createEquipmentCatalogue`. The [machine records](catalogue-data.ts) are keyed by language-independent slugs and own specifications, option defaults and image assignments; the [English](../../lib/i18n/dictionaries/en.ts) and [Spanish](../../lib/i18n/dictionaries/es.ts) dictionaries own descriptions, labels and image alternative text. The [catalogue assembler](catalogue.ts) combines them into entries with plain strings for the UI. Values such as `105 kW` are shared across languages. Static route generation imports `EQUIPMENT_SLUGS` directly from the machine records and does not load a dictionary.

The [equipment types](types.ts) define the shared data shapes and category, specification, extra and image keys. They do not depend on catalogue assembly, configuration validation or translation contracts. `MachineSlug` comes from `keyof typeof EQUIPMENT`, and the [translation contract](../../lib/i18n/types.ts) requires descriptions for every machine. Slugs appear once as catalogue keys; assembled entries receive their slug from that key. Each machine definition is directly annotated as `EquipmentDefinition` before it is added to the keyed catalogue. This checks each record and gives options and extras their declared element types even when their arrays are empty. Configuration creation and validation import their types directly from the shared type module.

One catalogue supplies browsing, comparison, product details and the wizard. `options` have stable IDs, localized choices and an explicit default; `specificationId` optionally binds an option to a specification row. `extras` are independent equipment choices. [EquipmentConfiguration](types.ts) stores choice IDs (null means advice for an aspect) and selected extra IDs. Validation rejects missing, unknown, duplicate and cross-machine selections while allowing any combination of the machine's extras. Extend this as confirmed information becomes available:

- Store model specifications separately from customer answers.
- Describe supported option groups on the relevant machine, using stable IDs and localized labels.
- Store selected option IDs separately from project requirement values.
- Define requirement questions, units and validation from the information COMQ actually needs to prepare an enquiry.
- Preserve the same distinctions when producing the review and WhatsApp message.

Refine the types for real options and structured project requirements once those are known. Add compatibility rules or specification overrides only when documented product relationships require them.

## Proposed: delivery stages

1. **Confirm one real offer.** Gather its specifications, pictures, genuine versions, available options and the information needed for a quote.
2. **Improve the enquiry.** Publish confirmed options, add the agreed project questions and ensure the review accurately communicates the customer's request. Support useful enquiries for machines with and without selectable options.
3. **Support configurable builds where applicable.** If COMQ supplies them, model valid combinations and any documented changes to specifications or images.
4. **Add guided recommendations when criteria are validated.** Use confirmed selection rules to explain potential matches and retain an advice path when information is incomplete.

Build configuration and guided recommendations are separate capabilities. Neither is a prerequisite for improving enquiry collection, and each depends on its own confirmed data. The first milestone is an enquiry Alberto can assess using confirmed machine information, requested options and relevant project requirements.

## Decisions awaiting Alberto's input

- Does COMQ mainly offer existing machines with optional equipment/services, configurable builds, or both?
- Which versions and options are actually available for each model, and which choices can be combined?
- Which selections, if any, change documented specifications or have their own images?
- Which project questions matter for each equipment category, and which answers are required for a quote?
- Which suitability decisions can follow documented rules, and which need individual review?

The wider [content roadmap](../../strategy/content-roadmap.md) covers catalogue growth and the later guided picker. The [Alberto input list](../../strategy/alberto-first-inputs.md) covers the initial product, commercial and selection information to gather. Keep those documents as the business and content plan; use this README for the equipment feature's behaviour and development direction.
