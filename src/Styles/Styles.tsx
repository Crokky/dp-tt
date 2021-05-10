import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

/**
 * Function that provides styles for visual components.
 * 
 * @param theme - `Theme` object.
 * 
 * @returns object of different visual components styles.
 */
export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        menuButton: {
        },
        menuButtonSelected: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            border: 0,
            color: 'white',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
        title: {
            flexGrow: 1,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        select: {
            color: "inherit"
        },
        menuItem: {
            selectedTextColor: 'white',
        },
        inputDiv: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        inputInvisible: {
            display: 'none',
        },
        bgGreyHead: {
            background: "#cccccc",
        },
    })
);

/**
 * Constant that represents red color.
 */
export const red = "\\color{#ff0000}";

/**
 * Constant that represents black color.
 */
export const black = "\\color{#000000}";