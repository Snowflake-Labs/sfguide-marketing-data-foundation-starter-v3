import { Navigate } from 'react-router-dom';
import { PathConstants, ArgumentsConstants } from './pathConstants';
import DataSources from '../pages/DataSources/DataSources';
import DataQuality from '../pages/DataQuality/DataQuality';
import DataExplorer from '../pages/DataExplorer/DataExplorer';

import AddNewSource from 'pages/DataSources/AddNewSources/AddNewSource';
import CreateModelLoaderPage from 'pages/DataSources/CustomizeMapings/CreateModelLoader/CreateModelLoaderPage';
import CustomizedMappings from 'pages/DataSources/CustomizeMapings/CustomizedMappings';
import ExistingSources from 'pages/DataSources/ExistingSources/ExistingSources';
import LinkData from 'pages/DataSources/AddNewSources/LinkData/LinkData';
import LinkDataInSnowflake from 'pages/DataSources/AddNewSources/LinkDataInSnowflake/LinkDataInSnowflake';
import ModelsPage from 'pages/DataSources/ModelsPage';
import SelectTargetModelPage from 'pages/DataSources/CustomizeMapings/SelectTargetModelPage/SelectTargetModelPage';
import DataExplorerPage from 'pages/DataExplorer/DataExplorerPage';
import SourceList from 'components/SourceList/SourceList';
import ConnectorList from 'pages/DataSources/AddNewSources/ConnectorList/ConnectorList';
import ConnectorSetup from 'pages/DataSources/AddNewSources/ConnectorSetup/ConnectorSetup';
import AIAssistant from 'pages/AIAssistant/AIAssistant';
import EditMappingsPage from 'pages/DataSources/CustomizeMapings/EditMappingModel/EditMappings';
import MarketingExecution from 'pages/MarketingExecution/MarketingExecution';

const explorerChildren = [
  {
    index: true,
    element: <DataExplorer />,
  },
  {
    path: PathConstants.DATABASE,
    element: <DataExplorer />,
    children: [
      {
        path: ArgumentsConstants.DATABASE,
        children: [
          {
            index: true,
            element: <DataExplorer />,
          },
          {
            path: PathConstants.SCHEMA,
            children: [
              {
                index: true,
                element: <DataExplorer />,
              },
              {
                path: ArgumentsConstants.SCHEMA,
                children: [
                  {
                    index: true,
                    element: <DataExplorer />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const routes = [
  { path: PathConstants.HOME, element: <Navigate replace to={PathConstants.DATASOURCES} /> },
  {
    path: PathConstants.DATASOURCES,
    element: <DataSources />,
    children: [
      {
        index: true,
        element: <Navigate replace to={PathConstants.EXISTING} />,
      },
      {
        path: PathConstants.EXISTING,
        element: <ExistingSources />,
      },
      {
        path: PathConstants.PROVIDERS,
        element: <AddNewSource />,
        children: [
          {
            index: true,
            element: <SourceList />,
          },
          {
            path: ArgumentsConstants.PROVIDER,
            children: [
              {
                index: true,
                element: <LinkData />,
              },
              {
                path: PathConstants.LINK,
                element: <LinkDataInSnowflake />,
              },
              {
                path: PathConstants.CONNECTORS,
                children: [
                  {
                    index: true,
                    element: <ConnectorList />,
                  },
                  {
                    path: ArgumentsConstants.CONNECTOR,
                    children: [
                      {
                        index: true,
                        element: <ConnectorSetup />,
                      },
                      {
                        path: PathConstants.LINK,
                        children: [
                          {
                            index: true,
                            element: <LinkDataInSnowflake />,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: ArgumentsConstants.SOURCE,
        children: [
          {
            index: true,
            element: <Navigate replace to={PathConstants.MODELS} />,
          },
          {
            path: PathConstants.MODELS,
            element: <ModelsPage />,
            children: [
              {
                index: true,
                element: <SelectTargetModelPage />,
              },
              {
                path: ArgumentsConstants.MODEL,
                children: [
                  {
                    index: true,
                    element: <CustomizedMappings />,
                  },
                  {
                    path: PathConstants.PROGRESS,
                    element: <CreateModelLoaderPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: PathConstants.DATAEXPLORER,
        element: <DataExplorerPage />,
        children: explorerChildren,
      },
    ],
  },
  {
    path: PathConstants.DATASOURCES,
    children: [
      {
        path: ArgumentsConstants.SOURCE,
        children: [
          {
            path: PathConstants.MODELS,
            element: <ModelsPage />,
            children: [
              {
                path: ArgumentsConstants.MODEL,
                children: [
                  {
                    path: PathConstants.EDIT,
                    children: [
                      {
                        index: true,
                        element: <EditMappingsPage />,
                      },
                      {
                        path: PathConstants.NEWTABLE,
                        element: <EditMappingsPage />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: PathConstants.DATAQUALITY, element: <DataQuality /> },
  { path: PathConstants.DATAEXPLORER, element: <DataExplorer />, children: explorerChildren },
  { path: PathConstants.AIASSISTANT, element: <AIAssistant /> },
  { path: PathConstants.MARKETINGEXECUTION, element: <MarketingExecution /> },
];
export default routes;
