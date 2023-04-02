import { Main, Page } from '@bacondotbuild/ui'

import Meta from '@/components/meta'

const DEFAULT_TITLE = 'chrp'

const Layout = ({
  title = DEFAULT_TITLE,
  children,
}: {
  title?: string
  children: React.ReactNode
}) => (
  <Page>
    <Meta
      title={title === DEFAULT_TITLE ? title : `${title} - ${DEFAULT_TITLE}`}
    />
    <Main className='flex justify-center'>
      <div className='flex w-full flex-col border-x border-slate-400 md:max-w-2xl'>
        {children}
      </div>
    </Main>
  </Page>
)

export default Layout
