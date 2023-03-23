import { type NextPage } from 'next'
import { Button, Main, Title } from '@bacondotbuild/ui'

import Layout from '@/components/layout'
import { api } from '@/utils/api'

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' })

  return (
    <Layout>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col items-center justify-center space-y-4'>
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