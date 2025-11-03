# PLATAFORMA WEB — ONG *(Projeto KOLENU)*

**Desenvolvido por:** Jayme Sanches Filho  
**Instituição:** Universidade Cruzeiro do Sul  
**Disciplina:** Desenvolvimento Front-End para Web  
*Experiência prática*  
**Data:** 03/11/2025  

## DESCRIÇÃO
Projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Front-end para Web.  
Plataforma web completa que permite gerenciamento de atividades, divulgação de iniciativas, captação de recursos e cadastro de voluntários.

## ESTRUTURA
```
site-projeto-kolenu/  
├── index.html                  # Página inicial (base para SPA e templates JavaScript)  
├── assets                      # Assets variados  
│   └── fonts                   # Fontes customizadas  
├── img/                        # Assets visuais   
│   └── favicon/                # Assets de favicon  
├── css/                        # Arquivos CSS3  
│   └── styles.css              # Arquivo de estilos  
├── js/                         # Arquivos JavaScript ES6+  
│   └── templates.js            # Gerenciador de templates dinâmicos JavaScript  
│   └── spa-router.js           # Roteador client-side SPA com hash  
│   └── form-validator.js       # Validador de formulário em tempo real  
│   └── aria-manager.js         # Gerenciamento de estados ARIA e live regions para screen readers
│   └── theme-switcher.js       # Sistema de temas dinâmicos com persistência de preferências
│   └── mobile-menu.js          # Menu otimizado para dispositivos mobile  
│   └── keyboard-navigator.js   # Suporte completo a navegação por teclado  
└── README.md                   # Documentação  
...
```
## ENTREGAS REALIZADAS
**Entrega I:** *Fundamentos e Estruturação* (HTML5) **(27/10/2025)**  
*- Estrutura semântica completa das páginas index, projetos e cadastro, com agrupamento lógico*  
*- Formulários com validação HTML5 e máscaras (CPF, CEP, telefone)*  
*- Imagens otimizadas em múltiplos formatos (PNG, WebP, ICO)*  
*- Arquivos HTML validados no W3C Validator*  
  
**Entrega II:** *Estilização e Leiautes* (CSS3)  
*- Sistema de design completo com variáveis CSS customizadas**  
*- Paleta de 11 cores, tipografia hierárquica (6 níveis), de espaçamento modular (6 níveis), breakpoints responsivos (5 níveis)*  
*- CSS Grid (estrutura geral), Flexbox (componentes)*  
*- Leiautes responsivos com CSS Grid para estrutura geral e Flexbox para componentes*  
*- Grid system customizado de 12 colunas*  
*- Menu responsivo com dropdown e menu mobile hambúrguer*  
*- Sistema de cards responsivos com efeitos hover*  
*- Botões com estados visuais responsivos (hover, focus, active, disabled)*  
*- Formulários com validação visual avançada*  
*- Componentes de feedback (modal, toast, alert)*  
*- Sistema de badges e tags para categorização de conteúdo*  
*- Media queries avançadas para 5 tamanhos de dispositivos*  

**Entrega III:** *Interatividade e Funcionalidades* (JavaScript ES6+)  
*- Sistema de validação avançada de formulários com feedback visual em tempo real com máscaras automáticas*  
*- Arquitetura Single Page Application (SPA) com roteamento client-side*  
*- Sistema de templates dinâmicos JavaScript para gerenciamento de conteúdo*  
*- Navegação por hash com suporte a âncoras e scroll inteligente*  
*- Sistema de logs para debugging e monitoramento de funcionalidades*  

**Entrega IV:** *Versionamento, Acessibilidade e Deploy* (Git, Acessibilidade, Performance) **(03/10/2025)**  
*- Implementação de estratégia GitFlow com versionamento semântico e histórico de commits organizado*  
*- Sistema de acessibilidade completo seguindo WCAG 2.1 Nível AA com navegação por teclado e suporte a leitores de tela*  
*- Otimização avançada para produção com minificação de assets e compressão inteligente de imagens*  
*- Implementação de temas acessíveis (modos escuro e alto contraste)*
*- Implementação de contraste mínimo de 4.5:1*  
*- README.md detalhado*

## TECNOLOGIAS
*- Frontend: HTML5, CSS3, JavaScript ES6+*  
*- Arquitetura: SPA (Single Page Application)*  
*- Design System: CSS Custom Properties, Grid, Flexbox*  
*- Acessibilidade: WCAG 2.1 AA, ARIA, Temas, Navegação por Teclado*  
*- Ferramentas: Git, GitHub, W3C Validator*  

## DESIGN
*- Cores: 13 cores semânticas + temas claro/escuro/alto contraste*  
*- Tipografia: Montserrat (6 níveis hierárquicos)*  
*- Espaçamento: Sistema modular (8px base)*  
*- Breakpoints: 5 tamanhos (320px - 1440px+; mobile → widescreen)*  
*- Tipografia: Montserrat (6 níveis hierárquicos)*  
*- Espaçamento: Sistema modular (8px base)*  
*- Breakpoints: 5 tamanhos (320px - 1440px+)*  
*- ARIA: Landmarks, estados dinâmicos, live regions*  

## INSTALAÇÃO
### Clone o repositório
git clone https://github.com/sanchesfilho/site-projeto-kolenu

### Acesse o diretório
cd projeto-kolenu

### Execute localmente
abra o arquivo index.html

## FONTES UTILIZADAS
### Montserrat
**Tipo**: Variable Font  
**Autores**: The Montserrat Project Authors  
**Licença**: SIL Open Font License v1.1  
**Fonte**: https://github.com/JulietaUla/Montserrat  