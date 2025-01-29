import { createTheme } from '@mui/material';

const palette = {
  primary: {
    main: '#050F1C',
    dark: '#FFFFFF',
  },
  secondary: {
    main: '#273F5D',
  },
  text: {
    primary: '#1E252FDE',
    secondary: '#5D6A85',
    disabled: '#9FABC1',
  },
};

const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
    h1: {
      // Page Header
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '32px',
    },
    subtitle1: {
      // Sub Header
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '28px',
    },
    subtitle2: {
      // Body Medium (Stepper)
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
    },
    body1: {
      // Body Large (Card Titles)
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px',
    },
    body2: {
      // Body Medium (Cards Content)
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
    },
    caption: {
      // Body Small
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '20px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          '&:hover': {
            backgroundColor: palette.secondary.main,
          },
        },
      },
    },
  },
  palette,
});

export default theme;
