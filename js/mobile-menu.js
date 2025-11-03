//    PLATAFORMA WEB – ONG
//    DESENVOLVIDO POR: JAYME SANCHES FILHO
//    INSTITUIÇÃO: UNIVERSIDADE CRUZEIRO DO SUL
//    DISCIPLINA: DESENVOLVIMENTO FRONT—END PARA WEB
//    EXPERIÊNCIA PRÁTICA — ENTREGA 4 (VERSIONAMENTO, ACESSIBILIDADE E DEPLOY)
//    DATA: 02/11/2025

// MOBILE-MENU.JS: SISTEMA DE MENU MOBILE OTIMIZADO COM ANIMAÇÕES SUAVES E SUPORTE A MODOS ESCURO E ALTO CONTRASTE

// VARIÁVEIS GLOBAIS — REFERÊNCIAS A ELEMENTOS DO DOM
let menuToggle;           // BOTÃO HAMBÚRGUER
let navMenu;              // CONTAINER DO MENU
let dropdownToggles;      // BOTÕES DE SUBMENU
let isMenuOpen = false;   // ESTADO DO MENU

// INICIALIZAÇÃO — CONFIGURA EVENT LISTENERS APÓS CARREGAMENTO DO DOM
document.addEventListener('DOMContentLoaded', function() {
    inicializarMenuMobile();
});

// FUNÇÃO PRINCIPAL — CONFIGURA TODOS OS ELEMENTOS DO MENU MOBILE
function inicializarMenuMobile() {
    
    // CAPTURA ELEMENTOS DO DOM
    menuToggle = document.querySelector('.menu-button');
    navMenu = document.querySelector('.nav-menu');
    
    // VERIFICA SE ESTÁ EM DISPOSITIVO MOBILE (< 768px)
    if (window.innerWidth < 768 && menuToggle && navMenu) {
        configurarMenuMobile();
        aplicarEstilosMobile();
    }
}

// CONFIGURAÇÃO DOS EVENT LISTENERS E COMPORTAMENTOS DO MENU
function configurarMenuMobile() {

    // EVENT LISTENER PARA BOTÃO HAMBÚRGUER
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        toggleMenu();
    });
    
    // EVENT LISTENER PARA FECHAR MENU AO CLICAR FORA
    document.addEventListener('click', function(e) {

        // VERIFICA SE O CLIQUE FOI FORA DO MENU E DO BOTÃO HAMBÚRGUER
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnToggle = e.target === menuToggle || menuToggle.contains(e.target);
        
        if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
            fecharMenu();
        }
    });
    
    // EVENT LISTENER PARA BOTÕES DE SUBMENU
    configurarDropdownsMobile();
    
    // EVENT LISTENER PARA REDIMENSIONAMENTO DA JANELA
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            restaurarMenuDesktop();
        } else if (window.innerWidth < 768) {
            aplicarEstilosMobile();
        }
    });
    
    // EVENT LISTENER PARA TECLA ESC — FECHAR MENU
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            fecharMenu();
        }
    });
}

// CONFIGURA COMPORTAMENTO DOS SUBMENUS NO MODO MOBILE
function configurarDropdownsMobile() {
    dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.parentElement;
            const dropdownMenu = this.nextElementSibling;
            
            // ALTERNA ESTADO DO SUBMENU
            if (dropdown.classList.contains('active')) {
                fecharDropdown(dropdown, dropdownMenu);
            } else {
                abrirDropdown(dropdown, dropdownMenu);
            }
        });
    });
}

// ABRE SUBMENU COM ANIMAÇÃO
function abrirDropdown(dropdown, dropdownMenu) {

    // FECHA OUTROS SUBMENUS ABERTOS
    document.querySelectorAll('.dropdown.active').forEach(item => {
        if (item !== dropdown) {
            fecharDropdown(item, item.querySelector('.dropdown-menu'));
        }
    });
    
    // ABRE SUBMENU ATUAL
    dropdown.classList.add('active');
    dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + 'px';
    
    // ATUALIZA ATRIBUTOS ARIA
    dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
    
    // ANIMA SETA DO DROPDOWN
    const arrow = dropdown.querySelector('.mobile-arrow');
    if (arrow) {
        arrow.style.transform = 'rotate(90deg)';
    }
}

// FECHA SUBMENU COM ANIMAÇÃO
function fecharDropdown(dropdown, dropdownMenu) {
    dropdown.classList.remove('active');
    dropdownMenu.style.maxHeight = '0';
    
    // ATUALIZA ATRIBUTOS ARIA
    dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    
    // RESTAURA SETA DO DROPDOWN
    const arrow = dropdown.querySelector('.mobile-arrow');
    if (arrow) {
        arrow.style.transform = 'rotate(0deg)';
    }
}

// ALTERNA ESTADO DO MENU PRINCIPAL
function toggleMenu() {
    if (isMenuOpen) {
        fecharMenu();
    } else {
        abrirMenu();
    }
}

