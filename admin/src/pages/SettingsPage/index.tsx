/*
 *
 * SettingsPage
 *
 */


import React, { useEffect, useState } from 'react';
import pluginId from '../../pluginId';

//import taskRequests from '../../api/task';

import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin';

import {
  Box,
  Stack,
  Button,
  Grid,
  GridItem,
  HeaderLayout,
  ContentLayout,
  Typography,
  Checkbox
} from '@strapi/design-system';

import { Check } from '@strapi/icons';

const SettingsPage = () => {
  const [models, setModels] = useState(['page']);
  const [settings, setSettings] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toggleNotification = useNotification(); 

  


  return (
    <>
      <HeaderLayout
        id="title"
        title="Collection tree settings"
        subtitle="Manage the settings and behaviour"
        primaryAction={
          isLoading ? (
            <></>
          ) : (
            <Button
              onClick={console.log("save")}
              startIcon={<Check />}
              size="L"
              disabled={isSaving}
              loading={isSaving}
            >
              Save
            </Button>
          )
        }
      />
      <ContentLayout>
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
        >
          <Stack size={3}>
            <Typography>Select models to which you want to apply the tree behavior.</Typography>
            <Grid gap={6}>
              <GridItem col={12} s={12}>
                {models.map((model) => (
                  <Checkbox key={model}>
                    {model}
                  </Checkbox>
                ))}
              </GridItem>
            </Grid>
          </Stack>
        </Box>
      </ContentLayout>
    </>
  );
};

export default SettingsPage;
