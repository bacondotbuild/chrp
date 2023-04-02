import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import { Loading } from '@bacondotbuild/ui'

import Layout from '@/components/layout'
import Post from '@/components/post'
import { api } from '@/utils/api'
import { generateSSGHelper } from '@/utils/ssgHelper'

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  })
  if (isLoading)
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  if (!data || data.length === 0) return <div>user has not posted</div>
  return (
    <ul className='flex flex-col divide-y divide-slate-400'>
      {data.map(post => (
        <Post key={post.post.id} {...post} />
      ))}
    </ul>
  )
}

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
      <ProfileFeed userId={data.id} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const ssg = generateSSGHelper()

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
