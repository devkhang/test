import { motion } from "framer-motion";
// next
import NextLink from "next/link";
// material
import styled from "@material-ui/system/styled";
import { Box, Button, Typography, Container } from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
// components
import { MotionContainer, varBounceIn } from "src/components/animate";
import Page from "src/components/Page";
import { PageNotFoundIllustration } from "src/assets";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function PageNotFound() {
  const { translate } = useLocales();
  return (
    <RootStyle title={translate("pageNotFound.title")}>
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 680, margin: "auto", textAlign: "center" }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                {translate("pageNotFound.notFound")}
              </Typography>
            </motion.div>
            <Typography sx={{ color: "text.secondary" }}>
              {translate("pageNotFound.contact")}
            </Typography>

            <motion.div variants={varBounceIn}>
              <PageNotFoundIllustration
                sx={{ height: 260, my: { xs: 5, sm: 10 } }}
              />
            </motion.div>

            <NextLink href="/dashboard">
              <Button size="large" variant="contained">
                {translate("pageNotFound.goHome")}
              </Button>
            </NextLink>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
