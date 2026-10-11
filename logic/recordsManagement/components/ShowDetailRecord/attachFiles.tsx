import { isString } from "lodash";
import { Icon } from "@iconify/react";
import { DropzoneOptions } from "react-dropzone";
import fileOutline from "@iconify/icons-eva/file-outline";
import eyeOutline from "@iconify/icons-eva/eye-outline";
import { motion, AnimatePresence } from "framer-motion";
// material
import {
  Grid,
  Theme,
  Box,
  List,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from "@material-ui/core";
import { SxProps } from "@material-ui/system";
import { MIconButton } from "src/components/@material-extend";
import { uuidv4 } from "logic/recordsManagement/components/utils";

interface CustomFile extends File {
  path?: string;
  url?: string;
}

interface UploadMultiFileProps extends DropzoneOptions {
  classes?: any;
  error?: boolean;
  files: (File | string)[];
  sx?: SxProps<Theme>;
}

const getFileData = (file: CustomFile | string) => {
  if (typeof file === "string") {
    return {
      key: file,
    };
  }
  return {
    key: file?.name || uuidv4(),
    size: file?.size || 0,
    name: file?.name || "",
    url: file?.url || "",
    path: file?.path || "Invalid file...",
  };
};
export default function UploadMultiFile({
  classes,
  error,
  files,
  sx,
  ...other
}: UploadMultiFileProps) {
  const hasFile = files.length > 0;
  return (
    <Box sx={{ width: "100%", ...sx }}>
      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        <Grid
          sx={{ display: "flex" }}
          direction="row"
          justifyContent="space-between"
          paddingLeft="55px"
        >
          <Typography>Tên file</Typography>
          <Typography>Thao tác</Typography>
        </Grid>
        <AnimatePresence>
          {(files || []).map((file) => {
            const { key, path, url } = getFileData(file as CustomFile);
            path != "";
            return (
              <ListItem
                key={key}
                component={motion.div}
                sx={{
                  my: 1.5,
                  py: 1,
                  px: 2,
                  borderRadius: 1,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                  bgcolor: "background.paper",
                }}
              >
                <ListItemIcon>
                  <Icon icon={fileOutline} width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  title={isString(file) ? file : path}
                  primary={isString(file) ? file : path}
                  primaryTypographyProps={{ variant: "subtitle2" }}
                  className={classes.color}
                />
                <ListItemSecondaryAction>
                  <Link variant="body2" href={url}>
                    <MIconButton edge="end" size="medium">
                      <Icon icon={eyeOutline} />
                    </MIconButton>
                  </Link>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>
    </Box>
  );
}
