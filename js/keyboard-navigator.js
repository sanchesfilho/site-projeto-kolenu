// PLATAFORMA WEB – ONG
// DESENVOLVIDO POR: JAYME SANCHES FILHO
// INSTITUIÇÃO: UNIVERSIDADE CRUZEIRO DO SUL
// DISCIPLINA: DESENVOLVIMENTO FRONT—END PARA WEB
// EXPERIÊNCIA PRÁTICA — ENTREGA 4 (VERSIONAMENTO, ACESSIBILIDADE E DEPLOY)
// DATA: 01/11/2025

// KEYBOARD-NAVIGATOR.JS: SISTEMA DE NAVEGAÇÃO POR TECLADO — IMPLEMENTA ACESSIBILIDADE WCAG E NAVEGAÇÃO KEYBOARD-ONLY

// CLASSE PRINCIPAL — GERENCIA TODA A NAVEGAÇÃO POR TECLADO E ESTADOS DE COMPONENTES INTERATIVOS
class KeyboardNavigation {
    constructor() {

        // CONTROLE DE ESTADO — RASTREIA COMPONENTE ATUALMENTE ATIVO PARA GERENCIAMENTO DE FOCO
        this.currentDropdown = null;  // DROPDOWN ABERTO NO MOMENTO
        this.isModalOpen = false;     // ESTADO DE VISIBILIDADE DO MODAL
        this.init();
    }

    // MÉTODO DE INICIALIZAÇÃO — CONFIGURA TODOS OS SISTEMAS DE NAVEGAÇÃO
    init() {
        this.setupSkipLink();
        this.setupDropdownNavigation();
        this.setupDropdownMenuNavigation();
        this.setupModalNavigation();
        this.setupAlertNavigation();
        this.setupFormNavigation();
        this.setupGlobalKeyboardEvents();
        
        console.log('✅ SISTEMA DE NAVEGAÇÃO POR TECLADO INICIALIZADO');
    }

