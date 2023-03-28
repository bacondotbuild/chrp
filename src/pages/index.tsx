import { useState } from 'react'
import { type NextPage } from 'next'
import Image from 'next/image'
import { SignInButton, useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { toast } from 'react-hot-toast'
import { Loading, LoadingIcon, Main } from '@bacondotbuild/ui'

import Layout from '@/components/layout'
import { api, type RouterOutputs } from '@/utils/api'

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  const [text, setText] = useState('')

  const ctx = api.useContext()
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setText('')
      void ctx.posts.getAll.invalidate()
    },
    onError: e => {
      const errorMessage = e.data?.zodError?.fieldErrors.content as unknown
      if (errorMessage) {
        toast.error(errorMessage as string)
      } else {
        toast.error('failed to post! please try again later')
      }
    },
  })

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
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (text !== '') {
              mutate({ content: text })
            }
          }
        }}
        disabled={isPosting}
      />
      {text !== '' && !isPosting && (
        <button onClick={() => mutate({ content: text })} disabled={isPosting}>
          post
        </button>
      )}
      {isPosting && (
        <div className='flex items-center justify-center'>
          <LoadingIcon className='h-8 w-8 animate-spin-slow text-blue-700 dark:text-blue-200' />
        </div>
      )}
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
        <span className='text-2xl'>{post.content}</span>
      </div>
    </li>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading)
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  if (!data) return <div>something went wrong</div>

  return (
    <ul className='flex flex-col'>
      {data.map(post => (
        <PostView key={post.post.id} {...post} />
      ))}
    </ul>
  )
}

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser()

  // Start fetching data asap
  api.posts.getAll.useQuery()

  return (
    <Layout>
      {userLoaded && (
        <Main className='flex justify-center'>
          <div className='w-full border-x border-slate-400 md:max-w-2xl'>
            <div className='border-b border-slate-400 p-4'>
              {isSignedIn ? <CreatePostWizard /> : <SignInButton />}
            </div>
            <Feed />
          </div>
        </Main>
      )}
    </Layout>
  )
}

export default Home
