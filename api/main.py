from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from sqlalchemy import create_engine, Column, Integer, String, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuração inicial do FastAPI
app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta a pasta de imagens
app.mount("/assets", StaticFiles(directory="frontend-react/public/assets"), name="assets")



# Configuração da conexão ao MySQL via SQLAlchemy
DATABASE_URL = "mysql+mysqlconnector://root:Kk2417@localhost/sistema_acomodacoes"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo da tabela 'acomodacoes' no banco de dados
class AcomodacaoDB(Base):
    __tablename__ = "acomodacoes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    cidade = Column(String(100), nullable=False)
    preco = Column(DECIMAL(16, 2), nullable=False)
    imagem = Column(String(255), nullable=True)

# Cria a tabela se ainda não existir
Base.metadata.create_all(bind=engine)

# Modelo de dados para as requisições e respostas
class Acomodacao(BaseModel):
    nome: str
    cidade: str
    preco: float = Field(..., gt=0, description="O preço deve ser maior que 0.")
    imagem: Optional[str] = None

    # Validação customizada
    @validator("nome", "cidade")
    def campos_nao_vazios(cls, valor):
        if not valor.strip():
            raise ValueError("Os campos nome e cidade não podem estar vazios.")
        return valor

# Rota para listar acomodações
@app.get("/acomodacoes", response_model=List[Acomodacao])
def listar_acomodacoes(
    skip: int = Query(0, ge=0, description="Número de registros a pular."),
    limit: int = Query(10, gt=0, description="Número de registros a retornar."),
    ordenar_por: Optional[str] = Query(
        None, regex="^(nome|cidade|preco)$", description="Campo de ordenação (nome, cidade, preco)."
    ),
    cidade: Optional[str] = None
):
    db = SessionLocal()
    try:
        query = db.query(AcomodacaoDB)

        # Filtro por cidade
        if cidade:
            query = query.filter(AcomodacaoDB.cidade.ilike(f"%{cidade}%"))

        # Ordenação opcional
        if ordenar_por:
            query = query.order_by(getattr(AcomodacaoDB, ordenar_por))

        # Paginação
        acomodacoes = query.offset(skip).limit(limit).all()

        return [
            Acomodacao(
                nome=a.nome,
                cidade=a.cidade,
                preco=float(a.preco),
                imagem=a.imagem
            )
            for a in acomodacoes
        ]
    finally:
        db.close()

# Rota para obter uma acomodação pelo ID
@app.get("/acomodacoes/{id}", response_model=Acomodacao)
def obter_acomodacao(id: int):
    db = SessionLocal()
    try:
        acomodacao = db.query(AcomodacaoDB).filter(AcomodacaoDB.id == id).first()
        if acomodacao:
            return Acomodacao(
                nome=acomodacao.nome,
                cidade=acomodacao.cidade,
                preco=float(acomodacao.preco),
                imagem=acomodacao.imagem
            )
        raise HTTPException(status_code=404, detail="Acomodação não encontrada")
    finally:
        db.close()

# Rota para adicionar uma nova acomodação
@app.post("/acomodacoes", response_model=Acomodacao)
def adicionar_acomodacao(nova_acomodacao: Acomodacao):
    db = SessionLocal()
    try:
        nova = AcomodacaoDB(
            nome=nova_acomodacao.nome,
            cidade=nova_acomodacao.cidade,
            preco=nova_acomodacao.preco,
            imagem=nova_acomodacao.imagem
        )
        db.add(nova)
        db.commit()
        db.refresh(nova)
        return nova_acomodacao
    finally:
        db.close()

# Rota para atualizar uma acomodação existente
@app.put("/acomodacoes/{id}", response_model=Acomodacao)
def atualizar_acomodacao(id: int, acomodacao_atualizada: Acomodacao):
    db = SessionLocal()
    try:
        acomodacao = db.query(AcomodacaoDB).filter(AcomodacaoDB.id == id).first()

        if acomodacao:
            acomodacao.nome = acomodacao_atualizada.nome
            acomodacao.cidade = acomodacao_atualizada.cidade
            acomodacao.preco = acomodacao_atualizada.preco
            acomodacao.imagem = acomodacao_atualizada.imagem

            db.commit()
            return acomodacao_atualizada

        raise HTTPException(status_code=404, detail="Acomodação não encontrada")
    finally:
        db.close()

# Rota para deletar uma acomodação pelo ID
@app.delete("/acomodacoes/{id}")
def deletar_acomodacao(id: int):
    db = SessionLocal()
    try:
        acomodacao = db.query(AcomodacaoDB).filter(AcomodacaoDB.id == id).first()

        if acomodacao:
            db.delete(acomodacao)
            db.commit()
            return {"message": f"Acomodação com id {id} deletada com sucesso!"}

        raise HTTPException(status_code=404, detail="Acomodação não encontrada")
    finally:
        db.close()
