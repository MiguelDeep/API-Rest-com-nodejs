import { FastifyInstance } from 'fastify';
import  Knex from '../database'
import { z }  from 'zod'
import  crypto   from 'node:crypto'
import { checkSessionIdExists }  from '../middleware/check-sessions-id-exist';

export async function transactionsRoutes(app:FastifyInstance){

    app.addHook('preHandler',async(req)=>{
      console.log(`[${req.method}] ${req.url}`)
    })
  app.get('/',{
    preHandler:[checkSessionIdExists],
  },async(request,replay)=>{

    const { sessionId } = request.cookies;


      const transactions = await Knex('transactions').where("session_id",sessionId).select('*').returning('*')
      return {
        transactions
      };
  })
  app.get('/:id',{
    preHandler:[checkSessionIdExists],
  },async(req)=>{
    const getTransactionsParamsShema = z.object({
      id : z.string().uuid(),
    })

    const {id} = getTransactionsParamsShema.parse(req.params)
    const { sessionId } = req.cookies
    const transaction = await Knex("transactions").where('id', id).andWhere("session_id",sessionId).first()

  return {
    transaction
  }
    
})
app.get('/summary',{
  preHandler:[checkSessionIdExists],
}, async (req, res) => {
  const { sessionId } = req.cookies
    const summary = await Knex("transactions").where("session_id",sessionId).sum('amount', {
      as: 'amount',
    }).first()
    return {
      summary
    }
})
  app.post('/',{
    preHandler:[checkSessionIdExists],
  }, async(req,replay) => {

    //{ title ,amount ,type: credit ou debit }
    const createTransactionBodySchema = z.object({
      title : z.string(),
      amount: z.number(),
      type: z.enum(['credit','debit']),

    }) 

    const { title , amount , type} = createTransactionBodySchema.parse(req.body)


    let sessionId = req.cookies.sessionId

     if(!sessionId){
      sessionId = crypto.randomUUID();

      replay.cookie('sessionId', sessionId,{
        path:'/',
        maxAge:60 * 60 * 24 * 7 //7 dias
      })
     }
     await Knex('transactions').insert({
      id:crypto.randomUUID(),
      title,
      amount: type === 'credit' ?  amount : amount * -1,
      session_id: sessionId
    })
  
    return replay.send("Cadastrado com sucesso!").status(201);
  })
  
}