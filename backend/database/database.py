from sqlalchemy import create_engine\nfrom sqlalchemy.ext.declarative import declarative_base\nfrom sqlalchemy.orm import sessionmaker\n\nSQLALCHEMY_DATABASE_URL = \
sqlite:///./database.db\\n\nengine = create_engine(\n    SQLALCHEMY_DATABASE_URL, connect_args={\check_same_thread\: False}\n)\nSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)\n\nBase = declarative_base()
