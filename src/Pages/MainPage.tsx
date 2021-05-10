import React, { useState, useCallback } from 'react';
import { useStyles } from '../Styles/Styles';
import { AppBar, Toolbar, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';
import 'katex/dist/katex.min.css';
import CommonPage from './CommonPage';
import STLCPage from './STLCPage';

/**
 * Graphical user interface component that contains application bar for navigation and displays selected view.
 * 
 * @param props - object of properties.
 * 
 * @returns `JSX.Element` that represents main page of application.
 */
const MainPage: React.FC = props => {
    const classes = useStyles();

    const [infoMessages, setInfoMessages] = useState<string[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const infoHandler = useCallback((message: string) => {
        setInfoMessages((prevState) => [message, ...prevState]);
    }, []);

    const errorHandler = useCallback((message: string) => {
        setErrorMessages((prevState) => [message, ...prevState]);
    }, []);

    const handleCloseInfo = useCallback(() => setInfoMessages([]), []);
    const handleCloseError = useCallback(() => {
        setErrorMessages([]);
        setInfoMessages([]);
    }, []);

    const [view, setView] = useState<string>("STLC 1");

    const handleChangeView = (value: string): void => {
        setView(value);
    };

    return (
        <div className={classes.root}>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid container direction="row" spacing={2} justify="center" alignItems="center">
                            <Grid item>
                                <Button variant="contained" className={view === "STLC 1" ? classes.menuButtonSelected : classes.menuButton}
                                    onClick={() => { handleChangeView("STLC 1") }}>
                                    {"STLC 1"}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" className={view === "STLC 2" ? classes.menuButtonSelected : classes.menuButton}
                                    onClick={() => { handleChangeView("STLC 2") }}>
                                    {"STLC 2"}</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" className={view === "T-NBL" ? classes.menuButtonSelected : classes.menuButton}
                                    onClick={() => { handleChangeView("T-NBL") }}>
                                    {"T-NBL"}</Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>

            <br />
            <br />

            <div className="App">
                {getView(view, infoHandler, errorHandler, errorMessages)}

                <Dialog
                    open={errorMessages.length > 0}
                    onClose={handleCloseError}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {errorMessages.map((e) => (
                                <div key={e}>{e}</div>
                            ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseError} color="primary">
                            {"Close"}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={errorMessages.length === 0 && infoMessages.length > 0}
                    onClose={() => { }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Info"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {infoMessages.map((e) => (
                                <div key={e}>{e}</div>
                            ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInfo} color="primary">
                            {"Close"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        </div >
    );
}

export default MainPage;

const getView = (
    view: string,
    infoHandler: (message: string) => void,
    errorHandler: (message: string) => void,
    errorMessages?: string[]
): JSX.Element => {

    switch (view) {
        case "T-NBL":
            return <CommonPage
                infoHandler={infoHandler}
                errorHandler={errorHandler}
                isTNBL={true}
            />
        case "STLC 2":
            return <CommonPage
                infoHandler={infoHandler}
                errorHandler={errorHandler}
                isTNBL={false}
            />
        case "STLC 1":
        default:
            return <STLCPage
                infoHandler={infoHandler}
                errorHandler={errorHandler}
                errorMessages={errorMessages}
            />
    }
}