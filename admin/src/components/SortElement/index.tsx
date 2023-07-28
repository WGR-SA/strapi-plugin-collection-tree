/*
 *
 * SortItem
 *
 */

import React from 'react';

import { Box, Typography } from '@strapi/design-system'
import { Drag } from '@strapi/icons';

import type { SortItem } from '../../../../types';

const SortElement = ({ entry }: { entry: SortItem }) => {
  console.log(entry.children)

  return (
    <Box
      background="neutral0"
      hasRadius
      shadow="filterShadow"
      paddingTop={3}
      paddingBottom={3}
      paddingLeft={4}
      paddingRight={4}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '.5rem',
        margin: '0 0 .5rem 0',
        cursor: 'grab'
      }}
    >
      <Typography
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.5rem',
        }}
      >
        <Drag />
        { entry.Title ?? entry.Name ?? entry.id }
      </Typography>
      {entry.children.map((subentry) => {
        <SortElement key={subentry.id} entry={subentry} />
      })}
    </Box>
  );
}

export default SortElement;