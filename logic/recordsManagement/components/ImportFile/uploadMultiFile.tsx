import { isString } from "lodash";
import { Icon } from "@iconify/react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import fileOutline from "@iconify/icons-eva/file-outline";
import closeFill from "@iconify/icons-eva/close-fill";
import eyeOutline from "@iconify/icons-eva/eye-outline";
import { motion, AnimatePresence } from "framer-motion";
// material
import {
  alpha,
  Theme,
  experimentalStyled as styled,
  Box,
  List,
  Link,
  Paper,
  Button,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { SxProps } from "@material-ui/system";
import { MIconButton } from "src/components/@material-extend";
import { cdn } from "services/aws/aws.service";

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  marginTop: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
  [theme.breakpoints.up("md")]: { textAlign: "left", flexDirection: "row" },
}));

const styles = makeStyles(() => ({
  contain: {
    whiteSpace: "nowrap",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: "48px",
  },
}));

interface CustomFile extends File {
  path?: string;
  url?: string;
}

interface UploadMultiFileProps extends DropzoneOptions {
  error?: boolean;
  files: (File | string)[];
  sx?: SxProps<Theme>;
  dispatch: any;
  nameFile: string;
}

const getFileData = (file: CustomFile | string) => {
  if (typeof file === "string") {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    size: file.size,
    name: file.name,
    url: file.url,
    path: file.path,
  };
};
export default function UploadMultiFile({
  error,
  files,
  dispatch,
  nameFile,
  sx,
  ...other
}: UploadMultiFileProps) {
  const hasFile = files.length > 0;
  const classes = styles();
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    ...other,
  });

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: "error.light",
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size }: CustomFile = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size}
            </Typography>
            {errors.map((e) => (
              <Typography key={e.code} variant="caption" component="p">
                - {e.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
  return (
    <Box sx={{ width: "100%", ...sx }}>
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
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Kéo thả hoặc nhấn vào&nbsp;
            <Link underline="always">đây</Link>&nbsp;để tìm file trong máy tính
            của bạn.
          </Typography>

          <Typography variant="caption" display="block" gutterBottom>
            ( Hệ thống hỗ trợ đuôi file XLSX, PDF, DOC, DOCX, PNG, JPG. Giới hạn
            dung lượng 8MB )
          </Typography>
        </Box>
      </DropZoneStyle>

      {fileRejections.length > 0 && <ShowRejectionItems />}

      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        <AnimatePresence>
          {files.map((file) => {
            const { key, path, size, name, url } = getFileData(
              file as CustomFile
            );
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
                  className={classes.contain}
                />
                <ListItemSecondaryAction>
                  <MIconButton
                    edge="end"
                    size="medium"
                    onClick={() => window.open(`${url}`, "_blank")}
                  >
                    <Icon icon={eyeOutline} />
                  </MIconButton>

                  <MIconButton
                    edge="end"
                    size="medium"
                    color="error"
                    onClick={() =>
                      dispatch({ type: "removeItem", nameFile, file })
                    }
                  >
                    <Icon icon={closeFill} />
                  </MIconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>

      {hasFile && (
        <Button
          onClick={() => dispatch({ type: "removeAll", nameFile })}
          sx={{ mr: 1.5 }}
        >
          Xóa tất cả
        </Button>
      )}
    </Box>
  );
}
