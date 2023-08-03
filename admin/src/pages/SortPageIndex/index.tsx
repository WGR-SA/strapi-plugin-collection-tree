import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { Layout } from '@strapi/design-system';
import { LoadingIndicatorPage } from '@strapi/helper-plugin';

import pluginId from '../../pluginId';
import SettingsRequests from '../../api/settings';
import SortNav from '../../components/SortNav';
import SortPageView from '../SortPageView';
import SortPageInfo from '../SortPageInfo';

const SortPageIndex = () => {
  const [settings, setSettings] = useState<{ models: string[] }>({ models: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SettingsRequests.getSettings().then(res => {
      setSettings(res.data);
      setIsLoading(false);
    })
  }, [setSettings]);

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Layout sideNav={<SortNav models={settings.models} />}>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={SortPageInfo} exact />
        {settings.models.map((model) => {
          return (
            <Route path={`/plugins/${pluginId}/${model}`} key={model} component={SortPageView} exact />
          );
        })};        
      </Switch>
    </Layout>
  );
}

export default SortPageIndex;