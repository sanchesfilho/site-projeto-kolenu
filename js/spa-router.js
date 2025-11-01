//    PLATAFORMA WEB – ONG
//    DESENVOLVIDO POR: JAYME SANCHES FILHO
//    INSTITUIÇÃO: UNIVERSIDADE CRUZEIRO DO SUL
//    DISCIPLINA: DESENVOLVIMENTO FRONT—END PARA WEB
//    EXPERIÊNCIA PRÁTICA — ENTREGA 3 (INTERATIVIDADE E FUNCIONALIDADES)
//    DATA: 31/10/2025

// SPA-ROUTER.JS: SISTEMA DE ROTEAMENTO CLIENT-SIDE PARA APLICAÇÃO SINGLE PAGE
// IMPLEMENTA NAVEGAÇÃO DINÂMICA SEM RECARREGAMENTO DA PÁGINA, COM SUPORTE A ÂNCORAS

// EVENT LISTENER PRINCIPAL — DETECTA MUDANÇAS NA URL (HASH) PARA NAVEGAÇÃO
window.addEventListener('hashchange', function() {
    // CAPTURA HASH COMPLETA DA URL (EX: "#/PROJETOS#SPARK")
    const fullHash = window.location.hash;
    
    // EXTRAI NOME DA ROTA PRINCIPAL — REMOVE "#/" INICIAL E QUALQUER ÂNCORA
    // EX: "#/PROJETOS#SPARK" → "PROJETOS" | "#/CADASTRO" → "CADASTRO" | "" → "HOME"
    const route = fullHash.slice(2).split('#')[0] || 'home';
    
    // EXECUTA CARREGAMENTO DINÂMICO DO TEMPLATE CORRESPONDENTE À ROTA
    // FUNÇÃO "carregarPagina" DEFINIDA NO ARQUIVO TEMPLATES.JS
    carregarPagina(route);
    
    // VERIFICA SE URL CONTÉM ÂNCORA (MAIS DE 2 PARTES SEPARADAS POR "#")
    // EX: "#/PROJETOS#SPARK" → 3 PARTES → POSSUI ÂNCORA
    // EX: "#/PROJETOS" → 2 PARTES → NÃO POSSUI ÂNCORA
    const hasAnchor = fullHash.split('#').length > 2;
    
    // EXECUTA SCROLL SUAVE PARA O TOPO DA PÁGINA APENAS QUANDO NÃO EXISTE ÂNCORA
    // GARANTE EXPERIÊNCIA CONSISTENTE AO NAVEGAR ENTRE PÁGINAS DIFERENTES
    if (!hasAnchor) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // AGENDA EXECUÇÃO DA FUNÇÃO DE SCROLL PARA ÂNCORA APÓS 100ms
    // DELAY GARANTE QUE CONTEÚDO DA PÁGINA ESTEJA TOTALMENTE CARREGADO NO DOM
    setTimeout(() => {
        scrollToAnchor();
    }, 100);
});

// EVENT LISTENER DE CARREGAMENTO INICIAL - EXECUTADO AO ABRIR/ATUALIZAR A PÁGINA
window.addEventListener('load', function() {
    
    // DETERMINA ROTA INICIAL BASEADA NA URL OU USA "HOME" COMO PADRÃO
    const route = window.location.hash.slice(2) || 'home';
    
    // CARREGA TEMPLATE INICIAL CORRESPONDENTE À ROTA
    carregarPagina(route);
    
    // AGENDA SCROLL PARA ÂNCORA NA CARGA INICIAL DA PÁGINA
    // PERMITE ACESSO DIRETO VIA URL COM ÂNCORA (EX: SITE.COM/#/PROJETOS#SPARK)
    setTimeout(() => {
        scrollToAnchor();
    }, 100);
});

// FUNÇÃO ESPECIALIZADA EM SCROLL PARA ELEMENTOS ÂNCORA NA PÁGINA
function scrollToAnchor() {
    // CAPTURA HASH COMPLETA DA URL ATUAL
    const fullHash = window.location.hash;
    
    // EXTRAI NOME DA ÂNCORA (ÚLTIMA PARTE APÓS "#")
    // EX: "#/PROJETOS#SPARK" → "SPARK" | "#/PROJETOS" → "/PROJETOS"
    const anchor = fullHash.split('#').pop();
    
    // VALIDA SE ÂNCORA É VÁLIDA PARA SCROLL:
    // 1. EXISTE E NÃO É VAZIA | 2. NÃO CONTÉM "/" (NÃO É ROTA) | 3. TEM MAIS DE 2 "#" NA URL
    const isValidAnchor = anchor && 
                         anchor !== '' && 
                         !anchor.includes('/') && 
                         fullHash.split('#').length > 2;
    
    if (isValidAnchor) {
        // AGENDA SCROLL COM DELAY DE 200ms PARA GARANTIR:
        // - CARREGAMENTO COMPLETO DO TEMPLATE
        // - RENDERIZAÇÃO DE TODOS OS ELEMENTOS NO DOM
        setTimeout(() => {
            // LOCALIZA ELEMENTO ALVO PELO ID (DEVE CORRESPONDER AO NOME DA ÂNCORA)
            const element = document.getElementById(anchor);
            
            // EXECUTA SCROLL SUAVE SE ELEMENTO FOR ENCONTRADO
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',  // ANIMAÇÃO SUAVE
                    block: 'start'       // ALINHA TOPO DO ELEMENTO COM TOPO DA VIEWPORT
                });
            }
        }, 200);
    }
}

// LOG DE CONFIRMAÇÃO — INDICA QUE SPA ROUTER FOI INICIALIZADO COM SUCESSO
console.log('SPA ROUTER INICIALIZADO.');