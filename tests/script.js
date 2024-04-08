import http from 'k6/http'
import { sleep, check } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// com isso o k6 não fornece mais métricas de saída no console
// gerado arquivo dentro do diretorio do teste executado
export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
    };
  }

export default function () {
  const res = http.get('http://localhost:3333')

  check(res, {
    'status shouel be 200': (r) => r.status === 200
  })

  sleep(1)
}