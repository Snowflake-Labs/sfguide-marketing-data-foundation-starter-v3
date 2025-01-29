import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { GraphTitle } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';

interface IBarChart {
  data: {
    dataset: {}[];
    series: {
      dataKey: string;
      label: string;
    }[];
  };
  xLabel: string;
  title: string;
}
[];

export default function CustomBarChart({ data, xLabel, title }: IBarChart) {
  const { t } = useTranslation('common');

  return (
    <div>
      <GraphTitle>{t(title)}</GraphTitle>
      <BarChart
        sx={{ '& .MuiChartsLegend-series text': { fontSize: '0.8em !important' } }}
        width={380}
        height={300}
        dataset={data.dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'year', label: t(xLabel) }]}
        series={data.series}
      />
    </div>
  );
}
