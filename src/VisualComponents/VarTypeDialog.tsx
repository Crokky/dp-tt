import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

/**
 * `VarTypeDialogProps` - variable type selection dialog's properties.
 * 
 * @property dialogVisability - dialog window's visability property of `boolean` type.
 * @property setDialogVisability - setter of dialog window's visability property of `React.Dispatch<React.SetStateAction<boolean>>` type.
 * @property setSelectedVarTypeValue - setter of variable's type property of `React.Dispatch<React.SetStateAction<boolean>>` type.
 */
export interface VarTypeDialogProps {
  dialogVisability: boolean,  
  setDialogVisability: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedVarTypeValue: React.Dispatch<React.SetStateAction<"Nat" | "Bool" | undefined>>
}

/**
 * Graphical user interface component that represents variable's type selection dialog.
 * 
 * @properties `props`- properties of `VarTypeDialogProps`.
 *
 * @returns `JSX.Element` that represents variable's type selection dialog.
 */
export const VarTypeDialog: React.FC<VarTypeDialogProps> = props => {
  const { dialogVisability, setDialogVisability, setSelectedVarTypeValue } = props;

  const types: ('Nat'|'Bool')[] = ['Nat', 'Bool'];

  const handleClose = () => {
    setDialogVisability(false);
  };

  const handleListItemClick = (value: "Nat" | "Bool") => {
    setSelectedVarTypeValue(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={dialogVisability} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle id="simple-dialog-title">{"Please, select variable type"}</DialogTitle>
      <List>
        {types.map((type) => (
          <ListItem button onClick={() => handleListItemClick(type)} key={type}>
            <ListItemText primary={type} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}