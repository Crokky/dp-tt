import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex';
import { PageProps } from '../VisualComponents/Props';
import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { factoryBaseType, BaseType, BaseTypeArrToLatexString } from '../Entity/BaseType';
import STLCKeyboard from '../VisualComponents/STLCKeyboard';
import { Named, toNamed } from '../Entity/Named';
import { analyzeExpression } from '../EvRules/STLCEvRules';
import { factorySTLCToken, STLCToken } from '../Entity/STLCToken';
import { getNextVar } from '../Utils/Utils';
import "../Styles/Styles.css";

/**
 * Graphical user interface component that represents STLC page.
 * 
 * @properties `props`- properties of `PageProps`.
 *
 * @returns `JSX.Element` that represents common page.
 */
const STLCPage: React.FC<PageProps> = props => {

    const { infoHandler, errorHandler, errorMessages } = props;

    const [expression, setExpression] = useState<STLCToken[]>([]);

    const [evaluatedExpression, setEvaluatedExpression] = useState<string>(" ");

    const [formula, setFormula] = useState<string>();

    const [fType, setFType] = useState<Named<BaseType[]>>();
    const [exprType, setExprType] = useState<BaseType[]>();

    const [t1, setT1] = useState<STLCToken[]>([]);
    const [t2, setT2] = useState<STLCToken[]>([]);
    const [vars, setVars] = useState<STLCToken[]>([]);

    const [fCmbEnabled, setFCmdEnabled] = useState<boolean>(false);

    const [fOtions] = useState<Named<BaseType[]>[]>([
        toNamed(0, [factoryBaseType("Nat"), factoryBaseType("Bool")]),
        toNamed(1, [factoryBaseType("Nat"), factoryBaseType("Nat")]),
        toNamed(2, [factoryBaseType("Bool"), factoryBaseType("Nat")]),
        toNamed(3, [factoryBaseType("Bool"), factoryBaseType("Bool")])]);

    const [typeOtions] = useState<Named<BaseType[]>[]>([
        toNamed(0, [factoryBaseType("Nat")]),
        toNamed(1, [factoryBaseType("Bool")])]);

    // eslint-disable-next-line
    const [varGenerator, setVarGenerator] = useState<Generator<string, void, unknown>>(getNextVar()); 


    useEffect(() => {
        if (t2.length > 0)
            setExpression(t1.concat(t2).slice());
        else
            setExpression(t1.slice());
    }, [t1, t2]);

    useEffect(() => {
        if (expression.find(elem => elem.tokenType === "f"))
            setFCmdEnabled(true);
        else
            setFCmdEnabled(false);
    }, [expression]);

    useEffect(() => {
        setFormula("");
    }, [errorMessages]);

    const clearData = (): void => {
        setExpression([]);
        setEvaluatedExpression(" ");
        setT1([]);
        setT2([]);
        setVars([]);
        setFormula(undefined);
        setFType(undefined);
        setExprType(undefined);
    }

    return (
        <div>
            {"Expression:"}
            <div style={{ height: '20px' }}>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-age-native-simple"><InlineMath math="f: type \to type " /></InputLabel>
                    <Select
                        disabled={!fCmbEnabled}
                        style={{ minWidth: '150px' }}
                        labelId="demo-simple-select-outlined-label"
                        id="varType"
                        value={fType ? fType.id : ""}
                        onChange={(event) => {
                            setFType(fOtions.find(elem => elem.id === event.target.value));
                            setFormula(undefined);
                        }}
                    >
                        {fOtions.map((e) => (
                            <MenuItem
                                value={e.id}
                                key={e.id}
                            >
                                <InlineMath math={"f: " + BaseTypeArrToLatexString(e.type, errorHandler)} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField disabled style={{ width: '36px' }} id="outlined-basic" variant="outlined"
                    label={<InlineMath math={"\\vdash"} />} />

                <TextField disabled style={{ width: '650px' }} id="outlined-basic" variant="outlined"
                    label={<InlineMath math={getExpressionStringValue(expression, vars)} />}
                />

                {/* Expression type */}
                {exprTypeBuilder(exprType, setExprType, setFormula, typeOtions, errorHandler)}

            </div>
            <div style={{ height: '20px' }}>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <STLCKeyboard
                    title={"t1"}
                    setT={setT1}
                    enabled={true}
                    setVars={setVars}
                    setFormula={setFormula}
                    varGenerator={varGenerator}
                />
                <STLCKeyboard
                    title={"t2"}
                    setT={setT2}
                    enabled={t1.find(elem => elem.tokenType === "f") ? true : false }
                    setVars={setVars}
                    setFormula={setFormula}
                    varGenerator={varGenerator}
                    vars={vars}
                />
            </div>
            <div style={{ height: '20px' }}>
            </div>
            <div>
                <ButtonGroup color="secondary" aria-label="outlined primary button group">
                    <Button style={{ width: '110px' }} onClick={() => {
                        clearData();
                    }}>{"CLEAR"}</Button>
                </ButtonGroup>
                {" "}
                <ButtonGroup color="secondary" aria-label="outlined primary button group">
                    <Button
                        disabled={isAnalizeBtnDisabled(t1, t2, fType, exprType)}
                        style={{ width: '110px' }}
                        onClick={() => {

                            if (exprType) {
                                setFormula(analyzeExpression(copyArrayOfTokens(t1), copyArrayOfTokens(t2), fType?.type, exprType, errorHandler, false)?.str);
                                infoHandler("Expression was analyzed.");
                            }
                            else
                                errorHandler("Please select expression type.");
                        }}>{"ANALIZE"}</Button>
                </ButtonGroup>
                {" "}
                <ButtonGroup color="secondary" aria-label="outlined primary button group">
                    <Button
                        disabled={!formula || formula.length === 0}
                        style={{ width: '110px' }}
                        onClick={() => { if (formula) setEvaluatedExpression(formula); }}>
                        {"DRAW"}
                    </Button>
                </ButtonGroup>

            </div >

            <div style={{ height: '20px' }}>{ }</div>
            <BlockMath
                math={evaluatedExpression}
                errorColor={'#cc0000'}
                renderError={(error: any) => {
                    return <b>{`Fail: ${error.name}`}</b>
                }}
                className="katex"
            />
        </div >
    );
}

export default STLCPage;


const getExpressionStringValue = (expression: STLCToken[], vars: STLCToken[]): string => {

    let expressionCopy = expression.slice();

    let res = " ";

    if (vars.length > 0) {

        res += vars.map(elem => `\\lambda ${elem.varName}:${elem.varType}.`).join("");
    }

    res += expressionCopy.map(elem => {
        if (elem.tokenType === 'var')
            return elem.varName;
        return elem.tokenType;
    }).join(" \\enspace ");

    return res;
}

const isAnalizeBtnDisabled = (
    t1: STLCToken[],
    t2: STLCToken[],
    fType: Named<BaseType[]> | undefined,
    exprType: BaseType[] | undefined
): boolean => {
    if (exprType && t1.length > 0 && exprType.length > 0) {
        if (t1.find(elem => elem.tokenType === "f") || t2.find(elem => elem.tokenType === "f")) {
            if (fType)
                return false;
            else
                return true;
        }
        else return false;
    }
    return true;
}

const exprTypeBuilder = (
    exprType: BaseType[] | undefined,
    setExprType: React.Dispatch<React.SetStateAction<BaseType[] | undefined>>,
    setFormula: (value: React.SetStateAction<string | undefined>) => void,
    typeOtions: Named<BaseType[]>[],
    onError: (message: string) => void
): JSX.Element => {

    let type = ":" + (exprType !== undefined ? BaseTypeArrToLatexString(exprType, onError) : "");

    return (
        <div>
            <TextField disabled style={{ width: '300px' }} id="outlined-basic" variant="outlined"
                label={<InlineMath math={type} />}
            />
            <FormControl variant="outlined">

                <InputLabel htmlFor="outlined-age-native-simple"><InlineMath math="add" /></InputLabel>
                <Select
                    style={{ minWidth: '80px' }}
                    labelId="demo-simple-select-outlined-label"
                    id="varType"
                    value={""}
                    onChange={(event) => {
                        let newValue = typeOtions.find(elem => elem.id === event.target.value)?.type;
                        if (exprType && newValue)
                            setExprType([...exprType, ...newValue]);
                        else if (newValue)
                            setExprType([...newValue]);

                        setFormula(undefined);
                    }}
                >
                    {typeOtions.map((e) => (
                        <MenuItem
                            value={e.id}
                            key={e.id}
                        >
                            <InlineMath math={":" + BaseTypeArrToLatexString(e.type, onError)} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

const copyArrayOfTokens = (arr: STLCToken[]): STLCToken[] => {
    return arr.map(elem => { return factorySTLCToken(elem.tokenType, elem.varName, elem.varType, elem.varAbstracted) });
}