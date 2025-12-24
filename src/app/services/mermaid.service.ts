import { Injectable } from '@angular/core';
import mermaid from 'mermaid';

@Injectable({ providedIn: 'root' })
export class MermaidService {

  private initialized = false;

  init() {
    if (this.initialized) return;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict', // 🔐 HARDENED
      flowchart: { htmlLabels: false }
    });

    this.initialized = true;
  }

  async render(id: string, source: string): Promise<string> {
    this.init();

    this.validateSource(source);

    const { svg } = await mermaid.render(id, source);
    return svg;
  }

  /** Minimal validation – extend as needed */
  private validateSource(source: string) {
    const forbidden = ['javascript:', '<script', 'onload=', 'onclick='];
    if (forbidden.some(f => source.toLowerCase().includes(f))) {
      throw new Error('Unsafe Mermaid source detected');
    }
  }
}
