# Projeto Multidisciplinar - Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS)

Sistema desenvolvido como projeto acadêmico multidisciplinar com ênfase em Frontend. Este sistema simula uma plataforma de gestão hospitalar, oferecendo funcionalidades como cadastro de pacientes, profissionais e instituições, agendamento de consultas, além de suporte à telemedicina.

## Índice

* [Sobre o Projeto](#sobre-o-projeto)
* [Caso de Estudo](#caso-de-estudo)
* [Funcionalidades](#funcionalidades)
* [Requisitos](#requisitos)
* [Protótipos](#protótipos)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Como Executar](#como-executar)
* [Autor](#autor)
* [Licença](#licença)

## Sobre o Projeto

Este projeto tem como objetivo integrar os conhecimentos adquiridos durante o curso, aplicando-os no desenvolvimento de uma solução teórica e prática para a área da saúde. O sistema pode ser entregue como protótipo, documentação ou código funcional, atendendo aos requisitos estabelecidos no estudo de caso.

## Caso de Estudo

A instituição fictícia VidaPlus administra hospitais, clínicas, laboratórios e equipes de atendimento domiciliar. A necessidade é de um Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS) capaz de centralizar as seguintes operações:

* Cadastro e atendimento de pacientes (consultas, exames, prontuários, telemedicina).
* Gestão de profissionais de saúde (médicos, enfermeiros, técnicos, agendas, prescrições).
* Administração hospitalar (gestão de leitos, relatórios financeiros, suprimentos).
* Atendimento por telemedicina (consultas online, prescrições, agendamentos).
* Segurança e conformidade com normas (LGPD, controle de acesso, auditorias).

## Funcionalidades

* Login de usuários.
* Cadastro de pacientes, médicos e instituições.
* Agendamento e cancelamento de consultas.
* Acesso a sessões de teleconsulta com chat de texto.
* Gerenciamento de agendas para profissionais.
* Atualização de prontuários médicos.
* Emissão de receitas digitais.
* Geração de relatórios administrativos.
* Controle de acesso baseado em perfis (paciente, profissional e administrador).
* (Em desenvolvimento) Suporte a videochamadas na telemedicina.

## Requisitos

### Funcionais (RF)

* **Pacientes:**

  * Cadastro de dados pessoais e clínicos.
  * Visualização de histórico clínico.
  * Agendamento e cancelamento de consultas.
  * Recebimento de notificações.
  * Acesso à teleconsulta.

* **Profissionais de Saúde:**

  * Gerenciamento de agenda.
  * Atualização de prontuários.
  * Emissão de receitas digitais.
  * Acompanhamento de histórico dos pacientes.

* **Administradores:**

  * Gerenciamento de cadastros (pacientes, profissionais, instituições).
  * Controle de internações.
  * Geração de relatórios administrativos e estatísticos.

* **Telemedicina:**

  * Realização de videochamadas seguras (em desenvolvimento).
  * Registro de prontuários durante ou após consultas.
  * Emissão de prescrições digitais.

### Não Funcionais (RNF)

* **Segurança:**

  * Criptografia de dados sensíveis.
  * Controle de acesso baseado em perfis.
  * Registro de logs para auditoria.
  * Conformidade com a LGPD.

* **Escalabilidade:**

  * Suporte a múltiplas unidades hospitalares simultaneamente.

* **Desempenho:**

  * Baixo tempo de resposta, especialmente para operações críticas.

* **Acessibilidade:**

  * Interface responsiva e aderente às normas internacionais de acessibilidade (W3C/WCAG).

* **Disponibilidade:**

  * Uptime mínimo de 99,5%.
  * Backup periódico e sistema robusto de geração de logs.

## Protótipos

* **Baixa fidelidade:**
  Validação rápida de fluxos e ideias.
  ![Protótipo de baixa fidelidade](./image/prototipo_baixa_fidelidade.png)

* **Média/Alta fidelidade:**
  Representação mais próxima do produto final.
  [Acessar no Figma](https://www.figma.com/design/XiryicMrJK9n9ubcwu09lS/Untitled?node-id=50-2&t=OYdr396MsLzCelwq-1)
  ![Protótipo de média/alta fidelidade](./image/prototipo_media_alta_fidelidade.png)

## Tecnologias Utilizadas

### Frontend

* React
* Material UI
* React Router DOM
* Cleave.js
* Tailwind CSS
* Axios

### Backend

* Express.js
* bcrypt
* dotenv
* PostgreSQL (pg)
* express-session
* passport e passport-local
* multer
* path
* fs
* socket.io

### Banco de Dados

* PostgreSQL

## Como Executar

> **Observação:** O sistema atualmente funciona apenas localmente.

1. Clone o repositório:

```bash
git clone https://github.com/Kiy0p0N/projeto-multidisciplinar-frontend.git
```

2. Instale as dependências no frontend e backend:

```bash
cd frontend
npm install
cd ../backend
npm install
```

3. Configure as variáveis de ambiente no backend (`.env`).

4. Rode o backend:

```bash
npm run dev
```

5. Rode o frontend:

```bash
npm run dev
```

6. Acesse via navegador:

```
http://localhost:5173
```

## Autor

Desenvolvido por **Felipe Cesar Rodrigues**.
Projeto acadêmico multidisciplinar com ênfase em Frontend – 2025.

* [LinkedIn](https://www.linkedin.com/in/felipe-cesar-rodrigues/)
* [GitHub](https://github.com/Kiy0p0N)

## Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).
