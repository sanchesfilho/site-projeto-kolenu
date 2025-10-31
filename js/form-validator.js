//    PLATAFORMA WEB – ONG
//    DESENVOLVIDO POR: JAYME SANCHES FILHO
//    INSTITUIÇÃO: UNIVERSIDADE CRUZEIRO DO SUL
//    DISCIPLINA: DESENVOLVIMENTO FRONT—END PARA WEB
//    EXPERIÊNCIA PRÁTICA — ENTREGA 3 (INTERATIVIDADE E FUNCIONALIDADES)
//    DATA: 31/10/2025

// FORM-VALIDATOR.JS: SISTEMA UNIFICADO DE VALIDAÇÃO E ENVIO

// VERIFICAÇÃO DE DUPLICAÇÃO
if (typeof FormValidator !== 'undefined') {
    console.log('🔄 FormValidator já carregado - ignorando duplicata');
} else {
    
    // CLASSE PRINCIPAL UNIFICADA - GERENCIA VALIDAÇÃO E ENVIO
    class FormValidator {
        constructor(formId) {
            this.form = document.getElementById(formId);
            this.fields = this.form.querySelectorAll('input, select, textarea');
            this.submitButton = document.getElementById('submit-button');
            this.successMessage = document.getElementById('success-message');
            this.loadingSpinner = document.getElementById('loading-spinner');
            this.init();
        }

        // INICIALIZAÇÃO UNIFICADA
        init() {

            // CONFIGURA EVENTOS DE VALIDAÇÃO
            this.fields.forEach(field => {
                if (field.id === 'cpf' || field.id === 'telefone' || field.id === 'cep') {
                    field.addEventListener('input', (e) => this.applyMask(e));
                }
                
                field.addEventListener('input', () => this.validateField(field));
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('focus', () => this.showFieldHint(field));
            });

            // EVENTO DE SUBMIT UNIFICADO
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            console.log('✅ SISTEMA DE VALIDAÇÃO E ENVIO INICIALIZADO');
        }

        // MANIPULAÇÃO UNIFICADA DO ENVIO
        async handleSubmit(e) {
            e.preventDefault();
            
            console.log('🔄 Iniciando processo de envio...');
            
            // VALIDAÇÃO FINAL ANTES DO ENVIO
            let isFormValid = true;
            const invalidFields = [];

            this.fields.forEach(field => {
                if (field.required && !this.validateField(field)) {
                    isFormValid = false;
                    invalidFields.push(field);
                }
            });

            if (!isFormValid) {
                this.showErrors(invalidFields);
                return false;
            }

            // SE VALIDAÇÃO PASSOU, PROCEDE COM ENVIO
            await this.submitForm();
        }

        // SISTEMA DE ENVIO DO FORMULÁRIO
        async submitForm() {
            // MOSTRA LOADING
            this.showLoading(true);

            try {

                // SIMULA ENVIO PARA BACKEND
                await this.submitToBackend();
                
                // SUCESSO
                this.showSuccess();
                
            } catch (error) {

                // ERRO NO ENVIO
                this.showError('Erro ao enviar formulário. Tente novamente.');
            } finally {

                // ESCONDE LOADING
                this.showLoading(false);
            }
        }

        // SIMULA ENVIO PARA BACKEND
        async submitToBackend() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.05) {
                        resolve({
                            success: true,
                            message: 'Formulário enviado com sucesso!'
                        });
                    } else {
                        reject(new Error('Erro de conexão'));
                    }
                }, 2000);
            });
        }

        // CONTROLE DE LOADING
        showLoading(show) {
            if (show) {
                this.loadingSpinner.style.display = 'block';
                this.submitButton.disabled = true;
                this.submitButton.textContent = 'Enviando...';
                this.submitButton.classList.add('button-loading');
                console.log('🔄 Loading spinner ativado');
            } else {
                this.loadingSpinner.style.display = 'none';
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Enviar meu cadastro';
                this.submitButton.classList.remove('button-loading');
                console.log('✅ Loading spinner desativado');
            }
        }

        // EXIBE SUCESSO APÓS ENVIO - VERSÃO CORRIGIDA COM ALERTA CLICÁVEL
        showSuccess() {
            console.log('🎉 EXIBINDO MENSAGEM DE SUCESSO');
            
            // RESETA O FORMULÁRIO (MAS MANTÉM ELE VISÍVEL)
            this.form.reset();
            console.log('✅ Formulário resetado (campos limpos)');
            
            // LIMPA OS ESTADOS DE VALIDAÇÃO DOS CAMPOS
            this.fields.forEach(field => this.clearFieldStatus(field));
            console.log('✅ Estados de validação limpos');

            console.log('🎉 FORMULÁRIO ENVIADO COM SUCESSO!');
            console.log('📊 Dados enviados:', this.collectFormData());

            // MOSTRA ALERTA DE SUCESSO CLICÁVEL
            this.showSuccessAlert();
        }

        // ✅ ALERTA DE SUCESSO CLICÁVEL
        showSuccessAlert() {

            // CRIA O ALERTA
            const alertOverlay = document.createElement('div');
            alertOverlay.className = 'success-alert-overlay';
            alertOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            `;

            const alertBox = document.createElement('div');
            alertBox.className = 'success-alert-box';
            alertBox.style.cssText = `
                background: #E0EBFF;
                border: 3px solid #0038B8;
                border-radius: 12px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                position: relative;
                animation: slideDown 0.3s ease;
            `;

            // BOTÃO FECHAR
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 28px;
                color: #2c3e50;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            `;

            closeButton.addEventListener('mouseover', function() {
                this.style.background = '#0038B8';
                this.style.color = 'white';
            });

            closeButton.addEventListener('mouseout', function() {
                this.style.background = 'none';
                this.style.color = '#2c3e50';
            });

            // TÍTULO
            const title = document.createElement('h3');
            title.textContent = '✓ CADASTRO ENVIADO COM SUCESSO!';
            title.style.cssText = `
                color: #001E60;
                margin: 0 0 15px 0;
                font-size: 1.4rem;
                font-weight: bold;
            `;

            // MENSAGEM
            const message = document.createElement('p');
            message.textContent = 'Obrigado por se inscrever como voluntário no Projeto KOLENU. Entraremos em contato em breve para lhe passar mais informações a respeito da iniciativa que você escolheu.';
            message.style.cssText = `
                color: #2c3e50;
                margin: 0;
                line-height: 1.6;
                font-size: 1rem;
            `;

            // BOTÃO OK
            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.cssText = `
                background: #3498db;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                margin-top: 20px;
                transition: all 0.2s ease;
            `;

            okButton.addEventListener('mouseover', function() {
                this.style.background = '#0038B8';
                this.style.transform = 'translateY(-2px)';
            });

            okButton.addEventListener('mouseout', function() {
                this.style.background = '#3498db';
                this.style.transform = 'translateY(0)';
            });

            // MONTAGEM DO ALERTA
            alertBox.appendChild(closeButton);
            alertBox.appendChild(title);
            alertBox.appendChild(message);
            alertBox.appendChild(okButton);
            alertOverlay.appendChild(alertBox);
            document.body.appendChild(alertOverlay);

            // FUNÇÕES DE FECHAMENTO
            const closeAlert = () => {
                alertOverlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (alertOverlay.parentNode) {
                        alertOverlay.parentNode.removeChild(alertOverlay);
                    }
                }, 300);
            };

            closeButton.addEventListener('click', closeAlert);
            okButton.addEventListener('click', closeAlert);
            alertOverlay.addEventListener('click', (e) => {
                if (e.target === alertOverlay) {
                    closeAlert();
                }
            });

            // FOCO NO BOTÃO OK
            okButton.focus();
        }

        // COLETA OS DADOS DO FORMULÁRIO
        collectFormData() {
            const formData = new FormData(this.form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            return data;
        }

        // MÉTODOS DE VALIDAÇÃO
        applyMask(event) {
            const field = event.target;
            let value = field.value.replace(/\D/g, '');
            
            switch(field.id) {
                case 'cpf':
                    if (value.length <= 11) {
                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                        value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
                        value = value.substring(0, 14);
                    }
                    break;
                    
                case 'telefone':
                    if (value.length <= 11) {
                        value = value.replace(/(\d{2})(\d)/, '($1) $2');
                        if (value.length > 10) {
                            value = value.replace(/(\(\d{2}\) \d{5})(\d)/, '$1-$2');
                        } else {
                            value = value.replace(/(\(\d{2}\) \d{4})(\d)/, '$1-$2');
                        }
                        value = value.substring(0, 15);
                    }
                    break;
                    
                case 'cep':
                    if (value.length <= 8) {
                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                        value = value.substring(0, 9);
                    }
                    break;
            }
            
            field.value = value;
        }

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let message = '';

            this.clearFieldStatus(field);

            switch(field.type) {
                case 'text':
                    isValid = this.validateText(field, value);
                    switch(field.id) {
                        case 'nome':
                            message = '👤 Nome deve conter apenas letras e ter entre 2 e 50 caracteres';
                            break;
                        case 'rua':
                            message = '🏠 Rua deve ter pelo menos 2 caracteres';
                            break;
                        case 'complemento':
                            message = '📍 Complemento deve ter pelo menos 2 caracteres';
                            break;
                        case 'cidade':
                            message = '🏙️ Cidade deve ter apenas letras e pelo menos 2 caracteres';
                            break;
                        default:
                            message = '📝 Campo deve ter pelo menos 2 caracteres';
                    }
                    break;
                case 'email':
                    isValid = this.validateEmail(value);
                    message = '📧 Formato de e-mail inválido (exemplo: usuario@email.com)';
                    break;
                case 'tel':
                    isValid = this.validatePhone(value);
                    message = '📞 Formato de telefone inválido (formato: (00) 00000-0000)';
                    break;
                case 'date':
                    isValid = this.validateDate(field, value);
                    message = '📅 Data de nascimento inválida ou futura';
                    break;
            }

            if (field.id === 'cpf') {
                isValid = this.validateCPF(value);
                message = '🔢 CPF inválido (formato: 000.000.000-00)';
            }

            if (field.id === 'cep') {
                isValid = this.validateCEP(value);
                message = '📮 CEP inválido (formato: 00000-000)';
            }

            if (!isValid && value.length > 0) {
                this.setFieldInvalid(field, message);
            } else if (isValid && value.length > 0) {
                this.setFieldValid(field);
            }

            return isValid;
        }

        validateText(field, value) {
            switch(field.id) {
                case 'nome':
                    return /^[A-Za-zÀ-ÿ\s\-']{2,50}$/.test(value);
                case 'rua':
                    return value.length >= 2;
                case 'complemento':
                    return value.length >= 2;
                case 'cidade':
                    return /^[A-Za-zÀ-ÿ\s\-']{2,}$/.test(value);
                default:
                    return value.length >= 2;
            }
        }

        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        validatePhone(phone) {
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            return phoneRegex.test(phone);
        }

        validateCPF(cpf) {
            cpf = cpf.replace(/\D/g, '');
            return cpf.length === 11;
        }

        validateCEP(cep) {
            const cepRegex = /^\d{5}-\d{3}$/;
            return cepRegex.test(cep);
        }

        validateDate(field, dateString) {
            if (!dateString) return false;
            const inputDate = new Date(dateString);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return inputDate <= today;
        }

        setFieldValid(field) {
            field.classList.remove('field-invalid');
            field.classList.add('field-valid');
            const messageElement = field.parentNode.querySelector('.field-message');
            if (messageElement) {
                messageElement.style.display = 'none';
            }
        }

        setFieldInvalid(field, message) {
            field.classList.remove('field-valid');
            field.classList.add('field-invalid');
            
            let messageElement = field.parentNode.querySelector('.field-message');
            if (!messageElement) {
                messageElement = document.createElement('div');
                messageElement.className = 'field-message';
                field.parentNode.appendChild(messageElement);
            }
            
            messageElement.textContent = message;
            messageElement.style.display = 'block';
        }

        clearFieldStatus(field) {
            field.classList.remove('field-valid', 'field-invalid');
            const messageElement = field.parentNode.querySelector('.field-message');
            if (messageElement) {
                messageElement.style.display = 'none';
            }
        }

        showFieldHint(field) {
            console.log(`💡 Dica para ${field.name}: ${this.getFieldHint(field)}`);
        }

        getFieldHint(field) {
            const hints = {
                nome: 'Digite seu nome completo (apenas letras, 2-50 caracteres)',
                email: 'exemplo@email.com',
                telefone: 'Digite apenas números - será formatado automaticamente',
                cpf: 'Digite apenas números - será formatado automaticamente',
                cep: 'Digite apenas números - será formatado automaticamente',
                nascimento: 'DD/MM/AAAA',
                rua: 'Digite o nome da rua (mínimo 2 caracteres)',
                complemento: 'Digite complemento (apto, casa, etc.)',
                cidade: 'Digite o nome da cidade (apenas letras)'
            };
            return hints[field.name] || hints[field.id] || 'Preencha este campo corretamente';
        }

        showErrors(invalidFields) {
            console.log('❌ ERROS NO FORMULÁRIO:', invalidFields);
            
            if (invalidFields.length > 0) {
                invalidFields[0].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                invalidFields[0].focus();
            }

            this.showToast('❌ Verifique os campos destacados em vermelho');
        }

        showError(message) {
            this.showToast(`❌ ${message}`);
            
            const invalidFields = this.form.querySelectorAll(':invalid');
            invalidFields.forEach(field => {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
            });
        }

        showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'validation-toast';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #e74c3c;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 4000);
        }
    }

    // EXPORTA A CLASSE
    window.FormValidator = FormValidator;
}

