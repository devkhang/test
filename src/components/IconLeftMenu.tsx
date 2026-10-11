import { Box, BoxProps } from '@material-ui/core';

// ----------------------------------------------------------------------

interface SvgIconStyleProps extends BoxProps {
  name: string;
}

export default function SvgIconStyle({
  name,
  color = 'inherit',
  sx
}: SvgIconStyleProps) {
  return (
    <Box
      component="span"
      className="material-icons"
      sx={{
        width: 26,
        height: 26,
        ...sx
      }}
    >
      {name}
    </Box>
  );
}
