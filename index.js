
if (window.location.pathname.endsWith('index.html') && !localStorage.getItem('token')) {
    window.location.href = 'login.html';
}


function abrirTab(index) {
    const removerActive = el => el.classList.remove('active');
    document.querySelectorAll('.tab-content').forEach(removerActive);
    document.querySelectorAll('.tab-btn').forEach(removerActive);

    document.querySelectorAll('.tab-content')[index].classList.add('active');
    document.querySelectorAll('.tab-btn')[index].classList.add('active');
}


function limparCampos(ids) {
    ids.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.value = '';
    });
}


function formatarResposta(resultado) {

    const erro = resultado.erro || resultado.error;

    if (erro) {
        return `
            <div style="color: #721c24; padding: 15px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; font-weight: bold;">
                erro: ${erro}
            </div>
        `;
    }

    let itensHtml = '';
    for (const [key, value] of Object.entries(resultado)) {
        let label = key.charAt(0).toUpperCase() + key.slice(1);
        if (key.toLowerCase() === "imc") label = "IMC";

        itensHtml += `
            <li style="margin-bottom: 8px; font-size: 16px;">
                <strong style="color: #0b2e13;">${label}:</strong> ${value}
            </li>
        `;
    }

    return `
        <div style="padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
            <h3 style="margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #c3e6cb; padding-bottom: 5px;">Sucesso</h3>
            <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                ${itensHtml}
            </ul>
        </div>
    `;
}



async function calcularImc() {
    const campos = ['nome', 'idade', 'altura', 'peso'];
    const dados = Object.fromEntries(campos.map(id => [id, document.getElementById(id).value]));

    try {
        const response = await fetch("http://localhost:3000/imc", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(dados)
        });
        const resultado = await response.json();
        document.getElementById("resultadoImc").innerHTML = formatarResposta(resultado);

        if (!resultado.erro && !resultado.error) limparCampos(campos);
    } catch (error) {
        document.getElementById("resultadoImc").innerHTML = formatarResposta({ erro: "Ocorreu um erro inesperado. Tente novamente mais tarde." });
    }
}

async function calcularMedia() {
    const campos = ['nota1', 'nota2'];
    const dados = Object.fromEntries(campos.map(id => [id, document.getElementById(id).value]));

    try {
        const response = await fetch("http://localhost:3000/media", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(dados)
        });
        const resultado = await response.json();
        document.getElementById("resultadoMedia").innerHTML = formatarResposta(resultado);

        if (!resultado.erro && !resultado.error) limparCampos(campos);
    } catch (error) {
        document.getElementById("resultadoMedia").innerHTML = formatarResposta({ erro: "Ocorreu um erro inesperado. Tente novamente mais tarde." });
    }
}

async function fazerLogin() {
    const dados = {
        email: document.getElementById("email").value,
        senha: document.getElementById('senha').value
    };

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(dados)
        });
        const resultado = await response.json();

        if (resultado.token) {
            localStorage.setItem("token", resultado.token);
            window.location.href = 'index.html';
        } else {
            alert('Email ou Senha incorretos');
        }
    } catch (error) {
        document.getElementById("resultadoLogin").innerHTML = formatarResposta({ erro: "Ocorreu um erro inesperado. Tente novamente mais tarde." });
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = "login.html";
}



function buscarEndereco() {
    const CEP = document.getElementById('CEP').value;

    fetch(`https://viacep.com.br/ws/${CEP}/json/`)
        .then(response => {
            if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado!");
                return;
            }
            document.getElementById('rua').value = data.logradouro || '';
            document.getElementById('cidade').value = data.localidade || '';
            document.getElementById('estado').value = data.estado || data.uf || '';
            document.getElementById('numero').focus();
        })
        .catch(error => console.error('erro: ', error));
}

async function fazerCadastro() {
    const campos = ['nome', 'CPF', 'CEP', 'rua', 'cidade', 'estado', 'numero'];
    const dados = Object.fromEntries(campos.map(id => [id, document.getElementById(id).value]));

    try {
        const response = await fetch("http://localhost:3000/clientes", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(dados)
        });
        const resultado = await response.json();
        document.getElementById("resultadoEndereco").innerHTML = formatarResposta(resultado);

        if (!resultado.erro && !resultado.error) {
            limparCampos(campos);
        }
    } catch (error) {
        document.getElementById("resultadoEndereco").innerHTML = formatarResposta({ erro: "Ocorreu um erro inesperado. Tente novamente mais tarde." });
    }
}