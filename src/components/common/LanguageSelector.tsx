import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import type { SelectChangeEvent } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={language}
        onChange={handleChange}
        displayEmpty
        startAdornment={
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <LanguageIcon fontSize="small" />
          </Box>
        }
        sx={{
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
          },
        }}
        aria-label="Select language"
      >
        <MenuItem value="en">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span>🇬🇧</span>
            <span>{t("language.english")}</span>
          </Box>
        </MenuItem>
        <MenuItem value="ar">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span>🇸🇦</span>
            <span>{t("language.arabic")}</span>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
