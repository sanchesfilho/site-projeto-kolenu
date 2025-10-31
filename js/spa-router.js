//    PLATAFORMA WEB – ONG
//    DESENVOLVIDO POR: JAYME SANCHES FILHO
//    INSTITUIÇÃO: UNIVERSIDADE CRUZEIRO DO SUL
//    DISCIPLINA: DESENVOLVIMENTO FRONT—END PARA WEB
//    EXPERIÊNCIA PRÁTICA — ENTREGA 3 (INTERATIVIDADE E FUNCIONALIDADES)
//    DATA: 31/10/2025

// SPA-ROUTER.JS: SISTEMA DE ROTEAMENTO CLIENT-SIDE PARA APLICAÇÃO SINGLE PAGE

// EVENT LISTENER — AGUARDA CARREGAMENTO COMPLETO DO DOM ANTES DE INICIALIZAR
document.addEventListener('DOMContentLoaded', function() {
    
    // CONFIGURAÇÃO DAS ROTAS — MAPEIA URLs PARA ARQUIVOS HTML
    const router = new SPARouter({
        '/': null,                    // HOME JÁ ESTÁ CARREGADA NO INDEX.HTML
        '/cadastro': 'cadastro.html', // PÁGINA DE DOAÇÃO E CADASTRO DE VOLUNTÁRIOS
        '/projetos': 'projetos.html', // PÁGINA DE INICIATIVAS
    });
    
    // EVENT LISTENER — DETECTA MUDANÇAS NA URL (HASH) E ATUALIZA ROTA
    window.addEventListener('hashchange', () => router.handleRoute());
    
    // EVENT LISTENER — EXECUTA ROTEAMENTO INICIAL AO CARREGAR A PÁGINA
    window.addEventListener('load', () => router.handleRoute());
    
    // LOG DE CONFIRMAÇÃO — INDICA QUE SPA ROUTER FOI INICIALIZADO COM SUCESSO
    console.log('SPA ROUTER INICIALIZADO.');
});

// CLASSE PRINCIPAL DO ROTEADOR SPA — GERENCIA NAVEGAÇÃO CLIENT-SIDE
class SPARouter {

    // CONSTRUTOR — INICIALIZA CONFIGURAÇÕES DO ROTEADOR
    constructor(routes) {
        this.routes = routes; // MAPEAMENTO DE ROTAS PARA ARQUIVOS HTML
        this.rootElement = document.getElementById('app'); // CONTAINER PRINCIPAL DA APLICAÇÃO
        this.currentContent = this.rootElement.innerHTML; // SALVA CONTEÚDO INICIAL DA HOME
    }

    // MÉTODO PRINCIPAL — CARREGA PÁGINAS DINAMICAMENTE VIA FETCH API
    async loadPage(url) {
        try {

            // VERIFICA SE É A ROTA HOME — RESTAURA CONTEÚDO SALVO
            if (!url || url === '/') {
                this.restoreHome();
                return;
            }
            
            // LOG DE CARREGAMENTO — REGISTRA REQUISIÇÃO NO CONSOLE
            console.log(`CARREGANDO: ${url}`);
            
            // FAZ REQUISIÇÃO HTTP PARA OBTER CONTEÚDO DA PÁGINA
            const response = await fetch(url);
            
            // VERIFICA SE A RESPOSTA É VÁLIDA
            if (!response.ok) {
                throw new Error(`HTTP ERROR! STATUS: ${response.status}`);
            }
            
            // CONVERTE RESPOSTA PARA TEXTO HTML
            const html = await response.text();
            
            // ATUALIZA CONTEÚDO DO CONTAINER PRINCIPAL
            this.rootElement.innerHTML = html;
            
            // EXECUTA SCRIPTS INCLUÍDOS NO CONTEÚDO CARREGADO
            this.executeScripts();
            
            // SCROLL AUTOMÁTICO PARA ÂNCORA APÓS CARREGAR PÁGINA
            this.scrollToAnchor();
            
        } catch (error) {
            // TRATAMENTO DE ERRO — EXIBE PÁGINA DE ERRO PERSONALIZADA
            console.error('ERRO AO CARREGAR PÁGINA:', error);
            this.showErrorPage(url);
        }
    }

    // MÉTODO SCROLL TO ANCHOR — ROLA SUAVEMENTE PARA SEÇÕES DEFINIDAS NO HTML
    scrollToAnchor() {

    // CAPTURA HASH COMPLETA DA URL (EX: "#/PROJETOS#SPARK")
    const fullHash = window.location.hash;
    
    // EXTRAI NOME DA ÂNCORA (PARTE APÓS O ÚLTIMO #)
    const anchor = fullHash.split('#').pop();
    
    // ✅ VERIFICA SE A ÂNCORA NÃO É UMA ROTA (NÃO CONTÉM "/")
    if (anchor && anchor !== '' && !anchor.includes('/')) {

        // AGUARDA 100ms PARA GARANTIR QUE DOM ESTÁ PRONTO
        setTimeout(() => {
            const element = document.getElementById(anchor);
            if (element) {

                // EXECUTA SCROLL SUAVE ATÉ O ELEMENTO ALVO
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                console.log(`🎯 ROLANDO PARA: ${anchor}`);
            } else {
                
                // ✅ AVISO MAIS ESPECÍFICO - SÓ PARA ÂNCORAS REAIS
                console.log(`⚠️ ÂNCORA #${anchor} NÃO ENCONTRADA NA PÁGINA`);
            }
        }, 100);
    }
}

    // MÉTODO RESTORE HOME — RESTAURA CONTEÚDO ORIGINAL DA PÁGINA INICIAL
    restoreHome() {
        if (this.currentContent) {
            this.rootElement.innerHTML = this.currentContent;
            console.log('🏠 HOME RESTAURADA');
            
            // APLICA SCROLL PARA ÂNCORA TAMBÉM NA HOME
            this.scrollToAnchor();
        }
    }

    // MÉTODO EXECUTE SCRIPTS — PROCESSA E EXECUTA SCRIPTS DINÂMICOS
    executeScripts() {
        const scripts = this.rootElement.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {

                // COPIA SRC DE SCRIPTS EXTERNOS
                newScript.src = script.src;

            } else {

                // COPIA CONTEÚDO DE SCRIPTS INLINE
                newScript.textContent = script.textContent;
            }
            
            // ADICIONA E REMOVE SCRIPT PARA FORÇAR EXECUÇÃO
            document.head.appendChild(newScript);
            document.head.removeChild(newScript);
        });
    }

    // MÉTODO SHOW ERROR PAGE — EXIBE PÁGINA DE ERRO PERSONALIZADA
    showErrorPage(url) {
        this.rootElement.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h2>😕 PÁGINA NÃO ENCONTRADA</h2>
                <p>ERRO AO CARREGAR: ${url}</p>
                <a href="#/" class="btn">🏠 VOLTAR PARA HOME</a>
            </div>
        `;
    }

    // MÉTODO HANDLE ROUTE — GERENCIA MUDANÇAS DE ROTA VIA HASH URL
    handleRoute() {

        // EXTRAI HASH DA URL (REMOVE # INICIAL)
        let hash = window.location.hash.substring(1) || '/';
        
        // SEPARA ROTA PRINCIPAL DE ÂNCORAS (EX: "/PROJETOS#SPARK" → "/PROJETOS")
        const route = hash.split('#')[0];
        
        // OBTÉM ARQUIVO HTML CORRESPONDENTE À ROTA
        const pageToLoad = this.routes[route] || route;
        
        // INICIA PROCESSO DE CARREGAMENTO DA PÁGINA
        this.loadPage(pageToLoad);
    }
}