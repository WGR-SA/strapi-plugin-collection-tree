/*
 *
 * SortLocaleSelect
 *
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { SingleSelect, SingleSelectOption } from '@strapi/design-system'


const SortLocaleSelect = ({ locales }: { locales: any }) => {
  
  const path = useLocation().pathname
  // To do get defautl locale  
  const currentLocale = new URLSearchParams(useLocation().search).get('locale') ?? 'en' // locales[0].code


  

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