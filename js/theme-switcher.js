//    PLATAFORMA WEB – ONG
//    DESENVOLVIDO POR: JAYME SANCHES FILHO
//    INSTITUIÇÃO: UNIVERSIDADE CRUZEIRO DO SUL
//    DISCIPLINA: DESENVOLVIMENTO FRONT—END PARA WEB
//    EXPERIÊNCIA PRÁTICA — ENTREGA 4 (VERSIONAMENTO, ACESSIBILIDADE E DEPLOY)
//    DATA: 01/11/2025
//

// THEME-SWITCHER.JS: SISTEMA DE CONTROLE DE MODOS DE VISUALIZAÇÃO

// VERIFICAÇÃO DE DUPLICAÇÃO
if (typeof ThemeSwitcher !== 'undefined') {
    console.log('🔄 ThemeSwitcher já carregado - ignorando duplicata');
} else {

    // CLASSE PRINCIPAL: GERENCIA MODOS CLARO, ESCURO E ALTO CONTRASTE
    class ThemeSwitcher {
        constructor() {
            this.themeButtons = document.querySelectorAll('.theme-btn');
            this.currentTheme = this.getSavedTheme() || 'light';
            this.init();
        }

        // INICIALIZAÇÃO DO SISTEMA DE TEMAS
        init() {
            this.setTheme(this.currentTheme);
            this.setupEventListeners();
            this.setupSystemPreferenceListener();
            console.log('✅ SISTEMA DE TEMAS INICIALIZADO');
        }

        // CONFIGURA EVENTOS DE CLIQUE NOS BOTÕES DE TEMA
        setupEventListeners() {
            this.themeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const theme = e.currentTarget.dataset.theme;
                    this.setTheme(theme);
                    console.log(`🎨 Tema alterado para: ${theme}`);
                });
            });
        }

        // APLICA O TEMA SELECIONADO AO DOCUMENTO
        setTheme(theme) {

            // REMOVE ATRIBUTOS ANTERIORES DE TEMA
            document.documentElement.removeAttribute('data-theme');
            
            // CORREÇÃO: APLICA O TEMA SELECIONADO (INCLUINDO 'light')
            document.documentElement.setAttribute('data-theme', theme);
            
            // ATUALIZA ESTADO VISUAL DOS BOTÕES
            this.updateButtonStates(theme);
            
            // SALVA PREFERÊNCIA DO USUÁRIO
            this.saveTheme(theme);
            this.currentTheme = theme;
            
            console.log(`🎯 Tema aplicado: ${theme}`);
        }

        // ATUALIZA ESTADO DOS BOTÕES (ARIA-PRESSED)
        updateButtonStates(activeTheme) {
            this.themeButtons.forEach(btn => {
                const isActive = btn.dataset.theme === activeTheme;
                btn.setAttribute('aria-pressed', isActive);
                console.log(`🔘 Botão ${btn.dataset.theme}: ${isActive ? 'ativo' : 'inativo'}`);
            });
        }

        // RECUPERA TEMA SALVO NO LOCALSTORAGE
        getSavedTheme() {
            return localStorage.getItem('preferred-theme');
        }

        // SALVA PREFERÊNCIA DO USUÁRIO NO LOCALSTORAGE
        saveTheme(theme) {
            localStorage.setItem('preferred-theme', theme);
            console.log(`💾 Tema salvo: ${theme}`);
        }

        // RESPEITA MUDANÇAS DE PREFERÊNCIA DO SISTEMA
        setupSystemPreferenceListener() {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');            
            darkModeMediaQuery.addEventListener('change', e => {
                
                // SÓ MUDA SE USUÁRIO NÃO TIVER PREFERÊNCIA SALVA
                if (!this.getSavedTheme()) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(systemTheme);
                    console.log(`🖥️  Tema do sistema alterado para: ${systemTheme}`);
                }
            });
        }
    }

    // EXPORTA A CLASSE PARA USO GLOBAL
    window.ThemeSwitcher = ThemeSwitcher;
}

// SISTEMA DE INICIALIZAÇÃO INTELIGENTE
const initializeThemeSwitcher = () => {
    if (window.themeSwitcherInstance) {
        console.log('🔄 ThemeSwitcher já inicializado - ignorando duplicata');
        return true;
    }
    
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (themeButtons.length > 0) {
        console.log('🚀 INICIALIZANDO SISTEMA DE CONTROLE DE TEMAS');
        window.themeSwitcherInstance = new ThemeSwitcher();
        return true;
    }
    
    return false;
};

// INICIALIZAÇÃO CONDICIONAL — EXECUTA APENAS EM PÁGINAS COM BOTÕES DE TEMA
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {

        // DELAY PARA CARREGAMENTO COMPLETO EM APLICAÇÕES SPA
        setTimeout(() => {
            const themeButtons = document.querySelectorAll('.theme-btn');
            if (themeButtons.length > 0) {
                initializeThemeSwitcher();
                console.log('✅ ThemeSwitcher inicializado na página atual');
            } else {
                console.log('ℹ️  ThemeSwitcher não requerido nesta página');
            }
        }, 300);
    });
} else {
    
    // VERIFICAÇÃO IMEDIATA PARA PÁGINAS PRÉ-CARREGADAS
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (themeButtons.length > 0) {
        initializeThemeSwitcher();
        console.log('✅ ThemeSwitcher inicializado em página carregada');
    } else {
        console.log('ℹ️  ThemeSwitcher não requerido nesta página');
    }
}

// SUPORTE SPA — REINICIALIZAÇÃO AUTOMÁTICA EM MUDANÇAS DE ROTA
window.addEventListener('hashchange', () => {
    setTimeout(() => {
        const themeButtons = document.querySelectorAll('.theme-btn');
        if (themeButtons.length > 0 && !window.themeSwitcherInstance) {
            console.log('🔄 Inicializando ThemeSwitcher na nova rota SPA');
            initializeThemeSwitcher();
        }
    }, 200);
});