// SISTEMA DE INICIALIZAÇÃO
const initializeFormValidator = () => {
    if (window.formValidatorInstance) {
        console.log('🔄 Validador já inicializado - ignorando duplicata');
        return true;
    }
    
    const form = document.getElementById('form-cadastro');
    if (form) {
        console.log('🚀 INICIALIZANDO SISTEMA UNIFICADO DE FORMULÁRIO');
        window.formValidatorInstance = new FormValidator('form-cadastro');
        return true;
    }
    
    return false;
};

// INICIALIZAÇÃO
if (!initializeFormValidator()) {
    console.log('⏳ Formulário não encontrado - aguardando carregamento...');
    
    const validationAttempts = setInterval(() => {
        if (initializeFormValidator()) {
            console.log('✅ Validador inicializado via verificação contínua');
            clearInterval(validationAttempts);
        }
    }, 100);
    
    setTimeout(() => {
        clearInterval(validationAttempts);
        if (!window.formValidatorInstance) {
            console.log('⏰ Timeout: Formulário não carregado após 10 segundos');
        }
    }, 10000);
}

// COMPATIBILIDADE COM CARREGAMENTO TRADICIONAL
document.addEventListener('DOMContentLoaded', function() {
    if (!window.formValidatorInstance) {
        initializeFormValidator();
    }
});