import { createContext, ReactNode, useContext, useMemo } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import { defaultLocale, locales } from './i18n-config';

interface Props {
  children: ReactNode;
  hideErrorLog?: boolean;
}

function I18n({ children }: Props) {
  return (
    <IntlProvider locale={defaultLocale} defaultLocale={defaultLocale} messages={locales[defaultLocale]}>
      <TranslationContextWrapper>{children}</TranslationContextWrapper>
    </IntlProvider>
  );
}

type TranslationContextType = {
  t: (message: string, values?: Record<string, string>) => string;
};

const TranslationContext = createContext<TranslationContextType>({
  t: (_message: string, _values?: Record<string, string>) => '',
});

const TranslationContextWrapper = ({ children }: Props) => {
  const intl = useIntl();

  const t = (message: string, values : Record<string, string> = {}): string => {
    if (!message) return '';
    return intl.formatMessage({ id: message }, values);
  };

  const sharedState: TranslationContextType = useMemo(() => ({ t }), []);

  return <TranslationContext.Provider value={sharedState}>{children}</TranslationContext.Provider>;
};

export function useTranslation(_type: string) {
  return useContext(TranslationContext);
}

export default I18n;
