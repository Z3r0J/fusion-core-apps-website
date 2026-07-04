---
title: "Política de Privacidade do CartWise"
updatedAt: "2026-06-26"
---

## Política de Privacidade do CartWise

**Última atualização:** 26 de junho de 2026

Obrigado por usar o **CartWise**, desenvolvido pela **FusionCore Apps** ("nós", "nosso", "nos").
Esta Política de Privacidade explica como tratamos suas informações quando você usa o CartWise — um app de listas de compras. O CartWise foi desenvolvido com a privacidade em mente: **não é exigido nem coletado nenhum nome, e-mail ou senha.** No entanto, para operar listas compartilhadas e gerenciar assinaturas, o app gera um **identificador de conta anônimo** aleatório (um ID de usuário anônimo por meio do nosso serviço de autenticação de backend, o Supabase) que não está vinculado à sua identidade pessoal. Esse identificador é processado conforme descrito abaixo.

---

## 1. Introdução

O CartWise é um app de listas de compras desenvolvido pela **FusionCore Apps**. Suas funções principais — criar listas, adicionar itens, organizar por categoria e acompanhar seu orçamento — funcionam totalmente offline e armazenam todos os dados localmente no seu dispositivo. Funções opcionais, como listas compartilhadas e notificações push, envolvem o processamento mínimo de dados no nosso backend, conforme descrito abaixo. Comprometemo-nos a coletar apenas o necessário para operar essas funções e nada mais.

---

## 2. Informações que Coletamos

### Dados Armazenados Apenas no Seu Dispositivo

Os dados a seguir são criados e armazenados exclusivamente no seu dispositivo (via SQLite e armazenamento local criptografado) e **nunca são transmitidos aos nossos servidores**:

- Suas listas de compras, itens, categorias e todo o conteúdo relacionado (quantidades, unidades, preços, notas, estado de marcação)
- Preferências do app: tema, fonte, idioma, configurações de notificação

### Dados de Listas Compartilhadas (Apenas ao Criar ou Entrar em uma Lista Compartilhada)

Se você optar por criar ou entrar em uma lista compartilhada, as informações a seguir são armazenadas no nosso backend (Supabase) para manter a lista sincronizada entre todos os membros:

- O conteúdo da lista e dos itens (nomes, quantidades, unidades, preços, notas, estado de marcação)
- Um **ID de membro anônimo gerado aleatoriamente** e um **avatar de emoji** atribuído a você — sem nome, e-mail ou identidade pessoal associada
- Um **identificador de conta anônimo** gerado pela autenticação do nosso backend (Supabase Auth) para identificar sua sessão de forma exclusiva sem vinculá-la a nenhuma identidade pessoal
- Seu **token de notificação push da Expo** (se você tiver as notificações ativadas), utilizado para alertá-lo sobre atividades na lista compartilhada

Nunca é solicitado que você forneça nome, endereço de e-mail ou qualquer informação de identificação para usar as listas compartilhadas.

### Dados de Notificações Push (Apenas se Você Optar por Receber)

Se você conceder permissão de notificações, armazenamos:

- Seu **token push da Expo** e o idioma do dispositivo (locale)
- Suas preferências de notificação: frequência, horário preferido de notificação, fuso horário e configurações de horário silencioso

Esses dados são usados exclusivamente para enviar alertas de atividade de listas compartilhadas, lembretes de listas e avisos de reengajamento aos quais você optou por receber. Seu token push é **removido automaticamente** do nosso sistema quando a entrega de notificações falha (o que geralmente indica que o app foi desinstalado) e é **excluído de forma lógica** quando você desativa as notificações no app.

### Entrada por Voz

Com permissão de microfone, o CartWise permite que você adicione itens por voz. A conversão de fala em texto é realizada **inteiramente no seu dispositivo** pelo mecanismo de fala nativo do sistema operacional. **Nenhum áudio é enviado para os servidores do CartWise** — apenas o texto reconhecido é usado para criar um item na lista.

### Câmera

A câmera é usada **apenas** para escanear códigos QR ao entrar em uma lista compartilhada. Nenhuma imagem é capturada, armazenada ou transmitida.

