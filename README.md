# Check Engine Club

## Sobre

Check Engine Clube é uma aplicação móvel desenvolvida para auto entusiastas, ajudando-os a avaliar se um carro usado é uma boa opção para compra ou não.

Se a sua garagem ainda não possui manchas de óleo o suficiente, você está com a vida tranquila e qier um pouco mais de emoção no seu dia-a-dia essa aplicação te ajudará a encontrar o seu novo carro velho!

O objetivo da aplicação fornecer ao usuário um espaço em que ele possa adicionar uma marca e modelo de veículo de interesse. E dentro desse escopo adicionar anúncios de venda de carros dessa marca/modelo de diferentes marketplaces para poder avaliar se o carro é uma boa opção para compra ou não.

### Features

**Autenticação do Usuário**
* Cadastro de novo usuário (e-mail/senha ou login social)
* Login / Logout
* Recuperação de senha

**Gerenciamento de Veículos de Interesse**
Adicionar um veículo de interesse informando:
* Marca (ex.: BMW, Honda, VW)
* Modelo
* Ano ou faixa de anos de interesse (opcional)
* Notas gerais sobre o modelo (ex.: "atenção ao VANOS", "problema comum de câmbio")
* Editar e Remover veículos de interesse
* Listar todos os veículos cadastrados pelo usuário

**Gerenciamento de Listagens de Carros**

Dentro de um veículo de interesse, o usuário pode adicionar anúncio de carro à venda, com dados como: Link do anúncio original (marketplace de origem: OLX, Webmotors, Mercado Livre, etc.)
* Marca / Modelo / Ano
* Quilometragem
* Preço pedido
* Localização
* Fotos
* Editar um anúncio salvo
* Remover um anúncio

**Avaliação / Classificação do Carro**
Permitir que o usuário avalie cada listagem com critérios como:
* Estado geral (bom, regular, ruim)
* Relação preço/valor de mercado
* Histórico de manutenção (se houver)
* Pontos positivos e negativos
* Gerar uma recomendação para cada anúncio (ex.: recomendado, atenção, evitar)
* Comparação entre anúncios do mesmo modelo

**Busca e Filtros**
* Buscar por veículos de interesse (marca/modelo)
* Dentro de um veículo, filtrar listagens por preço, km, nota
* Filtrar veículos por quantidade de listagens, melhor avaliação, etc.


**Dashboard - Tela Inicial**
Visão geral e ao abrir o app. Exibe um resumo com:
* Quantidade de anúncios salvas
* Anúncios adicionados recentemente
* Acesso rápido às principais ações (adicionar veículo de interesse, adicionar anúncio)



