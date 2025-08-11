
# Previews na Vercel (Pull Requests)

Ao conectar o repositório do GitHub à Vercel, cada Pull Request gera automaticamente um **Preview Deployment**.
- Branch principal (ex.: `main`): produz o **Production Deployment**.
- Branches de feature: produzem **Preview Deployments** com URL única.

Dicas:
- Use PRs pequenos e frequentes.
- Valide `/api/ping` e os formulários em cada preview antes de mesclar.

