import { FastifyInstance } from 'fastify'
import WebPush from 'web-push'
import { z } from 'zod'

const publicKey = 'BAxEunkPjfPeQuY1Nw420rUgxiQhj0b6xC-1nk8VZzJLMwVvXlv8bUeB0xaw6iyngJscV_n6IBP2IwRmJKHKOFM'
const privateKey = 'zxRo9vOpKUxqga_XtGefBFSjcq9XZzJqnGX8P3MA7-I'

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey,
    }
  })

  app.post('/push/register', (request, reply) => {
    console.log(request.body)

    return reply.status(201).send()
  })

  app.post('/push/send', (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)

    WebPush.sendNotification(subscription, 'HELLO DO BACKEND')

    return reply.status(201).send()
  })
}