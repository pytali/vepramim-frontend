"use client"

import { useEffect, useState } from "react"

export function WebChat() {
  const [chatKey, setChatKey] = useState<number>(0);

  useEffect(() => {
    // Função para recarregar completamente o componente
    const reloadWebChat = () => {
      setChatKey(prevKey => prevKey + 1);
    };

    // Expor a função para recarregar o WebChat globalmente
    if (typeof window !== 'undefined') {
      (window as { reloadWebChat?: () => void }).reloadWebChat = reloadWebChat;
    }

    // Remover quaisquer scripts ou elementos anteriores
    const cleanup = () => {
      const existingScripts = document.querySelectorAll('script[src*="opafranquia.brasildigital.net.br"]');
      existingScripts.forEach(script => script.remove());

      const existingButton = document.getElementById('custom-chat-button');
      if (existingButton) existingButton.remove();

      // Remover estilos adicionados
      const existingStyles = document.getElementById('opa-webchat-custom-styles');
      if (existingStyles) existingStyles.remove();
    };

    // Limpar elementos existentes
    cleanup();

    // Adicionar CSS global
    const chatStyles = document.createElement('style');
    chatStyles.id = 'opa-webchat-custom-styles';
    chatStyles.innerHTML = `
      /* Estilos globais para o chat */
      #opa-main-div, 
      #opa-iframe,
      .opa-iframe {
        background-color: white !important;
        color: #333 !important;
      }
      
      /* Estilização do ícone de chat circular laranja */
      .opa_ico {
        width: 60px !important;
        height: 60px !important;
        border-radius: 50% !important;
        background-color: #1a365d !important;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
        cursor: pointer !important;
        bottom: 25px !important;
        right: 25px !important;
        transition: all 0.2s ease !important;
      }
      
      .opa_ico:hover {
        transform: scale(1.05) !important;
      }
      
      .opa_ico svg {
        width: 50% !important;
        height: 50% !important;
        margin: 25% !important;
        fill: white !important;
      }
      
      /* Responsividade para o ícone em telas menores */
      @media screen and (max-width: 768px) {
        .opa_ico {
          width: 50px !important;
          height: 50px !important;
          bottom: 20px !important;
          right: 20px !important;
        }
      }
      
      @media screen and (max-width: 480px) {
        .opa_ico {
          width: 45px !important;
          height: 45px !important;
          bottom: 15px !important;
          right: 15px !important;
        }
      }
      
      /* Corrigir botões e controles no chat */
      #opa-iframe input[type="checkbox"],
      #opa-iframe input[type="radio"],
      #opa-main-div input[type="checkbox"],
      #opa-main-div input[type="radio"] {
        opacity: 1 !important;
        visibility: visible !important;
        appearance: auto !important;
        -webkit-appearance: checkbox !important;
        border: 1px solid #999 !important;
        display: inline-block !important;
        width: 15px !important;
        height: 15px !important;
        background-color: white !important;
        position: static !important;
      }
      
      /* Estilos específicos para o componente "Continuar sem efetuar login" */
      #opa-iframe a[role="button"],
      #opa-iframe .btn,
      #opa-iframe button,
      #opa-main-div a[role="button"],
      #opa-main-div .btn,
      #opa-main-div button {
        opacity: 1 !important;
        visibility: visible !important;
        display: inline-block !important;
        background-color: #1a365d !important;
        color: white !important;
        border: none !important;
        padding: 8px 16px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-weight: bold !important;
        text-align: center !important;
        text-decoration: none !important;
      }
      
      /* Forçar visibilidade para todas as âncoras e links */
      #opa-iframe a,
      #opa-main-div a {
        opacity: 1 !important;
        visibility: visible !important;
        color: #1a75ff !important;
        text-decoration: underline !important;
      }
      
      /* Corrigir elementos que possam estar invisíveis no modo escuro */
      #opa-iframe label,
      #opa-main-div label {
        color: #333 !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Correções para elementos com posicionamento absoluto */
      #opa-iframe [style*="position: absolute"],
      #opa-main-div [style*="position: absolute"] {
        color: #333 !important;
        background-color: white !important;
        border: 1px solid #ccc !important;
      }
      
      /* Corrigir caixas de texto e áreas de entrada */
      #opa-iframe input[type="text"],
      #opa-iframe input[type="password"],
      #opa-iframe textarea,
      #opa-main-div input[type="text"],
      #opa-main-div input[type="password"],
      #opa-main-div textarea {
        background-color: white !important;
        color: #333 !important;
        border: 1px solid #ccc !important;
      }
      
      /* Garantir que o texto seja visível */
      #opa-iframe .message-container,
      #opa-iframe .chat-content,
      #opa-main-div .message-container,
      #opa-main-div .chat-content,
      #opa-iframe *,
      #opa-main-div * {
        color: #333 !important;
      }
      
      /* Estilos para div-logins */
      .div-logins {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        background-color: white !important;
        border: 1px solid #ddd !important;
        border-radius: 8px !important;
        padding: 20px !important;
        margin: 20px auto !important;
        max-width: 400px !important;
        text-align: center !important;
      }
      
      .div-logins * {
        visibility: visible !important;
        opacity: 1 !important;
        color: #333 !important;
      }
      
      .div-logins input[type="checkbox"] {
        appearance: checkbox !important;
        -webkit-appearance: checkbox !important;
        width: 16px !important;
        height: 16px !important;
        margin: 5px !important;
        opacity: 1 !important;
        visibility: visible !important;
        position: static !important;
        display: inline-block !important;
      }
      
      .div-logins input[type="checkbox"] + label {
        display: inline-block !important;
        color: #333 !important;
        margin-left: 5px !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Estilos para o botão de chat personalizado */
      #custom-chat-button {
        position: fixed;
        bottom: 25px;
        right: 0;
        background-color: #1a365d;
        color: white;
        border: none;
        border-radius: 8px 0 0 8px;
        padding: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: system-ui, -apple-system, sans-serif;
        transition: all 0.3s ease-in-out;
        width: 40px;
        overflow: hidden;
      }
      
      #custom-chat-button:hover {
        background-color: #2c4a7c;
        width: 190px;
      }
      
      #custom-chat-button svg {
        min-width: 16px;
        min-height: 16px;
      }
      
      #custom-chat-button span {
        white-space: nowrap;
      }
      
      /* Responsividade para o botão de chat */
      @media screen and (max-width: 768px) {
        #custom-chat-button {
          padding: 6px;
          font-size: 13px;
          bottom: 30px;
          right: 0;
          width: 34px;
        }
        
        #custom-chat-button:hover {
          width: 170px;
        }
      }
      
      @media screen and (max-width: 480px) {
        #custom-chat-button {
          padding: 6px;
          font-size: 12px;
          bottom: 160px;
          right: 0;
          width: 32px;
        }
        
        #custom-chat-button:hover {
          width: 160px;
        }
        
        #custom-chat-button svg {
          min-width: 18px;
          min-height: 18px;
        }
      }
    `;
    document.head.appendChild(chatStyles);

    // Criar botão personalizado
    const button = document.createElement('button');
    button.id = 'custom-chat-button';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Fale com o suporte</span>
    `;

    // Aplicar estilos responsivos ao botão usando o CSS adicionado acima
    // Em vez de definir os estilos inline, agora eles vêm da folha de estilo

    // Verificar o tamanho da tela e ajustar o botão conforme necessário
    const adjustButtonBasedOnScreenSize = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth <= 480) {
        // Para telas muito pequenas, esconder o texto e mostrar apenas o ícone
        const textSpan = button.querySelector('span');
        if (textSpan) {
          // O texto agora é controlado pelo CSS com overflow: hidden
          // Não precisamos escondê-lo explicitamente
        }

        // Verificar se há elementos de navegação ou botões no rodapé que possam causar sobreposição
        const navigationButtons = document.querySelectorAll('button, a, [role="button"]');
        let hasNavigationButtonInBottomArea = false;

        navigationButtons.forEach(navButton => {
          if (navButton.id !== 'custom-chat-button') {
            const rect = navButton.getBoundingClientRect();
            const buttonText = navButton.textContent?.trim().toLowerCase() || '';

            // Verifica se o botão está na área inferior da tela E
            // se contém texto como "próximo", "avançar", "continuar", "salvar"
            if (rect.bottom > window.innerHeight - 70 &&
              (buttonText.includes('próximo') ||
                buttonText.includes('avançar') ||
                buttonText.includes('continuar') ||
                buttonText.includes('salvar') ||
                buttonText === 'próximo')) {
              hasNavigationButtonInBottomArea = true;

              // Se encontrou exatamente o botão "Próximo", aplicar um ajuste ainda maior
              if (buttonText === 'próximo') {
                console.log('Botão "Próximo" detectado, aplicando ajuste extra');
                button.style.bottom = '160px';
                return; // Sai do loop, já aplicou o ajuste necessário
              }
            }
          }
        });

        // Se encontrou botões de navegação na área inferior, posiciona o chat ainda mais acima
        if (hasNavigationButtonInBottomArea) {
          button.style.bottom = '140px';
        } else {
          // Verificar se há outros elementos como footer
          const footerElements = document.querySelectorAll('footer, [class*="footer"], [id*="footer"]');
          if (footerElements.length > 0) {
            button.style.bottom = '120px';
          } else {
            button.style.bottom = '100px';
          }
        }
      } else {
        // Para telas maiores, mostrar o texto
        const textSpan = button.querySelector('span');
        if (textSpan) {
          // O texto agora é controlado pelo hover no CSS
          // Não precisamos mostrá-lo explicitamente
        }

        // Restaurar posição original do botão baseada no tamanho da tela
        if (windowWidth <= 768 && windowWidth > 480) {
          // Média tela - usar valores definidos no CSS para telas médias
          button.style.bottom = '30px';
          button.style.right = '0';
          button.style.padding = '6px 10px';
          button.style.fontSize = '13px';
        } else {
          // Tela grande - usar valores definidos no CSS para telas grandes
          button.style.bottom = '25px';
          button.style.right = '0';
          button.style.padding = '8px 12px';
          button.style.fontSize = '14px';
        }

        // Garantir que outros estilos também sejam restaurados
        button.style.backgroundColor = '#1a365d';
      }
    };

    // Ajustar o botão quando a janela for redimensionada
    window.addEventListener('resize', adjustButtonBasedOnScreenSize);

    // Ajustar o botão inicialmente
    adjustButtonBasedOnScreenSize();

    // Adicionar botão ao documento
    document.body.appendChild(button);

    // Criar função para aplicar estilos ao chat
    const applyStyles = () => {
      // Função para estilizar o componente específico
      const styleLoginComponent = () => {
        try {
          // Adicionar estilos globais para o chat
          let globalStyle = document.getElementById('opa-chat-global-styles');
          if (!globalStyle) {
            globalStyle = document.createElement('style');
            globalStyle.id = 'opa-chat-global-styles';
            globalStyle.innerHTML = `
              #opa-main-div, .opa-main-div {
                background-color: white !important;
                color: #333 !important;
                border: 1px solid #ddd !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
              }
              
              #opa-main-div *, .opa-main-div * {
                visibility: visible !important;
                opacity: 1 !important;
              }
            `;
            document.head.appendChild(globalStyle);
          }

          // Buscar o elemento principal do chat
          const chatElements = document.querySelectorAll('[id^="opa-"]');
          for (let i = 0; i < chatElements.length; i++) {
            const chatEl = chatElements[i] as HTMLElement;
            // console.log("Elemento do chat encontrado:", chatEl.id);

            // Aplicar estilo ao elemento principal se necessário
            if (chatEl.id === 'opa_chat') {
              chatEl.style.backgroundColor = 'white';
              chatEl.style.color = '#333';
              chatEl.style.border = '1px solid #ddd';
              chatEl.style.borderRadius = '8px';
            }

            // Buscar dentro do elemento principal do chat
            applyStylesToElement(chatEl);
          }

          // Função para aplicar estilos recursivamente a um elemento e seus filhos
          function applyStylesToElement(element: HTMLElement) {
            try {
              // Procurar div-logins
              const loginDivs = element.querySelectorAll('.div-logins');
              if (loginDivs.length > 0) {
                // console.log("Classe div-logins encontrada!");
                loginDivs.forEach(div => {
                  const divEl = div as HTMLElement;
                  divEl.style.display = 'block';
                  divEl.style.visibility = 'visible';
                  divEl.style.opacity = '1';
                  divEl.style.backgroundColor = 'white';
                  divEl.style.border = '1px solid #ddd';
                  divEl.style.borderRadius = '8px';
                  divEl.style.padding = '20px';
                  divEl.style.margin = '20px auto';

                  // Estilizar todos os elementos dentro
                  const children = div.querySelectorAll('*');
                  children.forEach(child => {
                    const childEl = child as HTMLElement;
                    childEl.style.visibility = 'visible';
                    childEl.style.opacity = '1';

                    // Se for um checkbox
                    if (child.tagName === 'INPUT' && child.getAttribute('type') === 'checkbox') {
                      childEl.style.appearance = 'checkbox';
                      childEl.style.webkitAppearance = 'checkbox';
                      childEl.style.width = '16px';
                      childEl.style.height = '16px';
                      childEl.style.margin = '5px';
                      childEl.style.position = 'static';
                      childEl.style.display = 'inline-block';
                    }

                    // Se for um botão ou link
                    if (childEl.tagName === 'A' ||
                      childEl.tagName === 'BUTTON' ||
                      childEl.getAttribute('role') === 'button') {
                      childEl.style.display = 'block';
                      childEl.style.backgroundColor = '#4a6088';
                      childEl.style.color = 'white';
                      childEl.style.padding = '10px 15px';
                      childEl.style.borderRadius = '4px';
                      childEl.style.margin = '10px auto';
                      childEl.style.textAlign = 'center';
                      childEl.style.fontWeight = 'bold';
                      childEl.style.cursor = 'pointer';
                    }
                  });
                });
              }

              // Procurar elementos com o texto "Continuar sem efetuar login"
              const allElements = element.querySelectorAll('*');
              allElements.forEach(el => {
                if (el.textContent && el.textContent.includes('Continuar sem efetuar login')) {
                  // console.log('Elemento "Continuar sem efetuar login" encontrado!', el);
                  const htmlEl = el as HTMLElement;
                  htmlEl.style.display = 'block';
                  htmlEl.style.visibility = 'visible';
                  htmlEl.style.opacity = '1';
                  htmlEl.style.backgroundColor = '#4a6088';
                  htmlEl.style.color = 'white';
                  htmlEl.style.padding = '10px 15px';
                  htmlEl.style.borderRadius = '4px';
                  htmlEl.style.margin = '10px auto';
                  htmlEl.style.maxWidth = '250px';
                  htmlEl.style.textAlign = 'center';
                  htmlEl.style.fontWeight = 'bold';
                  htmlEl.style.cursor = 'pointer';
                  htmlEl.style.border = 'none';
                }
              });
            } catch (e) {
              console.log("Erro ao estilizar elemento:", e);
            }
          }
        } catch (e) {
          console.log("Erro ao estilizar componente:", e);
        }
      };

      // Aplicar estilos imediatamente e também configurar intervalos
      styleLoginComponent();

      // Continuar aplicando estilos a cada 500ms por 10 segundos
      let attempts = 0;
      const maxAttempts = 20; // 10 segundos
      const interval = setInterval(() => {
        styleLoginComponent();
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 500);

      // Configurar um observer para monitorar mudanças no DOM
      const observer = new MutationObserver(() => {
        styleLoginComponent();
      });

      // Observar todo o documento para mudanças
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });

      // Limpar o observer após 15 segundos
      setTimeout(() => {
        observer.disconnect();
      }, 15000);
    };

    // Adicionar evento de clique ao botão
    button.addEventListener('click', () => {
      // Remover o botão ao iniciar o chat
      button.remove();

      // Adicionar script para o chat
      const script = document.createElement('script');
      script.id = 'opa-webchat-script';
      script.textContent = `
        (function(i,s,g,r,j,y,b,p,t,z,a){a=s.createElement(r),a.async=1,a.src=g.concat(b,j,b,y,p,j),s.head.appendChild(a),a.onload = function(){opa.init(g,t,z)}})(window,document,'https://opafranquia.brasildigital.net.br','script','js','opa','/','.','68262ed0eb6453c1a020a77f','{"google_credential":"AIzaSyAnqc61Fz2pIlEzrRcd7aVZ3SRlpP3TFlY","google_oauth":"199136104604-5t3ap7a71fdcjru4lg91vcg2bi23oq15.apps.googleusercontent.com","facebook_appid":"","permitir_login_anonimo":""}');
      `;

      document.head.appendChild(script);
      // console.log("Script do chat adicionado à página");

      // Aplicar estilos após um pequeno atraso
      setTimeout(applyStyles, 1000);

      // Monitorar o DOM para verificar se o chat foi fechado
      // Esperar um tempo para garantir que o chat seja inicializado antes de monitorar o fechamento
      setTimeout(() => {
        // Verificar se o chat foi realmente aberto antes de iniciar o monitoramento
        const chatElement = document.querySelector('.opa_chat');
        const chatIcon = document.querySelector('.opa_ico');

        if (chatElement || chatIcon) {
          // console.log("Chat detectado, iniciando monitoramento de fechamento");
          startChatClosingMonitor(button as HTMLButtonElement);
        } else {
          // console.log("Chat não foi inicializado corretamente, tentando novamente...");
          // Tentar novamente após mais alguns segundos
          setTimeout(() => {
            const retryChat = document.querySelector('.opa_chat');
            const retryIcon = document.querySelector('.opa_ico');

            if (retryChat || retryIcon) {
              // console.log("Chat detectado na segunda tentativa");
              startChatClosingMonitor(button as HTMLButtonElement);
            } else {
              // console.log("Falha ao detectar o chat, restaurando botão original");
              // Se após 10 segundos o chat não aparecer, restaurar o botão
              document.body.appendChild(button);
            }
          }, 5000); // 5 segundos depois da primeira tentativa
        }
      }, 3000); // 3 segundos depois de adicionar o script
    });

    // Função para monitorar quando o chat é fechado
    const startChatClosingMonitor = (originalButton: HTMLButtonElement) => {
      // console.log("Iniciando monitoramento do estado do chat");

      // Criar uma cópia do botão original para restaurar depois
      const buttonClone = originalButton.cloneNode(true) as HTMLButtonElement;

      // Registrar se o chat estava ativo anteriormente
      const wasChatActive = true;

      // Configurar um observer para monitorar mudanças no DOM
      const observer = new MutationObserver(() => {
        // Verificar se o elemento do chat ainda está presente
        const chatElement = document.querySelector('.opa_chat');
        const chatIcon = document.querySelector('.opa_ico');

        // Se o chat estava ativo antes e agora não está mais
        if (wasChatActive && !chatElement) {
          // console.log("Chat fechado, restaurando botão original");

          // Remover o ícone do chat se ainda existir
          if (chatIcon) {
            chatIcon.remove();
          }

          // Remover quaisquer scripts ou elementos existentes do chat
          const existingScripts = document.querySelectorAll('script[src*="opafranquia.brasildigital.net.br"]');
          existingScripts.forEach(script => script.remove());

          // Limpar o objeto global opa
          if (typeof window !== 'undefined' && 'opa' in window) {
            try {
              // Tentar remover o objeto opa
              (window as { opa?: unknown }).opa = undefined;
            } catch (e) {
              console.log("Erro ao limpar objeto opa:", e);
            }
          }

          // Remover qualquer elemento restante do chat
          const chatElements = document.querySelectorAll('[id^="opa-"], .opa_chat, .opa_ico, .opa-iframe, #opa-iframe, #opa-main-div, .opa-main-div');
          chatElements.forEach(el => el.remove());

          // Recarregar o componente WebChat completamente
          if (typeof window !== 'undefined' && 'reloadWebChat' in window) {
            setTimeout(() => {
              // Atraso para garantir que todos os elementos do chat foram removidos
              (window as { reloadWebChat?: () => void }).reloadWebChat?.();
            }, 100);
          }

          // Restaurar o botão original
          document.body.appendChild(buttonClone);

          // Garantir que o botão restaurado tenha os estilos CSS corretos
          buttonClone.style.position = 'fixed';
          buttonClone.style.bottom = '25px';
          buttonClone.style.right = '0';
          buttonClone.style.backgroundColor = '#1a365d';
          buttonClone.style.color = 'white';
          buttonClone.style.border = 'none';
          buttonClone.style.borderRadius = '8px 0 0 8px';
          buttonClone.style.padding = '8px';
          buttonClone.style.fontSize = '14px';
          buttonClone.style.fontWeight = '500';
          buttonClone.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
          buttonClone.style.cursor = 'pointer';
          buttonClone.style.zIndex = '1000';
          buttonClone.style.display = 'flex';
          buttonClone.style.alignItems = 'center';
          buttonClone.style.gap = '6px';
          buttonClone.style.fontFamily = 'system-ui, -apple-system, sans-serif';
          buttonClone.style.transition = 'all 0.3s ease-in-out';
          buttonClone.style.width = '40px';
          buttonClone.style.overflow = 'hidden';

          // Aplicar efeito de hover diretamente no elemento
          buttonClone.onmouseover = () => {
            buttonClone.style.backgroundColor = '#2c4a7c';
            buttonClone.style.width = '190px';
          };

          buttonClone.onmouseout = () => {
            buttonClone.style.backgroundColor = '#1a365d';
            buttonClone.style.width = '40px';
          };

          // Reconfigurar o evento de clique no botão restaurado
          buttonClone.onclick = (event) => {
            event.preventDefault();
            // console.log("Botão restaurado clicado, iniciando chat");

            // Remover qualquer instância anterior
            const prevIcon = document.querySelector('.opa_ico');
            if (prevIcon) prevIcon.remove();

            // Remover o botão
            buttonClone.remove();

            // Remover completamente qualquer instância anterior do chat
            const existingScripts = document.querySelectorAll('script[src*="opafranquia.brasildigital.net.br"]');
            existingScripts.forEach(script => script.remove());

            // Limpar o objeto global opa se existir
            if (typeof window !== 'undefined' && 'opa' in window) {
              try {
                (window as { opa?: unknown }).opa = undefined;
              } catch (e) {
                console.log("Erro ao limpar objeto opa:", e);
              }
            }

            // Remover todos os elementos restantes do chat
            const chatElements = document.querySelectorAll('[id^="opa-"], .opa_chat, .opa_ico, .opa-iframe, #opa-iframe, #opa-main-div, .opa-main-div');
            chatElements.forEach(el => el.remove());

            // Readicionar o script do chat
            const scriptEl = document.createElement('script');
            scriptEl.id = 'opa-webchat-script';

            // Usar diretamente uma função para iniciar o chat para evitar problemas de timing
            scriptEl.textContent = `
                        (function(i,s,g,r,j,y,b,p,t,z,a){
                          a=s.createElement(r);
                          a.async=1;
                          a.src=g.concat(b,j,b,y,p,j);
                          s.head.appendChild(a);
                          a.onload = function(){
                            // console.log("Chat script loaded");
                            if (typeof opa !== 'undefined') {
                              // console.log("Inicializando opa.init");
                              opa.init(g,t,z);
                              
                              // Tentar abrir o chat explicitamente após inicialização
                              setTimeout(function() {
                                if (typeof opa.openChat === 'function') {
                                  // console.log("Abrindo chat explicitamente");
                                  opa.openChat();
                                }
                              }, 1000);
                            } else {
                              console.error("Objeto opa não foi definido");
                            }
                          };
                        })(window,document,'https://opafranquia.brasildigital.net.br','script','js','opa','/','.','68262ed0eb6453c1a020a77f','{"google_credential":"","google_oauth":"","facebook_appid":"","permitir_login_anonimo":"on"}');
                        `;
            document.head.appendChild(scriptEl);

            // Aplicar estilos após um pequeno atraso
            setTimeout(applyStyles, 1000);

            // Aguardar o chat aparecer antes de iniciar monitoramento
            const checkChatExistence = setInterval(() => {
              const chatEl = document.querySelector('.opa_chat');
              const iconEl = document.querySelector('.opa_ico');

              if (chatEl || iconEl) {
                // console.log("Chat detectado após clique no botão restaurado");
                clearInterval(checkChatExistence);
                startChatClosingMonitor(buttonClone);
              }
            }, 1000);

            // Limpar o intervalo após 15 segundos para evitar loops infinitos
            setTimeout(() => {
              clearInterval(checkChatExistence);

              // Se por algum motivo o chat não aparecer, forçar recarregamento
              if (!document.querySelector('.opa_chat') && !document.querySelector('.opa_ico')) {
                console.log("Forçando recarregamento do WebChat após timeout");
                if (typeof window !== 'undefined' && 'reloadWebChat' in window) {
                  (window as { reloadWebChat?: () => void }).reloadWebChat?.();
                }
              }
            }, 15000);
          };

          // Definir uma nova função para ajustar o botão restaurado
          const adjustRestoredButton = () => {
            const windowWidth = window.innerWidth;

            if (windowWidth <= 480) {
              // Para telas muito pequenas
              buttonClone.style.width = '32px';
              buttonClone.style.bottom = '160px';
              buttonClone.style.right = '0';
              buttonClone.style.padding = '6px';

              // Verificar se há botões de navegação
              const navigationButtons = document.querySelectorAll('button, a, [role="button"]');
              let hasNavigationButtonInBottomArea = false;

              navigationButtons.forEach(navButton => {
                if (navButton !== buttonClone) {
                  const rect = navButton.getBoundingClientRect();
                  const buttonText = navButton.textContent?.trim().toLowerCase() || '';

                  if (rect.bottom > window.innerHeight - 70 &&
                    (buttonText.includes('próximo') ||
                      buttonText.includes('avançar') ||
                      buttonText.includes('continuar') ||
                      buttonText.includes('salvar') ||
                      buttonText === 'próximo')) {
                    hasNavigationButtonInBottomArea = true;
                  }
                }
              });

              if (hasNavigationButtonInBottomArea) {
                buttonClone.style.bottom = '160px';
              }
            } else if (windowWidth <= 768) {
              // Tela média
              buttonClone.style.width = '34px';
              buttonClone.style.bottom = '30px';
              buttonClone.style.right = '0';
              buttonClone.style.padding = '6px';
            } else {
              // Tela grande
              buttonClone.style.width = '40px';
              buttonClone.style.bottom = '25px';
              buttonClone.style.right = '0';
              buttonClone.style.padding = '8px';
            }
          };

          // Aplicar os ajustes iniciais
          adjustRestoredButton();

          // Adicionar evento de resize para o botão restaurado
          window.addEventListener('resize', adjustRestoredButton);

          // Parar a observação atual
          observer.disconnect();
        }
      });

      // Configurar o observer para monitorar todo o body em busca de mudanças
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      // Configurar um timeout para parar o observer após 30 minutos se não houver ação
      setTimeout(() => {
        observer.disconnect();
        console.log("Monitoramento do chat encerrado após timeout");
      }, 30 * 60 * 1000);
    };

    // Limpeza ao desmontar o componente
    return () => {
      cleanup();
      window.removeEventListener('resize', adjustButtonBasedOnScreenSize);
    };
  }, [chatKey]);

  return null;
} 