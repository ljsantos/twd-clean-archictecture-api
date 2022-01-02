import 'module-alias/register' // Registra mapeamento do @
import app from '@/main/config/app'

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000')
})
