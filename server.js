//    PLATAFORMA WEB – ONG
//    DESENVOLVIDO POR: JAYME SANCHES FILHO
//    INSTITUIÇÃO: UNIVERSIDADE CRUZEIRO DO SUL
//    DISCIPLINA: DESENVOLVIMENTO FRONT—END PARA WEB
//    EXPERIÊNCIA PRÁTICA — ENTREGA 3 (INTERATIVIDADE E FUNCIONALIDADES)
//    DATA: 31/10/2025

// SERVER.JS: CONFIGURA SERVIDOR NODE.JS PARA HOSPEDAGEM LOCAL

// MÓDULOS NATIVOS DO NODE.JS
const http = require('http');    // CRIA SERVIDOR HTTP
const fs = require('fs');        // MANIPULAÇÃO DE ARQUIVOS
const path = require('path');    // MANIPULAÇÃO DE CAMINHOS

// CONFIGURAÇÃO DO SERVIDOR
const port = 3000; // PORTA PADRÃO PARA DESENVOLVIMENTO NODE.JS

// MAPEAMENTO DE TIPOS MIME — DEFINE COMO O NAVEGADOR DEVE INTERPRETAR CADA EXTENSÃO
const mimeTypes = {
  '.html': 'text/html',        // PÁGINAS HTML
  '.js': 'text/javascript',    // ARQUIVOS JAVASCRIPT
  '.css': 'text/css',          // FOLHAS DE ESTILO
  '.json': 'application/json', // DADOS JSON
  '.png': 'image/png',         // IMAGENS PNG
  '.jpg': 'image/jpg',         // IMAGENS JPEG
  '.gif': 'image/gif',         // IMAGENS GIF
  '.ico': 'image/x-icon'       // ÍCONES DE FAVORITO
};

// CRIAÇÃO DO SERVIDOR HTTP
const server = http.createServer((req, res) => {
    // LOG DE REQUISIÇÕES — REGISTRA TODAS AS REQUESTS NO CONSOLE
    // console.log(`${new Date().toISOString()} — ${req.method} ${req.url}`);
    // 
    // LIMPEZA DE QUERY PARAMS — REMOVE PARÂMETROS DE URL (?KEY=VALUE)
    let filePath = req.url.split('?')[0];
    
    // ROTEAMENTO SPA (SINGLE PAGE APPLICATION) — DIRECIONA ROTAS PARA INDEX.HTML
    if (filePath === '/' || filePath === '/cadastro' || filePath === '/projetos') {
        filePath = '/index.html'; // SEMPRE RETORNA O CONTAINER SPA
        }
  
    // CONSTRUÇÃO DO CAMINHO ABSOLUTO — JUNTA DIRETÓRIO ATUAL COM CAMINHO REQUISITADO
    const fullPath = path.join(__dirname, filePath);
  
    // LEITURA E SERVIÇO DE ARQUIVOS
    fs.readFile(fullPath, (error, content) => {
        if (error) {

            // TRATAMENTO DE ARQUIVO NÃO ENCONTRADO
            if(error.code === 'ENOENT') {

                // FALLBACK SPA — PARA QUALQUER ROTA DESCONHECIDA, SERVE INDEX.HTML
                fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
                    if(err) {
                        
                        // ERRO CRÍTICO — INDEX.HTML NÃO EXISTE
                        res.writeHead(404);
                        res.end('ARQUIVO NÃO ENCONTRADO');
                    } else {
                        
                        // SPA CARREGADA — RETORNA CONTAINER PRINCIPAL
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                
                // ERRO INTERNO DO SERVIDOR
                res.writeHead(500);
                res.end('ERRO DO SERVIDOR: '+error.code);
            }
        } else {
            
            // ARQUIVO ENCONTRADO — DETERMINA TIPO MIME E ENVIA RESPOSTA
            const ext = path.extname(fullPath); // EXTRAI EXTENSÃO DO ARQUIVO
            const mimeType = mimeTypes[ext] || 'application/octet-stream'; // TIPO MIME OU PADRÃO BINÁRIO
            
            // RESPOSTA SUCESSO — ENVIA ARQUIVO COM HEADERS APROPRIADOS
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

// FUNÇÃO PARA OBTER ENDEREÇO IP DA REDE LOCAL
function getLocalIP() {

    // IMPORTA MÓDULO OS PARA ACESSAR INFORMAÇÕES DO SISTEMA
    const os = require('os');
    
    // OBTÉM TODAS AS INTERFACES DE REDE DO COMPUTADOR
    const interfaces = os.networkInterfaces();

    // PERCORRE TODAS AS INTERFACES DE REDE DISPONÍVEIS
    for (const interfaceName in interfaces) {

        // PERCORRE CADA CONFIGURAÇÃO DE IP DENTRO DA INTERFACE
        for (const interface of interfaces[interfaceName]) {
            
            // FILTRA APENAS ENDEREÇOS IPV4 QUE NÃO SÃO INTERNOS (NÃO 127.0.0.1)
            if (interface.family === 'IPv4' && !interface.internal) {
                
                // RETORNA O PRIMEIRO IP VÁLIDO ENCONTRADO
                return interface.address;
            }
        }
    }
    // RETORNO DE FALLBACK CASO NENHUM IP VÁLIDO SEJA ENCONTRADO
    return 'IP-NÃO-ENCONTRADO';
}

// INICIALIZAÇÃO DO SERVIDOR
server.listen(port, () => {
    // LOG DE INICIALIZAÇÃO — CONFIRMA QUE SERVIDOR ESTÁ RODANDO
    console.log(`🚀 SERVIDOR RODANDO EM: HTTP://LOCALHOST:${port}`);
    console.log(`📁 PASTA DO PROJETO: ${__dirname}`);
    console.log(`🌐 ACESSO EM REDE LOCAL:`);
    console.log(`   • LOCAL:  HTTP://LOCALHOST:${port}`);
    console.log(`   • REDE:   HTTP://${getLocalIP()}:${port}`);
    console.log(`   • STATUS: SERVIDOR ATIVO E OUVINDO NA PORTA ${port}`);
});