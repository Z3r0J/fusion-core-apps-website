---
title: "12 testadores no Google Play: como passamos no teste fechado"
description: "O Google Play exige 12 testadores por 14 dias para liberar a produção. Como conseguimos com o Claimly e por que comprar testadores é um risco real."
app: Claimly
category: Growth
translationKey: "google-play-12-testers-requirement"
publishedAt: "2026-07-13"
author: "FusionCore Apps"
tags: ["google play", "teste fechado", "aso", "lançamento", "android", "growth"]
ogImage: "/images/blog/pt/google-play-12-testers-requirement.png"
featured: false
faq:
  - question: "Quantos testadores o Google Play exige?"
    answer: "Pelo menos 12 testadores precisam entrar em um teste fechado e permanecer nele de forma contínua por 14 dias antes de você poder solicitar o acesso à produção. A exigência original era de 20 testadores e o Google reduziu para 12 em 11 de dezembro de 2024."
  - question: "Para quem vale a exigência dos 12 testadores?"
    answer: "Apenas para contas de desenvolvedor pessoais criadas depois de 13 de novembro de 2023. Contas de organização estão isentas, e contas pessoais anteriores a essa data também não estão sujeitas à regra."
  - question: "O teste interno conta para os 14 dias?"
    answer: "Não. A exigência é especificamente de um teste fechado. Um canal de internal testing não cumpre o requisito, e esse é o mal-entendido mais caro sobre o assunto."
  - question: "Dá para comprar 12 testadores e passar mais rápido?"
    answer: "Existem serviços que vendem testadores, mas o risco é real. O Google espera atividade de teste genuína e contínua, e pagar por contas que só existem para mover um contador coloca a conta de desenvolvedor em jogo para economizar duas semanas."
  - question: "O que acontece se um testador sair durante os 14 dias?"
    answer: "Cair abaixo de 12 testadores ativos interrompe a janela contínua. Por isso vale recrutar uma margem acima de 12, e não exatamente 12."
---

Se a conta de desenvolvedor pessoal foi criada depois de 13 de novembro de 2023, não dá para publicar em produção sem antes rodar um **teste fechado com pelo menos 12 testadores que permaneçam ativos por 14 dias contínuos**. Essa é a regra inteira. Não é sugestão, não existe recurso, e ela vale antes de o app chegar a um único usuário real.

Passamos por isso com o [Claimly](/pt/apps/claimly-receipt-tracker), nosso rastreador de garantias e recibos. Este é o retrato do requisito por dentro, o que erramos, e por que a primeira página de resultados de busca sobre o tema está tentando te vender algo que você não deveria comprar.

## O que o Google exige exatamente

O formato preciso da regra importa, porque quase toda a dor vem de ler errado alguma destas cláusulas:

- **12 testadores, não 12 instalações.** Eles precisam *entrar* (opt-in) no teste fechado. Adicionar 12 e-mails no Play Console não faz nada sozinho.
- **14 dias contínuos.** A janela é consecutiva. Se o número de testadores ativos cair abaixo de 12 no meio do caminho, não fica guardado nenhum progresso parcial.
- **Teste fechado, especificamente.** Um canal de internal testing não conta. Esse é o mal-entendido mais caro, porque dá para queimar duas semanas no canal errado e terminar sem nada.
- **Contas pessoais criadas depois de 13 de novembro de 2023.** Contas de organização estão isentas.
- **Antes eram 20.** O Google reduziu para 12 em 11 de dezembro de 2024, depois que desenvolvedores pequenos apontaram que 20 era brutal para quem não tem audiência.

A exigência existe por um motivo defensável: o Play estava afundando em apps de baixo esforço e francamente fraudulentos, publicados por contas descartáveis. Fazer um lançamento custar duas semanas e doze humanos reais é um filtro barato contra isso. Saber que é defensável não deixa a coisa menos incômoda quando é você quem precisa arrumar doze humanos.

## Como fizemos com o Claimly

Não tínhamos lista de e-mails, nem Discord, nem audiência. Tínhamos um grupo do Google, um post de blog e uma thread no Reddit que acabou fazendo quase todo o trabalho de verdade.

O mecanismo é simples: o teste fechado permite gerenciar testadores por meio de um grupo do Google, então qualquer pessoa que entre no grupo vira testador aprovado sem que você precise cadastrar o e-mail dela na mão no Play Console. Criamos o `fusionapps-tester` como grupo público e escrevemos o anúncio do beta do Claimly: um post que explicava o que o app fazia, por que existia, e dava três passos literais para entrar.

O funil, na prática, foi assim: **14 testadores fizeram opt-in**, com folga acima dos 12 exigidos. Cinco eram amigos e familiares. A maioria do restante veio de um único post no Reddit.

Essa divisão é a lição útil, e não é a que esperávamos. O post do blog era necessário, mas não suficiente. Ele é o *destino*: a explicação canônica, os três passos, o link do grupo, o lugar para onde você manda as pessoas. Não é o que *alcança* ninguém. Ninguém acha um anúncio de beta pesquisando por ele, porque no dia um esse post não tem audiência — e o dia um é exatamente quando você precisa de doze humanos. O Reddit já tinha a audiência. O post era a landing; o Reddit era a distribuição.

**O contador de 14 dias nunca reiniciou e conseguimos o acesso à produção logo na primeira solicitação.** Catorze testadores ativos, catorze dias contínuos, sem nunca cair abaixo do mínimo. A margem de dois testadores acima do limite explica boa parte dessa frase.

