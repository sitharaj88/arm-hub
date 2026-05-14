// MDX component registry — every <Component /> referenced in MDX content
// resolves through this map (passed to next-mdx-remote compileMDX).

import { Callout } from './callout';
import { RegisterMap } from './register-map';
import { MemoryMap } from './memory-map';
import { CoreCompare } from './core-compare';
import { SystemBlock } from './system-block';
import { BlockDiagram } from './block-diagram';
import { SpecSheet } from './spec-sheet';
import { Stat } from './stat';
import { Terminal } from './terminal';
import { LinkCard } from './link-card';
import { CodeTabs } from './code-tabs';
import { TimingDiagram } from './timing-diagram';
import { PipelineDiagram } from './pipeline-diagram';
import { StateDiagram } from './state-diagram';
import { ProtocolFrame } from './protocol-frame';

export const mdxComponents = {
  Callout,
  RegisterMap,
  MemoryMap,
  CoreCompare,
  SystemBlock,
  BlockDiagram,
  SpecSheet,
  Stat,
  Terminal,
  Card: LinkCard,
  CodeTabs,
  TimingDiagram,
  PipelineDiagram,
  StateDiagram,
  ProtocolFrame,
};
