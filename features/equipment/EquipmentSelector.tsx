import { createSelection } from './selection';
import { EquipmentWizard } from './selector/EquipmentWizard';
import type { SelectorProps, SelectorQuery } from './selector/types';

/**
 * Prepare the wizard's initial data in a Server Component.
 *
 * 1. Read Next's query promise. A repeated machine parameter becomes an array;
 *    use its first value, matching the previous URLSearchParams.get behavior.
 * 2. createSelection resolves the requested slug against the supplied catalogue.
 *    ?machine=demo-jumbo-j1 fills both machine and category; a missing, empty
 *    or unknown slug produces the ordinary empty equipment selection.
 * 3. Pass the validated draft, catalogue and translated text to EquipmentWizard.
 *    Next serializes these props in its React Server Component (RSC) payload.
 *    This is the server-to-client handoff; browser interaction starts inside
 *    the wizard's client boundary using that prepared data.
 *
 * Machine links use Next Link/router navigation to obtain updated server props,
 * possibly from a prefetched payload. A native history.pushState call alone
 * changes the address without updating this server-prepared selection.
 */
export async function EquipmentSelector({
  searchParams,
  ...props
}: SelectorProps & { searchParams: Promise<SelectorQuery> }) {
  const query = await searchParams;
  let requestedMachine = query.machine;
  if (Array.isArray(requestedMachine)) {
    const [firstRequestedMachine] = requestedMachine;
    requestedMachine = firstRequestedMachine;
  }

  let initialSlug: string | null = null;
  if (typeof requestedMachine === 'string') initialSlug = requestedMachine;
  const initialSelection = createSelection(props.catalogue, initialSlug);

  // The key identifies the server's starting machine, not the live draft.
  // A Next navigation from J1 to J2 changes it and mounts a fresh wizard.
  // Back/Next, Change equipment and in-wizard machine choices leave this key
  // unchanged. Missing and unknown query slugs both use the empty key.
  return (
    <EquipmentWizard
      key={initialSelection.machine}
      {...props}
      initialSelection={initialSelection}
    />
  );
}
