import { isString } from "lodash";
import { ReactNode } from "react";
import { Icon } from "@iconify/react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import roundAddAPhoto from "@iconify/icons-ic/round-add-a-photo";

import {
  experimentalStyled as styled,
  Box,
  Typography,
  Theme,
} from "@material-ui/core";
import { SxProps } from "@material-ui/system";
import { rootStyle, dropZoneStyle, placeholderStyle } from "./style";
import useLocales from "src/hooks/useLocales";

const RootStyle: any = styled("div")(rootStyle);
const DropZoneStyle: any = styled("div")(dropZoneStyle);
const PlaceholderStyle: any = styled("div")(placeholderStyle);
interface CustomFile extends File {
  path?: string;
  preview?: string;
}

interface ImportAvatarProps extends DropzoneOptions {
  error?: boolean;
  loadingAvatar?: any;
  file: CustomFile | string | null;
  caption?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function ImportAvatar({
  error,
  loadingAvatar,
  file,
  caption,
  sx,
  ...other
}: ImportAvatarProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      multiple: false,
      ...other,
    });

  const { translate } = useLocales();

  return (
    <>
      <RootStyle sx={sx}>
        {/* <Loading loading={loadingAvatar}> */}
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
          {/* <Loading loading={loadingAvatar}> */}
          <input {...getInputProps()} />

          {file && (
            <Box
              component="img"
              //alt="avt"
              src={isString(file) ? file : file.preview}
              sx={{ zIndex: 8, objectFit: "cover" }}
            ></Box>
          )}

          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0,
                color: "common.white",
                bgcolor: "grey.900",
                "&:hover": { opacity: 0.72 },
              }),
            }}
          >
            <Box
              component={Icon}
              icon={roundAddAPhoto}
              sx={{ width: 24, height: 24, mb: 1 }}
            ></Box>

            <Typography variant="caption">
              {translate("userManager.uploadPicture")}
            </Typography>
          </PlaceholderStyle>
        </DropZoneStyle>
      </RootStyle>

      {caption}
    </>
  );
}
