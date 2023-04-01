import type { GetStaticProps, NextPage } from 'next'

import Layout from '@/components/layout'
import Post from '@/components/post'
import { api } from '@/utils/api'
import { generateSSGHelper } from '@/utils/ssgHelper'

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  })

  if (!data) return <div>404</div>

  return (
    <Layout title={`${data.post.content} - ${data.author.username}`}>
      <Post {...data} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const ssg = generateSSGHelper()

  const id = context.params?.id

  if (typeof id !== 'string') throw new Error('no slug')

  await ssg.posts.getById.prefetch({ id })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default SinglePostPage
