import FormDialog from "logic/components/dialogs/FormDialog";
import React, { useState } from "react";
import { useEffect } from "react";
import ImportFile from "./ImportFile";
import FormUser from "./FormUser";

export default function Dialog(props: any) {
  const { data, deliverItem, deliverImportItem }: any = props;
  const { roles, openKey, row, unitId, dataDoet } = data;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openKey.open != 0) {
      setOpen(true);
    }
  }, [openKey]);

  return (
    <FormDialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="lg"
      noAction
    >
      {openKey.type === "importFile" ? (
        <ImportFile
          onClose={() => {
            setOpen(false);
          }}
          datas={{ roles, unitId }}
          onClick={() => deliverImportItem()}
        />
      ) : (
        <FormUser
          data={{
            unitId,
            roles,
            dataDoet,
            row,
            type: openKey.type,
            openKey: openKey,
          }}
          onClose={() => {
            setOpen(false);
          }}
          onClick={(data: any, name: string) => deliverItem({ data, name })}
        />
      )}
    </FormDialog>
  );
}
