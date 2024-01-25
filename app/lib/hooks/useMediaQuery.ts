import { useMediaQuery as useRawMediaQuery } from "react-responsive";

const screens = {
  sm: "640px",
  // => @media (min-width: 640px) { ... }

  md: "768px",
  // => @media (min-width: 768px) { ... }

  lg: "1024px",
  // => @media (min-width: 1024px) { ... }

  xl: "1280px",
  // => @media (min-width: 1280px) { ... }

  "2xl": "1536px",
  // => @media (min-width: 1536px) { ... }

  "lt-md":"959px",
  // max-width: 959px

  "gt-md":"1024px",
};

type ScreenSizes = keyof typeof screens;

interface MediaQueryParams {
  minWidth?: ScreenSizes;
  maxWidth?: ScreenSizes;
}

export const useMediaQuery = ({ minWidth, maxWidth }: MediaQueryParams) => {
  return useRawMediaQuery({
    minWidth: minWidth && screens[minWidth],
    maxWidth: maxWidth && screens[maxWidth]
  });
};

/* Media queries */
export const useIsSm = () => {
  return useMediaQuery({
    maxWidth: "sm"
  });
};

export const useIsMd = () => {
  return useMediaQuery({
    minWidth: "md"
  });
};

export const useIsLg = () => {
  return useMediaQuery({
    minWidth: "lg"
  });
};

export const useIsLtMd = () => {
  return useMediaQuery({
    maxWidth: "lt-md"
  });
};

export const useIsGtMd = () => {
  return useMediaQuery({
    minWidth: "gt-md"
  });
};
