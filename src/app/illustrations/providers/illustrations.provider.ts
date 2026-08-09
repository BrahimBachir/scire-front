import { TablerIllustration } from "../illustration.interface";
import { ILLUSTRATIONS } from "../illustration.tocken";

export function provideIllustrations(illustrations: TablerIllustration[]) {
  return {
    provide: ILLUSTRATIONS,
    useValue: illustrations,
    multi: true,
  };
}
