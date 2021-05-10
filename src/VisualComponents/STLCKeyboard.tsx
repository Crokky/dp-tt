import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { ButtonGroup, FormControl, MenuItem, Select } from '@material-ui/core';
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex';
import { factorySTLCToken, STLCToken } from '../Entity/STLCToken';
import { VarTypeDialog } from './VarTypeDialog';
import TableVariables from './TableVariables';

function PaperComponent(props: PaperProps) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

/**
 * `STLCKeyboardProps` - keyboard's properties.
 * 
 * @property title - dialog window's title of `string` type.
 * @property enabled - dialog window's `enabled` property of `boolean` type.
 * @property setT - setter for expression of `React.Dispatch<React.SetStateAction<STLCToken[]>>` type.
 * @property setVars - setter for variables of `React.Dispatch<React.SetStateAction<STLCToken[]>>` type.
 * @property setFormula - setter for formula of `React.Dispatch<React.SetStateAction<string | undefined>>` type.
 * @property varGenerator - variables name generator of `Generator<string, void, unknown>` type.
 * @property vars - array of `STLCToken` objects that represents existing variables in entered expression. Optional property.
 */
export interface STLCKeyboardProps {
    title: string;
    enabled: boolean;
    setT: React.Dispatch<React.SetStateAction<STLCToken[]>>;
    setVars: React.Dispatch<React.SetStateAction<STLCToken[]>>;
    setFormula: React.Dispatch<React.SetStateAction<string | undefined>>;
    varGenerator: Generator<string, void, unknown>
    vars?: STLCToken[]
}

/**
 * Graphical user interface component that represents STLC virtual keyboard for interactive with user.
 * 
 * @properties `props`- properties of `KeyboardProps`.
 *
 * @returns `JSX.Element` that represents virtual keyboard.
 */
