import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    palette: {
      [key: string]: string;
    };
    typography: {
      [key: string]: {
        [key: string]: string;
      };
    };
  }
}
