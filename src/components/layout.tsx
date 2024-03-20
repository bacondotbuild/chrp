import Link from 'next/link'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid'

import { Main, Page } from '@bacondotbuild/ui'

import Meta from '@/components/meta'

const DEFAULT_TITLE = 'chrp'

const Layout = ({
  title = DEFAULT_TITLE,
  children,
}: {
  title?: string
  children: React.ReactNode
}) => {
  const { user, isSignedIn, isLoaded } = useUser()
  return (
    <Page>
      <Meta
        title={title === DEFAULT_TITLE ? title : `${title} - ${DEFAULT_TITLE}`}
      />
      <Main className='flex justify-center'>
        <header className='flex w-full flex-col border-x border-slate-400 md:max-w-2xl'>
          {isLoaded && (
            <div className='flex justify-between border-b border-slate-400 p-4'>
              <h1>
                <Link href='/' className='flex items-center gap-2'>
                  <span className='text-2xl'>🐦</span>
                  <span className='hidden md:inline'>chrp</span>
                </Link>
              </h1>
              {isSignedIn ? (
                <div className='flex items-center gap-2'>
                  {user.username}
                  <SignOutButton>
                    <ArrowLeftOnRectangleIcon className='h-6 w-6 hover:cursor-pointer hover:text-cb-pink' />
                  </SignOutButton>
                </div>
              ) : (
                <div className='hover:cursor-pointer hover:text-cb-pink'>
                  <SignInButton>
                    <span className='flex gap-2 '>
                      login
                      <ArrowRightOnRectangleIcon className='h-6 w-6' />
                    </span>
                  </SignInButton>
                </div>
              )}
            </div>
          )}
          {children}
        </header>
      </Main>
    </Page>
  )
}

export default Layout
