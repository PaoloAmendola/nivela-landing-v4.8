# CI de Performance (Lighthouse) e Preview (Vercel)

## Production (automático em `main`/`master`)
- Workflow: `.github/workflows/lighthouse-production.yml`
- Testa `https://nivela.bembeauty.com.br` com 3 rodadas e publica o relatório no storage temporário do LHCI.

## Pull Requests (preview automático + Lighthouse)
- Workflow: `.github/workflows/vercel-preview-and-lighthouse.yml`
- Requisitos (definir como **Secrets** do repositório):
  - `VERCEL_TOKEN` – token pessoal da Vercel (Permission: Deployments)
  - `VERCEL_ORG_ID` – ID da sua organização
  - `VERCEL_PROJECT_ID` – ID do projeto
- O workflow faz **deploy preview** e roda o Lighthouse na URL de preview que a Vercel retornar.

> Dica: se preferir usar a integração nativa GitHub ↔ Vercel (sem action), comente o job de deploy e mantenha **apenas o Lighthouse** usando uma variável `LHCI_URL` com a URL do preview.
