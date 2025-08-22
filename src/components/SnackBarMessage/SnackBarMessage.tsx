import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

interface SnackbarMessageProps {
    notification?: { message: string; type: "success" | "error" };
    handleClose: () => void;
}

export const SnackbarMessage = ({
                                    notification,
                                    handleClose,
                                }: SnackbarMessageProps) => {
    React.useEffect(() => {
        if (notification) {
            const sound = new Audio();
            if (notification.type === "success") {
                sound.src = "/static/audio/success.mp3";
            } else if (notification.type === "error") {
                sound.src = "/static/audio/error.mp3";
            }
            sound.play();
        }
    }, [notification]);

    return notification ? (
        <Box sx={{ width: 500 }}>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={!!notification?.message}
                message={notification?.message}
                autoHideDuration={2000}
                onClose={handleClose}
                ContentProps={{
                    sx: {
                        background:
                            notification?.type === "success" ? "#43a047" : "#f44336",
                    },
                }}
            />
        </Box>
    ) : null;
};

