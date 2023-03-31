import { z } from 'zod'
import { clerkClient } from '@clerk/nextjs/server'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { filterUserForClient } from '@/utils/filterUserForClient'

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      })

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'user not found',
        })
      }

      return filterUserForClient(user)
    }),
})