// ANIMAÇÃO DO BOTÃO HAMBÚRGUER — TRANSFORMAÇÃO EM X
function animarHamburguer(abrir) {
    const spans = menuToggle.querySelectorAll('span');
    
    if (abrir) {

        // TRANSFORMAÇÃO: HAMBÚRGUER → X
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        
        // TRANSFORMAÇÃO: X → HAMBÚRGUER
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ABRE MENU MOBILE COM ANIMAÇÃO
function abrirMenu() {
    navMenu.style.display = 'flex';
    
    // ANIMAÇÃO DE ENTRADA DO MENU
    setTimeout(() => {
        navMenu.style.transform = 'translateX(0)';
        navMenu.style.opacity = '1';
    }, 10);
    
    // ANIMAÇÃO DO BOTÃO HAMBÚRGUER — TRANSFORMA EM X
    animarHamburguer(true);
    
    // ATUALIZA ESTADO E ATRIBUTOS ARIA
    isMenuOpen = true;
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // BLOQUEIA SCROLL DA PÁGINA
    
    // ADICIONA OVERLAY
    adicionarOverlay();
    
    // FOCA NO PRIMEIRO ITEM DO MENU PARA ACESSIBILIDADE
    setTimeout(() => {
        const firstMenuItem = navMenu.querySelector('a, .dropdown-toggle');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }, 300);
}

// FECHA MENU MOBILE COM ANIMAÇÃO
function fecharMenu() {
    navMenu.style.transform = 'translateX(-100%)';
    navMenu.style.opacity = '0';
    
    // AGUARDA ANIMAÇÃO ANTES DE ESCONDER
    setTimeout(() => {
        navMenu.style.display = 'none';
    }, 300);
    
    // ANIMAÇÃO DO BOTÃO HAMBÚRGUER — VOLTA PARA HAMBÚRGUER
    animarHamburguer(false);
    
    // ATUALIZA ESTADO E ATRIBUTOS ARIA
    isMenuOpen = false;
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // RESTAURA SCROLL DA PÁGINA
    
    // FECHA TODOS OS SUBMENUS
    document.querySelectorAll('.dropdown.active').forEach(dropdown => {
        fecharDropdown(dropdown, dropdown.querySelector('.dropdown-menu'));
    });
    
    // REMOVE OVERLAY
    removerOverlay();
    
    // RETORNA FOCO PARA O BOTÃO HAMBÚRGUER
    menuToggle.focus();
}

// ADICIONA OVERLAY ESCURO SOBRE O CONTEÚDO
function adicionarOverlay() {
    let overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // EVENT LISTENER PARA FECHAR MENU AO CLICAR NO OVERLAY
    overlay.addEventListener('click', function(e) {
        e.stopPropagation();
        fecharMenu();
    });
    
    document.body.appendChild(overlay);
    
    // ANIMAÇÃO DE ENTRADA DO OVERLAY
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
}

// REMOVE OVERLAY DO DOM
function removerOverlay() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.parentElement.removeChild(overlay);
            }
        }, 300);
    }
}

