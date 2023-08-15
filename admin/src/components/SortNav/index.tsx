/*
 *
 * SortNav
 *
 */

import React from 'react'

import pluginId from '../../pluginId'
import { useIntl } from 'react-intl'
import getTrad from '../../utils/getTrad'

import {
  SubNav,
  SubNavHeader,
  SubNavSections,
  SubNavSection,
  SubNavLink
} from '@strapi/design-system'


const SortNav = ({ models }: { models: string[] }) => {
  const { formatMessage } = useIntl();

  return (
    <SubNav ariaLabel={formatMessage({ id: getTrad('App.Plugin.title') })}>
      <SubNavHeader label={formatMessage({ id: getTrad('App.Plugin.title') })} />
      <SubNavSections>
        <SubNavSection label="Collections">
          {models.map((model) => {
            return (
              <SubNavLink
                key={model}
                to={`/plugins/${pluginId}/${model}`}
                style={{textTransform: 'capitalize'}}
              >
                {model}
              </SubNavLink>
            );
          })}
        </SubNavSection>
      </SubNavSections>
    </SubNav>
  );
}

export default SortNav;
