import { useState } from 'react'
import { type NextPage } from 'next'
import Image from 'next/image'
import { SignInButton, useUser } from '@clerk/nextjs'
import { toast } from 'react-hot-toast'
import { Loading, LoadingIcon } from '@bacondotbuild/ui'

import Layout from '@/components/layout'
import Post from '@/components/post'
import { api } from '@/utils/api'

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
        <Post key={post.post.id} {...post} />
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
        <>
          <div className='border-b border-slate-400 p-4'>
            {isSignedIn ? <CreatePostWizard /> : <SignInButton />}
          </div>
          <Feed />
        </>
      )}
    </Layout>
  )
}

export default Home
