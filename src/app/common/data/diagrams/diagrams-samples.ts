import { IDiagram } from "../../models/interfaces";

export const DiagramsSamples: IDiagram[] = [
  {
    id: 1,
    code: 'flowchart',
    description: 'Diag. flujo',
    snippet: `flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]`
  },
  {
    id: 2,
    code: 'state',
    description: 'Estado',
    snippet: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`},
  {
    id: 4,
    code: 'gantt',
    description: 'Gantt',
    snippet: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`
  },
  {
    id: 3,
    code: 'mindmap',
    description: 'Mapa mental',
    snippet: `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid`
  },
  {
    id: 5,
    code: 'timeline',
    description: 'L. tiempo',
    snippet: `timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : YouTube
    2006 : Twitter`
  }
]