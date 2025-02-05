import { TextType } from './TextType';
import { Text } from './Text';
import { TextProps } from './TextProps';

export const H6 = (props: TextProps) => {
  const h6 = <Text {...props} variant={TextType.PageHeader}></Text>;
  return h6;
};

export const Subtitle1 = (props: TextProps) => {
  const subtitle1 = <Text {...props} variant={TextType.SubHeader}></Text>;
  return subtitle1;
};

export const Subtitle2 = (props: TextProps) => {
  const subtitle2 = <Text {...props} variant={TextType.BodyMediumBold}></Text>;
  return subtitle2;
};

export const Body1 = (props: TextProps) => {
  const body1 = <Text {...props} variant={TextType.BodyLarge}></Text>;
  return body1;
};

export const Body2 = (props: TextProps) => {
  const body2 = <Text {...props} variant={TextType.BodyMedium}></Text>;
  return body2;
};

export const CaptionBold = (props: TextProps) => {
  const captionBold = <Text {...props} fontWeight={500} fontSize="12px" lineHeight="20px"></Text>;
  return captionBold;
};

export const Caption = (props: TextProps) => {
  const caption = <Text {...props} variant={TextType.BodySmall}></Text>;
  return caption;
};

export const MetricsBold = (props: TextProps) => {
  const MetricsBold = <Text {...props} fontWeight={400} fontSize="36px" lineHeight="normal" color="#5D6A85"></Text>;
  return MetricsBold;
};

export const GraphTitle = (props: TextProps) => {
  const GraphTitle = <Text {...props} fontWeight={500} fontSize="16px" lineHeight="28px" color= "#1E252FDE" fontFamily="Inter" letterSpacing="0.15px"></Text>;
  return GraphTitle;
};