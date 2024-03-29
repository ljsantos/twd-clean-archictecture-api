import 'module-alias/register' // Registra mapeamento do @
import { MongoHelper } from '@/external/repositories/mongodb/helper'

MongoHelper.connect(process.env.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(5000, () => {
      console.log('Server running at http://localhost:5000')
    })
  })
  .catch(console.error)