const STLCKeyboard: React.FC<STLCKeyboardProps> = props => {

    const { title, setT, setVars, enabled, setFormula, varGenerator, vars } = props;

    const [open, setOpen] = React.useState(false);

    const [localT, setLocalT] = useState<STLCToken[]>([]);

    const [localVars, setLocalVars] = useState<STLCToken[]>(vars ? [...vars] : []);

    const [dialogVisability, setDialogVisability] = useState<boolean>(false);
    const [selectedVarTypeValue, setSelectedVarTypeValue] = useState<'Nat' | 'Bool'>();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        handleClear();
    };

    const handleOk = () => {
        setT([...localT]);
        setVars([...localVars]);
        setFormula(undefined);
        handleClose();
    }

    const handleChange = (token: STLCToken): void => {
        setLocalT([...localT, token]);
    };

    const handleBackspace = (): void => {
        if (localT[localT.length - 1].tokenType === "var")
            setLocalVars(localVars.slice(0, localVars.length - 1));

        setLocalT([...localT.slice(0, localT.length - 1)]);        
    }

    const handleClear = (): void => {
        setLocalT([]);
        setLocalVars([]);
    }

    useEffect(() => {

        if (dialogVisability) {
            setDialogVisability(false);

            let newVar = varGenerator.next();

            if (newVar.value && selectedVarTypeValue) {

                let newVarToken = factorySTLCToken("var", newVar.value, selectedVarTypeValue, false);

                setLocalVars([...localVars, newVarToken]);

                handleChange(newVarToken);
                setSelectedVarTypeValue(undefined);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVarTypeValue]);

    useEffect(() => {
        if (vars)
            setLocalVars([...vars])
    }, [vars]);

    return (
        <div>
            <Button disabled={!enabled} variant="outlined" color="primary" onClick={handleClickOpen}>
                {title}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {`Please, input ${title}:`}
                </DialogTitle>
                <DialogContent>

                    <div style={{ textAlign: 'center' }}>

                        <FormControl disabled style={{ width: '100%' }}>
                            <Paper elevation={3} style={{ width: '100%' }}>
                                <BlockMath
                                    math={" " + localT.map(elem => {
                                        if (elem.tokenType === 'var')
                                            return elem.varName;
                                        return elem.tokenType;
                                    }).join(" \\enspace ")}
                                    errorColor={'#cc0000'}
                                    renderError={(error: any) => {
                                        return <b>{`Fail: ${error.name}`}</b>
                                    }}
                                />
                            </Paper>
                        </FormControl>

                        <div style={{ height: '20px' }}>
                        </div>

                        <div>
                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken(true)) }}>{"TRUE"}</Button>
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken(false)) }}>{"FALSE"}</Button>
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken("succ")) }}>{"SUCC"}</Button>
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken("pred")) }}>{"PRED"}</Button>
                            </ButtonGroup>
                            <br />
                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken("if")) }}>{"IF"}</Button>
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken("then")) }}>{"THEN"}</Button>
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken("else")) }}>{"ELSE"}</Button>
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken("iszero")) }}>{"ISZERO"}</Button>
                            </ButtonGroup>
                            <br />
                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken(0)) }}>{"0"}</Button>
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken("(")) }}>{"("}</Button>
                                <Button disabled={isDisabled(false, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken(")")) }}>{")"}</Button>
                                <Button disabled={isDisabled(true, localT)} style={{ width: '110px' }} onClick={(event) => { handleChange(factorySTLCToken("f")) }}>{"f"}</Button>
                            </ButtonGroup>
                            <br />
                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                <Button disabled={isDisabled(false, localT) || (localT.length > 0 && localT[localT.length - 1].tokenType === "var")} style={{ width: '110px' }} onClick={(event) => { setDialogVisability(true); }}>
                                    {"new Var"}
                                </Button>
                                {varCombobox(localVars, localT, setLocalT)}
                                <Button style={{ width: '110px', color: 'red' }} onClick={(event) => { handleBackspace() }}>{"Backspace"}</Button>
                                <Button style={{ width: '110px', color: 'red' }} onClick={(event) => { handleClear() }}>{"Clear"}</Button>
                            </ButtonGroup>

                        </div>
                        <div style={{ height: '20px' }}>
                        </div>

                        <TableVariables
                            data={localVars}
                        />                        

                    </div>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="secondary">
                        {"Cancel"}
                    </Button>
                    <Button
                        onClick={handleOk}
                        color="primary">
                        {"Ok"}
                    </Button>

                </DialogActions>
            </Dialog>
            <VarTypeDialog
                dialogVisability={dialogVisability}
                setDialogVisability={setDialogVisability}
                setSelectedVarTypeValue={setSelectedVarTypeValue}
            />
        </div>
    );
}

export default STLCKeyboard;

const isDisabled = (isF: boolean, localT: STLCToken[]): boolean => {
    if (isF) {
        if (localT.length === 0) {
            return false;
        }
    }
    else {
        if (localT.length === 0) {
            return false;
        }
        if (localT.length > 0 && localT[0].tokenType !== 'f') {
            return false;
        }
    }
    return true;
}

const varCombobox = (
    vars: STLCToken[],
    localT: STLCToken[],
    setLocalT: React.Dispatch<React.SetStateAction<STLCToken[]>>
): JSX.Element => {

    return (
        <FormControl>
            <Select
                disabled={vars.length === 0 || (localT.length > 0 && localT[localT.length - 1].tokenType === "var")}
                style={{ minWidth: '110px', maxHeight: '40px' }}
                labelId="demo-simple-select-outlined-label"
                id="varType"
                value={""}
                onChange={(event) => {
                    let newValue = vars.find(elem => elem.varName === event.target.value)
                    if (newValue)
                        setLocalT([...localT, newValue]);
                }}
            >
                {vars.map((e) => (
                    <MenuItem
                        value={e.varName}
                        key={e.varName}
                    >
                        <InlineMath math={e.varName} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}