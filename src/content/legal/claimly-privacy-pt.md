---
title: "Política de Privacidade do Claimly"
updatedAt: "2026-11-14"
---

## Política de Privacidade do Claimly

**Última atualização:** 14 de novembro de 2026

Obrigado por usar o **Claimly**, desenvolvido pela **FusionCore Apps** ("nós", "nosso", "nos").
Esta Política de Privacidade explica como tratamos suas informações quando você usa o Claimly — um app Android (pacote `com.fusioncoreapps.claimly`) para controlar garantias e recibos. **O Claimly não tem contas de usuário: nunca pedimos seu nome, e-mail ou senha.** Seus produtos, garantias e recibos ficam armazenados no seu dispositivo, não em nossos servidores.

---

## 1. O que Fica no Seu Dispositivo

Os dados a seguir são criados e armazenados **apenas no seu dispositivo** (no banco de dados local e no armazenamento do app). Não recebemos nenhuma cópia:

- Seus produtos, garantias, categorias, notas, preços e datas de compra
- As fotos de recibos e os anexos que você adiciona (fotos e documentos)
- As configurações do app (tema, moeda, preferências de lembretes)

**Backups:** o Claimly permite exportar um backup como um **arquivo .zip** local. Você o cria e decide onde salvá-lo ou compartilhá-lo. Nunca recebemos seus arquivos de backup. Se você salvar um em um serviço de nuvem ou enviá-lo a alguém, valem os termos desse serviço ou dessa pessoa.

---

## 2. Escaneamento de Recibos (OCR): O que é Enviado e por Quanto Tempo é Mantido

O escaneamento de recibos é **opcional** — você sempre pode cadastrar produtos manualmente. Somente quando você escaneia um recibo:

1. Uma cópia reduzida da foto (um JPEG de cerca de 800 pixels) e os nomes das suas categorias são enviados por uma conexão criptografada (**HTTPS**) para o nosso próprio endpoint de API, hospedado na **Expo (EAS Hosting)**.
2. Nosso endpoint os encaminha à **OpenAI** (API, modelo `gpt-4.1-mini`) para extrair a loja, a data, o produto e o preço, e sugerir uma categoria.
3. Os campos extraídos voltam ao seu dispositivo, onde você os revisa e edita antes de salvar.

Por quanto tempo é mantido:

- **Nosso servidor não armazena a imagem.** Ele apenas repassa a solicitação à OpenAI e devolve o resultado ao seu dispositivo.
- A **OpenAI** atua como nossa prestadora de serviços (operadora). De acordo com a política de dados da API da OpenAI, ela **não usa os dados da API para treinar seus modelos** e pode reter as entradas por até **30 dias** para monitoramento de abusos; depois, elas são excluídas.
- A foto do recibo que você mantém no app permanece no seu dispositivo (veja a Seção 1).

Tudo o que está impresso no recibo faz parte da foto enviada, então ela pode incluir outros dados que aparecem nele (por exemplo, um número de programa de fidelidade da loja). Apenas a loja, a data, o produto e o preço são extraídos.

---

## 3. Compras (Claimly Premium)

As compras são processadas pelo **Google Play** e pela **RevenueCat**. A RevenueCat recebe um ID de usuário anônimo do app, seu histórico de compras e o status da sua assinatura para liberar o Premium no seu dispositivo. **Os pagamentos são tratados pelo Google Play — nunca vemos nem armazenamos os dados do seu cartão.**

---

## 4. Dados Publicitários (Apenas no Nível Gratuito)

A versão gratuita do Claimly exibe anúncios do **Google AdMob**. Usuários Premium não veem anúncios. O AdMob pode coletar:

- Identificadores do dispositivo e de publicidade (por exemplo, o ID de publicidade do Android)
- Localização aproximada derivada do seu endereço IP
- Interações com o app (incluindo interações com anúncios) e diagnósticos

Esses dados são compartilhados com o **Google** para fins de publicidade, análise e prevenção de fraudes.

