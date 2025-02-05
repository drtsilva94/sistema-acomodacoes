from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import json

app = FastAPI()

# Carrega os dados fictícios de um arquivo JSON
def carregar_dados():
    with open("api/dados.json", "r") as file:
        return json.load(file)

dados_acomodacoes = carregar_dados()

# Modelo de dados para acomodação
class Acomodacao(BaseModel):
    nome: str
    cidade: str
    preco: float
    imagem: Optional[str] = None  # Campo opcional

@app.get("/acomodacoes")
def listar_acomodacoes():
    return {"acomodacoes": dados_acomodacoes}

@app.get("/acomodacoes/{id}")
def obter_acomodacao(id: int):
    for acomodacao in dados_acomodacoes:
        if acomodacao["id"] == id:
            return acomodacao
    raise HTTPException(status_code=404, detail="Acomodação não encontrada")

@app.get("/acomodacoes")
def filtrar_acomodacoes(cidade: str = None):
    if cidade:
        acom_filtradas = [a for a in dados_acomodacoes if a["cidade"].lower() == cidade.lower()]
        if not acom_filtradas:
            raise HTTPException(status_code=404, detail="Nenhuma acomodação encontrada para esta cidade")
        return {"acomodacoes": acom_filtradas}
    return {"acomodacoes": dados_acomodacoes}

@app.post("/acomodacoes")
def adicionar_acomodacao(nova_acomodacao: Acomodacao):
    # Carregar os dados existentes para garantir que esteja atualizado
    dados_acomodacoes = carregar_dados()

    # Gerar um novo ID automaticamente
    novo_id = max([a["id"] for a in dados_acomodacoes], default=0) + 1
    acomodacao_dict = nova_acomodacao.dict()
    acomodacao_dict["id"] = novo_id

    # Adicionar a nova acomodação à lista
    dados_acomodacoes.append(acomodacao_dict)

    # Salvar no arquivo JSON
    with open("api/dados.json", "w") as file:
        json.dump(dados_acomodacoes, file, indent=4)

    return {"message": "Acomodação adicionada com sucesso!", "acomodacao": acomodacao_dict}

@app.put("/acomodacoes/{id}")
def atualizar_acomodacao(id: int, acomodacao_atualizada: Acomodacao):
    # Carregar os dados existentes
    dados_acomodacoes = carregar_dados()

    for acomodacao in dados_acomodacoes:
        if acomodacao["id"] == id:
            acomodacao.update(acomodacao_atualizada.dict())

            # Salvar as alterações no arquivo JSON
            with open("api/dados.json", "w") as file:
                json.dump(dados_acomodacoes, file, indent=4)

            return {"message": "Acomodação atualizada com sucesso!", "acomodacao": acomodacao}

    raise HTTPException(status_code=404, detail="Acomodação não encontrada")

@app.delete("/acomodacoes/{id}")
def deletar_acomodacao(id: int):
    # Carregar os dados existentes
    dados_acomodacoes = carregar_dados()

    for acomodacao in dados_acomodacoes:
        if acomodacao["id"] == id:
            dados_acomodacoes.remove(acomodacao)

            # Salvar a nova lista no arquivo JSON
            with open("api/dados.json", "w") as file:
                json.dump(dados_acomodacoes, file, indent=4)

            return {"message": f"Acomodação com id {id} deletada com sucesso!"}

    raise HTTPException(status_code=404, detail="Acomodação não encontrada")
