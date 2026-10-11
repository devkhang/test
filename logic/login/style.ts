import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import background from "assets/img/Rectangle.png";

export const style = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    background: {
      position: "fixed",
      display: "block",
      width: "100vw",
      height: "100vh",
      zIndex: -1,

      backgroundImage: `url(${background.src})`,
      backgroundPosition: "center center",
      backgroundSize: "cover",
    },

    filter: {
      position: "fixed",
      top: "50%",
      left: " 50%",
      transform: `translate(-50%, -50%)`,
      width: "500px",
      height: "500px",
      background: "white",
      backdropFilter: `blur(1px)`,
      zIndex: 1,
    },

    layout: {
      position: "fixed",
      zIndex: 2,
      display: "flex",
      height: "100%",
      color: "black",
      justifyContent: "center",

      "& > div": {
        filter: "none",
      },
    },

    center: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",

      "& > *": {
        marginTop: "16px",
      },
    },

    flexSpace: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    flexCenter: {
      margin: "10px 0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    white: {
      color: isDark ? "white" : "black",
    },

    button: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "55px",

      "& button": {
        color: "#fff",
        backgroundColor: theme.palette.primary.main,

        width: "180px",
        height: "100%",
      },
    },

    buttonForgot: {
      marginTop: "12px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "55px",

      "& button": {
        color: "#fff",
        backgroundColor: theme.palette.primary.main,

        width: "180px",
        height: "100%",
      },
    },

    link: {
      cursor: "pointer",
      color: theme.palette.primary.main,
      fontWeight: "100",
      fontSize: "16px",
    },

    layoutForm: {
      width: "400px",

      "& > *": {
        marginBottom: "20px",
      },
    },

    widthTextFiled: {
      width: "100%",

      "& > div > input": {
        color: isDark ? "white" : "black",
      },
    },

    header: {
      color: "white",
      position: "absolute",
    },

    textCenter: {
      marginBottom: "16px",
      textAlign: "center",
    },

    textAlign: {
      margin: "8px 12px",
      textAlign: "center",
    },
  };
});