    // 1. SKIP LINK — IMPLEMENTA ACESSKEY PARA PULAR NAVEGAÇÃO E IR DIRETO AO CONTEÚDO PRINCIPAL
    setupSkipLink() {

        // CRIA SKIP LINK DINAMICAMENTE SE NÃO EXISTIR NO DOM
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Ir para o conteúdo principal';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: white;
                padding: 8px;
                z-index: 10000;
                text-decoration: none;
            `;
            document.body.prepend(skipLink);
        }

        // CONFIGURA COMPORTAMENTO DO SKIP LINK — SCROLL SUAVE PARA CONTEÚDO PRINCIPAL
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const mainContent = document.getElementById('app') || document.querySelector('main');
                if (mainContent) {
                    // GARANTE QUE ELEMENTO SEJA FOCÁVEL VIA TABINDEX
                    if (!mainContent.hasAttribute('tabindex')) {
                        mainContent.setAttribute('tabindex', '-1');
                    }
                    mainContent.focus();
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // 2. NAVEGAÇÃO EM DROPDOWNS — GERENCIA ABERTURA/FECHAMENTO E NAVEGAÇÃO COM TECLADO
    setupDropdownNavigation() {

        // EVENT LISTENER GLOBAL — CAPTURA TODAS AS INTERAÇÕES DE TECLADO NA PÁGINA
        document.addEventListener('keydown', (e) => {
            
            // IGNORA EVENTOS DE DROPDOWN SE MODAL ESTIVER ABERTO — EVITA CONFLITOS DE FOCO
            if (this.isModalOpen) return;

            const target = e.target;
            const isDropdownToggle = target.classList.contains('dropdown-toggle');
            const isInDropdownMenu = target.closest('.dropdown-menu');
            const dropdown = target.closest('.dropdown');

            // FILTRA APENAS TECLAS RELEVANTES PARA NAVEGAÇÃO EM DROPDOWNS
            if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Escape'].includes(e.key)) {
                
                // ENTER OU ESPAÇO NO TOGGLE — ALTERNA ESTADO ABERTO/FECHADO
                if ((e.key === 'Enter' || e.key === ' ') && isDropdownToggle) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown(dropdown);
                    return;
                }

                // SETA PARA BAIXO NO TOGGLE — ABRE DROPDOWN E FOCA PRIMEIRO ITEM
                if (e.key === 'ArrowDown' && isDropdownToggle) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openDropdown(dropdown);
                    setTimeout(() => this.focusFirstMenuItem(dropdown), 50);
                    return;
                }

                // SETA PARA CIMA NO TOGGLE — ABRE DROPDOWN E FOCA ÚLTIMO ITEM
                if (e.key === 'ArrowUp' && isDropdownToggle) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openDropdown(dropdown);
                    setTimeout(() => this.focusLastMenuItem(dropdown), 50);
                    return;
                }

                // ESCAPE — FECHA DROPDOWN ATUAL E RETORNA FOCO PARA TOGGLE
                if (e.key === 'Escape' && (isDropdownToggle || isInDropdownMenu)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeCurrentDropdown();
                    return;
                }
            }
        });

        // FECHA DROPDOWNS AO CLICAR FORA — MELHORA EXPERIÊNCIA DO USUÁRIO
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });

        // FECHA DROPDOWNS AO MUDAR DE PÁGINA SPA — MANTÉM ESTADO CONSISTENTE
        window.addEventListener('hashchange', () => {
            this.closeAllDropdowns();
        });
    }

    // 3. NAVEGAÇÃO INTERNA DO MENU DROPDOWN — CONTROLE DE FOCO ENTRE ITENS DO MENU
    setupDropdownMenuNavigation() {
        document.addEventListener('keydown', (e) => {
            const target = e.target;
            const isMenuItem = target.tagName === 'A' && target.closest('.dropdown-menu');
            
            // IGNORA EVENTOS QUE NÃO SÃO DE ITENS DE MENU
            if (!isMenuItem) return;

            const menu = target.closest('.dropdown-menu');
            const dropdown = menu.closest('.dropdown');
            const menuItems = Array.from(menu.querySelectorAll('a'));
            const currentIndex = menuItems.indexOf(target);

            // MAPEAMENTO DE TECLAS PARA AÇÕES ESPECÍFICAS DENTRO DO MENU
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    const nextIndex = (currentIndex + 1) % menuItems.length;
                    menuItems[nextIndex].focus();
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
                    menuItems[prevIndex].focus();
                    break;

                case 'Home':
                    e.preventDefault();
                    e.stopPropagation();
                    menuItems[0].focus();
                    break;

                case 'End':
                    e.preventDefault();
                    e.stopPropagation();
                    menuItems[menuItems.length - 1].focus();
                    break;

                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeDropdown(dropdown);
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    if (toggle) toggle.focus();
                    break;

                case 'Tab':
                    // FECHA DROPDOWN AO SAIR COM TAB — COMPORTAMENTO PADRÃO DE NAVEGAÇÃO
                    setTimeout(() => {
                        if (!dropdown.contains(document.activeElement)) {
                            this.closeDropdown(dropdown);
                        }
                    }, 10);
                    break;
            }
        });
    }

    // 4. NAVEGAÇÃO NO MODAL — IMPLEMENTA TRAP DE FOCO E CONTROLE DE ACESSIBILIDADE
    setupModalNavigation() {

        // CAPTURA ELEMENTOS DO MODAL DO DOM
        const modalBtn = document.querySelector('.modal-btn');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalClose = document.querySelector('.modal-close');
        const modalToggle = document.querySelector('#modal-toggle');

        // VERIFICA EXISTÊNCIA DOS ELEMENTOS ESSENCIAIS
        if (!modalBtn || !modalOverlay) return;

        // CONFIGURA ABERTURA DO MODAL VIA CLIQUE
        modalBtn.addEventListener('click', () => {
            this.openModal();
        });

        // CONFIGURA ABERTURA DO MODAL VIA TECLADO (ENTER/ESPAÇO)
        modalBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openModal();
            }
        });

        // CONFIGURA FECHAMENTO COM BOTÃO CLOSE
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });

            modalClose.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.closeModal();
                }
            });
        }

        // COMPATIBILIDADE COM SISTEMA ORIGINAL BASEADO EM CHECKBOX
        if (modalToggle) {
            modalToggle.addEventListener('change', (e) => {
                if (!e.target.checked) {
                    this.closeModal();
                }
            });
        }

        // FECHAMENTO AO CLICAR FORA DO CONTEÚDO DO MODAL
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });

        // TRAP DE FOCO — MANTÉM FOCO DENTRO DO MODAL ENQUANTO ABERTO
        modalOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isModalOpen) {
                const focusableElements = modalOverlay.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                // IMPLEMENTA NAVEGAÇÃO CÍCLICA — VOLTA AO PRIMEIRO/ÚLTIMO ELEMENTO
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });

        // FECHAMENTO DO MODAL COM TECLA ESCAPE
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                e.preventDefault();
                this.closeModal();
            }
        });
    }

    // MÉTODO PARA ABERTURA DO MODAL — GERENCIA VISUAL E ESTADO DE ACESSIBILIDADE
    openModal() {
        const modalBtn = document.querySelector('.modal-btn');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalToggle = document.querySelector('#modal-toggle');
        const modalClose = document.querySelector('.modal-close');

        // COMPATIBILIDADE DUPLA — SISTEMA DE CHECKBOX E CONTROLE DIRETO VIA STYLE
        if (modalToggle) {
            modalToggle.checked = true;
        } else {
            modalOverlay.style.display = 'flex';
        }

        // ATUALIZA ATRIBUTOS ARIA PARA LEITORES DE TELA
        modalBtn.setAttribute('aria-expanded', 'true');
        this.isModalOpen = true;
        
        // FOCO AUTOMÁTICO NO BOTÃO FECHAR — MELHORA FLUXO DE NAVEGAÇÃO
        setTimeout(() => {
            if (modalClose) {
                modalClose.focus();
            }
        }, 100);
        
        console.log('✅ Modal aberto');
    }

    // MÉTODO PARA FECHAMENTO DO MODAL — RESTAURA ESTADO INICIAL E GERENCIA FOCO
    closeModal() {
        const modalBtn = document.querySelector('.modal-btn');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalToggle = document.querySelector('#modal-toggle');

        // COMPATIBILIDADE DUPLA — SISTEMA DE CHECKBOX E CONTROLE DIRETO VIA STYLE
        if (modalToggle) {
            modalToggle.checked = false;
        } else {
            modalOverlay.style.display = 'none';
        }

        // ATUALIZA ATRIBUTOS ARIA PARA LEITORES DE TELA
        modalBtn.setAttribute('aria-expanded', 'false');
        this.isModalOpen = false;
        
        // DEVOLVE FOCO PARA BOTÃO DO MODAL — FLUXO DE NAVEGAÇÃO CONSISTENTE
        modalBtn.focus();
        
        console.log('❌ Modal fechado');
    }

    // 5. NAVEGAÇÃO NO ALERTA EDUCACIONAL — EXPANSÃO/RECOLHIMENTO COM TECLADO
    setupAlertNavigation() {
        document.addEventListener('keydown', (e) => {
            const alert = document.querySelector('.alert-educational');
            
            if (!alert) return;

            // ENTER OU ESPAÇO — ALTERNA ESTADO EXPANDIDO/RECOLHIDO
            if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === alert) {
                e.preventDefault();
                this.toggleAlert(alert);
            }

            // ESCAPE — RECOLHE ALERTA SE ESTIVER EXPANDIDO
            if (e.key === 'Escape' && alert.classList.contains('expanded')) {
                this.collapseAlert(alert);
            }
        });

        // CONFIGURA ALERTA COMO ELEMENTO INTERATIVO E FOCÁVEL
        const alert = document.querySelector('.alert-educational');
        if (alert && !alert.hasAttribute('tabindex')) {
            alert.setAttribute('tabindex', '0');
            alert.setAttribute('role', 'button');
            alert.setAttribute('aria-label', 'Informação educativa - pressione Enter para expandir');
        }
    }

    // ALTERNA ESTADO DO ALERTA ENTRE EXPANDIDO E RECOLHIDO
    toggleAlert(alert) {
        alert.classList.toggle('expanded');
        
        if (alert.classList.contains('expanded')) {
            alert.style.width = '300px';
            const content = alert.querySelector('.alert-content');
            if (content) {
                content.style.opacity = '1';
                content.style.maxHeight = '500px';
            }
            alert.setAttribute('aria-expanded', 'true');
        } else {
            this.collapseAlert(alert);
        }
    }

    // RECOLHE ALERTA E RESTAURA ESTADO VISUAL INICIAL
    collapseAlert(alert) {
        alert.style.width = '50px';
        const content = alert.querySelector('.alert-content');
        if (content) {
            content.style.opacity = '0';
            content.style.maxHeight = '0';
        }
        alert.setAttribute('aria-expanded', 'false');
    }

    // 6. NAVEGAÇÃO EM FORMULÁRIOS — ATALHOS E FLUXOS OTIMIZADOS PARA PREENCHIMENTO
    setupFormNavigation() {

        // NAVEGAÇÃO ENTRE CAMPOS COM ENTER — SUBSTITUI USO DE TAB PARA PREENCHIMENTO RÁPIDO
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
                e.preventDefault();
                
                const form = e.target.closest('form');
                if (!form) return;

                const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
                const currentIndex = inputs.indexOf(e.target);
                
                // AVANÇA PARA PRÓXIMO CAMPO OU VAI PARA BOTÃO SUBMIT NO FINAL
                if (currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus();
                } else {
                    const submitButton = form.querySelector('button[type="submit"]');
                    if (submitButton) submitButton.focus();
                }
            }
        });

        // ATALHO GLOBAL ALT+S — FOCO DIRETO NO BOTÃO DE ENVIO DO FORMULÁRIO
        // "CTRL+S" EVITADO POR SER ATALHO NATIVO PARA "SALVAR PÁGINA" EM VÁRIOS NAVEGADORES
        document.addEventListener('keydown', (e) => {
            if ((e.altKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const form = document.querySelector('form');
                if (form) {
                    const submitButton = form.querySelector('button[type="submit"]');
                    if (submitButton) submitButton.focus();
                }
            }
        });
    }

    // 7. EVENTOS GLOBAIS DE TECLADO — DETECÇÃO DE MODO DE INTERAÇÃO E ACCESSKEYS
    setupGlobalKeyboardEvents() {

        // DETECÇÃO AUTOMÁTICA DE USUÁRIO DE TECLADO — APLICA ESTILOS ESPECÍFICOS
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-user');
                document.body.classList.remove('mouse-user');
            }
        });

        // DETECÇÃO DE USUÁRIO DE MOUSE — REMOVE ESTILOS DE TECLADO
        document.addEventListener('mousedown', () => {
            document.body.classList.add('mouse-user');
            document.body.classList.remove('keyboard-user');
        });

        // ACCESSKEYS — ATALHOS DE TECLADO PARA NAVEGAÇÃO RÁPIDA (ALT + NÚMERO)
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        window.location.hash = '#/';
                        break;
                    case '2':
                        e.preventDefault();
                        window.location.hash = '#/projetos';
                        break;
                    case '3':
                        e.preventDefault();
                        window.location.hash = '#/cadastro';
                        break;
                    case '0':
                        e.preventDefault();
                        const skipLink = document.querySelector('.skip-link');
                        if (skipLink) skipLink.focus();
                        break;
                }
            }
        });
    }

    // MÉTODOS AUXILIARES PARA DROPDOWNS — CONTROLE DE ESTADO E GERENCIAMENTO DE FOCO

    // ALTERNA ESTADO ABERTO/FECHADO DO DROPDOWN
    toggleDropdown(dropdown) {
        const isOpen = dropdown.classList.contains('active');
        if (isOpen) {
            this.closeDropdown(dropdown);
        } else {
            this.openDropdown(dropdown);
        }
    }

    // ABRE DROPDOWN ESPECÍFICO E FECHA OUTROS — MANTÉM APENAS UM ABERTO POR VEZ
    openDropdown(dropdown) {

        // FECHA OUTROS DROPDOWNS ABERTOS — COMPORTAMENTO EXCLUSIVO
        this.closeAllDropdowns();
        
        dropdown.classList.add('active');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        // ATUALIZA ATRIBUTOS ARIA PARA LEITORES DE TELA
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
        }
        
        this.currentDropdown = dropdown;
        console.log('📂 Dropdown aberto');
    }

    // FECHA DROPDOWN ESPECÍFICO E RESTAURA ESTADO INICIAL
    closeDropdown(dropdown) {
        dropdown.classList.remove('active');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        // ATUALIZA ATRIBUTOS ARIA PARA LEITORES DE TELA
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
        
        // LIMPA REFERÊNCIA SE ERA O DROPDOWN ATUAL
        if (this.currentDropdown === dropdown) {
            this.currentDropdown = null;
        }
        
        console.log('📁 Dropdown fechado');
    }

    // FECHA TODOS OS DROPDOWNS ABERTOS NA PÁGINA
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            this.closeDropdown(dropdown);
        });
    }

    // FECHA APENAS O DROPDOWN ATUALMENTE ABERTO
    closeCurrentDropdown() {
        if (this.currentDropdown) {
            this.closeDropdown(this.currentDropdown);
        }
    }

    // MOVE FOCO PARA PRIMEIRO ITEM DO MENU DROPDOWN
    focusFirstMenuItem(dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            const firstItem = menu.querySelector('a');
            if (firstItem) {
                firstItem.focus();
                console.log('🔽 Foco no primeiro item do menu');
            }
        }
    }

    // MOVE FOCO PARA ÚLTIMO ITEM DO MENU DROPDOWN
    focusLastMenuItem(dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            const menuItems = menu.querySelectorAll('a');
            if (menuItems.length > 0) {
                menuItems[menuItems.length - 1].focus();
                console.log('🔼 Foco no último item do menu');
            }
        }
    }
    
    // DESTRUIDOR — LIMPEZA DE ESTADO PARA SPA
    // RESETA REFERÊNCIAS A ELEMENTOS REMOVIDOS ENTRE NAVEGAÇÕES
    destroy() {
        this.currentDropdown = null;
        this.isModalOpen = false;
    }
}

// INICIALIZAÇÃO CORRIGIDA — GERENCIA INSTÂNCIAS ÚNICAS E EVITA DUPLICAÇÃO
const initializeKeyboardNavigation = () => {
    
    // DESTRÓI INSTÂNCIA ANTERIOR SE EXISTIR — PREVINE MEMORY LEAKS EM SPA
    if (window.keyboardNavigationInstance) {
        window.keyboardNavigationInstance.destroy();
    }
    
    window.keyboardNavigationInstance = new KeyboardNavigation();
    return true;
};

// INICIALIZAÇÃO AUTOMÁTICA — EXECUTA AO CARREGAR DOM OU DIRETAMENTE SE JÁ PRONTO
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeKeyboardNavigation);
} else {
    initializeKeyboardNavigation();
}

// COMPATIBILIDADE COM SPA — REINICIALIZA NAVEGAÇÃO AO MUDAR DE ROTA
window.addEventListener('hashchange', () => {

    // DELAY PARA GARANTIR QUE NOVO CONTEÚDO FOI CARREGADO NO DOM
    setTimeout(() => {
        if (window.keyboardNavigationInstance) {
            
            // RECONFIGURA SISTEMAS DE NAVEGAÇÃO PARA NOVA PÁGINA
            window.keyboardNavigationInstance.setupDropdownNavigation();
            window.keyboardNavigationInstance.setupDropdownMenuNavigation();
            window.keyboardNavigationInstance.setupModalNavigation();
        } else {
            initializeKeyboardNavigation();
        }
    }, 100);
});

// INTERCEPTAÇÃO DO HISTORY API — REINICIALIZA NAVEGAÇÃO EM MUDANÇAS SPA
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

// SOBRESCREVE pushState PARA REINICIALIZAR NAVEGAÇÃO APÓS MUDANÇAS DE ROTA
history.pushState = function(...args) {
    originalPushState.apply(this, args);
    setTimeout(initializeKeyboardNavigation, 50);
};

// SOBRESCREVE replaceState PARA REINICIALIZAR NAVEGAÇÃO APÓS MUDANÇAS DE ROTA
history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    setTimeout(initializeKeyboardNavigation, 50);
};

// EXPORTA CLASSE PARA USO GLOBAL — PERMITE ACESSO EXTERNO E TESTES
window.KeyboardNavigation = KeyboardNavigation;