### Dados de Assinatura

Se você adquirir o **CartWise Pro**, a transação é processada pelo **RevenueCat** e pela **Google Play Store**. Esses serviços utilizam um ID de usuário anônimo e estável, além do status da sua compra/direito, para conceder acesso Pro. **Nunca recebemos nem armazenamos os dados do seu cartão de pagamento**.

### Endereço IP e Requisições ao Backend

Quando o app contata nosso backend (funções edge do Supabase) para sincronização de listas compartilhadas, registro de token push ou verificação de assinatura, nossos servidores podem processar de forma transitória o **endereço IP** do seu dispositivo para fins de segurança, prevenção de abuso e limitação de taxa (rate limiting). Esse endereço IP não é armazenado de forma permanente junto com os dados da sua lista e não é usado para publicidade. A infraestrutura do Supabase gerencia esse processamento; consulte a [Política de Privacidade do Supabase](https://supabase.com/privacy) para mais detalhes.

### Dados Publicitários (Apenas no Nível Gratuito)

A versão gratuita do CartWise pode exibir anúncios veiculados pelo **Google AdMob**. Com seu consentimento (coletado por meio de um aviso de consentimento do Google UMP), o AdMob pode coletar de forma independente:

- Identificadores de publicidade (p. ex., Android Advertising ID)
- Localização aproximada (para segmentação de anúncios por região)
- Sinais do dispositivo e de uso (p. ex., modelo do dispositivo, interação com anúncios)

Não controlamos o que o AdMob coleta diretamente; consulte suas políticas (veja a Seção 4).

### Análises e Dados de Falhas

O **Firebase Analytics** e o **Firebase Crashlytics** coletam dados limitados de uso e diagnóstico — que podem incluir identificadores de dispositivo e do app, bem como dados de eventos — para nos ajudar a entender quais funções são usadas e a corrigir falhas. Esses dados são coletados via Firebase Analytics e Crashlytics e não estão vinculados ao seu nome ou e-mail, mas podem incluir identificadores pseudônimos no nível do dispositivo conforme determinado pela plataforma Firebase do Google.

---

## 3. Como Usamos Suas Informações

Usamos os dados descritos acima apenas para:

- **Sincronizar listas compartilhadas** entre membros em tempo real
- **Enviar notificações push** às quais você optou por receber
- **Gerenciar os direitos Pro** e verificar o status da sua assinatura
- **Exibir anúncios** para usuários do nível gratuito (sujeito ao seu consentimento)
- **Melhorar a estabilidade e as funções do app** por meio de análises agregadas e relatórios de falhas

**Não** vendemos nem alugamos seus dados a terceiros.

---

## 4. Serviços de Terceiros com os Quais Compartilhamos Dados

Compartilhamos o mínimo de dados necessários com os seguintes provedores de serviços, exclusivamente para que possam desempenhar suas respectivas funções:

- **Supabase** — infraestrutura de backend para sincronização, armazenamento de listas compartilhadas e autenticação anônima. O Supabase também pode processar de forma transitória seu endereço IP para fins de segurança e limitação de taxa quando o app contata nossas funções edge. [Política de Privacidade do Supabase](https://supabase.com/privacy)
- **Expo Push Service e Firebase Cloud Messaging (FCM)** — infraestrutura de entrega de notificações. [Privacidade e Segurança do Firebase](https://firebase.google.com/support/privacy)
- **Google AdMob** — veiculação e medição de anúncios (apenas nível gratuito, com seu consentimento):
  - [Políticas do Programa Google AdMob](https://support.google.com/admob/answer/6128543)
  - [Política de Privacidade do Google](https://policies.google.com/privacy)
  - [Tecnologias de Publicidade do Google](https://policies.google.com/technologies/ads)
- **RevenueCat e Google Play Billing** — gerenciamento de assinaturas e verificação de direitos:
  - [Política de Privacidade do RevenueCat](https://www.revenuecat.com/privacy)
  - [Política de Privacidade do Google](https://policies.google.com/privacy)
- **Firebase Analytics e Crashlytics** — coleta de dados de uso e diagnóstico (pode incluir identificadores de dispositivo e do app). [Privacidade e Segurança do Firebase](https://firebase.google.com/support/privacy)

Esses provedores usam os dados **exclusivamente para prestar seus serviços**. Nenhum deles recebe dados para publicidade ou venda em nosso nome, e não vendemos seus dados a nenhuma parte.

---

## 5. Retenção e Exclusão de Dados

- Os **dados locais** (listas, itens, preferências) são removidos do seu dispositivo quando você desinstala o app.
- Os **tokens push** são removidos automaticamente do nosso sistema em caso de falha na entrega (geralmente na desinstalação) e são excluídos de forma lógica quando você desativa as notificações no app.
- Os **dados de listas compartilhadas** permanecem no nosso backend para manter a lista disponível para os outros membros. Se desejar que seus dados de listas compartilhadas sejam excluídos, entre em contato conosco (veja a Seção 11) e processaremos a solicitação de exclusão.

---

## 6. Segurança dos Dados

Protegemos seus dados por meio de:

- **Armazenamento criptografado no dispositivo** para listas e preferências locais
- **Criptografia em trânsito** (TLS) para todas as comunicações com nosso backend
- **Segurança em Nível de Linha (RLS) do Supabase** para garantir que apenas membros autorizados possam acessar uma lista compartilhada

Nenhum método de transmissão ou armazenamento é 100% seguro. Aplicamos salvaguardas razoáveis e notificaremos os usuários afetados sobre qualquer violação conforme exigido pela lei aplicável.

---

## 7. Seus Direitos e Opções

Você pode exercer os seguintes controles a qualquer momento:

- **Microfone e câmera**: Revogue essas permissões nas configurações do sistema do seu dispositivo.
- **Notificações**: Desative as notificações no app ou revogue a permissão de notificações nas configurações do sistema. Seu token push será removido do nosso sistema.
- **Personalização de anúncios**: Desative nas configurações de "Anúncios" / "Personalização de anúncios" do seu dispositivo e nas Configurações de Anúncios da sua conta Google.
- **Exclusão de dados**: Envie um e-mail para **support@fusioncoreapps.com** para solicitar a exclusão de quaisquer dados que mantemos (p. ex., dados de listas compartilhadas, tokens push).

Se você estiver localizado no **Espaço Econômico Europeu (EEE) ou no Reino Unido**, você também pode ter o direito de acessar, corrigir, contestar ou restringir o processamento de seus dados pessoais sob o RGPD ou o RGPD do Reino Unido. Se você for **residente da Califórnia**, poderá ter direitos adicionais sob a CCPA/CPRA, incluindo o direito de saber, excluir e optar por não participar da venda de informações pessoais (não vendemos informações pessoais). Entre em contato conosco para exercer qualquer um desses direitos.

---

## 8. Privacidade de Crianças

O CartWise é destinado a usuários com **13 anos ou mais**. Não coletamos conscientemente dados pessoais de crianças menores de 13 anos. Se você acredita que uma criança menor de 13 anos forneceu dados por meio do nosso app, entre em contato conosco e os excluiremos prontamente.

---

## 9. Transferências Internacionais de Dados

O CartWise é desenvolvido e operado globalmente. Os dados processados no nosso backend (Supabase) e pelos nossos provedores de serviços (Firebase, RevenueCat, AdMob) podem ser armazenados e processados em servidores localizados fora do seu país de residência. Ao usar o CartWise, você consente com essas transferências internacionais. Nos apoiamos nos frameworks de conformidade dos nossos provedores de serviços (incluindo Cláusulas Contratuais Padrão, quando aplicável) para garantir que as salvaguardas adequadas estejam em vigor.

---

## 10. Alterações nesta Política

Podemos atualizar esta Política de Privacidade periodicamente. Quando o fizermos, publicaremos a política revisada aqui com uma nova data de **Última atualização**. O uso continuado do CartWise após a publicação das alterações constitui aceitação da política revisada. Recomendamos que você revise esta página periodicamente.

---

## 11. Fale Conosco

Se tiver dúvidas, preocupações ou uma solicitação de exclusão de dados, entre em contato conosco:

**FusionCore Apps**
E-mail: **support@fusioncoreapps.com**
