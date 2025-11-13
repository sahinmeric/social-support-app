import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

/**
 * Skeleton loader for form fields
 * Displays while step components are being lazy loaded
 */
export const FormSkeleton: React.FC = () => (
  <Stack spacing={3}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Box key={i}>
        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
    ))}
  </Stack>
);

/**
 * Skeleton loader for AI suggestion modal
 * Displays while AI content is being generated
 */
export const ModalSkeleton: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Skeleton variant="rectangular" width={100} height={36} />
      <Skeleton variant="rectangular" width={100} height={36} />
    </Stack>
  </Box>
);

/**
 * Skeleton loader for progress bar
 * Displays while main app is loading
 */
export const ProgressSkeleton: React.FC = () => (
  <Box sx={{ mb: 4 }}>
    <Skeleton variant="rectangular" height={8} sx={{ mb: 2 }} />
    <Stack direction="row" spacing={2}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} variant="circular" width={40} height={40} />
      ))}
    </Stack>
  </Box>
);