[//]: # (The Bavarian Lottery)
[//]: # (VanosCheck)
[//]: # (the one)
[//]: # (Ultimate Repair Machine)
[//]: # (Buy Now Cry Later)
[//]: # (VanosScore)

[//]: # (jokester
Here are a few:
	•	“BMW: The Ultimate Driving Machine… to the service center.”
	•	“That ‘drivetrain malfunction’ warning is just BMW’s way of asking whether you miss your mechanic.”
	•	“My BMW doesn’t have check-engine lights. It has subscription reminders for emotional resilience.”
	•	“A BMW drivetrain malfunction is like a German way of saying, ‘Today, you take ze Uber.’”
	- “BMW owners don’t read fault codes, they build relationships with them.”
    - Bavarian Money Waster.
    conforto, potência e 3 avisos no painel
     consumo de óleo e
	bonita até entrar em modo de emergência
)




**Possíveis futuras melhorias**

- adicionar a aplicação serviço que baseado na sua localização fornece informações sobre oficinas mecânicas, auto-peças ou serviços de guincho mais próximos.

## Tecnologias utilizadas

Planeja-se desenvolver o projeto utilizando as seguintes tecnologias:
- Expo Go
- RNE (React Native Elements)
- SQLite

Futuramente planeja-se user firebase para autenticar na aplicação

[//]: # (TODO descrever corretamente como executar em ambiente de desenvolvimento)
[//]: # (`git clone repo check-engine-club`)

[//]: # ()
[//]: # ()
[//]: # (`cd check-engine-club`)

[//]: # ()
[//]: # (`yarn install`)

[//]: # ()
[//]: # (`yarn start`)


## telas

[Telas no figma](https://www.figma.com/design/RhGM8UjKiJ6Ta1OzyLEKXo/Check-Engine-Club-Prototype?node-id=0-1&t=lNkGuw7ApXVvBWf1-1)


<img alt="Check Engine Club login screen" src="readme-figma-pictures/log%20in.png" title="Check Engine Club login screen" width="300"/>

<img alt="Check Engine Club" src="readme-figma-pictures/sign%20in.png" title="Check Engine Club sign in screen" width="301"/>

<br/>

<img alt="Check Engine Club dashboard screen" src="readme-figma-pictures/dash.png" title="Check Engine Club dashboard screen" width="300"/>

<img alt="Check Engine Club recent vehicle screen" src="readme-figma-pictures/recents2.png" title="Check Engine Club recent vehicle screen" width="300"/>

<br/>

<img alt="Check Engine Club add new listing screen" src="readme-figma-pictures/newListing.png" title="Check Engine Club add new listing screen" width="300"/>

<img alt="Check Engine Club user profile screen" src="readme-figma-pictures/profileManagement.png" title="Check Engine Club user profile screen" width="300"/>

<br/>

## modelagem do banco de dados

[Modelo de banco de dados](https://dbdiagram.io/d/check-engine-club-DBML-69d6ad7680896296844e7e42)

<img alt="Check engine club database model" height="900" src="readme-figma-pictures/check-engine-club-database-model.png" title="Check engine club database model"/>

Banco de dados SQLite implementado localmente. Posteriormente pode ser implementada autenticação com firebase alterando principalmente a tabela users do modelo de banco de dados.

Entidades do modelo: users, vehicles, listings e evaluations.

Na implementação com SQLite a relação de chave estrangeira implica em `ON DELETE CASCADE`. Removendo o usuário, todos os dados que o referenciam como foreign key também são deletados.

**relações 1:N**
- users -> vehicles
- vehicles -> listings

**relações 1:1**
listings -> evaluations

## sprints

- [x] **sprint 0** - 1 semana: estruturação inicial do projeto. Criar ambiente de desenvolvimento com Expo Go e expo router, criar migrations para o banco, configurar thema para React Native Elements;
- [ ] **sprint 1** - 2 semanas: autenticação e auth-guards **(parcial: UI de login + `useAuthStore` (Zustand) + auth-guard prontos; signup, recuperação de senha, persist middleware e hash de senha com `expo-crypto` ficam para o checkpoint 3)**;
- [ ] **sprint 2** - 1 semanas: implementação de CRUD para veículos de interesse; levantamento origem de dados para marketplaces de origem e também de marcas e modelos de carros **(parcial: tela de listagem + `useVehicleStore` (Zustand) com dados placeholder; CRUD real via repository + SQLite no checkpoint 3)**;
- [ ] **sprint 3** - 1 semanas: implementação tela de detalhes de anúncio de venda de carros;
- [ ] **sprint 4** - 1 semana: implementação de métricas de avaliação dos carros (anuncio: recomendado, atenção, evitar), estado de conservação (bom, regular, ruim); preço (acima da fipe, abaixo da fipe, na fipe) e badges para métricas;
- [ ] **sprint 5** - 2 semana: dashboard. Implementação funcionalidade de ações rápidas, cards para anúncios adicionados recentemente, melhores anúncios, estatísticas gerais **(parcial: layout pronto consumindo `useAuthStore` e `useVehicleStore`; cards de estatísticas reais e ações rápidas no checkpoint 3)**;
- [ ] **sprint 6** - 1 semana: busca e filtros;
- [ ] **sprint 7** - 1 semana: teste de usabilidade; listagem e correção de bugs;

**Tempo total estimado para desenvolvimento do projeto de aproximadamente 10 semanas.**

## Atualizações desde o último checkpoint

### Recursos de módulos anteriores aplicados

#### **Expo Router**
- usado em `app/_layout.tsx`, `app/(auth)/_layout.tsx`, `app/(tabs)/_layout.tsx` para navegação file-based;
- títulos de header configurados via `Stack.Screen options.title`.
- Auth-guard baseado em `useAuthStore.isAuthenticated` implementado no root layout via `<Redirect />`
- rota raiz `/` em `app/index.tsx` com `<Redirect />` para `(tabs)/dashboard` ou `(auth)/login` conforme o estado de autenticação.

#### **Zustand**
- `stores/useAuthStore.ts` gerencia `currentUser` e `isAuthenticated` com a action `login(email, senha)` (que executa o parse do Zod)
- `stores/useVehicleStore.ts` mantém a lista de veículos (ainda com placeholder neste checkpoint). Tela de login consome `useAuthStore`; a dasg consome ambos stores;
- `useVehicleStore` consumido pela lista de veículos;
- Padrão usado de um store por domínio;

#### **Zod**
- usado em `schemas/authSchema.ts` para validar e-mail e senha do formulário de login antes do submit. O parse acontece dentro da action `login` do store

#### **TypeScript strict mode**
- `tsconfig.json` com `"strict": true`;
- todos os componentes customizados têm tipos de Props explícitos (`VehicleCardProps`, `StatCardProps`, `AuthInputProps`).

#### **React Native Elements (`@rneui/themed`)**
- tema custom `constants/theme.ts` aplicado via `<ThemeProvider>` no root layout;
- `Button`, `Input` e demais primitivas consomem o tema.

#### **FlatList**
- usada nas telas de Veículos e Dashboard;

### Conceitos de "Boas práticas para a criação de componentes reutilizáveis" aplicados

- **Single Responsibility Principle** -
  - `VehicleCard` apresenta um veículo; `StatCard` apresenta uma métrica;
  - `AuthInput` apresenta um campo de entrada. Sem lógica de domínio acoplada.

- **Props como API limpa**
  - `VehicleCard` aceita  `{ vehicle, onPress }` ;
  - sem acesso direto a stores ou ao banco. Cada componente recebe o que precisa via props e devolve callback.

- **Composição**
  - Dashboard compõe `StatCard` + `VehicleCard`
  - Login compõe `AuthInput` × 2 + botão "Entrar" em vez de reimplementar inputs estilizados.

- **Type-safe props**
  - tipos TypeScript explícitos em `components/vehicles/VehicleCard.tsx`, `components/ui/StatCard.tsx`, `components/ui/AuthInput.tsx`. Sem `any`, sem props anônimos.

- **Componentes presentational stateless**
  - `VehicleCard`, `StatCard`, `AuthInput` recebem props, renderizam UI, emitem callbacks. Estado de domínio vive nos stores;
  - estado efêmero (texto digitado) vive nas telas.

- **Reutilização**
-  `VehicleCard` consumido em 2 telas (Dashboard e Lista de Veículos), justificando a colocação em `components/`. `StatCard` prevê uso futuro em outras telas.

### Demonstração

link do video demonstração checkpoint 2:

[tsi35a - projetos para dispositivos móveis - checkpoint 2](https://youtu.be/efZchVRKR38)

---

Projeto desenvolvido para disciplina TSI35A - Projetos de dispositivos Móveis da UTFPR - Guarapuava, Curso de Sistemas para internet.