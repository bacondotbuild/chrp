import { type NextPage } from 'next'
import Image from 'next/image'
import { SignInButton, useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Main } from '@bacondotbuild/ui'

import Layout from '@/components/layout'
import { api, type RouterOutputs } from '@/utils/api'

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  if (!user) return null

  return (
    <div className='flex gap-3'>
      {/* <p>hello there, {user.user.username}</p> */}
      {/* <SignOutButton /> */}
      <Image
        src={user.profileImageUrl}
        alt='profile image'
        className='h-14 w-14 rounded-full'
        width={56}
        height={56}
      />
      <input
        placeholder='type some emojis'
        className='grow bg-transparent outline-none'
      />
    </div>
  )
}

type PostWithUser = RouterOutputs['posts']['getAll'][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <li key={post.id} className='flex gap-3 border-b border-slate-400 p-4'>
      <Image
        src={author.profileImageUrl}
        alt={`profile picture of ${author.username}`}
        className='h-14 w-14 rounded-full'
        width={56}
        height={56}
      />
      <div className='flex flex-col'>
        <div className='flex gap-1 text-slate-300'>
          <span>{`@${author.username}`}</span>
          <span>·</span>
          <span className='font-thin'>{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </li>
  )
}

const Home: NextPage = () => {
  const user = useUser()
  const { data, isLoading } = api.posts.getAll.useQuery()

  if (isLoading) return <Layout>loading</Layout>
  if (!data) return <div>something went wrong</div>
  return (
    <Layout>
      <Main className='flex justify-center'>
        <div className='w-full border-x border-slate-400 md:max-w-2xl'>
          <div className='border-b border-slate-400 p-4'>
            {user.isSignedIn ? <CreatePostWizard /> : <SignInButton />}
          </div>
          <ul className='flex flex-col'>
            {data.map(post => (
              <PostView key={post.post.id} {...post} />
            ))}
          </ul>
        </div>
      </Main>
    </Layout>
  )
}

export default Home
