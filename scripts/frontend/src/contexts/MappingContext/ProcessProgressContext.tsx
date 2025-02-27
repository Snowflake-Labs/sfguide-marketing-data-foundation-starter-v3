import { EventData } from 'dtos/EventData';
import { ModelUI } from 'dtos/ModelUI';
import { ProcessProgress, ProcessProgressStatus } from 'dtos/ProcessProgress';
import { IMappingService } from 'interfaces/IMappingService';
import { IPubSubService } from 'interfaces/IPubSubService';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';
import { toStandardMappingModel } from 'utils/MappingModel/toStandardMappingModel';

type ProcessProgressContext = {
  process: ProcessProgress[];
  createdProcess: ProcessProgress[];
  deletedProcess: ProcessProgress[];
  updatedProcess: ProcessProgress[];
  errorProcess: ProcessProgress[];
  loading: boolean;
  ApplyAndContinueProcess: (model: ModelUI) => void;
};

const defaultContext: ProcessProgressContext = {
  process: [],
  createdProcess: [],
  deletedProcess: [],
  updatedProcess: [],
  errorProcess: [],
  loading: false,
  ApplyAndContinueProcess: () => {},
};

const ProcessProgressContext = createContext<ProcessProgressContext>(defaultContext);

interface Props {
  children: ReactNode;
}

export function ProcessProgressContextWrapper(props: Props) {
  const { sourceId } = useParams();
  const navigate = useNavigate();

  const [process, setProcess] = useState(defaultContext.process);
  const [createdProcess, setCreatedProcess] = useState(defaultContext.createdProcess);
  const [deletedProcess, setDeletedProcess] = useState(defaultContext.deletedProcess);
  const [updatedProcess, setUpdatedProcess] = useState(defaultContext.updatedProcess);
  const [errorProcess, setErrorProcess] = useState(defaultContext.errorProcess);
  const [loading, setLoading] = useState(false);

  const pubSubService = container.get<IPubSubService>(TYPES.IPubSubService);
  const mappingService = container.get<IMappingService>(TYPES.IMappingService);

  const ApplyAndContinueProcess = (model: ModelUI) => {
    setLoading(true);
    pubSubService.emitEvent(EventData.Model.Save, model);
    const process = toStandardMappingModel(model);
    mappingService
      .updateProcess(process, model.id)
      .then(() => {
        mappingService.executeModelUI(model.id).then((response) => {
          pubSubService.emitEvent(EventData.Process.Message, response);
        });
        const path = `/${PathConstants.DATASOURCES}/${sourceId}/${PathConstants.MODELS}/${model.id}/${PathConstants.PROGRESS}`;
        navigate(path, { state: { inProgress: true } });
      })
      .finally(() => setLoading(false));
  };

  const clearState = () => {
    setProcess([]);
    setCreatedProcess([]);
    setDeletedProcess([]);
    setUpdatedProcess([]);
    setErrorProcess([]);
  };

  const handleProcessMessage = (process?: ProcessProgress[]) => {
    if (process) setProcess(process);
  };

  useEffect(() => {
    const createdProcess = process?.filter((p) => p.status_code === ProcessProgressStatus.Created) ?? [];
    const deletedProcess = process?.filter((p) => p.status_code === ProcessProgressStatus.Deleted) ?? [];
    const updatedProcess = process?.filter((p) => p.status_code === ProcessProgressStatus.Updated) ?? [];
    const errorProcess = process?.filter((p) => p.status_code === ProcessProgressStatus.Error) ?? [];
    setCreatedProcess(createdProcess);
    setDeletedProcess(deletedProcess);
    setUpdatedProcess(updatedProcess);
    setErrorProcess(errorProcess);
  }, [process]);

  useEffect(() => {
    pubSubService.subscribeToEvent(EventData.Process.Message, 'loader', handleProcessMessage);
    return () => pubSubService.unsubscribeFromEvent(EventData.Process.Message, 'loader');
  }, [location]);

  const sharedState: ProcessProgressContext = useMemo(
    () => ({
      process,
      createdProcess,
      deletedProcess,
      updatedProcess,
      errorProcess,
      loading,
      ApplyAndContinueProcess,
    }),
    [process, createdProcess, deletedProcess, updatedProcess, errorProcess, loading]
  );

  return <ProcessProgressContext.Provider value={sharedState}>{props.children}</ProcessProgressContext.Provider>;
}

export function useProcessProgressContext() {
  return useContext(ProcessProgressContext);
}
