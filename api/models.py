from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

# Base para as tabelas do banco de dados
Base = declarative_base()

# Modelo da tabela de acomodações
class AcomodacaoDB(Base):
    __tablename__ = 'acomodacoes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    cidade = Column(String, nullable=False)
    preco = Column(Float, nullable=False)
    imagem = Column(String, nullable=True)

# Configurar o banco de dados SQLite
engine = create_engine('sqlite:///api/acomodacoes.db')

# Criar a tabela no banco de dados se não existir
Base.metadata.create_all(engine)
