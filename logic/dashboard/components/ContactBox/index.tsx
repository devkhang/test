import React from 'react';
import { Grid, Card } from '@material-ui/core';
import { ArrowRight as ArrowRightIcon } from "@material-ui/icons";
import { CustomGrid } from "./style";

interface Props {
  translate: any;
}

const ContactBox = ({ translate }) => {
  return (
    <Card>
      <Grid container spacing={4} marginY={4} marginX={12}>
          <CustomGrid xs={12} sm={6}><ArrowRightIcon /> {translate("dashboard.supportPhoneNumber")}: (028) 35352523</CustomGrid>
          <CustomGrid xs={12} sm={6}><ArrowRightIcon /> {translate("dashboard.supportSoftware")}</CustomGrid>
          <CustomGrid xs={12} sm={6}><ArrowRightIcon /> {translate("dashboard.supportEmail")}: cskh@vnagroup.com.vn</CustomGrid>
          <CustomGrid xs={12} sm={6}><ArrowRightIcon /> {translate("dashboard.userManual")}</CustomGrid>
      </Grid>
    </Card>
  );
};

export default ContactBox;
