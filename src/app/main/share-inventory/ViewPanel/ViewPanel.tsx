import * as React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useAppDispatch } from 'app/store/store';
import { useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { toggleViewPanel } from "app/store/stateSlice";

function ViewPanel() {
  const theme = useTheme();
  const [alignment, setAlignment] = React.useState<string | null>("list");
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null && newAlignment !== alignment) {
      setAlignment(newAlignment);
      dispatch(toggleViewPanel());
    }
    // setAlignment(newAlignment);
    // dispatch(toggleViewPanel())
  };

  return (
    <ToggleButtonGroup
      // size="medium"
      // style={{ minHeight: 40 }}
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      size={`${isMobile ? `small` : `medium`}`}
    >
      {isMobile ? (
        alignment === "list" ? (
          <ToggleButton value="grid" aria-label="gridview" sx={{ py: '3px' }}>
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
        ) : (
          <ToggleButton value="list" aria-label="listview" sx={{ py: '3px' }}>
            <ViewListIcon fontSize="small" />
          </ToggleButton>
        )
      ) : (
        <>
          <ToggleButton value="grid" aria-label="gridview" style={{ height : 40 }}>
            <ViewModuleIcon fontSize="large" />
          </ToggleButton>
          <ToggleButton value="list" aria-label="listview" style={{ height: 40 }}>
            <ViewListIcon fontSize="large" />
          </ToggleButton>
        </>
      )}
    </ToggleButtonGroup>
  );
}

export default ViewPanel;
// export default withReducer('viewPanel', reducer)(ViewPanel);
