/*
 *
 * SortLocaleSelect
 *
 */

import React from 'react';
import { useLocation } from 'react-router-dom';

import { SingleSelect, SingleSelectOption } from '@strapi/design-system'


const SortLocaleSelect = ({ locales }: { locales: any }) => {
  const path = useLocation().pathname
  const currentLocale = new URLSearchParams(useLocation().search).get('locale') ?? locales.find((locale) => locale.isDefault).code

  if (locales.length)
    return (
      <SingleSelect value={currentLocale} onChange={(value) => window.location.assign(`${path}?locale=${value}`)} >
        {locales.map((locale: any) => {
          return (
            <SingleSelectOption key={locale.id} value={locale.code}>
              {locale.name}
            </SingleSelectOption>
          );
        })}
      </SingleSelect>
    );
}

export default SortLocaleSelect;