- Quando exigido por lei (por exemplo, no Espaço Econômico Europeu, no Reino Unido ou na Suíça), você verá um formulário de consentimento do Google (UMP) antes que anúncios personalizados sejam exibidos.
- Você pode redefinir ou excluir seu ID de publicidade, ou desativar os anúncios personalizados, nas configurações do Android (em Google > Anúncios, ou Privacidade > Anúncios, dependendo do dispositivo).
- Nunca enviamos seus produtos, garantias ou recibos para redes de anúncios.

Mais informações: [Como o Google usa informações de sites ou apps que utilizam nossos serviços](https://policies.google.com/technologies/partner-sites).

---

## 5. Análises e Relatórios de Falhas

- O **Firebase Analytics (Google)** coleta eventos de interação com o app (por exemplo, quais telas e funções são usadas), informações do dispositivo (como modelo, versão do sistema operacional e um identificador de instância do app) e eventos de compra (como `in_app_purchase`). Usamos isso para entender como o app é usado e melhorá-lo.
- O **Sentry** coleta registros de falhas e diagnósticos (detalhes do erro, informações do dispositivo e do sistema operacional, versão do app e dados de desempenho) para encontrarmos e corrigirmos bugs.

Esses dados não estão vinculados ao seu nome nem ao seu e-mail — o Claimly não os coleta.

---

## 6. Notificações

Os lembretes de vencimento de garantias são **notificações locais**, agendadas no seu dispositivo. O Claimly não usa notificações push: **nenhum token push é criado ou enviado a qualquer servidor**, e seus dados de garantias não são enviados a lugar nenhum para agendar os lembretes.

---

## 7. Permissões do App

- **Câmera** — apenas para tirar fotos de recibos e produtos.
- **Notificações** — para exibir os lembretes de vencimento de garantias. O Claimly também usa as permissões de alarmes e de "executar na inicialização" do Android apenas para entregar esses lembretes no horário certo e reagendá-los quando o dispositivo é reiniciado.
- **Fotos e arquivos** — o Claimly usa os seletores de fotos e de arquivos do Android, então só acessa as fotos ou documentos específicos que você escolher anexar.

O Claimly **não** solicita acesso ao seu microfone, localização ou contatos.

---

## 8. Como Usamos Suas Informações

Usamos os dados descritos acima apenas para:

- **Extrair os dados do recibo** quando você escolhe escanear um
- **Liberar e verificar** as compras do Premium
- **Exibir anúncios** para usuários do nível gratuito (sujeito ao seu consentimento quando exigido)
- **Entender o uso do app e corrigir falhas** por meio de análises e relatórios de falhas

**Não** vendemos nem alugamos seus dados a terceiros.

---

## 9. Serviços de Terceiros com os Quais Compartilhamos Dados

Compartilhamos apenas os dados de que cada serviço precisa para fazer seu trabalho:

- **Expo (EAS Hosting)** — hospeda nosso endpoint de API de escaneamento de recibos. [Política de Privacidade da Expo](https://expo.dev/privacy)
- **OpenAI** — extrai os dados dos recibos escaneados (API). [Política de Privacidade da OpenAI](https://openai.com/policies/privacy-policy/) · [Uso de dados da API da OpenAI](https://platform.openai.com/docs/guides/your-data)
- **Google AdMob** — anúncios para usuários do nível gratuito:
  - [Política de Privacidade do Google](https://policies.google.com/privacy)
  - [Tecnologias de Publicidade do Google](https://policies.google.com/technologies/ads)
  - [Políticas do Programa Google AdMob](https://support.google.com/admob/answer/6128543)
- **Firebase Analytics (Google)** — análises do app. [Privacidade e Segurança do Firebase](https://firebase.google.com/support/privacy)
- **RevenueCat e Google Play Billing** — compras e status da assinatura:
  - [Política de Privacidade da RevenueCat](https://www.revenuecat.com/privacy)
  - [Política de Privacidade do Google](https://policies.google.com/privacy)
- **Sentry** — relatórios de falhas e diagnósticos. [Política de Privacidade do Sentry](https://sentry.io/privacy/)

Também podemos divulgar informações se exigido por lei (por exemplo, intimação, ordem judicial).

---

## 10. Retenção e Exclusão de Dados

- **Dados no seu dispositivo**: exclua qualquer produto no app para removê-lo junto com suas garantias, fotos de recibos e anexos. Para apagar tudo de uma vez, limpe os dados do app (Configurações do Android > Apps > Claimly > Armazenamento > Limpar dados) ou desinstale o Claimly. Os arquivos .zip de backup que você exportou não são excluídos automaticamente — apague-os onde você os salvou.
- **Escaneamentos de recibos**: nosso servidor não guarda nenhuma cópia da imagem. As entradas enviadas à OpenAI são excluídas automaticamente em até **30 dias**.
- **Dados de análise, falhas e assinatura** mantidos por nossos prestadores de serviços (Firebase, Sentry, RevenueCat): envie um e-mail para **support@fusioncoreapps.com** solicitando a exclusão. Como o Claimly não tem contas, inclua as datas aproximadas em que você usou o app e, se comprou o Premium, o ID do pedido do Google Play para que possamos localizar seus registros. Processaremos sua solicitação em até **30 dias**. Registros de compra que o Google e a RevenueCat precisam manter por obrigações legais e contábeis podem ser retidos.
- **ID de publicidade**: você pode redefini-lo ou excluí-lo a qualquer momento nas configurações do Android (veja a Seção 4).

---

## 11. Segurança dos Dados

- Toda a comunicação entre o app, nosso servidor e nossos prestadores de serviços é **criptografada em trânsito** (HTTPS/TLS).
- Seus produtos, garantias e recibos permanecem no seu dispositivo, protegidos pelas configurações de segurança do seu dispositivo.

Nenhum método de transmissão ou armazenamento é 100% seguro. Aplicamos salvaguardas razoáveis e notificaremos os usuários afetados sobre qualquer violação conforme exigido pela legislação aplicável.

---

## 12. Seus Direitos e Opções

- **Câmera e Notificações**: revogue essas permissões a qualquer momento nas configurações do sistema do seu dispositivo.
- **Escaneamento de recibos**: você pode pular o escaneamento e cadastrar produtos manualmente.
- **Personalização de anúncios**: desative-a ou redefina seu ID de publicidade nas configurações do Android e nas Configurações de Anúncios da sua conta Google.
- **Exclusão de dados**: veja a Seção 10.

### Direitos sob a LGPD (usuários brasileiros)

Se você está no Brasil, a **Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)** garante direitos sobre seus dados pessoais, incluindo: acesso, correção, exclusão, portabilidade, informação sobre compartilhamento e revogação do consentimento. Para exercer qualquer um desses direitos, entre em contato pelo e-mail **support@fusioncoreapps.com**.

Se você estiver localizado no **Espaço Econômico Europeu (EEE) ou no Reino Unido**, também pode ter o direito de acessar, corrigir, contestar ou restringir o processamento de seus dados pessoais sob o RGPD ou o RGPD do Reino Unido. Se você for **residente da Califórnia**, poderá ter direitos adicionais sob a CCPA/CPRA, incluindo o direito de saber, excluir e optar por não participar da venda de informações pessoais (não vendemos informações pessoais). Entre em contato conosco para exercer qualquer um desses direitos.

---

## 13. Privacidade de Crianças

O Claimly **não é direcionado a crianças menores de 13 anos**, e não coletamos conscientemente dados pessoais delas. Se você acredita que uma criança menor de 13 anos forneceu dados por meio do nosso app, entre em contato conosco e os excluiremos prontamente.

---

## 14. Transferências Internacionais de Dados

Nossos prestadores de serviços (Expo, OpenAI, Google, RevenueCat e Sentry) podem armazenar e processar dados em servidores localizados fora do seu país de residência. Contamos com os mecanismos de conformidade deles (incluindo Cláusulas Contratuais Padrão, quando aplicável) para garantir salvaguardas adequadas.

---

## 15. Alterações nesta Política

Podemos atualizar esta Política de Privacidade periodicamente. Quando isso acontecer, publicaremos aqui a versão revisada com uma nova data de **Última atualização**. O uso continuado do Claimly após a publicação das alterações constitui aceitação da política revisada. **Data de vigência: 14 de novembro de 2026.**

---

## 16. Fale Conosco

Se você tiver dúvidas, preocupações ou uma solicitação de exclusão de dados, entre em contato conosco:

**FusionCore Apps**
E-mail: **support@fusioncoreapps.com**
