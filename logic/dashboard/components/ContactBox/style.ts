import { Grid } from "@material-ui/core";
import {experimentalStyled as styled} from "@material-ui/core/styles";

export const CustomGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: '15px 0'
}));
