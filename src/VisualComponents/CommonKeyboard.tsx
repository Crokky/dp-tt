import React from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { CommonToken, factoryCommonToken } from '../Entity/CommonToken';
import 'katex/dist/katex.min.css';

/**
 * `KeyboardProps` - keyboard's properties.
 * 
 * @property expression - array of `CommonToken` objects that represents entered expression.
 * @property setExpression - setter for expression of `React.Dispatch<React.SetStateAction<CommonToken[]>>` type.
 */
export interface KeyboardProps {
    expression: CommonToken[];
    setExpression: React.Dispatch<React.SetStateAction<CommonToken[]>>;
}

/**
 * Graphical user interface component that represents common virtual keyboard for interactive with user.
 * 
 * @properties `props`- properties of `KeyboardProps`.
 *
 * @returns `JSX.Element` that represents virtual keyboard.
 */
const CommonKeyboard: React.FC<KeyboardProps> = props => {

    const { expression, setExpression } = props;

    const handleChange = (token: CommonToken): void => {
        setExpression([...expression, token]);
    };

    return (
        <div>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken(true)) }}>{"TRUE"}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken(false)) }}>{"FALSE"}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("succ")) }}>{"SUCC"}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("pred")) }}>{"PRED"}</Button>
            </ButtonGroup>
            <br />
            <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("if")) }}>{"IF"}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("then")) }}>{"THEN"}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("else")) }}>{"ELSE"}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("iszero")) }}>{"ISZERO"}</Button>
            </ButtonGroup>
            <br />
            <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken(0)) }}>{"0"}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("(")) }}>{"("}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken(")")) }}>{")"}</Button>
                <Button disabled={true} style={{ width: '110px' }}>{""}</Button>
            </ButtonGroup>
            <br />
            <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("Nat")) }}>{":Nat"}</Button>
                <Button style={{ width: '110px' }} onClick={(event) => { handleChange(factoryCommonToken("Bool")) }}>{":Bool"}</Button>
                <Button disabled={true} style={{ width: '110px' }}>{""}</Button>
                <Button disabled={true} style={{ width: '110px' }}>{""}</Button>
            </ButtonGroup>           
        </div>
    );
}

export default CommonKeyboard;