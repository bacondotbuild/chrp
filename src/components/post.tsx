import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

import { type RouterOutputs } from '@/utils/api'

type PostWithUser = RouterOutputs['posts']['getAll'][number]

const Post = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <li key={post.id} className='flex gap-3 border-b border-slate-400 p-4'>
      <Link href={`/@${author.username}`}>
        <Image
          src={author.profileImageUrl}
          alt={`profile picture of ${author.username}`}
          className='h-14 w-14 rounded-full'
          width={56}
          height={56}
        />
      </Link>
      <div className='flex flex-col'>
        <div className='flex gap-1 text-slate-300'>
          <Link
            className='hover:text-cb-pink'
            href={`/@${author.username}`}
          >{`@${author.username}`}</Link>
          <span>·</span>
          <Link
            className='font-thin hover:text-cb-pink'
            href={`/posts/${post.id}`}
          >
            {dayjs(post.createdAt).fromNow()}
          </Link>
        </div>
        <span className='text-2xl'>{post.content}</span>
      </div>
    </li>
  )
}

export default Post
