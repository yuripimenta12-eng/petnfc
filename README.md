# PetNFC — Tag NFC & QR Code para Pets

> Identifique seu pet com uma tag inteligente. Quem encontrar escaneia e ve todas as informacoes do animal na hora — sem precisar de aplicativo.

---

## Como funciona

1. **Dono cadastra o pet** — acessa o painel, cria o perfil com nome, foto, raca, contatos e vacinas
2. **Gera a tag** — o sistema gera um QR Code unico e uma URL no formato `/pet/userId_petId`
3. **Tag fisica** — o QR Code e impresso/gravado em uma tag NFC ou plaquinha
4. **Resgate** — quem encontrar o pet escaneia a tag e ve a pagina publica com todos os contatos do dono

---

## Demo

**[petnfc.vercel.app](https://petnfc.vercel.app)**

---

## Estrutura do projeto

```
petnfc/
├── index.html          # Painel do dono (login + cadastro de pets)
├── pet.html            # Pagina publica do pet (quem escaneia a tag)
├── firebase.js         # Configuracao Firebase + funcoes de banco de dados
├── vercel.json         # Roteamento para Vercel
├── manifest.json       # PWA manifest (instalavel no celular)
├── 404.html            # Pagina de erro customizada
├── .gitignore
└── README.md
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| **Firebase Auth** | Login e cadastro de usuarios |
| **Cloud Firestore** | Banco de dados dos pets |
| **Vercel** | Hospedagem e deploy automatico |
| **EmailJS** | Notificacao ao dono quando a tag e escaneada |
| **QRCode.js** | Geracao de QR Code no navegador |

---

## Seguranca

A API Key do Firebase e publica por design — ela identifica o projeto, mas nao da acesso administrativo. A seguranca real e garantida pelas **Firebase Security Rules**:

```
match /users/{userId}/pets/{petId} {
  allow read: if true;
  allow write: if request.auth.uid == userId;
}
```

---

## Analytics de Scans

Cada vez que uma tag e escaneada, o sistema registra:
- Contador de scans (`scanCount`)
- Data/hora do ultimo scan (`lastScannedAt`)

Essas informacoes ficam visiveis no painel do dono em cada card de pet.

---

## PWA — Instalavel no celular

O app pode ser instalado como aplicativo no celular (Android e iOS) atraves do navegador, sem precisar de loja de apps.

---

## Licenca

MIT (c) yuripimenta12-eng
