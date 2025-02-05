import { Accordion, AccordionDetails, AccordionSummary, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSection, { IAccordionSectionProps } from '../AccordionSection/AccordionSection';
import { useTranslation } from 'locales/i18n';

export interface IAccordionForList {
  accordionSummary: string;
  accordionSections: IAccordionSectionProps[];
}

const MyAccordion = styled(Accordion)({
  backgroundColor: '#f8fbff',
  boxShadow: 'none',
});

export default function AccordionForList({ accordionSummary, accordionSections }: IAccordionForList) {
  const { t } = useTranslation('common');
  return (
    <MyAccordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
        {t(accordionSummary)}
      </AccordionSummary>
      <AccordionDetails>
        {accordionSections.map((accordionSection, index) => (
          <AccordionSection key={`accordion-section-${index}`} {...accordionSection} />
        ))}
      </AccordionDetails>
    </MyAccordion>
  );
}
