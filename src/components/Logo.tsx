import React from "react";
// material
import { useTheme } from "@material-ui/styles";
import { Box, BoxProps, Theme } from "@material-ui/core";

// ----------------------------------------------------------------------

const Logo = React.forwardRef<any, BoxProps>(({ sx }, ref) => {
  const theme = useTheme<Theme>();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  return (
    <Box ref={ref} sx={{ width: 240, cursor: "pointer", ...sx }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        data-name="Layer 1"
        viewBox="0 0 240.36 68.88"
      >
        <defs>
          <linearGradient
            id="GradientFill_1"
            x1="40.52"
            y1="30.4"
            x2="95.33"
            y2="64.48"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#f9ec00" />
            <stop offset="0.25" stopColor="#f5aa1c" />
            <stop offset="0.57" stopColor="#f9ec00" />
            <stop offset="0.73" stopColor="#facb0d" />
            <stop offset="1" stopColor="#f9ec00" />
          </linearGradient>
        </defs>
        <path
          d="M101.55,26.21A27.34,27.34,0,0,1,104.4,34a59,59,0,0,1,1,11.79v4.39c0,7.63-.73,13.18-2.23,16.64Q97.32,82.1,75.28,82.08l-10.19,0c-2.79,0-5.54-.07-8.27-.13l-3.94-.09-3.52-.09V14.17l25.74-.25c7.26,0,13.2,1.23,17.78,3.69a20.28,20.28,0,0,1,8.67,8.6Zm-13,17.4c0-6.8-1-11.2-3.09-13.23-1.85-2.05-5.82-3.07-11.94-3.07-1.84,0-4.23.15-7.12.43V68.42a31.56,31.56,0,0,0,3.21.23l4.26,0q9.21,0,12-3.34a9.6,9.6,0,0,0,1.75-3.6,26.61,26.61,0,0,0,1-7.74Z"
          transform="translate(-12.64 -13.92)"
          style={{ fill: "#f60", fillRule: "evenodd" }}
        />
        <path
          d="M101.23,26.63A26.7,26.7,0,0,1,104,34.25a57.49,57.49,0,0,1,1,11.55v4.31q0,11.22-2.19,16.32-5.73,15-27.34,15l-10,0c-2.73,0-5.42-.07-8.1-.13l-3.86-.09c-1.53,0-2.68-.05-3.46-.08V14.83l25.24-.41c7.11,0,12.94,1.37,17.43,3.78a19.88,19.88,0,0,1,8.5,8.43ZM88.44,43.69q0-10-3-13-2.7-3-11.7-3-2.71,0-7,.42V68a30.51,30.51,0,0,0,3.15.22l4.17,0q9,0,11.72-3.28a9.46,9.46,0,0,0,1.72-3.53,26.32,26.32,0,0,0,1-7.58Z"
          transform="translate(-12.64 -13.92)"
          style={{ fill: "url(#GradientFill_1)", fillRule: "evenodd" }}
        />
        <path
          d="M66.73,68a62.52,62.52,0,0,0,7.49,0c6.44-.37,9.6-1.12,11.33-3.06,2.6-3.86,2.47-5,2.65-11.09l.36-11.81c0-.19,14.12-14,15-14.11,3.35,8.78,4,30.56.19,39.23q-6,15.61-28.47,15.6l-10.41,0c-2.85,0-5.65-.08-8.44-.14l-4-.09-3.59-.09V61.76a66.87,66.87,0,0,0,18-8.32Z"
          transform="translate(-12.64 -13.92)"
          style={{ fill: "#cbcbcb", fillRule: "evenodd" }}
        />
        <path
          d="M25.59,30.54C-2.56,56.88,57.76,47,75.56,40.18c-1.12-2.45-2-4.8-3.16-7.25L69.91,39.8c-1.06.4-2.13.69-3.21,1.08,1.86-6.62,3.72-12.89,5.58-19.51l6.57,14.94c9-3.68,18.29-7.25,27.32-10.94-7.14,7-14.5,14-21.64,21,2.45,5.86,4.7,12.4,7.15,18.43H251v2.88H93.1c-6.88-3-13.75-6.77-20.62-9.75l-11.7,7.56L71.93,53.84c3.17,1.13,6.68,2.26,9.85,3.39-1-3.29-2.43-6.58-3.48-9.86L86.87,38C79.26,40.38,6.77,68,13,41.64A28.11,28.11,0,0,1,25.59,30.54Z"
          transform="translate(-12.64 -13.92)"
          fill={PRIMARY_MAIN}
          // style={{ fill: "#ff0", fillRule: "evenodd" }}
        />
        <path
          d="M24.07,54.09C18.78,73,62.19,60,73.48,48.11,59.76,68.72,4.58,74.5,24.07,54.09Z"
          transform="translate(-12.64 -13.92)"
          fill={PRIMARY_MAIN}
          // style={{ fill: "#ff0", fillRule: "evenodd" }}
        />
        <path
          d="M26.55,54.23c5.75,3.82,30.14-1.62,52.85-11.42C74.94,47.56,26.31,73.5,26.55,54.23Z"
          transform="translate(-12.64 -13.92)"
          fill={PRIMARY_MAIN}
          // style={{ fill: "#fff112", fillRule: "evenodd" }}
        />
        <text
          transform="translate(76.47 49.97)"
          fill={PRIMARY_MAIN}
          style={{
            fontSize: "23.849300384521484px",
            fontFamily: "Arial-BoldMT, Arial;font-weight:700",
          }}
        >
          VN
          <tspan
            x="33.13"
            y="0"
            style={{ letterSpacing: "-0.03713912665022487em" }}
          >
            A{" "}
          </tspan>
          <tspan x="55.21" y="0">
            Appraisal
          </tspan>
        </text>
      </svg>
    </Box>
  );
});

export default Logo;
