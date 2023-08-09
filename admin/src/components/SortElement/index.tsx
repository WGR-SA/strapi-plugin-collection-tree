/*
 *
 * SortItem
 *
 */

import React, { useState } from 'react';
import { ReactSortable } from "react-sortablejs";

import { Box, Typography } from '@strapi/design-system'
import { Drag } from '@strapi/icons';

import type { SortItem } from '../../../../types';

const sortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  ghostClass: "ghost",
  group: "shared"
};

const SortElement = ({ entry }: { entry: SortItem }) => {
  const [entries, setEntries] = useState<SortItem[]>(entry.children)

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
        gap: '0 .5rem',
        margin: '.5rem 0 0',
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
        { entry.title ?? entry.name ??  entry.id }
      </Typography>
      <ReactSortable list={entries} setList={(newState) => {
        setEntries(newState)
        entry.children = newState
      }} {...sortableOptions}>
        {entry.children.map((subentry) => {
          return <SortElement key={subentry.id} entry={subentry} />
        })}
      </ReactSortable>
      
    </Box>
  );
}

export default SortElement;