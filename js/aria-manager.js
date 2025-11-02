//    PLATAFORMA WEB – ONG
//    DESENVOLVIDO POR: JAYME SANCHES FILHO
//    INSTITUIÇÃO: UNIVERSIDADE CRUZEIRO DO SUL
//    DISCIPLINA: DESENVOLVIMENTO FRONT—END PARA WEB
//    EXPERIÊNCIA PRÁTICA — ENTREGA 4 (VERSIONAMENTO, ACESSIBILIDADE E DEPLOY)
//    DATA: 01/11/2025

//    ARIA-MANAGER.JS — SISTEMA COMPLETO PARA LEITORES DE TELA
//    GERENCIA ATRIBUTOS ARIA, ROLES E ESTADOS DE ACESSIBILIDADE DINÂMICOS

class AriaManager {
    constructor() {
        this.observedElements = new Set();
        this.init();
    }

    // INICIALIZAÇÃO PRINCIPAL — CONFIGURA TODOS OS SISTEMAS ARIA
    init() {
        this.setupAriaAttributes();
        this.setupLiveRegions();
        this.setupDynamicAriaObservers();
        this.setupSPACompatibility();
        
        console.log('✅ ARIA MANAGER INICIALIZADO - SUPORTE LEITORES DE TELA ATIVO');
    }

    // 1. CONFIGURA ATRIBUTOS ARIA ESTÁTICOS NOS ELEMENTOS EXISTENTES
    setupAriaAttributes() {

        // CONFIGURA ALERTA EDUCACIONAL
        const alert = document.querySelector('.alert-educational');
        if (alert) {
            alert.setAttribute('role', 'complementary');
            alert.setAttribute('aria-label', 'Informação educativa sobre combate ao antissemitismo');
            this.observedElements.add(alert);
        }

        // CONFIGURA TOAST DE BOAS-VINDAS
        const toast = document.querySelector('.toast-auto');
        if (toast) {
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.setAttribute('aria-atomic', 'true');
        }

        // CONFIGURA MODAL
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalContent = document.querySelector('.modal-content');
        if (modalOverlay && modalContent) {
            modalOverlay.setAttribute('aria-hidden', 'true');
            modalContent.setAttribute('aria-describedby', 'modal-desc');
        }

        // CONFIGURA IMAGENS DECORATIVAS NO FOOTER
        document.querySelectorAll('.footer-sns img').forEach(img => {
            img.setAttribute('role', 'presentation');
            img.setAttribute('alt', '');
        });

        console.log('🎯 Atributos ARIA estáticos configurados');
    }

