import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { STLCToken } from '../Entity/STLCToken';

interface Column {
    id: 'name' | 'type';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'name', label: 'Variable name', minWidth: 100 },
    { id: 'type', label: 'Variable type', minWidth: 100 },
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 200,
    },
});

/**
 * `TableVariablesProps` - variables table's properties.
 * 
 * @property data - array of `STLCToken` objects that represents entered expression.
 */
export interface TableVariablesProps {
    data: STLCToken[];
}

/**
 * Graphical user interface component that represents the table of variables that exist in entered expression.
 * 
 * @properties `props`- properties of `TableVariablesProps`.
 *
 * @returns `JSX.Element` that represents the table of variables and their types.
 */
const TableVariables: React.FC<TableVariablesProps> = props => {

    const { data } = props;

    const classes = useStyles();

    return (
        <Paper style={{height: 200}}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.varName} >
                                    <TableCell key={"varName" + row.varName}>
                                        {row.varName}
                                    </TableCell>
                                    <TableCell key={"varType" + row.varType}>
                                        {row.varType}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>

                </Table>
            </TableContainer>
        </Paper>
    );
}

export default TableVariables;