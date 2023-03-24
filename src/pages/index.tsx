import { type NextPage } from 'next'
import { Main, Title } from '@bacondotbuild/ui'

import Layout from '@/components/layout'
import { api } from '@/utils/api'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'

const Home: NextPage = () => {
  const user = useUser()
  const { data } = api.posts.getAll.useQuery()
  return (
    <Layout>
      <Main className='flex flex-col p-4'>
        {user.isSignedIn ? (
          <>
            <p>hello there, {user.user.username}</p>
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
        <Title>home</Title>
        <ul>
          {data?.map(post => (
            <li key={post.id}>{post.content}</li>
          ))}
        </ul>
      </Main>
    </Layout>
  )
}

export default Home
