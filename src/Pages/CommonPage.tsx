import React, { useEffect, useState } from 'react';
import CommonKeyboard from '../VisualComponents/CommonKeyboard';
import 'katex/dist/katex.min.css';
// @ts-ignore
import { BlockMath } from 'react-katex';
import { CommonToken, VDASH } from '../Entity/CommonToken';
import { CommonPageProps, PageProps } from '../VisualComponents/Props';
import { Button, ButtonGroup, FormControl, Paper } from '@material-ui/core';
import { analyzeExpression } from '../EvRules/CommonEvRules';
import { BaseType, factoryBaseType } from '../Entity/BaseType';

/**
 * Graphical user interface component that represents common page.
 * 
 * @properties `props`- properties of `PageProps` and `CommonPageProps`.
 *
 * @returns `JSX.Element` that represents common page.
 */
const CommonPage: React.FC<PageProps & CommonPageProps> = props => {

    const { isTNBL } = props;

    const { infoHandler, errorHandler } = props;
    const [expression, setExpression] = useState<CommonToken[]>([]);
    const [evaluatedExpression, setEvaluatedExpression] = useState<string>(" ");
    const [formula, setFormula] = useState<string>();

    useEffect(() => {
        if (expression.length > 0)
            clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTNBL]);

    const clear = (): void => {
        setExpression([]);
        setEvaluatedExpression(" ");
    }

    return (
        <div>
            <div style={{ height: '20px' }}>
            </div>
            <CommonKeyboard
                expression={expression}
                setExpression={setExpression}
            />

            <div style={{ height: '20px' }}>
            </div>
            {"Expression:"}
            <div style={{ height: '20px' }}>
            </div>
            <div>
                <FormControl style={{ width: '50%' }}>
                    <Paper elevation={3}>
                        <BlockMath
                            math={(isTNBL ? " " : VDASH) + expression.map(elem => {
                                if (elem.tokenType === "Nat")
                                    return ":Nat";
                                else if (elem.tokenType === "Bool")
                                    return ":Bool";
                                return elem.tokenType;
                            }).join(" \\enspace ")}
                            errorColor={'#cc0000'}
                            renderError={(error: any) => {
                                return <b>{`Fail: ${error.name}`}</b>
                            }}
                        />
                    </Paper>
                </FormControl>
            </div>
            <div style={{ height: '20px' }}>
            </div>
            <ButtonGroup color="secondary" aria-label="outlined primary button group">
                <Button style={{ width: '110px' }} onClick={() => {
                    clear();
                }}>{"CLEAR"}</Button>
            </ButtonGroup>
            {" "}
            <ButtonGroup color="secondary" aria-label="outlined primary button group">
                <Button style={{ width: '110px' }} onClick={() => {
                    let exprType = getExpressionType(expression, errorHandler);
                    if (exprType) {
                        setFormula(analyzeExpression(expression.slice(0, expression.length - 1), exprType, errorHandler, false, isTNBL)?.str);
                        infoHandler("Expression was analyzed.");
                    }
                }}>{"ANALIZE"}</Button>
            </ButtonGroup>
            {" "}
            <ButtonGroup color="secondary" aria-label="outlined primary button group">
                <Button style={{ width: '110px' }} onClick={() => { if (formula) setEvaluatedExpression(formula); }}>{"DRAW"}</Button>
            </ButtonGroup>



            <div style={{ height: '20px' }}></div>
            <BlockMath
                math={evaluatedExpression}
                errorColor={'#cc0000'}
                renderError={(error: any) => {
                    return <b>{`Fail: ${error.name}`}</b>
                }}
            />
        </div >
    );
}

export default CommonPage;

const getExpressionType = (t: CommonToken[], onError: (error: any, message: string) => void): BaseType | undefined => {
    if (t.length < 2) {
        onError(undefined, "Expression type error");
        return undefined;
    }
    switch (t[t.length - 1].tokenType) {
        case "Nat":
            return factoryBaseType("Nat");
        case "Bool":
            return factoryBaseType("Bool");
        default:
            return undefined;
    }
}