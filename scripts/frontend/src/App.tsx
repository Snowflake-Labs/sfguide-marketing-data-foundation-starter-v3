import Layout from 'components/Layout';
import I18n from 'locales/i18n';
import './App.scss';
import theme from 'styles/theme';
import { ThemeProvider } from '@mui/material/styles';
import { FooterContextWrapper } from 'components/Footer/FooterContext/FooterContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <I18n>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FooterContextWrapper>
            <Layout />
          </FooterContextWrapper>
        </LocalizationProvider>
      </I18n>
    </ThemeProvider>
  );
}