// APLICA ESTILOS ESPECÍFICOS PARA O MODO MOBILE
function aplicarEstilosMobile() {

    // CALCULA POSIÇÃO DO BOTÃO HAMBÚRGUER PARA POSICIONAR MENU
    const toggleRect = menuToggle.getBoundingClientRect();
    const menuTop = toggleRect.bottom + window.scrollY;
    
    // CALCULA OFFSET ADICIONAL DE 2% DA ALTURA DA TELA
    const offsetExtra = window.innerHeight * 0.02;
    const menuTopComOffset = menuTop + offsetExtra;
    
    // ESTILOS PARA MENU PRINCIPAL — POSICIONADO 2% ABAIXO HAMBÚRGUER
    if (navMenu) {
        navMenu.style.cssText = `
            position: fixed;
            top: ${menuTopComOffset}px !important;
            left: 0;
            width: 45% !important;
            height: calc(100vh - ${menuTopComOffset}px) !important;
            background: var(--current-nav-bg);
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 10px 0 0 0;
            gap: 0;
            transform: translateX(-100%);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1001 !important;
            overflow-y: auto;
            display: none;
            box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
            border-right: 1px solid var(--current-border);
            border-top: 1px solid var(--current-border);
        `;
    }
    
    // ESTILOS PARA ITENS DO MENU
    const menuItems = document.querySelectorAll('.nav-menu > li');
    menuItems.forEach(item => {
        item.style.cssText = `
            width: 100%;
            margin: 0;
            border-bottom: 1px solid var(--current-border);
        `;
        
        // LINKS PRINCIPAIS — ÁREA CLICÁVEL AMPLA
        const link = item.querySelector('a:not(.dropdown-toggle)');
        if (link) {
            link.style.cssText = `
                display: block;
                padding: var(--space-lg) var(--space-md);
                font-size: var(--text-sm);
                width: 100%;
                min-height: 44px;
                text-decoration: none;
                color: var(--current-text);
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                cursor: pointer;
            `;
            
            // EFEITO HOVER PARA LINKS
            link.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--current-background)';
            });
            link.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
        }
        
        // BOTÕES DROPDOWN — SETA E ÁREA CLICÁVEL
        const dropdownToggle = item.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: var(--space-lg) var(--space-md);
                font-size: var(--text-sm);
                min-height: 44px;
                text-decoration: none;
                color: var(--current-text);
                background: none;
                border: none;
                font-family: inherit;
                cursor: pointer;
            `;
            
            // EFEITO HOVER PARA DROPDOWN TOGGLE
            dropdownToggle.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--current-background)';
            });
            dropdownToggle.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            // SETA PARA DROPDOWN
            if (!dropdownToggle.querySelector('.mobile-arrow')) {
                const arrow = document.createElement('span');
                arrow.className = 'mobile-arrow';
                arrow.innerHTML = '›';
                arrow.style.cssText = `
                    font-size: 1.2em;
                    transition: transform 0.3s ease;
                    margin-left: auto;
                `;
                dropdownToggle.appendChild(arrow);
            }
        }
        
        // SUBMENUS — ANIMAÇÃO DE EXPANSÃO
        const dropdownMenu = item.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.cssText = `
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                background: var(--current-background-alt);
                padding: 0;
            `;
            
            // LINKS DO SUBMENU
            const subLinks = dropdownMenu.querySelectorAll('a');
            subLinks.forEach(subLink => {
                subLink.style.cssText = `
                    display: block;
                    padding: var(--space-md) var(--space-xl);
                    font-size: var(--text-xs);
                    min-height: 44px;
                    text-decoration: none;
                    color: var(--current-text);
                    border-bottom: 1px solid var(--current-border);
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                `;
                
                // EFEITO HOVER PARA SUBLINKS
                subLink.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = 'var(--current-background)';
                });
                subLink.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'transparent';
                });
            });
        }
    });
    
    // REMOVE BORDA DO ÚLTIMO ITEM
    if (menuItems.length > 0) {
        menuItems[menuItems.length - 1].style.borderBottom = 'none';
    }
}

// RESTAURA COMPORTAMENTO DESKTOP QUANDO TELA AUMENTA
function restaurarMenuDesktop() {
    if (navMenu) {

        // REMOVE ESTILOS MOBILE
        navMenu.removeAttribute('style');
        
        // RESTAURA DISPLAY ORIGINAL
        navMenu.style.display = '';
        
        // FECHA MENU SE ESTIVER ABERTO
        if (isMenuOpen) {
            fecharMenu();
        }
    }
    
    // RESTAURA COMPORTAMENTO DOS DROPDOWNS
    if (dropdownToggles) {
        dropdownToggles.forEach(toggle => {
            toggle.removeAttribute('style');
            
            // REMOVE SETAS MOBILE
            const arrow = toggle.querySelector('.mobile-arrow');
            if (arrow) {
                arrow.remove();
            }
        });
    }
    
    // RESTAURA ANIMAÇÃO DO HAMBÚRGUER PARA ESTADO ORIGINAL
    animarHamburguer(false);
    
    // RESTAURA ESTILOS DOS ITENS DO MENU
    const menuItems = document.querySelectorAll('.nav-menu > li');
    menuItems.forEach(item => {
        item.removeAttribute('style');
        
        const link = item.querySelector('a');
        if (link) link.removeAttribute('style');
        
        const dropdownMenu = item.querySelector('.dropdown-menu');
        if (dropdownMenu) dropdownMenu.removeAttribute('style');
    });
    
    // REMOVE OVERLAY SE EXISTIR
    removerOverlay();
}

// EVENT LISTENER PARA REDIRECIONAMENTO AO CLICAR EM LINKS DO MENU
document.addEventListener('click', function(e) {
    if (window.innerWidth < 768 && isMenuOpen) {
        const link = e.target.closest('a[href^="#/"]');
        if (link && !link.classList.contains('dropdown-toggle')) {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // FECHA MENU APÓS CLIQUE
            fecharMenu();
            
            // NAVEGA PARA PÁGINA
            setTimeout(() => {
                window.location.hash = href;
            }, 300);
        }
    }
});

// ATUALIZA POSIÇÃO DO MENU QUANDO PÁGINA É ROLADA
window.addEventListener('scroll', function() {
    if (window.innerWidth < 768 && navMenu) {
        const toggleRect = menuToggle.getBoundingClientRect();
        const menuTop = toggleRect.bottom + window.scrollY;
        
        // RECALCULA OFFSET ADICIONAL DE 2% DA ALTURA DA TELA
        const offsetExtra = window.innerHeight * 0.02;
        const menuTopComOffset = menuTop + offsetExtra;
        
        navMenu.style.top = `${menuTopComOffset}px`;
        navMenu.style.height = `calc(100vh - ${menuTopComOffset}px)`;
    }
});

// LOG DE INICIALIZAÇÃO
console.log('MOBILE MENU INICIALIZADO - POSICIONADO 2% ABAIXO HAMBÚRGUER');