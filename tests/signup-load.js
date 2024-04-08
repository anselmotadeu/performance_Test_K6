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
    { duration: '1m', target: 100 }, // até 100 usuários virtuais
    { duration: '2m', target: 100 }, // permanece com 100 usuários virtuais
    { duration: '1m', target: 0 }, // diminui para 0 usuários virtuais
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
  console.log(res.body)

  check(res, {
    'status should be 201': (r) => r.status === 201
  })

  sleep(1)
}