import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormContext } from "../../hooks/useFormContext";

const Step2FamilyFinancial: React.FC = () => {
  const { t } = useTranslation();
  const { formData, errors, updateFormData } = useFormContext();

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      // Convert to number for numeric fields
      if (field === "dependents" || field === "monthlyIncome") {
        updateFormData(field, value === "" ? 0 : Number(value));
      } else {
        updateFormData(field, value);
      }
    };

  const handleSelectChange =
    (field: keyof typeof formData) => (event: SelectChangeEvent) => {
      updateFormData(field, event.target.value);
    };

  // Helper to parse error message and extract parameters
  const getErrorMessage = (error: string | undefined): string => {
    if (!error) return "";
    if (error.includes("|")) {
      const [key, value] = error.split("|");
      return t(key, { min: parseInt(value), max: parseInt(value) });
    }
    return t(error);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        {/* Row 1: Marital Status and Dependents */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <FormControl fullWidth required error={!!errors.maritalStatus}>
            <InputLabel id="maritalStatus-label">
              {t("fields.maritalStatus")}
            </InputLabel>
            <Select
              labelId="maritalStatus-label"
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleSelectChange("maritalStatus")}
              label={t("fields.maritalStatus")}
              slotProps={{
                input: {
                  "aria-label": t("fields.maritalStatus"),
                  "aria-required": "true",
                  "aria-invalid": !!errors.maritalStatus,
                },
              }}
            >
              <MenuItem value="">
                <em>{t("common.select")}</em>
              </MenuItem>
              <MenuItem value="single">
                {t("options.maritalStatus.single")}
              </MenuItem>
              <MenuItem value="married">
                {t("options.maritalStatus.married")}
              </MenuItem>
              <MenuItem value="divorced">
                {t("options.maritalStatus.divorced")}
              </MenuItem>
              <MenuItem value="widowed">
                {t("options.maritalStatus.widowed")}
              </MenuItem>
            </Select>
            {errors.maritalStatus && (
              <FormHelperText id="maritalStatus-error">
                {t(errors.maritalStatus)}
              </FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            required
            id="dependents"
            name="dependents"
            label={t("fields.dependents")}
            type="number"
            value={formData.dependents}
            onChange={handleChange("dependents")}
            error={!!errors.dependents}
            helperText={getErrorMessage(errors.dependents)}
            slotProps={{
              htmlInput: {
                min: 0,
                "aria-label": t("fields.dependents"),
                "aria-required": "true",
                "aria-invalid": !!errors.dependents,
                "aria-describedby": errors.dependents
                  ? "dependents-error"
                  : undefined,
              },
            }}
          />
        </Box>

        {/* Row 2: Employment Status and Monthly Income */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <FormControl fullWidth required error={!!errors.employmentStatus}>
            <InputLabel id="employmentStatus-label">
              {t("fields.employmentStatus")}
            </InputLabel>
            <Select
              labelId="employmentStatus-label"
              id="employmentStatus"
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleSelectChange("employmentStatus")}
              label={t("fields.employmentStatus")}
              slotProps={{
                input: {
                  "aria-label": t("fields.employmentStatus"),
                  "aria-required": "true",
                  "aria-invalid": !!errors.employmentStatus,
                },
              }}
            >
              <MenuItem value="">
                <em>{t("common.select")}</em>
              </MenuItem>
              <MenuItem value="employed">
                {t("options.employmentStatus.employed")}
              </MenuItem>
              <MenuItem value="unemployed">
                {t("options.employmentStatus.unemployed")}
              </MenuItem>
              <MenuItem value="selfEmployed">
                {t("options.employmentStatus.selfEmployed")}
              </MenuItem>
              <MenuItem value="retired">
                {t("options.employmentStatus.retired")}
              </MenuItem>
            </Select>
            {errors.employmentStatus && (
              <FormHelperText id="employmentStatus-error">
                {t(errors.employmentStatus)}
              </FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            required
            id="monthlyIncome"
            name="monthlyIncome"
            label={t("fields.monthlyIncome")}
            type="number"
            value={formData.monthlyIncome}
            onChange={handleChange("monthlyIncome")}
            error={!!errors.monthlyIncome}
            helperText={getErrorMessage(errors.monthlyIncome)}
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
                "aria-label": t("fields.monthlyIncome"),
                "aria-required": "true",
                "aria-invalid": !!errors.monthlyIncome,
                "aria-describedby": errors.monthlyIncome
                  ? "monthlyIncome-error"
                  : undefined,
              },
            }}
          />
        </Box>

        {/* Row 3: Housing Status */}
        <FormControl fullWidth required error={!!errors.housingStatus}>
          <InputLabel id="housingStatus-label">
            {t("fields.housingStatus")}
          </InputLabel>
          <Select
            labelId="housingStatus-label"
            id="housingStatus"
            name="housingStatus"
            value={formData.housingStatus}
            onChange={handleSelectChange("housingStatus")}
            label={t("fields.housingStatus")}
            slotProps={{
              input: {
                "aria-label": t("fields.housingStatus"),
                "aria-required": "true",
                "aria-invalid": !!errors.housingStatus,
              },
            }}
          >
            <MenuItem value="">
              <em>{t("common.select")}</em>
            </MenuItem>
            <MenuItem value="owned">
              {t("options.housingStatus.owned")}
            </MenuItem>
            <MenuItem value="rented">
              {t("options.housingStatus.rented")}
            </MenuItem>
            <MenuItem value="homeless">
              {t("options.housingStatus.homeless")}
            </MenuItem>
            <MenuItem value="other">
              {t("options.housingStatus.other")}
            </MenuItem>
          </Select>
          {errors.housingStatus && (
            <FormHelperText id="housingStatus-error">
              {t(errors.housingStatus)}
            </FormHelperText>
          )}
        </FormControl>
      </Stack>
    </Box>
  );
};

export default Step2FamilyFinancial;
