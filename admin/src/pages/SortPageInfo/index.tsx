import React from "react"
import { useIntl } from 'react-intl'
import getTrad from '../../utils/getTrad'

import { Main, ContentLayout, HeaderLayout, Typography, Box, Grid, GridItem } from '@strapi/design-system'


const SortPageView = () => {
  const { formatMessage } = useIntl()



  return (
    <Main>
      <HeaderLayout
        id="title"
        title={formatMessage({ id: getTrad('App.Plugin.title') })}
      />
      <ContentLayout>
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          padding={6}
          marginBottom={6}
        >
          <Typography variant="delta">
            {formatMessage({ id: getTrad('SortPageInfo.Box.title') })}
          </Typography>
          <Grid marginTop={4} gap={6}>
            <GridItem col={6} s={12} >
              <Typography>
                {formatMessage({ id: getTrad('SortPageInfo.Box.content') })}
              </Typography>
            </GridItem>
          </Grid>
        </Box>
      </ContentLayout>  
    </Main>
  )
}

export default SortPageView