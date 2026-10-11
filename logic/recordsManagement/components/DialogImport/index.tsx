import FormDialog from "logic/components/dialogs/FormDialog";
import React, { useState } from "react";
import { useEffect } from "react";
import ImportFile from "./ImportFile";

export default function DialogImport(props: any) {
  const { data, deliverImportItem }: any = props;
  const { openKeyImport, categoryId, categoryKey, provinces, doet } = data;

  const [open, setOpen] = useState(false);
  const [dontClose, setDontClose] = useState(true);

  useEffect(() => {
    if (openKeyImport.open != 0) {
      setOpen(true);
    }
  }, [openKeyImport]);

  return (
    <FormDialog
      open={open}
      onClose={() => {
        dontClose && setOpen(false);
      }}
      maxWidth="xl"
      noAction
    >
      <ImportFile
        onDontClose={(data) => setDontClose(data)}
        onClose={() => {
          setOpen(false);
        }}
        datas={{ categoryId, categoryKey, provinces, open, doet }}
        onClick={() => deliverImportItem()}
      />
    </FormDialog>
  );
}
