from sqlalchemy import Column, Integer, String\nfrom database.database import Base\n\nclass User(Base):\n    __tablename__ = \
users\\n\n    id = Column(Integer, primary_key=True, index=True)\n    username = Column(String, unique=True, index=True)\n    email = Column(String, unique=True, index=True)\n    hashed_password = Column(String)
