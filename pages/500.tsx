import { experimentalStyled as styled } from "@material-ui/core/styles";
// material
import { Box, Button, Typography, Container } from "@material-ui/core";
//next
import NextLink from "next/link";
// components
import { MotionContainer } from "src/components/animate";
import Page from "src/components/Page";
import { SeverErrorIllustration } from "src/assets";
import useLocales from "src/hooks/useLocales";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page500() {
  const { translate } = useLocales();
  return (
    <RootStyle title="500 | Server Error">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 580, margin: "auto", textAlign: "center" }}>
            <Typography variant="h3" paragraph>
              {translate("pageNotFound.error")}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {translate("pageNotFound.contact")}
            </Typography>

            <SeverErrorIllustration
              sx={{ height: 260, my: { xs: 5, sm: 10 } }}
            />
            <NextLink href="/login">
              <Button size="large" variant="contained">
                {translate("common.back")}
              </Button>
            </NextLink>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
