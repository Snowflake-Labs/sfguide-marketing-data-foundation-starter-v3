import { useFooterContext } from 'components/Footer/FooterContext/FooterContext';
import { Fragment, ReactNode } from 'react';
import { useEffect } from 'react';

interface IAddNewSourceFooterProps {
  children: ReactNode;
}

export default function AddNewSourceFooter({ children }: IAddNewSourceFooterProps) {
  const { setChildren } = useFooterContext();

  useEffect(() => {
    setChildren(children);
  }, [children]);

  return <Fragment />;
}
