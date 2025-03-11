import AccordionCard, { IAccordionCardProps } from 'components/ListWithSection/AccordionCard/AccordionCard';
import style from './AccordionSection.module.scss';
import { Box } from '@mui/material';
import { useTranslation } from 'locales/i18n';
import { Subtitle2 } from 'components/common/Text/TextComponents';

export interface IAccordionSectionProps {
  accordionSummary: string;
  accordionCards: IAccordionCardProps[];
}

export default function AccordionSection({ accordionSummary, accordionCards }: IAccordionSectionProps) {
  const { t } = useTranslation('common');
  return (
    <>
      {accordionSummary ?? <Subtitle2 sx={{ py: '8px' }}>{t(accordionSummary)}</Subtitle2>}
      <Box className={style.sourcesContainer}>
        {accordionCards.map((accordionCard, index) => (
          <AccordionCard key={`accordion-card-${index}`} {...accordionCard} />
        ))}
      </Box>
    </>
  );
}