O anúncio do beta do Claimly saiu em **31 de março de 2026**. O app [chegou à produção no Google Play](/pt/blog/claimly-agora-disponivel-google-play) em **17 de abril de 2026**: cerca de dezessete dias depois, mais ou menos o piso teórico de catorze dias somado à revisão. Esse calendário só fecha se os testadores já estiverem prontos no dia um.

Compare tudo isso com pagar um serviço: você gasta dinheiro, recebe doze contas e, no fim, não é dono de nada. Nem thread, nem post, nem testadores que se importavam com o app.

## Por que os resultados de busca sobre isso são um campo minado

Basta pesquisar a exigência dos 12 testadores e contar quantos dos primeiros resultados estão vendendo testadores. Quase todos. Existe uma indústria inteira — fazendas de testadores pagos, "passe no teste fechado em 14 dias por 15 dólares" — construída em cima de desenvolvedores que querem pular essa etapa.

Não usamos nenhum, e recomendamos não usar, por um motivo que não tem nada a ver com pureza:

**O risco é assimétrico.** O que se ganha comprando testadores são duas semanas. O que se arrisca é a conta de desenvolvedor, da qual depende todo app que você publicar daqui para a frente. O Google procura explicitamente atividade de teste genuína nessa janela, e um punhado de contas que entram, não fazem nada reconhecivelmente humano e existem só para mover um contador é exatamente o padrão que a política foi escrita para pegar. Trocar uma conta difícil de repor por catorze dias que ninguém vai lembrar é um péssimo negócio.

Há ainda um custo mais silencioso. Um teste fechado de verdade informa coisas. O nosso revelou bugs concretos, de gente usando o app em aparelhos que não tínhamos e em condições que não prevíamos. Doze contas movendo um contador não informam nada: você paga para pular a única coisa que o processo dá de graça.

## O relógio de 14 dias é mais frágil do que parece

O modo de falha que ninguém avisa não é deixar de chegar a doze. É chegar a doze e depois perder um.

A janela exige participação *contínua*, então um testador que entra, se entedia e desinstala na segunda semana pode interromper a sequência acumulada. E isso não se controla: são voluntários fazendo um favor.

A mitigação não é glamourosa: **recrutar uma margem**. Vale mirar bem acima de doze para que a evasão normal não derrube o teste abaixo do mínimo. Recrutar exatamente doze é desenhar um processo com tolerância zero a uma única pessoa perdendo o interesse.

## O que faríamos diferente

- **Começar a recrutar antes de o build ficar pronto.** O relógio de duas semanas não começa quando o app está terminado: começa quando doze pessoas fizeram opt-in. São datas diferentes, e o vão entre elas é tempo morto que se elimina recrutando em paralelo com a última sprint.
- **Ir onde a audiência já está, desde o dia um.** Nosso post era o destino; o Reddit era a distribuição. Escrevemos o post primeiro e fomos atrás da audiência depois, o que é a ordem invertida. As comunidades existem tendo você seguidores ou não: é para isso que elas servem.
- **Tratar como ensaio do lançamento, não como imposto.** A ficha da loja, as capturas, a descrição: tudo isso precisa existir para o teste fechado de qualquer jeito. Dá para fazer de má vontade no último dia ou usar as duas semanas para fazer direito.

## Perguntas frequentes

**Quantos testadores o Google Play exige?**
Pelo menos 12 testadores precisam entrar em um teste fechado e permanecer nele de forma contínua por 14 dias antes de você poder solicitar o acesso à produção. A exigência original era de 20 testadores e o Google reduziu para 12 em 11 de dezembro de 2024.

**Para quem vale a exigência dos 12 testadores?**
Apenas para contas de desenvolvedor pessoais criadas depois de 13 de novembro de 2023. Contas de organização estão isentas, e contas pessoais anteriores a essa data também não estão sujeitas à regra.

**O teste interno conta para os 14 dias?**
Não. A exigência é especificamente de um teste fechado. Um canal de internal testing não cumpre o requisito, e esse é o mal-entendido mais caro sobre o assunto.

**Dá para comprar 12 testadores e passar mais rápido?**
Existem serviços que vendem testadores, mas o risco é real. O Google espera atividade de teste genuína e contínua, e pagar por contas que só existem para mover um contador coloca a conta de desenvolvedor em jogo para economizar duas semanas.

**O que acontece se um testador sair durante os 14 dias?**
Cair abaixo de 12 testadores ativos interrompe a janela contínua. Por isso vale recrutar uma margem acima de 12, e não exatamente 12.

### Takeaways

- A exigência é de 12 testadores ativos por 14 dias *contínuos*, em um canal *fechado*, para contas pessoais criadas depois de 13 de novembro de 2023. Cada uma dessas palavras carrega peso.
- O relógio começa quando existem doze testadores, não quando o app fica pronto. É preciso recrutar em paralelo com o desenvolvimento, ou você soma duas semanas ao lançamento sem motivo nenhum.
- Recrute uma margem acima de doze. "Contínuo" significa que um único voluntário entediado pode custar a sequência. Rodamos com catorze, nunca caímos abaixo do mínimo e passamos na primeira solicitação.
- O post do blog é o destino, não a distribuição. O nosso converteu porque uma thread no Reddit mandou gente para lá: o anúncio não tinha audiência própria no dia em que precisávamos dela.
- As fazendas de testadores que oferecem o atalho estão pedindo que você arrisque a conta de desenvolvedor para economizar catorze dias. Doze testadores reais se conseguem sem pagar ninguém: os nossos foram catorze, cinco deles amigos e familiares, e o resto veio de um post em uma comunidade que já existia.
