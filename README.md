# Snot22score

Aplicação web para calcular o escore **SNOT-22** (Sinonasal Outcome Test 22), questionário utilizado para avaliar a gravidade dos sintomas nasossinusais.

## Estrutura do projeto

- `index.html` – página principal com o formulário do questionário.
- `styles.css` – estilos da interface.
- `calculator.js` – lógica de navegação, cálculo da pontuação e exportação do relatório em PDF.
- `calculator.test.js` – testes de unidade para a função de avaliação da pontuação.

## Como executar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/dhsig86/Snot22score.git
   cd Snot22score
   ```
2. Abra o arquivo `index.html` em qualquer navegador para usar a calculadora.
3. (Opcional) Instale as dependências e execute os testes:
   ```bash
   npm install
   npm test
   ```

## Funcionalidades

- Questionário de 22 itens com navegação por grupos e barra de progresso.
- Cálculo automático da pontuação total e destaque por cores conforme a gravidade.
- Seleção dos cinco sintomas mais impactantes.
- Geração de relatório em PDF com os resultados.

## Contribuindo

Contribuições são bem-vindas!

1. Faça um fork do projeto e crie uma branch para sua feature ou correção.
2. Instale as dependências e garanta que os testes (`npm test`) passem.
3. Envie um pull request descrevendo suas mudanças.

## Licença

Projeto licenciado sob os termos da licença MIT.
