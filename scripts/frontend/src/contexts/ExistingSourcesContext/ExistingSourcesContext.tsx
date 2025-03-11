import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { container } from 'ioc/inversify.config';
import { IDataSourcesService } from 'interfaces/IDataSourcesService';
import { TYPES } from 'ioc/types';
import Source from 'dtos/Source';
import { useLocation } from 'react-router-dom';

type rowsToDelet = { [key: number]: boolean };

type ExistingSourcesContext = {
  loading: boolean;
  rowsToDelete: rowsToDelet;
  existingSources: Source[];
  check: (row: Source, checked: boolean) => void;
  deleteExistingSources: () => void;
  filter: string;
  setCurrentFilter: (filter: string) => void;
};

const defaultContext: ExistingSourcesContext = {
  loading: true,
  rowsToDelete: {},
  existingSources: [],
  check: () => {},
  deleteExistingSources: () => {},
  filter: '',
  setCurrentFilter: (filter: string) => {},
};

const ExistingSourcesContext = createContext<ExistingSourcesContext>(defaultContext);

interface Props {
  children: ReactNode;
}

export function ExistingSourcesContextWrapper({ children }: Props) {
  const dataSourcesService = container.get<IDataSourcesService>(TYPES.IDataSources);
  const [filter, setFilter] = useState<string>('');
  const [rowsToDelete, setRowsToDelete] = useState<{ [key: string]: boolean }>({});
  const [existingSources, setExistingSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const get_existing_sources = () => {
    dataSourcesService.getExistingSources().then((existingSourcesList) => {
      setExistingSources(existingSourcesList);
      setLoading(false);
    });
  };

  useEffect(() => {
    get_existing_sources();
  }, []);

  useEffect(() => {
    if (location.pathname.includes('existing')) {
      setLoading(true);
      get_existing_sources();
    }
  }, [location]);

  const check = (source: Source, checked: boolean) => {
    const updatedRows = { ...rowsToDelete };
    checked ? (updatedRows[source.SOURCE_ID!] = checked) : delete updatedRows[source.SOURCE_ID!];
    setRowsToDelete(updatedRows);
  };

  const deleteExistingSources = () => {
    let sourcesToDelete = existingSources.filter((source) => rowsToDelete[source.SOURCE_ID!]);
    dataSourcesService.deleteExistingSources(sourcesToDelete);
    let newSources = existingSources.filter((source) => !rowsToDelete[source.SOURCE_ID!]);
    setExistingSources(newSources);
    setRowsToDelete({});
  };

  const setCurrentFilter = (filter: string) => {
    setFilter(filter.toLowerCase());
  };

  const sharedState: ExistingSourcesContext = useMemo(
    () => ({
      loading,
      rowsToDelete,
      existingSources,
      check,
      deleteExistingSources,
      filter,
      setCurrentFilter,
    }),
    [loading, rowsToDelete, existingSources, setExistingSources, filter]
  );

  return <ExistingSourcesContext.Provider value={sharedState}>{children}</ExistingSourcesContext.Provider>;
}

export function useExistingSourcesContext() {
  return useContext(ExistingSourcesContext);
}
