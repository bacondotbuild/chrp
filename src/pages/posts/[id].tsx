import { type NextPage } from 'next'

import { Main } from '@bacondotbuild/ui'

import Layout from '@/components/layout'
import { api } from '@/utils/api'

const Profile: NextPage = () => {
  // Start fetching data asap
  api.posts.getAll.useQuery()

  return (
    <Layout>
      <Main className='flex justify-center'>
        <div className='w-full border-x border-slate-400 md:max-w-2xl'>
          post view
        </div>
      </Main>
    </Layout>
  )
}

export default Profile
