# Configurando o VS Code

Neste documento vamos aprender como configurar o VS Code para o desenvolvimento de nossa API e Typescript.

## Configurações iniciais

1. Criação do diretório do projeto:

    ```{bash}
    mkdir <nome do projeto>
    ```

2. Inicializando o git:

    ```{bash}
    git init
    ```

3. Inicializando um projeto `node` no repositório:

    ```{bash}
    npm init
    ```

4. Ignorando os arquivos de instalação:

    ```{bash}
    echo "node_modules" > .gitignore

5. _Comittando_ as configurações iniciais

    ```{bash}
    git add .
    git commit -m "chore: add npm"

## Definindo padrão de commits

Padronizaremos as mensagens de commit com o [Convetional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Utilizaremos bibliotecas que nos apoiem a seguir esse padrão.

1. Instalando _linter_:

    ```{bash}
    npm i -D git-commit-msg-linter
    ```

2. _Commitando_ instalação do _linter_:

    ```{bash}
    git add .
    git commit -m "chore: add git-commit-msg-linter"
    ```

## Instalando o TypeScript

1. Instalação:

    ```{bash}
    npm i -D typescript @types/node
    ```

2. _Commitando instalação:

    ```{bash}
    git add .
    git commit -m "chore: add typescript"
    ```

3. Configurando o Typescript:

    ```{bash}
    vim tsconfig.json
    # Verifique o conteúdo do arquivo tsconfig.json no repo
    ```

4. Adicionando pasta no `.gitignore`

    ```{bash}
    echo "dist" >> .gitignore"
    ```

5. _Commitando alterações:

    ```{bash}
    git add .
    git commit -m "chore: config typescript"

## Instalando verificadores de sintaxe

1. Instalando o _eslint_:

    ```{bash}
    npm i -D eslint
    ```

2. Configurando o `ESLint`

    ```{bash}
    node_modules/.bin/eslint --init
    ```

    Selecione as seguintes opções:

    _To check syntax, find probles, and enforce code style_

    _None of these_

    _None of these_

    _Yes_

    _browser_

    _guide_

    _standard_

    _JSON_

    _Yes_

3. Configurar `.eslintignore`:

    ```{bash}
    cp .gitignore .eslintignore
    ```

4. _Commitando alterações:

    ```{bash}
    git add .
    git commit -m "chore: add eslint
    ```

## Configurando ações pré-commit

Utilizaremos a biblioteca `husky`

1. Instalação:

    ```{bash}
    npm i -D husky
    npm i -D lint-staged
    ```

2. Configurando:

    ```{bash}
    vim .lintstagedrc.json
    vim .huskyrc.json
    ```

3. _Commitando_ alterações:

    ```{bash}
    git add .
    git commit -m "chore: add husky and lint-staged
    ```

4. Instalando o `jest`:

    ```{bash}
    npm i -D jest @types/jest ts-jest
    ```

5. Configurando o `jest`:

    ```{bash}
    vim jest.config.js
    echo "coverage" >> .gitignore
    ```

    obs.: É possível configurar o jest pelo comando `jest --init`

6. _Commitando_ alterações:

    ```{bash}
    git add .
    git commit -m "chore: add and configure jest
    ```

7. Configurando o mongo db com o jest:

    Em construção

8. Configurando o dotenv

    Em construção

9. Para rodar o mongodb em um  docker container:

    ```{bash}
    docker run -d --network mongo-net --name some-mongo -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
    ```

    Para esse comando utilize a seguinte string de conexão:
    `mongodb://mondoadmin:secret@localhost:27017`
