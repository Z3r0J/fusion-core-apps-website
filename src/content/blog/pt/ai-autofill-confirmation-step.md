---
title: "Preenchimento automático com IA: por que a confirmação fica"
description: "O scanner do Claimly preenche todos os campos com IA e ainda pede confirmação. A regra que usamos para decidir quando uma função com IA precisa de revisão."
app: Claimly
category: Product
slug: ai-autofill-confirmation-step
translationKey: "ai-autofill-confirmation-step"
publishedAt: "2026-07-12"
author: "FusionCore Apps"
tags: ["ux com ia", "produto", "claimly", "ocr", "human in the loop"]
ogImage: "/blog/og/pt/ai-autofill-confirmation-step.png"
featured: false
faq:
  - question: "Uma função de preenchimento automático com IA deveria salvar sozinha?"
    answer: "Depende de quando o erro fica visível. Se a pessoa percebe o valor errado na hora e corrige com um toque, salvar automaticamente é aceitável. Se o erro fica escondido até custar alguma coisa — um prazo perdido, um pagamento errado —, mantenha a etapa de confirmação."
  - question: "O que é human-in-the-loop em um aplicativo móvel?"
    answer: "Significa que a IA propõe e a pessoa confirma. O modelo extrai ou gera os valores, a interface mostra tudo como rascunho, e nada é gravado até o usuário aprovar. A última decisão continua sendo humana."
  - question: "Qual é a precisão do escaneamento de recibos com IA?"
    answer: "Boa o suficiente para evitar quase toda a digitação, insuficiente para confiar de olhos fechados. As falhas recorrentes são estruturais: um total que na verdade é um subtotal, um formato de data ambíguo, um cabeçalho com a razão social em vez da marca, e papel térmico já apagado."
  - question: "Como mostrar quais campos a IA preencheu?"
    answer: "Marcando de forma visível os valores vindos do modelo, permitindo editar cada campo ali mesmo e nunca escondendo o documento original. No Claimly o recibo escaneado fica na tela ao lado dos campos, para comparar em vez de confiar."
  - question: "A etapa de confirmação não prejudica a conversão?"
    answer: "Ela adiciona uma tela, então custa algo. Esse custo só é aceito quando o erro é caro e silencioso. Para saídas de IA de baixo risco, como uma lista de compras gerada, não colocamos nenhuma barreira."
---

O Claimly escaneia um recibo, envia para um modelo e volta com o nome do produto, a loja, a data da compra e o total já preenchidos. O passo óbvio seria salvar: escanear existe justamente para não digitar. Não salvamos. O aplicativo mostra os valores extraídos em uma tela de revisão e espera a confirmação da pessoa.

Parece um toque desperdiçado, e a pergunta aparece com frequência. A resposta curta: a etapa de confirmação não está ali por desconfiança do modelo. Está ali por causa de **quando** um erro nessa função específica se torna visível.

## A regra: a confirmação se paga pelo momento em que o erro aparece

Quase todo conselho sobre funções com IA começa pela confiança do modelo: mostrar um score, aceitar automaticamente acima de um limite, perguntar abaixo dele. É tentador e, pela nossa experiência, é a pergunta errada para começar. A confiança do modelo diz o quanto o modelo está seguro. Não diz nada sobre o que custa um valor errado.

A pergunta que fazemos no lugar é: **se este valor estiver errado, quando o usuário vai descobrir?**

- **Na hora, e a correção é um toque.** Sem barreira. A própria interface é a correção de erros.
- **Depois, e com um custo real.** Com barreira. Um erro silencioso que aparece dali a seis meses não é um incômodo de UX: é o fracasso completo da função.

Uma garantia é o segundo caso, e uma versão especialmente cruel dele. Uma data de compra deslocada em um mês produz um aplicativo que parece perfeitamente correto: o produto está listado, a contagem regressiva roda, o alerta dispara. Dispara no dia errado. A pessoa descobre quando chega à loja com o prazo de reclamação vencido — exatamente o cenário que o aplicativo deveria evitar. O aplicativo não falhou com barulho. Falhou com boas maneiras, meses depois, e muito seguro de si.

Essa assimetria é o argumento inteiro. A confirmação custa um toque agora. Pular a confirmação custa a única promessa do produto, depois, de um jeito que ninguém mais consegue depurar.

## O que realmente quebra no OCR de recibos

Extrair já não é a parte difícil. As falhas que vemos são estruturais, e são justamente as que um modelo pode errar soando completamente seguro:

- **O total que não é o total.** Recibos imprimem subtotais, impostos, descontos, ajustes de fidelidade e o valor entregue em dinheiro. Vários desses números são "totais" plausíveis, e o maior número da folha costuma ser o errado.
- **Datas sem locale.** `03/04/2026` é um dia diferente dependendo do país que imprimiu. O recibo quase nunca esclarece qual.
- **O nome da loja que é uma razão social.** O cabeçalho traz a empresa registrada, não a marca que a pessoa reconhece. Não está errado, mas não é o que ela vai procurar depois.
- **Papel térmico já apagado.** Muitos recibos são escaneados semanas depois da compra, a partir de um papel que ficou na carteira. Há linhas que simplesmente sumiram.
- **Recibos com vários itens.** Um recibo, vários produtos, e só um merece acompanhamento de garantia. Isso é uma decisão, não uma extração.

