import CustomBarChart from 'components/BarChart/BarChart';
import CustomLineChart from 'components/LineChart/LineChart';
import { useTranslation } from 'locales/i18n';
import { H6 } from 'components/common/Text/TextComponents';
import CustomSelect, { InitialMenuItems } from 'components/CustomSelect/CustomSelect';
import styles from './DataExplorer.module.scss';
import { container } from 'ioc/inversify.config';
import { ISnowflakeService } from 'interfaces/ISnowflakeService';
import { TYPES } from 'ioc/types';
import { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select/Select';
import { useParams } from 'react-router-dom';
import MetricCard from 'components/MetricCard/MetricCard';
import { IDataExplorerService } from 'interfaces/IDataExplorerService';
import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import { combinedMetrics, reactions, spend, dataSet, impressions } from 'dtos/DataExplorer';
import CustomTable from 'components/CustomTable/CustomTable';
import Spinner from 'components/common/Spinner/Spinner';
import { PathConstants } from 'routes/pathConstants';
import C360Dashboard from './C360Dashboard';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function DataExplorer() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { databaseName, schemaName } = useParams();
  const [databaseValue, setDatabaseValue] = useState(databaseName ?? '');
  const [schemaValue, setSchemaValue] = useState(schemaName ?? '');
  const [loading, setLoading] = useState(true);
  const [loadingSpend, setLoadingSpend] = useState(true);
  const [loadingReactions, setLoadingReactions] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingImpresions, setLoadingImpresions] = useState(true);
  const [databases, setDatabases] = useState(InitialMenuItems);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState<boolean>(true);
  const [schemas, setSchemas] = useState(InitialMenuItems);
  const [isSchemaLoading, setIsSchemaLoading] = useState<boolean>(false);
  const [value, setValue] = useState(0);
  const [spendPerDateLine, setSpendPerDateLine] = useState<spend['spend_per_date']>({
    date: [],
    value: [],
  });

  const [reactionsPerDateLine, setReactionsPerDateLine] = useState<reactions['reactions_per_date']>({
    date: [],
    value: [],
  });

  const [topAdGroupReactions, setTopAdGroupReactions] = useState<reactions['top_ad_group_reactions']>({
    columns: ['Reactions'],
    data: [
      {
        name: '',
        reactions: 0,
      },
    ],
  });

  const [spendPerReactionsDateLine, setSpendPerReactionsDateLine] = useState<combinedMetrics['spend_per_reactions']>({
    date: [],
    value: [],
  });

  const [overallSpend, setOverallSpend] = useState<spend['overall_spend']>({ value: ['0'] });
  const [OverallReactions, SetOverallReactions] = useState<reactions['overall_reactions']>({ value: ['0'] });
  const [avgSpendPerReaction, setAvgSpendPerReaction] = useState<combinedMetrics['avg_spend_per_reaction']>({
    value: [0],
  });

  const [spendPerPlatform, setSpendPerPlatform] = useState<dataSet>({
    dataset: [{ ' ': 0, year: 0 }],
    series: [{ dataKey: ' ', label: ' ' }],
  });
  const [impressionsPerPlatform, setImpressionsPerPlatform] = useState<dataSet>({
    dataset: [{ ' ': 0, year: 0 }],
    series: [{ dataKey: ' ', label: ' ' }],
  });
  const [spendPerAccount, SetSpendPerAccount] = useState<dataSet>({
    dataset: [{ ' ': 0, year: 0 }],
    series: [{ dataKey: ' ', label: ' ' }],
  });

  const [overallSpendPerAccount, SetOverallSpendPerAccount] = useState<spend['overall_spend_per_account']>({
    columns: [''],
    data: [
      {
        name: '',
        spend: 0,
      },
    ],
  });

  const [overallSpendImpressPerPlatform, SetOverallSpendImpressPerPlatform] = useState<
    combinedMetrics['overall_spend_impressions_per_platform']
  >({
    columns: [''],
    data: [
      {
        name: '',
        spend: 0,
        impressions: 0,
      },
    ],
  });

  const [topCampaignSpendClick, SetTopCampaignSpendClick] = useState<combinedMetrics['top_campaigns_spend_per_click']>({
    columns: [''],
    data: [
      {
        name: '',
        spend_per_click: 0,
      },
    ],
  });

  const [topAdGroupImpressions, SetTopAdGroupImpressions] = useState<impressions['top_ad_group_impressions']>({
    columns: [''],
    data: [
      {
        name: '',
        impressions: 0,
      },
    ],
  });

  const SnowflakeServices = container.get<ISnowflakeService>(TYPES.ISnowflakeService);
  const DataExplorerServices = container.get<IDataExplorerService>(TYPES.IDataExplorerService);

  useEffect(() => {
    SnowflakeServices.get_databases()
      .then((response) => {
        setDatabases(response);
      })
      .finally(() => {
        setIsDatabaseLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!databaseName) return;
    setIsSchemaLoading(true);
    SnowflakeServices.get_schemas(databaseName)
      .then((response) => {
        setSchemas(response);
      })
      .finally(() => {
        setIsSchemaLoading(false);
      });
  }, [databaseName]);

  useEffect(() => {
    if (!databaseName || !schemaName) return;
    DataExplorerServices.get_spend(databaseName, schemaName)
      .then((response) => {
        setSpendPerDateLine(response.spend_per_date);
        setOverallSpend(response.overall_spend);
        setSpendPerPlatform(response.spend_per_platform);
        SetSpendPerAccount(response.spend_per_account);
        SetOverallSpendPerAccount(response.overall_spend_per_account);
        setLoadingSpend(false);
      })
      .finally(() => {
        setLoadingSpend(false);
      });
  }, [schemaName]);

  useEffect(() => {
    if (!databaseName || !schemaName) return;
    DataExplorerServices.get_reactions(databaseName, schemaName)
      .then((response) => {
        setReactionsPerDateLine(response.reactions_per_date);
        SetOverallReactions(response.overall_reactions);
        setTopAdGroupReactions(response.top_ad_group_reactions);
      })
      .finally(() => {
        setLoadingReactions(false);
      });
  }, [schemaName]);

  useEffect(() => {
    if (!databaseName || !schemaName) return;
    DataExplorerServices.get_combined_metrics(databaseName, schemaName)
      .then((response) => {
        setSpendPerReactionsDateLine(response.spend_per_reactions);
        setAvgSpendPerReaction(response.avg_spend_per_reaction);
        SetOverallSpendImpressPerPlatform(response.overall_spend_impressions_per_platform);
        SetTopCampaignSpendClick(response.top_campaigns_spend_per_click);
      })
      .finally(() => {
        setLoadingMetrics(false);
      });
  }, [schemaName]);

  useEffect(() => {
    if (!databaseName || !schemaName) return;
    DataExplorerServices.get_impressions(databaseName, schemaName)
      .then((response) => {
        setImpressionsPerPlatform(response.impressions_per_platform);
        SetTopAdGroupImpressions(response.top_ad_group_impressions);
      })
      .finally(() => {
        setLoadingImpresions(false);
      });
  }, [schemaName]);

  useEffect(() => {
    setLoading(loadingSpend || loadingReactions || loadingMetrics || loadingImpresions);
  }, [loadingSpend, loadingReactions, loadingMetrics, loadingImpresions]);

  const setDatabase = (event: SelectChangeEvent<unknown>) => {
    setDatabaseValue(event.target.value as string);
    navigate(`/${PathConstants.DATAEXPLORER}/database/${event.target.value}`);
  };

  const setSchema = (event: SelectChangeEvent<unknown>) => {
    setSchemaValue(event.target.value as string);
    navigate(`/${PathConstants.DATAEXPLORER}/database/${databaseValue}/schema/${event.target.value}`);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-CustomTabPanel-${index}`,
    };
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="CustomTabPanel"
        hidden={value !== index}
        id={`simple-CustomTabPanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <H6>{t('DataExplorerPage')} </H6>
      <Box className={styles.searchContainer}>
        <CustomSelect
          label="Database"
          menuItems={databases}
          onChange={setDatabase}
          value={databaseValue}
          isLoading={isDatabaseLoading}
          onChangeItem={(item) => {
            setDatabaseValue(item.value);
          }}
        />
        <CustomSelect
          label="Schema"
          menuItems={schemas}
          onChange={setSchema}
          value={schemaValue}
          disabled={!databaseName}
          isLoading={isSchemaLoading}
        />
      </Box>
      <Tabs value={value} onChange={handleChange}>
        <Tab label={t('CampaignIntelligence')} {...a11yProps(0)} />
        <Tab label={t('Customer360')} {...a11yProps(1)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
      {databaseName && schemaName && (
        <Spinner loading={loading}>
          <Box className={styles.graphContainer}>
            <Box>
              <CustomLineChart
                data={spendPerDateLine.value}
                xAxisLabels={spendPerDateLine.date}
                xLabel="Date"
                yLabel="Spend"
                title="SpendPerDate"
              />
            </Box>
            <Box>
              <CustomLineChart
                data={reactionsPerDateLine.value}
                xAxisLabels={reactionsPerDateLine.date}
                xLabel="Date"
                yLabel="Reactions"
                title="ReactionsPerDate"
              />
            </Box>
            <Box>
              <CustomLineChart
                data={spendPerReactionsDateLine.value}
                xAxisLabels={spendPerReactionsDateLine.date}
                xLabel="Date"
                yLabel="SpendPerReactions"
                title="SpendPerReactions"
              />
            </Box>
          </Box>
          <Box className={styles.graphContainer}>
            <MetricCard title={'OverallSpend'} body={overallSpend.value[0]} />
            <MetricCard title={'OverallReactions'} body={OverallReactions.value[0]} />
            <MetricCard title={'AvgSpendPerReaction'} body={avgSpendPerReaction.value[0]} />
          </Box>

          <Box className={styles.graphContainer}>
            <CustomBarChart data={spendPerPlatform} title="PlatformSpendPerYear" xLabel="Year" />
            <CustomBarChart data={impressionsPerPlatform} title="PlatformImpressionsPerYear" xLabel="Year" />
            <CustomBarChart data={spendPerAccount} title="AccountSpendPerYear" xLabel="Year" />
          </Box>
          <Box className={styles.tableContainer}>
            <CustomTable
              data={overallSpendPerAccount.data}
              columns={overallSpendPerAccount.columns}
              header="AccountName"
              title=""
            />
            <CustomTable
              data={overallSpendImpressPerPlatform.data}
              columns={overallSpendImpressPerPlatform.columns}
              header="Platform"
              title=""
            />
          </Box>
          <Box className={styles.tableContainer}>
            <CustomTable
              data={topCampaignSpendClick.data}
              columns={topCampaignSpendClick.columns}
              header="Campaigns"
              title="TopCampaignSpend/Reacions"
            />
            <CustomTable
              data={topAdGroupImpressions.data}
              columns={topAdGroupImpressions.columns}
              header="AdGroup"
              title="TopAdGroupsImpressions"
            />
            <CustomTable
              data={topAdGroupReactions.data}
              columns={topAdGroupReactions.columns}
              header="AdGroup"
              title="TopAdGroupsReactions"
            />
          </Box>
        </Spinner>
      )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {databaseName && schemaName && (<C360Dashboard database={databaseName} schema={schemaName} />)}
      </CustomTabPanel>
    </Box>
  );
}
