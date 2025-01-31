import { Tooltip as MuiTooltip, styled, tooltipClasses, TooltipProps } from '@mui/material';

interface Props extends TooltipProps {
  children: JSX.Element;
}

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.text.secondary,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.text.secondary,
    maxWidth: 'none',
  },
}));

export default function Tooltip({ children, ...props }: Props) {
  return (
    <StyledTooltip {...props} arrow>
      {children}
    </StyledTooltip>
  );
}
