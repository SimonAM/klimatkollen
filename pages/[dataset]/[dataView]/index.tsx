import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Municipality as TMunicipality } from '../../../utils/types'
import StartPage from '../..'
import { ClimateDataService } from '../../../utils/climateDataService'
import { isValidDataView, normalizeString } from '../../../utils/shared'
import Layout from '../../../components/Layout'
import Footer from '../../../components/Footer/Footer'
import { getDataDescriptions } from '../../../utils/datasetDefinitions'
import { getServerSideI18n } from '../../../utils/getServerSideI18n'

interface Params extends ParsedUrlQuery {
  dataset: string
  dataView: string
}

const cache = new Map()

export const getServerSideProps: GetServerSideProps = async ({
  params, res, locale,
}) => {
  const dataset = (params as Params).dataset as string
  const dataView = (params as Params).dataView as string
  const { t, _nextI18Next } = await getServerSideI18n(locale as string, ['common', 'startPage'])
  const { isValidDataset } = getDataDescriptions(locale as string, t)

  const normalizedDataset = normalizeString(dataset)
  const normalizedDataView = normalizeString(dataView)

  if (!isValidDataset(normalizedDataset) || !isValidDataView(normalizedDataView)) {
    return {
      notFound: true, // Return a 404 page
    }
  } if (dataset !== normalizedDataset || dataView !== normalizedDataView) {
    return {
      redirect: {
        destination: `/${normalizedDataset}/${normalizedDataView}`,
        permanent: true,
      }, // Redirect to the lower case non-åäö url
    }
  }

  const municipalities = new ClimateDataService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader(
    'Cache-Control',
    `public, stale-while-revalidate=60, max-age=${60 * 60 * 24 * 7}`,
  )

  if (cache.get(normalizedDataset)) return cache.get(normalizedDataset)

  const result = {
    props: {
      municipalities,
      normalizedDataset,
      _nextI18Next,
    },
  }

  cache.set(normalizedDataset, result)
  return result
}

type Props = {
  municipalities: Array<TMunicipality>
}

export default function DataView({ municipalities }: Props) {
  return (
    <>
      <Layout>
        <StartPage municipalities={municipalities} />
      </Layout>
      <Footer />
    </>
  )
}
