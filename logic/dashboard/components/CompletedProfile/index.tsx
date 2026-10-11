import React from 'react';
import { IconWrapperStyle, RootStyle } from './style'
import { Typography } from '@material-ui/core';

interface Props {
  total: number;
  translate: any;
}

const CompletedProfile:React.VFC<Props> = ({ translate, total }) => {
  return (
    <RootStyle>
      <IconWrapperStyle />
      <Typography variant="h3">{total}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {translate("dashboard.totalCompletedProfile")}
      </Typography>
    </RootStyle>
  );
};

export default CompletedProfile;
