import React, { useEffect } from "react";
import { Grid, Tabs, Tab, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyle = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    text: {
      marginTop: "15px",
      fontWeight: 600,
      fontSize: "20px",
      color: isDark ? "white" : "black",
    },
    tabs: {
      paddingBottom: "10px",
      "& .MuiTabScrollButton-root": {
        marginBottom: "10px",
        width: "30px",
      },
      "& .MuiTabs-hideScrollbar": {
        marginBottom: "10px",
        border: "1px solid #E0E0E0",
        borderRadius: "8px",
        boxShadow: "0px 5px 5px 1px #cdcdcd",
      },
      "&.MuiTab-root:not(:last-child)": { marginRight: 0 },
      "& .Mui-selected": {
        color: "white",
        backgroundColor: theme.palette.primary.main,
        borderRadius: "8px",
        transition: "1s",
        marginRight: 0,
      },
      "& .MuiTabs-indicator": {
        display: "none",
      },
      "& svg": {
        color: isDark ? "white" : "black",
      },
    },
    tab: {
      borderRight: "1px solid #E0E0E0",
      borderRadius: 0,
      padding: "18px 10px",
      marginRight: 0,
      width: "18%",
      "&.MuiTab-root:not(:last-child)": {
        marginRight: 0,
      },
      "& .span": {
        width: "100%",
        display: "inline-block",
        // display: "-webkit-box",
        // webkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        // whiteSpace: "normal",
        // webkitLineClamp: "2",
        // lineHeight: "1.6rem",
        whiteSpace: "nowrap",
      },
    },
  };
});

export default function Head(props: any) {
  const { dispatch, data } = props;
  const { categories, category, catValue } = data;
  const classes = useStyle();

  return (
    <Grid container sx={{ padding: "20px 8px" }}>
      <Tabs
        className={`${classes.tabs} sad`}
        value={catValue}
        variant="scrollable"
        scrollButtons
      >
        {(categories || []).map((item: any, index: any) => (
          <Tab
            key={index}
            title={item.name}
            onClick={() => dispatch({ type: "selectCategory", item, index })}
            className={`${classes.tab} asdsda`}
            label={<span className="span">{item.name}</span>}
          />
        ))}
      </Tabs>
      <Typography className={classes.text}>
        {(category?.name || "").toUpperCase() || ""}
      </Typography>
    </Grid>
  );
}
