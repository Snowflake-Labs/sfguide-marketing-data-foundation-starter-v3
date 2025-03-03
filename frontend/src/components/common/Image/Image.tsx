import { Box } from '@mui/material';
import { imagesPathDictionary } from 'utils/GetImagePath';

interface Props {
  image_name: string;
  image_height: number;
  image_width: number;
}

export default function Image(props: Props) {
  const imageSrc = Object.keys(imagesPathDictionary).find((key) =>
    props.image_name.startsWith(key)
  );

  return (
    <Box
      component="img"
      sx={{ height: props.image_height, width: props.image_width }}
      src={imageSrc ? imagesPathDictionary[imageSrc] : ''}
    />
  );
}
