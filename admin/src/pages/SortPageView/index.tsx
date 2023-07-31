import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
import { ReactSortable } from "react-sortablejs";

import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin';
import { Main, ContentLayout, HeaderLayout, Button } from '@strapi/design-system'
import { Check } from '@strapi/icons';

import type { SortItem } from '../../../../types';

import SortElement from '../../components/SortElement'
import TreeRequests from '../../api/tree';

const SortPageView = () => {
  const { formatMessage } = useIntl();
  const model = useLocation().pathname.split('/').pop()
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<SortItem[]>([])
  const toggleNotification = useNotification(); 

  useEffect(() => {
    TreeRequests.getEntries(model).then(res => {
      setEntries(res.data);
      setIsLoading(false)      
    })
  }, [setEntries]);

  const handleSubmit = async () => {
    setIsSaving(true);    
    await TreeRequests.saveEntries({ key: model, entries: entries })
    setIsSaving(false);
    toggleNotification({
      type: 'success',
      message: formatMessage({ id: getTrad('SettingsPage.Notification.message') }),
    });
  } 

  const sortableOptions = {
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    ghostClass: "ghost",
    group: "shared"
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Main>
      <HeaderLayout
        id="title"
        title={model}
        subtitle={formatMessage({ id: getTrad('SortPage.Header.subtitle') })}
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
        <ReactSortable
          list={entries}
          setList={(newState) => setEntries(newState)}
          {...sortableOptions}
        >
          {entries.map((entry) => {
            return (
              <SortElement key={entry.id} entry={entry} />
            );
        })}
        </ReactSortable>
      </ContentLayout>
    </Main>
  )
}

export default SortPageView;