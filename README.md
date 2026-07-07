# Check Engine Club

## Sobre

Check Engine Clube é uma aplicação móvel desenvolvida para auto entusiastas, ajudando-os a avaliar se um carro usado é uma boa opção para compra ou não.

Se a sua garagem ainda não possui manchas de óleo o suficiente, você está com a vida tranquila e qier um pouco mais de emoção no seu dia-a-dia essa aplicação te ajudará a encontrar o seu novo carro velho!

O objetivo da aplicação fornecer ao usuário um espaço em que ele possa adicionar uma marca e modelo de veículo de interesse. E dentro desse escopo adicionar anúncios de venda de carros dessa marca/modelo de diferentes marketplaces para poder avaliar se o carro é uma boa opção para compra ou não.

### Features

**Autenticação do Usuário**
* Cadastro de novo usuário (e-mail/senha)
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

O projeto é desenvolvido com as seguintes tecnologias:
- Expo Go
- Expo Router (navegação file-based)
- React Native Elements (`@rneui/themed`) + NativeWind (estilização)
- Zustand (gerência de estado, um store por domínio)
- Zod (validação nas bordas)
- Firebase Authentication (autenticação: cadastro, login, logout, recuperação de senha)
- SQLite via `expo-sqlite` (persistência local dos dados do app)

A autenticação roda no Firebase para fins de cadastrod e usuário; os dados de veículos, anúncios e avaliações ficam offline no SQLite local.

## Como executar localmente (Expo Go)

Pré-requisitos: Node.js LTS, Yarn e um simulador iOS / emulador Android — ou o app **Expo Go** em um dispositivo físico.

```bash
git clone git@github.com:VitorThorvi/tsi35a-projetos-dispositivos-moveis.git check-engine-club
cd check-engine-club
yarn install
cp .env.example .env
yarn start
```

Antes de iniciar, preencha o `.env` com as credenciais do seu projeto Firebase. As chaves ficam **somente** no `.env` (ignorado pelo git); o `.env.example` lista as variáveis `EXPO_PUBLIC_FIREBASE_*` necessárias. Sem elas o app falha ao abrir com `auth/invalid-api-key`.

Com o servidor iniciado, pressione `i` para abrir no simulador iOS (ou use `yarn ios` direto), `a` para o emulador Android, ou leia o QR code com o Expo Go no celular.

### Build local do APK (EAS)

O build local do Android exige **JDK 17** — o Gradle do Expo SDK 54 não roda em JDKs mais novos (falha com `Unsupported class file major version`). No macOS:

```bash
JAVA_HOME=$(/usr/libexec/java_home -v 17) npx eas build -p android --profile preview --local
```

Em outros sistemas, aponte `JAVA_HOME` para uma instalação do JDK 17. Na primeira execução o EAS CLI pede login em uma conta Expo e vincula o repositório a um projeto EAS próprio. O arquivo `.easignore` garante que o `.env` (ignorado pelo git) entre no pacote do build, para que as variáveis `EXPO_PUBLIC_FIREBASE_*` sejam embutidas no bundle.


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

A persistência dos dados do app é feita localmente em **SQLite** (`expo-sqlite`); a autenticação é feita pelo **Firebase Authentication**.

O diagrama acima representa a **modelagem prevista**. Na implementação para o checkpoint 3 foram feitos ajustes de redução de escopo:

- A identidade do usuário passou a ser gerenciada pelo Firebase — **não há tabela `users` local**. Cada veículo guarda o UID do Firebase em `vehicles.user_id` (sem chave estrangeira; o escopo por usuário é feito por filtro `WHERE user_id = <uid>`).
- Entidades persistidas no SQLite: **vehicles, listings e evaluations**.
- A cascata `ON DELETE CASCADE` passou a valer de **vehicles → listings → evaluations**: ao remover um veículo, seus anúncios e avaliações também são removidos.

**relações 1:N**
- vehicles -> listings

**relações 1:1**
- listings -> evaluations

## sprints

> **Revisão de escopo (pós-checkpoint 2).** O planejamento foi revisado para priorizar um **MVP funcional**: a funcionalidade central foi mantida (autenticar → cadastrar veículo de interesse → adicionar anúncios → avaliar e pontuar → comparar → dashboard). Funcionalidades não essenciais foram movidas para "Fora do escopo do MVP".

- [x] **sprint 0** — estruturação inicial do projeto (Expo Go + Expo Router + tema RNE + estrutura de pastas). **(concluída)**
- [ ] **sprint 1** *(parcial)* — autenticação e auth-guard: UI de login + `useAuthStore` (Zustand) + auth-guard via `<Redirect />` prontos. **Restante (CP3):** migrar para **Firebase Authentication** (SDK JS, compatível com Expo Go) — cadastro, login, logout, recuperação de senha por e-mail e persistência de sessão.
- [ ] **sprint 2** — fundação de dados local (**SQLite**): instalar `expo-sqlite`; client com PRAGMAs (`journal_mode=WAL`, `foreign_keys=ON`); `migrations.ts` + tabela `schema_version`; padrão *repository* em `database/repositories/`. Modelo ajustado ao Firebase: sem tabela `users` local; `vehicles.user_id` guarda o UID do Firebase.
- [ ] **sprint 3** — CRUD real de veículos de interesse: conectar `useVehicleStore` ao `vehicleRepository`; adicionar/editar/remover/listar com formulário validado por Zod; substituir os dados placeholder.
- [ ] **sprint 4** — CRUD de anúncios (listings): lista de anúncios por veículo, tela de detalhes e formulário (marketplace, link, ano, km, preço, localização, fotos via `expo-image-picker`); validação Zod.
- [ ] **sprint 5** — avaliação e pontuação: formulário de avaliação (estado geral, preço vs. mercado, histórico de manutenção — notas 1–5), `score` calculado (`utils/scoreCalculator.ts`), badge de recomendação (recomendado / atenção / evitar), pontos positivos/negativos e comparação de anúncios por score.
- [ ] **sprint 6** *(parcial)* — dashboard + busca + NativeWind: layout do dashboard pronto consumindo os stores. **Restante (CP3):** estatísticas reais a partir do SQLite + ações rápidas; busca simples de veículos (marca/modelo); estilização das novas telas com **NativeWind** (módulo 07).
- [ ] **sprint 7** — entrega do checkpoint 3: revisão das validações (dado inválido → erro → correção); **build do APK com EAS** + publicação como *Release* no GitHub; teste de usabilidade e correção de bugs; vídeo de defesa (≤ 7 min) e card de destaques.

**Fora do escopo do MVP (reduções e follow-ups conscientes):**
- Login social (Google/Apple) — complexidade de OAuth no Expo Go.
- Mapa da localização do anúncio com **OpenStreetMap/Expo-Leaflet** (módulo 12).
- Filtros multi-critério e ordenações avançadas.
- Serviço de oficinas/auto-peças/guincho próximos por localização (visão futura).

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