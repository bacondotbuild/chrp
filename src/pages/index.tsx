import { type NextPage } from 'next'
import { Button, Main, Title } from '@bacondotbuild/ui'

import Layout from '@/components/layout'
import { api } from '@/utils/api'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' })

  const user = useUser()
  return (
    <Layout>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col items-center justify-center space-y-4'>
          {user.isSignedIn ? (
            <>
              <p>hello there, {user.user.username}</p>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
          <Title>home</Title>
          <Button href='https://github.com/bacondotbuild/b4-app'>
            external link
          </Button>
          <Button onClick={() => console.log('click')}>button</Button>
          {hello.data?.greeting}
        </div>
      </Main>
    </Layout>
  )
}

export default Home
