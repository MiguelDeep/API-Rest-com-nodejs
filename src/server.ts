import { app } from "./app"
import { env } from "./env"

app.get("/",()=>{
  return "Seja bem - vindo Nossa API de teste!"
})

app.listen({ port: env.PORT }).then(() => {
  console.log('listening on port 3333')
})
