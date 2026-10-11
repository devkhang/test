import React, { useEffect } from "react";
import { Box, Container } from "@material-ui/core";
import { MotionContainer } from "src/components/animate";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import Auth from "api/Auth";
import Page from "src/components/Page";

export default function ResetPassword() {
  const router = useRouter();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const resetPassword = async (code) => {
    const { success } = await Auth.resetPassword({ code });
    if (success) {
      enqueueSnackbar(translate("login.passMes"), {
        variant: "success",
      });
      router.push("/login");
    } else {
      enqueueSnackbar(translate("login.passErr"), {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    let search = window.location.search;
    const code = new URLSearchParams(search).get("code");
    if (!!code) {
      resetPassword(code);
    }
  }, []);

  return (
    <Page title="Reset-password">
      <Container>
        <MotionContainer initial="initial" open>
          <Box></Box>
        </MotionContainer>
      </Container>
    </Page>
  );
}
