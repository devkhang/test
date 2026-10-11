import React from "react";
import DashboardLayout from "src/layouts/dashboard";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const style = makeStyles(() => ({
  div: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
}));

const Updating = () => {
  const classes = style();
  return (
    <DashboardLayout>
      <div className={classes.div}>
        <div>
          <Box
            component="img"
            alt="Updating image"
            src="/static/updating-loading.png"
            sx={{ objectFit: "cover" }}
          ></Box>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Updating;
