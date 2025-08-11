# Releases (GitHub)

## Como publicar uma nova versão
1. Atualize `package.json` -> `version` (ex.: 1.1.0).
2. Commit + tag semântica (ex.: `v1.1.0`) e push da tag:
   ```bash
   git add -A && git commit -m "chore(release): v1.1.0"
   git tag v1.1.0
   git push origin main --tags
   ```
3. O workflow **Release on tag** irá:
   - Instalar deps, rodar `npm run build`
   - Zipear `dist/` em `dist.zip`
   - Gerar notas automaticamente a partir de PRs/commits
   - Criar o **GitHub Release** e anexar `dist.zip`

> Dica: use labels em PRs (`feature`, `fix`, `docs`, `chore`) para organizar as notas.
