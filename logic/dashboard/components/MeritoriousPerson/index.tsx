import React from 'react';
import { Typography } from '@material-ui/core';
import { IconWrapperStyle, RootStyle } from './style'

interface Props {
  total: number;
  translate: any;
}

const MeritoriousPerson:React.VFC<Props> = ({ translate, total }) => {
  return (
    <RootStyle>
      <IconWrapperStyle />
      <Typography variant="h3">{ total }</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {translate("dashboard.totalNCC")}
      </Typography>
    </RootStyle>
  );
};

export default MeritoriousPerson;
