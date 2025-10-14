import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function samePageLinkNavigation(event) {
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return false;
    }
    return true;
}

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                if (samePageLinkNavigation(event)) {
                    event.preventDefault();
                }
            }}
            aria-current={props.selected && "page"}
            {...props}
            sx={{
                color: "rgba(255,255,255,0.7)",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "8px",
                px: 3,
                py: 1,
                mx: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                    color: "#00FFFF",
                    backgroundColor: "rgba(255,255,255,0.08)",
                },
                "&.Mui-selected": {
                    color: "#00FFFF",
                    backgroundColor: "rgba(0,255,255,0.15)",

                },
            }}
        />
    );
}

LinkTab.propTypes = {
    selected: PropTypes.bool,
};

function ClientCallsHistory() {
    const [value, setValue] = React.useState(0);

    const tabsButton = [
        "Call History",
        "Active Calls",
        "Missed Calls",
    ];

    const handleChange = (event, newValue) => {
        if (
            event.type !== "click" ||
            (event.type === "click" && samePageLinkNavigation(event))
        ) {
            setValue(newValue);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                // bgcolor: "#0d0d0d", // dark background
                borderRadius: "12px",
                p: 2,
            }}
        >
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="navigation tabs"
                role="navigation"
                TabIndicatorProps={{
                    style: { backgroundColor: "#00FFFF", height: "3px", borderRadius: "3px" },
                }}
                sx={{
                    "& .MuiTabs-flexContainer": {
                        justifyContent: "start",
                    },
                }}
            >
                {
                    tabsButton.map((tab, index) => (
                        <LinkTab
                            key={index}
                            label={tab}
                            selected={value === index}
                        />
                    ))
                }
                {/* <LinkTab label="Call History" href="/history" />
                <LinkTab label="Active Calls" href="/active" />
                <LinkTab label="Missed Calls" href="/missed" /> */}
            </Tabs>
        </Box>
    );
}
export default ClientCallsHistory;
