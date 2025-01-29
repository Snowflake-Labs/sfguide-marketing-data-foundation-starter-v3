import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isDeniedPath } from 'routes/pathConstants';

type FooterContext = {
  children: ReactNode;
  setChildren: (children: ReactNode) => void;
};

const defaultContext: FooterContext = {
  children: undefined,
  setChildren: (_: ReactNode) => undefined,
};

const FooterContext = createContext<FooterContext>(defaultContext);

interface Props {
  children: ReactNode;
}

export function FooterContextWrapper(props: Props) {
  const location = useLocation();
  const [children, setChildren] = useState<ReactNode>();

  // Clears the footer when changing url route
  useEffect(() => {
    if (!isDeniedPath(location.pathname)) {
      setChildren(undefined);
    }
  }, [location]);

  const sharedState: FooterContext = useMemo(
    () => ({
      children,
      setChildren,
    }),
    [children]
  );

  return <FooterContext.Provider value={sharedState}>{props.children}</FooterContext.Provider>;
}

export function useFooterContext() {
  return useContext(FooterContext);
}
