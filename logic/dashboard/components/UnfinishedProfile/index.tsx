import React from 'react';
import { IconWrapperStyle, RootStyle } from './style'
import { Typography } from '@material-ui/core';

interface Props {
  total: number;
  translate: any;
}

const UnfinishedProfile:React.VFC<Props> = ({ translate, total }) => {
  return (
    <RootStyle>
      <IconWrapperStyle />
      <Typography variant="h3">{ total }</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {translate("dashboard.totalUnFinishedProfile")}
      </Typography>
    </RootStyle>
  );
};

export default UnfinishedProfile;