    // 2. CONFIGURA LIVE REGIONS PARA ATUALIZAÇÕES DINÂMICAS
    setupLiveRegions() {

        // CRIA LIVE REGION PARA MENSAGENS DO SISTEMA
        if (!document.getElementById('live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }

        // OBSERVA ALTERAÇÕES NO CONTEÚDO PRINCIPAL (SPA)
        const mainContent = document.getElementById('app');
        if (mainContent) {
            this.observeContentChanges(mainContent);
        }
    }

    // 3. OBSERVA ALTERAÇÕES DINÂMICAS NO CONTEÚDO (SPA)
    observeContentChanges(element) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.processNewContent(node);
                        }
                    });
                }
            });
        });

        observer.observe(element, {
            childList: true,
            subtree: true
        });

        console.log('👀 Observador de conteúdo SPA ativo');
    }

    // 4. PROCESSA NOVO CONTEÚDO ADICIONADO DINAMICAMENTE
    processNewContent(element) {

        // CONFIGURA FORMULÁRIOS DINÂMICOS
        const forms = element.querySelectorAll ? element.querySelectorAll('form') : [];
        forms.forEach(form => {
            if (!form.hasAttribute('aria-labelledby')) {
                const legend = form.querySelector('legend');
                if (legend && !legend.id) {
                    legend.id = 'form-legend-' + Date.now();
                    form.setAttribute('aria-labelledby', legend.id);
                }
            }
        });

        // CONFIGURA SEÇÕES DINÂMICAS
        const sections = element.querySelectorAll ? element.querySelectorAll('section') : [];
        sections.forEach(section => {
            if (!section.hasAttribute('aria-labelledby') && !section.hasAttribute('aria-label')) {
                const heading = section.querySelector('h2, h3, h4');
                if (heading && !heading.id) {
                    heading.id = 'section-heading-' + Date.now();
                    section.setAttribute('aria-labelledby', heading.id);
                }
            }
        });

        // CONFIGURA LINKS ATIVOS NA NAVEGAÇÃO SPA
        this.updateActiveNavigation();
    }

    // 5. ATUALIZA INDICADOR DE PÁGINA ATIVA NA NAVEGAÇÃO
    updateActiveNavigation() {
        const currentHash = window.location.hash;
        const navLinks = document.querySelectorAll('.nav-menu a[role="menuitem"]');
        
        navLinks.forEach(link => {
            const linkHash = link.getAttribute('href');
            if (linkHash === currentHash || (currentHash === '#/' && linkHash === '#/')) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    // 6. GERENCIA ESTADOS DINÂMICOS DE COMPONENTES INTERATIVOS
    setupDynamicAriaObservers() {

        // OBSERVA ESTADOS DE DROPDOWNS (COLABORAÇÃO COM KEYBOARD-NAVIGATOR)
        this.observeDropdownStates();
        
        // OBSERVA ESTADOS DE MODAL
        this.observeModalStates();
        
        // OBSERVA ESTADOS DE ALERTA EDUCACIONAL
        this.observeAlertStates();
    }

    // 6.1 OBSERVA E SINCRONIZA ESTADOS DE DROPDOWNS
    observeDropdownStates() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {

            // OBSERVA ALTERAÇÕES DE CLASSE 'active'
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isActive = dropdown.classList.contains('active');
                        const toggle = dropdown.querySelector('.dropdown-toggle');
                        const menu = dropdown.querySelector('.dropdown-menu');
                        
                        if (toggle) {
                            toggle.setAttribute('aria-expanded', isActive.toString());
                        }
                        if (menu) {
                            menu.setAttribute('aria-hidden', (!isActive).toString());
                        }
                    }
                });
            });

            observer.observe(dropdown, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    // 6.2 OBSERVA E SINCRONIZA ESTADOS DE MODAL
    observeModalStates() {
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalBtn = document.querySelector('.modal-btn');
        
        if (modalOverlay && modalBtn) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                        const isVisible = modalOverlay.classList.contains('active') || 
                                        modalOverlay.style.display === 'flex';
                        
                        modalOverlay.setAttribute('aria-hidden', (!isVisible).toString());
                        modalBtn.setAttribute('aria-expanded', isVisible.toString());
                        
                        // TRAP FOCUS QUANDO MODAL ESTIVER ABERTO
                        if (isVisible) {
                            this.trapModalFocus();
                        }
                    }
                });
            });

            observer.observe(modalOverlay, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }
    }

    // 6.3 OBSERVA ESTADOS DE ALERTA EDUCACIONAL
    observeAlertStates() {
        const alert = document.querySelector('.alert-educational');
        
        if (alert) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isExpanded = alert.classList.contains('expanded');
                        alert.setAttribute('aria-expanded', isExpanded.toString());
                        
                        // ANUNCIA EXPANSÃO/RECOLHIMENTO PARA LEITORES DE TELA
                        if (isExpanded) {
                            this.announceToScreenReader('Informação educativa expandida');
                        } else {
                            this.announceToScreenReader('Informação educativa recolhida');
                        }
                    }
                });
            });

            observer.observe(alert, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    // 7. TRAP FOCUS DENTRO DO MODAL (COLABORAÇÃO COM KEYBOARD-NAVIGATOR)
    trapModalFocus() {
        const modalContent = document.querySelector('.modal-content');
        if (!modalContent) return;

        const focusableElements = modalContent.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            // AGENDA FOCO PARA O BOTÃO FECHAR
            setTimeout(() => {
                const closeButton = modalContent.querySelector('.modal-close');
                if (closeButton) {
                    closeButton.focus();
                }
            }, 100);
        }
    }

    // 8. ANUNCIA MENSAGENS PARA LEITORES DE TELA
    announceToScreenReader(message, priority = 'polite') {
        let liveRegion = document.getElementById('live-region');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }

        // ATUALIZA MENSAGEM NA LIVE REGION
        liveRegion.textContent = message;
        
        // LIMPA MENSAGEM APÓS LEITURA
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 3000);

        console.log('🗣️ Anúncio para leitor de tela:', message);
    }

    // 9. COMPATIBILIDADE COM SPA - REINICIALIZA EM MUDANÇAS DE ROTA
    setupSPACompatibility() {
        
        // OBSERVA MUDANÇAS DE HASH (SPA ROUTER)
        window.addEventListener('hashchange', () => {
            setTimeout(() => {
                this.updateActiveNavigation();
                this.processNewContent(document.getElementById('app'));
            }, 100);
        });

        // INTERCEPTA HISTORY API (SPA)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(() => window.dispatchEvent(new Event('hashchange')), 50);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(() => window.dispatchEvent(new Event('hashchange')), 50);
        };
    }

    // 10. MÉTODO PARA ATUALIZAÇÃO MANUAL DE ESTADOS ARIA
    updateAriaState(element, states) {
        if (!element) return;
        
        Object.keys(states).forEach(attribute => {
            if (states[attribute] === null) {
                element.removeAttribute(attribute);
            } else {
                element.setAttribute(attribute, states[attribute]);
            }
        });
        
        this.observedElements.add(element);
    }

    // 11. DESTRUIDOR - LIMPEZA PARA SPA
    destroy() {
        this.observedElements.clear();
        console.log('🧹 ARIA Manager destruído');
    }
}

// INICIALIZAÇÃO AUTOMÁTICA
const initializeAriaManager = () => {
    if (window.ariaManagerInstance) {
        window.ariaManagerInstance.destroy();
    }
    
    window.ariaManagerInstance = new AriaManager();
    return true;
};

// INICIALIZAÇÃO NO CARREGAMENTO DA PÁGINA
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAriaManager);
} else {
    initializeAriaManager();
}

// COMPATIBILIDADE COM SPA - REINICIALIZA EM MUDANÇAS DE CONTEÚDO
window.addEventListener('hashchange', () => {
    setTimeout(() => {
        if (window.ariaManagerInstance) {
            window.ariaManagerInstance.setupAriaAttributes();
        } else {
            initializeAriaManager();
        }
    }, 150);
});

// EXPORTAÇÃO PARA USO GLOBAL
window.AriaManager = AriaManager;