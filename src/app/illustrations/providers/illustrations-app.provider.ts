import { IllustError, IllustErrorDark, IllustNotFound, IllustNotFoundDark } from "../images/illustrations.registry";
import { provideIllustrations } from "./illustrations.provider";

export const provideAppIllustrations = () => [
  provideIllustrations([
    IllustError,
    IllustErrorDark,
    IllustNotFound,
    IllustNotFoundDark
  ]),
];
