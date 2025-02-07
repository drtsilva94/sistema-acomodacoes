from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, validator
from typing import Optional, List
import json

app = FastAPI()

# Configuração do middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens (para testes)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta a pasta de imagens
app.mount("/assets", StaticFiles(directory="frontend/assets"), name="assets")

# Carrega os dados fictícios de um arquivo JSON com encoding UTF-8
def carregar_dados():
    with open("api/dados.json", "r", encoding="utf-8") as file:
        return json.load(file)

dados_acomodacoes = carregar_dados()

# Modelo de dados para acomodação
class Acomodacao(BaseModel):
    nome: str
    cidade: str
    preco: float = Field(..., gt=0, description="O preço deve ser maior que 0.")
    imagem: Optional[str] = None  # Campo opcional
    
    # Validação customizada
    @validator("nome", "cidade")
    def campos_nao_vazios(cls, valor):
        if not valor.strip():
            raise ValueError("Os campos nome e cidade não podem estar vazios.")
        return valor

@app.get("/acomodacoes", response_model=List[Acomodacao])
def listar_acomodacoes(
    skip: int = Query(0, ge=0, description="Número de registros a pular."),
    limit: int = Query(10, gt=0, description="Número de registros a retornar."),
    ordenar_por: Optional[str] = Query(
        None, regex="^(nome|cidade|preco)$", description="Campo de ordenação (nome, cidade, preco)."
    )
):
    dados = sorted(dados_acomodacoes, key=lambda x: x.get(ordenar_por, "")) if ordenar_por else dados_acomodacoes
    return dados[skip: skip + limit]

@app.get("/acomodacoes/{id}", response_model=Acomodacao)
def obter_acomodacao(id: int):
    for acomodacao in dados_acomodacoes:
        if acomodacao["id"] == id:
            return acomodacao
    raise HTTPException(status_code=404, detail="Acomodação não encontrada")

@app.get("/acomodacoes")
def filtrar_acomodacoes(cidade: Optional[str] = None):
    if cidade:
        cidade = cidade.strip().lower()
        if not cidade:
            raise HTTPException(status_code=400, detail="O parâmetro 'cidade' não pode ser vazio ou conter apenas espaços.")
        
        acom_filtradas = [a for a in dados_acomodacoes if a["cidade"].lower() == cidade]
        if not acom_filtradas:
            return {
                "status": "failure",
                "message": f"Nenhuma acomodação encontrada na cidade '{cidade}'.",
                "acomodacoes": []
            }
        
        return {
            "status": "success",
            "message": f"{len(acom_filtradas)} acomodação(ões) encontrada(s) na cidade '{cidade}'.",
            "acomodacoes": acom_filtradas
        }
    
    return {
        "status": "success",
        "message": f"{len(dados_acomodacoes)} acomodação(ões) listada(s).",
        "acomodacoes": dados_acomodacoes
    }

@app.post("/acomodacoes", response_model=Acomodacao)
def adicionar_acomodacao(nova_acomodacao: Acomodacao):
    dados_acomodacoes = carregar_dados()
    novo_id = max([a["id"] for a in dados_acomodacoes], default=0) + 1
    acomodacao_dict = nova_acomodacao.dict()
    acomodacao_dict["id"] = novo_id

    dados_acomodacoes.append(acomodacao_dict)

    with open("api/dados.json", "w", encoding="utf-8") as file:
        json.dump(dados_acomodacoes, file, indent=4, ensure_ascii=False)

    return acomodacao_dict

@app.put("/acomodacoes/{id}", response_model=Acomodacao)
def atualizar_acomodacao(id: int, acomodacao_atualizada: Acomodacao):
    dados_acomodacoes = carregar_dados()

    for acomodacao in dados_acomodacoes:
        if acomodacao["id"] == id:
            acomodacao.update(acomodacao_atualizada.dict())

            with open("api/dados.json", "w", encoding="utf-8") as file:
                json.dump(dados_acomodacoes, file, indent=4, ensure_ascii=False)

            return acomodacao

    raise HTTPException(status_code=404, detail="Acomodação não encontrada")

@app.delete("/acomodacoes/{id}")
def deletar_acomodacao(id: int):
    dados_acomodacoes = carregar_dados()

    for acomodacao in dados_acomodacoes:
        if acomodacao["id"] == id:
            dados_acomodacoes.remove(acomodacao)

            with open("api/dados.json", "w", encoding="utf-8") as file:
                json.dump(dados_acomodacoes, file, indent=4, ensure_ascii=False)

            return {"message": f"Acomodação com id {id} deletada com sucesso!"}

    raise HTTPException(status_code=404, detail="Acomodação não encontrada")
