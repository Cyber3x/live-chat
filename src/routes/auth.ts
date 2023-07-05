import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.json({
        response: 'Hello auth',
    })
})

export default router
