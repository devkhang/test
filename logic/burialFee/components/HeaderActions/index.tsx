import React from "react";
import { Box, Button } from "@material-ui/core";
import classnames from "classnames";
import { styles } from "./style";

const Index = ({ dispatch, translate, doet }) => {
  const classes = styles();
  const isDoet = !!doet.parentId;
  return (
    <Box className={classes.headActions}>
      <Box className={classes.btnWrapper}>
        {isDoet && (
          <>
            <Button
              variant="contained"
              color="success"
              className={classnames(classes.btn, classes.btnAdd)}
              onClick={() =>
                dispatch({ type: "openModal", data: { name: "addNew" } })
              }
            >
              {translate("common.add")}
            </Button>
            <Button
              color="error"
              variant="outlined"
              className={classes.btn}
              onClick={() =>
                dispatch({ type: "openConfirm", data: { name: "deleteAll" } })
              }
            >
              {translate("common.delete")}
            </Button>
          </>
        )}
        <Button
          color="success"
          variant="outlined"
          className={classnames(classes.btn, classes.printBtn)}
        >
          {translate("recordsManagement.printForm")}
        </Button>
        <Button
          color="success"
          variant="outlined"
          className={classnames(classes.btn, classes.printBtn)}
        >
          {translate("recordsManagement.printDesitions")}
        </Button>
      </Box>
    </Box>
  );
};

export default Index;
