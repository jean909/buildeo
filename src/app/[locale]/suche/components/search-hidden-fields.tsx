import type { ReactNode } from "react";
import { RENT_FEATURE_KEYS, type SearchFilterState } from "@/lib/filter-listings";

type Props = {
  filters: SearchFilterState;
  /** Names already provided by visible inputs in the same form */
  omit?: string[];
};

export function SearchHiddenFields({ filters, omit = [] }: Props) {
  const skip = new Set(omit);
  const nodes: ReactNode[] = [];

  if (filters.typ && !skip.has("typ")) {
    nodes.push(<input type="hidden" name="typ" value={filters.typ} key="typ" />);
  }
  if (filters.preisMin != null && !skip.has("preisMin")) {
    nodes.push(<input type="hidden" name="preisMin" value={filters.preisMin} key="preisMin" />);
  }
  if (filters.preisMax != null && !skip.has("preisMax")) {
    nodes.push(<input type="hidden" name="preisMax" value={filters.preisMax} key="preisMax" />);
  }
  if (filters.zimmerMin != null && !skip.has("zimmerMin")) {
    nodes.push(<input type="hidden" name="zimmerMin" value={filters.zimmerMin} key="zimmerMin" />);
  }
  if (filters.zimmerMax != null && !skip.has("zimmerMax")) {
    nodes.push(<input type="hidden" name="zimmerMax" value={filters.zimmerMax} key="zimmerMax" />);
  }
  if (filters.flaecheMin != null && !skip.has("flaecheMin")) {
    nodes.push(<input type="hidden" name="flaecheMin" value={filters.flaecheMin} key="flaecheMin" />);
  }
  if (filters.flaecheMax != null && !skip.has("flaecheMax")) {
    nodes.push(<input type="hidden" name="flaecheMax" value={filters.flaecheMax} key="flaecheMax" />);
  }
  if (filters.neinNeubau && !skip.has("neinNeubau")) {
    nodes.push(<input type="hidden" name="neinNeubau" value="1" key="neinNeubau" />);
  }
  if (filters.nurNeu && !skip.has("nurNeu")) {
    nodes.push(<input type="hidden" name="nurNeu" value="1" key="nurNeu" />);
  }
  for (const k of RENT_FEATURE_KEYS) {
    if (filters.features[k] && !skip.has(k)) {
      nodes.push(<input type="hidden" name={k} value="1" key={k} />);
    }
  }

  return <>{nodes}</>;
}
