/*
 *
 * SettingsPage
 *
 */


import React, { useEffect, useState } from 'react'
import { LoadingIndicatorPage, useAutoReloadOverlayBlocker, useNotification } from '@strapi/helper-plugin'
import serverRestartWatcher from '../../utils/serverRestartWatcher';
import { useIntl } from 'react-intl'
import getTrad from '../../utils/getTrad'
import SettingsRequests from '../../api/settings'

import type { CollectionTreeConfig  } from '../../../../types'

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
} from '@strapi/design-system'

import { Check } from '@strapi/icons'

const SettingsPage = () => {
  const { lockAppWithAutoreload, unlockAppWithAutoreload } = useAutoReloadOverlayBlocker();
  const [models, setModels] = useState([])
  const [settings, setSettings] = useState<CollectionTreeConfig>({ models: [], fieldname: { lft: 'lft', rght: 'rght', parent: 'parent', children: 'children', tree: 'tree'}})
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { formatMessage } = useIntl()

  useEffect(() => {
    SettingsRequests.getModels().then(res => {      
      setModels(res.data)
    })
    SettingsRequests.getSettings().then(res => {
      setSettings(res.data)
      setIsLoading(false)
    })
  }, [setModels, setSettings])

  
  const handleSubmit = async () => {
    setIsSaving(true)    
    
    const res = await SettingsRequests.setSettings( settings )
    setIsSaving(false)
    lockAppWithAutoreload()
     
    await serverRestartWatcher(true, null);

    // Unlock the app
    await unlockAppWithAutoreload();
  }

  if (isLoading) {
    return <LoadingIndicatorPage />
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
                  setSettings({ models: (e.target.checked) ? [...settings.models, model] : settings.models.filter((m) => m !== model), fieldname: settings.fieldname })
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
            <GridItem col={6} s={12}>
              <TextInput label="Lft" name="lft" onChange={(event) => setSettings({ ...settings, fieldname: { ...settings.fieldname, lft: event.target.value } })} value={settings.fieldname.lft} required />
            </GridItem>
            <GridItem col={6} s={12}>
              <TextInput label="Rght" name="rght" onChange={(event) => setSettings({ ...settings, fieldname: { ...settings.fieldname, rght: event.target.value } })} value={settings.fieldname.rght} required />
            </GridItem>
            <GridItem col={6} s={12}>
              <TextInput label="Parent" name="parent" onChange={(event) => setSettings({ ...settings, fieldname: { ...settings.fieldname, parent: event.target.value } })} value={settings.fieldname.parent} required />
            </GridItem>
            <GridItem col={6} s={12}>
              <TextInput label="Children" name="parent" onChange={(event) => setSettings({ ...settings, fieldname: { ...settings.fieldname, children: event.target.value } })} value={settings.fieldname.children} required />
            </GridItem>
            <GridItem col={6} s={12}>
              <TextInput label="Tree Field" name="tree_field" onChange={(event) => setSettings({ ...settings, fieldname: { ...settings.fieldname, tree: event.target.value } })} value={settings.fieldname.tree} required />
            </GridItem>
          </Grid>
        </Box>
      </ContentLayout>
    </>
  )
}

export default SettingsPage