Nenhuma dessas falhas se resolve com um prompt melhor, porque a última nem é um problema de extração: é a intenção do usuário. Só a pessoa sabe qual dos onze itens do cupom é a furadeira que importa.

## Como a tela de revisão é construída

O design vem da regra, não de uma biblioteca de padrões:

- **O recibo continua na tela.** A imagem escaneada acompanha os campos, para comparar em vez de confiar. Verificar sem o documento original é teatro.
- **Todos os campos são editáveis ali mesmo.** Sem modal, sem um segundo fluxo. Corrigir uma data lida errado precisa ser mais barato do que escanear de novo.
- **Os valores da IA parecem valores da IA.** A pessoa precisa saber o que veio do modelo e o que veio dela.
- **Só confirmar grava.** Não existe salvamento parcial pelas costas do usuário. Até a confirmação, nada existe no inventário.

O objetivo não é que a pessoa audite o recibo. É que um único olhar honesto seja suficiente. Se a tela de revisão for bem feita, confirmar vira reflexo e corrigir continua possível — e essa é toda a diferença entre um rastreador de garantias que funciona e um que mente.

[DATO: percentual de escaneamentos em que o usuário edita pelo menos um campo na tela de revisão — vale medir; se for perto de zero, a barreira está superdimensionada e deveria virar uma microconfirmação]

## Onde tiramos a barreira: CartWise

O mesmo estúdio publica a decisão oposta. No [gerador de listas com IA do CartWise](/pt/blog/ai-grocery-list-generator), a pessoa descreve uma ocasião e a IA escreve a lista completa. Não há tela de revisão. A lista aparece, já utilizável, dentro do carrinho.

Mesma empresa, mesmo instinto sobre IA, resultado oposto — porque a economia do erro se inverte. Um item errado numa lista de compras é visível no segundo em que aparece, fica ao lado de um botão de excluir, e não custa nada se sobreviver até o mercado. Não há custo diferido, então uma barreira de confirmação seria atrito puro, sem nada do outro lado da troca.

Isso é a regra funcionando bem. O padrão não é "sempre confirmar" nem "nunca confirmar". O padrão é: **a barreira pertence ao lugar onde o erro é caro e silencioso.**

## Para levar

- A etapa de confirmação se decide pelo custo e pelo atraso do erro, não pela confiança do modelo.
- Falhas silenciosas e adiadas são as que matam um aplicativo utilitário: destroem a única razão pela qual ele existe.
- Se a barreira ficar, ela precisa ser merecida: mostrar a fonte, permitir edição no lugar e fazer da confirmação um reflexo.
- Se o erro é imediato e barato de corrigir, a interface *é* a revisão. Não adicione uma tela para isso.

O scanner do [Claimly](/pt/apps/claimly-receipt-tracker) faz o trabalho de digitar. A decisão continua sendo da pessoa e, para uma função cujo único trabalho é estar certa sobre uma data daqui a seis meses, esse não é um atrito que valha a pena remover. A versão para usuários, com o scanner e o acompanhamento de garantias em conjunto, está no [anúncio do Claimly no Google Play](/pt/blog/claimly-agora-disponivel-google-play).

## Perguntas frequentes

### Uma função de preenchimento automático com IA deveria salvar sozinha?

Depende de quando o erro fica visível. Se a pessoa percebe o valor errado na hora e corrige com um toque, salvar automaticamente é aceitável. Se o erro fica escondido até custar alguma coisa — um prazo perdido, um pagamento errado —, mantenha a etapa de confirmação.

### O que é human-in-the-loop em um aplicativo móvel?

Significa que a IA propõe e a pessoa confirma. O modelo extrai ou gera os valores, a interface mostra tudo como rascunho, e nada é gravado até o usuário aprovar. A última decisão continua sendo humana.

### Qual é a precisão do escaneamento de recibos com IA?

Boa o suficiente para evitar quase toda a digitação, insuficiente para confiar de olhos fechados. As falhas recorrentes são estruturais: um total que na verdade é um subtotal, um formato de data ambíguo, um cabeçalho com a razão social em vez da marca, e papel térmico já apagado.

### Como mostrar quais campos a IA preencheu?

Marcando de forma visível os valores vindos do modelo, permitindo editar cada campo ali mesmo e nunca escondendo o documento original. No Claimly o recibo escaneado fica na tela ao lado dos campos, para comparar em vez de confiar.

### A etapa de confirmação não prejudica a conversão?

Ela adiciona uma tela, então custa algo. Esse custo só é aceito quando o erro é caro e silencioso. Para saídas de IA de baixo risco, como uma lista de compras gerada, não colocamos nenhuma barreira.
