import {knex as setup }  from 'knex'
import {Knex as KNEX} from 'knex'
import { env } from './env/index'

if(!process.env.DATABASE_URL){
  throw new Error('Nao temos string de conexao com base de dados')
}
 export const config:KNEX.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
 migrations:{
  extension:'ts',
  directory:"./db/migrations"
 }
}

 const Knex = setup(config)

export default Knex;