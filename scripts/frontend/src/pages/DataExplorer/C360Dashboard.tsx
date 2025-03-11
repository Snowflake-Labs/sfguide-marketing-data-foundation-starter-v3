import { useTranslation } from 'locales/i18n';
import { H6, Subtitle1 } from 'components/common/Text/TextComponents';
import styles from './DataExplorer.module.scss';
import { container } from 'ioc/inversify.config';
import { TYPES } from 'ioc/types';
import { useEffect, useState } from 'react';
import MetricCard from 'components/MetricCard/MetricCard';
import { IDataExplorerService } from 'interfaces/IDataExplorerService';
import { Box } from '@mui/material';
import {
  webinarMetrics,
  geoGroup,
  customersOverview,
  deviceType,
  browserType,
  purchaseTime,
  statusCounts,
} from 'dtos/DataExplorer';
import Spinner from 'components/common/Spinner/Spinner';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  LineControllerChartOptions,
  BarControllerChartOptions,
  ChartData,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';
import Plot from 'react-plotly.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, TimeScale);

interface DashboardProps {
  database: string;
  schema: string;
}

export default function C360Dashboard(props: DashboardProps) {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);
  const [webinar_data, setWebinarData] = useState<webinarMetrics>();
  const [statusCount, setStatusCount] = useState<statusCounts[]>();
  const [customersOverview, setCustomersOverview] = useState<customersOverview>();
  const [purchaseTime, setPurchaseTime] = useState<purchaseTime[]>();
  const [geoGroup, setGeoGroup] = useState<geoGroup[]>();
  const [deviceType, setDeviceType] = useState<deviceType[]>();
  const [browserType, setBrowserType] = useState<browserType[]>();
  const DataExplorerServices = container.get<IDataExplorerService>(TYPES.IDataExplorerService);

  useEffect(() => {
    if (!props.database || !props.schema) return;
    setLoading(true);
    DataExplorerServices.get_webinar_data(props.database, props.schema).then((data) => {
      setWebinarData(data);
      setLoading(false);
    });
    DataExplorerServices.get_status_counts(props.database, props.schema).then((data) => {
      setStatusCount(data);
    });
    DataExplorerServices.get_customers_overview(props.database, props.schema, 500).then((data) => {
      setCustomersOverview(data);
    });
    DataExplorerServices.get_country_group(props.database, props.schema).then((data) => {
      setGeoGroup(data);
    });
    DataExplorerServices.get_purchase_time(props.database, props.schema).then((data) => {
      setPurchaseTime(data);
    });
    DataExplorerServices.get_device_type(props.database, props.schema).then((data) => {
      setDeviceType(data);
    });
    DataExplorerServices.get_browser_type(props.database, props.schema).then((data) => {
      setBrowserType(data);
    });
  }, [props.schema]);

  const registrationStatusDS = (dataset: statusCounts[]) => {
    if (!dataset || dataset.length == 0)
      return {
        labels: [],
        datasets: [],
      };
    return {
      labels: ['Registered', 'Attended', 'No Show', 'Attended On-demand'],
      datasets: [
        {
          label: 'Facebook',
          data: [
            dataset.find(
              (d: { STATUS: string; UTM_SOURCE: string }) => d.STATUS === 'Registered' && d.UTM_SOURCE === 'facebook'
            )?.COUNTS || 0,
            dataset.find(
              (d: { STATUS: string; UTM_SOURCE: string }) => d.STATUS === 'Attended' && d.UTM_SOURCE === 'facebook'
            )?.COUNTS || 0,
            dataset.find(
              (d: { STATUS: string; UTM_SOURCE: string }) => d.STATUS === 'No Show' && d.UTM_SOURCE === 'facebook'
            )?.COUNTS || 0,
            dataset.find(
              (d: { STATUS: string; UTM_SOURCE: string }) =>
                d.STATUS === 'Attended On-demand' && d.UTM_SOURCE === 'facebook'
            )?.COUNTS || 0,
          ],
          backgroundColor: 'rgba(66, 103, 178, 0.6)', // Facebook Blue
        },
        {
          label: 'LinkedIn',
          data: [
            dataset.find(
              (d: { STATUS: string; UTM_SOURCE: string }) => d.STATUS === 'Registered' && d.UTM_SOURCE === 'linkedin'
            )?.COUNTS || 0,
            dataset.find(
              (d: { STATUS: string; UTM_SOURCE: string }) => d.STATUS === 'Attended' && d.UTM_SOURCE === 'linkedin'
            )?.COUNTS || 0,
            dataset.find(
              (d: { STATUS: string; UTM_SOURCE: string }) => d.STATUS === 'No Show' && d.UTM_SOURCE === 'linkedin'
            )?.COUNTS || 0,
            dataset.find(
              (d: { STATUS: string; UTM_SOURCE: string }) =>
                d.STATUS === 'Attended On-demand' && d.UTM_SOURCE === 'linkedin'
            )?.COUNTS || 0,
          ],
          backgroundColor: 'rgba(0, 119, 181, 0.6)', // LinkedIn Blue
        },
      ],
    };
  };

  const geoGroupDS = (data: geoGroup[]): ChartData<'bar', number[], string> => {
    return {
      labels: data.map((item) => item.GEO_COUNTRY),
      datasets: [
        {
          label: 'Counts',
          data: data.map((item) => item.COUNTS),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  const purchaseTimeDS = (data: purchaseTime[]) => {
    const groupedData = data.reduce(
      (acc: Record<string, { total: number; count: number; monthDate: Date }>, current) => {
        const date = new Date(current.EVENT_DATE);
        const month = format(date, 'yyyy-MM'); // Format as YYYY-MM
        if (!acc[month]) {
          acc[month] = { total: 0, count: 0, monthDate: date };
        }
        acc[month].total += current.AVG_TIME_SPENT;
        acc[month].count += 1;
        return acc;
      },
      {}
    );

    const sortedData = Object.keys(groupedData)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort by date
      .map((month) => ({
        month: parseISO(`${month}-01`).toISOString(), // Convert Date to string
        avgTimeSpent: groupedData[month].total / groupedData[month].count,
      }));

    const chartData = {
      labels: sortedData.map((item) => item.month),
      datasets: [
        {
          label: 'Average Time Spent (ms)',
          data: sortedData.map((item) => item.avgTimeSpent),
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    };
    return chartData;
  };

  const registrationStatusOptions:
    | _DeepPartialObject<
        CoreChartOptions<'bar'> &
          ElementChartOptions<'bar'> &
          PluginChartOptions<'bar'> &
          DatasetChartOptions<'bar'> &
          ScaleChartOptions<'bar'> &
          BarControllerChartOptions
      >
    | undefined = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Event Status by UTM Source',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const goeGroupOptions:
    | _DeepPartialObject<
        CoreChartOptions<'bar'> &
          ElementChartOptions<'bar'> &
          PluginChartOptions<'bar'> &
          DatasetChartOptions<'bar'> &
          ScaleChartOptions<'bar'> &
          BarControllerChartOptions
      >
    | undefined = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Counts by Country',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  const purchaseTimeOptions:
    | _DeepPartialObject<
        CoreChartOptions<'line'> &
          ElementChartOptions<'line'> &
          PluginChartOptions<'line'> &
          DatasetChartOptions<'line'> &
          ScaleChartOptions<'line'> &
          LineControllerChartOptions
      >
    | undefined = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Time Spent by Event Date',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          tooltipFormat: 'P',
        },
        title: {
          display: true,
          text: 'Event Date',
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Average Time Spent (ms)',
        },
      },
    },
  };

  return (
    <>
      {props.database && props.schema && (
        <Spinner loading={loading}>
          <H6>{t('ConversionStatusSummary')}</H6>
          <Box className={styles.graphContainer}>
            {webinar_data && (
              <>
                <MetricCard title={t('WebsiteVisitors')} body={webinar_data?.overall_engagements} />
                <MetricCard title={t('WebinarRegistrations')} body={webinar_data?.user_attended} />
                <MetricCard title={t('WebinarAttendees')} body={webinar_data?.user_registered} />
              </>
            )}
          </Box>
          <Box className={styles.graphContainer}>
            {webinar_data && (
              <>
                <MetricCard title={t('WebsiteConversionRate')} body={webinar_data?.website_conversions + '%'} />
                <MetricCard title={t('Attendance')} body={webinar_data?.attendance + '%'} />
              </>
            )}
          </Box>
          <H6>{t('RegistrationStatus')}</H6>
          {statusCount && <Bar data={registrationStatusDS(statusCount)} options={registrationStatusOptions} />}
          <H6>{t('CustomerClickAnalytics')}</H6>
          <Subtitle1>{t('CustomersOverview')}</Subtitle1>
          <>
            {customersOverview && (
              <>
                <Box className={styles.graphContainer}>
                  <MetricCard title={t('TotalUsers')} body={customersOverview.overall_users} />
                  <MetricCard title={t('NewUsers')} body={customersOverview.overall_users_last_n_days} />
                  <MetricCard title={t('Revenue')} body={customersOverview.revenue_last_days} />
                </Box>
                <Box className={styles.graphContainer}>
                  <MetricCard title={t('TotalPageViews')} body={customersOverview.total_page_view[0]} />
                  <MetricCard title={t('AveragePageViews')} body={Number(customersOverview.total_page_view[1])} />
                  <MetricCard title={t('SessionCount')} body={customersOverview.session_count} />
                </Box>
                <Box className={styles.graphContainer}>
                  <MetricCard title={t('CountOfPageViews')} body={customersOverview.page_views} />
                  <MetricCard title={t('NumberOfSessions')} body={customersOverview.avg_session_per_user} />
                  <MetricCard
                    title={t('NumberOfPageViewsPerSession')}
                    body={Number(customersOverview.page_view_per_user)}
                  />
                </Box>
              </>
            )}
            {geoGroup && <Bar data={geoGroupDS(geoGroup)} options={goeGroupOptions} />}
          </>
          <H6>{t('Detailed Statistics')}</H6>
          <Subtitle1>{t('TimeSpentOnWebsite')}</Subtitle1>
          {purchaseTime && <Line data={purchaseTimeDS(purchaseTime)} options={purchaseTimeOptions} />}
          {deviceType && (
            <Plot
              data={[
                {
                  x: deviceType.map((item) => new Date(item.EVENT_DATE)),
                  y: deviceType.map((item) => item.DESKTOP),
                  mode: 'lines',
                  text: 'Desktop',
                  name: 'Desktop',
                  marker: { color: 'blue' },
                },
                {
                  x: deviceType.map((item) => new Date(item.EVENT_DATE)),
                  y: deviceType.map((item) => item.MOBILE),
                  mode: 'lines',
                  text: 'Mobile',
                  name: 'Mobile',
                  marker: { color: 'lightblue' },
                },
                {
                  x: deviceType.map((item) => new Date(item.EVENT_DATE)),
                  y: deviceType.map((item) => item.SMART_TV),
                  mode: 'lines',
                  text: 'Smart TV',
                  name: 'Smart TV',
                  marker: { color: 'red' },
                },
                {
                  x: deviceType.map((item) => new Date(item.EVENT_DATE)),
                  y: deviceType.map((item) => item.TABLET),
                  mode: 'lines',
                  text: 'Tablet',
                  name: 'Tablet',
                  marker: { color: 'pink' },
                },
              ]}
              layout={{ title: t('UsersDeviceType') }}
              config={{ scrollZoom: true }}
            />
          )}
          {browserType && (
            <Plot
              data={[
                {
                  x: browserType.map((item) => new Date(item.EVENT_DATE)),
                  y: browserType.map((item) => item.CHROME),
                  mode: 'lines',
                  text: 'CHROME',
                  name: 'CHROME',
                  marker: { color: 'green' },
                },
                {
                  x: browserType.map((item) => new Date(item.EVENT_DATE)),
                  y: browserType.map((item) => item.EDGE),
                  mode: 'lines',
                  text: 'EDGE',
                  name: 'EDGE',
                  marker: { color: 'lightblue' },
                },
                {
                  x: browserType.map((item) => new Date(item.EVENT_DATE)),
                  y: browserType.map((item) => item.FIREFOX),
                  mode: 'lines',
                  text: 'FIREFOX',
                  name: 'FIREFOX',
                  marker: { color: 'red' },
                },
                {
                  x: browserType.map((item) => new Date(item.EVENT_DATE)),
                  y: browserType.map((item) => item.SAFARI),
                  mode: 'lines',
                  text: 'SAFARI',
                  name: 'SAFARI',
                  marker: { color: 'pink' },
                },
              ]}
              layout={{ title: t('UsersByBrowser') }}
              config={{ scrollZoom: true }}
            />
          )}
        </Spinner>
      )}
    </>
  );
}
