import React, { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import getTrad from '../../utils/getTrad'
import { ReactSortable } from "react-sortablejs"

import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin'
import { Main, ContentLayout, HeaderLayout, Button, Flex } from '@strapi/design-system'
import { Check } from '@strapi/icons'

import type { SortItem } from '../../../../types'

import SortElement from '../../components/SortElement'
import SortLocaleSelect from '../../components/SortLocaleSelect'
import TreeRequests from '../../api/tree'
import SettingsRequests from '../../api/settings'

const SortPageView = () => {
  const { formatMessage } = useIntl()
  
  const model = useLocation().pathname.split('/').pop()  
  const urlQuery = new URLSearchParams(useLocation().search)  
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<SortItem[]>([])
  const [locales, setLocales] = useState<any[]>([])
  const toggleNotification = useNotification() 

  useEffect(() => {
    SettingsRequests.getLocales(model).then(res => {
      setLocales(res.data)
    })
    SettingsRequests.getDisplayField(model).then(res => {
      const displayField = res.data
      TreeRequests.getEntries(model, urlQuery.get('locale')).then(res => {
        setEntries(setItemsDisplayField(res.data, displayField))
        setIsLoading(false)
      })
    })
  }, [setEntries, setLocales])

  const setItemsDisplayField = (items: SortItem[], displayField: string): SortItem[] => {
    items.forEach((item) => {
      item.displayField = item[displayField] as string
      if (item.children) {
        item.children = setItemsDisplayField(item.children, displayField)
      }
    })
    return items
  }

  const handleSubmit = async () => {
    setIsSaving(true)    
    await TreeRequests.saveEntries({ key: model, entries: entries, locale: urlQuery.get('locale') })
    setIsSaving(false)
    toggleNotification({
      type: 'success',
      message: formatMessage({ id: getTrad('SettingsPage.Notification.message') }),
    })
  } 

  const capitalize = (str: string) => `${str[0]?.toUpperCase()}${str.slice(1)}`

  const sortableOptions = {
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    ghostClass: "ghost",
    group: "shared"
  }

  if (isLoading) {
    return <LoadingIndicatorPage />
  }

  return (
    <Main>
      <HeaderLayout
        id="title"
        title={capitalize(model)}
        subtitle={formatMessage({ id: getTrad('SortPage.Header.subtitle') })}
        primaryAction={
          isLoading ? (
            <></>
          ) : (
            <Flex gap={2}>
              <SortLocaleSelect locales={locales} />
              <Button
                onClick={handleSubmit}
                startIcon={<Check />}
                size="M"
                disabled={isSaving}
                loading={isSaving}
              >
                Save
              </Button>
            </Flex>
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
            )
        })}
        </ReactSortable>
      </ContentLayout>
    </Main>
  )
}

export default SortPageView