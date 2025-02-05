import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import styles from './LineChart.module.scss';
import YAxisLabel from 'components/YAxisLabel/YAxisLabel';
import { GraphTitle } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';

interface ILineChart {
  data: number[] | string[];
  xAxisLabels: string[] | undefined;
  xLabel: string;
  yLabel: string;
  title: string;
}

export default function CustomLineChart({ data, xAxisLabels, xLabel, yLabel, title }: ILineChart) {
  const { t } = useTranslation('common');

  return (
    <div>
      <GraphTitle>{t(title)}</GraphTitle>
      <div className={styles.lineContainer}>
        <YAxisLabel label={t(yLabel)} />
        <LineChart
          width={380}
          height={300}
          series={[{ data: data.map((number) => Number(number)) }]}
          xAxis={[{ scaleType: 'point', data: xAxisLabels, label: t(xLabel) }]}
        />
      </div>
    </div>
  );
}
