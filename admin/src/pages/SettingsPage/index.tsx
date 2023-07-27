/*
 *
 * SettingsPage
 *
 */


import React, { useEffect, useState } from 'react';
import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import SettingsRequests from '../../api/settings';


import {
  Box,
  Stack,
  Button,
  Grid,
  GridItem,
  HeaderLayout,
  ContentLayout,
  Typography,
  ToggleInput
} from '@strapi/design-system';


import { Check } from '@strapi/icons';

const SettingsPage = () => {
  const [models, setModels] = useState([]);
  const [settings, setSettings] = useState<{ models: string[] }>({ models: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toggleNotification = useNotification(); 

  useEffect(() => {
    SettingsRequests.getModels().then(res => {      
      setModels(res.data);
    })
    SettingsRequests.getSettings().then(res => {
      setSettings(res.data);
      setIsLoading(false);
    })
  }, [setModels, setSettings]);

  
  const handleSubmit = async () => {
    setIsSaving(true);    
    const res = await SettingsRequests.setSettings( settings );
    setIsSaving(false);
    toggleNotification({
      type: 'success',
      message: 'Settings successfully updated',
    });
  };
  


  return (
    <>
      <HeaderLayout
        id="title"
        title="Collection Tree settings"
        subtitle="Select models where the tree behavior will be applied."
        primaryAction={
          isLoading ? (
            <></>
          ) : (
            <Button
              onClick={handleSubmit}
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
          <Stack>
            <Typography></Typography>
            <Grid gap={6}>
              <GridItem col={12} s={12}>
                {models.map((model) => (
                  <Box
                    paddingTop={2}
                    paddingBottom={6}  
                    key={model}
                  >
                    <ToggleInput
                      label={<Typography style={{ textTransform: 'capitalize' }}>{model}</Typography>}
                      checked={settings.models.includes(model)}
                      onLabel="Active"
                      offLabel="Inactive"
                      onChange={(e: { target: { checked: boolean } }) => setSettings({ models: (e.target.checked) ? [...settings.models, model] : settings.models.filter((m) => m !== model) })}
                    />
                  </Box>
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
