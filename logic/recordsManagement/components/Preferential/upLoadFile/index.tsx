import { isString } from "lodash";
import { Icon } from "@iconify/react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import fileFill from "@iconify/icons-eva/file-fill";
import closeFill from "@iconify/icons-eva/close-fill";
import { motion, AnimatePresence } from "framer-motion";
import { InsertDriveFileOutlined as InsertDriveFileOutlinedIcon } from "@material-ui/icons"
// material
import {
  alpha,
  Theme,
  experimentalStyled as styled,
} from "@material-ui/core/styles";
import {
  Box,
  List,
  Link,
  Stack,
  Paper,
  Button,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid
} from "@material-ui/core";
import { SxProps } from "@material-ui/system";
import UploadIllustration from "./illustration_upload";
import useLocales from "src/hooks/useLocales";

// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
  [theme.breakpoints.up("md")]: { textAlign: "left", flexDirection: "row" },
}));

// ----------------------------------------------------------------------

interface CustomFile extends File {
  path?: string;
  preview?: string;
}

interface UploadMultiFileProps extends DropzoneOptions {
  error?: boolean;
  files: (File | string)[];
  onDownFile: any
  onRemove: (file: File | any) => void;
  sx?: SxProps<Theme>;
}

const getFileData = (file: CustomFile | string) => {
  if (typeof file === "string") {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file?.size || "",
    preview: file?.preview || "",
  };
};
export default function UploadMultiFile({
  error,
  files,
  onRemove,
  onDownFile,
  sx,
  ...other
}: UploadMultiFileProps) {
  const hasFile = files?.length > 0;
  const { translate } = useLocales();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    ...other,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Grid container>
        <Grid item xs={6}>
          <DropZoneStyle
            {...getRootProps()}
            sx={{
              ...(isDragActive && { opacity: 0.72 }),
              ...((isDragReject || error) && {
                color: "error.main",
                borderColor: "error.light",
                bgcolor: "error.lighter",
              }),
            }}
          >
            <input {...getInputProps()} />

            <UploadIllustration sx={{ width: 220 }} />

            <Box sx={{ p: 3, ml: { md: 2 } }}>
              <Typography gutterBottom variant="h5">
                {translate("userManager.drop")}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {translate("userManager.drop")}&nbsp;
                <Link underline="always">{translate("common.here")}</Link>
              </Typography>
            </Box>
          </DropZoneStyle>
        </Grid>
        <Grid item xs={6} sx={{ paddingLeft: "8px" }}>
          <List disablePadding >
            <AnimatePresence>
              {files.map((file, index) => {
                const { key, name } = getFileData(
                  file as CustomFile
                );
                return (
                  <ListItem
                    key={key}
                    component={motion.div}
                    onClick={() => onDownFile(file)}
                    sx={{
                      my: 1,
                      py: 0.75,
                      px: 2,
                      borderRadius: 1,
                      border: (theme) => `solid 1px ${theme.palette.divider}`,
                      bgcolor: "background.paper",
                    }}
                  >
                    <ListItemIcon>
                      <InsertDriveFileOutlinedIcon width={28} height={28} />
                    </ListItemIcon>
                    <ListItemText
                      primary={isString(file) ? file : name}
                      primaryTypographyProps={{ variant: "subtitle2" }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => onRemove(index)}
                      >
                        <Icon icon={closeFill} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </AnimatePresence>
          </List>
        </Grid>
      </Grid>
    </Box >
  );
}
