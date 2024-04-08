import http from 'k6/http' // importando o módulo http do k6
import { sleep, check } from 'k6' // importando os módulos sleep e check do k6
import uuid from './libs/uuid.js' // importando a biblioteca uuid.js que gera um id único para cada requisição
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// com isso o k6 não fornece mais métricas de saída no console
// gerado arquivo dentro do diretorio do teste executado
export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
  };
}

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // até 100 usuários virtuais por 2 minutos
    { duration: '5m', target: 100 }, // permanece com 100 usuários virtuais por 5 minutos
    { duration: '2m', target: 200 }, // faz um ramp up para 200 usuários virtuais por 2 minutos
    { duration: '5m', target: 200 }, // permanece com 200 usuários virtuais por 5 minutos
    { duration: '2m', target: 300 }, // faz um ramp up para 300 usuários virtuais por 2 minutos
    { duration: '5m', target: 300 }, // permanece com 300 usuários virtuais por 5 minutos
    { duration: '2m', target: 400 }, // faz um ramp up para 400 usuários virtuais por 2 minutos
    { duration: '5m', target: 400 }, // permanece com 400 usuários virtuais por 5 minutos
    { duration: '10m', target: 0 }, // reduz para 0 usuários virtuais por 10 minutos
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições devem responder em até 2 segundos
    http_req_failed: ['rate<0.01'], // menos de 1% das requisições podem falhar
  }
}

export default function () {
  const url = 'http://localhost:3333/signup'

  const payload = JSON.stringify(
    {email: `${uuid.v4().substring(24)}@qa.anstech.com.br`, password: 'pwd123'}
    )

  const headers = {
    'headers': {
      'Content-Type': 'application/json'
    }
  }
  const res = http.post(url, payload, headers)
  /* console.log(res.body) */ // podemoa adicionar um log para verificar o corpo da resposta
                              // mas isso pode gerar um grande volume de logs

  check(res, {
    'status should be 201': (r) => r.status === 201
  })

  sleep(1)
}