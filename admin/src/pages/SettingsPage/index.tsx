/*
 *
 * SettingsPage
 *
 */


import React, { useEffect, useState } from 'react';
import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
import SettingsRequests from '../../api/settings';

import {
  Box,
  Button,
  Grid,
  GridItem,
  HeaderLayout,
  ContentLayout,
  Typography,
  TextInput,
  ToggleInput
} from '@strapi/design-system';

import { Check } from '@strapi/icons';

const SettingsPage = () => {
  const [models, setModels] = useState([]);
  const [settings, setSettings] = useState<{ models: string[], attributes: {lft: string, rght: string, parent: string} }>({models: [], attributes: {lft: 'lft', rght: 'rght', parent: 'parent'}});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toggleNotification = useNotification(); 
  const { formatMessage } = useIntl();

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
      message: formatMessage({ id: getTrad('SettingsPage.Notification.message') }),
    });
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }
  
  return (
    <>
      <HeaderLayout
        id="title"
        title={formatMessage({ id: getTrad('SettingsPage.Header.title') })}
        subtitle={formatMessage({ id: getTrad('SettingsPage.Header.subtitle') })}
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
          padding={6}
          marginBottom={6}
        >
          <Typography variant="delta">{formatMessage({ id: getTrad('SettingsPage.Box1.title') })}</Typography><br />
          <Typography>{formatMessage({ id: getTrad('SettingsPage.Box1.subtitle') })}</Typography>

          {models.map((model) => (
            <Box
              marginTop={4}
              key={model}
            >
              <ToggleInput
                label={<Typography style={{ textTransform: 'capitalize' }}>{model}</Typography>}
                checked={settings.models.includes(model)}
                onLabel={formatMessage({ id: getTrad('SettingsPage.Toggle.on') })}
                offLabel={formatMessage({ id: getTrad('SettingsPage.Toggle.off') })}
                onChange={(e: { target: { checked: boolean } }) => {
                  setSettings({ models: (e.target.checked) ? [...settings.models, model] : settings.models.filter((m) => m !== model), attributes: settings.attributes })
                }}
              />
            </Box>
          ))}
        </Box>
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          padding={6}
        >
          <Typography variant="delta">{formatMessage({ id: getTrad('SettingsPage.Box2.title') })}</Typography><br />
          <Typography>{formatMessage({ id: getTrad('SettingsPage.Box2.subtitle') })}</Typography>
          <Grid marginTop={4} gap={6}>
            <GridItem col={4} s={12}>
              <TextInput label="Lft" name="lft" onChange={(event) => setSettings({ ...settings, attributes: { ...settings.attributes, lft: event.target.value } })} value={settings.attributes.lft} required />
            </GridItem>
            <GridItem col={4} s={12}>
              <TextInput label="Rght" name="rght" onChange={(event) => setSettings({ ...settings, attributes: { ...settings.attributes, rght: event.target.value } })} value={settings.attributes.rght} required />
            </GridItem>
            <GridItem col={4} s={12}>
              <TextInput label="Parent" name="parent" onChange={(event) => setSettings({ ...settings, attributes: { ...settings.attributes, parent: event.target.value } })} value={settings.attributes.parent} required />
            </GridItem>
          </Grid>
        </Box>
      </ContentLayout>
    </>
  );
};

export default SettingsPage;