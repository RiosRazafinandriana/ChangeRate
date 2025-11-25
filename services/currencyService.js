import currencyapi from '@everapi/currencyapi-js'

const client = new currencyapi('cur_live_0wa4feEFpWxE4ZnRCDp8FTjkGMQlyYZqSYZxZJid')

function getCurrency(){
    return client.latest()
  }

export default getCurrency
