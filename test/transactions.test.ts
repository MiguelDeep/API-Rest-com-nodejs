 import {  test,beforeAll,afterAll, it } from "vitest"
 import request, { agent } from "supertest"
 import { app } from "../src/app"

beforeAll(async() => {
 await app.ready()
});


afterAll(async() => {
  await app.close()
 });
 

 test('O usuario consegue criar uma nova transacao.',async ()=>{
    // fazer a chamada HTTP p/ criar uma nova transacao
    const response =  await request(app.server).post('/transactions').send({
      title :"New transactions",
      amount : 1000,
      type:"credit"
    })
    const cookies = response.get('Set-Cookie');
    console.log(cookies)
    // validacao
 })

 test('Listar todas as transacoes...',async ()=>{

  const response =  await request(app.server).post('/transactions').send({
    title :"New transactions",
    amount : 100,
    type:"credit"
  })

  const cookies = response.get('Set-Cookie');

  if(cookies) {
    const listTransactionsResponse = await request(app.server).get("/transactions").set('Cookie',cookies).expect(200)
  }
  

})

