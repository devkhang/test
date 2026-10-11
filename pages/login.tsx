import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  InputAdornment,
  IconButton,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useRouter } from "next/router";
import { useReducer } from "@vna/lib/dist/commons";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { loginReducer, style } from "logic/login";
import FormDialog from "logic/components/dialogs/FormDialog";
import { StateAgenciesHardCode } from "src/utils/options";
import { SelectChangeEvent } from "@mui/material";

const initialState = {
  userName: "",
  password: "",
  email: "",
  isShow: false,
  isMemory: false,
  forgotPass: false,
};

const Login = () => {
  const classes = style();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [state, dispatch] = useReducer({
    reducer: loginReducer,
    name: loginReducer.name,
    initialState,
    router: useRouter(),
    enqueueSnackbar,
    translate,
  });
  const [valueSelect, setValueSelect] = useState<string>("");

  useEffect(() => {
    dispatch("initial");
  }, []);
  useEffect(() => {
    const link  = window.location.href
      const parts = link.split('/');
      const baseUrl = parts[0] + '//' + parts[2];
      const valueFind =  StateAgenciesHardCode?.find(e => e?.value == baseUrl)
      setValueSelect(valueFind?.value || StateAgenciesHardCode[0]?.value);
  } ,[])
  const handChangeSelect = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    setValueSelect(value);
    router.push(value);
  };

  const { userName, password, isShow, isMemory, forgotPass, email } = state;

  return (
    <>
      <Grid container className={classes.background}></Grid>
      <Grid container className={classes.layout}>
        {!forgotPass && (
          <div className={classes.filter}>
            <Grid item className={classes.center} xs={12}>
              <Avatar
                alt="My Avatar"
                src="/static/mock-images/avatars/logo.png"
                sx={{ width: 80, height: 80 }}
              />
              <Typography variant="h6" className={classes.textAlign}>
                {translate("login.title")}
              </Typography>
              <div className={classes.layoutForm}>
                <FormControl fullWidth>
                  <InputLabel>Lựa chọn đơn vị</InputLabel>
                  <Select
                    id="demo-simple-select"
                    variant="outlined"
                    sx={{
                      "& .css-1uoamub-MuiFormLabel-root-MuiInputLabel-root": {
                        backgroundColor: "white",
                      },
                    }}
                    value={valueSelect}
                    onChange={handChangeSelect}
                  >
                    {StateAgenciesHardCode?.map((item) => (
                      <MenuItem key={item?.display} value={item.value}>
                        {item.display}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  className={classes.widthTextFiled}
                  value={userName}
                  label={`${translate("login.userName")}`}
                  onChange={(e) =>
                    dispatch({
                      type: "onChange",
                      value: e.target.value,
                      name: "userName",
                    })
                  }
                  onKeyPress={(e) =>
                    dispatch({ type: "onSubmit", keypress: e.key })
                  }
                ></TextField>
                <TextField
                  className={classes.widthTextFiled}
                  type={isShow ? "" : "Password"}
                  value={password}
                  onChange={(e) =>
                    dispatch({
                      type: "onChange",
                      value: e.target.value,
                      name: "password",
                    })
                  }
                  onKeyPress={(e) =>
                    dispatch({ type: "onSubmit", keypress: e.key })
                  }
                  label={`${translate("login.password")}`}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          className={classes.white}
                          onClick={(e) => dispatch("showPassword")}
                        >
                          {isShow ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
                <Box className={classes.flexSpace}>
                  <Box className={classes.flexSpace}>
                    <Checkbox
                      checked={isMemory}
                      onClick={(e) =>
                        dispatch({
                          type: "onChange",
                          value: !isMemory,
                          name: "checkbox",
                        })
                      }
                    />
                    <Typography>{translate("login.memoryAccount")}</Typography>
                  </Box>
                  <Button
                    className={classes.link}
                    variant="text"
                    onClick={() => dispatch("forgotPassword")}
                  >
                    {translate("login.forgotPassword")}
                  </Button>
                </Box>
                <Box className={classes.button}>
                  <Button
                    onClick={(e) =>
                      dispatch({ type: "onSubmit", typeClick: e.type })
                    }
                  >
                    {translate("login.login")}
                  </Button>
                </Box>
              </div>
            </Grid>
          </div>
        )}
        <FormDialog
          open={!!forgotPass}
          noAction={true}
          title={"login.forgotPassword"}
        >
          <Typography className={classes.textCenter}>
            {translate("login.pleaseInput")}
          </Typography>
          <div className="">
            <TextField
              className={classes.widthTextFiled}
              value={email}
              label={`${translate("login.email")}`}
              onChange={(e) =>
                dispatch({
                  type: "onChange",
                  value: e.target.value,
                  name: "email",
                })
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  dispatch("sendRequire");
                }
                return;
              }}
            />
            <Box className={classes.buttonForgot}>
              <Button
                onClick={(e) =>
                  dispatch({ type: "sendRequire", typeClick: e.type })
                }
              >
                {translate("login.sendRequire")}
              </Button>
            </Box>
            <Box className={classes.flexCenter}>
              <Typography>{translate("login.haveAccount")}</Typography>
              <Button
                className={classes.link}
                variant="text"
                onClick={() => dispatch("forgotPassword")}
              >
                {translate("login.login")}
              </Button>
            </Box>
          </div>
        </FormDialog>
      </Grid>
    </>
  );
};

export default Login;
