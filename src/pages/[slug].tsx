import type { GetStaticProps, NextPage } from 'next'

import Layout from '@/components/layout'
import { api } from '@/utils/api'

const Profile: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  })

  if (!data) return <div>404</div>

  return (
    <Layout title={`profile - ${data.username || ''}`}>
      <div className='relative h-36 bg-cobalt'>
        <Image
          src={data.profileImageUrl}
          alt={`${data.username ?? ''}'s profile pic`}
          width={96}
          height={96}
          className='rounded- absolute bottom-0 left-0 -mb-[48px] ml-4 rounded-full border-4 border-cb-dark-blue'
        />
      </div>
      <div className='h-[64px]'></div>
      <div className='p-4 text-2xl font-bold'>{`@${data.username ?? ''}`}</div>
      <div></div>
    </Layout>
  )
}

import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import { appRouter } from '@/server/api/root'
import { prisma } from '@/server/db'
import superjson from 'superjson'
import Image from 'next/image'

export const getStaticProps: GetStaticProps = async context => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  })

  const slug = context.params?.slug

  if (typeof slug !== 'string') throw new Error('no slug')

  const username = slug.replace('@', '')

  await ssg.profile.getUserByUsername.prefetch({ username })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Profile
