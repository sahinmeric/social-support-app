import React, { useCallback } from "react";
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

const Step1PersonalInfo: React.FC = () => {
  const { t } = useTranslation();
  const { formData, errors, updateFormData } = useFormContext();

  const handleChange = useCallback(
    (field: keyof typeof formData) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData(field, event.target.value);
      },
    [updateFormData]
  );

  const handleSelectChange = useCallback(
    (field: keyof typeof formData) => (event: SelectChangeEvent) => {
      updateFormData(field, event.target.value);
    },
    [updateFormData]
  );

  // Helper to parse error message and extract parameters
  const getErrorMessage = useCallback(
    (error: string | undefined): string => {
      if (!error) return "";
      // Check if error contains parameter (format: "key|value")
      if (error.includes("|")) {
        const [key, value] = error.split("|");
        return t(key, { min: parseInt(value), max: parseInt(value) });
      }
      return t(error);
    },
    [t]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        {/* Row 1: Full Name and National ID */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            fullWidth
            required
            id="name"
            name="name"
            label={t("fields.name")}
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={getErrorMessage(errors.name)}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.name"),
                "aria-required": "true",
                "aria-invalid": !!errors.name,
                "aria-describedby": errors.name ? "name-error" : undefined,
              },
            }}
          />

          <TextField
            fullWidth
            required
            id="nationalId"
            name="nationalId"
            label={t("fields.nationalId")}
            value={formData.nationalId}
            onChange={handleChange("nationalId")}
            error={!!errors.nationalId}
            helperText={getErrorMessage(errors.nationalId)}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.nationalId"),
                "aria-required": "true",
                "aria-invalid": !!errors.nationalId,
                "aria-describedby": errors.nationalId
                  ? "nationalId-error"
                  : undefined,
              },
            }}
          />
        </Box>

        {/* Row 2: Date of Birth and Gender */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            fullWidth
            required
            id="dateOfBirth"
            name="dateOfBirth"
            label={t("fields.dateOfBirth")}
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            error={!!errors.dateOfBirth}
            helperText={getErrorMessage(errors.dateOfBirth)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                "aria-label": t("fields.dateOfBirth"),
                "aria-required": "true",
                "aria-invalid": !!errors.dateOfBirth,
                "aria-describedby": errors.dateOfBirth
                  ? "dateOfBirth-error"
                  : undefined,
              },
            }}
          />

          <FormControl fullWidth required error={!!errors.gender}>
            <InputLabel id="gender-label">{t("fields.gender")}</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange("gender")}
              label={t("fields.gender")}
              slotProps={{
                input: {
                  "aria-label": t("fields.gender"),
                  "aria-required": "true",
                  "aria-invalid": !!errors.gender,
                },
              }}
            >
              <MenuItem value="">
                <em>{t("common.select")}</em>
              </MenuItem>
              <MenuItem value="male">{t("options.gender.male")}</MenuItem>
              <MenuItem value="female">{t("options.gender.female")}</MenuItem>
              <MenuItem value="other">{t("options.gender.other")}</MenuItem>
            </Select>
            {errors.gender && (
              <FormHelperText id="gender-error">
                {t(errors.gender)}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* Row 3: Address */}
        <TextField
          fullWidth
          required
          id="address"
          name="address"
          label={t("fields.address")}
          value={formData.address}
          onChange={handleChange("address")}
          error={!!errors.address}
          helperText={getErrorMessage(errors.address)}
          multiline
          rows={2}
          slotProps={{
            htmlInput: {
              "aria-label": t("fields.address"),
              "aria-required": "true",
              "aria-invalid": !!errors.address,
              "aria-describedby": errors.address ? "address-error" : undefined,
            },
          }}
        />

        {/* Row 4: City and State */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            fullWidth
            required
            id="city"
            name="city"
            label={t("fields.city")}
            value={formData.city}
            onChange={handleChange("city")}
            error={!!errors.city}
            helperText={getErrorMessage(errors.city)}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.city"),
                "aria-required": "true",
                "aria-invalid": !!errors.city,
                "aria-describedby": errors.city ? "city-error" : undefined,
              },
            }}
          />

          <TextField
            fullWidth
            required
            id="state"
            name="state"
            label={t("fields.state")}
            value={formData.state}
            onChange={handleChange("state")}
            error={!!errors.state}
            helperText={getErrorMessage(errors.state)}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.state"),
                "aria-required": "true",
                "aria-invalid": !!errors.state,
                "aria-describedby": errors.state ? "state-error" : undefined,
              },
            }}
          />
        </Box>

        {/* Row 5: Country and Phone */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            fullWidth
            required
            id="country"
            name="country"
            label={t("fields.country")}
            value={formData.country}
            onChange={handleChange("country")}
            error={!!errors.country}
            helperText={getErrorMessage(errors.country)}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.country"),
                "aria-required": "true",
                "aria-invalid": !!errors.country,
                "aria-describedby": errors.country
                  ? "country-error"
                  : undefined,
              },
            }}
          />

          <TextField
            fullWidth
            required
            id="phone"
            name="phone"
            label={t("fields.phone")}
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            error={!!errors.phone}
            helperText={getErrorMessage(errors.phone)}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.phone"),
                "aria-required": "true",
                "aria-invalid": !!errors.phone,
                "aria-describedby": errors.phone ? "phone-error" : undefined,
              },
            }}
          />
        </Box>

        {/* Row 6: Email */}
        <TextField
          fullWidth
          required
          id="email"
          name="email"
          label={t("fields.email")}
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          error={!!errors.email}
          helperText={getErrorMessage(errors.email)}
          slotProps={{
            htmlInput: {
              "aria-label": t("fields.email"),
              "aria-required": "true",
              "aria-invalid": !!errors.email,
              "aria-describedby": errors.email ? "email-error" : undefined,
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default Step1PersonalInfo;
