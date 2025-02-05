import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import styles from './DataQualityCard.module.scss';
import { Body2, Subtitle1 } from 'components/common/Text/TextComponents';


interface Props {
  title:string;
  description:string;
  link:string;

}

export default function DataQualityCard({title, description, link}:Props) {
    return (
        <Card className={styles.card} onClick={()=> window.open(link, "_blank")} variant='outlined' >
          <CardActionArea>
            <CardContent className={styles.content}>
              <Subtitle1 mb={2}>
              {title}
              </Subtitle1>
              <Body2 >
                {description}
              </Body2>
            </CardContent>
          </CardActionArea>
        </Card>
      );


}